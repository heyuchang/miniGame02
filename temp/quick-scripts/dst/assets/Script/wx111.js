
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/wx111.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f33c5v8FmBF47kPNI4VMjKM', 'wx111');
// Script/wx111.js

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var env = {
  USER_DATA_PATH: ""
};

var FileSystemManager = /*#__PURE__*/function () {
  function FileSystemManager() {
    _classCallCheck(this, FileSystemManager);
  }

  _createClass(FileSystemManager, [{
    key: "stat",
    value: function stat() {
      return {};
    }
  }]);

  return FileSystemManager;
}();

var WXColl = /*#__PURE__*/function () {
  function WXColl() {
    _classCallCheck(this, WXColl);
  }

  _createClass(WXColl, [{
    key: "get",
    value: function get() {
      return new Promise(function () {}, function () {});
    }
  }]);

  return WXColl;
}();

var WXDB = /*#__PURE__*/function () {
  function WXDB() {
    _classCallCheck(this, WXDB);
  }

  _createClass(WXDB, [{
    key: "collection",
    value: function collection() {
      return new WXColl();
    }
  }]);

  return WXDB;
}();

var WXClcoud = /*#__PURE__*/function () {
  function WXClcoud() {
    _classCallCheck(this, WXClcoud);
  }

  _createClass(WXClcoud, [{
    key: "database",
    value: function database() {
      return new WXDB();
    }
  }]);

  return WXClcoud;
}();

var wechat = /*#__PURE__*/function () {
  function wechat() {
    _classCallCheck(this, wechat);

    this.env = env;
    this.cloud = new WXClcoud();
  }

  _createClass(wechat, [{
    key: "createInnerAudioContext",
    value: function createInnerAudioContext() {
      return {
        stop: function stop() {},
        play: function play() {},
        onSeeked: function onSeeked() {}
      };
    }
  }, {
    key: "getSystemInfoSync",
    value: function getSystemInfoSync() {
      return {};
    }
  }, {
    key: "showShareMenu",
    value: function showShareMenu() {}
  }, {
    key: "updateShareMenu",
    value: function updateShareMenu() {}
  }, {
    key: "onShareAppMessage",
    value: function onShareAppMessage() {}
  }, {
    key: "shareAppMessage",
    value: function shareAppMessage() {}
  }, {
    key: "createRewardedVideoAd",
    value: function createRewardedVideoAd() {
      return {
        onLoad: function onLoad() {},
        onError: function onError() {},
        onClose: function onClose() {},
        load: function load() {
          return new Promise(function () {}, function () {});
        }
      };
    }
  }, {
    key: "vibrateShort",
    value: function vibrateShort() {}
  }, {
    key: "createBannerAd",
    value: function createBannerAd() {
      return {
        onLoad: function onLoad() {},
        onResize: function onResize() {},
        onError: function onError() {},
        show: function show() {},
        hide: function hide() {},
        destroy: function destroy() {}
      };
    }
  }, {
    key: "getFileSystemManager",
    value: function getFileSystemManager() {
      if (!this.fs) {
        this.fs = new FileSystemManager();
      }

      return this.fs;
    }
  }, {
    key: "login",
    value: function login() {}
  }, {
    key: "getSystemInfo",
    value: function getSystemInfo() {}
  }, {
    key: "onShow",
    value: function onShow() {}
  }, {
    key: "postMessage",
    value: function postMessage() {}
  }, {
    key: "request",
    value: function request(e) {}
  }, {
    key: "onAudioInterruptionEnd",
    value: function onAudioInterruptionEnd() {}
  }, {
    key: "onHide",
    value: function onHide() {}
  }, {
    key: "getStorageSync",
    value: function getStorageSync() {
      return "";
    }
  }]);

  return wechat;
}();

if (!window.wx) {
  window.wx = new wechat();
}

