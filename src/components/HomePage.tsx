'use client'

import { useAppSelector } from '@/lib/redux/store';

const HomePage = () => {
  
  const user_id = useAppSelector((state) => state.AuthReducer.value.user_id);
  const chat_id =  useAppSelector((state) => state.PromptChatReducer.value.apiRes.chat_id);
  const isWebSocketOpen = useAppSelector((state)=>state.WebSocketReducer.value.isOpen)  
  
  
    
  const chatData = useAppSelector((state)=>state.ChatDataReducer.value)
  console.log({chatData})

  // useEffect(()=>{
  //   WebSocketTemp()
  // },[isWebSocketOpen])
    return (
    <div className='relative w-full h-full overflow-y-scroll
    flex flex-col items-center justify-between
    '>
        {/* <UserChat/> */}
<div>
  
  </div>
        {/* {isWebSocketOpen ?<WebSocketTemp/> :
      <div className='
      relative top-[50%] w-full flex flex-col items-center justify-normal border
      gap-y-5
      '>
        {Array.from({length:4}).map((_,index)=>(
          <Card key={index}
          className='flex flex-col items-start  border-2'
          >

            <p className=''>Popular search suggestion</p>
<p className='text-sm'>Mosus de saint-sacrament de crime de mangeux d marde de charogne. </p>
          </Card>
        ))}
      </div>

          } */}
    </div>
  )
}

export default HomePage