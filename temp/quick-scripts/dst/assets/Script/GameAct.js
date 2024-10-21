
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/GameAct.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '9d3711KFVFCZ6a/86BjU5eU', 'GameAct');
// Script/GameAct.js

"use strict";

var _this = void 0;

/**
 * @author heyuchang
 * @file 所有的简单动作集合
 */
// 震动动作 0.1效果比较好
function shackAction(time, range) {
  var tween1 = cc.moveBy(time, range, range);
  var action2 = cc.moveBy(time, -range, -range);
  var action3 = cc.moveBy(time * 0.8, range * 0.8, range * 0.8);
  var action4 = cc.moveBy(time * 0.8, -range * 0.8, -range * 0.8);
  var action5 = cc.moveBy(time * 0.6, range * 0.6, range * 0.6);
  var action6 = cc.moveBy(time * 0.6, -range * 0.6, -range * 0.6);
  var action7 = cc.moveBy(time * 0.4, range * 0.4, range * 0.4);
  var action8 = cc.moveBy(time * 0.4, -range * 0.4, -range * 0.4);
  var action9 = cc.moveBy(time * 0.2, range * 0.2, range * 0.2);
  var action10 = cc.moveBy(time * 0.2, -range * 0.2, -range * 0.2);
  var sq = cc.sequence(tween1, action2, action3, action4, action5, action6, action7, action8, action9, action10);
  return sq;
} // Helper function to create a rotation tween


var createRotationTween = function createRotationTween(duration, xRotation, yRotation) {
  return cc.tween(duration).to(cc.Node.prototype.setRotation, {
    x: _this.node.rotationX + xRotation,
    y: _this.node.rotationY + yRotation
  }, {
    rotationX: '+=',
    rotationY: '+='
  }).action();
}; // Helper function to create a rotation to zero tween


var createZeroRotationTween = function createZeroRotationTween(duration) {
  return cc.tween(duration).to(cc.Node.prototype.setRotation, {
    x: 0,
    y: 0
  }).action();
}; // 晃动动作


function rockAction(time, range) {
  var tween1 = cc.rotateBy(time, range, range);
  var action2 = cc.rotateBy(time, -2 * range, -2 * range);
  var action3 = cc.rotateBy(time * 0.8, 2 * range * 0.8, 2 * range * 0.8);
  var action6 = cc.rotateBy(time * 0.6, -2 * range * 0.6, -2 * range * 0.6);
  var action7 = cc.rotateBy(time * 0.4, 2 * range * 0.4, 2 * range * 0.4);
  var action10 = cc.rotateTo(time * 0.2, 0, 0);
  var sq = cc.sequence(tween1, action2, action3, action6, action7, action10);
  return sq;
} // 弹出效果


function popOut(time) {
  return cc.scaleTo(time, 1).easing(cc.easeBackOut(2.0));
} // 收入效果


function popIn(time) {
  return cc.scaleTo(time, 0.5).easing(cc.easeBackIn(2.0));
}

function heartBeat() {
  var tween1 = cc.scaleTo(0.2, 1.2).easing(cc.easeElasticInOut());
  var action2 = cc.scaleTo(0.2, 1).easing(cc.easeElasticInOut());
  var action3 = cc.rotateTo(0.1, 45);
  var action4 = cc.rotateTo(0.2, -45);
  var action5 = cc.rotateTo(0.1, 0);
} //翻页效果 前两个传node type传数字 左右旋转的


function pageTurning(pageUp, pageDown, typeA) {
  switch (typeA) {
    case 0:
      pageUp.runAction(cc.fadeOut(0.6));
      pageDown.runAction(cc.delayTime(0.6), cc.fadeIn(0.6), cc.sequence(cc.callFunc(function () {
        pageUp.active = false;
      }, this, pageUp)));
      break;

    case 1:
      pageDown.scaleX = 0;
      pageUp.runAction(cc.scaleTo(0.6, 0, 1));
      pageDown.runAction(cc.sequence(cc.delayTime(0.6), cc.callFunc(function () {
        pageUp.active = false;
      }, this, pageUp), cc.scaleTo(0.6, 1, 1)));
      break;

    case 2:
      break;
  }
} //移动到屏幕外 并且隐藏  0123 上右下左 会移动一个屏幕的距离 然后直接消失


