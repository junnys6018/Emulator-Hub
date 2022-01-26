import React from 'react';
import { SettingsComponentProps } from '../settings/common';

type requiredProps = 'settingsChanged' | 'onSave' | 'resetAll' | 'cancel';

const SettingsButtons = ({
    settingsChanged,
    onSave,
    resetAll,
    cancel,
}: Pick<SettingsComponentProps<never>, requiredProps>) => {
    return (
        <div className="flex mt-auto mb-12 lg:mb-24">
            <button
                className={`btn-primary h-10 w-40 xl:w-52 lg:mr-20 ${settingsChanged() ? '' : 'disabled'}`}
                onClick={onSave}
            >
                Save
            </button>
            {cancel && (
                <button
                    className={`btn-tertiary h-10 w-40 xl:w-52 lg:mr-20 ${
                        settingsChanged() ? 'ring-gray-50 hover:ring-red-500' : 'cursor-not-allowed ring-gray-300'
                    }`}
                    onClick={cancel}
                >
                    Cancel
                </button>
            )}
            <button className="h-10 w-auto text-gray-300 hover:text-gray-50" onClick={resetAll}>
                Reset All
            </button>
        </div>
    );
};

export default SettingsButtons;
