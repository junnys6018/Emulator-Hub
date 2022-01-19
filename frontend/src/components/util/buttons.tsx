import React from 'react';
import { SettingsComponentProps } from '../settings/common';

type requiredProps = 'settingsChanged' | 'onSave' | 'resetAll' | 'revert';

const SettingsButtons = ({
    settingsChanged,
    onSave,
    resetAll,
    revert,
}: Pick<SettingsComponentProps<never>, requiredProps>) => {
    return (
        <div className="flex mt-auto mb-12 lg:mb-24">
            <button
                className={`btn-primary h-10 w-40 lg:w-52 mr-auto lg:mr-20 ${settingsChanged() ? '' : 'disabled'}`}
                onClick={onSave}
            >
                Save
            </button>
            <button className={`btn-secondary h-10 w-40 lg:w-52 ${revert && 'mr-20'}`} onClick={resetAll}>
                Reset All
            </button>
            {revert && (
                <button className="btn-secondary h-10 w-40 lg:w-52" onClick={revert}>
                    Revert
                </button>
            )}
        </div>
    );
};

export default SettingsButtons;