function getMoveOutofScreenActive(typeA, winWidth, winHeight, delTime) {
  switch (typeA) {
    case 0:
      return cc.moveBy(delTime, 0, winHeight);

    case 1:
      return cc.moveBy(delTime, winWidth, 0);

    case 2:
      return cc.moveBy(delTime, 0, -winHeight);

    case 3:
      return cc.moveBy(delTime, -winWidth, 0);
  }
} //从屏幕外进入 上右下左


function getMoveInScreenActive(typeA, winWidth, winHeight, delTime) {
  switch (typeA) {
    case 0:
      return cc.moveBy(delTime, 0, -winHeight);

    case 1:
      return cc.moveBy(delTime, -winWidth, 0);

    case 2:
      return cc.moveBy(delTime, 0, winHeight);

    case 3:
      return cc.moveBy(delTime, winWidth, 0);
  }
} //闪烁动作


function blinkAction(delTime) {
  return cc.repeatForever(cc.sequence(cc.fadeOut(delTime), cc.fadeIn(delTime)));
}

module.exports = {
  shackAction: shackAction,
  blinkAction: blinkAction,
  pageTurning: pageTurning,
  heartBeat: heartBeat,
  getMoveOutofScreenActive: getMoveOutofScreenActive,
  popOut: popOut,
  popIn: popIn,
  getMoveInScreenActive: getMoveInScreenActive,
  rockAction: rockAction
};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxHYW1lQWN0LmpzIl0sIm5hbWVzIjpbInNoYWNrQWN0aW9uIiwidGltZSIsInJhbmdlIiwidHdlZW4xIiwiY2MiLCJtb3ZlQnkiLCJhY3Rpb24yIiwiYWN0aW9uMyIsImFjdGlvbjQiLCJhY3Rpb241IiwiYWN0aW9uNiIsImFjdGlvbjciLCJhY3Rpb244IiwiYWN0aW9uOSIsImFjdGlvbjEwIiwic3EiLCJzZXF1ZW5jZSIsImNyZWF0ZVJvdGF0aW9uVHdlZW4iLCJkdXJhdGlvbiIsInhSb3RhdGlvbiIsInlSb3RhdGlvbiIsInR3ZWVuIiwidG8iLCJOb2RlIiwicHJvdG90eXBlIiwic2V0Um90YXRpb24iLCJ4Iiwibm9kZSIsInJvdGF0aW9uWCIsInkiLCJyb3RhdGlvblkiLCJhY3Rpb24iLCJjcmVhdGVaZXJvUm90YXRpb25Ud2VlbiIsInJvY2tBY3Rpb24iLCJyb3RhdGVCeSIsInJvdGF0ZVRvIiwicG9wT3V0Iiwic2NhbGVUbyIsImVhc2luZyIsImVhc2VCYWNrT3V0IiwicG9wSW4iLCJlYXNlQmFja0luIiwiaGVhcnRCZWF0IiwiZWFzZUVsYXN0aWNJbk91dCIsInBhZ2VUdXJuaW5nIiwicGFnZVVwIiwicGFnZURvd24iLCJ0eXBlQSIsInJ1bkFjdGlvbiIsImZhZGVPdXQiLCJkZWxheVRpbWUiLCJmYWRlSW4iLCJjYWxsRnVuYyIsImFjdGl2ZSIsInNjYWxlWCIsImdldE1vdmVPdXRvZlNjcmVlbkFjdGl2ZSIsIndpbldpZHRoIiwid2luSGVpZ2h0IiwiZGVsVGltZSIsImdldE1vdmVJblNjcmVlbkFjdGl2ZSIsImJsaW5rQWN0aW9uIiwicmVwZWF0Rm9yZXZlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUtBO0FBQ0EsU0FBU0EsV0FBVCxDQUFxQkMsSUFBckIsRUFBMkJDLEtBQTNCLEVBQWtDO0FBQ2hDLE1BQUlDLE1BQU0sR0FBR0MsRUFBRSxDQUFD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Q0EsU0FBU0ksV0FBVCxDQUFxQkYsT0FBckIsRUFBOEI7QUFDNUIsU0FBT3RELEVBQUUsQ0FBQ3lELGFBQUgsQ0FBaUJ6RCxFQUFFLENBQUNZLFFBQUgsQ0FBWVosRUFBRSxDQUFDNkMsT0FBSCxDQUFXUyxPQUFYLENBQVosRUFBaUN0RCxFQUFFLENBQUMrQyxNQUFILENBQVVPLE9BQVYsQ0FBakMsQ0FBakIsQ0FBUDtBQUNEOztBQUNESSxNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFDZi9ELEVBQUFBLFdBQVcsRUFBRUEsV0FERTtBQUVmNEQsRUFBQUEsV0FBVyxFQUFFQSxXQUZFO0FBR2ZoQixFQUFBQSxXQUFXLEVBQUVBLFdBSEU7QUFJZkYsRUFBQUEsU0FBUyxFQUFFQSxTQUpJO0FBS2ZhLEVBQUFBLHdCQUF3QixFQUFFQSx3QkFMWDtBQU1mbkIsRUFBQUEsTUFBTSxFQUFFQSxNQU5PO0FBT2ZJLEVBQUFBLEtBQUssRUFBRUEsS0FQUTtBQVFmbUIsRUFBQUEscUJBQXFCLEVBQUVBLHFCQVJSO0FBU2YxQixFQUFBQSxVQUFVLEVBQUVBO0FBVEcsQ0FBakIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBoZXl1Y2hhbmdcbiAqIEBmaWxlIOaJgOacieeahOeugOWNleWKqOS9nOmbhuWQiFxuICovXG5cbi8vIOmch+WKqOWKqOS9nCAwLjHmlYjmnpzmr5TovoPlpb1cbmZ1bmN0aW9uIHNoYWNrQWN0aW9uKHRpbWUsIHJhbmdlKSB7XG4gIGxldCB0d2VlbjEgPSBjYy5tb3ZlQnkodGltZSwgcmFuZ2UsIHJhbmdlKVxuICBsZXQgYWN0aW9uMiA9IGNjLm1vdmVCeSh0aW1lLCAtcmFuZ2UsIC1yYW5nZSlcbiAgbGV0IGFjdGlvbjMgPSBjYy5tb3ZlQnkodGltZSAqIDAuOCwgcmFuZ2UgKiAwLjgsIHJhbmdlICogMC44KVxuICBsZXQgYWN0aW9uNCA9IGNjLm1vdmVCeSh0aW1lICogMC44LCAtcmFuZ2UgKiAwLjgsIC1yYW5nZSAqIDAuOClcbiAgbGV0IGFjdGlvbjUgPSBjYy5tb3ZlQnkodGltZSAqIDAuNiwgcmFuZ2UgKiAwLjYsIHJhbmdlICogMC42KVxuICBsZXQgYWN0aW9uNiA9IGNjLm1vdmVCeSh0aW1lICogMC42LCAtcmFuZ2UgKiAwLjYsIC1yYW5nZSAqIDAuNilcbiAgbGV0IGFjdGlvbjcgPSBjYy5tb3ZlQnkodGltZSAqIDAuNCwgcmFuZ2UgKiAwLjQsIHJhbmdlICogMC40KVxuICBsZXQgYWN0aW9uOCA9IGNjLm1vdmVCeSh0aW1lICogMC40LCAtcmFuZ2UgKiAwLjQsIC1yYW5nZSAqIDAuNClcbiAgbGV0IGFjdGlvbjkgPSBjYy5tb3ZlQnkodGltZSAqIDAuMiwgcmFuZ2UgKiAwLjIsIHJhbmdlICogMC4yKVxuICBsZXQgYWN0aW9uMTAgPSBjYy5tb3ZlQnkodGltZSAqIDAuMiwgLXJhbmdlICogMC4yLCAtcmFuZ2UgKiAwLjIpXG4gIGxldCBzcSA9IGNjLnNlcXVlbmNlKHR3ZWVuMSwgYWN0aW9uMiwgYWN0aW9uMywgYWN0aW9uNCwgYWN0aW9uNSwgYWN0aW9uNiwgYWN0aW9uNywgYWN0aW9uOCwgYWN0aW9uOSwgYWN0aW9uMTApXG4gIHJldHVybiBzcVxufVxuXG4gLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIHJvdGF0aW9uIHR3ZWVuXG4gY29uc3QgY3JlYXRlUm90YXRpb25Ud2VlbiA9IChkdXJhdGlvbiwgeFJvdGF0aW9uLCB5Um90YXRpb24pID0+IHtcbiAgcmV0dXJuIGNjLnR3ZWVuKGR1cmF0aW9uKVxuICAgIC50byhjYy5Ob2RlLnByb3RvdHlwZS5zZXRSb3RhdGlvbiwge1xuICAgICAgeDogdGhpcy5ub2RlLnJvdGF0aW9uWCArIHhSb3RhdGlvbixcbiAgICAgIHk6IHRoaXMubm9kZS5yb3RhdGlvblkgKyB5Um90YXRpb25cbiAgICB9LCB7cm90YXRpb25YOiAnKz0nLCByb3RhdGlvblk6ICcrPSd9KVxuICAgIC5hY3Rpb24oKTtcbn07XG5cbi8vIEhlbHBlciBmdW5jdGlvbiB0byBjcmVhdGUgYSByb3RhdGlvbiB0byB6ZXJvIHR3ZWVuXG5jb25zdCBjcmVhdGVaZXJvUm90YXRpb25Ud2VlbiA9IChkdXJhdGlvbikgPT4ge1xuICByZXR1cm4gY2MudHdlZW4oZHVyYXRpb24pXG4gICAgLnRvKGNjLk5vZGUucHJvdG90eXBlLnNldFJvdGF0aW9uLCB7eDogMCwgeTogMH0pXG4gICAgLmFjdGlvbigpO1xufTtcblxuLy8g5pmD5Yqo5Yqo5L2cXG5mdW5jdGlvbiByb2NrQWN0aW9uKHRpbWUsIHJhbmdlKSB7XG4gIGxldCB0d2VlbjEgPSBjYy5yb3RhdGVCeSh0aW1lLCByYW5nZSwgcmFuZ2UpXG4gIGxldCBhY3Rpb24yID0gY2Mucm90YXRlQnkodGltZSwgLTIgKiByYW5nZSwgLTIgKiByYW5nZSlcbiAgbGV0IGFjdGlvbjMgPSBjYy5yb3RhdGVCeSh0aW1lICogMC44LCAyICogcmFuZ2UgKiAwLjgsIDIgKiByYW5nZSAqIDAuOClcbiAgbGV0IGFjdGlvbjYgPSBjYy5yb3RhdGVCeSh0aW1lICogMC42LCAtMiAqIHJhbmdlICogMC42LCAtMiAqIHJhbmdlICogMC42KVxuICBsZXQgYWN0aW9uNyA9IGNjLnJvdGF0ZUJ5KHRpbWUgKiAwLjQsIDIgKiByYW5nZSAqIDAuNCwgMiAqIHJhbmdlICogMC40KVxuICBsZXQgYWN0aW9uMTAgPSBjYy5yb3RhdGVUbyh0aW1lICogMC4yLCAwLCAwKVxuICBsZXQgc3EgPSBjYy5zZXF1ZW5jZSh0d2VlbjEsIGFjdGlvbjIsIGFjdGlvbjMsIGFjdGlvbjYsIGFjdGlvbjcsIGFjdGlvbjEwKVxuICByZXR1cm4gc3Fcbn1cblxuLy8g5by55Ye65pWI5p6cXG5mdW5jdGlvbiBwb3BPdXQodGltZSkge1xuICByZXR1cm4gY2Muc2NhbGVUbyh0aW1lLCAxKS5lYXNpbmcoY2MuZWFzZUJhY2tPdXQoMi4wKSlcbn1cbi8vIOaUtuWFpeaViOaenFxuZnVuY3Rpb24gcG9wSW4odGltZSkge1xuICByZXR1cm4gY2Muc2NhbGVUbyh0aW1lLCAwLjUpLmVhc2luZyhjYy5lYXNlQmFja0luKDIuMCkpXG59XG5cbmZ1bmN0aW9uIGhlYXJ0QmVhdCgpIHtcbiAgbGV0IHR3ZWVuMSA9IGNjLnNjYWxlVG8oMC4yLCAxLjIpLmVhc2luZyhjYy5lYXNlRWxhc3RpY0luT3V0KCkpXG4gIGxldCBhY3Rpb24yID0gY2Muc2NhbGVUbygwLjIsIDEpLmVhc2luZyhjYy5lYXNlRWxhc3RpY0luT3V0KCkpXG4gIGxldCBhY3Rpb24zID0gY2Mucm90YXRlVG8oMC4xLCA0NSlcbiAgbGV0IGFjdGlvbjQgPSBjYy5yb3RhdGVUbygwLjIsIC00NSlcbiAgbGV0IGFjdGlvbjUgPSBjYy5yb3RhdGVUbygwLjEsIDApXG59XG4vL+e/u+mhteaViOaenCDliY3kuKTkuKrkvKBub2RlIHR5cGXkvKDmlbDlrZcg5bem5Y+z5peL6L2s55qEXG5mdW5jdGlvbiBwYWdlVHVybmluZyhwYWdlVXAsIHBhZ2VEb3duLCB0eXBlQSkge1xuICBzd2l0Y2ggKHR5cGVBKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcGFnZVVwLnJ1bkFjdGlvbihjYy5mYWRlT3V0KDAuNikpO1xuICAgICAgcGFnZURvd24ucnVuQWN0aW9uKGNjLmRlbGF5VGltZSgwLjYpLCBjYy5mYWRlSW4oMC42KSwgY2Muc2VxdWVuY2UoY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgICBwYWdlVXAuYWN0aXZlID0gZmFsc2U7XG4gICAgICB9LCB0aGlzLCBwYWdlVXApKSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDE6XG4gICAgICBwYWdlRG93bi5zY2FsZVggPSAwO1xuICAgICAgcGFnZVVwLnJ1bkFjdGlvbihjYy5zY2FsZVRvKDAuNiwgMCwgMSkpXG4gICAgICBwYWdlRG93bi5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2MuZGVsYXlUaW1lKDAuNiksIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgcGFnZVVwLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgfSwgdGhpcywgcGFnZVVwKSwgY2Muc2NhbGVUbygwLjYsIDEsIDEpLCkpXG4gICAgICBicmVhaztcbiAgICBjYXNlIDI6XG4gICAgICBicmVhaztcbiAgfVxufVxuLy/np7vliqjliLDlsY/luZXlpJYg5bm25LiU6ZqQ6JePICAwMTIzIOS4iuWPs+S4i+W3piDkvJrnp7vliqjkuIDkuKrlsY/luZXnmoTot53nprsg54S25ZCO55u05o6l5raI5aSxXG5mdW5jdGlvbiBnZXRNb3ZlT3V0b2ZTY3JlZW5BY3RpdmUodHlwZUEsIHdpbldpZHRoLCB3aW5IZWlnaHQsIGRlbFRpbWUpIHtcbiAgc3dpdGNoICh0eXBlQSkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgMCwgd2luSGVpZ2h0KVxuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgd2luV2lkdGgsIDApXG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIGNjLm1vdmVCeShkZWxUaW1lLCAwLCAtd2luSGVpZ2h0KVxuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgLXdpbldpZHRoLCAwKVxuICB9XG59XG4vL+S7juWxj+W5leWklui/m+WFpSDkuIrlj7PkuIvlt6ZcbmZ1bmN0aW9uIGdldE1vdmVJblNjcmVlbkFjdGl2ZSh0eXBlQSwgd2luV2lkdGgsIHdpbkhlaWdodCwgZGVsVGltZSkge1xuICBzd2l0Y2ggKHR5cGVBKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIGNjLm1vdmVCeShkZWxUaW1lLCAwLCAtd2luSGVpZ2h0KVxuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgLXdpbldpZHRoLCAwKVxuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgMCwgd2luSGVpZ2h0KVxuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgd2luV2lkdGgsIDApXG4gIH1cbn1cbi8v6Zeq54OB5Yqo5L2cXG5mdW5jdGlvbiBibGlua0FjdGlvbihkZWxUaW1lKSB7XG4gIHJldHVybiBjYy5yZXBlYXRGb3JldmVyKGNjLnNlcXVlbmNlKGNjLmZhZGVPdXQoZGVsVGltZSksIGNjLmZhZGVJbihkZWxUaW1lKSkpXG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2hhY2tBY3Rpb246IHNoYWNrQWN0aW9uLFxuICBibGlua0FjdGlvbjogYmxpbmtBY3Rpb24sXG4gIHBhZ2VUdXJuaW5nOiBwYWdlVHVybmluZyxcbiAgaGVhcnRCZWF0OiBoZWFydEJlYXQsXG4gIGdldE1vdmVPdXRvZlNjcmVlbkFjdGl2ZTogZ2V0TW92ZU91dG9mU2NyZWVuQWN0aXZlLFxuICBwb3BPdXQ6IHBvcE91dCxcbiAgcG9wSW46IHBvcEluLFxuICBnZXRNb3ZlSW5TY3JlZW5BY3RpdmU6IGdldE1vdmVJblNjcmVlbkFjdGl2ZSxcbiAgcm9ja0FjdGlvbjogcm9ja0FjdGlvblxufSJdfQ==