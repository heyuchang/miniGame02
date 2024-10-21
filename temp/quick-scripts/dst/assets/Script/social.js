
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

    this._gameController = c;
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
      title: "我终于成为了" + this._gameController.scoreMgr.levelData[this._gameController.scoreMgr.level - 1].name + ",真是开心",
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

    var highLevelName = this._gameController.gameData.json.levelData[highLevel - 1].name;
    wx.setStorageSync('highLevel', highLevel + '');
    wx.setStorageSync('highScore', highScore + '');
    self._gameController.scoreMgr.failHighScore.string = "您的最高分:" + (highScore + '');
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
            self._gameController.game.onSkipRevive();
          } else {
            self._gameController.scoreMgr.onLevelUpButton();
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
          self._gameController.game.showReviveSuccess();
        } else {
          self._gameController.game.askRevive();
        }
      } else {
        if (res && res.isEnded || res === undefined) {
          self._gameController.scoreMgr.onLevelUpButton(2);
        }
      }
    });
  },
  fakeShare: function fakeShare() {
    var self = this;
    wx.shareAppMessage({
      title: "我已经玩到" + this._gameController.scoreMgr.score + "分了，邀请你来挑战",
      // imageUrlId: 'oxEwGvClT0uldQ470pM84w',
      imageUrl: 'https://mmocgame.qpic.cn/wechatgame/LtJZOjH6Z9ibiaMlpqzldsOf46Q7TZiaysI1fwc4Oj1L3CkbCaJMAMoicibbHu2HUQkOib/0'
    });

    if (this.adType) {
      self._gameController.game.showReviveSuccess();
    } else {
      self._gameController.scoreMgr.onLevelUpButton(2);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzb2NpYWwuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJkaXNwbGF5IiwiU3ByaXRlIiwiZ3JvdXBEaXNwbGF5IiwiX2lzU2hvdyIsImluaXQiLCJjIiwiX2dhbWVDb250cm9sbGVyIiwid3giLCJzaG93U2hhcmVNZW51Iiwid2l0aFNoYXJlVGlja2V0Iiwib25TaGFyZUFwcE1lc3NhZ2UiLCJ0aXRsZSIsImltYWdlVXJsIiwib25BdWRpb0ludGVycnVwdGlvbkVuZCIsIm11c2ljTWFuYWdlciIsInBhdXNlQmciLCJyZXN1bWVCZyIsIm9uU2hvdyIsIm9wdGlvbnMiLCJzY2VuZSIsInBvc3RNZXNzYWdlIiwibWVzc2FnZSIsInNoYXJlVGlja2V0Iiwib3Blbkdyb3VwUmFuayIsIm5vZGUiLCJhY3RpdmUiLCJ0b3RhbFJhbmsiLCJkaXJlY3RvciIsInJlc3VtZSIsIm9uSGlkZSIsInBhdXNlIiwiZ2V0SGlnaGVzdExldmVsIiwiaGlnaExldmVsIiwiZ2V0U3RvcmFnZVN5bmMiLCJnZXRIaWdoZXN0U2NvcmUiLCJzY29yZSIsIm9uU2hhcmVCdXR0b24iLCJzZWxmIiwic2hhcmVBcHBNZXNzYWdlIiwic2NvcmVNZ3IiLCJsZXZlbERhdGEiLCJsZXZlbCIsIm5hbWUiLCJvblVzdWFsU2hhcmVCdXR0b24iLCJvblNoYWtlUGhvbmUiLCJ2aWJyYXRlU2hvcnQiLCJvbkdhbWVPdmVyIiwiaGlnaFNjb3JlIiwiZXZlbnQiLCJwYXJzZUludCIsImhpZ2hMZXZlbE5hbWUiLCJnYW1lRGF0YSIsImpzb24iLCJzZXRTdG9yYWdlU3luYyIsImZhaWxIaWdoU2NvcmUiLCJzdHJpbmciLCJrdkRhdGFMaXN0IiwiQXJyYXkiLCJwdXNoIiwia2V5IiwidmFsdWUiLCJzaG93UmFuayIsImNsb3NlUmFuayIsInNob3dHcm91cFJhbmsiLCJjbG9zZUdyb3VwUmFuayIsImNyZWF0ZUltYWdlIiwic3ByaXRlIiwidXJsIiwiaW1hZ2UiLCJvbmxvYWQiLCJ0ZXh0dXJlIiwiVGV4dHVyZTJEIiwiaW5pdFdpdGhFbGVtZW50IiwiaGFuZGxlTG9hZGVkVGV4dHVyZSIsInNwcml0ZUZyYW1lIiwiU3ByaXRlRnJhbWUiLCJzcmMiLCJ1cGRhdGUiLCJnZXRDb21wb25lbnQiLCJXWFN1YkNvbnRleHRWaWV3Iiwib25SZXZpdmVCdXR0b24iLCJ0eXBlIiwiYWRUeXBlIiwiYXVkaW9BZCIsInNob3ciLCJsb2FkIiwidGhlbiIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJlcnJNc2ciLCJnYW1lIiwib25Ta2lwUmV2aXZlIiwib25MZXZlbFVwQnV0dG9uIiwiY3JlYXRlUmV3YXJkZWRWaWRlb0FkIiwiYWRVbml0SWQiLCJmYWtlU2hhcmUiLCJvbkVycm9yIiwib25DbG9zZSIsInJlcyIsImlzRW5kZWQiLCJ1bmRlZmluZWQiLCJzaG93UmV2aXZlU3VjY2VzcyIsImFza1Jldml2ZSIsIm9wZW5CYW5uZXJBZHYiLCJuYXZUb01pbmlwcm9ncmFtIiwiY3VzdG9tIiwibmF2aWdhdGVUb01pbmlQcm9ncmFtIiwiYXBwSWQiLCJjbG9zZUJhbm5lckFkdiIsImJhbm5lckFkIiwiaGlkZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7QUFLQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFFUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLE9BQU8sRUFBRUosRUFBRSxDQUFDSyxNQURGO0FBRVZDLElBQUFBLFlBQVksRUFBRU4sRUFBRSxDQUFDSyxNQUZQO0FBR1ZFLElBQUFBLE9BQU8sRUFBRSxLQUhDLENBSVY7O0FBSlUsR0FGTDtBQVFQQyxFQUFBQSxJQVJPLGdCQVFGQyxDQVJFLEVBUUM7QUFBQTs7QUFFTixTQUFLQyxlQUFMLEdBQXVCRCxDQUF2QjtBQUNBRSxJQUFBQSxFQUFFLENBQUNDLGFBQUgsQ0FBaUI7QUFDZkMsTUFBQUEsZUFBZSxFQUFFO0FBREYsS0FBakI7QUFHQUYsSUFBQUEsRUFBRSxDQUFDRyxpQkFBSCxDQUFxQixZQUFZO0FBQy9CLGFBQU87QUFDTEMsUUFBQUEsS0FBSyxFQUFFLGtCQURGO0FBRUxDLFFBQUFBLFFBQVEsRUFBRTtBQUZMLE9BQVA7QUFJRCxLQUxELEVBTk0sQ0FZTjs7QUFDQUwsSUFBQUEsRUFBRSxDQUFDTSxzQkFBSCxDQUEwQixZQUFNO0FBQzlCUixNQUFBQSxDQUFDLENBQUNTLFlBQUYsQ0FBZUMsT0FBZjtBQUNBVixNQUFBQSxDQUFDLENBQUNTLFlBQUYsQ0FBZUUsUUFBZjtBQUNELEtBSEQ7QUFJQVQsSUFBQUEsRUFBRSxDQUFDVSxNQUFILENBQVUsVUFBQ0MsT0FBRCxFQUFhO0FBQ3JCLFVBQUlBLE9BQU8sQ0FBQ0MsS0FBUixJQUFpQixJQUFyQixFQUEyQjtBQUN6QlosUUFBQUEsRUFBRSxDQUFDYSxXQUFILENBQWU7QUFDYkMsVUFBQUEsT0FBTyxFQUFFLE9BREk7QUFFYkMsVUFBQUEsV0FBVyxFQUFFSixPQUFPLENBQUNJO0FBRlIsU0FBZjtBQUlBakIsUUFBQUEsQ0FBQyxDQUFDa0IsYUFBRjtBQUNBLFFBQUEsS0FBSSxDQUFDdkIsT0FBTCxDQUFhd0IsSUFBYixDQUFrQkMsTUFBbEIsR0FBMkIsS0FBM0I7QUFDQXBCLFFBQUFBLENBQUMsQ0FBQ3FCLFNBQUYsQ0FBWUQsTUFBWixHQUFxQixLQUFyQjtBQUNEOztBQUNEN0IsTUFBQUEsRUFBRSxDQUFDK0IsUUFBSCxDQUFZQyxNQUFaO0FBQ0QsS0FYRDtBQVlBckIsSUFBQUEsRUFBRSxDQUFDc0IsTUFBSCxDQUFVLFlBQU07QUFDZGpDLE1BQUFBLEVBQUUsQ0FBQytCLFFBQUgsQ0FBWUcsS0FBWjtBQUNELEtBRkQsRUE3Qk0sQ0FnQ047O0FBQ0EsU0FBS0MsZUFBTDtBQUNELEdBMUNNO0FBMkNQQSxFQUFBQSxlQTNDTyw2QkEyQ1c7QUFDaEIsUUFBSUMsU0FBUyxHQUFHekIsRUFBRSxDQUFDMEIsY0FBSCxDQUFrQixXQUFsQixDQUFoQjtBQUNBLFdBQU9ELFNBQVA7QUFDRCxHQTlDTTtBQStDUEUsRUFBQUEsZUEvQ08sNkJBK0NXO0FBQ2hCLFFBQUlDLEtBQUssR0FBRzVCLEVBQUUsQ0FBQzBCLGNBQUgsQ0FBa0IsV0FBbEIsQ0FBWjtBQUNBLFdBQU9FLEtBQVA7QUFDRCxHQWxETTtBQW1EUDtBQUNBQyxFQUFBQSxhQXBETywyQkFvRFM7QUFDZCxRQUFJQyxJQUFJLEdBQUcsSUFBWDtBQUNBOUIsSUFBQUEsRUFBRSxDQUFDK0IsZUFBSCxDQUFtQjtBQUNqQjNCLE1BQUFBLEtBQUssRUFBRSxXQUFXLEtBQUtMLGVBQUwsQ0FBcUJpQyxRQUFyQixDQUE4QkMsU0FBOUIsQ0FBd0MsS0FBS2xDLGVBQUwsQ0FBcUJpQyxRQUFyQixDQUE4QkUsS0FBOUIsR0FBc0MsQ0FBOUUsRUFBaUZDLElBQTVGLEdBQW1HLE9BRHpGO0FBRWpCO0FBQ0E5QixNQUFBQSxRQUFRLEVBQUU7QUFITyxLQUFuQjtBQUtELEdBM0RNO0FBNERQK0IsRUFBQUEsa0JBNURPLGdDQTREYztBQUNuQnBDLElBQUFBLEVBQUUsQ0FBQytCLGVBQUgsQ0FBbUI7QUFDakIzQixNQUFBQSxLQUFLLEVBQUUsZ0JBRFU7QUFFakI7QUFDQUMsTUFBQUEsUUFBUSxFQUFFO0FBSE8sS0FBbkI7QUFLRCxHQWxFTTtBQW1FUGdDLEVBQUFBLFlBbkVPLDBCQW1FUTtBQUNickMsSUFBQUEsRUFBRSxDQUFDc0MsWUFBSDtBQUNELEdBckVNO0FBc0VQO0FBQ0FDLEVBQUFBLFVBdkVPLHNCQXVFSUwsS0F2RUosRUF1RVdOLEtBdkVYLEVBdUVrQjtBQUN2QjtBQUNBO0FBQ0EsU0FBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsUUFBSUgsU0FBUyxHQUFHUyxLQUFoQjtBQUNBLFFBQUlNLFNBQVMsR0FBR1osS0FBaEI7QUFDQSxRQUFJRSxJQUFJLEdBQUcsSUFBWDtBQUVBOUIsSUFBQUEsRUFBRSxDQUFDYSxXQUFILENBQWU7QUFDYjRCLE1BQUFBLEtBQUssRUFBRSxVQURNO0FBRWJiLE1BQUFBLEtBQUssRUFBRUEsS0FGTTtBQUdiTSxNQUFBQSxLQUFLLEVBQUVBO0FBSE0sS0FBZjtBQU1BVCxJQUFBQSxTQUFTLEdBQUd6QixFQUFFLENBQUMwQixjQUFILENBQWtCLFdBQWxCLENBQVo7QUFDQUQsSUFBQUEsU0FBUyxHQUFHaUIsUUFBUSxDQUFDakIsU0FBRCxDQUFwQjs7QUFDQSxRQUFJQSxTQUFKLEVBQWU7QUFDYkEsTUFBQUEsU0FBUyxHQUFHQSxTQUFTLEdBQUdTLEtBQVosR0FBb0JBLEtBQXBCLEdBQTRCVCxTQUF4QztBQUNELEtBRkQsTUFFTztBQUNMQSxNQUFBQSxTQUFTLEdBQUdTLEtBQVo7QUFDRDs7QUFDRE0sSUFBQUEsU0FBUyxHQUFHeEMsRUFBRSxDQUFDMEIsY0FBSCxDQUFrQixXQUFsQixDQUFaOztBQUNBLFFBQUljLFNBQUosRUFBZTtBQUNiQSxNQUFBQSxTQUFTLEdBQUdFLFFBQVEsQ0FBQ0YsU0FBRCxDQUFwQjtBQUNBQSxNQUFBQSxTQUFTLEdBQUdBLFNBQVMsR0FBR1osS0FBWixHQUFvQkEsS0FBcEIsR0FBNEJZLFNBQXhDO0FBQ0QsS0FIRCxNQUdPO0FBQ0xBLE1BQUFBLFNBQVMsR0FBR1osS0FBWjtBQUNEOztBQUNELFFBQUllLGFBQWEsR0FBRyxLQUFLNUMsZUFBTCxDQUFxQjZDLFFBQXJCLENBQThCQyxJQUE5QixDQUFtQ1osU0FBbkMsQ0FBNkNSLFNBQVMsR0FBRyxDQUF6RCxFQUE0RFUsSUFBaEY7QUFDQW5DLElBQUFBLEVBQUUsQ0FBQzhDLGNBQUgsQ0FBa0IsV0FBbEIsRUFBK0JyQixTQUFTLEdBQUcsRUFBM0M7QUFDQXpCLElBQUFBLEVBQUUsQ0FBQzhDLGNBQUgsQ0FBa0IsV0FBbEIsRUFBK0JOLFNBQVMsR0FBRyxFQUEzQztBQUNBVixJQUFBQSxJQUFJLENBQUMvQixlQUFMLENBQXFCaUMsUUFBckIsQ0FBOEJlLGFBQTlCLENBQTRDQyxNQUE1QyxHQUFxRCxZQUFZUixTQUFTLEdBQUcsRUFBeEIsQ0FBckQ7QUFDQSxRQUFJUyxVQUFVLEdBQUcsSUFBSUMsS0FBSixFQUFqQjtBQUNBRCxJQUFBQSxVQUFVLENBQUNFLElBQVgsQ0FBZ0I7QUFDZEMsTUFBQUEsR0FBRyxFQUFFLFdBRFM7QUFFZEMsTUFBQUEsS0FBSyxFQUFFVjtBQUZPLEtBQWhCLEVBR0c7QUFDRFMsTUFBQUEsR0FBRyxFQUFFLFdBREo7QUFFREMsTUFBQUEsS0FBSyxFQUFFYixTQUFTLEdBQUc7QUFGbEIsS0FISDtBQU9ELEdBL0dNO0FBZ0hQYyxFQUFBQSxRQWhITyxzQkFnSEk7QUFDVHRELElBQUFBLEVBQUUsQ0FBQ2EsV0FBSCxDQUFlO0FBQ2JDLE1BQUFBLE9BQU8sRUFBRSxNQURJO0FBRWIyQixNQUFBQSxLQUFLLEVBQUU7QUFGTSxLQUFmO0FBSUEsU0FBS2hELE9BQUwsQ0FBYXdCLElBQWIsQ0FBa0JDLE1BQWxCLEdBQTJCLElBQTNCO0FBQ0EsU0FBS3RCLE9BQUwsR0FBZSxJQUFmO0FBQ0QsR0F2SE07QUF5SFAyRCxFQUFBQSxTQXpITyx1QkF5SEs7QUFDVixTQUFLOUQsT0FBTCxDQUFhd0IsSUFBYixDQUFrQkMsTUFBbEIsR0FBMkIsS0FBM0I7QUFDQWxCLElBQUFBLEVBQUUsQ0FBQ2EsV0FBSCxDQUFlO0FBQ2JDLE1BQUFBLE9BQU8sRUFBRTtBQURJLEtBQWY7QUFHQSxTQUFLbEIsT0FBTCxHQUFlLEtBQWY7QUFDRCxHQS9ITTtBQWdJUDRELEVBQUFBLGFBaElPLDJCQWdJUztBQUNkeEQsSUFBQUEsRUFBRSxDQUFDYSxXQUFILENBQWU7QUFDYkMsTUFBQUEsT0FBTyxFQUFFO0FBREksS0FBZjtBQUdBLFNBQUtuQixZQUFMLENBQWtCc0IsSUFBbEIsQ0FBdUJDLE1BQXZCLEdBQWdDLElBQWhDO0FBQ0EsU0FBS3RCLE9BQUwsR0FBZSxJQUFmO0FBQ0QsR0F0SU07QUF1SVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E2RCxFQUFBQSxjQTdJTyw0QkE2SVU7QUFDZixTQUFLOUQsWUFBTCxDQUFrQnNCLElBQWxCLENBQXVCQyxNQUF2QixHQUFnQyxLQUFoQztBQUNBbEIsSUFBQUEsRUFBRSxDQUFDYSxXQUFILENBQWU7QUFDYkMsTUFBQUEsT0FBTyxFQUFFO0FBREksS0FBZjtBQUdBLFNBQUtsQixPQUFMLEdBQWUsS0FBZjtBQUNELEdBbkpNO0FBb0pQOEQsRUFBQUEsV0FwSk8sdUJBb0pLQyxNQXBKTCxFQW9KYUMsR0FwSmIsRUFvSmtCO0FBQ3ZCLFFBQUlDLEtBQUssR0FBRzdELEVBQUUsQ0FBQzBELFdBQUgsRUFBWjs7QUFDQUcsSUFBQUEsS0FBSyxDQUFDQyxNQUFOLEdBQWUsWUFBWTtBQUN6QixVQUFJQyxPQUFPLEdBQUcsSUFBSTFFLEVBQUUsQ0FBQzJFLFNBQVAsRUFBZDtBQUNBRCxNQUFBQSxPQUFPLENBQUNFLGVBQVIsQ0FBd0JKLEtBQXhCO0FBQ0FFLE1BQUFBLE9BQU8sQ0FBQ0csbUJBQVI7QUFDQVAsTUFBQUEsTUFBTSxDQUFDUSxXQUFQLEdBQXFCLElBQUk5RSxFQUFFLENBQUMrRSxXQUFQLENBQW1CTCxPQUFuQixDQUFyQjtBQUNELEtBTEQ7O0FBTUFGLElBQUFBLEtBQUssQ0FBQ1EsR0FBTixHQUFZVCxHQUFaO0FBQ0QsR0E3Sk07QUE4SlBVLEVBQUFBLE1BOUpPLG9CQThKRTtBQUNQLFFBQUksS0FBSzFFLE9BQVQsRUFBa0I7QUFDaEIsVUFBSSxLQUFLSCxPQUFMLENBQWF3QixJQUFiLENBQWtCQyxNQUF0QixFQUE4QjtBQUM1QixhQUFLekIsT0FBTCxDQUFhd0IsSUFBYixDQUFrQnNELFlBQWxCLENBQStCbEYsRUFBRSxDQUFDbUYsZ0JBQWxDLEVBQW9ERixNQUFwRDtBQUNEOztBQUNELFVBQUksS0FBSzNFLFlBQUwsQ0FBa0JzQixJQUFsQixDQUF1QkMsTUFBM0IsRUFBbUM7QUFDakMsYUFBS3ZCLFlBQUwsQ0FBa0JzQixJQUFsQixDQUF1QnNELFlBQXZCLENBQW9DbEYsRUFBRSxDQUFDbUYsZ0JBQXZDLEVBQXlERixNQUF6RDtBQUNEO0FBQ0Y7QUFDRixHQXZLTTtBQXdLUDtBQUNBRyxFQUFBQSxjQXpLTywwQkF5S1FDLElBektSLEVBeUtjO0FBQUE7O0FBQ25CO0FBQ0EsUUFBSTVDLElBQUksR0FBRyxJQUFYO0FBQ0EsU0FBSzZDLE1BQUwsR0FBY0QsSUFBZCxDQUhtQixDQUdBOztBQUNuQixRQUFJLEtBQUtFLE9BQVQsRUFBa0I7QUFDaEIsV0FBS0EsT0FBTCxDQUFhQyxJQUFiLFlBQTBCLFlBQU07QUFDOUI7QUFDQSxRQUFBLE1BQUksQ0FBQ0QsT0FBTCxDQUFhRSxJQUFiLEdBQ0dDLElBREgsQ0FDUTtBQUFBLGlCQUFNLE1BQUksQ0FBQ0gsT0FBTCxDQUFhQyxJQUFiLEVBQU47QUFBQSxTQURSLFdBRVMsVUFBQUcsR0FBRyxFQUFJO0FBQ1pDLFVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGFBQVosRUFBMkJGLEdBQUcsQ0FBQ0csTUFBL0I7O0FBQ0EsY0FBSXJELElBQUksQ0FBQzZDLE1BQVQsRUFBaUI7QUFDZjdDLFlBQUFBLElBQUksQ0FBQy9CLGVBQUwsQ0FBcUJxRixJQUFyQixDQUEwQkMsWUFBMUI7QUFDRCxXQUZELE1BRU87QUFDTHZELFlBQUFBLElBQUksQ0FBQy9CLGVBQUwsQ0FBcUJpQyxRQUFyQixDQUE4QnNELGVBQTlCO0FBQ0Q7QUFDRixTQVRIO0FBVUQsT0FaRDtBQWFBO0FBQ0Q7O0FBQ0QsU0FBS1YsT0FBTCxHQUFlNUUsRUFBRSxDQUFDdUYscUJBQUgsQ0FBeUI7QUFDdENDLE1BQUFBLFFBQVEsRUFBRTtBQUQ0QixLQUF6QixDQUFmO0FBR0EsU0FBS1osT0FBTCxDQUFhQyxJQUFiLFlBQTBCLFlBQU07QUFDOUI7QUFDQSxNQUFBLE1BQUksQ0FBQ0QsT0FBTCxDQUFhRSxJQUFiLEdBQ0dDLElBREgsQ0FDUTtBQUFBLGVBQU0sTUFBSSxDQUFDSCxPQUFMLENBQWFDLElBQWIsRUFBTjtBQUFBLE9BRFIsV0FFUyxVQUFBRyxHQUFHLEVBQUk7QUFDWmxELFFBQUFBLElBQUksQ0FBQzJELFNBQUw7QUFDRCxPQUpIO0FBS0QsS0FQRDtBQVFBLFNBQUtiLE9BQUwsQ0FBYWMsT0FBYixDQUFxQixVQUFBVixHQUFHLEVBQUk7QUFDMUJsRCxNQUFBQSxJQUFJLENBQUMyRCxTQUFMO0FBQ0QsS0FGRDtBQUdBLFNBQUtiLE9BQUwsQ0FBYWUsT0FBYixDQUFxQixVQUFDQyxHQUFELEVBQVM7QUFDNUIsVUFBSTlELElBQUksQ0FBQzZDLE1BQVQsRUFBaUI7QUFDZixZQUFJaUIsR0FBRyxJQUFJQSxHQUFHLENBQUNDLE9BQVgsSUFBc0JELEdBQUcsS0FBS0UsU0FBbEMsRUFBNkM7QUFDM0NoRSxVQUFBQSxJQUFJLENBQUMvQixlQUFMLENBQXFCcUYsSUFBckIsQ0FBMEJXLGlCQUExQjtBQUNELFNBRkQsTUFFTztBQUNMakUsVUFBQUEsSUFBSSxDQUFDL0IsZUFBTCxDQUFxQnFGLElBQXJCLENBQTBCWSxTQUExQjtBQUNEO0FBQ0YsT0FORCxNQU1PO0FBQ0wsWUFBSUosR0FBRyxJQUFJQSxHQUFHLENBQUNDLE9BQVgsSUFBc0JELEdBQUcsS0FBS0UsU0FBbEMsRUFBNkM7QUFDM0NoRSxVQUFBQSxJQUFJLENBQUMvQixlQUFMLENBQXFCaUMsUUFBckIsQ0FBOEJzRCxlQUE5QixDQUE4QyxDQUE5QztBQUNEO0FBQ0Y7QUFDRixLQVpEO0FBYUQsR0F4Tk07QUF5TlBHLEVBQUFBLFNBek5PLHVCQXlOSztBQUNWLFFBQUkzRCxJQUFJLEdBQUcsSUFBWDtBQUNBOUIsSUFBQUEsRUFBRSxDQUFDK0IsZUFBSCxDQUFtQjtBQUNqQjNCLE1BQUFBLEtBQUssRUFBRSxVQUFVLEtBQUtMLGVBQUwsQ0FBcUJpQyxRQUFyQixDQUE4QkosS0FBeEMsR0FBZ0QsV0FEdEM7QUFFakI7QUFDQXZCLE1BQUFBLFFBQVEsRUFBRTtBQUhPLEtBQW5COztBQUtBLFFBQUksS0FBS3NFLE1BQVQsRUFBaUI7QUFDZjdDLE1BQUFBLElBQUksQ0FBQy9CLGVBQUwsQ0FBcUJxRixJQUFyQixDQUEwQlcsaUJBQTFCO0FBQ0QsS0FGRCxNQUVPO0FBQ0xqRSxNQUFBQSxJQUFJLENBQUMvQixlQUFMLENBQXFCaUMsUUFBckIsQ0FBOEJzRCxlQUE5QixDQUE4QyxDQUE5QztBQUNEO0FBQ0YsR0FyT007QUFzT1BXLEVBQUFBLGFBdE9PLDJCQXNPUyxDQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRCxHQXBRTTtBQXFRUEMsRUFBQUEsZ0JBclFPLDRCQXFRVXpELEtBclFWLEVBcVFnQjBELE1BclFoQixFQXFRd0I7QUFDN0JsQixJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWWlCLE1BQVo7QUFDQW5HLElBQUFBLEVBQUUsQ0FBQ29HLHFCQUFILENBQXlCO0FBQ3ZCQyxNQUFBQSxLQUFLLEVBQUVGO0FBRGdCLEtBQXpCO0FBR0QsR0ExUU07QUEyUVBHLEVBQUFBLGNBM1FPLDRCQTJRVTtBQUNmLFFBQUksS0FBS0MsUUFBVCxFQUFtQjtBQUNqQixXQUFLQSxRQUFMLENBQWNDLElBQWQ7QUFDRDtBQUNGO0FBL1FNLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBoZXl1Y2hhbmdcbiAqIEBmaWxlICDmjpLooYzmppznu4Tku7ZcbiAqIEBkZXNjcmlwdGlvbiDnlKjmiLfngrnlh7vmn6XnnIvmjpLooYzmppzmiY3mo4Dmn6XmjojmnYMs5aaC5p6c5q2k5pe255So5oi35rKh5pyJ5o6I5p2D5YiZ6L+b5YWl5o6I5p2D55WM6Z2iXG4gKi9cbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgZGlzcGxheTogY2MuU3ByaXRlLFxuICAgIGdyb3VwRGlzcGxheTogY2MuU3ByaXRlLFxuICAgIF9pc1Nob3c6IGZhbHNlLFxuICAgIC8vIHNjb3JlOiAwXG4gIH0sXG4gIGluaXQoYykge1xuXG4gICAgdGhpcy5fZ2FtZUNvbnRyb2xsZXIgPSBjXG4gICAgd3guc2hvd1NoYXJlTWVudSh7XG4gICAgICB3aXRoU2hhcmVUaWNrZXQ6IHRydWVcbiAgICB9KVxuICAgIHd4Lm9uU2hhcmVBcHBNZXNzYWdlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRpdGxlOiBcIuW8gOWxgOWPquaYr+S4quWGnOawke+8jOeOsOWcqOW3sue7j+WBmuWIsOWusOebuFwiLFxuICAgICAgICBpbWFnZVVybDogJ2h0dHBzOi8vbW1vY2dhbWUucXBpYy5jbi93ZWNoYXRnYW1lL0x0SlpPakg2WjlpYmlhTWxwcXpsZHNPZjQ2UTdUWmlheXNJMWZ3YzRPajFMM0NrYkNhSk1BTW9pY2liYkh1MkhVUWtPaWIvMCdcbiAgICAgIH1cbiAgICB9KVxuICAgIC8vIOebkeWQrFxuICAgIHd4Lm9uQXVkaW9JbnRlcnJ1cHRpb25FbmQoKCkgPT4ge1xuICAgICAgYy5tdXNpY01hbmFnZXIucGF1c2VCZygpXG4gICAgICBjLm11c2ljTWFuYWdlci5yZXN1bWVCZygpXG4gICAgfSlcbiAgICB3eC5vblNob3coKG9wdGlvbnMpID0+IHtcbiAgICAgIGlmIChvcHRpb25zLnNjZW5lID09IDEwNDQpIHtcbiAgICAgICAgd3gucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgIG1lc3NhZ2U6ICdncm91cCcsXG4gICAgICAgICAgc2hhcmVUaWNrZXQ6IG9wdGlvbnMuc2hhcmVUaWNrZXRcbiAgICAgICAgfSlcbiAgICAgICAgYy5vcGVuR3JvdXBSYW5rKClcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5vZGUuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgYy50b3RhbFJhbmsuYWN0aXZlID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIGNjLmRpcmVjdG9yLnJlc3VtZSgpXG4gICAgfSlcbiAgICB3eC5vbkhpZGUoKCkgPT4ge1xuICAgICAgY2MuZGlyZWN0b3IucGF1c2UoKVxuICAgIH0pXG4gICAgLy8g6I635Y+W5pyA6auY5a6Y6Zi2XG4gICAgdGhpcy5nZXRIaWdoZXN0TGV2ZWwoKVxuICB9LFxuICBnZXRIaWdoZXN0TGV2ZWwoKSB7XG4gICAgbGV0IGhpZ2hMZXZlbCA9IHd4LmdldFN0b3JhZ2VTeW5jKCdoaWdoTGV2ZWwnKVxuICAgIHJldHVybiBoaWdoTGV2ZWxcbiAgfSxcbiAgZ2V0SGlnaGVzdFNjb3JlKCkge1xuICAgIGxldCBzY29yZSA9IHd4LmdldFN0b3JhZ2VTeW5jKCdoaWdoU2NvcmUnKVxuICAgIHJldHVybiBzY29yZVxuICB9LFxuICAvLyAtLS0tLS0tLS0tLS0tLS0gc2hhcmUgLS0tLS0tLS0tLS0tLS0tLVxuICBvblNoYXJlQnV0dG9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB3eC5zaGFyZUFwcE1lc3NhZ2Uoe1xuICAgICAgdGl0bGU6IFwi5oiR57uI5LqO5oiQ5Li65LqGXCIgKyB0aGlzLl9nYW1lQ29udHJvbGxlci5zY29yZU1nci5sZXZlbERhdGFbdGhpcy5fZ2FtZUNvbnRyb2xsZXIuc2NvcmVNZ3IubGV2ZWwgLSAxXS5uYW1lICsgXCIs55yf5piv5byA5b+DXCIsXG4gICAgICAvLyBpbWFnZVVybElkOiAnb3hFd0d2Q2xUMHVsZFE0NzBwTTg0dycsXG4gICAgICBpbWFnZVVybDogJ2h0dHBzOi8vbW1vY2dhbWUucXBpYy5jbi93ZWNoYXRnYW1lL0x0SlpPakg2WjlpYmlhTWxwcXpsZHNPZjQ2UTdUWmlheXNJMWZ3YzRPajFMM0NrYkNhSk1BTW9pY2liYkh1MkhVUWtPaWIvMCdcbiAgICB9KVxuICB9LFxuICBvblVzdWFsU2hhcmVCdXR0b24oKSB7XG4gICAgd3guc2hhcmVBcHBNZXNzYWdlKHtcbiAgICAgIHRpdGxlOiBcIuWPquaYr+S4quWGnOawke+8jOeOsOWcqOW3sue7j+WBmuWIsOWusOebuFwiLFxuICAgICAgLy8gaW1hZ2VVcmxJZDogJ294RXdHdkNsVDB1bGRRNDcwcE04NHcnLFxuICAgICAgaW1hZ2VVcmw6ICdodHRwczovL21tb2NnYW1lLnFwaWMuY24vd2VjaGF0Z2FtZS9MdEpaT2pINlo5aWJpYU1scHF6bGRzT2Y0NlE3VFppYXlzSTFmd2M0T2oxTDNDa2JDYUpNQU1vaWNpYmJIdTJIVVFrT2liLzAnXG4gICAgfSlcbiAgfSxcbiAgb25TaGFrZVBob25lKCkge1xuICAgIHd4LnZpYnJhdGVTaG9ydCgpXG4gIH0sXG4gIC8vIC0tLS0tLS0tLS0tLS0tLeWIhuaVsOS4iuS8oC0tLS0tLS0tLS0tLS0tLVxuICBvbkdhbWVPdmVyKGxldmVsLCBzY29yZSkge1xuICAgIC8v5LiK5Lyg5YiG5pWwXG4gICAgLy/miZPlvIDlvIDmlL7ln59cbiAgICB0aGlzLnNjb3JlID0gc2NvcmVcbiAgICBsZXQgaGlnaExldmVsID0gbGV2ZWxcbiAgICBsZXQgaGlnaFNjb3JlID0gc2NvcmVcbiAgICBsZXQgc2VsZiA9IHRoaXNcblxuICAgIHd4LnBvc3RNZXNzYWdlKHtcbiAgICAgIGV2ZW50OiAnc2V0U2NvcmUnLFxuICAgICAgc2NvcmU6IHNjb3JlLFxuICAgICAgbGV2ZWw6IGxldmVsLFxuICAgIH0pXG4gICAgXG4gICAgaGlnaExldmVsID0gd3guZ2V0U3RvcmFnZVN5bmMoJ2hpZ2hMZXZlbCcpXG4gICAgaGlnaExldmVsID0gcGFyc2VJbnQoaGlnaExldmVsKVxuICAgIGlmIChoaWdoTGV2ZWwpIHtcbiAgICAgIGhpZ2hMZXZlbCA9IGhpZ2hMZXZlbCA8IGxldmVsID8gbGV2ZWwgOiBoaWdoTGV2ZWxcbiAgICB9IGVsc2Uge1xuICAgICAgaGlnaExldmVsID0gbGV2ZWxcbiAgICB9XG4gICAgaGlnaFNjb3JlID0gd3guZ2V0U3RvcmFnZVN5bmMoJ2hpZ2hTY29yZScpXG4gICAgaWYgKGhpZ2hTY29yZSkge1xuICAgICAgaGlnaFNjb3JlID0gcGFyc2VJbnQoaGlnaFNjb3JlKVxuICAgICAgaGlnaFNjb3JlID0gaGlnaFNjb3JlIDwgc2NvcmUgPyBzY29yZSA6IGhpZ2hTY29yZVxuICAgIH0gZWxzZSB7XG4gICAgICBoaWdoU2NvcmUgPSBzY29yZVxuICAgIH1cbiAgICB2YXIgaGlnaExldmVsTmFtZSA9IHRoaXMuX2dhbWVDb250cm9sbGVyLmdhbWVEYXRhLmpzb24ubGV2ZWxEYXRhW2hpZ2hMZXZlbCAtIDFdLm5hbWVcbiAgICB3eC5zZXRTdG9yYWdlU3luYygnaGlnaExldmVsJywgaGlnaExldmVsICsgJycpXG4gICAgd3guc2V0U3RvcmFnZVN5bmMoJ2hpZ2hTY29yZScsIGhpZ2hTY29yZSArICcnKVxuICAgIHNlbGYuX2dhbWVDb250cm9sbGVyLnNjb3JlTWdyLmZhaWxIaWdoU2NvcmUuc3RyaW5nID0gXCLmgqjnmoTmnIDpq5jliIY6XCIgKyAoaGlnaFNjb3JlICsgJycpXG4gICAgdmFyIGt2RGF0YUxpc3QgPSBuZXcgQXJyYXkoKVxuICAgIGt2RGF0YUxpc3QucHVzaCh7XG4gICAgICBrZXk6IFwiaGlnaExldmVsXCIsXG4gICAgICB2YWx1ZTogaGlnaExldmVsTmFtZSxcbiAgICB9LCB7XG4gICAgICBrZXk6IFwiaGlnaFNjb3JlXCIsXG4gICAgICB2YWx1ZTogaGlnaFNjb3JlICsgJycsXG4gICAgfSlcbiAgfSxcbiAgc2hvd1JhbmsoKSB7XG4gICAgd3gucG9zdE1lc3NhZ2Uoe1xuICAgICAgbWVzc2FnZTogJ1Nob3cnLFxuICAgICAgZXZlbnQ6ICdnZXRSYW5rJyxcbiAgICB9KVxuICAgIHRoaXMuZGlzcGxheS5ub2RlLmFjdGl2ZSA9IHRydWVcbiAgICB0aGlzLl9pc1Nob3cgPSB0cnVlXG4gIH0sXG5cbiAgY2xvc2VSYW5rKCkge1xuICAgIHRoaXMuZGlzcGxheS5ub2RlLmFjdGl2ZSA9IGZhbHNlXG4gICAgd3gucG9zdE1lc3NhZ2Uoe1xuICAgICAgbWVzc2FnZTogJ0hpZGUnXG4gICAgfSlcbiAgICB0aGlzLl9pc1Nob3cgPSBmYWxzZVxuICB9LFxuICBzaG93R3JvdXBSYW5rKCkge1xuICAgIHd4LnBvc3RNZXNzYWdlKHtcbiAgICAgIG1lc3NhZ2U6ICdTaG93J1xuICAgIH0pXG4gICAgdGhpcy5ncm91cERpc3BsYXkubm9kZS5hY3RpdmUgPSB0cnVlXG4gICAgdGhpcy5faXNTaG93ID0gdHJ1ZVxuICB9LFxuICAvLyBzd2l0Y2hSYW5rVHlwZSgpIHtcbiAgLy8gICB3eC5wb3N0TWVzc2FnZSh7XG4gIC8vICAgICBtZXNzYWdlOiAnc3dpdGNoUmFuaydcbiAgLy8gICB9KVxuICAvLyAgIHRoaXMuX2lzU2hvdyA9IHRydWVcbiAgLy8gfSxcbiAgY2xvc2VHcm91cFJhbmsoKSB7XG4gICAgdGhpcy5ncm91cERpc3BsYXkubm9kZS5hY3RpdmUgPSBmYWxzZVxuICAgIHd4LnBvc3RNZXNzYWdlKHtcbiAgICAgIG1lc3NhZ2U6ICdIaWRlJ1xuICAgIH0pXG4gICAgdGhpcy5faXNTaG93ID0gZmFsc2VcbiAgfSxcbiAgY3JlYXRlSW1hZ2Uoc3ByaXRlLCB1cmwpIHtcbiAgICBsZXQgaW1hZ2UgPSB3eC5jcmVhdGVJbWFnZSgpO1xuICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCB0ZXh0dXJlID0gbmV3IGNjLlRleHR1cmUyRCgpO1xuICAgICAgdGV4dHVyZS5pbml0V2l0aEVsZW1lbnQoaW1hZ2UpO1xuICAgICAgdGV4dHVyZS5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XG4gICAgICBzcHJpdGUuc3ByaXRlRnJhbWUgPSBuZXcgY2MuU3ByaXRlRnJhbWUodGV4dHVyZSk7XG4gICAgfTtcbiAgICBpbWFnZS5zcmMgPSB1cmw7XG4gIH0sXG4gIHVwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5faXNTaG93KSB7XG4gICAgICBpZiAodGhpcy5kaXNwbGF5Lm5vZGUuYWN0aXZlKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5ub2RlLmdldENvbXBvbmVudChjYy5XWFN1YkNvbnRleHRWaWV3KS51cGRhdGUoKVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZ3JvdXBEaXNwbGF5Lm5vZGUuYWN0aXZlKSB7XG4gICAgICAgIHRoaXMuZ3JvdXBEaXNwbGF5Lm5vZGUuZ2V0Q29tcG9uZW50KGNjLldYU3ViQ29udGV4dFZpZXcpLnVwZGF0ZSgpXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAvLyDmjqfliLbmiZPlvIDlub/lkYpcbiAgb25SZXZpdmVCdXR0b24odHlwZSkge1xuICAgIC8vIOW5v+WRiuS9jVxuICAgIGxldCBzZWxmID0gdGhpc1xuICAgIHRoaXMuYWRUeXBlID0gdHlwZSAvLzDooajnpLrliqDlgI0gMeihqOekuuWkjea0u1xuICAgIGlmICh0aGlzLmF1ZGlvQWQpIHtcbiAgICAgIHRoaXMuYXVkaW9BZC5zaG93KCkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAvLyDlpLHotKXph43or5VcbiAgICAgICAgdGhpcy5hdWRpb0FkLmxvYWQoKVxuICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuYXVkaW9BZC5zaG93KCkpXG4gICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn5r+A5Yqx6KeG6aKRIOW5v+WRiuaYvuekuuWksei0pScsIGVyci5lcnJNc2cpXG4gICAgICAgICAgICBpZiAoc2VsZi5hZFR5cGUpIHtcbiAgICAgICAgICAgICAgc2VsZi5fZ2FtZUNvbnRyb2xsZXIuZ2FtZS5vblNraXBSZXZpdmUoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2VsZi5fZ2FtZUNvbnRyb2xsZXIuc2NvcmVNZ3Iub25MZXZlbFVwQnV0dG9uKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLmF1ZGlvQWQgPSB3eC5jcmVhdGVSZXdhcmRlZFZpZGVvQWQoe1xuICAgICAgYWRVbml0SWQ6ICdhZHVuaXQtNDgyMTQ4Y2ZlYjI0MzM3OCdcbiAgICB9KVxuICAgIHRoaXMuYXVkaW9BZC5zaG93KCkuY2F0Y2goKCkgPT4ge1xuICAgICAgLy8g5aSx6LSl6YeN6K+VXG4gICAgICB0aGlzLmF1ZGlvQWQubG9hZCgpXG4gICAgICAgIC50aGVuKCgpID0+IHRoaXMuYXVkaW9BZC5zaG93KCkpXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgIHNlbGYuZmFrZVNoYXJlKClcbiAgICAgICAgfSlcbiAgICB9KVxuICAgIHRoaXMuYXVkaW9BZC5vbkVycm9yKGVyciA9PiB7XG4gICAgICBzZWxmLmZha2VTaGFyZSgpXG4gICAgfSlcbiAgICB0aGlzLmF1ZGlvQWQub25DbG9zZSgocmVzKSA9PiB7XG4gICAgICBpZiAoc2VsZi5hZFR5cGUpIHtcbiAgICAgICAgaWYgKHJlcyAmJiByZXMuaXNFbmRlZCB8fCByZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHNlbGYuX2dhbWVDb250cm9sbGVyLmdhbWUuc2hvd1Jldml2ZVN1Y2Nlc3MoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYuX2dhbWVDb250cm9sbGVyLmdhbWUuYXNrUmV2aXZlKClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHJlcyAmJiByZXMuaXNFbmRlZCB8fCByZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHNlbGYuX2dhbWVDb250cm9sbGVyLnNjb3JlTWdyLm9uTGV2ZWxVcEJ1dHRvbigyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgZmFrZVNoYXJlKCkge1xuICAgIGxldCBzZWxmID0gdGhpc1xuICAgIHd4LnNoYXJlQXBwTWVzc2FnZSh7XG4gICAgICB0aXRsZTogXCLmiJHlt7Lnu4/njqnliLBcIiArIHRoaXMuX2dhbWVDb250cm9sbGVyLnNjb3JlTWdyLnNjb3JlICsgXCLliIbkuobvvIzpgoDor7fkvaDmnaXmjJHmiJhcIixcbiAgICAgIC8vIGltYWdlVXJsSWQ6ICdveEV3R3ZDbFQwdWxkUTQ3MHBNODR3JyxcbiAgICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9tbW9jZ2FtZS5xcGljLmNuL3dlY2hhdGdhbWUvTHRKWk9qSDZaOWliaWFNbHBxemxkc09mNDZRN1RaaWF5c0kxZndjNE9qMUwzQ2tiQ2FKTUFNb2ljaWJiSHUySFVRa09pYi8wJ1xuICAgIH0pXG4gICAgaWYgKHRoaXMuYWRUeXBlKSB7XG4gICAgICBzZWxmLl9nYW1lQ29udHJvbGxlci5nYW1lLnNob3dSZXZpdmVTdWNjZXNzKClcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5fZ2FtZUNvbnRyb2xsZXIuc2NvcmVNZ3Iub25MZXZlbFVwQnV0dG9uKDIpXG4gICAgfVxuICB9LFxuICBvcGVuQmFubmVyQWR2KCkge1xuICAgIC8vIOWIm+W7uiBCYW5uZXIg5bm/5ZGK5a6e5L6L77yM5o+Q5YmN5Yid5aeL5YyWXG4gICAgLy8gbGV0IHNjcmVlbldpZHRoID0gd3guZ2V0U3lzdGVtSW5mb1N5bmMoKS5zY3JlZW5XaWR0aFxuICAgIC8vIGxldCBiYW5uZXJIZWlnaHQgPSBzY3JlZW5XaWR0aCAvIDM1MCAqIDEyMFxuICAgIC8vIGxldCBzY3JlZW5IZWlnaHQgPSB3eC5nZXRTeXN0ZW1JbmZvU3luYygpLnNjcmVlbkhlaWdodCAtIDEwOFxuICAgIC8vIGxldCBhZFVuaXRJZHMgPSBbXG4gICAgLy8gICAnYWR1bml0LTUxMGE0ZWMzOTA2NWVmOTYnLFxuICAgIC8vICAgJ2FkdW5pdC0yOWIwZmE3YTJkYjhlOGNiJyxcbiAgICAvLyAgICdhZHVuaXQtNDAyMGJiOWVhNDM5ZTZhNSdcbiAgICAvLyBdXG4gICAgLy8gaWYgKHRoaXMuYmFubmVyQWQpIHtcbiAgICAvLyAgIHRoaXMuYmFubmVyQWQuZGVzdHJveSgpXG4gICAgLy8gfVxuICAgIC8vIHRoaXMuYmFubmVyQWQgPSB3eC5jcmVhdGVCYW5uZXJBZCh7XG4gICAgLy8gICBhZFVuaXRJZDogYWRVbml0SWRzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMpXSxcbiAgICAvLyAgIHN0eWxlOiB7XG4gICAgLy8gICAgIGxlZnQ6IDAsXG4gICAgLy8gICAgIHRvcDogc2NyZWVuSGVpZ2h0LFxuICAgIC8vICAgICB3aWR0aDogNjIwLFxuICAgIC8vICAgfVxuICAgIC8vIH0pXG4gICAgLy8gLy8g5Zyo6YCC5ZCI55qE5Zy65pmv5pi+56S6IEJhbm5lciDlub/lkYpcbiAgICAvLyB0aGlzLmJhbm5lckFkLm9uTG9hZCgoKSA9PiB7XG4gICAgLy8gICAvLyBjb25zb2xlLmxvZygnYmFubmVyIOW5v+WRiuWKoOi9veaIkOWKnycpXG4gICAgLy8gfSlcbiAgICAvLyB0aGlzLmJhbm5lckFkLm9uRXJyb3IoKGUpID0+IHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCdiYW5uZXIg5bm/5ZGK5Yqg6L295aSx6LSlJywgZSlcbiAgICAvLyB9KVxuICAgIC8vIHRoaXMuYmFubmVyQWQuc2hvdygpXG4gICAgLy8gICAudGhlbigpXG4gIH0sXG4gIG5hdlRvTWluaXByb2dyYW0oZXZlbnQsY3VzdG9tKSB7XG4gICAgY29uc29sZS5sb2coY3VzdG9tKVxuICAgIHd4Lm5hdmlnYXRlVG9NaW5pUHJvZ3JhbSh7XG4gICAgICBhcHBJZDogY3VzdG9tXG4gICAgfSlcbiAgfSxcbiAgY2xvc2VCYW5uZXJBZHYoKSB7XG4gICAgaWYgKHRoaXMuYmFubmVyQWQpIHtcbiAgICAgIHRoaXMuYmFubmVyQWQuaGlkZSgpXG4gICAgfVxuICB9XG59KTsiXX0=