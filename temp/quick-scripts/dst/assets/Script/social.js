
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/social.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '53b05czD4xGgZ8D0pLpUj9M', 'social');
// Script/social.js

"use strict";

/**
 * @author heyuchang
 * @file  排行榜组件
 * @description 用户点击查看排行榜才检查授权,如果此时用户没有授权则进入授权界面
 */
cc.Class({
  "extends": cc.Component,
  properties: {
    display: cc.Sprite,
    groupDisplay: cc.Sprite,
    _isShow: false // score: 0

  },
  init: function init(c) {
    var _this = this;

    this._controller = c;
    wx.showShareMenu({
      withShareTicket: true
    });
    wx.onShareAppMessage(function () {
      return {
        title: "开局只是个农民，现在已经做到宰相",
        imageUrl: 'https://mmocgame.qpic.cn/wechatgame/LtJZOjH6Z9ibiaMlpqzldsOf46Q7TZiaysI1fwc4Oj1L3CkbCaJMAMoicibbHu2HUQkOib/0'
      };
    }); // 监听

    wx.onAudioInterruptionEnd(function () {
      c.musicMgr.pauseBg();
      c.musicMgr.resumeBg();
    });
    wx.onShow(function (options) {
      if (options.scene == 1044) {
        wx.postMessage({
          message: 'group',
          shareTicket: options.shareTicket
        });
        c.openGroupRank();
        _this.display.node.active = false;
        c.totalRank.active = false;
      }

      cc.director.resume();
    });
    wx.onHide(function () {
      cc.director.pause();
    }); // 获取最高官阶

    this.getHighestLevel();
  },
  getHighestLevel: function getHighestLevel() {
    var highLevel = wx.getStorageSync('highLevel');
    return highLevel;
  },
  getHighestScore: function getHighestScore() {
    var score = wx.getStorageSync('highScore');
    return score;
  },
  // --------------- share ----------------
  onShareButton: function onShareButton() {
    var self = this;
    wx.shareAppMessage({
      title: "我终于成为了" + this._controller.scoreMgr.levelData[this._controller.scoreMgr.level - 1].name + ",真是开心",
      // imageUrlId: 'oxEwGvClT0uldQ470pM84w',
      imageUrl: 'https://mmocgame.qpic.cn/wechatgame/LtJZOjH6Z9ibiaMlpqzldsOf46Q7TZiaysI1fwc4Oj1L3CkbCaJMAMoicibbHu2HUQkOib/0'
    });
  },
  onUsualShareButton: function onUsualShareButton() {
    wx.shareAppMessage({
      title: "只是个农民，现在已经做到宰相",
      // imageUrlId: 'oxEwGvClT0uldQ470pM84w',
      imageUrl: 'https://mmocgame.qpic.cn/wechatgame/LtJZOjH6Z9ibiaMlpqzldsOf46Q7TZiaysI1fwc4Oj1L3CkbCaJMAMoicibbHu2HUQkOib/0'
    });
  },
  onShakePhone: function onShakePhone() {
    wx.vibrateShort();
  },
  // ---------------分数上传---------------
  onGameOver: function onGameOver(level, score) {
    //上传分数
    //打开开放域
    this.score = score;
    var highLevel = level;
    var highScore = score;
    var self = this;
    wx.postMessage({
      event: 'setScore',
      score: score,
      level: level
    });
    highLevel = wx.getStorageSync('highLevel');
    highLevel = parseInt(highLevel);

    if (highLevel) {
      highLevel = highLevel < level ? level : highLevel;
    } else {
      highLevel = level;
    }

    highScore = wx.getStorageSync('highScore');

    if (highScore) {
      highScore = parseInt(highScore);
      highScore = highScore < score ? score : highScore;
    } else {
      highScore = score;
    }

    var highLevelName = this._controller.gameData.json.levelData[highLevel - 1].name;
    wx.setStorageSync('highLevel', highLevel + '');
    wx.setStorageSync('highScore', highScore + '');
    self._controller.scoreMgr.failHighScore.string = "您的最高分:" + (highScore + '');
    var kvDataList = new Array();
    kvDataList.push({
      key: "highLevel",
      value: highLevelName
    }, {
      key: "highScore",
      value: highScore + ''
    });
  },
  showRank: function showRank() {
    wx.postMessage({
      message: 'Show',
      event: 'getRank'
    });
    this.display.node.active = true;
    this._isShow = true;
  },
  closeRank: function closeRank() {
    this.display.node.active = false;
    wx.postMessage({
      message: 'Hide'
    });
    this._isShow = false;
  },
  showGroupRank: function showGroupRank() {
    wx.postMessage({
      message: 'Show'
    });
    this.groupDisplay.node.active = true;
    this._isShow = true;
  },
  // switchRankType() {
  //   wx.postMessage({
  //     message: 'switchRank'
  //   })
  //   this._isShow = true
  // },
  closeGroupRank: function closeGroupRank() {
    this.groupDisplay.node.active = false;
    wx.postMessage({
      message: 'Hide'
    });
    this._isShow = false;
  },
  createImage: function createImage(sprite, url) {
    var image = wx.createImage();

    image.onload = function () {
      var texture = new cc.Texture2D();
      texture.initWithElement(image);
      texture.handleLoadedTexture();
      sprite.spriteFrame = new cc.SpriteFrame(texture);
    };

    image.src = url;
  },
  update: function update() {
    if (this._isShow) {
      if (this.display.node.active) {
        this.display.node.getComponent(cc.WXSubContextView).update();
      }

      if (this.groupDisplay.node.active) {
        this.groupDisplay.node.getComponent(cc.WXSubContextView).update();
      }
    }
  },
  // 控制打开广告
  onReviveButton: function onReviveButton(type) {
    var _this2 = this;

    // 广告位
    var self = this;
    this.adType = type; //0表示加倍 1表示复活

    if (this.audioAd) {
      this.audioAd.show()["catch"](function () {
        // 失败重试
        _this2.audioAd.load().then(function () {
          return _this2.audioAd.show();
        })["catch"](function (err) {
          console.log('激励视频 广告显示失败', err.errMsg);

          if (self.adType) {
            self._controller.game.onSkipRevive();
          } else {
            self._controller.scoreMgr.onLevelUpButton();
          }
        });
      });
      return;
    }

    this.audioAd = wx.createRewardedVideoAd({
      adUnitId: 'adunit-482148cfeb243378'
    });
    this.audioAd.show()["catch"](function () {
      // 失败重试
      _this2.audioAd.load().then(function () {
        return _this2.audioAd.show();
      })["catch"](function (err) {
        self.fakeShare();
      });
    });
    this.audioAd.onError(function (err) {
      self.fakeShare();
    });
    this.audioAd.onClose(function (res) {
      if (self.adType) {
        if (res && res.isEnded || res === undefined) {
          self._controller.game.showReviveSuccess();
        } else {
          self._controller.game.askRevive();
        }
      } else {
        if (res && res.isEnded || res === undefined) {
          self._controller.scoreMgr.onLevelUpButton(2);
        }
      }
    });
  },
  fakeShare: function fakeShare() {
    var self = this;
    wx.shareAppMessage({
      title: "我已经玩到" + this._controller.scoreMgr.score + "分了，邀请你来挑战",
      // imageUrlId: 'oxEwGvClT0uldQ470pM84w',
      imageUrl: 'https://mmocgame.qpic.cn/wechatgame/LtJZOjH6Z9ibiaMlpqzldsOf46Q7TZiaysI1fwc4Oj1L3CkbCaJMAMoicibbHu2HUQkOib/0'
    });

    if (this.adType) {
      self._controller.game.showReviveSuccess();
    } else {
      self._controller.scoreMgr.onLevelUpButton(2);
    }
  },
  openBannerAdv: function openBannerAdv() {// 创建 Banner 广告实例，提前初始化
    // let screenWidth = wx.getSystemInfoSync().screenWidth
    // let bannerHeight = screenWidth / 350 * 120
    // let screenHeight = wx.getSystemInfoSync().screenHeight - 108
    // let adUnitIds = [
    //   'adunit-510a4ec39065ef96',
    //   'adunit-29b0fa7a2db8e8cb',
    //   'adunit-4020bb9ea439e6a5'
    // ]
    // if (this.bannerAd) {
    //   this.bannerAd.destroy()
    // }
    // this.bannerAd = wx.createBannerAd({
    //   adUnitId: adUnitIds[Math.floor(Math.random() * 3)],
    //   style: {
    //     left: 0,
    //     top: screenHeight,
    //     width: 620,
    //   }
    // })
    // // 在适合的场景显示 Banner 广告
    // this.bannerAd.onLoad(() => {
    //   // console.log('banner 广告加载成功')
    // })
    // this.bannerAd.onError((e) => {
    //   console.log('banner 广告加载失败', e)
    // })
    // this.bannerAd.show()
    //   .then()
  },
  navToMiniprogram: function navToMiniprogram(event, custom) {
    console.log(custom);
    wx.navigateToMiniProgram({
      appId: custom
    });
  },
  closeBannerAdv: function closeBannerAdv() {
    if (this.bannerAd) {
      this.bannerAd.hide();
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzb2NpYWwuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJkaXNwbGF5IiwiU3ByaXRlIiwiZ3JvdXBEaXNwbGF5IiwiX2lzU2hvdyIsImluaXQiLCJjIiwiX2NvbnRyb2xsZXIiLCJ3eCIsInNob3dTaGFyZU1lbnUiLCJ3aXRoU2hhcmVUaWNrZXQiLCJvblNoYXJlQXBwTWVzc2FnZSIsInRpdGxlIiwiaW1hZ2VVcmwiLCJvbkF1ZGlvSW50ZXJydXB0aW9uRW5kIiwibXVzaWNNZ3IiLCJwYXVzZUJnIiwicmVzdW1lQmciLCJvblNob3ciLCJvcHRpb25zIiwic2NlbmUiLCJwb3N0TWVzc2FnZSIsIm1lc3NhZ2UiLCJzaGFyZVRpY2tldCIsIm9wZW5Hcm91cFJhbmsiLCJub2RlIiwiYWN0aXZlIiwidG90YWxSYW5rIiwiZGlyZWN0b3IiLCJyZXN1bWUiLCJvbkhpZGUiLCJwYXVzZSIsImdldEhpZ2hlc3RMZXZlbCIsImhpZ2hMZXZlbCIsImdldFN0b3JhZ2VTeW5jIiwiZ2V0SGlnaGVzdFNjb3JlIiwic2NvcmUiLCJvblNoYXJlQnV0dG9uIiwic2VsZiIsInNoYXJlQXBwTWVzc2FnZSIsInNjb3JlTWdyIiwibGV2ZWxEYXRhIiwibGV2ZWwiLCJuYW1lIiwib25Vc3VhbFNoYXJlQnV0dG9uIiwib25TaGFrZVBob25lIiwidmlicmF0ZVNob3J0Iiwib25HYW1lT3ZlciIsImhpZ2hTY29yZSIsImV2ZW50IiwicGFyc2VJbnQiLCJoaWdoTGV2ZWxOYW1lIiwiZ2FtZURhdGEiLCJqc29uIiwic2V0U3RvcmFnZVN5bmMiLCJmYWlsSGlnaFNjb3JlIiwic3RyaW5nIiwia3ZEYXRhTGlzdCIsIkFycmF5IiwicHVzaCIsImtleSIsInZhbHVlIiwic2hvd1JhbmsiLCJjbG9zZVJhbmsiLCJzaG93R3JvdXBSYW5rIiwiY2xvc2VHcm91cFJhbmsiLCJjcmVhdGVJbWFnZSIsInNwcml0ZSIsInVybCIsImltYWdlIiwib25sb2FkIiwidGV4dHVyZSIsIlRleHR1cmUyRCIsImluaXRXaXRoRWxlbWVudCIsImhhbmRsZUxvYWRlZFRleHR1cmUiLCJzcHJpdGVGcmFtZSIsIlNwcml0ZUZyYW1lIiwic3JjIiwidXBkYXRlIiwiZ2V0Q29tcG9uZW50IiwiV1hTdWJDb250ZXh0VmlldyIsIm9uUmV2aXZlQnV0dG9uIiwidHlwZSIsImFkVHlwZSIsImF1ZGlvQWQiLCJzaG93IiwibG9hZCIsInRoZW4iLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiZXJyTXNnIiwiZ2FtZSIsIm9uU2tpcFJldml2ZSIsIm9uTGV2ZWxVcEJ1dHRvbiIsImNyZWF0ZVJld2FyZGVkVmlkZW9BZCIsImFkVW5pdElkIiwiZmFrZVNoYXJlIiwib25FcnJvciIsIm9uQ2xvc2UiLCJyZXMiLCJpc0VuZGVkIiwidW5kZWZpbmVkIiwic2hvd1Jldml2ZVN1Y2Nlc3MiLCJhc2tSZXZpdmUiLCJvcGVuQmFubmVyQWR2IiwibmF2VG9NaW5pcHJvZ3JhbSIsImN1c3RvbSIsIm5hdmlnYXRlVG9NaW5pUHJvZ3JhbSIsImFwcElkIiwiY2xvc2VCYW5uZXJBZHYiLCJiYW5uZXJBZCIsImhpZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7O0FBS0FBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBRVBDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxPQUFPLEVBQUVKLEVBQUUsQ0FBQ0ssTUFERjtBQUVWQyxJQUFBQSxZQUFZLEVBQUVOLEVBQUUsQ0FBQ0ssTUFGUDtBQUdWRSxJQUFBQSxPQUFPLEVBQUUsS0FIQyxDQUlWOztBQUpVLEdBRkw7QUFRUEMsRUFBQUEsSUFSTyxnQkFRRkMsQ0FSRSxFQVFDO0FBQUE7O0FBRU4sU0FBS0MsV0FBTCxHQUFtQkQsQ0FBbkI7QUFDQUUsSUFBQUEsRUFBRSxDQUFDQyxhQUFILENBQWlCO0FBQ2ZDLE1BQUFBLGVBQWUsRUFBRTtBQURGLEtBQWpC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TywyQkFzT1MsQ0FDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0QsR0FwUU07QUFxUVBDLEVBQUFBLGdCQXJRTyw0QkFxUVV6RCxLQXJRVixFQXFRZ0IwRCxNQXJRaEIsRUFxUXdCO0FBQzdCbEIsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlpQixNQUFaO0FBQ0FuRyxJQUFBQSxFQUFFLENBQUNvRyxxQkFBSCxDQUF5QjtBQUN2QkMsTUFBQUEsS0FBSyxFQUFFRjtBQURnQixLQUF6QjtBQUdELEdBMVFNO0FBMlFQRyxFQUFBQSxjQTNRTyw0QkEyUVU7QUFDZixRQUFJLEtBQUtDLFFBQVQsRUFBbUI7QUFDakIsV0FBS0EsUUFBTCxDQUFjQyxJQUFkO0FBQ0Q7QUFDRjtBQS9RTSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBhdXRob3IgaGV5dWNoYW5nXG4gKiBAZmlsZSAg5o6S6KGM5qac57uE5Lu2XG4gKiBAZGVzY3JpcHRpb24g55So5oi354K55Ye75p+l55yL5o6S6KGM5qac5omN5qOA5p+l5o6I5p2DLOWmguaenOatpOaXtueUqOaIt+ayoeacieaOiOadg+WImei/m+WFpeaOiOadg+eVjOmdolxuICovXG5jYy5DbGFzcyh7XG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgcHJvcGVydGllczoge1xuICAgIGRpc3BsYXk6IGNjLlNwcml0ZSxcbiAgICBncm91cERpc3BsYXk6IGNjLlNwcml0ZSxcbiAgICBfaXNTaG93OiBmYWxzZSxcbiAgICAvLyBzY29yZTogMFxuICB9LFxuICBpbml0KGMpIHtcblxuICAgIHRoaXMuX2NvbnRyb2xsZXIgPSBjXG4gICAgd3guc2hvd1NoYXJlTWVudSh7XG4gICAgICB3aXRoU2hhcmVUaWNrZXQ6IHRydWVcbiAgICB9KVxuICAgIHd4Lm9uU2hhcmVBcHBNZXNzYWdlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRpdGxlOiBcIuW8gOWxgOWPquaYr+S4quWGnOawke+8jOeOsOWcqOW3sue7j+WBmuWIsOWusOebuFwiLFxuICAgICAgICBpbWFnZVVybDogJ2h0dHBzOi8vbW1vY2dhbWUucXBpYy5jbi93ZWNoYXRnYW1lL0x0SlpPakg2WjlpYmlhTWxwcXpsZHNPZjQ2UTdUWmlheXNJMWZ3YzRPajFMM0NrYkNhSk1BTW9pY2liYkh1MkhVUWtPaWIvMCdcbiAgICAgIH1cbiAgICB9KVxuICAgIC8vIOebkeWQrFxuICAgIHd4Lm9uQXVkaW9JbnRlcnJ1cHRpb25FbmQoKCkgPT4ge1xuICAgICAgYy5tdXNpY01nci5wYXVzZUJnKClcbiAgICAgIGMubXVzaWNNZ3IucmVzdW1lQmcoKVxuICAgIH0pXG4gICAgd3gub25TaG93KChvcHRpb25zKSA9PiB7XG4gICAgICBpZiAob3B0aW9ucy5zY2VuZSA9PSAxMDQ0KSB7XG4gICAgICAgIHd4LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICBtZXNzYWdlOiAnZ3JvdXAnLFxuICAgICAgICAgIHNoYXJlVGlja2V0OiBvcHRpb25zLnNoYXJlVGlja2V0XG4gICAgICAgIH0pXG4gICAgICAgIGMub3Blbkdyb3VwUmFuaygpXG4gICAgICAgIHRoaXMuZGlzcGxheS5ub2RlLmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgIGMudG90YWxSYW5rLmFjdGl2ZSA9IGZhbHNlXG4gICAgICB9XG4gICAgICBjYy5kaXJlY3Rvci5yZXN1bWUoKVxuICAgIH0pXG4gICAgd3gub25IaWRlKCgpID0+IHtcbiAgICAgIGNjLmRpcmVjdG9yLnBhdXNlKClcbiAgICB9KVxuICAgIC8vIOiOt+WPluacgOmrmOWumOmYtlxuICAgIHRoaXMuZ2V0SGlnaGVzdExldmVsKClcbiAgfSxcbiAgZ2V0SGlnaGVzdExldmVsKCkge1xuICAgIGxldCBoaWdoTGV2ZWwgPSB3eC5nZXRTdG9yYWdlU3luYygnaGlnaExldmVsJylcbiAgICByZXR1cm4gaGlnaExldmVsXG4gIH0sXG4gIGdldEhpZ2hlc3RTY29yZSgpIHtcbiAgICBsZXQgc2NvcmUgPSB3eC5nZXRTdG9yYWdlU3luYygnaGlnaFNjb3JlJylcbiAgICByZXR1cm4gc2NvcmVcbiAgfSxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tIHNoYXJlIC0tLS0tLS0tLS0tLS0tLS1cbiAgb25TaGFyZUJ1dHRvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgd3guc2hhcmVBcHBNZXNzYWdlKHtcbiAgICAgIHRpdGxlOiBcIuaIkee7iOS6juaIkOS4uuS6hlwiICsgdGhpcy5fY29udHJvbGxlci5zY29yZU1nci5sZXZlbERhdGFbdGhpcy5fY29udHJvbGxlci5zY29yZU1nci5sZXZlbCAtIDFdLm5hbWUgKyBcIiznnJ/mmK/lvIDlv4NcIixcbiAgICAgIC8vIGltYWdlVXJsSWQ6ICdveEV3R3ZDbFQwdWxkUTQ3MHBNODR3JyxcbiAgICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9tbW9jZ2FtZS5xcGljLmNuL3dlY2hhdGdhbWUvTHRKWk9qSDZaOWliaWFNbHBxemxkc09mNDZRN1RaaWF5c0kxZndjNE9qMUwzQ2tiQ2FKTUFNb2ljaWJiSHUySFVRa09pYi8wJ1xuICAgIH0pXG4gIH0sXG4gIG9uVXN1YWxTaGFyZUJ1dHRvbigpIHtcbiAgICB3eC5zaGFyZUFwcE1lc3NhZ2Uoe1xuICAgICAgdGl0bGU6IFwi5Y+q5piv5Liq5Yac5rCR77yM546w5Zyo5bey57uP5YGa5Yiw5a6w55u4XCIsXG4gICAgICAvLyBpbWFnZVVybElkOiAnb3hFd0d2Q2xUMHVsZFE0NzBwTTg0dycsXG4gICAgICBpbWFnZVVybDogJ2h0dHBzOi8vbW1vY2dhbWUucXBpYy5jbi93ZWNoYXRnYW1lL0x0SlpPakg2WjlpYmlhTWxwcXpsZHNPZjQ2UTdUWmlheXNJMWZ3YzRPajFMM0NrYkNhSk1BTW9pY2liYkh1MkhVUWtPaWIvMCdcbiAgICB9KVxuICB9LFxuICBvblNoYWtlUGhvbmUoKSB7XG4gICAgd3gudmlicmF0ZVNob3J0KClcbiAgfSxcbiAgLy8gLS0tLS0tLS0tLS0tLS0t5YiG5pWw5LiK5LygLS0tLS0tLS0tLS0tLS0tXG4gIG9uR2FtZU92ZXIobGV2ZWwsIHNjb3JlKSB7XG4gICAgLy/kuIrkvKDliIbmlbBcbiAgICAvL+aJk+W8gOW8gOaUvuWfn1xuICAgIHRoaXMuc2NvcmUgPSBzY29yZVxuICAgIGxldCBoaWdoTGV2ZWwgPSBsZXZlbFxuICAgIGxldCBoaWdoU2NvcmUgPSBzY29yZVxuICAgIGxldCBzZWxmID0gdGhpc1xuXG4gICAgd3gucG9zdE1lc3NhZ2Uoe1xuICAgICAgZXZlbnQ6ICdzZXRTY29yZScsXG4gICAgICBzY29yZTogc2NvcmUsXG4gICAgICBsZXZlbDogbGV2ZWwsXG4gICAgfSlcbiAgICBcbiAgICBoaWdoTGV2ZWwgPSB3eC5nZXRTdG9yYWdlU3luYygnaGlnaExldmVsJylcbiAgICBoaWdoTGV2ZWwgPSBwYXJzZUludChoaWdoTGV2ZWwpXG4gICAgaWYgKGhpZ2hMZXZlbCkge1xuICAgICAgaGlnaExldmVsID0gaGlnaExldmVsIDwgbGV2ZWwgPyBsZXZlbCA6IGhpZ2hMZXZlbFxuICAgIH0gZWxzZSB7XG4gICAgICBoaWdoTGV2ZWwgPSBsZXZlbFxuICAgIH1cbiAgICBoaWdoU2NvcmUgPSB3eC5nZXRTdG9yYWdlU3luYygnaGlnaFNjb3JlJylcbiAgICBpZiAoaGlnaFNjb3JlKSB7XG4gICAgICBoaWdoU2NvcmUgPSBwYXJzZUludChoaWdoU2NvcmUpXG4gICAgICBoaWdoU2NvcmUgPSBoaWdoU2NvcmUgPCBzY29yZSA/IHNjb3JlIDogaGlnaFNjb3JlXG4gICAgfSBlbHNlIHtcbiAgICAgIGhpZ2hTY29yZSA9IHNjb3JlXG4gICAgfVxuICAgIHZhciBoaWdoTGV2ZWxOYW1lID0gdGhpcy5fY29udHJvbGxlci5nYW1lRGF0YS5qc29uLmxldmVsRGF0YVtoaWdoTGV2ZWwgLSAxXS5uYW1lXG4gICAgd3guc2V0U3RvcmFnZVN5bmMoJ2hpZ2hMZXZlbCcsIGhpZ2hMZXZlbCArICcnKVxuICAgIHd4LnNldFN0b3JhZ2VTeW5jKCdoaWdoU2NvcmUnLCBoaWdoU2NvcmUgKyAnJylcbiAgICBzZWxmLl9jb250cm9sbGVyLnNjb3JlTWdyLmZhaWxIaWdoU2NvcmUuc3RyaW5nID0gXCLmgqjnmoTmnIDpq5jliIY6XCIgKyAoaGlnaFNjb3JlICsgJycpXG4gICAgdmFyIGt2RGF0YUxpc3QgPSBuZXcgQXJyYXkoKVxuICAgIGt2RGF0YUxpc3QucHVzaCh7XG4gICAgICBrZXk6IFwiaGlnaExldmVsXCIsXG4gICAgICB2YWx1ZTogaGlnaExldmVsTmFtZSxcbiAgICB9LCB7XG4gICAgICBrZXk6IFwiaGlnaFNjb3JlXCIsXG4gICAgICB2YWx1ZTogaGlnaFNjb3JlICsgJycsXG4gICAgfSlcbiAgfSxcbiAgc2hvd1JhbmsoKSB7XG4gICAgd3gucG9zdE1lc3NhZ2Uoe1xuICAgICAgbWVzc2FnZTogJ1Nob3cnLFxuICAgICAgZXZlbnQ6ICdnZXRSYW5rJyxcbiAgICB9KVxuICAgIHRoaXMuZGlzcGxheS5ub2RlLmFjdGl2ZSA9IHRydWVcbiAgICB0aGlzLl9pc1Nob3cgPSB0cnVlXG4gIH0sXG5cbiAgY2xvc2VSYW5rKCkge1xuICAgIHRoaXMuZGlzcGxheS5ub2RlLmFjdGl2ZSA9IGZhbHNlXG4gICAgd3gucG9zdE1lc3NhZ2Uoe1xuICAgICAgbWVzc2FnZTogJ0hpZGUnXG4gICAgfSlcbiAgICB0aGlzLl9pc1Nob3cgPSBmYWxzZVxuICB9LFxuICBzaG93R3JvdXBSYW5rKCkge1xuICAgIHd4LnBvc3RNZXNzYWdlKHtcbiAgICAgIG1lc3NhZ2U6ICdTaG93J1xuICAgIH0pXG4gICAgdGhpcy5ncm91cERpc3BsYXkubm9kZS5hY3RpdmUgPSB0cnVlXG4gICAgdGhpcy5faXNTaG93ID0gdHJ1ZVxuICB9LFxuICAvLyBzd2l0Y2hSYW5rVHlwZSgpIHtcbiAgLy8gICB3eC5wb3N0TWVzc2FnZSh7XG4gIC8vICAgICBtZXNzYWdlOiAnc3dpdGNoUmFuaydcbiAgLy8gICB9KVxuICAvLyAgIHRoaXMuX2lzU2hvdyA9IHRydWVcbiAgLy8gfSxcbiAgY2xvc2VHcm91cFJhbmsoKSB7XG4gICAgdGhpcy5ncm91cERpc3BsYXkubm9kZS5hY3RpdmUgPSBmYWxzZVxuICAgIHd4LnBvc3RNZXNzYWdlKHtcbiAgICAgIG1lc3NhZ2U6ICdIaWRlJ1xuICAgIH0pXG4gICAgdGhpcy5faXNTaG93ID0gZmFsc2VcbiAgfSxcbiAgY3JlYXRlSW1hZ2Uoc3ByaXRlLCB1cmwpIHtcbiAgICBsZXQgaW1hZ2UgPSB3eC5jcmVhdGVJbWFnZSgpO1xuICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCB0ZXh0dXJlID0gbmV3IGNjLlRleHR1cmUyRCgpO1xuICAgICAgdGV4dHVyZS5pbml0V2l0aEVsZW1lbnQoaW1hZ2UpO1xuICAgICAgdGV4dHVyZS5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XG4gICAgICBzcHJpdGUuc3ByaXRlRnJhbWUgPSBuZXcgY2MuU3ByaXRlRnJhbWUodGV4dHVyZSk7XG4gICAgfTtcbiAgICBpbWFnZS5zcmMgPSB1cmw7XG4gIH0sXG4gIHVwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5faXNTaG93KSB7XG4gICAgICBpZiAodGhpcy5kaXNwbGF5Lm5vZGUuYWN0aXZlKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5ub2RlLmdldENvbXBvbmVudChjYy5XWFN1YkNvbnRleHRWaWV3KS51cGRhdGUoKVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZ3JvdXBEaXNwbGF5Lm5vZGUuYWN0aXZlKSB7XG4gICAgICAgIHRoaXMuZ3JvdXBEaXNwbGF5Lm5vZGUuZ2V0Q29tcG9uZW50KGNjLldYU3ViQ29udGV4dFZpZXcpLnVwZGF0ZSgpXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAvLyDmjqfliLbmiZPlvIDlub/lkYpcbiAgb25SZXZpdmVCdXR0b24odHlwZSkge1xuICAgIC8vIOW5v+WRiuS9jVxuICAgIGxldCBzZWxmID0gdGhpc1xuICAgIHRoaXMuYWRUeXBlID0gdHlwZSAvLzDooajnpLrliqDlgI0gMeihqOekuuWkjea0u1xuICAgIGlmICh0aGlzLmF1ZGlvQWQpIHtcbiAgICAgIHRoaXMuYXVkaW9BZC5zaG93KCkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAvLyDlpLHotKXph43or5VcbiAgICAgICAgdGhpcy5hdWRpb0FkLmxvYWQoKVxuICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuYXVkaW9BZC5zaG93KCkpXG4gICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn5r+A5Yqx6KeG6aKRIOW5v+WRiuaYvuekuuWksei0pScsIGVyci5lcnJNc2cpXG4gICAgICAgICAgICBpZiAoc2VsZi5hZFR5cGUpIHtcbiAgICAgICAgICAgICAgc2VsZi5fY29udHJvbGxlci5nYW1lLm9uU2tpcFJldml2ZSgpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWxmLl9jb250cm9sbGVyLnNjb3JlTWdyLm9uTGV2ZWxVcEJ1dHRvbigpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5hdWRpb0FkID0gd3guY3JlYXRlUmV3YXJkZWRWaWRlb0FkKHtcbiAgICAgIGFkVW5pdElkOiAnYWR1bml0LTQ4MjE0OGNmZWIyNDMzNzgnXG4gICAgfSlcbiAgICB0aGlzLmF1ZGlvQWQuc2hvdygpLmNhdGNoKCgpID0+IHtcbiAgICAgIC8vIOWksei0pemHjeivlVxuICAgICAgdGhpcy5hdWRpb0FkLmxvYWQoKVxuICAgICAgICAudGhlbigoKSA9PiB0aGlzLmF1ZGlvQWQuc2hvdygpKVxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICBzZWxmLmZha2VTaGFyZSgpXG4gICAgICAgIH0pXG4gICAgfSlcbiAgICB0aGlzLmF1ZGlvQWQub25FcnJvcihlcnIgPT4ge1xuICAgICAgc2VsZi5mYWtlU2hhcmUoKVxuICAgIH0pXG4gICAgdGhpcy5hdWRpb0FkLm9uQ2xvc2UoKHJlcykgPT4ge1xuICAgICAgaWYgKHNlbGYuYWRUeXBlKSB7XG4gICAgICAgIGlmIChyZXMgJiYgcmVzLmlzRW5kZWQgfHwgcmVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzZWxmLl9jb250cm9sbGVyLmdhbWUuc2hvd1Jldml2ZVN1Y2Nlc3MoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYuX2NvbnRyb2xsZXIuZ2FtZS5hc2tSZXZpdmUoKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocmVzICYmIHJlcy5pc0VuZGVkIHx8IHJlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc2VsZi5fY29udHJvbGxlci5zY29yZU1nci5vbkxldmVsVXBCdXR0b24oMilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIGZha2VTaGFyZSgpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICB3eC5zaGFyZUFwcE1lc3NhZ2Uoe1xuICAgICAgdGl0bGU6IFwi5oiR5bey57uP546p5YiwXCIgKyB0aGlzLl9jb250cm9sbGVyLnNjb3JlTWdyLnNjb3JlICsgXCLliIbkuobvvIzpgoDor7fkvaDmnaXmjJHmiJhcIixcbiAgICAgIC8vIGltYWdlVXJsSWQ6ICdveEV3R3ZDbFQwdWxkUTQ3MHBNODR3JyxcbiAgICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9tbW9jZ2FtZS5xcGljLmNuL3dlY2hhdGdhbWUvTHRKWk9qSDZaOWliaWFNbHBxemxkc09mNDZRN1RaaWF5c0kxZndjNE9qMUwzQ2tiQ2FKTUFNb2ljaWJiSHUySFVRa09pYi8wJ1xuICAgIH0pXG4gICAgaWYgKHRoaXMuYWRUeXBlKSB7XG4gICAgICBzZWxmLl9jb250cm9sbGVyLmdhbWUuc2hvd1Jldml2ZVN1Y2Nlc3MoKVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLl9jb250cm9sbGVyLnNjb3JlTWdyLm9uTGV2ZWxVcEJ1dHRvbigyKVxuICAgIH1cbiAgfSxcbiAgb3BlbkJhbm5lckFkdigpIHtcbiAgICAvLyDliJvlu7ogQmFubmVyIOW5v+WRiuWunuS+i++8jOaPkOWJjeWIneWni+WMllxuICAgIC8vIGxldCBzY3JlZW5XaWR0aCA9IHd4LmdldFN5c3RlbUluZm9TeW5jKCkuc2NyZWVuV2lkdGhcbiAgICAvLyBsZXQgYmFubmVySGVpZ2h0ID0gc2NyZWVuV2lkdGggLyAzNTAgKiAxMjBcbiAgICAvLyBsZXQgc2NyZWVuSGVpZ2h0ID0gd3guZ2V0U3lzdGVtSW5mb1N5bmMoKS5zY3JlZW5IZWlnaHQgLSAxMDhcbiAgICAvLyBsZXQgYWRVbml0SWRzID0gW1xuICAgIC8vICAgJ2FkdW5pdC01MTBhNGVjMzkwNjVlZjk2JyxcbiAgICAvLyAgICdhZHVuaXQtMjliMGZhN2EyZGI4ZThjYicsXG4gICAgLy8gICAnYWR1bml0LTQwMjBiYjllYTQzOWU2YTUnXG4gICAgLy8gXVxuICAgIC8vIGlmICh0aGlzLmJhbm5lckFkKSB7XG4gICAgLy8gICB0aGlzLmJhbm5lckFkLmRlc3Ryb3koKVxuICAgIC8vIH1cbiAgICAvLyB0aGlzLmJhbm5lckFkID0gd3guY3JlYXRlQmFubmVyQWQoe1xuICAgIC8vICAgYWRVbml0SWQ6IGFkVW5pdElkc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAzKV0sXG4gICAgLy8gICBzdHlsZToge1xuICAgIC8vICAgICBsZWZ0OiAwLFxuICAgIC8vICAgICB0b3A6IHNjcmVlbkhlaWdodCxcbiAgICAvLyAgICAgd2lkdGg6IDYyMCxcbiAgICAvLyAgIH1cbiAgICAvLyB9KVxuICAgIC8vIC8vIOWcqOmAguWQiOeahOWcuuaZr+aYvuekuiBCYW5uZXIg5bm/5ZGKXG4gICAgLy8gdGhpcy5iYW5uZXJBZC5vbkxvYWQoKCkgPT4ge1xuICAgIC8vICAgLy8gY29uc29sZS5sb2coJ2Jhbm5lciDlub/lkYrliqDovb3miJDlip8nKVxuICAgIC8vIH0pXG4gICAgLy8gdGhpcy5iYW5uZXJBZC5vbkVycm9yKChlKSA9PiB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnYmFubmVyIOW5v+WRiuWKoOi9veWksei0pScsIGUpXG4gICAgLy8gfSlcbiAgICAvLyB0aGlzLmJhbm5lckFkLnNob3coKVxuICAgIC8vICAgLnRoZW4oKVxuICB9LFxuICBuYXZUb01pbmlwcm9ncmFtKGV2ZW50LGN1c3RvbSkge1xuICAgIGNvbnNvbGUubG9nKGN1c3RvbSlcbiAgICB3eC5uYXZpZ2F0ZVRvTWluaVByb2dyYW0oe1xuICAgICAgYXBwSWQ6IGN1c3RvbVxuICAgIH0pXG4gIH0sXG4gIGNsb3NlQmFubmVyQWR2KCkge1xuICAgIGlmICh0aGlzLmJhbm5lckFkKSB7XG4gICAgICB0aGlzLmJhbm5lckFkLmhpZGUoKVxuICAgIH1cbiAgfVxufSk7Il19