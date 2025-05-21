<script lang="ts">
    import type { Document, Theme } from '../../types/types';
    import {marked} from 'marked';
    export let documents: Document[];
    export let selectedDocuments: string[];
    export let toggleDocumentSelection: (id: string) => void;
    export let isLoading: boolean;
    
    let themes: string | null = null;
    let isDetecting = false;
    
    async function detectThemes(): Promise<void> {
  if (selectedDocuments.length === 0) return;

  isDetecting = true;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://127.0.0.1:8000/get_themes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        document_ids: selectedDocuments,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Theme detection failed with status: ${response.status}`);
    }

    const data = await response.json();
    themes = data.themes;
    console.log("Themes detected:", themes);
  } catch (error) {
    console.error("Theme detection error:", error);
  } finally {
    isDetecting = false;
  }
}


  </script>
  
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h1 class="text-2xl font-bold">Theme Detection</h1>
      <button
        on:click={detectThemes}
        disabled={isDetecting || selectedDocuments.length === 0}
        class="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if isDetecting}
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Detecting Themes...
        {:else}
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          Identify Themes
        {/if}
      </button>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        {#if isDetecting}
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <div class="flex flex-col items-center justify-center">
              <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="mt-4 text-lg font-medium">Analyzing documents and identifying themes...</p>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">This may take a few moments depending on the number and size of documents.</p>
            </div>
          </div>
          {:else if themes}
          <div class="prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            {@html marked(themes)}
          </div>
        {:else}
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No themes detected yet</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Select documents and click "Identify Themes" to analyze your documents for common themes and topics.
            </p>
          </div>
        {/if}
      </div>
      
      <div>
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium">Selected Documents ({selectedDocuments.length})</h3>
          </div>
          
          {#if isLoading}
            <div class="p-4 flex justify-center">
              <svg class="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          {:else if documents.length === 0}
            <div class="p-4 text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">No documents available</p>
            </div>
          {:else}
            <div class="p-4">
              <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                {#each documents as doc}
                  <li class="py-2">
                    <div class="flex items-center">
                      <input
                        type="checkbox"
                        id={`theme-doc-${doc.document_id}`}
                        checked={selectedDocuments.includes(doc.document_id)}
                        on:change={() => toggleDocumentSelection(doc.document_id)}
                        class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                      />
                      <label for={`theme-doc-${doc.document_id}`} class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {doc.filename}
                      </label>
                    </div>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
          
          {#if selectedDocuments.length === 0 && documents.length > 0}
            <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-yellow-700 dark:text-yellow-200">
                    Please select at least one document to analyze.
                  </p>
                </div>
              </div>
            </div>
          {/if}
          
         
        </div>
      </div>
    </div>
  </div>