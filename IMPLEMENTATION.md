# IMPLEMENTATION.md — Step-by-Step Claude Code Build Plan

> Work through these steps in order. Each step is one Claude Code prompt/task. Don't skip ahead. Confirm each step works before moving to the next.

---

## Phase 1 — Project Scaffold & Shell ✅ COMPLETE

### Step 1: Initialize the Project ✅
```
Create a new Vite + React project with Tailwind CSS and React Router v6.
Set up the basic file structure from CLAUDE.md.
Install dependencies: react-router-dom, lucide-react, recharts.
Confirm the dev server runs with a blank page.
```
> **Done.** Vite + React scaffolded, Tailwind CSS v3 configured, all deps installed. `pnpm dev` runs clean.

### Step 2: Build the Sidebar Component ✅
```
Create Sidebar.jsx — a fixed left sidebar (w-64, bg-slate-900, text-white, full height).
Items: Approval Queue, Dashboard, Campaigns, Voice Agent, SMS & Email, CRM, Inbox, Calendar,
Landing Pages, Activity Log, Settings. Each item has a lucide-react icon.
Active item highlighted with bg-slate-800 and a left blue border.
Approval Queue and Inbox items should have a notification count badge (hardcoded numbers for now — 7 and 3).
App logo/name "GrowthPilot" at the top of the sidebar.
Sidebar is collapsible to icons-only on a toggle button at the bottom.
```
> **Done.** `src/components/layout/Sidebar.jsx` — 11 nav items with lucide icons, active highlight via useLocation, badges on Approval Queue (7) & Inbox (3), collapse toggle with tooltips.

### Step 3: Build the Top Bar Component ✅
```
Create TopBar.jsx — fixed top bar to the right of the sidebar.
Contains: a search input (placeholder "Search contacts, campaigns..."),
a [+ New Campaign] button (blue, prominent),
a notification bell icon with a red count badge,
and a user avatar circle with initials "JM" on the far right.
Bell click should toggle a notification slide-out panel (empty placeholder for now).
Avatar click shows a small dropdown: Profile, Settings, Log Out.
```
> **Done.** `src/components/layout/TopBar.jsx` — search input, "+ New Campaign" button, bell with red badge + placeholder notification panel, avatar "JM" dropdown with Profile/Settings/Log Out.

### Step 4: Build the Main Layout Shell ✅
```
Create MainLayout.jsx that composes Sidebar + TopBar + a content area.
The content area is a scrollable main region to the right of the sidebar and below the top bar.
Set up React Router in App.jsx with all routes from CLAUDE.md pointing to placeholder page components
that just show the page name as an h1. Clicking sidebar items should navigate between routes.
Confirm: clicking every sidebar item shows the correct placeholder page.
```
> **Done.** `src/components/layout/MainLayout.jsx` + `src/App.jsx` with all 17 routes. All placeholder pages created in `src/pages/`. Build passes clean.

### Step 5: Build the Login Page ✅
```
Create LoginPage.jsx — a full-screen centered card (no sidebar, no top bar).
App logo "GrowthPilot" large at top, tagline "Your AI Growth Co-Pilot" below it,
a single blue [Log In] button. Clicking it navigates to "/".
The "/" route should render inside MainLayout. "/login" should render without MainLayout.
Make "/" the protected default — if not "logged in" (just a boolean state), redirect to "/login".
```
> **Done.** `src/pages/LoginPage.jsx` + `src/context/AppContext.jsx` with fake auth (boolean). Protected routes redirect to `/login`. Login navigates to `/`.

---

## Phase 2 — Mock Data Layer ✅ COMPLETE

