import { errorHandler, responseHandler } from "../../../utils/common";
import dbConnect from "../../../utils/mongo";
import { getSession } from "next-auth/react";
import Assignment, { Submission } from "../../../models/Assignment";

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
      if (req.body.submissionData) {
        await Assignment.findByIdAndUpdate(req.body.id, {
          $push: {
            submissions: req.body.submissionData,
          },
        });

        console.log(submission);
        responseHandler(submission, res);
      } else if (req.body.submitId) {
        const payload = req.body;
        delete payload.id;
        delete payload.submitId;

        const assignment = await Assignment.findById(req.body.id);

        const submission = await assignment.submissions.findByIdAndUpdate(
          req.body.submitId,
          payload
        );

        console.log(submission);

        // FIXME: not updating properly. CHeck submission id from above if statement at client side
        /*  const submission = await Assignment.updateOne(
          { _id: req.body.id },
          {
            $set: {
              "submissions.$[submitId]": payload,
            },
          },
          { arrayFilters: [{ "submitId._id": req.body.submitId }] }
        ); */

        responseHandler(submission, res);
      } else {
        await Assignment.findByIdAndUpdate(req.body.id, req.body);
        responseHandler("Assignment Updated", res);
      }
    } catch (error) {
      errorHandler(error, res);
    }
  } else {
    errorHandler("Invalid request type", res);
  }
}
