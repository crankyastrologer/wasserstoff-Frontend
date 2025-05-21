import { toasts } from '../stores/stores';
import type { Toast } from '../types/types';

export function addToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  const id = Date.now().toString();
  toasts.update(t => [...t, { id, message, type }]);
  setTimeout(() => {
    removeToast(id);
  }, 5000);
}

export function removeToast(id: string): void {
  toasts.update(t => t.filter(toast => toast.id !== id));
}