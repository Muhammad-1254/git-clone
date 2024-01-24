from sqlalchemy.orm import Session

from db.models.User import UserChat


def get_conversation_history(id:int ,db:Session):
    history = db.query(UserChat).filter(UserChat.id==id).first()
    print(f"history: {history}")
    return history
    
    