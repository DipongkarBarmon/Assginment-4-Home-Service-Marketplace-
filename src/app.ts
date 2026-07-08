
import express, { Request, Response } from 'express'
import { authRouter } from './Modules/auth/auth.route.js'
import cors from 'cors'
import config from './config/index.js'
import cookieParser from 'cookie-parser'
import { globalErrorhandler } from './Middleware/globalErrorHandler.js'
import { notFound } from './Middleware/notFound.js'
import { technicianRouter } from './Modules/technician/technician.route.js'
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(express.text())
app.use(cors({
      origin: config.app_url,
    }))
app.use(cookieParser())


app.get('/',async(req : Request, res : Response) => {
    res.send("Hello, World!")
})


app.use('/api/auth',authRouter)
app.use('/api/technician',technicianRouter)


app.use(globalErrorhandler)
app.use(notFound)
export default app

 