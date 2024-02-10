import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import AuthReducer from './slice/AuthSlice'
import UserChatReducer from './slice/UserChatSlice'
import WebSocketReducer from './slice/WebSocketSlice'
export const store = configureStore({
    reducer:{
        WebSocketReducer,
        AuthReducer,
        UserChatReducer,
    }
})

export  type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector