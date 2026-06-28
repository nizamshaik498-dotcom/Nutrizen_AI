from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routes.auth import router as auth_router
from routes.scan import router as scan_router
from routes.favorites import router as favorites_router
from routes.meal_planner import router as meal_planner_router
from routes.nutrition import router as nutrition_router
from routes.site_lock import router as site_lock_router
from routes.ai import router as ai_router

app = FastAPI(
    title="NutriZen AI — Food Management System",
    description="AI-powered smart kitchen assistant. Scan vegetables, get recipes, nutrition, allergy info, and smart substitutions.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(scan_router)
app.include_router(favorites_router)
app.include_router(meal_planner_router)
app.include_router(nutrition_router)
app.include_router(site_lock_router)
app.include_router(ai_router)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/")
def root():
    return {
        "app": "NutriZen AI",
        "status": "running",
        "version": "2.0.0",
    }


@app.get("/api")
@app.get("/api/health")
def api_root():
    return {
        "app": "NutriZen AI",
        "status": "running",
        "version": "2.0.0",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
