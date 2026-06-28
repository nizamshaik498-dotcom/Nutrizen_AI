from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    age = Column(Integer)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

    allergies = Column(Text, nullable=True)
    medical_conditions = Column(Text, nullable=True)
    dietary_preferences = Column(String(255), nullable=True)
