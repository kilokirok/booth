import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ref, get, update } from "firebase/database";
import { db } from "../firebase";
import '../App.css';

function Scanner() {
  const [scanResult, setScanResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      // 이미 처리 중이면 중복 실행 방지
      if (isProcessing) return;
      
      setIsProcessing(true);
      setScanResult(result);

      // 1. 점수 입력받기 (기본값 10점)
      const pointToAdd = window.prompt(`[${result}]님에게 부여할 점수를 입력하세요`, "10");

      if (pointToAdd !== null) {
        const scoreNum = parseInt(pointToAdd);
        
        if (isNaN(scoreNum)) {
          alert("숫자만 입력 가능합니다. 다시 시도해주세요.");
        } else {
          try {
            const userRef = ref(db, `participants/${result}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
              const currentPoints = snapshot.val().points || 0;
              
              // 2. Firebase 점수 업데이트 (기존 점수 + 새 점수)
              await update(userRef, {
                points: currentPoints + scoreNum
              });

              alert(`✅ 업데이트 완료!\n대상: ${result}\n추가 점수: ${scoreNum}\n현재 총점: ${currentPoints + scoreNum}`);
            } else {
              alert("❌ 등록되지 않은 사용자입니다.");
            }
          } catch (error) {
            console.error(error);
            alert("데이터베이스 업데이트 중 오류가 발생했습니다.");
          }
        }
      }

      // 3. 잠시 후 다음 스캔 가능하도록 초기화
      setTimeout(() => {
        setIsProcessing(false);
        setScanResult(null);
      }, 2000); 
    }

    function onScanError(err) {
      // 스캔 에러는 로그에 찍지 않고 조용히 넘깁니다 (너무 자주 발생함)
    }

    return () => {
      scanner.clear().catch(error => console.error("Scanner cleanup failed", error));
    };
  }, [isProcessing]);

  return (
    <div className="container">
      <div className="card">
        <h1>Booth Scanner</h1>
        <p>Scan participant's QR code to give points.</p>
        
        <div id="reader" style={{ width: '100%' }}></div>

        {scanResult && (
          <div style={{ marginTop: '20px', color: 'var(--success)', fontWeight: 'bold' }}>
            Last Scanned: {scanResult}
          </div>
        )}
        
        <div style={{ marginTop: '20px' }}>
            <button onClick={() => window.location.reload()} className="btn-secondary">
                Reset Scanner
            </button>
        </div>
      </div>
    </div>
  );
}

export default Scanner;