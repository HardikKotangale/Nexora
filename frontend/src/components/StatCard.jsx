import React from 'react'

const StatCard = ({ label, value, icon, onClick }) => (
    <button
        onClick={onClick}
        className="bg-surface border border-border p-6 rounded-lg relative overflow-hidden group text-left w-full hover:border-accent/30 transition-all"
    >
        <div className="flex justify-between items-start mb-4">
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">{label}</span>
            {icon}
        </div>
        <div className="text-4xl font-extrabold">{value}</div>
        <div className="absolute bottom-0 left-0 h-1 bg-accent/20 w-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform" />
    </button>
)

export default StatCard
