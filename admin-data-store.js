// Admin Data Store - No Google Sheets Required
// Simple online data storage using admin password protection

// Admin credentials (change these)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'mahor123';

// In-memory storage (will work when hosted with server-side support)
let weddingWishes = [];

// Local storage fallback
function getStoredWishes() {
    if (typeof Storage !== 'undefined') {
        return JSON.parse(localStorage.getItem('weddingWishes') || '[]');
    }
    return weddingWishes;
}

function saveStoredWishes(wishes) {
    if (typeof Storage !== 'undefined') {
        localStorage.setItem('weddingWishes', JSON.stringify(wishes));
    }
    weddingWishes = wishes;
}

// Admin authentication
function authenticateAdmin(username, password) {
    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

// Save wish with admin protection
function saveWish(wishData) {
    const wishes = getStoredWishes();
    wishes.push({
        ...wishData,
        timestamp: new Date().toISOString(),
        id: Date.now() // Unique ID
    });
    saveStoredWishes(wishes);
    return wishes;
}

// Get all wishes (admin only)
function getAllWishes() {
    return getStoredWishes();
}

// Export to CSV (admin only)
function exportToCSV() {
    const wishes = getStoredWishes();
    if (wishes.length === 0) return '';
    
    let csv = 'Entry,EntryName,Name,Message,Date\n';
    wishes.forEach((wish, index) => {
        csv += `${index + 1},"${wish.entryName || wish.name}","${wish.name}","${wish.message}","${wish.date}"\n`;
    });
    return csv;
}

// Download CSV file
function downloadCSV() {
    const csv = exportToCSV();
    if (!csv) {
        alert('No wishes to download!');
        return;
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-wishes.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Server-side simulation (when hosted)
if (typeof window === 'undefined') {
    // Node.js server code example
    const express = require('express');
    const app = express();
    app.use(express.json());
    
    // Store wishes in memory (or use database)
    let serverWishes = [];
    
    app.post('/api/wishes', (req, res) => {
        const { auth, wish } = req.body;
        
        // Simple auth check
        if (auth !== ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        serverWishes.push({
            ...wish,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });
        
        res.json({ success: true, total: serverWishes.length });
    });
    
    app.get('/api/wishes', (req, res) => {
        const { auth } = req.query;
        
        if (auth !== ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        res.json({ wishes: serverWishes });
    });
    
    app.listen(3000, () => {
        console.log('Admin data store running on port 3000');
    });
}

// Browser-side API
if (typeof window !== 'undefined') {
    window.AdminDataStore = {
        authenticate: authenticateAdmin,
        saveWish: saveWish,
        getAllWishes: getAllWishes,
        exportToCSV: exportToCSV,
        downloadCSV: downloadCSV,
        
        // Try to save to external service
        saveToExternal: async function(wish) {
            // Method 1: JSONBin (free service)
            try {
                const response = await fetch('https://api.jsonbin.io/v3/b', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': 'YOUR_JSONBIN_KEY' // Get free key from jsonbin.io
                    },
                    body: JSON.stringify({
                        weddingWishes: getStoredWishes(),
                        lastUpdated: new Date().toISOString()
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Saved to JSONBin:', data.record);
                    return true;
                }
            } catch (error) {
                console.log('JSONBin backup failed:', error);
            }
            
            // Method 2: GitHub Gist (if you have GitHub token)
            try {
                const response = await fetch('https://api.github.com/gists', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'token YOUR_GITHUB_TOKEN',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        description: 'Wedding Wishes Backup',
                        public: false,
                        files: {
                            'wedding-wishes.json': {
                                content: JSON.stringify(getStoredWishes(), null, 2)
                            }
                        }
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Saved to GitHub Gist:', data.html_url);
                    return true;
                }
            } catch (error) {
                console.log('GitHub Gist backup failed:', error);
            }
            
            // Method 3: Pastebin (simple text storage)
            try {
                const response = await fetch('https://pastebin.com/api/api_post.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        api_dev_key: 'YOUR_PASTEBIN_KEY',
                        api_option: 'paste',
                        api_paste_code: JSON.stringify(getStoredWishes(), null, 2),
                        api_paste_private: '1',
                        api_paste_name: 'wedding-wishes'
                    })
                });
                
                if (response.ok) {
                    const data = await response.text();
                    console.log('Saved to Pastebin:', data);
                    return true;
                }
            } catch (error) {
                console.log('Pastebin backup failed:', error);
            }
            
            return false; // All methods failed
        }
    };
}
