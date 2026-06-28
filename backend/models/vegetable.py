from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func
from ..database import Base


class Vegetable(Base):
    __tablename__ = "vegetables"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=False)
    name = Column(String(255), nullable=False)
    scientific_name = Column(String(255), nullable=True)
    estimated_weight_grams = Column(Float, nullable=True)
    freshness_status = Column(String(100), nullable=True)
    confidence_level = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
