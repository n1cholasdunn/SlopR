import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button} from 'react-native';

type TimerProps = {
    mode: 'up' | 'down';
    startSeconds?: number;
};

const Timer: React.FC<TimerProps> = ({mode, startSeconds = 0}) => {
    const [seconds, setSeconds] = useState<number>(
        mode === 'down' ? startSeconds : 0,
    );
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const intervalRef = useRef<number | null>(null);

    const startTimer = () => {
        if (!isRunning) {
            setIsRunning(true);
            intervalRef.current = setInterval(() => {
                setSeconds(prevSeconds => {
                    if (mode === 'down') {
                        return prevSeconds > 0 ? prevSeconds - 1 : 0;
                    }

                    return prevSeconds + 1;
                });
            }, 1000) as unknown as number;
        }
    };

    const stopTimer = () => {
        if (isRunning) {
            clearInterval(intervalRef.current as number);
            setIsRunning(false);
        }
    };

    const resetTimer = () => {
        clearInterval(intervalRef.current as number);
        setIsRunning(false);
        setSeconds(mode === 'down' ? startSeconds : 0);
    };

    useEffect(() => {
        return () => clearInterval(intervalRef.current as number);
    }, []);

    return (
        <View>
            <Text>Timer: {seconds}s</Text>
            <Button title="Start" onPress={startTimer} disabled={isRunning} />
            <Button title="Stop" onPress={stopTimer} disabled={!isRunning} />
            <Button title="Reset" onPress={resetTimer} />
        </View>
    );
};

export default Timer;
