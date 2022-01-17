import getActiveUserUuid from '@/src/storage/get-active-user';
import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';

interface LoginRequiredProps {
    children: React.ReactNode;
}

export default function LoginRequired(props: LoginRequiredProps) {
    const activeUser = getActiveUserUuid();
    return activeUser === null ? <Redirect to="/login" /> : <Fragment>{props.children}</Fragment>;
}
