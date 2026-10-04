import React from 'react';

export default function PageHeader({ eyebrow, title, description, action }) { return <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">{eyebrow}</p><h1 className="text-2xl font-semibold tracking-tight">{title}</h1><p className="mt-1 text-sm text-muted">{description}</p></div>{action}</div> }
