"""人物"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models import NameBasics
from app.schemas import PersonDetail

router = APIRouter()


@router.get("/people/{person_id}", response_model=PersonDetail, tags=["people"])
async def get_person(
    person_id: str,
    db: Session = Depends(get_db)
):
    """获取人物详情（演员、导演等）"""
    
    person = db.query(NameBasics).filter(NameBasics.nconst == person_id).first()
    
    if not person:
        raise HTTPException(status_code=404, detail=f"人物 {person_id} 不存在")
    
    return PersonDetail(
        person_id=person.nconst,
        name=person.primary_name,
        birth_year=person.birth_year,
        death_year=person.death_year,
        professions=person.primary_profession or [],
        known_for_titles=person.known_for_titles or [],
    )

