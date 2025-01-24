const speakeasy = require('speakeasy');

// ตัวอย่าง 2FA key (Base32)
const secret = '7ZKMXHQH7P7HM355'; // แทนด้วย secret ของคุณ

// สร้าง 2FA code
const token = speakeasy.totp({
    secret: secret,
    encoding: 'base32',
});

console.log(`2FA Code: ${token}`);