### Step 6: Create All Mock Data Files ✅
```
Create the data/ directory with all mock data files for Prestige Kitchen & Bath (Austin, TX). 
Follow the mock data guidelines in CLAUDE.md exactly.

mockContacts.js — 18 contacts with: id, name, phone, email, leadScore (1-100), 
  pipelineStage, source (campaign name), lastContact (date), estimatedValue, 
  notes, aiSummary, timeline (array of touchpoint events). 
  Mix of stages: 3 New Lead, 3 Contacted, 3 Call Booked, 2 Call Completed, 
  2 Proposal, 2 Closed Won, 1 Closed Lost, 2 Nurture.

mockCampaigns.js — 5 campaigns with: id, name, channel (Facebook/Instagram/Google), 
  status (active/paused/completed), spend, cpl, bookedCalls, roas, startDate, endDate, 
  dailyBudget, adVariations (array of 3 each with copy, headline, ctr, cpl, status).

mockDashboard.js — object with: costPerBookedCall: 185, showRate: 72, closeRate: 28, 
  monthlyRevenue: 245000, pipelineValue: 1200000, 
  weeklySpendData (array of 7 days for chart), 
  leadsByChannel (for pie/bar chart), 
  funnelData (leads per stage with conversion rates),
  aiBriefing (paragraph of narrative text).

mockApprovalQueue.js — 8 items with: id, type (ad_creative/landing_page/call_script/
  email_sequence/budget_change/audience_expansion), title, description, 
  aiReasoning, status (pending), createdAt, urgency (high/medium/low), 
  previewContent (the actual content to review — ad copy, page sections, etc).

mockCallLog.js — 20 call records with: id, contactName, contactId, timestamp, 
  duration (seconds), outcome (booked/interested/no_answer/not_interested), 
  transcript (string), aiSummary.

mockMessages.js — 8 conversation threads with: id, contactName, contactId, 
  channel (sms/email), messages (array of {sender, text, timestamp}), 
  unread (boolean), aiDraftReply.

mockCalendarEvents.js — 10 upcoming booked calls with: id, contactName, contactId, 
  dateTime, duration, preBriefing (object with summary, history, aiAssessment, suggestedOpener).

mockSequences.js — 4 sequences with: id, name, type (sms/email/both), status, 
  steps (array of {stepNumber, channel, delay, message, sent, opened, clicked, replied, booked}).

mockActivityLog.js — 30 entries with: id, agent (ads/voice/sms/email), 
  action, timestamp, parameters, outcome, requiresApproval (boolean).
```

### Step 7: Create Shared Utility Components ✅
```
Create the shared components in components/shared/:

MetricCard.jsx — props: label, value, trend (up/down/flat), trendValue (e.g. "+12%"), 
  icon (optional). Card with the value large, label below in text-xs text-slate-500, 
  trend arrow colored green (up) or red (down) with the trend value.

StatusBadge.jsx — props: status, size (sm/md). Colored pill: 
  active=green, paused=amber, draft=slate, completed=blue, 
  pending=amber, urgent=red, live=green, archived=slate.

ApprovalActions.jsx — props: onApprove, onEdit, onReject. 
  Three buttons: green Approve, blue outline Edit, red outline Reject. 
  Compact, inline, consistent everywhere.

EmptyState.jsx — props: icon, title, description, actionLabel, onAction. 
  Centered empty state with icon, message, and optional CTA button.
```

---

## Phase 3 — Approval Queue (The Hero Screen) ✅ COMPLETE

### Step 8: Build the Approval Queue Page ✅
```
Build ApprovalQueuePage.jsx — this is the most important screen in the entire app.

Top: Tab filters — [All] [Ads] [Landing Pages] [Scripts] [Sequences] [Urgent]. 
  Clicking a tab filters the list. "All" is default. Show count per tab.

Below tabs: batch action bar — select all checkbox, "[X] selected", 
  [Approve Selected] [Dismiss Selected] buttons. Only visible when items are selected.

Main content: list of approval queue items from mockApprovalQueue.js. Each item is a card:
  - Left: checkbox for batch select
  - Type badge (colored by type using StatusBadge)
  - Title (bold, text-sm)
  - AI reasoning snippet (text-xs, text-slate-500, 2 lines max)
  - Urgency indicator (red dot for high, amber for medium, nothing for low)
  - Timestamp ("2 hours ago")
  - Right side: ApprovalActions buttons
  - Expand/collapse chevron

When expanded, show the full preview content:
  - For ad_creative: show the ad copy variations in a card grid
  - For landing_page: show section-by-section copy preview
  - For call_script: show the script as a structured flow
  - For email_sequence: show each email in sequence with subject + preview
  - For budget_change: show current vs proposed budget with reasoning
  - For audience_expansion: show current vs proposed audiences

Clicking Approve should remove the item from the list with a brief green flash. 
Clicking Reject should show an inline text input for a note, then remove. 
Clicking Edit should expand the item and make content editable.

Make this screen feel FAST and DECISIVE. Tight spacing, clear hierarchy, satisfying interactions.
```
> **Done.** Built `src/pages/ApprovalQueuePage.jsx` complete with local state for tab navigation, row selection and batch actions. Expandable items render correct preview data types according to mock data formats. Added inline decline forms and animation delays for item removal.

