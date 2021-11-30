import { lockBodyScrolling, unlockBodyScrolling } from '@/src/util';
import classNames from 'classnames';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';

type Severity = 'SUCCESS' | 'INFO' | 'WARN' | 'ERROR';
type Action = 'CLOSE' | 'REFRESH';

interface AlertProps {
    title: string;
    message: string;
    severity: Severity;
    action: Action;
}

const colorMap = {
    SUCCESS: 'bg-green-500 md:hover:bg-green-400 active:bg-green-400',
    WARN: 'bg-yellow-500 md:hover:bg-yellow-400 active:bg-yellow-400',
    ERROR: 'bg-red-500 md:hover:bg-red-400 active:bg-red-400',
    INFO: '',
};

const borderColorMap = {
    SUCCESS: 'border-green-500',
    WARN: 'border-yellow-500',
    ERROR: 'border-red-500',
    INFO: '',
};

export function Alert(props: AlertProps) {
    const alert = useAlert();

    const color = colorMap[props.severity];
    const buttonType = props.severity === 'INFO' ? 'btn-secondary' : 'btn-primary';
    const buttonClass = classNames(buttonType, color);

    const close = () => {
        const div = container.current as HTMLDivElement;
        div.classList.add('hide');
        (backdrop.current as HTMLDivElement).classList.add('opacity-0');
        (backdrop.current as HTMLDivElement).classList.remove('opacity-50');

        div.addEventListener('transitionend', () => {
            alert();
        });
    };

    const refresh = () => {
        location.reload();
    };

    const container = useRef<HTMLDivElement>(null);
    const backdrop = useRef<HTMLDivElement>(null);

    useEffect(() => {
        (container.current as HTMLDivElement).classList.remove('hide');
        (backdrop.current as HTMLDivElement).classList.remove('opacity-0');
        (backdrop.current as HTMLDivElement).classList.add('opacity-50');
    }, []);

    return (
        <Fragment>
            <div
                className={`alert hide ${
                    props.severity !== 'INFO' ? `border-t-4 ${borderColorMap[props.severity]}` : ''
                }`}
                ref={container}
            >
                <h1
                    className="text-2xl font-bold py-8 truncate"
                    style={{ maxWidth: '500px', overflowX: 'clip', overflowY: 'initial' }}
                >
                    {props.title}
                </h1>
                <p className="mx-14 text-center pb-8 flex-grow">{props.message}</p>
                <button
                    className={classNames('text-xl font-medium py-1.5 px-4 mb-8', buttonClass)}
                    onClick={props.action === 'CLOSE' ? close : refresh}
                >
                    {props.action === 'CLOSE' ? 'Close' : 'Refresh'}
                </button>
            </div>
            <div
                className="fixed z-40 top-0 left-0 w-screen h-screen bg-black transition-opacity ease-linear opacity-0 select-none"
                ref={backdrop}
            ></div>
        </Fragment>
    );
}

interface AlertProviderProps {
    children: React.ReactNode;
}

interface AlertOptions {
    title: string;
    severity: Severity;
    action: Action;
}

export const AlertContext = React.createContext<((message?: string, options?: Partial<AlertOptions>) => void) | null>(
    null,
);

export function AlertProvider(props: AlertProviderProps) {
    const [currentAlert, setCurrentAlert] = useState<JSX.Element | null>(null);

    const alert = (message?: string, options?: Partial<AlertOptions>) => {
        if (message !== undefined) {
            const defaults: AlertOptions = {
                title: 'Alert',
                severity: 'INFO',
                action: 'CLOSE',
            };

            options = { ...defaults, ...options };
            lockBodyScrolling();
            setCurrentAlert(<Alert message={message} {...(options as AlertOptions)} />);
        } else {
            unlockBodyScrolling();
            setCurrentAlert(null);
        }
    };

    return (
        <AlertContext.Provider value={alert}>
            {props.children}
            {currentAlert !== null && currentAlert}
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const alert = useContext(AlertContext);
    if (alert === null) {
        throw new Error('useAlert must be used within AlertProvider');
    }
    return alert;
}
