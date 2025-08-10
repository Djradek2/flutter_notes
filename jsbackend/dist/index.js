import * as fs from 'fs';
import * as http from 'http';
import express from 'express';
const app = express();
const options = {
    key: fs.readFileSync('key/localhost-key.pem'),
    cert: fs.readFileSync('key/localhost-cert.pem')
};
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// app.listen('3003', () => {
//   console.log(`Example app listening on port 3003`)
// })
// Middleware example
//app.use(express.json());
// app.get('/', (req, res) => {
//   console.log("yo")
//   res.json({ message: 'Hello from HTTPS Express!' });
// });
//const server = https.createServer(options, app);
const server = http.createServer(app);
server.on('error', (err) => {
    console.error('Server error:', err);
});
server.listen(3003, () => {
    console.log('HTTP(S) Server running on https://localhost:3003');
});
//# sourceMappingURL=index.js.map