---

## Phase 4 — Dashboard

### Step 9: Build the Dashboard Page
```
Build DashboardPage.jsx using mockDashboard.js data.

Row 1: 5 MetricCards in a grid — Cost Per Booked Call ($185), Show Rate (72%), 
  Close Rate (28%), Revenue This Month ($245,000), Pipeline Value ($1.2M). 
  Each with a trend indicator.

Row 2: 4 channel performance cards in a grid:
  - Facebook/Instagram: mini spend + CPL + booked calls numbers
  - Google Ads: same structure
  - Voice Agent: calls made + answer rate + booking rate
  - SMS/Email: messages sent + response rate + booking rate
  Each card clickable (just log to console for now).

Row 3: Two columns:
  Left (wider): Pipeline funnel visualization using Recharts — horizontal funnel/bar chart 
  showing lead count at each stage with conversion rates between stages.
  Right: AI Weekly Briefing card — a bordered card with a sparkle icon header 
  "AI Weekly Briefing" and the narrative text from mock data.

Row 4: "Recent Closed Deals — Full Attribution" — a compact table showing 5 rows, 
  each with: contact name, deal value, and a horizontal journey path 
  (Facebook Ad → Landing Page → Voice Call → SMS → Call Booked → Closed). 
  Show as a chain of small badges/pills connected by arrows.

Use Recharts for a "Weekly Ad Spend" small line chart somewhere appropriate.
```

---

## Phase 5 — CRM & Contacts ✅ COMPLETE

### Step 10: Build the CRM Pipeline View (Kanban) ✅
```
Build CrmPage.jsx with a toggle at the top: [Pipeline View] [List View].

Pipeline View (default): horizontal scrolling kanban board. 
Columns: New Lead | Contacted | Call Booked | Call Completed | Proposal | Closed Won | Closed Lost | Nurture.
Each column has a header with stage name and count.
Lead cards inside each column show: name, lead score badge (colored: green >70, amber 40-70, red <40), 
source icon (facebook/google/other), estimated value, last activity timestamp.
Cards are draggable between columns (use simple drag and drop — onDragStart/onDragOver/onDrop, 
no external library needed). When dropped in a new column, update the contact's stage in state.
Clicking a card navigates to /crm/:id.
```
> **Done.** `src/pages/CrmPage.jsx` implements a visual Kanban board with native HTML drag-and-drop dragging.

### Step 11: Build the CRM List View ✅
```
Add the List View to CrmPage.jsx (toggled by the view switcher).

A sortable table with columns: Name, Lead Score, Stage (badge), Source, Last Contact, Est. Value.
Clicking column headers sorts the table.
Search bar above the table that filters by name.
Filter dropdowns: Stage, Source, Score Range.
Bulk action bar: select rows with checkboxes → [Add to Sequence] [Change Stage] [Export].
Clicking a row navigates to /crm/:id.
```
> **Done.** Added the table view toggled from Pipeline View. It includes a basic sorting UI handling all required fields, text filtering by contact name, and multiple select to test bulk actions.

### Step 12: Build the Contact Detail Page ✅
```
Build ContactDetailPage.jsx — reads the contact id from the URL, finds it in mock data.

Header section: name (large), phone, email, lead score badge, pipeline stage badge, 
source campaign name. [Call] [SMS] [Email] action buttons on the right.

AI Summary Card: bordered card with sparkle icon, heading "What You Need to Know", 
and the contact's aiSummary text.

Recommended Next Action card: a highlighted card suggesting an action with a CTA button 
(e.g., "Schedule a follow-up call — this lead showed high interest but hasn't booked yet" 
with a [Schedule Call] button).

Tab nav below: Timeline | Transcripts | Notes | Activity

Timeline tab: chronological feed of touchpoints. Each entry has an icon (phone, message, 
mail, globe, file-text, calendar), timestamp, and description. Render from the contact's 
timeline array in mock data.

Transcripts tab: if the contact has voice agent call transcripts in mockCallLog, 
show them as expandable cards with AI summary + full transcript text.

Notes tab: list of notes with timestamps + an "Add Note" textarea at top.

Activity tab: all ad clicks, page views, form fills as a simple event list.
```
> **Done.** Built `src/pages/ContactDetailPage.jsx` properly connecting to both `mockContacts` and `mockCallLogs` to supply the various tab content views. Added formatting utility imports for dates & money elements. Added specific styling matching Figma expectations for timeline and chat transcript details.

