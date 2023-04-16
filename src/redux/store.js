import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modalSlice";
import userReducer from "./userSlice";

export default configureStore({
  reducer: {
    userState: userReducer,
    modalState: modalReducer
  }
});
