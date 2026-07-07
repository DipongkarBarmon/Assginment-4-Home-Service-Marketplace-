import type { JwtPayload } from "jsonwebtoken";

declare global{
    namespace Express {
        interface Request {
            user: JwtPayload
        }
    }
}

//https://dev.to/kwabenberko/extend-express-s-request-object-with-typescript-declaration-merging-1nn5
//https://chatgpt.com/c/6a1a3595-0958-83e9-ae55-aaef94386be7