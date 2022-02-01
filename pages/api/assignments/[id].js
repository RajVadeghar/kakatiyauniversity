import { errorHandler, responseHandler } from "../../../utils/common";
import dbConnect from "../../../utils/mongo";
import { getSession } from "next-auth/react";
import Assignment from "../../../models/Assignment";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const session = await getSession({ req });

  dbConnect();

  if (method === "GET") {
    try {
      const assignment = await Assignment.findById(id);
      responseHandler(assignment, res);
    } catch (error) {
      errorHandler(error, res);
    }
  } else if (method === "DELETE") {
    try {
      if (session.user.uid === req.body.uid) {
        await Assignment.findByIdAndDelete(id);
        responseHandler("Assignment Deleted", res);
      } else {
        errorHandler("You can only delete assignment posted by you", res);
      }
    } catch (error) {
      errorHandler(error, res);
    }
  } else if (method === "PUT") {
    try {
      // FIXME: protect !isFaculty updates
      await Assignment.findByIdAndUpdate(req.body);
      responseHandler("Assignment Updated", res);
    } catch (error) {
      errorHandler(error, res);
    }
  } else {
    errorHandler("Invalid request type", res);
  }
}
