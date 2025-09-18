from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = 'normal'

class UserLogin(BaseModel):
    email: str
    password: str

class EventBase(BaseModel):
    title: str
    description: str
    date: str
    time: str
    image_url: str

class Event(EventBase):
    id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True
