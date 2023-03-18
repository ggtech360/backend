const jwt = require("jsonwebtoken");
const JWT_SECRET = "yoyoyoyoyoyo";

const fetchuser = (req, res, next) => {
  // get the user from the jwttoken and add it to req object
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ error: "Please athenticate with a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please athenticate with a valid token" });
  }
};

module.exports = fetchuser;
