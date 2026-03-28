import React from 'react'
import { Link } from 'react-router-dom'

const NavLinkItem = ({ to, icon, label }) => {
    return (
        <Link
            to={to}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-all rounded-full hover:text-accent hover:bg-accent/5 text-muted`}
        >
            {icon}
            <span className="text-sm">{label}</span>
        </Link>
    );
};

export default NavLinkItem
