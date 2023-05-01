import bcrypt from "bcrypt";
import User from "../../../models/User";
import {
  errorHandler,
  responseHandler,
  validateAllOnce
} from "../../../utils/common";
import dbConnect from "../../../utils/mongo";

export default async function handler(req, res) {
  const { method } = req;

  dbConnect();

  if (method === "POST") {
    try {
      const { uid, branch, dateOfJoining, dateOfPassOut, email, password } =
        req.body;
      validateAllOnce({
        uid,
        branch,
        dateOfJoining,
        dateOfPassOut,
        email,
        password
      });

      // Test@11

      const hashPassword = await bcrypt.hash(req.body.password, 8);

      // fhsdh378578343nwdbfiewgfgewrfgiu3726453jfdhfiwe

      // Insert into table User (uid, branch, dateOfJoining, dateOfPassOut, email)

      const user = await User.create({
        ...req.body,
        password: hashPassword
      });

      // {"_id":{"$oid":"643b9f7843a6f8f2d0f8239a"},"uid":"205671862L","branch":"IT","dateOfJoining":"2000-08-12","dateOfPassOut":"2022-06-08","email":"shivakalyanpolu@gmail.com","password":"$2b$08$9PHkHDMNZosWxfQtCyKIiuPy94qCNTaLBSw4uYmUvMisoDMn1B9T6","role":"Student","isApprovedAsFaculty":false,"createdAt":{"$date":{"$numberLong":"1681629048463"}},"updatedAt":{"$date":{"$numberLong":"1681629048463"}},"__v":{"$numberInt":"0"}}

      const userDoc = user._doc;

      // userDoc.uid = 205671862L

      delete userDoc.password;

      responseHandler(userDoc, res);
    } catch (error) {
      errorHandler(error, res);
    }
  } else {
    errorHandler("Invalid request type", res);
  }
}
