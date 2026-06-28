from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from database import Base

class Favorite(Base):
    __tablename__ = "favorites"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipe_name = Column(String(200), nullable=False)
    recipe_scan_id = Column(Integer, ForeignKey("scans.id"), nullable=True)
    recipe_data = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
