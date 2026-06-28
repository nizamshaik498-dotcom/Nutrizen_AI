import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routes import auth, scan, recipes, nutrition, pantry, favourites, search

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="NutriZen AI API",
    description="AI-powered Food Management System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://nutrivision.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(scan.router, prefix="/api")
app.include_router(recipes.router, prefix="/api")
app.include_router(nutrition.router, prefix="/api")
app.include_router(pantry.router, prefix="/api")
app.include_router(favourites.router, prefix="/api")
app.include_router(search.router, prefix="/api")


@app.on_event("startup")
def on_startup():
    try:
        init_db()
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.warning(f"Database initialization skipped: {e}")


@app.get("/")
def root():
    return {
        "app": "NutriZen AI",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/api/health")
def health():
    return {"status": "healthy"}
