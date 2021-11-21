import classNames from 'classnames';
import React from 'react';
import './util.css';

interface SwitchProps {
    id?: string;
    name?: string;
    disabled?: boolean;
    className?: string;
    checked?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function Switch(props: SwitchProps) {
    return (
        <input
            type="checkbox"
            id={props.id}
            name={props.name}
            className={classNames('switch', props.className)}
            disabled={props.disabled}
            checked={props.checked}
            onChange={props.onChange}
        ></input>
    );
}
