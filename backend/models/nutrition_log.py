from sqlalchemy import Column, Integer, Float, String, Date, DateTime, ForeignKey, func
from database import Base

class NutritionLog(Base):
    __tablename__ = "nutrition_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    log_date = Column(Date, nullable=False)
    meal_type = Column(String(20), nullable=True)
    food_name = Column(String(200), nullable=True)
    calories_kcal = Column(Float, default=0)
    protein_g = Column(Float, default=0)
    carbohydrates_g = Column(Float, default=0)
    fat_g = Column(Float, default=0)
    fibre_g = Column(Float, default=0)
    created_at = Column(DateTime, server_default=func.now())
