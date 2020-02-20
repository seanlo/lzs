/***
@lzs/utils - Countdown
Author: Sean Lo, http://seanlo.github.io
***/
function Countdown(options) {
  this.timer = 0;
  this.options = options || {};
  for (var i in Countdown.DEFAULTS) {
    !this.options.hasOwnProperty(i) &&
      (this.options[i] = Countdown.DEFAULTS[i]);
  }
  if (options.referTime !== undefined) {
    this.options.diffTime = options.referTime - new Date().getTime() + 200; //200ms为js误差校准
  }
  this.count();
}
Countdown.CONST = {
  D: 24 * 3600 * 1000,
  H: 3600 * 1000,
  M: 60 * 1000,
  S: 1000
};
Countdown.DEFAULTS = {
  diffTime: 0,
  endTime: new Date().getTime() + Countdown.CONST.D,
  nodeTimes: [],
  onEnd: function() {},
  onTime: function() {}
};
Countdown.prototype.carry = function(s) {
  s = Math.floor(s);
  s = s < 10 ? "0" + s : s;
  return s.toString().split("");
};
Countdown.prototype.count = function() {
  var html = "",
    _this = this,
    now = new Date().getTime() + _this.options.diffTime,
    left = _this.options.endTime - now;

  if (left > 0) {
    if (_this.options.element) {
      var D = _this.carry(left / Countdown.CONST.D),
        H = _this.carry((left % Countdown.CONST.D) / Countdown.CONST.H),
        M = _this.carry((left % Countdown.CONST.H) / Countdown.CONST.M),
        S = _this.carry((left % Countdown.CONST.M) / Countdown.CONST.S);

      if (left / Countdown.CONST.D >= 1) {
        html +=
          '<b class="d1">' +
          D[0] +
          "</b>" +
          '<b class="d2">' +
          D[1] +
          "</b><span>天</span>";
      }

      html +=
        '<b class="h1">' +
        H[0] +
        "</b>" +
        '<b class="h2">' +
        H[1] +
        "</b><span>时</span>" +
        '<b class="m1">' +
        M[0] +
        "</b>" +
        '<b class="m2">' +
        M[1] +
        "</b><span>分</span>" +
        '<b class="s1">' +
        S[0] +
        "</b>" +
        '<b class="s2">' +
        S[1] +
        "</b><span>秒</span>";

      _this.options.element.innerHTML = html;
    }

    //if we give the nodeTimes then execute the callback function at each time node;
    if (
      _this.options.nodeTimes !== undefined &&
      _this.options.nodeTimes.length > 0 &&
      Object.prototype.toString.call(_this.options.onTime) ===
        "[object Function]"
    ) {
      for (var i = 0, len = _this.options.nodeTimes.length; i < len; i++) {
        if (
          now >= _this.options.nodeTimes[i] - 600 &&
          now <= _this.options.nodeTimes[i] + 600
        ) {
          _this.options.onTime.call(_this, i, _this.options.nodeTimes[i]);
        }
      }
    }

    //loop
    _this.timer = setTimeout(function() {
      _this.count();
    }, 1000);
  } else {
    if (_this.options.element) {
      html +=
        '<b class="h1">0</b><b class="h2">0</b><span>时</span><b class="m1">0</b><b class="m2">0</b><span>分</span><b class="s1">0</b><b class="s2">0</b><span>秒</span>';
      _this.options.element.innerHTML = html;
    }

    //count end callback
    if (
      Object.prototype.toString.call(_this.options.onEnd) ===
      "[object Function]"
    ) {
      _this.options.onEnd.call(this);
    }
  }
};

module.exports = Countdown;
