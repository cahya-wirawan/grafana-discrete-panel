/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import { MetricsPanelCtrl } from 'app/plugins/sdk';
export declare class CanvasPanelCtrl extends MetricsPanelCtrl {
    data: any;
    mouse: any;
    $tooltip: any;
    wrap: any;
    wrap_parent: any;
    rowsel: any;
    rowselWidth: any;
    canvas: any;
    context: any;
    table_select: any;
    _devicePixelRatio: number;
    constructor($scope: any, $injector: any);
    onPanelInitalized(): void;
    onRefresh(): void;
    onRender(): void;
    clearTT(): void;
    getMousePosition(evt: any): {
        x: any;
        y: number;
        yRel: number;
        ts: any;
        evt: any;
    };
    onGraphHover(evt: any, showTT: any, isExternal: any): void;
    onMouseClicked(where: any): void;
    onMouseSelectedRange(range: any): void;
    link(scope: any, elem: any, attrs: any, ctrl: any): void;
}
