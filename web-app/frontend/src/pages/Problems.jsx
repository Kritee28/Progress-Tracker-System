import React, { useMemo, useState } from 'react';
import { Plus, Search, Trash2, Pencil } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { getProblems, saveProblems } from '../services/localStore';

const empty = { title: '', platform: '', url: '', topic: '', difficulty: 'Medium', notes: '', status: 'todo' };
const formatDate = (value) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value)) : '—';
export default function Problems({ username }) {
  const [rows, setRows] = useState(() => getProblems(username));
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ topic: '', difficulty: '', status: '' });
  const [sort, setSort] = useState('recent');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const topics = [...new Set(rows.map((problem) => problem.topic).filter(Boolean))].sort();
  const shown = useMemo(() => rows.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()) && (!filters.topic || p.topic === filters.topic) && (!filters.difficulty || p.difficulty === filters.difficulty) && (!filters.status || p.status === filters.status)).sort((a, b) => sort === 'alpha' ? a.title.localeCompare(b.title) : sort === 'old' ? new Date(a.createdAt) - new Date(b.createdAt) : sort === 'difficulty' ? ['Easy', 'Medium', 'Hard'].indexOf(a.difficulty) - ['Easy', 'Medium', 'Hard'].indexOf(b.difficulty) : new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)), [rows, query, filters, sort]);
  function refresh(next, message) { setRows(next); saveProblems(username, next); if (message) { setNotice(message); setTimeout(() => setNotice(''), 2500); } }
  function open(problem = null) { setEditing(problem); setForm(problem ? { ...empty, ...problem } : { ...empty }); setError(''); setModal(true); }
  function save(event) { event.preventDefault(); setError(''); const clean = { ...form, title: form.title.trim(), topic: form.topic.trim(), platform: form.platform.trim(), url: form.url.trim(), notes: form.notes.trim() };
    if (!clean.title) { setError('Please enter a problem title.'); return; }
    if (clean.url && !/^https?:\/\//i.test(clean.url)) { setError('Enter a complete link starting with http:// or https://.'); return; }
    const now = new Date().toISOString();
    if (editing) refresh(rows.map((p) => p.id === editing.id ? { ...p, ...clean, solvedAt: clean.status === 'solved' ? (p.solvedAt || now) : null, updatedAt: now } : p), 'Changes saved.');
    else refresh([{ ...clean, id: crypto.randomUUID(), createdAt: now, updatedAt: now, solvedAt: null }, ...rows], 'Problem added.');
    setModal(false);
  }
  function toggle(problem) { const solved = problem.status !== 'solved'; const now = new Date().toISOString(); refresh(rows.map((p) => p.id === problem.id ? { ...p, status: solved ? 'solved' : 'todo', solvedAt: solved ? now : null, updatedAt: now } : p), solved ? 'Marked as solved.' : 'Moved back to To do.'); }
  function remove(problem) { if (!window.confirm(`Delete “${problem.title}”? This cannot be undone.`)) return; refresh(rows.filter((p) => p.id !== problem.id), 'Problem deleted.'); }

  return <>
    <PageHeader eyebrow="Practice library" title="Problems" description="Keep your coding practice organized in one place." action={<button onClick={() => open()} className="btn-primary"><Plus size={16}/> Add problem</button>}/>
    {notice && <p role="status" className="mb-3 text-sm text-accent">{notice}</p>}
    <section className="card"><div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
      <label className="relative lg:col-span-2"><Search size={16} className="absolute left-3 top-3 text-muted"/><input className="input pl-9" placeholder="Search problem titles" value={query} onChange={(e) => setQuery(e.target.value)}/></label>
      <select className="input" value={filters.topic} onChange={(e) => setFilters({ ...filters, topic: e.target.value })}><option value="">All topics</option>{topics.map((topic) => <option key={topic}>{topic}</option>)}</select>
      <select className="input" value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}><option value="">All difficulty</option>{['Easy', 'Medium', 'Hard'].map((x) => <option key={x}>{x}</option>)}</select>
      <select className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All status</option>{['todo', 'attempted', 'solved'].map((x) => <option key={x} value={x}>{x === 'todo' ? 'To do' : x[0].toUpperCase() + x.slice(1)}</option>)}</select>
      <select className="input lg:col-start-5" value={sort} onChange={(e) => setSort(e.target.value)}><option value="recent">Recently updated</option><option value="old">Oldest first</option><option value="difficulty">Difficulty</option><option value="alpha">Alphabetical</option></select>
    </div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-line text-xs text-muted"><th className="p-3 font-medium">Problem</th><th className="p-3 font-medium">Platform</th><th className="p-3 font-medium">Topic</th><th className="p-3 font-medium">Difficulty</th><th className="p-3 font-medium">Status</th><th className="p-3 font-medium">Solved date</th><th className="p-3 font-medium">Actions</th></tr></thead><tbody>{shown.map((p) => <tr key={p.id} className="border-b border-line last:border-0 hover:bg-soft/60"><td className="p-3 font-medium">{p.url ? <a href={p.url} target="_blank" rel="noreferrer" className="hover:text-accent">{p.title} ↗</a> : p.title}{p.notes && <p className="mt-1 max-w-xs truncate text-xs font-normal text-muted">{p.notes}</p>}</td><td className="p-3 text-muted">{p.platform || '—'}</td><td className="p-3 text-muted">{p.topic || '—'}</td><td className="p-3">{p.difficulty}</td><td className="p-3"><button onClick={() => toggle(p)} className={`rounded px-2 py-1 text-xs font-medium ${p.status === 'solved' ? 'bg-accent/10 text-accent' : 'bg-soft text-muted'} hover:opacity-80`}>{p.status === 'todo' ? 'To do' : p.status}</button></td><td className="p-3 text-muted">{formatDate(p.solvedAt)}</td><td className="p-3"><button className="mr-3 rounded p-1 text-muted hover:bg-soft hover:text-ink" onClick={() => open(p)} aria-label={`Edit ${p.title}`}><Pencil size={15}/></button><button className="rounded p-1 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950" onClick={() => remove(p)} aria-label={`Delete ${p.title}`}><Trash2 size={15}/></button></td></tr>)}</tbody></table>
      {!shown.length && <div className="py-12 text-center"><p className="font-medium">{rows.length ? 'No matching problems.' : 'No problems added yet.'}</p><p className="mt-1 text-sm text-muted">{rows.length ? 'Try another search or filter.' : 'Add your first problem to get started.'}</p>{!rows.length && <button className="btn-primary mt-4" onClick={() => open()}>Add your first problem</button>}</div>}
    </div></section>
    {modal && <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(e) => e.target === e.currentTarget && setModal(false)}><form onSubmit={save} className="max-h-[95vh] w-full max-w-lg space-y-3 overflow-y-auto border border-line bg-panel p-6 shadow-xl"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{editing ? 'Edit problem' : 'Add a problem'}</h2><button type="button" className="rounded p-1 text-xl leading-none text-muted hover:bg-soft hover:text-ink" onClick={() => setModal(false)} aria-label="Close">×</button></div>
      <label className="block text-sm">Title<input className="input mt-1" placeholder="Problem name" required maxLength="255" autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}/></label>
      <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm">Platform<input className="input mt-1" placeholder="e.g. LeetCode" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}/></label><label className="text-sm">Topic<input className="input mt-1" placeholder="e.g. Arrays" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}/></label><label className="text-sm">Difficulty<select className="input mt-1" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>{['Easy', 'Medium', 'Hard'].map((x) => <option key={x}>{x}</option>)}</select></label><label className="text-sm">Problem link<input className="input mt-1" type="url" placeholder="https://… (optional)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}/></label></div>
      <label className="block text-sm">Notes<textarea className="input mt-1 min-h-24" placeholder="Approach, reminders, or what to revisit" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}/></label>
      {editing && <label className="block text-sm">Status<select className="input mt-1" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="todo">To do</option><option value="attempted">Attempted</option><option value="solved">Solved</option></select></label>}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}<div className="flex justify-end gap-2"><button type="button" className="btn-muted" onClick={() => setModal(false)}>Cancel</button><button className="btn-primary">{editing ? 'Save changes' : 'Add problem'}</button></div>
    </form></div>}
  </>;
}
