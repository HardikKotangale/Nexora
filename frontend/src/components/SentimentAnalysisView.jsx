import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Activity } from 'lucide-react'

const SentimentAnalysisView = ({ meetings }) => {
    const [filter, setFilter] = useState('all');

    const sentimentCounts = meetings.reduce((acc, m) => {
        const s = m.summary?.sentiment?.toLowerCase() || 'unknown';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});

    const filteredMeetings = filter === 'all'
        ? meetings
        : meetings.filter(m => m.summary?.sentiment?.toLowerCase() === filter);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <button
                    onClick={() => setFilter(filter === 'positive' ? 'all' : 'positive')}
                    className={`bg-surface border p-8 rounded-xl text-center transition-all ${filter === 'positive' ? 'border-green-400 ring-1 ring-green-400' : 'border-border hover:border-green-400/50'}`}
                >
                    <span className="text-sm font-mono text-muted uppercase tracking-widest block mb-2">Positive</span>
                    <div className="text-5xl font-black text-green-400">{sentimentCounts.positive || 0}</div>
                    <div className="text-[10px] text-muted mt-2">MEETINGS</div>
                </button>
                <button
                    onClick={() => setFilter(filter === 'neutral' ? 'all' : 'neutral')}
                    className={`bg-surface border p-8 rounded-xl text-center transition-all ${filter === 'neutral' ? 'border-yellow-400 ring-1 ring-yellow-400' : 'border-border hover:border-yellow-400/50'}`}
                >
                    <span className="text-sm font-mono text-muted uppercase tracking-widest block mb-2">Neutral</span>
                    <div className="text-5xl font-black text-yellow-400">{sentimentCounts.neutral || 0}</div>
                    <div className="text-[10px] text-muted mt-2">MEETINGS</div>
                </button>
                <button
                    onClick={() => setFilter(filter === 'negative' ? 'all' : 'negative')}
                    className={`bg-surface border p-8 rounded-xl text-center transition-all ${filter === 'negative' ? 'border-red-400 ring-1 ring-red-400' : 'border-border hover:border-red-400/50'}`}
                >
                    <span className="text-sm font-mono text-muted uppercase tracking-widest block mb-2">Negative</span>
                    <div className="text-5xl font-black text-red-400">{sentimentCounts.negative || 0}</div>
                    <div className="text-[10px] text-muted mt-2">MEETINGS</div>
                </button>
            </div>

            <div className="bg-surface border border-border rounded-xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">
                        {filter === 'all' ? 'All Meetings' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Meetings`}
                    </h3>
                    {filter !== 'all' && (
                        <button onClick={() => setFilter('all')} className="text-xs text-accent hover:underline">Clear Filter</button>
                    )}
                </div>
                <div className="space-y-4">
                    {filteredMeetings.length === 0 ? (
                        <div className="text-center py-10 text-muted italic border-2 border-dashed border-border rounded-lg">
                            No {filter} meetings found.
                        </div>
                    ) : (
                        filteredMeetings.slice().reverse().map(meeting => (
                            <div key={meeting.id} className="p-4 bg-bg/50 rounded-lg border border-border/50">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="font-bold text-sm">{meeting.title}</h4>
                                        <span className="text-[10px] text-muted">{new Date(meeting.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${meeting.summary?.sentiment?.toLowerCase() === 'positive' ? 'bg-green-400/10 text-green-400' :
                                            meeting.summary?.sentiment?.toLowerCase() === 'negative' ? 'bg-red-400/10 text-red-400' :
                                                'bg-yellow-400/10 text-yellow-400'
                                            }`}>
                                            {meeting.summary?.sentiment || 'Ready'}
                                        </div>
                                        <Link to={`/meeting/${meeting.id}`} className="p-1 hover:bg-surface2 rounded transition-colors text-muted hover:text-accent">
                                            <Activity size={16} />
                                        </Link>
                                    </div>
                                </div>
                                {meeting.summary?.sentiment_details?.conclusion && (
                                    <div className="text-sm italic text-muted border-l-2 border-border pl-4 py-1 leading-relaxed">
                                        "{meeting.summary.sentiment_details.conclusion}"
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SentimentAnalysisView
