import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth.js';

const authMiddleware = (request, response, next) => {

    console.log(request.headers);
    
    const authToken = request.headers.authorization

    console.log('AUTH HEADER:', request.headers.authorization);

    if(!authToken){
        return response.status(401).json({error:"Token not provided"});
    }

    const token = authToken.split(' ')[1];

  
    try {
  console.log('TOKEN RECEBIDO:', token);

  const decoded = jwt.verify(token, authConfig.secret);

  console.log('TOKEN DECODIFICADO:', decoded);

  request.userId = decoded.id;
  request.userName = decoded.name
  request.userIsAdmin = decoded.admin;

  return next();
} catch (error) {
  console.log('ERRO JWT:', error);

  return response.status(401).json({
    error: 'Token is invalid',
  });
}
    
}






export default authMiddleware;