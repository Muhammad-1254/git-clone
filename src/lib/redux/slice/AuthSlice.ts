import { createSlice } from "@reduxjs/toolkit";


type TAuthState={
  user_id:string,
  username:string,
  email:string,

}


const authInitialState:TAuthState= {
   email:'usmansoomro1234@gmail.com',
   user_id:"7b33b633-a54c-4b06-b57e-3416611a4776",
   username:'muhammad-1254',

}



export const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    value:authInitialState
  },
  reducers: {

    logout: () => {},
    login: () => {},

    setUserDetails:(state, action)=>{
      state.value = action.payload
    }
  },
});


export const { logout, login } = AuthSlice.actions;
export default AuthSlice.reducer;

