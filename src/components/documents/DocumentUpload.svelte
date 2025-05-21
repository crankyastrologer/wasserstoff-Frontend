<script lang="ts">
  export let addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  export let fetchDocuments: () => Promise<void>;
  export let isLoading: boolean;
  
  let files: File[] = [];
  let dragActive = false;
  let uploadProgress: Record<number, number> = {};
  
  function handleFileChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const fileList = target.files;
    if (fileList) {
      const newFiles = Array.from(fileList);
      files = [...files, ...newFiles];
    }
  }
  
  function handleDragOver(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    dragActive = true;
  }
  
  function handleDragLeave(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    dragActive = false;
  }
  
  function handleDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    dragActive = false;
    
    if (e.dataTransfer?.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      files = [...files, ...newFiles];
    }
  }
  
  function removeFile(index: number): void {
    files = files.filter((_, i) => i !== index);
  }
  
  async function handleUpload(): Promise<void> {
  if (files.length === 0) {
    addToast('Please select files to upload', 'error');
    return;
  }

  // Initialize progress
  files.forEach((file, index) => {
    uploadProgress[index] = 0;
  });

  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file); // Must match FastAPI param name
    });

    const token = await localStorage.getItem('token'); // Your token retrieval method

    const response = await fetch(`https://wasserstoff-aiinterntask-zlyc.onrender.com/uploadfiles/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    // Simulate progress updates
    for (let i = 0; i < files.length; i++) {
      for (let progress = 0; progress <= 100; progress += 10) {
        uploadProgress[i] = progress;
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate smooth progress
      }
    }

    const data = await response.json();

    addToast(`Successfully uploaded ${data.filenames.length} document${data.filenames.length > 1 ? 's' : ''}`, 'success');

    files = [];
    uploadProgress = {};

    await fetchDocuments(); // Refresh list
  } catch (error) {
    addToast('Failed to upload documents', 'error');
    console.error('Upload error:', error);
  }
}

  function getFileIcon(file: File): string {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      return `
        <svg class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
        </svg>
      `;
    } else if (file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp'].some(ext => file.name.toLowerCase().endsWith(ext))) {
      return `
        <svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
        </svg>
      `;
    }  else {
      return `
        <svg class="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
        </svg>
      `;
    }
  }
</script>

<div>
  <h1 class="text-2xl font-bold mb-6">Upload Documents</h1>
  
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
    <div class="p-6">
      <div role="button" tabindex="0"
        on:dragover={handleDragOver}
        on:dragleave={handleDragLeave}
        on:drop={handleDrop}
        class={`border-2 border-dashed rounded-lg p-12 text-center ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 dark:border-gray-700'
        }`}
      >
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Drag and drop your documents here, or
          <label for="file-upload" class="relative cursor-pointer text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
            <span>browse</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              class="sr-only"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              on:change={handleFileChange}
            />
          </label>
        </p>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Supports PDF, JPG, JPEG, PNG (up to 75 files)
        </p>
      </div>
      
      {#if files.length > 0}
        <div class="mt-6">
          <h3 class="text-lg font-medium">Selected Files ({files.length})</h3>
          <ul class="mt-3 divide-y divide-gray-200 dark:divide-gray-700">
            {#each files as file, index}
              <li class="py-3 flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    {@html getFileIcon(file)}
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{file.type || 'Unknown type'} • {(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <div class="flex items-center">
                  {#if uploadProgress[index] !== undefined}
                    <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-4">
                      <div class="bg-primary h-2.5 rounded-full" style="width: {uploadProgress[index]}%"></div>
                    </div>
                    <span class="text-sm text-gray-500 dark:text-gray-400">{uploadProgress[index]}%</span>
                  {:else}
                    <button aria-label="Remove file" type="button"
                      on:click={() => removeFile(index)}
                      class="ml-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  {/if}
                </div>
              </li>
            {/each}
          </ul>
        </div>
        
        <div class="mt-6">
          <button
            on:click={handleUpload}
            disabled={isLoading}
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isLoading}
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            {:else}
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              Upload {files.length} {files.length === 1 ? 'file' : 'files'}
            {/if}
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>