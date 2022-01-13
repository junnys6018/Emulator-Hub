import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const borderColorMap = {
    SUCCESS: 'border-l-4 border-green-500',
    WARN: 'border-l-4 border-yellow-500',
    ERROR: 'border-l-4 border-red-500',
    INFO: 'border-l-4 border-gray-700',
};

type Severity = 'SUCCESS' | 'INFO' | 'WARN' | 'ERROR';

interface MessageProps {
    title: string;
    message: string;
    severity: Severity;
    close: () => void;
}

export function Message(props: MessageProps) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        (container.current as HTMLDivElement).classList.remove('opacity-0');
        (container.current as HTMLDivElement).classList.add('opacity-100');
    }, []);

    return (
        <div
            className={`opacity-0 transition duration-300 flex mb-4 bg-gray-700 ${borderColorMap[props.severity]}`}
            style={{ minHeight: '64px' }}
            ref={container}
        >
            <div className={`w-80 flex flex-col justify-center`}>
                <h5 className="font-semibold ml-3 pt-3">{props.title}</h5>
                <span className="text-sm ml-3 pb-3">{props.message}</span>
            </div>
            <button className="hover:text-red-500 ml-4 self-start mt-3 mr-3" onClick={props.close}>
                <FaTimes size="1.25rem" />
            </button>
        </div>
    );
}

interface MessageProviderProps {
    children: React.ReactNode;
}

interface MessageOptions {
    title: string;
    severity: Severity;
}

export const MessageContext = React.createContext<
    ((message: string, options?: Partial<MessageOptions>) => void) | null
>(null);

export function MessageProvider(props: MessageProviderProps) {
    const [messages, setMessages] = useState<{ title: string; message: string; severity: Severity; key: number }[]>([]);

    const key = useRef(0);
    const timeouts = useRef<{
        [key: string]: number;
    }>({});

    const close = useCallback((key: number) => {
        setMessages(messages => messages.filter(value => value.key !== key));
    }, []);

    const message = useCallback(
        (message: string, options?: Partial<MessageOptions>) => {
            const defaults: MessageOptions = {
                title: 'Message',
                severity: 'INFO',
            };

            options = { ...defaults, ...options };
            const currentKey = key.current++;
            setMessages(messages => messages.concat({ key: currentKey, message, ...(options as MessageOptions) }));
            const timerId = setTimeout(() => {
                close(currentKey);
                delete timeouts.current[currentKey];

                // We need to do this annoying cast becuse typescript is using the function signature of the nodejs version of setTimeout
                // instead of the browsers version
            }, 5000) as unknown as number;
            timeouts.current[currentKey] = timerId;
        },
        [close],
    );

    return (
        <MessageContext.Provider value={message}>
            {props.children}
            <div className="fixed z-40 bottom-4 right-1/2 transform translate-x-1/2 md:right-4 md:translate-x-0 flex flex-col">
                {messages.map(({ title, message, severity, key }) => (
                    <Message
                        title={title}
                        message={message}
                        severity={severity}
                        key={key}
                        close={() => {
                            close(key);
                            clearTimeout(timeouts.current[key]);
                        }}
                    />
                ))}
            </div>
        </MessageContext.Provider>
    );
}

export function useMessage() {
    const message = useContext(MessageContext);
    if (message === null) {
        throw new Error('useMessage must be used within MessageProvider');
    }
    return message;
}
