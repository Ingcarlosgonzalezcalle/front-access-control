import { configureStore } from "@reduxjs/toolkit";
import sessionSlice, { logIn, logOut } from "./slices/SessionSlice";

export default configureStore(
    {
        reducer:{
            session:sessionSlice
        }
    }
)