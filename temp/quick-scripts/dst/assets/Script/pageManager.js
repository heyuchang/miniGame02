
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/pageManager.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'a1bb7xaDvtHXLTuIo0MRIEu', 'pageManager');
// Script/pageManager.js

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxwYWdlTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJBQyIsInJlcXVpcmUiLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInN0YXR1cyIsInBhZ2VzIiwiTm9kZSIsInN0YXJ0IiwibGF0ZVN0YXJ0Iiwid2lkdGgiLCJ3aW5TaXplIiwid2luZG93IiwiaGVpZ2h0IiwiYWRvcHRDYW52YXMiLCJjYW52YXMiLCJkaXJlY3RvciIsImdldFNjZW5lIiwiZ2V0Q2hpbGRCeU5hbWUiLCJnZXRDb21wb25lbnQiLCJDYW52YXMiLCJyYXRlUiIsImRlc2lnblJlc29sdXRpb24iLCJyYXRlViIsImZpdEhlaWdodCIsImZpdFdpZHRoIiwib25PcGVuUGFnZSIsIm51bSIsImNhbGxGdW4iLCJjbG9zZUFsbFBhZ2VzIiwiYWN0aXZlIiwiYWRkUGFnZSIsInNjYWxlIiwicnVuQWN0aW9uIiwicG9wT3V0IiwicmVtb3ZlUGFnZSIsInNlcXVlbmNlIiwicG9wSW4iLCJjYWxsRnVuYyIsIm9uQnV0dG9uT3BlblBhZ2UiLCJldmVudCIsImN1c3QiLCJvbkJ1dHRvbkFkZFBhZ2UiLCJvbkJ1dHRvblJlbW92ZVBhZ2UiLCJmb3JFYWNoIiwiZWxlbWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUlBLElBQUlBLEVBQUUsR0FBR0MsT0FBTyxDQUFDLFNBQUQsQ0FBaEI7O0FBQ0FDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBRVBDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxNQUFNLEVBQUUsQ0FERTtBQUNDO0FBQ1hDLElBQUFBLEtBQUssRUFBRSxDQUFDTCxFQUFFLENBQUNNLElBQUo7QUFGRyxHQUZMO0FBTVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUMsRUFBQUEsS0FkTyxtQkFjQztBQUNOLFNBQUtDLFNBQUw7QUFDRCxHQWhC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RUFzRXlCO0FBQzlCLFNBQUtOLFVBQUwsQ0FBZ0JNLElBQWhCO0FBQ0QsR0F4RU07QUF5RVBaLEVBQUFBLGFBekVPLDJCQXlFUztBQUNkLFNBQUt2QixLQUFMLENBQVdzQyxPQUFYLENBQW1CLFVBQUFDLE9BQU8sRUFBSTtBQUM1QkEsTUFBQUEsT0FBTyxDQUFDZixNQUFSLEdBQWlCLEtBQWpCO0FBQ0QsS0FGRDtBQUdEO0FBN0VNLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBoZXl1Y2hhbmdcbiAqIEBmaWxlICDpgJrnlKjpobXpnaLmjqfliLblmajlkozpgILphY1cbiAqL1xudmFyIEFDID0gcmVxdWlyZSgnR2FtZUFjdCcpXG5jYy5DbGFzcyh7XG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgcHJvcGVydGllczoge1xuICAgIHN0YXR1czogMCwgLy/pobXpnaLnirbmgIFcbiAgICBwYWdlczogW2NjLk5vZGVdLFxuICB9LFxuICAvLyAwIOW8gOWni+a4uOaIj+mhtemdolxuICAvLyAxIOa4uOaIj+mhtemdolxuICAvLyAyIFVJ6aG16Z2iXG4gIC8vIDMg6L+H5YWz6aG16Z2iXG4gIC8vIDQg5aSx6LSl6aG16Z2iXG4gIC8vIDUg5aSN5rS76aG16Z2iXG4gIC8vIDYg5o6S6KGM5qac6aG16Z2iXG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5sYXRlU3RhcnQoKVxuICB9LFxuICBsYXRlU3RhcnQoKSB7XG4gICAgdGhpcy53aWR0aCA9IGNjLndpblNpemUud2lkdGhcbiAgICB3aW5kb3cud2lkdGggPSB0aGlzLndpZHRoXG4gICAgdGhpcy5oZWlnaHQgPSBjYy53aW5TaXplLmhlaWdodFxuICAgIHdpbmRvdy5oZWlnaHQgPSB0aGlzLmhlaWdodFxuICAgIC8vIOWtmOS4uuWFqOWxgOWPmOmHj1xuICAgIHRoaXMuYWRvcHRDYW52YXMoKVxuICB9LFxuICAvLyDpgILphY3op6PlhrPmlrnmoYhcbiAgYWRvcHRDYW52YXMoKSB7XG4gICAgbGV0IGNhbnZhcyA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoJ0NhbnZhcycpLmdldENvbXBvbmVudChjYy5DYW52YXMpXG4gICAgLy8g6K6+6K6h5YiG6L6o546H5q+UXG4gICAgbGV0IHJhdGVSID0gY2FudmFzLmRlc2lnblJlc29sdXRpb24uaGVpZ2h0IC8gY2FudmFzLmRlc2lnblJlc29sdXRpb24ud2lkdGg7XG4gICAgLy8g5pi+56S65YiG6L6o546H5q+UXG4gICAgbGV0IHJhdGVWID0gdGhpcy5oZWlnaHQgLyB0aGlzLndpZHRoO1xuICAgIGlmIChyYXRlViA+IHJhdGVSKSB7XG4gICAgICBjYW52YXMuZml0SGVpZ2h0ID0gZmFsc2U7XG4gICAgICBjYW52YXMuZml0V2lkdGggPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYW52YXMuZml0SGVpZ2h0ID0gdHJ1ZTtcbiAgICAgIGNhbnZhcy5maXRXaWR0aCA9IGZhbHNlO1xuICAgIH1cbiAgfSxcblxuICBvbk9wZW5QYWdlKG51bSwgY2FsbEZ1bikge1xuICAgIHRoaXMuY2xvc2VBbGxQYWdlcygpXG4gICAgdGhpcy5wYWdlc1tudW1dLmFjdGl2ZSA9IHRydWVcbiAgICAvLyBpZiAoY2FsbEZ1bikge1xuICAgIC8vICAgdGhpcy5jYWxsRnVuKCk7XG4gICAgLy8gfVxuICB9LFxuICBhZGRQYWdlKG51bSwgY2FsbEZ1bikge1xuICAgIHRoaXMucGFnZXNbbnVtXS5zY2FsZSA9IDAuNVxuICAgIHRoaXMucGFnZXNbbnVtXS5hY3RpdmUgPSB0cnVlXG4gICAgdGhpcy5wYWdlc1tudW1dLnJ1bkFjdGlvbihBQy5wb3BPdXQoMC41KSlcbiAgICAvLyBpZiAoY2FsbEZ1bikge1xuICAgIC8vICAgdGhpcy5jYWxsRnVuKCk7XG4gICAgLy8gfVxuICB9LFxuICByZW1vdmVQYWdlKG51bSwgY2FsbEZ1bikge1xuICAgIHRoaXMucGFnZXNbbnVtXS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoQUMucG9wSW4oMC41KSxjYy5jYWxsRnVuYygoKT0+e1xuICAgICAgdGhpcy5wYWdlc1tudW1dLmFjdGl2ZSA9IGZhbHNlXG4gICAgfSx0aGlzKSkpXG4gICAgLy8gaWYgKGNhbGxGdW4pIHtcbiAgICAvLyAgIHRoaXMuY2FsbEZ1bigpO1xuICAgIC8vIH1cbiAgfSxcbiAgb25CdXR0b25PcGVuUGFnZShldmVudCwgY3VzdCkge1xuICAgIHRoaXMub25PcGVuUGFnZShjdXN0KTtcbiAgfSxcbiAgb25CdXR0b25BZGRQYWdlKGV2ZW50LCBjdXN0KSB7XG4gICAgdGhpcy5hZGRQYWdlKGN1c3QpO1xuICB9LFxuICBvbkJ1dHRvblJlbW92ZVBhZ2UoZXZlbnQsIGN1c3QpIHtcbiAgICB0aGlzLnJlbW92ZVBhZ2UoY3VzdCk7XG4gIH0sXG4gIGNsb3NlQWxsUGFnZXMoKSB7XG4gICAgdGhpcy5wYWdlcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgZWxlbWVudC5hY3RpdmUgPSBmYWxzZVxuICAgIH0pO1xuICB9LFxufSk7Il19