'use client'

import { TRealTimeUserChat } from "@/lib/redux/slice/UserChatSlice"
import { useAppSelector } from "@/lib/redux/store"
import moment from 'moment'
import { FaUser } from "react-icons/fa"
import { GiArtificialHive } from "react-icons/gi"
import UserInput from "./UserInput"
import MdConverter from "./sub_components/MdConverter"
import { Card } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"

const ChatSection = () => {
    // const [data, setData] = useState<TUserHistoryChat[]>([])
  const userHistoryChat= useAppSelector((state)=>state.UserChatReducer.value.userHistoryChat)
    const activeChatID = useAppSelector((state)=>state.UserChatReducer.value.chatPageActiveChat)
  const realTimeData = useAppSelector((state)=>state.UserChatReducer.value.realTimeUserChat)
    return (
      <div className="w-[calc(100%/1.5)]  lg:mx-auto h-screen flex flex-col items-start justify-evenly lg:justify-between lg:pb-1.5  " >
    <div className=" w-full  flex flex-col items-start ">
<ScrollArea className="flex flex-col  h-[90vh] ">

 {
  activeChatID && userHistoryChat.find(item=>item.id === activeChatID)?.conversation_history.map((item,_)=>UserChat(_, item,null ))}
  <>
  {/* <span className="text-red-500">REAL TIME DATA</span> */}
 {
    realTimeData.length > 0 && realTimeData.map((item, _)=>(
        UserChat(_, item, null)
    ))
  }
  </>
</ScrollArea>



    </div>
    <UserInput/>
</div>

  )
}

export default ChatSection


const UserChat = (key:any, item:TRealTimeUserChat,date:null|string )=>{
    return(
            <Card
            key={key}
            className="flex flex-col items-start gap-x-3  px-4 py-2.5 mt-5">


    <div className="inline-flex items-center justify-normal gap-x-4 border-b border-r md:border-b-2 md:border-r-2 border-slate-500  rounded-br-3xl">
    <div className="text-xl md:text-2xl lg:text-3xl">
      {item.role === 'user'?
      <span>

        <FaUser/>
      </span>
      
      : item.role==='assistant'&&<span className="text-blue-500 lg:text-[36px] animate-spin ">
        <GiArtificialHive/>
        </span>}
      </div>
      date date
    {date
    &&
    <p>{moment(date).format('DD-MMM-YYYY')}</p>
    }
    </div>
      {item.role === 'user' ?
      
      <p className="flex" >
        
        {item.content} 
        helo mu name c najcnasd cancjacansdc adcjasdnc jkasdca jc acjka scjdj cjd c ajdc jkdcjkd helo mu name c najcnasd cancjacansdc adcjasdnc jkasdca jc acjka scjdj cjd c ajdc jkdcjkd
        
        </p>
      
      :item.role ==='assistant'&&
      <div>

<MdConverter   markdown={item.content}/>
</div>
}
      
            </Card>
    

    
    )
}


