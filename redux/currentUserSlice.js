import { createSlice } from "@reduxjs/toolkit";

export const currentUserSlice = createSlice({
  name: "currentUserState",
  initialState: {
    hasError: false,
    data: {
      _id: "",
      uid: "",
      branch: "",
      dateOfJoining: "",
      dateOfPassOut: "",
      email: "",
      isFaculty: false,
      dateOfBirth: "",
      name: "",
    },
  },
  reducers: {
    updateCurrentUser: (state, action) => {
      state.hasError = action?.payload?.hasError;
      state.data._id = action?.payload?.data._id;
      state.data.uid = action?.payload?.data.uid;
      state.data.branch = action?.payload?.data.branch;
      state.data.dateOfJoining = action?.payload?.data.dateOfJoining;
      state.data.dateOfPassOut = action?.payload?.data.dateOfPassOut;
      state.data.email = action?.payload?.data.email;
      state.data.isFaculty = action?.payload?.data.isFaculty;
      state.data.dateOfBirth = action?.payload?.data.dateOfBirth;
      state.data.name = action?.payload?.data.name;
    },
  },
});

export const { updateCurrentUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;
