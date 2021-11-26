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
    const container: React.MutableRefObject<null | HTMLDivElement> = useRef(null);

    useEffect(() => {
        (container.current as HTMLDivElement).classList.remove('opacity-0');
        (container.current as HTMLDivElement).classList.add('opacity-100');
    }, []);

    return (
        <div
            className={`opacity-0 transition flex mb-4 bg-gray-700 ${borderColorMap[props.severity]}`}
            style={{ minHeight: '64px' }}
            ref={container}
        >
            <div className={`w-80 flex flex-col justify-center`}>
                <h5 className="font-semibold ml-3 pt-3">{props.title}</h5>
                <span className="text-sm ml-3 pb-3">{props.message}</span>
            </div>
            <button className="hover:text-red-500 ml-4 self-start mt-3 mr-3" onClick={props.close}>
                <FaTimes size="20px" />
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

    const [key, setKey] = useState(0);

    const close = useCallback(
        (key: number) => {
            setMessages(messages.filter(value => value.key !== key));
        },
        [messages],
    );

    const message = (message: string, options?: Partial<MessageOptions>) => {
        const defaults: MessageOptions = {
            title: 'Message',
            severity: 'INFO',
        };

        options = { ...defaults, ...options };
        setMessages(messages.concat({ key, message, ...(options as MessageOptions) }));
        setKey(key + 1);
    };

    return (
        <MessageContext.Provider value={message}>
            {props.children}
            <div className="fixed z-10 bottom-4 right-1/2 transform translate-x-1/2 md:right-4 md:translate-x-0 flex flex-col">
                {messages.map(({ title, message, severity, key }) => (
                    <Message title={title} message={message} severity={severity} key={key} close={() => close(key)} />
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
