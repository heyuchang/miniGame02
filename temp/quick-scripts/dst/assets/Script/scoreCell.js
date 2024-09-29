
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

    this._score = s;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzY29yZUNlbGwuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJsYWJlbCIsIkxhYmVsIiwiaW5pdCIsInMiLCJudW0iLCJwb3MiLCJfc2NvcmUiLCJub2RlIiwieCIsInkiLCJzdHJpbmciLCJzY2FsZSIsImFjdGlvbjEiLCJzY2FsZVRvIiwiYWN0aW9uMiIsIm1vdmVCeSIsImFjdGlvbjMiLCJtb3ZlVG8iLCJhY3Rpb240Iiwic3BhMSIsInNwYXduIiwic3BhMiIsInNlcSIsInNlcXVlbmNlIiwiY2FsbEZ1bmMiLCJzY29yZVBvb2wiLCJwdXQiLCJydW5BY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBR1BDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxLQUFLLEVBQUVKLEVBQUUsQ0FBQ0ssS0FEQSxDQUVWOztBQUZVLEdBSEw7QUFPUDtBQUVBO0FBQ0FDLEVBQUFBLElBVk8sZ0JBVUZDLENBVkUsRUFVQ0MsR0FWRCxFQVVNQyxHQVZOLEVBVVc7QUFBQTs7QUFDaEIsU0FBS0MsTUFBTCxHQUFjSCxDQUFkO0FBQ0EsU0FBS0ksSUFBTCxDQUFVQyxDQUFWLEdBQWNILEdBQUcsQ0FBQ0csQ0FBbEI7QUFDQSxTQUFLRCxJQUFMLENBQVVFLENBQVYsR0FBY0osR0FBRyxDQUFDSSxDQUFsQjtBQUNBLFNBQUtULEtBQUwsQ0FBV1UsTUFBWCxHQUFvQk4sR0FBcEIsQ0FKZ0IsQ0FLaEI7O0FBQ0EsU0FBS0csSUFBTCxDQUFVSSxLQUFWLEdBQWtCLENBQWxCO0FBQ0EsU0FBS1gsS0FBTCxDQUFXTyxJQUFYLENBQWdCQyxDQUFoQixHQUFvQixDQUFwQjtBQUNBLFNBQUtSLEtBQUwsQ0FBV08sSUFBWCxDQUFnQkUsQ0FBaEIsR0FBb0IsQ0FBcEI7QUFDQSxTQUFLVCxLQUFMLENBQVdPLElBQVgsQ0FBZ0JJLEtBQWhCLEdBQXdCLENBQXhCO0FBQ0EsUUFBSUMsT0FBTyxHQUFHaEIsRUFBRSxDQUFDaUIsT0FBSCxDQUFXLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsQ0FBZDtBQUNBLFFBQUlDLE9BQU8sR0FBR2xCLEVBQUUsQ0FBQ21CLE1BQUgsQ0FBVSxHQUFWLEVBQWUsQ0FBZixFQUFrQixFQUFsQixDQUFkO0FBQ0EsUUFBSUMsT0FBTyxHQUFHcEIsRUFBRSxDQUFDcUIsTUFBSCxDQUFVLEdBQVYsRUFBZSxDQUFmLEVBQWtCLENBQWxCLENBQWQ7QUFDQSxRQUFJQyxPQUFPLEdBQUd0QixFQUFFLENBQUNpQixPQUFILENBQVcsR0FBWCxFQUFnQixHQUFoQixFQUFxQixHQUFyQixDQUFkLENBYmdCLENBY2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFFBQUlNLElBQUksR0FBR3ZCLEVBQUUsQ0FBQ3dCLEtBQUgsQ0FBU1IsT0FBVCxFQUFrQkUsT0FBbEIsQ0FBWDtBQUNBLFFBQUlPLElBQUksR0FBR3pCLEVBQUUsQ0FBQ3dCLEtBQUgsQ0FBU0osT0FBVCxFQUFrQkUsT0FBbEIsQ0FBWDtBQUNBLFFBQUlJLEdBQUcsR0FBRzFCLEVBQUUsQ0FBQzJCLFFBQUgsQ0FBWUosSUFBWixFQUFrQkUsSUFBbEIsRUFBd0J6QixFQUFFLENBQUM0QixRQUFILENBQVksWUFBTTtBQUNsRHJCLE1BQUFBLENBQUMsQ0FBQ3NCLFNBQUYsQ0FBWUMsR0FBWixDQUFnQixLQUFJLENBQUNuQixJQUFyQjtBQUNELEtBRmlDLEVBRS9CLElBRitCLENBQXhCLENBQVY7QUFHQSxTQUFLQSxJQUFMLENBQVVvQixTQUFWLENBQW9CTCxHQUFwQjtBQUNELEdBckNNLENBdUNQOztBQXZDTyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbGFiZWw6IGNjLkxhYmVsLFxuICAgIC8vcGFydGljbGU6IGNjLlBhcnRpY2xlU3lzdGVtLFxuICB9LFxuICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcblxuICAvLyBvbkxvYWQgKCkge30sXG4gIGluaXQocywgbnVtLCBwb3MpIHtcbiAgICB0aGlzLl9zY29yZSA9IHNcbiAgICB0aGlzLm5vZGUueCA9IHBvcy54XG4gICAgdGhpcy5ub2RlLnkgPSBwb3MueVxuICAgIHRoaXMubGFiZWwuc3RyaW5nID0gbnVtXG4gICAgLy90aGlzLnBhcnRpY2xlLnJlc2V0U3lzdGVtKClcbiAgICB0aGlzLm5vZGUuc2NhbGUgPSAxXG4gICAgdGhpcy5sYWJlbC5ub2RlLnggPSAwXG4gICAgdGhpcy5sYWJlbC5ub2RlLnkgPSAwXG4gICAgdGhpcy5sYWJlbC5ub2RlLnNjYWxlID0gMVxuICAgIGxldCBhY3Rpb24xID0gY2Muc2NhbGVUbygwLjEsIDEuMiwgMS4yKVxuICAgIGxldCBhY3Rpb24yID0gY2MubW92ZUJ5KDAuMSwgMCwgMzApXG4gICAgbGV0IGFjdGlvbjMgPSBjYy5tb3ZlVG8oMC4yLCAwLCAwKVxuICAgIGxldCBhY3Rpb240ID0gY2Muc2NhbGVUbygwLjIsIDAuNSwgMC41KVxuICAgIC8vIGxldCBzZXEgPSBjYy5zZXF1ZW5jZShhY3Rpb24xLCBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgLy8gICBsZXQgc2VxMiA9IGNjLnNlcXVlbmNlKGFjdGlvbjMsIGNjLm1vdmVCeSgwLjEsIDAsIDApLCBhY3Rpb240LCBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgLy8gICAgIHMuc2NvcmVQb29sLnB1dCh0aGlzLm5vZGUpXG4gICAgLy8gICB9LCB0aGlzKSlcbiAgICAvLyAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxMilcbiAgICAvLyB9LCB0aGlzKSlcbiAgICAvLyB0aGlzLmxhYmVsLm5vZGUucnVuQWN0aW9uKHNlcSlcbiAgICBsZXQgc3BhMSA9IGNjLnNwYXduKGFjdGlvbjEsIGFjdGlvbjIpXG4gICAgbGV0IHNwYTIgPSBjYy5zcGF3bihhY3Rpb24zLCBhY3Rpb240KVxuICAgIGxldCBzZXEgPSBjYy5zZXF1ZW5jZShzcGExLCBzcGEyLCBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICBzLnNjb3JlUG9vbC5wdXQodGhpcy5ub2RlKVxuICAgIH0sIHRoaXMpKVxuICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKVxuICB9XG5cbiAgLy8gdXBkYXRlIChkdCkge30sXG59KTsiXX0=