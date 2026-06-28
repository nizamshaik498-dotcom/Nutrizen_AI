from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
import os
from database import get_db
from models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-key-change-this")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


class UserRegister(BaseModel):
    username: str
    email: str
    password: str
    full_name: str = ""
    age: int = 0
    allergies: str = ""
    medical_conditions: str = ""
    dietary_preferences: str = ""


class UserLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int


@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    import traceback
    try:
        existing = db.query(User).filter(
            (User.username == user.username) | (User.email == user.email)
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username or email already exists")

        if not isinstance(user.password, str):
            raise HTTPException(status_code=500, detail=f"Password is not a string: {type(user.password)} value={repr(user.password)}")
        if len(user.password) > 50:
            raise HTTPException(status_code=500, detail=f"Password too long: {len(user.password)} bytes")
        hashed = pwd_context.hash(user.password)
        new_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hashed,
            full_name=user.full_name,
            age=user.age,
            allergies=user.allergies,
            medical_conditions=user.medical_conditions,
            dietary_preferences=user.dietary_preferences,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "User created", "user_id": new_user.id}
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Registration failed: {e}")


@router.post("/login", response_model=TokenResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = jwt.encode(
        {
            "sub": str(db_user.id),
            "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        },
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
    return TokenResponse(access_token=token, user_id=db_user.id)


def get_current_user_optional(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except (JWTError, ValueError, TypeError):
        return None
    user = db.query(User).filter(User.id == user_id).first()
    return user


def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except (JWTError, ValueError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.get("/me")
def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "age": current_user.age,
        "allergies": current_user.allergies or "",
        "medical_conditions": current_user.medical_conditions or "",
        "dietary_preferences": current_user.dietary_preferences or "",
        "created_at": str(current_user.created_at) if current_user.created_at else "",
    }
