'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _raf2 = require('raf');

var _raf3 = _interopRequireDefault(_raf2);

var _domCss = require('dom-css');

var _domCss2 = _interopRequireDefault(_domCss);

var _react = require('react');

var _isString = require('../utils/isString');

var _isString2 = _interopRequireDefault(_isString);

var _getScrollbarWidth = require('../utils/getScrollbarWidth');

var _getScrollbarWidth2 = _interopRequireDefault(_getScrollbarWidth);

var _returnFalse = require('../utils/returnFalse');

var _returnFalse2 = _interopRequireDefault(_returnFalse);

var _getInnerWidth = require('../utils/getInnerWidth');

var _getInnerWidth2 = _interopRequireDefault(_getInnerWidth);

var _getInnerHeight = require('../utils/getInnerHeight');

var _getInnerHeight2 = _interopRequireDefault(_getInnerHeight);

var _styles = require('./styles');

var _defaultRenderElements = require('./defaultRenderElements');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports["default"] = (0, _react.createClass)({

    displayName: 'Scrollbars',

    propTypes: {
        onScroll: _react.PropTypes.func,
        onScrollFrame: _react.PropTypes.func,
        onScrollStart: _react.PropTypes.func,
        onScrollStop: _react.PropTypes.func,
        onUpdate: _react.PropTypes.func,
        renderView: _react.PropTypes.func,
        renderTrackHorizontal: _react.PropTypes.func,
        renderTrackVertical: _react.PropTypes.func,
        renderThumbHorizontal: _react.PropTypes.func,
        renderThumbVertical: _react.PropTypes.func,
        tagName: _react.PropTypes.string,
        thumbSize: _react.PropTypes.number,
        thumbMinSize: _react.PropTypes.number,
        hideTracksWhenNotNeeded: _react.PropTypes.bool,
        autoHide: _react.PropTypes.bool,
        autoHideTimeout: _react.PropTypes.number,
        autoHideDuration: _react.PropTypes.number,
        autoHeight: _react.PropTypes.bool,
        autoHeightMin: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
        autoHeightMax: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
        autoWidth: _react.PropTypes.bool,
        autoWidthMin: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
        autoWidthMax: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
        universal: _react.PropTypes.bool,
        style: _react.PropTypes.object,
        children: _react.PropTypes.node
    },

    getDefaultProps: function getDefaultProps() {
        return {
            renderView: _defaultRenderElements.renderViewDefault,
            renderTrackHorizontal: _defaultRenderElements.renderTrackHorizontalDefault,
            renderTrackVertical: _defaultRenderElements.renderTrackVerticalDefault,
            renderThumbHorizontal: _defaultRenderElements.renderThumbHorizontalDefault,
            renderThumbVertical: _defaultRenderElements.renderThumbVerticalDefault,
            tagName: 'div',
            thumbMinSize: 30,
            hideTracksWhenNotNeeded: false,
            autoHide: false,
            autoHideTimeout: 1000,
            autoHideDuration: 200,
            autoHeight: false,
            autoHeightMin: 0,
            autoHeightMax: 200,
            autoWidth: false,
            autoWidthMin: '100%',
            autoWidthMax: '100%',
            universal: false
        };
    },
    getInitialState: function getInitialState() {
        return {
            didMountUniversal: false
        };
    },
    componentDidMount: function componentDidMount() {
        this.addListeners();
        this.update();
        this.componentDidMountUniversal();
    },
    componentDidMountUniversal: function componentDidMountUniversal() {
        // eslint-disable-line react/sort-comp
        var universal = this.props.universal;

        if (!universal) return;
        this.setState({ didMountUniversal: true });
    },
    componentDidUpdate: function componentDidUpdate() {
        this.update();
    },
    componentWillUnmount: function componentWillUnmount() {
        this.removeListeners();
        (0, _raf2.cancel)(this.requestFrame);
        clearTimeout(this.hideTracksTimeout);
        clearInterval(this.detectScrollingInterval);
    },
    getScrollLeft: function getScrollLeft() {
        var view = this.refs.view;

        return view.scrollLeft;
    },
    getScrollTop: function getScrollTop() {
        var view = this.refs.view;

        return view.scrollTop;
    },
    getScrollWidth: function getScrollWidth() {
        var view = this.refs.view;

        return view.scrollWidth - this.getPaddingWidth();
    },
    getScrollHeight: function getScrollHeight() {
        var view = this.refs.view;

        return view.scrollHeight - this.getPaddingHeight();
    },
    getClientWidth: function getClientWidth() {
        var view = this.refs.view;

        return view.clientWidth - this.getPaddingWidth();
    },
    getClientHeight: function getClientHeight() {
        var view = this.refs.view;

        return view.clientHeight - this.getPaddingHeight();
    },
    getPaddingWidth: function getPaddingWidth() {
        return _styles.scrollbarSize;
    },
    getPaddingHeight: function getPaddingHeight() {
        return _styles.scrollbarSize;
    },
    getValues: function getValues() {
        var view = this.refs.view;
        var scrollLeft = view.scrollLeft,
            scrollTop = view.scrollTop;


        var scrollWidth = view.scrollWidth - this.getPaddingWidth();
        var scrollHeight = view.scrollHeight - this.getPaddingHeight();
        var clientWidth = view.clientWidth - this.getPaddingWidth();
        var clientHeight = view.clientHeight - this.getPaddingHeight();

        return {
            left: scrollLeft / (scrollWidth - clientWidth) || 0,
            top: scrollTop / (scrollHeight - clientHeight) || 0,
            scrollLeft: scrollLeft,
            scrollTop: scrollTop,
            scrollWidth: scrollWidth,
            scrollHeight: scrollHeight,
            clientWidth: clientWidth,
            clientHeight: clientHeight
        };
    },
    getThumbHorizontalWidth: function getThumbHorizontalWidth() {
        var _props = this.props,
            thumbSize = _props.thumbSize,
            thumbMinSize = _props.thumbMinSize;
        var _refs = this.refs,
            view = _refs.view,
            trackHorizontal = _refs.trackHorizontal;

        var scrollWidth = view.scrollWidth - this.getPaddingWidth();
        var clientWidth = view.clientWidth - this.getPaddingWidth();
        var trackWidth = (0, _getInnerWidth2["default"])(trackHorizontal);
        var width = clientWidth / scrollWidth * trackWidth;
        if (scrollWidth <= clientWidth) return 0;
        if (thumbSize) return thumbSize;
        return Math.max(width, thumbMinSize);
    },
    getThumbVerticalHeight: function getThumbVerticalHeight() {
        var _props2 = this.props,
            thumbSize = _props2.thumbSize,
            thumbMinSize = _props2.thumbMinSize;
        var _refs2 = this.refs,
            view = _refs2.view,
            trackVertical = _refs2.trackVertical;

        var scrollHeight = view.scrollHeight - this.getPaddingHeight();
        var clientHeight = view.clientHeight - this.getPaddingHeight();
        var trackHeight = (0, _getInnerHeight2["default"])(trackVertical);
        var height = clientHeight / scrollHeight * trackHeight;
        if (scrollHeight <= clientHeight) return 0;
        if (thumbSize) return thumbSize;
        return Math.max(height, thumbMinSize);
    },
    getScrollLeftForOffset: function getScrollLeftForOffset(offset) {
        var _refs3 = this.refs,
            view = _refs3.view,
            trackHorizontal = _refs3.trackHorizontal;

        var scrollWidth = view.scrollWidth - this.getPaddingWidth();
        var clientWidth = view.clientWidth - this.getPaddingWidth();
        var trackWidth = (0, _getInnerWidth2["default"])(trackHorizontal);
        var thumbWidth = this.getThumbHorizontalWidth();
        return offset / (trackWidth - thumbWidth) * (scrollWidth - clientWidth);
    },
    getScrollTopForOffset: function getScrollTopForOffset(offset) {
        var _refs4 = this.refs,
            view = _refs4.view,
            trackVertical = _refs4.trackVertical;

        var scrollHeight = view.scrollHeight - this.getPaddingHeight();
        var clientHeight = view.clientHeight - this.getPaddingHeight();
        var trackHeight = (0, _getInnerHeight2["default"])(trackVertical);
        var thumbHeight = this.getThumbVerticalHeight();
        return offset / (trackHeight - thumbHeight) * (scrollHeight - clientHeight);
    },
    scrollLeft: function scrollLeft() {
        var left = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var view = this.refs.view;

        view.scrollLeft = left;
    },
    scrollTop: function scrollTop() {
        var top = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var view = this.refs.view;

        view.scrollTop = top;
    },
    scrollToLeft: function scrollToLeft() {
        var view = this.refs.view;

        view.scrollLeft = 0;
    },
    scrollToTop: function scrollToTop() {
        var view = this.refs.view;

        view.scrollTop = 0;
    },
    scrollToRight: function scrollToRight() {
        var view = this.refs.view;

        view.scrollLeft = view.scrollWidth - this.getPaddingWidth();
    },
    scrollToBottom: function scrollToBottom() {
        var view = this.refs.view;

        view.scrollTop = view.scrollHeight - this.getPaddingHeight();
    },
    addListeners: function addListeners() {
        /* istanbul ignore if */
        if (typeof document === 'undefined') return;
        var _refs5 = this.refs,
            view = _refs5.view,
            trackHorizontal = _refs5.trackHorizontal,
            trackVertical = _refs5.trackVertical,
            thumbHorizontal = _refs5.thumbHorizontal,
            thumbVertical = _refs5.thumbVertical;

        view.addEventListener('scroll', this.handleScroll);
        trackHorizontal.addEventListener('mouseenter', this.handleTrackMouseEnter);
        trackHorizontal.addEventListener('mouseleave', this.handleTrackMouseLeave);
        trackHorizontal.addEventListener('mousedown', this.handleHorizontalTrackMouseDown);
        trackVertical.addEventListener('mouseenter', this.handleTrackMouseEnter);
        trackVertical.addEventListener('mouseleave', this.handleTrackMouseLeave);
        trackVertical.addEventListener('mousedown', this.handleVerticalTrackMouseDown);
        thumbHorizontal.addEventListener('mousedown', this.handleHorizontalThumbMouseDown);
        thumbVertical.addEventListener('mousedown', this.handleVerticalThumbMouseDown);
        window.addEventListener('resize', this.handleWindowResize);
    },
    removeListeners: function removeListeners() {
        /* istanbul ignore if */
        if (typeof document === 'undefined') return;
        var _refs6 = this.refs,
            view = _refs6.view,
            trackHorizontal = _refs6.trackHorizontal,
            trackVertical = _refs6.trackVertical,
            thumbHorizontal = _refs6.thumbHorizontal,
            thumbVertical = _refs6.thumbVertical;

        view.removeEventListener('scroll', this.handleScroll);
        trackHorizontal.removeEventListener('mouseenter', this.handleTrackMouseEnter);
        trackHorizontal.removeEventListener('mouseleave', this.handleTrackMouseLeave);
        trackHorizontal.removeEventListener('mousedown', this.handleHorizontalTrackMouseDown);
        trackVertical.removeEventListener('mouseenter', this.handleTrackMouseEnter);
        trackVertical.removeEventListener('mouseleave', this.handleTrackMouseLeave);
        trackVertical.removeEventListener('mousedown', this.handleVerticalTrackMouseDown);
        thumbHorizontal.removeEventListener('mousedown', this.handleHorizontalThumbMouseDown);
        thumbVertical.removeEventListener('mousedown', this.handleVerticalThumbMouseDown);
        window.removeEventListener('resize', this.handleWindowResize);
        // Possibly setup by `handleDragStart`
        this.teardownDragging();
    },
    handleScroll: function handleScroll(event) {
        var _this = this;

        var _props3 = this.props,
            onScroll = _props3.onScroll,
            onScrollFrame = _props3.onScrollFrame;

        if (onScroll) onScroll(event);
        this.update(function (values) {
            var scrollLeft = values.scrollLeft,
                scrollTop = values.scrollTop;

            _this.viewScrollLeft = scrollLeft;
            _this.viewScrollTop = scrollTop;
            if (onScrollFrame) onScrollFrame(values);
        });
        this.detectScrolling();
    },
    handleScrollStart: function handleScrollStart() {
        var onScrollStart = this.props.onScrollStart;

        if (onScrollStart) onScrollStart();
        this.handleScrollStartAutoHide();
    },
    handleScrollStartAutoHide: function handleScrollStartAutoHide() {
        var autoHide = this.props.autoHide;

        if (!autoHide) return;
        this.showTracks();
    },
    handleScrollStop: function handleScrollStop() {
        var onScrollStop = this.props.onScrollStop;

        if (onScrollStop) onScrollStop();
        this.handleScrollStopAutoHide();
    },
    handleScrollStopAutoHide: function handleScrollStopAutoHide() {
        var autoHide = this.props.autoHide;

        if (!autoHide) return;
        this.hideTracks();
    },
    handleWindowResize: function handleWindowResize() {
        this.update();
    },
    handleHorizontalTrackMouseDown: function handleHorizontalTrackMouseDown() {
        var view = this.refs.view;
        var _event = event,
            target = _event.target,
            clientX = _event.clientX;

        var _target$getBoundingCl = target.getBoundingClientRect(),
            targetLeft = _target$getBoundingCl.left;

        var thumbWidth = this.getThumbHorizontalWidth();
        var offset = Math.abs(targetLeft - clientX) - thumbWidth / 2;
        view.scrollLeft = this.getScrollLeftForOffset(offset);
    },
    handleVerticalTrackMouseDown: function handleVerticalTrackMouseDown(event) {
        var view = this.refs.view;
        var target = event.target,
            clientY = event.clientY;

        var _target$getBoundingCl2 = target.getBoundingClientRect(),
            targetTop = _target$getBoundingCl2.top;

        var thumbHeight = this.getThumbVerticalHeight();
        var offset = Math.abs(targetTop - clientY) - thumbHeight / 2;
        view.scrollTop = this.getScrollTopForOffset(offset);
    },
    handleHorizontalThumbMouseDown: function handleHorizontalThumbMouseDown(event) {
        this.handleDragStart(event);
        var target = event.target,
            clientX = event.clientX;
        var offsetWidth = target.offsetWidth;

        var _target$getBoundingCl3 = target.getBoundingClientRect(),
            left = _target$getBoundingCl3.left;

        this.prevPageX = offsetWidth - (clientX - left);
    },
    handleVerticalThumbMouseDown: function handleVerticalThumbMouseDown(event) {
        this.handleDragStart(event);
        var target = event.target,
            clientY = event.clientY;
        var offsetHeight = target.offsetHeight;

        var _target$getBoundingCl4 = target.getBoundingClientRect(),
            top = _target$getBoundingCl4.top;

        this.prevPageY = offsetHeight - (clientY - top);
    },
    setupDragging: function setupDragging() {
        (0, _domCss2["default"])(document.body, _styles.disableSelectStyle);
        document.addEventListener('mousemove', this.handleDrag);
        document.addEventListener('mouseup', this.handleDragEnd);
        document.onselectstart = _returnFalse2["default"];
    },
    teardownDragging: function teardownDragging() {
        (0, _domCss2["default"])(document.body, _styles.disableSelectStyleReset);
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.handleDragEnd);
        document.onselectstart = undefined;
    },
    handleDragStart: function handleDragStart(event) {
        this.dragging = true;
        event.stopImmediatePropagation();
        this.setupDragging();
    },
    handleDrag: function handleDrag(event) {
        if (this.prevPageX) {
            var clientX = event.clientX;
            var _refs7 = this.refs,
                view = _refs7.view,
                trackHorizontal = _refs7.trackHorizontal;

            var _trackHorizontal$getB = trackHorizontal.getBoundingClientRect(),
                trackLeft = _trackHorizontal$getB.left;

            var thumbWidth = this.getThumbHorizontalWidth();
            var clickPosition = thumbWidth - this.prevPageX;
            var offset = -trackLeft + clientX - clickPosition;
            view.scrollLeft = this.getScrollLeftForOffset(offset);
        }
        if (this.prevPageY) {
            var clientY = event.clientY;
            var _refs8 = this.refs,
                _view = _refs8.view,
                trackVertical = _refs8.trackVertical;

            var _trackVertical$getBou = trackVertical.getBoundingClientRect(),
                trackTop = _trackVertical$getBou.top;

            var thumbHeight = this.getThumbVerticalHeight();
            var _clickPosition = thumbHeight - this.prevPageY;
            var _offset = -trackTop + clientY - _clickPosition;
            _view.scrollTop = this.getScrollTopForOffset(_offset);
        }
        return false;
    },
    handleDragEnd: function handleDragEnd() {
        this.dragging = false;
        this.prevPageX = this.prevPageY = 0;
        this.teardownDragging();
        this.handleDragEndAutoHide();
    },
    handleDragEndAutoHide: function handleDragEndAutoHide() {
        var autoHide = this.props.autoHide;

        if (!autoHide) return;
        this.hideTracks();
    },
    handleTrackMouseEnter: function handleTrackMouseEnter() {
        this.trackMouseOver = true;
        this.handleTrackMouseEnterAutoHide();
    },
    handleTrackMouseEnterAutoHide: function handleTrackMouseEnterAutoHide() {
        var autoHide = this.props.autoHide;

        if (!autoHide) return;
        this.showTracks();
    },
    handleTrackMouseLeave: function handleTrackMouseLeave() {
        this.trackMouseOver = false;
        this.handleTrackMouseLeaveAutoHide();
    },
    handleTrackMouseLeaveAutoHide: function handleTrackMouseLeaveAutoHide() {
        var autoHide = this.props.autoHide;

        if (!autoHide) return;
        this.hideTracks();
    },
    showTracks: function showTracks() {
        var _refs9 = this.refs,
            trackHorizontal = _refs9.trackHorizontal,
            trackVertical = _refs9.trackVertical;

        clearTimeout(this.hideTracksTimeout);
        (0, _domCss2["default"])(trackHorizontal, { opacity: 1 });
        (0, _domCss2["default"])(trackVertical, { opacity: 1 });
    },
    hideTracks: function hideTracks() {
        if (this.dragging) return;
        if (this.scrolling) return;
        if (this.trackMouseOver) return;
        var autoHideTimeout = this.props.autoHideTimeout;
        var _refs10 = this.refs,
            trackHorizontal = _refs10.trackHorizontal,
            trackVertical = _refs10.trackVertical;

        clearTimeout(this.hideTracksTimeout);
        this.hideTracksTimeout = setTimeout(function () {
            (0, _domCss2["default"])(trackHorizontal, { opacity: 0 });
            (0, _domCss2["default"])(trackVertical, { opacity: 0 });
        }, autoHideTimeout);
    },
    detectScrolling: function detectScrolling() {
        var _this2 = this;

        if (this.scrolling) return;
        this.scrolling = true;
        this.handleScrollStart();
        this.detectScrollingInterval = setInterval(function () {
            if (_this2.lastViewScrollLeft === _this2.viewScrollLeft && _this2.lastViewScrollTop === _this2.viewScrollTop) {
                clearInterval(_this2.detectScrollingInterval);
                _this2.scrolling = false;
                _this2.handleScrollStop();
            }
            _this2.lastViewScrollLeft = _this2.viewScrollLeft;
            _this2.lastViewScrollTop = _this2.viewScrollTop;
        }, 100);
    },
    raf: function raf(callback) {
        var _this3 = this;

        if (this.requestFrame) _raf3["default"].cancel(this.requestFrame);
        this.requestFrame = (0, _raf3["default"])(function () {
            _this3.requestFrame = undefined;
            callback();
        });
    },
    update: function update(callback) {
        var _this4 = this;

        this.raf(function () {
            return _this4._update(callback);
        });
    },
    _update: function _update(callback) {
        var _props4 = this.props,
            onUpdate = _props4.onUpdate,
            hideTracksWhenNotNeeded = _props4.hideTracksWhenNotNeeded;
        var _refs11 = this.refs,
            thumbHorizontal = _refs11.thumbHorizontal,
            thumbVertical = _refs11.thumbVertical,
            trackHorizontal = _refs11.trackHorizontal,
            trackVertical = _refs11.trackVertical,
            container = _refs11.container;

        container.scrollTop = 0;
        container.scrollLeft = 0;
        var values = this.getValues();
        var scrollLeft = values.scrollLeft,
            clientWidth = values.clientWidth,
            scrollWidth = values.scrollWidth;

        var trackHorizontalWidth = (0, _getInnerWidth2["default"])(trackHorizontal);
        var thumbHorizontalWidth = this.getThumbHorizontalWidth();
        var thumbHorizontalX = scrollLeft / (scrollWidth - clientWidth) * (trackHorizontalWidth - thumbHorizontalWidth);
        var thumbHorizontalStyle = {
            width: thumbHorizontalWidth,
            transform: 'translateX(' + thumbHorizontalX + 'px)'
        };
        var scrollTop = values.scrollTop,
            clientHeight = values.clientHeight,
            scrollHeight = values.scrollHeight;

        var trackVerticalHeight = (0, _getInnerHeight2["default"])(trackVertical);
        var thumbVerticalHeight = this.getThumbVerticalHeight();
        var thumbVerticalY = scrollTop / (scrollHeight - clientHeight) * (trackVerticalHeight - thumbVerticalHeight);
        var thumbVerticalStyle = {
            height: thumbVerticalHeight,
            transform: 'translateY(' + thumbVerticalY + 'px)'
        };
        if (hideTracksWhenNotNeeded) {
            var trackHorizontalStyle = {
                visibility: scrollWidth > clientWidth ? 'visible' : 'hidden'
            };
            var trackVerticalStyle = {
                visibility: scrollHeight > clientHeight ? 'visible' : 'hidden'
            };
            (0, _domCss2["default"])(trackHorizontal, trackHorizontalStyle);
            (0, _domCss2["default"])(trackVertical, trackVerticalStyle);
        }
        (0, _domCss2["default"])(thumbHorizontal, thumbHorizontalStyle);
        (0, _domCss2["default"])(thumbVertical, thumbVerticalStyle);
        if (onUpdate) onUpdate(values);
        if (typeof callback !== 'function') return;
        callback(values);
    },
    render: function render() {
        var scrollbarWidth = (0, _getScrollbarWidth2["default"])();
        /* eslint-disable no-unused-vars */

        var _props5 = this.props,
            onScroll = _props5.onScroll,
            onScrollFrame = _props5.onScrollFrame,
            onScrollStart = _props5.onScrollStart,
            onScrollStop = _props5.onScrollStop,
            onUpdate = _props5.onUpdate,
            renderView = _props5.renderView,
            renderTrackHorizontal = _props5.renderTrackHorizontal,
            renderTrackVertical = _props5.renderTrackVertical,
            renderThumbHorizontal = _props5.renderThumbHorizontal,
            renderThumbVertical = _props5.renderThumbVertical,
            tagName = _props5.tagName,
            hideTracksWhenNotNeeded = _props5.hideTracksWhenNotNeeded,
            autoHide = _props5.autoHide,
            autoHideTimeout = _props5.autoHideTimeout,
            autoHideDuration = _props5.autoHideDuration,
            thumbSize = _props5.thumbSize,
            thumbMinSize = _props5.thumbMinSize,
            universal = _props5.universal,
            autoHeight = _props5.autoHeight,
            autoHeightMin = _props5.autoHeightMin,
            autoHeightMax = _props5.autoHeightMax,
            autoWidth = _props5.autoWidth,
            autoWidthMin = _props5.autoWidthMin,
            autoWidthMax = _props5.autoWidthMax,
            style = _props5.style,
            children = _props5.children,
            props = _objectWithoutProperties(_props5, ['onScroll', 'onScrollFrame', 'onScrollStart', 'onScrollStop', 'onUpdate', 'renderView', 'renderTrackHorizontal', 'renderTrackVertical', 'renderThumbHorizontal', 'renderThumbVertical', 'tagName', 'hideTracksWhenNotNeeded', 'autoHide', 'autoHideTimeout', 'autoHideDuration', 'thumbSize', 'thumbMinSize', 'universal', 'autoHeight', 'autoHeightMin', 'autoHeightMax', 'autoWidth', 'autoWidthMin', 'autoWidthMax', 'style', 'children']);
        /* eslint-enable no-unused-vars */

        var didMountUniversal = this.state.didMountUniversal;


        var containerStyle = _extends({}, _styles.containerStyleDefault, autoHeight && _extends({}, _styles.containerStyleAutoHeight, {
            minHeight: autoHeightMin,
            maxHeight: autoHeightMax
        }), style);

        var viewStyle = _extends({}, _styles.viewStyleDefault, {
            // Hide scrollbars by setting a negative margin
            marginRight: -this.getPaddingWidth() + (scrollbarWidth ? -scrollbarWidth : 0),
            marginBottom: -this.getPaddingHeight() + (scrollbarWidth ? -scrollbarWidth : 0)
        }, autoHeight && _extends({}, _styles.viewStyleAutoHeight, {
            // Add paddingHeight and scrollbarWidth to autoHeight in order to compensate negative margins
            minHeight: (0, _isString2["default"])(autoHeightMin) ? 'calc(' + autoHeightMin + ' + ' + (this.getPaddingHeight() + scrollbarWidth) + 'px)' : autoHeightMin + this.getPaddingHeight() + scrollbarWidth,
            maxHeight: (0, _isString2["default"])(autoHeightMax) ? 'calc(' + autoHeightMax + ' + ' + (this.getPaddingHeight() + scrollbarWidth) + 'px)' : autoHeightMax + this.getPaddingHeight() + scrollbarWidth
        }), autoHeight && universal && !didMountUniversal && {
            minHeight: autoHeightMin,
            maxHeight: autoHeightMax
        }, universal && !didMountUniversal && _styles.viewStyleUniversalInitial);

        var viewWrapperStyle = _extends({}, _styles.viewWrapperStyleDefault, autoWidth && _extends({}, _styles.viewWrapperStyleAutoHeight, {
            minWidth: autoWidthMin,
            maxWidth: autoWidthMax
        }));

        var viewWrappedStyle = _extends({}, _styles.viewWrappedStyleDefault);

        var trackAutoHeightStyle = {
            transition: 'opacity ' + autoHideDuration + 'ms',
            opacity: 0
        };

        var trackHorizontalStyle = _extends({}, _styles.trackHorizontalStyleDefault, autoHide && trackAutoHeightStyle, universal && !didMountUniversal && {
            display: 'none'
        });

        var trackVerticalStyle = _extends({}, _styles.trackVerticalStyleDefault, autoHide && trackAutoHeightStyle, universal && !didMountUniversal && {
            display: 'none'
        });

        return (0, _react.createElement)(tagName, { className: props.className ? props.className : '', style: containerStyle, ref: 'container' }, [(0, _react.createElement)('div', { style: viewStyle, key: 'view', ref: 'view' }, [(0, _react.createElement)('div', { style: viewWrapperStyle, key: 'viewWrapper', ref: 'viewWrapper' }, [(0, _react.cloneElement)(renderView({ style: viewWrappedStyle }), { key: 'viewWrapped', ref: 'viewWrapped' }, children)])]), (0, _react.cloneElement)(renderTrackHorizontal({ style: trackHorizontalStyle }), { key: 'trackHorizontal', ref: 'trackHorizontal' }, (0, _react.cloneElement)(renderThumbHorizontal({ style: _styles.thumbHorizontalStyleDefault }), { ref: 'thumbHorizontal' })), (0, _react.cloneElement)(renderTrackVertical({ style: trackVerticalStyle }), { key: 'trackVertical', ref: 'trackVertical' }, (0, _react.cloneElement)(renderThumbVertical({ style: _styles.thumbVerticalStyleDefault }), { ref: 'thumbVertical' }))]);
    }
});