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
    ],
    key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6qB26YrgicjvZHeqRGHik5QNsXQX418/OoeG72buZlezdhSQ3sEjbh6Fkom1Vw5K+8xqYbb/U3jUI5SzOoBlR2AbIJ0rY4AGkX6iXeCCzj+qR4+zUrysuCd2hjLybfKT4iHAFfjb1eTChjeQg+VYWpl0JFks89w7ehOzIB2E31WxydOlxzKgADp80VST5OxcbHJ2Tz/7RnmdgZWf+CCljXyaDwcfBDup+Djqa3DXtcWDEj7jsvseD485F6JfzhM3w3eSndhznZYKxvpyOnOXIECnQLJXx7thyU7dIgVsfr+JJiNjT18dq2ZCjh8RAbVtuwMhQ/66EzcFMZSyyQ3AWwIDAQAB'
  }
});