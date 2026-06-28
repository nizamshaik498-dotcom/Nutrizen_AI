import sys, os, traceback
root = os.path.join(os.path.dirname(__file__), '..')
sys.path.insert(0, root)
sys.path.insert(0, os.path.join(root, 'backend'))

try:
    from backend.main import app
except Exception as e:
    from fastapi import FastAPI, Request
    app = FastAPI()
    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
    async def error_handler(request: Request, path: str = ""):
        return {"error": str(e), "traceback": traceback.format_exc(), "cwd": os.getcwd(), "sys_path": sys.path, "python": sys.version, "path": path}
