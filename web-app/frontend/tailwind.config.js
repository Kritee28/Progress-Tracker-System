/** @type {import('tailwindcss').Config} */
export default { content: ['./index.html', './src/**/*.{js,jsx}'], darkMode: 'class', theme: { extend: { colors: { ink: 'var(--ink)', muted: 'var(--muted)', panel: 'var(--panel)', line: 'var(--line)', soft: 'var(--soft)', accent: 'var(--accent)' } } }, plugins: [] }
