import {Text, View} from 'react-native';

import useDB from '../hooks/useDB';

const WorkoutSetupModal = () => {
    const {workoutInstructions} = useDB();
    console.log(
        workoutInstructions?.map(instruction => instruction.startingHand),
    );
    return (
        <View>
            {workoutInstructions &&
                workoutInstructions.map(instruction => (
                    <View key={instruction.id}>
                        <Text>
                            Workout Setup Date:{' '}
                            {new Date(
                                instruction.createdAt.seconds * 1000,
                            ).toLocaleDateString()}
                        </Text>
                        <Text>Sets: {instruction.amountOfSets}</Text>
                        <Text>Reps: {instruction.amountOfReps}</Text>
                        <Text>
                            Rest between sets {instruction.minutesBetweenSets}
                            min {instruction.secondsBetweenSets}s
                        </Text>
                        <Text>Rep Duration: {instruction.repDuration}s</Text>
                        <Text>Rest Time: {instruction.restTime}s</Text>
                        <Text>Single Hand: {instruction.singleHand}</Text>
                        {instruction.startingHand && (
                            <Text>
                                Starting Hand: {instruction.startingHand}
                            </Text>
                        )}
                    </View>
                ))}
        </View>
    );
};

export default WorkoutSetupModal;
