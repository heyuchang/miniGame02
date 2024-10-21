
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
    var action1 = cc.scaleTo(0.1, 1.2, 1.2);
    var action2 = cc.moveBy(0.1, 0, 30);
    var action3 = cc.moveTo(0.2, 0, 0);
    var action4 = cc.scaleTo(0.2, 0.5, 0.5); // let seq = cc.sequence(action1, cc.callFunc(() => {
    //   let seq2 = cc.sequence(action3, cc.moveBy(0.1, 0, 0), action4, cc.callFunc(() => {
    //     s.scorePool.put(this.node)
    //   }, this))
    //   this.node.runAction(seq2)
    // }, this))
    // this.label.node.runAction(seq)

    var spa1 = cc.spawn(action1, action2);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzY29yZUNlbGwuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJsYWJlbCIsIkxhYmVsIiwiaW5pdCIsInMiLCJudW0iLCJwb3MiLCJfZ2FtZVNjb3JlIiwibm9kZSIsIngiLCJ5Iiwic3RyaW5nIiwic2NhbGUiLCJhY3Rpb24xIiwic2NhbGVUbyIsImFjdGlvbjIiLCJtb3ZlQnkiLCJhY3Rpb24zIiwibW92ZVRvIiwiYWN0aW9uNCIsInNwYTEiLCJzcGF3biIsInNwYTIiLCJzZXEiLCJzZXF1ZW5jZSIsImNhbGxGdW5jIiwic2NvcmVQb29sIiwicHV0IiwicnVuQWN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUdQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsS0FBSyxFQUFFSixFQUFFLENBQUNLLEtBREEsQ0FFVjs7QUFGVSxHQUhMO0FBT1A7QUFFQTtBQUNBQyxFQUFBQSxJQVZPLGdCQVVGQyxDQVZFLEVBVUNDLEdBVkQsRUFVTUMsR0FWTixFQVVXO0FBQUE7O0FBQ2hCLFNBQUtDLFVBQUwsR0FBa0JILENBQWxCO0FBQ0EsU0FBS0ksSUFBTCxDQUFVQyxDQUFWLEdBQWNILEdBQUcsQ0FBQ0csQ0FBbEI7QUFDQSxTQUFLRCxJQUFMLENBQVVFLENBQVYsR0FBY0osR0FBRyxDQUFDSSxDQUFsQjtBQUNBLFNBQUtULEtBQUwsQ0FBV1UsTUFBWCxHQUFvQk4sR0FBcEIsQ0FKZ0IsQ0FLaEI7O0FBQ0EsU0FBS0csSUFBTCxDQUFVSSxLQUFWLEdBQWtCLENBQWxCO0FBQ0EsU0FBS1gsS0FBTCxDQUFXTyxJQUFYLENBQWdCQyxDQUFoQixHQUFvQixDQUFwQjtBQUNBLFNBQUtSLEtBQUwsQ0FBV08sSUFBWCxDQUFnQkUsQ0FBaEIsR0FBb0IsQ0FBcEI7QUFDQSxTQUFLVCxLQUFMLENBQVdPLElBQVgsQ0FBZ0JJLEtBQWhCLEdBQXdCLENBQXhCO0FBQ0EsUUFBSUMsT0FBTyxHQUFHaEIsRUFBRSxDQUFDaUIsT0FBSCxDQUFXLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsQ0FBZDtBQUNBLFFBQUlDLE9BQU8sR0FBR2xCLEVBQUUsQ0FBQ21CLE1BQUgsQ0FBVSxHQUFWLEVBQWUsQ0FBZixFQUFrQixFQUFsQixDQUFkO0FBQ0EsUUFBSUMsT0FBTyxHQUFHcEIsRUFBRSxDQUFDcUIsTUFBSCxDQUFVLEdBQVYsRUFBZSxDQUFmLEVBQWtCLENBQWxCLENBQWQ7QUFDQSxRQUFJQyxPQUFPLEdBQUd0QixFQUFFLENBQUNpQixPQUFILENBQVcsR0FBWCxFQUFnQixHQUFoQixFQUFxQixHQUFyQixDQUFkLENBYmdCLENBY2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFFBQUlNLElBQUksR0FBR3ZCLEVBQUUsQ0FBQ3dCLEtBQUgsQ0FBU1IsT0FBVCxFQUFrQkUsT0FBbEIsQ0FBWDtBQUNBLFFBQUlPLElBQUksR0FBR3pCLEVBQUUsQ0FBQ3dCLEtBQUgsQ0FBU0osT0FBVCxFQUFrQkUsT0FBbEIsQ0FBWDtBQUNBLFFBQUlJLEdBQUcsR0FBRzFCLEVBQUUsQ0FBQzJCLFFBQUgsQ0FBWUosSUFBWixFQUFrQkUsSUFBbEIsRUFBd0J6QixFQUFFLENBQUM0QixRQUFILENBQVksWUFBTTtBQUNsRHJCLE1BQUFBLENBQUMsQ0FBQ3NCLFNBQUYsQ0FBWUMsR0FBWixDQUFnQixLQUFJLENBQUNuQixJQUFyQjtBQUNELEtBRmlDLEVBRS9CLElBRitCLENBQXhCLENBQVY7QUFHQSxTQUFLQSxJQUFMLENBQVVvQixTQUFWLENBQW9CTCxHQUFwQjtBQUNELEdBckNNLENBdUNQOztBQXZDTyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbGFiZWw6IGNjLkxhYmVsLFxuICAgIC8vcGFydGljbGU6IGNjLlBhcnRpY2xlU3lzdGVtLFxuICB9LFxuICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcblxuICAvLyBvbkxvYWQgKCkge30sXG4gIGluaXQocywgbnVtLCBwb3MpIHtcbiAgICB0aGlzLl9nYW1lU2NvcmUgPSBzXG4gICAgdGhpcy5ub2RlLnggPSBwb3MueFxuICAgIHRoaXMubm9kZS55ID0gcG9zLnlcbiAgICB0aGlzLmxhYmVsLnN0cmluZyA9IG51bVxuICAgIC8vdGhpcy5wYXJ0aWNsZS5yZXNldFN5c3RlbSgpXG4gICAgdGhpcy5ub2RlLnNjYWxlID0gMVxuICAgIHRoaXMubGFiZWwubm9kZS54ID0gMFxuICAgIHRoaXMubGFiZWwubm9kZS55ID0gMFxuICAgIHRoaXMubGFiZWwubm9kZS5zY2FsZSA9IDFcbiAgICBsZXQgYWN0aW9uMSA9IGNjLnNjYWxlVG8oMC4xLCAxLjIsIDEuMilcbiAgICBsZXQgYWN0aW9uMiA9IGNjLm1vdmVCeSgwLjEsIDAsIDMwKVxuICAgIGxldCBhY3Rpb24zID0gY2MubW92ZVRvKDAuMiwgMCwgMClcbiAgICBsZXQgYWN0aW9uNCA9IGNjLnNjYWxlVG8oMC4yLCAwLjUsIDAuNSlcbiAgICAvLyBsZXQgc2VxID0gY2Muc2VxdWVuY2UoYWN0aW9uMSwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgIC8vICAgbGV0IHNlcTIgPSBjYy5zZXF1ZW5jZShhY3Rpb24zLCBjYy5tb3ZlQnkoMC4xLCAwLCAwKSwgYWN0aW9uNCwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgIC8vICAgICBzLnNjb3JlUG9vbC5wdXQodGhpcy5ub2RlKVxuICAgIC8vICAgfSwgdGhpcykpXG4gICAgLy8gICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcTIpXG4gICAgLy8gfSwgdGhpcykpXG4gICAgLy8gdGhpcy5sYWJlbC5ub2RlLnJ1bkFjdGlvbihzZXEpXG4gICAgbGV0IHNwYTEgPSBjYy5zcGF3bihhY3Rpb24xLCBhY3Rpb24yKVxuICAgIGxldCBzcGEyID0gY2Muc3Bhd24oYWN0aW9uMywgYWN0aW9uNClcbiAgICBsZXQgc2VxID0gY2Muc2VxdWVuY2Uoc3BhMSwgc3BhMiwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgcy5zY29yZVBvb2wucHV0KHRoaXMubm9kZSlcbiAgICB9LCB0aGlzKSlcbiAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSlcbiAgfVxuXG4gIC8vIHVwZGF0ZSAoZHQpIHt9LFxufSk7Il19