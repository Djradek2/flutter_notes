import 'dotenv/config';
import * as http from 'http';
import * as bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import { db } from './drizzle/db.js';
import { member, notes } from './drizzle/migrations/schema.js';
import { migrate } from 'drizzle-orm/node-postgres/migrator' 
import postgres from 'postgres';
import { lt } from 'drizzle-orm';
import { getUserNotes, backupToDB } from './utils/helper.js'
import type { Request } from "express";

interface UserRequest extends Request {
  user: number;
}

function authenticate (req: any, res: any, next: Function) { //authenticates, but doesn't handle authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, payload: any) => {
    if (err) return res.sendStatus(403);
    req.user = payload.id;
    next();
  });
}

const app = express();
app.use(express.json())

app.get('/', async (req, res) => { //TODO: remove, debug endpoint
  await backupToDB(1, '[{"title":"First Note","text":"a bunch of text that should be shown"}]')
  res.send('Hello World!')
})

app.post('/login', async (req, res) => {
  const { req_username, req_password } = req.body;
  
  const users = await db //you should look for the user through db, not parse everyone on the server
  .select({
    id: member.id,
    name: member.name,
    password: member.password,
    createdAt: member.createdAt,
  })
  .from(member)

  const user = users.find(u => u.name === req_username); // TODO: not certain this works
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(req_password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id },                        // payload
    process.env.JWT_SECRET as string,       // secret
    { expiresIn: '1h' }                     // options
  );

  res.json({ message: token });
});

app.get('/reload_backup', authenticate, async (req, res) => {
  var userReq = req as UserRequest
  var result = await getUserNotes(userReq.user)
  if (result) {
    res.json(result)
  } else {
    res.json({ message: 'Failed to restore backup!' });
  }
})

app.post('/backup_notes', authenticate, async (req, res) => {
  var userReq = req as UserRequest
  if (await backupToDB(userReq.user, userReq.body)) {
    res.json({ message: 'Success!' });
  } else {
    res.json({ message: 'Failed to save backup!' });
  }
})

const server = http.createServer(app);
server.on('error', (err) => {
  console.error('Server error:', err);
});
server.listen(3003, () => {
  console.log('HTTP(S) Server running on https://localhost:3003');
});
