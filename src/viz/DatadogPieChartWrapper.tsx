import * as React from 'react';
import { PieViz } from '@datadog/vis-draw';
import { DataFrame } from '@datadog/vis-core';
import { useEffect, useMemo } from 'react';
import { Palette, Theme } from '../types';
import { v4 } from 'uuid';

interface DatadogPieChartWrapperProps {
    /** pixel width */
    width: number;
    /** pixel height */
    height: number;
    /** Array of keys. Must be the same length as values! */
    keys: string[];
    /** Array of values to display */
    values: number[];
    /** Format tooltip value */
    formatTooltipValue?: (value: number) => string;
    /* Format center value */
    formatValue?: (value: number) => string;
    /* Theme light | dark */
    theme?: Theme;
    /** Color palette */
    palette?: Palette;
}

export const DatadogPieChartWrapper: React.FunctionComponent<DatadogPieChartWrapperProps> =
    ({
        width,
        height,
        keys,
        values,
        formatTooltipValue = undefined,
        formatValue = undefined,
        theme = 'light',
        palette = 'dogcat',
    }) => {
        const uniqBlockId = useMemo(() => `datadog-viz-wrapper-${v4()}`, []);

        const formattedData = useMemo(
            () =>
                DataFrame.fromColumns([
                    {
                        id: 'key',
                        kind: 'string',
                        values: keys,
                        meta: {},
                    },
                    {
                        id: 'value',
                        kind: 'scalar',
                        values,
                        meta: {},
                    },
                ]),
            [keys, values]
        );

        useEffect(() => {
            const pieViz = new PieViz(`#${uniqBlockId}`, {
                formatTooltipValue,
                formatValue,
                theme,
                palette,
            });

            pieViz.draw(formattedData);
        }, [
            formatTooltipValue,
            formatValue,
            formattedData,
            palette,
            theme,
            uniqBlockId,
        ]);

        return (
            <div
                id={uniqBlockId}
                style={{ width: `${width}px`, height: `${height}px` }}
            />
        );
    };
