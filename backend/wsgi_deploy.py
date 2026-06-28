import sys, json, os, base64, hashlib
from datetime import datetime, timedelta, date
sys.path.insert(0, '/home/FaizBasha05/RecipeX/backend')
# Set GROQ_API_KEY as environment variable on PythonAnywhere via Web tab -> Environment variables
# or uncomment the line below with your actual key:
# os.environ['GROQ_API_KEY'] = 'your-key-here'
from services.demo_data import DEMO_DATA
from services.groq_service import analyze_image, generate_recipe
from services.meal_planner_service import generate_meal_plan
from database import SessionLocal, init_db
from models.user import User
from models.favorite import Favorite
from models.nutrition_log import NutritionLog
from models.scan import Scan
LOCK_FILE = '/home/FaizBasha05/RecipeX/backend/site_lock.json'
ADMIN_SECRET = 'RecipeXAdmin2024!'
from passlib.context import CryptContext
from jose import jwt, JWTError
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
SECRET_KEY = os.getenv('JWT_SECRET', 'super-secret-key-change-this')
ALGORITHM = os.getenv('ALGORITHM', 'HS256')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '60'))
init_db()

def jr(s, d, st='200 OK'):
    r = json.dumps(d).encode()
    h = [('Content-type', 'application/json'), ('Access-Control-Allow-Origin', '*'), ('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS'), ('Access-Control-Allow-Headers', '*')]
    s(st, h); return [r]

def rb(e):
    try: return json.loads(e['wsgi.input'].read(int(e.get('CONTENT_LENGTH',0))).decode())
    except: return None

def get_user(a):
    if not a or not a.startswith('Bearer '): return None
    try:
        p = jwt.decode(a.split(' ')[1], SECRET_KEY, algorithms=[ALGORITHM])
        uid = int(p.get('sub'))
    except: return None
    db = SessionLocal()
    try: return db.query(User).filter(User.id == uid).first()
    finally: db.close()

def req_user(a):
    u = get_user(a)
    if not u: return None, {'error': 'Not authenticated'}
    return u, None

def reg(b):
    if not b or not b.get('username') or not b.get('password'): return {'error': 'Username and password required'}
    db = SessionLocal()
    try:
        if db.query(User).filter((User.username == b['username']) | (User.email == b.get('email',''))).first():
            return {'error': 'Username or email already exists'}
        u = User(username=b['username'], email=b.get('email',''), hashed_password=pwd_context.hash(b['password']), full_name=b.get('full_name',''), age=b.get('age',0))
        db.add(u); db.commit(); db.refresh(u)
        return {'message': 'User created', 'user_id': u.id}
    finally: db.close()

def log(b):
    if not b or not b.get('username') or not b.get('password'): return {'error': 'Username and password required'}
    db = SessionLocal()
    try:
        u = db.query(User).filter(User.username == b['username']).first()
        if not u or not pwd_context.verify(b['password'], u.hashed_password): return {'error': 'Invalid credentials'}
        t = jwt.encode({'sub': str(u.id), 'exp': datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)}, SECRET_KEY, algorithm=ALGORITHM)
        return {'access_token': t, 'token_type': 'bearer', 'user_id': u.id}
    finally: db.close()

def me(a):
    u = get_user(a)
    if not u: return {'error': 'Not authenticated'}, 401
    return {'id': u.id, 'username': u.username, 'email': u.email, 'full_name': u.full_name or '', 'age': u.age or 0, 'allergies': u.allergies or '', 'medical_conditions': u.medical_conditions or '', 'dietary_preferences': u.dietary_preferences or '', 'created_at': str(u.created_at) if u.created_at else ''}, 200

def get_scan(scan_id, a):
    u = get_user(a)
    if not u: return {'error': 'Not authenticated'}, 401
    db = SessionLocal()
    try:
        scan = db.query(Scan).filter(Scan.id == scan_id, Scan.user_id == u.id).first()
        if not scan: return {'error': 'Scan not found'}, 404
        raw = json.loads(scan.raw_response) if scan.raw_response else {}
        return {
            'id': scan.id,
            'created_at': str(scan.created_at) if scan.created_at else '',
            'total_vegetables': scan.total_vegetables,
            'full_response': raw,
        }, 200
    finally: db.close()

