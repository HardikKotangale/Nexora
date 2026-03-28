import React from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'

const ActionItemsView = ({ meetings }) => {
    const allActionItems = meetings.filter(m => m.summary?.action_items?.length > 0);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
            </div>

            {allActionItems.length === 0 ? (
                <div className="text-center py-20 bg-surface border border-border rounded-xl opacity-50 italic">
                    No action items found across your meetings.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {allActionItems.map(meeting => (
                        <div key={meeting.id} className="bg-surface border border-border rounded-xl p-8 hover:border-accent/30 transition-all">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">{meeting.title}</h3>
                                <Link to={`/meeting/${meeting.id}`} className="text-accent text-xs font-mono uppercase tracking-widest hover:underline">View Meeting</Link>
                            </div>
                            <ul className="space-y-4">
                                {meeting.summary.action_items.map((ai, index) => (
                                    <li key={index} className="flex items-start gap-4 p-4 bg-bg/50 rounded-lg border border-border/50">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                                        <div>
                                            <p className="font-medium text-sm leading-relaxed">{ai.item}</p>
                                            {ai.owner && <span className="text-[10px] font-mono text-accent uppercase tracking-wider block mt-2">Owner: {ai.owner}</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActionItemsView
