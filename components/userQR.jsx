// UserQR.jsx
import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

function UserQR({ nickname }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
        Your Entry Pass
      </h2>
      
      <div style={{ 
        background: 'white', 
        padding: '16px', 
        display: 'inline-block', 
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)' // 약간의 그림자를 넣으면 더 예뻐요
      }}>
        <QRCodeCanvas 
          value={nickname} 
          size={200}       
          level={"H"}      
          includeMargin={true}
        />
      </div>

      <p style={{ marginTop: '15px', color: '#666', fontSize: '1.1rem' }}>
        Nickname: <strong>{nickname}</strong>
      </p>
      <p style={{ color: '#888' }}>Show this to the booth staff!</p>
    </div>
  );
}

export default UserQR;