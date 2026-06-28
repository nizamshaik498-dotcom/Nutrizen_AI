from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, func
from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    weight_kg = Column(Float, nullable=True)
    height_cm = Column(Float, nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(50), nullable=True)
    fitness_goal = Column(String(100), nullable=True)
    daily_calorie_target = Column(Integer, nullable=True)
    protein_g = Column(Float, nullable=True)
    carbs_g = Column(Float, nullable=True)
    fat_g = Column(Float, nullable=True)
    allergies = Column(JSON, nullable=True)
    medical_conditions = Column(JSON, nullable=True)
    dislikes = Column(JSON, nullable=True)
    preferred_cuisine = Column(String(100), nullable=True)
    language = Column(String(50), nullable=True, default="English")
    region = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    current_season = Column(String(50), nullable=True)
    cooking_skill_level = Column(String(50), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
