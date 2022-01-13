import { isMobile } from '@/src/util';
import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { FaExpand } from 'react-icons/fa';

export interface CanvasProps {
    className: string;
    style: React.CSSProperties;
    width: number;
    height: number;
    jsxRef: React.RefObject<HTMLCanvasElement>;
}

export default function Canvas(props: CanvasProps) {
    const [showBar, setShowBar] = useState(false);

    const mobile = isMobile();
    const mobileToggleBar = useCallback(() => {
        if (mobile) {
            setShowBar(show => !show);
        }
    }, [mobile]);

    return (
        <div
            className={classNames('relative bg-black', props.className)}
            style={props.style}
            onMouseEnter={() => setShowBar(true)}
            onMouseLeave={() => setShowBar(false)}
            onTouchStart={mobileToggleBar}
        >
            <canvas
                ref={props.jsxRef}
                width={props.width}
                height={props.height}
                style={{ imageRendering: 'pixelated' }}
                className="w-full h-full"
            ></canvas>
            <div
                className={`flex items-center absolute bottom-0 left-0 right-0 h-10 bg-black transition-opacity ${
                    showBar ? 'opacity-90' : 'opacity-0'
                }`}
            >
                <button
                    className="ml-auto mr-4 md:hover:text-green-400 active:text-green-400"
                    onClick={() => props.jsxRef.current?.requestFullscreen()}
                >
                    <FaExpand size="1.5rem" />
                </button>
            </div>
        </div>
    );
}
