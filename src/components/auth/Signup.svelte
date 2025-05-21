<script lang="ts">
    import { user } from '../../stores/stores';
    import { signup } from '../../utils/auth';
    
    export let addToast: (message: string, type: 'success' | 'error' | 'info') => void;
    
    let name = '';
    let password = '';
    let confirmPassword = '';
    let isLoading = false;
    
    async function handleSignup(): Promise<void> {
      if (!name  || !password || !confirmPassword) {
        addToast('Please fill in all fields', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        addToast('Passwords do not match', 'error');
        return;
      }
      
      isLoading = true;
      
      try {
        await signup(name, password);
        addToast('Account created successfully', 'success');
      } catch (error) {
        addToast('Signup failed', 'error');
        console.error('Signup error:', error);
      } finally {
        isLoading = false;
      }
    }
  </script>
  
  <form on:submit|preventDefault={handleSignup} class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium mb-1">Full Name</label>
      <input
        type="text"
        id="name"
        bind:value={name}
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700"
        placeholder="John Doe"
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
    
    <div>
      <label for="confirm-password" class="block text-sm font-medium mb-1">Confirm Password</label>
      <input
        type="password"
        id="confirm-password"
        bind:value={confirmPassword}
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700"
        placeholder="••••••••"
        required
      />
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
        Creating account...
      {:else}
        Create Account
      {/if}
    </button>
  </form>