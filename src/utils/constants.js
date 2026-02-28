// Pipeline stages (ordered)
export const PIPELINE_STAGES = [
  'New Lead',
  'Contacted',
  'Call Booked',
  'Call Completed',
  'Proposal',
  'Closed Won',
  'Closed Lost',
  'Nurture',
];

// Agent types
export const AGENT_TYPES = ['ads', 'voice', 'sms', 'email'];

// Agent modes
export const AGENT_MODES = ['review', 'supervised'];

// Channel types
export const CHANNEL_TYPES = ['facebook', 'instagram', 'google', 'sms', 'email', 'voice'];

// Campaign statuses
export const CAMPAIGN_STATUSES = ['active', 'paused', 'draft', 'completed'];

// Approval item types
export const APPROVAL_TYPES = [
  'ad_creative',
  'landing_page',
  'call_script',
  'email_sequence',
  'budget_change',
  'audience_expansion',
];

// Call outcomes
export const CALL_OUTCOMES = ['booked', 'interested', 'no_answer', 'not_interested'];

// Urgency levels
export const URGENCY_LEVELS = ['high', 'medium', 'low'];

// Sequence types
export const SEQUENCE_TYPES = ['sms', 'email', 'both'];

// Activity outcome types
export const ACTIVITY_OUTCOMES = ['success', 'warning', 'info'];