---

## Phase 6 — Inbox ✅ COMPLETE

### Step 13: Build the Inbox Page ✅
```
Build InboxPage.jsx as a split-pane layout.

Left pane (w-80, border-right): conversation list.
  Filter tabs at top: [All] [SMS] [Email] [Calls] [Unread]
  Each conversation row: avatar circle with initials, contact name, 
  channel icon (message-square for SMS, mail for email), 
  last message preview (truncated, text-xs, text-slate-500), 
  timestamp, unread blue dot if applicable.
  Sorted by most recent. Clicking a conversation selects it (highlighted bg).

Right pane (flex-1): conversation thread.
  Header: contact name + channel badge + quick actions ([Book Call] [Add Note] [Change Stage] as small buttons).
  Message thread: chat bubble style. Lead messages left-aligned (bg-slate-100), 
  business messages right-aligned (bg-blue-50). Each bubble shows text + timestamp below.
  
  At the bottom: AI draft reply section.
  A bordered box labeled "AI Suggested Reply" with editable textarea pre-filled with the 
  aiDraftReply from mock data. Below it: [Send as Written] (blue) and [Edit & Send] (outline) buttons.
  
  Right sidebar (w-64): mini contact card — name, score, stage, source, last call date,
  estimated value. Link to full contact profile.
```
> **Done.** `src/pages/InboxPage.jsx` — split-pane layout with conversation list (w-80), filter tabs (All/SMS/Email/Calls/Unread), conversation thread with chat bubbles, AI suggested reply with Send/Edit & Send buttons, and right sidebar mini contact card with View Full Profile link. Conversations sorted by most recent. Quick actions: Book Call, Add Note, Change Stage.

---

## Phase 7 — Campaigns Flow ✅ COMPLETE

### Step 14: Build the Campaigns List Page ✅
```
Build CampaignsPage.jsx.

Filter tabs: [Active] [Paused] [Draft] [Completed] [All]
[+ New Campaign] button (top right, blue, prominent) → navigates to /campaigns/new.

Campaign cards or table rows showing: 
  Campaign name, channel icon (facebook/google), status badge, 
  spend (formatted as currency), CPL, booked calls count, ROAS.
Click → navigate to /campaigns/:id.
Compact card layout — one campaign per row, all key metrics visible at a glance.
```

### Step 15: Build the Campaign Detail Page ✅
```
Build CampaignDetailPage.jsx — reads campaign id from URL.

Header: campaign name, status badge, channel icon, date range, total spend.

Tab nav: Overview | Ads | Audiences | Landing Page | Attribution

Overview tab: strategy summary paragraph, budget progress bar 
(spent vs total), key metric cards (CPL, CTR, Booked Calls, ROAS).

Ads tab: grid of 3 ad variation cards. Each card shows:
  - Ad headline + body copy preview
  - Performance metrics: CTR, CPL, Impressions, Spend
  - Status badge (active/paused/fatigued)
  - A "fatigue" warning badge if CTR has dropped below threshold
  [Request New Creative] button at bottom → shows toast "Sent to Approval Queue"

Audiences tab: table of audience segments — name, type (lookalike/retargeting/interest), 
size, CPL, booked calls. Exclusion list section below.

Landing Page tab: a mock preview frame (just a styled div that looks like a landing page 
with a headline, subheadline, CTA button, and testimonial section). 
Conversion rate displayed prominently. [Edit Page] button.

Attribution tab: table showing leads from this campaign with their full journey 
(touchpoints as a chain of small badges).
```

