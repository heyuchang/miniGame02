
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
    this._game.statusType = 2;

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

        _this4._game.statusType = 1;
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

    if (this._game.statusType != 3 && (isTrue || this.reviveTime >= 3)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzY29yZS5qcyJdLCJuYW1lcyI6WyJBQyIsInJlcXVpcmUiLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInNjb3JlUHJlZmFiIiwiUHJlZmFiIiwic2NvcmVQYXJ0aWNsZVByZWZhYiIsIm1haW5TY29yZUxhYmVsIiwiTGFiZWwiLCJzdWNjZXNzRGlhbG9nIiwiY2hhcmFjdGVyTWdyIiwiZmFpbERpYWxvZyIsIk5vZGUiLCJtdWx0UHJvcFByZWZhYiIsImNoYWluU3ByaXRlRnJhbWVBcnIiLCJTcHJpdGVGcmFtZSIsInN0ZXBBbmlMYWJlbCIsInRpcEJveCIsImluaXQiLCJnIiwiX2dhbWUiLCJfZ2FtZUNvbnRyb2xsZXIiLCJzY29yZSIsImxlZnRTdGVwIiwiY29uZmlnIiwianNvbiIsIm9yaWdpblN0ZXAiLCJjaGFpbiIsImxldmVsIiwicmV2aXZlVGltZSIsImNsb3NlTXVsdExhYmVsIiwibGV2ZWxEYXRhIiwiZ2FtZURhdGEiLCJuYW1lTGFiZWwiLCJzdHJpbmciLCJwcm9ncmVzc0JhciIsImxlZnRTdGVwTGFiZWwiLCJub2RlIiwicnVuQWN0aW9uIiwiaGlkZSIsInNjb3JlVGltZXIiLCJjdXJyZW50QWRkZWRTY29yZSIsImFjdGl2ZSIsInNob3dIZXJvQ2hhcmFjdGVyIiwiaGlkZUNoYWluU3ByaXRlIiwic29jaWFsIiwiaGVpZ2h0IiwiZ2V0SGlnaGVzdExldmVsIiwib25TdGVwIiwiZ2lmdFN0ZXAiLCJzdGFydCIsImdlbmVyYXRlUHJlZmFiUG9vbCIsImJpbmROb2RlIiwic2NvcmVQb29sIiwiTm9kZVBvb2wiLCJpIiwiaW5zdGFudGlhdGUiLCJwdXQiLCJzY29yZVBhcnRpY2xlUG9vbCIsInNjb3JlUGFydGljbGUiLCJtdWx0UHJvcFBvb2wiLCJtdWx0UHJvcCIsImluc3RhbnRpYXRlU2NvcmUiLCJzZWxmIiwibnVtIiwicG9zIiwic2l6ZSIsImdldCIsInBhcmVudCIsInNjb3JlQ29udGFpbmVyIiwiZ2V0Q29tcG9uZW50Iiwic2NvcmVQYXJ0aWNsZVRpbWUiLCJnZXRDaGlsZEJ5TmFtZSIsIm11bHRMYWJlbCIsImNoYWluU3ByaXRlIiwiU3ByaXRlIiwiZmFpbFNjb3JlIiwiZmFpbE5hbWUiLCJmYWlsU3ByaXRlIiwiZmFpbEhpZ2hTY29yZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25HYW1lT3ZlciIsInNob3dTdGVwQW5pIiwiYWRkU2NvcmUiLCJzY29yZUJhc2UiLCJjaGFpblRpbWVyIiwiY2xlYXJUaW1lb3V0IiwiaW5pdEN1cnJlbnRTY29yZUxhYmVsIiwic2V0VGltZW91dCIsIm9uQ3VycmVudFNjb3JlTGFiZWwiLCJ4IiwieSIsImNhbGxGdW5jIiwibXVsdGlwbGUiLCJjaGVja0xldmVsVXAiLCJjaGVja0NoYWluIiwiY2hlY2tDaGFpblRpbWVyIiwiY2hhaW5Db25maWciLCJsZW5ndGgiLCJtYXgiLCJtaW4iLCJzaG93Q2hhaW5TcHJpdGUiLCJpZCIsInNwcml0ZUZyYW1lIiwic2NhbGUiLCJwb3BPdXQiLCJsZXZlbExpbWl0Iiwib25MZXZlbFVwIiwiYWRkTXVsdCIsImNvbG9yIiwibWF4TXVsdGlwbGUiLCJzaG93TXVsdExhYmVsIiwiY2FsbGJhY2siLCJhY3Rpb24iLCJzcGF3biIsIm1vdmVUbyIsInNjYWxlVG8iLCJlYXNpbmciLCJlYXNlQmFja091dCIsInNlcSIsInNlcXVlbmNlIiwicGFnZU1hbmFnZXIiLCJhZGRQYWdlIiwibXVzaWNNYW5hZ2VyIiwib25XaW4iLCJvblN1Y2Nlc3NEaWFsb2ciLCJzdGF0dXNUeXBlIiwib3BlbkJhbm5lckFkdiIsImhpZGVOZXh0TGV2ZWxEYXRhIiwib25MZXZlbFVwQnV0dG9uIiwiZG91YmxlIiwiY29uc29sZSIsImxvZyIsImlzTGV2ZWxVcCIsImN1cnJlbnRUYXJnZXQiLCJvbk9wZW5QYWdlIiwic3RlcCIsIm9uTGV2ZWxVcEJ0biIsIm5hbWUiLCJ0aGVuIiwic2hvd05leHRMZXZlbERhdGEiLCJ0b2dnbGVWaXNpYmlsaXR5IiwibW92ZUJ5IiwiaXNUcnVlIiwiZ2FtZU92ZXIiLCJ1cGRhdGVGYWlsUGFnZSIsImFza1Jldml2ZSIsIm9uRG91YmxlU3RlcEJ0biIsIm9uUmV2aXZlQnV0dG9uIiwib25Eb3VibGVTdGVwIiwib25SZXZpdmUiLCJuZXh0TGV2ZWxEYXRhIiwib25GYWlsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBSUEsSUFBSUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsU0FBRCxDQUFoQjs7QUFFQUMsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFFUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLFdBQVcsRUFBRUosRUFBRSxDQUFDSyxNQUROO0FBRVZDLElBQUFBLG1CQUFtQixFQUFFTixFQUFFLENBQUNLLE1BRmQ7QUFHVkUsSUFBQUEsY0FBYyxFQUFFUCxFQUFFLENBQUNRLEtBSFQ7QUFJVkMsSUFBQUEsYUFBYSxFQUFFVixPQUFPLENBQUMsZUFBRCxDQUpaO0FBS1ZXLElBQUFBLFlBQVksRUFBRVgsT0FBTyxDQUFDLFdBQUQsQ0FMWDtBQU1WWSxJQUFBQSxVQUFVLEVBQUVYLEVBQUUsQ0FBQ1ksSUFOTDtBQU9WQyxJQUFBQSxjQUFjLEVBQUViLEVBQUUsQ0FBQ0ssTUFQVDtBQVFWO0FBQ0E7QUFDQVMsSUFBQUEsbUJBQW1CLEVBQUUsQ0FBQ2QsRUFBRSxDQUFDZSxXQUFKLENBVlg7QUFXVkMsSUFBQUEsWUFBWSxFQUFFaEIsRUFBRSxDQUFDUSxLQVhQO0FBYVY7QUFDQVMsSUFBQUEsTUFBTSxFQUFFbEIsT0FBTyxDQUFDLFFBQUQ7QUFkTCxHQUZMO0FBa0JQbUIsRUFBQUEsSUFsQk8sZ0JBa0JGQyxDQWxCRSxFQWtCQztBQUNOLFNBQUtDLEtBQUwsR0FBYUQsQ0FBYjtBQUNBLFNBQUtFLGVBQUwsR0FBdUJGLENBQUMsQ0FBQ0UsZUFBekI7QUFDQSxTQUFLQyxLQUFMLEdBQWEsQ0FBYjtBQUNBLFNBQUtDLFFBQUwsR0FB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S0FBTCxDQUFXZ0ksU0FBWDtBQUNEO0FBQ0YsR0EvU007QUFnVFBDLEVBQUFBLGVBaFRPLDZCQWdUVztBQUNoQixRQUFJLEtBQUtoSSxlQUFMLENBQXFCd0IsTUFBckIsQ0FBNEJSLElBQTVCLENBQWlDSyxNQUFyQyxFQUE2QztBQUMzQyxXQUFLckIsZUFBTCxDQUFxQndCLE1BQXJCLENBQTRCeUcsY0FBNUIsQ0FBMkMsQ0FBM0M7QUFDRCxLQUZELE1BRU87QUFDTCxXQUFLbkIsZUFBTCxDQUFxQixDQUFyQjtBQUNEO0FBQ0YsR0F0VE07QUF1VFBvQixFQUFBQSxZQXZUTywwQkF1VFE7QUFDYixTQUFLcEIsZUFBTCxDQUFxQixDQUFyQjtBQUNELEdBelRNO0FBMFRQcUIsRUFBQUEsUUExVE8sc0JBMFRJO0FBQ1QsU0FBSzNILFVBQUwsSUFBbUIsQ0FBbkI7QUFDQSxTQUFLbUIsTUFBTCxDQUFZLENBQVosRUFBZTZGLElBQWY7QUFDRCxHQTdUTTtBQThUUDtBQUNBQyxFQUFBQSxpQkEvVE8sK0JBK1RhO0FBQ2xCLFFBQUlXLGFBQWEsR0FBRyxLQUFLMUgsU0FBTCxDQUFlLEtBQUtILEtBQXBCLENBQXBCO0FBQ0QsR0FqVU07QUFrVVA7QUFDQXNHLEVBQUFBLGlCQW5VTywrQkFtVWEsQ0FFbkIsQ0FyVU07QUFzVVBpQixFQUFBQSxjQXRVTyw0QkFzVVU7QUFDZixTQUFLdkUsU0FBTCxDQUFlMUMsTUFBZixHQUF3QixPQUFPLEtBQUtaLEtBQUwsR0FBYSxFQUFwQixDQUF4QjtBQUNBLFNBQUtaLFlBQUwsQ0FBa0JnSixNQUFsQixDQUF5QixLQUFLOUgsS0FBOUI7QUFDQSxTQUFLaUQsUUFBTCxDQUFjM0MsTUFBZCxHQUF1QixLQUFLSCxTQUFMLENBQWUsS0FBS0gsS0FBTCxHQUFhLENBQTVCLEVBQStCZ0gsSUFBdEQsQ0FIZSxDQUlmO0FBQ0Q7QUEzVU0sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBhdXRob3IgaGV5dWNoYW5nXHJcbiAqIEBmaWxlICBVSSDliIbmlbDmjqfliLblmahcclxuICovXHJcbnZhciBBQyA9IHJlcXVpcmUoJ0dhbWVBY3QnKVxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICBzY29yZVByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgc2NvcmVQYXJ0aWNsZVByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgbWFpblNjb3JlTGFiZWw6IGNjLkxhYmVsLFxyXG4gICAgc3VjY2Vzc0RpYWxvZzogcmVxdWlyZSgnc3VjY2Vzc0RpYWxvZycpLFxyXG4gICAgY2hhcmFjdGVyTWdyOiByZXF1aXJlKCdjaGFyYWN0ZXInKSxcclxuICAgIGZhaWxEaWFsb2c6IGNjLk5vZGUsXHJcbiAgICBtdWx0UHJvcFByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgLy8gcHJvZ3Jlc3NCYXI6IHJlcXVpcmUoJ3Byb2dyZXNzJyksXHJcbiAgICAvLyBsZWZ0U3RlcExhYmVsOiBjYy5MYWJlbCxcclxuICAgIGNoYWluU3ByaXRlRnJhbWVBcnI6IFtjYy5TcHJpdGVGcmFtZV0sXHJcbiAgICBzdGVwQW5pTGFiZWw6IGNjLkxhYmVsLFxyXG5cclxuICAgIC8v5o+Q56S65bCP5qGGXHJcbiAgICB0aXBCb3g6IHJlcXVpcmUoJ3RpcEJveCcpXHJcbiAgfSxcclxuICBpbml0KGcpIHtcclxuICAgIHRoaXMuX2dhbWUgPSBnXHJcbiAgICB0aGlzLl9nYW1lQ29udHJvbGxlciA9IGcuX2dhbWVDb250cm9sbGVyXHJcbiAgICB0aGlzLnNjb3JlID0gMFxyXG4gICAgdGhpcy5sZWZ0U3RlcCA9IHRoaXMuX2dhbWVDb250cm9sbGVyLmNvbmZpZy5qc29uLm9yaWdpblN0ZXBcclxuICAgIHRoaXMuY2hhaW4gPSAxXHJcbiAgICB0aGlzLmxldmVsID0gMVxyXG4gICAgdGhpcy5yZXZpdmVUaW1lID0gMFxyXG4gICAgdGhpcy5jbG9zZU11bHRMYWJlbCgpXHJcbiAgICB0aGlzLmxldmVsRGF0YSA9IGcuX2dhbWVDb250cm9sbGVyLmdhbWVEYXRhLmpzb24ubGV2ZWxEYXRhXHJcbiAgICB0aGlzLm5hbWVMYWJlbC5zdHJpbmcgPSBcIuiQjOW/g+aCplwiXHJcbiAgICB0aGlzLnByb2dyZXNzQmFyLmluaXQoMCwgdGhpcy5sZXZlbERhdGFbdGhpcy5sZXZlbCAtIDFdLCB0aGlzLmxldmVsKVxyXG4gICAgdGhpcy5sZWZ0U3RlcExhYmVsLnN0cmluZyA9IHRoaXMubGVmdFN0ZXBcclxuICAgIHRoaXMuc3RlcEFuaUxhYmVsLm5vZGUucnVuQWN0aW9uKGNjLmhpZGUoKSlcclxuICAgIHRoaXMuc2NvcmVUaW1lciA9IFtdXHJcbiAgICB0aGlzLmN1cnJlbnRBZGRlZFNjb3JlID0gMFxyXG4gICAgdGhpcy5tYWluU2NvcmVMYWJlbC5ub2RlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICB0aGlzLmNoYXJhY3Rlck1nci5zaG93SGVyb0NoYXJhY3Rlcih0aGlzLmxldmVsKVxyXG4gICAgdGhpcy5oaWRlQ2hhaW5TcHJpdGUoKVxyXG5cclxuICAgIHRoaXMudGlwQm94LmluaXQodGhpcywgMClcclxuICAgIGlmICh0aGlzLl9nYW1lQ29udHJvbGxlci5zb2NpYWwubm9kZS5hY3RpdmUpIHtcclxuICAgICAgbGV0IGhlaWdodCA9IHRoaXMuX2dhbWVDb250cm9sbGVyLnNvY2lhbC5nZXRIaWdoZXN0TGV2ZWwoKVxyXG4gICAgICBpZiAoaGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy5vblN0ZXAodGhpcy5sZXZlbERhdGFbK2hlaWdodCAtIDFdLmdpZnRTdGVwKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBzdGFydCgpIHtcclxuICAgIHRoaXMuZ2VuZXJhdGVQcmVmYWJQb29sKClcclxuICAgIHRoaXMuYmluZE5vZGUoKVxyXG4gIH0sXHJcbiAgZ2VuZXJhdGVQcmVmYWJQb29sKCkge1xyXG4gICAgdGhpcy5zY29yZVBvb2wgPSBuZXcgY2MuTm9kZVBvb2woKVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDsgaSsrKSB7XHJcbiAgICAgIGxldCBzY29yZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc2NvcmVQcmVmYWIpXHJcbiAgICAgIHRoaXMuc2NvcmVQb29sLnB1dChzY29yZSlcclxuICAgIH1cclxuICAgIHRoaXMuc2NvcmVQYXJ0aWNsZVBvb2wgPSBuZXcgY2MuTm9kZVBvb2woKVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDsgaSsrKSB7XHJcbiAgICAgIGxldCBzY29yZVBhcnRpY2xlID0gY2MuaW5zdGFudGlhdGUodGhpcy5zY29yZVBhcnRpY2xlUHJlZmFiKVxyXG4gICAgICB0aGlzLnNjb3JlUGFydGljbGVQb29sLnB1dChzY29yZVBhcnRpY2xlKVxyXG4gICAgfVxyXG4gICAgdGhpcy5tdWx0UHJvcFBvb2wgPSBuZXcgY2MuTm9kZVBvb2woKVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgbGV0IG11bHRQcm9wID0gY2MuaW5zdGFudGlhdGUodGhpcy5tdWx0UHJvcFByZWZhYilcclxuICAgICAgdGhpcy5tdWx0UHJvcFBvb2wucHV0KG11bHRQcm9wKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLy8g5a6e5L6L5YyW5Y2V5Liq5pa55Z2XXHJcbiAgaW5zdGFudGlhdGVTY29yZShzZWxmLCBudW0sIHBvcykge1xyXG4gICAgbGV0IHNjb3JlID0gbnVsbFxyXG4gICAgaWYgKHNlbGYuc2NvcmVQb29sICYmIHNlbGYuc2NvcmVQb29sLnNpemUoKSA+IDApIHtcclxuICAgICAgc2NvcmUgPSBzZWxmLnNjb3JlUG9vbC5nZXQoKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2NvcmUgPSBjYy5pbnN0YW50aWF0ZShzZWxmLnNjb3JlUHJlZmFiKVxyXG4gICAgfVxyXG4gICAgc2NvcmUucGFyZW50ID0gdGhpcy5zY29yZUNvbnRhaW5lclxyXG4gICAgc2NvcmUuZ2V0Q29tcG9uZW50KCdzY29yZUNlbGwnKS5pbml0KHNlbGYsIG51bSwgcG9zKVxyXG5cclxuICAgIGxldCBzY29yZVBhcnRpY2xlID0gbnVsbFxyXG4gICAgaWYgKHNlbGYuc2NvcmVQYXJ0aWNsZVBvb2wgJiYgc2VsZi5zY29yZVBhcnRpY2xlUG9vbC5zaXplKCkgPiAwKSB7XHJcbiAgICAgIHNjb3JlUGFydGljbGUgPSBzZWxmLnNjb3JlUGFydGljbGVQb29sLmdldCgpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzY29yZVBhcnRpY2xlID0gY2MuaW5zdGFudGlhdGUoc2VsZi5zY29yZVBhcnRpY2xlUHJlZmFiKVxyXG4gICAgfVxyXG4gICAgc2NvcmVQYXJ0aWNsZS5wYXJlbnQgPSB0aGlzLnNjb3JlQ29udGFpbmVyXHJcbiAgICBzY29yZVBhcnRpY2xlLmdldENvbXBvbmVudCgnc2NvcmVQYXJ0aWNsZScpLmluaXQoc2VsZiwgcG9zLCB0aGlzLl9nYW1lQ29udHJvbGxlci5jb25maWcuanNvbi5zY29yZVBhcnRpY2xlVGltZSlcclxuICB9LFxyXG4gIGJpbmROb2RlKCkge1xyXG4gICAgdGhpcy5sZWZ0U3RlcExhYmVsID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdVSScpLmdldENoaWxkQnlOYW1lKCdsZWZ0U3RlcE5vZGUnKS5nZXRDaGlsZEJ5TmFtZSgnTGFiZWwnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpXHJcbiAgICB0aGlzLnByb2dyZXNzQmFyID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdVSScpLmdldENoaWxkQnlOYW1lKCdzY29yZU5vZGUnKS5nZXRDaGlsZEJ5TmFtZSgncHJvZ3Jlc3NCYXInKS5nZXRDb21wb25lbnQoJ3Byb2dyZXNzJylcclxuICAgIHRoaXMuc2NvcmVDb250YWluZXIgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ1VJJykuZ2V0Q2hpbGRCeU5hbWUoJ3Njb3JlR3JvdXAnKVxyXG4gICAgdGhpcy5tdWx0TGFiZWwgPSB0aGlzLm1haW5TY29yZUxhYmVsLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ211bHQnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpXHJcbiAgICB0aGlzLm5hbWVMYWJlbCA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnVUknKS5nZXRDaGlsZEJ5TmFtZSgnc2NvcmVOb2RlJykuZ2V0Q2hpbGRCeU5hbWUoJ3Byb2dyZXNzQmFyJykuZ2V0Q2hpbGRCeU5hbWUoJ25hbWUnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpXHJcbiAgICAvLyDlpLHotKXml7bmm7TmlrDlpLHotKVVSVxyXG4gICAgdGhpcy5jaGFpblNwcml0ZSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnVUknKS5nZXRDaGlsZEJ5TmFtZSgnY2hhaW5TcHJpdGUnKS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKVxyXG4gICAgdGhpcy5mYWlsU2NvcmUgPSB0aGlzLmZhaWxEaWFsb2cuZ2V0Q2hpbGRCeU5hbWUoJ2luZm8nKS5nZXRDaGlsZEJ5TmFtZSgnc2NvcmUnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpXHJcbiAgICB0aGlzLmZhaWxOYW1lID0gdGhpcy5mYWlsRGlhbG9nLmdldENoaWxkQnlOYW1lKCdpbmZvJykuZ2V0Q2hpbGRCeU5hbWUoJ2xldmVsJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKVxyXG4gICAgdGhpcy5mYWlsU3ByaXRlID0gdGhpcy5mYWlsRGlhbG9nLmdldENoaWxkQnlOYW1lKCdpbmZvJykuZ2V0Q2hpbGRCeU5hbWUoJ3Nwcml0ZScpLmdldENvbXBvbmVudChjYy5TcHJpdGUpXHJcbiAgICB0aGlzLmZhaWxIaWdoU2NvcmUgPSB0aGlzLmZhaWxEaWFsb2cuZ2V0Q2hpbGRCeU5hbWUoJ2luZm8nKS5nZXRDaGlsZEJ5TmFtZSgnaGlnaFNjb3JlJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKVxyXG4gIH0sXHJcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0g5YiG5pWw5o6n5Yi2IC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIC8vIOWinuWKoCDlh4/lsJHmraXmlbDlubbkuJTliLfmlrBVSVxyXG4gIG9uU3RlcChudW0pIHtcclxuICAgIHRoaXMubGVmdFN0ZXAgKz0gbnVtXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5sZWZ0U3RlcCA8IDApIHtcclxuICAgICAgICB0aGlzLmxlZnRTdGVwID0gMFxyXG4gICAgICAgIHRoaXMub25HYW1lT3ZlcigpXHJcbiAgICAgICAgcmVzb2x2ZShmYWxzZSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXNvbHZlKHRydWUpXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5sZWZ0U3RlcExhYmVsLnN0cmluZyA9IHRoaXMubGVmdFN0ZXBcclxuICAgICAgaWYgKG51bSA+IDApIHtcclxuICAgICAgICB0aGlzLnNob3dTdGVwQW5pKG51bSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG5cclxuICAvL+WinuWKoOWIhuaVsOaAu+aOp+WItiDojrflj5bov57lh7tcclxuICBhZGRTY29yZShwb3MsIHNjb3JlKSB7XHJcbiAgICBzY29yZSA9IHNjb3JlIHx8IHRoaXMuX2dhbWVDb250cm9sbGVyLmNvbmZpZy5qc29uLnNjb3JlQmFzZVxyXG4gICAgLy8g5LiA5qyh5raI6Zmk5Y+v5Lul5Y+gY2hhaW5cclxuICAgIGlmICh0aGlzLmNoYWluVGltZXIpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuY2hhaW5UaW1lcilcclxuICAgIH1cclxuICAgIHRoaXMuaW5pdEN1cnJlbnRTY29yZUxhYmVsKClcclxuICAgIHRoaXMuY2hhaW5UaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMub25DdXJyZW50U2NvcmVMYWJlbCh0aGlzLmN1cnJlbnRBZGRlZFNjb3JlLCB7XHJcbiAgICAgICAgICB4OiAtNjAsXHJcbiAgICAgICAgICB5OiAzNTVcclxuICAgICAgICB9LCBjYy5jYWxsRnVuYygoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnNjb3JlICs9IHRoaXMuY3VycmVudEFkZGVkU2NvcmUgKiB0aGlzLm11bHRpcGxlXHJcbiAgICAgICAgICB0aGlzLmNoZWNrTGV2ZWxVcCgpXHJcbiAgICAgICAgICB0aGlzLmNoYWluID0gMVxyXG4gICAgICAgICAgdGhpcy5jbG9zZU11bHRMYWJlbCgpXHJcbiAgICAgICAgICB0aGlzLmhpZGVDaGFpblNwcml0ZSgpXHJcbiAgICAgICAgICB0aGlzLmN1cnJlbnRBZGRlZFNjb3JlID0gMFxyXG4gICAgICAgICAgdGhpcy5tYWluU2NvcmVMYWJlbC5ub2RlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgfSwgdGhpcykpXHJcbiAgICAgIH0sIDUwMCAvIDFcclxuICAgICAgLy8gKGNjLmdhbWUuZ2V0RnJhbWVSYXRlKCkgLyA2MClcclxuICAgIClcclxuICAgIGxldCBhZGRTY29yZSA9IHNjb3JlID09IHRoaXMuX2dhbWVDb250cm9sbGVyLmNvbmZpZy5qc29uLnNjb3JlQmFzZSA/IChzY29yZSArICh0aGlzLmNoYWluID4gMTYgPyAxNiA6ICh0aGlzLmNoYWluIC0gMSkpICogMTApIDogc2NvcmVcclxuICAgIC8vIGxldCBhZGRTY29yZSA9IHNjb3JlID09IDEwID8gc2NvcmUgKiAodGhpcy5jaGFpbiA+IDEwID8gMTAgOiB0aGlzLmNoYWluKSA6IHNjb3JlXHJcbiAgICB0aGlzLmN1cnJlbnRBZGRlZFNjb3JlICs9IGFkZFNjb3JlXHJcbiAgICB0aGlzLm1haW5TY29yZUxhYmVsLnN0cmluZyA9IHRoaXMuY3VycmVudEFkZGVkU2NvcmVcclxuICAgIHRoaXMuaW5zdGFudGlhdGVTY29yZSh0aGlzLCBhZGRTY29yZSwgcG9zKVxyXG4gICAgdGhpcy5jaGFpbisrXHJcbiAgICB0aGlzLmNoZWNrQ2hhaW4oKVxyXG4gIH0sXHJcbiAgLy8g5Yik5pat6L+e5Ye7XHJcbiAgY2hlY2tDaGFpbigpIHtcclxuICAgIGlmICh0aGlzLmNoZWNrQ2hhaW5UaW1lcikge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5jaGVja0NoYWluVGltZXIpXHJcbiAgICB9XHJcbiAgICB0aGlzLmNoZWNrQ2hhaW5UaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBsZXQgY29uZmlnID0gdGhpcy5fZ2FtZUNvbnRyb2xsZXIuY29uZmlnLmpzb24uY2hhaW5Db25maWdcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb25maWcubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpcy5jaGFpbiA8PSBjb25maWdbaV0ubWF4ICYmIHRoaXMuY2hhaW4gPj0gY29uZmlnW2ldLm1pbikge1xyXG4gICAgICAgICAgLy8gIGNvbnNvbGUubG9nKGNvbmZpZ1tpXS50ZXh0KVxyXG4gICAgICAgICAgdGhpcy5zaG93Q2hhaW5TcHJpdGUoaSlcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSwgMjAwKVxyXG4gIH0sXHJcbiAgc2hvd0NoYWluU3ByaXRlKGlkKSB7XHJcbiAgICB0aGlzLmNoYWluU3ByaXRlLnNwcml0ZUZyYW1lID0gdGhpcy5jaGFpblNwcml0ZUZyYW1lQXJyW2lkXVxyXG4gICAgdGhpcy5jaGFpblNwcml0ZS5ub2RlLnNjYWxlID0gMC41XHJcbiAgICB0aGlzLmNoYWluU3ByaXRlLm5vZGUuYWN0aXZlID0gdHJ1ZVxyXG4gICAgdGhpcy5jaGFpblNwcml0ZS5ub2RlLnJ1bkFjdGlvbihBQy5wb3BPdXQoMC4zKSlcclxuICB9LFxyXG4gIGhpZGVDaGFpblNwcml0ZSgpIHtcclxuICAgIHRoaXMuY2hhaW5TcHJpdGUubm9kZS5hY3RpdmUgPSBmYWxzZVxyXG4gIH0sXHJcbiAgY2hlY2tMZXZlbFVwKCkge1xyXG4gICAgaWYgKHRoaXMubGV2ZWwgPCB0aGlzLmxldmVsRGF0YS5sZW5ndGggJiYgdGhpcy5zY29yZSA+PSB0aGlzLmxldmVsRGF0YVt0aGlzLmxldmVsIC0gMV0uc2NvcmUpIHtcclxuICAgICAgdGhpcy5sZXZlbCsrXHJcbiAgICAgIHRoaXMubGV2ZWwgPiAodGhpcy5sZXZlbERhdGEubGVuZ3RoICsgMSkgPyB0aGlzLmxldmVsTGltaXQoKSA6IHRoaXMub25MZXZlbFVwKClcclxuICAgIH1cclxuICAgIHRoaXMucHJvZ3Jlc3NCYXIuaW5pdCh0aGlzLnNjb3JlLCB0aGlzLmxldmVsRGF0YVt0aGlzLmxldmVsIC0gMV0sIHRoaXMubGV2ZWwpXHJcbiAgfSxcclxuICAvLyDlop7liqDlgI3mlbBcclxuICBhZGRNdWx0KGNvbG9yLCBwb3MpIHtcclxuICAgIC8vVE9ETzog5Yqo5oCB55Sf5oiQ5LiA5Liq5Zu+54mHIOenu+WKqOWIsG11bHRMYWJlbOS4iiDmnIlidWdcclxuICAgIC8vIGlmICh0aGlzLm11bHRQcm9wUG9vbC5zaXplKCkgPiAwKSB7XHJcbiAgICAvLyAgIGxldCBtdWx0UHJvcCA9IHRoaXMubXVsdFByb3BQb29sLmdldCgpXHJcbiAgICAvLyAgIG11bHRQcm9wLnBhcmVudCA9IHRoaXMubWFpblNjb3JlTGFiZWwubm9kZVxyXG4gICAgLy8gICBtdWx0UHJvcC54ID0gcG9zLnhcclxuICAgIC8vICAgbXVsdFByb3AueSA9IHBvcy55XHJcbiAgICAvLyAgIG11bHRQcm9wLmdldENvbXBvbmVudChjYy5TcHJpdGUpLnNwcml0ZUZyYW1lID0gdGhpcy5fZ2FtZS5wcm9wU3ByaXRlRnJhbWVbY29sb3IgLSAxXVxyXG4gICAgLy8gICBtdWx0UHJvcC5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2MubW92ZVRvKDAuMiwgMTg3LCAwKSwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xyXG4gICAgLy8gICAgIHRoaXMubXVsdFByb3BQb29sLnB1dChtdWx0UHJvcClcclxuICAgIC8vICAgfSkpKVxyXG4gICAgLy8gfVxyXG4gICAgaWYgKHRoaXMubXVsdGlwbGUgPCB0aGlzLl9nYW1lQ29udHJvbGxlci5jb25maWcuanNvbi5tYXhNdWx0aXBsZSkge1xyXG4gICAgICB0aGlzLm11bHRpcGxlICo9IDJcclxuICAgICAgdGhpcy5zaG93TXVsdExhYmVsKClcclxuICAgIH1cclxuICB9LFxyXG4gIC8vIOWFs+mXreWAjeaVsOeahOaVsOWtl+aYvuekulxyXG4gIGNsb3NlTXVsdExhYmVsKCkge1xyXG4gICAgdGhpcy5tdWx0aXBsZSA9IDFcclxuICAgIHRoaXMubXVsdExhYmVsLm5vZGUuYWN0aXZlID0gZmFsc2VcclxuICB9LFxyXG4gIHNob3dNdWx0TGFiZWwoKSB7XHJcbiAgICB0aGlzLm11bHRMYWJlbC5ub2RlLnNjYWxlID0gMC41XHJcbiAgICB0aGlzLm11bHRMYWJlbC5zdHJpbmcgPSB0aGlzLm11bHRpcGxlXHJcbiAgICB0aGlzLm11bHRMYWJlbC5ub2RlLmFjdGl2ZSA9IHRydWVcclxuICAgIHRoaXMubXVsdExhYmVsLm5vZGUucnVuQWN0aW9uKEFDLnBvcE91dCgwLjMpKVxyXG4gIH0sXHJcbiAgLy8g5aKe5Yqg5YiG5pWw5YCN5pWwXHJcbiAgaW5pdEN1cnJlbnRTY29yZUxhYmVsKCkge1xyXG4gICAgdGhpcy5tYWluU2NvcmVMYWJlbC5ub2RlLmFjdGl2ZSA9IHRydWVcclxuICAgIHRoaXMubWFpblNjb3JlTGFiZWwubm9kZS54ID0gMFxyXG4gICAgdGhpcy5tYWluU2NvcmVMYWJlbC5ub2RlLnkgPSAwXHJcbiAgICB0aGlzLm1haW5TY29yZUxhYmVsLm5vZGUuc2NhbGUgPSAxXHJcbiAgfSxcclxuICAvLyDnlJ/miJDlsI/nmoTliIbmlbDoioLngrlcclxuICBvbkN1cnJlbnRTY29yZUxhYmVsKG51bSwgcG9zLCBjYWxsYmFjaykge1xyXG4gICAgLy8gVE9ETzog5aKe5Yqg5LiA5Liq5pKS6Iqx54m55pWIXHJcbiAgICB0aGlzLm1haW5TY29yZUxhYmVsLnN0cmluZyA9IG51bVxyXG4gICAgbGV0IGFjdGlvbiA9IGNjLnNwYXduKGNjLm1vdmVUbygwLjIsIHBvcy54LCBwb3MueSksIGNjLnNjYWxlVG8oMC4yLCAwLjQpKS5lYXNpbmcoY2MuZWFzZUJhY2tPdXQoKSlcclxuICAgIGxldCBzZXEgPSBjYy5zZXF1ZW5jZShhY3Rpb24sIGNhbGxiYWNrKVxyXG4gICAgdGhpcy5tYWluU2NvcmVMYWJlbC5ub2RlLnJ1bkFjdGlvbihzZXEpXHJcbiAgfSxcclxuICAvLyDljYfnuqdcclxuICBvbkxldmVsVXAoKSB7XHJcbiAgICB0aGlzLl9nYW1lQ29udHJvbGxlci5wYWdlTWFuYWdlci5hZGRQYWdlKDIpXHJcbiAgICB0aGlzLl9nYW1lQ29udHJvbGxlci5wYWdlTWFuYWdlci5hZGRQYWdlKDMpXHJcbiAgICB0aGlzLl9nYW1lQ29udHJvbGxlci5tdXNpY01hbmFnZXIub25XaW4oKVxyXG4gICAgdGhpcy5zdWNjZXNzRGlhbG9nLmluaXQodGhpcywgdGhpcy5sZXZlbCwgdGhpcy5sZXZlbERhdGEsIHRoaXMuc2NvcmUpIC8v5Y2H57qn5LmL5ZCO55qE562J57qnXHJcbiAgICB0aGlzLmNoYXJhY3Rlck1nci5vbkxldmVsVXAoKVxyXG4gICAgdGhpcy5jaGFyYWN0ZXJNZ3Iub25TdWNjZXNzRGlhbG9nKHRoaXMubGV2ZWwpXHJcbiAgICB0aGlzLl9nYW1lLnN0YXR1c1R5cGUgPSAyXHJcbiAgICBpZiAodGhpcy5fZ2FtZUNvbnRyb2xsZXIuc29jaWFsLm5vZGUuYWN0aXZlKSB7XHJcbiAgICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLnNvY2lhbC5vcGVuQmFubmVyQWR2KClcclxuICAgIH1cclxuICB9LFxyXG4gIC8vIOetiee6p+mZkOWItlxyXG4gIGxldmVsTGltaXQoKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCfnrYnnuqfovr7liLDkuIrpmZAnKVxyXG4gICAgdGhpcy5oaWRlTmV4dExldmVsRGF0YSgpXHJcbiAgfSxcclxuICAvLyDngrnlh7vljYfnuqfmjInpkq5cclxuICBvbkxldmVsVXBCdXR0b24oZG91YmxlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhkb3VibGUpXHJcbiAgICBpZiAodGhpcy5pc0xldmVsVXApIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmlzTGV2ZWxVcCA9IHRydWVcclxuICAgIH1cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB0aGlzLmlzTGV2ZWxVcCA9IGZhbHNlXHJcbiAgICB9LCA1MDApXHJcbiAgICBpZiAoZG91YmxlICYmIGRvdWJsZS5jdXJyZW50VGFyZ2V0KSB7XHJcbiAgICAgIGRvdWJsZSA9IDFcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRvdWJsZSA9IGRvdWJsZSB8fCAxXHJcbiAgICB9XHJcbiAgICB0aGlzLl9nYW1lQ29udHJvbGxlci5wYWdlTWFuYWdlci5vbk9wZW5QYWdlKDEpXHJcbiAgICB0aGlzLmluaXRDdXJyZW50U2NvcmVMYWJlbCgpXHJcbiAgICB0aGlzLm1haW5TY29yZUxhYmVsLnN0cmluZyA9IHRoaXMubGV2ZWxEYXRhW3RoaXMubGV2ZWwgLSAyXS5zdGVwICogZG91YmxlXHJcbiAgICB0aGlzLmNoYXJhY3Rlck1nci5vbkxldmVsVXBCdG4odGhpcy5sZXZlbClcclxuICAgIHRoaXMubmFtZUxhYmVsLnN0cmluZyA9IHRoaXMubGV2ZWxEYXRhW3RoaXMubGV2ZWwgLSAxXS5uYW1lXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5vbkN1cnJlbnRTY29yZUxhYmVsKHRoaXMubGV2ZWxEYXRhW3RoaXMubGV2ZWwgLSAyXS5zdGVwICogZG91YmxlLCB7XHJcbiAgICAgICAgeDogLTI0OCxcclxuICAgICAgICB5OiAzNTBcclxuICAgICAgfSwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xyXG4gICAgICAgIC8vIHRoaXMudGlwQm94LmluaXQodGhpcykg5q+P5qyh5Y2H57qn5bCx5ZKP6K+XXHJcbiAgICAgICAgdGhpcy5vblN0ZXAodGhpcy5sZXZlbERhdGFbdGhpcy5sZXZlbCAtIDJdLnN0ZXAgKiBkb3VibGUpLnRoZW4oKVxyXG4gICAgICAgIHRoaXMuX2dhbWUuc3RhdHVzVHlwZSA9IDFcclxuICAgICAgICB0aGlzLm1haW5TY29yZUxhYmVsLm5vZGUuYWN0aXZlID0gZmFsc2VcclxuICAgICAgfSkpXHJcbiAgICB9LCAzMDApO1xyXG4gICAgdGhpcy5zaG93TmV4dExldmVsRGF0YSgpXHJcbiAgICB0aGlzLmNoZWNrTGV2ZWxVcCgpXHJcbiAgfSxcclxuICAvLyB0b2RvOiDmlrDlop7kuIDkuKog5Yqo55S7IOaVsOWtl+S4iua1ruWSjOe8qeaUvlxyXG4gIHNob3dTdGVwQW5pKG51bSkge1xyXG4gICAgdGhpcy5zdGVwQW5pTGFiZWwuc3RyaW5nID0gJysnICsgKG51bSArICcnKVxyXG4gICAgdGhpcy5zdGVwQW5pTGFiZWwubm9kZS54ID0gLTI0OFxyXG4gICAgdGhpcy5zdGVwQW5pTGFiZWwubm9kZS55ID0gNDAwXHJcbiAgICB0aGlzLnN0ZXBBbmlMYWJlbC5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy50b2dnbGVWaXNpYmlsaXR5KCksIGNjLm1vdmVCeSgwLjYsIDAsIDYwKSwgY2MudG9nZ2xlVmlzaWJpbGl0eSgpKSlcclxuICAgIGxldCBhY3Rpb24gPSBjYy5zZXF1ZW5jZShjYy5zY2FsZVRvKDAuMiwgMC44KSwgQUMucG9wT3V0KDAuOCkpXHJcbiAgICB0aGlzLmxlZnRTdGVwTGFiZWwubm9kZS5wYXJlbnQucnVuQWN0aW9uKGFjdGlvbilcclxuICB9LFxyXG4gIC8vIOa4uOaIj+e7k+adn1xyXG4gIC8vIHRvZG8g5aSN5rS7XHJcbiAgb25HYW1lT3Zlcihpc1RydWUpIHtcclxuICAgIGlzVHJ1ZSA9IGlzVHJ1ZSB8fCAwXHJcbiAgICBpZiAodGhpcy5fZ2FtZS5zdGF0dXNUeXBlICE9IDMgJiYgKGlzVHJ1ZSB8fCB0aGlzLnJldml2ZVRpbWUgPj0gMykpIHtcclxuICAgICAgdGhpcy5fZ2FtZS5nYW1lT3ZlcigpXHJcbiAgICAgIHRoaXMudXBkYXRlRmFpbFBhZ2UoKVxyXG4gICAgICBpZiAodGhpcy5fZ2FtZUNvbnRyb2xsZXIuc29jaWFsLm5vZGUuYWN0aXZlKSB7XHJcbiAgICAgICAgLy8g5LuF5LiK5Lyg5YiG5pWwXHJcbiAgICAgICAgdGhpcy5fZ2FtZUNvbnRyb2xsZXIuc29jaWFsLm9uR2FtZU92ZXIodGhpcy5sZXZlbCwgdGhpcy5zY29yZSlcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICghaXNUcnVlKSB7XHJcbiAgICAgIHRoaXMuX2dhbWUuYXNrUmV2aXZlKClcclxuICAgIH1cclxuICB9LFxyXG4gIG9uRG91YmxlU3RlcEJ0bigpIHtcclxuICAgIGlmICh0aGlzLl9nYW1lQ29udHJvbGxlci5zb2NpYWwubm9kZS5hY3RpdmUpIHtcclxuICAgICAgdGhpcy5fZ2FtZUNvbnRyb2xsZXIuc29jaWFsLm9uUmV2aXZlQnV0dG9uKDApXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm9uTGV2ZWxVcEJ1dHRvbigyKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgb25Eb3VibGVTdGVwKCkge1xyXG4gICAgdGhpcy5vbkxldmVsVXBCdXR0b24oMilcclxuICB9LFxyXG4gIG9uUmV2aXZlKCkge1xyXG4gICAgdGhpcy5yZXZpdmVUaW1lICs9IDFcclxuICAgIHRoaXMub25TdGVwKDUpLnRoZW4oKVxyXG4gIH0sXHJcbiAgLy8g5bGV56S65LiL5LiA57qn55qE5L+h5oGvXHJcbiAgc2hvd05leHRMZXZlbERhdGEoKSB7XHJcbiAgICBsZXQgbmV4dExldmVsRGF0YSA9IHRoaXMubGV2ZWxEYXRhW3RoaXMubGV2ZWxdXHJcbiAgfSxcclxuICAvLyDovr7liLDmnIDpq5jnuqfkuYvlkI4g6ZqQ6JePXHJcbiAgaGlkZU5leHRMZXZlbERhdGEoKSB7XHJcblxyXG4gIH0sXHJcbiAgdXBkYXRlRmFpbFBhZ2UoKSB7XHJcbiAgICB0aGlzLmZhaWxTY29yZS5zdHJpbmcgPSBcIiBcIiArICh0aGlzLnNjb3JlICsgJycpXHJcbiAgICB0aGlzLmNoYXJhY3Rlck1nci5vbkZhaWwodGhpcy5sZXZlbClcclxuICAgIHRoaXMuZmFpbE5hbWUuc3RyaW5nID0gdGhpcy5sZXZlbERhdGFbdGhpcy5sZXZlbCAtIDFdLm5hbWVcclxuICAgIC8vdGhpcy5mYWlsSGlnaFNjb3JlLnN0cmluZyA9IFwi5q2j5Zyo6I635Y+W5oKo55qE5pyA6auY5YiGLi4uXCJcclxuICB9LFxyXG5cclxufSk7Il19
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxlbGVtZW50Q2hlY2suanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJncm91cHMiLCJtYXAiLCJtYXBMZW5ndGgiLCJpbml0IiwiZyIsIl9nYW1lIiwicm93Q2ZnTnVtIiwiaSIsImoiLCJnZXRDb21wb25lbnQiLCJpc1NpbmdsZSIsIndhcm5pbmdJbml0IiwiZWxlbWVudENoZWNrIiwicHJvcENvbmZpZyIsIl9nYW1lQ29udHJvbGxlciIsImNvbmZpZyIsImpzb24iLCJtaW4iLCJsZW5ndGgiLCJwdXNoUG9wIiwidGFyZ2V0IiwieCIsImlpZCIsInkiLCJqaWQiLCJjb2xvciIsImNvbnNvbGUiLCJsb2ciLCJ6IiwibWF4Iiwid2FybmluZyIsInR5cGUiLCJpc1B1c2giLCJwdXNoIiwiZ3JvdXAiLCJpdGVtIiwib25XYXJuaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBSUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBRVBDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxNQUFNLEVBQUUsRUFERTtBQUVWQyxJQUFBQSxHQUFHLEVBQUUsRUFGSztBQUdWQyxJQUFBQSxTQUFTLEVBQUU7QUFIRCxHQUZMO0FBT1BDLEVBQUFBLElBUE8sZ0JBT0ZDLENBUEUsRUFPQztBQUNOLFNBQUtDLEtBQUwsR0FBYUQsQ0FBYjtBQUNBLFNBQUtILEdBQUwsR0FBV0csQ0FBQyxDQUFDSCxHQUFiO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQkUsQ0FBQyxDQUFDRSxTQUFuQjs7QUFDQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS0wsU0FBekIsRUFBb0NLLENBQUMsRUFBckMsRUFBeUM7QUFBRTtBQUN6QyxXQUFLUCxNQUFMLENBQVlPLENBQVosSUFBaUIsRUFBakI7O0FBQ0EsV0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEtBQUtOLFNBQXpCLEVBQW9DTSxDQUFDLEVBQXJDLEVBQXlDO0FBQUU7QUFDekM7QUFDQSxZQUFJLENBQUMsS0FBS1AsR0FBTCxDQUFTTSxDQUFULEVBQVlDLENBQVosQ0FBTCxFQUFxQixDQUNuQjtBQUNEOztBQUNELGFBQUtQLEdBQUwsQ0FBU00sQ0FBVCxFQUFZQyxDQUFaLEVBQWVDLFlBQWYsQ0FBNEIsU0FBNUIsRUFBdUNDLFFBQXZDLEdBQWtELEtBQWxEO0FBQ0EsYUFBS1QsR0FBTCxDQUFTTSxDQUFULEVBQVlDLENBQVosRUFBZUMsWUFBZixDQUE0QixTQUE1QixFQUF1Q0UsV0FBdkM7QUFDQSxhQUFLWCxNQUFMLENBQVlPLENBQVosRUFBZUMsQ0FBZixJQUFvQixFQUFwQjtBQUNEO0FBQ0Y7QUFDRixHQXZCTTtBQXdCUEksRUFBQUEsWUF4Qk8sd0JBd0JNUixDQXhCTixFQXdCUztBQUFFO0FBQ2hCLFFBQUlTLFVBQVUsR0FBR1QsQ0FBQyxDQUFDVSxlQUFGLENBQWtCQyxNQUFsQixDQUF5QkMsSUFBekIsQ0FBOEJILFVBQS9DO0FBQ0EsU0FBS1IsS0FBTCxHQUFhRCxDQUFiO0FBQ0EsU0FBS0gsR0FBTCxHQUFXRyxDQUFDLENBQUNILEdBQWI7QUFDQSxTQUFLQyxTQUFMLEdBQWlCRSxDQUFDLENBQUNFLFNBQW5CO0FBQ0EsUUFBSVcsR0FBRyxHQUFHLEdBQVY7O0FBQ0EsU0FBSyxJQUFJVixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHTSxVQUFVLENBQUNLLE1BQS9CLEVBQXVDWCxDQUFDLEVBQXhDLEVBQTRDO0FBQzFDVSxNQUFBQSxHQUFHLEdBQUdKLFVBQVUsQ0FBQ04sQ0FBRCxDQUFWLENBQWNVLEdBQWQsR0FBb0JBLEdBQXBCLEdBQTBCSixVQUFVLENBQUNOLENBQUQsQ0FBVixDQUFjVSxHQUF4QyxHQUE4Q0EsR0FBcEQ7QUFDRDs7QUFDRCxTQUFLLElBQUlWLEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUcsS0FBS0wsU0FBekIsRUFBb0NLLEVBQUMsRUFBckMsRUFBeUM7QUFBRTtBQUN6QyxXQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS04sU0FBekIsRUFBb0NNLENBQUMsRUFBckMsRUFBeUM7QUFBRTtBQUN6QyxhQUFLVyxPQUFMLENBQWEsS0FBS2xCLEdBQUwsQ0FBU00sRUFBVCxFQUFZQyxDQUFaLENBQWIsRUFBNkJELEVBQTdCLEVBQWdDQyxDQUFoQztBQUNBLFlBQUlZLE1BQU0sR0FBRyxLQUFLbkIsR0FBTCxDQUFTTSxFQUFULEVBQVlDLENBQVosQ0FBYjtBQUNBLFlBQUlhLENBQUMsR0FBR0QsTUFBTSxDQUFDWCxZQUFQLENBQW9CLFNBQXBCLEVBQStCYSxHQUF2QztBQUNBLFlBQUlDLENBQUMsR0FBR0gsTUFBTSxDQUFDWCxZQUFQLENBQW9CLFNBQXBCLEVBQStCZSxHQUF2QztBQUNBLFlBQUlkLFFBQVEsR0FBRyxJQUFmOztBQUNBLFlBQUtXLENBQUMsR0FBRyxDQUFMLElBQVcsQ0FBWCxJQUFnQixLQUFLcEIsR0FBTCxDQUFTb0IsQ0FBQyxHQUFHLENBQWIsRUFBZ0JFLENBQWhCLEVBQW1CZCxZQUFuQixDQUFnQyxTQUFoQyxFQUEyQ2dCLEtBQTNDLElBQW9ETCxNQUFNLENBQUNYLFlBQVAsQ0FBb0IsU0FBcEIsRUFBK0JnQixLQUF2RyxFQUE4RztBQUM1R2YsVUFBQUEsUUFBUSxHQUFHLEtBQVg7QUFDRDs7QUFDRCxZQUFLVyxDQUFDLEdBQUcsQ0FBTCxHQUFVLEtBQUtuQixTQUFmLElBQTRCLEtBQUtELEdBQUwsQ0FBU29CLENBQUMsR0FBRyxDQUFiLEVBQWdCRSxDQUFoQixFQUFtQmQsWUFBbkIsQ0FBZ0MsU0FBaEMsRUFBMkNnQixLQUEzQyxJQUFvREwsTUFBTSxDQUFDWCxZQUFQLENBQW9CLFNBQXBCLEVBQStCZ0IsS0FBbkgsRUFBMEg7QUFDeEhmLFVBQUFBLFFBQVEsR0FBRyxLQUFYO0FBQ0Q7O0FBRUQsWUFBS2EsQ0FBQyxHQUFHLENBQUwsSUFBVyxDQUFYLElBQWdCLEtBQUt0QixHQUFMLENBQVNvQixDQUFULEVBQVlFLENBQUMsR0FBRyxDQUFoQixFQUFtQmQsWUFBbkIsQ0FBZ0MsU0FBaEMsRUFBMkNnQixLQUEzQyxJQUFvREwsTUFBTSxDQUFDWCxZQUFQLENBQW9CLFNBQXBCLEVBQStCZ0IsS0FBdkcsRUFBOEc7QUFDNUdmLFVBQUFBLFFBQVEsR0FBRyxLQUFYO0FBQ0Q7O0FBQ0QsWUFBS2EsQ0FBQyxHQUFHLENBQUwsR0FBVSxLQUFLckIsU0FBZixJQUE0QixLQUFLRCxHQUFMLENBQVNvQixDQUFULEVBQVlFLENBQUMsR0FBRyxDQUFoQixFQUFtQmQsWUFBbkIsQ0FBZ0MsU0FBaEMsRUFBMkNnQixLQUEzQyxJQUFvREwsTUFBTSxDQUFDWCxZQUFQLENBQW9CLFNBQXBCLEVBQStCZ0IsS0FBbkgsRUFBMEg7QUFDeEhmLFVBQUFBLFFBQVEsR0FBRyxLQUFYO0FBQ0Q7O0FBQ0QsYUFBS1QsR0FBTCxDQUFTTSxFQUFULEVBQVlDLENBQVosRUFBZUMsWUFBZixDQUE0QixTQUE1QixFQUF1Q0MsUUFBdkMsR0FBa0RBLFFBQWxEO0FBQ0FnQixRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWXBCLEVBQVosRUFBZUMsQ0FBZixFQUFrQixLQUFLUCxHQUFMLENBQVNNLEVBQVQsRUFBWUMsQ0FBWixFQUFlQyxZQUFmLENBQTRCLFNBQTVCLEVBQXVDQyxRQUF6RCxFQUFtRSxLQUFLVCxHQUFMLENBQVNNLEVBQVQsRUFBWUMsQ0FBWixFQUFlQyxZQUFmLENBQTRCLFNBQTVCLEVBQXVDZ0IsS0FBMUc7O0FBQ0EsWUFBSSxLQUFLekIsTUFBTCxDQUFZTyxFQUFaLEVBQWVDLENBQWYsRUFBa0JVLE1BQWxCLElBQTRCRCxHQUFoQyxFQUFxQztBQUNuQyxlQUFLLElBQUlXLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdmLFVBQVUsQ0FBQ0ssTUFBL0IsRUFBdUNVLENBQUMsRUFBeEMsRUFBNEM7QUFDMUMsZ0JBQUksS0FBSzVCLE1BQUwsQ0FBWU8sRUFBWixFQUFlQyxDQUFmLEVBQWtCVSxNQUFsQixJQUE0QkwsVUFBVSxDQUFDZSxDQUFELENBQVYsQ0FBY0MsR0FBMUMsSUFBaUQsS0FBSzdCLE1BQUwsQ0FBWU8sRUFBWixFQUFlQyxDQUFmLEVBQWtCVSxNQUFsQixJQUE0QkwsVUFBVSxDQUFDZSxDQUFELENBQVYsQ0FBY1gsR0FBL0YsRUFBb0c7QUFDbEcsbUJBQUthLE9BQUwsQ0FBYWpCLFVBQVUsQ0FBQ2UsQ0FBRCxDQUFWLENBQWNHLElBQTNCLEVBQWlDLEtBQUsvQixNQUFMLENBQVlPLEVBQVosRUFBZUMsQ0FBZixDQUFqQztBQUNEO0FBQ0Y7QUFDRjtBQUNGO0FBQ0Y7QUFDRixHQWhFTTtBQWlFUFcsRUFBQUEsT0FqRU8sbUJBaUVDQyxNQWpFRCxFQWlFU2IsQ0FqRVQsRUFpRVlDLENBakVaLEVBaUVlO0FBQUU7QUFDdEI7QUFDQTtBQUNBO0FBQ0FZLElBQUFBLE1BQU0sQ0FBQ1gsWUFBUCxDQUFvQixTQUFwQixFQUErQnVCLE1BQS9CLEdBQXdDLElBQXhDO0FBQ0EsU0FBS2hDLE1BQUwsQ0FBWU8sQ0FBWixFQUFlQyxDQUFmLEVBQWtCeUIsSUFBbEIsQ0FBdUJiLE1BQXZCO0FBQ0EsUUFBSUMsQ0FBQyxHQUFHRCxNQUFNLENBQUNYLFlBQVAsQ0FBb0IsU0FBcEIsRUFBK0JhLEdBQXZDO0FBQ0EsUUFBSUMsQ0FBQyxHQUFHSCxNQUFNLENBQUNYLFlBQVAsQ0FBb0IsU0FBcEIsRUFBK0JlLEdBQXZDOztBQUNBLFFBQUtILENBQUMsR0FBRyxDQUFMLElBQVcsQ0FBZixFQUFrQjtBQUNoQixVQUFJLENBQUMsS0FBS3BCLEdBQUwsQ0FBU29CLENBQUMsR0FBRyxDQUFiLEVBQWdCRSxDQUFoQixFQUFtQmQsWUFBbkIsQ0FBZ0MsU0FBaEMsRUFBMkN1QixNQUE1QyxJQUFzRCxLQUFLL0IsR0FBTCxDQUFTb0IsQ0FBQyxHQUFHLENBQWIsRUFBZ0JFLENBQWhCLEVBQW1CZCxZQUFuQixDQUFnQyxTQUFoQyxFQUEyQ2dCLEtBQTNDLElBQW9ETCxNQUFNLENBQUNYLFlBQVAsQ0FBb0IsU0FBcEIsRUFBK0JnQixLQUE3SSxFQUFvSjtBQUNsSixhQUFLTixPQUFMLENBQWEsS0FBS2xCLEdBQUwsQ0FBU29CLENBQUMsR0FBRyxDQUFiLEVBQWdCRSxDQUFoQixDQUFiLEVBQWlDaEIsQ0FBakMsRUFBb0NDLENBQXBDO0FBQ0Q7QUFDRjs7QUFDRCxRQUFLYSxDQUFDLEdBQUcsQ0FBTCxHQUFVLEtBQUtuQixTQUFuQixFQUE4QjtBQUM1QixVQUFJLENBQUMsS0FBS0QsR0FBTCxDQUFTb0IsQ0FBQyxHQUFHLENBQWIsRUFBZ0JFLENBQWhCLEVBQW1CZCxZQUFuQixDQUFnQyxTQUFoQyxFQUEyQ3VCLE1BQTVDLElBQXNELEtBQUsvQixHQUFMLENBQVNvQixDQUFDLEdBQUcsQ0FBYixFQUFnQkUsQ0FBaEIsRUFBbUJkLFlBQW5CLENBQWdDLFNBQWhDLEVBQTJDZ0IsS0FBM0MsSUFBb0RMLE1BQU0sQ0FBQ1gsWUFBUCxDQUFvQixTQUFwQixFQUErQmdCLEtBQTdJLEVBQW9KO0FBQ2xKLGFBQUtOLE9BQUwsQ0FBYSxLQUFLbEIsR0FBTCxDQUFTb0IsQ0FBQyxHQUFHLENBQWIsRUFBZ0JFLENBQWhCLENBQWIsRUFBaUNoQixDQUFqQyxFQUFvQ0MsQ0FBcEM7QUFDRDtBQUNGOztBQUNELFFBQUtlLENBQUMsR0FBRyxDQUFMLElBQVcsQ0FBZixFQUFrQjtBQUNoQixVQUFJLENBQUMsS0FBS3RCLEdBQUwsQ0FBU29CLENBQVQsRUFBWUUsQ0FBQyxHQUFHLENBQWhCLEVBQW1CZCxZQUFuQixDQUFnQyxTQUFoQyxFQUEyQ3VCLE1BQTVDLElBQXNELEtBQUsvQixHQUFMLENBQVNvQixDQUFULEVBQVlFLENBQUMsR0FBRyxDQUFoQixFQUFtQmQsWUFBbkIsQ0FBZ0MsU0FBaEMsRUFBMkNnQixLQUEzQyxJQUFvREwsTUFBTSxDQUFDWCxZQUFQLENBQW9CLFNBQXBCLEVBQStCZ0IsS0FBN0ksRUFBb0o7QUFDbEosYUFBS04sT0FBTCxDQUFhLEtBQUtsQixHQUFMLENBQVNvQixDQUFULEVBQVlFLENBQUMsR0FBRyxDQUFoQixDQUFiLEVBQWlDaEIsQ0FBakMsRUFBb0NDLENBQXBDO0FBQ0Q7QUFDRjs7QUFDRCxRQUFLZSxDQUFDLEdBQUcsQ0FBTCxHQUFVLEtBQUtyQixTQUFuQixFQUE4QjtBQUM1QixVQUFJLENBQUMsS0FBS0QsR0FBTCxDQUFTb0IsQ0FBVCxFQUFZRSxDQUFDLEdBQUcsQ0FBaEIsRUFBbUJkLFlBQW5CLENBQWdDLFNBQWhDLEVBQTJDdUIsTUFBNUMsSUFBc0QsS0FBSy9CLEdBQUwsQ0FBU29CLENBQVQsRUFBWUUsQ0FBQyxHQUFHLENBQWhCLEVBQW1CZCxZQUFuQixDQUFnQyxTQUFoQyxFQUEyQ2dCLEtBQTNDLElBQW9ETCxNQUFNLENBQUNYLFlBQVAsQ0FBb0IsU0FBcEIsRUFBK0JnQixLQUE3SSxFQUFvSjtBQUNsSixhQUFLTixPQUFMLENBQWEsS0FBS2xCLEdBQUwsQ0FBU29CLENBQVQsRUFBWUUsQ0FBQyxHQUFHLENBQWhCLENBQWIsRUFBaUNoQixDQUFqQyxFQUFvQ0MsQ0FBcEM7QUFDRDtBQUNGLEtBM0JtQixDQTZCcEI7O0FBRUQsR0FoR007QUFpR1BzQixFQUFBQSxPQWpHTyxtQkFpR0NDLElBakdELEVBaUdPRyxLQWpHUCxFQWlHYztBQUNuQkEsSUFBQUEsS0FBSyxDQUFDakMsR0FBTixDQUFVLFVBQUFrQyxJQUFJLEVBQUk7QUFDaEJBLE1BQUFBLElBQUksQ0FBQzFCLFlBQUwsQ0FBa0IsU0FBbEIsRUFBNkIyQixTQUE3QixDQUF1Q0wsSUFBdkM7QUFDRCxLQUZEO0FBR0Q7QUFyR00sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBhdXRob3IgaGV5dWNoYW5nXHJcbiAqIEBmaWxlIOajgOa1i+e7hOS7tlxyXG4gKi9cclxuY2MuQ2xhc3Moe1xyXG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuICBwcm9wZXJ0aWVzOiB7XHJcbiAgICBncm91cHM6IFtdLFxyXG4gICAgbWFwOiBbXSxcclxuICAgIG1hcExlbmd0aDogOFxyXG4gIH0sXHJcbiAgaW5pdChnKSB7XHJcbiAgICB0aGlzLl9nYW1lID0gZ1xyXG4gICAgdGhpcy5tYXAgPSBnLm1hcFxyXG4gICAgdGhpcy5tYXBMZW5ndGggPSBnLnJvd0NmZ051bVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1hcExlbmd0aDsgaSsrKSB7IC8v6KGMXHJcbiAgICAgIHRoaXMuZ3JvdXBzW2ldID0gW11cclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLm1hcExlbmd0aDsgaisrKSB7IC8v5YiXXHJcbiAgICAgICAgLy8gdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuZ3Jvd0luaXQoKSAvL+WFqOmDqOWIneWni+WMllxyXG4gICAgICAgIGlmICghdGhpcy5tYXBbaV1bal0pIHtcclxuICAgICAgICAgIC8vICAgIGNjLmxvZygn5oql6ZSZeCx5OicsIGksIGopXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmlzU2luZ2xlID0gZmFsc2VcclxuICAgICAgICB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS53YXJuaW5nSW5pdCgpXHJcbiAgICAgICAgdGhpcy5ncm91cHNbaV1bal0gPSBbXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBlbGVtZW50Q2hlY2soZykgeyAvL+ivpeWHveaVsOS4u+imgeeUqOS6juajgOa1i+S4gOS4quWMuuWdl+iDveWQpuW9ouaIkOmBk+WFt+etiVxyXG4gICAgbGV0IHByb3BDb25maWcgPSBnLl9nYW1lQ29udHJvbGxlci5jb25maWcuanNvbi5wcm9wQ29uZmlnXHJcbiAgICB0aGlzLl9nYW1lID0gZ1xyXG4gICAgdGhpcy5tYXAgPSBnLm1hcFxyXG4gICAgdGhpcy5tYXBMZW5ndGggPSBnLnJvd0NmZ051bVxyXG4gICAgbGV0IG1pbiA9IDk5OVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wQ29uZmlnLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIG1pbiA9IHByb3BDb25maWdbaV0ubWluIDwgbWluID8gcHJvcENvbmZpZ1tpXS5taW4gOiBtaW5cclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tYXBMZW5ndGg7IGkrKykgeyAvL+ihjFxyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMubWFwTGVuZ3RoOyBqKyspIHsgLy/liJdcclxuICAgICAgICB0aGlzLnB1c2hQb3AodGhpcy5tYXBbaV1bal0sIGksIGopXHJcbiAgICAgICAgbGV0IHRhcmdldCA9IHRoaXMubWFwW2ldW2pdXHJcbiAgICAgICAgbGV0IHggPSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuaWlkXHJcbiAgICAgICAgbGV0IHkgPSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuamlkXHJcbiAgICAgICAgbGV0IGlzU2luZ2xlID0gdHJ1ZVxyXG4gICAgICAgIGlmICgoeCAtIDEpID49IDAgJiYgdGhpcy5tYXBbeCAtIDFdW3ldLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yID09IHRhcmdldC5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvcikge1xyXG4gICAgICAgICAgaXNTaW5nbGUgPSBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKHggKyAxKSA8IHRoaXMubWFwTGVuZ3RoICYmIHRoaXMubWFwW3ggKyAxXVt5XS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvciA9PSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IpIHtcclxuICAgICAgICAgIGlzU2luZ2xlID0gZmFsc2VcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgoeSAtIDEpID49IDAgJiYgdGhpcy5tYXBbeF1beSAtIDFdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yID09IHRhcmdldC5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvcikge1xyXG4gICAgICAgICAgaXNTaW5nbGUgPSBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKHkgKyAxKSA8IHRoaXMubWFwTGVuZ3RoICYmIHRoaXMubWFwW3hdW3kgKyAxXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvciA9PSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IpIHtcclxuICAgICAgICAgIGlzU2luZ2xlID0gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuaXNTaW5nbGUgPSBpc1NpbmdsZVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGksIGosIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmlzU2luZ2xlLCB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvcilcclxuICAgICAgICBpZiAodGhpcy5ncm91cHNbaV1bal0ubGVuZ3RoID49IG1pbikge1xyXG4gICAgICAgICAgZm9yIChsZXQgeiA9IDA7IHogPCBwcm9wQ29uZmlnLmxlbmd0aDsgeisrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdyb3Vwc1tpXVtqXS5sZW5ndGggPD0gcHJvcENvbmZpZ1t6XS5tYXggJiYgdGhpcy5ncm91cHNbaV1bal0ubGVuZ3RoID49IHByb3BDb25maWdbel0ubWluKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy53YXJuaW5nKHByb3BDb25maWdbel0udHlwZSwgdGhpcy5ncm91cHNbaV1bal0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIHB1c2hQb3AodGFyZ2V0LCBpLCBqKSB7IC8v55So5LqO5Yik5pat5LiA5Liq5pa55Z2X5Zub5Liq5pa55ZCR5LiK55qE5pa55Z2X6aKc6Imy5piv5ZCm5LiA5qC3IOWmguaenOS4gOagt+WImeWKoOWFpee7hCDlpoLmnpznu4Tplb/luqblsI/kuo4x5YiZ6L+U5ZueZmFsc2U/XHJcbiAgICAvLyBpZiAodGFyZ2V0LmdldENvbXBvbmVudCgnZWxlbWVudCcpLmlzUHVzaD09dHJ1ZSkge1xyXG4gICAgLy8gICByZXR1cm5cclxuICAgIC8vIH1cclxuICAgIHRhcmdldC5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5pc1B1c2ggPSB0cnVlXHJcbiAgICB0aGlzLmdyb3Vwc1tpXVtqXS5wdXNoKHRhcmdldClcclxuICAgIGxldCB4ID0gdGFyZ2V0LmdldENvbXBvbmVudCgnZWxlbWVudCcpLmlpZFxyXG4gICAgbGV0IHkgPSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuamlkXHJcbiAgICBpZiAoKHggLSAxKSA+PSAwKSB7XHJcbiAgICAgIGlmICghdGhpcy5tYXBbeCAtIDFdW3ldLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmlzUHVzaCAmJiB0aGlzLm1hcFt4IC0gMV1beV0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IgPT0gdGFyZ2V0LmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yKSB7XHJcbiAgICAgICAgdGhpcy5wdXNoUG9wKHRoaXMubWFwW3ggLSAxXVt5XSwgaSwgailcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCh4ICsgMSkgPCB0aGlzLm1hcExlbmd0aCkge1xyXG4gICAgICBpZiAoIXRoaXMubWFwW3ggKyAxXVt5XS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5pc1B1c2ggJiYgdGhpcy5tYXBbeCArIDFdW3ldLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yID09IHRhcmdldC5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvcikge1xyXG4gICAgICAgIHRoaXMucHVzaFBvcCh0aGlzLm1hcFt4ICsgMV1beV0sIGksIGopXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICgoeSAtIDEpID49IDApIHtcclxuICAgICAgaWYgKCF0aGlzLm1hcFt4XVt5IC0gMV0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuaXNQdXNoICYmIHRoaXMubWFwW3hdW3kgLSAxXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvciA9PSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IpIHtcclxuICAgICAgICB0aGlzLnB1c2hQb3AodGhpcy5tYXBbeF1beSAtIDFdLCBpLCBqKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoKHkgKyAxKSA8IHRoaXMubWFwTGVuZ3RoKSB7XHJcbiAgICAgIGlmICghdGhpcy5tYXBbeF1beSArIDFdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmlzUHVzaCAmJiB0aGlzLm1hcFt4XVt5ICsgMV0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IgPT0gdGFyZ2V0LmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yKSB7XHJcbiAgICAgICAgdGhpcy5wdXNoUG9wKHRoaXMubWFwW3hdW3kgKyAxXSwgaSwgailcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOWIpOaWreaWueWdl+aYr+WQpuWNlei6q1xyXG5cclxuICB9LFxyXG4gIHdhcm5pbmcodHlwZSwgZ3JvdXApIHtcclxuICAgIGdyb3VwLm1hcChpdGVtID0+IHtcclxuICAgICAgaXRlbS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5vbldhcm5pbmcodHlwZSlcclxuICAgIH0pXHJcbiAgfVxyXG59KTsiXX0=
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxpbGx1c3RyYXRpdmUuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJjb250YWluZXIiLCJOb2RlIiwiYXZhdGFyIiwicHJlZmFiIiwiUHJlZmFiIiwiaW5pdCIsImMiLCJfZ2FtZUNvbnRyb2xsZXIiLCJzb2NpYWwiLCJub2RlIiwiYWN0aXZlIiwiaGlnaExldmVsIiwiZ2V0SGlnaGVzdExldmVsIiwic2hvd0F2YXRhciIsImxvYWRDb250YWluZXIiLCJsZXZlbCIsImRhdGEiLCJnYW1lRGF0YSIsImpzb24iLCJsZXZlbERhdGEiLCJoZWlnaHRTY29yZSIsImdldEhpZ2hlc3RTY29yZSIsImdldENoaWxkQnlOYW1lIiwiZ2V0Q29tcG9uZW50IiwiTGFiZWwiLCJzdHJpbmciLCJuYW1lIiwic2V0VGltZW91dCIsInNjb3JlTWdyIiwiY2hhcmFjdGVyTWdyIiwic2hvd0F2YXRhckNoYXJhY3RlciIsImNsZWFyQ29udGFpbmVyIiwiaSIsImxlbmd0aCIsImNhcmQiLCJpbnN0YW50aWF0ZSIsInBhcmVudCIsImluaXRDYXJkIiwiY2hpbGRyZW4iLCJtYXAiLCJpdGVtIiwiZGVzdHJveSIsImluZm8iLCJzZWxmTGV2ZWwiLCJjb2xvciIsIkNvbG9yIiwiV0hJVEUiLCJnaWZ0U3RlcCIsInNob3dDaGFyYWN0ZXIiLCJCTEFDSyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0FBR0FBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBRVBDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxTQUFTLEVBQUVKLEVBQUUsQ0FBQ0ssSUFESjtBQUVWQyxJQUFBQSxNQUFNLEVBQUVOLEVBQUUsQ0FBQ0ssSUFGRDtBQUdWRSxJQUFBQSxNQUFNLEVBQUVQLEVBQUUsQ0FBQ1E7QUFIRCxHQUZMO0FBT1BDLEVBQUFBLElBUE8sZ0JBT0ZD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bUIsYUFBM0MsQ0FBeURqQyxLQUFLLEdBQUcsQ0FBakUsRUFBb0VtQixJQUFJLENBQUNaLGNBQUwsQ0FBb0IsSUFBcEIsQ0FBcEUsRUFBK0YxQixFQUFFLENBQUNpRCxLQUFILENBQVNJLEtBQXhHO0FBQ0QsS0Fab0MsQ0FhckM7O0FBQ0Q7QUEvRE0sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBhdXRob3IgaGV5dWNoYW5nXHJcbiAqL1xyXG5jYy5DbGFzcyh7XHJcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG4gIHByb3BlcnRpZXM6IHtcclxuICAgIGNvbnRhaW5lcjogY2MuTm9kZSxcclxuICAgIGF2YXRhcjogY2MuTm9kZSxcclxuICAgIHByZWZhYjogY2MuUHJlZmFiLFxyXG4gIH0sXHJcbiAgaW5pdChjKSB7XHJcbiAgICB0aGlzLl9nYW1lQ29udHJvbGxlciA9IGNcclxuXHJcbiAgICBpZiAoYy5zb2NpYWwubm9kZS5hY3RpdmUpIHtcclxuICAgICAgbGV0IGhpZ2hMZXZlbCA9IGMuc29jaWFsLmdldEhpZ2hlc3RMZXZlbCgpXHJcbiAgICAgIGlmIChoaWdoTGV2ZWwpIHtcclxuICAgICAgICB0aGlzLnNob3dBdmF0YXIoaGlnaExldmVsKVxyXG4gICAgICAgIHRoaXMubG9hZENvbnRhaW5lcigraGlnaExldmVsKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuYXZhdGFyLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5sb2FkQ29udGFpbmVyKDEpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYXZhdGFyLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICB9XHJcbiAgfSxcclxuICBzaG93QXZhdGFyKGxldmVsKSB7XHJcbiAgICB0aGlzLmF2YXRhci5hY3RpdmUgPSB0cnVlXHJcbiAgICBsZXQgZGF0YSA9IHRoaXMuX2dhbWVDb250cm9sbGVyLmdhbWVEYXRhLmpzb24ubGV2ZWxEYXRhWytsZXZlbCAtIDFdXHJcbiAgICBsZXQgaGVpZ2h0U2NvcmUgPSB0aGlzLl9nYW1lQ29udHJvbGxlci5zb2NpYWwuZ2V0SGlnaGVzdFNjb3JlKClcclxuICAgIHRoaXMuYXZhdGFyLmdldENoaWxkQnlOYW1lKCduYW1lJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSAn5Y6G5Y+y5pyA6auYOicgKyBkYXRhLm5hbWVcclxuICAgIHRoaXMuYXZhdGFyLmdldENoaWxkQnlOYW1lKCdzY29yZScpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gJ+WIhuaVsCcgKyBoZWlnaHRTY29yZVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLnNjb3JlTWdyLmNoYXJhY3Rlck1nci5zaG93QXZhdGFyQ2hhcmFjdGVyKCtsZXZlbCwgdGhpcy5hdmF0YXIuZ2V0Q2hpbGRCeU5hbWUoJ2RiJykpXHJcbiAgICB9LCAxMDAwKVxyXG4gIH0sXHJcbiAgbG9hZENvbnRhaW5lcihsZXZlbCkge1xyXG4gICAgbGV0IGRhdGEgPSB0aGlzLl9nYW1lQ29udHJvbGxlci5nYW1lRGF0YS5qc29uLmxldmVsRGF0YVxyXG4gICAgdGhpcy5jbGVhckNvbnRhaW5lcigpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGNhcmQgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnByZWZhYilcclxuICAgICAgICBjYXJkLnBhcmVudCA9IHRoaXMuY29udGFpbmVyXHJcbiAgICAgICAgdGhpcy5pbml0Q2FyZChjYXJkLCBkYXRhW2ldLCBpLCBsZXZlbClcclxuICAgICAgfVxyXG4gICAgfSwgMTAwMClcclxuICB9LFxyXG4gIGNsZWFyQ29udGFpbmVyKCkge1xyXG4gICAgdGhpcy5jb250YWluZXIuY2hpbGRyZW4ubWFwKGl0ZW0gPT4ge1xyXG4gICAgICBpdGVtLmRlc3Ryb3koKVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGluaXRDYXJkKGNhcmQsIGluZm8sIGxldmVsLCBzZWxmTGV2ZWwpIHtcclxuICAgIGlmIChsZXZlbCA8IHNlbGZMZXZlbCkge1xyXG4gICAgICBjYXJkLmdldENoaWxkQnlOYW1lKCduYW1lJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBpbmZvLm5hbWVcclxuICAgICAgLy9jYXJkLmdldENoaWxkQnlOYW1lKCdzY29yZScpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCLlvpfliIY6XCIgKyBpbmZvLnNjb3JlXHJcbiAgICAgIGNhcmQuZ2V0Q2hpbGRCeU5hbWUoJ2RiJykuY29sb3IgPSBjYy5Db2xvci5XSElURVxyXG4gICAgICBjYXJkLmdldENoaWxkQnlOYW1lKCdnaWZ0U3RlcCcpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCLlvIDlsYDlpZblirFcIiArIGluZm8uZ2lmdFN0ZXAgKyBcIuatpVwiXHJcbiAgICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLnNjb3JlTWdyLmNoYXJhY3Rlck1nci5zaG93Q2hhcmFjdGVyKGxldmVsICsgMSwgY2FyZC5nZXRDaGlsZEJ5TmFtZSgnZGInKSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNhcmQuZ2V0Q2hpbGRCeU5hbWUoJ25hbWUnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9ICc/Pz8nXHJcbiAgICAgIGNhcmQuZ2V0Q2hpbGRCeU5hbWUoJ2dpZnRTdGVwJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIuW8gOWxgOWlluWKsT8/P+atpVwiXHJcbiAgICAgIGNhcmQuZ2V0Q2hpbGRCeU5hbWUoJ2RiJykuY29sb3IgPSBjYy5Db2xvci5CTEFDS1xyXG4gICAgICB0aGlzLl9nYW1lQ29udHJvbGxlci5zY29yZU1nci5jaGFyYWN0ZXJNZ3Iuc2hvd0NoYXJhY3RlcihsZXZlbCArIDEsIGNhcmQuZ2V0Q2hpbGRCeU5hbWUoJ2RiJyksIGNjLkNvbG9yLkJMQUNLKVxyXG4gICAgfVxyXG4gICAgLy8gdGhpcy5fZ2FtZUNvbnRyb2xsZXIuc2NvcmVNZ3IuY2hhcmFjdGVyTWdyLnNob3dDaGFyYWN0ZXIobGV2ZWwgKyAxLCBjYXJkLmdldENoaWxkQnlOYW1lKCdkYicpLCAwKVxyXG4gIH1cclxufSk7Il19
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
    var tween1 = cc.scaleTo(0.1, 1.2, 1.2);
    var action2 = cc.moveBy(0.1, 0, 30);
    var action3 = cc.moveTo(0.2, 0, 0);
    var action4 = cc.scaleTo(0.2, 0.5, 0.5); // let seq = cc.sequence(tween1, cc.callFunc(() => {
    //   let seq2 = cc.sequence(action3, cc.moveBy(0.1, 0, 0), action4, cc.callFunc(() => {
    //     s.scorePool.put(this.node)
    //   }, this))
    //   this.node.runAction(seq2)
    // }, this))
    // this.label.node.runAction(seq)

    var spa1 = cc.spawn(tween1, action2);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzY29yZUNlbGwuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJsYWJlbCIsIkxhYmVsIiwiaW5pdCIsInMiLCJudW0iLCJwb3MiLCJfZ2FtZVNjb3JlIiwibm9kZSIsIngiLCJ5Iiwic3RyaW5nIiwic2NhbGUiLCJ0d2VlbjEiLCJzY2FsZVRvIiwiYWN0aW9uMiIsIm1vdmVCeSIsImFjdGlvbjMiLCJtb3ZlVG8iLCJhY3Rpb240Iiwic3BhMSIsInNwYXduIiwic3BhMiIsInNlcSIsInNlcXVlbmNlIiwiY2FsbEZ1bmMiLCJzY29yZVBvb2wiLCJwdXQiLCJydW5BY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBR1BDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxLQUFLLEVBQUVKLEVBQUUsQ0FBQ0ssS0FEQSxDQUVWOztBQUZVLEdBSEw7QUFPUDtBQUVBO0FBQ0FDLEVBQUFBLElBVk8sZ0JBVUZDLENBVkUsRUFVQ0MsR0FWRCxFQVVNQyxHQVZOLEVBVVc7QUFBQTs7QUFDaEIsU0FBS0MsVUFBTCxHQUFrQkgsQ0FBbEI7QUFDQSxTQUFLSSxJQUFMLENBQVVDLENBQVYsR0FBY0gsR0FBRyxDQUFDRyxDQUFsQjtBQUNBLFNBQUtELElBQUwsQ0FBVUUsQ0FBVixHQUFjSixHQUFHLENBQUNJLENBQWxCO0FBQ0EsU0FBS1QsS0FBTCxDQUFXVSxNQUFYLEdBQW9CTixHQUFwQixDQUpnQixDQUtoQjs7QUFDQSxTQUFLRyxJQUFMLENBQVVJLEtBQVYsR0FBa0IsQ0FBbEI7QUFDQSxTQUFLWCxLQUFMLENBQVdPLElBQVgsQ0FBZ0JDLENBQWhCLEdBQW9CLENBQXBCO0FBQ0EsU0FBS1IsS0FBTCxDQUFXTyxJQUFYLENBQWdCRSxDQUFoQixHQUFvQixDQUFwQjtBQUNBLFNBQUtULEtBQUwsQ0FBV08sSUFBWCxDQUFnQkksS0FBaEIsR0FBd0IsQ0FBeEI7QUFDQSxRQUFJQyxNQUFNLEdBQUdoQixFQUFFLENBQUNpQixPQUFILENBQVcsR0FBWCxFQUFnQixHQUFoQixFQUFxQixHQUFyQixDQUFiO0FBQ0EsUUFBSUMsT0FBTyxHQUFHbEIsRUFBRSxDQUFDbUIsTUFBSCxDQUFVLEdBQVYsRUFBZSxDQUFmLEVBQWtCLEVBQWxCLENBQWQ7QUFDQSxRQUFJQyxPQUFPLEdBQUdwQixFQUFFLENBQUNxQixNQUFILENBQVUsR0FBVixFQUFlLENBQWYsRUFBa0IsQ0FBbEIsQ0FBZDtBQUNBLFFBQUlDLE9BQU8sR0FBR3RCLEVBQUUsQ0FBQ2lCLE9BQUgsQ0FBVyxHQUFYLEVBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLENBQWQsQ0FiZ0IsQ0FjaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsUUFBSU0sSUFBSSxHQUFHdkIsRUFBRSxDQUFDd0IsS0FBSCxDQUFTUixNQUFULEVBQWlCRSxPQUFqQixDQUFYO0FBQ0EsUUFBSU8sSUFBSSxHQUFHekIsRUFBRSxDQUFDd0IsS0FBSCxDQUFTSixPQUFULEVBQWtCRSxPQUFsQixDQUFYO0FBQ0EsUUFBSUksR0FBRyxHQUFHMUIsRUFBRSxDQUFDMkIsUUFBSCxDQUFZSixJQUFaLEVBQWtCRSxJQUFsQixFQUF3QnpCLEVBQUUsQ0FBQzRCLFFBQUgsQ0FBWSxZQUFNO0FBQ2xEckIsTUFBQUEsQ0FBQyxDQUFDc0IsU0FBRixDQUFZQyxHQUFaLENBQWdCLEtBQUksQ0FBQ25CLElBQXJCO0FBQ0QsS0FGaUMsRUFFL0IsSUFGK0IsQ0FBeEIsQ0FBVjtBQUdBLFNBQUtBLElBQUwsQ0FBVW9CLFNBQVYsQ0FBb0JMLEdBQXBCO0FBQ0QsR0FyQ00sQ0F1Q1A7O0FBdkNPLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gIHByb3BlcnRpZXM6IHtcbiAgICBsYWJlbDogY2MuTGFiZWwsXG4gICAgLy9wYXJ0aWNsZTogY2MuUGFydGljbGVTeXN0ZW0sXG4gIH0sXG4gIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxuXG4gIC8vIG9uTG9hZCAoKSB7fSxcbiAgaW5pdChzLCBudW0sIHBvcykge1xuICAgIHRoaXMuX2dhbWVTY29yZSA9IHNcbiAgICB0aGlzLm5vZGUueCA9IHBvcy54XG4gICAgdGhpcy5ub2RlLnkgPSBwb3MueVxuICAgIHRoaXMubGFiZWwuc3RyaW5nID0gbnVtXG4gICAgLy90aGlzLnBhcnRpY2xlLnJlc2V0U3lzdGVtKClcbiAgICB0aGlzLm5vZGUuc2NhbGUgPSAxXG4gICAgdGhpcy5sYWJlbC5ub2RlLnggPSAwXG4gICAgdGhpcy5sYWJlbC5ub2RlLnkgPSAwXG4gICAgdGhpcy5sYWJlbC5ub2RlLnNjYWxlID0gMVxuICAgIGxldCB0d2VlbjEgPSBjYy5zY2FsZVRvKDAuMSwgMS4yLCAxLjIpXG4gICAgbGV0IGFjdGlvbjIgPSBjYy5tb3ZlQnkoMC4xLCAwLCAzMClcbiAgICBsZXQgYWN0aW9uMyA9IGNjLm1vdmVUbygwLjIsIDAsIDApXG4gICAgbGV0IGFjdGlvbjQgPSBjYy5zY2FsZVRvKDAuMiwgMC41LCAwLjUpXG4gICAgLy8gbGV0IHNlcSA9IGNjLnNlcXVlbmNlKHR3ZWVuMSwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgIC8vICAgbGV0IHNlcTIgPSBjYy5zZXF1ZW5jZShhY3Rpb24zLCBjYy5tb3ZlQnkoMC4xLCAwLCAwKSwgYWN0aW9uNCwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgIC8vICAgICBzLnNjb3JlUG9vbC5wdXQodGhpcy5ub2RlKVxuICAgIC8vICAgfSwgdGhpcykpXG4gICAgLy8gICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcTIpXG4gICAgLy8gfSwgdGhpcykpXG4gICAgLy8gdGhpcy5sYWJlbC5ub2RlLnJ1bkFjdGlvbihzZXEpXG4gICAgbGV0IHNwYTEgPSBjYy5zcGF3bih0d2VlbjEsIGFjdGlvbjIpXG4gICAgbGV0IHNwYTIgPSBjYy5zcGF3bihhY3Rpb24zLCBhY3Rpb240KVxuICAgIGxldCBzZXEgPSBjYy5zZXF1ZW5jZShzcGExLCBzcGEyLCBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICBzLnNjb3JlUG9vbC5wdXQodGhpcy5ub2RlKVxuICAgIH0sIHRoaXMpKVxuICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKVxuICB9XG5cbiAgLy8gdXBkYXRlIChkdCkge30sXG59KTsiXX0=
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
      var tween1 = cc.scaleTo(0.5, 0, 0).easing(cc.easeBackIn());
      var action2 = cc.blink(0.5, 3);

      _this.bannerNode.runAction(tween1);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzdGFydFBhZ2UuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJiYW5uZXJOb2RlIiwiTm9kZSIsImxhYmVsTm9kZSIsInN0YXJ0Iiwib25Ub3VjaGVkIiwic2hvd0FuaW1hdGlvbiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0cyIsInR3ZWVuMSIsInNjYWxlVG8iLCJlYXNpbmciLCJlYXNlQmFja0luIiwiYWN0aW9uMiIsImJsaW5rIiwicnVuQWN0aW9uIiwiYWN0aW9uIiwic2VxdWVuY2UiLCJjYWxsRnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUlBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUVQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsVUFBVSxFQUFFSixFQUFFLENBQUNLLElBREw7QUFFVkMsSUFBQUEsU0FBUyxFQUFFTixFQUFFLENBQUNLO0FBRkosR0FGTDtBQU1QRSxFQUFBQSxLQU5PLG1CQU1DLENBRVAsQ0FSTTtBQVVQQyxFQUFBQSxTQVZPLHVCQVVLLENBRVgsQ0FaTTtBQWFQQyxFQUFBQSxhQWJPLDJCQWFTO0FBQUE7O0FBQ2QsV0FBTyxJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxPQUFWLEVBQXNCO0FBQ3ZDLFVBQUlDLE1BQU0sR0FBR2IsRUFBRSxDQUFDYyxPQUFILENBQVcsR0FBWCxFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQkMsTUFBdEIsQ0FBNkJmLEVBQUUsQ0FBQ2dCLFVBQUgsRUFBN0IsQ0FBYjtBQUNBLFVBQUlDLE9BQU8sR0FBR2pCLEVBQUUsQ0FBQ2tCLEtBQUgsQ0FBUyxHQUFULEVBQWMsQ0FBZCxDQUFkOztBQUNBLE1BQUEsS0FBSSxDQUFDZCxVQUFMLENBQWdCZSxTQUFoQixDQUEwQk4sTUFBMUI7O0FBQ0EsVUFBSU8sTUFBTSxHQUFHcEIsRUFBRSxDQUFDcUIsUUFBSCxDQUFZSixPQUFaLEVBQXFCakIsRUFBRSxDQUFDc0IsUUFBSCxDQUFZLFlBQU07QUFDbERYLFFBQUFBLE9BQU87QUFDUixPQUZpQyxDQUFyQixDQUFiOztBQUdBLE1BQUEsS0FBSSxDQUFDTCxTQUFMLENBQWVhLFNBQWYsQ0FBeUJDLE1BQXpCO0FBQ0QsS0FSTSxDQUFQO0FBU0Q7QUF2Qk0sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAYXV0aG9yIGhleXVjaGFuZ1xuICogQGZpbGUg5byA5aeL6aG16Z2i5o6n5Yi2XG4gKi9cbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgYmFubmVyTm9kZTogY2MuTm9kZSxcbiAgICBsYWJlbE5vZGU6IGNjLk5vZGUsXG4gIH0sXG4gIHN0YXJ0KCkge1xuXG4gIH0sXG5cbiAgb25Ub3VjaGVkKCkge1xuXG4gIH0sXG4gIHNob3dBbmltYXRpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3RzKSA9PiB7XG4gICAgICBsZXQgdHdlZW4xID0gY2Muc2NhbGVUbygwLjUsIDAsIDApLmVhc2luZyhjYy5lYXNlQmFja0luKCkpXG4gICAgICBsZXQgYWN0aW9uMiA9IGNjLmJsaW5rKDAuNSwgMylcbiAgICAgIHRoaXMuYmFubmVyTm9kZS5ydW5BY3Rpb24odHdlZW4xKVxuICAgICAgbGV0IGFjdGlvbiA9IGNjLnNlcXVlbmNlKGFjdGlvbjIsIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9KSlcbiAgICAgIHRoaXMubGFiZWxOb2RlLnJ1bkFjdGlvbihhY3Rpb24pXG4gICAgfSlcbiAgfSxcbn0pOyJdfQ==
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
  var tween1 = cc.moveBy(time, range, range);
  var action2 = cc.moveBy(time, -range, -range);
  var action3 = cc.moveBy(time * 0.8, range * 0.8, range * 0.8);
  var action4 = cc.moveBy(time * 0.8, -range * 0.8, -range * 0.8);
  var action5 = cc.moveBy(time * 0.6, range * 0.6, range * 0.6);
  var action6 = cc.moveBy(time * 0.6, -range * 0.6, -range * 0.6);
  var action7 = cc.moveBy(time * 0.4, range * 0.4, range * 0.4);
  var action8 = cc.moveBy(time * 0.4, -range * 0.4, -range * 0.4);
  var action9 = cc.moveBy(time * 0.2, range * 0.2, range * 0.2);
  var action10 = cc.moveBy(time * 0.2, -range * 0.2, -range * 0.2);
  var sq = cc.sequence(tween1, action2, action3, action4, action5, action6, action7, action8, action9, action10);
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
  var tween1 = cc.rotateBy(time, range, range);
  var action2 = cc.rotateBy(time, -2 * range, -2 * range);
  var action3 = cc.rotateBy(time * 0.8, 2 * range * 0.8, 2 * range * 0.8);
  var action6 = cc.rotateBy(time * 0.6, -2 * range * 0.6, -2 * range * 0.6);
  var action7 = cc.rotateBy(time * 0.4, 2 * range * 0.4, 2 * range * 0.4);
  var action10 = cc.rotateTo(time * 0.2, 0, 0);
  var sq = cc.sequence(tween1, action2, action3, action6, action7, action10);
  return sq;
} // 弹出效果


