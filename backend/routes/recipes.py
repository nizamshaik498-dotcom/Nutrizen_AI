from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.scan import Scan
from ..models.recipe import Recipe

router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.get("/{scan_id}")
def get_recipes(scan_id: int, db: Session = Depends(get_db)):
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    recipes = db.query(Recipe).filter(Recipe.scan_id == scan_id).all()
    if recipes:
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

    if scan.full_result and "recipes" in scan.full_result:
        return scan.full_result["recipes"]

    raise HTTPException(status_code=404, detail="No recipes found")


@router.get("/cuisine/{cuisine_name}")
def get_recipes_by_cuisine(cuisine_name: str, db: Session = Depends(get_db)):
    recipes = db.query(Recipe).filter(Recipe.cuisine.ilike(f"%{cuisine_name}%")).all()
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
