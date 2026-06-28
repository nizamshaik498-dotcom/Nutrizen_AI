from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.groq_service import generate_recipe

router = APIRouter(prefix="/ai", tags=["AI"])

class CommandRequest(BaseModel):
    prompt: str

@router.post("/command")
def ai_command(req: CommandRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="prompt required")
    try:
        recipe = generate_recipe(req.prompt)
        return {"recipe": recipe}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
