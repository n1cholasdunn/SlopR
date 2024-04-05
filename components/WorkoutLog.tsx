import {Text, View} from 'react-native';

import useDB from '../hooks/useDB';

const WorkoutLog = () => {
    const {workouts} = useDB();
    if (workouts) {
        const testlog = workouts[0]?.sets[0]?.reps[0].data.map(
            data => data.timestamp,
        );
        const testlog2 = workouts[1]?.sets[0]?.reps[0].data.map(
            data => data.timestamp,
        );
        console.log('test1', testlog);
        console.log('test2', testlog2);
    }
    return (
        <View>
            {workouts &&
                workouts.map(workout => (
                    <View key={workout.id}>
                        <Text>
                            Workout Date:{' '}
                            {new Date(
                                workout.createdAt.seconds * 1000,
                            ).toLocaleDateString()}
                        </Text>
                        {workout.sets.map(set => (
                            <View key={set.id}>
                                <Text>Set id:{set.id}</Text>
                                {set.reps && (
                                    <Text>
                                        Number of reps: {set.reps.length}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </View>
                ))}
        </View>
    );
};

export default WorkoutLog;
