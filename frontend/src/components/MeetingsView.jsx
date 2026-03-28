import React from 'react'
import { Activity } from 'lucide-react'
import MeetingList from './MeetingList'

const MeetingsView = ({ meetings, onSelect }) => {
    return (
        <div className="space-y-12">
            <div className="bg-surface border border-border p-8 rounded-lg">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-bold">All Meetings</h3>
                    <div className="bg-surface2 border border-border px-6 py-2 rounded-full flex items-center gap-4 hover:border-accent/30 transition-all group">
                        <Activity size={16} className="text-accent group-hover:scale-110 transition-transform" />
                        <div className="flex items-baseline gap-3">
                            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">Total Sessions</span>
                            <span className="text-xl font-extrabold leading-none">{meetings.length}</span>
                        </div>
                    </div>
                </div>

                <MeetingList
                    meetings={meetings}
                    onSelect={onSelect}
                />
            </div>
        </div>
    );
};

export default MeetingsView
