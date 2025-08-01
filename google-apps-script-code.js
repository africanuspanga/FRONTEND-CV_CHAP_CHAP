/**
 * Google Apps Script for CV Chap Chap Feedback Collection
 * 
 * Instructions:
 * 1. Go to script.google.com
 * 2. Create new project
 * 3. Replace Code.gs content with this script
 * 4. Create a Google Sheet and copy its ID
 * 5. Update SHEET_ID below with your sheet ID
 * 6. Deploy as web app (Execute as: Me, Access: Anyone)
 * 7. Copy the web app URL and provide it to the developer
 */

// Replace this with your Google Sheet ID
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'CV Feedback'; // Name of the sheet tab

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Open the spreadsheet
    const sheet = getOrCreateSheet();
    
    // Prepare the row data
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Africa/Dar_es_Salaam',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const rowData = [
      timestamp,
      data.name || '',
      data.phone || '',
      data.review || '',
      data.templateId || '',
      data.cvName || '',
      data.submissionDate || '',
      data.feedbackId || ''
    ];
    
    // Add the data to the sheet
    sheet.appendRow(rowData);
    
    // Log success
    console.log('Feedback submitted successfully:', data.name);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Feedback submitted successfully',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing feedback:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  let spreadsheet;
  
  try {
    // Try to open existing spreadsheet
    spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  } catch (error) {
    // If sheet doesn't exist, create a new one
    spreadsheet = SpreadsheetApp.create('CV Chap Chap Feedback');
    console.log('Created new spreadsheet with ID:', spreadsheet.getId());
    console.log('Please update SHEET_ID in this script with:', spreadsheet.getId());
  }
  
  // Get or create the feedback sheet
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    // Create the sheet if it doesn't exist
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    
    // Add headers
    const headers = [
      'Timestamp',
      'Name',
      'Phone',
      'Review',
      'Template ID',
      'CV Name',
      'Submission Date',
      'Feedback ID'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
  }
  
  return sheet;
}

// Test function to verify setup
function testSetup() {
  const testData = {
    name: 'Test User',
    phone: '+255123456789',
    review: 'This is a test feedback submission',
    templateId: 'brightDiamond',
    cvName: 'Test User',
    submissionDate: new Date().toISOString(),
    feedbackId: 'test-' + Date.now()
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}