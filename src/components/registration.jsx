import React, { useState, useEffect } from 'react';
import { ref, get, set, onValue } from "firebase/database"; // onValue 추가
import { db } from "../firebase";
import { QRCodeCanvas } from 'qrcode.react';
import '../App.css'; 

function Registration() {
  const [nickname, setNickname] = useState('');
  const [step, setStep] = useState('input'); 
  const [finalName, setFinalName] = useState('');
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState(0); // 점수 상태 추가

  // 실시간 점수 리스너 설정
  useEffect(() => {
    if (finalName && step === 'confirmed') {
      // participants/{이름}/points 경로를 실시간으로 감시합니다.
      const pointsRef = ref(db, `participants/${finalName}/points`);
      
      const unsubscribe = onValue(pointsRef, (snapshot) => {
        if (snapshot.exists()) {
          setPoints(snapshot.val());
        } else {
          setPoints(0);
        }
      });

      // 컴포넌트 언마운트 시 리스너 해제
      return () => unsubscribe();
    }
  }, [finalName, step]);

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
            
            {/* 점수 표시 섹션 추가 */}
            <div style={{
              margin: '20px 0',
              padding: '15px',
              backgroundColor: 'rgba(var(--success-rgb), 0.1)',
              borderRadius: '12px',
              border: '2px solid var(--success)'
            }}>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Current Points</p>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
                {points}
              </div>
            </div>

            <p>Show this QR code at any booth.</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Registration;