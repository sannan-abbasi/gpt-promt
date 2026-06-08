import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'PromptVault',
    version: '1.0.0',
    description: 'Save promts.',
    permissions: [
      'storage',       
      'activeTab'      
    ],
    host_permissions: [
      'https://chatgpt.com/*',
      'https://*.openai.com/*'
    ]
  }
});