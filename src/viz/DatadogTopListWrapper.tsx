import * as React from 'react';
import { TopListViz } from '@datadog/vis-draw';
import { DataFrame } from '@datadog/vis-core';
import { useEffect, useMemo } from 'react';
import { Theme } from '../types';
import { v4 } from 'uuid';
import { uniq } from 'lodash';

interface DatadogTopListWrapperProps {
    /** pixel width */
    width: number;
    /** pixel height */
    height: number;
    /** Array of values to display */
    values: number[];
    /** Array of associated keys */
    keys: string[];
    /** Maximum number of items to display */
    limit?: number;
    /** Optional */
    formatValue?: (value: number) => string;
    /* Theme light | dark */
    theme?: Theme;
}

export const DatadogTopListWrapper: React.FunctionComponent<DatadogTopListWrapperProps> =
    ({
        width,
        height,
        values,
        keys,
        formatValue = undefined,
        theme = 'light',
        limit = undefined,
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
            const topListViz = new TopListViz(`#${uniqBlockId}`, {
                formatValue,
                theme,
                limit,
                height,
                numItems: uniq(keys).length,
            });

            topListViz.draw(formattedData);
        }, [
            formatValue,
            formattedData,
            theme,
            uniqBlockId,
            limit,
            height,
            keys,
        ]);

        return (
            <div
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    overflowY: 'scroll',
                }}
            >
                <div
                    id={uniqBlockId}
                    style={{ width: `${width}px`, height: `${height}px` }}
                />
            </div>
        );
    };
