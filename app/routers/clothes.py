from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.all_models import ClothingItem, User
from ..schemas.all_schemas import ClothingItemCreate, ClothingItemSchema
from .auth import get_current_user

router = APIRouter(prefix="/clothes", tags=["clothes"])

@router.post("/", response_model=ClothingItemSchema)
def create_clothing(
    item: ClothingItemCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    db_item = ClothingItem(**item.dict(), user_id=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/", response_model=List[ClothingItemSchema])
def get_clothes(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    return db.query(ClothingItem).filter(ClothingItem.user_id == current_user.id).all()

@router.delete("/{item_id}")
def delete_clothing(
    item_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    db_item = db.query(ClothingItem).filter(
        ClothingItem.id == item_id, 
        ClothingItem.user_id == current_user.id
    ).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"message": "Deleted successfully"}
