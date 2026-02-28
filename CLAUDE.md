# CLAUDE.md — Agentic Growth Co-Pilot Demo Build

## What This Is

A **non-functional clickable prototype** of an AI-powered growth co-pilot for B2C high-ticket service businesses. This is a demo/pitch build — no real backend, no real data, no real integrations. Every screen should look and feel like a real app but all data is mocked/hardcoded. The only real API call is to Claude (Anthropic) for generating demo AI outputs on demand (ad copy, scripts, etc.).

## Tech Stack

- **Framework**: React (Vite) with React Router for SPA navigation
- **Styling**: Tailwind CSS (utility classes only, no custom config needed)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State**: React useState/useContext (no Redux, no external state management)
- **API**: Anthropic Claude API for live AI generation demos (optional — mock responses are acceptable fallback)
- **Storage**: In-memory only. No localStorage, no database, no Supabase.
- **Auth**: Fake. Click "Log In" → enter the app. No credentials, no tokens.

## Project Structure

```
src/
├── App.jsx                    # Router + layout shell
├── main.jsx                   # Entry point
├── index.css                  # Tailwind imports
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx        # Left nav with badges
│   │   ├── TopBar.jsx         # Search, notification bell, quick actions, avatar
│   │   └── MainLayout.jsx     # Shell wrapping sidebar + topbar + content area
│   │
│   ├── shared/
│   │   ├── MetricCard.jsx     # Reusable KPI card (value, label, trend arrow)
│   │   ├── StatusBadge.jsx    # Colored pill badges (Active, Draft, Paused, etc.)
│   │   ├── ApprovalActions.jsx # [Approve] [Edit] [Reject] button group
│   │   ├── EmptyState.jsx     # Placeholder for empty views
│   │   └── NotificationPanel.jsx # Slide-out notification tray
│   │
│   └── features/
│       ├── approval-queue/
│       ├── dashboard/
│       ├── campaigns/
│       ├── voice-agent/
│       ├── sms-email/
│       ├── crm/
│       ├── inbox/
│       ├── calendar/
│       ├── landing-pages/
│       ├── activity-log/
│       └── settings/
│
├── pages/
│   ├── LoginPage.jsx
│   ├── OnboardingPage.jsx
│   ├── ApprovalQueuePage.jsx
│   ├── DashboardPage.jsx
│   ├── CampaignsPage.jsx
│   ├── CampaignDetailPage.jsx
│   ├── NewCampaignWizardPage.jsx
│   ├── VoiceAgentPage.jsx
│   ├── SmsEmailPage.jsx
│   ├── SequenceDetailPage.jsx
│   ├── CrmPage.jsx
│   ├── ContactDetailPage.jsx
│   ├── InboxPage.jsx
│   ├── CalendarPage.jsx
│   ├── LandingPagesPage.jsx
│   ├── PageEditorPage.jsx
│   ├── ActivityLogPage.jsx
│   └── SettingsPage.jsx
│
├── data/
│   ├── mockContacts.js        # 15-20 fake leads with full profiles
│   ├── mockCampaigns.js       # 4-5 fake campaigns with metrics
│   ├── mockCallLog.js         # 20+ fake call records with transcripts
│   ├── mockMessages.js        # SMS/email conversation threads
│   ├── mockApprovalQueue.js   # 6-10 pending approval items of various types
│   ├── mockDashboard.js       # KPI numbers, chart data, funnel data
│   ├── mockActivityLog.js     # Agent action log entries
│   ├── mockCalendarEvents.js  # Upcoming booked calls
│   └── mockSequences.js       # Email/SMS sequences with steps
│
├── context/
│   └── AppContext.jsx         # Global state (current user, notification count, etc.)
│
├── hooks/
│   └── useClaudeAPI.js        # Hook for Claude API calls (with mock fallback)
│
└── utils/
    ├── formatters.js          # Currency, dates, percentages
    └── constants.js           # Pipeline stages, agent modes, channel types
```

## Routing Map

```
/login                → LoginPage
/onboarding           → OnboardingPage (linear wizard, 6 steps)
/                     → ApprovalQueuePage (default home after login)
/dashboard            → DashboardPage
/campaigns            → CampaignsPage (list)
/campaigns/:id        → CampaignDetailPage (tabs: overview, ads, audiences, landing page, attribution)
/campaigns/new        → NewCampaignWizardPage (multi-step wizard)
/voice-agent          → VoiceAgentPage (tabs: overview, call log, scripts, settings)
/sms-email            → SmsEmailPage (sequences list)
/sms-email/:id        → SequenceDetailPage
/crm                  → CrmPage (toggle: pipeline kanban ↔ list table)
/crm/:id              → ContactDetailPage (tabs: timeline, transcripts, notes, activity)
/inbox                → InboxPage (split pane: conversation list | thread detail)
/calendar             → CalendarPage (tabs: calendar view, upcoming calls, booking settings)
/landing-pages        → LandingPagesPage (list)
/landing-pages/:id    → PageEditorPage
/activity-log         → ActivityLogPage
/settings             → SettingsPage (tabs: business profile, agent controls, integrations, pipeline, notifications, compliance, account)
```

