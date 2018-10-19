"use strict";
var Fraction = require("fraction.js");

function Rational(e, t) {
    this.numerator = e, this.denominator = t
}

var ZERO = new Rational(0, 1), ONE = new Rational(1, 1), ONE_THIRD = new Rational(1, 3),
    TWO_THIRDs = new Rational(2, 3);

function Rectangle() {
    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}, t = e.id, a = void 0 === t ? "" : t,
        n = e.left, i = e.top, l = e.relativesize;
    this.id = a, this.shape = "rectangle", this.area = {
        left: n || ZERO,
        top: i || ZERO,
        width: l || ZERO,
        height: l || ZERO
    }
}

function generateFluidTemplates(e) {
    var t = [], a = Math.sqrt(e);
    a = a > Math.floor(a) ? Math.floor(a) + 1 : Math.floor(a);
    for (var n = 1; n <= a; n++) {
        for (var i = [], l = new Rational(1, n), r = 1, o = 0; o < n; o++) for (var R = 0; R < n; R++) {
            var s = new Rectangle({
                id: String(r++),
                left: new Rational(R, n),
                top: new Rational(o, n),
                relativesize: l
            });
            i.push(s)
        }
        t.push({region: i})
    }
    return t
}

function generateLectureTemplates(e) {
    var t = [{
        region: [new Rectangle({
            id: "1",
            left: ZERO,
            top: ZERO,
            relativesize: ONE
        })]
    }, {
        region: [new Rectangle({id: "1", left: ZERO, top: ZERO, relativesize: TWO_THIRDs}), new Rectangle({
            id: "2",
            left: TWO_THIRDs,
            top: ZERO,
            relativesize: ONE_THIRD
        }), new Rectangle({id: "3", left: TWO_THIRDs, top: ONE_THIRD, relativesize: ONE_THIRD}), new Rectangle({
            id: "4",
            left: TWO_THIRDs,
            top: TWO_THIRDs,
            relativesize: ONE_THIRD
        }), new Rectangle({id: "5", left: ONE_THIRD, top: TWO_THIRDs, relativesize: ONE_THIRD}), new Rectangle({
            id: "6",
            left: ZERO,
            top: TWO_THIRDs,
            relativesize: ONE_THIRD
        })]
    }];
    if (6 < e) {
        s = 7 < (s = (s = e / 2) > Math.floor(s) ? s + 1 : s) ? 7 : s;
        for (var a = 4; a <= s; a++) {
            for (var n = new Rational(a - 1, a), i = new Rational(1, a), l = [new Rectangle({
                id: "1",
                left: ZERO,
                top: ZERO,
                relativesize: n
            })], r = 2, o = 0; o < a; o++) l.push(new Rectangle({
                id: "" + r++,
                left: n,
                top: new Rational(o, a),
                relativesize: i
            }));
            for (var R = a - 2; 0 <= R; R--) l.push(new Rectangle({
                id: "" + r++,
                left: new Rational(R, a),
                top: n,
                relativesize: i
            }));
            t.push({region: l})
        }
        if (14 < e) {
            var s;
            s = 7 < (s = (s = (e + 3) / 4) > Math.floor(s) ? s + 1 : s) ? 7 : s;
            for (a = 4; a <= s; a++) {
                for (n = new Rational(a - 2, a), i = new Rational(1, a), l = [new Rectangle({
                    id: "1",
                    left: ZERO,
                    top: ZERO,
                    relativesize: n
                })], r = 2, o = 0; o < a - 1; o++) l.push(new Rectangle({
                    id: "" + r++,
                    left: n,
                    top: new Rational(o, a),
                    relativesize: i
                }));
                for (R = a - 3; 0 <= R; R--) l.push(new Rectangle({
                    id: "" + r++,
                    left: new Rational(R, a),
                    top: n,
                    relativesize: i
                }));
                for (o = 0; o < a; o++) l.push(new Rectangle({
                    id: "" + r++,
                    left: new Rational(a - 1, a),
                    top: new Rational(o, a),
                    relativesize: i
                }));
                for (R = a - 2; 0 <= R; R--) l.push(new Rectangle({
                    id: "" + r++,
                    left: new Rational(R, a),
                    top: new Rational(a - 1, a),
                    relativesize: i
                }));
                t.push({region: l})
            }
        }
    }
    return t
}

function translateRational(e) {
    var t = new Fraction(e);
    return new Rational(t.n, t.d)
}

exports.templateType = {FLUID: "fluid", LECTURE: "lecture", VOID: "void"}, exports.applyTemplate = function (e, t, a) {
    var i = [];
    switch (e) {
        case"fluid":
            i = generateFluidTemplates(t);
            break;
        case"lecture":
            i = generateLectureTemplates(t);
            break;
        case"void":
            i = [];
            break;
        default:
            i = generateFluidTemplates(t)
    }
    return a && a.map(function (e) {
        var t, a = e.region.length;
        for (var n in e.region.forEach(function (e) {
            e.area && (e.area.left = translateRational(e.area.left), e.area.top = translateRational(e.area.top), e.area.width = translateRational(e.area.width), e.area.height = translateRational(e.area.height))
        }), i) if (i.hasOwnProperty(n) && i[n].region.length >= a) {
            t = n;
            break
        }
        void 0 === t ? i.push(e) : i[t].region.length === a ? i.splice(t, 1, e) : i.splice(t, 0, e)
    }), i
};