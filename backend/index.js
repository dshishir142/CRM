const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');
const app = express();
const userRoute = require('./routes/userRoute.js');
const clientRoute = require('./routes/clientRoute.js');
const interactionRoute = require('./routes/interactionRoute.js');
const mailRoute = require('./routes/mailRoute.js');
const { scheduleNotifications } = require('./controllers/notificationController.js');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log("A new client connected");

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === "register" && data.agent_id) {
                console.log(`Agent ${data.agent_id} registered for notifications`);
                scheduleNotifications(data.agent_id, ws);
            }
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    });

    ws.on('close', () => {
        console.log('A client disconnected');
    });

    ws.send(JSON.stringify({ type: 'notification', message: "Welcome! Notifications will be sent here." }));
});

const PORT = 8000;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/user', userRoute);
app.use('/client', clientRoute);
app.use('/interaction', interactionRoute);
app.use('/mail', mailRoute);

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
