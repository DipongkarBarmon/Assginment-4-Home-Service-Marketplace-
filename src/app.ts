
import express, { Request, Response } from 'express'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(express.text())

app.get('/',async(req : Request, res : Response) => {
    res.send("Hello, World!")
})

export default app