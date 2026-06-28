import json
import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models.scan import Scan

logger = logging.getLogger(__name__)


def cache_result(scan_id: int, result: dict) -> None:
    db: Session = SessionLocal()
    try:
        scan = db.query(Scan).filter(Scan.id == scan_id).first()
        if scan:
            scan.full_result = result
            db.commit()
            logger.info(f"Cached result for scan_id={scan_id}")
    except Exception as e:
        logger.error(f"Failed to cache result: {e}")
        db.rollback()
    finally:
        db.close()


def get_cached_result(scan_id: int) -> dict | None:
    db: Session = SessionLocal()
    try:
        scan = db.query(Scan).filter(Scan.id == scan_id).first()
        if scan and scan.full_result:
            return scan.full_result
        return None
    except Exception as e:
        logger.error(f"Failed to retrieve cached result: {e}")
        return None
    finally:
        db.close()


def clear_expired_cache() -> int:
    db: Session = SessionLocal()
    try:
        cutoff = datetime.utcnow() - timedelta(days=7)
        expired = db.query(Scan).filter(Scan.created_at < cutoff).all()
        count = len(expired)
        for scan in expired:
            scan.full_result = None
        db.commit()
        logger.info(f"Cleared cache for {count} expired scans")
        return count
    except Exception as e:
        logger.error(f"Failed to clear expired cache: {e}")
        db.rollback()
        return 0
    finally:
        db.close()
