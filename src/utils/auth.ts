import { user } from '../stores/stores';
import type { User } from '../types/types';

export function  checkAuthState(): void {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    user.set(JSON.parse(storedUser));
  }
}

export function logout(): void {
  localStorage.removeItem('user');
  localStorage.removeItem('token'); // if you stored JWT separately
  user.set(null);
}

function parseJwt(token: string): any {
  try {
    const base64Payload = token.split('.')[1];
    const decodedPayload = atob(base64Payload);
    return JSON.parse(decodedPayload);
  } catch (e) {
    return null;
  }
}

export async function login(email: string, password: string): Promise<User> {
  const formData = new URLSearchParams();
  formData.append('username', email);  // OAuth2PasswordRequestForm expects 'username' field, not 'email'
  formData.append('password', password);

  const response = await fetch('https://wasserstoff-aiinterntask-zlyc.onrender.com/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error(error.detail || 'Login failed');
  }

  const data = await response.json();
  const token = data.access_token;

  const payload = parseJwt(token);
  if (!payload?.sub) {
    throw new Error('Invalid token payload');
  }

  const userData: User = {
    email: '',            // backend didn't return email
    name: payload.sub,    // using username as name for now
  };

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  user.set(userData);

  return userData;
}

export async function signup(name: string, password: string): Promise<User> {
  const formData = new FormData();
  formData.append("username", name);
  formData.append("password", password);

  const response = await fetch('https://wasserstoff-aiinterntask-zlyc.onrender.com/register/', {
    method: 'POST',
    body: formData
  });
  console.log(response);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Signup failed');
  }

  // After successful registration, immediately log in
  const user = await login(name, password);
  return user;
}