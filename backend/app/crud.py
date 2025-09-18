from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_event(db: Session, event: schemas.EventBase):
    db_event = models.Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_events(db: Session):
    return db.query(models.Event).all()

def update_event(db: Session, event_id: int, event: schemas.EventBase):
    db_event = db.query(models.Event).get(event_id)
    if not db_event:
        return None
    for key, value in event.dict().items():
        setattr(db_event, key, value)
    db.commit()
    db.refresh(db_event)
    return db_event

def delete_event(db: Session, event_id: int):
    db_event = db.query(models.Event).get(event_id)
    if not db_event:
        return None
    db.delete(db_event)
    db.commit()
    return db_event
