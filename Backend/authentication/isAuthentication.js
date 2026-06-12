import jwt from 'jsonwebtoken';

export const isAuthenticate = (req, res, next) => {

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
    req.id = decoded.userId || decoded.id;
    req.role = decoded.role;
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
