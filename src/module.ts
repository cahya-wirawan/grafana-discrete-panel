///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import config from 'app/core/config';

import {CanvasPanelCtrl} from './canvas-metric';
import {DistinctPoints} from './distinct-points';

import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';
import kbn from 'app/core/utils/kbn';

import appEvents from 'app/core/app_events';

const grafanaColors = [
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

class DiscretePanelCtrl extends CanvasPanelCtrl {
  static templateUrl = 'partials/module.html';
  static scrollable = true;

  defaults = {
    display: 'timeline', // or 'stacked'
    rowHeight: 20,
    valueMaps: [{value: 'null', op: '=', text: 'N/A'}],
    rangeMaps: [{from: 'null', to: 'null', text: 'N/A'}],
    colorMaps: [{text: 'N/A', color: '#CCC'}],
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

  data: any = null;
  externalPT = false;
  isTimeline = true;
  isStacked = false;
  hoverPoint: any = null;
  colorMap: any = {};
  _colorsPaleteCash: any = null;
  unitFormats: any = null; // only used for editor
  formatter: any = null;

  _renderDimensions: any = {};
  _selectionMatrix: Array<Array<String>> = [];
  rowselWidth = 0;

  parsingCodes = {
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
      'Data authentication failed', //'Invalid channel signature'
      'Data not authenticated',
      'No cert for data found',
      'Data not signed', //'Channel not signed'
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
      'Data authentication failed', //'Invalid channel signature'
      'Data not authenticated',
      'No cert for data found',
      'Data not signed', //'Channel not signed'
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
      'Data authentication failed', //'Invalid channel signature'
      'Data not authenticated',
      'No cert for data found',
      'Data not signed', //'Channel not signed'
      'Frame authentication failed',
      'Frame not authenticated',
      'No cert for frame found',
      'Frame not signed',
    ],
  };

  constructor($scope, $injector) {
    super($scope, $injector);

    // defaults configs
    _.defaultsDeep(this.panel, this.defaults);
    this.panel.display = 'timeline'; // Only supported version now

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('panel-initialized', this.onPanelInitialized.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('refresh', this.onRefresh.bind(this));
  }

  onPanelInitialized() {
    this.updateColorInfo();
    this.onConfigChanged();
  }

  onDataError(err) {
    console.log('onDataError', err);
  }

  onInitEditMode() {
    /** @namespace kbn.getUnitFormats **/
    this.unitFormats = kbn.getUnitFormats();

    this.addEditorTab(
      'Options',
      'public/plugins/ctbto-discrete-panel/partials/editor.options.html',
      1
    );
    this.addEditorTab(
      'Legend',
      'public/plugins/ctbto-discrete-panel/partials/editor.legend.html',
      3
    );
    this.addEditorTab(
      'Colors',
      'public/plugins/ctbto-discrete-panel/partials/editor.colors.html',
      4
    );
    this.addEditorTab(
      'Mappings',
      'public/plugins/ctbto-discrete-panel/partials/editor.mappings.html',
      5
    );
    this.editorTabIndex = 1;
    this.refresh();
  }

  onRender() {
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
  }

  showLegandTooltip(pos, info) {
    let body = '<div class="graph-tooltip-time">' + info.val + '</div>';

    body += '<center>';
    if (info.count > 1) {
      body += info.count + ' times<br/>for<br/>';
    }
    body += moment.duration(info.ms).humanize();
    if (info.count > 1) {
      body += '<br/>total';
    }
    body += '</center>';

    this.$tooltip.html(body).place_tt(pos.pageX + 20, pos.pageY);
  }

  clearTT() {
    this.$tooltip.detach();
  }

  formatValue(val) {
    if (_.isNumber(val)) {
      if (this.panel.rangeMaps) {
        for (let i = 0; i < this.panel.rangeMaps.length; i++) {
          let map = this.panel.rangeMaps[i];

          // value/number to range mapping
          let from = parseFloat(map.from);
          let to = parseFloat(map.to);
          if (to >= val && from <= val) {
            return map.text;
          }
        }
      }
      if (this.formatter) {
        return this.formatter(val, this.panel.decimals);
      }
    }

    let isNull = _.isNil(val);
    if (!isNull && !_.isString(val)) {
      val = val.toString(); // convert everything to a string
    }

    for (let i = 0; i < this.panel.valueMaps.length; i++) {
      let map = this.panel.valueMaps[i];
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
  }

  getColor(val) {
    let hexCode = 0;
    if (val != 'N/A')
      switch (this.panel.rowParsingCodeType) {
        case 'frame':
          hexCode = parseInt(val, 16);
          if ((hexCode & 0x2000) != 0) val = '0x2';
          else if ((hexCode & 0x6e000) != 0) val = '0x1';
          else val = '0x0';
          break;
        case 'channel':
          hexCode = parseInt(val, 16);
          if ((hexCode & 0x2000) != 0) val = '0x2';
          else if ((hexCode & 0x4e110) != 0) val = '0x1';
          else val = '0x0';
          break;
        case 'qualityflags':
        case 'cq_frame':
        case 'cq_channel':
          hexCode = parseInt(val, 16);
          if ((hexCode & 0x880) != 0) val = '0x2';
          else if ((hexCode & 0xff0) != 0) val = '0x1';
          else val = '0x0';
          break;
      }
    if (_.has(this.colorMap, val)) {
      return this.colorMap[val];
    }
    if (this._colorsPaleteCash[val] === undefined) {
      let c = grafanaColors[this._colorsPaleteCash.length % grafanaColors.length];
      this._colorsPaleteCash[val] = c;
      this._colorsPaleteCash.length++;
    }
    return this._colorsPaleteCash[val];
  }

  randomColor() {
    let letters = 'ABCDE'.split('');
    let color = '#';
    for (let i = 0; i < 3; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }

  // Override the
  applyPanelTimeOverrides() {
    super.applyPanelTimeOverrides();

    if (this.panel.expandFromQueryS && this.panel.expandFromQueryS > 0) {
      let from = this.range.from.subtract(this.panel.expandFromQueryS, 's');
      this.range.from = from;
      this.range.raw.from = from;
    }
  }

  onDataReceived(dataList) {
    $(this.canvas).css('cursor', 'pointer');

    //    console.log('GOT', dataList);

    let data = [];
    _.forEach(dataList, metric => {
      if ('table' === metric.type) {
        if ('time' !== metric.columns[0].type) {
          throw new Error('Expected a time column from the table format');
        }

        let last = null;
        for (let i = 1; i < metric.columns.length; i++) {
          let res = new DistinctPoints(metric.columns[i].text);
          for (let j = 0; j < metric.rows.length; j++) {
            let row = metric.rows[j];
            res.add(row[0], this.formatValue(row[i]));
          }
          res.finish(this);
          data.push(res);
        }
      } else {
        let res = new DistinctPoints(metric.target);
        _.forEach(metric.datapoints, point => {
          if (point[0] != null)
            switch (this.panel.rowParsingCodeType) {
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
          res.add(point[1], this.formatValue(point[0]));
        });
        res.finish(this);
        data.push(res);
      }
    });
    this.data = data;

    this.onRender();

    //console.log( 'data', dataList, this.data);
  }

  removeColorMap(map) {
    let index = _.indexOf(this.panel.colorMaps, map);
    this.panel.colorMaps.splice(index, 1);
    this.updateColorInfo();
  }

  updateColorInfo() {
    let cm = {};
    for (let i = 0; i < this.panel.colorMaps.length; i++) {
      let m = this.panel.colorMaps[i];
      if (m.text) {
        cm[m.text] = m.color;
      }
    }
    this._colorsPaleteCash = {};
    this._colorsPaleteCash.length = 0;
    this.colorMap = cm;
    this.render();
  }

  addColorMap(what) {
    if (what === 'curent') {
      _.forEach(this.data, metric => {
        if (metric.legendInfo) {
          _.forEach(metric.legendInfo, info => {
            if (!_.has(this.colorMap, info.val)) {
              let v = {text: info.val, color: this.getColor(info.val)};
              this.panel.colorMaps.push(v);
              this.colorMap[info.val] = v;
            }
          });
        }
      });
    } else {
      this.panel.colorMaps.push({text: '???', color: this.randomColor()});
    }
    this.updateColorInfo();
  }

  removeValueMap(map) {
    let index = _.indexOf(this.panel.valueMaps, map);
    this.panel.valueMaps.splice(index, 1);
    this.render();
  }

  addValueMap() {
    this.panel.valueMaps.push({value: '', op: '=', text: ''});
  }

  removeRangeMap(rangeMap) {
    let index = _.indexOf(this.panel.rangeMaps, rangeMap);
    this.panel.rangeMaps.splice(index, 1);
    this.render();
  }

  addRangeMap() {
    this.panel.rangeMaps.push({from: '', to: '', text: ''});
  }

  onConfigChanged(update = false) {
    this.isTimeline = this.panel.display === 'timeline';
    this.isStacked = this.panel.display === 'stacked';

    this.formatter = null;
    if (this.panel.units && 'none' !== this.panel.units) {
      /** @namespace kbn.valueFormats **/
      this.formatter = kbn.valueFormats[this.panel.units];
    }

    if (update) {
      this.refresh();
    } else {
      this.render();
    }
  }

  decodeParsingCode(code) {
    let decodedString = [];
    if (this.panel.rowParsingCodeType != 'none') {
      let parsingCode = this.parsingCodes[this.panel.rowParsingCodeType];
      let bitPosition = 1;
      const hexCode = parseInt(code, 16);
      if (hexCode == 0) {
        decodedString.push('Ok');
        return decodedString;
      } else if (isNaN(hexCode)) {
        decodedString.push('N/A');
        return decodedString;
      }

      for (let i = 0; i < parsingCode.length; i++) {
        let parsedCode = hexCode & (bitPosition << i);
        if (parsedCode != 0) {
          decodedString.push(parsingCode[i]);
        }
      }
    }
    return decodedString;
  }

  getLegendDisplay(info, metric) {
    let disp = '';
    if (this.panel.rowParsingCodeType != 'none')
      disp = this.decodeParsingCode(info.val).join(', ');
    else disp = info.val;
    if (
      this.panel.showLegendPercent ||
      this.panel.showLegendCounts ||
      this.panel.showLegendTime
    ) {
      disp += ' (';
      let hassomething = false;
      if (this.panel.showLegendTime) {
        disp += moment.duration(info.ms).humanize();
        hassomething = true;
      }

      if (this.panel.showLegendPercent) {
        if (hassomething) {
          disp += ', ';
        }

        let dec = this.panel.legendPercentDecimals;
        if (_.isNil(dec)) {
          if (info.per > 0.98 && metric.changes.length > 1) {
            dec = 2;
          } else if (info.per < 0.02) {
            dec = 2;
          } else {
            dec = 0;
          }
        }
        /** @namespace kbn.valueFormats.percentunit **/
        disp += kbn.valueFormats.percentunit(info.per, dec);
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
  }

  //------------------
  // Mouse Events
  //------------------

  showTooltip(evt, point, isExternal) {
    let from = point.start;
    let to = point.start + point.ms;
    let time = point.ms;
    let val = point.val;
    let name = point.name;

    if (this.mouse.down != null) {
      from = Math.min(this.mouse.down.ts, this.mouse.position.ts);
      to = Math.max(this.mouse.down.ts, this.mouse.position.ts);
      time = to - from;
      val = 'Zoom To:';
    }
    let decodedString = this.decodeParsingCode(val);

    let body = '<div class="graph-tooltip-time">' + name + ': ' + val + '</div>';

    body += '<center>';
    if (this.panel.rowParsingCodeType != 'none') {
      for (let i = 0; i < decodedString.length; i++) {
        body += decodedString[i] + '<br/>';
      }
      body += '<br/>';
    }
    body += this.dashboard.formatDate(moment(from)) + '<br/>';
    body += 'to<br/>';
    body += this.dashboard.formatDate(moment(to)) + '<br/><br/>';
    body += moment.duration(time).humanize() + '<br/>';
    body += '</center>';

    let pageX = 0;
    let pageY = 0;
    if (isExternal) {
      let rect = this.canvas.getBoundingClientRect();
      pageY = rect.top + evt.pos.panelRelY * rect.height;
      if (pageY < 0 || pageY > $(window).innerHeight()) {
        // Skip Hidden tooltip
        this.$tooltip.detach();
        return;
      }
      pageY += $(window).scrollTop();

      let elapsed = this.range.to - this.range.from;
      let pX = (evt.pos.x - this.range.from) / elapsed;
      pageX = rect.left + pX * rect.width;
    } else {
      pageX = evt.evt.pageX;
      pageY = evt.evt.pageY;
    }

    this.$tooltip.html(body).place_tt(pageX + 20, pageY + 5);
  }

  onGraphHover(evt, showTT, isExternal) {
    this.externalPT = false;
    if (this.data && this.data.length) {
      let hover = null;
      let j = Math.floor(this.mouse.position.y / this.panel.rowHeight);
      if (j < 0) {
        j = 0;
      }
      if (j >= this.data.length) {
        j = this.data.length - 1;
      }

      if (this.isTimeline) {
        hover = this.data[j].changes[0];
        for (let i = 0; i < this.data[j].changes.length; i++) {
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
      } else if (!isExternal) {
        if (this.isStacked) {
          hover = this.data[j].legendInfo[0];
          for (let i = 0; i < this.data[j].legendInfo.length; i++) {
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
    } else {
      this.$tooltip.detach(); // make sure it is hidden
    }
  }

  onMouseClicked(where) {
    let pt = this.hoverPoint;
    if (this.panel.onMouseClickZoom) {
      if (pt && pt.start) {
        let range = {from: moment.utc(pt.start), to: moment.utc(pt.start + pt.ms)};
        this.timeSrv.setTime(range);
        this.clear();
      }
    } else {
      let from;
      let to;
      if (this.panel.onMouseClickShortRange) {
        from = moment.utc(pt.start);
        to = moment.utc(pt.start + pt.ms);
      } else {
        from = this.range.from;
        to = this.range.to;
      }
      this._windowOpen(
        this.panel.rowSelectorURL,
        from,
        to,
        this.panel.rowSelectorURLParam,
        pt.name,
        this.panel.rowSelectorNewTab
      );
    }
  }

  onMouseSelectedRange(range) {
    this.timeSrv.setTime(range);
    this.clear();
  }

  clear() {
    this.mouse.position = null;
    this.mouse.down = null;
    this.hoverPoint = null;
    $(this.canvas).css('cursor', 'wait');
    /** @namespace appEvents.emit **/
    appEvents.emit('graph-hover-clear');
    this.render();
  }

  _updateRenderDimensions() {
    this._renderDimensions = {};

    const rect = (this._renderDimensions.rect = this.wrap_parent.getBoundingClientRect());
    const rows = (this._renderDimensions.rows = this.data.length);
    const rowHeight = (this._renderDimensions.rowHeight = this.panel.rowHeight);
    const rowsHeight = (this._renderDimensions.rowsHeight = rowHeight * rows);
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
    const timeHeight = this.panel.showTimeAxis ? 14 + this.panel.textSizeTime : 0;
    const height = (this._renderDimensions.height = rowsHeight + timeHeight);
    const width = (this._renderDimensions.width = rect.width - this.rowselWidth);

    let top = 0;
    let elapsed = this.range.to - this.range.from;

    this._renderDimensions.matrix = [];
    _.forEach(this.data, metric => {
      let positions = [];

      if (this.isTimeline) {
        let lastBS = 0;
        let point = metric.changes[0];
        for (let i = 0; i < metric.changes.length; i++) {
          point = metric.changes[i];
          if (point.start <= this.range.to) {
            let xt = Math.max(point.start - this.range.from, 0);
            let x = xt / elapsed * width;
            positions.push(x);
          }
        }
      }

      if (this.isStacked) {
        let point = null;
        let start = this.range.from;
        for (let i = 0; i < metric.legendInfo.length; i++) {
          point = metric.legendInfo[i];
          let xt = Math.max(start - this.range.from, 0);
          let x = xt / elapsed * width;
          positions.push(x);
          start += point.ms;
        }
      }

      this._renderDimensions.matrix.push({
        y: top,
        positions: positions,
      });

      top += rowHeight;
    });
  }

  _updateSelectionMatrix() {
    let selectionPredicates = {
      all: function() {
        return true;
      },
      crosshairHover: function(i, j) {
        if (j + 1 === this.data[i].changes.length) {
          return this.data[i].changes[j].start <= this.mouse.position.ts;
        }
        return (
          this.data[i].changes[j].start <= this.mouse.position.ts &&
          this.mouse.position.ts < this.data[i].changes[j + 1].start
        );
      },
      mouseX: function(i, j) {
        let row = this._renderDimensions.matrix[i];
        if (j + 1 === row.positions.length) {
          return row.positions[j] <= this.mouse.position.x;
        }
        return (
          row.positions[j] <= this.mouse.position.x &&
          this.mouse.position.x < row.positions[j + 1]
        );
      },
      metric: function(i) {
        return this.data[i] === this._selectedMetric;
      },
      legendItem: function(i, j) {
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

    let pn = getPredicate.bind(this)();
    let predicate = selectionPredicates[pn].bind(this);
    this._selectionMatrix = [];
    for (let i = 0; i < this._renderDimensions.matrix.length; i++) {
      let rs = [];
      let r = this._renderDimensions.matrix[i];
      for (let j = 0; j < r.positions.length; j++) {
        rs.push(predicate(i, j));
      }
      this._selectionMatrix.push(rs);
    }
  }

  _updateCanvasSize() {
    this.canvas.width = this._renderDimensions.width * this._devicePixelRatio;
    this.canvas.height = this._renderDimensions.height * this._devicePixelRatio;

    $(this.canvas).css('width', this._renderDimensions.width + 'px');
    $(this.canvas).css('height', this._renderDimensions.height + 'px');

    this.context.scale(this._devicePixelRatio, this._devicePixelRatio);
  }

  _getVal(metricIndex, rectIndex) {
    let point = undefined;
    if (this.isTimeline) {
      point = this.data[metricIndex].changes[rectIndex];
    }
    if (this.isStacked) {
      point = this.data[metricIndex].legendInfo[rectIndex];
    }
    return point.val;
  }

  _renderRects() {
    const matrix = this._renderDimensions.matrix;
    const ctx = this.context;
    _.forEach(this.data, (metric, i) => {
      const rowObj = matrix[i];
      for (let j = 0; j < rowObj.positions.length; j++) {
        const currentX = rowObj.positions[j];
        let nextX = this._renderDimensions.width;
        if (j + 1 !== rowObj.positions.length) {
          nextX = rowObj.positions[j + 1];
        }
        ctx.fillStyle = this.getColor(this._getVal(i, j));
        let globalAlphaTemp = ctx.globalAlpha;
        if (!this._selectionMatrix[i][j]) {
          ctx.globalAlpha = 0.3;
        }
        ctx.fillRect(
          currentX,
          matrix[i].y,
          nextX - currentX,
          this._renderDimensions.rowHeight
        );
        ctx.globalAlpha = globalAlphaTemp;
      }

      if (i > 0) {
        const top = matrix[i].y;
        ctx.strokeStyle = this.panel.lineColor;
        ctx.beginPath();
        ctx.moveTo(0, top);
        ctx.lineTo(this._renderDimensions.width, top);
        ctx.stroke();
      }
    });
  }

  _renderLabels() {
    let ctx = this.context;
    ctx.lineWidth = 1;
    ctx.textBaseline = 'middle';
    ctx.font = this.panel.textSize + 'px "Open Sans", Helvetica, Arial, sans-serif';

    const offset = 2;
    const rowHeight = this._renderDimensions.rowHeight;
    _.forEach(this.data, (metric, i) => {
      const {y, positions} = this._renderDimensions.matrix[i];

      const centerY = y + rowHeight / 2;
      // let labelPositionMetricName = y + rectHeight - this.panel.textSize / 2;
      // let labelPositionLastValue = y + rectHeight - this.panel.textSize / 2;
      // let labelPositionValue = y + this.panel.textSize / 2;
      let labelPositionMetricName = centerY;
      let labelPositionLastValue = centerY;
      let labelPositionValue = centerY;

      let hoverTextStart = -1;
      let hoverTextEnd = -1;

      if (this.mouse.position && this.panel.writeValuesOnHover) {
        for (let j = 0; j < positions.length; j++) {
          if (positions[j] <= this.mouse.position.x) {
            if (j >= positions.length - 1 || positions[j + 1] >= this.mouse.position.x) {
              let val = this._getVal(i, j);
              ctx.fillStyle = this.panel.valueTextColor;
              ctx.textAlign = 'left';
              hoverTextStart = positions[j] + offset;
              ctx.fillText(val, hoverTextStart, labelPositionValue);
              const txtinfo = ctx.measureText(val);
              hoverTextEnd = hoverTextStart + txtinfo.width + 4;
              break;
            }
          }
        }
      }

      let minTextSpot = 0;
      let maxTextSpot = this._renderDimensions.width;
      if (this.panel.writeMetricNames) {
        if (this.panel.writeMetricNamesRight) {
          ctx.fillStyle = this.panel.metricNameColor;
          ctx.textAlign = 'right';
          const txtinfo = ctx.measureText(metric.name);
          if (hoverTextStart < 0 || hoverTextStart > txtinfo.width) {
            ctx.fillText(
              metric.name,
              this._renderDimensions.width - offset,
              labelPositionMetricName
            );
            maxTextSpot = this._renderDimensions.width - txtinfo.width - 10;
          }
        } else {
          ctx.fillStyle = this.panel.metricNameColor;
          ctx.textAlign = 'left';
          const txtinfo = ctx.measureText(metric.name);
          if (hoverTextStart < 0 || hoverTextStart > txtinfo.width) {
            ctx.fillText(metric.name, offset, labelPositionMetricName);
            minTextSpot = offset + ctx.measureText(metric.name).width + 2;
          }
        }
      }
      if (this.panel.writeLastValue && !this.panel.writeMetricNamesRight) {
        let val = this._getVal(i, positions.length - 1);
        ctx.fillStyle = this.panel.valueTextColor;
        ctx.textAlign = 'right';
        const txtinfo = ctx.measureText(val);
        const xval = this._renderDimensions.width - offset - txtinfo.width;
        if (xval > hoverTextEnd) {
          ctx.fillText(
            val,
            this._renderDimensions.width - offset,
            labelPositionLastValue
          );
          maxTextSpot = this._renderDimensions.width - ctx.measureText(val).width - 10;
        }
      }

      if (this.panel.writeAllValues) {
        ctx.fillStyle = this.panel.valueTextColor;
        ctx.textAlign = 'left';
        for (let j = 0; j < positions.length; j++) {
          const val = this._getVal(i, j);
          let nextX = this._renderDimensions.width;
          if (j + 1 !== positions.length) {
            nextX = positions[j + 1];
          }

          const x = positions[j];
          if (x > minTextSpot) {
            const width = nextX - x;
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
  }

  _renderSelection() {
    if (this.mouse.down === null) {
      return;
    }
    if (this.mouse.position === null) {
      return;
    }
    if (!this.isTimeline) {
      return;
    }

    let ctx = this.context;
    let height = this._renderDimensions.height;

    let xmin = Math.min(this.mouse.position.x, this.mouse.down.x);
    let xmax = Math.max(this.mouse.position.x, this.mouse.down.x);

    ctx.fillStyle = 'rgba(110, 110, 110, 0.5)';
    ctx.strokeStyle = 'rgba(110, 110, 110, 0.5)';
    ctx.beginPath();
    ctx.fillRect(xmin, 0, xmax - xmin, height);
    ctx.strokeRect(xmin, 0, xmax - xmin, height);
  }

  _renderTimeAxis() {
    if (!this.panel.showTimeAxis) {
      return;
    }

    const ctx = this.context;
    const rows = this.data.length;
    const rowHeight = this.panel.rowHeight;
    const height = this._renderDimensions.height;
    const width = this._renderDimensions.width;
    const top = this._renderDimensions.rowsHeight;

    const headerColumnIndent = 0; // header inset (zero for now)

    ctx.font = this.panel.textSizeTime + 'px "Open Sans", Helvetica, Arial, sans-serif';
    ctx.fillStyle = this.panel.timeTextColor;
    ctx.textAlign = 'left';
    ctx.strokeStyle = this.panel.timeTextColor;
    ctx.textBaseline = 'top';
    ctx.setLineDash([7, 5]); // dashes are 5px and spaces are 3px
    ctx.lineDashOffset = 0;

    let min = _.isUndefined(this.range.from) ? null : this.range.from.valueOf();
    let max = _.isUndefined(this.range.to) ? null : this.range.to.valueOf();
    let minPxInterval = ctx.measureText('12/33 24:59').width * 2;
    let estNumTicks = width / minPxInterval;
    let estTimeInterval = (max - min) / estNumTicks;
    let timeResolution = this.getTimeResolution(estTimeInterval);
    let pixelStep = timeResolution / (max - min) * width;
    let nextPointInTime = this.roundDate(min, timeResolution) + timeResolution;
    let xPos = headerColumnIndent + (nextPointInTime - min) / (max - min) * width;

    let timeFormat = this.time_format(max - min, timeResolution / 1000);

    while (nextPointInTime < max) {
      // draw ticks
      ctx.beginPath();
      ctx.moveTo(xPos, top + 5);
      ctx.lineTo(xPos, 0);
      ctx.lineWidth = 1;
      ctx.stroke();

      // draw time label
      let date = new Date(nextPointInTime);
      let dateStr = this.formatDate(date, timeFormat);
      let xOffset = ctx.measureText(dateStr).width / 2;
      ctx.fillText(dateStr, xPos - xOffset, top + 10);

      nextPointInTime += timeResolution;
      xPos += pixelStep;
    }
  }

  _renderCrosshair() {
    if (this.mouse.down != null) {
      return;
    }
    if (this.mouse.position === null) {
      return;
    }
    if (!this.isTimeline) {
      return;
    }

    let ctx = this.context;
    let rows = this.data.length;
    let rowHeight = this.panel.rowHeight;
    let height = this._renderDimensions.height;

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
  }

  _renderRowSelection() {
    let matrix = this._renderDimensions.matrix;
    const ctx = this.context;
    const panel = this.panel;
    const range = this.range;
    const _windowOpen = this._windowOpen;
    if (this.rowsel.childElementCount != 0)
      this.rowsel.removeChild(this.rowsel.childNodes[0]);
    if (panel.rowSelectorType == 'hidden') return;
    let table_select = document.createElement('table');
    this.rowsel.appendChild(table_select);
    let rowselParent = this.rowsel.parentNode;
    let width = this.rowselWidth;

    $(rowselParent).css('width', width + 'px');
    let timeAxisHeight = this.panel.showTimeAxis ? 14 + this.panel.textSizeTime : 0;
    if (panel.rowSelectorType == 'button') {
      $(rowselParent).css(
        'padding-bottom',
        this.panel.showTimeAxis ? timeAxisHeight : 0 + 'px'
      );
    } else {
      $(rowselParent).css('padding-bottom', timeAxisHeight + 'px');
    }

    _.forEach(this.data, (metric, i) => {
      let tr = document.createElement('tr');
      $(tr).css('height', this.panel.rowHeight + 'px');
      $(tr).css('line-height', this.panel.rowHeight + 'px');
      $(tr).css('font-size', this.panel.textSize + 'px');
      if (panel.rowSelectorType == 'button') {
        tr.classList.add('selection-button');
        $(tr).css('background-size', width - 8 + 'px ' + (width - 8) + 'px');
      } else {
        // tr.textContent = metric.name;
        let span = document.createElement('span');
        span.textContent = metric.name;
        tr.appendChild(span);
      }
      let positionInfo = tr.getBoundingClientRect();
      tr.title = metric.name;
      //tr.setAttribute("class", "hvr-border-fade");
      //table_select.appendChild(tr);
      let td = document.createElement('td');
      tr.appendChild(td);
      tr.addEventListener('click', function() {
        if (panel.rowSelectorURL != '') {
          // if (panel.rowSelectorURL.substr(panel.rowSelectorURL.length - 1) != '/') {
          //   panel.rowSelectorURL += '/';
          // }
          _windowOpen(
            panel.rowSelectorURL,
            range.from,
            range.to,
            panel.rowSelectorURLParam,
            metric.name,
            panel.rowSelectorNewTab
          );
        }
      });
      table_select.appendChild(tr);
    });
    if (this.panel.rowSelectorType == 'text') {
      // this.rowselWidth = table_select.offsetWidth;
      // this.panel.rowSelectorWidth = table_select.offsetWidth;
    }
  }

  _windowOpen(baseURL, from, to, paramKey, paramValue, newTab) {
    let url = baseURL + '?from=' + from + '&to=' + to + '&' + paramKey + '=' + paramValue;
    if (newTab) window.open(url, '_blank');
    else window.open(url, '_self');
  }
}

export {DiscretePanelCtrl as PanelCtrl};
