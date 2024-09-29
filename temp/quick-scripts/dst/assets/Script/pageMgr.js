
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/pageMgr.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'a1bb7xaDvtHXLTuIo0MRIEu', 'pageMgr');
// Script/pageMgr.js

"use strict";

/**
 * @author heyuchang
 * @file  通用页面控制器和适配
 */
var AC = require('action');

cc.Class({
  "extends": cc.Component,
  properties: {
    status: 0,
    //页面状态
    pages: [cc.Node]
  },
  // 0 开始游戏页面
  // 1 游戏页面
  // 2 UI页面
  // 3 过关页面
  // 4 失败页面
  // 5 复活页面
  // 6 排行榜页面
  start: function start() {
    this.lateStart();
  },
  lateStart: function lateStart() {
    this.width = cc.winSize.width;
    window.width = this.width;
    this.height = cc.winSize.height;
    window.height = this.height; // 存为全局变量

    this.adoptCanvas();
  },
  // 适配解决方案
  adoptCanvas: function adoptCanvas() {
    var canvas = cc.director.getScene().getChildByName('Canvas').getComponent(cc.Canvas); // 设计分辨率比

    var rateR = canvas.designResolution.height / canvas.designResolution.width; // 显示分辨率比

    var rateV = this.height / this.width;

    if (rateV > rateR) {
      canvas.fitHeight = false;
      canvas.fitWidth = true;
    } else {
      canvas.fitHeight = true;
      canvas.fitWidth = false;
    }
  },
  onOpenPage: function onOpenPage(num, callFun) {
    this.closeAllPages();
    this.pages[num].active = true; // if (callFun) {
    //   this.callFun();
    // }
  },
  addPage: function addPage(num, callFun) {
    this.pages[num].scale = 0.5;
    this.pages[num].active = true;
    this.pages[num].runAction(AC.popOut(0.5)); // if (callFun) {
    //   this.callFun();
    // }
  },
  removePage: function removePage(num, callFun) {
    var _this = this;

    this.pages[num].runAction(cc.sequence(AC.popIn(0.5), cc.callFunc(function () {
      _this.pages[num].active = false;
    }, this))); // if (callFun) {
    //   this.callFun();
    // }
  },
  onButtonOpenPage: function onButtonOpenPage(event, cust) {
    this.onOpenPage(cust);
  },
  onButtonAddPage: function onButtonAddPage(event, cust) {
    this.addPage(cust);
  },
  onButtonRemovePage: function onButtonRemovePage(event, cust) {
    this.removePage(cust);
  },
  closeAllPages: function closeAllPages() {
    this.pages.forEach(function (element) {
      element.active = false;
    });
  }
});

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxwYWdlTWdyLmpzIl0sIm5hbWVzIjpbIkFDIiwicmVxdWlyZSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwic3RhdHVzIiwicGFnZXMiLCJOb2RlIiwic3RhcnQiLCJsYXRlU3RhcnQiLCJ3aWR0aCIsIndpblNpemUiLCJ3aW5kb3ciLCJoZWlnaHQiLCJhZG9wdENhbnZhcyIsImNhbnZhcyIsImRpcmVjdG9yIiwiZ2V0U2NlbmUiLCJnZXRDaGlsZEJ5TmFtZSIsImdldENvbXBvbmVudCIsIkNhbnZhcyIsInJhdGVSIiwiZGVzaWduUmVzb2x1dGlvbiIsInJhdGVWIiwiZml0SGVpZ2h0IiwiZml0V2lkdGgiLCJvbk9wZW5QYWdlIiwibnVtIiwiY2FsbEZ1biIsImNsb3NlQWxsUGFnZXMiLCJhY3RpdmUiLCJhZGRQYWdlIiwic2NhbGUiLCJydW5BY3Rpb24iLCJwb3BPdXQiLCJyZW1vdmVQYWdlIiwic2VxdWVuY2UiLCJwb3BJbiIsImNhbGxGdW5jIiwib25CdXR0b25PcGVuUGFnZSIsImV2ZW50IiwiY3VzdCIsIm9uQnV0dG9uQWRkUGFnZSIsIm9uQnV0dG9uUmVtb3ZlUGFnZSIsImZvckVhY2giLCJlbGVtZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBSUEsSUFBSUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsUUFBRCxDQUFoQjs7QUFDQUMsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFFUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLE1BQU0sRUFBRSxDQURFO0FBQ0M7QUFDWEMsSUFBQUEsS0FBSyxFQUFFLENBQUNMLEVBQUUsQ0FBQ00sSUFBSjtBQUZHLEdBRkw7QUFNUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQyxFQUFBQSxLQWRPLG1CQWNDO0FBQ04sU0FBS0MsU0FBTDtBQUNELEdBaEJNO0FB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eUI7QUFDOUIsU0FBS04sVUFBTCxDQUFnQk0sSUFBaEI7QUFDRCxHQXhFTTtBQXlFUFosRUFBQUEsYUF6RU8sMkJBeUVTO0FBQ2QsU0FBS3ZCLEtBQUwsQ0FBV3NDLE9BQVgsQ0FBbUIsVUFBQUMsT0FBTyxFQUFJO0FBQzVCQSxNQUFBQSxPQUFPLENBQUNmLE1BQVIsR0FBaUIsS0FBakI7QUFDRCxLQUZEO0FBR0Q7QUE3RU0sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAYXV0aG9yIGhleXVjaGFuZ1xuICogQGZpbGUgIOmAmueUqOmhtemdouaOp+WItuWZqOWSjOmAgumFjVxuICovXG52YXIgQUMgPSByZXF1aXJlKCdhY3Rpb24nKVxuY2MuQ2xhc3Moe1xuICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBzdGF0dXM6IDAsIC8v6aG16Z2i54q25oCBXG4gICAgcGFnZXM6IFtjYy5Ob2RlXSxcbiAgfSxcbiAgLy8gMCDlvIDlp4vmuLjmiI/pobXpnaJcbiAgLy8gMSDmuLjmiI/pobXpnaJcbiAgLy8gMiBVSemhtemdolxuICAvLyAzIOi/h+WFs+mhtemdolxuICAvLyA0IOWksei0pemhtemdolxuICAvLyA1IOWkjea0u+mhtemdolxuICAvLyA2IOaOkuihjOamnOmhtemdolxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMubGF0ZVN0YXJ0KClcbiAgfSxcbiAgbGF0ZVN0YXJ0KCkge1xuICAgIHRoaXMud2lkdGggPSBjYy53aW5TaXplLndpZHRoXG4gICAgd2luZG93LndpZHRoID0gdGhpcy53aWR0aFxuICAgIHRoaXMuaGVpZ2h0ID0gY2Mud2luU2l6ZS5oZWlnaHRcbiAgICB3aW5kb3cuaGVpZ2h0ID0gdGhpcy5oZWlnaHRcbiAgICAvLyDlrZjkuLrlhajlsYDlj5jph49cbiAgICB0aGlzLmFkb3B0Q2FudmFzKClcbiAgfSxcbiAgLy8g6YCC6YWN6Kej5Yaz5pa55qGIXG4gIGFkb3B0Q2FudmFzKCkge1xuICAgIGxldCBjYW52YXMgPSBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmdldENoaWxkQnlOYW1lKCdDYW52YXMnKS5nZXRDb21wb25lbnQoY2MuQ2FudmFzKVxuICAgIC8vIOiuvuiuoeWIhui+qOeOh+avlFxuICAgIGxldCByYXRlUiA9IGNhbnZhcy5kZXNpZ25SZXNvbHV0aW9uLmhlaWdodCAvIGNhbnZhcy5kZXNpZ25SZXNvbHV0aW9uLndpZHRoO1xuICAgIC8vIOaYvuekuuWIhui+qOeOh+avlFxuICAgIGxldCByYXRlViA9IHRoaXMuaGVpZ2h0IC8gdGhpcy53aWR0aDtcbiAgICBpZiAocmF0ZVYgPiByYXRlUikge1xuICAgICAgY2FudmFzLmZpdEhlaWdodCA9IGZhbHNlO1xuICAgICAgY2FudmFzLmZpdFdpZHRoID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FudmFzLmZpdEhlaWdodCA9IHRydWU7XG4gICAgICBjYW52YXMuZml0V2lkdGggPSBmYWxzZTtcbiAgICB9XG4gIH0sXG5cbiAgb25PcGVuUGFnZShudW0sIGNhbGxGdW4pIHtcbiAgICB0aGlzLmNsb3NlQWxsUGFnZXMoKVxuICAgIHRoaXMucGFnZXNbbnVtXS5hY3RpdmUgPSB0cnVlXG4gICAgLy8gaWYgKGNhbGxGdW4pIHtcbiAgICAvLyAgIHRoaXMuY2FsbEZ1bigpO1xuICAgIC8vIH1cbiAgfSxcbiAgYWRkUGFnZShudW0sIGNhbGxGdW4pIHtcbiAgICB0aGlzLnBhZ2VzW251bV0uc2NhbGUgPSAwLjVcbiAgICB0aGlzLnBhZ2VzW251bV0uYWN0aXZlID0gdHJ1ZVxuICAgIHRoaXMucGFnZXNbbnVtXS5ydW5BY3Rpb24oQUMucG9wT3V0KDAuNSkpXG4gICAgLy8gaWYgKGNhbGxGdW4pIHtcbiAgICAvLyAgIHRoaXMuY2FsbEZ1bigpO1xuICAgIC8vIH1cbiAgfSxcbiAgcmVtb3ZlUGFnZShudW0sIGNhbGxGdW4pIHtcbiAgICB0aGlzLnBhZ2VzW251bV0ucnVuQWN0aW9uKGNjLnNlcXVlbmNlKEFDLnBvcEluKDAuNSksY2MuY2FsbEZ1bmMoKCk9PntcbiAgICAgIHRoaXMucGFnZXNbbnVtXS5hY3RpdmUgPSBmYWxzZVxuICAgIH0sdGhpcykpKVxuICAgIC8vIGlmIChjYWxsRnVuKSB7XG4gICAgLy8gICB0aGlzLmNhbGxGdW4oKTtcbiAgICAvLyB9XG4gIH0sXG4gIG9uQnV0dG9uT3BlblBhZ2UoZXZlbnQsIGN1c3QpIHtcbiAgICB0aGlzLm9uT3BlblBhZ2UoY3VzdCk7XG4gIH0sXG4gIG9uQnV0dG9uQWRkUGFnZShldmVudCwgY3VzdCkge1xuICAgIHRoaXMuYWRkUGFnZShjdXN0KTtcbiAgfSxcbiAgb25CdXR0b25SZW1vdmVQYWdlKGV2ZW50LCBjdXN0KSB7XG4gICAgdGhpcy5yZW1vdmVQYWdlKGN1c3QpO1xuICB9LFxuICBjbG9zZUFsbFBhZ2VzKCkge1xuICAgIHRoaXMucGFnZXMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgIGVsZW1lbnQuYWN0aXZlID0gZmFsc2VcbiAgICB9KTtcbiAgfSxcbn0pOyJdfQ==