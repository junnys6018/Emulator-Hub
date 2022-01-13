import { lockBodyScrolling, unlockBodyScrolling } from '@/src/util';
import classNames from 'classnames';
import React, { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';

type Severity = 'SUCCESS' | 'INFO' | 'WARN' | 'ERROR';
type Action = 'CLOSE' | 'REFRESH' | 'CONFIRM';

interface AlertProps {
    title: string;
    message: string;
    severity: Severity;
    action: Action;
    callback?: (action: 'YES' | 'NO') => void;
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

    const container = useRef<HTMLDivElement>(null);
    const backdrop = useRef<HTMLDivElement>(null);

    const close = () => {
        (container.current as HTMLDivElement).classList.add('hide');
        (backdrop.current as HTMLDivElement).classList.add('opacity-0');
        (backdrop.current as HTMLDivElement).classList.remove('opacity-50');

        (container.current as HTMLDivElement).addEventListener('transitionend', () => alert(), { once: true });
    };

    const refresh = () => {
        location.reload();
    };

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
                <h2
                    className="text-2xl font-bold py-5 md:py-8 truncate"
                    style={{ maxWidth: '500px', overflowX: 'clip', overflowY: 'initial' }}
                >
                    {props.title}
                </h2>
                <p className="mx-3 md:mx-14 text-center">{props.message}</p>
                {props.action === 'CLOSE' && (
                    <button className={classNames('text-xl font-medium py-1.5 px-4 my-8', buttonClass)} onClick={close}>
                        Close
                    </button>
                )}
                {props.action === 'REFRESH' && (
                    <button
                        className={classNames('text-xl font-medium py-1.5 px-4 my-8', buttonClass)}
                        onClick={refresh}
                    >
                        Refresh
                    </button>
                )}
                {props.action === 'CONFIRM' && (
                    <div className="flex justify-center my-8">
                        <button
                            className={classNames('text-xl font-medium py-1.5 w-20 sm:w-32 mr-8', buttonClass)}
                            onClick={() => {
                                if (props.callback) {
                                    props.callback('YES');
                                }
                                close();
                            }}
                        >
                            Yes
                        </button>
                        <button
                            className="text-xl font-medium py-1.5 w-20 sm:w-32 btn-secondary muted"
                            onClick={() => {
                                if (props.callback) {
                                    props.callback('NO');
                                }
                                close();
                            }}
                        >
                            No
                        </button>
                    </div>
                )}
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
    callback?: (action: 'YES' | 'NO') => void;
}

export const AlertContext = React.createContext<((message?: string, options?: Partial<AlertOptions>) => void) | null>(
    null,
);

export function AlertProvider(props: AlertProviderProps) {
    const [currentAlert, setCurrentAlert] = useState<JSX.Element | null>(null);

    // FIXME: if multiple called are made to `alert`, the body lock count will be out of sync causing the page to be unscrollable
    const alert = useCallback((message?: string, options?: Partial<AlertOptions>) => {
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
    }, []);

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
