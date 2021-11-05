import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DatadogTopListWrapper } from './viz/DatadogTopListWrapper';
import { Palette, Theme } from './types';
import { Resizer } from './Resizer';
import { DatadogTimeseriesWrapper } from './viz/DatadogTimeseriesWrapper';
import { DatadogPieChartWrapper } from './viz/DatadogPieChartWrapper';
import './index.css';

const DEFAULT_HEIGHT = 250;
const DEFAULT_WIDTH = 800;

interface TimeseriesParams {
    title?: string;
    palette?: Palette;
    theme?: Theme;
    customHeight?: number;
    customWidth?: number;
    yAxis?: {
        min?: number;
        max?: number;
    };
}

export const drawTimeseriesGraph = (
    container: HTMLElement,
    timestamps: number[],
    series: Record<string, number[]>,
    params: TimeseriesParams
) => {
    const { title, palette, theme, customHeight, customWidth, yAxis } = params;

    const element = (
        <div className="container">
            <Resizer container={container}>
                {([width]) => (
                    <DatadogTimeseriesWrapper
                        width={customWidth || width || DEFAULT_WIDTH}
                        height={customHeight || DEFAULT_HEIGHT}
                        palette={palette}
                        theme={theme}
                        timeseries={timestamps}
                        valuesByLabel={series}
                        formatTooltipValue={(value: number) => value.toString()}
                        yAxis={yAxis}
                    />
                )}
            </Resizer>
            {title && <div className="title">{title}</div>}
        </div>
    );

    ReactDOM.render(element, container);
};

interface PieChartParams {
    title?: string;
    palette?: Palette;
    theme?: Theme;
    customHeight?: number;
    customWidth?: number;
}

export const drawPieChart = (
    container: HTMLElement,
    keys: string[],
    values: number[],
    params: PieChartParams
) => {
    const { title, palette, theme, customHeight, customWidth } = params;

    const element = (
        <div className="container">
            <Resizer container={container}>
                {([width]) => (
                    <DatadogPieChartWrapper
                        width={customWidth || width || DEFAULT_WIDTH}
                        height={customHeight || DEFAULT_HEIGHT}
                        palette={palette}
                        theme={theme}
                        keys={keys}
                        values={values}
                        formatTooltipValue={(value: number) => value.toString()}
                        formatValue={(value: number) => value.toString()}
                    />
                )}
            </Resizer>
            {title && <div className="title">{title}</div>}
        </div>
    );

    ReactDOM.render(element, container);
};

interface TopListParams {
    title?: string;
    theme?: Theme;
    customHeight?: number;
    customWidth?: number;
}

export const drawTopList = (
    container: HTMLElement,
    keys: string[],
    values: number[],
    params: TopListParams
) => {
    const { title, theme, customHeight, customWidth } = params;

    const element = (
        <div className="container">
            <Resizer container={container}>
                {([width]) => (
                    <DatadogTopListWrapper
                        width={customWidth || width || DEFAULT_WIDTH}
                        height={customHeight || DEFAULT_HEIGHT}
                        theme={theme}
                        keys={keys}
                        values={values}
                        formatValue={(value: number) => value.toString()}
                    />
                )}
            </Resizer>
            {title && <div className="title">{title}</div>}
        </div>
    );

    ReactDOM.render(element, container);
};
