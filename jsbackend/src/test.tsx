import { PrismaClient } from '../generated/prisma'
import { Request, Response, NextFunction, express } from 'express';

const prisma = new PrismaClient()

prisma.$connect()

testing()

async function testing() {
  console.log(await prisma.notes.findMany())
}

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})