import React from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'

const InsightsView = ({ meetings }) => {
    const allInsights = meetings.filter(m => m.chat_history?.length > 0);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
            </div>

            {allInsights.length === 0 ? (
                <div className="text-center py-20 bg-surface border border-border rounded-xl opacity-50 italic">
                    No AI insights or chat history found.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {allInsights.map(meeting => (
                        <div key={meeting.id} className="bg-surface border border-border rounded-xl p-8 hover:border-accent/30 transition-all">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">{meeting.title}</h3>
                                <Link to={`/meeting/${meeting.id}`} className="text-accent text-xs font-mono uppercase tracking-widest hover:underline">View History</Link>
                            </div>
                            <div className="space-y-4">
                                {meeting.chat_history.filter(c => c.role === 'assistant').slice(-3).map((chat, index) => (
                                    <div key={index} className="p-4 bg-bg/50 rounded-lg border border-border/50 text-sm italic text-muted leading-relaxed">
                                        "{chat.content ? (chat.content.length > 200 ? chat.content.substring(0, 200) + '...' : chat.content) : 'Insight data is missing'}"
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InsightsView
