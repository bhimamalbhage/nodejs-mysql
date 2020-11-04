const jwt = require("jsonwebtoken");

module.exports = function(req,res,next){
    const token = req.cookies['jwt'];
    if (!token) {
        return res.status(401).json({ msg: "No token, Authorization denied" });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
         req.userId = decoded.id;
        next();
      } catch (error) {
        res.status(401).json({ msg: "Token is invalid" });
      }
}