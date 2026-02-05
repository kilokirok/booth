import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ref, runTransaction } from "firebase/database";
import { db } from "../../firebase";
import '../App.css'; // 공통 스타일 적용

function Scanner() {
  const [lastScanned, setLastScanned] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // 스캐너 설정: fps는 초당 프레임, qrbox는 스캔 영역 크기
    const scanner = new Html5QrcodeScanner("reader", { 
      fps: 10, 
      qrbox: { width: 250, height: 250 } 
    });

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText) {
      if (isProcessing) return; // 이미 처리 중이면 중복 실행 방지
      
      handleAddPoint(decodedText);
    }

    function onScanFailure(error) {
      // 스캔 실패(QR이 카메라에 안 보일 때)는 조용히 무시
    }

    return () => scanner.clear(); // 컴포넌트 언마운트 시 스캐너 종료
  }, [isProcessing]);

  const handleAddPoint = async (nickname) => {
    setIsProcessing(true);
    const userRef = ref(db, `participants/${nickname}`);

    try {
      await runTransaction(userRef, (user) => {
        if (user) {
          user.points = (user.points || 0) + 1;
        }
        return user;
      });

      // 성공 피드백
      setLastScanned(nickname);
      if (navigator.vibrate) navigator.vibrate(100); // 폰 진동 (지원되는 기기만)
      
    } catch (error) {
      console.error("Transaction failed: ", error);
      alert("Error: Participant not found or connection issue.");
    } finally {
      // 2초 후 다음 스캔이 가능하도록 딜레이 (연속 중복 스캔 방지)
      setTimeout(() => setIsProcessing(false), 2000);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Booth Scanner</h1>
        <p>Scan participant's QR code</p>
        
        {/* 스캐너가 렌더링될 영역 */}
        <div id="reader" style={{ width: '100%', marginTop: '1.5rem' }}></div>

        {lastScanned && (
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: '#dcfce7', 
            color: '#166534', 
            borderRadius: '0.75rem',
            fontWeight: 'bold' 
          }}>
            ✅ Successfully added point to: {lastScanned}
          </div>
        )}

        {isProcessing && <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Processing...</p>}
        
        <div style={{ marginTop: '2rem', textAlign: 'left', fontSize: '0.9rem', color: '#64748b' }}>
          <strong>Tips:</strong>
          <ul style={{ paddingLeft: '1.2rem' }}>
            <li>Make sure the user's screen is bright.</li>
            <li>Hold the phone steady for 1-2 seconds.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Scanner;