const express = require('express');
const app = express();
const PORT = process.env.PORT || 8002;

function logEmailOpen(emailId) {
    console.log(`📬 Email opened for ID: ${emailId} at ${new Date().toISOString()}`);
}

app.get('/pixel/:emailId', (req, res) => {
    const emailId = req.params.emailId;

    if (!emailId) {
        return res.status(400).send('Missing email ID');
    }

    logEmailOpen(emailId);

    const pixelBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=',
        'base64'
    );

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', pixelBuffer.length);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(pixelBuffer);
});

app.listen(PORT, () => {
    console.log(`📡 Pixel server running on port ${PORT}`);
});