def scan_history(a):
    u = get_user(a)
    if not u: return {'error': 'Not authenticated'}, 401
    db = SessionLocal()
    try:
        scans = db.query(Scan).filter(Scan.user_id == u.id).order_by(Scan.created_at.desc()).limit(50).all()
        result = []
        for scan in scans:
            raw = json.loads(scan.raw_response) if scan.raw_response else {}
            preview = {}
            if raw.get('scan_summary', {}).get('items'):
                names = [i.get('common_name', '') for i in raw['scan_summary']['items']]
                preview['veggies'] = ', '.join(names[:3])
                if len(names) > 3: preview['veggies'] += f' +{len(names)-3} more'
            if raw.get('improvements', {}).get('meal_balance_score_out_of_10'):
                preview['score'] = raw['improvements']['meal_balance_score_out_of_10']
            result.append({'id': scan.id, 'created_at': str(scan.created_at) if scan.created_at else '', 'total_vegetables': scan.total_vegetables, 'preview': preview})
        return result, 200
    finally: db.close()

def meal_plan(b, a):
    u = get_user(a)
    if not u: return {'error': 'Not authenticated'}, 401
    try:
        preferences = {
            'allergies': (b.get('allergies') or u.allergies or '') if b else (u.allergies or ''),
            'dietary_preferences': (b.get('dietary_preferences') or u.dietary_preferences or '') if b else (u.dietary_preferences or ''),
            'medical_conditions': (b.get('medical_conditions') or u.medical_conditions or '') if b else (u.medical_conditions or ''),
        }
        ingredients = b.get('available_ingredients', []) if b else []
        plan = generate_meal_plan(preferences, ingredients)
        if 'error' in plan: return plan, 500
        return plan, 200
    except Exception as e:
        return {'error': str(e)}, 500

def list_favs(a):
    u = get_user(a)
    if not u: return {'error': 'Not authenticated'}, 401
    db = SessionLocal()
    try:
        favs = db.query(Favorite).filter(Favorite.user_id == u.id).order_by(Favorite.created_at.desc()).all()
        return [{'id': f.id, 'recipe_name': f.recipe_name, 'recipe_data': json.loads(f.recipe_data) if f.recipe_data else None, 'created_at': str(f.created_at) if f.created_at else ''} for f in favs], 200
    finally: db.close()

def add_fav(b, a):
    u = get_user(a)
    if not u: return {'error': 'Not authenticated'}, 401
    if not b or not b.get('recipe_name'): return {'error': 'recipe_name required'}, 400
    db = SessionLocal()
    try:
        existing = db.query(Favorite).filter(Favorite.user_id == u.id, Favorite.recipe_name == b['recipe_name']).first()
        if existing: return {'error': 'Already in favorites'}, 400
        rd = b.get('recipe_data', '')
        if isinstance(rd, dict): rd = json.dumps(rd)
        f = Favorite(user_id=u.id, recipe_name=b['recipe_name'], recipe_data=rd)
        db.add(f); db.commit(); db.refresh(f)
        return {'id': f.id, 'recipe_name': f.recipe_name, 'message': 'Added to favorites'}, 200
    finally: db.close()

def del_fav(id, a):
    u = get_user(a)
    if not u: return {'error': 'Not authenticated'}, 401
    db = SessionLocal()
    try:
        f = db.query(Favorite).filter(Favorite.id == id, Favorite.user_id == u.id).first()
        if not f: return {'error': 'Favorite not found'}, 404
        db.delete(f); db.commit()
        return {'message': 'Removed from favorites'}, 200
    finally: db.close()

def nut_log(b, a):
    u = get_user(a)
    if not u: return {'error': 'Not authenticated'}, 401
    if not b or not b.get('log_date'): return {'error': 'log_date required'}, 400
    db = SessionLocal()
    try:
        nl = NutritionLog(user_id=u.id, log_date=date.fromisoformat(b['log_date']), meal_type=b.get('meal_type',''), food_name=b.get('food_name',''), calories_kcal=b.get('calories_kcal',0), protein_g=b.get('protein_g',0), carbohydrates_g=b.get('carbohydrates_g',0), fat_g=b.get('fat_g',0), fibre_g=b.get('fibre_g',0))
        db.add(nl); db.commit(); db.refresh(nl)
        return {'id': nl.id, 'message': 'Logged'}, 200
    finally: db.close()

