from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from database import Base


class Vegetable(Base):
    __tablename__ = "vegetables"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=False)
    common_name = Column(String(100), nullable=False)
    scientific_name = Column(String(100))
    estimated_quantity = Column(String(50))
    estimated_weight_grams = Column(Float)
    freshness_status = Column(String(50))
    confidence_level = Column(String(20))


class Nutrition(Base):
    __tablename__ = "nutrition"

    id = Column(Integer, primary_key=True, index=True)
    vegetable_id = Column(Integer, ForeignKey("vegetables.id"), nullable=False)
    calories_kcal = Column(Float)
    carbohydrates_g = Column(Float)
    dietary_fibre_g = Column(Float)
    protein_g = Column(Float)
    fat_g = Column(Float)
    vitamin_c_mg = Column(Float)
    iron_mg = Column(Float)
    potassium_mg = Column(Float)
    calcium_mg = Column(Float)
    sodium_mg = Column(Float)
    glycemic_index = Column(Float)
    health_score = Column(Integer)
    data_confidence = Column(String(50))


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=False)
    skill_level = Column(String(20), nullable=False)
    name = Column(String(200), nullable=False)
    total_time_minutes = Column(Integer)
    servings = Column(Integer)
    additional_ingredients = Column(Text)
    steps = Column(Text)
    plating_suggestion = Column(Text)


class Substitution(Base):
    __tablename__ = "substitutions"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=False)
    original_vegetable_id = Column(Integer, ForeignKey("vegetables.id"), nullable=True)
    original_vegetable_name = Column(String(100))
    risk_reason = Column(Text)
    affected_groups = Column(Text)
    substitute_vegetable = Column(String(100))
    why_safer = Column(Text)
    nutritional_equivalence = Column(String(20))
