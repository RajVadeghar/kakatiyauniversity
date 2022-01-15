// import dbConnect from "../../../util/mongo";
// import Product from "../../../models/Product";
import verify from "../../../middlewares/jwtVerify";

export default async function handler(req, res, next) {
  const {
    method,
    query: { id },
  } = req;

  // dbConnect();

  if (method == "DELETE") {
    verify(req, res, next);
    try {
      if (req.user.id === id || req.user.isAdmin) {
        res.status(200).json("User has been deleted");
      } else {
        res.status(403).json("You are not allowed to delete this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
