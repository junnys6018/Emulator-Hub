import React, { Fragment, useCallback, useState } from 'react';
import { FaEnvelope, FaGithub, FaGlobe, FaLinkedin, FaTimes } from 'react-icons/fa';
import { Alert } from '../util/alert';

import './contact.css';

export interface ContactModalProps {
    onClose: () => void;
}

export default function ContactModal(props: ContactModalProps) {
    const [messageSent, setMessageSent] = useState(false);

    const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessageSent(true);
    }, []);

    return (
        <Alert onClose={props.onClose}>
            {close => (
                <div className="contact-modal">
                    <div className="contact-modal__send-message">
                        {messageSent ? (
                            <Fragment>
                                <button
                                    className="md:hover:text-green-500 active:text-green-500 self-end"
                                    style={{ marginTop: '0.125rem' }}
                                    onClick={close}
                                >
                                    <FaTimes size="1.5rem" />
                                </button>
                                <div className="my-auto flex flex-col items-center">
                                    <h2 className="font-semibold text-3xl mb-5">Success</h2>
                                    <span className="text-gray-300 mb-8">Your message was successfully sent!</span>
                                    <button
                                        onClick={() => setMessageSent(false)}
                                        className="btn-primary py-2 px-8 font-medium text-xl"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            </Fragment>
                        ) : (
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
                                    </div>
                                    <input
                                        className="text-input w-full h-9 mb-3.5 rounded-lg"
                                        name="subject"
                                        id="subject"
                                        type="text"
                                    ></input>
                                    <div className="flex items-center mb-2">
                                        <label htmlFor="email" className="text-sm mr-auto">
                                            Email*
                                        </label>
                                    </div>
                                    <input
                                        className="text-input w-full h-9 mb-3.5 rounded-lg"
                                        name="email"
                                        id="email"
                                        type="email"
                                    ></input>
                                    <div className="flex items-center mb-2">
                                        <label htmlFor="message" className="text-sm mr-auto">
                                            Message*
                                        </label>
                                    </div>
                                    <textarea
                                        className="text-input flex-grow mb-5 py-2 w-full rounded-lg"
                                        name="message"
                                        id="message"
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
