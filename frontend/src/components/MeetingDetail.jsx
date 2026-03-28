import React, { useState } from 'react';
import { FileText, Zap, CheckCircle, Info, Smile, Meh, Frown, X, ChevronRight } from 'lucide-react';

const MeetingDetail = ({ meeting }) => {
    const [showSentimentDetails, setShowSentimentDetails] = useState(false);

    if (!meeting) return null;

    const sentiment = meeting.summary?.sentiment;
    const details = meeting.summary?.sentiment_details;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end gap-4 border-b border-border pb-6">
                <div className="space-y-1">
                    <h3 className="text-4xl font-black tracking-tighter text-text">{meeting.title}</h3>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted">Nexora Intelligence Engine v1.4</p>
                </div>

                {sentiment && (
                    <button
                        onClick={() => setShowSentimentDetails(true)}
                        className={`group flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${sentiment === 'Positive' ? 'bg-green-500/10 border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' :
                            sentiment === 'Negative' ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' :
                                'bg-yellow-500/10 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                            }`}>
                        {sentiment === 'Positive' ? <Smile size={14} /> :
                            sentiment === 'Negative' ? <Frown size={14} /> :
                                <Meh size={14} />}
                        {sentiment} Sentiment
                        <ChevronRight size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                )}
            </div>

            {/* Sentiment Details Modal */}
            {showSentimentDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto">
                    <div className="bg-surface border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-surface2/50 text-text">
                            <h4 className="flex items-center gap-3 font-bold text-lg">
                                <Smile className={sentiment === 'Positive' ? 'text-green-500' : sentiment === 'Negative' ? 'text-red-500' : 'text-yellow-500'} />
                                Sentiment Analysis Roadmap
                            </h4>
                            <button
                                onClick={() => setShowSentimentDetails(false)}
                                className="p-2 hover:bg-surface2 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar text-text">
                            {/* Conclusion Section */}
                            <div className={`${sentiment === 'Positive' ? 'bg-green-500/5 border-green-500/10' : sentiment === 'Negative' ? 'bg-red-500/5 border-red-500/10' : 'bg-yellow-500/5 border-yellow-500/10'} p-6 rounded-xl space-y-3 border`}>
                                <h5 className={`text-[10px] font-mono uppercase tracking-[0.2em] ${sentiment === 'Positive' ? 'text-green-500' : sentiment === 'Negative' ? 'text-red-500' : 'text-yellow-500'}`}>AI Conclusion</h5>
                                <p className="text-sm leading-relaxed text-text italic">
                                    "{details?.conclusion || "Algorithm determined overall tone through contextual weighting of key meeting segments."}"
                                </p>
                            </div>

                            {/* Sentence Breakdown */}
                            <div className="space-y-4">
                                <h5 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">Segment Breakdown</h5>
                                <div className="space-y-3">
                                    {details?.sentences ? (
                                        details.sentences
                                            .filter(entry => entry.text && entry.text.length > 5)
                                            .map((entry, i) => (
                                                <div key={i} className="group border border-border/50 p-4 rounded-lg bg-surface2/30 hover:border-accent3/30 transition-all">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${entry.sentiment === 'Positive' ? 'bg-green-500/20 text-green-500' :
                                                            entry.sentiment === 'Negative' ? 'bg-red-500/20 text-red-500' :
                                                                'bg-yellow-500/20 text-yellow-500'
                                                            }`}>
                                                            {entry.sentiment}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-12 h-1 bg-border rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full transition-all duration-1000 ${entry.sentiment === 'Positive' ? 'bg-green-500' :
                                                                        entry.sentiment === 'Negative' ? 'bg-red-500' :
                                                                            'bg-yellow-500'
                                                                        }`}
                                                                    style={{ width: `${entry.score * 100}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-[10px] font-mono opacity-50">{(entry.score * 100).toFixed(0)}%</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-text/80 leading-relaxed font-medium">"{entry.text}"</p>
                                                </div>
                                            ))
                                    ) : (
                                        <div className="text-muted text-sm italic py-8 text-center border border-dashed border-border rounded-lg">
                                            Segment details available upon next analysis cycle.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-surface2/50 border-t border-border flex justify-end">
                            <button
                                onClick={() => setShowSentimentDetails(false)}
                                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
                            >
                                <X size={14} strokeWidth={3} />
                                Close Analysis
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Summary Card */}
                <div className="bg-surface border border-border p-8 rounded-lg">
                    <h4 className="flex items-center gap-2 font-bold mb-4 text-accent4">
                        <Zap size={18} />
                        Summary
                    </h4>
                    <p className="text-muted leading-relaxed whitespace-pre-line">
                        {meeting.summary?.short_summary || "Analysis in progress..."}
                    </p>
                </div>

                {/* Action Items */}
                <div className="bg-surface border border-border p-8 rounded-lg">
                    <h4 className="flex items-center gap-2 font-bold mb-4 text-accent2">
                        <CheckCircle size={18} />
                        Action Items
                    </h4>
                    <ul className="space-y-3">
                        {meeting.summary?.action_items?.length > 0 ? (
                            meeting.summary.action_items.map((ai, i) => (
                                <li key={i} className="bg-surface2/50 p-4 rounded border border-border/50 group hover:border-accent2/30 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 bg-accent2 rounded-full mt-2 shrink-0" />
                                        <div className="space-y-1">
                                            <p className="text-sm text-text font-medium leading-relaxed">{ai.item || ai}</p>
                                            {ai.owner && (
                                                <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <Info size={12} className="text-accent2" />
                                                    <span className="text-[10px] font-mono uppercase tracking-wider">Owner: {ai.owner}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <div className="text-muted text-sm italic">No action items identified.</div>
                        )}
                    </ul>
                </div>
            </div>

            {/* Decisions */}
            <div className="bg-surface border border-border p-8 rounded-lg">
                <h4 className="flex items-center gap-2 font-bold mb-6 text-accent3">
                    <CheckCircle size={18} />
                    Key Decisions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {meeting.summary?.decisions?.length > 0 ? (
                        meeting.summary.decisions.map((decision, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 bg-accent3/5 border border-accent3/10 rounded-md">
                                <div className="w-6 h-6 rounded-full bg-accent3/20 flex items-center justify-center shrink-0">
                                    <span className="text-accent3 font-bold text-xs">{i + 1}</span>
                                </div>
                                <p className="text-sm text-muted leading-relaxed italic">"{decision}"</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-muted text-sm italic col-span-2">No key decisions identified.</div>
                    )}
                </div>
            </div>

            {/* Transcript */}
            <div className="bg-surface border border-border p-8 rounded-lg">
                <h4 className="flex items-center gap-2 font-bold mb-6 text-accent">
                    <FileText size={18} />
                    Transcript
                </h4>
                <div className="max-h-[400px] overflow-y-auto pr-4 space-y-4">
                    {meeting.transcript?.timestamped_content?.map((segment, i) => (
                        <div key={i} className="flex gap-4 group">
                            <span className="font-mono text-[10px] text-muted w-12 pt-1 shrink-0 group-hover:text-accent transition-colors">
                                {formatTime(segment.start)}
                            </span>
                            <p className="text-sm text-muted group-hover:text-text transition-colors">
                                {segment.text}
                            </p>
                        </div>
                    )) || <div className="text-muted italic">Transcription in progress...</div>}
                </div>
            </div>
        </div>
    );
};

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default MeetingDetail;
