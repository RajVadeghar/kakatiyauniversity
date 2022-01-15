// import dbConnect from "../../../util/mongo";
// import Product from "../../../models/Product";
import jwt from "jsonwebtoken";
import users from "../../utils/users";

export default async function handler(req, res, next) {
  const { method } = req;

  // dbConnect();
  // console.log(process.env.ACCESS_TOKEN_SECRET);

  if (method == "POST") {
    try {
      const { username, password } = req.body;

      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        const accessToken = jwt.sign(
          { id: user.id, isAdmin: user.isAdmin },
          process.env.ACCESS_TOKEN_SECRET
        );

        res.json({
          username: user.username,
          isAdmin: user.isAdmin,
          accessToken,
        });
      } else {
        res.status(500).json("invalid credentials");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
