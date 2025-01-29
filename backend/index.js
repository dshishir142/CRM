const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 8000;

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.post('/user', (req, res) => console.log(req.body));

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})