import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import modalReducer from "./modalSlice";
import currentUserReducer from "./currentUserSlice";

export default configureStore({
  reducer: {
    userState: userReducer,
    modalState: modalReducer,
    currentUserState: currentUserReducer,
  },
});
