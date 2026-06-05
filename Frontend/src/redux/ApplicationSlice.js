import { createSlice } from "@reduxjs/toolkit";
const ApplicationSlice = createSlice({
  name: "Application",
  initialState: {
    Applicants: [],
  },
  reducers: {
    setAllApplicants: (state, action) => {
      state.Applicants = action.payload;
    },
  },
});
export const { setAllApplicants } = ApplicationSlice.actions;
export default ApplicationSlice.reducer;
