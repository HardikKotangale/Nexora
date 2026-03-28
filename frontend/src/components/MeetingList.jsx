import React from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

const MeetingList = ({ meetings, onSelect, selectedId }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-mono text-muted uppercase tracking-widest mb-6">Recent Meetings</h3>
            {meetings.length === 0 ? (
                <div className="text-muted text-sm italic p-8 border border-dashed border-border rounded-lg text-center">
                    No meetings found. Start by uploading an audio file.
                </div>
            ) : (
                meetings.map((meeting) => (
                    <button
                        key={meeting.id}
                        onClick={() => onSelect(meeting)}
                        className={`w-full text-left p-5 border rounded-lg transition-all group relative overflow-hidden ${selectedId === meeting.id
                                ? 'bg-accent/5 border-accent/30 ring-1 ring-accent/20'
                                : 'bg-surface border-border hover:border-accent/20 hover:bg-surface2'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-lg truncate pr-8">{meeting.title}</h4>
                            <div className={`text-[10px] font-mono px-2 py-0.5 rounded-sm uppercase tracking-tighter ${meeting.status === 'ready' ? 'bg-accent/10 text-accent' :
                                    meeting.status === 'error' ? 'bg-accent3/10 text-accent3' :
                                        'bg-accent4/10 text-accent4 animate-pulse'
                                }`}>
                                {meeting.status}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted">
                            <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                {new Date(meeting.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={12} />
                                {new Date(meeting.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>

                        <ChevronRight
                            size={18}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform ${selectedId === meeting.id ? 'text-accent translate-x-1' : 'text-border group-hover:text-muted translate-x-0'
                                }`}
                        />
                    </button>
                ))
            )}
        </div>
    );
};

export default MeetingList;
