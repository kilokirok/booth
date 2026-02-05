import React, { useEffect, useState } from 'react';
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase";
import '../App.css'; // 공통 스타일 적용

function Admin() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const participantsRef = ref(db, 'participants');
    
    // 실시간으로 DB 변화 감지
    const unsubscribe = onValue(participantsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // 객체 형태를 배열로 변환하고 포인트가 높은 순으로 정렬
        const sortedList = Object.values(data).sort((a, b) => b.points - a.points);
        setList(sortedList);
      } else {
        setList([]);
      }
    });

    return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
  }, []);

  const copyData = () => {
    if (list.length === 0) {
      alert("No data to copy!");
      return;
    }
    // 요청하신 형식: Nickname * Points, Nickname * Points
    const text = list.map(p => `${p.nickname} * ${p.points}`).join(', ');
    
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="card" style={{ textAlign: 'left' }}>
        <h1 style={{ textAlign: 'center' }}>Admin Dashboard</h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <p>Total Participants: <strong>{list.length}</strong></p>
          <button onClick={copyData}>
            📋 Copy Raffle List (Text)
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nickname</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Points</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.nickname} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px' }}>{p.nickname}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                    {p.points}
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan="2" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    No participants yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
          Data updates in real-time.
        </p>
      </div>
    </div>
  );
}

export default Admin;