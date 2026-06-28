from sqlalchemy import Column, Integer, String, Float, JSON, Boolean, DateTime, ForeignKey, func
from ..database import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(255), nullable=False)
    cuisine = Column(String(100), nullable=True)
    difficulty = Column(String(50), nullable=True)
    calories = Column(Integer, nullable=True)
    protein_g = Column(Float, nullable=True)
    carbs_g = Column(Float, nullable=True)
    fat_g = Column(Float, nullable=True)
    steps = Column(JSON, nullable=True)
    ingredients = Column(JSON, nullable=True)
    is_favourite = Column(Boolean, default=False)
    chef_origin = Column(String(255), nullable=True)
    regional_context = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
