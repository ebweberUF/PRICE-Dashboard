# Power Automate Setup for PRICE Calendar Sync

This guide walks you through setting up Power Automate flows to sync the PRICE SharePoint Calendar with the dashboard.

## Prerequisites

1. Power Automate access (should be included with your UF Microsoft 365 license)
2. Access to the PRICE SharePoint site
3. The backend API must be deployed and running

## Create a Solution (Recommended)

Using a Solution keeps all flows organized and portable:

1. Go to [Power Automate](https://make.powerautomate.com)
2. Click **Solutions** in the left navigation
3. Click **+ New solution**
4. Configure:
   - **Display name**: `PRICE Calendar Sync`
   - **Name**: `PRICECalendarSync`
   - **Publisher**: Select your publisher or create one
   - **Version**: `1.0.0.0`
5. Click **Create**
6. Open the solution and create all flows inside it

## Step 1: Generate API Key

Before creating the flows, generate an API key for authentication:

```bash
# On the server (or any terminal with openssl)
openssl rand -base64 32
```

This will output something like: `K7xPm2nQ8R4sT6vW0yB3dF5hJ8kL1mN4pQ7rS0tU2wX=`

**Save this key** - you'll need it for:
1. The backend `.env` file as `CALENDAR_SYNC_API_KEY`
2. Each Power Automate flow's HTTP action

---

## Step 2: Create Flow 1 - Real-Time Sync

This flow triggers whenever a calendar event is created or modified.

### 2.1 Create New Flow

1. Inside your **PRICE Calendar Sync** solution, click **+ New** > **Automation** > **Cloud flow** > **Automated**
2. Name it: `PRICE Calendar - Real-Time Sync`
3. Search for trigger: **When an item is created or modified (SharePoint)**
4. Click **Create**

### 2.2 Configure Trigger

- **Site Address**: `https://uflorida.sharepoint.com/sites/PRICE`
- **List Name**: `PRICECalendar` (or the exact name of your calendar list)

### 2.3 Add HTTP Action

1. Click **+ New step**
2. Search for **HTTP** and select it
3. Configure:

**Method**: `POST`

**URI**: `https://price.dental.ufl.edu/api/calendar/sync`

**Headers**:
```
Content-Type: application/json
X-API-Key: YOUR_API_KEY_HERE
```

**Body** (click in the body field, then switch to Expression mode and paste):
```json
{
  "sharepointEventId": "@{triggerOutputs()?['body/ID']}",
  "title": "@{triggerOutputs()?['body/Title']}",
  "description": "@{triggerOutputs()?['body/Description']}",
  "location": "@{triggerOutputs()?['body/Location']}",
  "eventStart": "@{triggerOutputs()?['body/EventDate']}",
  "eventEnd": "@{triggerOutputs()?['body/EndDate']}",
  "allDay": @{if(equals(triggerOutputs()?['body/fAllDayEvent'], true), 'true', 'false')},
  "studyCode": "@{triggerOutputs()?['body/Study_x003a_Title']}",
  "eventType": "@{triggerOutputs()?['body/Category/Value']}",
  "category": "@{triggerOutputs()?['body/Site/Value']}",
  "organizerName": "@{triggerOutputs()?['body/Lead_x0020_Experimenter/DisplayName']}",
  "organizerEmail": "@{triggerOutputs()?['body/Lead_x0020_Experimenter/Email']}",
  "rawData": {
    "subjectId": "@{triggerOutputs()?['body/SubjectID']}",
    "visit": "@{triggerOutputs()?['body/Visit/Value']}",
    "room": "@{triggerOutputs()?['body/Room/Value']}",
    "visitCancelled": @{if(equals(triggerOutputs()?['body/Visit_x0020_Cancelled'], true), 'true', 'false')},
    "confidential": @{if(equals(triggerOutputs()?['body/Confidential'], true), 'true', 'false')}
  }
}
```

> **Note**: Lookup columns (Study, Visit, Room) use `/Value` to get the text. Person columns use `/DisplayName` and `/Email`. Check internal column names if these don't work.

### 2.4 Save and Test

1. Click **Save**
2. Create or edit a test event in the SharePoint calendar
3. Check the flow run history to verify it succeeded

---

## Step 3: Create Flow 2 - Daily Full Sync

This flow runs daily to ensure all events are synced and handles any missed updates.

### 3.1 Create New Flow

1. Inside your solution, click **+ New** > **Automation** > **Cloud flow** > **Scheduled**
2. Name it: `PRICE Calendar - Daily Full Sync`
3. Set schedule: **Every 1 day** at **2:00 AM**
4. Click **Create**

### 3.2 Get All Calendar Items

1. Click **+ New step**
2. Search for **Get items (SharePoint)**
3. Configure:
   - **Site Address**: `https://uflorida.sharepoint.com/sites/PRICE`
   - **List Name**: `PRICECalendar`
   - **Filter Query** (optional - get last year of events):
     ```
     EventDate ge datetime'@{addDays(utcNow(), -365)}'
     ```

### 3.3 Select - Transform Items

1. Click **+ New step**
2. Search for **Select** (Data Operations)
3. Configure:
   - **From**: Select the `value` from the previous step
   - **Map**: Switch to **Map** mode and add these mappings:

| Key | Value |
|-----|-------|
| sharepointEventId | `@{item()?['ID']}` |
| title | `@{item()?['Title']}` |
| description | `@{item()?['Description']}` |
| location | `@{item()?['Location']}` |
| eventStart | `@{item()?['EventDate']}` |
| eventEnd | `@{item()?['EndDate']}` |
| allDay | `@{item()?['fAllDayEvent']}` |
| studyCode | `@{item()?['Study_x003a_Title']}` |
| eventType | `@{item()?['Category']?['Value']}` |
| category | `@{item()?['Site']?['Value']}` |
| organizerName | `@{item()?['Lead_x0020_Experimenter']?['DisplayName']}` |
| organizerEmail | `@{item()?['Lead_x0020_Experimenter']?['Email']}` |

### 3.4 HTTP - Bulk Sync

1. Click **+ New step**
2. Search for **HTTP**
3. Configure:

**Method**: `POST`

**URI**: `https://price.dental.ufl.edu/api/calendar/sync/bulk`

**Headers**:
```
Content-Type: application/json
X-API-Key: YOUR_API_KEY_HERE
```

**Body**:
```json
{
  "events": @{body('Select')},
  "fullSync": true
}
```

### 3.5 Save

Click **Save**. The flow will run automatically at 2 AM daily.

---

## Step 4: Create Flow 3 - Delete Handler

This flow marks events as inactive when deleted from SharePoint.

### 4.1 Create New Flow

1. Inside your solution, click **+ New** > **Automation** > **Cloud flow** > **Automated**
2. Name it: `PRICE Calendar - Delete Handler`
3. Search for trigger: **When an item is deleted (SharePoint)**
4. Click **Create**

### 4.2 Configure Trigger

- **Site Address**: `https://uflorida.sharepoint.com/sites/PRICE`
- **List Name**: `PRICECalendar`

### 4.3 Add HTTP Action

1. Click **+ New step**
2. Search for **HTTP**
3. Configure:

**Method**: `DELETE`

**URI**: `https://price.dental.ufl.edu/api/calendar/sync/@{triggerOutputs()?['body/ID']}`

**Headers**:
```
X-API-Key: YOUR_API_KEY_HERE
```

### 4.4 Save

Click **Save**.

---

## Finding Your SharePoint Column Names (IMPORTANT)

SharePoint lists can have custom columns with different names. You **must** find the correct internal names.

### Step-by-step:

1. Go to your SharePoint calendar: `https://uflorida.sharepoint.com/sites/PRICE/Lists/PRICECalendar/calendar.aspx`

2. Click **gear icon** > **List settings** (or **Settings** > **List settings**)

3. Scroll to the **Columns** section

4. **For each column you want to sync**, click on its name and look at the URL:
   - The URL will show: `...&Field=InternalColumnName`
   - Example: `...&Field=Study0` means the internal name is `Study0`

### PRICE Calendar Columns:

| Display Name | Internal Name | Type | Our API Field |
|--------------|---------------|------|---------------|
| Title | `Title` | Text | `title` |
| Start Time | `EventDate` | Date/Time | `eventStart` |
| End Time | `EndDate` | Date/Time | `eventEnd` |
| Description | `Description` | Text | `description` |
| Location | `Location` | Text | `location` |
| All Day Event | `fAllDayEvent` | Yes/No | `allDay` |
| Category | `Category` | Choice | `eventType` |
| Site | `Site` | Choice | `category` |
| Study:Title | `Study_x003a_Title` | Lookup (Title) | `studyCode` |
| Lead Experimenter | `Lead_x0020_Experimenter` | Person | `organizerName/Email` |
| SubjectID | `SubjectID` | Text | `rawData.subjectId` |
| Visit | `Visit` | Lookup | `rawData.visit` |
| Room | `Room` | Lookup | `rawData.room` |
| Visit Cancelled | `Visit_x0020_Cancelled` | Yes/No | `rawData.visitCancelled` |
| Confidential | `Confidential` | Yes/No | `rawData.confidential` |

> **Note**: For Lookup columns, use `['Column']?['Value']` to get the display text.
> For Person columns, use `['Column']?['DisplayName']` or `['Column']?['Email']`.

**Important**: If the internal name differs from the display name, you must use the internal name in Power Automate expressions.

### Example: If your Study column internal name is `Study0`:

In Power Automate, use:
```
@{triggerOutputs()?['body/Study0']}
```

NOT:
```
@{triggerOutputs()?['body/Study']}
```

---

## Troubleshooting

### Flow fails with 401 Unauthorized
- Check that the API key in the flow matches the one in your backend `.env`
- Ensure the backend has been restarted after adding the API key

### Flow fails with 404 Not Found
- Verify the backend URL is correct
- Check that the calendar module is deployed

### Events not showing in dashboard
- Check the flow run history for errors
- Verify the studyCode field is mapping correctly
- Check the database directly: `SELECT * FROM calendar_events ORDER BY created_at DESC LIMIT 10;`

### SharePoint column not found
- Double-check the column's internal name (not display name)
- Some columns may need `Value` suffix for lookup fields

---

## Testing

After setting up all flows:

1. **Create a test event** in SharePoint calendar with a study code
2. **Check Flow 1** run history - should succeed
3. **Refresh the dashboard** - new event should appear in stats
4. **Edit the event** - Flow 1 should trigger again
5. **Delete the event** - Flow 3 should trigger

For the daily sync, you can manually trigger it:
1. Open Flow 2
2. Click **Run** > **Run flow**