## Auth Flow (Fake)

1. User lands on `/login`
2. Screen shows app logo, tagline, and a single "Log In" button
3. Click → navigate to `/onboarding` (first time) or `/` (returning)
4. For demo purposes, always go to `/` (skip onboarding by default, but onboarding route should exist and be navigable)

## Screen-by-Screen Build Instructions

### Login Page
- Clean centered card. App logo + name at top.
- Tagline: "Your AI Growth Co-Pilot"
- Single prominent "Log In" button. No form fields.
- Click → redirect to `/`

### Onboarding Page
A linear 6-step wizard. Each step has back/next. Steps:
1. **Website URL** — paste field + "Scan My Site" button → fake loading → "Profile built!"
2. **Review Business Profile** — show AI-generated profile (mock) with editable fields: business name, offer, target audience, tone, conversion goal
3. **Connect Integrations** — cards for Meta, Google Ads, Google Calendar, Twilio, each with a [Connect] button that toggles to [Connected ✓]
4. **Agent Preferences** — toggle per agent (Ads, Voice, SMS, Email) between "Review Mode" and "Supervised Mode" with explanation text
5. **Pipeline Stages** — draggable list with defaults pre-filled, add/remove/rename
6. **Done** — "Your first AI-generated campaign is waiting in the Approval Queue" → button to go to `/`

### Approval Queue (Home — `/`)
- Tab filters: All | Ads | Landing Pages | Scripts | Sequences | Urgent
- List of 6-10 queued items. Each item is a card showing:
  - Type badge (color-coded)
  - Title ("New Facebook Ad Set — Kitchen Remodel Campaign")
  - AI reasoning snippet ("I created 3 variations testing pain vs. aspiration angles...")
  - Expandable preview section
  - **[Approve]** (green) **[Edit]** (blue) **[Reject]** (red outline) buttons
- Batch select checkboxes + batch action bar at top
- This is the most important screen — make it feel fast and decisive

### Dashboard
- **Top KPI row**: Cost Per Booked Call, Show Rate, Close Rate, Revenue This Month, Pipeline Value — all as `MetricCard` components with trend arrows
- **Channel cards row**: Facebook/IG, Google Ads, Voice Agent, SMS/Email — each card shows mini metrics, clickable
- **Pipeline funnel**: visual funnel or horizontal bar showing conversion between stages
- **AI Weekly Briefing**: a card with a narrative paragraph (mock AI-generated insight)
- **Attribution journeys**: small table showing last 5 closed deals with their full touchpoint path
- Use Recharts for any line/bar charts (spend over time, leads over time)

### Campaigns Page
- Table/card list of campaigns
- Columns: Name, Status (badge), Channel, Spend, CPL, Booked Calls, ROAS
- Filter tabs: Active | Paused | Draft | Completed
- [+ New Campaign] button → `/campaigns/new`
- Click row → `/campaigns/:id`

### Campaign Detail Page
- Header: campaign name, status badge, date range, total spend
- Tab nav: Overview | Ads | Audiences | Landing Page | Attribution
- **Overview tab**: strategy summary text, budget bar, key metrics
- **Ads tab**: card grid of ad variations with copy preview, CTR, CPL. Fatigue indicators. "Request New Creative" button
- **Audiences tab**: audience segments table with performance
- **Landing Page tab**: embedded preview frame + conversion rate
- **Attribution tab**: journey breakdown table for leads from this campaign

### New Campaign Wizard
5 steps:
1. **Goal**: Select one — Book Calls / Applications / Webinar / Phone Calls
2. **Channel**: Facebook/IG, Google, or Both
3. **AI Generation**: Loading animation → then show full generated package: strategy, audiences, 3 ad copy variations, landing page preview, budget recommendation. This is where Claude API can be called live to generate ad copy. Fall back to mock if no API key.
4. **Review & Edit**: Everything from step 3 but editable inline
5. **Budget & Launch**: Set daily budget, review summary, [Launch Campaign] button

### Voice Agent Page
- Tab nav: Overview | Call Log | Scripts | Settings
- **Overview**: today's calls count, answer rate, booking rate donut chart, avg call duration, active hours indicator
- **Call Log**: table — lead name, time, duration, outcome badge (Booked/Interested/No Answer/Not Interested). Click row → expand with transcript + AI summary
- **Scripts**: active script preview as a structured card (intro → questions → objection handling → booking). [Edit Script] and [Create New Script] buttons
- **Settings**: form fields — active hours, max calls/lead/day, voicemail message textarea, human handoff toggle

