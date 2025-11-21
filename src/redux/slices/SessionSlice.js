import { createSlice } from "@reduxjs/toolkit";

const initialState =
{
    isLogin:false,
    token:"valortoken"
}


export const sessionSlice = createSlice({
    name:'session',
    initialState,
    reducers:{
        logIn:(state,action)=>{
            const {isLogin_param,token_param}=action.payload;
            state.isLogin=isLogin_param
            state.token=token_param;
            localStorage.setItem("isLogin", true);
            localStorage.setItem("token", token_param);
        },   
        logOut:(state,action)=>{
            const {isLogin_param,token_param}=action.payload;
            state.isLogin=isLogin_param
            state.token=token_param;
            localStorage.setItem("isLogin", false);
            localStorage.setItem("token", "NOK");
        }
    }

})

export const {logIn,logOut}= sessionSlice.actions
export default sessionSlice.reducer