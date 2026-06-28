from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from routes.auth import get_current_user
from models.user import User
from models.favorite import Favorite
import json

router = APIRouter(prefix="/favorites", tags=["Favorites"])

class FavoriteCreate(BaseModel):
    recipe_name: str
    recipe_data: str = ""

@router.get("/")
def list_favorites(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    favs = db.query(Favorite).filter(Favorite.user_id == current_user.id).order_by(Favorite.created_at.desc()).all()
    return [
        {
            "id": f.id,
            "recipe_name": f.recipe_name,
            "recipe_data": json.loads(f.recipe_data) if f.recipe_data else None,
            "created_at": str(f.created_at) if f.created_at else "",
        }
        for f in favs
    ]

@router.post("/")
def add_favorite(fav: FavoriteCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.recipe_name == fav.recipe_name,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already in favorites")
    entry = Favorite(
        user_id=current_user.id,
        recipe_name=fav.recipe_name,
        recipe_data=fav.recipe_data,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {"id": entry.id, "recipe_name": entry.recipe_name, "message": "Added to favorites"}

@router.delete("/{favorite_id}")
def remove_favorite(favorite_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    fav = db.query(Favorite).filter(Favorite.id == favorite_id, Favorite.user_id == current_user.id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(fav)
    db.commit()
    return {"message": "Removed from favorites"}
