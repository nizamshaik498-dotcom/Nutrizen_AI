from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, Date
from pydantic import BaseModel
from datetime import date, timedelta
from database import get_db
from routes.auth import get_current_user
from models.user import User
from models.nutrition_log import NutritionLog

router = APIRouter(prefix="/nutrition", tags=["Nutrition"])

class LogEntry(BaseModel):
    log_date: str
    meal_type: str = ""
    food_name: str = ""
    calories_kcal: float = 0
    protein_g: float = 0
    carbohydrates_g: float = 0
    fat_g: float = 0
    fibre_g: float = 0

@router.post("/log")
def log_nutrition(entry: LogEntry, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    log = NutritionLog(
        user_id=current_user.id,
        log_date=date.fromisoformat(entry.log_date),
        meal_type=entry.meal_type,
        food_name=entry.food_name,
        calories_kcal=entry.calories_kcal,
        protein_g=entry.protein_g,
        carbohydrates_g=entry.carbohydrates_g,
        fat_g=entry.fat_g,
        fibre_g=entry.fibre_g,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return {"id": log.id, "message": "Logged"}

@router.get("/history")
def get_nutrition_history(
    days: int = Query(7, ge=1, le=90),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    since = date.today() - timedelta(days=days - 1)
    logs = (
        db.query(NutritionLog)
        .filter(NutritionLog.user_id == current_user.id, NutritionLog.log_date >= since)
        .order_by(NutritionLog.log_date.desc(), NutritionLog.id.desc())
        .all()
    )

    daily_totals = {}
    for log in logs:
        d = str(log.log_date)
        if d not in daily_totals:
            daily_totals[d] = {"date": d, "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fibre": 0, "meals": []}
        daily_totals[d]["calories"] += log.calories_kcal or 0
        daily_totals[d]["protein"] += log.protein_g or 0
        daily_totals[d]["carbs"] += log.carbohydrates_g or 0
        daily_totals[d]["fat"] += log.fat_g or 0
        daily_totals[d]["fibre"] += log.fibre_g or 0
        daily_totals[d]["meals"].append({
            "meal_type": log.meal_type,
            "food_name": log.food_name,
            "calories": log.calories_kcal,
        })

    return sorted(daily_totals.values(), key=lambda x: x["date"], reverse=True)
