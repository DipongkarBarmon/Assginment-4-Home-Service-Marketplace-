
import dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({
   path : path.join(process.cwd(),'./.env')
})

const config = {
   connection_string : process.env.DATABASE_URL,
   port : process.env.PORT,
   app_url : process.env.APP_URL,
   bcrypt_salt_rounds : process.env.BCRYPT_SALT_ROUNDS,
   jwt_accress_token : process.env.JWT_ACCESS_TOKEN!,
   jwt_refresh_token : process.env.JWT_REFRESH_TOKEN!,
   jwt_access_expires_in : process.env.JWT_ACCESS_EXPIRES_IN!,
   jwt_refresh_expires_in : process.env.JWT_PREFRESH_EXPIRES_IN!,
}

export default config