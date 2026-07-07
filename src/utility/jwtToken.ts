import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";


const jwtTokenCreate =  (payload : JwtPayload, secret : string, expiresIn : SignOptions) => {

    const token = jwt.sign(
      payload,
      secret,
      {
        expiresIn
      } as SignOptions
    )

    return token;

}

const jwtTokenVarify = (token : string, secret : string) => {
    try {
        const varifyToken = jwt.verify(token,secret);
        return {
           success : true,
           data : varifyToken
        }
    } catch (error : any) {
        return {
           success : false ,
           error : error.message
        }
    }
}
export const jwtToken = {
   jwtTokenCreate,
   jwtTokenVarify
}