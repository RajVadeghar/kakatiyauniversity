import { getSession } from "next-auth/react";
import ClassLink from "../../../models/ClassLink";
import {
  errorHandler,
  responseHandler,
  validateAllOnce,
} from "../../../utils/common";
import dbConnect from "../../../utils/mongo";

export default async function handler(req, res) {
  const {
    method,
    query: { branch, semester, subject },
  } = req;
  const session = await getSession({ req });

  dbConnect();

  if (method === "POST") {
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

        responseHandler(classLink, res);
      } else {
        errorHandler("Only faculty can create class links", res);
      }
    } catch (error) {
      errorHandler(error, res);
    }
  } else if (method === "GET") {
    try {
      let classLink;
      if (branch && subject && semester) {
        const sub = subject.split("%20").join(" ");

        classLink = await ClassLink.aggregate([
          {
            $match: {
              $and: [
                { branch: branch.toUpperCase() },
                { sem: semester.toUpperCase() },
                { subject: sub },
              ],
            },
          },
        ]);
      } else {
        classLink = await ClassLink.aggregate([{ $match: {} }]);
      }

      responseHandler(classLink, res);
    } catch (error) {
      errorHandler(error, res);
    }
  } else {
    errorHandler("Invalid request type", res);
  }
}

/* else if (branch && semester) {
  classLink = await ClassLink.find({ branch, semester });
} else if (branch && sub) {
  classLink = await ClassLink.find({ branch, sub });
} else if (semester && sub) {
  classLink = await ClassLink.find({ semester, sub });
} else if (branch) {
  classLink = await ClassLink.find({ branch });
} else if (semester) {
  classLink = await ClassLink.find({ semester });
} else if (sub) {
  classLink = await ClassLink.find({ sub });
} */
