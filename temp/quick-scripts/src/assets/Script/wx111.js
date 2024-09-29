"use strict";
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