import { lockBodyScrolling, unlockBodyScrolling } from '@/src/util';
import classNames from 'classnames';
import React, { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';

type Severity = 'SUCCESS' | 'INFO' | 'WARN' | 'ERROR';
type Action = 'CLOSE' | 'REFRESH' | 'CONFIRM';

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

interface AlertContentProps {
    title: string;
    message: string;
    severity: Severity;
    children: React.ReactNode;
}

function AlertContent(props: AlertContentProps) {
    return (
        <div
            className={`alert-builtin ${
                props.severity !== 'INFO' ? `border-t-4 ${borderColorMap[props.severity]}` : ''
            }`}
        >
            <h2
                className="text-2xl font-bold py-5 md:py-8 truncate"
                style={{ maxWidth: '500px', overflowX: 'clip', overflowY: 'initial' }}
            >
                {props.title}
            </h2>
            <p className="mx-3 md:mx-14 text-center">{props.message}</p>
            {props.children}
        </div>
    );
}

interface AlertCloseProps {
    title: string;
    message: string;
    severity: Severity;
    close: () => void;
}

function AlertClose(props: AlertCloseProps) {
    const color = colorMap[props.severity];
    const buttonType = props.severity === 'INFO' ? 'btn-secondary' : 'btn-primary';
    const buttonClass = classNames(buttonType, color);

    return (
        <AlertContent title={props.title} severity={props.severity} message={props.message}>
            <button className={classNames('text-xl font-medium py-1.5 px-4 my-8', buttonClass)} onClick={props.close}>
                Close
            </button>
        </AlertContent>
    );
}

interface AlertRefreshProps {
    title: string;
    message: string;
    severity: Severity;
}

function AlertRefresh(props: AlertRefreshProps) {
    const color = colorMap[props.severity];
    const buttonType = props.severity === 'INFO' ? 'btn-secondary' : 'btn-primary';
    const buttonClass = classNames(buttonType, color);

    return (
        <AlertContent title={props.title} severity={props.severity} message={props.message}>
            <button
                className={classNames('text-xl font-medium py-1.5 px-4 my-8', buttonClass)}
                onClick={() => window.location.reload()}
            >
                Refresh
            </button>
        </AlertContent>
    );
}

interface AlertConfirmProps {
    title: string;
    message: string;
    severity: Severity;
    close: () => void;
    callback?: (action: 'YES' | 'NO') => void;
}

function AlertConfirm(props: AlertConfirmProps) {
    const color = colorMap[props.severity];
    const buttonType = props.severity === 'INFO' ? 'btn-secondary' : 'btn-primary';
    const buttonClass = classNames(buttonType, color);

    return (
        <AlertContent title={props.title} severity={props.severity} message={props.message}>
            <div className="flex justify-center my-8">
                <button
                    className={classNames('text-xl font-medium py-1.5 w-20 sm:w-32 mr-8', buttonClass)}
                    onClick={() => {
                        if (props.callback) {
                            props.callback('YES');
                        }
                        props.close();
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
                        props.close();
                    }}
                >
                    No
                </button>
            </div>
        </AlertContent>
    );
}

interface AlertProps {
    children: (close: () => void) => React.ReactNode;
    onClose: () => void;
}

export function Alert(props: AlertProps) {
    const container = useRef<HTMLDivElement>(null);
    const backdrop = useRef<HTMLDivElement>(null);

    useEffect(() => {
        lockBodyScrolling();
        return unlockBodyScrolling;
    }, []);

    const close = useCallback(() => {
        (container.current as HTMLDivElement).classList.add('hide');
        (backdrop.current as HTMLDivElement).classList.add('opacity-0');
        (backdrop.current as HTMLDivElement).classList.remove('opacity-50');
        (container.current as HTMLDivElement).addEventListener('transitionend', props.onClose, { once: true });
    }, [props.onClose]);

    useEffect(() => {
        (container.current as HTMLDivElement).classList.remove('hide');
        (backdrop.current as HTMLDivElement).classList.remove('opacity-0');
        (backdrop.current as HTMLDivElement).classList.add('opacity-50');
    }, []);

    return (
        <Fragment>
            <div className="alert hide" ref={container}>
                {props.children(close)}
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

export const AlertContext = React.createContext<((message: string, options?: Partial<AlertOptions>) => void) | null>(
    null,
);

export function AlertProvider(props: AlertProviderProps) {
    const [currentAlert, setCurrentAlert] = useState<JSX.Element | null>(null);

    const closeAlert = useCallback(() => setCurrentAlert(null), []);

    // FIXME: if multiple calls are made to `alert`, the body lock count will be out of sync causing the page to be unscrollable
    const alert = useCallback(
        (message: string, options?: Partial<AlertOptions>) => {
            const defaults: AlertOptions = {
                title: 'Alert',
                severity: 'INFO',
                action: 'CLOSE',
            };

            const resolvedOptions: AlertOptions = { ...defaults, ...options };

            switch (resolvedOptions.action) {
                case 'CLOSE':
                    setCurrentAlert(
                        <Alert onClose={closeAlert}>
                            {close => (
                                <AlertClose
                                    message={message}
                                    title={resolvedOptions.title}
                                    severity={resolvedOptions.severity}
                                    close={close}
                                />
                            )}
                        </Alert>,
                    );
                    break;
                case 'CONFIRM':
                    setCurrentAlert(
                        <Alert onClose={closeAlert}>
                            {close => (
                                <AlertConfirm
                                    message={message}
                                    title={resolvedOptions.title}
                                    severity={resolvedOptions.severity}
                                    close={close}
                                    callback={resolvedOptions.callback}
                                />
                            )}
                        </Alert>,
                    );
                    break;
                case 'REFRESH':
                    setCurrentAlert(
                        <Alert onClose={closeAlert}>
                            {() => (
                                <AlertRefresh
                                    message={message}
                                    title={resolvedOptions.title}
                                    severity={resolvedOptions.severity}
                                />
                            )}
                        </Alert>,
                    );
                    break;
            }
        },
        [closeAlert],
    );

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
