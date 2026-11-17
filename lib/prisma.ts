import { PrismaClient } from '@prisma/client' 
 
 
if (process.env.NODE_ENV !== 'production') global.prisma = prisma 
 
export default prisma 
