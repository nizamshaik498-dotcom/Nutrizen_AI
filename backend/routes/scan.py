from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models.scan import Scan
from models.vegetable import Vegetable, Nutrition, Recipe, Substitution
from services.groq_service import analyze_image
from services.demo_data import DEMO_DATA
from routes.auth import get_current_user
from models.user import User
import json

router = APIRouter(prefix="/scan", tags=["Scan"])


@router.get("/demo")
def demo_scan(db: Session = Depends(get_db)):
    result = DEMO_DATA

    scan = Scan(
        image_path="demo_mode.jpg",
        total_vegetables=result["scan_summary"]["total_vegetables_detected"],
        raw_response=json.dumps(result),
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    for item in result["scan_summary"]["items"]:
        veg = Vegetable(
            scan_id=scan.id,
            common_name=item["common_name"],
            scientific_name=item.get("scientific_name", ""),
            estimated_quantity=item.get("estimated_quantity", ""),
            estimated_weight_grams=item.get("estimated_weight_grams", 0),
            freshness_status=item.get("freshness_status", ""),
            confidence_level=item.get("confidence_level", ""),
        )
        db.add(veg)
        db.commit()
        db.refresh(veg)

        nutrition_data = next(
            (n for n in result.get("nutrition", []) if n.get("vegetable_id") == item["id"]),
            None
        )
        if nutrition_data:
            per = nutrition_data.get("per_100g", {})
            nut = Nutrition(
                vegetable_id=veg.id,
                calories_kcal=per.get("calories_kcal"),
                carbohydrates_g=per.get("carbohydrates_g"),
                dietary_fibre_g=per.get("dietary_fibre_g"),
                protein_g=per.get("protein_g"),
                fat_g=per.get("fat_g"),
                vitamin_c_mg=per.get("vitamin_c_mg"),
                iron_mg=per.get("iron_mg"),
                potassium_mg=per.get("potassium_mg"),
                calcium_mg=per.get("calcium_mg"),
                sodium_mg=per.get("sodium_mg"),
                glycemic_index=nutrition_data.get("glycemic_index"),
                health_score=nutrition_data.get("health_score_out_of_10"),
                data_confidence=nutrition_data.get("data_confidence", ""),
            )
            db.add(nut)

    for level in ["easy", "intermediate", "advanced"]:
        recipe_data = result["recipes"].get(level)
        if recipe_data:
            rec = Recipe(
                scan_id=scan.id,
                skill_level=level,
                name=recipe_data["name"],
                total_time_minutes=recipe_data.get("total_time_minutes"),
                servings=recipe_data.get("servings"),
                additional_ingredients=json.dumps(recipe_data.get("additional_ingredients_required", [])),
                steps=json.dumps(recipe_data.get("steps", [])),
                plating_suggestion=recipe_data.get("plating_suggestion", ""),
            )
            db.add(rec)

    for sub in result.get("substitutions", []):
        sub_entry = Substitution(
            scan_id=scan.id,
            original_vegetable_name=sub["original_vegetable_name"],
            risk_reason=sub["risk_reason"],
            affected_groups=json.dumps(sub.get("affected_groups", [])),
            substitute_vegetable=sub["substitute_vegetable"],
            why_safer=sub["why_safer"],
            nutritional_equivalence=sub.get("nutritional_equivalence", ""),
        )
        db.add(sub_entry)

    db.commit()

    return {"scan_id": scan.id, "result": result}


@router.post("/")
async def scan_vegetables(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()

    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty file")

    result = analyze_image(image_bytes)

    result.setdefault("recipes", {})
    for level in ["easy", "intermediate", "advanced"]:
        result["recipes"].setdefault(level, {})
    result.setdefault("scan_summary", {})
    result["scan_summary"].setdefault("items", [])
    result.setdefault("nutrition", [])
    result.setdefault("allergy_report", [])
    result.setdefault("substitutions", [])
    result.setdefault("health_benefits", [])
    result.setdefault("storage_tips", [])
    result.setdefault("cooking_tips", [])
    result.setdefault("cost_estimation", [])
    result.setdefault("improvements", {})

    scan = Scan(
        user_id=current_user.id if current_user else None,
        image_path=file.filename or "capture.jpg",
        total_vegetables=result.get("scan_summary", {}).get("total_vegetables_detected", 0),
        raw_response=json.dumps(result),
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    for item in result.get("scan_summary", {}).get("items", []):
        veg = Vegetable(
            scan_id=scan.id,
            common_name=item.get("common_name", "Unknown"),
            scientific_name=item.get("scientific_name", ""),
            estimated_quantity=item.get("estimated_quantity", ""),
            estimated_weight_grams=item.get("estimated_weight_grams", 0),
            freshness_status=item.get("freshness_status", ""),
            confidence_level=item.get("confidence_level", ""),
        )
        db.add(veg)
        db.commit()
        db.refresh(veg)

        nutrition_data = next(
            (n for n in result.get("nutrition", []) if n.get("vegetable_id") == item.get("id")),
            None
        )
        if nutrition_data:
            per = nutrition_data.get("per_100g", {})
            nut = Nutrition(
                vegetable_id=veg.id,
                calories_kcal=per.get("calories_kcal"),
                carbohydrates_g=per.get("carbohydrates_g"),
                dietary_fibre_g=per.get("dietary_fibre_g"),
                protein_g=per.get("protein_g"),
                fat_g=per.get("fat_g"),
                vitamin_c_mg=per.get("vitamin_c_mg"),
                iron_mg=per.get("iron_mg"),
                potassium_mg=per.get("potassium_mg"),
                calcium_mg=per.get("calcium_mg"),
                sodium_mg=per.get("sodium_mg"),
                glycemic_index=nutrition_data.get("glycemic_index"),
                health_score=nutrition_data.get("health_score_out_of_10"),
                data_confidence=nutrition_data.get("data_confidence", ""),
            )
            db.add(nut)

    for level in ["easy", "intermediate", "advanced"]:
        recipe_data = result.get("recipes", {}).get(level)
        if recipe_data:
            rec = Recipe(
                scan_id=scan.id,
                skill_level=level,
                name=recipe_data.get("name", ""),
                total_time_minutes=recipe_data.get("total_time_minutes"),
                servings=recipe_data.get("servings"),
                additional_ingredients=json.dumps(
                    recipe_data.get("additional_ingredients_required", [])
                ),
                steps=json.dumps(recipe_data.get("steps", [])),
                plating_suggestion=recipe_data.get("plating_suggestion", ""),
            )
            db.add(rec)

    for sub in result.get("substitutions", []):
        sub_entry = Substitution(
            scan_id=scan.id,
            original_vegetable_name=sub.get("original_vegetable_name", ""),
            risk_reason=sub.get("risk_reason", ""),
            affected_groups=json.dumps(sub.get("affected_groups", [])),
            substitute_vegetable=sub.get("substitute_vegetable", ""),
            why_safer=sub.get("why_safer", ""),
            nutritional_equivalence=sub.get("nutritional_equivalence", ""),
        )
        db.add(sub_entry)

    db.commit()

    return {
        "scan_id": scan.id,
        "result": result
    }


@router.get("/history")
def get_scan_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    scans = db.query(Scan).filter(Scan.user_id == current_user.id).order_by(Scan.created_at.desc()).limit(50).all()
    result = []
    for scan in scans:
        veg_count = db.query(Vegetable).filter(Vegetable.scan_id == scan.id).count()
        raw = json.loads(scan.raw_response) if scan.raw_response else {}
        preview = {}
        if raw.get("scan_summary", {}).get("items"):
            names = [i.get("common_name", "") for i in raw["scan_summary"]["items"]]
            preview["veggies"] = ", ".join(names[:3])
            if len(names) > 3:
                preview["veggies"] += f" +{len(names)-3} more"
        if raw.get("improvements", {}).get("meal_balance_score_out_of_10"):
            preview["score"] = raw["improvements"]["meal_balance_score_out_of_10"]
        result.append({
            "id": scan.id,
            "created_at": str(scan.created_at) if scan.created_at else "",
            "total_vegetables": scan.total_vegetables,
            "preview": preview,
        })
    return result


@router.get("/{scan_id}")
def get_scan(scan_id: int, db: Session = Depends(get_db)):
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    vegetables = db.query(Vegetable).filter(Vegetable.scan_id == scan_id).all()
    recipes = db.query(Recipe).filter(Recipe.scan_id == scan_id).all()
    substitutions = db.query(Substitution).filter(Substitution.scan_id == scan_id).all()

    veg_data = []
    for veg in vegetables:
        nutrition = db.query(Nutrition).filter(Nutrition.vegetable_id == veg.id).first()
        veg_data.append({
            "vegetable": {
                "id": veg.id,
                "name": veg.common_name,
                "quantity": veg.estimated_quantity,
                "weight": veg.estimated_weight_grams,
                "freshness": veg.freshness_status,
            },
            "nutrition": {
                "calories": nutrition.calories_kcal if nutrition else None,
                "carbohydrates": nutrition.carbohydrates_g if nutrition else None,
                "fibre": nutrition.dietary_fibre_g if nutrition else None,
                "protein": nutrition.protein_g if nutrition else None,
                "fat": nutrition.fat_g if nutrition else None,
            } if nutrition else None,
        })

    return {
        "scan_id": scan.id,
        "created_at": scan.created_at,
        "total_vegetables": scan.total_vegetables,
        "vegetables": veg_data,
        "recipes": [
            {
                "level": r.skill_level,
                "name": r.name,
                "time": r.total_time_minutes,
                "servings": r.servings,
                "ingredients": json.loads(r.additional_ingredients) if r.additional_ingredients else [],
                "steps": json.loads(r.steps) if r.steps else [],
                "plating": r.plating_suggestion,
            }
            for r in recipes
        ],
        "substitutions": [
            {
                "original": s.original_vegetable_name,
                "risk": s.risk_reason,
                "substitute": s.substitute_vegetable,
                "why_safer": s.why_safer,
            }
            for s in substitutions
        ],
        "full_response": json.loads(scan.raw_response) if scan.raw_response else None,
    }
