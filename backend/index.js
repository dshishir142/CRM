const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');
const app = express();
const userRoute = require('./routes/userRoute.js');
const clientRoute = require('./routes/clientRoute.js');
const interactionRoute = require('./routes/interactionRoute.js');
const mailRoute = require('./routes/mailRoute.js');

const server = http.createServer(app)
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log("A new client connected");

    ws.on('close', () => {
        console.log('A client disconnected');
    })

    ws.on('message', (message) => {
        console.log(`There is a new message ${message}`);
    })

    ws.send(JSON.stringify({ type : 'notification', message : "Welcome to the server"}));
})



const PORT = 8000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/user', userRoute);
app.use('/client', clientRoute);
app.use('/interaction', interactionRoute);
app.use('/mail', mailRoute);

server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})

wss.on('listening', ()=>{
    console.log("WebSocket server is listening to port 8000");
})