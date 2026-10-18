import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('Google Sign-In is not enabled yet in your Firebase Project. In Firebase Console, go to Authentication > Sign-in method, click Google, toggle Enable, select your support email, and click Save.');
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google Sign-In failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-app)' }}>
      <div className="auth-card" style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', width: '100%', maxWidth: '420px', border: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary)', color: 'white', marginBottom: '16px' }}>
            <GraduationCap size={26} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-heading)', marginBottom: '8px' }}>Welcome to GITA Connect</h2>
          <p style={{ color: 'var(--text-main)', fontSize: '14px' }}>Official Campus Portal • Autonomous College</p>
        </div>
        
        {error && <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '13px' }}>{error}</div>}

        {/* Google Quick Sign-In */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleSignIn}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            padding: '12px',
            backgroundColor: 'var(--bg-app)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: '600',
            fontSize: '14px',
            color: 'var(--text-heading)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s, border-color 0.2s',
            marginBottom: '16px'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>OR EMAIL</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-heading)', marginBottom: '6px' }}>College Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-app)', color: 'var(--text-heading)' }} placeholder="student@gita.edu" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-heading)', marginBottom: '6px' }}>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-app)', color: 'var(--text-heading)' }} placeholder="••••••••" />
          </div>
          
          <button disabled={loading} type="submit" style={{ marginTop: '8px', width: '100%', padding: '12px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: '600', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-main)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Create one</Link>
        </div>
      </div>
    </div>
  );
}
