import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Phone, ChevronRight, X, Sparkles, MapPin, Mail, AlertTriangle, Check, Plus } from 'lucide-react';
import { mockCalendarEvents } from '../data/mockCalendarEvents';
import StatusBadge from '../components/shared/StatusBadge';
import { formatTime, formatDate } from '../utils/formatters';

const tabs = ['Calendar View', 'Upcoming Calls', 'Booking Settings'];

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8AM to 6PM

function getWeekDates() {
  // Generate Mon-Fri for the current week of 2026-03-02
  return [
    { day: 'Monday', date: '2026-03-02' },
    { day: 'Tuesday', date: '2026-03-03' },
    { day: 'Wednesday', date: '2026-03-04' },
    { day: 'Thursday', date: '2026-03-05' },
    { day: 'Friday', date: '2026-03-06' },
  ];
}

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState('Calendar View');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingSettings, setBookingSettings] = useState({
    availability: [
      { day: 'Monday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'Tuesday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'Wednesday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'Thursday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'Friday', enabled: true, start: '09:00', end: '16:00' },
      { day: 'Saturday', enabled: false, start: '10:00', end: '14:00' },
      { day: 'Sunday', enabled: false, start: '', end: '' },
    ],
    bufferTime: 15,
    meetingDuration: 60,
    reminder1: 24,
    reminder2: 1,
    remindersEnabled: true,
  });
  const navigate = useNavigate();

  const weekDates = getWeekDates();
  const confirmedCount = mockCalendarEvents.filter(e => e.status === 'confirmed').length;
  const noShowCount = mockCalendarEvents.filter(e => e.status === 'no_show').length;
  const showRate = Math.round((confirmedCount / (confirmedCount + noShowCount)) * 100);

  const todayEvents = mockCalendarEvents.filter(e => {
    const d = new Date(e.dateTime);
    return d.toDateString() === new Date('2026-02-28').toDateString();
  });

  const thisWeekEvents = mockCalendarEvents.filter(e => {
    const d = new Date(e.dateTime);
    return d >= new Date('2026-03-02') && d <= new Date('2026-03-06T23:59:59');
  });

  const noShowEvents = mockCalendarEvents.filter(e => e.status === 'no_show');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Calendar</h1>
        <span className="text-sm text-slate-500">This Week's Show Rate: <span className="font-semibold text-slate-900">{showRate}%</span></span>
      </div>

      <div className="flex gap-1 mb-6 border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Calendar View */}
      {activeTab === 'Calendar View' && (
        <div className="flex gap-6">
          <div className="flex-1 bg-white rounded-lg border border-slate-200 overflow-hidden">
            {/* Week header */}
            <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-slate-200">
              <div className="p-2" />
              {weekDates.map(wd => (
                <div key={wd.day} className="p-3 text-center border-l border-slate-200">
                  <div className="text-xs text-slate-500 uppercase">{wd.day.slice(0, 3)}</div>
                  <div className="text-sm font-semibold text-slate-900">{new Date(wd.date).getDate()}</div>
                </div>
              ))}
            </div>

            {/* Time grid */}
            <div className="grid grid-cols-[60px_repeat(5,1fr)]">
              {hours.map(hour => (
                <div key={hour} className="contents">
                  <div className="p-2 text-xs text-slate-400 text-right pr-3 border-b border-slate-100 h-16 flex items-start justify-end">
                    {hour > 12 ? `${hour - 12}PM` : hour === 12 ? '12PM' : `${hour}AM`}
                  </div>
                  {weekDates.map(wd => {
                    const event = mockCalendarEvents.find(e => {
                      const d = new Date(e.dateTime);
                      return d.toISOString().slice(0, 10) === wd.date && d.getHours() === hour;
                    });
                    return (
                      <div key={wd.date + hour} className="border-l border-b border-slate-100 h-16 p-0.5 relative">
                        {event && (
                          <button
                            onClick={() => setSelectedEvent(event)}
                            className={`absolute inset-x-0.5 top-0.5 rounded px-1.5 py-1 text-xs text-left transition-colors ${
                              event.status === 'confirmed' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                              event.status === 'pending' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' :
                              'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                            style={{ height: `${(event.duration / 60) * 64 - 4}px` }}
                          >
                            <div className="font-medium truncate">{event.contactName}</div>
                            <div className="opacity-75">{formatTime(event.dateTime)}</div>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Briefing slide-out panel */}
          {selectedEvent && (
            <div className="w-80 bg-white rounded-lg border border-slate-200 p-5 space-y-4 shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Pre-Call Briefing</h3>
                <button onClick={() => setSelectedEvent(null)} className="p-1 rounded hover:bg-slate-100"><X size={14} className="text-slate-400" /></button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-900">{selectedEvent.contactName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar size={12} /> {formatDate(selectedEvent.dateTime)} at {formatTime(selectedEvent.dateTime)}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock size={12} /> {selectedEvent.duration} min · {selectedEvent.type}
                </div>
                <StatusBadge status={selectedEvent.status} />
              </div>

              {selectedEvent.preBriefing && (
                <>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">About This Lead</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">{selectedEvent.preBriefing.summary}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Interaction History</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedEvent.preBriefing.interactionHistory}</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sparkles size={12} className="text-blue-600" />
                      <span className="text-xs font-semibold text-blue-600">AI Assessment</span>
                    </div>
                    <p className="text-xs text-blue-800 leading-relaxed">{selectedEvent.preBriefing.aiAssessment}</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-green-700 mb-1">Suggested Opener</h4>
                    <p className="text-xs text-green-800 leading-relaxed italic">{selectedEvent.preBriefing.suggestedOpener}</p>
                  </div>

                  {selectedEvent.contactId && (
                    <button
                      onClick={() => navigate(`/crm/${selectedEvent.contactId}`)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      View Full Profile <ChevronRight size={12} />
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Upcoming Calls Tab */}
      {activeTab === 'Upcoming Calls' && (
        <div className="space-y-6 max-w-3xl">
          {todayEvents.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-3">Today</h2>
              <div className="space-y-2">
                {todayEvents.map(ev => (
                  <EventRow key={ev.id} event={ev} onBriefing={() => { setActiveTab('Calendar View'); setSelectedEvent(ev); }} navigate={navigate} />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-3">This Week</h2>
            <div className="space-y-2">
              {thisWeekEvents.map(ev => (
                <EventRow key={ev.id} event={ev} onBriefing={() => { setActiveTab('Calendar View'); setSelectedEvent(ev); }} navigate={navigate} />
              ))}
            </div>
          </div>

          {noShowEvents.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-1.5">
                <AlertTriangle size={14} />
                No-Shows Requiring Re-booking
              </h2>
              <div className="space-y-2">
                {noShowEvents.map(ev => (
                  <div key={ev.id} className="bg-white rounded-lg border border-red-200 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle size={14} className="text-red-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{ev.contactName}</div>
                        <div className="text-xs text-slate-500">{formatDate(ev.dateTime)} at {formatTime(ev.dateTime)}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Rebook</button>
                      <button className="px-3 py-1.5 text-xs font-medium border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 transition-colors">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Booking Settings Tab */}
      {activeTab === 'Booking Settings' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Availability Windows</h3>
            <div className="space-y-2">
              {bookingSettings.availability.map((slot, i) => (
                <div key={slot.day} className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      const updated = [...bookingSettings.availability];
                      updated[i] = { ...updated[i], enabled: !updated[i].enabled };
                      setBookingSettings({ ...bookingSettings, availability: updated });
                    }}
                    className={`w-5 h-5 rounded flex items-center justify-center border ${slot.enabled ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}
                  >
                    {slot.enabled && <Check size={12} className="text-white" />}
                  </button>
                  <span className="text-sm text-slate-700 w-24">{slot.day}</span>
                  {slot.enabled ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={slot.start}
                        onChange={e => {
                          const updated = [...bookingSettings.availability];
                          updated[i] = { ...updated[i], start: e.target.value };
                          setBookingSettings({ ...bookingSettings, availability: updated });
                        }}
                        className="px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-slate-400 text-sm">to</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={e => {
                          const updated = [...bookingSettings.availability];
                          updated[i] = { ...updated[i], end: e.target.value };
                          setBookingSettings({ ...bookingSettings, availability: updated });
                        }}
                        className="px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Unavailable</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Buffer Time Between Calls</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={60}
                value={bookingSettings.bufferTime}
                onChange={e => setBookingSettings({ ...bookingSettings, bufferTime: Number(e.target.value) })}
                className="w-20 px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-500">minutes</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Meeting Duration</h3>
            <select
              value={bookingSettings.meetingDuration}
              onChange={e => setBookingSettings({ ...bookingSettings, meetingDuration: Number(e.target.value) })}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Reminder Sequence</h3>
              <button
                onClick={() => setBookingSettings({ ...bookingSettings, remindersEnabled: !bookingSettings.remindersEnabled })}
                className={`relative w-11 h-6 rounded-full transition-colors ${bookingSettings.remindersEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow ${bookingSettings.remindersEnabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>
            {bookingSettings.remindersEnabled && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 w-28">Reminder 1:</span>
                  <input type="number" value={bookingSettings.reminder1} onChange={e => setBookingSettings({ ...bookingSettings, reminder1: Number(e.target.value) })} className="w-20 px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <span className="text-sm text-slate-500">hours before</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 w-28">Reminder 2:</span>
                  <input type="number" value={bookingSettings.reminder2} onChange={e => setBookingSettings({ ...bookingSettings, reminder2: Number(e.target.value) })} className="w-20 px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <span className="text-sm text-slate-500">hour(s) before</span>
                </div>
              </div>
            )}
          </div>

          <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Save Settings</button>
        </div>
      )}
    </div>
  );
}

function EventRow({ event, onBriefing, navigate }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          event.status === 'confirmed' ? 'bg-blue-100' : 'bg-amber-100'
        }`}>
          <Phone size={14} className={event.status === 'confirmed' ? 'text-blue-600' : 'text-amber-600'} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-900">{event.contactName}</span>
            <StatusBadge status={event.status} />
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
            <span>{formatDate(event.dateTime)} at {formatTime(event.dateTime)}</span>
            <span>{event.duration} min</span>
            <span className="capitalize">{event.type}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onBriefing} className="px-3 py-1.5 text-xs font-medium border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50 transition-colors">
          Briefing
        </button>
        <button className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Join Call
        </button>
      </div>
    </div>
  );
}
