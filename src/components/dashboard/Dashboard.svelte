<script lang="ts">
    import type { Document } from '../../types/types';
    
    export let documents: Document[];
    export let deleteDocument: (id: string) => Promise<void>;
    export let viewDocument: (doc: Document) => void;
    export let toggleDocumentSelection: (id: string) => void;
    export let selectedDocuments: string[];
    export let setView: (view: 'dashboard' | 'upload' | 'query' | 'themes' | 'viewer') => void;
    export let isLoading: boolean;
    
    let sortBy = 'uploadDate';
    let sortOrder: 'asc' | 'desc' = 'desc';
    let filterText = '';
    let filterType: 'all' | 'pdf' | 'image' = 'all';
    
    $: filteredDocuments = documents
  .filter(doc => {
    const matchesText = doc.document_id.toLowerCase().includes(filterText.toLowerCase());
    const matchesType = filterType === 'all' 
    return matchesText && matchesType;
  })
  .sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.filename.localeCompare(b.filename) 
        : b.filename.localeCompare(a.filename);
    } 
     else {
      // Default: sort by name if sortBy is invalid or unsupported
      return sortOrder === 'asc'
        ? a.document_id.localeCompare(b.document_id)
        : b.document_id.localeCompare(a.document_id);
    }
  });
    

    
    function handleSort(field: string): void {
      if (sortBy === field) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        sortBy = field;
        sortOrder = 'asc';
      }
    }
  </script>
  
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h1 class="text-2xl font-bold">Document Dashboard</h1>
      <button
        on:click={() => setView('upload')}
        class="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Upload Documents
      </button>
    </div>
    
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <label for="search" class="sr-only">Search</label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                id="search"
                bind:value={filterText}
                class="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700"
                placeholder="Search documents..."
              />
            </div>
          </div>
          
          <div>
            <label for="filter-type" class="sr-only">Filter by type</label>
            <select
              id="filter-type"
              bind:value={filterType}
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-gray-700"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF</option>
              <option value="image">Image</option>
            </select>
          </div>
          
          {#if selectedDocuments.length > 0}
            <div class="flex gap-2">
              <button
                on:click={() => setView('query')}
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Query Selected
              </button>
              <button
                on:click={() => setView('themes')}
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Find Themes
              </button>
            </div>
          {/if}
        </div>
      </div>
      
      {#if isLoading}
        <div class="p-8 flex justify-center">
          <div class="flex flex-col items-center">
            <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading documents...</p>
          </div>
        </div>
      {:else if (filteredDocuments === null || filteredDocuments.length === 0)}
        <div class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No documents found</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filterText || filterType !== 'all' 
              ? 'Try adjusting your search or filter to find what you\'re looking for.' 
              : 'Get started by uploading a new document.'}
          </p>
          <div class="mt-6">
            <button
              on:click={() => setView('upload')}
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Upload Document
            </button>
          </div>
        </div>
      {:else}
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                      on:change={(e: Event) => {
                        const target = e.target as HTMLInputElement;
                        if (target.checked) {
                          selectedDocuments = filteredDocuments.map(doc => doc.document_id);
                        } else {
                          selectedDocuments = [];
                        }
                      }}
                      checked={filteredDocuments.length > 0 && selectedDocuments.length === filteredDocuments.length}
                    />
                  </div>
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <button
                    on:click={() => handleSort('name')}
                    class="group inline-flex items-center"
                  >
                    Name
                    {#if sortBy === 'name'}
                      <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {#if sortOrder === 'asc'}
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                        {:else}
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        {/if}
                      </svg>
                    {/if}
                  </button>
                </th>
               
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Text
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {#each filteredDocuments as doc (doc.document_id)}
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
                      checked={selectedDocuments.includes(doc.document_id)}
                      on:change={() => toggleDocumentSelection(doc.document_id)}
                    />
                  </td>
                  
                  <!-- Document ID and Filename -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{doc.document_id}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{doc.filename}</div>
                  </td>
                  
                  <!-- Refined Text Preview -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                    {doc.pages[0].refined_text?.slice(0, 120)}{doc.pages[0].refined_text?.length > 120 ? '…' : ''}
                  </td>
                  
                  <!-- Actions -->
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                      
                      <button
                        on:click={() => {
                          toggleDocumentSelection(doc.document_id);
                          setView('query');
                        }}
                        class="text-primary hover:text-primary-dark"
                      >
                        Query
                      </button>
                      <button
                        on:click={() => deleteDocument(doc.document_id)}
                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
            
          </table>
        </div>
      {/if}
    </div>
  </div>