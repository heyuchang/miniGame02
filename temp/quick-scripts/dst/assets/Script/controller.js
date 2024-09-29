
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

    this.musicManager.init();
    this.lateStart();
  },
  lateStart: function lateStart() {
    if (this.social.node.active) {
      this.social.closeBannerAdv();
    }

    this.pictorial.getComponent('pictorial').init(this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxjb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwibXVzaWNNYW5hZ2VyIiwicmVxdWlyZSIsImdhbWUiLCJwYWdlTWFuYWdlciIsInNvY2lhbCIsImNvbmZpZyIsIkpzb25Bc3NldCIsImdhbWVEYXRhIiwic2NvcmVNZ3IiLCJ0b3RhbFJhbmsiLCJOb2RlIiwiZ3JvdXBSYW5rIiwic3RhcnRQYWdlIiwibmF2Tm9kZSIsInBpY3RvcmlhbCIsImhlbHBQYWdlIiwic3RhcnQiLCJhY3RpdmUiLCJpbml0Iiwibm9kZSIsImxhdGVTdGFydCIsImNsb3NlQmFubmVyQWR2IiwiZ2V0Q29tcG9uZW50IiwiYmFubmVyTm9kZSIsInNjYWxlIiwib25PcGVuUGFnZSIsIm9uR2FtZVN0YXJ0QnV0dG9uIiwib3BlbkJhbm5lckFkdiIsInNob3dBbmltYXRpb24iLCJ0aGVuIiwiZ2FtZVN0YXJ0IiwiY2xvc2VSYW5rIiwib3BlblJhbmsiLCJzaG93UmFuayIsIm9wZW5Hcm91cFJhbmsiLCJzaG93R3JvdXBSYW5rIiwiYWRkUGFnZSIsImNsb3NlR3JvdXBSYW5rIiwicmVtb3ZlUGFnZSIsIm9wZW5QaWN0b3JpYWwiLCJjbG9zZVBpY3RvcmlhbCIsIm9wZW5IZWxwUGFnZSIsImNsb3NlSGVscFBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFJQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFFUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLFlBQVksRUFBRUMsT0FBTyxDQUFDLGNBQUQsQ0FEWDtBQUM2QjtBQUN2Q0MsSUFBQUEsSUFBSSxFQUFFRCxPQUFPLENBQUMsTUFBRCxDQUZIO0FBRWE7QUFDdkJFLElBQUFBLFdBQVcsRUFBRUYsT0FBTyxDQUFDLGFBQUQsQ0FIVjtBQUcyQjtBQUNyQ0csSUFB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OztBQUNBLFFBQUksS0FBS2IsTUFBTCxDQUFZZSxJQUFaLENBQWlCRixNQUFyQixFQUE2QjtBQUMzQixXQUFLYixNQUFMLENBQVkrQixhQUFaO0FBQ0EsV0FBS2hDLFdBQUwsQ0FBaUJpQyxPQUFqQixDQUF5QixDQUF6QjtBQUNEO0FBQ0YsR0FwRU07QUFxRVBDLEVBQUFBLGNBckVPLDRCQXFFVTtBQUNmLFNBQUsxQixTQUFMLENBQWVNLE1BQWYsR0FBd0IsS0FBeEI7QUFDQSxTQUFLSixPQUFMLENBQWFJLE1BQWIsR0FBc0IsSUFBdEI7O0FBQ0EsUUFBSSxLQUFLYixNQUFMLENBQVllLElBQVosQ0FBaUJGLE1BQXJCLEVBQTZCO0FBQzNCLFdBQUtiLE1BQUwsQ0FBWWlDLGNBQVo7QUFDQSxXQUFLbEMsV0FBTCxDQUFpQm1DLFVBQWpCLENBQTRCLENBQTVCO0FBQ0Q7QUFDRixHQTVFTTtBQTZFUEMsRUFBQUEsYUE3RU8sMkJBNkVTO0FBQ2QsU0FBS3pCLFNBQUwsQ0FBZUcsTUFBZixHQUF3QixJQUF4QjtBQUNELEdBL0VNO0FBZ0ZQdUIsRUFBQUEsY0FoRk8sNEJBZ0ZVO0FBQ2YsU0FBSzFCLFNBQUwsQ0FBZUcsTUFBZixHQUF3QixLQUF4QjtBQUNELEdBbEZNO0FBbUZQd0IsRUFBQUEsWUFuRk8sMEJBbUZRO0FBQ2IsU0FBSzFCLFFBQUwsQ0FBY0UsTUFBZCxHQUF1QixJQUF2QjtBQUNELEdBckZNO0FBc0ZQeUIsRUFBQUEsYUF0Rk8sMkJBc0ZTO0FBQ2QsU0FBSzNCLFFBQUwsQ0FBY0UsTUFBZCxHQUF1QixLQUF2QjtBQUNEO0FBeEZNLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBoZXl1Y2hhbmdcbiAqIEBmaWxlIOS4u+aOp+WItuWZqFxuICovXG5jYy5DbGFzcyh7XG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgcHJvcGVydGllczoge1xuICAgIG11c2ljTWFuYWdlcjogcmVxdWlyZSgnbXVzaWNNYW5hZ2VyJyksIC8v6Z+z5LmQ5o6n5Yi257uE5Lu2XG4gICAgZ2FtZTogcmVxdWlyZSgnZ2FtZScpLCAvL+S4u+a4uOaIj+aOp+WItuWZqFxuICAgIHBhZ2VNYW5hZ2VyOiByZXF1aXJlKCdwYWdlTWFuYWdlcicpLCAvL+mhtemdouaOp+WItuWZqFxuICAgIHNvY2lhbDogcmVxdWlyZSgnc29jaWFsJyksIC8v5o6S6KGM5qac44CB5bm/5ZGK5o6n5Yi25ZmoXG4gICAgY29uZmlnOiBjYy5Kc29uQXNzZXQsXG4gICAgZ2FtZURhdGE6IGNjLkpzb25Bc3NldCxcbiAgICBzY29yZU1ncjogcmVxdWlyZSgnc2NvcmUnKSwgLy/liIbmlbAg54m55pWI5o6n5Yi2XG4gICAgdG90YWxSYW5rOiBjYy5Ob2RlLFxuICAgIGdyb3VwUmFuazogY2MuTm9kZSxcbiAgICBzdGFydFBhZ2U6IHJlcXVpcmUoJ3N0YXJ0UGFnZScpLFxuICAgIG5hdk5vZGU6IGNjLk5vZGUsXG4gICAgcGljdG9yaWFsOiBjYy5Ob2RlLFxuICAgIGhlbHBQYWdlOiBjYy5Ob2RlLFxuICB9LFxuICBzdGFydCgpIHtcbiAgICB0aGlzLnRvdGFsUmFuay5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMucGljdG9yaWFsLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5nYW1lLmluaXQodGhpcylcbiAgICBpZiAodGhpcy5zb2NpYWwubm9kZS5hY3RpdmUpIHtcbiAgICAgIHRoaXMuc29jaWFsLmluaXQodGhpcylcbiAgICB9XG4gICAgdGhpcy5tdXNpY01hbmFnZXIuaW5pdCgpXG4gICAgdGhpcy5sYXRlU3RhcnQoKVxuICB9LFxuICBsYXRlU3RhcnQoKSB7XG4gICAgaWYgKHRoaXMuc29jaWFsLm5vZGUuYWN0aXZlKSB7XG4gICAgICB0aGlzLnNvY2lhbC5jbG9zZUJhbm5lckFkdigpXG4gICAgfVxuICAgIHRoaXMucGljdG9yaWFsLmdldENvbXBvbmVudCgncGljdG9yaWFsJykuaW5pdCh0aGlzKVxuICAgIHRoaXMuc3RhcnRQYWdlLmJhbm5lck5vZGUuc2NhbGUgPSAxXG4gICAgdGhpcy5wYWdlTWFuYWdlci5vbk9wZW5QYWdlKDApXG4gIH0sXG4gIG9uR2FtZVN0YXJ0QnV0dG9uKCkge1xuICAgIC8vIFRPRE86ICDlop7liqDkuIDkuKrliqjnlLtcbiAgICBpZiAodGhpcy5zb2NpYWwubm9kZS5hY3RpdmUpIHtcbiAgICAgIHRoaXMuc29jaWFsLm9wZW5CYW5uZXJBZHYoKVxuICAgIH1cbiAgICB0aGlzLnN0YXJ0UGFnZS5zaG93QW5pbWF0aW9uKCkudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLmdhbWVTdGFydCgpXG4gICAgfSlcbiAgfSxcbiAgZ2FtZVN0YXJ0KCkge1xuICAgIHRoaXMucGFnZU1hbmFnZXIub25PcGVuUGFnZSgxKVxuICAgIHRoaXMuZ2FtZS5nYW1lU3RhcnQoKVxuICB9LFxuICBjbG9zZVJhbmsoKSB7XG4gICAgdGhpcy50b3RhbFJhbmsuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLm5hdk5vZGUuYWN0aXZlID0gdHJ1ZVxuICAgIGlmICh0aGlzLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5zb2NpYWwuY2xvc2VSYW5rKClcbiAgICB9XG4gIH0sXG4gIG9wZW5SYW5rKCkge1xuICAgIHRoaXMudG90YWxSYW5rLmFjdGl2ZSA9IHRydWVcbiAgICB0aGlzLm5hdk5vZGUuYWN0aXZlID0gZmFsc2VcbiAgICBpZiAodGhpcy5zb2NpYWwubm9kZS5hY3RpdmUpIHtcbiAgICAgIHRoaXMuc29jaWFsLnNob3dSYW5rKClcbiAgICB9XG4gIH0sXG4gIG9wZW5Hcm91cFJhbmsoKSB7XG4gICAgdGhpcy5ncm91cFJhbmsuYWN0aXZlID0gdHJ1ZVxuICAgIGlmICh0aGlzLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5zb2NpYWwuc2hvd0dyb3VwUmFuaygpXG4gICAgICB0aGlzLnBhZ2VNYW5hZ2VyLmFkZFBhZ2UoNilcbiAgICB9XG4gIH0sXG4gIGNsb3NlR3JvdXBSYW5rKCkge1xuICAgIHRoaXMuZ3JvdXBSYW5rLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5uYXZOb2RlLmFjdGl2ZSA9IHRydWVcbiAgICBpZiAodGhpcy5zb2NpYWwubm9kZS5hY3RpdmUpIHtcbiAgICAgIHRoaXMuc29jaWFsLmNsb3NlR3JvdXBSYW5rKClcbiAgICAgIHRoaXMucGFnZU1hbmFnZXIucmVtb3ZlUGFnZSg2KVxuICAgIH1cbiAgfSxcbiAgb3BlblBpY3RvcmlhbCgpIHtcbiAgICB0aGlzLnBpY3RvcmlhbC5hY3RpdmUgPSB0cnVlXG4gIH0sXG4gIGNsb3NlUGljdG9yaWFsKCkge1xuICAgIHRoaXMucGljdG9yaWFsLmFjdGl2ZSA9IGZhbHNlXG4gIH0sXG4gIG9wZW5IZWxwUGFnZSgpIHtcbiAgICB0aGlzLmhlbHBQYWdlLmFjdGl2ZSA9IHRydWVcbiAgfSxcbiAgY2xvc2VIZWxwUGFnZSgpIHtcbiAgICB0aGlzLmhlbHBQYWdlLmFjdGl2ZSA9IGZhbHNlXG4gIH1cbn0pOyJdfQ==