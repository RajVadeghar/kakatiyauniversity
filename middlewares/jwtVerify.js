export default function verify(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json("token is invalid");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authorized");
  }
}
