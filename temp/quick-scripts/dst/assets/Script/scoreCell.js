
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/scoreCell.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '0c8daIRUMtEXqcHO2bidMh4', 'scoreCell');
// Script/scoreCell.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    label: cc.Label //particle: cc.ParticleSystem,

  },
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  init: function init(s, num, pos) {
    var _this = this;

    this._gameScore = s;
    this.node.x = pos.x;
    this.node.y = pos.y;
    this.label.string = num; //this.particle.resetSystem()

    this.node.scale = 1;
    this.label.node.x = 0;
    this.label.node.y = 0;
    this.label.node.scale = 1;
    var tween1 = cc.scaleTo(0.1, 1.2, 1.2);
    var action2 = cc.moveBy(0.1, 0, 30);
    var action3 = cc.moveTo(0.2, 0, 0);
    var action4 = cc.scaleTo(0.2, 0.5, 0.5); // let seq = cc.sequence(tween1, cc.callFunc(() => {
    //   let seq2 = cc.sequence(action3, cc.moveBy(0.1, 0, 0), action4, cc.callFunc(() => {
    //     s.scorePool.put(this.node)
    //   }, this))
    //   this.node.runAction(seq2)
    // }, this))
    // this.label.node.runAction(seq)

    var spa1 = cc.spawn(tween1, action2);
    var spa2 = cc.spawn(action3, action4);
    var seq = cc.sequence(spa1, spa2, cc.callFunc(function () {
      s.scorePool.put(_this.node);
    }, this));
    this.node.runAction(seq);
  } // update (dt) {},

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzY29yZUNlbGwuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJsYWJlbCIsIkxhYmVsIiwiaW5pdCIsInMiLCJudW0iLCJwb3MiLCJfZ2FtZVNjb3JlIiwibm9kZSIsIngiLCJ5Iiwic3RyaW5nIiwic2NhbGUiLCJ0d2VlbjEiLCJzY2FsZVRvIiwiYWN0aW9uMiIsIm1vdmVCeSIsImFjdGlvbjMiLCJtb3ZlVG8iLCJhY3Rpb240Iiwic3BhMSIsInNwYXduIiwic3BhMiIsInNlcSIsInNlcXVlbmNlIiwiY2FsbEZ1bmMiLCJzY29yZVBvb2wiLCJwdXQiLCJydW5BY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBR1BDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxLQUFLLEVBQUVKLEVBQUUsQ0FBQ0ssS0FEQSxDQUVWOztBQUZVLEdBSEw7QUFPUDtBQUVBO0FBQ0FDLEVBQUFBLElBVk8sZ0JBVUZDLENBVkUsRUFVQ0MsR0FWRCxFQVVNQyxHQVZOLEVBVVc7QUFBQTs7QUFDaEIsU0FBS0MsVUFBTCxHQUFrQkgsQ0FBbEI7QUFDQSxTQUFLSSxJQUFMLENBQVVDLENBQVYsR0FBY0gsR0FBRyxDQUFDRyxDQUFsQjtBQUNBLFNBQUtELElBQUwsQ0FBVUUsQ0FBVixHQUFjSixHQUFHLENBQUNJLENBQWxCO0FBQ0EsU0FBS1QsS0FBTCxDQUFXVSxNQUFYLEdBQW9CTixHQUFwQixDQUpnQixDQUtoQjs7QUFDQSxTQUFLRyxJQUFMLENBQVVJLEtBQVYsR0FBa0IsQ0FBbEI7QUFDQSxTQUFLWCxLQUFMLENBQVdPLElBQVgsQ0FBZ0JDLENBQWhCLEdBQW9CLENBQXBCO0FBQ0EsU0FBS1IsS0FBTCxDQUFXTyxJQUFYLENBQWdCRSxDQUFoQixHQUFvQixDQUFwQjtBQUNBLFNBQUtULEtBQUwsQ0FBV08sSUFBWCxDQUFnQkksS0FBaEIsR0FBd0IsQ0FBeEI7QUFDQSxRQUFJQyxNQUFNLEdBQUdoQixFQUFFLENBQUNpQixPQUFILENBQVcsR0FBWCxFQUFnQixHQUFoQixFQUFxQixHQUFyQixDQUFiO0FBQ0EsUUFBSUMsT0FBTyxHQUFHbEIsRUFBRSxDQUFDbUIsTUFBSCxDQUFVLEdBQVYsRUFBZSxDQUFmLEVBQWtCLEVBQWxCLENBQWQ7QUFDQSxRQUFJQyxPQUFPLEdBQUdwQixFQUFFLENBQUNxQixNQUFILENBQVUsR0FBVixFQUFlLENBQWYsRUFBa0IsQ0FBbEIsQ0FBZDtBQUNBLFFBQUlDLE9BQU8sR0FBR3RCLEVBQUUsQ0FBQ2lCLE9BQUgsQ0FBVyxHQUFYLEVBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLENBQWQsQ0FiZ0IsQ0FjaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsUUFBSU0sSUFBSSxHQUFHdkIsRUFBRSxDQUFDd0IsS0FBSCxDQUFTUixNQUFULEVBQWlCRSxPQUFqQixDQUFYO0FBQ0EsUUFBSU8sSUFBSSxHQUFHekIsRUFBRSxDQUFDd0IsS0FBSCxDQUFTSixPQUFULEVBQWtCRSxPQUFsQixDQUFYO0FBQ0EsUUFBSUksR0FBRyxHQUFHMUIsRUFBRSxDQUFDMkIsUUFBSCxDQUFZSixJQUFaLEVBQWtCRSxJQUFsQixFQUF3QnpCLEVBQUUsQ0FBQzRCLFFBQUgsQ0FBWSxZQUFNO0FBQ2xEckIsTUFBQUEsQ0FBQyxDQUFDc0IsU0FBRixDQUFZQyxHQUFaLENBQWdCLEtBQUksQ0FBQ25CLElBQXJCO0FBQ0QsS0FGaUMsRUFFL0IsSUFGK0IsQ0FBeEIsQ0FBVjtBQUdBLFNBQUtBLElBQUwsQ0FBVW9CLFNBQVYsQ0FBb0JMLEdBQXBCO0FBQ0QsR0FyQ00sQ0F1Q1A7O0FBdkNPLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gIHByb3BlcnRpZXM6IHtcbiAgICBsYWJlbDogY2MuTGFiZWwsXG4gICAgLy9wYXJ0aWNsZTogY2MuUGFydGljbGVTeXN0ZW0sXG4gIH0sXG4gIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxuXG4gIC8vIG9uTG9hZCAoKSB7fSxcbiAgaW5pdChzLCBudW0sIHBvcykge1xuICAgIHRoaXMuX2dhbWVTY29yZSA9IHNcbiAgICB0aGlzLm5vZGUueCA9IHBvcy54XG4gICAgdGhpcy5ub2RlLnkgPSBwb3MueVxuICAgIHRoaXMubGFiZWwuc3RyaW5nID0gbnVtXG4gICAgLy90aGlzLnBhcnRpY2xlLnJlc2V0U3lzdGVtKClcbiAgICB0aGlzLm5vZGUuc2NhbGUgPSAxXG4gICAgdGhpcy5sYWJlbC5ub2RlLnggPSAwXG4gICAgdGhpcy5sYWJlbC5ub2RlLnkgPSAwXG4gICAgdGhpcy5sYWJlbC5ub2RlLnNjYWxlID0gMVxuICAgIGxldCB0d2VlbjEgPSBjYy5zY2FsZVRvKDAuMSwgMS4yLCAxLjIpXG4gICAgbGV0IGFjdGlvbjIgPSBjYy5tb3ZlQnkoMC4xLCAwLCAzMClcbiAgICBsZXQgYWN0aW9uMyA9IGNjLm1vdmVUbygwLjIsIDAsIDApXG4gICAgbGV0IGFjdGlvbjQgPSBjYy5zY2FsZVRvKDAuMiwgMC41LCAwLjUpXG4gICAgLy8gbGV0IHNlcSA9IGNjLnNlcXVlbmNlKHR3ZWVuMSwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgIC8vICAgbGV0IHNlcTIgPSBjYy5zZXF1ZW5jZShhY3Rpb24zLCBjYy5tb3ZlQnkoMC4xLCAwLCAwKSwgYWN0aW9uNCwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgIC8vICAgICBzLnNjb3JlUG9vbC5wdXQodGhpcy5ub2RlKVxuICAgIC8vICAgfSwgdGhpcykpXG4gICAgLy8gICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcTIpXG4gICAgLy8gfSwgdGhpcykpXG4gICAgLy8gdGhpcy5sYWJlbC5ub2RlLnJ1bkFjdGlvbihzZXEpXG4gICAgbGV0IHNwYTEgPSBjYy5zcGF3bih0d2VlbjEsIGFjdGlvbjIpXG4gICAgbGV0IHNwYTIgPSBjYy5zcGF3bihhY3Rpb24zLCBhY3Rpb240KVxuICAgIGxldCBzZXEgPSBjYy5zZXF1ZW5jZShzcGExLCBzcGEyLCBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICBzLnNjb3JlUG9vbC5wdXQodGhpcy5ub2RlKVxuICAgIH0sIHRoaXMpKVxuICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKVxuICB9XG5cbiAgLy8gdXBkYXRlIChkdCkge30sXG59KTsiXX0=