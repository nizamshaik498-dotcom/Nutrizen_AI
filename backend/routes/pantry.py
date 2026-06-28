from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, ForeignKey, Table, func
from datetime import datetime

from ..database import Base, get_db
from ..models.user import User

router = APIRouter(prefix="/pantry", tags=["pantry"])


class PantryItem(Base):
    __tablename__ = "pantry_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    quantity = Column(Float, default=1.0)
    unit = Column(String(50), default="pieces")
    category = Column(String(100), nullable=True)
    added_at = Column(DateTime, server_default=func.now())


class AddPantryRequest(BaseModel):
    name: str
    quantity: float | None = 1.0
    unit: str | None = "pieces"
    category: str | None = None


@router.get("/{user_id}")
def get_pantry(user_id: int, db: Session = Depends(get_db)):
    items = db.query(PantryItem).filter(PantryItem.user_id == user_id).all()
    return [
        {
            "id": item.id,
            "name": item.name,
            "quantity": item.quantity,
            "unit": item.unit,
            "category": item.category,
            "added_at": item.added_at.isoformat() if item.added_at else None,
        }
        for item in items
    ]


@router.post("/{user_id}")
def add_to_pantry(user_id: int, req: AddPantryRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    item = PantryItem(
        user_id=user_id,
        name=req.name,
        quantity=req.quantity or 1.0,
        unit=req.unit or "pieces",
        category=req.category,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return {
        "id": item.id,
        "name": item.name,
        "quantity": item.quantity,
        "unit": item.unit,
        "category": item.category,
    }


@router.delete("/{user_id}/{item_id}")
def remove_from_pantry(user_id: int, item_id: int, db: Session = Depends(get_db)):
    item = db.query(PantryItem).filter(
        PantryItem.id == item_id, PantryItem.user_id == user_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Pantry item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item removed from pantry"}
