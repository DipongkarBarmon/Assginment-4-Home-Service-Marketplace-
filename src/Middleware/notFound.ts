import { Request, Response } from "express";

export const notFound = (req : Request, res : Response) =>{
    return res.status(404).json({
        message : "Route not found!",
        url : req.originalUrl,
        date : Date()
    })
}