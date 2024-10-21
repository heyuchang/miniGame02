
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/__qc_index__.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}
require('./assets/Script/GameAct');
require('./assets/Script/building');
require('./assets/Script/character');
require('./assets/Script/controller');
require('./assets/Script/element');
require('./assets/Script/elementCheck');
require('./assets/Script/game');
require('./assets/Script/illustrative');
require('./assets/Script/musicManager');
require('./assets/Script/pageManager');
require('./assets/Script/progress');
require('./assets/Script/score');
require('./assets/Script/scoreCell');
require('./assets/Script/scoreParticle');
require('./assets/Script/social');
require('./assets/Script/startPage');
require('./assets/Script/successDialog');
require('./assets/Script/tipBox');
require('./assets/Script/wx111');
require('./assets/migration/use_v2.0.x_cc.Toggle_event');

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
//------QC-SOURCE-SPLIT------

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzb2NpYWwuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJkaXNwbGF5IiwiU3ByaXRlIiwiZ3JvdXBEaXNwbGF5IiwiX2lzU2hvdyIsImluaXQiLCJjIiwiX2dhbWVDb250cm9sbGVyIiwid3giLCJzaG93U2hhcmVNZW51Iiwid2l0aFNoYXJlVGlja2V0Iiwib25TaGFyZUFwcE1lc3NhZ2UiLCJ0aXRsZSIsImltYWdlVXJsIiwib25BdWRpb0ludGVycnVwdGlvbkVuZCIsIm11c2ljTWFuYWdlciIsInBhdXNlQmciLCJyZXN1bWVCZyIsIm9uU2hvdyIsIm9wdGlvbnMiLCJzY2VuZSIsInBvc3RNZXNzYWdlIiwibWVzc2FnZSIsInNoYXJlVGlja2V0Iiwib3Blbkdyb3VwUmFuayIsIm5vZGUiLCJhY3RpdmUiLCJ0b3RhbFJhbmsiLCJkaXJlY3RvciIsInJlc3VtZSIsIm9uSGlkZSIsInBhdXNlIiwiZ2V0SGlnaGVzdExldmVsIiwiaGlnaExldmVsIiwiZ2V0U3RvcmFnZVN5bmMiLCJnZXRIaWdoZXN0U2NvcmUiLCJzY29yZSIsIm9uU2hhcmVCdXR0b24iLCJzZWxmIiwic2hhcmVBcHBNZXNzYWdlIiwic2NvcmVNZ3IiLCJsZXZlbERhdGEiLCJsZXZlbCIsIm5hbWUiLCJvblVzdWFsU2hhcmVCdXR0b24iLCJvblNoYWtlUGhvbmUiLCJ2aWJyYXRlU2hvcnQiLCJvbkdhbWVPdmVyIiwiaGlnaFNjb3JlIiwiZXZlbnQiLCJwYXJzZUludCIsImhpZ2hMZXZlbE5hbWUiLCJnYW1lRGF0YSIsImpzb24iLCJzZXRTdG9yYWdlU3luYyIsImZhaWxIaWdoU2NvcmUiLCJzdHJpbmciLCJrdkRhdGFMaXN0IiwiQXJyYXkiLCJwdXNoIiwia2V5IiwidmFsdWUiLCJzaG93UmFuayIsImNsb3NlUmFuayIsInNob3dHcm91cFJhbmsiLCJjbG9zZUdyb3VwUmFuayIsImNyZWF0ZUltYWdlIiwic3ByaXRlIiwidXJsIiwiaW1hZ2UiLCJvbmxvYWQiLCJ0ZXh0dXJlIiwiVGV4dHVyZTJEIiwiaW5pdFdpdGhFbGVtZW50IiwiaGFuZGxlTG9hZGVkVGV4dHVyZSIsInNwcml0ZUZyYW1lIiwiU3ByaXRlRnJhbWUiLCJzcmMiLCJ1cGRhdGUiLCJnZXRDb21wb25lbnQiLCJXWFN1YkNvbnRleHRWaWV3Iiwib25SZXZpdmVCdXR0b24iLCJ0eXBlIiwiYWRUeXBlIiwiYXVkaW9BZCIsInNob3ciLCJsb2FkIiwidGhlbiIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJlcnJNc2ciLCJnYW1lIiwib25Ta2lwUmV2aXZlIiwib25MZXZlbFVwQnV0dG9uIiwiY3JlYXRlUmV3YXJkZWRWaWRlb0FkIiwiYWRVbml0SWQiLCJmYWtlU2hhcmUiLCJvbkVycm9yIiwib25DbG9zZSIsInJlcyIsImlzRW5kZWQiLCJ1bmRlZmluZWQiLCJzaG93UmV2aXZlU3VjY2VzcyIsImFza1Jldml2ZSIsIm9wZW5CYW5uZXJBZHYiLCJuYXZUb01pbmlwcm9ncmFtIiwiY3VzdG9tIiwibmF2aWdhdGVUb01pbmlQcm9ncmFtIiwiYXBwSWQiLCJjbG9zZUJhbm5lckFkdiIsImJhbm5lckFkIiwiaGlkZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7QUFLQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFFUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLE9BQU8sRUFBRUosRUFBRSxDQUFDSyxNQURGO0FBRVZDLElBQUFBLFlBQVksRUFBRU4sRUFBRSxDQUFDSyxNQUZQO0FBR1ZFLElBQUFBLE9BQU8sRUFBRSxLQUhDLENBSVY7O0FBSlUsR0FGTDtBQVFQQyxFQUFBQSxJQVJPLGdCQVFGQyxDQVJFLEVBUUM7QUFBQTs7QUFFTixTQUFLQyxlQUFMLEdBQXVCRCxDQUF2QjtBQUNBRSxJQUFBQSxFQUFFLENBQUNDLGFBQUgsQ0FBaUI7QUFDZkMsTUFBQUEsZUFBZSxFQUFFO0FB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QUFBLGFBdE9PLDJCQXNPUyxDQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRCxHQXBRTTtBQXFRUEMsRUFBQUEsZ0JBclFPLDRCQXFRVXpELEtBclFWLEVBcVFnQjBELE1BclFoQixFQXFRd0I7QUFDN0JsQixJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWWlCLE1BQVo7QUFDQW5HLElBQUFBLEVBQUUsQ0FBQ29HLHFCQUFILENBQXlCO0FBQ3ZCQyxNQUFBQSxLQUFLLEVBQUVGO0FBRGdCLEtBQXpCO0FBR0QsR0ExUU07QUEyUVBHLEVBQUFBLGNBM1FPLDRCQTJRVTtBQUNmLFFBQUksS0FBS0MsUUFBVCxFQUFtQjtBQUNqQixXQUFLQSxRQUFMLENBQWNDLElBQWQ7QUFDRDtBQUNGO0FBL1FNLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBoZXl1Y2hhbmdcbiAqIEBmaWxlICDmjpLooYzmppznu4Tku7ZcbiAqIEBkZXNjcmlwdGlvbiDnlKjmiLfngrnlh7vmn6XnnIvmjpLooYzmppzmiY3mo4Dmn6XmjojmnYMs5aaC5p6c5q2k5pe255So5oi35rKh5pyJ5o6I5p2D5YiZ6L+b5YWl5o6I5p2D55WM6Z2iXG4gKi9cbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgZGlzcGxheTogY2MuU3ByaXRlLFxuICAgIGdyb3VwRGlzcGxheTogY2MuU3ByaXRlLFxuICAgIF9pc1Nob3c6IGZhbHNlLFxuICAgIC8vIHNjb3JlOiAwXG4gIH0sXG4gIGluaXQoYykge1xuXG4gICAgdGhpcy5fZ2FtZUNvbnRyb2xsZXIgPSBjXG4gICAgd3guc2hvd1NoYXJlTWVudSh7XG4gICAgICB3aXRoU2hhcmVUaWNrZXQ6IHRydWVcbiAgICB9KVxuICAgIHd4Lm9uU2hhcmVBcHBNZXNzYWdlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRpdGxlOiBcIuW8gOWxgOWPquaYr+S4quWGnOawke+8jOeOsOWcqOW3sue7j+WBmuWIsOWusOebuFwiLFxuICAgICAgICBpbWFnZVVybDogJ2h0dHBzOi8vbW1vY2dhbWUucXBpYy5jbi93ZWNoYXRnYW1lL0x0SlpPakg2WjlpYmlhTWxwcXpsZHNPZjQ2UTdUWmlheXNJMWZ3YzRPajFMM0NrYkNhSk1BTW9pY2liYkh1MkhVUWtPaWIvMCdcbiAgICAgIH1cbiAgICB9KVxuICAgIC8vIOebkeWQrFxuICAgIHd4Lm9uQXVkaW9JbnRlcnJ1cHRpb25FbmQoKCkgPT4ge1xuICAgICAgYy5tdXNpY01hbmFnZXIucGF1c2VCZygpXG4gICAgICBjLm11c2ljTWFuYWdlci5yZXN1bWVCZygpXG4gICAgfSlcbiAgICB3eC5vblNob3coKG9wdGlvbnMpID0+IHtcbiAgICAgIGlmIChvcHRpb25zLnNjZW5lID09IDEwNDQpIHtcbiAgICAgICAgd3gucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgIG1lc3NhZ2U6ICdncm91cCcsXG4gICAgICAgICAgc2hhcmVUaWNrZXQ6IG9wdGlvbnMuc2hhcmVUaWNrZXRcbiAgICAgICAgfSlcbiAgICAgICAgYy5vcGVuR3JvdXBSYW5rKClcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5vZGUuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgYy50b3RhbFJhbmsuYWN0aXZlID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIGNjLmRpcmVjdG9yLnJlc3VtZSgpXG4gICAgfSlcbiAgICB3eC5vbkhpZGUoKCkgPT4ge1xuICAgICAgY2MuZGlyZWN0b3IucGF1c2UoKVxuICAgIH0pXG4gICAgLy8g6I635Y+W5pyA6auY5a6Y6Zi2XG4gICAgdGhpcy5nZXRIaWdoZXN0TGV2ZWwoKVxuICB9LFxuICBnZXRIaWdoZXN0TGV2ZWwoKSB7XG4gICAgbGV0IGhpZ2hMZXZlbCA9IHd4LmdldFN0b3JhZ2VTeW5jKCdoaWdoTGV2ZWwnKVxuICAgIHJldHVybiBoaWdoTGV2ZWxcbiAgfSxcbiAgZ2V0SGlnaGVzdFNjb3JlKCkge1xuICAgIGxldCBzY29yZSA9IHd4LmdldFN0b3JhZ2VTeW5jKCdoaWdoU2NvcmUnKVxuICAgIHJldHVybiBzY29yZVxuICB9LFxuICAvLyAtLS0tLS0tLS0tLS0tLS0gc2hhcmUgLS0tLS0tLS0tLS0tLS0tLVxuICBvblNoYXJlQnV0dG9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB3eC5zaGFyZUFwcE1lc3NhZ2Uoe1xuICAgICAgdGl0bGU6IFwi5oiR57uI5LqO5oiQ5Li65LqGXCIgKyB0aGlzLl9nYW1lQ29udHJvbGxlci5zY29yZU1nci5sZXZlbERhdGFbdGhpcy5fZ2FtZUNvbnRyb2xsZXIuc2NvcmVNZ3IubGV2ZWwgLSAxXS5uYW1lICsgXCIs55yf5piv5byA5b+DXCIsXG4gICAgICAvLyBpbWFnZVVybElkOiAnb3hFd0d2Q2xUMHVsZFE0NzBwTTg0dycsXG4gICAgICBpbWFnZVVybDogJ2h0dHBzOi8vbW1vY2dhbWUucXBpYy5jbi93ZWNoYXRnYW1lL0x0SlpPakg2WjlpYmlhTWxwcXpsZHNPZjQ2UTdUWmlheXNJMWZ3YzRPajFMM0NrYkNhSk1BTW9pY2liYkh1MkhVUWtPaWIvMCdcbiAgICB9KVxuICB9LFxuICBvblVzdWFsU2hhcmVCdXR0b24oKSB7XG4gICAgd3guc2hhcmVBcHBNZXNzYWdlKHtcbiAgICAgIHRpdGxlOiBcIuWPquaYr+S4quWGnOawke+8jOeOsOWcqOW3sue7j+WBmuWIsOWusOebuFwiLFxuICAgICAgLy8gaW1hZ2VVcmxJZDogJ294RXdHdkNsVDB1bGRRNDcwcE04NHcnLFxuICAgICAgaW1hZ2VVcmw6ICdodHRwczovL21tb2NnYW1lLnFwaWMuY24vd2VjaGF0Z2FtZS9MdEpaT2pINlo5aWJpYU1scHF6bGRzT2Y0NlE3VFppYXlzSTFmd2M0T2oxTDNDa2JDYUpNQU1vaWNpYmJIdTJIVVFrT2liLzAnXG4gICAgfSlcbiAgfSxcbiAgb25TaGFrZVBob25lKCkge1xuICAgIHd4LnZpYnJhdGVTaG9ydCgpXG4gIH0sXG4gIC8vIC0tLS0tLS0tLS0tLS0tLeWIhuaVsOS4iuS8oC0tLS0tLS0tLS0tLS0tLVxuICBvbkdhbWVPdmVyKGxldmVsLCBzY29yZSkge1xuICAgIC8v5LiK5Lyg5YiG5pWwXG4gICAgLy/miZPlvIDlvIDmlL7ln59cbiAgICB0aGlzLnNjb3JlID0gc2NvcmVcbiAgICBsZXQgaGlnaExldmVsID0gbGV2ZWxcbiAgICBsZXQgaGlnaFNjb3JlID0gc2NvcmVcbiAgICBsZXQgc2VsZiA9IHRoaXNcblxuICAgIHd4LnBvc3RNZXNzYWdlKHtcbiAgICAgIGV2ZW50OiAnc2V0U2NvcmUnLFxuICAgICAgc2NvcmU6IHNjb3JlLFxuICAgICAgbGV2ZWw6IGxldmVsLFxuICAgIH0pXG4gICAgXG4gICAgaGlnaExldmVsID0gd3guZ2V0U3RvcmFnZVN5bmMoJ2hpZ2hMZXZlbCcpXG4gICAgaGlnaExldmVsID0gcGFyc2VJbnQoaGlnaExldmVsKVxuICAgIGlmIChoaWdoTGV2ZWwpIHtcbiAgICAgIGhpZ2hMZXZlbCA9IGhpZ2hMZXZlbCA8IGxldmVsID8gbGV2ZWwgOiBoaWdoTGV2ZWxcbiAgICB9IGVsc2Uge1xuICAgICAgaGlnaExldmVsID0gbGV2ZWxcbiAgICB9XG4gICAgaGlnaFNjb3JlID0gd3guZ2V0U3RvcmFnZVN5bmMoJ2hpZ2hTY29yZScpXG4gICAgaWYgKGhpZ2hTY29yZSkge1xuICAgICAgaGlnaFNjb3JlID0gcGFyc2VJbnQoaGlnaFNjb3JlKVxuICAgICAgaGlnaFNjb3JlID0gaGlnaFNjb3JlIDwgc2NvcmUgPyBzY29yZSA6IGhpZ2hTY29yZVxuICAgIH0gZWxzZSB7XG4gICAgICBoaWdoU2NvcmUgPSBzY29yZVxuICAgIH1cbiAgICB2YXIgaGlnaExldmVsTmFtZSA9IHRoaXMuX2dhbWVDb250cm9sbGVyLmdhbWVEYXRhLmpzb24ubGV2ZWxEYXRhW2hpZ2hMZXZlbCAtIDFdLm5hbWVcbiAgICB3eC5zZXRTdG9yYWdlU3luYygnaGlnaExldmVsJywgaGlnaExldmVsICsgJycpXG4gICAgd3guc2V0U3RvcmFnZVN5bmMoJ2hpZ2hTY29yZScsIGhpZ2hTY29yZSArICcnKVxuICAgIHNlbGYuX2dhbWVDb250cm9sbGVyLnNjb3JlTWdyLmZhaWxIaWdoU2NvcmUuc3RyaW5nID0gXCLmgqjnmoTmnIDpq5jliIY6XCIgKyAoaGlnaFNjb3JlICsgJycpXG4gICAgdmFyIGt2RGF0YUxpc3QgPSBuZXcgQXJyYXkoKVxuICAgIGt2RGF0YUxpc3QucHVzaCh7XG4gICAgICBrZXk6IFwiaGlnaExldmVsXCIsXG4gICAgICB2YWx1ZTogaGlnaExldmVsTmFtZSxcbiAgICB9LCB7XG4gICAgICBrZXk6IFwiaGlnaFNjb3JlXCIsXG4gICAgICB2YWx1ZTogaGlnaFNjb3JlICsgJycsXG4gICAgfSlcbiAgfSxcbiAgc2hvd1JhbmsoKSB7XG4gICAgd3gucG9zdE1lc3NhZ2Uoe1xuICAgICAgbWVzc2FnZTogJ1Nob3cnLFxuICAgICAgZXZlbnQ6ICdnZXRSYW5rJyxcbiAgICB9KVxuICAgIHRoaXMuZGlzcGxheS5ub2RlLmFjdGl2ZSA9IHRydWVcbiAgICB0aGlzLl9pc1Nob3cgPSB0cnVlXG4gIH0sXG5cbiAgY2xvc2VSYW5rKCkge1xuICAgIHRoaXMuZGlzcGxheS5ub2RlLmFjdGl2ZSA9IGZhbHNlXG4gICAgd3gucG9zdE1lc3NhZ2Uoe1xuICAgICAgbWVzc2FnZTogJ0hpZGUnXG4gICAgfSlcbiAgICB0aGlzLl9pc1Nob3cgPSBmYWxzZVxuICB9LFxuICBzaG93R3JvdXBSYW5rKCkge1xuICAgIHd4LnBvc3RNZXNzYWdlKHtcbiAgICAgIG1lc3NhZ2U6ICdTaG93J1xuICAgIH0pXG4gICAgdGhpcy5ncm91cERpc3BsYXkubm9kZS5hY3RpdmUgPSB0cnVlXG4gICAgdGhpcy5faXNTaG93ID0gdHJ1ZVxuICB9LFxuICAvLyBzd2l0Y2hSYW5rVHlwZSgpIHtcbiAgLy8gICB3eC5wb3N0TWVzc2FnZSh7XG4gIC8vICAgICBtZXNzYWdlOiAnc3dpdGNoUmFuaydcbiAgLy8gICB9KVxuICAvLyAgIHRoaXMuX2lzU2hvdyA9IHRydWVcbiAgLy8gfSxcbiAgY2xvc2VHcm91cFJhbmsoKSB7XG4gICAgdGhpcy5ncm91cERpc3BsYXkubm9kZS5hY3RpdmUgPSBmYWxzZVxuICAgIHd4LnBvc3RNZXNzYWdlKHtcbiAgICAgIG1lc3NhZ2U6ICdIaWRlJ1xuICAgIH0pXG4gICAgdGhpcy5faXNTaG93ID0gZmFsc2VcbiAgfSxcbiAgY3JlYXRlSW1hZ2Uoc3ByaXRlLCB1cmwpIHtcbiAgICBsZXQgaW1hZ2UgPSB3eC5jcmVhdGVJbWFnZSgpO1xuICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCB0ZXh0dXJlID0gbmV3IGNjLlRleHR1cmUyRCgpO1xuICAgICAgdGV4dHVyZS5pbml0V2l0aEVsZW1lbnQoaW1hZ2UpO1xuICAgICAgdGV4dHVyZS5oYW5kbGVMb2FkZWRUZXh0dXJlKCk7XG4gICAgICBzcHJpdGUuc3ByaXRlRnJhbWUgPSBuZXcgY2MuU3ByaXRlRnJhbWUodGV4dHVyZSk7XG4gICAgfTtcbiAgICBpbWFnZS5zcmMgPSB1cmw7XG4gIH0sXG4gIHVwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5faXNTaG93KSB7XG4gICAgICBpZiAodGhpcy5kaXNwbGF5Lm5vZGUuYWN0aXZlKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5ub2RlLmdldENvbXBvbmVudChjYy5XWFN1YkNvbnRleHRWaWV3KS51cGRhdGUoKVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZ3JvdXBEaXNwbGF5Lm5vZGUuYWN0aXZlKSB7XG4gICAgICAgIHRoaXMuZ3JvdXBEaXNwbGF5Lm5vZGUuZ2V0Q29tcG9uZW50KGNjLldYU3ViQ29udGV4dFZpZXcpLnVwZGF0ZSgpXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAvLyDmjqfliLbmiZPlvIDlub/lkYpcbiAgb25SZXZpdmVCdXR0b24odHlwZSkge1xuICAgIC8vIOW5v+WRiuS9jVxuICAgIGxldCBzZWxmID0gdGhpc1xuICAgIHRoaXMuYWRUeXBlID0gdHlwZSAvLzDooajnpLrliqDlgI0gMeihqOekuuWkjea0u1xuICAgIGlmICh0aGlzLmF1ZGlvQWQpIHtcbiAgICAgIHRoaXMuYXVkaW9BZC5zaG93KCkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAvLyDlpLHotKXph43or5VcbiAgICAgICAgdGhpcy5hdWRpb0FkLmxvYWQoKVxuICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuYXVkaW9BZC5zaG93KCkpXG4gICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn5r+A5Yqx6KeG6aKRIOW5v+WRiuaYvuekuuWksei0pScsIGVyci5lcnJNc2cpXG4gICAgICAgICAgICBpZiAoc2VsZi5hZFR5cGUpIHtcbiAgICAgICAgICAgICAgc2VsZi5fZ2FtZUNvbnRyb2xsZXIuZ2FtZS5vblNraXBSZXZpdmUoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2VsZi5fZ2FtZUNvbnRyb2xsZXIuc2NvcmVNZ3Iub25MZXZlbFVwQnV0dG9uKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLmF1ZGlvQWQgPSB3eC5jcmVhdGVSZXdhcmRlZFZpZGVvQWQoe1xuICAgICAgYWRVbml0SWQ6ICdhZHVuaXQtNDgyMTQ4Y2ZlYjI0MzM3OCdcbiAgICB9KVxuICAgIHRoaXMuYXVkaW9BZC5zaG93KCkuY2F0Y2goKCkgPT4ge1xuICAgICAgLy8g5aSx6LSl6YeN6K+VXG4gICAgICB0aGlzLmF1ZGlvQWQubG9hZCgpXG4gICAgICAgIC50aGVuKCgpID0+IHRoaXMuYXVkaW9BZC5zaG93KCkpXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgIHNlbGYuZmFrZVNoYXJlKClcbiAgICAgICAgfSlcbiAgICB9KVxuICAgIHRoaXMuYXVkaW9BZC5vbkVycm9yKGVyciA9PiB7XG4gICAgICBzZWxmLmZha2VTaGFyZSgpXG4gICAgfSlcbiAgICB0aGlzLmF1ZGlvQWQub25DbG9zZSgocmVzKSA9PiB7XG4gICAgICBpZiAoc2VsZi5hZFR5cGUpIHtcbiAgICAgICAgaWYgKHJlcyAmJiByZXMuaXNFbmRlZCB8fCByZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHNlbGYuX2dhbWVDb250cm9sbGVyLmdhbWUuc2hvd1Jldml2ZVN1Y2Nlc3MoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYuX2dhbWVDb250cm9sbGVyLmdhbWUuYXNrUmV2aXZlKClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHJlcyAmJiByZXMuaXNFbmRlZCB8fCByZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHNlbGYuX2dhbWVDb250cm9sbGVyLnNjb3JlTWdyLm9uTGV2ZWxVcEJ1dHRvbigyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgZmFrZVNoYXJlKCkge1xuICAgIGxldCBzZWxmID0gdGhpc1xuICAgIHd4LnNoYXJlQXBwTWVzc2FnZSh7XG4gICAgICB0aXRsZTogXCLmiJHlt7Lnu4/njqnliLBcIiArIHRoaXMuX2dhbWVDb250cm9sbGVyLnNjb3JlTWdyLnNjb3JlICsgXCLliIbkuobvvIzpgoDor7fkvaDmnaXmjJHmiJhcIixcbiAgICAgIC8vIGltYWdlVXJsSWQ6ICdveEV3R3ZDbFQwdWxkUTQ3MHBNODR3JyxcbiAgICAgIGltYWdlVXJsOiAnaHR0cHM6Ly9tbW9jZ2FtZS5xcGljLmNuL3dlY2hhdGdhbWUvTHRKWk9qSDZaOWliaWFNbHBxemxkc09mNDZRN1RaaWF5c0kxZndjNE9qMUwzQ2tiQ2FKTUFNb2ljaWJiSHUySFVRa09pYi8wJ1xuICAgIH0pXG4gICAgaWYgKHRoaXMuYWRUeXBlKSB7XG4gICAgICBzZWxmLl9nYW1lQ29udHJvbGxlci5nYW1lLnNob3dSZXZpdmVTdWNjZXNzKClcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5fZ2FtZUNvbnRyb2xsZXIuc2NvcmVNZ3Iub25MZXZlbFVwQnV0dG9uKDIpXG4gICAgfVxuICB9LFxuICBvcGVuQmFubmVyQWR2KCkge1xuICAgIC8vIOWIm+W7uiBCYW5uZXIg5bm/5ZGK5a6e5L6L77yM5o+Q5YmN5Yid5aeL5YyWXG4gICAgLy8gbGV0IHNjcmVlbldpZHRoID0gd3guZ2V0U3lzdGVtSW5mb1N5bmMoKS5zY3JlZW5XaWR0aFxuICAgIC8vIGxldCBiYW5uZXJIZWlnaHQgPSBzY3JlZW5XaWR0aCAvIDM1MCAqIDEyMFxuICAgIC8vIGxldCBzY3JlZW5IZWlnaHQgPSB3eC5nZXRTeXN0ZW1JbmZvU3luYygpLnNjcmVlbkhlaWdodCAtIDEwOFxuICAgIC8vIGxldCBhZFVuaXRJZHMgPSBbXG4gICAgLy8gICAnYWR1bml0LTUxMGE0ZWMzOTA2NWVmOTYnLFxuICAgIC8vICAgJ2FkdW5pdC0yOWIwZmE3YTJkYjhlOGNiJyxcbiAgICAvLyAgICdhZHVuaXQtNDAyMGJiOWVhNDM5ZTZhNSdcbiAgICAvLyBdXG4gICAgLy8gaWYgKHRoaXMuYmFubmVyQWQpIHtcbiAgICAvLyAgIHRoaXMuYmFubmVyQWQuZGVzdHJveSgpXG4gICAgLy8gfVxuICAgIC8vIHRoaXMuYmFubmVyQWQgPSB3eC5jcmVhdGVCYW5uZXJBZCh7XG4gICAgLy8gICBhZFVuaXRJZDogYWRVbml0SWRzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDMpXSxcbiAgICAvLyAgIHN0eWxlOiB7XG4gICAgLy8gICAgIGxlZnQ6IDAsXG4gICAgLy8gICAgIHRvcDogc2NyZWVuSGVpZ2h0LFxuICAgIC8vICAgICB3aWR0aDogNjIwLFxuICAgIC8vICAgfVxuICAgIC8vIH0pXG4gICAgLy8gLy8g5Zyo6YCC5ZCI55qE5Zy65pmv5pi+56S6IEJhbm5lciDlub/lkYpcbiAgICAvLyB0aGlzLmJhbm5lckFkLm9uTG9hZCgoKSA9PiB7XG4gICAgLy8gICAvLyBjb25zb2xlLmxvZygnYmFubmVyIOW5v+WRiuWKoOi9veaIkOWKnycpXG4gICAgLy8gfSlcbiAgICAvLyB0aGlzLmJhbm5lckFkLm9uRXJyb3IoKGUpID0+IHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCdiYW5uZXIg5bm/5ZGK5Yqg6L295aSx6LSlJywgZSlcbiAgICAvLyB9KVxuICAgIC8vIHRoaXMuYmFubmVyQWQuc2hvdygpXG4gICAgLy8gICAudGhlbigpXG4gIH0sXG4gIG5hdlRvTWluaXByb2dyYW0oZXZlbnQsY3VzdG9tKSB7XG4gICAgY29uc29sZS5sb2coY3VzdG9tKVxuICAgIHd4Lm5hdmlnYXRlVG9NaW5pUHJvZ3JhbSh7XG4gICAgICBhcHBJZDogY3VzdG9tXG4gICAgfSlcbiAgfSxcbiAgY2xvc2VCYW5uZXJBZHYoKSB7XG4gICAgaWYgKHRoaXMuYmFubmVyQWQpIHtcbiAgICAgIHRoaXMuYmFubmVyQWQuaGlkZSgpXG4gICAgfVxuICB9XG59KTsiXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/score.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '72f7acBwR1I474pejqfLV0j', 'score');
// Script/score.js

"use strict";

/**
 * @author heyuchang
 * @file  UI 分数控制器
 */
var AC = require('GameAct');

