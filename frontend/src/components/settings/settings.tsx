import React, { Fragment, useState } from 'react';

import ProfilePicture from './profile-picture';
import Navbar from '../util/navbar';
import { useBreakpoint } from '../../use-breakpoint';
import { useUserProfile } from '@/src/storage/user-data';
import { Console } from '../../storage/game-data';

import GeneralSettingsPanel from './general-settings';
import NESSettings from './nes-settings';
import GBSettings from './gb-settings';
import GBCSettings from './gbc-settings';
import CHIP8Settings from './chip8-settings';

import './settings.css';

type SettingsPanel = Console | 'GENERAL';

export default function Settings() {
    const breakpoint = useBreakpoint();
    const [currentPanel, setCurrentPanel] = useState<SettingsPanel>('GENERAL');
    const [{ userName, profileImage }, setUserData] = useUserProfile();

    let settingsPanel;
    switch (currentPanel) {
        case 'GENERAL':
            settingsPanel = <GeneralSettingsPanel />;
            break;
        case 'NES':
            settingsPanel = <NESSettings />;
            break;
        case 'GB':
            settingsPanel = <GBSettings />;
            break;
        case 'GBC':
            settingsPanel = <GBCSettings />;
            break;
        case 'CHIP 8':
            settingsPanel = <CHIP8Settings />;
            break;
    }

    const onEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('[INFO] User profile image has been edited');
        if (e.target.files) {
            const newProfileImage: Blob = e.target.files[0];
            setUserData({ profileImage: newProfileImage });
        }
    };

    if (breakpoint.lg) {
        return (
            <Fragment>
                <Navbar userName={userName} profileImage={profileImage} />
                <div className="container flex">
                    <div className="w-72 flex flex-col">
                        <ProfilePicture size="200px" profileImage={profileImage} className="mb-6" onEdit={onEdit} />
                        <h1 className="font-bold text-3xl mb-24 truncate">{userName}</h1>
                        <div className={`settings__button mb-6 ${currentPanel === 'GENERAL' ? 'active' : ''}`}>
                            <button onClick={() => setCurrentPanel('GENERAL')}>General</button>
                        </div>
                        <h4 className="font-medium text-xs text-gray-500 mb-2">Controls</h4>
                        <div className={`settings__button mb-3.5 ${currentPanel === 'NES' ? 'active' : ''}`}>
                            <button onClick={() => setCurrentPanel('NES')}>NES</button>
                        </div>
                        <div className={`settings__button mb-3.5 ${currentPanel === 'GB' ? 'active' : ''}`}>
                            <button onClick={() => setCurrentPanel('GB')}>GB</button>
                        </div>
                        <div className={`settings__button mb-3.5 ${currentPanel === 'GBC' ? 'active' : ''}`}>
                            <button onClick={() => setCurrentPanel('GBC')}>GBC</button>
                        </div>
                        <div className={`settings__button mb-24 ${currentPanel === 'CHIP 8' ? 'active' : ''}`}>
                            <button onClick={() => setCurrentPanel('CHIP 8')}>CHIP 8</button>
                        </div>
                    </div>
                    <div className="flex-grow flex flex-col ml-20">{settingsPanel}</div>
                </div>
                <div className="settings__side-column"></div>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <Navbar userName={userName} profileImage={profileImage} />
            <div className="container flex flex-col pt-2.5 md:pt-0">
                <ProfilePicture size="130px" profileImage={profileImage} className="mb-5" onEdit={onEdit} />
                <h1 className="font-semibold text-3xl mb-6">{userName}</h1>
                <GeneralSettingsPanel />
            </div>
        </Fragment>
    );
}
