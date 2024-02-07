import {Text, View} from 'react-native';
import {DataPoint, testData1, testData2} from '../../data';
import {line, scaleTime, curveBasis, scaleLinear} from 'd3';
import {Skia, Path, Canvas, Line, vec} from '@shopify/react-native-skia';
import {GraphData} from '../../types/chartData';

export default function Page() {
    const GRAPH_HEIGHT = 400;
    const GRAPH_WIDTH = 370;

    const processGraphData = (data: DataPoint[]) => {
        return data.map(point => ({
            ...point,
            weight: Math.max(0, parseFloat(point.weight.toFixed(2))),
        }));
    };

    const proccessedData1 = processGraphData(testData1);
    const proccessedData2 = processGraphData(testData2);
    const timestampStart = (data: DataPoint[]) =>
        Math.min(...data.map(val => val.timestamp));
    const timestampEnd = (data: DataPoint[]) =>
        Math.max(...data.map(val => val.timestamp));

    const makeGraph = (data: DataPoint[]): GraphData => {
        const max = Math.max(...data.map(val => val.weight));
        const min = Math.min(...data.map(val => val.weight));

        const yAxis = scaleLinear().domain([0, max]).range([GRAPH_HEIGHT, 35]);
        const xAxis = scaleTime()
            .domain([
                timestampStart(proccessedData1),
                timestampEnd(proccessedData1),
            ])
            .range([10, GRAPH_WIDTH - 10]);

        const curvedLine = line<DataPoint>()
            .x(d => xAxis(d.timestamp))
            .y(d => yAxis(d.weight))
            .curve(curveBasis)(data);

        //TODO add error handling when dealing with data from DB
        const skPath = Skia.Path.MakeFromSVGString(curvedLine!);

        return {
            max,
            min,
            curve: skPath!,
        };
    };

    const graphData = makeGraph(proccessedData1);

    return (
        <View>
            <Canvas
                style={{
                    width: GRAPH_WIDTH,
                    height: GRAPH_HEIGHT,
                }}>
                <Path
                    style={'stroke'}
                    path={graphData.curve}
                    strokeWidth={4}
                    color={'#6B4E71'}
                />
            </Canvas>
        </View>
    );
}
