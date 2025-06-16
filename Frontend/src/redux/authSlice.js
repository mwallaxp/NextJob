import { createSlice } from "@reduxjs/toolkit";

const authenSlice = createSlice({
    name:"auth",
    initialState:{
        loading:0,
        user:null
    },
    reducers:{

        setLoading:(state, action) =>{
            state.loading = action.payload;
        },
      setUser:(state, action)=>{
        state.user =action.payload;

      }  
    }
    
})
export const {setLoading, setUser}= authenSlice.actions;
export default authenSlice.reducer;