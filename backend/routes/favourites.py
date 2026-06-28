from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.recipe import Recipe
from ..models.user import User

router = APIRouter(prefix="/favourites", tags=["favourites"])


class AddFavouriteRequest(BaseModel):
    user_id: int
    recipe_id: int


@router.get("/{user_id}")
def get_favourites(user_id: int, db: Session = Depends(get_db)):
    recipes = db.query(Recipe).filter(
        Recipe.user_id == user_id, Recipe.is_favourite == True
    ).all()
    return [
        {
            "id": r.id,
            "name": r.name,
            "cuisine": r.cuisine,
            "difficulty": r.difficulty,
            "calories": r.calories,
            "protein_g": r.protein_g,
            "carbs_g": r.carbs_g,
            "fat_g": r.fat_g,
            "steps": r.steps,
            "ingredients": r.ingredients,
            "is_favourite": r.is_favourite,
            "chef_origin": r.chef_origin,
            "regional_context": r.regional_context,
        }
        for r in recipes
    ]


@router.post("")
def save_favourite(req: AddFavouriteRequest, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == req.recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    recipe.is_favourite = True
    db.commit()
    return {"message": "Recipe saved to favourites", "recipe_id": req.recipe_id}


@router.delete("/{user_id}/{recipe_id}")
def remove_favourite(user_id: int, recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(
        Recipe.id == recipe_id, Recipe.user_id == user_id
    ).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    recipe.is_favourite = False
    db.commit()
    return {"message": "Recipe removed from favourites"}
