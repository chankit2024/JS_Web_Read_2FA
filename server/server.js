// server.js
const express = require('express');
const speakeasy = require('speakeasy');
const cors = require('cors');

const app = express();
const port = 5000;

// เปิดใช้งาน CORS
app.use(cors());

app.use(express.json());

app.post('/api/generate-2fa', (req, res) => {
  const { secret } = req.body;

  if (!secret) {
    return res.status(400).send('2FA secret is required');
  }

  const token = speakeasy.totp({
    secret: secret,
    encoding: 'base32'
  });

  res.json({ token });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
