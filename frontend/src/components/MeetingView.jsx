import React from 'react'
import { useParams, Link } from 'react-router-dom'
import MeetingDetail from './MeetingDetail'
import ChatPanel from './ChatPanel'

const MeetingView = ({ meetings }) => {
    const { id } = useParams();
    const meeting = meetings.find(m => m.id === parseInt(id));

    if (!meeting) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h3 className="text-2xl font-bold mb-2 opacity-50">Meeting Not Found</h3>
            <p className="text-muted mb-6">The meeting you are looking for doesn't exist or hasn't been synced yet.</p>
            <Link to="/" className="text-accent font-mono border border-accent/30 px-6 py-2 rounded uppercase tracking-widest text-xs hover:bg-accent/10">Return Home</Link>
        </div>
    );

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
                <MeetingDetail meeting={meeting} />
            </div>
            <div>
                <ChatPanel meetingId={meeting.id} initialHistory={meeting.chat_history || []} />
            </div>
        </div>
    );
};

export default MeetingView
