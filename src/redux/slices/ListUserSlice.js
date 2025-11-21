import { createSlice } from "@reduxjs/toolkit";

const initialState =
{
    login:false,
    count:0,
    list:[]
}


export const userSlice = createSlice({
    name:'users',
    initialState,
    reducers:{
        setUserList:(state,action)=>{
            state.list=action.payload
            state.count=state.list.length;
        }
        ,        
        initSesion:(state,action)=>{
            state.login=true
        }
        ,        
        logOut:(state,action)=>{
            state.login=false
        }
        ,
        clearUserList:(state,action)=>{
            state.list=[]
            state.count=state.list.length;
        }

    }

})

export const {setUserList,clearUserList}= userSlice.actions
export default userSlice.reducer