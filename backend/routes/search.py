from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.recipe import Recipe
from ..models.scan import Scan

router = APIRouter(prefix="/search", tags=["search"])


@router.get("")
def search_recipes(
    q: str = Query("", description="Search query"),
    db: Session = Depends(get_db),
):
    query = f"%{q}%"
    db_recipes = db.query(Recipe).filter(
        Recipe.name.ilike(query)
    ).all()

    scan_recipes = []
    if not db_recipes:
        scans = db.query(Scan).filter(
            Scan.full_result.isnot(None)
        ).order_by(Scan.created_at.desc()).limit(50).all()

        for scan in scans:
            if scan.full_result and "recipes" in scan.full_result:
                recipes_data = scan.full_result["recipes"]
                for level in ["easy", "intermediate", "advanced"]:
                    if level in recipes_data and isinstance(recipes_data[level], dict):
                        name = recipes_data[level].get("name", "")
                        if q.lower() in name.lower():
                            scan_recipes.append({
                                "name": name,
                                "difficulty": level,
                                "cuisine": recipes_data.get("cuisine_selected", ""),
                                "scan_id": scan.id,
                                **recipes_data[level],
                            })

    db_results = [
        {
            "id": r.id,
            "name": r.name,
            "cuisine": r.cuisine,
            "difficulty": r.difficulty,
            "calories": r.calories,
            "protein_g": r.protein_g,
            "carbs_g": r.carbs_g,
            "fat_g": r.fat_g,
            "ingredients": r.ingredients,
            "is_favourite": r.is_favourite,
        }
        for r in db_recipes
    ]

    return {"recipes": db_results + scan_recipes, "total": len(db_results) + len(scan_recipes)}


@router.get("/ingredients")
def search_by_ingredients(
    items: str = Query("", description="Comma-separated ingredients"),
    db: Session = Depends(get_db),
):
    ingredient_list = [i.strip().lower() for i in items.split(",") if i.strip()]

    scans = db.query(Scan).filter(
        Scan.full_result.isnot(None)
    ).order_by(Scan.created_at.desc()).limit(50).all()

    matches = []
    for scan in scans:
        if scan.full_result and "recipes" in scan.full_result:
            recipes_data = scan.full_result["recipes"]
            for level in ["easy", "intermediate", "advanced"]:
                if level in recipes_data and isinstance(recipes_data[level], dict):
                    recipe = recipes_data[level]
                    additional = [
                        i.lower() for i in recipe.get("additional_ingredients_required", [])
                    ]
                    missing = [i for i in additional if i not in ingredient_list]
                    matches.append({
                        "name": recipe.get("name", ""),
                        "difficulty": level,
                        "cuisine": recipes_data.get("cuisine_selected", ""),
                        "scan_id": scan.id,
                        "calories_per_serving": recipe.get("calories_per_serving"),
                        "missing_ingredients": missing,
                        "total_missing": len(missing),
                        "has_all_ingredients": len(missing) == 0,
                    })

    return {
        "ingredients_provided": ingredient_list,
        "recipes": sorted(matches, key=lambda r: r["total_missing"]),
        "total": len(matches),
    }
