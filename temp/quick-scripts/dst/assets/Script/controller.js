
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/controller.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'feefcb/VXtFp4L+Zqa6CrBZ', 'controller');
// Script/controller.js

"use strict";

/**
 * @author heyuchang
 * @file 主控制器
 */
cc.Class({
  "extends": cc.Component,
  properties: {
    musicMgr: require('musicMgr'),
    //音乐控制组件
    game: require('game'),
    //主游戏控制器
    pageMgr: require('pageMgr'),
    //页面控制器
    social: require('social'),
    //排行榜、广告控制器
    config: cc.JsonAsset,
    gameData: cc.JsonAsset,
    scoreMgr: require('score'),
    //分数 特效控制
    totalRank: cc.Node,
    groupRank: cc.Node,
    startPage: require('startPage'),
    navNode: cc.Node,
    pictorial: cc.Node,
    helpPage: cc.Node
  },
  start: function start() {
    this.totalRank.active = false;
    this.pictorial.active = false;
    this.game.init(this);

    if (this.social.node.active) {
      this.social.init(this);
    }

    this.musicMgr.init();
    this.lateStart();
  },
  lateStart: function lateStart() {
    if (this.social.node.active) {
      this.social.closeBannerAdv();
    }

    this.pictorial.getComponent('pictorial').init(this);
    this.startPage.bannerNode.scale = 1;
    this.pageMgr.onOpenPage(0);
  },
  onGameStartButton: function onGameStartButton() {
    var _this = this;

    // TODO:  增加一个动画
    if (this.social.node.active) {
      this.social.openBannerAdv();
    }

    this.startPage.showAnimation().then(function () {
      _this.gameStart();
    });
  },
  gameStart: function gameStart() {
    this.pageMgr.onOpenPage(1);
    this.game.gameStart();
  },
  closeRank: function closeRank() {
    this.totalRank.active = false;
    this.navNode.active = true;

    if (this.social.node.active) {
      this.social.closeRank();
    }
  },
  openRank: function openRank() {
    this.totalRank.active = true;
    this.navNode.active = false;

    if (this.social.node.active) {
      this.social.showRank();
    }
  },
  openGroupRank: function openGroupRank() {
    this.groupRank.active = true;

    if (this.social.node.active) {
      this.social.showGroupRank();
      this.pageMgr.addPage(6);
    }
  },
  closeGroupRank: function closeGroupRank() {
    this.groupRank.active = false;
    this.navNode.active = true;

    if (this.social.node.active) {
      this.social.closeGroupRank();
      this.pageMgr.removePage(6);
    }
  },
  openPictorial: function openPictorial() {
    this.pictorial.active = true;
  },
  closePictorial: function closePictorial() {
    this.pictorial.active = false;
  },
  openHelpPage: function openHelpPage() {
    this.helpPage.active = true;
  },
  closeHelpPage: function closeHelpPage() {
    this.helpPage.active = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxjb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwibXVzaWNNZ3IiLCJyZXF1aXJlIiwiZ2FtZSIsInBhZ2VNZ3IiLCJzb2NpYWwiLCJjb25maWciLCJKc29uQXNzZXQiLCJnYW1lRGF0YSIsInNjb3JlTWdyIiwidG90YWxSYW5rIiwiTm9kZSIsImdyb3VwUmFuayIsInN0YXJ0UGFnZSIsIm5hdk5vZGUiLCJwaWN0b3JpYWwiLCJoZWxwUGFnZSIsInN0YXJ0IiwiYWN0aXZlIiwiaW5pdCIsIm5vZGUiLCJsYXRlU3RhcnQiLCJjbG9zZUJhbm5lckFkdiIsImdldENvbXBvbmVudCIsImJhbm5lck5vZGUiLCJzY2FsZSIsIm9uT3BlblBhZ2UiLCJvbkdhbWVTdGFydEJ1dHRvbiIsIm9wZW5CYW5uZXJBZHYiLCJzaG93QW5pbWF0aW9uIiwidGhlbiIsImdhbWVTdGFydCIsImNsb3NlUmFuayIsIm9wZW5SYW5rIiwic2hvd1JhbmsiLCJvcGVuR3JvdXBSYW5rIiwic2hvd0dyb3VwUmFuayIsImFkZFBhZ2UiLCJjbG9zZUdyb3VwUmFuayIsInJlbW92ZVBhZ2UiLCJvcGVuUGljdG9yaWFsIiwiY2xvc2VQaWN0b3JpYWwiLCJvcGVuSGVscFBhZ2UiLCJjbG9zZUhlbHBQYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBSUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBRVBDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxRQUFRLEVBQUVDLE9BQU8sQ0FBQyxVQUFELENBRFA7QUFDcUI7QUFDL0JDLElBQUFBLElBQUksRUFBRUQsT0FBTyxDQUFDLE1BQUQsQ0FGSDtBQUVhO0FBQ3ZCRSxJQUFBQSxPQUFPLEVBQUVGLE9BQU8sQ0FBQyxTQUFELENBSE47QUFHbUI7QUFDN0JHLElBQUFBLE1BQU0s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QUtiLE1BQUwsQ0FBWWUsSUFBWixDQUFpQkYsTUFBckIsRUFBNkI7QUFDM0IsV0FBS2IsTUFBTCxDQUFZK0IsYUFBWjtBQUNBLFdBQUtoQyxPQUFMLENBQWFpQyxPQUFiLENBQXFCLENBQXJCO0FBQ0Q7QUFDRixHQXBFTTtBQXFFUEMsRUFBQUEsY0FyRU8sNEJBcUVVO0FBQ2YsU0FBSzFCLFNBQUwsQ0FBZU0sTUFBZixHQUF3QixLQUF4QjtBQUNBLFNBQUtKLE9BQUwsQ0FBYUksTUFBYixHQUFzQixJQUF0Qjs7QUFDQSxRQUFJLEtBQUtiLE1BQUwsQ0FBWWUsSUFBWixDQUFpQkYsTUFBckIsRUFBNkI7QUFDM0IsV0FBS2IsTUFBTCxDQUFZaUMsY0FBWjtBQUNBLFdBQUtsQyxPQUFMLENBQWFtQyxVQUFiLENBQXdCLENBQXhCO0FBQ0Q7QUFDRixHQTVFTTtBQTZFUEMsRUFBQUEsYUE3RU8sMkJBNkVTO0FBQ2QsU0FBS3pCLFNBQUwsQ0FBZUcsTUFBZixHQUF3QixJQUF4QjtBQUNELEdBL0VNO0FBZ0ZQdUIsRUFBQUEsY0FoRk8sNEJBZ0ZVO0FBQ2YsU0FBSzFCLFNBQUwsQ0FBZUcsTUFBZixHQUF3QixLQUF4QjtBQUNELEdBbEZNO0FBbUZQd0IsRUFBQUEsWUFuRk8sMEJBbUZRO0FBQ2IsU0FBSzFCLFFBQUwsQ0FBY0UsTUFBZCxHQUF1QixJQUF2QjtBQUNELEdBckZNO0FBc0ZQeUIsRUFBQUEsYUF0Rk8sMkJBc0ZTO0FBQ2QsU0FBSzNCLFFBQUwsQ0FBY0UsTUFBZCxHQUF1QixLQUF2QjtBQUNEO0FBeEZNLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBoZXl1Y2hhbmdcbiAqIEBmaWxlIOS4u+aOp+WItuWZqFxuICovXG5jYy5DbGFzcyh7XG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgcHJvcGVydGllczoge1xuICAgIG11c2ljTWdyOiByZXF1aXJlKCdtdXNpY01ncicpLCAvL+mfs+S5kOaOp+WItue7hOS7tlxuICAgIGdhbWU6IHJlcXVpcmUoJ2dhbWUnKSwgLy/kuLvmuLjmiI/mjqfliLblmahcbiAgICBwYWdlTWdyOiByZXF1aXJlKCdwYWdlTWdyJyksIC8v6aG16Z2i5o6n5Yi25ZmoXG4gICAgc29jaWFsOiByZXF1aXJlKCdzb2NpYWwnKSwgLy/mjpLooYzmppzjgIHlub/lkYrmjqfliLblmahcbiAgICBjb25maWc6IGNjLkpzb25Bc3NldCxcbiAgICBnYW1lRGF0YTogY2MuSnNvbkFzc2V0LFxuICAgIHNjb3JlTWdyOiByZXF1aXJlKCdzY29yZScpLCAvL+WIhuaVsCDnibnmlYjmjqfliLZcbiAgICB0b3RhbFJhbms6IGNjLk5vZGUsXG4gICAgZ3JvdXBSYW5rOiBjYy5Ob2RlLFxuICAgIHN0YXJ0UGFnZTogcmVxdWlyZSgnc3RhcnRQYWdlJyksXG4gICAgbmF2Tm9kZTogY2MuTm9kZSxcbiAgICBwaWN0b3JpYWw6IGNjLk5vZGUsXG4gICAgaGVscFBhZ2U6IGNjLk5vZGUsXG4gIH0sXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMudG90YWxSYW5rLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5waWN0b3JpYWwuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLmdhbWUuaW5pdCh0aGlzKVxuICAgIGlmICh0aGlzLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5zb2NpYWwuaW5pdCh0aGlzKVxuICAgIH1cbiAgICB0aGlzLm11c2ljTWdyLmluaXQoKVxuICAgIHRoaXMubGF0ZVN0YXJ0KClcbiAgfSxcbiAgbGF0ZVN0YXJ0KCkge1xuICAgIGlmICh0aGlzLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5zb2NpYWwuY2xvc2VCYW5uZXJBZHYoKVxuICAgIH1cbiAgICB0aGlzLnBpY3RvcmlhbC5nZXRDb21wb25lbnQoJ3BpY3RvcmlhbCcpLmluaXQodGhpcylcbiAgICB0aGlzLnN0YXJ0UGFnZS5iYW5uZXJOb2RlLnNjYWxlID0gMVxuICAgIHRoaXMucGFnZU1nci5vbk9wZW5QYWdlKDApXG4gIH0sXG4gIG9uR2FtZVN0YXJ0QnV0dG9uKCkge1xuICAgIC8vIFRPRE86ICDlop7liqDkuIDkuKrliqjnlLtcbiAgICBpZiAodGhpcy5zb2NpYWwubm9kZS5hY3RpdmUpIHtcbiAgICAgIHRoaXMuc29jaWFsLm9wZW5CYW5uZXJBZHYoKVxuICAgIH1cbiAgICB0aGlzLnN0YXJ0UGFnZS5zaG93QW5pbWF0aW9uKCkudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLmdhbWVTdGFydCgpXG4gICAgfSlcbiAgfSxcbiAgZ2FtZVN0YXJ0KCkge1xuICAgIHRoaXMucGFnZU1nci5vbk9wZW5QYWdlKDEpXG4gICAgdGhpcy5nYW1lLmdhbWVTdGFydCgpXG4gIH0sXG4gIGNsb3NlUmFuaygpIHtcbiAgICB0aGlzLnRvdGFsUmFuay5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMubmF2Tm9kZS5hY3RpdmUgPSB0cnVlXG4gICAgaWYgKHRoaXMuc29jaWFsLm5vZGUuYWN0aXZlKSB7XG4gICAgICB0aGlzLnNvY2lhbC5jbG9zZVJhbmsoKVxuICAgIH1cbiAgfSxcbiAgb3BlblJhbmsoKSB7XG4gICAgdGhpcy50b3RhbFJhbmsuYWN0aXZlID0gdHJ1ZVxuICAgIHRoaXMubmF2Tm9kZS5hY3RpdmUgPSBmYWxzZVxuICAgIGlmICh0aGlzLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5zb2NpYWwuc2hvd1JhbmsoKVxuICAgIH1cbiAgfSxcbiAgb3Blbkdyb3VwUmFuaygpIHtcbiAgICB0aGlzLmdyb3VwUmFuay5hY3RpdmUgPSB0cnVlXG4gICAgaWYgKHRoaXMuc29jaWFsLm5vZGUuYWN0aXZlKSB7XG4gICAgICB0aGlzLnNvY2lhbC5zaG93R3JvdXBSYW5rKClcbiAgICAgIHRoaXMucGFnZU1nci5hZGRQYWdlKDYpXG4gICAgfVxuICB9LFxuICBjbG9zZUdyb3VwUmFuaygpIHtcbiAgICB0aGlzLmdyb3VwUmFuay5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMubmF2Tm9kZS5hY3RpdmUgPSB0cnVlXG4gICAgaWYgKHRoaXMuc29jaWFsLm5vZGUuYWN0aXZlKSB7XG4gICAgICB0aGlzLnNvY2lhbC5jbG9zZUdyb3VwUmFuaygpXG4gICAgICB0aGlzLnBhZ2VNZ3IucmVtb3ZlUGFnZSg2KVxuICAgIH1cbiAgfSxcbiAgb3BlblBpY3RvcmlhbCgpIHtcbiAgICB0aGlzLnBpY3RvcmlhbC5hY3RpdmUgPSB0cnVlXG4gIH0sXG4gIGNsb3NlUGljdG9yaWFsKCkge1xuICAgIHRoaXMucGljdG9yaWFsLmFjdGl2ZSA9IGZhbHNlXG4gIH0sXG4gIG9wZW5IZWxwUGFnZSgpIHtcbiAgICB0aGlzLmhlbHBQYWdlLmFjdGl2ZSA9IHRydWVcbiAgfSxcbiAgY2xvc2VIZWxwUGFnZSgpIHtcbiAgICB0aGlzLmhlbHBQYWdlLmFjdGl2ZSA9IGZhbHNlXG4gIH1cbn0pOyJdfQ==