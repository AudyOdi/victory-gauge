"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sum2 = require("lodash/sum");

var _sum3 = _interopRequireDefault(_sum2);

var _omit2 = require("lodash/omit");

var _omit3 = _interopRequireDefault(_omit2);

var _isFunction2 = require("lodash/isFunction");

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _defaults2 = require("lodash/defaults");

var _defaults3 = _interopRequireDefault(_defaults2);

var _assign2 = require("lodash/assign");

var _assign3 = _interopRequireDefault(_assign2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _d3Shape = require("d3-shape");

var _d3Shape2 = _interopRequireDefault(_d3Shape);

var _victoryCore = require("victory-core");

var _slice = require("./slice");

var _slice2 = _interopRequireDefault(_slice);

var _needle = require("./needle");

var _needle2 = _interopRequireDefault(_needle);

var _tick = require("./tick");

var _tick2 = _interopRequireDefault(_tick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultStyles = {
  data: {
    padding: 5,
    stroke: "white",
    strokeWidth: 1
  },
  labels: {
    padding: 10,
    fill: "black",
    strokeWidth: 0,
    stroke: "transparent",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: 10,
    textAnchor: "middle"
  }
};

var VictoryGauge = function (_React$Component) {
  _inherits(VictoryGauge, _React$Component);

  function VictoryGauge() {
    _classCallCheck(this, VictoryGauge);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VictoryGauge).call(this));

    _this.state = {};
    _this.getEvents = _victoryCore.Helpers.getEvents.bind(_this);
    _this.getEventState = _victoryCore.Helpers.getEventState.bind(_this);
    return _this;
  }

  _createClass(VictoryGauge, [{
    key: "getColor",
    value: function getColor(style, colors, index) {
      if (style && style.data && style.data.fill) {
        return style.data.fill;
      }
      return colors[index % colors.length];
    }
  }, {
    key: "getRadius",
    value: function getRadius(props, padding) {
      var maxRadius = Math.min(props.width - padding.left - padding.right, props.height - padding.top - padding.bottom) / 2;
      if (this.props.outerRadius < maxRadius) {
        padding.left += maxRadius - this.props.outerRadius;
      }
      return Math.min(this.props.outerRadius, maxRadius);
    }
  }, {
    key: "getLabelText",
    value: function getLabelText(props, datum, index) {
      if (datum.label !== undefined) {
        return datum.label;
      } else if (Array.isArray(props.labels)) {
        return props.labels[index];
      }
      return (0, _isFunction3.default)(props.labels) ? props.labels(datum) : datum.xName || datum.x;
    }
  }, {
    key: "getSliceFunction",
    value: function getSliceFunction(props) {
      var degreesToRadians = function degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
      };

      return _d3Shape2.default.pie().sort(null).startAngle(degreesToRadians(props.startAngle)).endAngle(degreesToRadians(props.endAngle)).padAngle(degreesToRadians(props.padAngle));
    }
  }, {
    key: "getSegments",
    value: function getSegments(props) {
      var segments = props.segments;

      if (segments && segments.length) {
        return segments;
      }
      // if there are no segments provide set of data as a
      // segment that spans entire arc. array of 1?
      return [1];
    }
  }, {
    key: "getGaugeRange",
    value: function getGaugeRange(props, segmentLocations) {
      var radiansToDegrees = function radiansToDegrees(r) {
        return r * (180 / Math.PI);
      };
      var domain = props.domain;

      return {
        minimum: {
          value: domain && domain[0] || segmentLocations[0].data,
          degrees: radiansToDegrees(segmentLocations[0].startAngle)
        },
        maximum: {
          value: domain && domain[1] || segmentLocations[1].data,
          degrees: radiansToDegrees(segmentLocations.reverse()[0].endAngle)
        }
      };
    }
  }, {
    key: "renderData",
    value: function renderData(props, calculatedProps) {
      var _this2 = this;

      var style = calculatedProps.style;
      var colors = calculatedProps.colors;
      var pathFunction = calculatedProps.pathFunction;
      var tickValues = calculatedProps.tickValues;
      var radius = calculatedProps.radius;
      var segmentLocations = calculatedProps.segmentLocations;
      // TODO fix data events

      var dataEvents = this.getEvents(props.events.data, "data");
      // TODO fix label events
      var labelEvents = this.getEvents(props.events.labels, "labels");

      // figure out a way to incorperate tickcount with segments so that:
      // 1. Ticks are assigned to each segment division
      // 2. If there are more ticks than segment division,
      // make sure they are placed evenly (how?)
      // 3. IF there are less ticks than segments, should I
      // place them evenly throughout chart?
      // if (Math.max(tickCount, tickValues.length) === tickValues.length) {
      // } else {

      // }

      var ticks = segmentLocations.reduce(function (locations, segment) {
        locations[segment.startAngle] = segment.startAngle;
        locations[segment.endAngle] = segment.endAngle;
        return locations;
      }, {});
      ticks = Object.keys(ticks).sort(function (x, y) {
        return Number(x) - Number(y);
      });

      var tickComponents = ticks.map(function (tick, index) {
        var tickLocation = _d3Shape2.default.arc().startAngle(tick).endAngle(tick).outerRadius(radius).innerRadius(radius).centroid();
        var angle = tick * (360 / (Math.PI * 2));
        var tickProps = (0, _defaults3.default)({}, props.tickComponent.props, {
          key: "tick-" + index,
          // style:
          x: tickLocation[0],
          y: tickLocation[1],
          index: index,
          angle: angle
        });
        var tickComponent = _react2.default.cloneElement(props.tickComponent, (0, _assign3.default)({}, tickProps));
        var text = tickValues[index];
        if (text !== null && text !== undefined) {
          var labelLocation = _d3Shape2.default.arc().startAngle(tick).endAngle(tick).outerRadius(radius + props.padding).innerRadius(radius).centroid();

          var labelStyle = _victoryCore.Helpers.evaluateStyle((0, _assign3.default)({ padding: 0 }, style.labels));

          var labelProps = (0, _defaults3.default)({}, _this2.getEventState(index, "labels"), props.labelComponent.props, {
            key: "tick-label-" + index,
            style: labelStyle,
            x: labelLocation[0],
            y: labelLocation[1],
            text: "" + text,
            index: index,
            textAnchor: labelStyle.textAnchor || "start",
            verticalAnchor: labelStyle.verticalAnchor || "middle",
            angle: angle.toString()
          });
          var tickLabel = _react2.default.cloneElement(props.labelComponent, (0, _assign3.default)({
            events: _victoryCore.Helpers.getPartialEvents(labelEvents, index, labelProps)
          }, labelProps));
          return _react2.default.createElement(
            "g",
            { key: "tick-group" + index },
            tickComponent,
            tickLabel
          );
        }
        return tickComponent;
      });
      var sliceComponents = segmentLocations.map(function (slice, index) {
        var datum = {
          x: slice.data
        };
        var fill = _this2.getColor(style, colors, index);
        var dataStyles = (0, _omit3.default)(datum, ["x", "y", "label"]);
        var sliceStyle = (0, _defaults3.default)({}, { fill: fill }, style.data, dataStyles);
        var dataProps = (0, _defaults3.default)({}, _this2.getEventState(index, "data"), props.dataComponent.props, {
          key: "slice-" + index,
          index: index,
          slice: slice,
          pathFunction: pathFunction,
          style: _victoryCore.Helpers.evaluateStyle(sliceStyle, datum),
          datum: datum
        });
        return _react2.default.cloneElement(props.dataComponent, (0, _assign3.default)({}, dataProps, { events: _victoryCore.Helpers.getPartialEvents(dataEvents, index, dataProps) }));
      });
      return _react2.default.createElement(
        "g",
        null,
        sliceComponents,
        tickComponents
      );
    }
  }, {
    key: "getRotation",
    value: function getRotation(props, gaugeRange) {
      var segments = props.segments;
      var domain = props.domain;
      var data = props.data;

      var summedValues = void 0;
      if (segments) {
        summedValues = (0, _sum3.default)(segments) ? (0, _sum3.default)(segments) : 1;
      } else {
        summedValues = domain[1] + domain[0];
      }
      var minimum = gaugeRange.minimum;
      var maximum = gaugeRange.maximum;

      var arcSpan = maximum.degrees - minimum.degrees;
      var degreesPerValue = arcSpan / summedValues;
      var degreesAboveMinimum = data * degreesPerValue;
      var result = degreesAboveMinimum + minimum.degrees;
      return Math.max(minimum.degrees, Math.min(result, maximum.degrees));
    }
  }, {
    key: "renderNeedle",
    value: function renderNeedle(props, calculatedProps) {
      var radius = calculatedProps.radius;
      var gaugeRange = calculatedProps.gaugeRange;

      return _react2.default.cloneElement(props.needleComponent, (0, _assign3.default)({}, {
        rotation: this.getRotation(props, gaugeRange),
        height: radius,
        style: props.style,
      }));
    }
  }, {
    key: "getCalculatedProps",
    value: function getCalculatedProps(props) {
      var style = _victoryCore.Helpers.getStyles(props.style, defaultStyles, "auto", "100%");
      var colors = Array.isArray(props.colorScale) ? props.colorScale : _victoryCore.Style.getColorScale(props.colorScale);
      var padding = _victoryCore.Helpers.getPadding(props);
      var radius = this.getRadius(props, padding);
      var segmentValues = this.getSegments(props);
      var layoutFunction = this.getSliceFunction(props);
      var segmentLocations = layoutFunction(segmentValues);
      var gaugeRange = this.getGaugeRange(props, segmentLocations);

      var tickValues = props.tickValues;
      var tickCount = props.tickCount ? props.tickCount : tickValues.length;
      var pathFunction = _d3Shape2.default.arc().outerRadius(radius).innerRadius(props.innerRadius);
      return {
        style: style, colors: colors, padding: padding, radius: radius,
        tickCount: tickCount, tickValues: tickValues, pathFunction: pathFunction, segmentLocations: segmentLocations, gaugeRange: gaugeRange
      };
    }
  }, {
    key: "render",
    value: function render() {
      // If animating, return a `VictoryAnimation` element that will create
      // a new `VictoryBar` with nearly identical props, except (1) tweened
      // and (2) `animate` set to null so we don't recurse forever.

      if (this.props.animate) {
        var whitelist = ["data", "style", "startAngle", "endAngle", "colorScale", "innerRadius", "outerRadius", "padAngle", "width", "height", "padding", "tickValues", "tickFormat", "domain"];
        return _react2.default.createElement(
          _victoryCore.VictoryTransition,
          { animate: this.props.animate, animationWhitelist: whitelist },
          _react2.default.createElement(VictoryGauge, this.props)
        );
      }

      var calculatedProps = this.getCalculatedProps(this.props);
      var style = calculatedProps.style;
      var padding = calculatedProps.padding;
      var radius = calculatedProps.radius;

      var xOffset = radius + padding.left;
      var yOffset = radius + padding.top;
      var group = _react2.default.createElement(
        "g",
        { style: style.parent, transform: "translate(" + xOffset + ", " + yOffset + ")" },
        this.renderData(this.props, calculatedProps),
        this.renderNeedle(this.props, calculatedProps)
      );

      return this.props.standalone ? _react2.default.createElement(
        "svg",
        _extends({
          style: style.parent,
          viewBox: "0 0 " + this.props.width + " " + this.props.height
        }, this.props.events.parent),
        group
      ) : group;
    }
  }]);

  return VictoryGauge;
}(_react2.default.Component);

