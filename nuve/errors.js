"use strict";

function _classCallCheck(r, t) {
    if (!(r instanceof t)) throw new TypeError("Cannot call a class as a function")
}

function _possibleConstructorReturn(r, t) {
    if (!r) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !t || "object" != typeof t && "function" != typeof t ? r : t
}

function _inherits(r, t) {
    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
    r.prototype = Object.create(t && t.prototype, {
        constructor: {
            value: r,
            enumerable: !1,
            writable: !0,
            configurable: !0
        }
    }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(r, t) : r.__proto__ = t)
}

var AppError = function (r) {
    function n(r, t, e) {
        _classCallCheck(this, n);
        var o = _possibleConstructorReturn(this, (n.__proto__ || Object.getPrototypeOf(n)).call(this, r));
        return o.name = o.constructor.name, Error.captureStackTrace(o, o.constructor), o.status = t || 500, o.code = e || 2001, o.data = {
            error: {
                code: o.code,
                message: o.message
            }
        }, o
    }

    return _inherits(n, Error), n
}(), NotFoundError = function (r) {
    function e(r, t) {
        return _classCallCheck(this, e), t || (t = 1001, "string" == typeof r && (0 <= r.toLowerCase().indexOf("service") && (t = 1002), 0 <= r.toLowerCase().indexOf("room") && (t = 1003), 0 <= r.toLowerCase().indexOf("stream") && (t = 1004), 0 <= r.toLowerCase().indexOf("participant") && (t = 1005))), _possibleConstructorReturn(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r || "Resource not found", 404, t))
    }

    return _inherits(e, AppError), e
}(), AuthError = function (r) {
    function e(r, t) {
        return _classCallCheck(this, e), _possibleConstructorReturn(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r || "Authentication failed", 401, t || 1101))
    }

    return _inherits(e, AppError), e
}(), AccessError = function (r) {
    function e(r, t) {
        return _classCallCheck(this, e), _possibleConstructorReturn(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r || "Access forbiden", 403, t || 1102))
    }

    return _inherits(e, AppError), e
}(), BadRequestError = function (r) {
    function e(r, t) {
        return _classCallCheck(this, e), _possibleConstructorReturn(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r || "Bad request", 400, t || 1201))
    }

    return _inherits(e, AppError), e
}(), CloudError = function (r) {
    function e(r, t) {
        return _classCallCheck(this, e), _possibleConstructorReturn(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r || "Cloud handler failed", 500, t || 1301))
    }

    return _inherits(e, AppError), e
}();
module.exports = {
    AppError: AppError,
    NotFoundError: NotFoundError,
    AuthError: AuthError,
    AccessError: AccessError,
    CloudError: CloudError,
    BadRequestError: BadRequestError
};