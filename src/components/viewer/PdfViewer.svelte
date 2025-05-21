<script lang="ts">
    import type { Document } from '../../types/types';
    
    export let document: Document;
    export let setView: (view: 'dashboard' | 'upload' | 'query' | 'themes' | 'viewer') => void;
    
    let currentPage = 1;
    let totalPages = 10; // Mock value
    let scale = 1.0;
    let isLoading = true;
    
    function handlePageChange(newPage: number): void {
      if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
      }
    }
    
    function handleZoom(factor: number): void {
      scale = Math.max(0.5, Math.min(2.0, scale + factor));
    }
    
    // Simulate loading
    setTimeout(() => {
      isLoading = false;
    }, 1500);
  </script>
  
  <div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <button
          on:click={() => setView('dashboard')}
          class="mr-2 inline-flex items-center px-2 py-1 border border-transparent rounded-md text-sm font-medium text-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back
        </button>
        <h1 class="text-2xl font-bold truncate">{document.name}</h1>
      </div>
      
      <div class="flex items-center space-x-2">
        <button aria-label="Zoom Out"
          on:click={() => handleZoom(-0.1)}
          class="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
          </svg>
        </button>
        <span class="text-sm">{Math.round(scale * 100)}%</span>
        <button aria-label="Zoom In"
          on:click={() => handleZoom(0.1)}
          class="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-2">
          <button aria-label="Previous Page"
            on:click={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            class="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <div class="flex items-center">
            <span class="text-sm">Page</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              on:change={(e: Event) => {
                const target = e.target as HTMLInputElement;
                handlePageChange(parseInt(target.value));
              }}
              class="mx-2 w-12 h-8 text-center border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700"
            />
            <span class="text-sm">of {totalPages}</span>
          </div>
          
          <button aria-label="Next Page"
            on:click={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            class="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
        
        <div>
          <button
            class="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Download
          </button>
        </div>
      </div>
      
      <div class="relative bg-gray-100 dark:bg-gray-900 min-h-[600px] flex items-center justify-center">
        {#if isLoading}
          <div class="flex flex-col items-center justify-center">
            <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading document...</p>
          </div>
        {:else}
          <div class="p-4 w-full max-w-3xl mx-auto">
            <!-- Mock PDF page -->
            <div 
              class="bg-white shadow-lg rounded-lg p-8 transform transition-transform duration-200"
              style="transform: scale({scale}); transform-origin: top center;"
            >
              <div class="space-y-4">
                <h2 class="text-2xl font-bold">Financial Report 2023</h2>
                <p class="text-sm text-gray-500">Page {currentPage} of {totalPages}</p>
                
                <div class="space-y-4">
                  <h3 class="text-xl font-semibold">Executive Summary</h3>
                  <p>
                    The fiscal year 2023 marked a significant period of growth for our company, with revenue
                    increasing by 15% year-over-year in Q4 2023, reaching $24.5 million compared to $21.3 million
                    in Q4 2022. This growth was primarily driven by our expansion into new markets and the
                    successful launch of our premium product line.
                  </p>
                  
                  <div class="bg-yellow-100 p-2 rounded-md border-l-4 border-yellow-500">
                    <p class="text-sm text-yellow-800">
                      Revenue increased by 15% year-over-year in Q4 2023, reaching $24.5 million compared to $21.3 million in Q4 2022.
                    </p>
                  </div>
                  
                  <p>
                    The expansion into European markets contributed approximately 40% of the year-over-year growth
                    in Q4 2023. Our strategic investments in sales and marketing in these regions have yielded
                    strong returns, with customer acquisition costs decreasing by 12% compared to initial projections.
                  </p>
                  
                  <p>
                    Looking ahead to 2024, we anticipate continued growth as we further penetrate existing markets
                    and expand into the Asia-Pacific region. Our R&D investments are expected to yield new product
                    offerings in the second half of the year, which should contribute to revenue growth in Q3 and Q4.
                  </p>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>