import jwt from 'jsonwebtoken';
import User from '../modules/user.model.js';

export const isAuthenticate = async (req, res, next) => {

  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;
  const token = req?.cookies?.token || bearerToken;

  if (!token) {
    return res.status(401).json({
      message: "Authentication failed! No token provided.",
      success: false,
    });
  }

 try{

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded){
    return res.status(401).json({
      message: "Authentication failed! Invalid or expired token.",
      success: false,
    })
    }
    const userId = decoded.userId || decoded.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Authentication failed! User no longer exists.",
        success: false,
      });
    }

    req.id = user._id;
    req.user = user;
    req.role = user.role;
    next();
  }
  catch (error){
    return res.status(401).json({
      message: "Authentication failed! Invalid or expired token.",
      success: false,
    });
  }
 
}
export default isAuthenticate;
