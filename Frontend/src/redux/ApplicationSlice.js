import { createSlice } from "@reduxjs/toolkit";
import reducer from "./authSlice";
const ApplicatonSlice = createSlice({
  name: "Application",
  initialState: {
    Applicants: [],
  },
  reducers: {
    setAllApplicats: (state, action) => {
      state.Applicants = action.payload;
    },
  },
});
export const { setAllApplicants } = ApplicatonSlice.actions;
export default ApplicatonSlice.reducer;