cc._RF.pop();
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFx3eDExMS5qcyJdLCJuYW1lcyI6WyJlbnYiLCJVU0VSX0RBVEFfUEFUSCIsIkZpbGVTeXN0ZW1NYW5hZ2VyIiwiV1hDb2xsIiwiUHJvbWlzZSIsIldYREIiLCJXWENsY291ZCIsIndlY2hhdCIsImNsb3VkIiwic3RvcCIsInBsYXkiLCJvblNlZWtlZCIsIm9uTG9hZCIsIm9uRXJyb3IiLCJvbkNsb3NlIiwibG9hZCIsIm9uUmVzaXplIiwic2hvdyIsImhpZGUiLCJkZXN0cm95IiwiZnMiLCJlIiwid2luZG93Iiwid3giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsR0FBRyxHQUFHO0FBQ05DLEVBQUFBLGNBQWMsRUFBRTtBQURWLENBQVY7O0lBSU1DOzs7Ozs7OzJCQUNLO0FBQ0gsYUFBTyxFQUFQO0FBQ0g7Ozs7OztJQUdDQzs7Ozs7OzswQkFDSTtBQUNGLGFBQU8sSUFBSUMsT0FBSixDQUFZLFlBQUksQ0FBRSxDQUFsQixFQUFvQixZQUFJLENBQUUsQ0FBMUIsQ0FBUDtBQUNIOzs7Ozs7SUFHQ0M7Ozs7Ozs7aUNBQ1c7QUFDVCxhQUFPLElBQUlGLE1BQUosRUFBUDtBQUNIOzs7Ozs7SUFHQ0c7QUFDRixzQkFBYztBQUFBO0FBQ2I7Ozs7K0JBRVU7QUFDUCxhQUFPLElBQUlELElBQUosRUFBUDtBQUNIOzs7Ozs7SUFHQ0U7QUFDRixvQkFBYztBQUFBOztBQUNWLFNBQUtQLEdBQUwsR0FBV0EsR0FBWDtBQUNBLFNBQUtRLEtBQUwsR0FBYSxJQUFJRixRQUFKLEVBQWI7QUFDSDs7Ozs4Q0FFMEI7QUFDdkIsYUFBTztBQUNIRyxRQUFBQSxJQURHLGtCQUNJLENBQUUsQ0FETjtBQUVIQyxRQUFBQSxJQUZHLGtCQUVJLENBQUUsQ0FGTjtBQUdIQyxRQUFBQSxRQUhHLHNCQUdRLENBQUU7QUFIVixPQUFQO0FBS0g7Ozt3Q0FDb0I7QUFDakIsYUFBTyxFQUFQO0FBQ0g7OztvQ0FFZSxDQUVmOzs7c0NBRWlCLENBRWpCOzs7d0NBRW1CLENBRW5COzs7c0NBQ2lCLENBRWpCOzs7NENBQ3VCO0FBQ3BCLGFBQU87QUFDSEMsUUFBQUEsTUFERyxvQkFDTSxDQUFFLENBRFI7QUFFSEMsUUFBQUEsT0FGRyxxQkFFTyxDQUFFLENBRlQ7QUFHSEMsUUFBQUEsT0FIRyxxQkFHTyxDQUFFLENBSFQ7QUFJSEMsUUFBQUEsSUFKRyxrQkFJSTtBQUNILGlCQUFPLElBQUlYLE9BQUosQ0FBWSxZQUFJLENBQUUsQ0FBbEIsRUFBb0IsWUFBSSxDQUFFLENBQTFCLENBQVA7QUFDSDtBQU5FLE9BQVA7QUFRSDs7O21DQUNjLENBQUU7OztxQ0FFQTtBQUNiLGFBQU87QUFDSFEsUUFBQUEsTUFERyxvQkFDTSxDQUFFLENBRFI7QUFFSEksUUFBQUEsUUFGRyxzQkFFUSxDQUFFLENBRlY7QUFHSEgsUUFBQUEsT0FIRyxxQkFHTyxDQUFFLENBSFQ7QUFJSEksUUFBQUEsSUFKRyxrQkFJSSxDQUFFLENBSk47QUFLSEMsUUFBQUEsSUFMRyxrQkFLSSxDQUFFLENBTE47QUFNSEMsUUFBQUEsT0FORyxxQkFNTyxDQUFFO0FBTlQsT0FBUDtBQVFIOzs7MkNBRXNCO0FBQ25CLFVBQUksQ0FBQyxLQUFLQyxFQUFWLEVBQWM7QUFDVixhQUFLQSxFQUFMLEdBQVUsSUFBSWxCLGlCQUFKLEVBQVY7QUFDSDs7QUFDRCxhQUFPLEtBQUtrQixFQUFaO0FBQ0g7Ozs0QkFFTyxDQUVQOzs7b0NBRWUsQ0FFZjs7OzZCQUVRLENBRVI7OztrQ0FDYSxDQUViOzs7NEJBRU9DLEdBQUcsQ0FDVjs7OzZDQUV5QixDQUV6Qjs7OzZCQUVRLENBRVI7OztxQ0FFZ0I7QUFDYixhQUFPLEVBQVA7QUFDSDs7Ozs7O0FBR0wsSUFBSSxDQUFDQyxNQUFNLENBQUNDLEVBQVosRUFBZ0I7QUFDWkQsRUFBQUEsTUFBTSxDQUFDQyxFQUFQLEdBQVksSUFBSWhCLE1BQUosRUFBWjtBQUNIIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgZW52ID0ge1xuICAgIFVTRVJfREFUQV9QQVRIOiBcIlwiLFxufVxuXG5jbGFzcyBGaWxlU3lzdGVtTWFuYWdlciB7XG4gICAgc3RhdCgpIHtcbiAgICAgICAgcmV0dXJuIHt9XG4gICAgfVxufVxuXG5jbGFzcyBXWENvbGwge1xuICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCgpPT57fSwgKCk9Pnt9KVxuICAgIH1cbn1cblxuY2xhc3MgV1hEQiB7XG4gICAgY29sbGVjdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBXWENvbGxcbiAgICB9XG59XG5cbmNsYXNzIFdYQ2xjb3VkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBkYXRhYmFzZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBXWERCXG4gICAgfVxufVxuXG5jbGFzcyB3ZWNoYXQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmVudiA9IGVudlxuICAgICAgICB0aGlzLmNsb3VkID0gbmV3IFdYQ2xjb3VkKClcbiAgICB9XG5cbiAgICBjcmVhdGVJbm5lckF1ZGlvQ29udGV4dCAoKSB7IFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RvcCgpIHt9LFxuICAgICAgICAgICAgcGxheSgpIHt9LFxuICAgICAgICAgICAgb25TZWVrZWQoKSB7fSxcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXRTeXN0ZW1JbmZvU3luYyAoKSB7XG4gICAgICAgIHJldHVybiB7fVxuICAgIH1cblxuICAgIHNob3dTaGFyZU1lbnUoKSB7XG5cbiAgICB9XG5cbiAgICB1cGRhdGVTaGFyZU1lbnUoKSB7XG5cbiAgICB9XG5cbiAgICBvblNoYXJlQXBwTWVzc2FnZSgpIHtcbiAgICAgICAgXG4gICAgfVxuICAgIHNoYXJlQXBwTWVzc2FnZSgpIHtcbiAgICAgICAgXG4gICAgfVxuICAgIGNyZWF0ZVJld2FyZGVkVmlkZW9BZCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9uTG9hZCgpIHt9LFxuICAgICAgICAgICAgb25FcnJvcigpIHt9LFxuICAgICAgICAgICAgb25DbG9zZSgpIHt9LFxuICAgICAgICAgICAgbG9hZCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKCk9Pnt9LCAoKT0+e30pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmlicmF0ZVNob3J0KCkge31cblxuICAgIGNyZWF0ZUJhbm5lckFkKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb25Mb2FkKCkge30sXG4gICAgICAgICAgICBvblJlc2l6ZSgpIHt9LFxuICAgICAgICAgICAgb25FcnJvcigpIHt9LFxuICAgICAgICAgICAgc2hvdygpIHt9LFxuICAgICAgICAgICAgaGlkZSgpIHt9LFxuICAgICAgICAgICAgZGVzdHJveSgpIHt9LFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RmlsZVN5c3RlbU1hbmFnZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5mcykge1xuICAgICAgICAgICAgdGhpcy5mcyA9IG5ldyBGaWxlU3lzdGVtTWFuYWdlclxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZzXG4gICAgfVxuXG4gICAgbG9naW4oKSB7XG5cbiAgICB9XG5cbiAgICBnZXRTeXN0ZW1JbmZvKCkge1xuXG4gICAgfVxuXG4gICAgb25TaG93KCkge1xuICAgICAgICBcbiAgICB9XG4gICAgcG9zdE1lc3NhZ2UoKSB7XG4gICAgICBcbiAgICB9XG5cbiAgICByZXF1ZXN0KGUpIHtcbiAgICB9XG5cbiAgICBvbkF1ZGlvSW50ZXJydXB0aW9uRW5kICgpIHtcblxuICAgIH1cblxuICAgIG9uSGlkZSgpIHtcblxuICAgIH1cblxuICAgIGdldFN0b3JhZ2VTeW5jKCkge1xuICAgICAgICByZXR1cm4gXCJcIlxuICAgIH1cbn1cblxuaWYgKCF3aW5kb3cud3gpIHtcbiAgICB3aW5kb3cud3ggPSBuZXcgd2VjaGF0XG59XG5cbiJdfQ==