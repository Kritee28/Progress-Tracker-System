import React, { useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import { getProblems } from '../services/localStore';

export default function Dashboard({ username, onAdd }) {
  const problems = useMemo(() => getProblems(username), [username]);
  const solved = problems.filter((p) => p.status === 'solved');
  const today = new Date().toLocaleDateString();
  const thisWeek = solved.filter((p) => p.solvedAt && Date.now() - new Date(p.solvedAt).getTime() < 7 * 86400000).length;
  const dates = new Set(solved.map((p) => new Date(p.solvedAt).toLocaleDateString()));
  let streak = 0; const date = new Date();
  if (!dates.has(date.toLocaleDateString())) date.setDate(date.getDate() - 1);
  while (dates.has(date.toLocaleDateString())) { streak++; date.setDate(date.getDate() - 1); }
  const recent = [...solved].sort((a, b) => new Date(b.solvedAt) - new Date(a.solvedAt)).slice(0, 5);
  return <>
    <PageHeader eyebrow={today} title="Your practice" description={problems.length ? 'A quick look at the work you have logged.' : 'Welcome! Add a coding problem when you are ready to start.'} action={<button className="btn-primary" onClick={onAdd}>Add a problem</button>}/>
    <div className="grid gap-3 sm:grid-cols-3">{[['Problems solved', solved.length], ['Solved this week', thisWeek], ['Current streak', `${streak} ${streak === 1 ? 'day' : 'days'}`]].map(([label, value]) => <div className="card" key={label}><p className="text-sm text-muted">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>)}</div>
    <section className="card mt-4"><div className="flex items-center justify-between"><h2 className="font-semibold">Recently solved</h2><button className="text-sm text-accent" onClick={onAdd}>View problems →</button></div>
      {recent.length ? <div className="mt-3 divide-y divide-line">{recent.map((p) => <div className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm" key={p.id}><span className="font-medium">{p.title}</span><span className="text-muted">{p.topic || 'No topic'} · {p.difficulty} · {new Date(p.solvedAt).toLocaleDateString()}</span></div>)}</div> : <div className="py-10 text-center"><p className="font-medium">Nothing solved yet.</p><p className="mt-1 text-sm text-muted">Mark a problem as solved and it will show up here.</p><button className="btn-primary mt-4" onClick={onAdd}>Open problem tracker</button></div>}
    </section>
  </>;
}
