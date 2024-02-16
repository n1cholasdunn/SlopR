import {useState, useEffect, useRef, useCallback} from 'react';

interface TimerHook {
    seconds: number;
    startTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;
    isRunning: boolean;
}

const useTimer = (
    initialSeconds: number = 0,
    mode: 'up' | 'down' = 'up',
): TimerHook => {
    const [seconds, setSeconds] = useState<number>(initialSeconds);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const intervalRef = useRef<number | null>(null);

    const startTimer = useCallback(() => {
        if (!isRunning) {
            setIsRunning(true);
            intervalRef.current = window.setInterval(() => {
                setSeconds(prevSeconds =>
                    mode === 'up'
                        ? prevSeconds + 1
                        : Math.max(prevSeconds - 1, 0),
                );
            }, 1000) as unknown as number;
        }
    }, [isRunning, mode]);

    const stopTimer = useCallback(() => {
        if (isRunning && intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
        }
    }, [isRunning]);

    const resetTimer = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
        }
        setIsRunning(false);
        setSeconds(mode === 'up' ? 0 : initialSeconds);
    }, [mode, initialSeconds]);

    useEffect(() => {
        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return {seconds, startTimer, stopTimer, resetTimer, isRunning};
};

export default useTimer;
/*import {useState, useEffect, useCallback} from 'react';

interface TimerHook {
    seconds: number;
    startTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;
    isRunning: boolean;
}

const useTimer = (
    initialSeconds: number = 0,
    mode: 'up' | 'down' = 'up',
): TimerHook => {
    const [seconds, setSeconds] = useState<number>(initialSeconds);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const startTimer = useCallback(() => {
        if (!isRunning) {
            setIsRunning(true);
            const interval = setInterval(() => {
                setSeconds(prevSeconds =>
                    mode === 'up'
                        ? prevSeconds + 1
                        : Math.max(prevSeconds - 1, 0),
                );
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isRunning, mode]);

    const stopTimer = useCallback(() => {
        setIsRunning(false);
    }, []);

    const resetTimer = useCallback(() => {
        setIsRunning(false);
        setSeconds(mode === 'up' ? 0 : initialSeconds);
    }, [mode, initialSeconds]);

    useEffect(() => {
        return () => setIsRunning(false);
    }, []);

    return {seconds, startTimer, stopTimer, resetTimer, isRunning};
};

export default useTimer;
  */
