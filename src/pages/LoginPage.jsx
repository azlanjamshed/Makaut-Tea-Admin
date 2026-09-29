import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { ShieldCheck, Mail, Lock, AlertCircle } from 'lucide-react';
import appLogo from '../assets/logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAdminAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      await login({ email: email.trim(), password });
      showToast('Welcome to Rantea Admin Center', 'success');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.message || 'Invalid credentials or unauthorized account';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center p-4 selection:bg-[var(--color-primary)] selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* University Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex w-16 h-16 rounded-2xl overflow-hidden border border-[var(--border-color)] items-center justify-center bg-white shadow-xs">
            <img src={appLogo} alt="MAKAU-TEA" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[var(--color-primary)] block mb-1">
              MAKAU-TEA CONTROL CENTER
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              Admin Login
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Authorized university administrators only
            </p>
          </div>
        </div>

        {/* Login Form Box */}
        <div className="bg-white border border-[var(--border-color)] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@makaut.edu"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
            />

            <Input
              label="Password"
              isPassword
              placeholder="••••••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full font-bold shadow-xs"
              >
                Sign In to Dashboard
              </Button>
            </div>
          </form>

          <div className="pt-4 border-t border-[var(--border-color)] text-center flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure TLS Access · Audit logs enabled</span>
          </div>
        </div>

        {/* Quick Credentials Hint in Dev */}
        <div className="text-center text-[11px] text-slate-500 font-mono">
          <span>Need admin access? Run </span>
          <code className="text-[var(--color-primary)] bg-white px-2 py-0.5 rounded-lg border border-[var(--border-color)] font-semibold shadow-2xs">
            npm run seed:admin
          </code>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
