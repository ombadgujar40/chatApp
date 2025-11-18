import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './componenets/Login';
import ChatAppTailwind from './componenets/ChatAppTailwind';
import './index.css';

function LoginWrapper() {
  const navigate = useNavigate();

  return (
    <Login
      onSuccess={(user, token) => {
        console.log('logged in', user, token);
        navigate('/chat');  // redirect after login
      }}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginWrapper />} />
        <Route path="/chat" element={<ChatAppTailwind />} />
      </Routes>
    </BrowserRouter>
  );
}
