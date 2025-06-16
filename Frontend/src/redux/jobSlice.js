import { createSlice } from "@reduxjs/toolkit"
export const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    searchJobByText: "",
    allAppliedJobs:[],
    searchedQuery:"",
    isLoading:false
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs:(state, action)=>{
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery: (state, action)=>{
      state.searchedQuery = action.payload;
    },
    setLoading:(state, action)=>{
      state.isLoading =action.payload;
    }
  }, 
});
export const { setLoading, setAllJobs, setSingleJob, setAllAdminJobs, setSearchJobByText, setAllAppliedJobs,setSearchedQuery } = jobSlice.actions;
export default jobSlice.reducer;