### Step 16: Build the New Campaign Wizard ✅
```
Build NewCampaignWizardPage.jsx — a multi-step wizard with a progress indicator at top.

Step 1 — Goal: 4 selectable cards — Book Calls, Applications, Webinar Registrations, Phone Calls. 
Click to select, [Next] button.

Step 2 — Channel: 3 selectable cards — Facebook/Instagram, Google Ads, Both. [Back] [Next].

Step 3 — AI Generation: Show a loading state ("AI is building your campaign...") 
for 2 seconds, then reveal the full generated package:
  - Strategy overview (paragraph)
  - Target audience description
  - 3 ad copy variations (each in a card with headline + body + CTA)
  - Landing page preview (mock)
  - Budget recommendation
  
  THIS IS WHERE CLAUDE API CAN BE USED. If API key is available, call Claude to generate 
  3 ad copy variations for Prestige Kitchen & Bath. System prompt from CLAUDE.md. 
  User prompt: "Generate 3 Facebook ad variations for a kitchen remodel business. 
  Each should test a different angle: 1) pain/frustration with current kitchen, 
  2) aspiration/dream kitchen lifestyle, 3) social proof/neighbor just did it. 
  For each: headline (under 40 chars), body copy (under 125 words), CTA text."
  If no API key or call fails, use hardcoded mock ad copy.
  [Back] [Next].

Step 4 — Review & Edit: Same content as Step 3 but all text fields are editable (contentEditable 
or textarea swap on click). [Back] [Next].

Step 5 — Budget & Launch: daily budget input (slider + number input, default $150/day), 
start date picker, summary card showing everything, [Launch Campaign] button (large, green). 
Clicking it shows a success animation/toast and redirects to /campaigns.
```

---

## Phase 8 — Voice Agent ✅ COMPLETE

### Step 17: Build the Voice Agent Page ✅
```
Build VoiceAgentPage.jsx with tab nav: Overview | Call Log | Scripts | Settings.

Overview tab:
  - Metric cards row: Calls Today (14), Calls This Week (67), Answer Rate (43%), 
    Booking Rate (31%), Avg Duration (2m 34s)
  - Active hours indicator: green badge "Active Now — 9AM to 7PM CST"
  - Donut chart (Recharts PieChart): call outcomes breakdown 
    (Booked 31%, Interested 24%, No Answer 33%, Not Interested 12%)

Call Log tab:
  - Table: contact name, timestamp, duration, outcome badge (colored). 
  - Click row → expand inline showing:
    - AI Summary paragraph
    - Full transcript (formatted as a dialogue — Agent: / Lead:)
    - Key info extracted (interested in: kitchen remodel, timeline: 3 months, budget: ~$40k)
    - Outcome action taken (e.g., "Call booked for Thursday 2pm")
  - Filters: [All] [Booked] [Interested] [No Answer] [Not Interested]

Scripts tab:
  - Active script card showing the structured flow:
    - Introduction block (what the agent says first)
    - Qualifying Questions block (numbered list)
    - Objection Handling block (if/then format)
    - Booking Transition block (how it moves to scheduling)
  - [Edit Script] button → makes blocks editable
  - [Create New Script] button → either calls Claude API to generate a new script 
    or shows a mock "generating..." then reveals a new script. Sends to approval queue.

Settings tab:
  - Active hours: two time pickers (start/end)
  - Max calls per lead per day: number input (default 2)
  - Voicemail message: textarea with current voicemail script
  - Human handoff: toggle + description of when handoff triggers
  - Blocked numbers: textarea for number list
```

---

## Phase 9 — SMS & Email Sequences ✅ COMPLETE

### Step 18: Build the SMS & Email Pages ✅
```
Build SmsEmailPage.jsx:
  - Filter tabs: [Active] [Draft] [Paused] [All]
  - [+ New Sequence] button
  - Sequence cards showing: name, type badge (SMS/Email/Both), status badge, 
    steps count, open rate, booking rate.
  - Click → navigate to /sms-email/:id

Build SequenceDetailPage.jsx:
  - Header: sequence name, type badge, status badge, [Pause] [Edit] [Duplicate] buttons
  - Visual vertical timeline of steps. Each step is a node on the timeline:
    - Step number circle
    - Channel icon (message-square or mail)
    - Delay label between steps ("Wait 24 hours", "Wait 3 days")
    - Message preview (truncated)
    - Mini metrics: sent, opened, clicked, replied
  - Click any step → expand to show full message text + detailed metrics
  - AI recommendation card at bottom: "Step 4 has a 4% open rate — consider 
    a shorter subject line or different send time"
```

---

## Phase 10 — Calendar ✅ COMPLETE