cc.Class({
  "extends": cc.Component,
  properties: {
    scorePrefab: cc.Prefab,
    scoreParticlePrefab: cc.Prefab,
    mainScoreLabel: cc.Label,
    successDialog: require('successDialog'),
    characterMgr: require('character'),
    failDialog: cc.Node,
    multPropPrefab: cc.Prefab,
    // progressBar: require('progress'),
    // leftStepLabel: cc.Label,
    chainSpriteFrameArr: [cc.SpriteFrame],
    stepAniLabel: cc.Label,
    //提示小框
    tipBox: require('tipBox')
  },
  init: function init(g) {
    this._game = g;
    this._gameController = g._gameController;
    this.score = 0;
    this.leftStep = this._gameController.config.json.originStep;
    this.chain = 1;
    this.level = 1;
    this.reviveTime = 0;
    this.closeMultLabel();
    this.levelData = g._gameController.gameData.json.levelData;
    this.nameLabel.string = "萌心悦";
    this.progressBar.init(0, this.levelData[this.level - 1], this.level);
    this.leftStepLabel.string = this.leftStep;
    this.stepAniLabel.node.runAction(cc.hide());
    this.scoreTimer = [];
    this.currentAddedScore = 0;
    this.mainScoreLabel.node.active = false;
    this.characterMgr.showHeroCharacter(this.level);
    this.hideChainSprite();
    this.tipBox.init(this, 0);

    if (this._gameController.social.node.active) {
      var height = this._gameController.social.getHighestLevel();

      if (height) {
        this.onStep(this.levelData[+height - 1].giftStep);
      }
    }
  },
  start: function start() {
    this.generatePrefabPool();
    this.bindNode();
  },
  generatePrefabPool: function generatePrefabPool() {
    this.scorePool = new cc.NodePool();

    for (var i = 0; i < 20; i++) {
      var score = cc.instantiate(this.scorePrefab);
      this.scorePool.put(score);
    }

    this.scoreParticlePool = new cc.NodePool();

    for (var _i = 0; _i < 20; _i++) {
      var scoreParticle = cc.instantiate(this.scoreParticlePrefab);
      this.scoreParticlePool.put(scoreParticle);
    }

    this.multPropPool = new cc.NodePool();

    for (var _i2 = 0; _i2 < 3; _i2++) {
      var multProp = cc.instantiate(this.multPropPrefab);
      this.multPropPool.put(multProp);
    }
  },
  // 实例化单个方块
  instantiateScore: function instantiateScore(self, num, pos) {
    var score = null;

    if (self.scorePool && self.scorePool.size() > 0) {
      score = self.scorePool.get();
    } else {
      score = cc.instantiate(self.scorePrefab);
    }

    score.parent = this.scoreContainer;
    score.getComponent('scoreCell').init(self, num, pos);
    var scoreParticle = null;

    if (self.scoreParticlePool && self.scoreParticlePool.size() > 0) {
      scoreParticle = self.scoreParticlePool.get();
    } else {
      scoreParticle = cc.instantiate(self.scoreParticlePrefab);
    }

    scoreParticle.parent = this.scoreContainer;
    scoreParticle.getComponent('scoreParticle').init(self, pos, this._gameController.config.json.scoreParticleTime);
  },
  bindNode: function bindNode() {
    this.leftStepLabel = this.node.getChildByName('UI').getChildByName('leftStepNode').getChildByName('Label').getComponent(cc.Label);
    this.progressBar = this.node.getChildByName('UI').getChildByName('scoreNode').getChildByName('progressBar').getComponent('progress');
    this.scoreContainer = this.node.getChildByName('UI').getChildByName('scoreGroup');
    this.multLabel = this.mainScoreLabel.node.getChildByName('mult').getComponent(cc.Label);
    this.nameLabel = this.node.getChildByName('UI').getChildByName('scoreNode').getChildByName('progressBar').getChildByName('name').getComponent(cc.Label); // 失败时更新失败UI

    this.chainSprite = this.node.getChildByName('UI').getChildByName('chainSprite').getComponent(cc.Sprite);
    this.failScore = this.failDialog.getChildByName('info').getChildByName('score').getComponent(cc.Label);
    this.failName = this.failDialog.getChildByName('info').getChildByName('level').getComponent(cc.Label);
    this.failSprite = this.failDialog.getChildByName('info').getChildByName('sprite').getComponent(cc.Sprite);
    this.failHighScore = this.failDialog.getChildByName('info').getChildByName('highScore').getComponent(cc.Label);
  },
  //--------------------- 分数控制 ---------------------
  // 增加 减少步数并且刷新UI
  onStep: function onStep(num) {
    var _this = this;

    this.leftStep += num;
    return new Promise(function (resolve, reject) {
      if (_this.leftStep < 0) {
        _this.leftStep = 0;

        _this.onGameOver();

        resolve(false);
      } else {
        resolve(true);
      }

      _this.leftStepLabel.string = _this.leftStep;

      if (num > 0) {
        _this.showStepAni(num);
      }
    });
  },
  //增加分数总控制 获取连击
  addScore: function addScore(pos, score) {
    var _this2 = this;

    score = score || this._gameController.config.json.scoreBase; // 一次消除可以叠chain

    if (this.chainTimer) {
      clearTimeout(this.chainTimer);
    }

    this.initCurrentScoreLabel();
    this.chainTimer = setTimeout(function () {
      _this2.onCurrentScoreLabel(_this2.currentAddedScore, {
        x: -60,
        y: 355
      }, cc.callFunc(function () {
        _this2.score += _this2.currentAddedScore * _this2.multiple;

        _this2.checkLevelUp();

        _this2.chain = 1;

        _this2.closeMultLabel();

        _this2.hideChainSprite();

        _this2.currentAddedScore = 0;
        _this2.mainScoreLabel.node.active = false;
      }, _this2));
    }, 500 / 1 // (cc.game.getFrameRate() / 60)
    );
    var addScore = score == this._gameController.config.json.scoreBase ? score + (this.chain > 16 ? 16 : this.chain - 1) * 10 : score; // let addScore = score == 10 ? score * (this.chain > 10 ? 10 : this.chain) : score

    this.currentAddedScore += addScore;
    this.mainScoreLabel.string = this.currentAddedScore;
    this.instantiateScore(this, addScore, pos);
    this.chain++;
    this.checkChain();
  },
  // 判断连击
  checkChain: function checkChain() {
    var _this3 = this;

    if (this.checkChainTimer) {
      clearTimeout(this.checkChainTimer);
    }

    this.checkChainTimer = setTimeout(function () {
      var config = _this3._gameController.config.json.chainConfig;

      for (var i = 0; i < config.length; i++) {
        if (_this3.chain <= config[i].max && _this3.chain >= config[i].min) {
          //  console.log(config[i].text)
          _this3.showChainSprite(i);

          return;
        }
      }
    }, 200);
  },
  showChainSprite: function showChainSprite(id) {
    this.chainSprite.spriteFrame = this.chainSpriteFrameArr[id];
    this.chainSprite.node.scale = 0.5;
    this.chainSprite.node.active = true;
    this.chainSprite.node.runAction(AC.popOut(0.3));
  },
  hideChainSprite: function hideChainSprite() {
    this.chainSprite.node.active = false;
  },
  checkLevelUp: function checkLevelUp() {
    if (this.level < this.levelData.length && this.score >= this.levelData[this.level - 1].score) {
      this.level++;
      this.level > this.levelData.length + 1 ? this.levelLimit() : this.onLevelUp();
    }

    this.progressBar.init(this.score, this.levelData[this.level - 1], this.level);
  },
  // 增加倍数
  addMult: function addMult(color, pos) {
    //TODO: 动态生成一个图片 移动到multLabel上 有bug
    // if (this.multPropPool.size() > 0) {
    //   let multProp = this.multPropPool.get()
    //   multProp.parent = this.mainScoreLabel.node
    //   multProp.x = pos.x
    //   multProp.y = pos.y
    //   multProp.getComponent(cc.Sprite).spriteFrame = this._game.propSpriteFrame[color - 1]
    //   multProp.runAction(cc.sequence(cc.moveTo(0.2, 187, 0), cc.callFunc(() => {
    //     this.multPropPool.put(multProp)
    //   })))
    // }
    if (this.multiple < this._gameController.config.json.maxMultiple) {
      this.multiple *= 2;
      this.showMultLabel();
    }
  },
  // 关闭倍数的数字显示
  closeMultLabel: function closeMultLabel() {
    this.multiple = 1;
    this.multLabel.node.active = false;
  },
  showMultLabel: function showMultLabel() {
    this.multLabel.node.scale = 0.5;
    this.multLabel.string = this.multiple;
    this.multLabel.node.active = true;
    this.multLabel.node.runAction(AC.popOut(0.3));
  },
  // 增加分数倍数
  initCurrentScoreLabel: function initCurrentScoreLabel() {
    this.mainScoreLabel.node.active = true;
    this.mainScoreLabel.node.x = 0;
    this.mainScoreLabel.node.y = 0;
    this.mainScoreLabel.node.scale = 1;
  },
  // 生成小的分数节点
  onCurrentScoreLabel: function onCurrentScoreLabel(num, pos, callback) {
    // TODO: 增加一个撒花特效
    this.mainScoreLabel.string = num;
    var action = cc.spawn(cc.moveTo(0.2, pos.x, pos.y), cc.scaleTo(0.2, 0.4)).easing(cc.easeBackOut());
    var seq = cc.sequence(action, callback);
    this.mainScoreLabel.node.runAction(seq);
  },
  // 升级
  onLevelUp: function onLevelUp() {
    this._gameController.pageManager.addPage(2);

    this._gameController.pageManager.addPage(3);

    this._gameController.musicManager.onWin();

    this.successDialog.init(this, this.level, this.levelData, this.score); //升级之后的等级

    this.characterMgr.onLevelUp();
    this.characterMgr.onSuccessDialog(this.level);
    this._game._status = 2;

    if (this._gameController.social.node.active) {
      this._gameController.social.openBannerAdv();
    }
  },
  // 等级限制
  levelLimit: function levelLimit() {
    //console.log('等级达到上限')
    this.hideNextLevelData();
  },
  // 点击升级按钮
  onLevelUpButton: function onLevelUpButton(_double) {
    var _this4 = this;

    console.log(_double);

    if (this.isLevelUp) {
      return;
    } else {
      this.isLevelUp = true;
    }

    setTimeout(function () {
      _this4.isLevelUp = false;
    }, 500);

    if (_double && _double.currentTarget) {
      _double = 1;
    } else {
      _double = _double || 1;
    }

    this._gameController.pageManager.onOpenPage(1);

    this.initCurrentScoreLabel();
    this.mainScoreLabel.string = this.levelData[this.level - 2].step * _double;
    this.characterMgr.onLevelUpBtn(this.level);
    this.nameLabel.string = this.levelData[this.level - 1].name;
    setTimeout(function () {
      _this4.onCurrentScoreLabel(_this4.levelData[_this4.level - 2].step * _double, {
        x: -248,
        y: 350
      }, cc.callFunc(function () {
        // this.tipBox.init(this) 每次升级就咏诗
        _this4.onStep(_this4.levelData[_this4.level - 2].step * _double).then();

        _this4._game._status = 1;
        _this4.mainScoreLabel.node.active = false;
      }));
    }, 300);
    this.showNextLevelData();
    this.checkLevelUp();
  },
  // todo: 新增一个 动画 数字上浮和缩放
  showStepAni: function showStepAni(num) {
    this.stepAniLabel.string = '+' + (num + '');
    this.stepAniLabel.node.x = -248;
    this.stepAniLabel.node.y = 400;
    this.stepAniLabel.node.runAction(cc.sequence(cc.toggleVisibility(), cc.moveBy(0.6, 0, 60), cc.toggleVisibility()));
    var action = cc.sequence(cc.scaleTo(0.2, 0.8), AC.popOut(0.8));
    this.leftStepLabel.node.parent.runAction(action);
  },
  // 游戏结束
  // todo 复活
  onGameOver: function onGameOver(isTrue) {
    isTrue = isTrue || 0;

    if (this._game._status != 3 && (isTrue || this.reviveTime >= 3)) {
      this._game.gameOver();

      this.updateFailPage();

      if (this._gameController.social.node.active) {
        // 仅上传分数
        this._gameController.social.onGameOver(this.level, this.score);
      }
    } else if (!isTrue) {
      this._game.askRevive();
    }
  },
  onDoubleStepBtn: function onDoubleStepBtn() {
    if (this._gameController.social.node.active) {
      this._gameController.social.onReviveButton(0);
    } else {
      this.onLevelUpButton(2);
    }
  },
  onDoubleStep: function onDoubleStep() {
    this.onLevelUpButton(2);
  },
  onRevive: function onRevive() {
    this.reviveTime += 1;
    this.onStep(5).then();
  },
  // 展示下一级的信息
  showNextLevelData: function showNextLevelData() {
    var nextLevelData = this.levelData[this.level];
  },
  // 达到最高级之后 隐藏
  hideNextLevelData: function hideNextLevelData() {},
  updateFailPage: function updateFailPage() {
    this.failScore.string = " " + (this.score + '');
    this.characterMgr.onFail(this.level);
    this.failName.string = this.levelData[this.level - 1].name; //this.failHighScore.string = "正在获取您的最高分..."
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzY29yZS5qcyJdLCJuYW1lcyI6WyJBQyIsInJlcXVpcmUiLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInNjb3JlUHJlZmFiIiwiUHJlZmFiIiwic2NvcmVQYXJ0aWNsZVByZWZhYiIsIm1haW5TY29yZUxhYmVsIiwiTGFiZWwiLCJzdWNjZXNzRGlhbG9nIiwiY2hhcmFjdGVyTWdyIiwiZmFpbERpYWxvZyIsIk5vZGUiLCJtdWx0UHJvcFByZWZhYiIsImNoYWluU3ByaXRlRnJhbWVBcnIiLCJTcHJpdGVGcmFtZSIsInN0ZXBBbmlMYWJlbCIsInRpcEJveCIsImluaXQiLCJnIiwiX2dhbWUiLCJfZ2FtZUNvbnRyb2xsZXIiLCJzY29yZSIsImxlZnRTdGVwIiwiY29uZmlnIiwianNvbiIsIm9yaWdpblN0ZXAiLCJjaGFpbiIsImxldmVsIiwicmV2aXZlVGltZSIsImNsb3NlTXVsdExhYmVsIiwibGV2ZWxEYXRhIiwiZ2FtZURhdGEiLCJuYW1lTGFiZWwiLCJzdHJpbmciLCJwcm9ncmVzc0JhciIsImxlZnRTdGVwTGFiZWwiLCJub2RlIiwicnVuQWN0aW9uIiwiaGlkZSIsInNjb3JlVGltZXIiLCJjdXJyZW50QWRkZWRTY29yZSIsImFjdGl2ZSIsInNob3dIZXJvQ2hhcmFjdGVyIiwiaGlkZUNoYWluU3ByaXRlIiwic29jaWFsIiwiaGVpZ2h0IiwiZ2V0SGlnaGVzdExldmVsIiwib25TdGVwIiwiZ2lmdFN0ZXAiLCJzdGFydCIsImdlbmVyYXRlUHJlZmFiUG9vbCIsImJpbmROb2RlIiwic2NvcmVQb29sIiwiTm9kZVBvb2wiLCJpIiwiaW5zdGFudGlhdGUiLCJwdXQiLCJzY29yZVBhcnRpY2xlUG9vbCIsInNjb3JlUGFydGljbGUiLCJtdWx0UHJvcFBvb2wiLCJtdWx0UHJvcCIsImluc3RhbnRpYXRlU2NvcmUiLCJzZWxmIiwibnVtIiwicG9zIiwic2l6ZSIsImdldCIsInBhcmVudCIsInNjb3JlQ29udGFpbmVyIiwiZ2V0Q29tcG9uZW50Iiwic2NvcmVQYXJ0aWNsZVRpbWUiLCJnZXRDaGlsZEJ5TmFtZSIsIm11bHRMYWJlbCIsImNoYWluU3ByaXRlIiwiU3ByaXRlIiwiZmFpbFNjb3JlIiwiZmFpbE5hbWUiLCJmYWlsU3ByaXRlIiwiZmFpbEhpZ2hTY29yZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25HYW1lT3ZlciIsInNob3dTdGVwQW5pIiwiYWRkU2NvcmUiLCJzY29yZUJhc2UiLCJjaGFpblRpbWVyIiwiY2xlYXJUaW1lb3V0IiwiaW5pdEN1cnJlbnRTY29yZUxhYmVsIiwic2V0VGltZW91dCIsIm9uQ3VycmVudFNjb3JlTGFiZWwiLCJ4IiwieSIsImNhbGxGdW5jIiwibXVsdGlwbGUiLCJjaGVja0xldmVsVXAiLCJjaGVja0NoYWluIiwiY2hlY2tDaGFpblRpbWVyIiwiY2hhaW5Db25maWciLCJsZW5ndGgiLCJtYXgiLCJtaW4iLCJzaG93Q2hhaW5TcHJpdGUiLCJpZCIsInNwcml0ZUZyYW1lIiwic2NhbGUiLCJwb3BPdXQiLCJsZXZlbExpbWl0Iiwib25MZXZlbFVwIiwiYWRkTXVsdCIsImNvbG9yIiwibWF4TXVsdGlwbGUiLCJzaG93TXVsdExhYmVsIiwiY2FsbGJhY2siLCJhY3Rpb24iLCJzcGF3biIsIm1vdmVUbyIsInNjYWxlVG8iLCJlYXNpbmciLCJlYXNlQmFja091dCIsInNlcSIsInNlcXVlbmNlIiwicGFnZU1hbmFnZXIiLCJhZGRQYWdlIiwibXVzaWNNYW5hZ2VyIiwib25XaW4iLCJvblN1Y2Nlc3NEaWFsb2ciLCJfc3RhdHVzIiwib3BlbkJhbm5lckFkdiIsImhpZGVOZXh0TGV2ZWxEYXRhIiwib25MZXZlbFVwQnV0dG9uIiwiZG91YmxlIiwiY29uc29sZSIsImxvZyIsImlzTGV2ZWxVcCIsImN1cnJlbnRUYXJnZXQiLCJvbk9wZW5QYWdlIiwic3RlcCIsIm9uTGV2ZWxVcEJ0biIsIm5hbWUiLCJ0aGVuIiwic2hvd05leHRMZXZlbERhdGEiLCJ0b2dnbGVWaXNpYmlsaXR5IiwibW92ZUJ5IiwiaXNUcnVlIiwiZ2FtZU92ZXIiLCJ1cGRhdGVGYWlsUGFnZSIsImFza1Jldml2ZSIsIm9uRG91YmxlU3RlcEJ0biIsIm9uUmV2aXZlQnV0dG9uIiwib25Eb3VibGVTdGVwIiwib25SZXZpdmUiLCJuZXh0TGV2ZWxEYXRhIiwib25GYWlsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBSUEsSUFBSUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsU0FBRCxDQUFoQjs7QUFFQUMsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFFUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLFdBQVcsRUFBRUosRUFBRSxDQUFDSyxNQUROO0FBRVZDLElBQUFBLG1CQUFtQixFQUFFTixFQUFFLENBQUNLLE1BRmQ7QUFHVkUsSUFBQUEsY0FBYyxFQUFFUCxFQUFFLENBQUNRLEtBSFQ7QUFJVkMsSUFBQUEsYUFBYSxFQUFFVixPQUFPLENBQUMsZUFBRCxDQUpaO0FBS1ZXLElBQUFBLFlBQVksRUFBRVgsT0FBTyxDQUFDLFdBQUQsQ0FMWDtBQU1WWSxJQUFBQSxVQUFVLEVBQUVYLEVBQUUsQ0FBQ1ksSUFOTDtBQU9WQyxJQUFBQSxjQUFjLEVBQUViLEVBQUUsQ0FBQ0ssTUFQVDtBQVFWO0FBQ0E7QUFDQVMsSUFBQUEsbUJBQW1CLEVBQUUsQ0FBQ2QsRUFBRSxDQUFDZSxXQUFKLENBVlg7QUFXVkMsSUFBQUEsWUFBWSxFQUFFaEIsRUFBRSxDQUFDUSxLQVhQO0FBYVY7QUFDQVMsSUFBQUEsTUFBTSxFQUFFbEIsT0FBTyxDQUFDLFFBQUQ7QUFkTCxHQUZMO0FBa0JQbUIsRUFBQUEsSUFsQk8sZ0JBa0JGQyxDQWxCRSxFQWtCQztBQUNOLFNBQUtDLEtBQUwsR0FBYUQsQ0FBYjtBQUNBLFNBQUtFLGVBQUwsR0FBdUJGLENBQUMsQ0FBQ0UsZUFBekI7QUFDQSxTQUFLQyxLQUFMLEdBQWEsQ0FBYjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0Is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TCxDQUFXZ0ksU0FBWDtBQUNEO0FBQ0YsR0EvU007QUFnVFBDLEVBQUFBLGVBaFRPLDZCQWdUVztBQUNoQixRQUFJLEtBQUtoSSxlQUFMLENBQXFCd0IsTUFBckIsQ0FBNEJSLElBQTVCLENBQWlDSyxNQUFyQyxFQUE2QztBQUMzQyxXQUFLckIsZUFBTCxDQUFxQndCLE1BQXJCLENBQTRCeUcsY0FBNUIsQ0FBMkMsQ0FBM0M7QUFDRCxLQUZELE1BRU87QUFDTCxXQUFLbkIsZUFBTCxDQUFxQixDQUFyQjtBQUNEO0FBQ0YsR0F0VE07QUF1VFBvQixFQUFBQSxZQXZUTywwQkF1VFE7QUFDYixTQUFLcEIsZUFBTCxDQUFxQixDQUFyQjtBQUNELEdBelRNO0FBMFRQcUIsRUFBQUEsUUExVE8sc0JBMFRJO0FBQ1QsU0FBSzNILFVBQUwsSUFBbUIsQ0FBbkI7QUFDQSxTQUFLbUIsTUFBTCxDQUFZLENBQVosRUFBZTZGLElBQWY7QUFDRCxHQTdUTTtBQThUUDtBQUNBQyxFQUFBQSxpQkEvVE8sK0JBK1RhO0FBQ2xCLFFBQUlXLGFBQWEsR0FBRyxLQUFLMUgsU0FBTCxDQUFlLEtBQUtILEtBQXBCLENBQXBCO0FBQ0QsR0FqVU07QUFrVVA7QUFDQXNHLEVBQUFBLGlCQW5VTywrQkFtVWEsQ0FFbkIsQ0FyVU07QUFzVVBpQixFQUFBQSxjQXRVTyw0QkFzVVU7QUFDZixTQUFLdkUsU0FBTCxDQUFlMUMsTUFBZixHQUF3QixPQUFPLEtBQUtaLEtBQUwsR0FBYSxFQUFwQixDQUF4QjtBQUNBLFNBQUtaLFlBQUwsQ0FBa0JnSixNQUFsQixDQUF5QixLQUFLOUgsS0FBOUI7QUFDQSxTQUFLaUQsUUFBTCxDQUFjM0MsTUFBZCxHQUF1QixLQUFLSCxTQUFMLENBQWUsS0FBS0gsS0FBTCxHQUFhLENBQTVCLEVBQStCZ0gsSUFBdEQsQ0FIZSxDQUlmO0FBQ0Q7QUEzVU0sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAYXV0aG9yIGhleXVjaGFuZ1xuICogQGZpbGUgIFVJIOWIhuaVsOaOp+WItuWZqFxuICovXG52YXIgQUMgPSByZXF1aXJlKCdHYW1lQWN0JylcblxuY2MuQ2xhc3Moe1xuICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBzY29yZVByZWZhYjogY2MuUHJlZmFiLFxuICAgIHNjb3JlUGFydGljbGVQcmVmYWI6IGNjLlByZWZhYixcbiAgICBtYWluU2NvcmVMYWJlbDogY2MuTGFiZWwsXG4gICAgc3VjY2Vzc0RpYWxvZzogcmVxdWlyZSgnc3VjY2Vzc0RpYWxvZycpLFxuICAgIGNoYXJhY3Rlck1ncjogcmVxdWlyZSgnY2hhcmFjdGVyJyksXG4gICAgZmFpbERpYWxvZzogY2MuTm9kZSxcbiAgICBtdWx0UHJvcFByZWZhYjogY2MuUHJlZmFiLFxuICAgIC8vIHByb2dyZXNzQmFyOiByZXF1aXJlKCdwcm9ncmVzcycpLFxuICAgIC8vIGxlZnRTdGVwTGFiZWw6IGNjLkxhYmVsLFxuICAgIGNoYWluU3ByaXRlRnJhbWVBcnI6IFtjYy5TcHJpdGVGcmFtZV0sXG4gICAgc3RlcEFuaUxhYmVsOiBjYy5MYWJlbCxcblxuICAgIC8v5o+Q56S65bCP5qGGXG4gICAgdGlwQm94OiByZXF1aXJlKCd0aXBCb3gnKVxuICB9LFxuICBpbml0KGcpIHtcbiAgICB0aGlzLl9nYW1lID0gZ1xuICAgIHRoaXMuX2dhbWVDb250cm9sbGVyID0gZy5fZ2FtZUNvbnRyb2xsZXJcbiAgICB0aGlzLnNjb3JlID0gMFxuICAgIHRoaXMubGVmdFN0ZXAgPSB0aGlzLl9nYW1lQ29udHJvbGxlci5jb25maWcuanNvbi5vcmlnaW5TdGVwXG4gICAgdGhpcy5jaGFpbiA9IDFcbiAgICB0aGlzLmxldmVsID0gMVxuICAgIHRoaXMucmV2aXZlVGltZSA9IDBcbiAgICB0aGlzLmNsb3NlTXVsdExhYmVsKClcbiAgICB0aGlzLmxldmVsRGF0YSA9IGcuX2dhbWVDb250cm9sbGVyLmdhbWVEYXRhLmpzb24ubGV2ZWxEYXRhXG4gICAgdGhpcy5uYW1lTGFiZWwuc3RyaW5nID0gXCLokIzlv4PmgqZcIlxuICAgIHRoaXMucHJvZ3Jlc3NCYXIuaW5pdCgwLCB0aGlzLmxldmVsRGF0YVt0aGlzLmxldmVsIC0gMV0sIHRoaXMubGV2ZWwpXG4gICAgdGhpcy5sZWZ0U3RlcExhYmVsLnN0cmluZyA9IHRoaXMubGVmdFN0ZXBcbiAgICB0aGlzLnN0ZXBBbmlMYWJlbC5ub2RlLnJ1bkFjdGlvbihjYy5oaWRlKCkpXG4gICAgdGhpcy5zY29yZVRpbWVyID0gW11cbiAgICB0aGlzLmN1cnJlbnRBZGRlZFNjb3JlID0gMFxuICAgIHRoaXMubWFpblNjb3JlTGFiZWwubm9kZS5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMuY2hhcmFjdGVyTWdyLnNob3dIZXJvQ2hhcmFjdGVyKHRoaXMubGV2ZWwpXG4gICAgdGhpcy5oaWRlQ2hhaW5TcHJpdGUoKVxuXG4gICAgdGhpcy50aXBCb3guaW5pdCh0aGlzLCAwKVxuICAgIGlmICh0aGlzLl9nYW1lQ29udHJvbGxlci5zb2NpYWwubm9kZS5hY3RpdmUpIHtcbiAgICAgIGxldCBoZWlnaHQgPSB0aGlzLl9nYW1lQ29udHJvbGxlci5zb2NpYWwuZ2V0SGlnaGVzdExldmVsKClcbiAgICAgIGlmIChoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5vblN0ZXAodGhpcy5sZXZlbERhdGFbK2hlaWdodCAtIDFdLmdpZnRTdGVwKVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5nZW5lcmF0ZVByZWZhYlBvb2woKVxuICAgIHRoaXMuYmluZE5vZGUoKVxuICB9LFxuICBnZW5lcmF0ZVByZWZhYlBvb2woKSB7XG4gICAgdGhpcy5zY29yZVBvb2wgPSBuZXcgY2MuTm9kZVBvb2woKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjA7IGkrKykge1xuICAgICAgbGV0IHNjb3JlID0gY2MuaW5zdGFudGlhdGUodGhpcy5zY29yZVByZWZhYilcbiAgICAgIHRoaXMuc2NvcmVQb29sLnB1dChzY29yZSlcbiAgICB9XG4gICAgdGhpcy5zY29yZVBhcnRpY2xlUG9vbCA9IG5ldyBjYy5Ob2RlUG9vbCgpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDsgaSsrKSB7XG4gICAgICBsZXQgc2NvcmVQYXJ0aWNsZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc2NvcmVQYXJ0aWNsZVByZWZhYilcbiAgICAgIHRoaXMuc2NvcmVQYXJ0aWNsZVBvb2wucHV0KHNjb3JlUGFydGljbGUpXG4gICAgfVxuICAgIHRoaXMubXVsdFByb3BQb29sID0gbmV3IGNjLk5vZGVQb29sKClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgbGV0IG11bHRQcm9wID0gY2MuaW5zdGFudGlhdGUodGhpcy5tdWx0UHJvcFByZWZhYilcbiAgICAgIHRoaXMubXVsdFByb3BQb29sLnB1dChtdWx0UHJvcClcbiAgICB9XG4gIH0sXG4gIC8vIOWunuS+i+WMluWNleS4quaWueWdl1xuICBpbnN0YW50aWF0ZVNjb3JlKHNlbGYsIG51bSwgcG9zKSB7XG4gICAgbGV0IHNjb3JlID0gbnVsbFxuICAgIGlmIChzZWxmLnNjb3JlUG9vbCAmJiBzZWxmLnNjb3JlUG9vbC5zaXplKCkgPiAwKSB7XG4gICAgICBzY29yZSA9IHNlbGYuc2NvcmVQb29sLmdldCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHNjb3JlID0gY2MuaW5zdGFudGlhdGUoc2VsZi5zY29yZVByZWZhYilcbiAgICB9XG4gICAgc2NvcmUucGFyZW50ID0gdGhpcy5zY29yZUNvbnRhaW5lclxuICAgIHNjb3JlLmdldENvbXBvbmVudCgnc2NvcmVDZWxsJykuaW5pdChzZWxmLCBudW0sIHBvcylcblxuICAgIGxldCBzY29yZVBhcnRpY2xlID0gbnVsbFxuICAgIGlmIChzZWxmLnNjb3JlUGFydGljbGVQb29sICYmIHNlbGYuc2NvcmVQYXJ0aWNsZVBvb2wuc2l6ZSgpID4gMCkge1xuICAgICAgc2NvcmVQYXJ0aWNsZSA9IHNlbGYuc2NvcmVQYXJ0aWNsZVBvb2wuZ2V0KClcbiAgICB9IGVsc2Uge1xuICAgICAgc2NvcmVQYXJ0aWNsZSA9IGNjLmluc3RhbnRpYXRlKHNlbGYuc2NvcmVQYXJ0aWNsZVByZWZhYilcbiAgICB9XG4gICAgc2NvcmVQYXJ0aWNsZS5wYXJlbnQgPSB0aGlzLnNjb3JlQ29udGFpbmVyXG4gICAgc2NvcmVQYXJ0aWNsZS5nZXRDb21wb25lbnQoJ3Njb3JlUGFydGljbGUnKS5pbml0KHNlbGYsIHBvcywgdGhpcy5fZ2FtZUNvbnRyb2xsZXIuY29uZmlnLmpzb24uc2NvcmVQYXJ0aWNsZVRpbWUpXG4gIH0sXG4gIGJpbmROb2RlKCkge1xuICAgIHRoaXMubGVmdFN0ZXBMYWJlbCA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnVUknKS5nZXRDaGlsZEJ5TmFtZSgnbGVmdFN0ZXBOb2RlJykuZ2V0Q2hpbGRCeU5hbWUoJ0xhYmVsJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKVxuICAgIHRoaXMucHJvZ3Jlc3NCYXIgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ1VJJykuZ2V0Q2hpbGRCeU5hbWUoJ3Njb3JlTm9kZScpLmdldENoaWxkQnlOYW1lKCdwcm9ncmVzc0JhcicpLmdldENvbXBvbmVudCgncHJvZ3Jlc3MnKVxuICAgIHRoaXMuc2NvcmVDb250YWluZXIgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ1VJJykuZ2V0Q2hpbGRCeU5hbWUoJ3Njb3JlR3JvdXAnKVxuICAgIHRoaXMubXVsdExhYmVsID0gdGhpcy5tYWluU2NvcmVMYWJlbC5ub2RlLmdldENoaWxkQnlOYW1lKCdtdWx0JykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKVxuICAgIHRoaXMubmFtZUxhYmVsID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdVSScpLmdldENoaWxkQnlOYW1lKCdzY29yZU5vZGUnKS5nZXRDaGlsZEJ5TmFtZSgncHJvZ3Jlc3NCYXInKS5nZXRDaGlsZEJ5TmFtZSgnbmFtZScpLmdldENvbXBvbmVudChjYy5MYWJlbClcbiAgICAvLyDlpLHotKXml7bmm7TmlrDlpLHotKVVSVxuICAgIHRoaXMuY2hhaW5TcHJpdGUgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ1VJJykuZ2V0Q2hpbGRCeU5hbWUoJ2NoYWluU3ByaXRlJykuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSlcbiAgICB0aGlzLmZhaWxTY29yZSA9IHRoaXMuZmFpbERpYWxvZy5nZXRDaGlsZEJ5TmFtZSgnaW5mbycpLmdldENoaWxkQnlOYW1lKCdzY29yZScpLmdldENvbXBvbmVudChjYy5MYWJlbClcbiAgICB0aGlzLmZhaWxOYW1lID0gdGhpcy5mYWlsRGlhbG9nLmdldENoaWxkQnlOYW1lKCdpbmZvJykuZ2V0Q2hpbGRCeU5hbWUoJ2xldmVsJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKVxuICAgIHRoaXMuZmFpbFNwcml0ZSA9IHRoaXMuZmFpbERpYWxvZy5nZXRDaGlsZEJ5TmFtZSgnaW5mbycpLmdldENoaWxkQnlOYW1lKCdzcHJpdGUnKS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKVxuICAgIHRoaXMuZmFpbEhpZ2hTY29yZSA9IHRoaXMuZmFpbERpYWxvZy5nZXRDaGlsZEJ5TmFtZSgnaW5mbycpLmdldENoaWxkQnlOYW1lKCdoaWdoU2NvcmUnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpXG4gIH0sXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tIOWIhuaVsOaOp+WItiAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8g5aKe5YqgIOWHj+WwkeatpeaVsOW5tuS4lOWIt+aWsFVJXG4gIG9uU3RlcChudW0pIHtcbiAgICB0aGlzLmxlZnRTdGVwICs9IG51bVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAodGhpcy5sZWZ0U3RlcCA8IDApIHtcbiAgICAgICAgdGhpcy5sZWZ0U3RlcCA9IDBcbiAgICAgICAgdGhpcy5vbkdhbWVPdmVyKClcbiAgICAgICAgcmVzb2x2ZShmYWxzZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUodHJ1ZSlcbiAgICAgIH1cbiAgICAgIHRoaXMubGVmdFN0ZXBMYWJlbC5zdHJpbmcgPSB0aGlzLmxlZnRTdGVwXG4gICAgICBpZiAobnVtID4gMCkge1xuICAgICAgICB0aGlzLnNob3dTdGVwQW5pKG51bSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuXG4gIC8v5aKe5Yqg5YiG5pWw5oC75o6n5Yi2IOiOt+WPlui/nuWHu1xuICBhZGRTY29yZShwb3MsIHNjb3JlKSB7XG4gICAgc2NvcmUgPSBzY29yZSB8fCB0aGlzLl9nYW1lQ29udHJvbGxlci5jb25maWcuanNvbi5zY29yZUJhc2VcbiAgICAvLyDkuIDmrKHmtojpmaTlj6/ku6Xlj6BjaGFpblxuICAgIGlmICh0aGlzLmNoYWluVGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmNoYWluVGltZXIpXG4gICAgfVxuICAgIHRoaXMuaW5pdEN1cnJlbnRTY29yZUxhYmVsKClcbiAgICB0aGlzLmNoYWluVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5vbkN1cnJlbnRTY29yZUxhYmVsKHRoaXMuY3VycmVudEFkZGVkU2NvcmUsIHtcbiAgICAgICAgICB4OiAtNjAsXG4gICAgICAgICAgeTogMzU1XG4gICAgICAgIH0sIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnNjb3JlICs9IHRoaXMuY3VycmVudEFkZGVkU2NvcmUgKiB0aGlzLm11bHRpcGxlXG4gICAgICAgICAgdGhpcy5jaGVja0xldmVsVXAoKVxuICAgICAgICAgIHRoaXMuY2hhaW4gPSAxXG4gICAgICAgICAgdGhpcy5jbG9zZU11bHRMYWJlbCgpXG4gICAgICAgICAgdGhpcy5oaWRlQ2hhaW5TcHJpdGUoKVxuICAgICAgICAgIHRoaXMuY3VycmVudEFkZGVkU2NvcmUgPSAwXG4gICAgICAgICAgdGhpcy5tYWluU2NvcmVMYWJlbC5ub2RlLmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgIH0sIHRoaXMpKVxuICAgICAgfSwgNTAwIC8gMVxuICAgICAgLy8gKGNjLmdhbWUuZ2V0RnJhbWVSYXRlKCkgLyA2MClcbiAgICApXG4gICAgbGV0IGFkZFNjb3JlID0gc2NvcmUgPT0gdGhpcy5fZ2FtZUNvbnRyb2xsZXIuY29uZmlnLmpzb24uc2NvcmVCYXNlID8gKHNjb3JlICsgKHRoaXMuY2hhaW4gPiAxNiA/IDE2IDogKHRoaXMuY2hhaW4gLSAxKSkgKiAxMCkgOiBzY29yZVxuICAgIC8vIGxldCBhZGRTY29yZSA9IHNjb3JlID09IDEwID8gc2NvcmUgKiAodGhpcy5jaGFpbiA+IDEwID8gMTAgOiB0aGlzLmNoYWluKSA6IHNjb3JlXG4gICAgdGhpcy5jdXJyZW50QWRkZWRTY29yZSArPSBhZGRTY29yZVxuICAgIHRoaXMubWFpblNjb3JlTGFiZWwuc3RyaW5nID0gdGhpcy5jdXJyZW50QWRkZWRTY29yZVxuICAgIHRoaXMuaW5zdGFudGlhdGVTY29yZSh0aGlzLCBhZGRTY29yZSwgcG9zKVxuICAgIHRoaXMuY2hhaW4rK1xuICAgIHRoaXMuY2hlY2tDaGFpbigpXG4gIH0sXG4gIC8vIOWIpOaWrei/nuWHu1xuICBjaGVja0NoYWluKCkge1xuICAgIGlmICh0aGlzLmNoZWNrQ2hhaW5UaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuY2hlY2tDaGFpblRpbWVyKVxuICAgIH1cbiAgICB0aGlzLmNoZWNrQ2hhaW5UaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgbGV0IGNvbmZpZyA9IHRoaXMuX2dhbWVDb250cm9sbGVyLmNvbmZpZy5qc29uLmNoYWluQ29uZmlnXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbmZpZy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5jaGFpbiA8PSBjb25maWdbaV0ubWF4ICYmIHRoaXMuY2hhaW4gPj0gY29uZmlnW2ldLm1pbikge1xuICAgICAgICAgIC8vICBjb25zb2xlLmxvZyhjb25maWdbaV0udGV4dClcbiAgICAgICAgICB0aGlzLnNob3dDaGFpblNwcml0ZShpKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgMjAwKVxuICB9LFxuICBzaG93Q2hhaW5TcHJpdGUoaWQpIHtcbiAgICB0aGlzLmNoYWluU3ByaXRlLnNwcml0ZUZyYW1lID0gdGhpcy5jaGFpblNwcml0ZUZyYW1lQXJyW2lkXVxuICAgIHRoaXMuY2hhaW5TcHJpdGUubm9kZS5zY2FsZSA9IDAuNVxuICAgIHRoaXMuY2hhaW5TcHJpdGUubm9kZS5hY3RpdmUgPSB0cnVlXG4gICAgdGhpcy5jaGFpblNwcml0ZS5ub2RlLnJ1bkFjdGlvbihBQy5wb3BPdXQoMC4zKSlcbiAgfSxcbiAgaGlkZUNoYWluU3ByaXRlKCkge1xuICAgIHRoaXMuY2hhaW5TcHJpdGUubm9kZS5hY3RpdmUgPSBmYWxzZVxuICB9LFxuICBjaGVja0xldmVsVXAoKSB7XG4gICAgaWYgKHRoaXMubGV2ZWwgPCB0aGlzLmxldmVsRGF0YS5sZW5ndGggJiYgdGhpcy5zY29yZSA+PSB0aGlzLmxldmVsRGF0YVt0aGlzLmxldmVsIC0gMV0uc2NvcmUpIHtcbiAgICAgIHRoaXMubGV2ZWwrK1xuICAgICAgdGhpcy5sZXZlbCA+ICh0aGlzLmxldmVsRGF0YS5sZW5ndGggKyAxKSA/IHRoaXMubGV2ZWxMaW1pdCgpIDogdGhpcy5vbkxldmVsVXAoKVxuICAgIH1cbiAgICB0aGlzLnByb2dyZXNzQmFyLmluaXQodGhpcy5zY29yZSwgdGhpcy5sZXZlbERhdGFbdGhpcy5sZXZlbCAtIDFdLCB0aGlzLmxldmVsKVxuICB9LFxuICAvLyDlop7liqDlgI3mlbBcbiAgYWRkTXVsdChjb2xvciwgcG9zKSB7XG4gICAgLy9UT0RPOiDliqjmgIHnlJ/miJDkuIDkuKrlm77niYcg56e75Yqo5YiwbXVsdExhYmVs5LiKIOaciWJ1Z1xuICAgIC8vIGlmICh0aGlzLm11bHRQcm9wUG9vbC5zaXplKCkgPiAwKSB7XG4gICAgLy8gICBsZXQgbXVsdFByb3AgPSB0aGlzLm11bHRQcm9wUG9vbC5nZXQoKVxuICAgIC8vICAgbXVsdFByb3AucGFyZW50ID0gdGhpcy5tYWluU2NvcmVMYWJlbC5ub2RlXG4gICAgLy8gICBtdWx0UHJvcC54ID0gcG9zLnhcbiAgICAvLyAgIG11bHRQcm9wLnkgPSBwb3MueVxuICAgIC8vICAgbXVsdFByb3AuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuc3ByaXRlRnJhbWUgPSB0aGlzLl9nYW1lLnByb3BTcHJpdGVGcmFtZVtjb2xvciAtIDFdXG4gICAgLy8gICBtdWx0UHJvcC5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2MubW92ZVRvKDAuMiwgMTg3LCAwKSwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgIC8vICAgICB0aGlzLm11bHRQcm9wUG9vbC5wdXQobXVsdFByb3ApXG4gICAgLy8gICB9KSkpXG4gICAgLy8gfVxuICAgIGlmICh0aGlzLm11bHRpcGxlIDwgdGhpcy5fZ2FtZUNvbnRyb2xsZXIuY29uZmlnLmpzb24ubWF4TXVsdGlwbGUpIHtcbiAgICAgIHRoaXMubXVsdGlwbGUgKj0gMlxuICAgICAgdGhpcy5zaG93TXVsdExhYmVsKClcbiAgICB9XG4gIH0sXG4gIC8vIOWFs+mXreWAjeaVsOeahOaVsOWtl+aYvuekulxuICBjbG9zZU11bHRMYWJlbCgpIHtcbiAgICB0aGlzLm11bHRpcGxlID0gMVxuICAgIHRoaXMubXVsdExhYmVsLm5vZGUuYWN0aXZlID0gZmFsc2VcbiAgfSxcbiAgc2hvd011bHRMYWJlbCgpIHtcbiAgICB0aGlzLm11bHRMYWJlbC5ub2RlLnNjYWxlID0gMC41XG4gICAgdGhpcy5tdWx0TGFiZWwuc3RyaW5nID0gdGhpcy5tdWx0aXBsZVxuICAgIHRoaXMubXVsdExhYmVsLm5vZGUuYWN0aXZlID0gdHJ1ZVxuICAgIHRoaXMubXVsdExhYmVsLm5vZGUucnVuQWN0aW9uKEFDLnBvcE91dCgwLjMpKVxuICB9LFxuICAvLyDlop7liqDliIbmlbDlgI3mlbBcbiAgaW5pdEN1cnJlbnRTY29yZUxhYmVsKCkge1xuICAgIHRoaXMubWFpblNjb3JlTGFiZWwubm9kZS5hY3RpdmUgPSB0cnVlXG4gICAgdGhpcy5tYWluU2NvcmVMYWJlbC5ub2RlLnggPSAwXG4gICAgdGhpcy5tYWluU2NvcmVMYWJlbC5ub2RlLnkgPSAwXG4gICAgdGhpcy5tYWluU2NvcmVMYWJlbC5ub2RlLnNjYWxlID0gMVxuICB9LFxuICAvLyDnlJ/miJDlsI/nmoTliIbmlbDoioLngrlcbiAgb25DdXJyZW50U2NvcmVMYWJlbChudW0sIHBvcywgY2FsbGJhY2spIHtcbiAgICAvLyBUT0RPOiDlop7liqDkuIDkuKrmkpLoirHnibnmlYhcbiAgICB0aGlzLm1haW5TY29yZUxhYmVsLnN0cmluZyA9IG51bVxuICAgIGxldCBhY3Rpb24gPSBjYy5zcGF3bihjYy5tb3ZlVG8oMC4yLCBwb3MueCwgcG9zLnkpLCBjYy5zY2FsZVRvKDAuMiwgMC40KSkuZWFzaW5nKGNjLmVhc2VCYWNrT3V0KCkpXG4gICAgbGV0IHNlcSA9IGNjLnNlcXVlbmNlKGFjdGlvbiwgY2FsbGJhY2spXG4gICAgdGhpcy5tYWluU2NvcmVMYWJlbC5ub2RlLnJ1bkFjdGlvbihzZXEpXG4gIH0sXG4gIC8vIOWNh+e6p1xuICBvbkxldmVsVXAoKSB7XG4gICAgdGhpcy5fZ2FtZUNvbnRyb2xsZXIucGFnZU1hbmFnZXIuYWRkUGFnZSgyKVxuICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLnBhZ2VNYW5hZ2VyLmFkZFBhZ2UoMylcbiAgICB0aGlzLl9nYW1lQ29udHJvbGxlci5tdXNpY01hbmFnZXIub25XaW4oKVxuICAgIHRoaXMuc3VjY2Vzc0RpYWxvZy5pbml0KHRoaXMsIHRoaXMubGV2ZWwsIHRoaXMubGV2ZWxEYXRhLCB0aGlzLnNjb3JlKSAvL+WNh+e6p+S5i+WQjueahOetiee6p1xuICAgIHRoaXMuY2hhcmFjdGVyTWdyLm9uTGV2ZWxVcCgpXG4gICAgdGhpcy5jaGFyYWN0ZXJNZ3Iub25TdWNjZXNzRGlhbG9nKHRoaXMubGV2ZWwpXG4gICAgdGhpcy5fZ2FtZS5fc3RhdHVzID0gMlxuICAgIGlmICh0aGlzLl9nYW1lQ29udHJvbGxlci5zb2NpYWwubm9kZS5hY3RpdmUpIHtcbiAgICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLnNvY2lhbC5vcGVuQmFubmVyQWR2KClcbiAgICB9XG4gIH0sXG4gIC8vIOetiee6p+mZkOWItlxuICBsZXZlbExpbWl0KCkge1xuICAgIC8vY29uc29sZS5sb2coJ+etiee6p+i+vuWIsOS4iumZkCcpXG4gICAgdGhpcy5oaWRlTmV4dExldmVsRGF0YSgpXG4gIH0sXG4gIC8vIOeCueWHu+WNh+e6p+aMiemSrlxuICBvbkxldmVsVXBCdXR0b24oZG91YmxlKSB7XG4gICAgY29uc29sZS5sb2coZG91YmxlKVxuICAgIGlmICh0aGlzLmlzTGV2ZWxVcCkge1xuICAgICAgcmV0dXJuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaXNMZXZlbFVwID0gdHJ1ZVxuICAgIH1cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuaXNMZXZlbFVwID0gZmFsc2VcbiAgICB9LCA1MDApXG4gICAgaWYgKGRvdWJsZSAmJiBkb3VibGUuY3VycmVudFRhcmdldCkge1xuICAgICAgZG91YmxlID0gMVxuICAgIH0gZWxzZSB7XG4gICAgICBkb3VibGUgPSBkb3VibGUgfHwgMVxuICAgIH1cbiAgICB0aGlzLl9nYW1lQ29udHJvbGxlci5wYWdlTWFuYWdlci5vbk9wZW5QYWdlKDEpXG4gICAgdGhpcy5pbml0Q3VycmVudFNjb3JlTGFiZWwoKVxuICAgIHRoaXMubWFpblNjb3JlTGFiZWwuc3RyaW5nID0gdGhpcy5sZXZlbERhdGFbdGhpcy5sZXZlbCAtIDJdLnN0ZXAgKiBkb3VibGVcbiAgICB0aGlzLmNoYXJhY3Rlck1nci5vbkxldmVsVXBCdG4odGhpcy5sZXZlbClcbiAgICB0aGlzLm5hbWVMYWJlbC5zdHJpbmcgPSB0aGlzLmxldmVsRGF0YVt0aGlzLmxldmVsIC0gMV0ubmFtZVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5vbkN1cnJlbnRTY29yZUxhYmVsKHRoaXMubGV2ZWxEYXRhW3RoaXMubGV2ZWwgLSAyXS5zdGVwICogZG91YmxlLCB7XG4gICAgICAgIHg6IC0yNDgsXG4gICAgICAgIHk6IDM1MFxuICAgICAgfSwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgICAvLyB0aGlzLnRpcEJveC5pbml0KHRoaXMpIOavj+asoeWNh+e6p+WwseWSj+ivl1xuICAgICAgICB0aGlzLm9uU3RlcCh0aGlzLmxldmVsRGF0YVt0aGlzLmxldmVsIC0gMl0uc3RlcCAqIGRvdWJsZSkudGhlbigpXG4gICAgICAgIHRoaXMuX2dhbWUuX3N0YXR1cyA9IDFcbiAgICAgICAgdGhpcy5tYWluU2NvcmVMYWJlbC5ub2RlLmFjdGl2ZSA9IGZhbHNlXG4gICAgICB9KSlcbiAgICB9LCAzMDApO1xuICAgIHRoaXMuc2hvd05leHRMZXZlbERhdGEoKVxuICAgIHRoaXMuY2hlY2tMZXZlbFVwKClcbiAgfSxcbiAgLy8gdG9kbzog5paw5aKe5LiA5LiqIOWKqOeUuyDmlbDlrZfkuIrmta7lkoznvKnmlL5cbiAgc2hvd1N0ZXBBbmkobnVtKSB7XG4gICAgdGhpcy5zdGVwQW5pTGFiZWwuc3RyaW5nID0gJysnICsgKG51bSArICcnKVxuICAgIHRoaXMuc3RlcEFuaUxhYmVsLm5vZGUueCA9IC0yNDhcbiAgICB0aGlzLnN0ZXBBbmlMYWJlbC5ub2RlLnkgPSA0MDBcbiAgICB0aGlzLnN0ZXBBbmlMYWJlbC5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy50b2dnbGVWaXNpYmlsaXR5KCksIGNjLm1vdmVCeSgwLjYsIDAsIDYwKSwgY2MudG9nZ2xlVmlzaWJpbGl0eSgpKSlcbiAgICBsZXQgYWN0aW9uID0gY2Muc2VxdWVuY2UoY2Muc2NhbGVUbygwLjIsIDAuOCksIEFDLnBvcE91dCgwLjgpKVxuICAgIHRoaXMubGVmdFN0ZXBMYWJlbC5ub2RlLnBhcmVudC5ydW5BY3Rpb24oYWN0aW9uKVxuICB9LFxuICAvLyDmuLjmiI/nu5PmnZ9cbiAgLy8gdG9kbyDlpI3mtLtcbiAgb25HYW1lT3Zlcihpc1RydWUpIHtcbiAgICBpc1RydWUgPSBpc1RydWUgfHwgMFxuICAgIGlmICh0aGlzLl9nYW1lLl9zdGF0dXMgIT0gMyAmJiAoaXNUcnVlIHx8IHRoaXMucmV2aXZlVGltZSA+PSAzKSkge1xuICAgICAgdGhpcy5fZ2FtZS5nYW1lT3ZlcigpXG4gICAgICB0aGlzLnVwZGF0ZUZhaWxQYWdlKClcbiAgICAgIGlmICh0aGlzLl9nYW1lQ29udHJvbGxlci5zb2NpYWwubm9kZS5hY3RpdmUpIHtcbiAgICAgICAgLy8g5LuF5LiK5Lyg5YiG5pWwXG4gICAgICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLnNvY2lhbC5vbkdhbWVPdmVyKHRoaXMubGV2ZWwsIHRoaXMuc2NvcmUpXG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghaXNUcnVlKSB7XG4gICAgICB0aGlzLl9nYW1lLmFza1Jldml2ZSgpXG4gICAgfVxuICB9LFxuICBvbkRvdWJsZVN0ZXBCdG4oKSB7XG4gICAgaWYgKHRoaXMuX2dhbWVDb250cm9sbGVyLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5fZ2FtZUNvbnRyb2xsZXIuc29jaWFsLm9uUmV2aXZlQnV0dG9uKDApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25MZXZlbFVwQnV0dG9uKDIpXG4gICAgfVxuICB9LFxuICBvbkRvdWJsZVN0ZXAoKSB7XG4gICAgdGhpcy5vbkxldmVsVXBCdXR0b24oMilcbiAgfSxcbiAgb25SZXZpdmUoKSB7XG4gICAgdGhpcy5yZXZpdmVUaW1lICs9IDFcbiAgICB0aGlzLm9uU3RlcCg1KS50aGVuKClcbiAgfSxcbiAgLy8g5bGV56S65LiL5LiA57qn55qE5L+h5oGvXG4gIHNob3dOZXh0TGV2ZWxEYXRhKCkge1xuICAgIGxldCBuZXh0TGV2ZWxEYXRhID0gdGhpcy5sZXZlbERhdGFbdGhpcy5sZXZlbF1cbiAgfSxcbiAgLy8g6L6+5Yiw5pyA6auY57qn5LmL5ZCOIOmakOiXj1xuICBoaWRlTmV4dExldmVsRGF0YSgpIHtcblxuICB9LFxuICB1cGRhdGVGYWlsUGFnZSgpIHtcbiAgICB0aGlzLmZhaWxTY29yZS5zdHJpbmcgPSBcIiBcIiArICh0aGlzLnNjb3JlICsgJycpXG4gICAgdGhpcy5jaGFyYWN0ZXJNZ3Iub25GYWlsKHRoaXMubGV2ZWwpXG4gICAgdGhpcy5mYWlsTmFtZS5zdHJpbmcgPSB0aGlzLmxldmVsRGF0YVt0aGlzLmxldmVsIC0gMV0ubmFtZVxuICAgIC8vdGhpcy5mYWlsSGlnaFNjb3JlLnN0cmluZyA9IFwi5q2j5Zyo6I635Y+W5oKo55qE5pyA6auY5YiGLi4uXCJcbiAgfSxcblxufSk7Il19
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/musicManager.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '0fd3emgDv1Pc6rR7NiVJ4q/', 'musicManager');
// Script/musicManager.js

"use strict";

/**
 * @author heyuchang
 * @file  音乐控制组件
 */
cc.Class({
  "extends": cc.Component,
  properties: {
    volume: 1,
    audios: [cc.AudioSource],
    audioPrefab: cc.Prefab,
    bgMusic: cc.AudioSource,
    winAudio: cc.AudioSource,
    doubleAudio: cc.AudioSource,
    boomAudio: cc.AudioSource,
    magicAudio: cc.AudioSource //audioSource: cc.AudioSource,

  },
  init: function init() {
    this.audio = [];
    this.instanceAudio();
    this.createMusicPool();
  },
  createMusicPool: function createMusicPool() {// this.musicPool = new cc.NodePool()
    // for (let i = 0; i < 20; i++) {
    //   let music = cc.instantiate(this.audioPrefab)
    //   this.musicPool.put(music)
    // }
  },
  instanceAudio: function instanceAudio() {},
  changeVol: function changeVol(vol) {
    var _this = this;

    this.volume = vol;
    this.audios.forEach(function (item, index) {
      // item.volume = vol
      _this.audios[index].volume = vol;
    });
  },
  onPlayAudio: function onPlayAudio(num) {
    var self = this;

    if (!this.audios[num] || this.audios[num].isPlaying) {
      if (this.audios[num + 1]) {
        self.onPlayAudio(num + 1);
      } else {
        //console.log('创建新的音乐实例')
        var music = null;

        if (self.musicPool && self.musicPool.size() > 0) {
          music = self.musicPool.get();
        } else {
          music = cc.instantiate(self.audioPrefab);
        }

        music.parent = self.node;
        this.audios[num + 1] = music.getComponent(cc.AudioSource);
        music.getComponent(cc.AudioSource).play();
      } // if (num < this.audios.length) {
      //   this.audios[num].stop()
      //   this.audios[num].rewind()
      //   this.audios[num].play()
      // }

    } else {
      // console.log('使用旧的音乐')
      this.audios[num].rewind();
      this.audios[num].play();
    }
  },
  pauseBg: function pauseBg() {
    this.bgMusic.pause();
  },
  resumeBg: function resumeBg() {
    this.bgMusic.resume();
  },
  start: function start() {// this.onPlayAudio(1);
  },
  checkBg: function checkBg() {},
  onWin: function onWin() {
    this.winAudio.rewind();
    this.winAudio.play();
  },
  onDouble: function onDouble() {
    this.doubleAudio.rewind();
    this.doubleAudio.play();
  },
  onBoom: function onBoom() {
    this.boomAudio.rewind();
    this.boomAudio.play();
  },
  onMagic: function onMagic() {
    this.magicAudio.rewind();
    this.magicAudio.play();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxtdXNpY01hbmFnZXIuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJ2b2x1bWUiLCJhdWRpb3MiLCJBdWRpb1NvdXJjZSIsImF1ZGlvUHJlZmFiIiwiUHJlZmFiIiwiYmdNdXNpYyIsIndpbkF1ZGlvIiwiZG91YmxlQXVkaW8iLCJib29tQXVkaW8iLCJtYWdpY0F1ZGlvIiwiaW5pdCIsImF1ZGlvIiwiaW5zdGFuY2VBdWRpbyIsImNyZWF0ZU11c2ljUG9vbCIsImNoYW5nZVZvbCIsInZvbCIsImZvckVhY2giLCJpdGVtIiwiaW5kZXgiLCJvblBsYXlBdWRpbyIsIm51bSIsInNlbGYiLCJpc1BsYXlpbmciLCJtdXNpYyIsIm11c2ljUG9vbCIsInNpemUiLCJnZXQiLCJpbnN0YW50aWF0ZSIsInBhcmVudCIsIm5vZGUiLCJnZXRDb21wb25lbnQiLCJwbGF5IiwicmV3aW5kIiwicGF1c2VCZyIsInBhdXNlIiwicmVzdW1lQmciLCJyZXN1bWUiLCJzdGFydCIsImNoZWNrQmciLCJvbldpbiIsIm9uRG91YmxlIiwib25Cb29tIiwib25NYWdpYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUlBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUVQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsTUFBTSxFQUFFLENBREU7QUFFVkMsSUFBQUEsTUFBTSxFQUFFLENBQUNMLEVBQUUsQ0FBQ00sV0FBSixDQUZFO0FBR1ZDLElBQUFBLFdBQVcsRUFBRVAsRUFBRSxDQUFDUSxNQUhOO0FBSVZDLElBQUFBLE9BQU8sRUFBRVQsRUFBRSxDQUFDTSxXQUpGO0FBS1ZJLElBQUFBLFFBQVEsRUFBRVYsRUFBRSxDQUFDTSxXQUxIO0FBTVZLLElBQUFBLFdBQVcsRUFBRVgsRUFBRSxDQUFDTSxXQU5OO0FBT1ZNLElBQUFBLFNB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LElBQWpCO0FBQ0QsR0FuRk07QUFxRlBVLEVBQUFBLE1BckZPLG9CQXFGRTtBQUNQLFNBQUtqQyxTQUFMLENBQWV3QixNQUFmO0FBQ0EsU0FBS3hCLFNBQUwsQ0FBZXVCLElBQWY7QUFDRCxHQXhGTTtBQXlGUFcsRUFBQUEsT0F6Rk8scUJBeUZHO0FBQ1IsU0FBS2pDLFVBQUwsQ0FBZ0J1QixNQUFoQjtBQUNBLFNBQUt2QixVQUFMLENBQWdCc0IsSUFBaEI7QUFDRDtBQTVGTSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBhdXRob3IgaGV5dWNoYW5nXG4gKiBAZmlsZSAg6Z+z5LmQ5o6n5Yi257uE5Lu2XG4gKi9cbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdm9sdW1lOiAxLFxuICAgIGF1ZGlvczogW2NjLkF1ZGlvU291cmNlXSxcbiAgICBhdWRpb1ByZWZhYjogY2MuUHJlZmFiLFxuICAgIGJnTXVzaWM6IGNjLkF1ZGlvU291cmNlLFxuICAgIHdpbkF1ZGlvOiBjYy5BdWRpb1NvdXJjZSxcbiAgICBkb3VibGVBdWRpbzogY2MuQXVkaW9Tb3VyY2UsXG4gICAgYm9vbUF1ZGlvOiBjYy5BdWRpb1NvdXJjZSxcbiAgICBtYWdpY0F1ZGlvOiBjYy5BdWRpb1NvdXJjZSxcbiAgICAvL2F1ZGlvU291cmNlOiBjYy5BdWRpb1NvdXJjZSxcbiAgfSxcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmF1ZGlvID0gW11cbiAgICB0aGlzLmluc3RhbmNlQXVkaW8oKVxuICAgIHRoaXMuY3JlYXRlTXVzaWNQb29sKClcbiAgfSxcbiAgY3JlYXRlTXVzaWNQb29sKCkge1xuICAgIC8vIHRoaXMubXVzaWNQb29sID0gbmV3IGNjLk5vZGVQb29sKClcbiAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IDIwOyBpKyspIHtcbiAgICAvLyAgIGxldCBtdXNpYyA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYXVkaW9QcmVmYWIpXG4gICAgLy8gICB0aGlzLm11c2ljUG9vbC5wdXQobXVzaWMpXG4gICAgLy8gfVxuICB9LFxuICBpbnN0YW5jZUF1ZGlvKCkge1xuXG4gIH0sXG4gIGNoYW5nZVZvbCh2b2wpIHtcbiAgICB0aGlzLnZvbHVtZSA9IHZvbFxuICAgIHRoaXMuYXVkaW9zLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAvLyBpdGVtLnZvbHVtZSA9IHZvbFxuICAgICAgdGhpcy5hdWRpb3NbaW5kZXhdLnZvbHVtZSA9IHZvbFxuICAgIH0pXG4gIH0sXG4gIG9uUGxheUF1ZGlvKG51bSkge1xuICAgIGxldCBzZWxmID0gdGhpc1xuICAgIGlmICghdGhpcy5hdWRpb3NbbnVtXSB8fCB0aGlzLmF1ZGlvc1tudW1dLmlzUGxheWluZykge1xuICAgICAgaWYgKHRoaXMuYXVkaW9zW251bSArIDFdKSB7XG4gICAgICAgIHNlbGYub25QbGF5QXVkaW8obnVtICsgMSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ+WIm+W7uuaWsOeahOmfs+S5kOWunuS+iycpXG4gICAgICAgIGxldCBtdXNpYyA9IG51bGxcbiAgICAgICAgaWYgKHNlbGYubXVzaWNQb29sICYmIHNlbGYubXVzaWNQb29sLnNpemUoKSA+IDApIHtcbiAgICAgICAgICBtdXNpYyA9IHNlbGYubXVzaWNQb29sLmdldCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbXVzaWMgPSBjYy5pbnN0YW50aWF0ZShzZWxmLmF1ZGlvUHJlZmFiKVxuICAgICAgICB9XG4gICAgICAgIG11c2ljLnBhcmVudCA9IHNlbGYubm9kZVxuICAgICAgICB0aGlzLmF1ZGlvc1tudW0gKyAxXSA9IG11c2ljLmdldENvbXBvbmVudChjYy5BdWRpb1NvdXJjZSlcbiAgICAgICAgbXVzaWMuZ2V0Q29tcG9uZW50KGNjLkF1ZGlvU291cmNlKS5wbGF5KClcbiAgICAgIH1cbiAgICAgIC8vIGlmIChudW0gPCB0aGlzLmF1ZGlvcy5sZW5ndGgpIHtcbiAgICAgIC8vICAgdGhpcy5hdWRpb3NbbnVtXS5zdG9wKClcbiAgICAgIC8vICAgdGhpcy5hdWRpb3NbbnVtXS5yZXdpbmQoKVxuICAgICAgLy8gICB0aGlzLmF1ZGlvc1tudW1dLnBsYXkoKVxuICAgICAgLy8gfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygn5L2/55So5pen55qE6Z+z5LmQJylcbiAgICAgIHRoaXMuYXVkaW9zW251bV0ucmV3aW5kKClcbiAgICAgIHRoaXMuYXVkaW9zW251bV0ucGxheSgpXG4gICAgfVxuICB9LFxuICBwYXVzZUJnKCkge1xuICAgIHRoaXMuYmdNdXNpYy5wYXVzZSgpXG4gIH0sXG4gIHJlc3VtZUJnKCkge1xuICAgIHRoaXMuYmdNdXNpYy5yZXN1bWUoKVxuICB9LFxuICBzdGFydCgpIHtcbiAgICAvLyB0aGlzLm9uUGxheUF1ZGlvKDEpO1xuICB9LFxuICBjaGVja0JnKCkge1xuXG4gIH0sXG4gIG9uV2luKCkge1xuICAgIHRoaXMud2luQXVkaW8ucmV3aW5kKClcbiAgICB0aGlzLndpbkF1ZGlvLnBsYXkoKVxuICB9LFxuXG4gIG9uRG91YmxlKCkge1xuICAgIHRoaXMuZG91YmxlQXVkaW8ucmV3aW5kKClcbiAgICB0aGlzLmRvdWJsZUF1ZGlvLnBsYXkoKVxuICB9LFxuXG4gIG9uQm9vbSgpIHtcbiAgICB0aGlzLmJvb21BdWRpby5yZXdpbmQoKVxuICAgIHRoaXMuYm9vbUF1ZGlvLnBsYXkoKVxuICB9LFxuICBvbk1hZ2ljKCkge1xuICAgIHRoaXMubWFnaWNBdWRpby5yZXdpbmQoKVxuICAgIHRoaXMubWFnaWNBdWRpby5wbGF5KClcbiAgfSxcbn0pOyJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/elementCheck.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'a3721/aOY1GFrIWHHBzYGsi', 'elementCheck');
// Script/elementCheck.js

"use strict";

/**
 * @author heyuchang
 * @file 检测组件
 */
cc.Class({
  "extends": cc.Component,
  properties: {
    groups: [],
    map: [],
    mapLength: 8
  },
  init: function init(g) {
    this._game = g;
    this.map = g.map;
    this.mapLength = g.rowCfgNum;

    for (var i = 0; i < this.mapLength; i++) {
      //行
      this.groups[i] = [];

      for (var j = 0; j < this.mapLength; j++) {
        //列
        // this.map[i][j].getComponent('element').growInit() //全部初始化
        if (!this.map[i][j]) {//    cc.log('报错x,y:', i, j)
        }

        this.map[i][j].getComponent('element').isSingle = false;
        this.map[i][j].getComponent('element').warningInit();
        this.groups[i][j] = [];
      }
    }
  },
  elementCheck: function elementCheck(g) {
    //该函数主要用于检测一个区块能否形成道具等
    var propConfig = g._gameController.config.json.propConfig;
    this._game = g;
    this.map = g.map;
    this.mapLength = g.rowCfgNum;
    var min = 999;

    for (var i = 0; i < propConfig.length; i++) {
      min = propConfig[i].min < min ? propConfig[i].min : min;
    }

    for (var _i = 0; _i < this.mapLength; _i++) {
      //行
      for (var j = 0; j < this.mapLength; j++) {
        //列
        this.pushPop(this.map[_i][j], _i, j);
        var target = this.map[_i][j];
        var x = target.getComponent('element').iid;
        var y = target.getComponent('element').jid;
        var isSingle = true;

        if (x - 1 >= 0 && this.map[x - 1][y].getComponent('element').color == target.getComponent('element').color) {
          isSingle = false;
        }

        if (x + 1 < this.mapLength && this.map[x + 1][y].getComponent('element').color == target.getComponent('element').color) {
          isSingle = false;
        }

        if (y - 1 >= 0 && this.map[x][y - 1].getComponent('element').color == target.getComponent('element').color) {
          isSingle = false;
        }

        if (y + 1 < this.mapLength && this.map[x][y + 1].getComponent('element').color == target.getComponent('element').color) {
          isSingle = false;
        }

        this.map[_i][j].getComponent('element').isSingle = isSingle;
        console.log(_i, j, this.map[_i][j].getComponent('element').isSingle, this.map[_i][j].getComponent('element').color);

        if (this.groups[_i][j].length >= min) {
          for (var z = 0; z < propConfig.length; z++) {
            if (this.groups[_i][j].length <= propConfig[z].max && this.groups[_i][j].length >= propConfig[z].min) {
              this.warning(propConfig[z].type, this.groups[_i][j]);
            }
          }
        }
      }
    }
  },
  pushPop: function pushPop(target, i, j) {
    //用于判断一个方块四个方向上的方块颜色是否一样 如果一样则加入组 如果组长度小于1则返回false?
    // if (target.getComponent('element').isPush==true) {
    //   return
    // }
    target.getComponent('element').isPush = true;
    this.groups[i][j].push(target);
    var x = target.getComponent('element').iid;
    var y = target.getComponent('element').jid;

    if (x - 1 >= 0) {
      if (!this.map[x - 1][y].getComponent('element').isPush && this.map[x - 1][y].getComponent('element').color == target.getComponent('element').color) {
        this.pushPop(this.map[x - 1][y], i, j);
      }
    }

    if (x + 1 < this.mapLength) {
      if (!this.map[x + 1][y].getComponent('element').isPush && this.map[x + 1][y].getComponent('element').color == target.getComponent('element').color) {
        this.pushPop(this.map[x + 1][y], i, j);
      }
    }

    if (y - 1 >= 0) {
      if (!this.map[x][y - 1].getComponent('element').isPush && this.map[x][y - 1].getComponent('element').color == target.getComponent('element').color) {
        this.pushPop(this.map[x][y - 1], i, j);
      }
    }

    if (y + 1 < this.mapLength) {
      if (!this.map[x][y + 1].getComponent('element').isPush && this.map[x][y + 1].getComponent('element').color == target.getComponent('element').color) {
        this.pushPop(this.map[x][y + 1], i, j);
      }
    } // 判断方块是否单身

  },
  warning: function warning(type, group) {
    group.map(function (item) {
      item.getComponent('element').onWarning(type);
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxlbGVtZW50Q2hlY2suanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJncm91cHMiLCJtYXAiLCJtYXBMZW5ndGgiLCJpbml0IiwiZyIsIl9nYW1lIiwicm93Q2ZnTnVtIiwiaSIsImoiLCJnZXRDb21wb25lbnQiLCJpc1NpbmdsZSIsIndhcm5pbmdJbml0IiwiZWxlbWVudENoZWNrIiwicHJvcENvbmZpZyIsIl9nYW1lQ29udHJvbGxlciIsImNvbmZpZyIsImpzb24iLCJtaW4iLCJsZW5ndGgiLCJwdXNoUG9wIiwidGFyZ2V0IiwieCIsImlpZCIsInkiLCJqaWQiLCJjb2xvciIsImNvbnNvbGUiLCJsb2ciLCJ6IiwibWF4Iiwid2FybmluZyIsInR5cGUiLCJpc1B1c2giLCJwdXNoIiwiZ3JvdXAiLCJpdGVtIiwib25XYXJuaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBSUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBRVBDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxNQUFNLEVBQUUsRUFERTtBQUVWQyxJQUFBQSxHQUFHLEVBQUUsRUFGSztBQUdWQyxJQUFBQSxTQUFTLEVBQUU7QUFIRCxHQUZMO0FBT1BDLEVBQUFBLElBUE8sZ0JBT0ZDLENBUEUsRUFPQztBQUNOLFNBQUtDLEtBQUwsR0FBYUQsQ0FBYjtBQUNBLFNBQUtILEdBQUwsR0FBV0csQ0FBQyxDQUFDSCxHQUFiO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQkUsQ0FBQyxDQUFDRSxTQUFuQjs7QUFDQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS0wsU0FBekIsRUFBb0NLLENBQUMsRUFBckMsRUFBeUM7QUFBRTtBQUN6QyxXQUFLUCxNQUFMLENBQVlPLENBQVosSUFBaUIsRUFBakI7O0FBQ0EsV0FB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QixDQUFULEVBQVlFLENBQUMsR0FBRyxDQUFoQixDQUFiLEVBQWlDaEIsQ0FBakMsRUFBb0NDLENBQXBDO0FBQ0Q7QUFDRjs7QUFDRCxRQUFLZSxDQUFDLEdBQUcsQ0FBTCxHQUFVLEtBQUtyQixTQUFuQixFQUE4QjtBQUM1QixVQUFJLENBQUMsS0FBS0QsR0FBTCxDQUFTb0IsQ0FBVCxFQUFZRSxDQUFDLEdBQUcsQ0FBaEIsRUFBbUJkLFlBQW5CLENBQWdDLFNBQWhDLEVBQTJDdUIsTUFBNUMsSUFBc0QsS0FBSy9CLEdBQUwsQ0FBU29CLENBQVQsRUFBWUUsQ0FBQyxHQUFHLENBQWhCLEVBQW1CZCxZQUFuQixDQUFnQyxTQUFoQyxFQUEyQ2dCLEtBQTNDLElBQW9ETCxNQUFNLENBQUNYLFlBQVAsQ0FBb0IsU0FBcEIsRUFBK0JnQixLQUE3SSxFQUFvSjtBQUNsSixhQUFLTixPQUFMLENBQWEsS0FBS2xCLEdBQUwsQ0FBU29CLENBQVQsRUFBWUUsQ0FBQyxHQUFHLENBQWhCLENBQWIsRUFBaUNoQixDQUFqQyxFQUFvQ0MsQ0FBcEM7QUFDRDtBQUNGLEtBM0JtQixDQTZCcEI7O0FBRUQsR0FoR007QUFpR1BzQixFQUFBQSxPQWpHTyxtQkFpR0NDLElBakdELEVBaUdPRyxLQWpHUCxFQWlHYztBQUNuQkEsSUFBQUEsS0FBSyxDQUFDakMsR0FBTixDQUFVLFVBQUFrQyxJQUFJLEVBQUk7QUFDaEJBLE1BQUFBLElBQUksQ0FBQzFCLFlBQUwsQ0FBa0IsU0FBbEIsRUFBNkIyQixTQUE3QixDQUF1Q0wsSUFBdkM7QUFDRCxLQUZEO0FBR0Q7QUFyR00sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAYXV0aG9yIGhleXVjaGFuZ1xuICogQGZpbGUg5qOA5rWL57uE5Lu2XG4gKi9cbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgZ3JvdXBzOiBbXSxcbiAgICBtYXA6IFtdLFxuICAgIG1hcExlbmd0aDogOFxuICB9LFxuICBpbml0KGcpIHtcbiAgICB0aGlzLl9nYW1lID0gZ1xuICAgIHRoaXMubWFwID0gZy5tYXBcbiAgICB0aGlzLm1hcExlbmd0aCA9IGcucm93Q2ZnTnVtXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1hcExlbmd0aDsgaSsrKSB7IC8v6KGMXG4gICAgICB0aGlzLmdyb3Vwc1tpXSA9IFtdXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMubWFwTGVuZ3RoOyBqKyspIHsgLy/liJdcbiAgICAgICAgLy8gdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuZ3Jvd0luaXQoKSAvL+WFqOmDqOWIneWni+WMllxuICAgICAgICBpZiAoIXRoaXMubWFwW2ldW2pdKSB7XG4gICAgICAgICAgLy8gICAgY2MubG9nKCfmiqXplJl4LHk6JywgaSwgailcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5pc1NpbmdsZSA9IGZhbHNlXG4gICAgICAgIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLndhcm5pbmdJbml0KClcbiAgICAgICAgdGhpcy5ncm91cHNbaV1bal0gPSBbXVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgZWxlbWVudENoZWNrKGcpIHsgLy/or6Xlh73mlbDkuLvopoHnlKjkuo7mo4DmtYvkuIDkuKrljLrlnZfog73lkKblvaLmiJDpgZPlhbfnrYlcbiAgICBsZXQgcHJvcENvbmZpZyA9IGcuX2dhbWVDb250cm9sbGVyLmNvbmZpZy5qc29uLnByb3BDb25maWdcbiAgICB0aGlzLl9nYW1lID0gZ1xuICAgIHRoaXMubWFwID0gZy5tYXBcbiAgICB0aGlzLm1hcExlbmd0aCA9IGcucm93Q2ZnTnVtXG4gICAgbGV0IG1pbiA9IDk5OVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcENvbmZpZy5sZW5ndGg7IGkrKykge1xuICAgICAgbWluID0gcHJvcENvbmZpZ1tpXS5taW4gPCBtaW4gPyBwcm9wQ29uZmlnW2ldLm1pbiA6IG1pblxuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWFwTGVuZ3RoOyBpKyspIHsgLy/ooYxcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5tYXBMZW5ndGg7IGorKykgeyAvL+WIl1xuICAgICAgICB0aGlzLnB1c2hQb3AodGhpcy5tYXBbaV1bal0sIGksIGopXG4gICAgICAgIGxldCB0YXJnZXQgPSB0aGlzLm1hcFtpXVtqXVxuICAgICAgICBsZXQgeCA9IHRhcmdldC5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5paWRcbiAgICAgICAgbGV0IHkgPSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuamlkXG4gICAgICAgIGxldCBpc1NpbmdsZSA9IHRydWVcbiAgICAgICAgaWYgKCh4IC0gMSkgPj0gMCAmJiB0aGlzLm1hcFt4IC0gMV1beV0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IgPT0gdGFyZ2V0LmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yKSB7XG4gICAgICAgICAgaXNTaW5nbGUgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGlmICgoeCArIDEpIDwgdGhpcy5tYXBMZW5ndGggJiYgdGhpcy5tYXBbeCArIDFdW3ldLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yID09IHRhcmdldC5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvcikge1xuICAgICAgICAgIGlzU2luZ2xlID0gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgoeSAtIDEpID49IDAgJiYgdGhpcy5tYXBbeF1beSAtIDFdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yID09IHRhcmdldC5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvcikge1xuICAgICAgICAgIGlzU2luZ2xlID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBpZiAoKHkgKyAxKSA8IHRoaXMubWFwTGVuZ3RoICYmIHRoaXMubWFwW3hdW3kgKyAxXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvciA9PSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IpIHtcbiAgICAgICAgICBpc1NpbmdsZSA9IGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuaXNTaW5nbGUgPSBpc1NpbmdsZVxuICAgICAgICBjb25zb2xlLmxvZyhpLCBqLCB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5pc1NpbmdsZSwgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IpXG4gICAgICAgIGlmICh0aGlzLmdyb3Vwc1tpXVtqXS5sZW5ndGggPj0gbWluKSB7XG4gICAgICAgICAgZm9yIChsZXQgeiA9IDA7IHogPCBwcm9wQ29uZmlnLmxlbmd0aDsgeisrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ncm91cHNbaV1bal0ubGVuZ3RoIDw9IHByb3BDb25maWdbel0ubWF4ICYmIHRoaXMuZ3JvdXBzW2ldW2pdLmxlbmd0aCA+PSBwcm9wQ29uZmlnW3pdLm1pbikge1xuICAgICAgICAgICAgICB0aGlzLndhcm5pbmcocHJvcENvbmZpZ1t6XS50eXBlLCB0aGlzLmdyb3Vwc1tpXVtqXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHB1c2hQb3AodGFyZ2V0LCBpLCBqKSB7IC8v55So5LqO5Yik5pat5LiA5Liq5pa55Z2X5Zub5Liq5pa55ZCR5LiK55qE5pa55Z2X6aKc6Imy5piv5ZCm5LiA5qC3IOWmguaenOS4gOagt+WImeWKoOWFpee7hCDlpoLmnpznu4Tplb/luqblsI/kuo4x5YiZ6L+U5ZueZmFsc2U/XG4gICAgLy8gaWYgKHRhcmdldC5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5pc1B1c2g9PXRydWUpIHtcbiAgICAvLyAgIHJldHVyblxuICAgIC8vIH1cbiAgICB0YXJnZXQuZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuaXNQdXNoID0gdHJ1ZVxuICAgIHRoaXMuZ3JvdXBzW2ldW2pdLnB1c2godGFyZ2V0KVxuICAgIGxldCB4ID0gdGFyZ2V0LmdldENvbXBvbmVudCgnZWxlbWVudCcpLmlpZFxuICAgIGxldCB5ID0gdGFyZ2V0LmdldENvbXBvbmVudCgnZWxlbWVudCcpLmppZFxuICAgIGlmICgoeCAtIDEpID49IDApIHtcbiAgICAgIGlmICghdGhpcy5tYXBbeCAtIDFdW3ldLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmlzUHVzaCAmJiB0aGlzLm1hcFt4IC0gMV1beV0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IgPT0gdGFyZ2V0LmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yKSB7XG4gICAgICAgIHRoaXMucHVzaFBvcCh0aGlzLm1hcFt4IC0gMV1beV0sIGksIGopXG4gICAgICB9XG4gICAgfVxuICAgIGlmICgoeCArIDEpIDwgdGhpcy5tYXBMZW5ndGgpIHtcbiAgICAgIGlmICghdGhpcy5tYXBbeCArIDFdW3ldLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmlzUHVzaCAmJiB0aGlzLm1hcFt4ICsgMV1beV0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IgPT0gdGFyZ2V0LmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yKSB7XG4gICAgICAgIHRoaXMucHVzaFBvcCh0aGlzLm1hcFt4ICsgMV1beV0sIGksIGopXG4gICAgICB9XG4gICAgfVxuICAgIGlmICgoeSAtIDEpID49IDApIHtcbiAgICAgIGlmICghdGhpcy5tYXBbeF1beSAtIDFdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmlzUHVzaCAmJiB0aGlzLm1hcFt4XVt5IC0gMV0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IgPT0gdGFyZ2V0LmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yKSB7XG4gICAgICAgIHRoaXMucHVzaFBvcCh0aGlzLm1hcFt4XVt5IC0gMV0sIGksIGopXG4gICAgICB9XG4gICAgfVxuICAgIGlmICgoeSArIDEpIDwgdGhpcy5tYXBMZW5ndGgpIHtcbiAgICAgIGlmICghdGhpcy5tYXBbeF1beSArIDFdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmlzUHVzaCAmJiB0aGlzLm1hcFt4XVt5ICsgMV0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IgPT0gdGFyZ2V0LmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yKSB7XG4gICAgICAgIHRoaXMucHVzaFBvcCh0aGlzLm1hcFt4XVt5ICsgMV0sIGksIGopXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8g5Yik5pat5pa55Z2X5piv5ZCm5Y2V6LqrXG5cbiAgfSxcbiAgd2FybmluZyh0eXBlLCBncm91cCkge1xuICAgIGdyb3VwLm1hcChpdGVtID0+IHtcbiAgICAgIGl0ZW0uZ2V0Q29tcG9uZW50KCdlbGVtZW50Jykub25XYXJuaW5nKHR5cGUpXG4gICAgfSlcbiAgfVxufSk7Il19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/illustrative.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '0e40bxKGytLiJwQbi3sCcB6', 'illustrative');
// Script/illustrative.js

"use strict";

/**
 * @author heyuchang
 */
cc.Class({
  "extends": cc.Component,
  properties: {
    container: cc.Node,
    avatar: cc.Node,
    prefab: cc.Prefab
  },
  init: function init(c) {
    this._gameController = c;

    if (c.social.node.active) {
      var highLevel = c.social.getHighestLevel();

      if (highLevel) {
        this.showAvatar(highLevel);
        this.loadContainer(+highLevel);
      } else {
        this.avatar.active = false;
        this.loadContainer(1);
      }
    } else {
      this.avatar.active = false;
    }
  },
  showAvatar: function showAvatar(level) {
    var _this = this;

    this.avatar.active = true;
    var data = this._gameController.gameData.json.levelData[+level - 1];

    var heightScore = this._gameController.social.getHighestScore();

    this.avatar.getChildByName('name').getComponent(cc.Label).string = '历史最高:' + data.name;
    this.avatar.getChildByName('score').getComponent(cc.Label).string = '分数' + heightScore;
    setTimeout(function () {
      _this._gameController.scoreMgr.characterMgr.showAvatarCharacter(+level, _this.avatar.getChildByName('db'));
    }, 1000);
  },
  loadContainer: function loadContainer(level) {
    var _this2 = this;

    var data = this._gameController.gameData.json.levelData;
    this.clearContainer();
    setTimeout(function () {
      for (var i = 0; i < data.length; i++) {
        var card = cc.instantiate(_this2.prefab);
        card.parent = _this2.container;

        _this2.initCard(card, data[i], i, level);
      }
    }, 1000);
  },
  clearContainer: function clearContainer() {
    this.container.children.map(function (item) {
      item.destroy();
    });
  },
  initCard: function initCard(card, info, level, selfLevel) {
    if (level < selfLevel) {
      card.getChildByName('name').getComponent(cc.Label).string = info.name; //card.getChildByName('score').getComponent(cc.Label).string = "得分:" + info.score

      card.getChildByName('db').color = cc.Color.WHITE;
      card.getChildByName('giftStep').getComponent(cc.Label).string = "开局奖励" + info.giftStep + "步";

      this._gameController.scoreMgr.characterMgr.showCharacter(level + 1, card.getChildByName('db'));
    } else {
      card.getChildByName('name').getComponent(cc.Label).string = '???';
      card.getChildByName('giftStep').getComponent(cc.Label).string = "开局奖励???步";
      card.getChildByName('db').color = cc.Color.BLACK;

      this._gameController.scoreMgr.characterMgr.showCharacter(level + 1, card.getChildByName('db'), cc.Color.BLACK);
    } // this._gameController.scoreMgr.characterMgr.showCharacter(level + 1, card.getChildByName('db'), 0)

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxpbGx1c3RyYXRpdmUuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJjb250YWluZXIiLCJOb2RlIiwiYXZhdGFyIiwicHJlZmFiIiwiUHJlZmFiIiwiaW5pdCIsImMiLCJfZ2FtZUNvbnRyb2xsZXIiLCJzb2NpYWwiLCJub2RlIiwiYWN0aXZlIiwiaGlnaExldmVsIiwiZ2V0SGlnaGVzdExldmVsIiwic2hvd0F2YXRhciIsImxvYWRDb250YWluZXIiLCJsZXZlbCIsImRhdGEiLCJnYW1lRGF0YSIsImpzb24iLCJsZXZlbERhdGEiLCJoZWlnaHRTY29yZSIsImdldEhpZ2hlc3RTY29yZSIsImdldENoaWxkQnlOYW1lIiwiZ2V0Q29tcG9uZW50IiwiTGFiZWwiLCJzdHJpbmciLCJuYW1lIiwic2V0VGltZW91dCIsInNjb3JlTWdyIiwiY2hhcmFjdGVyTWdyIiwic2hvd0F2YXRhckNoYXJhY3RlciIsImNsZWFyQ29udGFpbmVyIiwiaSIsImxlbmd0aCIsImNhcmQiLCJpbnN0YW50aWF0ZSIsInBhcmVudCIsImluaXRDYXJkIiwiY2hpbGRyZW4iLCJtYXAiLCJpdGVtIiwiZGVzdHJveSIsImluZm8iLCJzZWxmTGV2ZWwiLCJjb2xvciIsIkNvbG9yIiwiV0hJVEUiLCJnaWZ0U3RlcCIsInNob3dDaGFyYWN0ZXIiLCJCTEFDSyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0FBR0FBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBRVBDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxTQUFTLEVBQUVKLEVBQUUsQ0FBQ0ssSUFESjtBQUVWQyxJQUFBQSxNQUFNLEVBQUVOLEVBQUUsQ0FBQ0ssSUFGRDtBQUdWRSxJQUFBQSxNQUFNLEVBQUVQLEVBQUUsQ0FBQ1E7QUFIRCxHQUZMO0FBT1BDLEVBQUFBLElBUE8sZ0JBT0ZD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bUIsYUFBM0MsQ0FBeURqQyxLQUFLLEdBQUcsQ0FBakUsRUFBb0VtQixJQUFJLENBQUNaLGNBQUwsQ0FBb0IsSUFBcEIsQ0FBcEUsRUFBK0YxQixFQUFFLENBQUNpRCxLQUFILENBQVNJLEtBQXhHO0FBQ0QsS0Fab0MsQ0FhckM7O0FBQ0Q7QUEvRE0sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAYXV0aG9yIGhleXVjaGFuZ1xuICovXG5jYy5DbGFzcyh7XG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgcHJvcGVydGllczoge1xuICAgIGNvbnRhaW5lcjogY2MuTm9kZSxcbiAgICBhdmF0YXI6IGNjLk5vZGUsXG4gICAgcHJlZmFiOiBjYy5QcmVmYWIsXG4gIH0sXG4gIGluaXQoYykge1xuICAgIHRoaXMuX2dhbWVDb250cm9sbGVyID0gY1xuXG4gICAgaWYgKGMuc29jaWFsLm5vZGUuYWN0aXZlKSB7XG4gICAgICBsZXQgaGlnaExldmVsID0gYy5zb2NpYWwuZ2V0SGlnaGVzdExldmVsKClcbiAgICAgIGlmIChoaWdoTGV2ZWwpIHtcbiAgICAgICAgdGhpcy5zaG93QXZhdGFyKGhpZ2hMZXZlbClcbiAgICAgICAgdGhpcy5sb2FkQ29udGFpbmVyKCtoaWdoTGV2ZWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmF2YXRhci5hY3RpdmUgPSBmYWxzZVxuICAgICAgICB0aGlzLmxvYWRDb250YWluZXIoMSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hdmF0YXIuYWN0aXZlID0gZmFsc2VcbiAgICB9XG4gIH0sXG4gIHNob3dBdmF0YXIobGV2ZWwpIHtcbiAgICB0aGlzLmF2YXRhci5hY3RpdmUgPSB0cnVlXG4gICAgbGV0IGRhdGEgPSB0aGlzLl9nYW1lQ29udHJvbGxlci5nYW1lRGF0YS5qc29uLmxldmVsRGF0YVsrbGV2ZWwgLSAxXVxuICAgIGxldCBoZWlnaHRTY29yZSA9IHRoaXMuX2dhbWVDb250cm9sbGVyLnNvY2lhbC5nZXRIaWdoZXN0U2NvcmUoKVxuICAgIHRoaXMuYXZhdGFyLmdldENoaWxkQnlOYW1lKCduYW1lJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSAn5Y6G5Y+y5pyA6auYOicgKyBkYXRhLm5hbWVcbiAgICB0aGlzLmF2YXRhci5nZXRDaGlsZEJ5TmFtZSgnc2NvcmUnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9ICfliIbmlbAnICsgaGVpZ2h0U2NvcmVcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLnNjb3JlTWdyLmNoYXJhY3Rlck1nci5zaG93QXZhdGFyQ2hhcmFjdGVyKCtsZXZlbCwgdGhpcy5hdmF0YXIuZ2V0Q2hpbGRCeU5hbWUoJ2RiJykpXG4gICAgfSwgMTAwMClcbiAgfSxcbiAgbG9hZENvbnRhaW5lcihsZXZlbCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5fZ2FtZUNvbnRyb2xsZXIuZ2FtZURhdGEuanNvbi5sZXZlbERhdGFcbiAgICB0aGlzLmNsZWFyQ29udGFpbmVyKClcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMucHJlZmFiKVxuICAgICAgICBjYXJkLnBhcmVudCA9IHRoaXMuY29udGFpbmVyXG4gICAgICAgIHRoaXMuaW5pdENhcmQoY2FyZCwgZGF0YVtpXSwgaSwgbGV2ZWwpXG4gICAgICB9XG4gICAgfSwgMTAwMClcbiAgfSxcbiAgY2xlYXJDb250YWluZXIoKSB7XG4gICAgdGhpcy5jb250YWluZXIuY2hpbGRyZW4ubWFwKGl0ZW0gPT4ge1xuICAgICAgaXRlbS5kZXN0cm95KClcbiAgICB9KVxuICB9LFxuICBpbml0Q2FyZChjYXJkLCBpbmZvLCBsZXZlbCwgc2VsZkxldmVsKSB7XG4gICAgaWYgKGxldmVsIDwgc2VsZkxldmVsKSB7XG4gICAgICBjYXJkLmdldENoaWxkQnlOYW1lKCduYW1lJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBpbmZvLm5hbWVcbiAgICAgIC8vY2FyZC5nZXRDaGlsZEJ5TmFtZSgnc2NvcmUnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IFwi5b6X5YiGOlwiICsgaW5mby5zY29yZVxuICAgICAgY2FyZC5nZXRDaGlsZEJ5TmFtZSgnZGInKS5jb2xvciA9IGNjLkNvbG9yLldISVRFXG4gICAgICBjYXJkLmdldENoaWxkQnlOYW1lKCdnaWZ0U3RlcCcpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCLlvIDlsYDlpZblirFcIiArIGluZm8uZ2lmdFN0ZXAgKyBcIuatpVwiXG4gICAgICB0aGlzLl9nYW1lQ29udHJvbGxlci5zY29yZU1nci5jaGFyYWN0ZXJNZ3Iuc2hvd0NoYXJhY3RlcihsZXZlbCArIDEsIGNhcmQuZ2V0Q2hpbGRCeU5hbWUoJ2RiJykpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNhcmQuZ2V0Q2hpbGRCeU5hbWUoJ25hbWUnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9ICc/Pz8nXG4gICAgICBjYXJkLmdldENoaWxkQnlOYW1lKCdnaWZ0U3RlcCcpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCLlvIDlsYDlpZblirE/Pz/mraVcIlxuICAgICAgY2FyZC5nZXRDaGlsZEJ5TmFtZSgnZGInKS5jb2xvciA9IGNjLkNvbG9yLkJMQUNLXG4gICAgICB0aGlzLl9nYW1lQ29udHJvbGxlci5zY29yZU1nci5jaGFyYWN0ZXJNZ3Iuc2hvd0NoYXJhY3RlcihsZXZlbCArIDEsIGNhcmQuZ2V0Q2hpbGRCeU5hbWUoJ2RiJyksIGNjLkNvbG9yLkJMQUNLKVxuICAgIH1cbiAgICAvLyB0aGlzLl9nYW1lQ29udHJvbGxlci5zY29yZU1nci5jaGFyYWN0ZXJNZ3Iuc2hvd0NoYXJhY3RlcihsZXZlbCArIDEsIGNhcmQuZ2V0Q2hpbGRCeU5hbWUoJ2RiJyksIDApXG4gIH1cbn0pOyJdfQ==
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/pageManager.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'a1bb7xaDvtHXLTuIo0MRIEu', 'pageManager');
// Script/pageManager.js

"use strict";

/**
 * @author heyuchang
 * @file  通用页面控制器和适配
 */
var AC = require('GameAct');

cc.Class({
  "extends": cc.Component,
  properties: {
    status: 0,
    //页面状态
    pages: [cc.Node]
  },
  // 0 开始游戏页面
  // 1 游戏页面
  // 2 UI页面
  // 3 过关页面
  // 4 失败页面
  // 5 复活页面
  // 6 排行榜页面
  start: function start() {
    this.lateStart();
  },
  lateStart: function lateStart() {
    this.width = cc.winSize.width;
    window.width = this.width;
    this.height = cc.winSize.height;
    window.height = this.height; // 存为全局变量

    this.adoptCanvas();
  },
  // 适配解决方案
  adoptCanvas: function adoptCanvas() {
    var canvas = cc.director.getScene().getChildByName('Canvas').getComponent(cc.Canvas); // 设计分辨率比

    var rateR = canvas.designResolution.height / canvas.designResolution.width; // 显示分辨率比

    var rateV = this.height / this.width;

    if (rateV > rateR) {
      canvas.fitHeight = false;
      canvas.fitWidth = true;
    } else {
      canvas.fitHeight = true;
      canvas.fitWidth = false;
    }
  },
  onOpenPage: function onOpenPage(num, callFun) {
    this.closeAllPages();
    this.pages[num].active = true; // if (callFun) {
    //   this.callFun();
    // }
  },
  addPage: function addPage(num, callFun) {
    this.pages[num].scale = 0.5;
    this.pages[num].active = true;
    this.pages[num].runAction(AC.popOut(0.5)); // if (callFun) {
    //   this.callFun();
    // }
  },
  removePage: function removePage(num, callFun) {
    var _this = this;

    this.pages[num].runAction(cc.sequence(AC.popIn(0.5), cc.callFunc(function () {
      _this.pages[num].active = false;
    }, this))); // if (callFun) {
    //   this.callFun();
    // }
  },
  onButtonOpenPage: function onButtonOpenPage(event, cust) {
    this.onOpenPage(cust);
  },
  onButtonAddPage: function onButtonAddPage(event, cust) {
    this.addPage(cust);
  },
  onButtonRemovePage: function onButtonRemovePage(event, cust) {
    this.removePage(cust);
  },
  closeAllPages: function closeAllPages() {
    this.pages.forEach(function (element) {
      element.active = false;
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxwYWdlTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJBQyIsInJlcXVpcmUiLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInN0YXR1cyIsInBhZ2VzIiwiTm9kZSIsInN0YXJ0IiwibGF0ZVN0YXJ0Iiwid2lkdGgiLCJ3aW5TaXplIiwid2luZG93IiwiaGVpZ2h0IiwiYWRvcHRDYW52YXMiLCJjYW52YXMiLCJkaXJlY3RvciIsImdldFNjZW5lIiwiZ2V0Q2hpbGRCeU5hbWUiLCJnZXRDb21wb25lbnQiLCJDYW52YXMiLCJyYXRlUiIsImRlc2lnblJlc29sdXRpb24iLCJyYXRlViIsImZpdEhlaWdodCIsImZpdFdpZHRoIiwib25PcGVuUGFnZSIsIm51bSIsImNhbGxGdW4iLCJjbG9zZUFsbFBhZ2VzIiwiYWN0aXZlIiwiYWRkUGFnZSIsInNjYWxlIiwicnVuQWN0aW9uIiwicG9wT3V0IiwicmVtb3ZlUGFnZSIsInNlcXVlbmNlIiwicG9wSW4iLCJjYWxsRnVuYyIsIm9uQnV0dG9uT3BlblBhZ2UiLCJldmVudCIsImN1c3QiLCJvbkJ1dHRvbkFkZFBhZ2UiLCJvbkJ1dHRvblJlbW92ZVBhZ2UiLCJmb3JFYWNoIiwiZWxlbWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUlBLElBQUlBLEVBQUUsR0FBR0MsT0FBTyxDQUFDLFNBQUQsQ0FBaEI7O0FBQ0FDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBRVBDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxNQUFNLEVBQUUsQ0FERTtBQUNDO0FBQ1hDLElBQUFBLEtBQUssRUFBRSxDQUFDTCxFQUFFLENBQUNNLElBQUo7QUFGRyxHQUZMO0FBTVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUMsRUFBQUEsS0FkTyxtQkFjQztBQUNOLFNBQUtDLFNBQUw7QUFDRCxHQWhC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RUFzRXlCO0FBQzlCLFNBQUtOLFVBQUwsQ0FBZ0JNLElBQWhCO0FBQ0QsR0F4RU07QUF5RVBaLEVBQUFBLGFBekVPLDJCQXlFUztBQUNkLFNBQUt2QixLQUFMLENBQVdzQyxPQUFYLENBQW1CLFVBQUFDLE9BQU8sRUFBSTtBQUM1QkEsTUFBQUEsT0FBTyxDQUFDZixNQUFSLEdBQWlCLEtBQWpCO0FBQ0QsS0FGRDtBQUdEO0FBN0VNLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBoZXl1Y2hhbmdcbiAqIEBmaWxlICDpgJrnlKjpobXpnaLmjqfliLblmajlkozpgILphY1cbiAqL1xudmFyIEFDID0gcmVxdWlyZSgnR2FtZUFjdCcpXG5jYy5DbGFzcyh7XG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgcHJvcGVydGllczoge1xuICAgIHN0YXR1czogMCwgLy/pobXpnaLnirbmgIFcbiAgICBwYWdlczogW2NjLk5vZGVdLFxuICB9LFxuICAvLyAwIOW8gOWni+a4uOaIj+mhtemdolxuICAvLyAxIOa4uOaIj+mhtemdolxuICAvLyAyIFVJ6aG16Z2iXG4gIC8vIDMg6L+H5YWz6aG16Z2iXG4gIC8vIDQg5aSx6LSl6aG16Z2iXG4gIC8vIDUg5aSN5rS76aG16Z2iXG4gIC8vIDYg5o6S6KGM5qac6aG16Z2iXG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5sYXRlU3RhcnQoKVxuICB9LFxuICBsYXRlU3RhcnQoKSB7XG4gICAgdGhpcy53aWR0aCA9IGNjLndpblNpemUud2lkdGhcbiAgICB3aW5kb3cud2lkdGggPSB0aGlzLndpZHRoXG4gICAgdGhpcy5oZWlnaHQgPSBjYy53aW5TaXplLmhlaWdodFxuICAgIHdpbmRvdy5oZWlnaHQgPSB0aGlzLmhlaWdodFxuICAgIC8vIOWtmOS4uuWFqOWxgOWPmOmHj1xuICAgIHRoaXMuYWRvcHRDYW52YXMoKVxuICB9LFxuICAvLyDpgILphY3op6PlhrPmlrnmoYhcbiAgYWRvcHRDYW52YXMoKSB7XG4gICAgbGV0IGNhbnZhcyA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoJ0NhbnZhcycpLmdldENvbXBvbmVudChjYy5DYW52YXMpXG4gICAgLy8g6K6+6K6h5YiG6L6o546H5q+UXG4gICAgbGV0IHJhdGVSID0gY2FudmFzLmRlc2lnblJlc29sdXRpb24uaGVpZ2h0IC8gY2FudmFzLmRlc2lnblJlc29sdXRpb24ud2lkdGg7XG4gICAgLy8g5pi+56S65YiG6L6o546H5q+UXG4gICAgbGV0IHJhdGVWID0gdGhpcy5oZWlnaHQgLyB0aGlzLndpZHRoO1xuICAgIGlmIChyYXRlViA+IHJhdGVSKSB7XG4gICAgICBjYW52YXMuZml0SGVpZ2h0ID0gZmFsc2U7XG4gICAgICBjYW52YXMuZml0V2lkdGggPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYW52YXMuZml0SGVpZ2h0ID0gdHJ1ZTtcbiAgICAgIGNhbnZhcy5maXRXaWR0aCA9IGZhbHNlO1xuICAgIH1cbiAgfSxcblxuICBvbk9wZW5QYWdlKG51bSwgY2FsbEZ1bikge1xuICAgIHRoaXMuY2xvc2VBbGxQYWdlcygpXG4gICAgdGhpcy5wYWdlc1tudW1dLmFjdGl2ZSA9IHRydWVcbiAgICAvLyBpZiAoY2FsbEZ1bikge1xuICAgIC8vICAgdGhpcy5jYWxsRnVuKCk7XG4gICAgLy8gfVxuICB9LFxuICBhZGRQYWdlKG51bSwgY2FsbEZ1bikge1xuICAgIHRoaXMucGFnZXNbbnVtXS5zY2FsZSA9IDAuNVxuICAgIHRoaXMucGFnZXNbbnVtXS5hY3RpdmUgPSB0cnVlXG4gICAgdGhpcy5wYWdlc1tudW1dLnJ1bkFjdGlvbihBQy5wb3BPdXQoMC41KSlcbiAgICAvLyBpZiAoY2FsbEZ1bikge1xuICAgIC8vICAgdGhpcy5jYWxsRnVuKCk7XG4gICAgLy8gfVxuICB9LFxuICByZW1vdmVQYWdlKG51bSwgY2FsbEZ1bikge1xuICAgIHRoaXMucGFnZXNbbnVtXS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoQUMucG9wSW4oMC41KSxjYy5jYWxsRnVuYygoKT0+e1xuICAgICAgdGhpcy5wYWdlc1tudW1dLmFjdGl2ZSA9IGZhbHNlXG4gICAgfSx0aGlzKSkpXG4gICAgLy8gaWYgKGNhbGxGdW4pIHtcbiAgICAvLyAgIHRoaXMuY2FsbEZ1bigpO1xuICAgIC8vIH1cbiAgfSxcbiAgb25CdXR0b25PcGVuUGFnZShldmVudCwgY3VzdCkge1xuICAgIHRoaXMub25PcGVuUGFnZShjdXN0KTtcbiAgfSxcbiAgb25CdXR0b25BZGRQYWdlKGV2ZW50LCBjdXN0KSB7XG4gICAgdGhpcy5hZGRQYWdlKGN1c3QpO1xuICB9LFxuICBvbkJ1dHRvblJlbW92ZVBhZ2UoZXZlbnQsIGN1c3QpIHtcbiAgICB0aGlzLnJlbW92ZVBhZ2UoY3VzdCk7XG4gIH0sXG4gIGNsb3NlQWxsUGFnZXMoKSB7XG4gICAgdGhpcy5wYWdlcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgZWxlbWVudC5hY3RpdmUgPSBmYWxzZVxuICAgIH0pO1xuICB9LFxufSk7Il19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/building.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '398fcZTj9dDiob4+zBV4owr', 'building');
// Script/building.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  // LIFE-CYCLE CALLBACKS:
  init: function init() {} // update (dt) {},

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxidWlsZGluZy5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImluaXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBRVBDLEVBQUFBLFVBQVUsRUFBRSxFQUZMO0FBSVA7QUFDQUMsRUFBQUEsSUFMTyxrQkFLQSxDQUVOLENBUE0sQ0FRUDs7QUFSTyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgcHJvcGVydGllczoge1xuICB9LFxuICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcbiAgaW5pdCgpIHtcblxuICB9XG4gIC8vIHVwZGF0ZSAoZHQpIHt9LFxufSk7Il19
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/scoreParticle.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'b3ac7z+dNhMxry0R3HbylFr', 'scoreParticle');
// Script/scoreParticle.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    particle: cc.ParticleSystem
  },
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  init: function init(s, pos, time) {
    var _this = this;

    this._gameScore = s;
    this.node.x = pos.x;
    this.node.y = pos.y;
    this.node.active = true; // this.particle.resetSystem()

    this.node.scale = 1;
    setTimeout(function () {
      _this.node.active = false;

      _this.particle.stopSystem(); //  s.scoreParticlePool.put(this.node)

    }, time / 1 //(cc.game.getFrameRate() / 60)
    );
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzY29yZVBhcnRpY2xlLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwicGFydGljbGUiLCJQYXJ0aWNsZVN5c3RlbSIsImluaXQiLCJzIiwicG9zIiwidGltZSIsIl9nYW1lU2NvcmUiLCJub2RlIiwieCIsInkiLCJhY3RpdmUiLCJzY2FsZSIsInNldFRpbWVvdXQiLCJzdG9wU3lzdGVtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUdQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsUUFBUSxFQUFFSixFQUFFLENBQUNLO0FBREgsR0FITDtBQU9QO0FBRUE7QUFDQUMsRUFBQUEsSUFWTyxnQkFVRkMsQ0FWRSxFQVVDQyxHQVZELEVBVU1DLElBVk4sRUFVWTtBQUFBOztBQUNqQixTQUFLQyxVQUFMLEdBQWtCSCxDQUFsQjtBQUNBLFNBQUtJLElBQUwsQ0FBVUMsQ0FBVixHQUFjSixHQUFHLENBQUNJLENBQWxCO0FBQ0EsU0FBS0QsSUFBTCxDQUFVRSxDQUFWLEdBQWNMLEdBQUcsQ0FBQ0ssQ0FBbEI7QUFDQSxTQUFLRixJQUFMLENBQVVHLE1BQVYsR0FBbUIsSUFBbkIsQ0FKaUIsQ0FLakI7O0FBQ0EsU0FBS0gsSUFBTCxDQUFVSSxLQUFWLEdBQWtCLENBQWxCO0FBQ0FDLElBQUFBLFVBQVUsQ0FBQyxZQUFNO0FBQ2IsTUFBQSxLQUFJLENBQUNMLElBQUwsQ0FBVUcsTUFBVixHQUFtQixLQUFuQjs7QUFDQSxNQUFBLEtBQUksQ0FBQ1YsUUFBTCxDQUFjYSxVQUFkLEdBRmEsQ0FHYjs7QUFDRCxLQUpPLEVBSUxSLElBQUksR0FBRyxDQUpGLENBS1I7QUFMUSxLQUFWO0FBT0QsR0F4Qk0sQ0EwQlA7O0FBMUJPLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gIHByb3BlcnRpZXM6IHtcbiAgICBwYXJ0aWNsZTogY2MuUGFydGljbGVTeXN0ZW0sXG4gIH0sXG5cbiAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XG5cbiAgLy8gb25Mb2FkICgpIHt9LFxuICBpbml0KHMsIHBvcywgdGltZSkge1xuICAgIHRoaXMuX2dhbWVTY29yZSA9IHNcbiAgICB0aGlzLm5vZGUueCA9IHBvcy54XG4gICAgdGhpcy5ub2RlLnkgPSBwb3MueVxuICAgIHRoaXMubm9kZS5hY3RpdmUgPSB0cnVlXG4gICAgLy8gdGhpcy5wYXJ0aWNsZS5yZXNldFN5c3RlbSgpXG4gICAgdGhpcy5ub2RlLnNjYWxlID0gMVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgdGhpcy5wYXJ0aWNsZS5zdG9wU3lzdGVtKClcbiAgICAgICAgLy8gIHMuc2NvcmVQYXJ0aWNsZVBvb2wucHV0KHRoaXMubm9kZSlcbiAgICAgIH0sIHRpbWUgLyAxXG4gICAgICAvLyhjYy5nYW1lLmdldEZyYW1lUmF0ZSgpIC8gNjApXG4gICAgKVxuICB9XG5cbiAgLy8gdXBkYXRlIChkdCkge30sXG59KTsiXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/startPage.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'b55a72WBPhBorvnSW4KT5tu', 'startPage');
// Script/startPage.js

"use strict";

/**
 * @author heyuchang
 * @file 开始页面控制
 */
cc.Class({
  "extends": cc.Component,
  properties: {
    bannerNode: cc.Node,
    labelNode: cc.Node
  },
  start: function start() {},
  onTouched: function onTouched() {},
  showAnimation: function showAnimation() {
    var _this = this;

    return new Promise(function (resolve, rejects) {
      var action1 = cc.scaleTo(0.5, 0, 0).easing(cc.easeBackIn());
      var action2 = cc.blink(0.5, 3);

      _this.bannerNode.runAction(action1);

      var action = cc.sequence(action2, cc.callFunc(function () {
        resolve();
      }));

      _this.labelNode.runAction(action);
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzdGFydFBhZ2UuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJiYW5uZXJOb2RlIiwiTm9kZSIsImxhYmVsTm9kZSIsInN0YXJ0Iiwib25Ub3VjaGVkIiwic2hvd0FuaW1hdGlvbiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0cyIsImFjdGlvbjEiLCJzY2FsZVRvIiwiZWFzaW5nIiwiZWFzZUJhY2tJbiIsImFjdGlvbjIiLCJibGluayIsInJ1bkFjdGlvbiIsImFjdGlvbiIsInNlcXVlbmNlIiwiY2FsbEZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFJQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFFUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLFVBQVUsRUFBRUosRUFBRSxDQUFDSyxJQURMO0FBRVZDLElBQUFBLFNBQVMsRUFBRU4sRUFBRSxDQUFDSztBQUZKLEdBRkw7QUFNUEUsRUFBQUEsS0FOTyxtQkFNQyxDQUVQLENBUk07QUFVUEMsRUFBQUEsU0FWTyx1QkFVSyxDQUVYLENBWk07QUFhUEMsRUFBQUEsYUFiTywyQkFhUztBQUFBOztBQUNkLFdBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsT0FBVixFQUFzQjtBQUN2QyxVQUFJQyxPQUFPLEdBQUdiLEVBQUUsQ0FBQ2MsT0FBSCxDQUFXLEdBQVgsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0JDLE1BQXRCLENBQTZCZixFQUFFLENBQUNnQixVQUFILEVBQTdCLENBQWQ7QUFDQSxVQUFJQyxPQUFPLEdBQUdqQixFQUFFLENBQUNrQixLQUFILENBQVMsR0FBVCxFQUFjLENBQWQsQ0FBZDs7QUFDQSxNQUFBLEtBQUksQ0FBQ2QsVUFBTCxDQUFnQmUsU0FBaEIsQ0FBMEJOLE9BQTFCOztBQUNBLFVBQUlPLE1BQU0sR0FBR3BCLEVBQUUsQ0FBQ3FCLFFBQUgsQ0FBWUosT0FBWixFQUFxQmpCLEVBQUUsQ0FBQ3NCLFFBQUgsQ0FBWSxZQUFNO0FBQ2xEWCxRQUFBQSxPQUFPO0FBQ1IsT0FGaUMsQ0FBckIsQ0FBYjs7QUFHQSxNQUFBLEtBQUksQ0FBQ0wsU0FBTCxDQUFlYSxTQUFmLENBQXlCQyxNQUF6QjtBQUNELEtBUk0sQ0FBUDtBQVNEO0FBdkJNLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBoZXl1Y2hhbmdcbiAqIEBmaWxlIOW8gOWni+mhtemdouaOp+WItlxuICovXG5jYy5DbGFzcyh7XG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgcHJvcGVydGllczoge1xuICAgIGJhbm5lck5vZGU6IGNjLk5vZGUsXG4gICAgbGFiZWxOb2RlOiBjYy5Ob2RlLFxuICB9LFxuICBzdGFydCgpIHtcblxuICB9LFxuXG4gIG9uVG91Y2hlZCgpIHtcblxuICB9LFxuICBzaG93QW5pbWF0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0cykgPT4ge1xuICAgICAgbGV0IGFjdGlvbjEgPSBjYy5zY2FsZVRvKDAuNSwgMCwgMCkuZWFzaW5nKGNjLmVhc2VCYWNrSW4oKSlcbiAgICAgIGxldCBhY3Rpb24yID0gY2MuYmxpbmsoMC41LCAzKVxuICAgICAgdGhpcy5iYW5uZXJOb2RlLnJ1bkFjdGlvbihhY3Rpb24xKVxuICAgICAgbGV0IGFjdGlvbiA9IGNjLnNlcXVlbmNlKGFjdGlvbjIsIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9KSlcbiAgICAgIHRoaXMubGFiZWxOb2RlLnJ1bkFjdGlvbihhY3Rpb24pXG4gICAgfSlcbiAgfSxcbn0pOyJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/migration/use_v2.0.x_cc.Toggle_event.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '4e2d6mBW+ZB87giGuk+ow6A', 'use_v2.0.x_cc.Toggle_event');
// migration/use_v2.0.x_cc.Toggle_event.js

"use strict";

/*
 * This script is automatically generated by Cocos Creator and is only compatible with projects prior to v2.1.0.
 * You do not need to manually add this script in any other project.
 * If you don't use cc.Toggle in your project, you can delete this script directly.
 * If your project is hosted in VCS such as git, submit this script together.
 *
 * 此脚本由 Cocos Creator 自动生成，仅用于兼容 v2.1.0 之前版本的工程，
 * 你无需在任何其它项目中手动添加此脚本。
 * 如果你的项目中没用到 Toggle，可直接删除该脚本。
 * 如果你的项目有托管于 git 等版本库，请将此脚本一并上传。
 */
if (cc.Toggle) {
  // Whether the 'toggle' and 'checkEvents' events are fired when 'toggle.check() / toggle.uncheck()' is called in the code
  // 在代码中调用 'toggle.check() / toggle.uncheck()' 时是否触发 'toggle' 与 'checkEvents' 事件
  cc.Toggle._triggerEventInScript_check = true;
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcbWlncmF0aW9uXFx1c2VfdjIuMC54X2NjLlRvZ2dsZV9ldmVudC5qcyJdLCJuYW1lcyI6WyJjYyIsIlRvZ2dsZSIsIl90cmlnZ2VyRXZlbnRJblNjcmlwdF9jaGVjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7QUFZQSxJQUFJQSxFQUFFLENBQUNDLE1BQVAsRUFBZTtBQUNYO0FBQ0E7QUFDQUQsRUFBQUEsRUFBRSxDQUFDQyxNQUFILENBQVVDLDJCQUFWLEdBQXdDLElBQXhDO0FBQ0giLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBUaGlzIHNjcmlwdCBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBDb2NvcyBDcmVhdG9yIGFuZCBpcyBvbmx5IGNvbXBhdGlibGUgd2l0aCBwcm9qZWN0cyBwcmlvciB0byB2Mi4xLjAuXG4gKiBZb3UgZG8gbm90IG5lZWQgdG8gbWFudWFsbHkgYWRkIHRoaXMgc2NyaXB0IGluIGFueSBvdGhlciBwcm9qZWN0LlxuICogSWYgeW91IGRvbid0IHVzZSBjYy5Ub2dnbGUgaW4geW91ciBwcm9qZWN0LCB5b3UgY2FuIGRlbGV0ZSB0aGlzIHNjcmlwdCBkaXJlY3RseS5cbiAqIElmIHlvdXIgcHJvamVjdCBpcyBob3N0ZWQgaW4gVkNTIHN1Y2ggYXMgZ2l0LCBzdWJtaXQgdGhpcyBzY3JpcHQgdG9nZXRoZXIuXG4gKlxuICog5q2k6ISa5pys55SxIENvY29zIENyZWF0b3Ig6Ieq5Yqo55Sf5oiQ77yM5LuF55So5LqO5YW85a65IHYyLjEuMCDkuYvliY3niYjmnKznmoTlt6XnqIvvvIxcbiAqIOS9oOaXoOmcgOWcqOS7u+S9leWFtuWug+mhueebruS4reaJi+WKqOa3u+WKoOatpOiEmuacrOOAglxuICog5aaC5p6c5L2g55qE6aG555uu5Lit5rKh55So5YiwIFRvZ2dsZe+8jOWPr+ebtOaOpeWIoOmZpOivpeiEmuacrOOAglxuICog5aaC5p6c5L2g55qE6aG555uu5pyJ5omY566h5LqOIGdpdCDnrYnniYjmnKzlupPvvIzor7flsIbmraTohJrmnKzkuIDlubbkuIrkvKDjgIJcbiAqL1xuXG5pZiAoY2MuVG9nZ2xlKSB7XG4gICAgLy8gV2hldGhlciB0aGUgJ3RvZ2dsZScgYW5kICdjaGVja0V2ZW50cycgZXZlbnRzIGFyZSBmaXJlZCB3aGVuICd0b2dnbGUuY2hlY2soKSAvIHRvZ2dsZS51bmNoZWNrKCknIGlzIGNhbGxlZCBpbiB0aGUgY29kZVxuICAgIC8vIOWcqOS7o+eggeS4reiwg+eUqCAndG9nZ2xlLmNoZWNrKCkgLyB0b2dnbGUudW5jaGVjaygpJyDml7bmmK/lkKbop6blj5EgJ3RvZ2dsZScg5LiOICdjaGVja0V2ZW50cycg5LqL5Lu2XG4gICAgY2MuVG9nZ2xlLl90cmlnZ2VyRXZlbnRJblNjcmlwdF9jaGVjayA9IHRydWU7XG59XG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/wx111.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f33c5v8FmBF47kPNI4VMjKM', 'wx111');
// Script/wx111.js

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var env = {
  USER_DATA_PATH: ""
};

var FileSystemManager = /*#__PURE__*/function () {
  function FileSystemManager() {
    _classCallCheck(this, FileSystemManager);
  }

  _createClass(FileSystemManager, [{
    key: "stat",
    value: function stat() {
      return {};
    }
  }]);

  return FileSystemManager;
}();

var WXColl = /*#__PURE__*/function () {
  function WXColl() {
    _classCallCheck(this, WXColl);
  }

  _createClass(WXColl, [{
    key: "get",
    value: function get() {
      return new Promise(function () {}, function () {});
    }
  }]);

  return WXColl;
}();

var WXDB = /*#__PURE__*/function () {
  function WXDB() {
    _classCallCheck(this, WXDB);
  }

  _createClass(WXDB, [{
    key: "collection",
    value: function collection() {
      return new WXColl();
    }
  }]);

  return WXDB;
}();

var WXClcoud = /*#__PURE__*/function () {
  function WXClcoud() {
    _classCallCheck(this, WXClcoud);
  }

  _createClass(WXClcoud, [{
    key: "database",
    value: function database() {
      return new WXDB();
    }
  }]);

  return WXClcoud;
}();

var wechat = /*#__PURE__*/function () {
  function wechat() {
    _classCallCheck(this, wechat);

    this.env = env;
    this.cloud = new WXClcoud();
  }

  _createClass(wechat, [{
    key: "createInnerAudioContext",
    value: function createInnerAudioContext() {
      return {
        stop: function stop() {},
        play: function play() {},
        onSeeked: function onSeeked() {}
      };
    }
  }, {
    key: "getSystemInfoSync",
    value: function getSystemInfoSync() {
      return {};
    }
  }, {
    key: "showShareMenu",
    value: function showShareMenu() {}
  }, {
    key: "updateShareMenu",
    value: function updateShareMenu() {}
  }, {
    key: "onShareAppMessage",
    value: function onShareAppMessage() {}
  }, {
    key: "shareAppMessage",
    value: function shareAppMessage() {}
  }, {
    key: "createRewardedVideoAd",
    value: function createRewardedVideoAd() {
      return {
        onLoad: function onLoad() {},
        onError: function onError() {},
        onClose: function onClose() {},
        load: function load() {
          return new Promise(function () {}, function () {});
        }
      };
    }
  }, {
    key: "vibrateShort",
    value: function vibrateShort() {}
  }, {
    key: "createBannerAd",
    value: function createBannerAd() {
      return {
        onLoad: function onLoad() {},
        onResize: function onResize() {},
        onError: function onError() {},
        show: function show() {},
        hide: function hide() {},
        destroy: function destroy() {}
      };
    }
  }, {
    key: "getFileSystemManager",
    value: function getFileSystemManager() {
      if (!this.fs) {
        this.fs = new FileSystemManager();
      }

      return this.fs;
    }
  }, {
    key: "login",
    value: function login() {}
  }, {
    key: "getSystemInfo",
    value: function getSystemInfo() {}
  }, {
    key: "onShow",
    value: function onShow() {}
  }, {
    key: "postMessage",
    value: function postMessage() {}
  }, {
    key: "request",
    value: function request(e) {}
  }, {
    key: "onAudioInterruptionEnd",
    value: function onAudioInterruptionEnd() {}
  }, {
    key: "onHide",
    value: function onHide() {}
  }, {
    key: "getStorageSync",
    value: function getStorageSync() {
      return "";
    }
  }]);

  return wechat;
}();

if (!window.wx) {
  window.wx = new wechat();
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFx3eDExMS5qcyJdLCJuYW1lcyI6WyJlbnYiLCJVU0VSX0RBVEFfUEFUSCIsIkZpbGVTeXN0ZW1NYW5hZ2VyIiwiV1hDb2xsIiwiUHJvbWlzZSIsIldYREIiLCJXWENsY291ZCIsIndlY2hhdCIsImNsb3VkIiwic3RvcCIsInBsYXkiLCJvblNlZWtlZCIsIm9uTG9hZCIsIm9uRXJyb3IiLCJvbkNsb3NlIiwibG9hZCIsIm9uUmVzaXplIiwic2hvdyIsImhpZGUiLCJkZXN0cm95IiwiZnMiLCJlIiwid2luZG93Iiwid3giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsR0FBRyxHQUFHO0FBQ05DLEVBQUFBLGNBQWMsRUFBRTtBQURWLENBQVY7O0lBSU1DOzs7Ozs7OzJCQUNLO0FBQ0gsYUFBTyxFQUFQO0FBQ0g7Ozs7OztJQUdDQzs7Ozs7OzswQkFDSTtBQUNGLGFBQU8sSUFBSUMsT0FBSixDQUFZLFlBQUksQ0FBRSxDQUFsQixFQUFvQixZQUFJLENBQUUsQ0FBMUIsQ0FBUDtBQUNIOzs7Ozs7SUFHQ0M7Ozs7Ozs7aUNBQ1c7QUFDVCxhQUFPLElBQUlGLE1BQUosRUFBUDtBQUNIOzs7Ozs7SUFHQ0c7QUFDRixzQkFBYztBQUFBO0FBQ2I7Ozs7K0JBRVU7QUFDUCxhQUFPLElBQUlELElBQUosRUFBUDtBQUNIOzs7Ozs7SUFHQ0U7QUFDRixvQkFBYztBQUFBOztBQUNWLFNBQUtQLEdBQUwsR0FBV0EsR0FBWDtBQUNBLFNBQUtRLEtBQUwsR0FBYSxJQUFJRixRQUFKLEVBQWI7QUFDSDs7Ozs4Q0FFMEI7QUFDdkIsYUFBTztBQUNIRyxRQUFBQSxJQURHLGtCQUNJLENBQUUsQ0FETjtBQUVIQyxRQUFBQSxJQUZHLGtCQUVJLENBQUUsQ0FGTjtBQUdIQyxRQUFBQSxRQUhHLHNCQUdRLENBQUU7QUFIVixPQUFQO0FBS0g7Ozt3Q0FDb0I7QUFDakIsYUFBTyxFQUFQO0FBQ0g7OztvQ0FFZSxDQUVmOzs7c0NBRWlCLENBRWpCOzs7d0NBRW1CLENBRW5COzs7c0NBQ2lCLENBRWpCOzs7NENBQ3VCO0FBQ3BCLGFBQU87QUFDSEMsUUFBQUEsTUFERyxvQkFDTSxDQUFFLENBRFI7QUFFSEMsUUFBQUEsT0FGRyxxQkFFTyxDQUFFLENBRlQ7QUFHSEMsUUFBQUEsT0FIRyxxQkFHTyxDQUFFLENBSFQ7QUFJSEMsUUFBQUEsSUFKRyxrQkFJSTtBQUNILGlCQUFPLElBQUlYLE9BQUosQ0FBWSxZQUFJLENBQUUsQ0FBbEIsRUFBb0IsWUFBSSxDQUFFLENBQTFCLENBQVA7QUFDSDtBQU5FLE9BQVA7QUFRSDs7O21DQUNjLENBQUU7OztxQ0FFQTtBQUNiLGFBQU87QUFDSFEsUUFBQUEsTUFERyxvQkFDTSxDQUFFLENBRFI7QUFFSEksUUFBQUEsUUFGRyxzQkFFUSxDQUFFLENBRlY7QUFHSEgsUUFBQUEsT0FIRyxxQkFHTyxDQUFFLENBSFQ7QUFJSEksUUFBQUEsSUFKRyxrQkFJSSxDQUFFLENBSk47QUFLSEMsUUFBQUEsSUFMRyxrQkFLSSxDQUFFLENBTE47QUFNSEMsUUFBQUEsT0FORyxxQkFNTyxDQUFFO0FBTlQsT0FBUDtBQVFIOzs7MkNBRXNCO0FBQ25CLFVBQUksQ0FBQyxLQUFLQyxFQUFWLEVBQWM7QUFDVixhQUFLQSxFQUFMLEdBQVUsSUFBSWxCLGlCQUFKLEVBQVY7QUFDSDs7QUFDRCxhQUFPLEtBQUtrQixFQUFaO0FBQ0g7Ozs0QkFFTyxDQUVQOzs7b0NBRWUsQ0FFZjs7OzZCQUVRLENBRVI7OztrQ0FDYSxDQUViOzs7NEJBRU9DLEdBQUcsQ0FDVjs7OzZDQUV5QixDQUV6Qjs7OzZCQUVRLENBRVI7OztxQ0FFZ0I7QUFDYixhQUFPLEVBQVA7QUFDSDs7Ozs7O0FBR0wsSUFBSSxDQUFDQyxNQUFNLENBQUNDLEVBQVosRUFBZ0I7QUFDWkQsRUFBQUEsTUFBTSxDQUFDQyxFQUFQLEdBQVksSUFBSWhCLE1BQUosRUFBWjtBQUNIIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgZW52ID0ge1xuICAgIFVTRVJfREFUQV9QQVRIOiBcIlwiLFxufVxuXG5jbGFzcyBGaWxlU3lzdGVtTWFuYWdlciB7XG4gICAgc3RhdCgpIHtcbiAgICAgICAgcmV0dXJuIHt9XG4gICAgfVxufVxuXG5jbGFzcyBXWENvbGwge1xuICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCgpPT57fSwgKCk9Pnt9KVxuICAgIH1cbn1cblxuY2xhc3MgV1hEQiB7XG4gICAgY29sbGVjdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBXWENvbGxcbiAgICB9XG59XG5cbmNsYXNzIFdYQ2xjb3VkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBkYXRhYmFzZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBXWERCXG4gICAgfVxufVxuXG5jbGFzcyB3ZWNoYXQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmVudiA9IGVudlxuICAgICAgICB0aGlzLmNsb3VkID0gbmV3IFdYQ2xjb3VkKClcbiAgICB9XG5cbiAgICBjcmVhdGVJbm5lckF1ZGlvQ29udGV4dCAoKSB7IFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RvcCgpIHt9LFxuICAgICAgICAgICAgcGxheSgpIHt9LFxuICAgICAgICAgICAgb25TZWVrZWQoKSB7fSxcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXRTeXN0ZW1JbmZvU3luYyAoKSB7XG4gICAgICAgIHJldHVybiB7fVxuICAgIH1cblxuICAgIHNob3dTaGFyZU1lbnUoKSB7XG5cbiAgICB9XG5cbiAgICB1cGRhdGVTaGFyZU1lbnUoKSB7XG5cbiAgICB9XG5cbiAgICBvblNoYXJlQXBwTWVzc2FnZSgpIHtcbiAgICAgICAgXG4gICAgfVxuICAgIHNoYXJlQXBwTWVzc2FnZSgpIHtcbiAgICAgICAgXG4gICAgfVxuICAgIGNyZWF0ZVJld2FyZGVkVmlkZW9BZCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9uTG9hZCgpIHt9LFxuICAgICAgICAgICAgb25FcnJvcigpIHt9LFxuICAgICAgICAgICAgb25DbG9zZSgpIHt9LFxuICAgICAgICAgICAgbG9hZCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKCk9Pnt9LCAoKT0+e30pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmlicmF0ZVNob3J0KCkge31cblxuICAgIGNyZWF0ZUJhbm5lckFkKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb25Mb2FkKCkge30sXG4gICAgICAgICAgICBvblJlc2l6ZSgpIHt9LFxuICAgICAgICAgICAgb25FcnJvcigpIHt9LFxuICAgICAgICAgICAgc2hvdygpIHt9LFxuICAgICAgICAgICAgaGlkZSgpIHt9LFxuICAgICAgICAgICAgZGVzdHJveSgpIHt9LFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RmlsZVN5c3RlbU1hbmFnZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5mcykge1xuICAgICAgICAgICAgdGhpcy5mcyA9IG5ldyBGaWxlU3lzdGVtTWFuYWdlclxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmZzXG4gICAgfVxuXG4gICAgbG9naW4oKSB7XG5cbiAgICB9XG5cbiAgICBnZXRTeXN0ZW1JbmZvKCkge1xuXG4gICAgfVxuXG4gICAgb25TaG93KCkge1xuICAgICAgICBcbiAgICB9XG4gICAgcG9zdE1lc3NhZ2UoKSB7XG4gICAgICBcbiAgICB9XG5cbiAgICByZXF1ZXN0KGUpIHtcbiAgICB9XG5cbiAgICBvbkF1ZGlvSW50ZXJydXB0aW9uRW5kICgpIHtcblxuICAgIH1cblxuICAgIG9uSGlkZSgpIHtcblxuICAgIH1cblxuICAgIGdldFN0b3JhZ2VTeW5jKCkge1xuICAgICAgICByZXR1cm4gXCJcIlxuICAgIH1cbn1cblxuaWYgKCF3aW5kb3cud3gpIHtcbiAgICB3aW5kb3cud3ggPSBuZXcgd2VjaGF0XG59XG5cbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/GameAct.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '9d3711KFVFCZ6a/86BjU5eU', 'GameAct');
// Script/GameAct.js

"use strict";

var _this = void 0;

/**
 * @author heyuchang
 * @file 所有的简单动作集合
 */
// 震动动作 0.1效果比较好
function shackAction(time, range) {
  var action1 = cc.moveBy(time, range, range);
  var action2 = cc.moveBy(time, -range, -range);
  var action3 = cc.moveBy(time * 0.8, range * 0.8, range * 0.8);
  var action4 = cc.moveBy(time * 0.8, -range * 0.8, -range * 0.8);
  var action5 = cc.moveBy(time * 0.6, range * 0.6, range * 0.6);
  var action6 = cc.moveBy(time * 0.6, -range * 0.6, -range * 0.6);
  var action7 = cc.moveBy(time * 0.4, range * 0.4, range * 0.4);
  var action8 = cc.moveBy(time * 0.4, -range * 0.4, -range * 0.4);
  var action9 = cc.moveBy(time * 0.2, range * 0.2, range * 0.2);
  var action10 = cc.moveBy(time * 0.2, -range * 0.2, -range * 0.2);
  var sq = cc.sequence(action1, action2, action3, action4, action5, action6, action7, action8, action9, action10);
  return sq;
} // Helper function to create a rotation tween


var createRotationTween = function createRotationTween(duration, xRotation, yRotation) {
  return cc.tween(duration).to(cc.Node.prototype.setRotation, {
    x: _this.node.rotationX + xRotation,
    y: _this.node.rotationY + yRotation
  }, {
    rotationX: '+=',
    rotationY: '+='
  }).action();
}; // Helper function to create a rotation to zero tween


var createZeroRotationTween = function createZeroRotationTween(duration) {
  return cc.tween(duration).to(cc.Node.prototype.setRotation, {
    x: 0,
    y: 0
  }).action();
}; // 晃动动作


function rockAction(time, range) {
  var action1 = cc.rotateBy(time, range, range);
  var action2 = cc.rotateBy(time, -2 * range, -2 * range);
  var action3 = cc.rotateBy(time * 0.8, 2 * range * 0.8, 2 * range * 0.8);
  var action6 = cc.rotateBy(time * 0.6, -2 * range * 0.6, -2 * range * 0.6);
  var action7 = cc.rotateBy(time * 0.4, 2 * range * 0.4, 2 * range * 0.4);
  var action10 = cc.rotateTo(time * 0.2, 0, 0);
  var sq = cc.sequence(action1, action2, action3, action6, action7, action10);
  return sq;
} // 弹出效果


function popOut(time) {
  return cc.scaleTo(time, 1).easing(cc.easeBackOut(2.0));
} // 收入效果


function popIn(time) {
  return cc.scaleTo(time, 0.5).easing(cc.easeBackIn(2.0));
}

function heartBeat() {
  var action1 = cc.scaleTo(0.2, 1.2).easing(cc.easeElasticInOut());
  var action2 = cc.scaleTo(0.2, 1).easing(cc.easeElasticInOut());
  var action3 = cc.rotateTo(0.1, 45);
  var action4 = cc.rotateTo(0.2, -45);
  var action5 = cc.rotateTo(0.1, 0);
} //翻页效果 前两个传node type传数字 左右旋转的


function pageTurning(pageUp, pageDown, typeA) {
  switch (typeA) {
    case 0:
      pageUp.runAction(cc.fadeOut(0.6));
      pageDown.runAction(cc.delayTime(0.6), cc.fadeIn(0.6), cc.sequence(cc.callFunc(function () {
        pageUp.active = false;
      }, this, pageUp)));
      break;

    case 1:
      pageDown.scaleX = 0;
      pageUp.runAction(cc.scaleTo(0.6, 0, 1));
      pageDown.runAction(cc.sequence(cc.delayTime(0.6), cc.callFunc(function () {
        pageUp.active = false;
      }, this, pageUp), cc.scaleTo(0.6, 1, 1)));
      break;

    case 2:
      break;
  }
} //移动到屏幕外 并且隐藏  0123 上右下左 会移动一个屏幕的距离 然后直接消失


function getMoveOutofScreenActive(typeA, winWidth, winHeight, delTime) {
  switch (typeA) {
    case 0:
      return cc.moveBy(delTime, 0, winHeight);

    case 1:
      return cc.moveBy(delTime, winWidth, 0);

    case 2:
      return cc.moveBy(delTime, 0, -winHeight);

    case 3:
      return cc.moveBy(delTime, -winWidth, 0);
  }
} //从屏幕外进入 上右下左


function getMoveInScreenActive(typeA, winWidth, winHeight, delTime) {
  switch (typeA) {
    case 0:
      return cc.moveBy(delTime, 0, -winHeight);

    case 1:
      return cc.moveBy(delTime, -winWidth, 0);

    case 2:
      return cc.moveBy(delTime, 0, winHeight);

    case 3:
      return cc.moveBy(delTime, winWidth, 0);
  }
} //闪烁动作


function blinkAction(delTime) {
  return cc.repeatForever(cc.sequence(cc.fadeOut(delTime), cc.fadeIn(delTime)));
}

module.exports = {
  shackAction: shackAction,
  blinkAction: blinkAction,
  pageTurning: pageTurning,
  heartBeat: heartBeat,
  getMoveOutofScreenActive: getMoveOutofScreenActive,
  popOut: popOut,
  popIn: popIn,
  getMoveInScreenActive: getMoveInScreenActive,
  rockAction: rockAction
};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxHYW1lQWN0LmpzIl0sIm5hbWVzIjpbInNoYWNrQWN0aW9uIiwidGltZSIsInJhbmdlIiwiYWN0aW9uMSIsImNjIiwibW92ZUJ5IiwiYWN0aW9uMiIsImFjdGlvbjMiLCJhY3Rpb240IiwiYWN0aW9uNSIsImFjdGlvbjYiLCJhY3Rpb243IiwiYWN0aW9uOCIsImFjdGlvbjkiLCJhY3Rpb24xMCIsInNxIiwic2VxdWVuY2UiLCJjcmVhdGVSb3RhdGlvblR3ZWVuIiwiZHVyYXRpb24iLCJ4Um90YXRpb24iLCJ5Um90YXRpb24iLCJ0d2VlbiIsInRvIiwiTm9kZSIsInByb3RvdHlwZSIsInNldFJvdGF0aW9uIiwieCIsIm5vZGUiLCJyb3RhdGlvblgiLCJ5Iiwicm90YXRpb25ZIiwiYWN0aW9uIiwiY3JlYXRlWmVyb1JvdGF0aW9uVHdlZW4iLCJyb2NrQWN0aW9uIiwicm90YXRlQnkiLCJyb3RhdGVUbyIsInBvcE91dCIsInNjYWxlVG8iLCJlYXNpbmciLCJlYXNlQmFja091dCIsInBvcEluIiwiZWFzZUJhY2tJbiIsImhlYXJ0QmVhdCIsImVhc2VFbGFzdGljSW5PdXQiLCJwYWdlVHVybmluZyIsInBhZ2VVcCIsInBhZ2VEb3duIiwidHlwZUEiLCJydW5BY3Rpb24iLCJmYWRlT3V0IiwiZGVsYXlUaW1lIiwiZmFkZUluIiwiY2FsbEZ1bmMiLCJhY3RpdmUiLCJzY2FsZVgiLCJnZXRNb3ZlT3V0b2ZTY3JlZW5BY3RpdmUiLCJ3aW5XaWR0aCIsIndpbkhlaWdodCIsImRlbFRpbWUiLCJnZXRNb3ZlSW5TY3JlZW5BY3RpdmUiLCJibGlua0FjdGlvbiIsInJlcGVhdEZvcmV2ZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFLQTtBQUNBLFNBQVNBLFdBQVQsQ0FBcUJDLElBQXJCLEVBQTJCQyxLQUEzQixFQUFrQztBQUNoQyxNQUFJQyxPQUFPLEdBQUdDLEVBQUUsQ0FB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QUNBLFNBQVNJLFdBQVQsQ0FBcUJGLE9BQXJCLEVBQThCO0FBQzVCLFNBQU90RCxFQUFFLENBQUN5RCxhQUFILENBQWlCekQsRUFBRSxDQUFDWSxRQUFILENBQVlaLEVBQUUsQ0FBQzZDLE9BQUgsQ0FBV1MsT0FBWCxDQUFaLEVBQWlDdEQsRUFBRSxDQUFDK0MsTUFBSCxDQUFVTyxPQUFWLENBQWpDLENBQWpCLENBQVA7QUFDRDs7QUFDREksTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2YvRCxFQUFBQSxXQUFXLEVBQUVBLFdBREU7QUFFZjRELEVBQUFBLFdBQVcsRUFBRUEsV0FGRTtBQUdmaEIsRUFBQUEsV0FBVyxFQUFFQSxXQUhFO0FBSWZGLEVBQUFBLFNBQVMsRUFBRUEsU0FKSTtBQUtmYSxFQUFBQSx3QkFBd0IsRUFBRUEsd0JBTFg7QUFNZm5CLEVBQUFBLE1BQU0sRUFBRUEsTUFOTztBQU9mSSxFQUFBQSxLQUFLLEVBQUVBLEtBUFE7QUFRZm1CLEVBQUFBLHFCQUFxQixFQUFFQSxxQkFSUjtBQVNmMUIsRUFBQUEsVUFBVSxFQUFFQTtBQVRHLENBQWpCIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBhdXRob3IgaGV5dWNoYW5nXG4gKiBAZmlsZSDmiYDmnInnmoTnroDljZXliqjkvZzpm4blkIhcbiAqL1xuXG4vLyDpnIfliqjliqjkvZwgMC4x5pWI5p6c5q+U6L6D5aW9XG5mdW5jdGlvbiBzaGFja0FjdGlvbih0aW1lLCByYW5nZSkge1xuICBsZXQgYWN0aW9uMSA9IGNjLm1vdmVCeSh0aW1lLCByYW5nZSwgcmFuZ2UpXG4gIGxldCBhY3Rpb24yID0gY2MubW92ZUJ5KHRpbWUsIC1yYW5nZSwgLXJhbmdlKVxuICBsZXQgYWN0aW9uMyA9IGNjLm1vdmVCeSh0aW1lICogMC44LCByYW5nZSAqIDAuOCwgcmFuZ2UgKiAwLjgpXG4gIGxldCBhY3Rpb240ID0gY2MubW92ZUJ5KHRpbWUgKiAwLjgsIC1yYW5nZSAqIDAuOCwgLXJhbmdlICogMC44KVxuICBsZXQgYWN0aW9uNSA9IGNjLm1vdmVCeSh0aW1lICogMC42LCByYW5nZSAqIDAuNiwgcmFuZ2UgKiAwLjYpXG4gIGxldCBhY3Rpb242ID0gY2MubW92ZUJ5KHRpbWUgKiAwLjYsIC1yYW5nZSAqIDAuNiwgLXJhbmdlICogMC42KVxuICBsZXQgYWN0aW9uNyA9IGNjLm1vdmVCeSh0aW1lICogMC40LCByYW5nZSAqIDAuNCwgcmFuZ2UgKiAwLjQpXG4gIGxldCBhY3Rpb244ID0gY2MubW92ZUJ5KHRpbWUgKiAwLjQsIC1yYW5nZSAqIDAuNCwgLXJhbmdlICogMC40KVxuICBsZXQgYWN0aW9uOSA9IGNjLm1vdmVCeSh0aW1lICogMC4yLCByYW5nZSAqIDAuMiwgcmFuZ2UgKiAwLjIpXG4gIGxldCBhY3Rpb24xMCA9IGNjLm1vdmVCeSh0aW1lICogMC4yLCAtcmFuZ2UgKiAwLjIsIC1yYW5nZSAqIDAuMilcbiAgbGV0IHNxID0gY2Muc2VxdWVuY2UoYWN0aW9uMSwgYWN0aW9uMiwgYWN0aW9uMywgYWN0aW9uNCwgYWN0aW9uNSwgYWN0aW9uNiwgYWN0aW9uNywgYWN0aW9uOCwgYWN0aW9uOSwgYWN0aW9uMTApXG4gIHJldHVybiBzcVxufVxuXG4gLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIHJvdGF0aW9uIHR3ZWVuXG4gY29uc3QgY3JlYXRlUm90YXRpb25Ud2VlbiA9IChkdXJhdGlvbiwgeFJvdGF0aW9uLCB5Um90YXRpb24pID0+IHtcbiAgcmV0dXJuIGNjLnR3ZWVuKGR1cmF0aW9uKVxuICAgIC50byhjYy5Ob2RlLnByb3RvdHlwZS5zZXRSb3RhdGlvbiwge1xuICAgICAgeDogdGhpcy5ub2RlLnJvdGF0aW9uWCArIHhSb3RhdGlvbixcbiAgICAgIHk6IHRoaXMubm9kZS5yb3RhdGlvblkgKyB5Um90YXRpb25cbiAgICB9LCB7cm90YXRpb25YOiAnKz0nLCByb3RhdGlvblk6ICcrPSd9KVxuICAgIC5hY3Rpb24oKTtcbn07XG5cbi8vIEhlbHBlciBmdW5jdGlvbiB0byBjcmVhdGUgYSByb3RhdGlvbiB0byB6ZXJvIHR3ZWVuXG5jb25zdCBjcmVhdGVaZXJvUm90YXRpb25Ud2VlbiA9IChkdXJhdGlvbikgPT4ge1xuICByZXR1cm4gY2MudHdlZW4oZHVyYXRpb24pXG4gICAgLnRvKGNjLk5vZGUucHJvdG90eXBlLnNldFJvdGF0aW9uLCB7eDogMCwgeTogMH0pXG4gICAgLmFjdGlvbigpO1xufTtcblxuLy8g5pmD5Yqo5Yqo5L2cXG5mdW5jdGlvbiByb2NrQWN0aW9uKHRpbWUsIHJhbmdlKSB7XG4gIGxldCBhY3Rpb24xID0gY2Mucm90YXRlQnkodGltZSwgcmFuZ2UsIHJhbmdlKVxuICBsZXQgYWN0aW9uMiA9IGNjLnJvdGF0ZUJ5KHRpbWUsIC0yICogcmFuZ2UsIC0yICogcmFuZ2UpXG4gIGxldCBhY3Rpb24zID0gY2Mucm90YXRlQnkodGltZSAqIDAuOCwgMiAqIHJhbmdlICogMC44LCAyICogcmFuZ2UgKiAwLjgpXG4gIGxldCBhY3Rpb242ID0gY2Mucm90YXRlQnkodGltZSAqIDAuNiwgLTIgKiByYW5nZSAqIDAuNiwgLTIgKiByYW5nZSAqIDAuNilcbiAgbGV0IGFjdGlvbjcgPSBjYy5yb3RhdGVCeSh0aW1lICogMC40LCAyICogcmFuZ2UgKiAwLjQsIDIgKiByYW5nZSAqIDAuNClcbiAgbGV0IGFjdGlvbjEwID0gY2Mucm90YXRlVG8odGltZSAqIDAuMiwgMCwgMClcbiAgbGV0IHNxID0gY2Muc2VxdWVuY2UoYWN0aW9uMSwgYWN0aW9uMiwgYWN0aW9uMywgYWN0aW9uNiwgYWN0aW9uNywgYWN0aW9uMTApXG4gIHJldHVybiBzcVxufVxuXG4vLyDlvLnlh7rmlYjmnpxcbmZ1bmN0aW9uIHBvcE91dCh0aW1lKSB7XG4gIHJldHVybiBjYy5zY2FsZVRvKHRpbWUsIDEpLmVhc2luZyhjYy5lYXNlQmFja091dCgyLjApKVxufVxuLy8g5pS25YWl5pWI5p6cXG5mdW5jdGlvbiBwb3BJbih0aW1lKSB7XG4gIHJldHVybiBjYy5zY2FsZVRvKHRpbWUsIDAuNSkuZWFzaW5nKGNjLmVhc2VCYWNrSW4oMi4wKSlcbn1cblxuZnVuY3Rpb24gaGVhcnRCZWF0KCkge1xuICBsZXQgYWN0aW9uMSA9IGNjLnNjYWxlVG8oMC4yLCAxLjIpLmVhc2luZyhjYy5lYXNlRWxhc3RpY0luT3V0KCkpXG4gIGxldCBhY3Rpb24yID0gY2Muc2NhbGVUbygwLjIsIDEpLmVhc2luZyhjYy5lYXNlRWxhc3RpY0luT3V0KCkpXG4gIGxldCBhY3Rpb24zID0gY2Mucm90YXRlVG8oMC4xLCA0NSlcbiAgbGV0IGFjdGlvbjQgPSBjYy5yb3RhdGVUbygwLjIsIC00NSlcbiAgbGV0IGFjdGlvbjUgPSBjYy5yb3RhdGVUbygwLjEsIDApXG59XG4vL+e/u+mhteaViOaenCDliY3kuKTkuKrkvKBub2RlIHR5cGXkvKDmlbDlrZcg5bem5Y+z5peL6L2s55qEXG5mdW5jdGlvbiBwYWdlVHVybmluZyhwYWdlVXAsIHBhZ2VEb3duLCB0eXBlQSkge1xuICBzd2l0Y2ggKHR5cGVBKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcGFnZVVwLnJ1bkFjdGlvbihjYy5mYWRlT3V0KDAuNikpO1xuICAgICAgcGFnZURvd24ucnVuQWN0aW9uKGNjLmRlbGF5VGltZSgwLjYpLCBjYy5mYWRlSW4oMC42KSwgY2Muc2VxdWVuY2UoY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgICBwYWdlVXAuYWN0aXZlID0gZmFsc2U7XG4gICAgICB9LCB0aGlzLCBwYWdlVXApKSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDE6XG4gICAgICBwYWdlRG93bi5zY2FsZVggPSAwO1xuICAgICAgcGFnZVVwLnJ1bkFjdGlvbihjYy5zY2FsZVRvKDAuNiwgMCwgMSkpXG4gICAgICBwYWdlRG93bi5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2MuZGVsYXlUaW1lKDAuNiksIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgcGFnZVVwLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgfSwgdGhpcywgcGFnZVVwKSwgY2Muc2NhbGVUbygwLjYsIDEsIDEpLCkpXG4gICAgICBicmVhaztcbiAgICBjYXNlIDI6XG4gICAgICBicmVhaztcbiAgfVxufVxuLy/np7vliqjliLDlsY/luZXlpJYg5bm25LiU6ZqQ6JePICAwMTIzIOS4iuWPs+S4i+W3piDkvJrnp7vliqjkuIDkuKrlsY/luZXnmoTot53nprsg54S25ZCO55u05o6l5raI5aSxXG5mdW5jdGlvbiBnZXRNb3ZlT3V0b2ZTY3JlZW5BY3RpdmUodHlwZUEsIHdpbldpZHRoLCB3aW5IZWlnaHQsIGRlbFRpbWUpIHtcbiAgc3dpdGNoICh0eXBlQSkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgMCwgd2luSGVpZ2h0KVxuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgd2luV2lkdGgsIDApXG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIGNjLm1vdmVCeShkZWxUaW1lLCAwLCAtd2luSGVpZ2h0KVxuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgLXdpbldpZHRoLCAwKVxuICB9XG59XG4vL+S7juWxj+W5leWklui/m+WFpSDkuIrlj7PkuIvlt6ZcbmZ1bmN0aW9uIGdldE1vdmVJblNjcmVlbkFjdGl2ZSh0eXBlQSwgd2luV2lkdGgsIHdpbkhlaWdodCwgZGVsVGltZSkge1xuICBzd2l0Y2ggKHR5cGVBKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIGNjLm1vdmVCeShkZWxUaW1lLCAwLCAtd2luSGVpZ2h0KVxuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgLXdpbldpZHRoLCAwKVxuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgMCwgd2luSGVpZ2h0KVxuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgd2luV2lkdGgsIDApXG4gIH1cbn1cbi8v6Zeq54OB5Yqo5L2cXG5mdW5jdGlvbiBibGlua0FjdGlvbihkZWxUaW1lKSB7XG4gIHJldHVybiBjYy5yZXBlYXRGb3JldmVyKGNjLnNlcXVlbmNlKGNjLmZhZGVPdXQoZGVsVGltZSksIGNjLmZhZGVJbihkZWxUaW1lKSkpXG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2hhY2tBY3Rpb246IHNoYWNrQWN0aW9uLFxuICBibGlua0FjdGlvbjogYmxpbmtBY3Rpb24sXG4gIHBhZ2VUdXJuaW5nOiBwYWdlVHVybmluZyxcbiAgaGVhcnRCZWF0OiBoZWFydEJlYXQsXG4gIGdldE1vdmVPdXRvZlNjcmVlbkFjdGl2ZTogZ2V0TW92ZU91dG9mU2NyZWVuQWN0aXZlLFxuICBwb3BPdXQ6IHBvcE91dCxcbiAgcG9wSW46IHBvcEluLFxuICBnZXRNb3ZlSW5TY3JlZW5BY3RpdmU6IGdldE1vdmVJblNjcmVlbkFjdGl2ZSxcbiAgcm9ja0FjdGlvbjogcm9ja0FjdGlvblxufSJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/tipBox.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '25720Je1mZOOb7eOx8qoRZt', 'tipBox');
// Script/tipBox.js

"use strict";

// 提示框//需要其他代码联系 BatchMichaelbXKxyJ@gmail.com
cc.Class({
  "extends": cc.Component,
  properties: {
    label: cc.Label
  },
  start: function start() {
    this.tip = ['一次性大量消除可获得道具!', 'X2道具可以翻倍一次消除的分数', '炸弹道具可以消除全屏同色方块', '单个方块无法消除哦', '捡到宝箱！加两步！', '仙女棒可以消除所有单个方块'];
    this.otherTip = ['哎呀，今天的星星好像在对我眨眼呢！', '喵～早安，又是元气满满的一天！', '嘿嘿，我是不是世界上最可爱的小仙女呀？', '嗯哼，要不要吃颗糖，甜甜的，就像我一样。', '哎呀，这个小兔子公仔好像在说它喜欢我呢！', '嘻嘻，今天的风好温柔，就像你的拥抱。', '嗷呜～我饿了，我们去吃点好吃的吧！', '你看，那朵云好像一只大棉花糖哦！', '每个女孩子都是掉落人间的小天使，要好好爱护自己哦。', '嘿嘿，我今天学了一个新魔法，可以变出好多小星星！', '哎呀，我的小熊饼干好像在跟我说话呢！', '你看，那个彩虹就像我们的梦想，绚丽又遥不可及', '嘿嘿，我今天捡到了一片四叶草，希望它能带给我们好运。', '嗷嗷，我今天也要加油鸭！', '你看，那个月亮好像在对我们微笑。', '嗯哼，我今天要做一个甜甜的梦。', '嘿嘿，我今天学会了一个新的魔法，可以变出好多小花朵！', '嗯～这个蛋糕太美味了，就像你的笑容。', '遇见你，是我人生中最美丽的意外。', '你看，那个夕阳好像在说它也舍不得今天结束。'];
  },
  init: function init(s, type) {
    var _this = this;

    //传type是道具触发 不传是随机触发
    this._gameScore = s;

    if (type > 0) {
      this.label.string = this.tip[type];
    } else {
      this.label.string = this.otherTip[Math.floor(Math.random() * this.otherTip.length)];
    }

    this.openTipBox();

    if (this.gapTimer) {
      clearInterval(this.gapTimer);
    }

    this.gapTimer = setInterval(function () {
      _this.init(_this._gameScore, -1);
    }, 5000);
  },
  openTipBox: function openTipBox() {
    var _this2 = this;

    if (!this.isOpen) {
      // 动画 动画回掉
      var action = cc.scaleTo(0.3, 1).easing(cc.easeBackOut(2.0));
      var sq = cc.sequence(action, cc.callFunc(function () {
        _this2.isOpen = true;
      }));
      this.node.runAction(sq);
    }

    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }

    this.closeTimer = setTimeout(function () {
      _this2.closeTioBox();
    }, 4000);
  },
  closeTioBox: function closeTioBox() {
    var _this3 = this;

    var action = cc.scaleTo(0.3, 0);
    var sq = cc.sequence(action, cc.callFunc(function () {
      _this3.isOpen = false;
    }));
    this.node.runAction(sq); // if (this.openTimer) {
    //   clearTimeout(this.closeTimer)
    // }
    //this.openTimer = setTimeout(this.init(this._gameScore, null), this._gameScore.level * 2000)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFx0aXBCb3guanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJsYWJlbCIsIkxhYmVsIiwic3RhcnQiLCJ0aXAiLCJvdGhlclRpcCIsImluaXQiLCJzIiwidHlwZSIsIl9nYW1lU2NvcmUiLCJzdHJpbmciLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJsZW5ndGgiLCJvcGVuVGlwQm94IiwiZ2FwVGltZXIiLCJjbGVhckludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJpc09wZW4iLCJhY3Rpb24iLCJzY2FsZVRvIiwiZWFzaW5nIiwiZWFzZUJhY2tPdXQiLCJzcSIsInNlcXVlbmNlIiwiY2FsbEZ1bmMiLCJub2RlIiwicnVuQWN0aW9uIiwiY2xvc2VUaW1lciIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJjbG9zZVRpb0JveCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUdQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsS0FBSyxFQUFFSixFQUFFLENBQUNLO0FBREEsR0FITDtBQU1QQyxFQUFBQSxLQU5PLG1CQU1DO0FBQ04sU0FBS0MsR0FBTCxHQUFXLENBQUMsZUFBRCxFQUFrQixpQkFBbEIsRUFBcUMsZ0JBQXJDLEVBQXVELFdBQXZELEVBQW1FLFdBQW5FLEVBQStFLGVBQS9FLENBQVg7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLENBQ2QsbUJBRGMsRUFFZCxpQkFGYyxFQUdkLHFCQUhjLEVBSWQsc0JBSmMsRUFLZCxzQkFMYyxFQU1kLG9CQU5jLEVBT2QsbUJBUGMsRUFRZCxrQkFSYyxFQVNkLDJCQVRjLEVBVWQsMEJBVmMsRUFXZCxvQkFYYyxFQVlkLHdCQVpjLEVBYWQsNEJBYmMsRUFjZCxjQWRjLEVBZWQsa0JBZmMsRUFnQmQsaUJBaEJjLEVBaUJkLDRCQWpCYyxFQWtCZCxvQkFsQmMsRUFtQmQsa0JBbkJjLEVBb0JkLHVCQXBCYyxDQUFoQjtBQXNCRCxHQTlCTTtBQStCUEMsRUFBQUEsSUEvQk8sZ0JBK0JGQyxDQS9CRSxFQStCQ0MsSUEvQkQsRUErQk87QUFBQTs7QUFBRTtBQUNkLFNBQUtDLFVBQUwsR0FBa0JGLENBQWxCOztBQUNBLFFBQUlDLElBQUksR0FBRyxDQUFYLEVBQWM7QUFDWixXQUFLUCxLQUFMLENBQVdTLE1BQVgsR0FBb0IsS0FBS04sR0FBTCxDQUFTSSxJQUFULENBQXBCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsV0FBS1AsS0FBTCxDQUFXUyxNQUFYLEdBQW9CLEtBQUtMLFFBQUwsQ0FBY00sSUFBSSxDQUFDQyxLQUFMLENBQVdELElBQUksQ0FBQ0UsTUFBTCxLQUFnQixLQUFLUixRQUFMLENBQWNTLE1BQXpDLENBQWQsQ0FBcEI7QUFDRDs7QUFDRCxTQUFLQyxVQUFMOztBQUNBLFFBQUksS0FBS0MsUUFBVCxFQUFtQjtBQUNqQkMsTUFBQUEsYUFBYSxDQUFDLEtBQUtELFFBQU4sQ0FBYjtBQUNEOztBQUNELFNBQUtBLFFBQUwsR0FBZ0JFLFdBQVcsQ0FBQyxZQUFNO0FBQ2hDLE1BQUEsS0FBSSxDQUFDWixJQUFMLENBQVUsS0FBSSxDQUFDRyxVQUFmLEVBQTJCLENBQUMsQ0FBNUI7QUFDRCxLQUYwQixFQUV4QixJQUZ3QixDQUEzQjtBQUdELEdBN0NNO0FBOENQTSxFQUFBQSxVQTlDTyx3QkE4Q007QUFBQTs7QUFDWCxRQUFJLENBQUMsS0FBS0ksTUFBVixFQUFrQjtBQUNoQjtBQUNBLFVBQUlDLE1BQU0sR0FBR3ZCLEVBQUUsQ0FBQ3dCLE9BQUgsQ0FBVyxHQUFYLEVBQWdCLENBQWhCLEVBQW1CQyxNQUFuQixDQUEwQnpCLEVBQUUsQ0FBQzBCLFdBQUgsQ0FBZSxHQUFmLENBQTFCLENBQWI7QUFDQSxVQUFJQyxFQUFFLEdBQUczQixFQUFFLENBQUM0QixRQUFILENBQVlMLE1BQVosRUFBb0J2QixFQUFFLENBQUM2QixRQUFILENBQVksWUFBTTtBQUM3QyxRQUFBLE1BQUksQ0FBQ1AsTUFBTCxHQUFjLElBQWQ7QUFDRCxPQUY0QixDQUFwQixDQUFUO0FBR0EsV0FBS1EsSUFBTCxDQUFVQyxTQUFWLENBQW9CSixFQUFwQjtBQUNEOztBQUNELFFBQUksS0FBS0ssVUFBVCxFQUFxQjtBQUNuQkMsTUFBQUEsWUFBWSxDQUFDLEtBQUtELFVBQU4sQ0FBWjtBQUNEOztBQUNELFNBQUtBLFVBQUwsR0FBa0JFLFVBQVUsQ0FBQyxZQUFNO0FBQ2pDLE1BQUEsTUFBSSxDQUFDQyxXQUFMO0FBQ0QsS0FGMkIsRUFFekIsSUFGeUIsQ0FBNUI7QUFHRCxHQTdETTtBQThEUEEsRUFBQUEsV0E5RE8seUJBOERPO0FBQUE7O0FBQ1osUUFBSVosTUFBTSxHQUFHdkIsRUFBRSxDQUFDd0IsT0FBSCxDQUFXLEdBQVgsRUFBZ0IsQ0FBaEIsQ0FBYjtBQUNBLFFBQUlHLEVBQUUsR0FBRzNCLEVBQUUsQ0FBQzRCLFFBQUgsQ0FBWUwsTUFBWixFQUFvQnZCLEVBQUUsQ0FBQzZCLFFBQUgsQ0FBWSxZQUFNO0FBQzdDLE1BQUEsTUFBSSxDQUFDUCxNQUFMLEdBQWMsS0FBZDtBQUNELEtBRjRCLENBQXBCLENBQVQ7QUFHQSxTQUFLUSxJQUFMLENBQVVDLFNBQVYsQ0FBb0JKLEVBQXBCLEVBTFksQ0FNWjtBQUNBO0FBQ0E7QUFDQTtBQUNELEdBeEVNLENBeUVQOztBQXpFTyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvLyDmj5DnpLrmoYYvL+mcgOimgeWFtuS7luS7o+eggeiBlOezuyBCYXRjaE1pY2hhZWxiWEt4eUpAZ21haWwuY29tXG5jYy5DbGFzcyh7XG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbGFiZWw6IGNjLkxhYmVsLFxuICB9LFxuICBzdGFydCgpIHtcbiAgICB0aGlzLnRpcCA9IFsn5LiA5qyh5oCn5aSn6YeP5raI6Zmk5Y+v6I635b6X6YGT5YW3IScsICdYMumBk+WFt+WPr+S7pee/u+WAjeS4gOasoea2iOmZpOeahOWIhuaVsCcsICfngrjlvLnpgZPlhbflj6/ku6XmtojpmaTlhajlsY/lkIzoibLmlrnlnZcnLCAn5Y2V5Liq5pa55Z2X5peg5rOV5raI6Zmk5ZOmJywn5o2h5Yiw5a6d566x77yB5Yqg5Lik5q2l77yBJywn5LuZ5aWz5qOS5Y+v5Lul5raI6Zmk5omA5pyJ5Y2V5Liq5pa55Z2XJ11cbiAgICB0aGlzLm90aGVyVGlwID0gW1xuICAgICAgJ+WTjuWRgO+8jOS7iuWkqeeahOaYn+aYn+WlveWDj+WcqOWvueaIkeecqOecvOWRou+8gScsXG4gICAgICAn5Za1772e5pep5a6J77yM5Y+I5piv5YWD5rCU5ruh5ruh55qE5LiA5aSp77yBJyxcbiAgICAgICflmL/lmL/vvIzmiJHmmK/kuI3mmK/kuJbnlYzkuIrmnIDlj6/niLHnmoTlsI/ku5nlpbPlkYDvvJ8nLFxuICAgICAgJ+WXr+WTvO+8jOimgeS4jeimgeWQg+mil+ezlu+8jOeUnOeUnOeahO+8jOWwseWDj+aIkeS4gOagt+OAgicsXG4gICAgICAn5ZOO5ZGA77yM6L+Z5Liq5bCP5YWU5a2Q5YWs5LuU5aW95YOP5Zyo6K+05a6D5Zac5qyi5oiR5ZGi77yBJyxcbiAgICAgICflmLvlmLvvvIzku4rlpKnnmoTpo47lpb3muKnmn5TvvIzlsLHlg4/kvaDnmoTmi6XmirHjgIInLFxuICAgICAgJ+WXt+WRnO+9nuaIkemlv+S6hu+8jOaIkeS7rOWOu+WQg+eCueWlveWQg+eahOWQp++8gScsXG4gICAgICAn5L2g55yL77yM6YKj5py15LqR5aW95YOP5LiA5Y+q5aSn5qOJ6Iqx57OW5ZOm77yBJyxcbiAgICAgICfmr4/kuKrlpbPlranlrZDpg73mmK/mjonokL3kurrpl7TnmoTlsI/lpKnkvb/vvIzopoHlpb3lpb3niLHmiqToh6rlt7Hlk6bjgIInLFxuICAgICAgJ+WYv+WYv++8jOaIkeS7iuWkqeWtpuS6huS4gOS4quaWsOmtlOazle+8jOWPr+S7peWPmOWHuuWlveWkmuWwj+aYn+aYn++8gScsXG4gICAgICAn5ZOO5ZGA77yM5oiR55qE5bCP54aK6aW85bmy5aW95YOP5Zyo6Lef5oiR6K+06K+d5ZGi77yBJyxcbiAgICAgICfkvaDnnIvvvIzpgqPkuKrlvanombnlsLHlg4/miJHku6znmoTmoqbmg7PvvIznu5rkuL3lj4jpgaXkuI3lj6/lj4onLFxuICAgICAgJ+WYv+WYv++8jOaIkeS7iuWkqeaNoeWIsOS6huS4gOeJh+Wbm+WPtuiNie+8jOW4jOacm+Wug+iDveW4pue7meaIkeS7rOWlvei/kOOAgicsXG4gICAgICAn5Ze35Ze377yM5oiR5LuK5aSp5Lmf6KaB5Yqg5rK56bit77yBJyxcbiAgICAgICfkvaDnnIvvvIzpgqPkuKrmnIjkuq7lpb3lg4/lnKjlr7nmiJHku6zlvq7nrJHjgIInLFxuICAgICAgJ+WXr+WTvO+8jOaIkeS7iuWkqeimgeWBmuS4gOS4queUnOeUnOeahOaipuOAgicsXG4gICAgICAn5Zi/5Zi/77yM5oiR5LuK5aSp5a2m5Lya5LqG5LiA5Liq5paw55qE6a2U5rOV77yM5Y+v5Lul5Y+Y5Ye65aW95aSa5bCP6Iqx5py177yBJyxcbiAgICAgICfll6/vvZ7ov5nkuKrom4vns5XlpKrnvo7lkbPkuobvvIzlsLHlg4/kvaDnmoTnrJHlrrnjgIInLFxuICAgICAgJ+mBh+ingeS9oO+8jOaYr+aIkeS6uueUn+S4reacgOe+juS4veeahOaEj+WkluOAgicsXG4gICAgICAn5L2g55yL77yM6YKj5Liq5aSV6Ziz5aW95YOP5Zyo6K+05a6D5Lmf6IiN5LiN5b6X5LuK5aSp57uT5p2f44CCJ1xuICAgIF1cbiAgfSxcbiAgaW5pdChzLCB0eXBlKSB7IC8v5LygdHlwZeaYr+mBk+WFt+inpuWPkSDkuI3kvKDmmK/pmo/mnLrop6blj5FcbiAgICB0aGlzLl9nYW1lU2NvcmUgPSBzXG4gICAgaWYgKHR5cGUgPiAwKSB7XG4gICAgICB0aGlzLmxhYmVsLnN0cmluZyA9IHRoaXMudGlwW3R5cGVdXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGFiZWwuc3RyaW5nID0gdGhpcy5vdGhlclRpcFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLm90aGVyVGlwLmxlbmd0aCldXG4gICAgfVxuICAgIHRoaXMub3BlblRpcEJveCgpXG4gICAgaWYgKHRoaXMuZ2FwVGltZXIpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5nYXBUaW1lcilcbiAgICB9XG4gICAgdGhpcy5nYXBUaW1lciA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHRoaXMuaW5pdCh0aGlzLl9nYW1lU2NvcmUsIC0xKVxuICAgIH0sIDUwMDApXG4gIH0sXG4gIG9wZW5UaXBCb3goKSB7XG4gICAgaWYgKCF0aGlzLmlzT3Blbikge1xuICAgICAgLy8g5Yqo55S7IOWKqOeUu+WbnuaOiVxuICAgICAgbGV0IGFjdGlvbiA9IGNjLnNjYWxlVG8oMC4zLCAxKS5lYXNpbmcoY2MuZWFzZUJhY2tPdXQoMi4wKSlcbiAgICAgIGxldCBzcSA9IGNjLnNlcXVlbmNlKGFjdGlvbiwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgICB0aGlzLmlzT3BlbiA9IHRydWVcbiAgICAgIH0pKVxuICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihzcSlcbiAgICB9XG4gICAgaWYgKHRoaXMuY2xvc2VUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuY2xvc2VUaW1lcilcbiAgICB9XG4gICAgdGhpcy5jbG9zZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmNsb3NlVGlvQm94KClcbiAgICB9LCA0MDAwKVxuICB9LFxuICBjbG9zZVRpb0JveCgpIHtcbiAgICBsZXQgYWN0aW9uID0gY2Muc2NhbGVUbygwLjMsIDApXG4gICAgbGV0IHNxID0gY2Muc2VxdWVuY2UoYWN0aW9uLCBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICB0aGlzLmlzT3BlbiA9IGZhbHNlXG4gICAgfSkpXG4gICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihzcSlcbiAgICAvLyBpZiAodGhpcy5vcGVuVGltZXIpIHtcbiAgICAvLyAgIGNsZWFyVGltZW91dCh0aGlzLmNsb3NlVGltZXIpXG4gICAgLy8gfVxuICAgIC8vdGhpcy5vcGVuVGltZXIgPSBzZXRUaW1lb3V0KHRoaXMuaW5pdCh0aGlzLl9nYW1lU2NvcmUsIG51bGwpLCB0aGlzLl9nYW1lU2NvcmUubGV2ZWwgKiAyMDAwKVxuICB9LFxuICAvLyB1cGRhdGUgKGR0KSB7fSxcbn0pOyJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/character.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '33cd23uZ6JD4pTLpKtgjbbS', 'character');
// Script/character.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    levelUp1: cc.Node,
    levelUp2: cc.Node,
    character: cc.Node,
    fail: cc.Node
  },
  start: function start() {
    cc.assetManager.loadBundle('game', function (err, bundle) {
      self.bundle = bundle;
    });
  },
  onWalk: function onWalk(target) {
    target.playAnimation('walk', -1);
  },
  onLevelUp: function onLevelUp() {//this.levelUp2.getComponent(dragonBones.ArmatureDisplay).playAnimation('jump', -1)
  },
  onSuccessDialog: function onSuccessDialog(level) {
    this.showCharacter(level, this.levelUp2);
  },
  onLevelUpBtn: function onLevelUpBtn(level) {
    this.showHeroCharacter(level);
  },
  onFail: function onFail(level) {
    this.showCharacter(level, this.fail);
  },
  initStartPage: function initStartPage() {},
  showHeroCharacter: function showHeroCharacter(level, target, color) {
    target = target || this.character;
    var loadRes = 'heroPrefab/heroSpine' + level;
    this.loadHeroPrefab(loadRes, target, color);
  },
  loadHeroPrefab: function loadHeroPrefab(prefabPath, target, color) {
    var _this = this;

    if (self.heroPrefab) {
      // cc.assetManager.releaseAsset(self.heroPrefab);
      // cc.de(prefab);
      self.heroPrefab.destroy();
      self.heroPrefab = null; // self.bundle.release(self.heroPrefabPath, cc.Prefab);
    }

    self.bundle.load(prefabPath, cc.Prefab, function (err, prefab) {
      if (err) {
        console.error('加载 Prefab 失败：', err);
        return;
      }

      self.heroPrefabPath = prefabPath; // Prefab 加载成功后，使用 instantiate 方法创建实例

      self.heroPrefab = cc.instantiate(prefab); // 将实例添加到当前节点下

      _this.node.addChild(self.heroPrefab); // 可以设置新节点的位置等属性


      self.heroPrefab.setParent(target);
      self.heroPrefab.setPosition(0, 0, 0);

      if (color) {
        self.heroPrefab.color = color;
      } else {
        self.heroPrefab.color = cc.Color.WHITE;
      }
    });
  },
  showCharacter: function showCharacter(level, target, color) {
    target = target || this.character;
    var loadRes = 'heroPrefab/heroSpine' + level;
    this.loadAvatarPrefab(loadRes, target, color);
  },
  loadPrefab: function loadPrefab(prefabPath, target, color) {
    var _this2 = this;

    self.bundle.load(prefabPath, cc.Prefab, function (err, prefab) {
      if (err) {
        console.error('加载 Prefab 失败：', err);
        return;
      } // if (self.heroAvatarPrefab) {
      //   cc.assetManager.releaseAsset(self.heroAvatarPrefab);
      // }
      // Prefab 加载成功后，使用 instantiate 方法创建实例


      var instPrefab = cc.instantiate(prefab); // 将实例添加到当前节点下

      _this2.node.addChild(instPrefab); // 可以设置新节点的位置等属性


      instPrefab.setParent(target);
      instPrefab.setPosition(0, 0, 0);

      if (color) {
        instPrefab.color = color;
      } else {
        instPrefab.color = cc.Color.WHITE;
      }
    });
  },
  showAvatarCharacter: function showAvatarCharacter(level, target, color) {
    target = target || this.character;
    var loadRes = 'heroPrefab/heroSpine' + level;
    this.loadAvatarPrefab(loadRes, target, color);
  },
  loadAvatarPrefab: function loadAvatarPrefab(prefabPath, target, color) {
    var _this3 = this;

    if (self.heroAvatarPrefab) {
      // cc.assetManager.releaseAsset(self.heroAvatarPrefab);
      self.heroAvatarPrefab.destroy();
      self.heroAvatarPrefab = null; // self.bundle.release(self.heroAvatarPrefabPath, cc.Prefab);
    }

    if (self.heroAvatarPrefabPath != prefabPath) {
      self.bundle.load(prefabPath, cc.Prefab, function (err, prefab) {
        if (err) {
          console.error('加载 Prefab 失败：', err);
          return;
        }

        self.heroAvatarPrefabPath = prefabPath; // Prefab 加载成功后，使用 instantiate 方法创建实例

        self.heroAvatarPrefab = cc.instantiate(prefab); // 将实例添加到当前节点下

        _this3.node.addChild(self.heroAvatarPrefab); // 可以设置新节点的位置等属性


        self.heroAvatarPrefab.setParent(target);
        self.heroAvatarPrefab.setPosition(0, 0, 0);

        if (color) {
          self.heroAvatarPrefab.color = color;
        } else {
          self.heroAvatarPrefab.color = cc.Color.WHITE;
        }
      });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxjaGFyYWN0ZXIuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJsZXZlbFVwMSIsIk5vZGUiLCJsZXZlbFVwMiIsImNoYXJhY3RlciIsImZhaWwiLCJzdGFydCIsImFzc2V0TWFuYWdlciIsImxvYWRCdW5kbGUiLCJlcnIiLCJidW5kbGUiLCJzZWxmIiwib25XYWxrIiwidGFyZ2V0IiwicGxheUFuaW1hdGlvbiIsIm9uTGV2ZWxVcCIsIm9uU3VjY2Vzc0RpYWxvZyIsImxldmVsIiwic2hvd0NoYXJhY3RlciIsIm9uTGV2ZWxVcEJ0biIsInNob3dIZXJvQ2hhcmFjdGVyIiwib25GYWlsIiwiaW5pdFN0YXJ0UGFnZSIsImNvbG9yIiwibG9hZFJlcyIsImxvYWRIZXJvUHJlZmFiIiwicHJlZmFiUGF0aCIsImhlcm9QcmVmYWIiLCJkZXN0cm95IiwibG9hZCIsIlByZWZhYiIsInByZWZhYiIsImNvbnNvbGUiLCJlcnJvciIsImhlcm9QcmVmYWJQYXRoIiwiaW5zdGFudGlhdGUiLCJub2RlIiwiYWRkQ2hpbGQiLCJzZXRQYXJlbnQiLCJzZXRQb3NpdGlvbiIsIkNvbG9yIiwiV0hJVEUiLCJsb2FkQXZhdGFyUHJlZmFiIiwibG9hZFByZWZhYiIsImluc3RQcmVmYWIiLCJzaG93QXZhdGFyQ2hhcmFjdGVyIiwiaGVyb0F2YXRhclByZWZhYiIsImhlcm9BdmF0YXJQcmVmYWJQYXRoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUdQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsUUFBUSxFQUFFSixFQUFFLENBQUNLLElBREg7QUFFVkMsSUFBQUEsUUFBUSxFQUFFTixFQUFFLENBQUNLLElBRkg7QUFHVkUsSUFBQUEsU0FBUyxFQUFFUCxFQUFFLENBQUNLLElBSEo7QUFJVkcs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QyxnQkFBTCxHQUF3QmpELEVBQUUsQ0FBQ3NDLFdBQUgsQ0FBZUosTUFBZixDQUF4QixDQVR1RCxDQVV2RDs7QUFDQSxRQUFBLE1BQUksQ0FBQ0ssSUFBTCxDQUFVQyxRQUFWLENBQW1CMUIsSUFBSSxDQUFDbUMsZ0JBQXhCLEVBWHVELENBWXZEOzs7QUFFQW5DLFFBQUFBLElBQUksQ0FBQ21DLGdCQUFMLENBQXNCUixTQUF0QixDQUFnQ3pCLE1BQWhDO0FBQ0FGLFFBQUFBLElBQUksQ0FBQ21DLGdCQUFMLENBQXNCUCxXQUF0QixDQUFrQyxDQUFsQyxFQUFxQyxDQUFyQyxFQUF3QyxDQUF4Qzs7QUFFQSxZQUFJaEIsS0FBSixFQUFXO0FBQ1RaLFVBQUFBLElBQUksQ0FBQ21DLGdCQUFMLENBQXNCdkIsS0FBdEIsR0FBOEJBLEtBQTlCO0FBQ0QsU0FGRCxNQUdLO0FBQ0haLFVBQUFBLElBQUksQ0FBQ21DLGdCQUFMLENBQXNCdkIsS0FBdEIsR0FBOEIxQixFQUFFLENBQUMyQyxLQUFILENBQVNDLEtBQXZDO0FBQ0Q7QUFDRixPQXZCRDtBQXdCRDtBQUNGO0FBL0pNLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gIHByb3BlcnRpZXM6IHtcbiAgICBsZXZlbFVwMTogY2MuTm9kZSxcbiAgICBsZXZlbFVwMjogY2MuTm9kZSxcbiAgICBjaGFyYWN0ZXI6IGNjLk5vZGUsXG4gICAgZmFpbDogY2MuTm9kZSxcbiAgfSxcbiAgc3RhcnQoKSB7XG4gICAgY2MuYXNzZXRNYW5hZ2VyLmxvYWRCdW5kbGUoJ2dhbWUnLCAoZXJyLCBidW5kbGUpID0+IHtcbiAgICAgIHNlbGYuYnVuZGxlID0gYnVuZGxlO1xuICAgIH0pO1xuICB9LFxuXG5cblxuICBvbldhbGsodGFyZ2V0KSB7XG4gICAgdGFyZ2V0LnBsYXlBbmltYXRpb24oJ3dhbGsnLCAtMSlcbiAgfSxcbiAgb25MZXZlbFVwKCkge1xuICAgIC8vdGhpcy5sZXZlbFVwMi5nZXRDb21wb25lbnQoZHJhZ29uQm9uZXMuQXJtYXR1cmVEaXNwbGF5KS5wbGF5QW5pbWF0aW9uKCdqdW1wJywgLTEpXG4gIH0sXG4gIG9uU3VjY2Vzc0RpYWxvZyhsZXZlbCkge1xuICAgIHRoaXMuc2hvd0NoYXJhY3RlcihsZXZlbCwgdGhpcy5sZXZlbFVwMilcblxuICB9LFxuICBvbkxldmVsVXBCdG4obGV2ZWwpIHtcbiAgICB0aGlzLnNob3dIZXJvQ2hhcmFjdGVyKGxldmVsKVxuICB9LFxuICBvbkZhaWwobGV2ZWwpIHtcbiAgICB0aGlzLnNob3dDaGFyYWN0ZXIobGV2ZWwsIHRoaXMuZmFpbClcbiAgfSxcblxuICBpbml0U3RhcnRQYWdlKCkge1xuXG4gIH0sXG5cbiAgc2hvd0hlcm9DaGFyYWN0ZXIobGV2ZWwsIHRhcmdldCwgY29sb3IpIHtcbiAgICB0YXJnZXQgPSB0YXJnZXQgfHwgdGhpcy5jaGFyYWN0ZXJcblxuICAgIGxldCBsb2FkUmVzID0gJ2hlcm9QcmVmYWIvaGVyb1NwaW5lJyArIGxldmVsXG4gICAgdGhpcy5sb2FkSGVyb1ByZWZhYihsb2FkUmVzLCB0YXJnZXQsIGNvbG9yKTtcbiAgfSxcblxuICBsb2FkSGVyb1ByZWZhYihwcmVmYWJQYXRoLCB0YXJnZXQsIGNvbG9yKSB7XG5cbiAgICBpZiAoc2VsZi5oZXJvUHJlZmFiKSB7XG4gICAgICAvLyBjYy5hc3NldE1hbmFnZXIucmVsZWFzZUFzc2V0KHNlbGYuaGVyb1ByZWZhYik7XG4gICAgICAvLyBjYy5kZShwcmVmYWIpO1xuICAgICAgc2VsZi5oZXJvUHJlZmFiLmRlc3Ryb3koKTtcbiAgICAgIHNlbGYuaGVyb1ByZWZhYiA9IG51bGw7XG4gICAgICAvLyBzZWxmLmJ1bmRsZS5yZWxlYXNlKHNlbGYuaGVyb1ByZWZhYlBhdGgsIGNjLlByZWZhYik7XG4gICAgfVxuXG4gICAgc2VsZi5idW5kbGUubG9hZChwcmVmYWJQYXRoLCBjYy5QcmVmYWIsIChlcnIsIHByZWZhYikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCfliqDovb0gUHJlZmFiIOWksei0pe+8micsIGVycik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi5oZXJvUHJlZmFiUGF0aCA9IHByZWZhYlBhdGhcblxuICAgICAgLy8gUHJlZmFiIOWKoOi9veaIkOWKn+WQju+8jOS9v+eUqCBpbnN0YW50aWF0ZSDmlrnms5XliJvlu7rlrp7kvotcbiAgICAgIHNlbGYuaGVyb1ByZWZhYiA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAvLyDlsIblrp7kvovmt7vliqDliLDlvZPliY3oioLngrnkuItcbiAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChzZWxmLmhlcm9QcmVmYWIpO1xuICAgICAgLy8g5Y+v5Lul6K6+572u5paw6IqC54K555qE5L2N572u562J5bGe5oCnXG5cbiAgICAgIHNlbGYuaGVyb1ByZWZhYi5zZXRQYXJlbnQodGFyZ2V0KTtcbiAgICAgIHNlbGYuaGVyb1ByZWZhYi5zZXRQb3NpdGlvbigwLCAwLCAwKTtcblxuICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgIHNlbGYuaGVyb1ByZWZhYi5jb2xvciA9IGNvbG9yXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc2VsZi5oZXJvUHJlZmFiLmNvbG9yID0gY2MuQ29sb3IuV0hJVEVcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuXG4gIHNob3dDaGFyYWN0ZXIobGV2ZWwsIHRhcmdldCwgY29sb3IpIHtcbiAgICB0YXJnZXQgPSB0YXJnZXQgfHwgdGhpcy5jaGFyYWN0ZXJcblxuICAgIGxldCBsb2FkUmVzID0gJ2hlcm9QcmVmYWIvaGVyb1NwaW5lJyArIGxldmVsXG4gICAgdGhpcy5sb2FkQXZhdGFyUHJlZmFiKGxvYWRSZXMsIHRhcmdldCwgY29sb3IpO1xuICB9LFxuXG4gIGxvYWRQcmVmYWIocHJlZmFiUGF0aCwgdGFyZ2V0LCBjb2xvcikge1xuICAgIHNlbGYuYnVuZGxlLmxvYWQocHJlZmFiUGF0aCwgY2MuUHJlZmFiLCAoZXJyLCBwcmVmYWIpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcign5Yqg6L29IFByZWZhYiDlpLHotKXvvJonLCBlcnIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIChzZWxmLmhlcm9BdmF0YXJQcmVmYWIpIHtcbiAgICAgIC8vICAgY2MuYXNzZXRNYW5hZ2VyLnJlbGVhc2VBc3NldChzZWxmLmhlcm9BdmF0YXJQcmVmYWIpO1xuICAgICAgLy8gfVxuICAgICAgLy8gUHJlZmFiIOWKoOi9veaIkOWKn+WQju+8jOS9v+eUqCBpbnN0YW50aWF0ZSDmlrnms5XliJvlu7rlrp7kvotcbiAgICAgIGxldCBpbnN0UHJlZmFiID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKTtcbiAgICAgIC8vIOWwhuWunuS+i+a3u+WKoOWIsOW9k+WJjeiKgueCueS4i1xuICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKGluc3RQcmVmYWIpO1xuICAgICAgLy8g5Y+v5Lul6K6+572u5paw6IqC54K555qE5L2N572u562J5bGe5oCnXG5cbiAgICAgIGluc3RQcmVmYWIuc2V0UGFyZW50KHRhcmdldCk7XG4gICAgICBpbnN0UHJlZmFiLnNldFBvc2l0aW9uKDAsIDAsIDApO1xuXG4gICAgICBpZiAoY29sb3IpIHtcbiAgICAgICAgaW5zdFByZWZhYi5jb2xvciA9IGNvbG9yXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaW5zdFByZWZhYi5jb2xvciA9IGNjLkNvbG9yLldISVRFXG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cblxuICBzaG93QXZhdGFyQ2hhcmFjdGVyKGxldmVsLCB0YXJnZXQsIGNvbG9yKSB7XG4gICAgdGFyZ2V0ID0gdGFyZ2V0IHx8IHRoaXMuY2hhcmFjdGVyXG5cbiAgICBsZXQgbG9hZFJlcyA9ICdoZXJvUHJlZmFiL2hlcm9TcGluZScgKyBsZXZlbFxuICAgIHRoaXMubG9hZEF2YXRhclByZWZhYihsb2FkUmVzLCB0YXJnZXQsIGNvbG9yKTtcbiAgfSxcblxuICBsb2FkQXZhdGFyUHJlZmFiKHByZWZhYlBhdGgsIHRhcmdldCwgY29sb3IpIHtcbiAgICBpZiAoc2VsZi5oZXJvQXZhdGFyUHJlZmFiKSB7XG4gICAgICAvLyBjYy5hc3NldE1hbmFnZXIucmVsZWFzZUFzc2V0KHNlbGYuaGVyb0F2YXRhclByZWZhYik7XG4gICAgICBzZWxmLmhlcm9BdmF0YXJQcmVmYWIuZGVzdHJveSgpO1xuICAgICAgc2VsZi5oZXJvQXZhdGFyUHJlZmFiID0gbnVsbDtcbiAgICAgIC8vIHNlbGYuYnVuZGxlLnJlbGVhc2Uoc2VsZi5oZXJvQXZhdGFyUHJlZmFiUGF0aCwgY2MuUHJlZmFiKTtcbiAgICB9XG5cbiAgICBpZiAoc2VsZi5oZXJvQXZhdGFyUHJlZmFiUGF0aCAhPSBwcmVmYWJQYXRoKSB7XG4gICAgICBzZWxmLmJ1bmRsZS5sb2FkKHByZWZhYlBhdGgsIGNjLlByZWZhYiwgKGVyciwgcHJlZmFiKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCfliqDovb0gUHJlZmFiIOWksei0pe+8micsIGVycik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gIFxuICAgICAgICBzZWxmLmhlcm9BdmF0YXJQcmVmYWJQYXRoID0gcHJlZmFiUGF0aFxuICBcbiAgICAgICAgLy8gUHJlZmFiIOWKoOi9veaIkOWKn+WQju+8jOS9v+eUqCBpbnN0YW50aWF0ZSDmlrnms5XliJvlu7rlrp7kvotcbiAgICAgICAgc2VsZi5oZXJvQXZhdGFyUHJlZmFiID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKTtcbiAgICAgICAgLy8g5bCG5a6e5L6L5re75Yqg5Yiw5b2T5YmN6IqC54K55LiLXG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChzZWxmLmhlcm9BdmF0YXJQcmVmYWIpO1xuICAgICAgICAvLyDlj6/ku6Xorr7nva7mlrDoioLngrnnmoTkvY3nva7nrYnlsZ7mgKdcbiAgXG4gICAgICAgIHNlbGYuaGVyb0F2YXRhclByZWZhYi5zZXRQYXJlbnQodGFyZ2V0KTtcbiAgICAgICAgc2VsZi5oZXJvQXZhdGFyUHJlZmFiLnNldFBvc2l0aW9uKDAsIDAsIDApO1xuICBcbiAgICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgICAgc2VsZi5oZXJvQXZhdGFyUHJlZmFiLmNvbG9yID0gY29sb3JcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBzZWxmLmhlcm9BdmF0YXJQcmVmYWIuY29sb3IgPSBjYy5Db2xvci5XSElURVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG59KTsiXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/successDialog.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f784aHXFKRDvbVWsOUPoQIK', 'successDialog');
// Script/successDialog.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    nameLabelBefore: cc.Label,
    nameLabelNow: cc.Label,
    stepLabel: cc.Label,
    scoreLabel: cc.Label
  },
  init: function init(s, level, data, score) {
    this.nameLabelBefore.string = data[level - 2].name;
    this.nameLabelNow.string = data[level - 1].name;
    this.stepLabel.string = "+" + data[level - 2].step + "步";
    this.scoreLabel.string = "分数：" + score;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzdWNjZXNzRGlhbG9nLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwibmFtZUxhYmVsQmVmb3JlIiwiTGFiZWwiLCJuYW1lTGFiZWxOb3ciLCJzdGVwTGFiZWwiLCJzY29yZUxhYmVsIiwiaW5pdCIsInMiLCJsZXZlbCIsImRhdGEiLCJzY29yZSIsInN0cmluZyIsIm5hbWUiLCJzdGVwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUdQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsZUFBZSxFQUFFSixFQUFFLENBQUNLLEtBRFY7QUFFVkMsSUFBQUEsWUFBWSxFQUFFTixFQUFFLENBQUNLLEtBRlA7QUFHVkUsSUFBQUEsU0FBUyxFQUFFUCxFQUFFLENBQUNLLEtBSEo7QUFJVkcsSUFBQUEsVUFBVSxFQUFFUixFQUFFLENBQUNLO0FBSkwsR0FITDtBQVVQSSxFQUFBQSxJQVZPLGdCQVVGQyxDQVZFLEVBVUNDLEtBVkQsRUFVUUMsSUFWUixFQVVjQyxLQVZkLEVBVXFCO0FBQzFCLFNBQUtULGVBQUwsQ0FBcUJVLE1BQXJCLEdBQThCRixJQUFJLENBQUNELEtBQUssR0FBRyxDQUFULENBQUosQ0FBZ0JJLElBQTlDO0FBQ0EsU0FBS1QsWUFBTCxDQUFrQlEsTUFBbEIsR0FBMkJGLElBQUksQ0FBQ0QsS0FBSyxHQUFHLENBQVQsQ0FBSixDQUFnQkksSUFBM0M7QUFDQSxTQUFLUixTQUFMLENBQWVPLE1BQWYsR0FBd0IsTUFBTUYsSUFBSSxDQUFDRCxLQUFLLEdBQUcsQ0FBVCxDQUFKLENBQWdCSyxJQUF0QixHQUE2QixHQUFyRDtBQUNBLFNBQUtSLFVBQUwsQ0FBZ0JNLE1BQWhCLEdBQXlCLFFBQVFELEtBQWpDO0FBQ0QsR0FmTSxDQWdCUDs7QUFoQk8sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xuICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgcHJvcGVydGllczoge1xuICAgIG5hbWVMYWJlbEJlZm9yZTogY2MuTGFiZWwsXG4gICAgbmFtZUxhYmVsTm93OiBjYy5MYWJlbCxcbiAgICBzdGVwTGFiZWw6IGNjLkxhYmVsLFxuICAgIHNjb3JlTGFiZWw6IGNjLkxhYmVsLFxuICB9LFxuXG4gIGluaXQocywgbGV2ZWwsIGRhdGEsIHNjb3JlKSB7XG4gICAgdGhpcy5uYW1lTGFiZWxCZWZvcmUuc3RyaW5nID0gZGF0YVtsZXZlbCAtIDJdLm5hbWVcbiAgICB0aGlzLm5hbWVMYWJlbE5vdy5zdHJpbmcgPSBkYXRhW2xldmVsIC0gMV0ubmFtZVxuICAgIHRoaXMuc3RlcExhYmVsLnN0cmluZyA9IFwiK1wiICsgZGF0YVtsZXZlbCAtIDJdLnN0ZXAgKyBcIuatpVwiXG4gICAgdGhpcy5zY29yZUxhYmVsLnN0cmluZyA9IFwi5YiG5pWw77yaXCIgKyBzY29yZVxuICB9LFxuICAvLyB1cGRhdGUgKGR0KSB7fSxcbn0pOyJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/element.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'dbc3cQxtHpPj77TncyB18gQ', 'element');
// Script/element.js

"use strict";

/**
 * @author heyuchang
 * @file 单个方块控制
 */
cc.Class({
  "extends": cc.Component,
  properties: {
    _status: 0,
    //1为可触发点击 2为已经消失
    _itemType: 0,
    //新增道具功能 1为双倍倍数 2为炸弹
    warningSprite: cc.Sprite,
    lightSprite: cc.Sprite
  },
  init: function init(g, data, width, itemType, pos) {
    this._game = g;
    this._status = 1;

    if (pos) {//cc.log('生成的方块', pos)
    }

    pos = pos || {
      x: data.x,
      y: data.y
    };
    this._itemType = itemType || 0;
    this.warningType = 0;
    this.isPush = false;
    this.bindEvent();
    this.color = data.color || Math.ceil(Math.random() * 4);
    this.colorSprite = this.node.getChildByName('color').getComponent(cc.Sprite);
    this.colorSprite.spriteFrame = itemType ? g.propSpriteFrame[(itemType - 1) * 4 + this.color - 1] : this._game.blockSprite[this.color - 1];
    this.warningSprite.spriteFrame = '';
    this._width = width;
    this._gameController = g._gameController; // 计算宽

    this.lightSprite.node.active = false; //  this.lightSprite.spriteFrame = this._game.blockSprite[this.color - 1]

    this.node.width = this.node.height = width;
    this.startTime = data.startTime;
    this.iid = data.y;
    this.jid = data.x; // console.log('生成方块位置', data.y, data.x)

    this.node.x = -(730 / 2 - g.gapCfgNum - width / 2) + pos.x * (width + g.gapCfgNum);
    this.node.y = 730 / 2 - g.gapCfgNum - width / 2 - pos.y * (width + g.gapCfgNum);
    this.node.angle = 0;
    this.playStartAction();
  },
  onWarning: function onWarning(type) {
    this.warningSprite.spriteFrame = this._game.warningSpriteFrame[type - 1] || '';
    this.warningType = type; //   this.lightSprite.node.active = true

    var action1 = cc.blink(1, 10); //   this.lightSprite.node.runAction(action1)
  },
  warningInit: function warningInit() {
    this.warningSprite.spriteFrame = ''; //  this.lightSprite.node.active = false

    this.isPush = false;
  },
  growInit: function growInit() {
    this.growType = 0;
    this.colorSprite.node.height = this.colorSprite.node.width = this._width;
    this.colorSprite.node.y = this.colorSprite.node.x = 0;
  },
  grow: function grow(type) {
    //1234 上下左右
    switch (type) {
      case 1:
        if (this.growType != 2) {
          this.colorSprite.node.height += this._game.gapCfgNum * 2;
          this.colorSprite.node.y += this._game.gapCfgNum;
          this.growType = 1;
        }

        break;

      case 2:
        if (this.growType != 2) {
          this.colorSprite.node.height += this._game.gapCfgNum * 2;
          this.colorSprite.node.y -= this._game.gapCfgNum;
          this.growType = 1;
        }

        break;

      case 3:
        if (this.growType != 1) {
          this.colorSprite.node.width += this._game.gapCfgNum * 2;
          this.colorSprite.node.x -= this._game.gapCfgNum;
          this.growType = 2;
        }

        break;

      case 4:
        if (this.growType != 1) {
          this.colorSprite.node.width += this._game.gapCfgNum * 2;
          this.colorSprite.node.x += this._game.gapCfgNum;
          this.growType = 2;
        }

        break;
    }
  },
  bindEvent: function bindEvent() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouched, this);
  },
  // 用户点击 或者被其他方块触发
  onTouched: function onTouched(color, isChain, isBomb, time) {
    var _this = this;

    //道具新增参数 isChain是否连锁 isBomb是否强制消除
    if (time) {
      setTimeout(function () {
        _this.onTouched(color, false, isBomb);
      }, time);
      return;
    }

    isChain = JSON.stringify(isChain) == 'null' ? true : isChain;
    isBomb = isBomb ? isBomb : false;
    var self = this; // 爆炸触发

    if (this._status == 1 && isBomb == true) {
      this._status = 2;
      this.playDieAction().then(function () {
        _this.onBlockPop(color, isChain, isBomb);
      });
      return;
    }

    if (color.type) {
      // 一定是用户主动触发 保存这个坐标给game
      if (this.isSingle && this._itemType <= 1) {
        this.node.scale = 1;

        this._game._gameScore.tipBox.init(this._game._gameScore, 3);

        var action1 = cc.scaleTo(0.1, 1.1, 0.9);
        var action2 = cc.scaleTo(0.3, 1).easing(cc.easeBackOut(2.0));
        var action = cc.sequence(action1, action2);
        this.node.runAction(action);
        return;
      } // console.log('方块位置', this.iid, this.jid, this._itemType)


      color = this.color;

      if (this._status == 1 && this._game._status == 1 && this.color == color) {
        this._game.onUserTouched(this.iid, this.jid, this._itemType, this.color, this.warningType, {
          x: this.node.x,
          y: this.node.y
        });

        this._game._gameScore.onStep(-1).then(function (res) {
          if (res) {
            _this.playDieAction().then(function () {
              _this.onBlockPop(color, null, null);
            });
          }
        });
      }
    } else {
      // 由其他方块触发
      if (this._status == 1 && this._game._status == 5 && this.color == color) {
        this.playDieAction().then(function () {
          _this.onBlockPop(color, null, null);
        });
      }
    }
  },
  onBlockPop: function onBlockPop(color, isChain, isBomb) {
    var self = this;
    isChain = JSON.stringify(isChain) == 'null' ? true : isChain;
    isBomb = isBomb ? isBomb : false;

    self._game.checkNeedFall();

    self._game._status = 5;

    self._gameController.musicManager.onPlayAudio(0 //self._game._gameScore.chain - 1
    );

    if (this._itemType != 0) {
      // console.log("触发了道具", this._itemType)
      self._game.onItem(this._itemType, color, {
        x: this.node.x,
        y: this.node.y
      });
    }

    self._game._gameScore.addScore(cc.v2(this.node.x, this.node.y - this.node.width + this._game.gapCfgNum), this._itemType == 3 ? this._game._gameController.config.json.propConfig[2].score : null); // 连锁状态


    if (isChain) {
      if (self.iid - 1 >= 0) {
        self._game.map[self.iid - 1][self.jid].getComponent('element').onTouched(color);
      }

      if (self.iid + 1 < this._game.rowCfgNum) {
        self._game.map[self.iid + 1][self.jid].getComponent('element').onTouched(color);
      }

      if (self.jid - 1 >= 0) {
        self._game.map[self.iid][self.jid - 1].getComponent('element').onTouched(color);
      }

      if (self.jid + 1 < this._game.rowCfgNum) {
        self._game.map[self.iid][self.jid + 1].getComponent('element').onTouched(color);
      }
    }
  },
  playFallAction: function playFallAction(y, data) {
    var _this2 = this;

    //下降了几个格子
    this._status = 0;

    if (data) {
      this.iid = data.y;
      this.jid = data.x;
    }

    var action = cc.moveBy(0.25, 0, -y * (this._game.gapCfgNum + this._game.blockClsWidth)).easing(cc.easeBounceOut(5 / y)); //1 * y / this._game.animaCfgSpeed

    var seq = cc.sequence(action, cc.callFunc(function () {
      _this2._status = 1; //  this._game.checkNeedGenerator()
    }, this));
    this.node.runAction(seq);
  },
  playStartAction: function playStartAction() {
    var _this3 = this;

    this.node.scaleX = 0;
    this.node.scaleY = 0;
    var action = cc.scaleTo(0.8 / this._game.animaCfgSpeed, 1, 1).easing(cc.easeBackOut());
    var seq = cc.sequence(action, cc.callFunc(function () {
      _this3._status = 1;
    }, this)); // 如果有延迟时间就用延迟时间

    if (this.startTime) {
      setTimeout(function () {
        _this3.node.runAction(seq);
      }, this.startTime / 1 // (cc.game.getFrameRate() / 60)
      );
    } else {
      this.node.runAction(seq);
    }
  },
  playDieAction: function playDieAction() {
    var _this4 = this;

    var self = this;
    clearTimeout(this.surfaceTimer);
    this.node.stopAllActions();
    this._status = 2;
    this.node.scaleX = 1;
    this.node.scaleY = 1;
    return new Promise(function (resolve, reject) {
      var action;

      if (_this4.warningSprite.spriteFrame) {
        //有道具预警
        var action1 = cc.scaleTo(0.2 / self._game.animaCfgSpeed, 1.1);
        var action2 = cc.moveTo(0.2 / self._game.animaCfgSpeed, _this4._game.target.x, _this4._game.target.y);
        var action3 = cc.scaleTo(0.2, 0);
        var seq = cc.sequence(action1, cc.callFunc(function () {
          resolve('');
        }, _this4), cc.spawn(action2, action3));
      } else {
        action = cc.scaleTo(0.2 / self._game.animaCfgSpeed, 0, 0);
        var seq = cc.sequence(action, cc.callFunc(function () {
          resolve('');
        }, _this4));
      }

      self.node.runAction(seq);
    });
  },
  surfaceAction: function surfaceAction(dela) {
    var _this5 = this;

    this.surfaceTimer = setTimeout(function () {
      var action = cc.scaleTo(0.4 / _this5._game.animaCfgSpeed, 0.8, 0.8);
      var action1 = cc.scaleTo(0.4 / _this5._game.animaCfgSpeed, 1, 1);

      _this5.node.runAction(cc.sequence(action, action1));
    }, dela);
  },
  generatePropAction: function generatePropAction() {},
  generateItem: function generateItem(type) {
    this._itemType = type;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxlbGVtZW50LmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiX3N0YXR1cyIsIl9pdGVtVHlwZSIsIndhcm5pbmdTcHJpdGUiLCJTcHJpdGUiLCJsaWdodFNwcml0ZSIsImluaXQiLCJnIiwiZGF0YSIsIndpZHRoIiwiaXRlbVR5cGUiLCJwb3MiLCJfZ2FtZSIsIngiLCJ5Iiwid2FybmluZ1R5cGUiLCJpc1B1c2giLCJiaW5kRXZlbnQiLCJjb2xvciIsIk1hdGgiLCJjZWlsIiwicmFuZG9tIiwiY29sb3JTcHJpdGUiLCJub2RlIiwiZ2V0Q2hpbGRCeU5hbWUiLCJnZXRDb21wb25lbnQiLCJzcHJpdGVGcmFtZSIsInByb3BTcHJpdGVGcmFtZSIsImJsb2NrU3ByaXRlIiwiX3dpZHRoIiwiX2dhbWVDb250cm9sbGVyIiwiYWN0aXZlIiwiaGVpZ2h0Iiwic3RhcnRUaW1lIiwiaWlkIiwiamlkIiwiZ2FwQ2ZnTnVtIiwiYW5nbGUiLCJwbGF5U3RhcnRBY3Rpb24iLCJvbldhcm5pbmciLCJ0eXBlIiwid2FybmluZ1Nwcml0ZUZyYW1lIiwiYWN0aW9uMSIsImJsaW5rIiwid2FybmluZ0luaXQiLCJncm93SW5pdCIsImdyb3dUeXBlIiwiZ3JvdyIsIm9uIiwiTm9kZSIsIkV2ZW50VHlwZSIsIlRPVUNIX1NUQVJUIiwib25Ub3VjaGVkIiwiaXNDaGFpbiIsImlzQm9tYiIsInRpbWUiLCJzZXRUaW1lb3V0IiwiSlNPTiIsInN0cmluZ2lmeSIsInNlbGYiLCJwbGF5RGllQWN0aW9uIiwidGhlbiIsIm9uQmxvY2tQb3AiLCJpc1NpbmdsZSIsInNjYWxlIiwiX2dhbWVTY29yZSIsInRpcEJveCIsInNjYWxlVG8iLCJhY3Rpb24yIiwiZWFzaW5nIiwiZWFzZUJhY2tPdXQiLCJhY3Rpb24iLCJzZXF1ZW5jZSIsInJ1bkFjdGlvbiIsIm9uVXNlclRvdWNoZWQiLCJvblN0ZXAiLCJyZXMiLCJjaGVja05lZWRGYWxsIiwibXVzaWNNYW5hZ2VyIiwib25QbGF5QXVkaW8iLCJvbkl0ZW0iLCJhZGRTY29yZSIsInYyIiwiY29uZmlnIiwianNvbiIsInByb3BDb25maWciLCJzY29yZSIsIm1hcCIsInJvd0NmZ051bSIsInBsYXlGYWxsQWN0aW9uIiwibW92ZUJ5IiwiYmxvY2tDbHNXaWR0aCIsImVhc2VCb3VuY2VPdXQiLCJzZXEiLCJjYWxsRnVuYyIsInNjYWxlWCIsInNjYWxlWSIsImFuaW1hQ2ZnU3BlZWQiLCJjbGVhclRpbWVvdXQiLCJzdXJmYWNlVGltZXIiLCJzdG9wQWxsQWN0aW9ucyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwibW92ZVRvIiwidGFyZ2V0IiwiYWN0aW9uMyIsInNwYXduIiwic3VyZmFjZUFjdGlvbiIsImRlbGEiLCJnZW5lcmF0ZVByb3BBY3Rpb24iLCJnZW5lcmF0ZUl0ZW0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFJQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFFUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLE9BQU8sRUFBRSxDQURDO0FBQ0U7QUFDWkMsSUFBQUEsU0FBUyxFQUFFLENBRkQ7QUFFSTtBQUNkQyxJQUFBQSxhQUFhLEVBQUVOLEVBQUUsQ0FBQ08sTUFIUjtBQUlWQyxJQUFBQSxXQUFXLEVBQUVSLEVBQUUsQ0FBQ087QUFKTixHQUZMO0FBUVBFLEVBQUFBLElBUk8sZ0JBUUZDLENBUkUsRUFRQ0MsSUFSRCxFQVFPQyxLQVJQLEVBUWNDLFFBUmQsRUFRd0JDLEdBUnhCLEVBUTZCO0FBQ2xDLFNBQUtDLEtBQUwsR0FBYUwsQ0FBYjtBQUNBLFNBQUtOLE9BQUwsR0FBZSxDQUFmOztBQUNBLFFBQUlVLEdBQUosRUFBUyxDQUNQO0FBQ0Q7O0FBQ0RBLElBQUFBLEdBQUcsR0FBR0EsR0FBRyxJQUFJO0FBQ1hFLE1BQUFBLENBQUMsRUFBRUwsSUFBSSxDQUFDSyxDQURHO0FB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LENBQVA7QUFpQkQsR0E5T007QUErT1BlLEVBQUFBLGFBL09PLHlCQStPT0MsSUEvT1AsRUErT2E7QUFBQTs7QUFDbEIsU0FBS1YsWUFBTCxHQUFvQjNDLFVBQVUsQ0FBQyxZQUFNO0FBQ25DLFVBQUllLE1BQU0sR0FBRzFFLEVBQUUsQ0FBQ3NFLE9BQUgsQ0FBVyxNQUFNLE1BQUksQ0FBQ3ZELEtBQUwsQ0FBV3FGLGFBQTVCLEVBQTJDLEdBQTNDLEVBQWdELEdBQWhELENBQWI7QUFDQSxVQUFJdkQsT0FBTyxHQUFHN0MsRUFBRSxDQUFDc0UsT0FBSCxDQUFXLE1BQU0sTUFBSSxDQUFDdkQsS0FBTCxDQUFXcUYsYUFBNUIsRUFBMkMsQ0FBM0MsRUFBOEMsQ0FBOUMsQ0FBZDs7QUFDQSxNQUFBLE1BQUksQ0FBQzFFLElBQUwsQ0FBVWtELFNBQVYsQ0FBb0I1RSxFQUFFLENBQUMyRSxRQUFILENBQVlELE1BQVosRUFBb0I3QixPQUFwQixDQUFwQjtBQUNELEtBSjZCLEVBSTNCbUUsSUFKMkIsQ0FBOUI7QUFLRCxHQXJQTTtBQXNQUEMsRUFBQUEsa0JBdFBPLGdDQXNQYyxDQUVwQixDQXhQTTtBQXlQUEMsRUFBQUEsWUF6UE8sd0JBeVBNdkUsSUF6UE4sRUF5UFk7QUFDakIsU0FBS3RDLFNBQUwsR0FBaUJzQyxJQUFqQjtBQUNEO0FBM1BNLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBoZXl1Y2hhbmdcbiAqIEBmaWxlIOWNleS4quaWueWdl+aOp+WItlxuICovXG5jYy5DbGFzcyh7XG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgcHJvcGVydGllczoge1xuICAgIF9zdGF0dXM6IDAsIC8vMeS4uuWPr+inpuWPkeeCueWHuyAy5Li65bey57uP5raI5aSxXG4gICAgX2l0ZW1UeXBlOiAwLCAvL+aWsOWinumBk+WFt+WKn+iDvSAx5Li65Y+M5YCN5YCN5pWwIDLkuLrngrjlvLlcbiAgICB3YXJuaW5nU3ByaXRlOiBjYy5TcHJpdGUsXG4gICAgbGlnaHRTcHJpdGU6IGNjLlNwcml0ZSxcbiAgfSxcbiAgaW5pdChnLCBkYXRhLCB3aWR0aCwgaXRlbVR5cGUsIHBvcykge1xuICAgIHRoaXMuX2dhbWUgPSBnXG4gICAgdGhpcy5fc3RhdHVzID0gMVxuICAgIGlmIChwb3MpIHtcbiAgICAgIC8vY2MubG9nKCfnlJ/miJDnmoTmlrnlnZcnLCBwb3MpXG4gICAgfVxuICAgIHBvcyA9IHBvcyB8fCB7XG4gICAgICB4OiBkYXRhLngsXG4gICAgICB5OiBkYXRhLnlcbiAgICB9XG4gICAgdGhpcy5faXRlbVR5cGUgPSBpdGVtVHlwZSB8fCAwXG4gICAgdGhpcy53YXJuaW5nVHlwZSA9IDBcbiAgICB0aGlzLmlzUHVzaCA9IGZhbHNlXG4gICAgdGhpcy5iaW5kRXZlbnQoKVxuICAgIHRoaXMuY29sb3IgPSBkYXRhLmNvbG9yIHx8IE1hdGguY2VpbChNYXRoLnJhbmRvbSgpICogNClcbiAgICB0aGlzLmNvbG9yU3ByaXRlID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdjb2xvcicpLmdldENvbXBvbmVudChjYy5TcHJpdGUpXG4gICAgdGhpcy5jb2xvclNwcml0ZS5zcHJpdGVGcmFtZSA9IGl0ZW1UeXBlID8gZy5wcm9wU3ByaXRlRnJhbWVbKGl0ZW1UeXBlIC0gMSkgKiA0ICsgdGhpcy5jb2xvciAtIDFdIDogdGhpcy5fZ2FtZS5ibG9ja1Nwcml0ZVt0aGlzLmNvbG9yIC0gMV1cbiAgICB0aGlzLndhcm5pbmdTcHJpdGUuc3ByaXRlRnJhbWUgPSAnJ1xuICAgIHRoaXMuX3dpZHRoID0gd2lkdGhcbiAgICB0aGlzLl9nYW1lQ29udHJvbGxlciA9IGcuX2dhbWVDb250cm9sbGVyXG4gICAgLy8g6K6h566X5a69XG4gICAgdGhpcy5saWdodFNwcml0ZS5ub2RlLmFjdGl2ZSA9IGZhbHNlXG4gICAgLy8gIHRoaXMubGlnaHRTcHJpdGUuc3ByaXRlRnJhbWUgPSB0aGlzLl9nYW1lLmJsb2NrU3ByaXRlW3RoaXMuY29sb3IgLSAxXVxuICAgIHRoaXMubm9kZS53aWR0aCA9IHRoaXMubm9kZS5oZWlnaHQgPSB3aWR0aFxuICAgIHRoaXMuc3RhcnRUaW1lID0gZGF0YS5zdGFydFRpbWVcbiAgICB0aGlzLmlpZCA9IGRhdGEueVxuICAgIHRoaXMuamlkID0gZGF0YS54XG4gICAgLy8gY29uc29sZS5sb2coJ+eUn+aIkOaWueWdl+S9jee9ricsIGRhdGEueSwgZGF0YS54KVxuICAgIHRoaXMubm9kZS54ID0gLSg3MzAgLyAyIC0gZy5nYXBDZmdOdW0gLSB3aWR0aCAvIDIpICsgcG9zLnggKiAod2lkdGggKyBnLmdhcENmZ051bSlcbiAgICB0aGlzLm5vZGUueSA9ICg3MzAgLyAyIC0gZy5nYXBDZmdOdW0gLSB3aWR0aCAvIDIpIC0gcG9zLnkgKiAod2lkdGggKyBnLmdhcENmZ051bSlcbiAgICB0aGlzLm5vZGUuYW5nbGUgPSAwXG4gICAgdGhpcy5wbGF5U3RhcnRBY3Rpb24oKVxuICB9LFxuICBvbldhcm5pbmcodHlwZSkge1xuICAgIHRoaXMud2FybmluZ1Nwcml0ZS5zcHJpdGVGcmFtZSA9IHRoaXMuX2dhbWUud2FybmluZ1Nwcml0ZUZyYW1lW3R5cGUgLSAxXSB8fCAnJ1xuICAgIHRoaXMud2FybmluZ1R5cGUgPSB0eXBlXG4gICAgLy8gICB0aGlzLmxpZ2h0U3ByaXRlLm5vZGUuYWN0aXZlID0gdHJ1ZVxuICAgIGxldCBhY3Rpb24xID0gY2MuYmxpbmsoMSwgMTApXG4gICAgLy8gICB0aGlzLmxpZ2h0U3ByaXRlLm5vZGUucnVuQWN0aW9uKGFjdGlvbjEpXG4gIH0sXG4gIHdhcm5pbmdJbml0KCkge1xuICAgIHRoaXMud2FybmluZ1Nwcml0ZS5zcHJpdGVGcmFtZSA9ICcnXG4gICAgLy8gIHRoaXMubGlnaHRTcHJpdGUubm9kZS5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMuaXNQdXNoID0gZmFsc2VcbiAgfSxcbiAgZ3Jvd0luaXQoKSB7XG4gICAgdGhpcy5ncm93VHlwZSA9IDBcbiAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUuaGVpZ2h0ID0gdGhpcy5jb2xvclNwcml0ZS5ub2RlLndpZHRoID0gdGhpcy5fd2lkdGhcbiAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUueSA9IHRoaXMuY29sb3JTcHJpdGUubm9kZS54ID0gMFxuICB9LFxuICBncm93KHR5cGUpIHsgLy8xMjM0IOS4iuS4i+W3puWPs1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICBpZiAodGhpcy5ncm93VHlwZSAhPSAyKSB7XG4gICAgICAgICAgdGhpcy5jb2xvclNwcml0ZS5ub2RlLmhlaWdodCArPSB0aGlzLl9nYW1lLmdhcENmZ051bSAqIDJcbiAgICAgICAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUueSArPSB0aGlzLl9nYW1lLmdhcENmZ051bVxuICAgICAgICAgIHRoaXMuZ3Jvd1R5cGUgPSAxXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaWYgKHRoaXMuZ3Jvd1R5cGUgIT0gMikge1xuICAgICAgICAgIHRoaXMuY29sb3JTcHJpdGUubm9kZS5oZWlnaHQgKz0gdGhpcy5fZ2FtZS5nYXBDZmdOdW0gKiAyXG4gICAgICAgICAgdGhpcy5jb2xvclNwcml0ZS5ub2RlLnkgLT0gdGhpcy5fZ2FtZS5nYXBDZmdOdW1cbiAgICAgICAgICB0aGlzLmdyb3dUeXBlID0gMVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDM6XG4gICAgICAgIGlmICh0aGlzLmdyb3dUeXBlICE9IDEpIHtcbiAgICAgICAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUud2lkdGggKz0gdGhpcy5fZ2FtZS5nYXBDZmdOdW0gKiAyXG4gICAgICAgICAgdGhpcy5jb2xvclNwcml0ZS5ub2RlLnggLT0gdGhpcy5fZ2FtZS5nYXBDZmdOdW1cbiAgICAgICAgICB0aGlzLmdyb3dUeXBlID0gMlxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDQ6XG4gICAgICAgIGlmICh0aGlzLmdyb3dUeXBlICE9IDEpIHtcbiAgICAgICAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUud2lkdGggKz0gdGhpcy5fZ2FtZS5nYXBDZmdOdW0gKiAyXG4gICAgICAgICAgdGhpcy5jb2xvclNwcml0ZS5ub2RlLnggKz0gdGhpcy5fZ2FtZS5nYXBDZmdOdW1cbiAgICAgICAgICB0aGlzLmdyb3dUeXBlID0gMlxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9LFxuICBiaW5kRXZlbnQoKSB7XG4gICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm9uVG91Y2hlZCwgdGhpcylcbiAgfSxcbiAgLy8g55So5oi354K55Ye7IOaIluiAheiiq+WFtuS7luaWueWdl+inpuWPkVxuICBvblRvdWNoZWQoY29sb3IsIGlzQ2hhaW4sIGlzQm9tYiwgdGltZSkgeyAvL+mBk+WFt+aWsOWinuWPguaVsCBpc0NoYWlu5piv5ZCm6L+e6ZSBIGlzQm9tYuaYr+WQpuW8uuWItua2iOmZpFxuICAgIGlmICh0aW1lKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5vblRvdWNoZWQoY29sb3IsIGZhbHNlLCBpc0JvbWIpXG4gICAgICB9LCB0aW1lKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlzQ2hhaW4gPSBKU09OLnN0cmluZ2lmeShpc0NoYWluKSA9PSAnbnVsbCcgPyB0cnVlIDogaXNDaGFpblxuICAgIGlzQm9tYiA9IGlzQm9tYiA/IGlzQm9tYiA6IGZhbHNlXG4gICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgLy8g54iG54K46Kem5Y+RXG4gICAgaWYgKHRoaXMuX3N0YXR1cyA9PSAxICYmIGlzQm9tYiA9PSB0cnVlKSB7XG4gICAgICB0aGlzLl9zdGF0dXMgPSAyXG4gICAgICB0aGlzLnBsYXlEaWVBY3Rpb24oKS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5vbkJsb2NrUG9wKGNvbG9yLCBpc0NoYWluLCBpc0JvbWIpXG4gICAgICB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKGNvbG9yLnR5cGUpIHtcbiAgICAgIC8vIOS4gOWumuaYr+eUqOaIt+S4u+WKqOinpuWPkSDkv53lrZjov5nkuKrlnZDmoIfnu5lnYW1lXG4gICAgICBpZiAodGhpcy5pc1NpbmdsZSAmJiB0aGlzLl9pdGVtVHlwZSA8PSAxKSB7XG4gICAgICAgIHRoaXMubm9kZS5zY2FsZSA9IDFcbiAgICAgICAgdGhpcy5fZ2FtZS5fZ2FtZVNjb3JlLnRpcEJveC5pbml0KHRoaXMuX2dhbWUuX2dhbWVTY29yZSwgMylcbiAgICAgICAgbGV0IGFjdGlvbjEgPSBjYy5zY2FsZVRvKDAuMSwgMS4xLCAwLjkpXG4gICAgICAgIGxldCBhY3Rpb24yID0gY2Muc2NhbGVUbygwLjMsIDEpLmVhc2luZyhjYy5lYXNlQmFja091dCgyLjApKVxuICAgICAgICBsZXQgYWN0aW9uID0gY2Muc2VxdWVuY2UoYWN0aW9uMSwgYWN0aW9uMilcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihhY3Rpb24pXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgLy8gY29uc29sZS5sb2coJ+aWueWdl+S9jee9ricsIHRoaXMuaWlkLCB0aGlzLmppZCwgdGhpcy5faXRlbVR5cGUpXG4gICAgICBjb2xvciA9IHRoaXMuY29sb3JcbiAgICAgIGlmICh0aGlzLl9zdGF0dXMgPT0gMSAmJiB0aGlzLl9nYW1lLl9zdGF0dXMgPT0gMSAmJiB0aGlzLmNvbG9yID09IGNvbG9yKSB7XG4gICAgICAgIHRoaXMuX2dhbWUub25Vc2VyVG91Y2hlZCh0aGlzLmlpZCwgdGhpcy5qaWQsIHRoaXMuX2l0ZW1UeXBlLCB0aGlzLmNvbG9yLCB0aGlzLndhcm5pbmdUeXBlLCB7XG4gICAgICAgICAgeDogdGhpcy5ub2RlLngsXG4gICAgICAgICAgeTogdGhpcy5ub2RlLnlcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5fZ2FtZS5fZ2FtZVNjb3JlLm9uU3RlcCgtMSkudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICAgdGhpcy5wbGF5RGllQWN0aW9uKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMub25CbG9ja1BvcChjb2xvciwgbnVsbCwgbnVsbClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyDnlLHlhbbku5bmlrnlnZfop6blj5FcbiAgICAgIGlmICh0aGlzLl9zdGF0dXMgPT0gMSAmJiB0aGlzLl9nYW1lLl9zdGF0dXMgPT0gNSAmJiB0aGlzLmNvbG9yID09IGNvbG9yKSB7XG4gICAgICAgIHRoaXMucGxheURpZUFjdGlvbigpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMub25CbG9ja1BvcChjb2xvciwgbnVsbCwgbnVsbClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG9uQmxvY2tQb3AoY29sb3IsIGlzQ2hhaW4sIGlzQm9tYikge1xuICAgIGxldCBzZWxmID0gdGhpc1xuICAgIGlzQ2hhaW4gPSBKU09OLnN0cmluZ2lmeShpc0NoYWluKSA9PSAnbnVsbCcgPyB0cnVlIDogaXNDaGFpblxuICAgIGlzQm9tYiA9IGlzQm9tYiA/IGlzQm9tYiA6IGZhbHNlXG4gICAgc2VsZi5fZ2FtZS5jaGVja05lZWRGYWxsKClcbiAgICBzZWxmLl9nYW1lLl9zdGF0dXMgPSA1XG4gICAgc2VsZi5fZ2FtZUNvbnRyb2xsZXIubXVzaWNNYW5hZ2VyLm9uUGxheUF1ZGlvKDBcbiAgICAgIC8vc2VsZi5fZ2FtZS5fZ2FtZVNjb3JlLmNoYWluIC0gMVxuICAgIClcbiAgICBpZiAodGhpcy5faXRlbVR5cGUgIT0gMCkge1xuICAgICAgLy8gY29uc29sZS5sb2coXCLop6blj5HkuobpgZPlhbdcIiwgdGhpcy5faXRlbVR5cGUpXG5cbiAgICAgIHNlbGYuX2dhbWUub25JdGVtKHRoaXMuX2l0ZW1UeXBlLCBjb2xvciwge1xuICAgICAgICB4OiB0aGlzLm5vZGUueCxcbiAgICAgICAgeTogdGhpcy5ub2RlLnlcbiAgICAgIH0pXG4gICAgfVxuICAgIHNlbGYuX2dhbWUuX2dhbWVTY29yZS5hZGRTY29yZShjYy52Mih0aGlzLm5vZGUueCwgdGhpcy5ub2RlLnkgLSB0aGlzLm5vZGUud2lkdGggKyB0aGlzLl9nYW1lLmdhcENmZ051bSksIHRoaXMuX2l0ZW1UeXBlID09IDMgPyB0aGlzLl9nYW1lLl9nYW1lQ29udHJvbGxlci5jb25maWcuanNvbi5wcm9wQ29uZmlnWzJdLnNjb3JlIDogbnVsbClcblxuICAgIC8vIOi/numUgeeKtuaAgVxuICAgIGlmIChpc0NoYWluKSB7XG4gICAgICBpZiAoKHNlbGYuaWlkIC0gMSkgPj0gMCkge1xuICAgICAgICBzZWxmLl9nYW1lLm1hcFtzZWxmLmlpZCAtIDFdW3NlbGYuamlkXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5vblRvdWNoZWQoY29sb3IpXG4gICAgICB9XG4gICAgICBpZiAoKHNlbGYuaWlkICsgMSkgPCB0aGlzLl9nYW1lLnJvd0NmZ051bSkge1xuICAgICAgICBzZWxmLl9nYW1lLm1hcFtzZWxmLmlpZCArIDFdW3NlbGYuamlkXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5vblRvdWNoZWQoY29sb3IpXG4gICAgICB9XG4gICAgICBpZiAoKHNlbGYuamlkIC0gMSkgPj0gMCkge1xuICAgICAgICBzZWxmLl9nYW1lLm1hcFtzZWxmLmlpZF1bc2VsZi5qaWQgLSAxXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5vblRvdWNoZWQoY29sb3IpXG4gICAgICB9XG4gICAgICBpZiAoKHNlbGYuamlkICsgMSkgPCB0aGlzLl9nYW1lLnJvd0NmZ051bSkge1xuICAgICAgICBzZWxmLl9nYW1lLm1hcFtzZWxmLmlpZF1bc2VsZi5qaWQgKyAxXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5vblRvdWNoZWQoY29sb3IpXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBwbGF5RmFsbEFjdGlvbih5LCBkYXRhKSB7IC8v5LiL6ZmN5LqG5Yeg5Liq5qC85a2QXG4gICAgdGhpcy5fc3RhdHVzID0gMFxuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLmlpZCA9IGRhdGEueVxuICAgICAgdGhpcy5qaWQgPSBkYXRhLnhcbiAgICB9XG4gICAgbGV0IGFjdGlvbiA9IGNjLm1vdmVCeSgwLjI1LCAwLCAteSAqICh0aGlzLl9nYW1lLmdhcENmZ051bSArIHRoaXMuX2dhbWUuYmxvY2tDbHNXaWR0aCkpLmVhc2luZyhjYy5lYXNlQm91bmNlT3V0KDUgLyB5KSkgLy8xICogeSAvIHRoaXMuX2dhbWUuYW5pbWFDZmdTcGVlZFxuICAgIGxldCBzZXEgPSBjYy5zZXF1ZW5jZShhY3Rpb24sIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgIHRoaXMuX3N0YXR1cyA9IDFcbiAgICAgIC8vICB0aGlzLl9nYW1lLmNoZWNrTmVlZEdlbmVyYXRvcigpXG4gICAgfSwgdGhpcykpXG4gICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihzZXEpXG4gIH0sXG4gIHBsYXlTdGFydEFjdGlvbigpIHtcbiAgICB0aGlzLm5vZGUuc2NhbGVYID0gMFxuICAgIHRoaXMubm9kZS5zY2FsZVkgPSAwXG4gICAgbGV0IGFjdGlvbiA9IGNjLnNjYWxlVG8oMC44IC8gdGhpcy5fZ2FtZS5hbmltYUNmZ1NwZWVkLCAxLCAxKS5lYXNpbmcoY2MuZWFzZUJhY2tPdXQoKSlcbiAgICBsZXQgc2VxID0gY2Muc2VxdWVuY2UoYWN0aW9uLCBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICB0aGlzLl9zdGF0dXMgPSAxXG4gICAgfSwgdGhpcykpXG4gICAgLy8g5aaC5p6c5pyJ5bu26L+f5pe26Ze05bCx55So5bu26L+f5pe26Ze0XG4gICAgaWYgKHRoaXMuc3RhcnRUaW1lKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSlcbiAgICAgICAgfSwgdGhpcy5zdGFydFRpbWUgLyAxXG4gICAgICAgIC8vIChjYy5nYW1lLmdldEZyYW1lUmF0ZSgpIC8gNjApXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKVxuICAgIH1cbiAgfSxcbiAgcGxheURpZUFjdGlvbigpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICBjbGVhclRpbWVvdXQodGhpcy5zdXJmYWNlVGltZXIpXG4gICAgdGhpcy5ub2RlLnN0b3BBbGxBY3Rpb25zKClcbiAgICB0aGlzLl9zdGF0dXMgPSAyXG4gICAgdGhpcy5ub2RlLnNjYWxlWCA9IDFcbiAgICB0aGlzLm5vZGUuc2NhbGVZID0gMVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgYWN0aW9uXG4gICAgICBpZiAodGhpcy53YXJuaW5nU3ByaXRlLnNwcml0ZUZyYW1lKSB7IC8v5pyJ6YGT5YW36aKE6K2mXG4gICAgICAgIGxldCBhY3Rpb24xID0gY2Muc2NhbGVUbygwLjIgLyBzZWxmLl9nYW1lLmFuaW1hQ2ZnU3BlZWQsIDEuMSlcbiAgICAgICAgbGV0IGFjdGlvbjIgPSBjYy5tb3ZlVG8oMC4yIC8gc2VsZi5fZ2FtZS5hbmltYUNmZ1NwZWVkLCB0aGlzLl9nYW1lLnRhcmdldC54LCB0aGlzLl9nYW1lLnRhcmdldC55KVxuICAgICAgICBsZXQgYWN0aW9uMyA9IGNjLnNjYWxlVG8oMC4yLCAwKVxuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoYWN0aW9uMSwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoJycpXG4gICAgICAgIH0sIHRoaXMpLCBjYy5zcGF3bihhY3Rpb24yLCBhY3Rpb24zKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFjdGlvbiA9IGNjLnNjYWxlVG8oMC4yIC8gc2VsZi5fZ2FtZS5hbmltYUNmZ1NwZWVkLCAwLCAwKVxuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoYWN0aW9uLCBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSgnJylcbiAgICAgICAgfSwgdGhpcykpXG4gICAgICB9XG4gICAgICBzZWxmLm5vZGUucnVuQWN0aW9uKHNlcSlcbiAgICB9KTtcbiAgfSxcbiAgc3VyZmFjZUFjdGlvbihkZWxhKSB7XG4gICAgdGhpcy5zdXJmYWNlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGxldCBhY3Rpb24gPSBjYy5zY2FsZVRvKDAuNCAvIHRoaXMuX2dhbWUuYW5pbWFDZmdTcGVlZCwgMC44LCAwLjgpXG4gICAgICBsZXQgYWN0aW9uMSA9IGNjLnNjYWxlVG8oMC40IC8gdGhpcy5fZ2FtZS5hbmltYUNmZ1NwZWVkLCAxLCAxKVxuICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShhY3Rpb24sIGFjdGlvbjEpKVxuICAgIH0sIGRlbGEpXG4gIH0sXG4gIGdlbmVyYXRlUHJvcEFjdGlvbigpIHtcblxuICB9LFxuICBnZW5lcmF0ZUl0ZW0odHlwZSkge1xuICAgIHRoaXMuX2l0ZW1UeXBlID0gdHlwZVxuICB9LFxufSk7Il19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/game.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '47c77yOeKpPiJVINXipHohs', 'game');
// Script/game.js

"use strict";

/**
 * @author heyuchang
 * @file 游戏控制
 */
var AC = require('GameAct');

cc.Class({
  "extends": cc.Component,
  properties: {
    _status: 0,
    //0 未开始 1 游戏开始 2 游戏暂停 3 游戏结束 4 下落状态 5无法触摸状态
    blockPrefab: cc.Prefab,
    blockSprite: [cc.SpriteFrame],
    //todo: 换成动态生成 暂不处理
    warningSpriteFrame: [cc.SpriteFrame],
    propSpriteFrame: [cc.SpriteFrame],
    checkMgr: require("elementCheck"),
    revivePage: cc.Node
  },
  start: function start() {
    this.bindNode();
    this.generatePrefabPool();
    this.loadRes();
  },
  loadRes: function loadRes() {},
  init: function init(c) {
    this._gameController = c;
    this._gameScore = c.scoreMgr;
    this.rowCfgNum = c.config.json.rowCfgNum;
    this.gapCfgNum = c.config.json.gapCfgNum;
    this.animaCfgSpeed = c.config.json.gapCfgNum;
    this.blockClsWidth = (730 - (this.rowCfgNum + 1) * this.gapCfgNum) / this.rowCfgNum;
    this.reviveTimer = null; //console.log(this.gapCfgNum)
    //console.log(this.blockClsWidth)
  },
  // 动态获取需要动态控制的组件
  bindNode: function bindNode() {
    this.blocksContainer = this.node.getChildByName('map');
  },
  //---------------- 游戏控制 ---------------------
  // 游戏开始
  gameStart: function gameStart() {
    var _this = this;

    this.recoveryAllBlocks().then();

    this._gameScore.init(this);

    this.mapSet(this.rowCfgNum).then(function (result) {
      // console.log('游戏状态改变', result)
      _this._status = 1;
    });
  },
  // 初始化地图
  mapSet: function mapSet(num) {
    var _this2 = this;

    this.map = new Array();
    var self = this; // 生成两个随机的对象数组

    var a = Math.floor(Math.random() * num);
    var b = Math.floor(Math.random() * num);
    var c = Math.floor(1 + Math.random() * (num - 1)) - 1;
    a == c ? c++ : '';
    var d = Math.floor(Math.random() * num);
    return new Promise(function (resolve, reject) {
      for (var i = 0; i < num; i++) {
        //行
        _this2.map[i] = new Array();

        for (var j = 0; j < num; j++) {
          //列
          var itemType = i == a && j == b ? 1 : i == c && j == d ? 2 : 0;
          self.map[i][j] = self.instantiateBlock(self, {
            x: j,
            y: i,
            width: self.blockClsWidth,
            startTime: (i + j + 1) * self._gameController.config.json.startAnimationTime / num * 2
          }, self.blocksContainer, itemType);
        }
      }

      _this2.checkMgr.init(_this2);

      setTimeout(function () {
        resolve('200 OK');

        _this2.checkMgr.elementCheck(_this2);
      }, self._gameController.config.json.startAnimationTime * num / 2 / 1 //  (cc.game.getFrameRate() / 60)
      );
    });
  },
  //防抖动 判断是否需要检测下落
  checkNeedFall: function checkNeedFall() {
    var _this3 = this;

    if (this.checkNeedFallTimer) {
      clearTimeout(this.checkNeedFallTimer);
    }

    this.checkNeedFallTimer = setTimeout(function () {
      if (_this3._status == 5) {
        _this3._status = 4;

        _this3.onFall();
      }
    }, 300 / 1 // (cc.game.getFrameRate() / 60)
    );
  },
  //方块下落
  onFall: function onFall() {
    var _this4 = this;

    this.checkGenerateProp(this._gameScore.chain).then(function () {
      var self = _this4;
      var canFall = 0; //从每一列的最下面一个开始往上判断
      //如果有空 就判断有几个空 然后让最上方的方块掉落下来

      for (var j = _this4.rowCfgNum - 1; j >= 0; j--) {
        canFall = 0;

        for (var i = _this4.rowCfgNum - 1; i >= 0; i--) {
          if (_this4.map[i][j].getComponent('element')._status == 2) {
            _this4.blockPool.put(_this4.map[i][j]);

            _this4.map[i][j] = null;
            canFall++;
          } else {
            if (canFall != 0) {
              _this4.map[i + canFall][j] = _this4.map[i][j];
              _this4.map[i][j] = null;

              _this4.map[i + canFall][j].getComponent('element').playFallAction(canFall, {
                x: j,
                y: i + canFall
              });
            }
          }
        }

        for (var k = 0; k < canFall; k++) {
          _this4.map[k][j] = _this4.instantiateBlock(_this4, {
            x: j,
            y: k,
            width: _this4.blockClsWidth,
            startTime: null
          }, _this4.blocksContainer, '', {
            x: j,
            y: -canFall + k
          });

          _this4.map[k][j].getComponent('element').playFallAction(canFall, null);
        }
      }

      setTimeout(function () {
        _this4.checkMgr.init(_this4);

        _this4.checkMgr.elementCheck(_this4);

        _this4._status = 1;
      }, 250);
    });
  },
  gameOver: function gameOver() {
    this._status = 3;

    this._gameController.pageManager.addPage(2);

    this._gameController.pageManager.addPage(4);

    if (this._gameController.social.node.active) {
      this._gameController.social.closeBannerAdv();
    }
  },
  // todo 复活
  askRevive: function askRevive() {
    var _this5 = this;

    this._gameController.pageManager.addPage(2);

    this._gameController.pageManager.addPage(5);

    this.revivePage.active = true;
    this.revivePage.getChildByName('askRevive').active = true;
    this.revivePage.getChildByName('successRevive').active = false;
    this.rangeSprite = this.revivePage.getChildByName('askRevive').getChildByName('numBg').getChildByName('sprite').getComponent(cc.Sprite);
    this.rangeSprite.fillRange = 1;
    this.isRangeAction = true;
    var numLabel = this.revivePage.getChildByName('askRevive').getChildByName('numBg').getChildByName('num').getComponent(cc.Label);
    numLabel.string = 9;

    if (this.reviveTimer) {
      clearInterval(this.reviveTimer);
    }

    this.reviveTimer = setInterval(function () {
      if (+numLabel.string > 0) {
        numLabel.string--;
        _this5.rangeSprite.fillRange = 1;
      } else {
        _this5.onSkipRevive();
      }
    }, 1000);
  },
  onReviveButton: function onReviveButton() {
    clearInterval(this.reviveTimer);
    this.isRangeAction = false;

    if (this._gameController.social.node.active) {
      this._gameController.social.onReviveButton(1);
    } else {
      this.showReviveSuccess();
    }
  },
  showReviveSuccess: function showReviveSuccess() {
    //console.log('打开复活成功页面')
    this.revivePage.getChildByName('askRevive').active = false;
    this.revivePage.getChildByName('successRevive').active = true;
  },
  onReviveCertainBtn: function onReviveCertainBtn() {
    this._gameController.pageManager.removePage(2);

    this.revivePage.active = false;
    this._status = 1;

    this._gameScore.onRevive();
  },
  update: function update() {
    if (this.isRangeAction) {
      this.rangeSprite.fillRange -= 1 / 60;
    }
  },
  onSkipRevive: function onSkipRevive() {
    clearInterval(this.reviveTimer);
    this._gameController.pageManager.pages[5].active = false;

    this._gameScore.onGameOver(true);

    this.isRangeAction = false;
  },
  restart: function restart() {
    var _this6 = this;

    this._gameController.pageManager.onOpenPage(1);

    this.recoveryAllBlocks().then(function () {
      _this6.gameStart();
    });
  },
  // -----------------道具相关---------------
  // 储存用户点击时的方块 用于生成道具
  onUserTouched: function onUserTouched(iid, jid, itemType, color, warning, pos) {
    this.target = {
      i: iid,
      j: jid,
      color: color,
      itemType: itemType,
      x: pos.x,
      y: pos.y,
      warning: warning
    };
  },
  // 生成道具 type 1为双倍倍数 2为炸弹 3为加五百
  generatePropItem: function generatePropItem(type) {
    var _this7 = this;

    return new Promise(function (resolve, reject) {
      // 是否做道具生成动画
      _this7.map[_this7.target.i][_this7.target.j] = _this7.instantiateBlock(_this7, {
        x: _this7.target.j,
        y: _this7.target.i,
        color: _this7.target.color,
        width: _this7.blockClsWidth,
        startTime: null
      }, _this7.blocksContainer, type);
      setTimeout(function () {
        resolve();
      }, 300);
    });
  },
  checkGenerateProp: function checkGenerateProp(chain) {
    var _this8 = this;

    return new Promise(function (resolve, reject) {
      if (_this8.target.warning) {
        _this8.generatePropItem(_this8.target.warning).then(function () {
          resolve();
          return;
        });
      }

      resolve();
    });
  },
  onItem: function onItem(type, color, pos) {
    switch (type) {
      case 1:
        // 分数翻倍 最高八倍
        this._gameScore.tipBox.init(this._gameScore, 1);

        this._gameScore.addMult(color, pos);

        this._gameController.musicManager.onDouble();

        for (var i = 0; i < this.rowCfgNum; i++) {
          //行
          for (var j = 0; j < this.rowCfgNum; j++) {
            //列
            if (this.map[i][j] && this.map[i][j].getComponent('element')._status == 1) {
              var distance = Math.sqrt(Math.pow(pos.x - this.map[i][j].x, 2) + Math.pow(pos.y - this.map[i][j].y, 2));

              if (distance != 0) {
                this.map[i][j].getComponent('element').surfaceAction(distance);
              }
            }
          }
        }

        break;

      case 2:
        // 炸弹 消除同种颜色的
        this._gameScore.tipBox.init(this._gameScore, 2);

        this.node.runAction(AC.shackAction(0.1, 10));

        if (this._gameController.social.node.active) {
          this._gameController.social.onShakePhone();
        }

        this.isPropChain = true;

        this._gameController.musicManager.onBoom();

        for (var _i = 0; _i < this.rowCfgNum; _i++) {
          //行
          for (var _j = 0; _j < this.rowCfgNum; _j++) {
            //列
            if (this.map[_i][_j] && this.map[_i][_j].getComponent('element').color == color && this.map[_i][_j] && this.map[_i][_j].getComponent('element')._status != 2) {
              this.map[_i][_j].getComponent('element').onTouched(color, false, true);
            } else {
              this.map[_i][_j].runAction(AC.rockAction(0.2, 10));
            }
          }
        }

        break;

      case 3:
        //:  加步数
        this._gameScore.tipBox.init(this._gameScore, 4);

        this._gameController.musicManager.onDouble();

        for (var _i2 = 0; _i2 < this.rowCfgNum; _i2++) {
          //行
          for (var _j2 = 0; _j2 < this.rowCfgNum; _j2++) {
            //列
            if (this.map[_i2][_j2] && this.map[_i2][_j2].getComponent('element')._status == 1) {
              var _distance = Math.sqrt(Math.pow(pos.x - this.map[_i2][_j2].x, 2) + Math.pow(pos.y - this.map[_i2][_j2].y, 2));

              if (_distance != 0) {
                this.map[_i2][_j2].getComponent('element').surfaceAction(_distance);
              }
            }
          }
        }

        this._gameScore.onStep(3).then();

        break;

      case 4:
        // : 消除全部单身的方块
        this._gameScore.tipBox.init(this._gameScore, 5);

        this.isPropChain = true;

        this._gameController.musicManager.onMagic();

        for (var _i3 = 0; _i3 < this.rowCfgNum; _i3++) {
          //行
          for (var _j3 = 0; _j3 < this.rowCfgNum; _j3++) {
            //列
            if (this.map[_i3][_j3] && this.map[_i3][_j3].getComponent('element').isSingle && this.map[_i3][_j3] && this.map[_i3][_j3].getComponent('element')._status != 2) {
              var _distance2 = Math.sqrt(Math.pow(pos.x - this.map[_i3][_j3].x, 2) + Math.pow(pos.y - this.map[_i3][_j3].y, 2));

              this.map[_i3][_j3].getComponent('element').onTouched(color, false, true, _distance2);

              console.log("魔法棒触发的点", _i3, _j3, this.map[_i3][_j3].getComponent('element').color, this.map[_i3][_j3].getComponent('element').isSingle);
            }
          }
        }

        break;
    }
  },
  //--------------------- 预制体实例化---------------------
  // 生成对象池
  generatePrefabPool: function generatePrefabPool() {
    this.blockPool = new cc.NodePool();

    for (var i = 0; i < Math.pow(this.rowCfgNum, 2); i++) {
      var block = cc.instantiate(this.blockPrefab);
      this.blockPool.put(block);
    }
  },
  // 实例化单个方块
  instantiateBlock: function instantiateBlock(self, data, parent, itemType, pos) {
    itemType = itemType ? itemType : 0;

    if (itemType != 0) {// console.log("道具节点数据", data, itemType)
    }

    var block = null;

    if (self.blockPool && self.blockPool.size() > 0) {
      block = self.blockPool.get();
    } else {
      block = cc.instantiate(self.blockPrefab);
    }

    block.parent = parent;
    block.scale = 1;
    block.x = 0;
    block.y = 0;
    block.getComponent('element').init(self, data, this.blockClsWidth, itemType, pos);
    return block;
  },
  // 回收所有节点
  recoveryAllBlocks: function recoveryAllBlocks() {
    var _this9 = this;

    return new Promise(function (resolve, reject) {
      var children = _this9.blocksContainer.children;

      if (children.length != 0) {
        var length = children.length; //   console.log(length)

        for (var i = 0; i < length; i++) {
          _this9.blockPool.put(children[0]);
        }

        for (var _i4 = 0; _i4 < _this9.rowCfgNum; _i4++) {
          for (var j = 0; j < _this9.rowCfgNum; j++) {
            _this9.map[_i4][j] = null;
          }
        }
      }

      resolve('');
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxnYW1lLmpzIl0sIm5hbWVzIjpbIkFDIiwicmVxdWlyZSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiX3N0YXR1cyIsImJsb2NrUHJlZmFiIiwiUHJlZmFiIiwiYmxvY2tTcHJpdGUiLCJTcHJpdGVGcmFtZSIsIndhcm5pbmdTcHJpdGVGcmFtZSIsInByb3BTcHJpdGVGcmFtZSIsImNoZWNrTWdyIiwicmV2aXZlUGFnZSIsIk5vZGUiLCJzdGFydCIsImJpbmROb2RlIiwiZ2VuZXJhdGVQcmVmYWJQb29sIiwibG9hZFJlcyIsImluaXQiLCJjIiwiX2dhbWVDb250cm9sbGVyIiwiX2dhbWVTY29yZSIsInNjb3JlTWdyIiwicm93Q2ZnTnVtIiwiY29uZmlnIiwianNvbiIsImdhcENmZ051bSIsImFuaW1hQ2ZnU3BlZWQiLCJibG9ja0Nsc1dpZHRoIiwicmV2aXZlVGltZXIiLCJibG9ja3NDb250YWluZXIiLCJub2RlIiwiZ2V0Q2hpbGRCeU5hbWUiLCJnYW1lU3RhcnQiLCJyZWNvdmVyeUFsbEJsb2NrcyIsInRoZW4iLCJtYXBTZXQiLCJyZXN1bHQiLCJudW0iLCJtYXAiLCJBcnJheSIsInNlbGYiLCJhIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiYiIsImQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImkiLCJqIiwiaXRlbVR5cGUiLCJpbnN0YW50aWF0ZUJsb2NrIiwieCIsInkiLCJ3aWR0aCIsInN0YXJ0VGltZSIsInN0YXJ0QW5pbWF0aW9uVGltZSIsInNldFRpbWVvdXQiLCJlbGVtZW50Q2hlY2siLCJjaGVja05lZWRGYWxsIiwiY2hlY2tOZWVkRmFsbFRpbWVyIiwiY2xlYXJUaW1lb3V0Iiwib25GYWxsIiwiY2hlY2tHZW5lcmF0ZVByb3AiLCJjaGFpbiIsImNhbkZhbGwiLCJnZXRDb21wb25lbnQiLCJibG9ja1Bvb2wiLCJwdXQiLCJwbGF5RmFsbEFjdGlvbiIsImsiLCJnYW1lT3ZlciIsInBhZ2VNYW5hZ2VyIiwiYWRkUGFnZSIsInNvY2lhbCIsImFjdGl2ZSIsImNsb3NlQmFubmVyQWR2IiwiYXNrUmV2aXZlIiwicmFuZ2VTcHJpdGUiLCJTcHJpdGUiLCJmaWxsUmFuZ2UiLCJpc1JhbmdlQWN0aW9uIiwibnVtTGFiZWwiLCJMYWJlbCIsInN0cmluZyIsImNsZWFySW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsIm9uU2tpcFJldml2ZSIsIm9uUmV2aXZlQnV0dG9uIiwic2hvd1Jldml2ZVN1Y2Nlc3MiLCJvblJldml2ZUNlcnRhaW5CdG4iLCJyZW1vdmVQYWdlIiwib25SZXZpdmUiLCJ1cGRhdGUiLCJwYWdlcyIsIm9uR2FtZU92ZXIiLCJyZXN0YXJ0Iiwib25PcGVuUGFnZSIsIm9uVXNlclRvdWNoZWQiLCJpaWQiLCJqaWQiLCJjb2xvciIsIndhcm5pbmciLCJwb3MiLCJ0YXJnZXQiLCJnZW5lcmF0ZVByb3BJdGVtIiwidHlwZSIsIm9uSXRlbSIsInRpcEJveCIsImFkZE11bHQiLCJtdXNpY01hbmFnZXIiLCJvbkRvdWJsZSIsImRpc3RhbmNlIiwic3FydCIsInBvdyIsInN1cmZhY2VBY3Rpb24iLCJydW5BY3Rpb24iLCJzaGFja0FjdGlvbiIsIm9uU2hha2VQaG9uZSIsImlzUHJvcENoYWluIiwib25Cb29tIiwib25Ub3VjaGVkIiwicm9ja0FjdGlvbiIsIm9uU3RlcCIsIm9uTWFnaWMiLCJpc1NpbmdsZSIsImNvbnNvbGUiLCJsb2ciLCJOb2RlUG9vbCIsImJsb2NrIiwiaW5zdGFudGlhdGUiLCJkYXRhIiwicGFyZW50Iiwic2l6ZSIsImdldCIsInNjYWxlIiwiY2hpbGRyZW4iLCJsZW5ndGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFJQSxJQUFJQSxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxTQUFELENBQWhCOztBQUNBQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUVQQyxFQUFBQSxVQUFVLEVBQUU7QUFD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ZXl1Y2hhbmdcbiAqIEBmaWxlIOa4uOaIj+aOp+WItlxuICovXG52YXIgQUMgPSByZXF1aXJlKCdHYW1lQWN0JylcbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgX3N0YXR1czogMCwgLy8wIOacquW8gOWniyAxIOa4uOaIj+W8gOWniyAyIOa4uOaIj+aaguWBnCAzIOa4uOaIj+e7k+adnyA0IOS4i+iQveeKtuaAgSA15peg5rOV6Kem5pG454q25oCBXG4gICAgYmxvY2tQcmVmYWI6IGNjLlByZWZhYixcbiAgICBibG9ja1Nwcml0ZTogW2NjLlNwcml0ZUZyYW1lXSwgLy90b2RvOiDmjaLmiJDliqjmgIHnlJ/miJAg5pqC5LiN5aSE55CGXG4gICAgd2FybmluZ1Nwcml0ZUZyYW1lOiBbY2MuU3ByaXRlRnJhbWVdLFxuICAgIHByb3BTcHJpdGVGcmFtZTogW2NjLlNwcml0ZUZyYW1lXSxcbiAgICBjaGVja01ncjogcmVxdWlyZShcImVsZW1lbnRDaGVja1wiKSxcbiAgICByZXZpdmVQYWdlOiBjYy5Ob2RlLFxuICB9LFxuICBzdGFydCgpIHtcbiAgICB0aGlzLmJpbmROb2RlKClcbiAgICB0aGlzLmdlbmVyYXRlUHJlZmFiUG9vbCgpXG4gICAgdGhpcy5sb2FkUmVzKClcbiAgfSxcbiAgbG9hZFJlcygpIHtcblxuICB9LFxuICBpbml0KGMpIHtcbiAgICB0aGlzLl9nYW1lQ29udHJvbGxlciA9IGNcbiAgICB0aGlzLl9nYW1lU2NvcmUgPSBjLnNjb3JlTWdyXG4gICAgdGhpcy5yb3dDZmdOdW0gPSBjLmNvbmZpZy5qc29uLnJvd0NmZ051bVxuICAgIHRoaXMuZ2FwQ2ZnTnVtID0gYy5jb25maWcuanNvbi5nYXBDZmdOdW1cbiAgICB0aGlzLmFuaW1hQ2ZnU3BlZWQgPSBjLmNvbmZpZy5qc29uLmdhcENmZ051bVxuICAgIHRoaXMuYmxvY2tDbHNXaWR0aCA9ICg3MzAgLSAodGhpcy5yb3dDZmdOdW0gKyAxKSAqIHRoaXMuZ2FwQ2ZnTnVtKSAvIHRoaXMucm93Q2ZnTnVtXG4gICAgdGhpcy5yZXZpdmVUaW1lciA9IG51bGxcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuZ2FwQ2ZnTnVtKVxuICAgIC8vY29uc29sZS5sb2codGhpcy5ibG9ja0Nsc1dpZHRoKVxuICB9LFxuICAvLyDliqjmgIHojrflj5bpnIDopoHliqjmgIHmjqfliLbnmoTnu4Tku7ZcbiAgYmluZE5vZGUoKSB7XG4gICAgdGhpcy5ibG9ja3NDb250YWluZXIgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ21hcCcpXG4gIH0sXG4gIC8vLS0tLS0tLS0tLS0tLS0tLSDmuLjmiI/mjqfliLYgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIOa4uOaIj+W8gOWni1xuICBnYW1lU3RhcnQoKSB7XG4gICAgdGhpcy5yZWNvdmVyeUFsbEJsb2NrcygpLnRoZW4oKVxuICAgIHRoaXMuX2dhbWVTY29yZS5pbml0KHRoaXMpXG4gICAgdGhpcy5tYXBTZXQodGhpcy5yb3dDZmdOdW0pLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coJ+a4uOaIj+eKtuaAgeaUueWPmCcsIHJlc3VsdClcbiAgICAgIHRoaXMuX3N0YXR1cyA9IDFcbiAgICB9KVxuXG4gIH0sXG4gIC8vIOWIneWni+WMluWcsOWbvlxuICBtYXBTZXQobnVtKSB7XG4gICAgdGhpcy5tYXAgPSBuZXcgQXJyYXkoKVxuICAgIGxldCBzZWxmID0gdGhpc1xuICAgIC8vIOeUn+aIkOS4pOS4qumaj+acuueahOWvueixoeaVsOe7hFxuICAgIGxldCBhID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtKVxuICAgIGxldCBiID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtKVxuXG4gICAgbGV0IGMgPSBNYXRoLmZsb29yKDEgKyBNYXRoLnJhbmRvbSgpICogKG51bSAtIDEpKSAtIDFcbiAgICBhID09IGMgPyBjKysgOiAnJ1xuICAgIGxldCBkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtKVxuXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW07IGkrKykgeyAvL+ihjFxuICAgICAgICB0aGlzLm1hcFtpXSA9IG5ldyBBcnJheSgpXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtOyBqKyspIHsgLy/liJdcbiAgICAgICAgICBsZXQgaXRlbVR5cGUgPSAoaSA9PSBhICYmIGogPT0gYikgPyAxIDogKGkgPT0gYyAmJiBqID09IGQpID8gMiA6IDBcbiAgICAgICAgICBzZWxmLm1hcFtpXVtqXSA9IHNlbGYuaW5zdGFudGlhdGVCbG9jayhzZWxmLCB7XG4gICAgICAgICAgICB4OiBqLFxuICAgICAgICAgICAgeTogaSxcbiAgICAgICAgICAgIHdpZHRoOiBzZWxmLmJsb2NrQ2xzV2lkdGgsXG4gICAgICAgICAgICBzdGFydFRpbWU6IChpICsgaiArIDEpICogc2VsZi5fZ2FtZUNvbnRyb2xsZXIuY29uZmlnLmpzb24uc3RhcnRBbmltYXRpb25UaW1lIC8gbnVtICogMlxuICAgICAgICAgIH0sIHNlbGYuYmxvY2tzQ29udGFpbmVyLCBpdGVtVHlwZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5jaGVja01nci5pbml0KHRoaXMpXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKCcyMDAgT0snKTtcbiAgICAgICAgICB0aGlzLmNoZWNrTWdyLmVsZW1lbnRDaGVjayh0aGlzKVxuICAgICAgICB9LCBzZWxmLl9nYW1lQ29udHJvbGxlci5jb25maWcuanNvbi5zdGFydEFuaW1hdGlvblRpbWUgKiBudW0gLyAyIC8gMVxuICAgICAgICAvLyAgKGNjLmdhbWUuZ2V0RnJhbWVSYXRlKCkgLyA2MClcbiAgICAgIClcbiAgICB9KVxuICB9LFxuICAvL+mYsuaKluWKqCDliKTmlq3mmK/lkKbpnIDopoHmo4DmtYvkuIvokL1cbiAgY2hlY2tOZWVkRmFsbCgpIHtcbiAgICBpZiAodGhpcy5jaGVja05lZWRGYWxsVGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmNoZWNrTmVlZEZhbGxUaW1lcilcbiAgICB9XG4gICAgdGhpcy5jaGVja05lZWRGYWxsVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXR1cyA9PSA1KSB7XG4gICAgICAgICAgdGhpcy5fc3RhdHVzID0gNFxuICAgICAgICAgIHRoaXMub25GYWxsKClcbiAgICAgICAgfVxuICAgICAgfSwgMzAwIC8gMVxuICAgICAgLy8gKGNjLmdhbWUuZ2V0RnJhbWVSYXRlKCkgLyA2MClcbiAgICApXG4gIH0sXG4gIC8v5pa55Z2X5LiL6JC9XG4gIG9uRmFsbCgpIHtcbiAgICB0aGlzLmNoZWNrR2VuZXJhdGVQcm9wKHRoaXMuX2dhbWVTY29yZS5jaGFpbikudGhlbigoKSA9PiB7XG4gICAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICAgIGxldCBjYW5GYWxsID0gMFxuICAgICAgLy/ku47mr4/kuIDliJfnmoTmnIDkuIvpnaLkuIDkuKrlvIDlp4vlvoDkuIrliKTmlq1cbiAgICAgIC8v5aaC5p6c5pyJ56m6IOWwseWIpOaWreacieWHoOS4quepuiDnhLblkI7orqnmnIDkuIrmlrnnmoTmlrnlnZfmjonokL3kuIvmnaVcbiAgICAgIGZvciAobGV0IGogPSB0aGlzLnJvd0NmZ051bSAtIDE7IGogPj0gMDsgai0tKSB7XG4gICAgICAgIGNhbkZhbGwgPSAwXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLnJvd0NmZ051bSAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLl9zdGF0dXMgPT0gMikge1xuICAgICAgICAgICAgdGhpcy5ibG9ja1Bvb2wucHV0KHRoaXMubWFwW2ldW2pdKVxuICAgICAgICAgICAgdGhpcy5tYXBbaV1bal0gPSBudWxsXG4gICAgICAgICAgICBjYW5GYWxsKytcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNhbkZhbGwgIT0gMCkge1xuICAgICAgICAgICAgICB0aGlzLm1hcFtpICsgY2FuRmFsbF1bal0gPSB0aGlzLm1hcFtpXVtqXVxuICAgICAgICAgICAgICB0aGlzLm1hcFtpXVtqXSA9IG51bGxcbiAgICAgICAgICAgICAgdGhpcy5tYXBbaSArIGNhbkZhbGxdW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLnBsYXlGYWxsQWN0aW9uKGNhbkZhbGwsIHtcbiAgICAgICAgICAgICAgICB4OiBqLFxuICAgICAgICAgICAgICAgIHk6IGkgKyBjYW5GYWxsLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IGNhbkZhbGw7IGsrKykge1xuICAgICAgICAgIHRoaXMubWFwW2tdW2pdID0gdGhpcy5pbnN0YW50aWF0ZUJsb2NrKHRoaXMsIHtcbiAgICAgICAgICAgIHg6IGosXG4gICAgICAgICAgICB5OiBrLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuYmxvY2tDbHNXaWR0aCxcbiAgICAgICAgICAgIHN0YXJ0VGltZTogbnVsbFxuICAgICAgICAgIH0sIHRoaXMuYmxvY2tzQ29udGFpbmVyLCAnJywge1xuICAgICAgICAgICAgeDogaixcbiAgICAgICAgICAgIHk6IC1jYW5GYWxsICsga1xuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5tYXBba11bal0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykucGxheUZhbGxBY3Rpb24oY2FuRmFsbCwgbnVsbClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuY2hlY2tNZ3IuaW5pdCh0aGlzKVxuICAgICAgICB0aGlzLmNoZWNrTWdyLmVsZW1lbnRDaGVjayh0aGlzKVxuICAgICAgICB0aGlzLl9zdGF0dXMgPSAxXG4gICAgICB9LCAyNTApXG4gICAgfSlcbiAgfSxcbiAgZ2FtZU92ZXIoKSB7XG4gICAgdGhpcy5fc3RhdHVzID0gM1xuICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLnBhZ2VNYW5hZ2VyLmFkZFBhZ2UoMilcbiAgICB0aGlzLl9nYW1lQ29udHJvbGxlci5wYWdlTWFuYWdlci5hZGRQYWdlKDQpXG4gICAgaWYgKHRoaXMuX2dhbWVDb250cm9sbGVyLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5fZ2FtZUNvbnRyb2xsZXIuc29jaWFsLmNsb3NlQmFubmVyQWR2KClcbiAgICB9XG4gIH0sXG4gIC8vIHRvZG8g5aSN5rS7XG4gIGFza1Jldml2ZSgpIHtcbiAgICB0aGlzLl9nYW1lQ29udHJvbGxlci5wYWdlTWFuYWdlci5hZGRQYWdlKDIpXG4gICAgdGhpcy5fZ2FtZUNvbnRyb2xsZXIucGFnZU1hbmFnZXIuYWRkUGFnZSg1KVxuICAgIHRoaXMucmV2aXZlUGFnZS5hY3RpdmUgPSB0cnVlXG4gICAgdGhpcy5yZXZpdmVQYWdlLmdldENoaWxkQnlOYW1lKCdhc2tSZXZpdmUnKS5hY3RpdmUgPSB0cnVlXG4gICAgdGhpcy5yZXZpdmVQYWdlLmdldENoaWxkQnlOYW1lKCdzdWNjZXNzUmV2aXZlJykuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLnJhbmdlU3ByaXRlID0gdGhpcy5yZXZpdmVQYWdlLmdldENoaWxkQnlOYW1lKCdhc2tSZXZpdmUnKS5nZXRDaGlsZEJ5TmFtZSgnbnVtQmcnKS5nZXRDaGlsZEJ5TmFtZSgnc3ByaXRlJykuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSlcbiAgICB0aGlzLnJhbmdlU3ByaXRlLmZpbGxSYW5nZSA9IDFcbiAgICB0aGlzLmlzUmFuZ2VBY3Rpb24gPSB0cnVlXG4gICAgbGV0IG51bUxhYmVsID0gdGhpcy5yZXZpdmVQYWdlLmdldENoaWxkQnlOYW1lKCdhc2tSZXZpdmUnKS5nZXRDaGlsZEJ5TmFtZSgnbnVtQmcnKS5nZXRDaGlsZEJ5TmFtZSgnbnVtJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKVxuICAgIG51bUxhYmVsLnN0cmluZyA9IDlcbiAgICBpZiAodGhpcy5yZXZpdmVUaW1lcikge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnJldml2ZVRpbWVyKVxuICAgIH1cbiAgICB0aGlzLnJldml2ZVRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgaWYgKCtudW1MYWJlbC5zdHJpbmcgPiAwKSB7XG4gICAgICAgIG51bUxhYmVsLnN0cmluZy0tXG4gICAgICAgIHRoaXMucmFuZ2VTcHJpdGUuZmlsbFJhbmdlID0gMVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vblNraXBSZXZpdmUoKVxuICAgICAgfVxuICAgIH0sIDEwMDApXG5cbiAgfSxcbiAgb25SZXZpdmVCdXR0b24oKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnJldml2ZVRpbWVyKVxuICAgIHRoaXMuaXNSYW5nZUFjdGlvbiA9IGZhbHNlXG4gICAgaWYgKHRoaXMuX2dhbWVDb250cm9sbGVyLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5fZ2FtZUNvbnRyb2xsZXIuc29jaWFsLm9uUmV2aXZlQnV0dG9uKDEpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvd1Jldml2ZVN1Y2Nlc3MoKVxuICAgIH1cbiAgfSxcbiAgc2hvd1Jldml2ZVN1Y2Nlc3MoKSB7XG4gICAgLy9jb25zb2xlLmxvZygn5omT5byA5aSN5rS75oiQ5Yqf6aG16Z2iJylcbiAgICB0aGlzLnJldml2ZVBhZ2UuZ2V0Q2hpbGRCeU5hbWUoJ2Fza1Jldml2ZScpLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5yZXZpdmVQYWdlLmdldENoaWxkQnlOYW1lKCdzdWNjZXNzUmV2aXZlJykuYWN0aXZlID0gdHJ1ZVxuICB9LFxuICBvblJldml2ZUNlcnRhaW5CdG4oKSB7XG4gICAgdGhpcy5fZ2FtZUNvbnRyb2xsZXIucGFnZU1hbmFnZXIucmVtb3ZlUGFnZSgyKVxuICAgIHRoaXMucmV2aXZlUGFnZS5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMuX3N0YXR1cyA9IDFcbiAgICB0aGlzLl9nYW1lU2NvcmUub25SZXZpdmUoKVxuICB9LFxuICB1cGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuaXNSYW5nZUFjdGlvbikge1xuICAgICAgdGhpcy5yYW5nZVNwcml0ZS5maWxsUmFuZ2UgLT0gMSAvIDYwXG4gICAgfVxuICB9LFxuICBvblNraXBSZXZpdmUoKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnJldml2ZVRpbWVyKVxuICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLnBhZ2VNYW5hZ2VyLnBhZ2VzWzVdLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5fZ2FtZVNjb3JlLm9uR2FtZU92ZXIodHJ1ZSlcbiAgICB0aGlzLmlzUmFuZ2VBY3Rpb24gPSBmYWxzZVxuICB9LFxuICByZXN0YXJ0KCkge1xuICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLnBhZ2VNYW5hZ2VyLm9uT3BlblBhZ2UoMSlcbiAgICB0aGlzLnJlY292ZXJ5QWxsQmxvY2tzKCkudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLmdhbWVTdGFydCgpXG4gICAgfSlcbiAgfSxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS3pgZPlhbfnm7jlhbMtLS0tLS0tLS0tLS0tLS1cbiAgLy8g5YKo5a2Y55So5oi354K55Ye75pe255qE5pa55Z2XIOeUqOS6jueUn+aIkOmBk+WFt1xuICBvblVzZXJUb3VjaGVkKGlpZCwgamlkLCBpdGVtVHlwZSwgY29sb3IsIHdhcm5pbmcsIHBvcykge1xuICAgIHRoaXMudGFyZ2V0ID0ge1xuICAgICAgaTogaWlkLFxuICAgICAgajogamlkLFxuICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgaXRlbVR5cGU6IGl0ZW1UeXBlLFxuICAgICAgeDogcG9zLngsXG4gICAgICB5OiBwb3MueSxcbiAgICAgIHdhcm5pbmc6IHdhcm5pbmdcbiAgICB9XG4gIH0sXG4gIC8vIOeUn+aIkOmBk+WFtyB0eXBlIDHkuLrlj4zlgI3lgI3mlbAgMuS4uueCuOW8uSAz5Li65Yqg5LqU55m+XG4gIGdlbmVyYXRlUHJvcEl0ZW0odHlwZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyDmmK/lkKblgZrpgZPlhbfnlJ/miJDliqjnlLtcbiAgICAgIHRoaXMubWFwW3RoaXMudGFyZ2V0LmldW3RoaXMudGFyZ2V0LmpdID0gdGhpcy5pbnN0YW50aWF0ZUJsb2NrKHRoaXMsIHtcbiAgICAgICAgeDogdGhpcy50YXJnZXQuaixcbiAgICAgICAgeTogdGhpcy50YXJnZXQuaSxcbiAgICAgICAgY29sb3I6IHRoaXMudGFyZ2V0LmNvbG9yLFxuICAgICAgICB3aWR0aDogdGhpcy5ibG9ja0Nsc1dpZHRoLFxuICAgICAgICBzdGFydFRpbWU6IG51bGxcbiAgICAgIH0sIHRoaXMuYmxvY2tzQ29udGFpbmVyLCB0eXBlKVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSwgMzAwKVxuICAgIH0pXG4gIH0sXG4gIGNoZWNrR2VuZXJhdGVQcm9wKGNoYWluKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICh0aGlzLnRhcmdldC53YXJuaW5nKSB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVQcm9wSXRlbSh0aGlzLnRhcmdldC53YXJuaW5nKS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHJlc29sdmUoKVxuICAgIH0pXG4gIH0sXG4gIG9uSXRlbSh0eXBlLCBjb2xvciwgcG9zKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIC8vIOWIhuaVsOe/u+WAjSDmnIDpq5jlhavlgI1cbiAgICAgICAgdGhpcy5fZ2FtZVNjb3JlLnRpcEJveC5pbml0KHRoaXMuX2dhbWVTY29yZSwgMSlcbiAgICAgICAgdGhpcy5fZ2FtZVNjb3JlLmFkZE11bHQoY29sb3IsIHBvcylcbiAgICAgICAgdGhpcy5fZ2FtZUNvbnRyb2xsZXIubXVzaWNNYW5hZ2VyLm9uRG91YmxlKClcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd0NmZ051bTsgaSsrKSB7IC8v6KGMXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLnJvd0NmZ051bTsgaisrKSB7IC8v5YiXXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBbaV1bal0gJiYgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuX3N0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhwb3MueCAtIHRoaXMubWFwW2ldW2pdLngsIDIpICsgTWF0aC5wb3cocG9zLnkgLSB0aGlzLm1hcFtpXVtqXS55LCAyKSlcbiAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlICE9IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5zdXJmYWNlQWN0aW9uKGRpc3RhbmNlKVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgLy8g54K45by5IOa2iOmZpOWQjOenjeminOiJsueahFxuICAgICAgICB0aGlzLl9nYW1lU2NvcmUudGlwQm94LmluaXQodGhpcy5fZ2FtZVNjb3JlLCAyKVxuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKEFDLnNoYWNrQWN0aW9uKDAuMSwgMTApKVxuICAgICAgICBpZiAodGhpcy5fZ2FtZUNvbnRyb2xsZXIuc29jaWFsLm5vZGUuYWN0aXZlKSB7XG4gICAgICAgICAgdGhpcy5fZ2FtZUNvbnRyb2xsZXIuc29jaWFsLm9uU2hha2VQaG9uZSgpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc1Byb3BDaGFpbiA9IHRydWVcbiAgICAgICAgdGhpcy5fZ2FtZUNvbnRyb2xsZXIubXVzaWNNYW5hZ2VyLm9uQm9vbSgpXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dDZmdOdW07IGkrKykgeyAvL+ihjFxuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5yb3dDZmdOdW07IGorKykgeyAvL+WIl1xuICAgICAgICAgICAgaWYgKHRoaXMubWFwW2ldW2pdICYmIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yID09IGNvbG9yICYmIHRoaXMubWFwW2ldW2pdICYmIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLl9zdGF0dXMgIT0gMikge1xuICAgICAgICAgICAgICB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5vblRvdWNoZWQoY29sb3IsIGZhbHNlLCB0cnVlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMubWFwW2ldW2pdLnJ1bkFjdGlvbihBQy5yb2NrQWN0aW9uKDAuMiwgMTApKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAzOiAvLzogIOWKoOatpeaVsFxuICAgICAgICB0aGlzLl9nYW1lU2NvcmUudGlwQm94LmluaXQodGhpcy5fZ2FtZVNjb3JlLCA0KVxuICAgICAgICB0aGlzLl9nYW1lQ29udHJvbGxlci5tdXNpY01hbmFnZXIub25Eb3VibGUoKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93Q2ZnTnVtOyBpKyspIHsgLy/ooYxcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMucm93Q2ZnTnVtOyBqKyspIHsgLy/liJdcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcFtpXVtqXSAmJiB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5fc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgbGV0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvcy54IC0gdGhpcy5tYXBbaV1bal0ueCwgMikgKyBNYXRoLnBvdyhwb3MueSAtIHRoaXMubWFwW2ldW2pdLnksIDIpKVxuICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgIT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLnN1cmZhY2VBY3Rpb24oZGlzdGFuY2UpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZ2FtZVNjb3JlLm9uU3RlcCgzKS50aGVuKClcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQ6IC8vIDog5raI6Zmk5YWo6YOo5Y2V6Lqr55qE5pa55Z2XXG4gICAgICAgIHRoaXMuX2dhbWVTY29yZS50aXBCb3guaW5pdCh0aGlzLl9nYW1lU2NvcmUsIDUpXG4gICAgICAgIHRoaXMuaXNQcm9wQ2hhaW4gPSB0cnVlXG4gICAgICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLm11c2ljTWFuYWdlci5vbk1hZ2ljKClcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd0NmZ051bTsgaSsrKSB7IC8v6KGMXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLnJvd0NmZ051bTsgaisrKSB7IC8v5YiXXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBbaV1bal0gJiYgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuaXNTaW5nbGUgJiYgdGhpcy5tYXBbaV1bal0gJiYgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuX3N0YXR1cyAhPSAyKSB7XG4gICAgICAgICAgICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhwb3MueCAtIHRoaXMubWFwW2ldW2pdLngsIDIpICsgTWF0aC5wb3cocG9zLnkgLSB0aGlzLm1hcFtpXVtqXS55LCAyKSlcbiAgICAgICAgICAgICAgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdlbGVtZW50Jykub25Ub3VjaGVkKGNvbG9yLCBmYWxzZSwgdHJ1ZSwgZGlzdGFuY2UpXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi6a2U5rOV5qOS6Kem5Y+R55qE54K5XCIsIGksaix0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvciwgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuaXNTaW5nbGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0g6aKE5Yi25L2T5a6e5L6L5YyWLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIOeUn+aIkOWvueixoeaxoFxuICBnZW5lcmF0ZVByZWZhYlBvb2woKSB7XG4gICAgdGhpcy5ibG9ja1Bvb2wgPSBuZXcgY2MuTm9kZVBvb2woKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5wb3codGhpcy5yb3dDZmdOdW0sIDIpOyBpKyspIHtcbiAgICAgIGxldCBibG9jayA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYmxvY2tQcmVmYWIpXG4gICAgICB0aGlzLmJsb2NrUG9vbC5wdXQoYmxvY2spXG4gICAgfVxuICB9LFxuICAvLyDlrp7kvovljJbljZXkuKrmlrnlnZdcbiAgaW5zdGFudGlhdGVCbG9jayhzZWxmLCBkYXRhLCBwYXJlbnQsIGl0ZW1UeXBlLCBwb3MpIHtcbiAgICBpdGVtVHlwZSA9IGl0ZW1UeXBlID8gaXRlbVR5cGUgOiAwXG4gICAgaWYgKGl0ZW1UeXBlICE9IDApIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwi6YGT5YW36IqC54K55pWw5o2uXCIsIGRhdGEsIGl0ZW1UeXBlKVxuICAgIH1cbiAgICBsZXQgYmxvY2sgPSBudWxsXG4gICAgaWYgKHNlbGYuYmxvY2tQb29sICYmIHNlbGYuYmxvY2tQb29sLnNpemUoKSA+IDApIHtcbiAgICAgIGJsb2NrID0gc2VsZi5ibG9ja1Bvb2wuZ2V0KClcbiAgICB9IGVsc2Uge1xuICAgICAgYmxvY2sgPSBjYy5pbnN0YW50aWF0ZShzZWxmLmJsb2NrUHJlZmFiKVxuICAgIH1cbiAgICBibG9jay5wYXJlbnQgPSBwYXJlbnRcbiAgICBibG9jay5zY2FsZSA9IDFcbiAgICBibG9jay54ID0gMFxuICAgIGJsb2NrLnkgPSAwXG4gICAgYmxvY2suZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuaW5pdChzZWxmLCBkYXRhLCB0aGlzLmJsb2NrQ2xzV2lkdGgsIGl0ZW1UeXBlLCBwb3MpXG4gICAgcmV0dXJuIGJsb2NrXG4gIH0sXG4gIC8vIOWbnuaUtuaJgOacieiKgueCuVxuICByZWNvdmVyeUFsbEJsb2NrcygpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IGNoaWxkcmVuID0gdGhpcy5ibG9ja3NDb250YWluZXIuY2hpbGRyZW5cbiAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggIT0gMCkge1xuICAgICAgICBsZXQgbGVuZ3RoID0gY2hpbGRyZW4ubGVuZ3RoXG4gICAgICAgIC8vICAgY29uc29sZS5sb2cobGVuZ3RoKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5ibG9ja1Bvb2wucHV0KGNoaWxkcmVuWzBdKVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dDZmdOdW07IGkrKykge1xuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5yb3dDZmdOdW07IGorKykge1xuICAgICAgICAgICAgdGhpcy5tYXBbaV1bal0gPSBudWxsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXNvbHZlKCcnKVxuICAgIH0pXG4gIH0sXG5cbn0pOyJdfQ==
//------QC-SOURCE-SPLIT------
