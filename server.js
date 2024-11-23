const express = require('express');
const httpProxy = require('http-proxy');
const path = require('path');

const app = express();
const apiProxy = httpProxy.createProxyServer();

const INVENTORY_SERVICE_URL = 'http://localhost:3001';
const USER_SERVICE_URL = 'http://localhost:3002';

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Proxy requests to inventory-service
app.all('/inventory/*', (req, res) => {
    apiProxy.web(req, res, { target: INVENTORY_SERVICE_URL });
});

// Proxy requests to user-service
app.all('/user/*', (req, res) => {
    apiProxy.web(req, res, { target: USER_SERVICE_URL });
});

// ...existing code...

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
