from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

connection_string = 'postgresql://usmansooomro1234:loJ3sySiRYE0@ep-red-surf-a17chbyi.ap-southeast-1.aws.neon.tech/gpt_clone01?sslmode=require'


engine = create_engine(connection_string)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()


def get_db():
    db =SessionLocal() 
    
    try:
        yield db
    finally:
        db.close()
