<script lang="ts">
    export let message: string;
    export let type: 'success' | 'error' | 'info';
    export let onClose: () => void;
    
    let bgColor: string;
    let textColor: string;
    let icon: string;
    
    $: {
      if (type === 'success') {
        bgColor = 'bg-green-100 dark:bg-green-800';
        textColor = 'text-green-800 dark:text-green-100';
        icon = `
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        `;
      } else if (type === 'error') {
        bgColor = 'bg-red-100 dark:bg-red-800';
        textColor = 'text-red-800 dark:text-red-100';
        icon = `
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        `;
      } else {
        bgColor = 'bg-blue-100 dark:bg-blue-800';
        textColor = 'text-blue-800 dark:text-blue-100';
        icon = `
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        `;
      }
    }
  </script>
  
  <div class={`w-fit max-w-sm sm:max-w-md md:max-w-lg ${bgColor} shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden`}>
    <div class="p-4">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0" ></div>
        <div class="flex-1 break-words">
          <p class={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        <div class="flex-shrink-0">
          <button
            on:click={onClose}
            class={`bg-transparent rounded-md inline-flex ${textColor} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
          >
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
  </div>