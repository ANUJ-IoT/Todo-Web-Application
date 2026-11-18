const API_URL = import.meta.env.VITE_API_URL;

export async function login({ name, pass }) {
  const data = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, pass }),
  }).then((r) => r.json());

  return data;
}

export async function register({ name, pass }) {
  const data = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, pass }),
  }).then((r) => r.json());

  return data;
}

export async function getHistory(name) {
  const data = await fetch(`${API_URL}/notes/all/${name}`);
  return data.json();
}

export async function getNotes(name) {
  const data = await fetch(`${API_URL}/notes/${name}`);
  return data.json();
}

export async function saveNote(title, detail, name) {
  const data = await fetch(`${API_URL}/notes/shortNote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, detail, name }),
  }).then((res) => res.json());

  return data;
}

export async function saveLongNote(title, detail, name) {
  const data = await fetch(`${API_URL}/notes/longNote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, detail, name }),
  }).then((r) => r.json());

  return data;
}

export async function deleteNote(id) {
  const data = await fetch(`${API_URL}/notes/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  }).then((r) => r.json());

  return data;
}
