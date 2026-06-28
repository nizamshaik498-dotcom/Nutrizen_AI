import os, json, hashlib, secrets
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

LOCK_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "site_lock.json")
ADMIN_SECRET = os.getenv("ADMIN_SECRET", "RecipeXAdmin2024!")

router = APIRouter(prefix="/site-lock", tags=["Site Lock"])

class VerifyRequest(BaseModel):
    password: str

class SetLockRequest(BaseModel):
    admin_secret: str
    password: str

class RemoveLockRequest(BaseModel):
    admin_secret: str

def _hash(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()

def _is_locked() -> bool:
    if not os.path.exists(LOCK_FILE):
        return False
    try:
        with open(LOCK_FILE) as f:
            data = json.load(f)
        return bool(data.get("password_hash"))
    except:
        return False

@router.get("/")
def lock_status():
    return {"locked": _is_locked()}

@router.post("/verify")
def verify_password(req: VerifyRequest):
    if not _is_locked():
        return {"valid": True}
    try:
        with open(LOCK_FILE) as f:
            data = json.load(f)
        return {"valid": data.get("password_hash") == _hash(req.password)}
    except:
        raise HTTPException(500, "Lock file error")

@router.post("/set")
def set_lock(req: SetLockRequest):
    if req.admin_secret != ADMIN_SECRET:
        raise HTTPException(403, "Invalid admin secret")
    if len(req.password) < 4:
        raise HTTPException(400, "Password must be at least 4 characters")
    try:
        with open(LOCK_FILE, "w") as f:
            json.dump({"password_hash": _hash(req.password)}, f)
        return {"message": "Site locked", "locked": True}
    except Exception as e:
        raise HTTPException(500, f"Failed to set lock: {e}")

@router.post("/remove")
def remove_lock(req: RemoveLockRequest):
    if req.admin_secret != ADMIN_SECRET:
        raise HTTPException(403, "Invalid admin secret")
    try:
        if os.path.exists(LOCK_FILE):
            os.remove(LOCK_FILE)
        return {"message": "Site unlocked", "locked": False}
    except Exception as e:
        raise HTTPException(500, f"Failed to remove lock: {e}")
