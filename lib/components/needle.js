"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Needle = function (_React$Component) {
  _inherits(Needle, _React$Component);

  function Needle() {
    _classCallCheck(this, Needle);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Needle).apply(this, arguments));
  }

  _createClass(Needle, [{
    key: "render",
    value: function render() {
      var _props = this.props;
      var rotation = _props.rotation;
      var height = _props.height;
      var _style = _props.style;

      return _react2.default.createElement(
        "g",
        { transform: "rotate(" + rotation + ")" },
        _react2.default.createElement("path", {
          d: "M 0 5 C -1,5 -4,3 -6,0 L 0 -" + height + " L 6 0 C 4,3 1,5 0,5",
          stroke: _style.stroke || "black",
          fill: _style.fill || "red",
          strokeWidth: _style.strokeWidth || "0.5"
        })
      );
    }
  }]);

  return Needle;
}(_react2.default.Component);

exports.default = Needle;


Needle.propTypes = {
  rotation: _react2.default.PropTypes.number,
  height: _react2.default.PropTypes.number,
  style: _react2.default.PropTypes.object
};
