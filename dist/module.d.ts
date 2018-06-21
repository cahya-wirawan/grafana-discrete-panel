/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import { CanvasPanelCtrl } from './canvas-metric';
declare class DiscretePanelCtrl extends CanvasPanelCtrl {
    static templateUrl: string;
    static scrollable: boolean;
    defaults: {
        display: string;
        rowHeight: number;
        valueMaps: {
            value: string;
            op: string;
            text: string;
        }[];
        rangeMaps: {
            from: string;
            to: string;
            text: string;
        }[];
        colorMaps: {
            text: string;
            color: string;
        }[];
        metricNameColor: string;
        valueTextColor: string;
        timeTextColor: string;
        crosshairColor: string;
        backgroundColor: string;
        lineColor: string;
        textSize: number;
        textSizeTime: number;
        extendLastValue: boolean;
        writeLastValue: boolean;
        writeAllValues: boolean;
        writeValuesOnHover: boolean;
        writeMetricNames: boolean;
        writeMetricNamesRight: boolean;
        showTimeAxis: boolean;
        showLegend: boolean;
        showLegendNames: boolean;
        showLegendValues: boolean;
        showLegendPercent: boolean;
        showLegendExtended: boolean;
        highlightOnMouseover: boolean;
        expandFromQueryS: number;
        legendSortBy: string;
        units: string;
        rowSelectorType: string;
        rowSelectorURL: string;
        rowSelectorURLParam: string;
        rowSelectorNewTab: boolean;
        rowSelectorWidth: number;
        rowParsingCodeType: string;
        onMouseClickZoom: boolean;
        onMouseClickShortRange: boolean;
    };
    data: any;
    externalPT: boolean;
    isTimeline: boolean;
    isStacked: boolean;
    hoverPoint: any;
    colorMap: any;
    _colorsPaleteCash: any;
    unitFormats: any;
    formatter: any;
    _renderDimensions: any;
    _selectionMatrix: Array<Array<String>>;
    rowselWidth: number;
    parsingCodes: {
        channel: string[];
        frame: string[];
        qualityflags: string[];
    };
    constructor($scope: any, $injector: any);
    onPanelInitialized(): void;
    onDataError(err: any): void;
    onInitEditMode(): void;
    onRender(): void;
    showLegandTooltip(pos: any, info: any): void;
    clearTT(): void;
    formatValue(val: any): any;
    getColor(val: any): any;
    randomColor(): string;
    applyPanelTimeOverrides(): void;
    onDataReceived(dataList: any): void;
    removeColorMap(map: any): void;
    updateColorInfo(): void;
    addColorMap(what: any): void;
    removeValueMap(map: any): void;
    addValueMap(): void;
    removeRangeMap(rangeMap: any): void;
    addRangeMap(): void;
    onConfigChanged(update?: boolean): void;
    getLegendDisplay(info: any, metric: any): any;
    showTooltip(evt: any, point: any, isExternal: any): void;
    onGraphHover(evt: any, showTT: any, isExternal: any): void;
    onMouseClicked(where: any): void;
    onMouseSelectedRange(range: any): void;
    clear(): void;
    _updateRenderDimensions(): void;
    _updateSelectionMatrix(): void;
    _updateCanvasSize(): void;
    _getVal(metricIndex: any, rectIndex: any): any;
    _renderRects(): void;
    _renderLabels(): void;
    _renderSelection(): void;
    _renderTimeAxis(): void;
    _renderCrosshair(): void;
    _renderRowSelection(): void;
    _windowOpen(baseURL: any, from: any, to: any, paramKey: any, paramValue: any, newTab: any): void;
}
export { DiscretePanelCtrl as PanelCtrl };
