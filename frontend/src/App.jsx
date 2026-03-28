import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Link, Navigate } from 'react-router-dom'
import { MessageSquare, List, Activity, Mic, X, Plus, Home as HomeIcon, LayoutDashboard } from 'lucide-react'
import { getMeetings, uploadAudio } from './utils/api'
import ActionItemsView from './components/ActionItemsView'
import InsightsView from './components/InsightsView'
import SentimentAnalysisView from './components/SentimentAnalysisView'
import Dashboard from './components/Dashboard'
import MeetingView from './components/MeetingView'
import MeetingsView from './components/MeetingsView'
import Home from './components/Home'
import NavLinkItem from './components/NavLinkItem'

const App = () => {
    const [meetings, setMeetings] = useState([])
    const [showUpload, setShowUpload] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const navigate = useNavigate();

    const fetchMeetings = async () => {
        try {
            const res = await getMeetings()
            setMeetings(res.data)
        } catch (err) {
            console.error("Failed to fetch meetings:", err)
        }
    }

    useEffect(() => {
        fetchMeetings()
        const interval = setInterval(fetchMeetings, 5000)
        return () => clearInterval(interval)
    }, [])

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('audio_file', file)

        setIsUploading(true)
        try {
            await uploadAudio(formData)
            fetchMeetings()
            setShowUpload(false)
        } catch (err) {
            console.error("Upload failed:", err)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="min-h-screen bg-bg relative overflow-hidden font-sans text-text selection:bg-accent/30">
            <div className="noise-overlay" />

            {/* Top Navigation */}
            <header className="fixed top-0 left-0 right-0 h-20 border-b border-border bg-surface/80 backdrop-blur-xl z-50">
                <div className="max-w-[1600px] mx-auto h-full px-8 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 bg-accent rounded-sm rotate-45 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                            <span className="text-bg font-bold -rotate-45">N</span>
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tighter">NEXORA</h1>
                    </Link>

                    <nav className="flex items-center gap-2">
                        <NavLinkItem
                            to="/"
                            icon={<HomeIcon size={16} />}
                            label="Home"
                        />
                        <NavLinkItem
                            to="/dashboard"
                            icon={<LayoutDashboard size={16} />}
                            label="Dashboard"
                        />
                        <NavLinkItem
                            to="/meetings"
                            icon={<List size={16} />}
                            label="Meetings"
                        />
                        <div className="w-px h-4 bg-border mx-2" />
                        <NavLinkItem
                            to="/action-items"
                            icon={<Activity size={16} />}
                            label="Actions"
                        />
                        <NavLinkItem
                            to="/insights"
                            icon={<MessageSquare size={16} />}
                            label="Insights"
                        />
                        <NavLinkItem
                            to="/sentiment"
                            icon={<Mic size={16} />}
                            label="Sentiment"
                        />
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-32 pb-20 px-8 max-w-[1600px] mx-auto min-h-screen">
                <Routes>
                    <Route path="/meeting/:id" element={
                        <header className="flex justify-between items-end mb-12">
                            <div>
                                <span className="font-mono text-[10px] text-accent uppercase tracking-widest mb-2 block">AI Meeting Companion</span>
                                <h2 className="text-5xl font-extrabold tracking-tight">Meeting Analysis</h2>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="text-muted hover:text-text px-4 py-2 flex items-center gap-2 border border-border rounded-md transition-colors"
                            >
                                <X size={18} />
                                CLOSE ANALYSIS
                            </button>
                        </header>
                    } />
                    <Route path="/action-items" element={
                        <header className="flex justify-between items-end mb-12">
                            <div>
                                <span className="font-mono text-[10px] text-accent uppercase tracking-widest mb-2 block">AI Meeting Companion</span>
                                <h2 className="text-5xl font-extrabold tracking-tight"> Actions</h2>
                            </div>
                        </header>
                    } />
                    <Route path="/insights" element={
                        <header className="flex justify-between items-end mb-12">
                            <div>
                                <span className="font-mono text-[10px] text-accent uppercase tracking-widest mb-2 block">AI Meeting Companion</span>
                                <h2 className="text-5xl font-extrabold tracking-tight">AI Insights</h2>
                            </div>
                        </header>
                    } />
                    <Route path="/sentiment" element={
                        <header className="flex justify-between items-end mb-12">
                            <div>
                                <span className="font-mono text-[10px] text-accent uppercase tracking-widest mb-2 block">AI Meeting Companion</span>
                                <h2 className="text-5xl font-extrabold tracking-tight">Sentiment Analysis</h2>
                            </div>
                        </header>
                    } />
                    <Route path="/meetings" element={
                        <header className="flex justify-between items-end mb-12">
                            <div>
                                <span className="font-mono text-[10px] text-accent uppercase tracking-widest mb-2 block">AI Meeting Companion</span>
                                <h2 className="text-5xl font-extrabold tracking-tight">Meeting History</h2>
                            </div>
                        </header>
                    } />
                    <Route path="/dashboard" element={
                        <header className="flex justify-between items-end mb-12">
                            <div>
                                <span className="font-mono text-[10px] text-accent uppercase tracking-widest mb-2 block">AI Meeting Companion</span>
                                <h1 className="text-5xl font-extrabold tracking-tight">The Dashboard</h1>
                            </div>
                            <button
                                onClick={() => setShowUpload(true)}
                                className="bg-accent text-black px-6 py-2 rounded font-bold text-xs hover:bg-white transition-all flex items-center gap-2"
                            >
                                <Plus size={16} /> NEW MEETING
                            </button>
                        </header>
                    } />
                </Routes>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={
                        <Dashboard
                            meetings={meetings}
                            onSelect={(m) => navigate(`/meeting/${m.id}`)}
                            showUpload={showUpload}
                            setShowUpload={setShowUpload}
                            isUploading={isUploading}
                            handleFileUpload={handleFileUpload}
                        />
                    } />
                    <Route path="/meetings" element={
                        <MeetingsView
                            meetings={meetings}
                            onSelect={(m) => navigate(`/meeting/${m.id}`)}
                        />
                    } />
                    <Route path="/meeting/:id" element={<MeetingView meetings={meetings} />} />
                    <Route path="/action-items" element={<ActionItemsView meetings={meetings} />} />
                    <Route path="/insights" element={<InsightsView meetings={meetings} />} />
                    <Route path="/sentiment" element={<SentimentAnalysisView meetings={meetings} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    )
}

export default App