### SMS & Email Page
- Sequence list: cards showing name, type (SMS/Email/Both), status badge, open rate, booking rate
- Filters: Active | Draft | Paused
- [+ New Sequence] button
- Click → `/sms-email/:id`

### Sequence Detail Page
- Visual vertical timeline showing each step: step number, channel icon (SMS/Email/Call), delay between steps, message preview
- Click any step → expand to show full message + metrics (sent, opened, clicked, replied, booked)
- AI recommendation card at bottom ("Step 3 has low engagement — consider shortening the message")

### CRM Page
- Toggle: **Pipeline View** (kanban) ↔ **List View** (table)
- **Pipeline/Kanban**: columns for each stage (New Lead → Contacted → Call Booked → Call Completed → Proposal → Closed Won → Closed Lost → Nurture). Lead cards show name, score badge, source icon, last activity timestamp. Cards are draggable between columns.
- **List View**: sortable table with columns — Name, Score, Stage, Source, Last Contact, Est. Value. Bulk action bar. Search + filter dropdowns.
- Click any contact → `/crm/:id`

### Contact Detail Page
- **Header**: name, phone, email, lead score (colored badge), pipeline stage badge, source campaign
- **AI Summary Card**: "Here's what you need to know..." paragraph
- **Recommended Next Action**: card with action button ("Schedule follow-up call")
- Tab nav: Timeline | Transcripts | Notes | Activity
- **Timeline**: chronological feed of all touchpoints with icons (call, SMS, email, page visit, form fill, booking)
- **Transcripts**: voice agent call recordings (just show transcript text, no audio needed)
- **Notes**: editable notes area with timestamps
- **Activity**: all ad clicks, page views, form fills

### Inbox Page
- **Split pane layout** — left: conversation list, right: conversation thread
- **Left pane**: list of conversations with avatar, name, last message preview, timestamp, channel icon (SMS/Email/Call), unread badge. Filter tabs: All | SMS | Email | Calls | Unread
- **Right pane**: full conversation thread (messages rendered as chat bubbles — left for lead, right for business). At bottom: AI-drafted reply in an editable textarea + [Send] button. Sidebar: mini contact card with quick actions ([Book Call] [Add Note] [Change Stage])

### Calendar Page
- Tab nav: Calendar View | Upcoming Calls | Booking Settings
- **Calendar View**: week view grid with booked calls as colored blocks. Click a booking → slide-out panel showing Pre-Call Briefing (lead summary, interaction history, AI assessment, suggested opener)
- **Upcoming Calls**: list of today's and this week's calls with briefing links + no-show flags
- **Booking Settings**: form — availability windows, buffer time, meeting duration, reminder sequence config

### Landing Pages Page
- Card grid: page thumbnail/preview, name, campaign, conversion rate, traffic count, status badge (Live/Draft/Testing/Archived)
- [+ New Page] button
- Click → `/landing-pages/:id`

### Page Editor Page
- Top bar: page name, desktop/mobile toggle, [Save Draft] [Publish] [Create Variant]
- Main area: visual preview of landing page (rendered HTML mock — hero, social proof, benefits, CTA sections)
- Click-to-edit on text sections (inline editing feel)
- Sidebar: section blocks list that can be reordered

### Activity Log Page
- Full chronological feed (newest first)
- Each entry: timestamp, agent icon/name, action description, parameters/context, outcome badge
- Filters: By Agent | By Type | By Date | Approved vs Auto-executed
- Search bar at top

### Settings Page
Tab nav across the top:
- **Business Profile**: editable fields — business name, website, offer description, ideal client, brand voice/tone, [Re-scan Website] button
- **Agent Controls**: per-agent card (Ads, Voice, SMS, Email) each with mode toggle (Review/Supervised) + parameter sliders/inputs (spend ceiling, call limits, etc.)
- **Integrations**: connection cards for Meta, Google Ads, Google Calendar, Twilio, Voice Provider, Zapier — each showing connected/disconnected status with [Connect]/[Disconnect] buttons
- **Pipeline Stages**: draggable stage list + add/edit/delete
- **Notifications**: toggle grid — event types × channels (push/email/in-app), daily digest time picker
- **Compliance**: suppression list upload, consent viewer, TCPA settings, industry guardrails checkboxes
- **Account**: user profile fields, billing info (mock), team members list

## Mock Data Guidelines

All mock data should be for a **fictional home renovation company** called **"Prestige Kitchen & Bath"** based in Austin, TX. Average project: $35,000. This gives realistic numbers.

