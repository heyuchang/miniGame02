
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/startPage.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'b55a72WBPhBorvnSW4KT5tu', 'startPage');
// Script/startPage.js

"use strict";

/**
 * @author heyuchang
 * @file 开始页面控制
 */
cc.Class({
  "extends": cc.Component,
  properties: {
    bannerNode: cc.Node,
    labelNode: cc.Node
  },
  start: function start() {},
  onTouched: function onTouched() {},
  showAnimation: function showAnimation() {
    var _this = this;

    return new Promise(function (resolve, rejects) {
      var tween1 = cc.scaleTo(0.5, 0, 0).easing(cc.easeBackIn());
      var action2 = cc.blink(0.5, 3);

      _this.bannerNode.runAction(tween1);

      var action = cc.sequence(action2, cc.callFunc(function () {
        resolve();
      }));

      _this.labelNode.runAction(action);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzdGFydFBhZ2UuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJiYW5uZXJOb2RlIiwiTm9kZSIsImxhYmVsTm9kZSIsInN0YXJ0Iiwib25Ub3VjaGVkIiwic2hvd0FuaW1hdGlvbiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0cyIsInR3ZWVuMSIsInNjYWxlVG8iLCJlYXNpbmciLCJlYXNlQmFja0luIiwiYWN0aW9uMiIsImJsaW5rIiwicnVuQWN0aW9uIiwiYWN0aW9uIiwic2VxdWVuY2UiLCJjYWxsRnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUlBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUVQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsVUFBVSxFQUFFSixFQUFFLENBQUNLLElBREw7QUFFVkMsSUFBQUEsU0FBUyxFQUFFTixFQUFFLENBQUNLO0FBRkosR0FGTDtBQU1QRSxFQUFBQSxLQU5PLG1CQU1DLENBRVAsQ0FSTTtBQVVQQyxFQUFBQSxTQVZPLHVCQVVLLENBRVgsQ0FaTTtBQWFQQyxFQUFBQSxhQWJPLDJCQWFTO0FBQUE7O0FBQ2QsV0FBTyxJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxPQUFWLEVBQXNCO0FBQ3ZDLFVBQUlDLE1BQU0sR0FBR2IsRUFBRSxDQUFDYyxPQUFILENBQVcsR0FBWCxFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQkMsTUFBdEIsQ0FBNkJmLEVBQUUsQ0FBQ2dCLFVBQUgsRUFBN0IsQ0FBYjtBQUNBLFVBQUlDLE9BQU8sR0FBR2pCLEVBQUUsQ0FBQ2tCLEtBQUgsQ0FBUyxHQUFULEVBQWMsQ0FBZCxDQUFkOztBQUNBLE1BQUEsS0FBSSxDQUFDZCxVQUFMLENBQWdCZSxTQUFoQixDQUEwQk4sTUFBMUI7O0FBQ0EsVUFBSU8sTUFBTSxHQUFHcEIsRUFBRSxDQUFDcUIsUUFBSCxDQUFZSixPQUFaLEVBQXFCakIsRUFBRSxDQUFDc0IsUUFBSCxDQUFZLFlBQU07QUFDbERYLFFBQUFBLE9BQU87QUFDUixPQUZpQyxDQUFyQixDQUFiOztBQUdBLE1BQUEsS0FBSSxDQUFDTCxTQUFMLENBQWVhLFNBQWYsQ0FBeUJDLE1BQXpCO0FBQ0QsS0FSTSxDQUFQO0FBU0Q7QUF2Qk0sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAYXV0aG9yIGhleXVjaGFuZ1xuICogQGZpbGUg5byA5aeL6aG16Z2i5o6n5Yi2XG4gKi9cbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgYmFubmVyTm9kZTogY2MuTm9kZSxcbiAgICBsYWJlbE5vZGU6IGNjLk5vZGUsXG4gIH0sXG4gIHN0YXJ0KCkge1xuXG4gIH0sXG5cbiAgb25Ub3VjaGVkKCkge1xuXG4gIH0sXG4gIHNob3dBbmltYXRpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3RzKSA9PiB7XG4gICAgICBsZXQgdHdlZW4xID0gY2Muc2NhbGVUbygwLjUsIDAsIDApLmVhc2luZyhjYy5lYXNlQmFja0luKCkpXG4gICAgICBsZXQgYWN0aW9uMiA9IGNjLmJsaW5rKDAuNSwgMylcbiAgICAgIHRoaXMuYmFubmVyTm9kZS5ydW5BY3Rpb24odHdlZW4xKVxuICAgICAgbGV0IGFjdGlvbiA9IGNjLnNlcXVlbmNlKGFjdGlvbjIsIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9KSlcbiAgICAgIHRoaXMubGFiZWxOb2RlLnJ1bkFjdGlvbihhY3Rpb24pXG4gICAgfSlcbiAgfSxcbn0pOyJdfQ==