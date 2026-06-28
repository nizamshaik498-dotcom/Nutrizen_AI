import os
import shutil
import tempfile
import logging
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.scan import Scan
from ..models.vegetable import Vegetable
from ..models.user import User
from ..services.image_service import preprocess_image
from ..services.gemini_service import analyze_vegetables
from ..services.cache_service import cache_result

router = APIRouter(prefix="/scan", tags=["scan"])
logger = logging.getLogger(__name__)


@router.post("")
def scan_vegetable(
    user_id: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    tmp_dir = tempfile.gettempdir()
    tmp_path = os.path.join(tmp_dir, f"scan_{user_id}_{image.filename}")
    try:
        with open(tmp_path, "wb") as f:
            shutil.copyfileobj(image.file, f)

        processed_path = preprocess_image(tmp_path)

        user_context = {
            "user_id": user.id,
            "name": user.name,
            "weight_kg": user.weight_kg,
            "height_cm": user.height_cm,
            "age": user.age,
            "gender": user.gender,
            "fitness_goal": user.fitness_goal,
            "daily_calorie_target": user.daily_calorie_target,
            "protein_g": user.protein_g,
            "carbs_g": user.carbs_g,
            "fat_g": user.fat_g,
            "allergies": user.allergies or [],
            "medical_conditions": user.medical_conditions or [],
            "dislikes": user.dislikes or [],
            "preferred_cuisine": user.preferred_cuisine or "Indian",
            "language": user.language or "English",
            "region": user.region or "",
            "country": user.country or "",
            "current_season": user.current_season or "",
            "cooking_skill_level": user.cooking_skill_level or "intermediate",
        }

        result = analyze_vegetables(processed_path, user_context)

        detected = []
        if "scan_summary" in result and "items" in result["scan_summary"]:
            detected = result["scan_summary"]["items"]

        scan = Scan(
            user_id=user_id,
            image_url=image.filename,
            detected_vegetables=detected,
            full_result=result,
        )
        db.add(scan)
        db.commit()
        db.refresh(scan)

        for item in detected:
            veg = Vegetable(
                scan_id=scan.id,
                name=item.get("common_name", "Unknown"),
                scientific_name=item.get("scientific_name"),
                estimated_weight_grams=item.get("estimated_weight_grams"),
                freshness_status=None,
                confidence_level=item.get("confidence_level"),
            )
            db.add(veg)
        db.commit()

        cache_result(scan.id, result)

        return {"scan_id": scan.id, "result": result}

    except Exception as e:
        logger.error(f"Scan failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


@router.get("/history/{user_id}")
def get_scan_history(user_id: int, db: Session = Depends(get_db)):
    scans = db.query(Scan).filter(Scan.user_id == user_id).order_by(Scan.created_at.desc()).all()
    return [
        {
            "id": s.id,
            "image_url": s.image_url,
            "detected_vegetables": s.detected_vegetables,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        }
        for s in scans
    ]


@router.get("/{scan_id}")
def get_scan_result(scan_id: int, db: Session = Depends(get_db)):
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return {
        "id": scan.id,
        "user_id": scan.user_id,
        "image_url": scan.image_url,
        "detected_vegetables": scan.detected_vegetables,
        "full_result": scan.full_result,
        "created_at": scan.created_at.isoformat() if scan.created_at else None,
    }
