document.addEventListener('DOMContentLoaded', () => {
  const refreshButton = document.getElementById('refreshButton');
  const statusDiv = document.getElementById('status');

  refreshButton.addEventListener('click', async () => {
    try {
      // Get current tab URL
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const url = new URL(tab.url);
      const domain = url.hostname;

      // Remove all cookies for the domain
      const cookies = await chrome.cookies.getAll({ domain });

      statusDiv.textContent = `Removing ${cookies.length} cookies...`;

      for (const cookie of cookies) {
        const protocol = url.protocol.includes('https') ? 'https:' : 'http:';
        const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;

        await chrome.cookies.remove({
          url: cookieUrl,
          name: cookie.name
        });
      }

      statusDiv.textContent = `Removed ${cookies.length} cookies. Refreshing page...`;

      // Refresh the page
      await chrome.tabs.reload(tab.id);

      // Close the popup after a short delay
      setTimeout(() => window.close(), 1000);
    } catch (error) {
      statusDiv.textContent = `Error: ${error.message}`;
      statusDiv.style.color = '#f44336';
    }
  });
});