### Step 19: Build the Calendar Page ✅
```
Build CalendarPage.jsx with tabs: Calendar View | Upcoming Calls | Booking Settings.

Calendar View tab:
  - Week view grid (Mon-Fri, 8am-6pm). Today highlighted.
  - Booked calls shown as colored blocks with contact name + time.
  - Click a booking → slide-out panel from the right showing Pre-Call Briefing:
    - Contact name + phone + email
    - "About This Lead" summary paragraph
    - Interaction history (compact timeline)
    - AI Assessment: "High interest — mentioned budget of $45k and timeline of 2 months"
    - Suggested opener: "Ask about their timeline for the master bath project they mentioned"
    - [View Full Profile] link to /crm/:id
  - Show rate badge in the header: "This Week's Show Rate: 75%"

Upcoming Calls tab:
  - "Today" section: list of today's calls with time, contact name, 
    briefing link, [Join Call] button
  - "This Week" section: same format
  - "No-Shows Requiring Re-booking" section: flagged contacts with 
    [Rebook] [Remove] buttons

Booking Settings tab:
  - Availability windows: day-of-week toggles with start/end time pickers
  - Buffer time: number input (minutes between calls)
  - Meeting duration: dropdown (15/30/45/60 min)
  - Reminder sequence: toggle on/off, timing inputs 
    (reminder 1: X hours before, reminder 2: X hours before), 
    message preview textareas
```

---

## Phase 11 — Landing Pages ✅ COMPLETE

### Step 20: Build the Landing Pages Section ✅
```
Build LandingPagesPage.jsx:
  - Filter tabs: [Live] [Draft] [Split Testing] [Archived] [All]
  - [+ New Page] button
  - Card grid: each card shows a mock page thumbnail (colored rectangle with headline text), 
    page name, linked campaign, conversion rate, traffic count, status badge
  - Click → navigate to /landing-pages/:id

Build PageEditorPage.jsx:
  - Top bar: page name (editable), [Desktop] [Mobile] toggle, 
    [Save Draft] [Publish] [Create Variant] buttons
  - Main area: a mock landing page preview rendered as styled divs:
    - Hero section: headline, subheadline, CTA button, background
    - Social proof bar: "Trusted by 500+ Austin homeowners"
    - Benefits section: 3 columns with icons
    - Testimonial section: quote card
    - Final CTA section
  - Each section has a subtle hover overlay with an [Edit] icon. 
    Click → section becomes editable (text fields replace static text).
  - Left sidebar: section list (draggable to reorder): Hero, Social Proof, 
    Benefits, Testimonials, CTA, FAQ
```

---

## Phase 12 — Activity Log & Settings ✅ COMPLETE

### Step 21: Build the Activity Log Page ✅
```
Build ActivityLogPage.jsx:
  - Search bar at top
  - Filter bar: Agent dropdown (All/Ads/Voice/SMS/Email), 
    Type dropdown, Date range, Approved vs Auto-executed toggle
  - Chronological feed (newest first). Each entry is a compact row:
    - Timestamp (text-xs, text-slate-400)
    - Agent icon + name badge
    - Action description text
    - Parameters/context (text-xs, collapsible)
    - Outcome badge (success/warning/info)
    - "Required Approval" / "Auto-executed" label
  - Load from mockActivityLog.js
  - Pagination or "Load More" at bottom
```

### Step 22: Build the Settings Page ✅
```
Build SettingsPage.jsx with tab navigation across the top:

Business Profile tab:
  - Form fields: Business Name, Website URL, Offer Description (textarea), 
    Ideal Client Description (textarea), Brand Voice/Tone (dropdown: Professional/Casual/Friendly/Authoritative),
    Conversion Goal (dropdown: Phone Call/Booking/Application/Form Fill)
  - [Re-scan Website] button with loading state
  - [Save Changes] button

Agent Controls tab:
  - 4 agent cards (Ads, Voice, SMS, Email). Each card has:
    - Agent name + icon
    - Mode toggle switch: Review Mode ↔ Supervised Mode (with explanation text for each)
    - Agent-specific parameters:
      - Ads: Daily spend ceiling ($ input), Budget reallocation threshold (% slider)
      - Voice: Active hours (time pickers), Max calls/lead/day (number), 
        Blocked area codes (text input)
      - SMS: Sequence cadence (dropdown), Daily volume cap (number), 
        Sending window (time pickers)
      - Email: Daily send limit (number), Sending hours (time pickers)

Integrations tab:
  - Connection cards: Meta Business Manager, Google Ads, Google Calendar, 
    Twilio, Voice Provider, Zapier/Make
  - Each shows: service logo/icon, name, status (Connected ✓ green / Not Connected grey), 
    [Connect] or [Disconnect] button
  - Clicking Connect just toggles the status (fake)

Pipeline Stages tab:
  - Draggable list of stages with default stages pre-loaded
  - Each row: drag handle, stage name (editable), [Delete] button
  - [+ Add Stage] button at bottom
  - [Save Changes] button

Notifications tab:
  - Grid/table: event types as rows, channels as columns (Push, Email, In-App)
  - Toggle switches at each intersection
  - Event types: New Lead, Call Booked, Call Completed, Budget Alert, 
    Agent Exception, Daily Digest
  - Daily digest time picker

Compliance tab:
  - Suppression list: file upload area (fake) + current count display
  - Consent documentation: read-only viewer showing consent text
  - TCPA settings: calling hours window, frequency limits
  - Industry guardrails: checkboxes for Medical, Financial, Real Estate 
    with description of what each enables

Account tab:
  - User profile: name, email, phone (editable fields)
  - Billing: mock plan card "Growth Plan — $497/mo" with [Change Plan] button
  - Team members: list with name, email, role badge, [Remove] button. 
    [+ Invite Member] button.
```

