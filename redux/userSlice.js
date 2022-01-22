import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "userState",
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
    update: (state, action) => {
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

export const { update } = userSlice.actions;
export default userSlice.reducer;

/* {
  "hasError": false,
  "data": {
      "_id": "61e4dd328e223e6a3d39b70d",
      "uid": "1630106318",
      "branch": "IT",
      "email": "instigator0002@gmail.com",
      "isFaculty": true,
      "createdAt": "2022-01-17T03:06:26.252Z",
      "updatedAt": "2022-01-17T03:07:10.500Z",
      "__v": 0,
      "name": "Ramana Babu"
  }
} */
