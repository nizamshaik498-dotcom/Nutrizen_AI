from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.vegetable import Vegetable
from ..models.scan import Scan

router = APIRouter(prefix="/nutrition", tags=["nutrition"])


@router.get("/{vegetable_name}")
def get_nutrition(vegetable_name: str, db: Session = Depends(get_db)):
    scans = db.query(Scan).filter(
        Scan.full_result.isnot(None)
    ).order_by(Scan.created_at.desc()).limit(20).all()

    for scan in scans:
        if scan.full_result and "nutrition" in scan.full_result:
            for item in scan.full_result["nutrition"]:
                if vegetable_name.lower() in item.get("vegetable_name", "").lower():
                    return item

    return {
        "vegetable_name": vegetable_name,
        "message": "No cached nutrition data found. Please scan this vegetable first.",
        "note": "Nutrition data will be available after a scan is performed.",
    }