---

## Phase 13 — Polish & Connections ✅ COMPLETE

### Step 23: Wire Up the Notification Panel ✅
```
Build NotificationPanel.jsx — a slide-out panel from the right edge, 
triggered by clicking the bell icon in TopBar.

Sections:
  - "Urgent" — 2-3 items with red left border (new lead, budget alert)
  - "Today" — 5-6 items (calls made, sequences sent, approvals waiting)
  - Each notification: icon, title, description, timestamp, unread dot
  - [Mark All Read] button at top
  - [View All] link at bottom → navigates to /activity-log

Click outside the panel or press Escape to close it.
```

### Step 24: Wire Up Global Search ✅
```
Add functionality to the search input in TopBar.
When typing, show a dropdown below the search bar with results grouped by type:
  - Contacts (filter mockContacts by name)
  - Campaigns (filter mockCampaigns by name)
  - Pages (mock landing page names)
Show max 3 results per category. Click a result → navigate to the detail page.
Show "No results" if nothing matches.
```

### Step 25: Add Badge Counts & Cross-Page Links ✅
```
Make sidebar badge counts dynamic:
  - Approval Queue badge = count of items in mockApprovalQueue
  - Inbox badge = count of unread conversations in mockMessages
  
Wire up cross-page navigation links:
  - Dashboard channel cards → click navigates to the relevant page
  - Contact detail [View Campaign] links → /campaigns/:id
  - Calendar briefing [View Full Profile] → /crm/:id
  - Campaign detail landing page [Edit Page] → /landing-pages/:id
  - Any "Send to Approval Queue" action → shows toast + increments badge count
```

### Step 26: Add Loading States & Empty States ✅
```
Add loading skeletons to pages that would realistically load data:
  - Dashboard: skeleton cards that pulse before "data loads" (fake 500ms delay)
  - CRM: skeleton kanban columns
  - Campaign detail: skeleton content area

Add empty states using EmptyState.jsx for:
  - CRM filtered view with no results
  - Call log with no calls matching filter
  - Inbox with no unread messages
  - Search with no results
```

### Step 27: Build the Onboarding Wizard ✅
```
Build OnboardingPage.jsx — a full-screen wizard (no sidebar/topbar, separate from MainLayout).

Progress indicator at top showing 6 steps.

Step 1 — Website URL: "Paste your website URL and we'll build your profile"
  Text input + [Scan My Site] button → fake loading bar (3 seconds) → "Profile Built!" checkmark

Step 2 — Review Profile: Show generated profile with editable fields 
  (business name, offer, target audience, tone, conversion goal). 
  Pre-filled with Prestige Kitchen & Bath data. [Looks Good] [Edit] buttons.

Step 3 — Connect Integrations: 6 integration cards (same as Settings integrations tab). 
  Toggle connect/disconnect. [Skip for Now] and [Next] buttons.

Step 4 — Agent Preferences: 4 agent cards with Review/Supervised toggle. 
  Brief explanation of each mode. Defaults: Ads=Review, Voice=Supervised, 
  SMS=Supervised, Email=Supervised.

Step 5 — Pipeline Stages: draggable list pre-filled with defaults. 
  User can reorder, rename, add, remove.

Step 6 — Done: celebratory screen. "You're all set! Your AI has already started 
  building your first campaign." [Go to Approval Queue →] button → navigates to /.

Each step has [Back] and [Next] buttons. Can skip to end.
```
> **Done.** Phase 13 complete. NotificationPanel.jsx built with urgent/today sections and slide-out animation. Global search wired in TopBar with grouped results (Contacts, Campaigns, Pages). Cross-page links added: ContactDetail source→campaign, VoiceAgent call log names→/crm/:id, approval badge increments on "Request New Creative" and "Create New Script". Loading skeletons added to Dashboard (500ms), CRM pipeline (400ms), CampaignDetail (300ms). Empty states added to CRM list view, VoiceAgent call log, and Inbox conversation list. Full 6-step OnboardingPage wizard built and routed outside MainLayout. Build passes clean.

