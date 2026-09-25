import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isSupabaseConfigured } from '../lib/supabase';
import { Mail, Lock, User, Phone, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
          <h1 className="font-display text-2xl font-bold text-sand-900 dark:text-sand-100 mb-3">
            Configuração Necessária
          </h1>
          <p className="text-sand-600 dark:text-sand-400 mb-6">
            O Duna precisa do Supabase configurado para funcionar. Siga os passos abaixo:
          </p>
          <div className="text-left bg-sand-50 dark:bg-sand-700 rounded-xl p-4 text-sm space-y-2 mb-6">
            <p><strong>1.</strong> Copie <code className="bg-sand-200 dark:bg-sand-600 px-1 rounded">.env.example</code> para <code className="bg-sand-200 dark:bg-sand-600 px-1 rounded">.env</code></p>
            <p><strong>2.</strong> Crie um projeto em <a href="https://supabase.com" target="_blank" rel="noopener" className="text-terra-500 underline">supabase.com</a></p>
            <p><strong>3.</strong> Execute <code className="bg-sand-200 dark:bg-sand-600 px-1 rounded">supabase/schema.sql</code> no SQL Editor</p>
            <p><strong>4.</strong> Preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env</p>
            <p><strong>5.</strong> Reinicie o servidor de desenvolvimento</p>
          </div>
          <a
            href="https://supabase.com/docs/guides/getting-started"
            target="_blank"
            rel="noopener"
            className="inline-block px-6 py-3 bg-terra-500 hover:bg-terra-600 text-white font-semibold rounded-xl transition-colors"
          >
            Ver documentação do Supabase
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-sand-900 dark:text-sand-50">Entrar</h1>
          <p className="text-sand-600 dark:text-sand-400 mt-2">Bem-vindo de volta ao Duna</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 md:p-8 card-shadow space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">E-mail</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">Senha</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-terra-500 focus:ring-terra-500" />
              <span className="text-sm text-sand-600 dark:text-sand-400">Lembrar-me</span>
            </label>
            <Link to="/reset-password" className="text-sm text-terra-600 dark:text-terra-400 hover:underline font-medium">
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-terra-500 hover:bg-terra-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 btn-press"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-sand-600 dark:text-sand-400 mt-6">
          Não tem uma conta?{' '}
          <Link to="/signup" className="text-terra-600 dark:text-terra-400 font-semibold hover:underline">
            Criar conta
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, fullName, phone);
    setLoading(false);

    if (result.success) {
      if (result.needsEmailConfirmation) {
        setSuccess(true);
      } else {
        navigate('/');
      }
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} className="text-green-500" />
          </div>
          <h1 className="font-display text-2xl font-bold text-sand-900 dark:text-sand-100 mb-3">
            Verifique seu e-mail
          </h1>
          <p className="text-sand-600 dark:text-sand-400 mb-6">
            Enviamos um link de confirmação para <strong>{email}</strong>. Clique no link para ativar sua conta.
          </p>
          <Link to="/signin" className="inline-block px-6 py-3 bg-terra-500 hover:bg-terra-600 text-white font-semibold rounded-xl transition-colors">
            Ir para login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-sand-900 dark:text-sand-50">Criar conta</h1>
          <p className="text-sand-600 dark:text-sand-400 mt-2">Junte-se à comunidade Duna</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 md:p-8 card-shadow space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">Nome completo</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200"
                placeholder="Seu nome"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">E-mail</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">Telefone (opcional)</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">Senha</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">Confirmar senha</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200"
                placeholder="Repita a senha"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-terra-500 hover:bg-terra-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 btn-press"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>

          <p className="text-xs text-center text-sand-500">
            Ao criar uma conta, você concorda com os Termos de Uso e Política de Privacidade da Duna.
          </p>
        </form>

        <p className="text-center text-sm text-sand-600 dark:text-sand-400 mt-6">
          Já tem uma conta?{' '}
          <Link to="/signin" className="text-terra-600 dark:text-terra-400 font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} className="text-green-500" />
          </div>
          <h1 className="font-display text-2xl font-bold text-sand-900 dark:text-sand-100 mb-3">
            E-mail enviado!
          </h1>
          <p className="text-sand-600 dark:text-sand-400 mb-6">
            Verifique sua caixa de entrada para o link de recuperação de senha.
          </p>
          <Link to="/signin" className="inline-block px-6 py-3 bg-terra-500 hover:bg-terra-600 text-white font-semibold rounded-xl transition-colors">
            Voltar ao login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-sand-900 dark:text-sand-50">Recuperar senha</h1>
          <p className="text-sand-600 dark:text-sand-400 mt-2">Enviaremos um link para redefinir sua senha</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-sand-800 rounded-2xl border border-sand-200 dark:border-sand-700 p-6 md:p-8 card-shadow space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-sand-500 block mb-2">E-mail</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-sand-50 dark:bg-sand-700 rounded-xl text-sm border border-sand-200 dark:border-sand-600 focus:outline-none focus:ring-2 focus:ring-terra-500/30 text-sand-800 dark:text-sand-200"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-terra-500 hover:bg-terra-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 btn-press"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>
        </form>

        <p className="text-center text-sm text-sand-600 dark:text-sand-400 mt-6">
          Lembrou a senha?{' '}
          <Link to="/signin" className="text-terra-600 dark:text-terra-400 font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
