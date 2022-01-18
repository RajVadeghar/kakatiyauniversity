import axios from "axios";
import { getValue } from "../utils/common";

export const signup = async (payload) => {
  try {
    const res = await axios.post(
      process.env.NEXTAUTH_URL + "/api/signup",
      payload
    );
    return res.data;
  } catch (error) {
    /* 
    const errorMsg = getValue(error, ["response", "data"]);
    if (typeof errorMsg.errorMessage === "object") {
      if (
        errorMsg.errorMessage.code === 11000 &&
        "id" in errorMsg.errorMessage.keyValue
      ) {
        return { hasError: true, errorMessage: "Roll number already exists" };
      }
      return { hasError: true, errorMessage: "Invalid data" };
    } */
    return error;
  }
};

export const updateuser = async (payload) => {
  try {
    const res = await axios.put(
      process.env.NEXTAUTH_URL + `/api/user/${payload.uid}`,
      payload
    );
    return res.data;
  } catch (error) {
    const errorMsg = getValue(error, ["response", "data"]);
    return errorMsg;
  }
};

export const deleteuser = async (id) => {
  try {
    const res = await axios.delete(
      process.env.NEXTAUTH_URL + `/api/user/${id}`
    );
    return res.data;
  } catch (error) {
    const errorMsg = getValue(error, ["response", "data"]);
    return errorMsg;
  }
};

export const getuser = async (id) => {
  try {
    const res = await axios.get(process.env.NEXTAUTH_URL + `/api/user/${id}`);
    return res.data;
  } catch (error) {
    const errorMsg = getValue(error, ["response", "data"]);
    return errorMsg;
  }
};
