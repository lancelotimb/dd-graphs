import * as React from 'react';
import { Palette, Theme } from '../types';
import { v4 } from 'uuid';
import { TimeseriesViz } from '@datadog/vis-draw';
import { DataFrame } from '@datadog/vis-core';

interface DatadogTimeseriesWrapperProps {
    /** pixel width */
    width: number;
    /** pixel height */
    height: number;
    /** Array of x values */
    timeseries: number[];
    /** List of values (one list per series). Must be the same length! */
    valuesByLabel: Record<string, number[]>;
    /** Optional */
    formatTooltipValue?: (value: number) => string;
    /** Color palette "dogcat" | "dd-classic-line" | "dd-classic-line-dark" | "dd-classic-area" | "dd-classic-area-light" | "dd-classic-area-dark" | "dd-vibrant-classic-line" | "dd-vibrant-classic-line-dark" | "dd-hostmap-blues" | "dd-purples" | "dd-greys" | "dd-green-orange" | "dd-yellow-green" | "dd-yellow-red" */
    palette?: Palette;
    /** yAxis customisation */
    yAxis?: {
        formatTick?: (value: number) => string;
        min?: number;
        max?: number;
        includeZero?: boolean;
    };
    /* Theme light | dark */
    theme?: Theme;
}

export const DatadogTimeseriesWrapper: React.FunctionComponent<DatadogTimeseriesWrapperProps> =
    ({
        width,
        height,
        timeseries,
        valuesByLabel,
        formatTooltipValue = undefined,
        palette = 'dogcat',
        yAxis = undefined,
        theme = 'light',
    }) => {
        const uniqBlockId = React.useMemo(
            () => `datadog-viz-wrapper-${v4()}`,
            []
        );
        const startTimestamp = React.useMemo(
            () => Math.min(...timeseries),
            [timeseries]
        );
        const endTimestamp = React.useMemo(
            () => Math.max(...timeseries),
            [timeseries]
        );
        const [timeframe, setTimeframe] = React.useState({
            from: startTimestamp,
            to: endTimestamp,
        });
        const resetTimeFrame = React.useCallback(
            () => setTimeframe({ from: startTimestamp, to: endTimestamp }),
            [setTimeframe, startTimestamp, endTimestamp]
        );
        const isResetDisabled = React.useMemo(
            () =>
                timeframe.from === startTimestamp &&
                timeframe.to === endTimestamp,
            [timeframe, startTimestamp, endTimestamp]
        );

        const formattedData = React.useMemo(() => {
            const labels = Object.keys(valuesByLabel);
            const dataPointsPerSeries = timeseries.length;
            const duplicatedTimeseries: number[] = [];
            const values: number[] = [];
            const keys: string[] = [];

            labels.forEach((label) => {
                duplicatedTimeseries.push(...timeseries);
                const curValues = Array(dataPointsPerSeries);
                const curKeys = Array(dataPointsPerSeries).fill(label);
                timeseries.forEach((_, index) => {
                    // Pad with zeros in case values are missing, also discard values if too many objects in the array.
                    curValues[index] = valuesByLabel[label][index] || 0;
                });
                values.push(...curValues);
                keys.push(...curKeys);
            });

            // Scalar columns can contain numbers or nulls.
            return DataFrame.fromColumns([
                {
                    id: 'timestamp',
                    kind: 'scalar',
                    values: duplicatedTimeseries,
                    meta: {},
                },
                {
                    id: 'value',
                    kind: 'scalar',
                    values: values,
                    meta: {},
                },
                {
                    id: 'key',
                    kind: 'string',
                    values: keys,
                    meta: {},
                },
            ]);
        }, [valuesByLabel, timeseries]);

        React.useEffect(() => {
            const timeseriesViz = new TimeseriesViz(`#${uniqBlockId}`, {
                formatTooltipValue,
                onBrushEnd: (interactionData) => {
                    const [from, to] = interactionData.timestamp;
                    setTimeframe({ from, to });
                },
                palette,
                theme,
                timeExtent: timeframe,
                yAxis,
            });

            timeseriesViz.draw(formattedData);
        }, [
            formatTooltipValue,
            formattedData,
            palette,
            theme,
            timeframe,
            yAxis,
            uniqBlockId,
        ]);

        return (
            <>
                <div
                    style={{
                        width: `${width}px`,
                        height: `25px`,
                        textAlign: 'center',
                    }}
                >
                    <button onClick={resetTimeFrame} disabled={isResetDisabled}>
                        Reset timeframe
                    </button>
                </div>
                <div
                    id={uniqBlockId}
                    style={{ width: `${width}px`, height: `${height - 25}px` }}
                />
            </>
        );
    };
