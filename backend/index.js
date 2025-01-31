const express = require('express');
const cors = require('cors');
const app = express();
const userRoute = require('./routes/userRoute.js');

const PORT = 8000;

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.use('/user',userRoute);

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})