function popOut(time) {
  return cc.scaleTo(time, 1).easing(cc.easeBackOut(2.0));
} // 收入效果


function popIn(time) {
  return cc.scaleTo(time, 0.5).easing(cc.easeBackIn(2.0));
}

function heartBeat() {
  var tween1 = cc.scaleTo(0.2, 1.2).easing(cc.easeElasticInOut());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxHYW1lQWN0LmpzIl0sIm5hbWVzIjpbInNoYWNrQWN0aW9uIiwidGltZSIsInJhbmdlIiwidHdlZW4xIiwiY2MiLCJtb3ZlQnkiLCJhY3Rpb24yIiwiYWN0aW9uMyIsImFjdGlvbjQiLCJhY3Rpb241IiwiYWN0aW9uNiIsImFjdGlvbjciLCJhY3Rpb244IiwiYWN0aW9uOSIsImFjdGlvbjEwIiwic3EiLCJzZXF1ZW5jZSIsImNyZWF0ZVJvdGF0aW9uVHdlZW4iLCJkdXJhdGlvbiIsInhSb3RhdGlvbiIsInlSb3RhdGlvbiIsInR3ZWVuIiwidG8iLCJOb2RlIiwicHJvdG90eXBlIiwic2V0Um90YXRpb24iLCJ4Iiwibm9kZSIsInJvdGF0aW9uWCIsInkiLCJyb3RhdGlvblkiLCJhY3Rpb24iLCJjcmVhdGVaZXJvUm90YXRpb25Ud2VlbiIsInJvY2tBY3Rpb24iLCJyb3RhdGVCeSIsInJvdGF0ZVRvIiwicG9wT3V0Iiwic2NhbGVUbyIsImVhc2luZyIsImVhc2VCYWNrT3V0IiwicG9wSW4iLCJlYXNlQmFja0luIiwiaGVhcnRCZWF0IiwiZWFzZUVsYXN0aWNJbk91dCIsInBhZ2VUdXJuaW5nIiwicGFnZVVwIiwicGFnZURvd24iLCJ0eXBlQSIsInJ1bkFjdGlvbiIsImZhZGVPdXQiLCJkZWxheVRpbWUiLCJmYWRlSW4iLCJjYWxsRnVuYyIsImFjdGl2ZSIsInNjYWxlWCIsImdldE1vdmVPdXRvZlNjcmVlbkFjdGl2ZSIsIndpbldpZHRoIiwid2luSGVpZ2h0IiwiZGVsVGltZSIsImdldE1vdmVJblNjcmVlbkFjdGl2ZSIsImJsaW5rQWN0aW9uIiwicmVwZWF0Rm9yZXZlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUtBO0FBQ0EsU0FBU0EsV0FBVCxDQUFxQkMsSUFBckIsRUFBMkJDLEtBQTNCLEVBQWtDO0FBQ2hDLE1BQUlDLE1BQU0sR0FBR0MsRUFBRSxDQUFD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Q0EsU0FBU0ksV0FBVCxDQUFxQkYsT0FBckIsRUFBOEI7QUFDNUIsU0FBT3RELEVBQUUsQ0FBQ3lELGFBQUgsQ0FBaUJ6RCxFQUFFLENBQUNZLFFBQUgsQ0FBWVosRUFBRSxDQUFDNkMsT0FBSCxDQUFXUyxPQUFYLENBQVosRUFBaUN0RCxFQUFFLENBQUMrQyxNQUFILENBQVVPLE9BQVYsQ0FBakMsQ0FBakIsQ0FBUDtBQUNEOztBQUNESSxNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFDZi9ELEVBQUFBLFdBQVcsRUFBRUEsV0FERTtBQUVmNEQsRUFBQUEsV0FBVyxFQUFFQSxXQUZFO0FBR2ZoQixFQUFBQSxXQUFXLEVBQUVBLFdBSEU7QUFJZkYsRUFBQUEsU0FBUyxFQUFFQSxTQUpJO0FBS2ZhLEVBQUFBLHdCQUF3QixFQUFFQSx3QkFMWDtBQU1mbkIsRUFBQUEsTUFBTSxFQUFFQSxNQU5PO0FBT2ZJLEVBQUFBLEtBQUssRUFBRUEsS0FQUTtBQVFmbUIsRUFBQUEscUJBQXFCLEVBQUVBLHFCQVJSO0FBU2YxQixFQUFBQSxVQUFVLEVBQUVBO0FBVEcsQ0FBakIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBoZXl1Y2hhbmdcbiAqIEBmaWxlIOaJgOacieeahOeugOWNleWKqOS9nOmbhuWQiFxuICovXG5cbi8vIOmch+WKqOWKqOS9nCAwLjHmlYjmnpzmr5TovoPlpb1cbmZ1bmN0aW9uIHNoYWNrQWN0aW9uKHRpbWUsIHJhbmdlKSB7XG4gIGxldCB0d2VlbjEgPSBjYy5tb3ZlQnkodGltZSwgcmFuZ2UsIHJhbmdlKVxuICBsZXQgYWN0aW9uMiA9IGNjLm1vdmVCeSh0aW1lLCAtcmFuZ2UsIC1yYW5nZSlcbiAgbGV0IGFjdGlvbjMgPSBjYy5tb3ZlQnkodGltZSAqIDAuOCwgcmFuZ2UgKiAwLjgsIHJhbmdlICogMC44KVxuICBsZXQgYWN0aW9uNCA9IGNjLm1vdmVCeSh0aW1lICogMC44LCAtcmFuZ2UgKiAwLjgsIC1yYW5nZSAqIDAuOClcbiAgbGV0IGFjdGlvbjUgPSBjYy5tb3ZlQnkodGltZSAqIDAuNiwgcmFuZ2UgKiAwLjYsIHJhbmdlICogMC42KVxuICBsZXQgYWN0aW9uNiA9IGNjLm1vdmVCeSh0aW1lICogMC42LCAtcmFuZ2UgKiAwLjYsIC1yYW5nZSAqIDAuNilcbiAgbGV0IGFjdGlvbjcgPSBjYy5tb3ZlQnkodGltZSAqIDAuNCwgcmFuZ2UgKiAwLjQsIHJhbmdlICogMC40KVxuICBsZXQgYWN0aW9uOCA9IGNjLm1vdmVCeSh0aW1lICogMC40LCAtcmFuZ2UgKiAwLjQsIC1yYW5nZSAqIDAuNClcbiAgbGV0IGFjdGlvbjkgPSBjYy5tb3ZlQnkodGltZSAqIDAuMiwgcmFuZ2UgKiAwLjIsIHJhbmdlICogMC4yKVxuICBsZXQgYWN0aW9uMTAgPSBjYy5tb3ZlQnkodGltZSAqIDAuMiwgLXJhbmdlICogMC4yLCAtcmFuZ2UgKiAwLjIpXG4gIGxldCBzcSA9IGNjLnNlcXVlbmNlKHR3ZWVuMSwgYWN0aW9uMiwgYWN0aW9uMywgYWN0aW9uNCwgYWN0aW9uNSwgYWN0aW9uNiwgYWN0aW9uNywgYWN0aW9uOCwgYWN0aW9uOSwgYWN0aW9uMTApXG4gIHJldHVybiBzcVxufVxuXG4gLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIHJvdGF0aW9uIHR3ZWVuXG4gY29uc3QgY3JlYXRlUm90YXRpb25Ud2VlbiA9IChkdXJhdGlvbiwgeFJvdGF0aW9uLCB5Um90YXRpb24pID0+IHtcbiAgcmV0dXJuIGNjLnR3ZWVuKGR1cmF0aW9uKVxuICAgIC50byhjYy5Ob2RlLnByb3RvdHlwZS5zZXRSb3RhdGlvbiwge1xuICAgICAgeDogdGhpcy5ub2RlLnJvdGF0aW9uWCArIHhSb3RhdGlvbixcbiAgICAgIHk6IHRoaXMubm9kZS5yb3RhdGlvblkgKyB5Um90YXRpb25cbiAgICB9LCB7cm90YXRpb25YOiAnKz0nLCByb3RhdGlvblk6ICcrPSd9KVxuICAgIC5hY3Rpb24oKTtcbn07XG5cbi8vIEhlbHBlciBmdW5jdGlvbiB0byBjcmVhdGUgYSByb3RhdGlvbiB0byB6ZXJvIHR3ZWVuXG5jb25zdCBjcmVhdGVaZXJvUm90YXRpb25Ud2VlbiA9IChkdXJhdGlvbikgPT4ge1xuICByZXR1cm4gY2MudHdlZW4oZHVyYXRpb24pXG4gICAgLnRvKGNjLk5vZGUucHJvdG90eXBlLnNldFJvdGF0aW9uLCB7eDogMCwgeTogMH0pXG4gICAgLmFjdGlvbigpO1xufTtcblxuLy8g5pmD5Yqo5Yqo5L2cXG5mdW5jdGlvbiByb2NrQWN0aW9uKHRpbWUsIHJhbmdlKSB7XG4gIGxldCB0d2VlbjEgPSBjYy5yb3RhdGVCeSh0aW1lLCByYW5nZSwgcmFuZ2UpXG4gIGxldCBhY3Rpb24yID0gY2Mucm90YXRlQnkodGltZSwgLTIgKiByYW5nZSwgLTIgKiByYW5nZSlcbiAgbGV0IGFjdGlvbjMgPSBjYy5yb3RhdGVCeSh0aW1lICogMC44LCAyICogcmFuZ2UgKiAwLjgsIDIgKiByYW5nZSAqIDAuOClcbiAgbGV0IGFjdGlvbjYgPSBjYy5yb3RhdGVCeSh0aW1lICogMC42LCAtMiAqIHJhbmdlICogMC42LCAtMiAqIHJhbmdlICogMC42KVxuICBsZXQgYWN0aW9uNyA9IGNjLnJvdGF0ZUJ5KHRpbWUgKiAwLjQsIDIgKiByYW5nZSAqIDAuNCwgMiAqIHJhbmdlICogMC40KVxuICBsZXQgYWN0aW9uMTAgPSBjYy5yb3RhdGVUbyh0aW1lICogMC4yLCAwLCAwKVxuICBsZXQgc3EgPSBjYy5zZXF1ZW5jZSh0d2VlbjEsIGFjdGlvbjIsIGFjdGlvbjMsIGFjdGlvbjYsIGFjdGlvbjcsIGFjdGlvbjEwKVxuICByZXR1cm4gc3Fcbn1cblxuLy8g5by55Ye65pWI5p6cXG5mdW5jdGlvbiBwb3BPdXQodGltZSkge1xuICByZXR1cm4gY2Muc2NhbGVUbyh0aW1lLCAxKS5lYXNpbmcoY2MuZWFzZUJhY2tPdXQoMi4wKSlcbn1cbi8vIOaUtuWFpeaViOaenFxuZnVuY3Rpb24gcG9wSW4odGltZSkge1xuICByZXR1cm4gY2Muc2NhbGVUbyh0aW1lLCAwLjUpLmVhc2luZyhjYy5lYXNlQmFja0luKDIuMCkpXG59XG5cbmZ1bmN0aW9uIGhlYXJ0QmVhdCgpIHtcbiAgbGV0IHR3ZWVuMSA9IGNjLnNjYWxlVG8oMC4yLCAxLjIpLmVhc2luZyhjYy5lYXNlRWxhc3RpY0luT3V0KCkpXG4gIGxldCBhY3Rpb24yID0gY2Muc2NhbGVUbygwLjIsIDEpLmVhc2luZyhjYy5lYXNlRWxhc3RpY0luT3V0KCkpXG4gIGxldCBhY3Rpb24zID0gY2Mucm90YXRlVG8oMC4xLCA0NSlcbiAgbGV0IGFjdGlvbjQgPSBjYy5yb3RhdGVUbygwLjIsIC00NSlcbiAgbGV0IGFjdGlvbjUgPSBjYy5yb3RhdGVUbygwLjEsIDApXG59XG4vL+e/u+mhteaViOaenCDliY3kuKTkuKrkvKBub2RlIHR5cGXkvKDmlbDlrZcg5bem5Y+z5peL6L2s55qEXG5mdW5jdGlvbiBwYWdlVHVybmluZyhwYWdlVXAsIHBhZ2VEb3duLCB0eXBlQSkge1xuICBzd2l0Y2ggKHR5cGVBKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcGFnZVVwLnJ1bkFjdGlvbihjYy5mYWRlT3V0KDAuNikpO1xuICAgICAgcGFnZURvd24ucnVuQWN0aW9uKGNjLmRlbGF5VGltZSgwLjYpLCBjYy5mYWRlSW4oMC42KSwgY2Muc2VxdWVuY2UoY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgICBwYWdlVXAuYWN0aXZlID0gZmFsc2U7XG4gICAgICB9LCB0aGlzLCBwYWdlVXApKSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDE6XG4gICAgICBwYWdlRG93bi5zY2FsZVggPSAwO1xuICAgICAgcGFnZVVwLnJ1bkFjdGlvbihjYy5zY2FsZVRvKDAuNiwgMCwgMSkpXG4gICAgICBwYWdlRG93bi5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2MuZGVsYXlUaW1lKDAuNiksIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgcGFnZVVwLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgfSwgdGhpcywgcGFnZVVwKSwgY2Muc2NhbGVUbygwLjYsIDEsIDEpLCkpXG4gICAgICBicmVhaztcbiAgICBjYXNlIDI6XG4gICAgICBicmVhaztcbiAgfVxufVxuLy/np7vliqjliLDlsY/luZXlpJYg5bm25LiU6ZqQ6JePICAwMTIzIOS4iuWPs+S4i+W3piDkvJrnp7vliqjkuIDkuKrlsY/luZXnmoTot53nprsg54S25ZCO55u05o6l5raI5aSxXG5mdW5jdGlvbiBnZXRNb3ZlT3V0b2ZTY3JlZW5BY3RpdmUodHlwZUEsIHdpbldpZHRoLCB3aW5IZWlnaHQsIGRlbFRpbWUpIHtcbiAgc3dpdGNoICh0eXBlQSkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgMCwgd2luSGVpZ2h0KVxuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgd2luV2lkdGgsIDApXG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIGNjLm1vdmVCeShkZWxUaW1lLCAwLCAtd2luSGVpZ2h0KVxuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgLXdpbldpZHRoLCAwKVxuICB9XG59XG4vL+S7juWxj+W5leWklui/m+WFpSDkuIrlj7PkuIvlt6ZcbmZ1bmN0aW9uIGdldE1vdmVJblNjcmVlbkFjdGl2ZSh0eXBlQSwgd2luV2lkdGgsIHdpbkhlaWdodCwgZGVsVGltZSkge1xuICBzd2l0Y2ggKHR5cGVBKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIGNjLm1vdmVCeShkZWxUaW1lLCAwLCAtd2luSGVpZ2h0KVxuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgLXdpbldpZHRoLCAwKVxuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgMCwgd2luSGVpZ2h0KVxuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBjYy5tb3ZlQnkoZGVsVGltZSwgd2luV2lkdGgsIDApXG4gIH1cbn1cbi8v6Zeq54OB5Yqo5L2cXG5mdW5jdGlvbiBibGlua0FjdGlvbihkZWxUaW1lKSB7XG4gIHJldHVybiBjYy5yZXBlYXRGb3JldmVyKGNjLnNlcXVlbmNlKGNjLmZhZGVPdXQoZGVsVGltZSksIGNjLmZhZGVJbihkZWxUaW1lKSkpXG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2hhY2tBY3Rpb246IHNoYWNrQWN0aW9uLFxuICBibGlua0FjdGlvbjogYmxpbmtBY3Rpb24sXG4gIHBhZ2VUdXJuaW5nOiBwYWdlVHVybmluZyxcbiAgaGVhcnRCZWF0OiBoZWFydEJlYXQsXG4gIGdldE1vdmVPdXRvZlNjcmVlbkFjdGl2ZTogZ2V0TW92ZU91dG9mU2NyZWVuQWN0aXZlLFxuICBwb3BPdXQ6IHBvcE91dCxcbiAgcG9wSW46IHBvcEluLFxuICBnZXRNb3ZlSW5TY3JlZW5BY3RpdmU6IGdldE1vdmVJblNjcmVlbkFjdGl2ZSxcbiAgcm9ja0FjdGlvbjogcm9ja0FjdGlvblxufSJdfQ==
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
    statusType: 0,
    //1为可触发点击 2为已经消失
    _itemType: 0,
    //新增道具功能 1为双倍倍数 2为炸弹
    warningSprite: cc.Sprite,
    lightSprite: cc.Sprite
  },
  init: function init(g, data, width, itemType, pos) {
    this._game = g;
    this.statusType = 1;

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

    var tween1 = cc.blink(1, 10); //   this.lightSprite.node.runAction(tween1)
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

    if (this.statusType == 1 && isBomb == true) {
      this.statusType = 2;
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

        var tween1 = cc.scaleTo(0.1, 1.1, 0.9);
        var action2 = cc.scaleTo(0.3, 1).easing(cc.easeBackOut(2.0));
        var action = cc.sequence(tween1, action2);
        this.node.runAction(action);
        return;
      } // console.log('方块位置', this.iid, this.jid, this._itemType)


      color = this.color;

      if (this.statusType == 1 && this._game.statusType == 1 && this.color == color) {
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
      if (this.statusType == 1 && this._game.statusType == 5 && this.color == color) {
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

    self._game.statusType = 5;

    self._gameController.musicManager.onPlayAudio(0);

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
    this.statusType = 0;

    if (data) {
      this.iid = data.y;
      this.jid = data.x;
    }

    var action = cc.moveBy(0.25, 0, -y * (this._game.gapCfgNum + this._game.blockClsWidth)).easing(cc.easeBounceOut(5 / y)); //1 * y / this._game.animaCfgSpeed

    var seq = cc.sequence(action, cc.callFunc(function () {
      _this2.statusType = 1; //  this._game.checkNeedGenerator()
    }, this));
    this.node.runAction(seq);
  },
  playStartAction: function playStartAction() {
    var _this3 = this;

    this.node.scaleX = 0;
    this.node.scaleY = 0;
    var action = cc.scaleTo(0.8 / this._game.animaCfgSpeed, 1, 1).easing(cc.easeBackOut());
    var seq = cc.sequence(action, cc.callFunc(function () {
      _this3.statusType = 1;
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
    this.statusType = 2;
    this.node.scaleX = 1;
    this.node.scaleY = 1;
    return new Promise(function (resolve, reject) {
      var action;

      if (_this4.warningSprite.spriteFrame) {
        //有道具预警
        var tween1 = cc.scaleTo(0.2 / self._game.animaCfgSpeed, 1.1);
        var action2 = cc.moveTo(0.2 / self._game.animaCfgSpeed, _this4._game.target.x, _this4._game.target.y);
        var action3 = cc.scaleTo(0.2, 0);
        var seq = cc.sequence(tween1, cc.callFunc(function () {
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
      var tween1 = cc.scaleTo(0.4 / _this5._game.animaCfgSpeed, 1, 1);

      _this5.node.runAction(cc.sequence(action, tween1));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxlbGVtZW50LmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwic3RhdHVzVHlwZSIsIl9pdGVtVHlwZSIsIndhcm5pbmdTcHJpdGUiLCJTcHJpdGUiLCJsaWdodFNwcml0ZSIsImluaXQiLCJnIiwiZGF0YSIsIndpZHRoIiwiaXRlbVR5cGUiLCJwb3MiLCJfZ2FtZSIsIngiLCJ5Iiwid2FybmluZ1R5cGUiLCJpc1B1c2giLCJiaW5kRXZlbnQiLCJjb2xvciIsIk1hdGgiLCJjZWlsIiwicmFuZG9tIiwiY29sb3JTcHJpdGUiLCJub2RlIiwiZ2V0Q2hpbGRCeU5hbWUiLCJnZXRDb21wb25lbnQiLCJzcHJpdGVGcmFtZSIsInByb3BTcHJpdGVGcmFtZSIsImJsb2NrU3ByaXRlIiwiX3dpZHRoIiwiX2dhbWVDb250cm9sbGVyIiwiYWN0aXZlIiwiaGVpZ2h0Iiwic3RhcnRUaW1lIiwiaWlkIiwiamlkIiwiZ2FwQ2ZnTnVtIiwiYW5nbGUiLCJwbGF5U3RhcnRBY3Rpb24iLCJvbldhcm5pbmciLCJ0eXBlIiwid2FybmluZ1Nwcml0ZUZyYW1lIiwidHdlZW4xIiwiYmxpbmsiLCJ3YXJuaW5nSW5pdCIsImdyb3dJbml0IiwiZ3Jvd1R5cGUiLCJncm93Iiwib24iLCJOb2RlIiwiRXZlbnRUeXBlIiwiVE9VQ0hfU1RBUlQiLCJvblRvdWNoZWQiLCJpc0NoYWluIiwiaXNCb21iIiwidGltZSIsInNldFRpbWVvdXQiLCJKU09OIiwic3RyaW5naWZ5Iiwic2VsZiIsInBsYXlEaWVBY3Rpb24iLCJ0aGVuIiwib25CbG9ja1BvcCIsImlzU2luZ2xlIiwic2NhbGUiLCJfZ2FtZVNjb3JlIiwidGlwQm94Iiwic2NhbGVUbyIsImFjdGlvbjIiLCJlYXNpbmciLCJlYXNlQmFja091dCIsImFjdGlvbiIsInNlcXVlbmNlIiwicnVuQWN0aW9uIiwib25Vc2VyVG91Y2hlZCIsIm9uU3RlcCIsInJlcyIsImNoZWNrTmVlZEZhbGwiLCJtdXNpY01hbmFnZXIiLCJvblBsYXlBdWRpbyIsIm9uSXRlbSIsImFkZFNjb3JlIiwidjIiLCJjb25maWciLCJqc29uIiwicHJvcENvbmZpZyIsInNjb3JlIiwibWFwIiwicm93Q2ZnTnVtIiwicGxheUZhbGxBY3Rpb24iLCJtb3ZlQnkiLCJibG9ja0Nsc1dpZHRoIiwiZWFzZUJvdW5jZU91dCIsInNlcSIsImNhbGxGdW5jIiwic2NhbGVYIiwic2NhbGVZIiwiYW5pbWFDZmdTcGVlZCIsImNsZWFyVGltZW91dCIsInN1cmZhY2VUaW1lciIsInN0b3BBbGxBY3Rpb25zIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJtb3ZlVG8iLCJ0YXJnZXQiLCJhY3Rpb24zIiwic3Bhd24iLCJzdXJmYWNlQWN0aW9uIiwiZGVsYSIsImdlbmVyYXRlUHJvcEFjdGlvbiIsImdlbmVyYXRlSXRlbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUlBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUVQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsVUFBVSxFQUFFLENBREY7QUFDSztBQUNmQyxJQUFBQSxTQUFTLEVBQUUsQ0FGRDtBQUVJO0FBQ2RDLElBQUFBLGFBQWEsRUFBRU4sRUFBRSxDQUFDTyxNQUhSO0FBSVZDLElBQUFBLFdBQVcsRUFBRVIsRUFBRSxDQUFDTztBQUpOLEdBRkw7QUFRUEUsRUFBQUEsSUFSTyxnQkFRRkMsQ0FSRSxFQVFDQyxJQVJELEVBUU9DLEtBUlAsRUFRY0MsUUFSZCxFQVF3QkMsR0FSeEIsRUFRNkI7QUFDbEMsU0FBS0MsS0FBTCxHQUFhTCxDQUFiO0FBQ0EsU0FBS04sVUFBTCxHQUFrQixDQUFsQjs7QUFDQSxRQUFJVSxHQUFKLEVBQVMsQ0FDUDtBQUNEOztBQUNEQSxJQUFBQSxHQUFHLEdBQUdBLEdBQUcsSUFBSTtBQUNYRSxNQUFBQSxDQUFDLEVBQUVMLElBQUksQ0FBQ0ssQ0FE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QWhCTSxDQUFQO0FBaUJELEdBN09NO0FBOE9QZSxFQUFBQSxhQTlPTyx5QkE4T09DLElBOU9QLEVBOE9hO0FBQUE7O0FBQ2xCLFNBQUtWLFlBQUwsR0FBb0IzQyxVQUFVLENBQUMsWUFBTTtBQUNuQyxVQUFJZSxNQUFNLEdBQUcxRSxFQUFFLENBQUNzRSxPQUFILENBQVcsTUFBTSxNQUFJLENBQUN2RCxLQUFMLENBQVdxRixhQUE1QixFQUEyQyxHQUEzQyxFQUFnRCxHQUFoRCxDQUFiO0FBQ0EsVUFBSXZELE1BQU0sR0FBRzdDLEVBQUUsQ0FBQ3NFLE9BQUgsQ0FBVyxNQUFNLE1BQUksQ0FBQ3ZELEtBQUwsQ0FBV3FGLGFBQTVCLEVBQTJDLENBQTNDLEVBQThDLENBQTlDLENBQWI7O0FBQ0EsTUFBQSxNQUFJLENBQUMxRSxJQUFMLENBQVVrRCxTQUFWLENBQW9CNUUsRUFBRSxDQUFDMkUsUUFBSCxDQUFZRCxNQUFaLEVBQW9CN0IsTUFBcEIsQ0FBcEI7QUFDRCxLQUo2QixFQUkzQm1FLElBSjJCLENBQTlCO0FBS0QsR0FwUE07QUFxUFBDLEVBQUFBLGtCQXJQTyxnQ0FxUGMsQ0FFcEIsQ0F2UE07QUF3UFBDLEVBQUFBLFlBeFBPLHdCQXdQTXZFLElBeFBOLEVBd1BZO0FBQ2pCLFNBQUt0QyxTQUFMLEdBQWlCc0MsSUFBakI7QUFDRDtBQTFQTSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGF1dGhvciBoZXl1Y2hhbmdcclxuICogQGZpbGUg5Y2V5Liq5pa55Z2X5o6n5Yi2XHJcbiAqL1xyXG5jYy5DbGFzcyh7XHJcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG4gIHByb3BlcnRpZXM6IHtcclxuICAgIHN0YXR1c1R5cGU6IDAsIC8vMeS4uuWPr+inpuWPkeeCueWHuyAy5Li65bey57uP5raI5aSxXHJcbiAgICBfaXRlbVR5cGU6IDAsIC8v5paw5aKe6YGT5YW35Yqf6IO9IDHkuLrlj4zlgI3lgI3mlbAgMuS4uueCuOW8uVxyXG4gICAgd2FybmluZ1Nwcml0ZTogY2MuU3ByaXRlLFxyXG4gICAgbGlnaHRTcHJpdGU6IGNjLlNwcml0ZSxcclxuICB9LFxyXG4gIGluaXQoZywgZGF0YSwgd2lkdGgsIGl0ZW1UeXBlLCBwb3MpIHtcclxuICAgIHRoaXMuX2dhbWUgPSBnXHJcbiAgICB0aGlzLnN0YXR1c1R5cGUgPSAxXHJcbiAgICBpZiAocG9zKSB7XHJcbiAgICAgIC8vY2MubG9nKCfnlJ/miJDnmoTmlrnlnZcnLCBwb3MpXHJcbiAgICB9XHJcbiAgICBwb3MgPSBwb3MgfHwge1xyXG4gICAgICB4OiBkYXRhLngsXHJcbiAgICAgIHk6IGRhdGEueVxyXG4gICAgfVxyXG4gICAgdGhpcy5faXRlbVR5cGUgPSBpdGVtVHlwZSB8fCAwXHJcbiAgICB0aGlzLndhcm5pbmdUeXBlID0gMFxyXG4gICAgdGhpcy5pc1B1c2ggPSBmYWxzZVxyXG4gICAgdGhpcy5iaW5kRXZlbnQoKVxyXG4gICAgdGhpcy5jb2xvciA9IGRhdGEuY29sb3IgfHwgTWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiA0KVxyXG4gICAgdGhpcy5jb2xvclNwcml0ZSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnY29sb3InKS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKVxyXG4gICAgdGhpcy5jb2xvclNwcml0ZS5zcHJpdGVGcmFtZSA9IGl0ZW1UeXBlID8gZy5wcm9wU3ByaXRlRnJhbWVbKGl0ZW1UeXBlIC0gMSkgKiA0ICsgdGhpcy5jb2xvciAtIDFdIDogdGhpcy5fZ2FtZS5ibG9ja1Nwcml0ZVt0aGlzLmNvbG9yIC0gMV1cclxuICAgIHRoaXMud2FybmluZ1Nwcml0ZS5zcHJpdGVGcmFtZSA9ICcnXHJcbiAgICB0aGlzLl93aWR0aCA9IHdpZHRoXHJcbiAgICB0aGlzLl9nYW1lQ29udHJvbGxlciA9IGcuX2dhbWVDb250cm9sbGVyXHJcbiAgICAvLyDorqHnrpflrr1cclxuICAgIHRoaXMubGlnaHRTcHJpdGUubm9kZS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgLy8gIHRoaXMubGlnaHRTcHJpdGUuc3ByaXRlRnJhbWUgPSB0aGlzLl9nYW1lLmJsb2NrU3ByaXRlW3RoaXMuY29sb3IgLSAxXVxyXG4gICAgdGhpcy5ub2RlLndpZHRoID0gdGhpcy5ub2RlLmhlaWdodCA9IHdpZHRoXHJcbiAgICB0aGlzLnN0YXJ0VGltZSA9IGRhdGEuc3RhcnRUaW1lXHJcbiAgICB0aGlzLmlpZCA9IGRhdGEueVxyXG4gICAgdGhpcy5qaWQgPSBkYXRhLnhcclxuICAgIC8vIGNvbnNvbGUubG9nKCfnlJ/miJDmlrnlnZfkvY3nva4nLCBkYXRhLnksIGRhdGEueClcclxuICAgIHRoaXMubm9kZS54ID0gLSg3MzAgLyAyIC0gZy5nYXBDZmdOdW0gLSB3aWR0aCAvIDIpICsgcG9zLnggKiAod2lkdGggKyBnLmdhcENmZ051bSlcclxuICAgIHRoaXMubm9kZS55ID0gKDczMCAvIDIgLSBnLmdhcENmZ051bSAtIHdpZHRoIC8gMikgLSBwb3MueSAqICh3aWR0aCArIGcuZ2FwQ2ZnTnVtKVxyXG4gICAgdGhpcy5ub2RlLmFuZ2xlID0gMFxyXG4gICAgdGhpcy5wbGF5U3RhcnRBY3Rpb24oKVxyXG4gIH0sXHJcbiAgb25XYXJuaW5nKHR5cGUpIHtcclxuICAgIHRoaXMud2FybmluZ1Nwcml0ZS5zcHJpdGVGcmFtZSA9IHRoaXMuX2dhbWUud2FybmluZ1Nwcml0ZUZyYW1lW3R5cGUgLSAxXSB8fCAnJ1xyXG4gICAgdGhpcy53YXJuaW5nVHlwZSA9IHR5cGVcclxuICAgIC8vICAgdGhpcy5saWdodFNwcml0ZS5ub2RlLmFjdGl2ZSA9IHRydWVcclxuICAgIGxldCB0d2VlbjEgPSBjYy5ibGluaygxLCAxMClcclxuICAgIC8vICAgdGhpcy5saWdodFNwcml0ZS5ub2RlLnJ1bkFjdGlvbih0d2VlbjEpXHJcbiAgfSxcclxuICB3YXJuaW5nSW5pdCgpIHtcclxuICAgIHRoaXMud2FybmluZ1Nwcml0ZS5zcHJpdGVGcmFtZSA9ICcnXHJcbiAgICAvLyAgdGhpcy5saWdodFNwcml0ZS5ub2RlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICB0aGlzLmlzUHVzaCA9IGZhbHNlXHJcbiAgfSxcclxuICBncm93SW5pdCgpIHtcclxuICAgIHRoaXMuZ3Jvd1R5cGUgPSAwXHJcbiAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUuaGVpZ2h0ID0gdGhpcy5jb2xvclNwcml0ZS5ub2RlLndpZHRoID0gdGhpcy5fd2lkdGhcclxuICAgIHRoaXMuY29sb3JTcHJpdGUubm9kZS55ID0gdGhpcy5jb2xvclNwcml0ZS5ub2RlLnggPSAwXHJcbiAgfSxcclxuICBncm93KHR5cGUpIHsgLy8xMjM0IOS4iuS4i+W3puWPs1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICBpZiAodGhpcy5ncm93VHlwZSAhPSAyKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUuaGVpZ2h0ICs9IHRoaXMuX2dhbWUuZ2FwQ2ZnTnVtICogMlxyXG4gICAgICAgICAgdGhpcy5jb2xvclNwcml0ZS5ub2RlLnkgKz0gdGhpcy5fZ2FtZS5nYXBDZmdOdW1cclxuICAgICAgICAgIHRoaXMuZ3Jvd1R5cGUgPSAxXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICBpZiAodGhpcy5ncm93VHlwZSAhPSAyKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUuaGVpZ2h0ICs9IHRoaXMuX2dhbWUuZ2FwQ2ZnTnVtICogMlxyXG4gICAgICAgICAgdGhpcy5jb2xvclNwcml0ZS5ub2RlLnkgLT0gdGhpcy5fZ2FtZS5nYXBDZmdOdW1cclxuICAgICAgICAgIHRoaXMuZ3Jvd1R5cGUgPSAxXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMzpcclxuICAgICAgICBpZiAodGhpcy5ncm93VHlwZSAhPSAxKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUud2lkdGggKz0gdGhpcy5fZ2FtZS5nYXBDZmdOdW0gKiAyXHJcbiAgICAgICAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUueCAtPSB0aGlzLl9nYW1lLmdhcENmZ051bVxyXG4gICAgICAgICAgdGhpcy5ncm93VHlwZSA9IDJcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSA0OlxyXG4gICAgICAgIGlmICh0aGlzLmdyb3dUeXBlICE9IDEpIHtcclxuICAgICAgICAgIHRoaXMuY29sb3JTcHJpdGUubm9kZS53aWR0aCArPSB0aGlzLl9nYW1lLmdhcENmZ051bSAqIDJcclxuICAgICAgICAgIHRoaXMuY29sb3JTcHJpdGUubm9kZS54ICs9IHRoaXMuX2dhbWUuZ2FwQ2ZnTnVtXHJcbiAgICAgICAgICB0aGlzLmdyb3dUeXBlID0gMlxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmluZEV2ZW50KCkge1xyXG4gICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm9uVG91Y2hlZCwgdGhpcylcclxuICB9LFxyXG4gIC8vIOeUqOaIt+eCueWHuyDmiJbogIXooqvlhbbku5bmlrnlnZfop6blj5FcclxuICBvblRvdWNoZWQoY29sb3IsIGlzQ2hhaW4sIGlzQm9tYiwgdGltZSkgeyAvL+mBk+WFt+aWsOWinuWPguaVsCBpc0NoYWlu5piv5ZCm6L+e6ZSBIGlzQm9tYuaYr+WQpuW8uuWItua2iOmZpFxyXG4gICAgaWYgKHRpbWUpIHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5vblRvdWNoZWQoY29sb3IsIGZhbHNlLCBpc0JvbWIpXHJcbiAgICAgIH0sIHRpbWUpXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgaXNDaGFpbiA9IEpTT04uc3RyaW5naWZ5KGlzQ2hhaW4pID09ICdudWxsJyA/IHRydWUgOiBpc0NoYWluXHJcbiAgICBpc0JvbWIgPSBpc0JvbWIgPyBpc0JvbWIgOiBmYWxzZVxyXG4gICAgbGV0IHNlbGYgPSB0aGlzXHJcbiAgICAvLyDniIbngrjop6blj5FcclxuICAgIGlmICh0aGlzLnN0YXR1c1R5cGUgPT0gMSAmJiBpc0JvbWIgPT0gdHJ1ZSkge1xyXG4gICAgICB0aGlzLnN0YXR1c1R5cGUgPSAyXHJcbiAgICAgIHRoaXMucGxheURpZUFjdGlvbigpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMub25CbG9ja1BvcChjb2xvciwgaXNDaGFpbiwgaXNCb21iKVxyXG4gICAgICB9KVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAoY29sb3IudHlwZSkge1xyXG4gICAgICAvLyDkuIDlrprmmK/nlKjmiLfkuLvliqjop6blj5Eg5L+d5a2Y6L+Z5Liq5Z2Q5qCH57uZZ2FtZVxyXG4gICAgICBpZiAodGhpcy5pc1NpbmdsZSAmJiB0aGlzLl9pdGVtVHlwZSA8PSAxKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLnNjYWxlID0gMVxyXG4gICAgICAgIHRoaXMuX2dhbWUuX2dhbWVTY29yZS50aXBCb3guaW5pdCh0aGlzLl9nYW1lLl9nYW1lU2NvcmUsIDMpXHJcbiAgICAgICAgbGV0IHR3ZWVuMSA9IGNjLnNjYWxlVG8oMC4xLCAxLjEsIDAuOSlcclxuICAgICAgICBsZXQgYWN0aW9uMiA9IGNjLnNjYWxlVG8oMC4zLCAxKS5lYXNpbmcoY2MuZWFzZUJhY2tPdXQoMi4wKSlcclxuICAgICAgICBsZXQgYWN0aW9uID0gY2Muc2VxdWVuY2UodHdlZW4xLCBhY3Rpb24yKVxyXG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oYWN0aW9uKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCfmlrnlnZfkvY3nva4nLCB0aGlzLmlpZCwgdGhpcy5qaWQsIHRoaXMuX2l0ZW1UeXBlKVxyXG4gICAgICBjb2xvciA9IHRoaXMuY29sb3JcclxuICAgICAgaWYgKHRoaXMuc3RhdHVzVHlwZSA9PSAxICYmIHRoaXMuX2dhbWUuc3RhdHVzVHlwZSA9PSAxICYmIHRoaXMuY29sb3IgPT0gY29sb3IpIHtcclxuICAgICAgICB0aGlzLl9nYW1lLm9uVXNlclRvdWNoZWQodGhpcy5paWQsIHRoaXMuamlkLCB0aGlzLl9pdGVtVHlwZSwgdGhpcy5jb2xvciwgdGhpcy53YXJuaW5nVHlwZSwge1xyXG4gICAgICAgICAgeDogdGhpcy5ub2RlLngsXHJcbiAgICAgICAgICB5OiB0aGlzLm5vZGUueVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5fZ2FtZS5fZ2FtZVNjb3JlLm9uU3RlcCgtMSkudGhlbigocmVzKSA9PiB7XHJcbiAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheURpZUFjdGlvbigpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMub25CbG9ja1BvcChjb2xvciwgbnVsbCwgbnVsbClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyDnlLHlhbbku5bmlrnlnZfop6blj5FcclxuICAgICAgaWYgKHRoaXMuc3RhdHVzVHlwZSA9PSAxICYmIHRoaXMuX2dhbWUuc3RhdHVzVHlwZSA9PSA1ICYmIHRoaXMuY29sb3IgPT0gY29sb3IpIHtcclxuICAgICAgICB0aGlzLnBsYXlEaWVBY3Rpb24oKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMub25CbG9ja1BvcChjb2xvciwgbnVsbCwgbnVsbClcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBvbkJsb2NrUG9wKGNvbG9yLCBpc0NoYWluLCBpc0JvbWIpIHtcclxuICAgIGxldCBzZWxmID0gdGhpc1xyXG4gICAgaXNDaGFpbiA9IEpTT04uc3RyaW5naWZ5KGlzQ2hhaW4pID09ICdudWxsJyA/IHRydWUgOiBpc0NoYWluXHJcbiAgICBpc0JvbWIgPSBpc0JvbWIgPyBpc0JvbWIgOiBmYWxzZVxyXG4gICAgc2VsZi5fZ2FtZS5jaGVja05lZWRGYWxsKClcclxuICAgIHNlbGYuX2dhbWUuc3RhdHVzVHlwZSA9IDVcclxuICAgIHNlbGYuX2dhbWVDb250cm9sbGVyLm11c2ljTWFuYWdlci5vblBsYXlBdWRpbygwXHJcbiAgICApXHJcbiAgICBpZiAodGhpcy5faXRlbVR5cGUgIT0gMCkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhcIuinpuWPkeS6humBk+WFt1wiLCB0aGlzLl9pdGVtVHlwZSlcclxuXHJcbiAgICAgIHNlbGYuX2dhbWUub25JdGVtKHRoaXMuX2l0ZW1UeXBlLCBjb2xvciwge1xyXG4gICAgICAgIHg6IHRoaXMubm9kZS54LFxyXG4gICAgICAgIHk6IHRoaXMubm9kZS55XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBzZWxmLl9nYW1lLl9nYW1lU2NvcmUuYWRkU2NvcmUoY2MudjIodGhpcy5ub2RlLngsIHRoaXMubm9kZS55IC0gdGhpcy5ub2RlLndpZHRoICsgdGhpcy5fZ2FtZS5nYXBDZmdOdW0pLCB0aGlzLl9pdGVtVHlwZSA9PSAzID8gdGhpcy5fZ2FtZS5fZ2FtZUNvbnRyb2xsZXIuY29uZmlnLmpzb24ucHJvcENvbmZpZ1syXS5zY29yZSA6IG51bGwpXHJcblxyXG4gICAgLy8g6L+e6ZSB54q25oCBXHJcbiAgICBpZiAoaXNDaGFpbikge1xyXG4gICAgICBpZiAoKHNlbGYuaWlkIC0gMSkgPj0gMCkge1xyXG4gICAgICAgIHNlbGYuX2dhbWUubWFwW3NlbGYuaWlkIC0gMV1bc2VsZi5qaWRdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLm9uVG91Y2hlZChjb2xvcilcclxuICAgICAgfVxyXG4gICAgICBpZiAoKHNlbGYuaWlkICsgMSkgPCB0aGlzLl9nYW1lLnJvd0NmZ051bSkge1xyXG4gICAgICAgIHNlbGYuX2dhbWUubWFwW3NlbGYuaWlkICsgMV1bc2VsZi5qaWRdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLm9uVG91Y2hlZChjb2xvcilcclxuICAgICAgfVxyXG4gICAgICBpZiAoKHNlbGYuamlkIC0gMSkgPj0gMCkge1xyXG4gICAgICAgIHNlbGYuX2dhbWUubWFwW3NlbGYuaWlkXVtzZWxmLmppZCAtIDFdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLm9uVG91Y2hlZChjb2xvcilcclxuICAgICAgfVxyXG4gICAgICBpZiAoKHNlbGYuamlkICsgMSkgPCB0aGlzLl9nYW1lLnJvd0NmZ051bSkge1xyXG4gICAgICAgIHNlbGYuX2dhbWUubWFwW3NlbGYuaWlkXVtzZWxmLmppZCArIDFdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLm9uVG91Y2hlZChjb2xvcilcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcGxheUZhbGxBY3Rpb24oeSwgZGF0YSkgeyAvL+S4i+mZjeS6huWHoOS4quagvOWtkFxyXG4gICAgdGhpcy5zdGF0dXNUeXBlID0gMFxyXG4gICAgaWYgKGRhdGEpIHtcclxuICAgICAgdGhpcy5paWQgPSBkYXRhLnlcclxuICAgICAgdGhpcy5qaWQgPSBkYXRhLnhcclxuICAgIH1cclxuICAgIGxldCBhY3Rpb24gPSBjYy5tb3ZlQnkoMC4yNSwgMCwgLXkgKiAodGhpcy5fZ2FtZS5nYXBDZmdOdW0gKyB0aGlzLl9nYW1lLmJsb2NrQ2xzV2lkdGgpKS5lYXNpbmcoY2MuZWFzZUJvdW5jZU91dCg1IC8geSkpIC8vMSAqIHkgLyB0aGlzLl9nYW1lLmFuaW1hQ2ZnU3BlZWRcclxuICAgIGxldCBzZXEgPSBjYy5zZXF1ZW5jZShhY3Rpb24sIGNjLmNhbGxGdW5jKCgpID0+IHtcclxuICAgICAgdGhpcy5zdGF0dXNUeXBlID0gMVxyXG4gICAgICAvLyAgdGhpcy5fZ2FtZS5jaGVja05lZWRHZW5lcmF0b3IoKVxyXG4gICAgfSwgdGhpcykpXHJcbiAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSlcclxuICB9LFxyXG4gIHBsYXlTdGFydEFjdGlvbigpIHtcclxuICAgIHRoaXMubm9kZS5zY2FsZVggPSAwXHJcbiAgICB0aGlzLm5vZGUuc2NhbGVZID0gMFxyXG4gICAgbGV0IGFjdGlvbiA9IGNjLnNjYWxlVG8oMC44IC8gdGhpcy5fZ2FtZS5hbmltYUNmZ1NwZWVkLCAxLCAxKS5lYXNpbmcoY2MuZWFzZUJhY2tPdXQoKSlcclxuICAgIGxldCBzZXEgPSBjYy5zZXF1ZW5jZShhY3Rpb24sIGNjLmNhbGxGdW5jKCgpID0+IHtcclxuICAgICAgdGhpcy5zdGF0dXNUeXBlID0gMVxyXG4gICAgfSwgdGhpcykpXHJcbiAgICAvLyDlpoLmnpzmnInlu7bov5/ml7bpl7TlsLHnlKjlu7bov5/ml7bpl7RcclxuICAgIGlmICh0aGlzLnN0YXJ0VGltZSkge1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKVxyXG4gICAgICAgIH0sIHRoaXMuc3RhcnRUaW1lIC8gMVxyXG4gICAgICAgIC8vIChjYy5nYW1lLmdldEZyYW1lUmF0ZSgpIC8gNjApXHJcbiAgICAgIClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcGxheURpZUFjdGlvbigpIHtcclxuICAgIGxldCBzZWxmID0gdGhpc1xyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuc3VyZmFjZVRpbWVyKVxyXG4gICAgdGhpcy5ub2RlLnN0b3BBbGxBY3Rpb25zKClcclxuICAgIHRoaXMuc3RhdHVzVHlwZSA9IDJcclxuICAgIHRoaXMubm9kZS5zY2FsZVggPSAxXHJcbiAgICB0aGlzLm5vZGUuc2NhbGVZID0gMVxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgbGV0IGFjdGlvblxyXG4gICAgICBpZiAodGhpcy53YXJuaW5nU3ByaXRlLnNwcml0ZUZyYW1lKSB7IC8v5pyJ6YGT5YW36aKE6K2mXHJcbiAgICAgICAgbGV0IHR3ZWVuMSA9IGNjLnNjYWxlVG8oMC4yIC8gc2VsZi5fZ2FtZS5hbmltYUNmZ1NwZWVkLCAxLjEpXHJcbiAgICAgICAgbGV0IGFjdGlvbjIgPSBjYy5tb3ZlVG8oMC4yIC8gc2VsZi5fZ2FtZS5hbmltYUNmZ1NwZWVkLCB0aGlzLl9nYW1lLnRhcmdldC54LCB0aGlzLl9nYW1lLnRhcmdldC55KVxyXG4gICAgICAgIGxldCBhY3Rpb24zID0gY2Muc2NhbGVUbygwLjIsIDApXHJcbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKHR3ZWVuMSwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xyXG4gICAgICAgICAgcmVzb2x2ZSgnJylcclxuICAgICAgICB9LCB0aGlzKSwgY2Muc3Bhd24oYWN0aW9uMiwgYWN0aW9uMykpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWN0aW9uID0gY2Muc2NhbGVUbygwLjIgLyBzZWxmLl9nYW1lLmFuaW1hQ2ZnU3BlZWQsIDAsIDApXHJcbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKGFjdGlvbiwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xyXG4gICAgICAgICAgcmVzb2x2ZSgnJylcclxuICAgICAgICB9LCB0aGlzKSlcclxuICAgICAgfVxyXG4gICAgICBzZWxmLm5vZGUucnVuQWN0aW9uKHNlcSlcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgc3VyZmFjZUFjdGlvbihkZWxhKSB7XHJcbiAgICB0aGlzLnN1cmZhY2VUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBsZXQgYWN0aW9uID0gY2Muc2NhbGVUbygwLjQgLyB0aGlzLl9nYW1lLmFuaW1hQ2ZnU3BlZWQsIDAuOCwgMC44KVxyXG4gICAgICBsZXQgdHdlZW4xID0gY2Muc2NhbGVUbygwLjQgLyB0aGlzLl9nYW1lLmFuaW1hQ2ZnU3BlZWQsIDEsIDEpXHJcbiAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoYWN0aW9uLCB0d2VlbjEpKVxyXG4gICAgfSwgZGVsYSlcclxuICB9LFxyXG4gIGdlbmVyYXRlUHJvcEFjdGlvbigpIHtcclxuXHJcbiAgfSxcclxuICBnZW5lcmF0ZUl0ZW0odHlwZSkge1xyXG4gICAgdGhpcy5faXRlbVR5cGUgPSB0eXBlXHJcbiAgfSxcclxufSk7Il19
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
    statusType: 0,
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
    this.reviveTimer = null;
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

    this.gameMapInit(this.rowCfgNum).then(function (result) {
      _this.statusType = 1;
    });
  },
  // 初始化地图
  gameMapInit: function gameMapInit(num) {
    var _this2 = this;

    this.map = [];
    var self = this; // 生成两个随机的对象数组

    var a, b, c, d;

    do {
      a = Math.floor(Math.random() * num);
      b = Math.floor(Math.random() * num);
      c = Math.floor(1 + Math.random() * (num - 1)) - 1;
      d = Math.floor(Math.random() * num);
    } while (a === c && b === d);

    return new Promise(function (resolve, reject) {
      for (var i = 0; i < num; i++) {
        _this2.map[i] = [];

        for (var j = 0; j < num; j++) {
          var itemType = i === a && j === b ? 1 : i === c && j === d ? 2 : 0;
          self.map[i][j] = self.instantiateBlock(self, {
            x: j,
            y: i,
            width: self.blockClsWidth,
            startTime: (i + j + 1) * self._gameController.config.json.startAnimationTime / num * 2
          }, self.blocksContainer, itemType);
        }
      }

      _this2.checkMgr.init(self);

      setTimeout(function () {
        resolve('200 OK');

        _this2.checkMgr.elementCheck(self);
      }, self._gameController.config.json.startAnimationTime * num / 2 / 1);
    });
  },
  //防抖动 判断是否需要检测下落
  checkNeedFall: function checkNeedFall() {
    var _this3 = this;

    if (this.checkNeedFallTimer) {
      clearTimeout(this.checkNeedFallTimer);
    }

    this.checkNeedFallTimer = setTimeout(function () {
      if (_this3.statusType == 5) {
        _this3.statusType = 4;

        _this3.onFall();
      }
    }, 300 / 1 // (cc.game.getFrameRate() / 60)
    );
  },
  onFall: function onFall() {
    var _this4 = this;

    // 调用 checkGenerateProp 方法并返回 Promise，然后在 Promise 成功时执行后续操作
    return this.checkGenerateProp(this._gameScore.chain).then(function () {
      // 用于记录每列可下落的方块数量
      var canFall; // 从每一列的最下面开始往上遍历

      for (var j = _this4.rowCfgNum - 1; j >= 0; j--) {
        canFall = 0; // 从每一列的底部往上遍历每一行

        for (var i = _this4.rowCfgNum - 1; i >= 0; i--) {
          // 如果当前方块状态类型为 2
          if (_this4.map[i][j].getComponent('element').statusType === 2) {
            // 将当前方块放入方块池中
            _this4.blockPool.put(_this4.map[i][j]); // 将当前位置的方块设置为 null


            _this4.map[i][j] = null; // 增加可下落的方块数量

            canFall++;
          } else if (canFall !== 0) {
            // 如果有可下落的方块且当前方块不是状态类型为 2 的方块
            // 将当前方块移动到下方的空位
            _this4.map[i + canFall][j] = _this4.map[i][j]; // 将当前位置的方块设置为 null

            _this4.map[i][j] = null; // 让当前方块执行下落动作，传入下落的距离和新位置

            _this4.map[i + canFall][j].getComponent('element').playFallAction(canFall, {
              x: j,
              y: i + canFall
            });
          }
        } // 对于每一列中可下落的空位，生成新的方块并执行下落动作


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
      } // 设置超时，超时后执行检查和元素检查，并设置状态类型


      setTimeout(function () {
        _this4.checkMgr.init(_this4);

        _this4.checkMgr.elementCheck(_this4);

        _this4.statusType = 1;
      }, 250);
    });
  },
  gameOver: function gameOver() {
    this.statusType = 3;

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
    this.statusType = 1;

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
            if (this.map[i][j] && this.map[i][j].getComponent('element').statusType == 1) {
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
            if (this.map[_i][_j] && this.map[_i][_j].getComponent('element').color == color && this.map[_i][_j] && this.map[_i][_j].getComponent('element').statusType != 2) {
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
            if (this.map[_i2][_j2] && this.map[_i2][_j2].getComponent('element').statusType == 1) {
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
            if (this.map[_i3][_j3] && this.map[_i3][_j3].getComponent('element').isSingle && this.map[_i3][_j3] && this.map[_i3][_j3].getComponent('element').statusType != 2) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxnYW1lLmpzIl0sIm5hbWVzIjpbIkFDIiwicmVxdWlyZSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwic3RhdHVzVHlwZSIsImJsb2NrUHJlZmFiIiwiUHJlZmFiIiwiYmxvY2tTcHJpdGUiLCJTcHJpdGVGcmFtZSIsIndhcm5pbmdTcHJpdGVGcmFtZSIsInByb3BTcHJpdGVGcmFtZSIsImNoZWNrTWdyIiwicmV2aXZlUGFnZSIsIk5vZGUiLCJzdGFydCIsImJpbmROb2RlIiwiZ2VuZXJhdGVQcmVmYWJQb29sIiwibG9hZFJlcyIsImluaXQiLCJjIiwiX2dhbWVDb250cm9sbGVyIiwiX2dhbWVTY29yZSIsInNjb3JlTWdyIiwicm93Q2ZnTnVtIiwiY29uZmlnIiwianNvbiIsImdhcENmZ051bSIsImFuaW1hQ2ZnU3BlZWQiLCJibG9ja0Nsc1dpZHRoIiwicmV2aXZlVGltZXIiLCJibG9ja3NDb250YWluZXIiLCJub2RlIiwiZ2V0Q2hpbGRCeU5hbWUiLCJnYW1lU3RhcnQiLCJyZWNvdmVyeUFsbEJsb2NrcyIsInRoZW4iLCJnYW1lTWFwSW5pdCIsInJlc3VsdCIsIm51bSIsIm1hcCIsInNlbGYiLCJhIiwiYiIsImQiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImkiLCJqIiwiaXRlbVR5cGUiLCJpbnN0YW50aWF0ZUJsb2NrIiwieCIsInkiLCJ3aWR0aCIsInN0YXJ0VGltZSIsInN0YXJ0QW5pbWF0aW9uVGltZSIsInNldFRpbWVvdXQiLCJlbGVtZW50Q2hlY2siLCJjaGVja05lZWRGYWxsIiwiY2hlY2tOZWVkRmFsbFRpbWVyIiwiY2xlYXJUaW1lb3V0Iiwib25GYWxsIiwiY2hlY2tHZW5lcmF0ZVByb3AiLCJjaGFpbiIsImNhbkZhbGwiLCJnZXRDb21wb25lbnQiLCJibG9ja1Bvb2wiLCJwdXQiLCJwbGF5RmFsbEFjdGlvbiIsImsiLCJnYW1lT3ZlciIsInBhZ2VNYW5hZ2VyIiwiYWRkUGFnZSIsInNvY2lhbCIsImFjdGl2ZSIsImNsb3NlQmFubmVyQWR2IiwiYXNrUmV2aXZlIiwicmFuZ2VTcHJpdGUiLCJTcHJpdGUiLCJmaWxsUmFuZ2UiLCJpc1JhbmdlQWN0aW9uIiwibnVtTGFiZWwiLCJMYWJlbCIsInN0cmluZyIsImNsZWFySW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsIm9uU2tpcFJldml2ZSIsIm9uUmV2aXZlQnV0dG9uIiwic2hvd1Jldml2ZVN1Y2Nlc3MiLCJvblJldml2ZUNlcnRhaW5CdG4iLCJyZW1vdmVQYWdlIiwib25SZXZpdmUiLCJ1cGRhdGUiLCJwYWdlcyIsIm9uR2FtZU92ZXIiLCJyZXN0YXJ0Iiwib25PcGVuUGFnZSIsIm9uVXNlclRvdWNoZWQiLCJpaWQiLCJqaWQiLCJjb2xvciIsIndhcm5pbmciLCJwb3MiLCJ0YXJnZXQiLCJnZW5lcmF0ZVByb3BJdGVtIiwidHlwZSIsIm9uSXRlbSIsInRpcEJveCIsImFkZE11bHQiLCJtdXNpY01hbmFnZXIiLCJvbkRvdWJsZSIsImRpc3RhbmNlIiwic3FydCIsInBvdyIsInN1cmZhY2VBY3Rpb24iLCJydW5BY3Rpb24iLCJzaGFja0FjdGlvbiIsIm9uU2hha2VQaG9uZSIsImlzUHJvcENoYWluIiwib25Cb29tIiwib25Ub3VjaGVkIiwicm9ja0FjdGlvbiIsIm9uU3RlcCIsIm9uTWFnaWMiLCJpc1NpbmdsZSIsImNvbnNvbGUiLCJsb2ciLCJOb2RlUG9vbCIsImJsb2NrIiwiaW5zdGFudGlhdGUiLCJkYXRhIiwicGFyZW50Iiwic2l6ZSIsImdldCIsInNjYWxlIiwiY2hpbGRyZW4iLCJsZW5ndGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFJQSxJQUFJQSxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxTQUFELENBQWhCOztBQUNBQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUVQQyxFQUFBQSxVQUFVLEVBQUU7QUFD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LENBQVA7QUFDRCxLQWZNLENBQVA7QUFnQkQ7QUFsWE0sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBhdXRob3IgaGV5dWNoYW5nXHJcbiAqIEBmaWxlIOa4uOaIj+aOp+WItlxyXG4gKi9cclxudmFyIEFDID0gcmVxdWlyZSgnR2FtZUFjdCcpXHJcbmNjLkNsYXNzKHtcclxuICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcbiAgcHJvcGVydGllczoge1xyXG4gICAgc3RhdHVzVHlwZTogMCwgLy8wIOacquW8gOWniyAxIOa4uOaIj+W8gOWniyAyIOa4uOaIj+aaguWBnCAzIOa4uOaIj+e7k+adnyA0IOS4i+iQveeKtuaAgSA15peg5rOV6Kem5pG454q25oCBXHJcbiAgICBibG9ja1ByZWZhYjogY2MuUHJlZmFiLFxyXG4gICAgYmxvY2tTcHJpdGU6IFtjYy5TcHJpdGVGcmFtZV0sIC8vdG9kbzog5o2i5oiQ5Yqo5oCB55Sf5oiQIOaaguS4jeWkhOeQhlxyXG4gICAgd2FybmluZ1Nwcml0ZUZyYW1lOiBbY2MuU3ByaXRlRnJhbWVdLFxyXG4gICAgcHJvcFNwcml0ZUZyYW1lOiBbY2MuU3ByaXRlRnJhbWVdLFxyXG4gICAgY2hlY2tNZ3I6IHJlcXVpcmUoXCJlbGVtZW50Q2hlY2tcIiksXHJcbiAgICByZXZpdmVQYWdlOiBjYy5Ob2RlLFxyXG4gIH0sXHJcbiAgc3RhcnQoKSB7XHJcbiAgICB0aGlzLmJpbmROb2RlKClcclxuICAgIHRoaXMuZ2VuZXJhdGVQcmVmYWJQb29sKClcclxuICAgIHRoaXMubG9hZFJlcygpXHJcbiAgfSxcclxuICBsb2FkUmVzKCkge1xyXG5cclxuICB9LFxyXG4gIGluaXQoYykge1xyXG4gICAgdGhpcy5fZ2FtZUNvbnRyb2xsZXIgPSBjXHJcbiAgICB0aGlzLl9nYW1lU2NvcmUgPSBjLnNjb3JlTWdyXHJcbiAgICB0aGlzLnJvd0NmZ051bSA9IGMuY29uZmlnLmpzb24ucm93Q2ZnTnVtXHJcbiAgICB0aGlzLmdhcENmZ051bSA9IGMuY29uZmlnLmpzb24uZ2FwQ2ZnTnVtXHJcbiAgICB0aGlzLmFuaW1hQ2ZnU3BlZWQgPSBjLmNvbmZpZy5qc29uLmdhcENmZ051bVxyXG4gICAgdGhpcy5ibG9ja0Nsc1dpZHRoID0gKDczMCAtICh0aGlzLnJvd0NmZ051bSArIDEpICogdGhpcy5nYXBDZmdOdW0pIC8gdGhpcy5yb3dDZmdOdW1cclxuICAgIHRoaXMucmV2aXZlVGltZXIgPSBudWxsXHJcbiAgfSxcclxuICAvLyDliqjmgIHojrflj5bpnIDopoHliqjmgIHmjqfliLbnmoTnu4Tku7ZcclxuICBiaW5kTm9kZSgpIHtcclxuICAgIHRoaXMuYmxvY2tzQ29udGFpbmVyID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdtYXAnKVxyXG4gIH0sXHJcbiAgLy8tLS0tLS0tLS0tLS0tLS0tIOa4uOaIj+aOp+WItiAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAvLyDmuLjmiI/lvIDlp4tcclxuICBnYW1lU3RhcnQoKSB7XHJcbiAgICB0aGlzLnJlY292ZXJ5QWxsQmxvY2tzKCkudGhlbigpXHJcbiAgICB0aGlzLl9nYW1lU2NvcmUuaW5pdCh0aGlzKVxyXG4gICAgdGhpcy5nYW1lTWFwSW5pdCh0aGlzLnJvd0NmZ051bSkudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgIHRoaXMuc3RhdHVzVHlwZSA9IDFcclxuICAgIH0pXHJcblxyXG4gIH0sXHJcbiAgLy8g5Yid5aeL5YyW5Zyw5Zu+XHJcbiAgZ2FtZU1hcEluaXQobnVtKSB7XHJcbiAgICB0aGlzLm1hcCA9IFtdO1xyXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgLy8g55Sf5oiQ5Lik5Liq6ZqP5py655qE5a+56LGh5pWw57uEXHJcbiAgICBsZXQgYSwgYiwgYywgZDtcclxuICAgIGRvIHtcclxuICAgICAgYSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bSk7XHJcbiAgICAgIGIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW0pO1xyXG4gICAgICBjID0gTWF0aC5mbG9vcigxICsgTWF0aC5yYW5kb20oKSAqIChudW0gLSAxKSkgLSAxO1xyXG4gICAgICBkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtKTtcclxuICAgIH0gd2hpbGUgKGEgPT09IGMgJiYgYiA9PT0gZCk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW07IGkrKykge1xyXG4gICAgICAgIHRoaXMubWFwW2ldID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW07IGorKykge1xyXG4gICAgICAgICAgbGV0IGl0ZW1UeXBlID0gKGkgPT09IGEgJiYgaiA9PT0gYikgPyAxIDogKGkgPT09IGMgJiYgaiA9PT0gZCkgPyAyIDogMDtcclxuICAgICAgICAgIHNlbGYubWFwW2ldW2pdID0gc2VsZi5pbnN0YW50aWF0ZUJsb2NrKHNlbGYsIHtcclxuICAgICAgICAgICAgeDogaixcclxuICAgICAgICAgICAgeTogaSxcclxuICAgICAgICAgICAgd2lkdGg6IHNlbGYuYmxvY2tDbHNXaWR0aCxcclxuICAgICAgICAgICAgc3RhcnRUaW1lOiAoaSArIGogKyAxKSAqIHNlbGYuX2dhbWVDb250cm9sbGVyLmNvbmZpZy5qc29uLnN0YXJ0QW5pbWF0aW9uVGltZSAvIG51bSAqIDJcclxuICAgICAgICAgIH0sIHNlbGYuYmxvY2tzQ29udGFpbmVyLCBpdGVtVHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY2hlY2tNZ3IuaW5pdChzZWxmKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgcmVzb2x2ZSgnMjAwIE9LJyk7XHJcbiAgICAgICAgdGhpcy5jaGVja01nci5lbGVtZW50Q2hlY2soc2VsZik7XHJcbiAgICAgIH0sIHNlbGYuX2dhbWVDb250cm9sbGVyLmNvbmZpZy5qc29uLnN0YXJ0QW5pbWF0aW9uVGltZSAqIG51bSAvIDIgLyAxKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIC8v6Ziy5oqW5YqoIOWIpOaWreaYr+WQpumcgOimgeajgOa1i+S4i+iQvVxyXG4gIGNoZWNrTmVlZEZhbGwoKSB7XHJcbiAgICBpZiAodGhpcy5jaGVja05lZWRGYWxsVGltZXIpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuY2hlY2tOZWVkRmFsbFRpbWVyKVxyXG4gICAgfVxyXG4gICAgdGhpcy5jaGVja05lZWRGYWxsVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgaWYgKHRoaXMuc3RhdHVzVHlwZSA9PSA1KSB7XHJcbiAgICAgICAgdGhpcy5zdGF0dXNUeXBlID0gNFxyXG4gICAgICAgIHRoaXMub25GYWxsKClcclxuICAgICAgfVxyXG4gICAgfSwgMzAwIC8gMVxyXG4gICAgICAvLyAoY2MuZ2FtZS5nZXRGcmFtZVJhdGUoKSAvIDYwKVxyXG4gICAgKVxyXG4gIH0sXHJcbiAgb25GYWxsKCkge1xyXG4gICAgLy8g6LCD55SoIGNoZWNrR2VuZXJhdGVQcm9wIOaWueazleW5tui/lOWbniBQcm9taXNl77yM54S25ZCO5ZyoIFByb21pc2Ug5oiQ5Yqf5pe25omn6KGM5ZCO57ut5pON5L2cXHJcbiAgICByZXR1cm4gdGhpcy5jaGVja0dlbmVyYXRlUHJvcCh0aGlzLl9nYW1lU2NvcmUuY2hhaW4pLnRoZW4oKCkgPT4ge1xyXG4gICAgICAvLyDnlKjkuo7orrDlvZXmr4/liJflj6/kuIvokL3nmoTmlrnlnZfmlbDph49cclxuICAgICAgbGV0IGNhbkZhbGw7XHJcbiAgICAgIC8vIOS7juavj+S4gOWIl+eahOacgOS4i+mdouW8gOWni+W+gOS4iumBjeWOhlxyXG4gICAgICBmb3IgKGxldCBqID0gdGhpcy5yb3dDZmdOdW0gLSAxOyBqID49IDA7IGotLSkge1xyXG4gICAgICAgIGNhbkZhbGwgPSAwO1xyXG4gICAgICAgIC8vIOS7juavj+S4gOWIl+eahOW6lemDqOW+gOS4iumBjeWOhuavj+S4gOihjFxyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLnJvd0NmZ051bSAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAvLyDlpoLmnpzlvZPliY3mlrnlnZfnirbmgIHnsbvlnovkuLogMlxyXG4gICAgICAgICAgaWYgKHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLnN0YXR1c1R5cGUgPT09IDIpIHtcclxuICAgICAgICAgICAgLy8g5bCG5b2T5YmN5pa55Z2X5pS+5YWl5pa55Z2X5rGg5LitXHJcbiAgICAgICAgICAgIHRoaXMuYmxvY2tQb29sLnB1dCh0aGlzLm1hcFtpXVtqXSk7XHJcbiAgICAgICAgICAgIC8vIOWwhuW9k+WJjeS9jee9rueahOaWueWdl+iuvue9ruS4uiBudWxsXHJcbiAgICAgICAgICAgIHRoaXMubWFwW2ldW2pdID0gbnVsbDtcclxuICAgICAgICAgICAgLy8g5aKe5Yqg5Y+v5LiL6JC955qE5pa55Z2X5pWw6YePXHJcbiAgICAgICAgICAgIGNhbkZhbGwrKztcclxuICAgICAgICAgIH0gZWxzZSBpZiAoY2FuRmFsbCAhPT0gMCkge1xyXG4gICAgICAgICAgICAvLyDlpoLmnpzmnInlj6/kuIvokL3nmoTmlrnlnZfkuJTlvZPliY3mlrnlnZfkuI3mmK/nirbmgIHnsbvlnovkuLogMiDnmoTmlrnlnZdcclxuICAgICAgICAgICAgLy8g5bCG5b2T5YmN5pa55Z2X56e75Yqo5Yiw5LiL5pa555qE56m65L2NXHJcbiAgICAgICAgICAgIHRoaXMubWFwW2kgKyBjYW5GYWxsXVtqXSA9IHRoaXMubWFwW2ldW2pdO1xyXG4gICAgICAgICAgICAvLyDlsIblvZPliY3kvY3nva7nmoTmlrnlnZforr7nva7kuLogbnVsbFxyXG4gICAgICAgICAgICB0aGlzLm1hcFtpXVtqXSA9IG51bGw7XHJcbiAgICAgICAgICAgIC8vIOiuqeW9k+WJjeaWueWdl+aJp+ihjOS4i+iQveWKqOS9nO+8jOS8oOWFpeS4i+iQveeahOi3neemu+WSjOaWsOS9jee9rlxyXG4gICAgICAgICAgICB0aGlzLm1hcFtpICsgY2FuRmFsbF1bal0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykucGxheUZhbGxBY3Rpb24oY2FuRmFsbCwge1xyXG4gICAgICAgICAgICAgIHg6IGosXHJcbiAgICAgICAgICAgICAgeTogaSArIGNhbkZhbGwsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDlr7nkuo7mr4/kuIDliJfkuK3lj6/kuIvokL3nmoTnqbrkvY3vvIznlJ/miJDmlrDnmoTmlrnlnZflubbmiafooYzkuIvokL3liqjkvZxcclxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGNhbkZhbGw7IGsrKykge1xyXG4gICAgICAgICAgdGhpcy5tYXBba11bal0gPSB0aGlzLmluc3RhbnRpYXRlQmxvY2sodGhpcywge1xyXG4gICAgICAgICAgICB4OiBqLFxyXG4gICAgICAgICAgICB5OiBrLFxyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ibG9ja0Nsc1dpZHRoLFxyXG4gICAgICAgICAgICBzdGFydFRpbWU6IG51bGxcclxuICAgICAgICAgIH0sIHRoaXMuYmxvY2tzQ29udGFpbmVyLCAnJywge1xyXG4gICAgICAgICAgICB4OiBqLFxyXG4gICAgICAgICAgICB5OiAtY2FuRmFsbCArIGtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgdGhpcy5tYXBba11bal0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykucGxheUZhbGxBY3Rpb24oY2FuRmFsbCwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vIOiuvue9rui2heaXtu+8jOi2heaXtuWQjuaJp+ihjOajgOafpeWSjOWFg+e0oOajgOafpe+8jOW5tuiuvue9rueKtuaAgeexu+Wei1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLmNoZWNrTWdyLmluaXQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jaGVja01nci5lbGVtZW50Q2hlY2sodGhpcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0dXNUeXBlID0gMTtcclxuICAgICAgfSwgMjUwKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgZ2FtZU92ZXIoKSB7XHJcbiAgICB0aGlzLnN0YXR1c1R5cGUgPSAzXHJcbiAgICB0aGlzLl9nYW1lQ29udHJvbGxlci5wYWdlTWFuYWdlci5hZGRQYWdlKDIpXHJcbiAgICB0aGlzLl9nYW1lQ29udHJvbGxlci5wYWdlTWFuYWdlci5hZGRQYWdlKDQpXHJcbiAgICBpZiAodGhpcy5fZ2FtZUNvbnRyb2xsZXIuc29jaWFsLm5vZGUuYWN0aXZlKSB7XHJcbiAgICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLnNvY2lhbC5jbG9zZUJhbm5lckFkdigpXHJcbiAgICB9XHJcbiAgfSxcclxuICAvLyB0b2RvIOWkjea0u1xyXG4gIGFza1Jldml2ZSgpIHtcclxuICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLnBhZ2VNYW5hZ2VyLmFkZFBhZ2UoMilcclxuICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLnBhZ2VNYW5hZ2VyLmFkZFBhZ2UoNSlcclxuICAgIHRoaXMucmV2aXZlUGFnZS5hY3RpdmUgPSB0cnVlXHJcbiAgICB0aGlzLnJldml2ZVBhZ2UuZ2V0Q2hpbGRCeU5hbWUoJ2Fza1Jldml2ZScpLmFjdGl2ZSA9IHRydWVcclxuICAgIHRoaXMucmV2aXZlUGFnZS5nZXRDaGlsZEJ5TmFtZSgnc3VjY2Vzc1Jldml2ZScpLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICB0aGlzLnJhbmdlU3ByaXRlID0gdGhpcy5yZXZpdmVQYWdlLmdldENoaWxkQnlOYW1lKCdhc2tSZXZpdmUnKS5nZXRDaGlsZEJ5TmFtZSgnbnVtQmcnKS5nZXRDaGlsZEJ5TmFtZSgnc3ByaXRlJykuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSlcclxuICAgIHRoaXMucmFuZ2VTcHJpdGUuZmlsbFJhbmdlID0gMVxyXG4gICAgdGhpcy5pc1JhbmdlQWN0aW9uID0gdHJ1ZVxyXG4gICAgbGV0IG51bUxhYmVsID0gdGhpcy5yZXZpdmVQYWdlLmdldENoaWxkQnlOYW1lKCdhc2tSZXZpdmUnKS5nZXRDaGlsZEJ5TmFtZSgnbnVtQmcnKS5nZXRDaGlsZEJ5TmFtZSgnbnVtJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKVxyXG4gICAgbnVtTGFiZWwuc3RyaW5nID0gOVxyXG4gICAgaWYgKHRoaXMucmV2aXZlVGltZXIpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnJldml2ZVRpbWVyKVxyXG4gICAgfVxyXG4gICAgdGhpcy5yZXZpdmVUaW1lciA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgaWYgKCtudW1MYWJlbC5zdHJpbmcgPiAwKSB7XHJcbiAgICAgICAgbnVtTGFiZWwuc3RyaW5nLS1cclxuICAgICAgICB0aGlzLnJhbmdlU3ByaXRlLmZpbGxSYW5nZSA9IDFcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm9uU2tpcFJldml2ZSgpXHJcbiAgICAgIH1cclxuICAgIH0sIDEwMDApXHJcblxyXG4gIH0sXHJcbiAgb25SZXZpdmVCdXR0b24oKSB7XHJcbiAgICBjbGVhckludGVydmFsKHRoaXMucmV2aXZlVGltZXIpXHJcbiAgICB0aGlzLmlzUmFuZ2VBY3Rpb24gPSBmYWxzZVxyXG4gICAgaWYgKHRoaXMuX2dhbWVDb250cm9sbGVyLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xyXG4gICAgICB0aGlzLl9nYW1lQ29udHJvbGxlci5zb2NpYWwub25SZXZpdmVCdXR0b24oMSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2hvd1Jldml2ZVN1Y2Nlc3MoKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgc2hvd1Jldml2ZVN1Y2Nlc3MoKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCfmiZPlvIDlpI3mtLvmiJDlip/pobXpnaInKVxyXG4gICAgdGhpcy5yZXZpdmVQYWdlLmdldENoaWxkQnlOYW1lKCdhc2tSZXZpdmUnKS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgdGhpcy5yZXZpdmVQYWdlLmdldENoaWxkQnlOYW1lKCdzdWNjZXNzUmV2aXZlJykuYWN0aXZlID0gdHJ1ZVxyXG4gIH0sXHJcbiAgb25SZXZpdmVDZXJ0YWluQnRuKCkge1xyXG4gICAgdGhpcy5fZ2FtZUNvbnRyb2xsZXIucGFnZU1hbmFnZXIucmVtb3ZlUGFnZSgyKVxyXG4gICAgdGhpcy5yZXZpdmVQYWdlLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICB0aGlzLnN0YXR1c1R5cGUgPSAxXHJcbiAgICB0aGlzLl9nYW1lU2NvcmUub25SZXZpdmUoKVxyXG4gIH0sXHJcbiAgdXBkYXRlKCkge1xyXG4gICAgaWYgKHRoaXMuaXNSYW5nZUFjdGlvbikge1xyXG4gICAgICB0aGlzLnJhbmdlU3ByaXRlLmZpbGxSYW5nZSAtPSAxIC8gNjBcclxuICAgIH1cclxuICB9LFxyXG4gIG9uU2tpcFJldml2ZSgpIHtcclxuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5yZXZpdmVUaW1lcilcclxuICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLnBhZ2VNYW5hZ2VyLnBhZ2VzWzVdLmFjdGl2ZSA9IGZhbHNlXHJcbiAgICB0aGlzLl9nYW1lU2NvcmUub25HYW1lT3Zlcih0cnVlKVxyXG4gICAgdGhpcy5pc1JhbmdlQWN0aW9uID0gZmFsc2VcclxuICB9LFxyXG4gIHJlc3RhcnQoKSB7XHJcbiAgICB0aGlzLl9nYW1lQ29udHJvbGxlci5wYWdlTWFuYWdlci5vbk9wZW5QYWdlKDEpXHJcbiAgICB0aGlzLnJlY292ZXJ5QWxsQmxvY2tzKCkudGhlbigoKSA9PiB7XHJcbiAgICAgIHRoaXMuZ2FtZVN0YXJ0KClcclxuICAgIH0pXHJcbiAgfSxcclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLemBk+WFt+ebuOWFsy0tLS0tLS0tLS0tLS0tLVxyXG4gIC8vIOWCqOWtmOeUqOaIt+eCueWHu+aXtueahOaWueWdlyDnlKjkuo7nlJ/miJDpgZPlhbdcclxuICBvblVzZXJUb3VjaGVkKGlpZCwgamlkLCBpdGVtVHlwZSwgY29sb3IsIHdhcm5pbmcsIHBvcykge1xyXG4gICAgdGhpcy50YXJnZXQgPSB7XHJcbiAgICAgIGk6IGlpZCxcclxuICAgICAgajogamlkLFxyXG4gICAgICBjb2xvcjogY29sb3IsXHJcbiAgICAgIGl0ZW1UeXBlOiBpdGVtVHlwZSxcclxuICAgICAgeDogcG9zLngsXHJcbiAgICAgIHk6IHBvcy55LFxyXG4gICAgICB3YXJuaW5nOiB3YXJuaW5nXHJcbiAgICB9XHJcbiAgfSxcclxuICAvLyDnlJ/miJDpgZPlhbcgdHlwZSAx5Li65Y+M5YCN5YCN5pWwIDLkuLrngrjlvLkgM+S4uuWKoOS6lOeZvlxyXG4gIGdlbmVyYXRlUHJvcEl0ZW0odHlwZSkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgLy8g5piv5ZCm5YGa6YGT5YW355Sf5oiQ5Yqo55S7XHJcbiAgICAgIHRoaXMubWFwW3RoaXMudGFyZ2V0LmldW3RoaXMudGFyZ2V0LmpdID0gdGhpcy5pbnN0YW50aWF0ZUJsb2NrKHRoaXMsIHtcclxuICAgICAgICB4OiB0aGlzLnRhcmdldC5qLFxyXG4gICAgICAgIHk6IHRoaXMudGFyZ2V0LmksXHJcbiAgICAgICAgY29sb3I6IHRoaXMudGFyZ2V0LmNvbG9yLFxyXG4gICAgICAgIHdpZHRoOiB0aGlzLmJsb2NrQ2xzV2lkdGgsXHJcbiAgICAgICAgc3RhcnRUaW1lOiBudWxsXHJcbiAgICAgIH0sIHRoaXMuYmxvY2tzQ29udGFpbmVyLCB0eXBlKVxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICByZXNvbHZlKClcclxuICAgICAgfSwgMzAwKVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGNoZWNrR2VuZXJhdGVQcm9wKGNoYWluKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy50YXJnZXQud2FybmluZykge1xyXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVQcm9wSXRlbSh0aGlzLnRhcmdldC53YXJuaW5nKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHJlc29sdmUoKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgICByZXNvbHZlKClcclxuICAgIH0pXHJcbiAgfSxcclxuICBvbkl0ZW0odHlwZSwgY29sb3IsIHBvcykge1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICAvLyDliIbmlbDnv7vlgI0g5pyA6auY5YWr5YCNXHJcbiAgICAgICAgdGhpcy5fZ2FtZVNjb3JlLnRpcEJveC5pbml0KHRoaXMuX2dhbWVTY29yZSwgMSlcclxuICAgICAgICB0aGlzLl9nYW1lU2NvcmUuYWRkTXVsdChjb2xvciwgcG9zKVxyXG4gICAgICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLm11c2ljTWFuYWdlci5vbkRvdWJsZSgpXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd0NmZ051bTsgaSsrKSB7IC8v6KGMXHJcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMucm93Q2ZnTnVtOyBqKyspIHsgLy/liJdcclxuICAgICAgICAgICAgaWYgKHRoaXMubWFwW2ldW2pdICYmIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLnN0YXR1c1R5cGUgPT0gMSkge1xyXG4gICAgICAgICAgICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhwb3MueCAtIHRoaXMubWFwW2ldW2pdLngsIDIpICsgTWF0aC5wb3cocG9zLnkgLSB0aGlzLm1hcFtpXVtqXS55LCAyKSlcclxuICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdlbGVtZW50Jykuc3VyZmFjZUFjdGlvbihkaXN0YW5jZSlcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICAvLyDngrjlvLkg5raI6Zmk5ZCM56eN6aKc6Imy55qEXHJcbiAgICAgICAgdGhpcy5fZ2FtZVNjb3JlLnRpcEJveC5pbml0KHRoaXMuX2dhbWVTY29yZSwgMilcclxuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKEFDLnNoYWNrQWN0aW9uKDAuMSwgMTApKVxyXG4gICAgICAgIGlmICh0aGlzLl9nYW1lQ29udHJvbGxlci5zb2NpYWwubm9kZS5hY3RpdmUpIHtcclxuICAgICAgICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLnNvY2lhbC5vblNoYWtlUGhvbmUoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlzUHJvcENoYWluID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLm11c2ljTWFuYWdlci5vbkJvb20oKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dDZmdOdW07IGkrKykgeyAvL+ihjFxyXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLnJvd0NmZ051bTsgaisrKSB7IC8v5YiXXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcFtpXVtqXSAmJiB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvciA9PSBjb2xvciAmJiB0aGlzLm1hcFtpXVtqXSAmJiB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5zdGF0dXNUeXBlICE9IDIpIHtcclxuICAgICAgICAgICAgICB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5vblRvdWNoZWQoY29sb3IsIGZhbHNlLCB0cnVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRoaXMubWFwW2ldW2pdLnJ1bkFjdGlvbihBQy5yb2NrQWN0aW9uKDAuMiwgMTApKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMzogLy86ICDliqDmraXmlbBcclxuICAgICAgICB0aGlzLl9nYW1lU2NvcmUudGlwQm94LmluaXQodGhpcy5fZ2FtZVNjb3JlLCA0KVxyXG4gICAgICAgIHRoaXMuX2dhbWVDb250cm9sbGVyLm11c2ljTWFuYWdlci5vbkRvdWJsZSgpXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd0NmZ051bTsgaSsrKSB7IC8v6KGMXHJcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMucm93Q2ZnTnVtOyBqKyspIHsgLy/liJdcclxuICAgICAgICAgICAgaWYgKHRoaXMubWFwW2ldW2pdICYmIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLnN0YXR1c1R5cGUgPT0gMSkge1xyXG4gICAgICAgICAgICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhwb3MueCAtIHRoaXMubWFwW2ldW2pdLngsIDIpICsgTWF0aC5wb3cocG9zLnkgLSB0aGlzLm1hcFtpXVtqXS55LCAyKSlcclxuICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdlbGVtZW50Jykuc3VyZmFjZUFjdGlvbihkaXN0YW5jZSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZ2FtZVNjb3JlLm9uU3RlcCgzKS50aGVuKClcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSA0OiAvLyA6IOa2iOmZpOWFqOmDqOWNlei6q+eahOaWueWdl1xyXG4gICAgICAgIHRoaXMuX2dhbWVTY29yZS50aXBCb3guaW5pdCh0aGlzLl9nYW1lU2NvcmUsIDUpXHJcbiAgICAgICAgdGhpcy5pc1Byb3BDaGFpbiA9IHRydWVcclxuICAgICAgICB0aGlzLl9nYW1lQ29udHJvbGxlci5tdXNpY01hbmFnZXIub25NYWdpYygpXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd0NmZ051bTsgaSsrKSB7IC8v6KGMXHJcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMucm93Q2ZnTnVtOyBqKyspIHsgLy/liJdcclxuICAgICAgICAgICAgaWYgKHRoaXMubWFwW2ldW2pdICYmIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmlzU2luZ2xlICYmIHRoaXMubWFwW2ldW2pdICYmIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLnN0YXR1c1R5cGUgIT0gMikge1xyXG4gICAgICAgICAgICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhwb3MueCAtIHRoaXMubWFwW2ldW2pdLngsIDIpICsgTWF0aC5wb3cocG9zLnkgLSB0aGlzLm1hcFtpXVtqXS55LCAyKSlcclxuICAgICAgICAgICAgICB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5vblRvdWNoZWQoY29sb3IsIGZhbHNlLCB0cnVlLCBkaXN0YW5jZSlcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIumtlOazleajkuinpuWPkeeahOeCuVwiLCBpLCBqLCB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvciwgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuaXNTaW5nbGUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLSDpooTliLbkvZPlrp7kvovljJYtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAvLyDnlJ/miJDlr7nosaHmsaBcclxuICBnZW5lcmF0ZVByZWZhYlBvb2woKSB7XHJcbiAgICB0aGlzLmJsb2NrUG9vbCA9IG5ldyBjYy5Ob2RlUG9vbCgpXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgucG93KHRoaXMucm93Q2ZnTnVtLCAyKTsgaSsrKSB7XHJcbiAgICAgIGxldCBibG9jayA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYmxvY2tQcmVmYWIpXHJcbiAgICAgIHRoaXMuYmxvY2tQb29sLnB1dChibG9jaylcclxuICAgIH1cclxuICB9LFxyXG4gIC8vIOWunuS+i+WMluWNleS4quaWueWdl1xyXG4gIGluc3RhbnRpYXRlQmxvY2soc2VsZiwgZGF0YSwgcGFyZW50LCBpdGVtVHlwZSwgcG9zKSB7XHJcbiAgICBpdGVtVHlwZSA9IGl0ZW1UeXBlID8gaXRlbVR5cGUgOiAwXHJcbiAgICBpZiAoaXRlbVR5cGUgIT0gMCkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhcIumBk+WFt+iKgueCueaVsOaNrlwiLCBkYXRhLCBpdGVtVHlwZSlcclxuICAgIH1cclxuICAgIGxldCBibG9jayA9IG51bGxcclxuICAgIGlmIChzZWxmLmJsb2NrUG9vbCAmJiBzZWxmLmJsb2NrUG9vbC5zaXplKCkgPiAwKSB7XHJcbiAgICAgIGJsb2NrID0gc2VsZi5ibG9ja1Bvb2wuZ2V0KClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGJsb2NrID0gY2MuaW5zdGFudGlhdGUoc2VsZi5ibG9ja1ByZWZhYilcclxuICAgIH1cclxuICAgIGJsb2NrLnBhcmVudCA9IHBhcmVudFxyXG4gICAgYmxvY2suc2NhbGUgPSAxXHJcbiAgICBibG9jay54ID0gMFxyXG4gICAgYmxvY2sueSA9IDBcclxuICAgIGJsb2NrLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmluaXQoc2VsZiwgZGF0YSwgdGhpcy5ibG9ja0Nsc1dpZHRoLCBpdGVtVHlwZSwgcG9zKVxyXG4gICAgcmV0dXJuIGJsb2NrXHJcbiAgfSxcclxuICAvLyDlm57mlLbmiYDmnInoioLngrlcclxuICByZWNvdmVyeUFsbEJsb2NrcygpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuYmxvY2tzQ29udGFpbmVyLmNoaWxkcmVuXHJcbiAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgIGxldCBsZW5ndGggPSBjaGlsZHJlbi5sZW5ndGhcclxuICAgICAgICAvLyAgIGNvbnNvbGUubG9nKGxlbmd0aClcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB0aGlzLmJsb2NrUG9vbC5wdXQoY2hpbGRyZW5bMF0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dDZmdOdW07IGkrKykge1xyXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLnJvd0NmZ051bTsgaisrKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWFwW2ldW2pdID0gbnVsbFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXNvbHZlKCcnKVxyXG4gICAgfSlcclxuICB9LFxyXG5cclxufSk7Il19
//------QC-SOURCE-SPLIT------
