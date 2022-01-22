import { getSession } from "next-auth/react";
import ClassLink from "../../../models/ClassLink";
import {
  errorHandler,
  responseHandler,
  validateAllOnce,
} from "../../../utils/common";
import dbConnect from "../../../utils/mongo";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });

  dbConnect();

  if (method === "POST") {
    console.log(req.body);
    try {
      if (session?.user.isFaculty) {
        const { title, desc, year, branch, subject } = req.body;
        validateAllOnce({
          title,
          desc,
          year,
          branch,
          subject,
        });

        if (
          !req.body.video ||
          req.body.video.name === "" ||
          req.body.video.url === ""
        ) {
          throw "Video required";
        }

        const classLink = await ClassLink.create(req.body);
        // console.log(classLink);

        responseHandler(classLink, res);
      } else {
        errorHandler("Only faculty can create class links", res);
      }
    } catch (error) {
      errorHandler(error, res);
    }
  } else {
    errorHandler("Invalid request type", res);
  }
}
