/***
@lzs/utils - ImageLoader
Author: Sean Lo, http://seanlo.github.io
***/
function ImageLoader(options) {
  this.options = options || {};
  for (var i in ImageLoader.DEFAULTS) {
    !this.options.hasOwnProperty(i) &&
      (this.options[i] = ImageLoader.DEFAULTS[i]);
  }
  if (this.options.images.length === 0) {
    //return a empty instance if no images;
    return {};
  }
  this.total = this.options.images.length;
  this.complete = 0;
  this.loading();
}

ImageLoader.DEFAULTS = {
  images: [],
  load: 0,
  error: 0,
  abort: 0,
  current: 0,
  onEachComplete: function() {},
  onComplete: function() {}
};

ImageLoader.prototype.loading = function() {
  var _this = this,
    events = ["load", "error", "abort"];

  for (var i = 0, len = _this.options.images.length; i < len; i++) {
    var image = new Image();
    for (var j = 0; j < events.length; j++) {
      _this.binding(image, events[j]);
    }
    image.src = _this.options.images[i];
  }
};

ImageLoader.prototype.binding = function(image, type) {
  var _this = this;
  image["on" + type] = function() {
    _this.options[type]++;
    _this.complete++;
    if (
      Object.prototype.toString.call(_this.options.onEachComplete) ===
      "[object Function]"
    ) {
      _this.options.onEachComplete.call(_this);
    }
    if (_this.complete == _this.total) {
      if (
        Object.prototype.toString.call(_this.options.onEachComplete) ===
        "[object Function]"
      ) {
        _this.options.onComplete.call(_this);
      }
    }
  };
};

module.exports = ImageLoader;
