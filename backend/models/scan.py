from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from database import Base


class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    image_path = Column(String(255))
    total_vegetables = Column(Integer, default=0)
    raw_response = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
