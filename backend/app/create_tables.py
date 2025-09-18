from database import Base, engine
import models  # Import models so Base metadata includes table info

def create_tables():
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully")

if __name__ == "__main__":
    create_tables()
