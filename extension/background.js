// Background service worker for the extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('Meeting slot generator extension installed');
});

// Handle authentication flow
chrome.identity.onSignInChanged.addListener((account, signedIn) => {
  console.log('Sign-in state changed:', signedIn);
});
