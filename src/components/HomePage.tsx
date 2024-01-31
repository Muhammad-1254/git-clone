'use client'

import { useAppSelector } from '@/lib/redux/store'
import UserChat from './UserChat'

const HomePage = () => {
    const chatData = useAppSelector((state)=>state.ChatDataReducer.value)
  console.log({chatData})
    return (
    <div className='relative w-full h-full overflow-y-scroll
    flex flex-col items-center justify-between
    '>
        <UserChat/>
      <div>

        {chatData?.map((item,index)=>(
            <p key={index}>
                {item.conversation_history?.map((_,i)=>(
                    <p key={i}>
                        {_.content}
                    </p>
                ))}
            </p>
        ))}
        </div>
    </div>
  )
}

export default HomePage