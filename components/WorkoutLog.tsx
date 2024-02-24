import {Text, View} from 'react-native';

import useDB from '../hooks/useDB';

const WorkoutLog = () => {
    const {workouts} = useDB();
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
