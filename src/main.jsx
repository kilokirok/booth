import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // App.jsx가 모든 페이지를 연결하는 중심입니다.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)