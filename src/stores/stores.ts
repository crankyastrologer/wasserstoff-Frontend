import { writable } from 'svelte/store';
import type { User, Document, Toast } from '../types/types';

export const user = writable<User | null>(null);
export const documents = writable<Document[]>([]);
export const selectedDocuments = writable<string[]>([]);
export const currentView = writable<'dashboard' | 'upload' | 'query' | 'themes' | 'viewer'>('dashboard');
export const currentDocument = writable<Document | null>(null);
export const isLoading = writable<boolean>(false);
export const toasts = writable<Toast[]>([]);