def nut_history(a, qs):
    u = get_user(a)
    if not u: return {'error': 'Not authenticated'}, 401
    days = 7
    if qs:
        for part in qs.split('&'):
            kv = part.split('=')
            if len(kv) == 2 and kv[0] == 'days':
                try: days = min(max(int(kv[1]), 1), 90)
                except: pass
    since = date.today() - timedelta(days=days-1)
    db = SessionLocal()
    try:
        logs = db.query(NutritionLog).filter(NutritionLog.user_id == u.id, NutritionLog.log_date >= since).order_by(NutritionLog.log_date.desc(), NutritionLog.id.desc()).all()
        daily = {}
        for log in logs:
            d = str(log.log_date)
            if d not in daily: daily[d] = {'date': d, 'calories': 0, 'protein': 0, 'carbs': 0, 'fat': 0, 'fibre': 0, 'meals': []}
            daily[d]['calories'] += log.calories_kcal or 0
            daily[d]['protein'] += log.protein_g or 0
            daily[d]['carbs'] += log.carbohydrates_g or 0
            daily[d]['fat'] += log.fat_g or 0
            daily[d]['fibre'] += log.fibre_g or 0
            daily[d]['meals'].append({'meal_type': log.meal_type, 'food_name': log.food_name, 'calories': log.calories_kcal})
        return sorted(daily.values(), key=lambda x: x['date'], reverse=True), 200
    finally: db.close()

def parse_path(p):
    parts = p.strip('/').split('/')
    return parts

def _hash_pw(pw):
    return hashlib.sha256(pw.encode()).hexdigest()

def _is_locked():
    if not os.path.exists(LOCK_FILE):
        return False
    try:
        with open(LOCK_FILE) as f:
            data = json.load(f)
        return bool(data.get('password_hash'))
    except:
        return False

def site_lock_status():
    return {'locked': _is_locked()}

def site_lock_verify(b):
    if not _is_locked():
        return {'valid': True}
    try:
        with open(LOCK_FILE) as f:
            data = json.load(f)
        return {'valid': data.get('password_hash') == _hash_pw(b.get('password',''))}
    except:
        return {'valid': False}

def site_lock_set(b):
    if not b or b.get('admin_secret') != ADMIN_SECRET:
        return {'error': 'Invalid admin secret'}, 403
    pw = b.get('password','')
    if len(pw) < 4:
        return {'error': 'Password must be at least 4 characters'}, 400
    try:
        with open(LOCK_FILE, 'w') as f:
            json.dump({'password_hash': _hash_pw(pw)}, f)
        return {'message': 'Site locked', 'locked': True}, 200
    except Exception as e:
        return {'error': str(e)}, 500

def site_lock_remove(b):
    if not b or b.get('admin_secret') != ADMIN_SECRET:
        return {'error': 'Invalid admin secret'}, 403
    try:
        if os.path.exists(LOCK_FILE):
            os.remove(LOCK_FILE)
        return {'message': 'Site unlocked', 'locked': False}, 200
    except Exception as e:
        return {'error': str(e)}, 500

