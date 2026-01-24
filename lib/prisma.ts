import { PrismaMariaDb } from "@prisma/adapter-mariadb"; 
import { PrismaClient } from "./generated/prisma/client"; 
 
const adapter = new PrismaMariaDb({ 
    host:"localhost", 
    port:3306, 
    user:"root", 
    password:"", 
    database:"rms-next", 
    connectionLimit:5 
}) 
 
export const prisma = new PrismaClient({adapter});