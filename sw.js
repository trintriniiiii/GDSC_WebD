self.addEventListener('install', (event) => {
    self.skipWaiting(); // Activate immediately without waiting
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service worker activated');
    event.waitUntil(clients.claim()); // Gain control of all open clients
  });
  
  self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked!');
    event.notification.close();
  
    event.waitUntil(
      clients.openWindow('index.html')
    );
  });