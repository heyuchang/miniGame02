
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
var AC = require('GameAct');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxwYWdlTWdyLmpzIl0sIm5hbWVzIjpbIkFDIiwicmVxdWlyZSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwic3RhdHVzIiwicGFnZXMiLCJOb2RlIiwic3RhcnQiLCJsYXRlU3RhcnQiLCJ3aWR0aCIsIndpblNpemUiLCJ3aW5kb3ciLCJoZWlnaHQiLCJhZG9wdENhbnZhcyIsImNhbnZhcyIsImRpcmVjdG9yIiwiZ2V0U2NlbmUiLCJnZXRDaGlsZEJ5TmFtZSIsImdldENvbXBvbmVudCIsIkNhbnZhcyIsInJhdGVSIiwiZGVzaWduUmVzb2x1dGlvbiIsInJhdGVWIiwiZml0SGVpZ2h0IiwiZml0V2lkdGgiLCJvbk9wZW5QYWdlIiwibnVtIiwiY2FsbEZ1biIsImNsb3NlQWxsUGFnZXMiLCJhY3RpdmUiLCJhZGRQYWdlIiwic2NhbGUiLCJydW5BY3Rpb24iLCJwb3BPdXQiLCJyZW1vdmVQYWdlIiwic2VxdWVuY2UiLCJwb3BJbiIsImNhbGxGdW5jIiwib25CdXR0b25PcGVuUGFnZSIsImV2ZW50IiwiY3VzdCIsIm9uQnV0dG9uQWRkUGFnZSIsIm9uQnV0dG9uUmVtb3ZlUGFnZSIsImZvckVhY2giLCJlbGVtZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBSUEsSUFBSUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsU0FBRCxDQUFoQjs7QUFDQUMsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFFUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLE1BQU0sRUFBRSxDQURFO0FBQ0M7QUFDWEMsSUFBQUEsS0FBSyxFQUFFLENBQUNMLEVBQUUsQ0FBQ00sSUFBSjtBQUZHLEdBRkw7QUFNUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQyxFQUFBQSxLQWRPLG1CQWNDO0FBQ04sU0FBS0MsU0FBTDtBQUNELEdBaEJNO0FB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eUI7QUFDOUIsU0FBS04sVUFBTCxDQUFnQk0sSUFBaEI7QUFDRCxHQXhFTTtBQXlFUFosRUFBQUEsYUF6RU8sMkJBeUVTO0FBQ2QsU0FBS3ZCLEtBQUwsQ0FBV3NDLE9BQVgsQ0FBbUIsVUFBQUMsT0FBTyxFQUFJO0FBQzVCQSxNQUFBQSxPQUFPLENBQUNmLE1BQVIsR0FBaUIsS0FBakI7QUFDRCxLQUZEO0FBR0Q7QUE3RU0sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAYXV0aG9yIGhleXVjaGFuZ1xuICogQGZpbGUgIOmAmueUqOmhtemdouaOp+WItuWZqOWSjOmAgumFjVxuICovXG52YXIgQUMgPSByZXF1aXJlKCdHYW1lQWN0JylcbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgc3RhdHVzOiAwLCAvL+mhtemdoueKtuaAgVxuICAgIHBhZ2VzOiBbY2MuTm9kZV0sXG4gIH0sXG4gIC8vIDAg5byA5aeL5ri45oiP6aG16Z2iXG4gIC8vIDEg5ri45oiP6aG16Z2iXG4gIC8vIDIgVUnpobXpnaJcbiAgLy8gMyDov4flhbPpobXpnaJcbiAgLy8gNCDlpLHotKXpobXpnaJcbiAgLy8gNSDlpI3mtLvpobXpnaJcbiAgLy8gNiDmjpLooYzmppzpobXpnaJcblxuICBzdGFydCgpIHtcbiAgICB0aGlzLmxhdGVTdGFydCgpXG4gIH0sXG4gIGxhdGVTdGFydCgpIHtcbiAgICB0aGlzLndpZHRoID0gY2Mud2luU2l6ZS53aWR0aFxuICAgIHdpbmRvdy53aWR0aCA9IHRoaXMud2lkdGhcbiAgICB0aGlzLmhlaWdodCA9IGNjLndpblNpemUuaGVpZ2h0XG4gICAgd2luZG93LmhlaWdodCA9IHRoaXMuaGVpZ2h0XG4gICAgLy8g5a2Y5Li65YWo5bGA5Y+Y6YePXG4gICAgdGhpcy5hZG9wdENhbnZhcygpXG4gIH0sXG4gIC8vIOmAgumFjeino+WGs+aWueahiFxuICBhZG9wdENhbnZhcygpIHtcbiAgICBsZXQgY2FudmFzID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZSgnQ2FudmFzJykuZ2V0Q29tcG9uZW50KGNjLkNhbnZhcylcbiAgICAvLyDorr7orqHliIbovqjnjofmr5RcbiAgICBsZXQgcmF0ZVIgPSBjYW52YXMuZGVzaWduUmVzb2x1dGlvbi5oZWlnaHQgLyBjYW52YXMuZGVzaWduUmVzb2x1dGlvbi53aWR0aDtcbiAgICAvLyDmmL7npLrliIbovqjnjofmr5RcbiAgICBsZXQgcmF0ZVYgPSB0aGlzLmhlaWdodCAvIHRoaXMud2lkdGg7XG4gICAgaWYgKHJhdGVWID4gcmF0ZVIpIHtcbiAgICAgIGNhbnZhcy5maXRIZWlnaHQgPSBmYWxzZTtcbiAgICAgIGNhbnZhcy5maXRXaWR0aCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbnZhcy5maXRIZWlnaHQgPSB0cnVlO1xuICAgICAgY2FudmFzLmZpdFdpZHRoID0gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIG9uT3BlblBhZ2UobnVtLCBjYWxsRnVuKSB7XG4gICAgdGhpcy5jbG9zZUFsbFBhZ2VzKClcbiAgICB0aGlzLnBhZ2VzW251bV0uYWN0aXZlID0gdHJ1ZVxuICAgIC8vIGlmIChjYWxsRnVuKSB7XG4gICAgLy8gICB0aGlzLmNhbGxGdW4oKTtcbiAgICAvLyB9XG4gIH0sXG4gIGFkZFBhZ2UobnVtLCBjYWxsRnVuKSB7XG4gICAgdGhpcy5wYWdlc1tudW1dLnNjYWxlID0gMC41XG4gICAgdGhpcy5wYWdlc1tudW1dLmFjdGl2ZSA9IHRydWVcbiAgICB0aGlzLnBhZ2VzW251bV0ucnVuQWN0aW9uKEFDLnBvcE91dCgwLjUpKVxuICAgIC8vIGlmIChjYWxsRnVuKSB7XG4gICAgLy8gICB0aGlzLmNhbGxGdW4oKTtcbiAgICAvLyB9XG4gIH0sXG4gIHJlbW92ZVBhZ2UobnVtLCBjYWxsRnVuKSB7XG4gICAgdGhpcy5wYWdlc1tudW1dLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShBQy5wb3BJbigwLjUpLGNjLmNhbGxGdW5jKCgpPT57XG4gICAgICB0aGlzLnBhZ2VzW251bV0uYWN0aXZlID0gZmFsc2VcbiAgICB9LHRoaXMpKSlcbiAgICAvLyBpZiAoY2FsbEZ1bikge1xuICAgIC8vICAgdGhpcy5jYWxsRnVuKCk7XG4gICAgLy8gfVxuICB9LFxuICBvbkJ1dHRvbk9wZW5QYWdlKGV2ZW50LCBjdXN0KSB7XG4gICAgdGhpcy5vbk9wZW5QYWdlKGN1c3QpO1xuICB9LFxuICBvbkJ1dHRvbkFkZFBhZ2UoZXZlbnQsIGN1c3QpIHtcbiAgICB0aGlzLmFkZFBhZ2UoY3VzdCk7XG4gIH0sXG4gIG9uQnV0dG9uUmVtb3ZlUGFnZShldmVudCwgY3VzdCkge1xuICAgIHRoaXMucmVtb3ZlUGFnZShjdXN0KTtcbiAgfSxcbiAgY2xvc2VBbGxQYWdlcygpIHtcbiAgICB0aGlzLnBhZ2VzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICBlbGVtZW50LmFjdGl2ZSA9IGZhbHNlXG4gICAgfSk7XG4gIH0sXG59KTsiXX0=