VictoryGauge.defaultTransitions = {
  onExit: {
    duration: 500,
    before: function before() {
      return { y: 0, label: " " };
    }
  },
  onEnter: {
    duration: 500,
    before: function before() {
      return { y: 0, label: " " };
    },
    after: function after(datum) {
      return { y: datum.y, label: datum.label };
    }
  }
};
VictoryGauge.propTypes = {
  //tickValues array of all values to be input as ticks
  tickValues: _react.PropTypes.array,
  //tikFormat mapping function that returns formatted values of the tickValues
  tickFormat: _react.PropTypes.oneOfType([_react.PropTypes.func, _victoryCore.PropTypes.homogeneousArray]),
  //domain array of two values, min and max of the domain
  domain: _victoryCore.PropTypes.domain,
  //dataAccessor
  tickComponent: _react.PropTypes.element,
  needleComponent: _react.PropTypes.element,
  //tickLabelComponent
  //segmentComponent
  //segments
  segments: _react.PropTypes.array,
  /**
   * The animate prop specifies props for victory-animation to use. If this prop is
   * not given, the gauge chart will not tween between changing data / style props.
   * Large datasets might animate slowly due to the inherent limits of svg rendering.
   * @examples {duration: 500, onEnd: () => alert("done!")}
   */
  animate: _react.PropTypes.object,
  /**
   * The colorScale prop is an optional prop that defines the color scale the pie
   * will be created on. This prop should be given as an array of CSS colors, or as a string
   * corresponding to one of the built in color scales. VictoryPie will automatically assign
   * values from this color scale to the pie slices unless colors are explicitly provided in the
   * data object
   */
  colorScale: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.string), _react.PropTypes.oneOf(["greyscale", "qualitative", "heatmap", "warm", "cool", "red", "green", "blue"])]),
  /**
   * The data prop specifies the data to be plotted,
   * where data X-value is the slice label (string or number),
   * and Y-value is the corresponding number value represented by the slice
   * Data should be in the form of an array of data points.
   * Each data point may be any format you wish (depending on the `x` and `y` accessor props),
   * but by default, an object with x and y properties is expected.
   * @examples [{x: 1, y: 2}, {x: 2, y: 3}], [[1, 2], [2, 3]],
   * [[{x: "a", y: 1}, {x: "b", y: 2}], [{x: "a", y: 2}, {x: "b", y: 3}]]
   */

  //TODO fix proptype violation when animation is on.
  data: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.number]),
  /**
   * The dataComponent prop takes an entire, HTML-complete data component which will be used to
   * create slices for each datum in the pie chart. The new element created from the passed
   * dataComponent will have the property datum set by the pie chart for the point it renders;
   * properties style and pathFunction calculated by VictoryPie; an index property set
   * corresponding to the location of the datum in the data provided to the pie; events bound to
   * the VictoryPie; and the d3 compatible slice object.
   * If a dataComponent is not provided, VictoryPie's Slice component will be used.
   */
  dataComponent: _react.PropTypes.element,
  /**
   * The overall end angle of the pie in degrees. This prop is used in conjunction with
   * startAngle to create a pie that spans only a segment of a circle.
   */
  endAngle: _react.PropTypes.number,
  /**
   * The events prop attaches arbitrary event handlers to data and label elements
   * Event handlers are called with their corresponding events, corresponding component props,
   * and their index in the data array, and event name. The return value of event handlers
   * will be stored by index and namespace on the state object of VictoryBar
   * i.e. `this.state[index].data = {style: {fill: "red"}...}`, and will be
   * applied by index to the appropriate child component. Event props on the
   * parent namespace are just spread directly on to the top level svg of VictoryPie
   * if one exists. If VictoryPie is set up to render g elements i.e. when it is
   * rendered within chart, or when `standalone={false}` parent events will not be applied.
   *
   * @examples {data: {
   *  onClick: () =>  return {data: {style: {fill: "green"}}, labels: {style: {fill: "black"}}}
   *}}
   */
  events: _react.PropTypes.shape({
    parent: _react.PropTypes.object,
    data: _react.PropTypes.object,
    labels: _react.PropTypes.object
  }),
  /**
   * The height props specifies the height of the chart container element in pixels
   */
  height: _victoryCore.PropTypes.nonNegative,
  /**
   * When creating a donut chart, this prop determines the number of pixels between
   * the center of the chart and the inner edge of a donut. When this prop is set to zero
   * a regular pie chart is rendered.
   */
  innerRadius: _victoryCore.PropTypes.nonNegative,
  /**
   * The labelComponent prop takes in an entire label component which will be used
   * to create labels for each slice in the pie chart. The new element created from
   * the passed labelComponent will be supplied with the following properties:
   * x, y, index, datum, verticalAnchor, textAnchor, angle, style, text, and events.
   * any of these props may be overridden by passing in props to the supplied component,
   * or modified or ignored within the custom component itself. If labelComponent is omitted,
   * a new VictoryLabel will be created with props described above.
   */
  labelComponent: _react.PropTypes.element,
  /**
   * The labels prop defines labels that will appear in each slice on your pie chart.
   * This prop should be given as an array of values or as a function of data.
   * If given as an array, the number of elements in the array should be equal to
   * the length of the data array. Labels may also be added directly to the data object
   * like data={[{x: 1, y: 1, label: "first"}]}. If labels are not provided, they
   * will be created based on x values. If you don't want to render labels, pass
   * an empty array or a function that retuns undefined.
   * @examples: ["spring", "summer", "fall", "winter"], (datum) => datum.title
   */
  labels: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.array]),
  /**
   * When creating a chart, this prop determines the number of pixels between
   * the center of the chart and the outer edge of the chart.
   */
  outerRadius: _victoryCore.PropTypes.nonNegative,
  /**
   * The padAngle prop determines the amount of separation between adjacent data slices
   * in number of degrees
   */
  padAngle: _victoryCore.PropTypes.nonNegative,
  /**
   * The padding props specifies the amount of padding in number of pixels between
   * the edge of the chart and any rendered child components. This prop can be given
   * as a number or as an object with padding specified for top, bottom, left
   * and right.
   */
  padding: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.shape({
    top: _react.PropTypes.number,
    bottom: _react.PropTypes.number,
    left: _react.PropTypes.number,
    right: _react.PropTypes.number
  })]),
  /**
   * The standalone prop determines whether VictoryPie should render as a standalone
   * svg, or in a g tag to be included in an svg
   */
  standalone: _react.PropTypes.bool,
  /**
   * The overall start angle of the pie in degrees. This prop is used in conjunction with
   * endAngle to create a pie that spans only a segment of a circle.
   */
  startAngle: _react.PropTypes.number,
  /**
   * The style prop specifies styles for your pie. VictoryPie relies on Radium,
   * so valid Radium style objects should work for this prop. Height, width, and
   * padding should be specified via the height, width, and padding props.
   * @examples {data: {stroke: "black"}, label: {fontSize: 10}}
   */
  style: _react.PropTypes.shape({
    parent: _react.PropTypes.object,
    data: _react.PropTypes.object,
    labels: _react.PropTypes.object
  }),
  /**
   * The width props specifies the width of the chart container element in pixels
   */
  width: _victoryCore.PropTypes.nonNegative,
  /**
   * The x prop specifies how to access the X value of each data point.
   * If given as a function, it will be run on each data point, and returned value will be used.
   * If given as an integer, it will be used as an array index for array-type data points.
   * If given as a string, it will be used as a property key for object-type data points.
   * If given as an array of strings, or a string containing dots or brackets,
   * it will be used as a nested object property path (for details see Lodash docs for _.get).
   * If `null` or `undefined`, the data value will be used as is (identity function/pass-through).
   * @examples 0, 'x', 'x.value.nested.1.thing', 'x[2].also.nested', null, d => Math.sin(d)
   */
  x: _react.PropTypes.oneOfType([_react.PropTypes.func, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _react.PropTypes.string, _react.PropTypes.arrayOf(_react.PropTypes.string)]),
  /**
   * The y prop specifies how to access the Y value of each data point.
   * If given as a function, it will be run on each data point, and returned value will be used.
   * If given as an integer, it will be used as an array index for array-type data points.
   * If given as a string, it will be used as a property key for object-type data points.
   * If given as an array of strings, or a string containing dots or brackets,
   * it will be used as a nested object property path (for details see Lodash docs for _.get).
   * If `null` or `undefined`, the data value will be used as is (identity function/pass-through).
   * @examples 0, 'y', 'y.value.nested.1.thing', 'y[2].also.nested', null, d => Math.sin(d)
   */
  y: _react.PropTypes.oneOfType([_react.PropTypes.func, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _react.PropTypes.string, _react.PropTypes.arrayOf(_react.PropTypes.string)])
};
VictoryGauge.defaultProps = {
  data: 0,
  endAngle: 90,
  events: {},
  height: 400,
  innerRadius: 100,
  outerRadius: 170,
  padAngle: 0,
  padding: 30,
  colorScale: ["#75C776", "#39B6C5", "#78CCC4", "#62C3A4", "#64A8D1", "#8C95C8", "#3BAF74"],
  startAngle: -90,
  standalone: true,
  tickValues: [0, 2, 4, 6, 8, 10],
  width: 400,
  x: "x",
  y: "y",
  dataComponent: _react2.default.createElement(_slice2.default, null),
  tickComponent: _react2.default.createElement(_tick2.default, null),
  labelComponent: _react2.default.createElement(_victoryCore.VictoryLabel, null),
  needleComponent: _react2.default.createElement(_needle2.default, null)
};
exports.default = VictoryGauge;