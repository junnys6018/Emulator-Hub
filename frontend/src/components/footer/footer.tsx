import React from 'react';
import Brick from '@/public/assets/brick.png';

export default function Footer() {
    const footerImage: React.CSSProperties = {
        backgroundImage: `url(${Brick})`,
        imageRendering: 'pixelated',
        backgroundSize: '64px',
    };
    return (
        <div className="lg:h-32 flex-shrink-0" style={footerImage}>
            <div className="container h-full flex lg:items-center flex-col lg:flex-row">
                <span className="font-bold text-xl my-12 mr-20">Emulator Hub</span>
                <a href="https://github.com/junnys6018/Emulator-Hub" className="text-sm mb-7 lg:mb-0 mr-12">
                    Source Code
                </a>
                <a className="text-sm mb-7 lg:mb-0 mr-auto">Contact</a>
                <span className="text-sm mb-12 lg:mb-0">Designed &amp; Built by Jun Lim</span>
            </div>
        </div>
    );
}
