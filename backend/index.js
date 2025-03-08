const express = require('express');
const cors = require('cors');
const app = express();
const userRoute = require('./routes/userRoute.js');
const clientRoute = require('./routes/clientRoute.js');
const interactionRoute = require('./routes/interactionRoute.js');
const mailRoute = require('./routes/mailRoute.js');

const PORT = 8000;

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.use('/user',userRoute);
app.use('/client',clientRoute);
app.use('/interaction',interactionRoute);
app.use('/mail',mailRoute);

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})