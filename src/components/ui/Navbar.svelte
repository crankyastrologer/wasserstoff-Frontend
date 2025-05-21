<script lang="ts">
    import { user } from '../../stores/stores';
    import type { User } from '../../types/types';
    
    export let logout
    export let setView: (view: 'dashboard' | 'upload' | 'query' | 'themes' | 'viewer') => void;
    export let currentView: 'dashboard' | 'upload' | 'query' | 'themes' | 'viewer';
    let dropdownOpen = false;
  function toggleDropdown() {
    dropdownOpen = !dropdownOpen;
  }
  </script>
  
  <nav class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <span class="text-xl font-bold text-primary">DocAnalyzer</span>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <button
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              class:border-primary={currentView === 'dashboard'}
              class:text-primary={currentView === 'dashboard'}
              class:border-transparent={currentView !== 'dashboard'}
              class:text-gray-500={currentView !== 'dashboard'}
              class:dark:text-gray-400={currentView !== 'dashboard'}
              on:click={() => setView('dashboard')}
            >
              Dashboard
            </button>
            <button
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              class:border-primary={currentView === 'upload'}
              class:text-primary={currentView === 'upload'}
              class:border-transparent={currentView !== 'upload'}
              class:text-gray-500={currentView !== 'upload'}
              class:dark:text-gray-400={currentView !== 'upload'}
              on:click={() => setView('upload')}
            >
              Upload
            </button>
            <button
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              class:border-primary={currentView === 'query'}
              class:text-primary={currentView === 'query'}
              class:border-transparent={currentView !== 'query'}
              class:text-gray-500={currentView !== 'query'}
              class:dark:text-gray-400={currentView !== 'query'}
              on:click={() => setView('query')}
            >
              Query
            </button>
            <button
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              class:border-primary={currentView === 'themes'}
              class:text-primary={currentView === 'themes'}
              class:border-transparent={currentView !== 'themes'}
              class:text-gray-500={currentView !== 'themes'}
              class:dark:text-gray-400={currentView !== 'themes'}
              on:click={() => setView('themes')}
            >
              Themes
            </button>
          </div>
        </div>
        <div class="ml-3 relative my-auto">
          <div class="flex items-center">
            <span class="mr-2 text-sm">{$user?.name}</span>
            <button
              type="button"
              class="bg-white dark:bg-gray-800 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              id="user-menu-button"
              on:click={toggleDropdown}
            >
              <span class="sr-only">Open user menu</span>
              <div class="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                {$user?.name.charAt(0).toUpperCase()}
              </div>
            </button>
          </div>
        
          <!-- Dropdown menu -->
          <div class={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none ${dropdownOpen ? '' : 'hidden'}`}>
            <button
              on:click={() => {
                logout();
                dropdownOpen = false; // close dropdown after logout
              }}
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
        <div class="-mr-2 flex items-center sm:hidden">
          <!-- Mobile menu button -->
          <button
            type="button"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>