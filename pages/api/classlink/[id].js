import { errorHandler, responseHandler } from "../../../utils/common";
import dbConnect from "../../../utils/mongo";
import ClassLink from "../../../models/ClassLink";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;

  dbConnect();

  if (method === "GET") {
    try {
      const classLink = await ClassLink.findById(id);
      responseHandler(classLink, res);
    } catch (error) {
      errorHandler(error, res);
    }
  } else if (method === "PUT") {
    try {
      const newItem = { uid: req.body.uid, watchedPercent: req.body.percent };

      await ClassLink.findByIdAndUpdate(
        id,
        { $pull: { watchedBy: { uid: req.body.uid } } },
        {
          new: true,
        }
      );

      await ClassLink.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            watchedBy: { uid: req.body.uid, watchedPercent: req.body.percent },
          },
        },
        {
          new: true,
        }
      );
      responseHandler("Progress Updated", res);
    } catch (error) {
      errorHandler(error, res);
    }
  } else {
    errorHandler("Invalid request type", res);
  }
}
