<script lang="ts">
  import { onMount } from 'svelte';
  import { user, documents, toasts, selectedDocuments, currentView, currentDocument, isLoading } from './../stores/stores';
  import { checkAuthState, logout } from './../utils/auth';
  import { fetchDocuments, deleteDocument } from './../utils/documents';
  import { addToast, removeToast } from './../utils/toast';
  import type { Document } from './../types/types';
  
  import Login from './../components/auth/Login.svelte';
  import Signup from './../components/auth/Signup.svelte';
  import Dashboard from './../components/dashboard/Dashboard.svelte';
  import DocumentUpload from './../components/documents/DocumentUpload.svelte';
  import QueryInterface from './../components/query/QueryInterface.svelte';
  import ThemeDetection from './../components/themes/ThemeDetection.svelte';
  import PdfViewer from './../components/viewer/PdfViewer.svelte';
  import Toast from './../components/ui/Toast.svelte';
  import Navbar from './../components/ui/Navbar.svelte';
  
  // View functions
  function setView(view: 'dashboard' | 'upload' | 'query' | 'themes' | 'viewer'): void {
    currentView.set(view);
  }
  
  function viewDocument(doc: Document): void {
    currentDocument.set(doc);
    setView('viewer');
  }
  
  // Toggle document selection
  function toggleDocumentSelection(id: string): void {
    selectedDocuments.update(selected => {
      if (selected.includes(id)) {
        return selected.filter(docId => docId !== id);
      } else {
        return [...selected, id];
      }
    });
  }
  
  onMount(() => {
    checkAuthState();
    if ($user) {
      fetchDocuments();
    }
  });
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  {#if $user}
    <Navbar {logout} {setView} currentView={$currentView} />
    
    <main class="container mx-auto px-4 py-8">
      {#if $currentView === 'dashboard'}
        <Dashboard 
          documents={$documents} 
          {deleteDocument} 
          {viewDocument} 
          {toggleDocumentSelection}
          selectedDocuments={$selectedDocuments}
          {setView}
          isLoading={$isLoading}
        />
      {:else if $currentView === 'upload'}
        <DocumentUpload 
          {addToast} 
          {fetchDocuments}
          isLoading={$isLoading}
        />
      {:else if $currentView === 'query'}
        <QueryInterface 
        {addToast} 
          documents={$documents}
          selectedDocuments={$selectedDocuments}
          {toggleDocumentSelection}
          isLoading={$isLoading}
        />
      {:else if $currentView === 'themes'}
        <ThemeDetection 
          documents={$documents}
          selectedDocuments={$selectedDocuments}
          {toggleDocumentSelection}
          isLoading={$isLoading}
        />
      {:else if $currentView === 'viewer' && $currentDocument}
        <PdfViewer 
          document={$currentDocument}
          {setView}
        />
      {/if}
    </main>
  {:else}
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div class="w-full max-w-md">
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div class="p-6">
            <h1 class="text-2xl font-bold text-center mb-6">Document Analysis System</h1>
            <div class="flex border-b border-gray-200 dark:border-gray-700">
              <button 
                class="py-2 px-4 w-1/2 font-medium text-center border-b-2 border-transparent hover:text-primary hover:border-primary focus:outline-none"
                class:border-primary={$currentView === 'dashboard'}
                class:text-primary={$currentView === 'dashboard'}
                on:click={() => currentView.set('dashboard')}
              >
                Login
              </button>
              <button 
                class="py-2 px-4 w-1/2 font-medium text-center border-b-2 border-transparent hover:text-primary hover:border-primary focus:outline-none"
                class:border-primary={$currentView !== 'dashboard'}
                class:text-primary={$currentView !== 'dashboard'}
                on:click={() => currentView.set('upload')}
              >
                Sign Up
              </button>
            </div>
            
            <div class="mt-6">
              {#if $currentView === 'dashboard'}
                <Login {addToast} />
              {:else}
                <Signup {addToast} />
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Toast container -->
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    {#each $toasts as toast (toast.id)}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => removeToast(toast.id)} 
      />
    {/each}
  </div>
</div>

<style>
  :root {
    --primary: 222.2 47.4% 55.2%;
    --primary-dark: 222.2 47.4% 45.2%;
    --primary-light: 222.2 47.4% 95.2%;
  }
  
  :global(.text-primary) {
    color: hsl(var(--primary));
  }
  
  :global(.bg-primary) {
    background-color: hsl(var(--primary));
  }
  
  :global(.hover\:bg-primary-dark:hover) {
    background-color: hsl(var(--primary-dark));
  }
  
  :global(.bg-primary-light) {
    background-color: hsl(var(--primary-light));
  }
  
  :global(.text-primary-dark) {
    color: hsl(var(--primary-dark));
  }
  
  :global(.dark\:bg-primary-dark) {
    background-color: hsl(var(--primary-dark));
  }
  
  :global(.dark\:text-primary-light) {
    color: hsl(var(--primary-light));
  }
  
  :global(.focus\:ring-primary:focus) {
    --tw-ring-color: hsl(var(--primary));
  }
  
  :global(.focus\:border-primary:focus) {
    border-color: hsl(var(--primary));
  }
  
  :global(.border-primary) {
    border-color: hsl(var(--primary));
  }
  
  :global(.hover\:text-primary:hover) {
    color: hsl(var(--primary));
  }
  
  :global(.hover\:border-primary:hover) {
    border-color: hsl(var(--primary));
  }
</style>