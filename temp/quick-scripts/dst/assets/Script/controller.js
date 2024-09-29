
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
    musicManager: require('musicManager'),
    //音乐控制组件
    game: require('game'),
    //主游戏控制器
    pageManager: require('pageManager'),
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
    illustrative: cc.Node,
    helpPage: cc.Node
  },
  start: function start() {
    this.totalRank.active = false;
    this.illustrative.active = false;
    this.game.init(this);

    if (this.social.node.active) {
      this.social.init(this);
    }

    this.musicManager.init();
    this.lateStart();
  },
  lateStart: function lateStart() {
    if (this.social.node.active) {
      this.social.closeBannerAdv();
    }

    this.illustrative.getComponent('illustrative').init(this);
    this.startPage.bannerNode.scale = 1;
    this.pageManager.onOpenPage(0);
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
    this.pageManager.onOpenPage(1);
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
      this.pageManager.addPage(6);
    }
  },
  closeGroupRank: function closeGroupRank() {
    this.groupRank.active = false;
    this.navNode.active = true;

    if (this.social.node.active) {
      this.social.closeGroupRank();
      this.pageManager.removePage(6);
    }
  },
  openPictorial: function openPictorial() {
    this.illustrative.active = true;
  },
  closePictorial: function closePictorial() {
    this.illustrative.active = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxjb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwibXVzaWNNYW5hZ2VyIiwicmVxdWlyZSIsImdhbWUiLCJwYWdlTWFuYWdlciIsInNvY2lhbCIsImNvbmZpZyIsIkpzb25Bc3NldCIsImdhbWVEYXRhIiwic2NvcmVNZ3IiLCJ0b3RhbFJhbmsiLCJOb2RlIiwiZ3JvdXBSYW5rIiwic3RhcnRQYWdlIiwibmF2Tm9kZSIsImlsbHVzdHJhdGl2ZSIsImhlbHBQYWdlIiwic3RhcnQiLCJhY3RpdmUiLCJpbml0Iiwibm9kZSIsImxhdGVTdGFydCIsImNsb3NlQmFubmVyQWR2IiwiZ2V0Q29tcG9uZW50IiwiYmFubmVyTm9kZSIsInNjYWxlIiwib25PcGVuUGFnZSIsIm9uR2FtZVN0YXJ0QnV0dG9uIiwib3BlbkJhbm5lckFkdiIsInNob3dBbmltYXRpb24iLCJ0aGVuIiwiZ2FtZVN0YXJ0IiwiY2xvc2VSYW5rIiwib3BlblJhbmsiLCJzaG93UmFuayIsIm9wZW5Hcm91cFJhbmsiLCJzaG93R3JvdXBSYW5rIiwiYWRkUGFnZSIsImNsb3NlR3JvdXBSYW5rIiwicmVtb3ZlUGFnZSIsIm9wZW5QaWN0b3JpYWwiLCJjbG9zZVBpY3RvcmlhbCIsIm9wZW5IZWxwUGFnZSIsImNsb3NlSGVscFBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFJQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFFUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLFlBQVksRUFBRUMsT0FBTyxDQUFDLGNBQUQsQ0FEWDtBQUM2QjtBQUN2Q0MsSUFBQUEsSUFBSSxFQUFFRCxPQUFPLENBQUMsTUFBRCxDQUZIO0FBRWE7QUFDdkJFLElBQUFBLFdBQVcsRUFBRUYsT0FBTyxDQUFDLGFBQUQsQ0FIVjtBQUcyQjtBQUNyQ0cs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QixJQUF4Qjs7QUFDQSxRQUFJLEtBQUtiLE1BQUwsQ0FBWWUsSUFBWixDQUFpQkYsTUFBckIsRUFBNkI7QUFDM0IsV0FBS2IsTUFBTCxDQUFZK0IsYUFBWjtBQUNBLFdBQUtoQyxXQUFMLENBQWlCaUMsT0FBakIsQ0FBeUIsQ0FBekI7QUFDRDtBQUNGLEdBcEVNO0FBcUVQQyxFQUFBQSxjQXJFTyw0QkFxRVU7QUFDZixTQUFLMUIsU0FBTCxDQUFlTSxNQUFmLEdBQXdCLEtBQXhCO0FBQ0EsU0FBS0osT0FBTCxDQUFhSSxNQUFiLEdBQXNCLElBQXRCOztBQUNBLFFBQUksS0FBS2IsTUFBTCxDQUFZZSxJQUFaLENBQWlCRixNQUFyQixFQUE2QjtBQUMzQixXQUFLYixNQUFMLENBQVlpQyxjQUFaO0FBQ0EsV0FBS2xDLFdBQUwsQ0FBaUJtQyxVQUFqQixDQUE0QixDQUE1QjtBQUNEO0FBQ0YsR0E1RU07QUE2RVBDLEVBQUFBLGFBN0VPLDJCQTZFUztBQUNkLFNBQUt6QixZQUFMLENBQWtCRyxNQUFsQixHQUEyQixJQUEzQjtBQUNELEdBL0VNO0FBZ0ZQdUIsRUFBQUEsY0FoRk8sNEJBZ0ZVO0FBQ2YsU0FBSzFCLFlBQUwsQ0FBa0JHLE1BQWxCLEdBQTJCLEtBQTNCO0FBQ0QsR0FsRk07QUFtRlB3QixFQUFBQSxZQW5GTywwQkFtRlE7QUFDYixTQUFLMUIsUUFBTCxDQUFjRSxNQUFkLEdBQXVCLElBQXZCO0FBQ0QsR0FyRk07QUFzRlB5QixFQUFBQSxhQXRGTywyQkFzRlM7QUFDZCxTQUFLM0IsUUFBTCxDQUFjRSxNQUFkLEdBQXVCLEtBQXZCO0FBQ0Q7QUF4Rk0sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAYXV0aG9yIGhleXVjaGFuZ1xuICogQGZpbGUg5Li75o6n5Yi25ZmoXG4gKi9cbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbXVzaWNNYW5hZ2VyOiByZXF1aXJlKCdtdXNpY01hbmFnZXInKSwgLy/pn7PkuZDmjqfliLbnu4Tku7ZcbiAgICBnYW1lOiByZXF1aXJlKCdnYW1lJyksIC8v5Li75ri45oiP5o6n5Yi25ZmoXG4gICAgcGFnZU1hbmFnZXI6IHJlcXVpcmUoJ3BhZ2VNYW5hZ2VyJyksIC8v6aG16Z2i5o6n5Yi25ZmoXG4gICAgc29jaWFsOiByZXF1aXJlKCdzb2NpYWwnKSwgLy/mjpLooYzmppzjgIHlub/lkYrmjqfliLblmahcbiAgICBjb25maWc6IGNjLkpzb25Bc3NldCxcbiAgICBnYW1lRGF0YTogY2MuSnNvbkFzc2V0LFxuICAgIHNjb3JlTWdyOiByZXF1aXJlKCdzY29yZScpLCAvL+WIhuaVsCDnibnmlYjmjqfliLZcbiAgICB0b3RhbFJhbms6IGNjLk5vZGUsXG4gICAgZ3JvdXBSYW5rOiBjYy5Ob2RlLFxuICAgIHN0YXJ0UGFnZTogcmVxdWlyZSgnc3RhcnRQYWdlJyksXG4gICAgbmF2Tm9kZTogY2MuTm9kZSxcbiAgICBpbGx1c3RyYXRpdmU6IGNjLk5vZGUsXG4gICAgaGVscFBhZ2U6IGNjLk5vZGUsXG4gIH0sXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMudG90YWxSYW5rLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5pbGx1c3RyYXRpdmUuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLmdhbWUuaW5pdCh0aGlzKVxuICAgIGlmICh0aGlzLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5zb2NpYWwuaW5pdCh0aGlzKVxuICAgIH1cbiAgICB0aGlzLm11c2ljTWFuYWdlci5pbml0KClcbiAgICB0aGlzLmxhdGVTdGFydCgpXG4gIH0sXG4gIGxhdGVTdGFydCgpIHtcbiAgICBpZiAodGhpcy5zb2NpYWwubm9kZS5hY3RpdmUpIHtcbiAgICAgIHRoaXMuc29jaWFsLmNsb3NlQmFubmVyQWR2KClcbiAgICB9XG4gICAgdGhpcy5pbGx1c3RyYXRpdmUuZ2V0Q29tcG9uZW50KCdpbGx1c3RyYXRpdmUnKS5pbml0KHRoaXMpXG4gICAgdGhpcy5zdGFydFBhZ2UuYmFubmVyTm9kZS5zY2FsZSA9IDFcbiAgICB0aGlzLnBhZ2VNYW5hZ2VyLm9uT3BlblBhZ2UoMClcbiAgfSxcbiAgb25HYW1lU3RhcnRCdXR0b24oKSB7XG4gICAgLy8gVE9ETzogIOWinuWKoOS4gOS4quWKqOeUu1xuICAgIGlmICh0aGlzLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5zb2NpYWwub3BlbkJhbm5lckFkdigpXG4gICAgfVxuICAgIHRoaXMuc3RhcnRQYWdlLnNob3dBbmltYXRpb24oKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuZ2FtZVN0YXJ0KClcbiAgICB9KVxuICB9LFxuICBnYW1lU3RhcnQoKSB7XG4gICAgdGhpcy5wYWdlTWFuYWdlci5vbk9wZW5QYWdlKDEpXG4gICAgdGhpcy5nYW1lLmdhbWVTdGFydCgpXG4gIH0sXG4gIGNsb3NlUmFuaygpIHtcbiAgICB0aGlzLnRvdGFsUmFuay5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMubmF2Tm9kZS5hY3RpdmUgPSB0cnVlXG4gICAgaWYgKHRoaXMuc29jaWFsLm5vZGUuYWN0aXZlKSB7XG4gICAgICB0aGlzLnNvY2lhbC5jbG9zZVJhbmsoKVxuICAgIH1cbiAgfSxcbiAgb3BlblJhbmsoKSB7XG4gICAgdGhpcy50b3RhbFJhbmsuYWN0aXZlID0gdHJ1ZVxuICAgIHRoaXMubmF2Tm9kZS5hY3RpdmUgPSBmYWxzZVxuICAgIGlmICh0aGlzLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5zb2NpYWwuc2hvd1JhbmsoKVxuICAgIH1cbiAgfSxcbiAgb3Blbkdyb3VwUmFuaygpIHtcbiAgICB0aGlzLmdyb3VwUmFuay5hY3RpdmUgPSB0cnVlXG4gICAgaWYgKHRoaXMuc29jaWFsLm5vZGUuYWN0aXZlKSB7XG4gICAgICB0aGlzLnNvY2lhbC5zaG93R3JvdXBSYW5rKClcbiAgICAgIHRoaXMucGFnZU1hbmFnZXIuYWRkUGFnZSg2KVxuICAgIH1cbiAgfSxcbiAgY2xvc2VHcm91cFJhbmsoKSB7XG4gICAgdGhpcy5ncm91cFJhbmsuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLm5hdk5vZGUuYWN0aXZlID0gdHJ1ZVxuICAgIGlmICh0aGlzLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5zb2NpYWwuY2xvc2VHcm91cFJhbmsoKVxuICAgICAgdGhpcy5wYWdlTWFuYWdlci5yZW1vdmVQYWdlKDYpXG4gICAgfVxuICB9LFxuICBvcGVuUGljdG9yaWFsKCkge1xuICAgIHRoaXMuaWxsdXN0cmF0aXZlLmFjdGl2ZSA9IHRydWVcbiAgfSxcbiAgY2xvc2VQaWN0b3JpYWwoKSB7XG4gICAgdGhpcy5pbGx1c3RyYXRpdmUuYWN0aXZlID0gZmFsc2VcbiAgfSxcbiAgb3BlbkhlbHBQYWdlKCkge1xuICAgIHRoaXMuaGVscFBhZ2UuYWN0aXZlID0gdHJ1ZVxuICB9LFxuICBjbG9zZUhlbHBQYWdlKCkge1xuICAgIHRoaXMuaGVscFBhZ2UuYWN0aXZlID0gZmFsc2VcbiAgfVxufSk7Il19