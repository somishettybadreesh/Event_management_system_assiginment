from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os
from dotenv import load_dotenv

from . import models, schemas, crud, auth
from .database import SessionLocal, engine, Base

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware for frontend running on localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth.jwt_decode_token(token)
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

def get_current_admin_user(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@app.get("/")
def read_root():
    return {"message": "Welcome to the Event Management System API"}

@app.post("/signup", response_model=schemas.UserCreate)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user)

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = auth.create_access_token(
        data={"sub": db_user.email, "role": db_user.role}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": db_user.role}

@app.get("/users/me", response_model=schemas.UserCreate)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/events", response_model=List[schemas.Event])
def read_events(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_events(db)

@app.post("/events", response_model=schemas.Event)
def create_event(
    event: schemas.EventBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    db_event = models.Event(
        **event.dict(),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@app.put("/events/{event_id}", response_model=schemas.Event)
def update_event(
    event_id: int,
    event: schemas.EventBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    db_event = db.query(models.Event).get(event_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    for key, value in event.dict().items():
        setattr(db_event, key, value)
    db_event.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_event)
    return db_event

@app.delete("/events/{event_id}", status_code=204)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    db_event = db.query(models.Event).get(event_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(db_event)
    db.commit()
    return None

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)