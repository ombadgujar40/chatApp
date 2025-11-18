// src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from "../context/authContext"; // adjust path if needed

export default function Login({ onSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'error'|'success', text }
  const { setTokenAndUser } = useAuth() || {};

  async function submit(e) {
    e.preventDefault();
    setMessage(null);

    if (mode === 'register' && !name.trim()) {
      setMessage({ type: 'error', text: 'Please enter your name.' });
      return;
    }
    if (!email.trim() || !password) {
      setMessage({ type: 'error', text: 'Email and password are required.' });
      return;
    }

    setLoading(true);
    try {
      const payload = { email: email.trim(), password };
      if (mode === 'register') payload.name = name.trim();

      const resp = await axios.post('http://127.0.0.1:5000/api/auth/login', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (!resp || !resp.data || !resp.data.ok) {
        const errMsg = resp?.data?.msg || 'Login failed';
        setMessage({ type: 'error', text: errMsg });
        setLoading(false);
        return;
      }

      const { token, user } = resp.data;

      // update local auth state (context)
      if (typeof setTokenAndUser === 'function') {
        setTokenAndUser(user, token);
      } else {
        // fallback: localStorage if context absent (helps debugging)
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      setMessage({ type: 'success', text: `Welcome ${user?.name || user?.email}` });
      setLoading(false);

      // IMPORTANT: call onSuccess so parent can navigate
      if (typeof onSuccess === 'function') {
        onSuccess(user, token);
      }
    } catch (err) {
      console.error('Login error', err.response?.data || err.message || err);
      const serverMsg = err.response?.data?.msg || err.response?.data?.error;
      setMessage({ type: 'error', text: serverMsg || 'Network or server error' });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-gradient p-6">
      <div className="w-full max-w-md bg-cardbg-40 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome</h1>
            <p className="text-sm text-muted">Sign in or create a testing account</p>
          </div>

          <div className="flex gap-2 mb-4 bg-transparent">
            <button
              type="button"
              onClick={() => { setMode('login'); setMessage(null); }}
              className={`flex-1 py-2 rounded-lg font-medium ${mode === 'login' ? 'bg-accent text-slate-900' : 'bg-white-2 text-white'}`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => { setMode('register'); setMessage(null); }}
              className={`flex-1 py-2 rounded-lg font-medium ${mode === 'register' ? 'bg-accent text-slate-900' : 'bg-white-2 text-white'}`}
            >
              Register
            </button>
          </div>

          {message && (
            <div className={`px-3 py-2 rounded mb-4 ${message.type === 'error' ? 'bg-[#ffebee] text-[#610000]' : 'bg-[#e6fffa] text-[#003a2f]'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={submit} className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="block text-sm text-white/80 mb-1">Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-transparent border border-white/5 text-white text-sm"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-white/80 mb-1">Email</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-transparent border border-white/5 text-white text-sm"
                placeholder="you@example.com"
                autoComplete="email"
                type="email"
              />
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1">Password</label>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-transparent border border-white/5 text-white text-sm"
                placeholder="Enter password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                type="password"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg font-semibold ${loading ? 'opacity-60 cursor-wait' : ''} bg-accent text-slate-900`}
              >
                {loading ? (mode === 'login' ? 'Logging in…' : 'Registering…') : (mode === 'login' ? 'Login' : 'Create account')}
              </button>
            </div>
          </form>

          <div className="mt-4 text-xs text-muted">
            <p>Testing mode: passwords are not hashed on server. Do not use real credentials.</p>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-white/5 text-center text-sm text-white/60 bg-transparent">
          <button
            onClick={() => {
              if (mode === 'login') { setEmail('alice@example.com'); setPassword('secret'); setName(''); }
              else { setEmail('alice@example.com'); setPassword('secret'); setName('Alice'); }
            }}
            className="underline"
          >
            Fill demo credentials
          </button>
        </div>
      </div>
    </div>
  );
}
