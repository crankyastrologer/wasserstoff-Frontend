<script lang="ts">
    import { user } from '../../stores/stores';
    import { login } from '../../utils/auth';
    
    export let addToast: (message: string, type: 'success' | 'error' | 'info') => void;
    
    let username = '';
    let password = '';
    let isLoading = false;
    
    async function handleLogin(): Promise<void> {
      if (!username || !password) {
        addToast('Please fill in all fields', 'error');
        return;
      }
      
      isLoading = true;
      
      try {
        await login(username, password);
        addToast('Login successful', 'success');
      } catch (error) {
        addToast('Login failed', 'error');
        console.error('Login error:', error);
      } finally {
        isLoading = false;
      }
    }
  </script>
  
  <form on:submit|preventDefault={handleLogin} class="space-y-4">
    <div>
      <label for="username" class="block text-sm font-medium mb-1">username</label>
      <input
        type="text"
        id="username"
        bind:value={username}
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700"
        placeholder="you@example.com"
        required
      />
    </div>
    
    <div>
      <label for="password" class="block text-sm font-medium mb-1">Password</label>
      <input
        type="password"
        id="password"
        bind:value={password}
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700"
        placeholder="••••••••"
        required
      />
    </div>
    
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input
          id="remember-me"
          type="checkbox"
          class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
        />
        <label for="remember-me" class="ml-2 block text-sm">Remember me</label>
      </div>

    </div>
    
    <button
      type="submit"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      disabled={isLoading}
    >
      {#if isLoading}
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Logging in...
      {:else}
        Login
      {/if}
    </button>
    
  
  </form>