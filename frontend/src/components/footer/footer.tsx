import React, { Fragment, useState } from 'react';
import Brick from '@/public/assets/brick.png';
import ContactModal from '../contact/contact';

export default function Footer() {
    const [showContactModal, setShowContactModal] = useState(false);

    const footerImage: React.CSSProperties = {
        backgroundImage: `url(${Brick})`,
        imageRendering: 'pixelated',
        backgroundSize: '64px',
    };

    return (
        <Fragment>
            <footer className="lg:h-32 flex-shrink-0" style={footerImage}>
                <div className="container h-full flex lg:items-center flex-col lg:flex-row">
                    <span className="font-bold text-xl my-12 mr-20">Emulator Hub</span>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/junnys6018/Emulator-Hub"
                        className="text-sm mb-7 lg:mb-0 mr-12 md:hover:text-green-500 active:text-green-500"
                    >
                        Source Code
                    </a>
                    <button
                        onClick={() => setShowContactModal(true)}
                        className="text-sm mb-7 lg:mb-0 mr-auto md:hover:text-green-500 active:text-green-500"
                    >
                        Contact
                    </button>
                    <span className="text-sm mb-12 lg:mb-0">Designed &amp; Built by Jun Lim</span>
                </div>
            </footer>
            {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
        </Fragment>
    );
}
