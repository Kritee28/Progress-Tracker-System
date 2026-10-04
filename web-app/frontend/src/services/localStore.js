const ACCOUNTS = 'progress_tracker_accounts_v1';
const SESSION = 'progress_tracker_session_v1';
const keyFor = (username) => username.trim().toLowerCase();

function accounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS) || '[]'); }
  catch { return []; }
}

function bytesToHex(bytes) {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(salt), iterations: 150000, hash: 'SHA-256' }, material, 256);
  return bytesToHex(bits);
}

export async function createAccount(username, password) {
  const clean = username.trim();
  const normalized = keyFor(clean);
  if (!/^[a-zA-Z0-9_.-]{3,24}$/.test(clean)) throw new Error('Username must be 3–24 characters and use letters, numbers, dots, dashes, or underscores.');
  if (password.length < 8) throw new Error('Use a password with at least 8 characters.');
  const list = accounts();
  if (list.some((account) => account.usernameKey === normalized)) throw new Error('That username is already in use. Please choose another.');
  const salt = crypto.randomUUID();
  list.push({ username: clean, usernameKey: normalized, salt, passwordHash: await hashPassword(password, salt), createdAt: new Date().toISOString() });
  localStorage.setItem(ACCOUNTS, JSON.stringify(list));
  localStorage.setItem(SESSION, normalized);
  return clean;
}

export async function signIn(username, password) {
  const normalized = keyFor(username);
  const account = accounts().find((item) => item.usernameKey === normalized);
  if (!account || (await hashPassword(password, account.salt)) !== account.passwordHash) throw new Error('Username or password is incorrect.');
  localStorage.setItem(SESSION, normalized);
  return account.username;
}

export function currentUser() {
  const usernameKey = localStorage.getItem(SESSION);
  return accounts().find((account) => account.usernameKey === usernameKey)?.username || null;
}

export function signOut() { localStorage.removeItem(SESSION); }

function problemKey(username) { return `progress_tracker_problems_v1_${keyFor(username)}`; }
export function getProblems(username) {
  try { return JSON.parse(localStorage.getItem(problemKey(username)) || '[]'); }
  catch { return []; }
}
export function saveProblems(username, problems) {
  localStorage.setItem(problemKey(username), JSON.stringify(problems));
}
