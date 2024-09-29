"use strict";
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