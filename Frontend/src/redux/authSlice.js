import { createSlice } from "@reduxjs/toolkit";

const authenSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        authChecked:false,
        user:null
    },
    reducers:{

        setLoading:(state, action) =>{
            state.loading = action.payload;
        },
      setAuthChecked:(state, action)=>{
        state.authChecked = action.payload;
      },
      setUser:(state, action)=>{
        state.user =action.payload;

      }  
    }
    
})
export const {setLoading, setAuthChecked, setUser}= authenSlice.actions;
export default authenSlice.reducer;
