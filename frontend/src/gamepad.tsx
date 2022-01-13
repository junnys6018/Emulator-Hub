import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

const HasGamepadContext = React.createContext<boolean | null>(null);

export let controllerIndex: number | null = null;

export function HasGamepadProvider(props: { children: React.ReactNode }) {
    const [hasGamepad, setHasGamepad] = useState(false);
    const gamepads = useRef(new Set<number>());

    const connectedHandler = useCallback((e: GamepadEvent) => {
        gamepads.current.add(e.gamepad.index);
        setHasGamepad(true);

        if (controllerIndex === null) {
            controllerIndex = e.gamepad.index;
        }
    }, []);

    const disconnectedHandler = useCallback((e: GamepadEvent) => {
        gamepads.current.delete(e.gamepad.index);

        // Attempt to reassign controllerIndex
        if (e.gamepad.index === controllerIndex) {
            if (gamepads.current.size === 0) {
                controllerIndex = null;
            } else {
                controllerIndex = gamepads.current.values().next().value;
            }
        }

        if (gamepads.current.size === 0) {
            setHasGamepad(false);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('gamepadconnected', connectedHandler);

        window.addEventListener('gamepaddisconnected', disconnectedHandler);

        return () => {
            window.removeEventListener('gamepadconnected', connectedHandler);
            window.removeEventListener('gamepaddisconnected', disconnectedHandler);
        };
    }, [connectedHandler, disconnectedHandler]);

    return <HasGamepadContext.Provider value={hasGamepad}>{props.children}</HasGamepadContext.Provider>;
}

export function useHasGamepad() {
    const context = useContext(HasGamepadContext);

    if (context === null) {
        throw new Error('useHasGamepad() must be called with a HasGamepadProvider');
    }

    return context;
}
