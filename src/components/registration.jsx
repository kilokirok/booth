import React, { useState, useEffect } from 'react';
import { ref, get, set } from "firebase/database";
import { db } from "../firebase";
import { QRCodeCanvas } from 'qrcode.react';
import '../App.css'; // CSS 파일 임포트

function Registration() {
  const [nickname, setNickname] = useState('');
  const [step, setStep] = useState('input'); 
  const [finalName, setFinalName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('myEventId');
    if (savedName) {
      setFinalName(savedName);
      setStep('confirmed');
    }
  }, []);

  const handleCheckNickname = async () => {
    if (!nickname.trim()) return;
    setLoading(true);
    try {
      const userRef = ref(db, `participants/${nickname.trim()}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const randomNum = Math.floor(Math.random() * 90 + 10);
        setFinalName(`${nickname.trim()}${randomNum}`);
        setStep('suggest');
      } else {
        await registerUser(nickname.trim());
      }
    } catch (error) {
      alert("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (name) => {
    setLoading(true);
    try {
      await set(ref(db, `participants/${name}`), {
        nickname: name,
        points: 0,
        registeredAt: new Date().toISOString()
      });
      setFinalName(name);
      setStep('confirmed');
      localStorage.setItem('myEventId', name);
    } catch (error) {
      alert("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        {step === 'input' && (
          <>
            <h1>Event Check-in</h1>
            <p>Enter your nickname to start!</p>
            <input 
              placeholder="Your Nickname" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={loading}
            />
            <button onClick={handleCheckNickname} disabled={loading}>
              {loading ? "Checking..." : "Join Event"}
            </button>
          </>
        )}

        {step === 'suggest' && (
          <>
            <h1 style={{ color: 'var(--danger)' }}>Name Taken!</h1>
            <p>Use <strong>{finalName}</strong> instead?</p>
            <div className="flex-group">
              <button onClick={() => registerUser(finalName)} disabled={loading}>
                Yes
              </button>
              <button 
                onClick={() => setStep('input')} 
                className="btn-secondary"
                disabled={loading}
              >
                No
              </button>
            </div>
          </>
        )}

        {step === 'confirmed' && (
          <>
            <h1 style={{ color: 'var(--success)' }}>Registered!</h1>
            <div className="qr-wrapper">
              <QRCodeCanvas value={finalName} size={220} level="H" includeMargin={true} />
            </div>
            <h2>{finalName}</h2>
            <p>Show this QR code at any booth.</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Registration;