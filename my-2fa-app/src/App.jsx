import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [countdown, setCountdown] = useState(30); // เวลานับถอยหลังเริ่มต้นที่ 30 วินาที

  useEffect(() => {
    let interval;
    if (secret) {
      // ดึง 2FA code ทันทีเมื่อกรอก secret
      axios
        .post('http://localhost:5000/api/generate-2fa', { secret })
        .then((response) => {
          setToken(response.data.token);
        })
        .catch((error) => {
          console.error(error);
        });

      interval = setInterval(() => {
        // ลดเวลานับถอยหลังทุกๆ วินาที
        setCountdown((prev) => prev - 1);
      }, 1000); // อัพเดตทุกๆ 1 วินาที

      // รีเฟรช 2FA code ทุกๆ 30 วินาที
      const refreshInterval = setInterval(() => {
        axios
          .post('http://localhost:5000/api/generate-2fa', { secret })
          .then((response) => {
            setToken(response.data.token);
          })
          .catch((error) => {
            console.error(error);
          });

        setCountdown(30); // รีเซ็ตเวลานับถอยหลัง
      }, 30000); // รีเฟรชทุกๆ 30 วินาที

      return () => {
        clearInterval(interval);
        clearInterval(refreshInterval);
      };
    }
  }, [secret]); // ทำงานเมื่อ secret เปลี่ยนแปลง

  useEffect(() => {
    if (countdown === 0) {
      // เมื่อเวลาถึง 0 จะรีเฟรช 2FA code
      setCountdown(30); // รีเซ็ตเวลานับถอยหลัง
    }
  }, [countdown]);

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">2FA Code Reader</h1>
        <input
          className="input-field"
          type="text"
          placeholder="Enter 2FA Secret Key"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
        <div className="code-display">
          <h2>Current 2FA Code: {token}</h2>
        </div>
        <div className="countdown-display">
          <h3>Time Remaining: {countdown}s</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
