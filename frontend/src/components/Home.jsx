import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Zap, BarChart3, Mail, Send } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-32 pb-20">
            {/* Section 1: Hero */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-accent/5 blur-[120px] rounded-full -z-10" />
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <span className="font-mono text-xs text-accent uppercase tracking-[0.3em] font-bold">The Future of Collaboration</span>
                    <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-tight bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                        Nexora
                    </h1>
                    <p className="text-xl text-muted max-w-2xl mx-auto font-medium leading-relaxed">
                        An intelligent AI meeting companion designed to transform your conversations into actionable insights, emotional intelligence, and structured knowledge.
                    </p>
                    <div className="pt-8">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-accent text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(0,255,255,0.2)]"
                        >
                            Open Dashboard
                        </button>
                    </div>
                </div>
            </section>

            {/* Section 2: Features */}
            <section className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight">Powerful Features</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Mic className="text-accent" size={32} />}
                        title="AI Transcription"
                        description="Professional grade transcription with speaker identification and noise reduction for crystal clear records."
                    />
                    <FeatureCard
                        icon={<BarChart3 className="text-accent2" size={32} />}
                        title="Sentiment Analysis"
                        description="Understand the emotional pulse of your team with deep linguistic analysis and trend tracking over time."
                    />
                    <FeatureCard
                        icon={<Zap className="text-accent3" size={32} />}
                        title="Automated Insights"
                        description="Let AI extract action items, summaries, and key takeaways so you never miss a critical detail again."
                    />
                </div>
            </section>

            {/* Section 3: Contact Form */}
            <section className="max-w-2xl mx-auto bg-surface border border-border rounded-3xl p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Mail size={120} />
                </div>
                <div className="relative z-10 space-y-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
                        <p className="text-muted">Have questions or feedback? We'd love to hear from you.</p>
                    </div>
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1">Name</label>
                                <input type="text" className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 focus:border-accent outline-none transition-colors" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1">Email</label>
                                <input type="email" className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 focus:border-accent outline-none transition-colors" placeholder="john@example.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1">Message</label>
                            <textarea rows="4" className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 focus:border-accent outline-none transition-colors resize-none" placeholder="How can we help?"></textarea>
                        </div>
                        <button className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-accent transition-all group">
                            <span>Send Message</span>
                            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-surface border border-border p-8 rounded-3xl space-y-6 hover:border-accent/30 transition-all hover:translate-y-[-4px] group">
        <div className="w-16 h-16 bg-surface2 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div className="space-y-3">
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-muted leading-relaxed font-medium">
                {description}
            </p>
        </div>
    </div>
);

export default Home;
