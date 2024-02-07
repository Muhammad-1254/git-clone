
class WebSocketService{
    socket:WebSocket|null;
 constructor(){
    this.socket = null;
 }   
 setSocket(){
    this.socket = new WebSocket("ws://localhost:8000/api/v1/users/chat/socket/chat");
 }
 getSocket(){
    return this.socket
 }
 
 
}
const webSocketService = new WebSocketService();
export default webSocketService;