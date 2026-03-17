# Google Sheets API Setup Guide
## Auto-append Wedding Wishes to Google Sheet

### 🎯 What This Does
- Automatically saves wedding wishes to Google Sheet
- Real-time data backup when hosted online
- CSV download still available locally
- No data loss even if browser crashes

---

## 📋 Step-by-Step Setup

### 1. Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"Blank"** to create new sheet
3. Rename sheet to **"Wedding Wishes"**
4. Add headers in Row 1:
   ```
   Entry | EntryName | Name | Message | Date
   ```

### 2. Create Google Apps Script
1. In your Google Sheet, click **"Extensions"** → **"Apps Script"**
2. Delete default code
3. Copy and paste the script below

### 3. Apps Script Code
```javascript
// Google Apps Script for Wedding Wishes Backup
function doGet(e) {
  return HtmlService.createHtmlOutput("Wedding Wishes API is running!");
}

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Wedding Wishes");
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Sheet 'Wedding Wishes' not found"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Handle different actions
    if (data.action === "append") {
      // Append new wish
      const wish = data.data;
      const nextEntry = sheet.getLastRow();
      
      sheet.appendRow([
        nextEntry,                    // Entry
        wish.entryName || wish.name,   // EntryName
        wish.name,                    // Name
        wish.message,                 // Message
        wish.date                     // Date
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Wish added successfully",
        entry: nextEntry
      })).setMimeType(ContentService.MimeType.JSON);
      
    } else if (data.action === "get_all") {
      // Get all wishes (for admin panel)
      const data = sheet.getDataRange().getValues();
      const wishes = [];
      
      for (let i = 1; i < data.length; i++) {
        wishes.push({
          entry: data[i][0],
          entryName: data[i][1],
          name: data[i][2],
          message: data[i][3],
          date: data[i][4]
        });
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        wishes: wishes
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to clear all data (admin only)
function clearAll() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Wedding Wishes");
  const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
  range.clearContent();
  
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "All data cleared"
  })).setMimeType(ContentService.MimeType.JSON);
}
```

### 4. Deploy as Web App
1. Click **"Deploy"** → **"New deployment"**
2. Select **"Web app"** as type
3. Configure deployment:
   - **Description:** "Wedding Wishes API"
   - **Execute as:** "Me" (your Google account)
   - **Who has access:** "Anyone" (important for public access)
4. Click **"Deploy"**
5. **Authorize** the script when prompted
6. **Copy the Web app URL** (this is your API endpoint)

### 5. Configure Your Wedding Site
1. Open `config-backup.js` file
2. Add your Web App URL:
   ```javascript
   const googleSheetsUrl = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   ```
3. Replace `YOUR_DEPLOYMENT_ID` with your actual URL

### 6. Test the Setup
1. Host your wedding website online
2. Go to the guest book page
3. Enter a test wish
4. Check your Google Sheet - data should appear!

---

## 🔧 Advanced Configuration

### Multiple Sheets Setup
```javascript
// In Apps Script, you can handle multiple sheets
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheetName = data.sheet || "Wedding Wishes";
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  // ... rest of the code
}
```

### Data Validation
```javascript
// Add validation before appending
if (!wish.name || !wish.message) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "error",
    message: "Name and message are required"
  })).setMimeType(ContentService.MimeType.JSON);
}
```

### Email Notifications
```javascript
// Add email notification when new wish arrives
function sendEmailNotification(wish) {
  MailApp.sendEmail({
    to: "your-email@gmail.com",
    subject: "New Wedding Wish from " + wish.name,
    body: `Message: ${wish.message}\nDate: ${wish.date}`
  });
}
```

---

## 🚨 Important Notes

### Security
- **Public access** required for website to work
- **No sensitive data** in the sheet (just names and wishes)
- **Regular backups** recommended

### Limitations
- **Daily quotas:** Google Apps Script has daily limits
- **Concurrent users:** May have rate limiting
- **Data size:** Large messages may cause issues

### Troubleshooting
1. **"Access denied"** → Check deployment permissions
2. **"Sheet not found"** → Verify sheet name matches exactly
3. **"No data"** → Check JSON format in POST request
4. **"CORS error"** → Ensure "Anyone" has access

---

## 📱 Testing Checklist

- [ ] Google Sheet created with headers
- [ ] Apps Script code pasted correctly
- [ ] Web app deployed successfully
- [ ] URL copied to config-backup.js
- [ ] Website hosted online
- [ ] Test wish submitted
- [ ] Data appears in Google Sheet
- [ ] Admin login works
- [ ] CSV download still functional

---

## 🎉 Ready to Go!

Once setup is complete:
- ✅ All wishes automatically save to Google Sheet
- ✅ Real-time backup when hosted online
- ✅ Admin can view all data online
- ✅ CSV download still available locally
- ✅ No data loss ever!

**Your wedding wishes are now safely backed up!** 🎊📊
