import jwt from 'jsonwebtoken';

export const isAuthenticate = (req, res, next) => {

  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Authentication failed! No token provided.",
      success: false,
    });
  }

 try{

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded){
      console.error("Token verification failed:", error);
    return res.status(401).json({
      message: "Authentication failed! Invalid or expired token.",
      success: false,
    })
    }
    req.id = decoded.userId
    next();
  }
  catch (error){
    console.log(error)
  }
 
}
export default isAuthenticate;