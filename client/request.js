import axios from "axios";
import { getValue } from "../utils/common";

export const signup = async (payload) => {
  try {
    const res = await axios.post("/api/signup", payload);
    return res.data;
  } catch (error) {
    const errorMsg = getValue(error, ["response", "data"]);
    if (typeof errorMsg.errorMessage === "object") {
      if (
        errorMsg.errorMessage.code === 11000 &&
        "id" in errorMsg.errorMessage.keyValue
      ) {
        return { hasError: true, errorMessage: "Roll number already exists" };
      }
      return { hasError: true, errorMessage: "Invalid data" };
    }
    return errorMsg;
  }
};

export const updateuser = async (payload) => {
  try {
    const res = await axios.put(`/api/user/${payload.uid}`, payload);
    return res.data;
  } catch (error) {
    const errorMsg = getValue(error, ["response", "data"]);
    return errorMsg;
  }
};

export const deleteuser = async (id) => {
  try {
    const res = await axios.delete(`/api/user/${id}`);
    return res.data;
  } catch (error) {
    const errorMsg = getValue(error, ["response", "data"]);
    return errorMsg;
  }
};

export const getuser = async (id) => {
  try {
    const res = await axios.get(`/api/user/${id}`);
    return res.data;
  } catch (error) {
    const errorMsg = getValue(error, ["response", "data"]);
    return errorMsg;
  }
};
