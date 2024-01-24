from typing import Any, Dict, Set

from fastapi import WebSocket

ActiveConnections = Dict[str, Set[WebSocket]]

class WebSocketManager:
    def __init__(self) -> None:
        self.active_connections: Dict[str, WebSocket] = {}
    
    def connect(self, user_id:str, websocket: WebSocket) -> None:
        self.active_connections[user_id] = websocket
    
    def disconnect(self, user_id:str,) -> None:
        del self.active_connections[user_id]
        print(self.active_connections[user_id])
    
    async def send_message(self, user_id:str, message:Any) -> None:
        await self.active_connections[user_id].send_json(message)
        

# create singleton in python for 
websocket_manager = WebSocketManager()
