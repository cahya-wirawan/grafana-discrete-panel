///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register(['./canvas-metric', './distinct-points', 'lodash', 'jquery', 'moment', 'app/core/utils/kbn', 'app/core/app_events'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var canvas_metric_1, distinct_points_1, lodash_1, jquery_1, moment_1, kbn_1, app_events_1;
    var grafanaColors, DiscretePanelCtrl;
    return {
        setters:[
            function (canvas_metric_1_1) {
                canvas_metric_1 = canvas_metric_1_1;
            },
            function (distinct_points_1_1) {
                distinct_points_1 = distinct_points_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (app_events_1_1) {
                app_events_1 = app_events_1_1;
            }],
        execute: function() {
            grafanaColors = [
                '#7EB26D',
                '#EAB839',
                '#6ED0E0',
                '#EF843C',
                '#E24D42',
                '#1F78C1',
                '#BA43A9',
                '#705DA0',
                '#508642',
                '#CCA300',
                '#447EBC',
                '#C15C17',
                '#890F02',
                '#0A437C',
                '#6D1F62',
                '#584477',
                '#B7DBAB',
                '#F4D598',
                '#70DBED',
                '#F9BA8F',
                '#F29191',
                '#82B5D8',
                '#E5A8E2',
                '#AEA2E0',
                '#629E51',
                '#E5AC0E',
                '#64B0C8',
                '#E0752D',
                '#BF1B00',
                '#0A50A1',
                '#962D82',
                '#614D93',
                '#9AC48A',
                '#F2C96D',
                '#65C5DB',
                '#F9934E',
                '#EA6460',
                '#5195CE',
                '#D683CE',
                '#806EB7',
                '#3F6833',
                '#967302',
                '#2F575E',
                '#99440A',
                '#58140C',
                '#052B51',
                '#511749',
                '#3F2B5B',
                '#E0F9D7',
                '#FCEACA',
                '#CFFAFF',
                '#F9E2D2',
                '#FCE2DE',
                '#BADFF4',
                '#F9D9F9',
                '#DEDAF7',
            ]; // copied from public/app/core/utils/colors.ts because of changes in grafana 4.6.0
            //(https://github.com/grafana/grafana/blob/master/PLUGIN_DEV.md)
            DiscretePanelCtrl = (function (_super) {
                __extends(DiscretePanelCtrl, _super);
                function DiscretePanelCtrl($scope, $injector) {
                    _super.call(this, $scope, $injector);
                    this.defaults = {
                        display: 'timeline',
                        rowHeight: 20,
                        valueMaps: [{ value: 'null', op: '=', text: 'N/A' }],
                        rangeMaps: [{ from: 'null', to: 'null', text: 'N/A' }],
                        colorMaps: [{ text: 'N/A', color: '#CCC' }],
                        metricNameColor: '#000000',
                        valueTextColor: '#000000',
                        timeTextColor: '#d8d9da',
                        crosshairColor: '#8F070C',
                        backgroundColor: 'rgba(128,128,128,0.1)',
                        lineColor: 'rgba(0,0,0,0.1)',
                        textSize: 12,
                        textSizeTime: 12,
                        extendLastValue: true,
                        writeLastValue: true,
                        writeAllValues: false,
                        writeValuesOnHover: false,
                        writeMetricNames: false,
                        writeMetricNamesRight: false,
                        showTimeAxis: true,
                        showLegend: true,
                        showLegendNames: true,
                        showLegendValues: true,
                        showLegendPercent: true,
                        showLegendExtended: false,
                        highlightOnMouseover: true,
                        expandFromQueryS: 0,
                        legendSortBy: '-ms',
                        units: 'short',
                        rowSelectorType: 'text',
                        rowSelectorURL: '',
                        rowSelectorURLParam: '',
                        rowSelectorNewTab: true,
                        rowSelectorWidth: 80,
                        rowParsingCodeType: 'none',
                        onMouseClickZoom: false,
                        onMouseClickShortRange: true,
                    };
                    this.data = null;
                    this.externalPT = false;
                    this.isTimeline = true;
                    this.isStacked = false;
                    this.hoverPoint = null;
                    this.colorMap = {};
                    this._colorsPaleteCash = null;
                    this.unitFormats = null; // only used for editor
                    this.formatter = null;
                    this._renderDimensions = {};
                    this._selectionMatrix = [];
                    this.rowselWidth = 0;
                    this.parsingCodes = {
                        channel: [
                            'Invalid packet length',
                            'End of data frame reached',
                            'Time stamp specifies future time',
                            'Invalid number of samples',
                            'Invalid authentication switch',
                            'Invalid compression switch',
                            'Trailing bytes in DFF subframe',
                            'Invalid calibration period',
                            'Invalid authentication offset',
                            'Invalid option switch',
                            'Invalid status size',
                            'Invalid channel data size',
                            'Steim compression not supported',
                            'Channel not signed',
                            'Invalid channel signature',
                            'No certificate found for channel',
                            'Invalid Candian compressed data',
                            'Unsupported data type',
                            'Unexpected signature verification error',
                            'Invalid channel time stamp',
                            'Invalid calibration factor',
                            'Channel start time not within one sample',
                            'Invalid site or channel name',
                        ],
                        frame: [
                            'Internal error',
                            'Invalid channel(s) in frame',
                            'Invalid data frame size',
                            'Nominal time specifies future time',
                            'Invalid description size',
                            'Invalid max. DF size',
                            'Invalid channel number',
                            'Invalid DFF frame size',
                            'Invalid CRC',
                            'Frame has channel warning(s)',
                            'Invalid frame size',
                            'Frame too large',
                            'Protocol violation',
                            'Frame not signed',
                            'Invalid signature',
                            'No certificate found',
                            'Unsupported frame type (yet)',
                            'No certificates loaded',
                            'Channel authentication failed',
                            'Unknown frame type',
                            'Frame not (complete) parsed',
                            'Invalid alert type',
                            'Invalid station name',
                            'Invalid command size',
                            'Frame has channel error(s)',
                            'Station is not allowed to send commands',
                            'Invalid channel string size',
                            'Invalid frame time length',
                            'Command frame too old',
                        ],
                        qualityflags: [
                            'Constant data detected',
                            'No input from sensor detected',
                            'Data not checked',
                            'Data arrived too late',
                            'Data authentication failed',
                            'Data not authenticated',
                            'No cert for data found',
                            'Data not signed',
                            'Frame authentication failed',
                            'Frame not authenticated',
                            'No cert for frame found',
                            'Frame not signed',
                        ],
                        cq_frame: [
                            'Constant data detected',
                            'No input from sensor detected',
                            'Data not checked',
                            'Data arrived too late',
                            'Data authentication failed',
                            'Data not authenticated',
                            'No cert for data found',
                            'Data not signed',
                            'Frame authentication failed',
                            'Frame not authenticated',
                            'No cert for frame found',
                            'Frame not signed',
                        ],
                        cq_channel: [
                            'Constant data detected',
                            'No input from sensor detected',
                            'Data not checked',
                            'Data arrived too late',
                            'Data authentication failed',
                            'Data not authenticated',
                            'No cert for data found',
                            'Data not signed',
                            'Frame authentication failed',
                            'Frame not authenticated',
                            'No cert for frame found',
                            'Frame not signed',
                        ],
                    };
                    // defaults configs
                    lodash_1.default.defaultsDeep(this.panel, this.defaults);
                    this.panel.display = 'timeline'; // Only supported version now
                    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
                    this.events.on('render', this.onRender.bind(this));
                    this.events.on('data-received', this.onDataReceived.bind(this));
                    this.events.on('panel-initialized', this.onPanelInitialized.bind(this));
                    this.events.on('data-error', this.onDataError.bind(this));
                    this.events.on('refresh', this.onRefresh.bind(this));
                }
                DiscretePanelCtrl.prototype.onPanelInitialized = function () {
                    this.updateColorInfo();
                    this.onConfigChanged();
                };
                DiscretePanelCtrl.prototype.onDataError = function (err) {
                    console.log('onDataError', err);
                };
                DiscretePanelCtrl.prototype.onInitEditMode = function () {
                    /** @namespace kbn.getUnitFormats **/
                    this.unitFormats = kbn_1.default.getUnitFormats();
                    this.addEditorTab('Options', 'public/plugins/ctbto-discrete-panel/partials/editor.options.html', 1);
                    this.addEditorTab('Legend', 'public/plugins/ctbto-discrete-panel/partials/editor.legend.html', 3);
                    this.addEditorTab('Colors', 'public/plugins/ctbto-discrete-panel/partials/editor.colors.html', 4);
                    this.addEditorTab('Mappings', 'public/plugins/ctbto-discrete-panel/partials/editor.mappings.html', 5);
                    this.editorTabIndex = 1;
                    this.refresh();
                };
                DiscretePanelCtrl.prototype.onRender = function () {
                    if (this.data == null || !this.context) {
                        return;
                    }
                    this._updateRenderDimensions();
                    this._updateSelectionMatrix();
                    this._updateCanvasSize();
                    this._renderRects();
                    this._renderTimeAxis();
                    this._renderLabels();
                    this._renderSelection();
                    this._renderCrosshair();
                    this._renderRowSelection();
                };
                DiscretePanelCtrl.prototype.showLegandTooltip = function (pos, info) {
                    var body = '<div class="graph-tooltip-time">' + info.val + '</div>';
                    body += '<center>';
                    if (info.count > 1) {
                        body += info.count + ' times<br/>for<br/>';
                    }
                    body += moment_1.default.duration(info.ms).humanize();
                    if (info.count > 1) {
                        body += '<br/>total';
                    }
                    body += '</center>';
                    this.$tooltip.html(body).place_tt(pos.pageX + 20, pos.pageY);
                };
                DiscretePanelCtrl.prototype.clearTT = function () {
                    this.$tooltip.detach();
                };
                DiscretePanelCtrl.prototype.formatValue = function (val) {
                    if (lodash_1.default.isNumber(val)) {
                        if (this.panel.rangeMaps) {
                            for (var i = 0; i < this.panel.rangeMaps.length; i++) {
                                var map = this.panel.rangeMaps[i];
                                // value/number to range mapping
                                var from = parseFloat(map.from);
                                var to = parseFloat(map.to);
                                if (to >= val && from <= val) {
                                    return map.text;
                                }
                            }
                        }
                        if (this.formatter) {
                            return this.formatter(val, this.panel.decimals);
                        }
                    }
                    var isNull = lodash_1.default.isNil(val);
                    if (!isNull && !lodash_1.default.isString(val)) {
                        val = val.toString(); // convert everything to a string
                    }
                    for (var i = 0; i < this.panel.valueMaps.length; i++) {
                        var map = this.panel.valueMaps[i];
                        // special null case
                        if (map.value === 'null') {
                            if (isNull) {
                                return map.text;
                            }
                            continue;
                        }
                        if (val === map.value) {
                            return map.text;
                        }
                    }
                    if (isNull) {
                        return 'null';
                    }
                    return val;
                };
                DiscretePanelCtrl.prototype.getColor = function (val) {
                    var hexCode = 0;
                    if (val != "N/A")
                        switch (this.panel.rowParsingCodeType) {
                            case 'frame':
                                hexCode = parseInt(val, 16);
                                if ((hexCode & 0x2000) != 0)
                                    val = '0x2';
                                else if ((hexCode & 0x6e000) != 0)
                                    val = '0x1';
                                else
                                    val = '0x0';
                                break;
                            case 'channel':
                                hexCode = parseInt(val, 16);
                                if ((hexCode & 0x2000) != 0)
                                    val = '0x2';
                                else if ((hexCode & 0x4e110) != 0)
                                    val = '0x1';
                                else
                                    val = '0x0';
                                break;
                            case 'qualityflags':
                            case 'cq_frame':
                            case 'cq_channel':
                                hexCode = parseInt(val, 16);
                                if ((hexCode & 0x880) != 0)
                                    val = '0x2';
                                else if ((hexCode & 0xff0) != 0)
                                    val = '0x1';
                                else
                                    val = '0x0';
                                break;
                        }
                    if (lodash_1.default.has(this.colorMap, val)) {
                        return this.colorMap[val];
                    }
                    if (this._colorsPaleteCash[val] === undefined) {
                        var c = grafanaColors[this._colorsPaleteCash.length % grafanaColors.length];
                        this._colorsPaleteCash[val] = c;
                        this._colorsPaleteCash.length++;
                    }
                    return this._colorsPaleteCash[val];
                };
                DiscretePanelCtrl.prototype.randomColor = function () {
                    var letters = 'ABCDE'.split('');
                    var color = '#';
                    for (var i = 0; i < 3; i++) {
                        color += letters[Math.floor(Math.random() * letters.length)];
                    }
                    return color;
                };
                // Override the
                DiscretePanelCtrl.prototype.applyPanelTimeOverrides = function () {
                    _super.prototype.applyPanelTimeOverrides.call(this);
                    if (this.panel.expandFromQueryS && this.panel.expandFromQueryS > 0) {
                        var from = this.range.from.subtract(this.panel.expandFromQueryS, 's');
                        this.range.from = from;
                        this.range.raw.from = from;
                    }
                };
                DiscretePanelCtrl.prototype.onDataReceived = function (dataList) {
                    var _this = this;
                    jquery_1.default(this.canvas).css('cursor', 'pointer');
                    //    console.log('GOT', dataList);
                    var data = [];
                    lodash_1.default.forEach(dataList, function (metric) {
                        if ('table' === metric.type) {
                            if ('time' !== metric.columns[0].type) {
                                throw new Error('Expected a time column from the table format');
                            }
                            var last = null;
                            for (var i = 1; i < metric.columns.length; i++) {
                                var res = new distinct_points_1.DistinctPoints(metric.columns[i].text);
                                for (var j = 0; j < metric.rows.length; j++) {
                                    var row = metric.rows[j];
                                    res.add(row[0], _this.formatValue(row[i]));
                                }
                                res.finish(_this);
                                data.push(res);
                            }
                        }
                        else {
                            var res = new distinct_points_1.DistinctPoints(metric.target);
                            lodash_1.default.forEach(metric.datapoints, function (point) {
                                if (point[0] != null)
                                    switch (_this.panel.rowParsingCodeType) {
                                        case 'frame':
                                            point[0] = point[0] & 0x6e000;
                                            break;
                                        case 'channel':
                                            point[0] = point[0] & 0x4e110;
                                            break;
                                        case 'qualityflags':
                                            point[0] = point[0] & 0xff0;
                                            break;
                                        case 'cq_frame':
                                            point[0] = point[0] & 0xf00;
                                            break;
                                        case 'cq_channel':
                                            point[0] = point[0] & 0x0f0;
                                            break;
                                        case 'cq_all':
                                            point[0] = point[0] & 0xff0;
                                            break;
                                    }
                                res.add(point[1], _this.formatValue(point[0]));
                            });
                            res.finish(_this);
                            data.push(res);
                        }
                    });
                    this.data = data;
                    this.onRender();
                    //console.log( 'data', dataList, this.data);
                };
                DiscretePanelCtrl.prototype.removeColorMap = function (map) {
                    var index = lodash_1.default.indexOf(this.panel.colorMaps, map);
                    this.panel.colorMaps.splice(index, 1);
                    this.updateColorInfo();
                };
                DiscretePanelCtrl.prototype.updateColorInfo = function () {
                    var cm = {};
                    for (var i = 0; i < this.panel.colorMaps.length; i++) {
                        var m = this.panel.colorMaps[i];
                        if (m.text) {
                            cm[m.text] = m.color;
                        }
                    }
                    this._colorsPaleteCash = {};
                    this._colorsPaleteCash.length = 0;
                    this.colorMap = cm;
                    this.render();
                };
                DiscretePanelCtrl.prototype.addColorMap = function (what) {
                    var _this = this;
                    if (what === 'curent') {
                        lodash_1.default.forEach(this.data, function (metric) {
                            if (metric.legendInfo) {
                                lodash_1.default.forEach(metric.legendInfo, function (info) {
                                    if (!lodash_1.default.has(_this.colorMap, info.val)) {
                                        var v = { text: info.val, color: _this.getColor(info.val) };
                                        _this.panel.colorMaps.push(v);
                                        _this.colorMap[info.val] = v;
                                    }
                                });
                            }
                        });
                    }
                    else {
                        this.panel.colorMaps.push({ text: '???', color: this.randomColor() });
                    }
                    this.updateColorInfo();
                };
                DiscretePanelCtrl.prototype.removeValueMap = function (map) {
                    var index = lodash_1.default.indexOf(this.panel.valueMaps, map);
                    this.panel.valueMaps.splice(index, 1);
                    this.render();
                };
                DiscretePanelCtrl.prototype.addValueMap = function () {
                    this.panel.valueMaps.push({ value: '', op: '=', text: '' });
                };
                DiscretePanelCtrl.prototype.removeRangeMap = function (rangeMap) {
                    var index = lodash_1.default.indexOf(this.panel.rangeMaps, rangeMap);
                    this.panel.rangeMaps.splice(index, 1);
                    this.render();
                };
                DiscretePanelCtrl.prototype.addRangeMap = function () {
                    this.panel.rangeMaps.push({ from: '', to: '', text: '' });
                };
                DiscretePanelCtrl.prototype.onConfigChanged = function (update) {
                    if (update === void 0) { update = false; }
                    this.isTimeline = this.panel.display === 'timeline';
                    this.isStacked = this.panel.display === 'stacked';
                    this.formatter = null;
                    if (this.panel.units && 'none' !== this.panel.units) {
                        /** @namespace kbn.valueFormats **/
                        this.formatter = kbn_1.default.valueFormats[this.panel.units];
                    }
                    if (update) {
                        this.refresh();
                    }
                    else {
                        this.render();
                    }
                };
                DiscretePanelCtrl.prototype.decodeParsingCode = function (code) {
                    var decodedString = [];
                    if (this.panel.rowParsingCodeType != 'none') {
                        var parsingCode = this.parsingCodes[this.panel.rowParsingCodeType];
                        var bitPosition = 1;
                        var hexCode = parseInt(code, 16);
                        if (hexCode == 0) {
                            decodedString.push('Ok');
                            return decodedString;
                        }
                        else if (isNaN(hexCode)) {
                            decodedString.push('N/A');
                            return decodedString;
                        }
                        for (var i = 0; i < parsingCode.length; i++) {
                            var parsedCode = hexCode & (bitPosition << i);
                            if (parsedCode != 0) {
                                decodedString.push(parsingCode[i]);
                            }
                        }
                    }
                    return decodedString;
                };
                DiscretePanelCtrl.prototype.getLegendDisplay = function (info, metric) {
                    var disp = '';
                    if (this.panel.rowParsingCodeType != 'none')
                        disp = this.decodeParsingCode(info.val).join(', ');
                    else
                        disp = info.val;
                    if (this.panel.showLegendPercent ||
                        this.panel.showLegendCounts ||
                        this.panel.showLegendTime) {
                        disp += ' (';
                        var hassomething = false;
                        if (this.panel.showLegendTime) {
                            disp += moment_1.default.duration(info.ms).humanize();
                            hassomething = true;
                        }
                        if (this.panel.showLegendPercent) {
                            if (hassomething) {
                                disp += ', ';
                            }
                            var dec = this.panel.legendPercentDecimals;
                            if (lodash_1.default.isNil(dec)) {
                                if (info.per > 0.98 && metric.changes.length > 1) {
                                    dec = 2;
                                }
                                else if (info.per < 0.02) {
                                    dec = 2;
                                }
                                else {
                                    dec = 0;
                                }
                            }
                            /** @namespace kbn.valueFormats.percentunit **/
                            disp += kbn_1.default.valueFormats.percentunit(info.per, dec);
                            hassomething = true;
                        }
                        if (this.panel.showLegendCounts) {
                            if (hassomething) {
                                disp += ', ';
                            }
                            disp += info.count + 'x';
                        }
                        disp += ')';
                    }
                    return disp;
                };
                //------------------
                // Mouse Events
                //------------------
                DiscretePanelCtrl.prototype.showTooltip = function (evt, point, isExternal) {
                    var from = point.start;
                    var to = point.start + point.ms;
                    var time = point.ms;
                    var val = point.val;
                    var name = point.name;
                    if (this.mouse.down != null) {
                        from = Math.min(this.mouse.down.ts, this.mouse.position.ts);
                        to = Math.max(this.mouse.down.ts, this.mouse.position.ts);
                        time = to - from;
                        val = 'Zoom To:';
                    }
                    var decodedString = this.decodeParsingCode(val);
                    var body = '<div class="graph-tooltip-time">' + name + ': ' + val + '</div>';
                    body += '<center>';
                    if (this.panel.rowParsingCodeType != 'none') {
                        for (var i = 0; i < decodedString.length; i++) {
                            body += decodedString[i] + '<br/>';
                        }
                        body += '<br/>';
                    }
                    body += this.dashboard.formatDate(moment_1.default(from)) + '<br/>';
                    body += 'to<br/>';
                    body += this.dashboard.formatDate(moment_1.default(to)) + '<br/><br/>';
                    body += moment_1.default.duration(time).humanize() + '<br/>';
                    body += '</center>';
                    var pageX = 0;
                    var pageY = 0;
                    if (isExternal) {
                        var rect = this.canvas.getBoundingClientRect();
                        pageY = rect.top + evt.pos.panelRelY * rect.height;
                        if (pageY < 0 || pageY > jquery_1.default(window).innerHeight()) {
                            // Skip Hidden tooltip
                            this.$tooltip.detach();
                            return;
                        }
                        pageY += jquery_1.default(window).scrollTop();
                        var elapsed = this.range.to - this.range.from;
                        var pX = (evt.pos.x - this.range.from) / elapsed;
                        pageX = rect.left + pX * rect.width;
                    }
                    else {
                        pageX = evt.evt.pageX;
                        pageY = evt.evt.pageY;
                    }
                    this.$tooltip.html(body).place_tt(pageX + 20, pageY + 5);
                };
                DiscretePanelCtrl.prototype.onGraphHover = function (evt, showTT, isExternal) {
                    this.externalPT = false;
                    if (this.data && this.data.length) {
                        var hover = null;
                        var j = Math.floor(this.mouse.position.y / this.panel.rowHeight);
                        if (j < 0) {
                            j = 0;
                        }
                        if (j >= this.data.length) {
                            j = this.data.length - 1;
                        }
                        if (this.isTimeline) {
                            hover = this.data[j].changes[0];
                            for (var i = 0; i < this.data[j].changes.length; i++) {
                                if (this.data[j].changes[i].start > this.mouse.position.ts) {
                                    break;
                                }
                                hover = this.data[j].changes[i];
                            }
                            hover['name'] = this.data[j].name;
                            this.hoverPoint = hover;
                            if (showTT) {
                                this.externalPT = isExternal;
                                this.showTooltip(evt, hover, isExternal);
                            }
                            this.onRender(); // refresh the view
                        }
                        else if (!isExternal) {
                            if (this.isStacked) {
                                hover = this.data[j].legendInfo[0];
                                for (var i = 0; i < this.data[j].legendInfo.length; i++) {
                                    if (this.data[j].legendInfo[i].x > this.mouse.position.x) {
                                        break;
                                    }
                                    hover = this.data[j].legendInfo[i];
                                }
                                this.hoverPoint = hover;
                                this.onRender(); // refresh the view
                                if (showTT) {
                                    this.externalPT = isExternal;
                                    this.showLegandTooltip(evt.evt, hover);
                                }
                            }
                        }
                    }
                    else {
                        this.$tooltip.detach(); // make sure it is hidden
                    }
                };
                DiscretePanelCtrl.prototype.onMouseClicked = function (where) {
                    var pt = this.hoverPoint;
                    if (this.panel.onMouseClickZoom) {
                        if (pt && pt.start) {
                            var range = { from: moment_1.default.utc(pt.start), to: moment_1.default.utc(pt.start + pt.ms) };
                            this.timeSrv.setTime(range);
                            this.clear();
                        }
                    }
                    else {
                        var from;
                        var to;
                        if (this.panel.onMouseClickShortRange) {
                            from = moment_1.default.utc(pt.start);
                            to = moment_1.default.utc(pt.start + pt.ms);
                        }
                        else {
                            from = this.range.from;
                            to = this.range.to;
                        }
                        this._windowOpen(this.panel.rowSelectorURL, from, to, this.panel.rowSelectorURLParam, pt.name, this.panel.rowSelectorNewTab);
                    }
                };
                DiscretePanelCtrl.prototype.onMouseSelectedRange = function (range) {
                    this.timeSrv.setTime(range);
                    this.clear();
                };
                DiscretePanelCtrl.prototype.clear = function () {
                    this.mouse.position = null;
                    this.mouse.down = null;
                    this.hoverPoint = null;
                    jquery_1.default(this.canvas).css('cursor', 'wait');
                    /** @namespace appEvents.emit **/
                    app_events_1.default.emit('graph-hover-clear');
                    this.render();
                };
                DiscretePanelCtrl.prototype._updateRenderDimensions = function () {
                    var _this = this;
                    this._renderDimensions = {};
                    var rect = (this._renderDimensions.rect = this.wrap_parent.getBoundingClientRect());
                    var rows = (this._renderDimensions.rows = this.data.length);
                    var rowHeight = (this._renderDimensions.rowHeight = this.panel.rowHeight);
                    var rowsHeight = (this._renderDimensions.rowsHeight = rowHeight * rows);
                    switch (this.panel.rowSelectorType) {
                        case 'button':
                            this.rowselWidth = Math.max(Math.min(this.panel.rowHeight + 4, 60), 20);
                            break;
                        case 'text':
                            this.rowselWidth = this.panel.rowSelectorWidth;
                            break;
                        case 'hidden':
                            this.rowselWidth = 0;
                            break;
                    }
                    var timeHeight = this.panel.showTimeAxis ? 14 + this.panel.textSizeTime : 0;
                    var height = (this._renderDimensions.height = rowsHeight + timeHeight);
                    var width = (this._renderDimensions.width = rect.width - this.rowselWidth);
                    var top = 0;
                    var elapsed = this.range.to - this.range.from;
                    this._renderDimensions.matrix = [];
                    lodash_1.default.forEach(this.data, function (metric) {
                        var positions = [];
                        if (_this.isTimeline) {
                            var lastBS = 0;
                            var point = metric.changes[0];
                            for (var i = 0; i < metric.changes.length; i++) {
                                point = metric.changes[i];
                                if (point.start <= _this.range.to) {
                                    var xt = Math.max(point.start - _this.range.from, 0);
                                    var x = xt / elapsed * width;
                                    positions.push(x);
                                }
                            }
                        }
                        if (_this.isStacked) {
                            var point = null;
                            var start = _this.range.from;
                            for (var i = 0; i < metric.legendInfo.length; i++) {
                                point = metric.legendInfo[i];
                                var xt = Math.max(start - _this.range.from, 0);
                                var x = xt / elapsed * width;
                                positions.push(x);
                                start += point.ms;
                            }
                        }
                        _this._renderDimensions.matrix.push({
                            y: top,
                            positions: positions,
                        });
                        top += rowHeight;
                    });
                };
                DiscretePanelCtrl.prototype._updateSelectionMatrix = function () {
                    var selectionPredicates = {
                        all: function () {
                            return true;
                        },
                        crosshairHover: function (i, j) {
                            if (j + 1 === this.data[i].changes.length) {
                                return this.data[i].changes[j].start <= this.mouse.position.ts;
                            }
                            return (this.data[i].changes[j].start <= this.mouse.position.ts &&
                                this.mouse.position.ts < this.data[i].changes[j + 1].start);
                        },
                        mouseX: function (i, j) {
                            var row = this._renderDimensions.matrix[i];
                            if (j + 1 === row.positions.length) {
                                return row.positions[j] <= this.mouse.position.x;
                            }
                            return (row.positions[j] <= this.mouse.position.x &&
                                this.mouse.position.x < row.positions[j + 1]);
                        },
                        metric: function (i) {
                            return this.data[i] === this._selectedMetric;
                        },
                        legendItem: function (i, j) {
                            if (this.data[i] !== this._selectedMetric) {
                                return false;
                            }
                            return this._selectedLegendItem.val === this._getVal(i, j);
                        },
                    };
                    function getPredicate() {
                        if (this._selectedLegendItem !== undefined) {
                            return 'legendItem';
                        }
                        if (this._selectedMetric !== undefined) {
                            return 'metric';
                        }
                        if (this.mouse.down !== null) {
                            return 'all';
                        }
                        if (this.panel.highlightOnMouseover && this.mouse.position != null) {
                            if (this.isTimeline) {
                                return 'crosshairHover';
                            }
                            if (this.isStacked) {
                                return 'mouseX';
                            }
                        }
                        return 'all';
                    }
                    var pn = getPredicate.bind(this)();
                    var predicate = selectionPredicates[pn].bind(this);
                    this._selectionMatrix = [];
                    for (var i = 0; i < this._renderDimensions.matrix.length; i++) {
                        var rs = [];
                        var r = this._renderDimensions.matrix[i];
                        for (var j = 0; j < r.positions.length; j++) {
                            rs.push(predicate(i, j));
                        }
                        this._selectionMatrix.push(rs);
                    }
                };
                DiscretePanelCtrl.prototype._updateCanvasSize = function () {
                    this.canvas.width = this._renderDimensions.width * this._devicePixelRatio;
                    this.canvas.height = this._renderDimensions.height * this._devicePixelRatio;
                    jquery_1.default(this.canvas).css('width', this._renderDimensions.width + 'px');
                    jquery_1.default(this.canvas).css('height', this._renderDimensions.height + 'px');
                    this.context.scale(this._devicePixelRatio, this._devicePixelRatio);
                };
                DiscretePanelCtrl.prototype._getVal = function (metricIndex, rectIndex) {
                    var point = undefined;
                    if (this.isTimeline) {
                        point = this.data[metricIndex].changes[rectIndex];
                    }
                    if (this.isStacked) {
                        point = this.data[metricIndex].legendInfo[rectIndex];
                    }
                    return point.val;
                };
                DiscretePanelCtrl.prototype._renderRects = function () {
                    var _this = this;
                    var matrix = this._renderDimensions.matrix;
                    var ctx = this.context;
                    lodash_1.default.forEach(this.data, function (metric, i) {
                        var rowObj = matrix[i];
                        for (var j = 0; j < rowObj.positions.length; j++) {
                            var currentX = rowObj.positions[j];
                            var nextX = _this._renderDimensions.width;
                            if (j + 1 !== rowObj.positions.length) {
                                nextX = rowObj.positions[j + 1];
                            }
                            ctx.fillStyle = _this.getColor(_this._getVal(i, j));
                            var globalAlphaTemp = ctx.globalAlpha;
                            if (!_this._selectionMatrix[i][j]) {
                                ctx.globalAlpha = 0.3;
                            }
                            ctx.fillRect(currentX, matrix[i].y, nextX - currentX, _this._renderDimensions.rowHeight);
                            ctx.globalAlpha = globalAlphaTemp;
                        }
                        if (i > 0) {
                            var top_1 = matrix[i].y;
                            ctx.strokeStyle = _this.panel.lineColor;
                            ctx.beginPath();
                            ctx.moveTo(0, top_1);
                            ctx.lineTo(_this._renderDimensions.width, top_1);
                            ctx.stroke();
                        }
                    });
                };
                DiscretePanelCtrl.prototype._renderLabels = function () {
                    var _this = this;
                    var ctx = this.context;
                    ctx.lineWidth = 1;
                    ctx.textBaseline = 'middle';
                    ctx.font = this.panel.textSize + 'px "Open Sans", Helvetica, Arial, sans-serif';
                    var offset = 2;
                    var rowHeight = this._renderDimensions.rowHeight;
                    lodash_1.default.forEach(this.data, function (metric, i) {
                        var _a = _this._renderDimensions.matrix[i], y = _a.y, positions = _a.positions;
                        var centerY = y + rowHeight / 2;
                        // let labelPositionMetricName = y + rectHeight - this.panel.textSize / 2;
                        // let labelPositionLastValue = y + rectHeight - this.panel.textSize / 2;
                        // let labelPositionValue = y + this.panel.textSize / 2;
                        var labelPositionMetricName = centerY;
                        var labelPositionLastValue = centerY;
                        var labelPositionValue = centerY;
                        var hoverTextStart = -1;
                        var hoverTextEnd = -1;
                        if (_this.mouse.position && _this.panel.writeValuesOnHover) {
                            for (var j = 0; j < positions.length; j++) {
                                if (positions[j] <= _this.mouse.position.x) {
                                    if (j >= positions.length - 1 || positions[j + 1] >= _this.mouse.position.x) {
                                        var val = _this._getVal(i, j);
                                        ctx.fillStyle = _this.panel.valueTextColor;
                                        ctx.textAlign = 'left';
                                        hoverTextStart = positions[j] + offset;
                                        ctx.fillText(val, hoverTextStart, labelPositionValue);
                                        var txtinfo = ctx.measureText(val);
                                        hoverTextEnd = hoverTextStart + txtinfo.width + 4;
                                        break;
                                    }
                                }
                            }
                        }
                        var minTextSpot = 0;
                        var maxTextSpot = _this._renderDimensions.width;
                        if (_this.panel.writeMetricNames) {
                            if (_this.panel.writeMetricNamesRight) {
                                ctx.fillStyle = _this.panel.metricNameColor;
                                ctx.textAlign = 'right';
                                var txtinfo = ctx.measureText(metric.name);
                                if (hoverTextStart < 0 || hoverTextStart > txtinfo.width) {
                                    ctx.fillText(metric.name, _this._renderDimensions.width - offset, labelPositionMetricName);
                                    maxTextSpot = _this._renderDimensions.width - txtinfo.width - 10;
                                }
                            }
                            else {
                                ctx.fillStyle = _this.panel.metricNameColor;
                                ctx.textAlign = 'left';
                                var txtinfo = ctx.measureText(metric.name);
                                if (hoverTextStart < 0 || hoverTextStart > txtinfo.width) {
                                    ctx.fillText(metric.name, offset, labelPositionMetricName);
                                    minTextSpot = offset + ctx.measureText(metric.name).width + 2;
                                }
                            }
                        }
                        if (_this.panel.writeLastValue && !_this.panel.writeMetricNamesRight) {
                            var val = _this._getVal(i, positions.length - 1);
                            ctx.fillStyle = _this.panel.valueTextColor;
                            ctx.textAlign = 'right';
                            var txtinfo = ctx.measureText(val);
                            var xval = _this._renderDimensions.width - offset - txtinfo.width;
                            if (xval > hoverTextEnd) {
                                ctx.fillText(val, _this._renderDimensions.width - offset, labelPositionLastValue);
                                maxTextSpot = _this._renderDimensions.width - ctx.measureText(val).width - 10;
                            }
                        }
                        if (_this.panel.writeAllValues) {
                            ctx.fillStyle = _this.panel.valueTextColor;
                            ctx.textAlign = 'left';
                            for (var j = 0; j < positions.length; j++) {
                                var val = _this._getVal(i, j);
                                var nextX = _this._renderDimensions.width;
                                if (j + 1 !== positions.length) {
                                    nextX = positions[j + 1];
                                }
                                var x = positions[j];
                                if (x > minTextSpot) {
                                    var width = nextX - x;
                                    if (maxTextSpot > x + width) {
                                        // This clips the text within the given bounds
                                        ctx.save();
                                        ctx.rect(x, y, width, rowHeight);
                                        ctx.clip();
                                        ctx.fillText(val, x + offset, labelPositionValue);
                                        ctx.restore();
                                    }
                                }
                            }
                        }
                    });
                };
                DiscretePanelCtrl.prototype._renderSelection = function () {
                    if (this.mouse.down === null) {
                        return;
                    }
                    if (this.mouse.position === null) {
                        return;
                    }
                    if (!this.isTimeline) {
                        return;
                    }
                    var ctx = this.context;
                    var height = this._renderDimensions.height;
                    var xmin = Math.min(this.mouse.position.x, this.mouse.down.x);
                    var xmax = Math.max(this.mouse.position.x, this.mouse.down.x);
                    ctx.fillStyle = 'rgba(110, 110, 110, 0.5)';
                    ctx.strokeStyle = 'rgba(110, 110, 110, 0.5)';
                    ctx.beginPath();
                    ctx.fillRect(xmin, 0, xmax - xmin, height);
                    ctx.strokeRect(xmin, 0, xmax - xmin, height);
                };
                DiscretePanelCtrl.prototype._renderTimeAxis = function () {
                    if (!this.panel.showTimeAxis) {
                        return;
                    }
                    var ctx = this.context;
                    var rows = this.data.length;
                    var rowHeight = this.panel.rowHeight;
                    var height = this._renderDimensions.height;
                    var width = this._renderDimensions.width;
                    var top = this._renderDimensions.rowsHeight;
                    var headerColumnIndent = 0; // header inset (zero for now)
                    ctx.font = this.panel.textSizeTime + 'px "Open Sans", Helvetica, Arial, sans-serif';
                    ctx.fillStyle = this.panel.timeTextColor;
                    ctx.textAlign = 'left';
                    ctx.strokeStyle = this.panel.timeTextColor;
                    ctx.textBaseline = 'top';
                    ctx.setLineDash([7, 5]); // dashes are 5px and spaces are 3px
                    ctx.lineDashOffset = 0;
                    var min = lodash_1.default.isUndefined(this.range.from) ? null : this.range.from.valueOf();
                    var max = lodash_1.default.isUndefined(this.range.to) ? null : this.range.to.valueOf();
                    var minPxInterval = ctx.measureText('12/33 24:59').width * 2;
                    var estNumTicks = width / minPxInterval;
                    var estTimeInterval = (max - min) / estNumTicks;
                    var timeResolution = this.getTimeResolution(estTimeInterval);
                    var pixelStep = timeResolution / (max - min) * width;
                    var nextPointInTime = this.roundDate(min, timeResolution) + timeResolution;
                    var xPos = headerColumnIndent + (nextPointInTime - min) / (max - min) * width;
                    var timeFormat = this.time_format(max - min, timeResolution / 1000);
                    while (nextPointInTime < max) {
                        // draw ticks
                        ctx.beginPath();
                        ctx.moveTo(xPos, top + 5);
                        ctx.lineTo(xPos, 0);
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        // draw time label
                        var date = new Date(nextPointInTime);
                        var dateStr = this.formatDate(date, timeFormat);
                        var xOffset = ctx.measureText(dateStr).width / 2;
                        ctx.fillText(dateStr, xPos - xOffset, top + 10);
                        nextPointInTime += timeResolution;
                        xPos += pixelStep;
                    }
                };
                DiscretePanelCtrl.prototype._renderCrosshair = function () {
                    if (this.mouse.down != null) {
                        return;
                    }
                    if (this.mouse.position === null) {
                        return;
                    }
                    if (!this.isTimeline) {
                        return;
                    }
                    var ctx = this.context;
                    var rows = this.data.length;
                    var rowHeight = this.panel.rowHeight;
                    var height = this._renderDimensions.height;
                    ctx.beginPath();
                    ctx.moveTo(this.mouse.position.x, 0);
                    ctx.lineTo(this.mouse.position.x, height);
                    ctx.strokeStyle = this.panel.crosshairColor;
                    ctx.setLineDash([]);
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    // Draw a Circle around the point if showing a tooltip
                    if (this.externalPT && rows > 1) {
                        ctx.beginPath();
                        ctx.arc(this.mouse.position.x, this.mouse.position.y, 3, 0, 2 * Math.PI, false);
                        ctx.fillStyle = this.panel.crosshairColor;
                        ctx.fill();
                        ctx.lineWidth = 1;
                    }
                };
                DiscretePanelCtrl.prototype._renderRowSelection = function () {
                    var _this = this;
                    var matrix = this._renderDimensions.matrix;
                    var ctx = this.context;
                    var panel = this.panel;
                    var range = this.range;
                    var _windowOpen = this._windowOpen;
                    if (this.rowsel.childElementCount != 0)
                        this.rowsel.removeChild(this.rowsel.childNodes[0]);
                    if (panel.rowSelectorType == 'hidden')
                        return;
                    var table_select = document.createElement('table');
                    this.rowsel.appendChild(table_select);
                    var rowselParent = this.rowsel.parentNode;
                    var width = this.rowselWidth;
                    jquery_1.default(rowselParent).css('width', width + 'px');
                    var timeAxisHeight = this.panel.showTimeAxis ? 14 + this.panel.textSizeTime : 0;
                    if (panel.rowSelectorType == 'button') {
                        jquery_1.default(rowselParent).css('padding-bottom', this.panel.showTimeAxis ? timeAxisHeight : 0 + 'px');
                    }
                    else {
                        jquery_1.default(rowselParent).css('padding-bottom', timeAxisHeight + 'px');
                    }
                    lodash_1.default.forEach(this.data, function (metric, i) {
                        var tr = document.createElement('tr');
                        jquery_1.default(tr).css('height', _this.panel.rowHeight + 'px');
                        jquery_1.default(tr).css('line-height', _this.panel.rowHeight + 'px');
                        jquery_1.default(tr).css('font-size', _this.panel.textSize + 'px');
                        if (panel.rowSelectorType == 'button') {
                            tr.classList.add('selection-button');
                            jquery_1.default(tr).css('background-size', width - 8 + 'px ' + (width - 8) + 'px');
                        }
                        else {
                            // tr.textContent = metric.name;
                            var span = document.createElement('span');
                            span.textContent = metric.name;
                            tr.appendChild(span);
                        }
                        var positionInfo = tr.getBoundingClientRect();
                        tr.title = metric.name;
                        //tr.setAttribute("class", "hvr-border-fade");
                        //table_select.appendChild(tr);
                        var td = document.createElement('td');
                        tr.appendChild(td);
                        tr.addEventListener('click', function () {
                            if (panel.rowSelectorURL != '') {
                                // if (panel.rowSelectorURL.substr(panel.rowSelectorURL.length - 1) != '/') {
                                //   panel.rowSelectorURL += '/';
                                // }
                                _windowOpen(panel.rowSelectorURL, range.from, range.to, panel.rowSelectorURLParam, metric.name, panel.rowSelectorNewTab);
                            }
                        });
                        table_select.appendChild(tr);
                    });
                    if (this.panel.rowSelectorType == 'text') {
                    }
                };
                DiscretePanelCtrl.prototype._windowOpen = function (baseURL, from, to, paramKey, paramValue, newTab) {
                    var url = baseURL + '?from=' + from + '&to=' + to + '&' + paramKey + '=' + paramValue;
                    if (newTab)
                        window.open(url, '_blank');
                    else
                        window.open(url, '_self');
                };
                DiscretePanelCtrl.templateUrl = 'partials/module.html';
                DiscretePanelCtrl.scrollable = true;
                return DiscretePanelCtrl;
            })(canvas_metric_1.CanvasPanelCtrl);
            exports_1("PanelCtrl", DiscretePanelCtrl);
        }
    }
});
//# sourceMappingURL=module.js.map