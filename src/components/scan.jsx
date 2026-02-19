import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ref, get, update } from "firebase/database";
import { db } from "../firebase";
import '../App.css';

function Scanner() {
  const [scanResult, setScanResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cooldown, setCooldown] = useState(false); // 7초 대기 상태 추가

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

    scanner.render(onScanSuccess, onScanError);

    async function onScanSuccess(result) {
      // 처리 중이거나 7초 쿨타임 중이면 스캔 무시
      if (isProcessing || cooldown) return;
      
      setIsProcessing(true);
      setScanResult(result);

      const pointToAdd = window.prompt(`How many points for [${result}]?`, "10");

      if (pointToAdd !== null) {
        const scoreNum = parseInt(pointToAdd);
        
        if (isNaN(scoreNum)) {
          alert("Please enter numbers only.");
        } else {
          try {
            const userRef = ref(db, `participants/${result}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
              const currentPoints = snapshot.val().points || 0;
              await update(userRef, {
                points: currentPoints + scoreNum
              });
              alert(`Success!\nUser: ${result}\nAdded: ${scoreNum}\nTotal: ${currentPoints + scoreNum}`);
            } else {
              alert("User not found.");
            }
          } catch (error) {
            console.error(error);
            alert("Database error occurred.");
          }
        }
      }

      // 점수 처리가 끝나면 7초 동안 쿨타임 적용
      setScanResult(null);
      setIsProcessing(false);
      setCooldown(true);

      setTimeout(() => {
        setCooldown(false);
      }, 1500); // 7000ms = 7초
    }

    function onScanError(err) {
      // 스캔 에러 무시
    }

    return () => {
      scanner.clear().catch(error => console.error("Scanner cleanup failed", error));
    };
  }, [isProcessing, cooldown]);

  return (
    <div className="container">
      <div className="card">
        <h1>Booth Scanner</h1>
        <p>Scan QR code to give points.</p>
        
        <div id="reader" style={{ width: '100%' }}></div>

        {cooldown && (
          <div style={{ marginTop: '20px', color: 'var(--danger)', fontWeight: 'bold' }}>
            Wait for a second for next scan...
          </div>
        )}

        {scanResult && !cooldown && (
          <div style={{ marginTop: '20px', color: 'var(--success)', fontWeight: 'bold' }}>
            Processing: {scanResult}
          </div>
        )}
        
        <div style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>
                Next scan will be available automatically after a second.
            </p>
        </div>
      </div>
    </div>
  );
}

export default Scanner;