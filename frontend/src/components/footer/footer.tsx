import React from 'react';
import Brick from '@/public/assets/brick.png';

export default function Footer() {
    const footerImage: React.CSSProperties = {
        backgroundImage: `url(${Brick})`,
        imageRendering: 'pixelated',
        backgroundSize: '64px',
    };
    return (
        <div className="h-32 flex-shrink-0" style={footerImage}>
            <div className="container h-full flex items-center">
                <span className="font-bold text-xl mr-20">Emulator Hub</span>
                <a className="text-sm mr-12">Source Code</a>
                <a className="text-sm mr-auto">Contact</a>
                <span className="text-sm">Designed &amp; Built by Jun Lim</span>
            </div>
        </div>
    );
}
