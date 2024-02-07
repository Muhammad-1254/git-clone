'use client'

import { TRealTimeUserChat } from "@/lib/redux/slice/UserChatSlice"
import { useAppSelector } from "@/lib/redux/store"
import moment from 'moment'
import UserInput from "./UserInput"
import MdConverter from "./sub_components/MdConverter"
const ChatSection = () => {
    // const [data, setData] = useState<TUserHistoryChat[]>([])
  const userHistoryChat= useAppSelector((state)=>state.UserChatReducer.value.userHistoryChat)
    const activeChatID = useAppSelector((state)=>state.UserChatReducer.value.chatPageActiveChat)
  const realTimeData = useAppSelector((state)=>state.UserChatReducer.value.realTimeUserChat)
    return (
    <div className="w-[60vw] h-screen border-2  flex flex-col items-center justify-between">
<div className="flex flex-col ">

 {
  activeChatID && userHistoryChat.find(item=>item.id === activeChatID)?.conversation_history.map((item,_)=>UserChat(_, item,null ))}
  <>
  <span className="text-red-500">REAL TIME DATA</span>
 {
    realTimeData.length > 0 && realTimeData.map((item, _)=>(
        UserChat(_, item, null)
    ))
  }
  </>
</div>


<div className="mb-10 ">
    <UserInput/>
</div>
    </div>
  )
}

export default ChatSection


const UserChat = (key:any, item:TRealTimeUserChat,date:null|string )=>{
    return(
        <div key={key}
        >
            <div className="flex gap-x-3 border">
    <span className="flex flex-col justify-between">
    
    <h3>{item.role}</h3>
    {date
    &&
    <p>{moment(date).format('DD-MMM-YYYY')}</p>
    }
    </span>
<MdConverter   markdown={item.content}/>
        {/* {item.content} */}
            </div>
            </div>
    

    
    )
}


