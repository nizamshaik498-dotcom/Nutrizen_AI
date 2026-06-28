from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from routes.auth import get_current_user
from models.user import User
from services.meal_planner_service import generate_meal_plan

router = APIRouter(prefix="/meal-planner", tags=["Meal Planner"])

class MealPlanRequest(BaseModel):
    allergies: str = ""
    dietary_preferences: str = ""
    medical_conditions: str = ""
    available_ingredients: list[str] = []

@router.post("/generate")
def create_meal_plan(req: MealPlanRequest, current_user: User = Depends(get_current_user)):
    preferences = {
        "allergies": req.allergies or current_user.allergies or "",
        "dietary_preferences": req.dietary_preferences or current_user.dietary_preferences or "",
        "medical_conditions": req.medical_conditions or current_user.medical_conditions or "",
    }
    plan = generate_meal_plan(preferences, req.available_ingredients)
    if "error" in plan:
        raise HTTPException(status_code=500, detail=plan["error"])
    return plan
