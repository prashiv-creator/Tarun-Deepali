// Online Backup Configuration
// Configure these variables when hosting online to enable automatic data backup

// Method 1: Google Sheets API
// Set your Google Apps Script URL here
const googleSheetsUrl = ''; // e.g., 'https://script.google.com/macros/s/.../exec'

// Method 2: Email Backup
// Set your email service endpoint here
const emailBackup = ''; // e.g., 'https://your-email-service.com/send'

// Method 3: Webhook Backup
// Set your webhook URL here (Discord, Slack, etc.)
const webhookUrl = ''; // e.g., 'https://hooks.slack.com/services/...'

// Method 4: Server Backup
// Set your server endpoint here
const serverBackupUrl = ''; // e.g., 'https://your-server.com/api/wedding-wishes'

// Instructions:
// 1. Choose ONE method above and configure the URL
// 2. Upload this file to your server
// 3. The system will automatically backup data when hosted online
// 4. Local storage always works as fallback

// Example configurations:

// Google Sheets Setup:
// - Create Google Apps Script
// - Deploy as Web App
// - Copy URL and paste above
// - Script will receive POST requests with wish data

// Email Service Setup:
// - Use services like EmailJS, Formspree, etc.
// - Get endpoint URL and paste above
// - System will send formatted email content

// Webhook Setup:
// - Create webhook in Discord/Slack
// - Copy URL and paste above
// - System will send JSON data to your channel

// Server Setup:
// - Create API endpoint on your server
// - Handle POST requests with wish data
// - Store in database or file
// - Return success response

// Note: This file is OPTIONAL
// If not configured, system works perfectly with local storage only
