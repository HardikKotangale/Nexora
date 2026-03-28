import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, List, MessageSquare, Mic, Upload } from 'lucide-react'
import StatCard from './StatCard'
import MeetingList from './MeetingList'

const Dashboard = ({ meetings, onSelect, showUpload, setShowUpload, isUploading, handleFileUpload }) => {
    const navigate = useNavigate();

    // Determine overall sentiment trend
    const sentimentCounts = meetings.reduce((acc, m) => {
        const s = m.summary?.sentiment?.toLowerCase();
        if (s) acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});

    let overallSentiment = "Neutral";
    if (sentimentCounts.positive > (sentimentCounts.negative || 0)) overallSentiment = "Positive";
    if (sentimentCounts.negative > (sentimentCounts.positive || 0)) overallSentiment = "Negative";

    return (
        <>
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatCard
                    label="Total Meetings"
                    value={meetings.length}
                    icon={<Activity size={20} className="text-accent" />}
                    onClick={() => navigate('/meetings')}
                />
                <StatCard
                    label="Action Items"
                    value={meetings.reduce((acc, m) => acc + (m.summary?.action_items?.length || 0), 0)}
                    icon={<List size={20} className="text-accent2" />}
                    onClick={() => navigate('/action-items')}
                />
                <StatCard
                    label="AI Insights"
                    value={meetings.reduce((acc, m) => acc + (m.chat_history?.filter(c => c.role === 'assistant').length || 0), 0)}
                    icon={<MessageSquare size={20} className="text-accent3" />}
                    onClick={() => navigate('/insights')}
                />
                <StatCard
                    label="Sentiment Analysis"
                    value={overallSentiment}
                    icon={<Mic size={20} className={
                        overallSentiment === "Positive" ? "text-green-400" :
                            overallSentiment === "Negative" ? "text-red-400" :
                                "text-yellow-400"
                    } />}
                    onClick={() => navigate('/sentiment')}
                />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-1">
                    <MeetingList
                        meetings={meetings}
                        onSelect={onSelect}
                    />
                </div>
                <div className="md:col-span-2">
                    <div className="bg-surface border border-border p-8 rounded-lg h-full flex flex-col justify-center items-center text-center space-y-6">
                        {!showUpload ? (
                            <>
                                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                                    <Upload size={32} className="text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Ready for Analysis?</h3>
                                    <p className="text-muted text-sm max-w-sm">
                                        Select a meeting from the list to view its transcript, summary, and action items, or upload a new recording to get started.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowUpload(true)}
                                    className="bg-accent/10 text-accent border border-accent/20 px-8 py-3 rounded-md font-bold hover:bg-accent/20 transition-all"
                                >
                                    UPLOAD AUDIO
                                </button>
                            </>
                        ) : (
                            <div className="w-full max-w-md p-8 border-2 border-dashed border-accent/30 rounded-xl bg-accent/5">
                                <h3 className="text-lg font-bold mb-4">Upload New Meeting</h3>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                    className="hidden"
                                    id="audio-upload"
                                />
                                <label
                                    htmlFor="audio-upload"
                                    className="flex flex-col items-center gap-4 cursor-pointer p-10"
                                >
                                    {isUploading ? (
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
                                    ) : (
                                        <Upload size={48} className="text-accent opacity-50" />
                                    )}
                                    <span className="text-sm font-medium">
                                        {isUploading ? "Uploading & Processing..." : "Click to select audio file"}
                                    </span>
                                </label>
                                <button
                                    onClick={() => setShowUpload(false)}
                                    className="mt-4 text-xs text-muted hover:text-accent underline"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard
