import { Response } from "express";

interface TMeta {

   page :  number,
   limit : number,
   total : number

}

interface TResponse<T> {

    success : boolean,
    statusCode : number,
    message : String,
    data : T,
    meta? :TMeta

}



  const sendRespons = <T>(res : Response, data :TResponse<T>) => {
     return res.status(data.statusCode).json({
        success : data.success,
        statusCode : data.statusCode,
        message : data.message,
        data : data.data,
        meta : data.meta
     })
}

export default sendRespons;