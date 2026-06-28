from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
import os

from ..database import get_db
from ..models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("JWT_SECRET", "nutrizen-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    weight_kg: float | None = None
    height_cm: float | None = None
    age: int | None = None
    gender: str | None = None
    fitness_goal: str | None = None
    allergies: list | None = None
    medical_conditions: list | None = None
    preferred_cuisine: str | None = None
    language: str | None = "English"


class LoginRequest(BaseModel):
    email: str
    password: str


class ProfileUpdate(BaseModel):
    name: str | None = None
    weight_kg: float | None = None
    height_cm: float | None = None
    age: int | None = None
    gender: str | None = None
    fitness_goal: str | None = None
    allergies: list | None = None
    medical_conditions: list | None = None
    dislikes: list | None = None
    preferred_cuisine: str | None = None
    language: str | None = None
    region: str | None = None
    country: str | None = None
    current_season: str | None = None
    cooking_skill_level: str | None = None


def create_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def calculate_daily_target(user: User) -> dict:
    bmr = 10 * user.weight_kg + 6.25 * user.height_cm - 5 * user.age
    if user.gender and user.gender.lower() == "male":
        bmr += 5
    else:
        bmr -= 161

    activity_multiplier = 1.55
    tdee = bmr * activity_multiplier

    if user.fitness_goal == "lose_weight":
        calories = tdee - 500
    elif user.fitness_goal == "gain_weight":
        calories = tdee + 300
    else:
        calories = tdee

    return {
        "daily_calorie_target": round(calories),
        "protein_g": round(calories * 0.3 / 4),
        "carbs_g": round(calories * 0.4 / 4),
        "fat_g": round(calories * 0.3 / 9),
    }


@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    password_hash = pwd_context.hash(req.password)
    user = User(
        name=req.name,
        email=req.email,
        password_hash=password_hash,
        weight_kg=req.weight_kg,
        height_cm=req.height_cm,
        age=req.age,
        gender=req.gender,
        fitness_goal=req.fitness_goal,
        allergies=req.allergies,
        medical_conditions=req.medical_conditions,
        preferred_cuisine=req.preferred_cuisine,
        language=req.language,
    )

    if req.weight_kg and req.height_cm and req.age:
        targets = calculate_daily_target(user)
        user.daily_calorie_target = targets["daily_calorie_target"]
        user.protein_g = targets["protein_g"]
        user.carbs_g = targets["carbs_g"]
        user.fat_g = targets["fat_g"]

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token(user.id)
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "weight_kg": user.weight_kg,
            "height_cm": user.height_cm,
            "age": user.age,
            "gender": user.gender,
            "fitness_goal": user.fitness_goal,
            "daily_calorie_target": user.daily_calorie_target,
            "protein_g": user.protein_g,
            "carbs_g": user.carbs_g,
            "fat_g": user.fat_g,
            "allergies": user.allergies,
            "medical_conditions": user.medical_conditions,
            "preferred_cuisine": user.preferred_cuisine,
            "language": user.language,
        },
    }


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not pwd_context.verify(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token(user.id)
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "weight_kg": user.weight_kg,
            "height_cm": user.height_cm,
            "age": user.age,
            "gender": user.gender,
            "fitness_goal": user.fitness_goal,
            "daily_calorie_target": user.daily_calorie_target,
            "protein_g": user.protein_g,
            "carbs_g": user.carbs_g,
            "fat_g": user.fat_g,
            "allergies": user.allergies,
            "medical_conditions": user.medical_conditions,
            "dislikes": user.dislikes,
            "preferred_cuisine": user.preferred_cuisine,
            "language": user.language,
            "region": user.region,
            "country": user.country,
            "current_season": user.current_season,
            "cooking_skill_level": user.cooking_skill_level,
        },
    }


@router.get("/profile/{user_id}")
def get_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "weight_kg": user.weight_kg,
        "height_cm": user.height_cm,
        "age": user.age,
        "gender": user.gender,
        "fitness_goal": user.fitness_goal,
        "daily_calorie_target": user.daily_calorie_target,
        "protein_g": user.protein_g,
        "carbs_g": user.carbs_g,
        "fat_g": user.fat_g,
        "allergies": user.allergies,
        "medical_conditions": user.medical_conditions,
        "dislikes": user.dislikes,
        "preferred_cuisine": user.preferred_cuisine,
        "language": user.language,
        "region": user.region,
        "country": user.country,
        "current_season": user.current_season,
        "cooking_skill_level": user.cooking_skill_level,
    }


@router.put("/profile/{user_id}")
def update_profile(user_id: int, req: ProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = req.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    if user.weight_kg and user.height_cm and user.age:
        targets = calculate_daily_target(user)
        user.daily_calorie_target = targets["daily_calorie_target"]
        user.protein_g = targets["protein_g"]
        user.carbs_g = targets["carbs_g"]
        user.fat_g = targets["fat_g"]

    db.commit()
    db.refresh(user)
    return {"message": "Profile updated successfully", "user": get_profile(user_id, db)}
