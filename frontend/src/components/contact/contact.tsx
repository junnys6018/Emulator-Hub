import React, { Fragment, useCallback, useState } from 'react';
import { FaEnvelope, FaGithub, FaGlobe, FaLinkedin, FaTimes } from 'react-icons/fa';
import { Alert } from '../util/alert';

import './contact.css';

export interface ContactModalProps {
    onClose: () => void;
}

interface FormResultProps {
    title: string;
    subTitle: string;
    buttonText: string;
    onClick: () => void;
    close: () => void;
}

function FormResult(props: FormResultProps) {
    return (
        <Fragment>
            <button
                className="md:hover:text-green-500 active:text-green-500 self-end"
                style={{ marginTop: '0.125rem' }}
                onClick={props.close}
            >
                <FaTimes size="1.5rem" />
            </button>
            <div className="my-auto flex flex-col items-center">
                <h2 className="font-semibold text-3xl mb-5">{props.title}</h2>
                <span className="text-gray-300 mb-8">{props.subTitle}</span>
                <button onClick={props.onClick} className="btn-primary py-2 px-8 font-medium text-xl">
                    {props.buttonText}
                </button>
            </div>
        </Fragment>
    );
}

export default function ContactModal(props: ContactModalProps) {
    const [messagePanel, setMessagePanel] = useState<'FORM' | 'SUCCESS' | 'ERROR'>('FORM');

    const [subjectText, setSubjectText] = useState('');
    const [emailText, setEmailText] = useState('');
    const [messageText, setMessageText] = useState('');

    const [subjectError, setSubjectError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [messageError, setMessageError] = useState(false);

    const onSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            // Clear errors
            setSubjectError(false);
            setEmailError(false);
            setMessageError(false);

            const sanitizedSubjectText = subjectText.trim();
            const sanitizedEmailText = emailText.trim();
            const sanitizedMessageText = messageText.trim();

            let error = false;

            if (sanitizedSubjectText === '') {
                setSubjectError(true);
                error = true;
            }

            if (sanitizedEmailText === '') {
                setEmailError(true);
                error = true;
            }

            if (sanitizedMessageText === '') {
                setMessageError(true);
                error = true;
            }

            if (error) {
                return;
            }

            fetch('/api/send-mail', {
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    subject: sanitizedSubjectText,
                    email: sanitizedEmailText,
                    message: sanitizedMessageText,
                }),
            }).then(async response => {
                // Clear inputs
                setSubjectText('');
                setEmailText('');
                setMessageText('');
                if (response.status === 201) {
                    setMessagePanel('SUCCESS');
                } else {
                    setMessagePanel('ERROR');
                }
            });
        },
        [emailText, messageText, subjectText],
    );

    return (
        <Alert onClose={props.onClose}>
            {close => (
                <div className="contact-modal">
                    <div className="contact-modal__send-message">
                        {messagePanel === 'SUCCESS' && (
                            <FormResult
                                title="Success"
                                subTitle="Your message was successfully sent!"
                                buttonText="Send Another Message"
                                onClick={() => setMessagePanel('FORM')}
                                close={close}
                            />
                        )}
                        {messagePanel === 'ERROR' && (
                            <FormResult
                                title="Error"
                                subTitle="Failed to send your message"
                                buttonText="Try again"
                                onClick={() => setMessagePanel('FORM')}
                                close={close}
                            />
                        )}
                        {messagePanel === 'FORM' && (
                            <Fragment>
                                <div className="flex flex-row items-center mb-7 xl:mb-8">
                                    <h2 className="font-semibold text-xl mr-auto">Send me a message</h2>
                                    <button className="md:hover:text-green-500 active:text-green-500" onClick={close}>
                                        <FaTimes size="1.5rem" />
                                    </button>
                                </div>
                                <form onSubmit={onSubmit} className="flex flex-grow flex-col">
                                    <div className="flex items-center mb-2">
                                        <label htmlFor="subject" className="text-sm mr-auto">
                                            Subject*
                                        </label>
                                        {subjectError && (
                                            <span className="text-sm text-red-500">This Field Is Required</span>
                                        )}
                                    </div>
                                    <input
                                        className="text-input w-full h-9 mb-3.5 rounded-lg"
                                        name="subject"
                                        id="subject"
                                        type="text"
                                        value={subjectText}
                                        onChange={e => setSubjectText(e.currentTarget.value)}
                                    ></input>
                                    <div className="flex items-center mb-2">
                                        <label htmlFor="email" className="text-sm mr-auto">
                                            Email*
                                        </label>
                                        {emailError && (
                                            <span className="text-sm text-red-500">This Field Is Required</span>
                                        )}
                                    </div>
                                    <input
                                        className="text-input w-full h-9 mb-3.5 rounded-lg"
                                        name="email"
                                        id="email"
                                        type="email"
                                        value={emailText}
                                        onChange={e => setEmailText(e.currentTarget.value)}
                                    ></input>
                                    <div className="flex items-center mb-2">
                                        <label htmlFor="message" className="text-sm mr-auto">
                                            Message*
                                        </label>
                                        {messageError && (
                                            <span className="text-sm text-red-500">This Field Is Required</span>
                                        )}
                                    </div>
                                    <textarea
                                        className="text-input flex-grow mb-5 py-2 w-full rounded-lg"
                                        name="message"
                                        id="message"
                                        value={messageText}
                                        onChange={e => setMessageText(e.currentTarget.value)}
                                    ></textarea>
                                    <button className="btn-primary py-2 w-full xl:w-auto xl:px-10 xl:self-end font-medium text-xl">
                                        Send Message
                                    </button>
                                </form>
                            </Fragment>
                        )}
                    </div>
                    <div className="contact-modal__contact-information">
                        <h2 className="font-semibold text-xl mb-7 xl:mb-8">Contact information</h2>
                        <a className="contact-modal__contact-link" href="mailto:junkang2001.lim@gmail.com">
                            <FaEnvelope size="1.5rem" />
                            <span>junkang2001.lim@gmail.com</span>
                        </a>
                        <a
                            className="contact-modal__contact-link"
                            href="https://junnys6018.github.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaGlobe size="1.5rem" />
                            <span>junnys6018.github.io</span>
                        </a>
                        <a
                            className="contact-modal__contact-link"
                            href="https://www.linkedin.com/in/jun-lim-131810180/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaLinkedin size="1.5rem" />
                            <span>Jun Lim</span>
                        </a>
                        <a
                            className="contact-modal__contact-link"
                            href="https://github.com/junnys6018"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaGithub size="1.5rem" />
                            <span>@junnys6018</span>
                        </a>
                    </div>
                </div>
            )}
        </Alert>
    );
}
