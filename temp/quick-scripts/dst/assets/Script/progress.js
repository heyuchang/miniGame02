
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/progress.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'b6ca61w/99BeLZm6RuqYPHb', 'progress');
// Script/progress.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    usualNode: cc.Node,
    currentLabel: cc.Label,
    maxLabel: cc.Label,
    progress: cc.ProgressBar,
    nameLabel: cc.Label,
    levelLabel: cc.Label,
    limitNode: cc.Node,
    limitScore: cc.Label
  },
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  init: function init(current, data, level) {
    if (level < 15) {
      this.limitNode.active = false;
      this.usualNode.active = true;
      this.maxLabel.string = data.score;
      this.currentLabel.string = current; //  this.nameLabel.string = data.name

      this.progress.progress = current / data.score;
      this.levelLabel.string = "lv" + (level + '');
    } else {
      this.limitNode.active = true;
      this.usualNode.active = false;
      this.limitScore.string = current;
      this.progress.progress = 1;
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxwcm9ncmVzcy5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInVzdWFsTm9kZSIsIk5vZGUiLCJjdXJyZW50TGFiZWwiLCJMYWJlbCIsIm1heExhYmVsIiwicHJvZ3Jlc3MiLCJQcm9ncmVzc0JhciIsIm5hbWVMYWJlbCIsImxldmVsTGFiZWwiLCJsaW1pdE5vZGUiLCJsaW1pdFNjb3JlIiwiaW5pdCIsImN1cnJlbnQiLCJkYXRhIiwibGV2ZWwiLCJhY3RpdmUiLCJzdHJpbmciLCJzY29yZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFHUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLFNBQVMsRUFBRUosRUFBRSxDQUFDSyxJQURKO0FBRVZDLElBQUFBLFlBQVksRUFBRU4sRUFBRSxDQUFDTyxLQUZQO0FBR1ZDLElBQUFBLFFBQVEsRUFBRVIsRUFBRSxDQUFDTyxLQUhIO0FBSVZFLElBQUFBLFFBQVEsRUFBRVQsRUFBRSxDQUFDVSxXQUpIO0FBS1ZDLElBQUFBLFNBQVMsRUFBRVgsRUFBRSxDQUFDTyxLQUxKO0FBTVZLLElBQUFBLFVBQVUsRUFBRVosRUFBRSxDQUFDTyxLQU5MO0FBT1ZNLElBQUFBLFNBQVMsRUFBRWIsRUFBRSxDQUFDSyxJQVBKO0FBUVZTLElBQUFBLFVBQVUsRUFBRWQsRUFBRSxDQUFDTztBQVJMLEdBSEw7QUFjUDtBQUVBO0FBQ0FRLEVBQUFBLElBakJPLGdCQWlCRkMsT0FqQkUsRUFpQk9DLElBakJQLEVBaUJhQyxLQWpCYixFQWlCb0I7QUFDekIsUUFBSUEsS0FBSyxHQUFHLEVBQVosRUFBZ0I7QUFDZCxXQUFLTCxTQUFMLENBQWVNLE1BQWYsR0FBd0IsS0FBeEI7QUFDQSxXQUFLZixTQUFMLENBQWVlLE1BQWYsR0FBd0IsSUFBeEI7QUFDQSxXQUFLWCxRQUFMLENBQWNZLE1BQWQsR0FBdUJILElBQUksQ0FBQ0ksS0FBNUI7QUFDQSxXQUFLZixZQUFMLENBQWtCYyxNQUFsQixHQUEyQkosT0FBM0IsQ0FKYyxDQUtoQjs7QUFDRSxXQUFLUCxRQUFMLENBQWNBLFFBQWQsR0FBeUJPLE9BQU8sR0FBR0MsSUFBSSxDQUFDSSxLQUF4QztBQUNBLFdBQUtULFVBQUwsQ0FBZ0JRLE1BQWhCLEdBQXlCLFFBQVFGLEtBQUssR0FBRyxFQUFoQixDQUF6QjtBQUNELEtBUkQsTUFRTztBQUNMLFdBQUtMLFNBQUwsQ0FBZU0sTUFBZixHQUF3QixJQUF4QjtBQUNBLFdBQUtmLFNBQUwsQ0FBZWUsTUFBZixHQUF3QixLQUF4QjtBQUNBLFdBQUtMLFVBQUwsQ0FBZ0JNLE1BQWhCLEdBQXlCSixPQUF6QjtBQUNBLFdBQUtQLFFBQUwsQ0FBY0EsUUFBZCxHQUF5QixDQUF6QjtBQUNEO0FBRUYsR0FqQ00sQ0FtQ1A7O0FBbkNPLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gIHByb3BlcnRpZXM6IHtcbiAgICB1c3VhbE5vZGU6IGNjLk5vZGUsXG4gICAgY3VycmVudExhYmVsOiBjYy5MYWJlbCxcbiAgICBtYXhMYWJlbDogY2MuTGFiZWwsXG4gICAgcHJvZ3Jlc3M6IGNjLlByb2dyZXNzQmFyLFxuICAgIG5hbWVMYWJlbDogY2MuTGFiZWwsXG4gICAgbGV2ZWxMYWJlbDogY2MuTGFiZWwsXG4gICAgbGltaXROb2RlOiBjYy5Ob2RlLFxuICAgIGxpbWl0U2NvcmU6IGNjLkxhYmVsXG4gIH0sXG5cbiAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XG5cbiAgLy8gb25Mb2FkICgpIHt9LFxuICBpbml0KGN1cnJlbnQsIGRhdGEsIGxldmVsKSB7XG4gICAgaWYgKGxldmVsIDwgMTUpIHtcbiAgICAgIHRoaXMubGltaXROb2RlLmFjdGl2ZSA9IGZhbHNlXG4gICAgICB0aGlzLnVzdWFsTm9kZS5hY3RpdmUgPSB0cnVlXG4gICAgICB0aGlzLm1heExhYmVsLnN0cmluZyA9IGRhdGEuc2NvcmVcbiAgICAgIHRoaXMuY3VycmVudExhYmVsLnN0cmluZyA9IGN1cnJlbnRcbiAgICAvLyAgdGhpcy5uYW1lTGFiZWwuc3RyaW5nID0gZGF0YS5uYW1lXG4gICAgICB0aGlzLnByb2dyZXNzLnByb2dyZXNzID0gY3VycmVudCAvIGRhdGEuc2NvcmVcbiAgICAgIHRoaXMubGV2ZWxMYWJlbC5zdHJpbmcgPSBcImx2XCIgKyAobGV2ZWwgKyAnJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5saW1pdE5vZGUuYWN0aXZlID0gdHJ1ZVxuICAgICAgdGhpcy51c3VhbE5vZGUuYWN0aXZlID0gZmFsc2VcbiAgICAgIHRoaXMubGltaXRTY29yZS5zdHJpbmcgPSBjdXJyZW50XG4gICAgICB0aGlzLnByb2dyZXNzLnByb2dyZXNzID0gMVxuICAgIH1cblxuICB9XG5cbiAgLy8gdXBkYXRlIChkdCkge30sXG59KTsiXX0=