---

## Phase 14 — Final Review & Cleanup ✅ COMPLETE

### Step 28: Full Navigation Audit ✅
```
Go through every page and confirm:
  - Every sidebar link works and highlights correctly
  - Every clickable card/row navigates to the correct detail page
  - Back navigation works (browser back button)
  - No dead-end pages (every page has a way to navigate elsewhere)
  - No broken imports or console errors
  - All mock data renders correctly
  - The app looks good at 1280px wide viewport minimum
```

### Step 29: Visual Polish Pass ✅
```
Do a final polish pass across all pages:
  - Consistent spacing (p-6 for page padding, gap-4 between cards, gap-6 between sections)
  - Consistent text sizing (text-2xl for page titles, text-sm for body, text-xs for metadata)
  - Consistent card styling (bg-white rounded-lg border border-slate-200 p-4 everywhere)
  - Hover states on all clickable elements (hover:bg-slate-50 for rows, hover:bg-blue-700 for buttons)
  - Consistent badge colors matching StatusBadge component
  - No orphaned placeholder text ("Lorem ipsum", "TODO", etc.)
  - All dollar amounts formatted with commas ($245,000 not $245000)
  - All percentages have % symbol
  - All dates in readable format (Feb 28, 2026 not 2026-02-28)
```
> **Done.** Phase 14 complete. Full navigation audit passed clean — all 11 sidebar links, all navigate() targets, all :id routes verified. Visual polish pass found and fixed 4 issues: ApprovalQueuePage h1 `font-bold` → `font-semibold`, CampaignDetailPage and ContactDetailPage h1 `text-xl` → `text-2xl`, and NewCampaignWizardPage raw ISO date → `formatDate()`. Build passes clean.

---

## Quick Reference — File Dependency Order

Build files in roughly this order to minimize broken imports:

```
1.  src/utils/constants.js
2.  src/utils/formatters.js
3.  src/data/*.js (all mock data)
4.  src/context/AppContext.jsx
5.  src/components/shared/*.jsx
6.  src/components/layout/*.jsx
7.  src/pages/LoginPage.jsx
8.  src/App.jsx (router setup)
9.  src/pages/ApprovalQueuePage.jsx
10. src/pages/DashboardPage.jsx
11. src/pages/CrmPage.jsx
12. src/pages/ContactDetailPage.jsx
13. src/pages/InboxPage.jsx
14. src/pages/CampaignsPage.jsx
15. src/pages/CampaignDetailPage.jsx
16. src/pages/NewCampaignWizardPage.jsx
17. src/pages/VoiceAgentPage.jsx
18. src/pages/SmsEmailPage.jsx
19. src/pages/SequenceDetailPage.jsx
20. src/pages/CalendarPage.jsx
21. src/pages/LandingPagesPage.jsx
22. src/pages/PageEditorPage.jsx
23. src/pages/ActivityLogPage.jsx
24. src/pages/SettingsPage.jsx
25. src/pages/OnboardingPage.jsx
```

---

## Notes for Claude Code

- **Every step is one prompt.** Copy the code block for that step and paste it as your Claude Code prompt. Each is scoped to be completable in one pass.
- **Test after every step.** Run the dev server, click around, confirm it works before moving on.
- **Mock data is king.** Everything renders from the mock data files. If a screen looks empty, the mock data is probably missing a field.
- **No real backend. No database. No auth.** Everything is in-memory React state + static mock data. The only external call is optionally to the Claude API.
- **If something breaks, fix it before moving on.** Don't accumulate broken screens.
