import { documents, isLoading, selectedDocuments } from '../stores/stores';
import { addToast } from './toast';
import type { Document } from '../types/types';

// Mock fetch documents

export async function fetchDocuments(): Promise<void> {
  isLoading.set(true);

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch('http://localhost:8000/vectorstore/get_documents', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    const docs: Document[] = data.documents;

    documents.set(docs);
    addToast('Documents loaded successfully', 'success');
  } catch (error) {
    console.error('Error fetching documents:', error);
    addToast('Failed to load documents', 'error');
  } finally {
    isLoading.set(false);
  }
}


// Delete document
export async function deleteDocument(id: string): Promise<void> {
  isLoading.set(true);
  try {
    const token = localStorage.getItem('token'); // Replace with your actual token store
    const response = await fetch(`http://localhost:8000/vectorstore/delete_document?document_id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed with status ${response.status}`);
    }

    documents.update(docs => docs.filter(doc => doc.document_id !== id));
    selectedDocuments.update(selected => selected.filter(docId => docId !== id));
    addToast('Document deleted successfully', 'success');
  } catch (error) {
    addToast('Failed to delete document', 'error');
    console.error('Error deleting document:', error);
  } finally {
    isLoading.set(false);
  }
}