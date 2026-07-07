import app from "./app.js"
import config from "./config/index.js"
import { prisma } from "./lib/prisma.js"

const port = config.port
const main =async () =>{
   try {
     await prisma.$connect()
     console.log("Prisma connect successfully!")
     app.listen(port, ()=>{
        console.log(`Server start at port :http://localhost:${port}`)
     })
   } catch (error : any) {
      console.error("Error starting the server",error)
       await prisma.$disconnect()
       process.exit(1)
   }
}

main()