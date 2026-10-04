import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Check, LayoutDashboard, ListTodo, LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import './index.css';
import { createAccount, currentUser, signIn, signOut } from './services/localStore';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';

function Auth({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      const name = mode === 'register' ? await createAccount(username, password) : await signIn(username, password);
      onLogin(name);
    } catch (err) { setError(err.message || 'Could not save your account in this browser.'); }
    finally { setBusy(false); }
  }

  return <main className="grid min-h-screen place-items-center p-5">
    <form onSubmit={submit} className="w-full max-w-sm space-y-4 border border-line bg-panel p-7">
      <div className="mb-6"><span className="mb-4 inline-grid h-10 w-10 place-items-center bg-accent text-white"><Check size={20}/></span>
        <h1 className="text-2xl font-semibold">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="mt-1 text-sm text-muted">A simple place to keep track of your coding practice.</p>
      </div>
      <label className="block text-sm font-medium">Username<input autoComplete="username" className="input mt-1" required minLength="3" maxLength="24" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. kriti_codes"/></label>
      <label className="block text-sm font-medium">Password<input autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className="input mt-1" type="password" required minLength="8" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters"/></label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button className="btn-primary w-full" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
      <button type="button" className="w-full text-sm text-accent" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>{mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button>
      <p className="border-t border-line pt-3 text-xs text-muted">Your account and tracker stay in this browser. No server account is created.</p>
    </form>
  </main>;
}

function App() {
  const [user, setUser] = useState(() => currentUser());
  const [page, setPage] = useState('dashboard');
  const [menu, setMenu] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('pt_theme') === 'dark');
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); localStorage.setItem('pt_theme', dark ? 'dark' : 'light'); }, [dark]);
  if (!user) return <Auth onLogin={setUser}/>;
  const navigation = [['dashboard', 'Overview', LayoutDashboard], ['problems', 'Problems', ListTodo]];
  function logout() { signOut(); setUser(null); setPage('dashboard'); }
  return <div className="min-h-screen lg:flex">
    <aside className={`${menu ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 z-30 w-64 border-r border-line bg-panel px-4 py-5 transition-transform lg:static lg:translate-x-0`}>
      <div className="mb-9 flex items-center justify-between px-2"><b className="text-lg tracking-tight">Progress Tracker</b><button className="lg:hidden" onClick={() => setMenu(false)} aria-label="Close menu"><X size={18}/></button></div>
      <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted">Workspace</p>
      <nav className="space-y-1">{navigation.map(([id, label, Icon]) => <button key={id} onClick={() => { setPage(id); setMenu(false); }} aria-current={page === id ? 'page' : undefined} className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm ${page === id ? 'bg-accent/10 font-semibold text-accent' : 'text-muted hover:bg-soft hover:text-ink'}`}><Icon size={17}/>{label}</button>)}</nav>
      <div className="absolute inset-x-4 bottom-4 flex items-center justify-between border-t border-line pt-4"><div><p className="text-sm font-medium">{user}</p><p className="text-xs text-muted">Your local account</p></div><button title="Sign out" onClick={logout} className="p-2 text-muted hover:text-ink"><LogOut size={17}/></button></div>
    </aside>
    {menu && <button aria-label="Close navigation" className="fixed inset-0 z-20 bg-black/20 lg:hidden" onClick={() => setMenu(false)}/>}
    <main className="min-w-0 flex-1"><header className="flex h-14 items-center justify-between border-b border-line bg-panel px-5 lg:px-8"><button className="rounded-md p-1 text-muted hover:bg-soft hover:text-ink lg:hidden" onClick={() => setMenu(true)} aria-label="Open menu"><Menu size={19}/></button><span className="hidden text-xs text-muted lg:block">Coding practice, at your pace</span><button className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted hover:bg-soft hover:text-ink" onClick={() => setDark(!dark)}>{dark ? <Sun size={16}/> : <Moon size={16}/>} {dark ? 'Light mode' : 'Dark mode'}</button></header><div className="mx-auto max-w-7xl p-5 lg:p-8">{page === 'dashboard' ? <Dashboard username={user} onAdd={() => setPage('problems')}/> : <Problems username={user}/>}</div></main>
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
