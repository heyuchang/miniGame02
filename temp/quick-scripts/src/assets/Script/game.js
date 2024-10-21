"use strict";
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