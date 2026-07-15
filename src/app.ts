
import express, { Request, Response } from 'express'
import { authRouter } from './Modules/auth/auth.route.js'
import cors from 'cors'
import config from './config/index.js'
import cookieParser from 'cookie-parser'
import { globalErrorhandler } from './Middleware/globalErrorHandler.js'
import { notFound } from './Middleware/notFound.js'
import { technicianRouter } from './Modules/technician/technician.route.js'
import { serviceRouter } from './Modules/service/service.route.js'
import { categoryRouter } from './Modules/categroy/category.route.js'
import { availabilityRouter } from './Modules/availability/availablility.route.js'
import { bookingRouter } from './Modules/bookings/booking.route.js'
import { adminRouter } from './Modules/admin/admin.route.js'
import { paymentRouter } from './Modules/payment/payment.route.js'
import { reviewRouter } from './Modules/review/review.route.js'
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
app.use('/api/admin',adminRouter)
app.use('/api/technician',technicianRouter)
app.use('/api/category',categoryRouter)
app.use('/api/service',serviceRouter)
app.use('/api/availability',availabilityRouter)
app.use('/api/booking',bookingRouter)
app.use('/api/payments',paymentRouter)
app.use('/api/reviews',reviewRouter)



app.use(globalErrorhandler)
app.use(notFound)
export default app

 