- **Contacts**: 15-20 leads with names, phone numbers, emails, lead scores (1-100), various pipeline stages, source campaigns. Include a mix of hot leads, nurture leads, and closed deals.
- **Campaigns**: 4-5 campaigns — "Kitchen Remodel Facebook" (active), "Bath Renovation Instagram" (active), "Google Search — Remodel" (active), "Spring Promo" (paused), "Holiday Campaign" (completed)
- **Dashboard numbers**: Cost per booked call ~$185, Show rate ~72%, Close rate ~28%, Monthly revenue ~$245,000, Pipeline value ~$1.2M
- **Approval queue items**: A new ad creative set, a landing page draft, a revised call script, an email sequence, a budget increase recommendation, an audience expansion suggestion
- **Call transcripts**: 2-3 realistic transcript snippets showing the voice agent qualifying a lead and booking a call
- **SMS threads**: brief, natural-sounding text exchanges
- **Activity log**: Mix of "Ad variation paused (CTR below threshold)", "New lead contacted via voice agent", "Budget shifted to top-performing ad set", etc.

## Claude API Integration (Optional)

If an API key is available, use it in these specific spots:
1. **New Campaign Wizard Step 3**: Generate ad copy variations from the business profile
2. **Voice Agent > Scripts > Create New Script**: Generate a call script
3. **Landing Pages > + New Page**: Generate landing page copy
4. **Approval Queue items**: Generate AI reasoning text for queued items

### API Call Pattern
```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: "You are the AI engine inside a growth co-pilot for a home renovation business called Prestige Kitchen & Bath in Austin, TX. Average project value: $35,000. Target audience: homeowners in Austin considering kitchen or bathroom remodels. Brand voice: professional, warm, trustworthy. Respond ONLY with the requested content, no preamble.",
    messages: [{ role: "user", content: promptHere }]
  })
});
```

If API call fails or no key, fall back to hardcoded mock responses. The app must work fully without an API key.

## Design Direction

- **Color palette**: Dark sidebar (slate-900), white content area, blue-600 as primary action color, green-500 for approve/success, red-500 for reject/alert, amber-500 for warnings/pending
- **Feel**: Clean, professional, dense-but-not-cluttered. Think Linear or Notion — not Salesforce. Information-rich without visual noise.
- **Typography**: System font stack. text-sm for most body content, text-xs for metadata/timestamps. Bold sparingly.
- **Spacing**: Compact. This is a power-user tool, not a marketing site. Cards and rows should be tight. Sidebar items close together.
- **Animations**: Minimal. Subtle transitions on tab switches and panel opens. No gratuitous motion.
- **Mobile**: Not required for demo. Desktop-first. 1200px+ viewport is fine.

## Build Order (Recommended Phases)

### Phase 1 — Shell & Navigation
1. Set up Vite + React + Tailwind + React Router
2. Build `MainLayout` with `Sidebar` and `TopBar`
3. Create all page route files with placeholder content
4. Implement navigation — clicking sidebar items routes correctly
5. Build `LoginPage` with fake auth redirect

### Phase 2 — Core Screens (Mock Data)
6. Build mock data files in `data/`
7. `ApprovalQueuePage` — the home screen, most important, build this first
8. `DashboardPage` with KPI cards and charts
9. `CrmPage` with pipeline kanban and list toggle
10. `ContactDetailPage` with tabs and timeline
11. `InboxPage` with split pane

### Phase 3 — Campaign Flow
12. `CampaignsPage` (list)
13. `CampaignDetailPage` with tabs
14. `NewCampaignWizardPage` — multi-step wizard (integrate Claude API here if available)

### Phase 4 — Remaining Screens
15. `VoiceAgentPage` with call log and transcript expansion
16. `SmsEmailPage` + `SequenceDetailPage`
17. `CalendarPage` with booking view
18. `LandingPagesPage` + `PageEditorPage`
19. `ActivityLogPage`
20. `SettingsPage` with all tabs

### Phase 5 — Polish
21. Notification panel slide-out
22. Global search (filter mock data)
23. Badge counts on sidebar (approval queue count, inbox unread)
24. Loading states / empty states where appropriate
25. Onboarding wizard (low priority — build last if time allows)

## Key Principles

1. **Everything is fake and that's fine.** Buttons can log to console. Forms don't submit. Data doesn't persist. The goal is to look and feel like a real app.
2. **The Approval Queue is the hero screen.** Spend the most design effort here. It should feel fast, decisive, and satisfying to move through.
3. **Dense but readable.** Pack information in but keep it scannable. Use badges, icons, and color to create visual hierarchy without clutter.
4. **Consistent component reuse.** MetricCard, StatusBadge, and ApprovalActions should look identical everywhere they appear.
5. **Navigation should feel instant.** Every sidebar click immediately shows the right page. No loading screens (it's all mock data).
6. **Inline interactions over modals.** Expand in place rather than popping modals whenever possible. The approval queue items expand inline. Call log entries expand inline. Transcripts expand inline.
