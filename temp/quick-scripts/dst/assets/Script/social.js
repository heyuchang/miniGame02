
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
      c.musicManager.pauseBg();
      c.musicManager.resumeBg();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzb2NpYWwuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJkaXNwbGF5IiwiU3ByaXRlIiwiZ3JvdXBEaXNwbGF5IiwiX2lzU2hvdyIsImluaXQiLCJjIiwiX2NvbnRyb2xsZXIiLCJ3eCIsInNob3dTaGFyZU1lbnUiLCJ3aXRoU2hhcmVUaWNrZXQiLCJvblNoYXJlQXBwTWVzc2FnZSIsInRpdGxlIiwiaW1hZ2VVcmwiLCJvbkF1ZGlvSW50ZXJydXB0aW9uRW5kIiwibXVzaWNNYW5hZ2VyIiwicGF1c2VCZyIsInJlc3VtZUJnIiwib25TaG93Iiwib3B0aW9ucyIsInNjZW5lIiwicG9zdE1lc3NhZ2UiLCJtZXNzYWdlIiwic2hhcmVUaWNrZXQiLCJvcGVuR3JvdXBSYW5rIiwibm9kZSIsImFjdGl2ZSIsInRvdGFsUmFuayIsImRpcmVjdG9yIiwicmVzdW1lIiwib25IaWRlIiwicGF1c2UiLCJnZXRIaWdoZXN0TGV2ZWwiLCJoaWdoTGV2ZWwiLCJnZXRTdG9yYWdlU3luYyIsImdldEhpZ2hlc3RTY29yZSIsInNjb3JlIiwib25TaGFyZUJ1dHRvbiIsInNlbGYiLCJzaGFyZUFwcE1lc3NhZ2UiLCJzY29yZU1nciIsImxldmVsRGF0YSIsImxldmVsIiwibmFtZSIsIm9uVXN1YWxTaGFyZUJ1dHRvbiIsIm9uU2hha2VQaG9uZSIsInZpYnJhdGVTaG9ydCIsIm9uR2FtZU92ZXIiLCJoaWdoU2NvcmUiLCJldmVudCIsInBhcnNlSW50IiwiaGlnaExldmVsTmFtZSIsImdhbWVEYXRhIiwianNvbiIsInNldFN0b3JhZ2VTeW5jIiwiZmFpbEhpZ2hTY29yZSIsInN0cmluZyIsImt2RGF0YUxpc3QiLCJBcnJheSIsInB1c2giLCJrZXkiLCJ2YWx1ZSIsInNob3dSYW5rIiwiY2xvc2VSYW5rIiwic2hvd0dyb3VwUmFuayIsImNsb3NlR3JvdXBSYW5rIiwiY3JlYXRlSW1hZ2UiLCJzcHJpdGUiLCJ1cmwiLCJpbWFnZSIsIm9ubG9hZCIsInRleHR1cmUiLCJUZXh0dXJlMkQiLCJpbml0V2l0aEVsZW1lbnQiLCJoYW5kbGVMb2FkZWRUZXh0dXJlIiwic3ByaXRlRnJhbWUiLCJTcHJpdGVGcmFtZSIsInNyYyIsInVwZGF0ZSIsImdldENvbXBvbmVudCIsIldYU3ViQ29udGV4dFZpZXciLCJvblJldml2ZUJ1dHRvbiIsInR5cGUiLCJhZFR5cGUiLCJhdWRpb0FkIiwic2hvdyIsImxvYWQiLCJ0aGVuIiwiZXJyIiwiY29uc29sZSIsImxvZyIsImVyck1zZyIsImdhbWUiLCJvblNraXBSZXZpdmUiLCJvbkxldmVsVXBCdXR0b24iLCJjcmVhdGVSZXdhcmRlZFZpZGVvQWQiLCJhZFVuaXRJZCIsImZha2VTaGFyZSIsIm9uRXJyb3IiLCJvbkNsb3NlIiwicmVzIiwiaXNFbmRlZCIsInVuZGVmaW5lZCIsInNob3dSZXZpdmVTdWNjZXNzIiwiYXNrUmV2aXZlIiwib3BlbkJhbm5lckFkdiIsIm5hdlRvTWluaXByb2dyYW0iLCJjdXN0b20iLCJuYXZpZ2F0ZVRvTWluaVByb2dyYW0iLCJhcHBJZCIsImNsb3NlQmFubmVyQWR2IiwiYmFubmVyQWQiLCJoaWRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7OztBQUtBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUVQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsT0FBTyxFQUFFSixFQUFFLENBQUNLLE1BREY7QUFFVkMsSUFBQUEsWUFBWSxFQUFFTixFQUFFLENBQUNLLE1BRlA7QUFHVkUsSUFBQUEsT0FBTyxFQUFFLEtBSEMsQ0FJVjs7QUFKVSxHQUZMO0FBUVBDLEVBQUFBLElBUk8sZ0JBUUZDLENBUkUsRUFRQztBQUFBOztBQUVOLFNBQUtDLFdBQUwsR0FBbUJELENBQW5CO0FBQ0FFLElBQUFBLEVBQUUsQ0FBQ0MsYUFBSCxDQUFpQjtBQUNmQyxNQUFBQSxlQUFlLEVBQUU7QUFERixL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YUF0T08sMkJBc09TLENBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNELEdBcFFNO0FBcVFQQyxFQUFBQSxnQkFyUU8sNEJBcVFVekQsS0FyUVYsRUFxUWdCMEQsTUFyUWhCLEVBcVF3QjtBQUM3QmxCLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZaUIsTUFBWjtBQUNBbkcsSUFBQUEsRUFBRSxDQUFDb0cscUJBQUgsQ0FBeUI7QUFDdkJDLE1BQUFBLEtBQUssRUFBRUY7QUFEZ0IsS0FBekI7QUFHRCxHQTFRTTtBQTJRUEcsRUFBQUEsY0EzUU8sNEJBMlFVO0FBQ2YsUUFBSSxLQUFLQyxRQUFULEVBQW1CO0FBQ2pCLFdBQUtBLFFBQUwsQ0FBY0MsSUFBZDtBQUNEO0FBQ0Y7QUEvUU0sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAYXV0aG9yIGhleXVjaGFuZ1xuICogQGZpbGUgIOaOkuihjOamnOe7hOS7tlxuICogQGRlc2NyaXB0aW9uIOeUqOaIt+eCueWHu+afpeeci+aOkuihjOamnOaJjeajgOafpeaOiOadgyzlpoLmnpzmraTml7bnlKjmiLfmsqHmnInmjojmnYPliJnov5vlhaXmjojmnYPnlYzpnaJcbiAqL1xuY2MuQ2xhc3Moe1xuICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBkaXNwbGF5OiBjYy5TcHJpdGUsXG4gICAgZ3JvdXBEaXNwbGF5OiBjYy5TcHJpdGUsXG4gICAgX2lzU2hvdzogZmFsc2UsXG4gICAgLy8gc2NvcmU6IDBcbiAgfSxcbiAgaW5pdChjKSB7XG5cbiAgICB0aGlzLl9jb250cm9sbGVyID0gY1xuICAgIHd4LnNob3dTaGFyZU1lbnUoe1xuICAgICAgd2l0aFNoYXJlVGlja2V0OiB0cnVlXG4gICAgfSlcbiAgICB3eC5vblNoYXJlQXBwTWVzc2FnZShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aXRsZTogXCLlvIDlsYDlj6rmmK/kuKrlhpzmsJHvvIznjrDlnKjlt7Lnu4/lgZrliLDlrrDnm7hcIixcbiAgICAgICAgaW1hZ2VVcmw6ICdodHRwczovL21tb2NnYW1lLnFwaWMuY24vd2VjaGF0Z2FtZS9MdEpaT2pINlo5aWJpYU1scHF6bGRzT2Y0NlE3VFppYXlzSTFmd2M0T2oxTDNDa2JDYUpNQU1vaWNpYmJIdTJIVVFrT2liLzAnXG4gICAgICB9XG4gICAgfSlcbiAgICAvLyDnm5HlkKxcbiAgICB3eC5vbkF1ZGlvSW50ZXJydXB0aW9uRW5kKCgpID0+IHtcbiAgICAgIGMubXVzaWNNYW5hZ2VyLnBhdXNlQmcoKVxuICAgICAgYy5tdXNpY01hbmFnZXIucmVzdW1lQmcoKVxuICAgIH0pXG4gICAgd3gub25TaG93KChvcHRpb25zKSA9PiB7XG4gICAgICBpZiAob3B0aW9ucy5zY2VuZSA9PSAxMDQ0KSB7XG4gICAgICAgIHd4LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICBtZXNzYWdlOiAnZ3JvdXAnLFxuICAgICAgICAgIHNoYXJlVGlja2V0OiBvcHRpb25zLnNoYXJlVGlja2V0XG4gICAgICAgIH0pXG4gICAgICAgIGMub3Blbkdyb3VwUmFuaygpXG4gICAgICAgIHRoaXMuZGlzcGxheS5ub2RlLmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgIGMudG90YWxSYW5rLmFjdGl2ZSA9IGZhbHNlXG4gICAgICB9XG4gICAgICBjYy5kaXJlY3Rvci5yZXN1bWUoKVxuICAgIH0pXG4gICAgd3gub25IaWRlKCgpID0+IHtcbiAgICAgIGNjLmRpcmVjdG9yLnBhdXNlKClcbiAgICB9KVxuICAgIC8vIOiOt+WPluacgOmrmOWumOmYtlxuICAgIHRoaXMuZ2V0SGlnaGVzdExldmVsKClcbiAgfSxcbiAgZ2V0SGlnaGVzdExldmVsKCkge1xuICAgIGxldCBoaWdoTGV2ZWwgPSB3eC5nZXRTdG9yYWdlU3luYygnaGlnaExldmVsJylcbiAgICByZXR1cm4gaGlnaExldmVsXG4gIH0sXG4gIGdldEhpZ2hlc3RTY29yZSgpIHtcbiAgICBsZXQgc2NvcmUgPSB3eC5nZXRTdG9yYWdlU3luYygnaGlnaFNjb3JlJylcbiAgICByZXR1cm4gc2NvcmVcbiAgfSxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tIHNoYXJlIC0tLS0tLS0tLS0tLS0tLS1cbiAgb25TaGFyZUJ1dHRvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgd3guc2hhcmVBcHBNZXNzYWdlKHtcbiAgICAgIHRpdGxlOiBcIuaIkee7iOS6juaIkOS4uuS6hlwiICsgdGhpcy5fY29udHJvbGxlci5zY29yZU1nci5sZXZlbERhdGFbdGhpcy5fY29udHJvbGxlci5zY29yZU1nci5sZXZlbCAtIDFdLm5hbWUgKyBcIiznnJ/mmK/lvIDlv4NcIixcbiAgICAgIC8vIGltYWdlVXJsSWQ6ICdveEV3R3ZDbFQwdWxkUTQ3MHBNODR3JyxcbiAgICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9tbW9jZ2FtZS5xcGljLmNuL3dlY2hhdGdhbWUvTHRKWk9qSDZaOWliaWFNbHBxemxkc09mNDZRN1RaaWF5c0kxZndjNE9qMUwzQ2tiQ2FKTUFNb2ljaWJiSHUySFVRa09pYi8wJ1xuICAgIH0pXG4gIH0sXG4gIG9uVXN1YWxTaGFyZUJ1dHRvbigpIHtcbiAgICB3eC5zaGFyZUFwcE1lc3NhZ2Uoe1xuICAgICAgdGl0bGU6IFwi5Y+q5piv5Liq5Yac5rCR77yM546w5Zyo5bey57uP5YGa5Yiw5a6w55u4XCIsXG4gICAgICAvLyBpbWFnZVVybElkOiAnb3hFd0d2Q2xUMHVsZFE0NzBwTTg0dycsXG4gICAgICBpbWFnZVVybDogJ2h0dHBzOi8vbW1vY2dhbWUucXBpYy5jbi93ZWNoYXRnYW1lL0x0SlpPakg2WjlpYmlhTWxwcXpsZHNPZjQ2UTdUWmlheXNJMWZ3YzRPajFMM0NrYkNhSk1BTW9pY2liYkh1MkhVUWtPaWIvMCdcbiAgICB9KVxuICB9LFxuICBvblNoYWtlUGhvbmUoKSB7XG4gICAgd3gudmlicmF0ZVNob3J0KClcbiAgfSxcbiAgLy8gLS0tLS0tLS0tLS0tLS0t5YiG5pWw5LiK5LygLS0tLS0tLS0tLS0tLS0tXG4gIG9uR2FtZU92ZXIobGV2ZWwsIHNjb3JlKSB7XG4gICAgLy/kuIrkvKDliIbmlbBcbiAgICAvL+aJk+W8gOW8gOaUvuWfn1xuICAgIHRoaXMuc2NvcmUgPSBzY29yZVxuICAgIGxldCBoaWdoTGV2ZWwgPSBsZXZlbFxuICAgIGxldCBoaWdoU2NvcmUgPSBzY29yZVxuICAgIGxldCBzZWxmID0gdGhpc1xuXG4gICAgd3gucG9zdE1lc3NhZ2Uoe1xuICAgICAgZXZlbnQ6ICdzZXRTY29yZScsXG4gICAgICBzY29yZTogc2NvcmUsXG4gICAgICBsZXZlbDogbGV2ZWwsXG4gICAgfSlcbiAgICBcbiAgICBoaWdoTGV2ZWwgPSB3eC5nZXRTdG9yYWdlU3luYygnaGlnaExldmVsJylcbiAgICBoaWdoTGV2ZWwgPSBwYXJzZUludChoaWdoTGV2ZWwpXG4gICAgaWYgKGhpZ2hMZXZlbCkge1xuICAgICAgaGlnaExldmVsID0gaGlnaExldmVsIDwgbGV2ZWwgPyBsZXZlbCA6IGhpZ2hMZXZlbFxuICAgIH0gZWxzZSB7XG4gICAgICBoaWdoTGV2ZWwgPSBsZXZlbFxuICAgIH1cbiAgICBoaWdoU2NvcmUgPSB3eC5nZXRTdG9yYWdlU3luYygnaGlnaFNjb3JlJylcbiAgICBpZiAoaGlnaFNjb3JlKSB7XG4gICAgICBoaWdoU2NvcmUgPSBwYXJzZUludChoaWdoU2NvcmUpXG4gICAgICBoaWdoU2NvcmUgPSBoaWdoU2NvcmUgPCBzY29yZSA/IHNjb3JlIDogaGlnaFNjb3JlXG4gICAgfSBlbHNlIHtcbiAgICAgIGhpZ2hTY29yZSA9IHNjb3JlXG4gICAgfVxuICAgIHZhciBoaWdoTGV2ZWxOYW1lID0gdGhpcy5fY29udHJvbGxlci5nYW1lRGF0YS5qc29uLmxldmVsRGF0YVtoaWdoTGV2ZWwgLSAxXS5uYW1lXG4gICAgd3guc2V0U3RvcmFnZVN5bmMoJ2hpZ2hMZXZlbCcsIGhpZ2hMZXZlbCArICcnKVxuICAgIHd4LnNldFN0b3JhZ2VTeW5jKCdoaWdoU2NvcmUnLCBoaWdoU2NvcmUgKyAnJylcbiAgICBzZWxmLl9jb250cm9sbGVyLnNjb3JlTWdyLmZhaWxIaWdoU2NvcmUuc3RyaW5nID0gXCLmgqjnmoTmnIDpq5jliIY6XCIgKyAoaGlnaFNjb3JlICsgJycpXG4gICAgdmFyIGt2RGF0YUxpc3QgPSBuZXcgQXJyYXkoKVxuICAgIGt2RGF0YUxpc3QucHVzaCh7XG4gICAgICBrZXk6IFwiaGlnaExldmVsXCIsXG4gICAgICB2YWx1ZTogaGlnaExldmVsTmFtZSxcbiAgICB9LCB7XG4gICAgICBrZXk6IFwiaGlnaFNjb3JlXCIsXG4gICAgICB2YWx1ZTogaGlnaFNjb3JlICsgJycsXG4gICAgfSlcbiAgfSxcbiAgc2hvd1JhbmsoKSB7XG4gICAgd3gucG9zdE1lc3NhZ2Uoe1xuICAgICAgbWVzc2FnZTogJ1Nob3cnLFxuICAgICAgZXZlbnQ6ICdnZXRSYW5rJyxcbiAgICB9KVxuICAgIHRoaXMuZGlzcGxheS5ub2RlLmFjdGl2ZSA9IHRydWVcbiAgICB0aGlzLl9pc1Nob3cgPSB0cnVlXG4gIH0sXG5cbiAgY2xvc2VSYW5rKCkge1xuICAgIHRoaXMuZGlzcGxheS5ub2RlLmFjdGl2ZSA9IGZhbHNlXG4gICAgd3gucG9zdE1lc3NhZ2Uoe1xuICAgICAgbWVzc2FnZTogJ0hpZGUnXG4gICAgfSlcbiAgICB0aGlzLl9pc1Nob3cgPSBmYWxzZVxuICB9LFxuICBzaG93R3JvdXBSYW5rKCkge1xuICAgIHd4LnBvc3RNZXNzYWdlKHtcbiAgICAgIG1lc3NhZ2U6ICdTaG93J1xuICAgIH0pXG4gICAgdGhpcy5ncm91cERpc3BsYXkubm9kZS5hY3RpdmUgPSB0cnVlXG4gICAgdGhpcy5faXNTaG93ID0gdHJ1ZVxuICB9LFxuICAvLyBzd2l0Y2hSYW5rVHlwZSgpIHtcbiAgLy8gICB3eC5wb3N0TWVzc2FnZSh7XG4gIC8vICAgICBtZXNzYWdlOiAnc3dpdGNoUmFuaydcbiAgLy8gICB9KVxuICAvLyAgIHRoaXMuX2lzU2hvdyA9IHRydWVcbiAgLy8gfSxcbiAgY2xvc2VHcm91cFJhbmsoKSB7XG4gICAgdGhpcy5ncm91cERpc3BsYXkubm9kZS5hY3RpdmUgPSBmYWxzZVxuICAgIHd4LnBvc3RNZXNzYWdlKHtcbiAgICAgIG1lc3NhZ2U6ICdIaWRlJ1xuICAgIH0pXG4gICAgdGhpcy5faXNTaG93ID0gZmFsc2VcbiAgfSxcbiAgY3JlYXRlSW1hZ2Uoc3ByaXRlLCB1cmwpIHtcbiAgICBsZXQgaW1hZ2UgPSB3eC5jcmVhdGVJbWFnZSgpO1xuICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCB0ZXh0dXJlID0gbmV3IGNjLlRleHR1cmUyRCgpO1xuICAgICAgdGV4dHVyZS5pbml0V2l0aEVsZW1lbnQoaW1hZ2UpO1xuICAgICAgdGV4dHVyZS5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XG4gICAgICBzcHJpdGUuc3ByaXRlRnJhbWUgPSBuZXcgY2MuU3ByaXRlRnJhbWUodGV4dHVyZSk7XG4gICAgfTtcbiAgICBpbWFnZS5zcmMgPSB1cmw7XG4gIH0sXG4gIHVwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5faXNTaG93KSB7XG4gICAgICBpZiAodGhpcy5kaXNwbGF5Lm5vZGUuYWN0aXZlKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5ub2RlLmdldENvbXBvbmVudChjYy5XWFN1YkNvbnRleHRWaWV3KS51cGRhdGUoKVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZ3JvdXBEaXNwbGF5Lm5vZGUuYWN0aXZlKSB7XG4gICAgICAgIHRoaXMuZ3JvdXBEaXNwbGF5Lm5vZGUuZ2V0Q29tcG9uZW50KGNjLldYU3ViQ29udGV4dFZpZXcpLnVwZGF0ZSgpXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAvLyDmjqfliLbmiZPlvIDlub/lkYpcbiAgb25SZXZpdmVCdXR0b24odHlwZSkge1xuICAgIC8vIOW5v+WRiuS9jVxuICAgIGxldCBzZWxmID0gdGhpc1xuICAgIHRoaXMuYWRUeXBlID0gdHlwZSAvLzDooajnpLrliqDlgI0gMeihqOekuuWkjea0u1xuICAgIGlmICh0aGlzLmF1ZGlvQWQpIHtcbiAgICAgIHRoaXMuYXVkaW9BZC5zaG93KCkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAvLyDlpLHotKXph43or5VcbiAgICAgICAgdGhpcy5hdWRpb0FkLmxvYWQoKVxuICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuYXVkaW9BZC5zaG93KCkpXG4gICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn5r+A5Yqx6KeG6aKRIOW5v+WRiuaYvuekuuWksei0pScsIGVyci5lcnJNc2cpXG4gICAgICAgICAgICBpZiAoc2VsZi5hZFR5cGUpIHtcbiAgICAgICAgICAgICAgc2VsZi5fY29udHJvbGxlci5nYW1lLm9uU2tpcFJldml2ZSgpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWxmLl9jb250cm9sbGVyLnNjb3JlTWdyLm9uTGV2ZWxVcEJ1dHRvbigpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5hdWRpb0FkID0gd3guY3JlYXRlUmV3YXJkZWRWaWRlb0FkKHtcbiAgICAgIGFkVW5pdElkOiAnYWR1bml0LTQ4MjE0OGNmZWIyNDMzNzgnXG4gICAgfSlcbiAgICB0aGlzLmF1ZGlvQWQuc2hvdygpLmNhdGNoKCgpID0+IHtcbiAgICAgIC8vIOWksei0pemHjeivlVxuICAgICAgdGhpcy5hdWRpb0FkLmxvYWQoKVxuICAgICAgICAudGhlbigoKSA9PiB0aGlzLmF1ZGlvQWQuc2hvdygpKVxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICBzZWxmLmZha2VTaGFyZSgpXG4gICAgICAgIH0pXG4gICAgfSlcbiAgICB0aGlzLmF1ZGlvQWQub25FcnJvcihlcnIgPT4ge1xuICAgICAgc2VsZi5mYWtlU2hhcmUoKVxuICAgIH0pXG4gICAgdGhpcy5hdWRpb0FkLm9uQ2xvc2UoKHJlcykgPT4ge1xuICAgICAgaWYgKHNlbGYuYWRUeXBlKSB7XG4gICAgICAgIGlmIChyZXMgJiYgcmVzLmlzRW5kZWQgfHwgcmVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzZWxmLl9jb250cm9sbGVyLmdhbWUuc2hvd1Jldml2ZVN1Y2Nlc3MoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYuX2NvbnRyb2xsZXIuZ2FtZS5hc2tSZXZpdmUoKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocmVzICYmIHJlcy5pc0VuZGVkIHx8IHJlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc2VsZi5fY29udHJvbGxlci5zY29yZU1nci5vbkxldmVsVXBCdXR0b24oMilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIGZha2VTaGFyZSgpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICB3eC5zaGFyZUFwcE1lc3NhZ2Uoe1xuICAgICAgdGl0bGU6IFwi5oiR5bey57uP546p5YiwXCIgKyB0aGlzLl9jb250cm9sbGVyLnNjb3JlTWdyLnNjb3JlICsgXCLliIbkuobvvIzpgoDor7fkvaDmnaXmjJHmiJhcIixcbiAgICAgIC8vIGltYWdlVXJsSWQ6ICdveEV3R3ZDbFQwdWxkUTQ3MHBNODR3JyxcbiAgICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9tbW9jZ2FtZS5xcGljLmNuL3dlY2hhdGdhbWUvTHRKWk9qSDZaOWliaWFNbHBxemxkc09mNDZRN1RaaWF5c0kxZndjNE9qMUwzQ2tiQ2FKTUFNb2ljaWJiSHUySFVRa09pYi8wJ1xuICAgIH0pXG4gICAgaWYgKHRoaXMuYWRUeXBlKSB7XG4gICAgICBzZWxmLl9jb250cm9sbGVyLmdhbWUuc2hvd1Jldml2ZVN1Y2Nlc3MoKVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLl9jb250cm9sbGVyLnNjb3JlTWdyLm9uTGV2ZWxVcEJ1dHRvbigyKVxuICAgIH1cbiAgfSxcbiAgb3BlbkJhbm5lckFkdigpIHtcbiAgICAvLyDliJvlu7ogQmFubmVyIOW5v+WRiuWunuS+i++8jOaPkOWJjeWIneWni+WMllxuICAgIC8vIGxldCBzY3JlZW5XaWR0aCA9IHd4LmdldFN5c3RlbUluZm9TeW5jKCkuc2NyZWVuV2lkdGhcbiAgICAvLyBsZXQgYmFubmVySGVpZ2h0ID0gc2NyZWVuV2lkdGggLyAzNTAgKiAxMjBcbiAgICAvLyBsZXQgc2NyZWVuSGVpZ2h0ID0gd3guZ2V0U3lzdGVtSW5mb1N5bmMoKS5zY3JlZW5IZWlnaHQgLSAxMDhcbiAgICAvLyBsZXQgYWRVbml0SWRzID0gW1xuICAgIC8vICAgJ2FkdW5pdC01MTBhNGVjMzkwNjVlZjk2JyxcbiAgICAvLyAgICdhZHVuaXQtMjliMGZhN2EyZGI4ZThjYicsXG4gICAgLy8gICAnYWR1bml0LTQwMjBiYjllYTQzOWU2YTUnXG4gICAgLy8gXVxuICAgIC8vIGlmICh0aGlzLmJhbm5lckFkKSB7XG4gICAgLy8gICB0aGlzLmJhbm5lckFkLmRlc3Ryb3koKVxuICAgIC8vIH1cbiAgICAvLyB0aGlzLmJhbm5lckFkID0gd3guY3JlYXRlQmFubmVyQWQoe1xuICAgIC8vICAgYWRVbml0SWQ6IGFkVW5pdElkc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAzKV0sXG4gICAgLy8gICBzdHlsZToge1xuICAgIC8vICAgICBsZWZ0OiAwLFxuICAgIC8vICAgICB0b3A6IHNjcmVlbkhlaWdodCxcbiAgICAvLyAgICAgd2lkdGg6IDYyMCxcbiAgICAvLyAgIH1cbiAgICAvLyB9KVxuICAgIC8vIC8vIOWcqOmAguWQiOeahOWcuuaZr+aYvuekuiBCYW5uZXIg5bm/5ZGKXG4gICAgLy8gdGhpcy5iYW5uZXJBZC5vbkxvYWQoKCkgPT4ge1xuICAgIC8vICAgLy8gY29uc29sZS5sb2coJ2Jhbm5lciDlub/lkYrliqDovb3miJDlip8nKVxuICAgIC8vIH0pXG4gICAgLy8gdGhpcy5iYW5uZXJBZC5vbkVycm9yKChlKSA9PiB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnYmFubmVyIOW5v+WRiuWKoOi9veWksei0pScsIGUpXG4gICAgLy8gfSlcbiAgICAvLyB0aGlzLmJhbm5lckFkLnNob3coKVxuICAgIC8vICAgLnRoZW4oKVxuICB9LFxuICBuYXZUb01pbmlwcm9ncmFtKGV2ZW50LGN1c3RvbSkge1xuICAgIGNvbnNvbGUubG9nKGN1c3RvbSlcbiAgICB3eC5uYXZpZ2F0ZVRvTWluaVByb2dyYW0oe1xuICAgICAgYXBwSWQ6IGN1c3RvbVxuICAgIH0pXG4gIH0sXG4gIGNsb3NlQmFubmVyQWR2KCkge1xuICAgIGlmICh0aGlzLmJhbm5lckFkKSB7XG4gICAgICB0aGlzLmJhbm5lckFkLmhpZGUoKVxuICAgIH1cbiAgfVxufSk7Il19