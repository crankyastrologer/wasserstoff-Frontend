
  <script lang="ts">
    import type { Document, QueryResult } from '../../types/types';
    export let addToast: (message: string, type: 'success' | 'error' | 'info') => void;

    export let documents: Document[];
    export let selectedDocuments: string[];
    export let toggleDocumentSelection: (id: string) => void;
    export let isLoading: boolean;
    let query = '';
    let results: QueryResult | null = null;
    let isQuerying = false;
    
    async function handleQuery(): Promise<void> {
  if (!query.trim() || selectedDocuments.length === 0) return;

  isQuerying = true;

  try {
    const token = await localStorage.getItem('token');

    const response = await fetch(`https://wasserstoff-aiinterntask-zlyc.onrender.com/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        'query':query,
        'document_ids': selectedDocuments
      })
    });

    if (!response.ok) {
      throw new Error('Failed to query');
    }

    const data = await response.json();
    console.log(data)
    results = {
  answer: data.response,
  citations: data.documents.map((doc: any) => ({
    document_id: doc.document_id,
    document_name: doc.document_name,
    page: doc.page,
    paragraph: doc.paragraph,
    text: doc.text
  }))
};
  } catch (error) {
    console.error('Query error:', error);
    addToast('Failed to process query', 'error');
  } finally {
    isQuerying = false;
  }
}

    function copyToClipboard(text: string): void {
      navigator.clipboard.writeText(text);
      // Would show toast here
    }
  </script>
  
  <div>
    <h1 class="text-2xl font-bold mb-6">Query Documents</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div class="p-6">
            <form on:submit|preventDefault={handleQuery} class="space-y-4">
              <div>
                <label for="query" class="block text-sm font-medium mb-1">Ask a question about your documents</label>
                <textarea
                  id="query"
                  bind:value={query}
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700"
                  placeholder="What was the revenue growth in Q4 2023?"
                ></textarea>
              </div>
              
              <div class="flex justify-end">
                <button
                  type="submit"
                  disabled={isQuerying || selectedDocuments.length === 0 || !query.trim()}
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {#if isQuerying}
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  {:else}
                    <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    Submit Query
                  {/if}
                </button>
              </div>
            </form>
            
            {#if results}
              <div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 class="text-lg font-medium mb-4">Answer</h3>
                <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <p class="text-gray-900 dark:text-gray-100">{results.answer}</p>
                </div>
                
                <h3 class="text-lg font-medium mt-6 mb-4">Citations</h3>
                <div class="space-y-4">
                  {#each results.citations as citation, index}
                    <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <div class="flex justify-between items-start">
                        <div>
                          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                            [{citation.document_name}, page {citation.page}, paragraph {citation.paragraph}]
                          </p>
                        </div>
                        <button aria-label="Copy citation" type="button"
                          on:click={() => copyToClipboard(`[${citation.document_name}, page ${citation.page}, paragraph ${citation.paragraph}]`)}
                          class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                          title="Copy citation"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                          </svg>
                        </button>
                      </div>
                      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">"{citation.text}"</p>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </div>
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
                        id={`doc-${doc.document_id}`}
                        checked={selectedDocuments.includes(doc.document_id)}
                        on:change={() => toggleDocumentSelection(doc.document_id)}
                        class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                      />
                      <label for={`doc-${doc.document_id}`} class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                    Please select at least one document to query.
                  </p>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>