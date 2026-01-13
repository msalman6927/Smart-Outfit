from pydantic import BaseModel, EmailStr
from typing import List, Optional

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserSchema(UserBase):
    id: int

    class Config:
        from_attributes = True

# Clothing Schemas
class ClothingItemBase(BaseModel):
    name: str
    category: str
    thickness: str
    min_temp: float
    max_temp: float

class ClothingItemCreate(ClothingItemBase):
    pass

class ClothingItemSchema(ClothingItemBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