def application(environ, start_response):
    p = environ.get('PATH_INFO','').rstrip('/')
    m = environ.get('REQUEST_METHOD','GET')
    qs = environ.get('QUERY_STRING','')
    a = environ.get('HTTP_AUTHORIZATION','')
    if m == 'OPTIONS':
        start_response('200 OK', [('Access-Control-Allow-Origin','*'),('Access-Control-Allow-Methods','GET, POST, DELETE, OPTIONS'),('Access-Control-Allow-Headers','*')])
        return [b'']
    if p == '/auth/register' and m == 'POST': return jr(start_response, reg(rb(environ)))
    if p == '/auth/login' and m == 'POST': return jr(start_response, log(rb(environ)))
    if p == '/auth/me' and m == 'GET':
        d, s = me(a)
        return jr(start_response, d, '401 Unauthorized' if s == 401 else '200 OK')
    if p == '/scan' and m == 'POST':
        u = get_user(a)
        if not u: return jr(start_response, {'error': 'Not authenticated'}, '401 Unauthorized')
        try:
            b = rb(environ)
            b64 = b.get('image','') if b else ''
            if b64:
                result = analyze_image(base64.b64decode(b64))
                result.setdefault("recipes", {})
                for level in ["easy", "intermediate", "advanced"]:
                    result["recipes"].setdefault(level, {})
                result.setdefault("scan_summary", {})
                result["scan_summary"].setdefault("items", [])
                result.setdefault("nutrition", [])
                result.setdefault("allergy_report", [])
                result.setdefault("substitutions", [])
                result.setdefault("health_benefits", [])
                result.setdefault("storage_tips", [])
                result.setdefault("cooking_tips", [])
                result.setdefault("cost_estimation", [])
                result.setdefault("improvements", {})
                d = {'scan_id': 1, 'result': result}
            else: d = {'error': 'No image'}
        except Exception as e: d = {'error': str(e)}
        return jr(start_response, d)
    if p == '/scan/history' and m == 'GET':
        d, s = scan_history(a)
        return jr(start_response, d, '401 Unauthorized' if s == 401 else '200 OK')
    if p == '/scan/demo' and m == 'GET':
        return jr(start_response, {'scan_id': 1, 'result': DEMO_DATA})
    parts = parse_path(p)
    if len(parts) == 2 and parts[0] == 'scan' and m == 'GET':
        try:
            d, s = get_scan(int(parts[1]), a)
            st = {200: '200 OK', 401: '401 Unauthorized', 404: '404 Not Found'}.get(s, '200 OK')
            return jr(start_response, d, st)
        except: return jr(start_response, {'error': 'Invalid ID'}, '400 Bad Request')
    if p == '/meal-planner/generate' and m == 'POST':
        d, s = meal_plan(rb(environ), a)
        st = {200: '200 OK', 400: '400 Bad Request', 401: '401 Unauthorized', 500: '500 Internal Server Error'}.get(s, '200 OK')
        return jr(start_response, d, st)
    if p == '/ai/command' and m == 'POST':
        try:
            b = rb(environ)
            prompt = (b or {}).get('prompt', '')
            if not prompt: return jr(start_response, {'error': 'prompt required'}, '400 Bad Request')
            recipe = generate_recipe(prompt)
            return jr(start_response, {'recipe': recipe})
        except Exception as e: return jr(start_response, {'error': str(e)}, '500 Internal Server Error')
    if p == '/favorites' and m == 'GET':
        d, s = list_favs(a)
        return jr(start_response, d, '401 Unauthorized' if s == 401 else '200 OK')
    if p == '/favorites' and m == 'POST':
        d, s = add_fav(rb(environ), a)
        st = {200: '200 OK', 400: '400 Bad Request', 401: '401 Unauthorized'}.get(s, '200 OK')
        return jr(start_response, d, st)
    if len(parts) == 2 and parts[0] == 'favorites' and m == 'DELETE':
        try:
            d, s = del_fav(int(parts[1]), a)
            st = {200: '200 OK', 401: '401 Unauthorized', 404: '404 Not Found'}.get(s, '200 OK')
            return jr(start_response, d, st)
        except: return jr(start_response, {'error': 'Invalid ID'}, '400 Bad Request')
    if p == '/nutrition/log' and m == 'POST':
        d, s = nut_log(rb(environ), a)
        st = {200: '200 OK', 400: '400 Bad Request', 401: '401 Unauthorized'}.get(s, '200 OK')
        return jr(start_response, d, st)
    if p == '/nutrition/history' and m == 'GET':
        d, s = nut_history(a, qs)
        return jr(start_response, d, '401 Unauthorized' if s == 401 else '200 OK')
    if p == '/site-lock' and m == 'GET':
        return jr(start_response, site_lock_status())
    if p == '/site-lock/verify' and m == 'POST':
        d = site_lock_verify(rb(environ))
        return jr(start_response, d)
    if p == '/site-lock/set' and m == 'POST':
        d, s = site_lock_set(rb(environ))
        st = {200: '200 OK', 400: '400 Bad Request', 403: '403 Forbidden', 500: '500 Internal Server Error'}.get(s, '200 OK')
        return jr(start_response, d, st)
    if p == '/site-lock/remove' and m == 'POST':
        d, s = site_lock_remove(rb(environ))
        st = {200: '200 OK', 403: '403 Forbidden', 500: '500 Internal Server Error'}.get(s, '200 OK')
        return jr(start_response, d, st)
    routes = {'/health': lambda: {'status': 'healthy'}, '': lambda: {'app': 'NutriZen AI', 'status': 'running', 'version': '2.0.0'}, '/scan/demo': lambda: {'scan_id': 1, 'result': DEMO_DATA}}
    h = routes.get(p)
    if not h: return jr(start_response, {'error': 'Not found'}, '404 Not Found')
    return jr(start_response, h())
