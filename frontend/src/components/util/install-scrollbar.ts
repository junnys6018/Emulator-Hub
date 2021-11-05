import { isMobile } from '@/src/util';

const css = `::-webkit-scrollbar {
    width: 20px;
    height: 20px;
}

::-webkit-scrollbar-track {
    background-color: transparent;
}

::-webkit-scrollbar-thumb {
    background-color: white;
    border-radius: 20px;
    border: 6px solid transparent;
    background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
    background-color: white;
}

::-webkit-scrollbar-corner {
    display: none;
}`;

// Install a custom scrollbar on desktop
export default function installScrollbar() {
    if (!isMobile()) {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.getElementsByTagName('head')[0].appendChild(style);
    }
}
