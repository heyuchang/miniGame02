
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
    this.generatePool();
    this.loadRes();
  },
  loadRes: function loadRes() {},
  init: function init(c) {
    this._controller = c;
    this._score = c.scoreMgr;
    this.rowNum = c.config.json.rowNum;
    this.gap = c.config.json.gap;
    this.animationSpeed = c.config.json.gap;
    this.blockWidth = (730 - (this.rowNum + 1) * this.gap) / this.rowNum;
    this.reviveTimer = null; //console.log(this.gap)
    //console.log(this.blockWidth)
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

    this._score.init(this);

    this.mapSet(this.rowNum).then(function (result) {
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
            width: self.blockWidth,
            startTime: (i + j + 1) * self._controller.config.json.startAnimationTime / num * 2
          }, self.blocksContainer, itemType);
        }
      }

      _this2.checkMgr.init(_this2);

      setTimeout(function () {
        resolve('200 OK');

        _this2.checkMgr.elementCheck(_this2);
      }, self._controller.config.json.startAnimationTime * num / 2 / 1 //  (cc.game.getFrameRate() / 60)
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

    this.checkGenerateProp(this._score.chain).then(function () {
      var self = _this4;
      var canFall = 0; //从每一列的最下面一个开始往上判断
      //如果有空 就判断有几个空 然后让最上方的方块掉落下来

      for (var j = _this4.rowNum - 1; j >= 0; j--) {
        canFall = 0;

        for (var i = _this4.rowNum - 1; i >= 0; i--) {
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
            width: _this4.blockWidth,
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

    this._controller.pageManager.addPage(2);

    this._controller.pageManager.addPage(4);

    if (this._controller.social.node.active) {
      this._controller.social.closeBannerAdv();
    }
  },
  // todo 复活
  askRevive: function askRevive() {
    var _this5 = this;

    this._controller.pageManager.addPage(2);

    this._controller.pageManager.addPage(5);

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

    if (this._controller.social.node.active) {
      this._controller.social.onReviveButton(1);
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
    this._controller.pageManager.removePage(2);

    this.revivePage.active = false;
    this._status = 1;

    this._score.onRevive();
  },
  update: function update() {
    if (this.isRangeAction) {
      this.rangeSprite.fillRange -= 1 / 60;
    }
  },
  onSkipRevive: function onSkipRevive() {
    clearInterval(this.reviveTimer);
    this._controller.pageManager.pages[5].active = false;

    this._score.onGameOver(true);

    this.isRangeAction = false;
  },
  restart: function restart() {
    var _this6 = this;

    this._controller.pageManager.onOpenPage(1);

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
        width: _this7.blockWidth,
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
        this._score.tipBox.init(this._score, 1);

        this._score.addMult(color, pos);

        this._controller.musicManager.onDouble();

        for (var i = 0; i < this.rowNum; i++) {
          //行
          for (var j = 0; j < this.rowNum; j++) {
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
        this._score.tipBox.init(this._score, 2);

        this.node.runAction(AC.shackAction(0.1, 10));

        if (this._controller.social.node.active) {
          this._controller.social.onShakePhone();
        }

        this.isPropChain = true;

        this._controller.musicManager.onBoom();

        for (var _i = 0; _i < this.rowNum; _i++) {
          //行
          for (var _j = 0; _j < this.rowNum; _j++) {
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
        this._score.tipBox.init(this._score, 4);

        this._controller.musicManager.onDouble();

        for (var _i2 = 0; _i2 < this.rowNum; _i2++) {
          //行
          for (var _j2 = 0; _j2 < this.rowNum; _j2++) {
            //列
            if (this.map[_i2][_j2] && this.map[_i2][_j2].getComponent('element')._status == 1) {
              var _distance = Math.sqrt(Math.pow(pos.x - this.map[_i2][_j2].x, 2) + Math.pow(pos.y - this.map[_i2][_j2].y, 2));

              if (_distance != 0) {
                this.map[_i2][_j2].getComponent('element').surfaceAction(_distance);
              }
            }
          }
        }

        this._score.onStep(3).then();

        break;

      case 4:
        // : 消除全部单身的方块
        this._score.tipBox.init(this._score, 5);

        this.isPropChain = true;

        this._controller.musicManager.onMagic();

        for (var _i3 = 0; _i3 < this.rowNum; _i3++) {
          //行
          for (var _j3 = 0; _j3 < this.rowNum; _j3++) {
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
  generatePool: function generatePool() {
    this.blockPool = new cc.NodePool();

    for (var i = 0; i < Math.pow(this.rowNum, 2); i++) {
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
    block.getComponent('element').init(self, data, this.blockWidth, itemType, pos);
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

        for (var _i4 = 0; _i4 < _this9.rowNum; _i4++) {
          for (var j = 0; j < _this9.rowNum; j++) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxnYW1lLmpzIl0sIm5hbWVzIjpbIkFDIiwicmVxdWlyZSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiX3N0YXR1cyIsImJsb2NrUHJlZmFiIiwiUHJlZmFiIiwiYmxvY2tTcHJpdGUiLCJTcHJpdGVGcmFtZSIsIndhcm5pbmdTcHJpdGVGcmFtZSIsInByb3BTcHJpdGVGcmFtZSIsImNoZWNrTWdyIiwicmV2aXZlUGFnZSIsIk5vZGUiLCJzdGFydCIsImJpbmROb2RlIiwiZ2VuZXJhdGVQb29sIiwibG9hZFJlcyIsImluaXQiLCJjIiwiX2NvbnRyb2xsZXIiLCJfc2NvcmUiLCJzY29yZU1nciIsInJvd051bSIsImNvbmZpZyIsImpzb24iLCJnYXAiLCJhbmltYXRpb25TcGVlZCIsImJsb2NrV2lkdGgiLCJyZXZpdmVUaW1lciIsImJsb2Nrc0NvbnRhaW5lciIsIm5vZGUiLCJnZXRDaGlsZEJ5TmFtZSIsImdhbWVTdGFydCIsInJlY292ZXJ5QWxsQmxvY2tzIiwidGhlbiIsIm1hcFNldCIsInJlc3VsdCIsIm51bSIsIm1hcCIsIkFycmF5Iiwic2VsZiIsImEiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJiIiwiZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiaSIsImoiLCJpdGVtVHlwZSIsImluc3RhbnRpYXRlQmxvY2siLCJ4IiwieSIsIndpZHRoIiwic3RhcnRUaW1lIiwic3RhcnRBbmltYXRpb25UaW1lIiwic2V0VGltZW91dCIsImVsZW1lbnRDaGVjayIsImNoZWNrTmVlZEZhbGwiLCJjaGVja05lZWRGYWxsVGltZXIiLCJjbGVhclRpbWVvdXQiLCJvbkZhbGwiLCJjaGVja0dlbmVyYXRlUHJvcCIsImNoYWluIiwiY2FuRmFsbCIsImdldENvbXBvbmVudCIsImJsb2NrUG9vbCIsInB1dCIsInBsYXlGYWxsQWN0aW9uIiwiayIsImdhbWVPdmVyIiwicGFnZU1hbmFnZXIiLCJhZGRQYWdlIiwic29jaWFsIiwiYWN0aXZlIiwiY2xvc2VCYW5uZXJBZHYiLCJhc2tSZXZpdmUiLCJyYW5nZVNwcml0ZSIsIlNwcml0ZSIsImZpbGxSYW5nZSIsImlzUmFuZ2VBY3Rpb24iLCJudW1MYWJlbCIsIkxhYmVsIiwic3RyaW5nIiwiY2xlYXJJbnRlcnZhbCIsInNldEludGVydmFsIiwib25Ta2lwUmV2aXZlIiwib25SZXZpdmVCdXR0b24iLCJzaG93UmV2aXZlU3VjY2VzcyIsIm9uUmV2aXZlQ2VydGFpbkJ0biIsInJlbW92ZVBhZ2UiLCJvblJldml2ZSIsInVwZGF0ZSIsInBhZ2VzIiwib25HYW1lT3ZlciIsInJlc3RhcnQiLCJvbk9wZW5QYWdlIiwib25Vc2VyVG91Y2hlZCIsImlpZCIsImppZCIsImNvbG9yIiwid2FybmluZyIsInBvcyIsInRhcmdldCIsImdlbmVyYXRlUHJvcEl0ZW0iLCJ0eXBlIiwib25JdGVtIiwidGlwQm94IiwiYWRkTXVsdCIsIm11c2ljTWFuYWdlciIsIm9uRG91YmxlIiwiZGlzdGFuY2UiLCJzcXJ0IiwicG93Iiwic3VyZmFjZUFjdGlvbiIsInJ1bkFjdGlvbiIsInNoYWNrQWN0aW9uIiwib25TaGFrZVBob25lIiwiaXNQcm9wQ2hhaW4iLCJvbkJvb20iLCJvblRvdWNoZWQiLCJyb2NrQWN0aW9uIiwib25TdGVwIiwib25NYWdpYyIsImlzU2luZ2xlIiwiY29uc29sZSIsImxvZyIsIk5vZGVQb29sIiwiYmxvY2siLCJpbnN0YW50aWF0ZSIsImRhdGEiLCJwYXJlbnQiLCJzaXplIiwiZ2V0Iiwic2NhbGUiLCJjaGlsZHJlbiIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUlBLElBQUlBLEVBQUUsR0FBR0MsT0FBTyxDQUFDLFNBQUQsQ0FBaEI7O0FBQ0FDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBRVBDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxPQUFPLEVBQUUsQ0FEQztB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RyxVQUFwRCxFQUFnRXlCLFFBQWhFLEVBQTBFcUQsR0FBMUU7QUFDQSxXQUFPMEIsS0FBUDtBQUNELEdBMVZNO0FBMlZQO0FBQ0FsRyxFQUFBQSxpQkE1Vk8sK0JBNFZhO0FBQUE7O0FBQ2xCLFdBQU8sSUFBSWMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QyxVQUFJeUYsUUFBUSxHQUFHLE1BQUksQ0FBQzdHLGVBQUwsQ0FBcUI2RyxRQUFwQzs7QUFDQSxVQUFJQSxRQUFRLENBQUNDLE1BQVQsSUFBbUIsQ0FBdkIsRUFBMEI7QUFDeEIsWUFBSUEsTUFBTSxHQUFHRCxRQUFRLENBQUNDLE1BQXRCLENBRHdCLENBRXhCOztBQUNBLGFBQUssSUFBSXpGLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd5RixNQUFwQixFQUE0QnpGLENBQUMsRUFBN0IsRUFBaUM7QUFDL0IsVUFBQSxNQUFJLENBQUNtQixTQUFMLENBQWVDLEdBQWYsQ0FBbUJvRSxRQUFRLENBQUMsQ0FBRCxDQUEzQjtBQUNEOztBQUNELGFBQUssSUFBSXhGLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUcsTUFBSSxDQUFDNUIsTUFBekIsRUFBaUM0QixHQUFDLEVBQWxDLEVBQXNDO0FBQ3BDLGVBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxNQUFJLENBQUM3QixNQUF6QixFQUFpQzZCLENBQUMsRUFBbEMsRUFBc0M7QUFDcEMsWUFBQSxNQUFJLENBQUNiLEdBQUwsQ0FBU1ksR0FBVCxFQUFZQyxDQUFaLElBQWlCLElBQWpCO0FBQ0Q7QUFDRjtBQUNGOztBQUNESCxNQUFBQSxPQUFPLENBQUMsRUFBRCxDQUFQO0FBQ0QsS0FmTSxDQUFQO0FBZ0JEO0FBN1dNLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBoZXl1Y2hhbmdcbiAqIEBmaWxlIOa4uOaIj+aOp+WItlxuICovXG52YXIgQUMgPSByZXF1aXJlKCdHYW1lQWN0JylcbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgX3N0YXR1czogMCwgLy8wIOacquW8gOWniyAxIOa4uOaIj+W8gOWniyAyIOa4uOaIj+aaguWBnCAzIOa4uOaIj+e7k+adnyA0IOS4i+iQveeKtuaAgSA15peg5rOV6Kem5pG454q25oCBXG4gICAgYmxvY2tQcmVmYWI6IGNjLlByZWZhYixcbiAgICBibG9ja1Nwcml0ZTogW2NjLlNwcml0ZUZyYW1lXSwgLy90b2RvOiDmjaLmiJDliqjmgIHnlJ/miJAg5pqC5LiN5aSE55CGXG4gICAgd2FybmluZ1Nwcml0ZUZyYW1lOiBbY2MuU3ByaXRlRnJhbWVdLFxuICAgIHByb3BTcHJpdGVGcmFtZTogW2NjLlNwcml0ZUZyYW1lXSxcbiAgICBjaGVja01ncjogcmVxdWlyZShcImVsZW1lbnRDaGVja1wiKSxcbiAgICByZXZpdmVQYWdlOiBjYy5Ob2RlLFxuICB9LFxuICBzdGFydCgpIHtcbiAgICB0aGlzLmJpbmROb2RlKClcbiAgICB0aGlzLmdlbmVyYXRlUG9vbCgpXG4gICAgdGhpcy5sb2FkUmVzKClcbiAgfSxcbiAgbG9hZFJlcygpIHtcblxuICB9LFxuICBpbml0KGMpIHtcbiAgICB0aGlzLl9jb250cm9sbGVyID0gY1xuICAgIHRoaXMuX3Njb3JlID0gYy5zY29yZU1nclxuICAgIHRoaXMucm93TnVtID0gYy5jb25maWcuanNvbi5yb3dOdW1cbiAgICB0aGlzLmdhcCA9IGMuY29uZmlnLmpzb24uZ2FwXG4gICAgdGhpcy5hbmltYXRpb25TcGVlZCA9IGMuY29uZmlnLmpzb24uZ2FwXG4gICAgdGhpcy5ibG9ja1dpZHRoID0gKDczMCAtICh0aGlzLnJvd051bSArIDEpICogdGhpcy5nYXApIC8gdGhpcy5yb3dOdW1cbiAgICB0aGlzLnJldml2ZVRpbWVyID0gbnVsbFxuICAgIC8vY29uc29sZS5sb2codGhpcy5nYXApXG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLmJsb2NrV2lkdGgpXG4gIH0sXG4gIC8vIOWKqOaAgeiOt+WPlumcgOimgeWKqOaAgeaOp+WItueahOe7hOS7tlxuICBiaW5kTm9kZSgpIHtcbiAgICB0aGlzLmJsb2Nrc0NvbnRhaW5lciA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnbWFwJylcbiAgfSxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tIOa4uOaIj+aOp+WItiAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8g5ri45oiP5byA5aeLXG4gIGdhbWVTdGFydCgpIHtcbiAgICB0aGlzLnJlY292ZXJ5QWxsQmxvY2tzKCkudGhlbigpXG4gICAgdGhpcy5fc2NvcmUuaW5pdCh0aGlzKVxuICAgIHRoaXMubWFwU2V0KHRoaXMucm93TnVtKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCfmuLjmiI/nirbmgIHmlLnlj5gnLCByZXN1bHQpXG4gICAgICB0aGlzLl9zdGF0dXMgPSAxXG4gICAgfSlcblxuICB9LFxuICAvLyDliJ3lp4vljJblnLDlm75cbiAgbWFwU2V0KG51bSkge1xuICAgIHRoaXMubWFwID0gbmV3IEFycmF5KClcbiAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICAvLyDnlJ/miJDkuKTkuKrpmo/mnLrnmoTlr7nosaHmlbDnu4RcbiAgICBsZXQgYSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bSlcbiAgICBsZXQgYiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bSlcblxuICAgIGxldCBjID0gTWF0aC5mbG9vcigxICsgTWF0aC5yYW5kb20oKSAqIChudW0gLSAxKSkgLSAxXG4gICAgYSA9PSBjID8gYysrIDogJydcbiAgICBsZXQgZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bSlcblxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtOyBpKyspIHsgLy/ooYxcbiAgICAgICAgdGhpcy5tYXBbaV0gPSBuZXcgQXJyYXkoKVxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG51bTsgaisrKSB7IC8v5YiXXG4gICAgICAgICAgbGV0IGl0ZW1UeXBlID0gKGkgPT0gYSAmJiBqID09IGIpID8gMSA6IChpID09IGMgJiYgaiA9PSBkKSA/IDIgOiAwXG4gICAgICAgICAgc2VsZi5tYXBbaV1bal0gPSBzZWxmLmluc3RhbnRpYXRlQmxvY2soc2VsZiwge1xuICAgICAgICAgICAgeDogaixcbiAgICAgICAgICAgIHk6IGksXG4gICAgICAgICAgICB3aWR0aDogc2VsZi5ibG9ja1dpZHRoLFxuICAgICAgICAgICAgc3RhcnRUaW1lOiAoaSArIGogKyAxKSAqIHNlbGYuX2NvbnRyb2xsZXIuY29uZmlnLmpzb24uc3RhcnRBbmltYXRpb25UaW1lIC8gbnVtICogMlxuICAgICAgICAgIH0sIHNlbGYuYmxvY2tzQ29udGFpbmVyLCBpdGVtVHlwZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5jaGVja01nci5pbml0KHRoaXMpXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKCcyMDAgT0snKTtcbiAgICAgICAgICB0aGlzLmNoZWNrTWdyLmVsZW1lbnRDaGVjayh0aGlzKVxuICAgICAgICB9LCBzZWxmLl9jb250cm9sbGVyLmNvbmZpZy5qc29uLnN0YXJ0QW5pbWF0aW9uVGltZSAqIG51bSAvIDIgLyAxXG4gICAgICAgIC8vICAoY2MuZ2FtZS5nZXRGcmFtZVJhdGUoKSAvIDYwKVxuICAgICAgKVxuICAgIH0pXG4gIH0sXG4gIC8v6Ziy5oqW5YqoIOWIpOaWreaYr+WQpumcgOimgeajgOa1i+S4i+iQvVxuICBjaGVja05lZWRGYWxsKCkge1xuICAgIGlmICh0aGlzLmNoZWNrTmVlZEZhbGxUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuY2hlY2tOZWVkRmFsbFRpbWVyKVxuICAgIH1cbiAgICB0aGlzLmNoZWNrTmVlZEZhbGxUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fc3RhdHVzID09IDUpIHtcbiAgICAgICAgICB0aGlzLl9zdGF0dXMgPSA0XG4gICAgICAgICAgdGhpcy5vbkZhbGwoKVxuICAgICAgICB9XG4gICAgICB9LCAzMDAgLyAxXG4gICAgICAvLyAoY2MuZ2FtZS5nZXRGcmFtZVJhdGUoKSAvIDYwKVxuICAgIClcbiAgfSxcbiAgLy/mlrnlnZfkuIvokL1cbiAgb25GYWxsKCkge1xuICAgIHRoaXMuY2hlY2tHZW5lcmF0ZVByb3AodGhpcy5fc2NvcmUuY2hhaW4pLnRoZW4oKCkgPT4ge1xuICAgICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgICBsZXQgY2FuRmFsbCA9IDBcbiAgICAgIC8v5LuO5q+P5LiA5YiX55qE5pyA5LiL6Z2i5LiA5Liq5byA5aeL5b6A5LiK5Yik5patXG4gICAgICAvL+WmguaenOacieepuiDlsLHliKTmlq3mnInlh6DkuKrnqbog54S25ZCO6K6p5pyA5LiK5pa555qE5pa55Z2X5o6J6JC95LiL5p2lXG4gICAgICBmb3IgKGxldCBqID0gdGhpcy5yb3dOdW0gLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgICBjYW5GYWxsID0gMFxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5yb3dOdW0gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmICh0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5fc3RhdHVzID09IDIpIHtcbiAgICAgICAgICAgIHRoaXMuYmxvY2tQb29sLnB1dCh0aGlzLm1hcFtpXVtqXSlcbiAgICAgICAgICAgIHRoaXMubWFwW2ldW2pdID0gbnVsbFxuICAgICAgICAgICAgY2FuRmFsbCsrXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjYW5GYWxsICE9IDApIHtcbiAgICAgICAgICAgICAgdGhpcy5tYXBbaSArIGNhbkZhbGxdW2pdID0gdGhpcy5tYXBbaV1bal1cbiAgICAgICAgICAgICAgdGhpcy5tYXBbaV1bal0gPSBudWxsXG4gICAgICAgICAgICAgIHRoaXMubWFwW2kgKyBjYW5GYWxsXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5wbGF5RmFsbEFjdGlvbihjYW5GYWxsLCB7XG4gICAgICAgICAgICAgICAgeDogaixcbiAgICAgICAgICAgICAgICB5OiBpICsgY2FuRmFsbCxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBjYW5GYWxsOyBrKyspIHtcbiAgICAgICAgICB0aGlzLm1hcFtrXVtqXSA9IHRoaXMuaW5zdGFudGlhdGVCbG9jayh0aGlzLCB7XG4gICAgICAgICAgICB4OiBqLFxuICAgICAgICAgICAgeTogayxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmJsb2NrV2lkdGgsXG4gICAgICAgICAgICBzdGFydFRpbWU6IG51bGxcbiAgICAgICAgICB9LCB0aGlzLmJsb2Nrc0NvbnRhaW5lciwgJycsIHtcbiAgICAgICAgICAgIHg6IGosXG4gICAgICAgICAgICB5OiAtY2FuRmFsbCArIGtcbiAgICAgICAgICB9KVxuICAgICAgICAgIHRoaXMubWFwW2tdW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLnBsYXlGYWxsQWN0aW9uKGNhbkZhbGwsIG51bGwpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmNoZWNrTWdyLmluaXQodGhpcylcbiAgICAgICAgdGhpcy5jaGVja01nci5lbGVtZW50Q2hlY2sodGhpcylcbiAgICAgICAgdGhpcy5fc3RhdHVzID0gMVxuICAgICAgfSwgMjUwKVxuICAgIH0pXG4gIH0sXG4gIGdhbWVPdmVyKCkge1xuICAgIHRoaXMuX3N0YXR1cyA9IDNcbiAgICB0aGlzLl9jb250cm9sbGVyLnBhZ2VNYW5hZ2VyLmFkZFBhZ2UoMilcbiAgICB0aGlzLl9jb250cm9sbGVyLnBhZ2VNYW5hZ2VyLmFkZFBhZ2UoNClcbiAgICBpZiAodGhpcy5fY29udHJvbGxlci5zb2NpYWwubm9kZS5hY3RpdmUpIHtcbiAgICAgIHRoaXMuX2NvbnRyb2xsZXIuc29jaWFsLmNsb3NlQmFubmVyQWR2KClcbiAgICB9XG4gIH0sXG4gIC8vIHRvZG8g5aSN5rS7XG4gIGFza1Jldml2ZSgpIHtcbiAgICB0aGlzLl9jb250cm9sbGVyLnBhZ2VNYW5hZ2VyLmFkZFBhZ2UoMilcbiAgICB0aGlzLl9jb250cm9sbGVyLnBhZ2VNYW5hZ2VyLmFkZFBhZ2UoNSlcbiAgICB0aGlzLnJldml2ZVBhZ2UuYWN0aXZlID0gdHJ1ZVxuICAgIHRoaXMucmV2aXZlUGFnZS5nZXRDaGlsZEJ5TmFtZSgnYXNrUmV2aXZlJykuYWN0aXZlID0gdHJ1ZVxuICAgIHRoaXMucmV2aXZlUGFnZS5nZXRDaGlsZEJ5TmFtZSgnc3VjY2Vzc1Jldml2ZScpLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5yYW5nZVNwcml0ZSA9IHRoaXMucmV2aXZlUGFnZS5nZXRDaGlsZEJ5TmFtZSgnYXNrUmV2aXZlJykuZ2V0Q2hpbGRCeU5hbWUoJ251bUJnJykuZ2V0Q2hpbGRCeU5hbWUoJ3Nwcml0ZScpLmdldENvbXBvbmVudChjYy5TcHJpdGUpXG4gICAgdGhpcy5yYW5nZVNwcml0ZS5maWxsUmFuZ2UgPSAxXG4gICAgdGhpcy5pc1JhbmdlQWN0aW9uID0gdHJ1ZVxuICAgIGxldCBudW1MYWJlbCA9IHRoaXMucmV2aXZlUGFnZS5nZXRDaGlsZEJ5TmFtZSgnYXNrUmV2aXZlJykuZ2V0Q2hpbGRCeU5hbWUoJ251bUJnJykuZ2V0Q2hpbGRCeU5hbWUoJ251bScpLmdldENvbXBvbmVudChjYy5MYWJlbClcbiAgICBudW1MYWJlbC5zdHJpbmcgPSA5XG4gICAgaWYgKHRoaXMucmV2aXZlVGltZXIpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5yZXZpdmVUaW1lcilcbiAgICB9XG4gICAgdGhpcy5yZXZpdmVUaW1lciA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGlmICgrbnVtTGFiZWwuc3RyaW5nID4gMCkge1xuICAgICAgICBudW1MYWJlbC5zdHJpbmctLVxuICAgICAgICB0aGlzLnJhbmdlU3ByaXRlLmZpbGxSYW5nZSA9IDFcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub25Ta2lwUmV2aXZlKClcbiAgICAgIH1cbiAgICB9LCAxMDAwKVxuXG4gIH0sXG4gIG9uUmV2aXZlQnV0dG9uKCkge1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5yZXZpdmVUaW1lcilcbiAgICB0aGlzLmlzUmFuZ2VBY3Rpb24gPSBmYWxzZVxuICAgIGlmICh0aGlzLl9jb250cm9sbGVyLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5fY29udHJvbGxlci5zb2NpYWwub25SZXZpdmVCdXR0b24oMSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaG93UmV2aXZlU3VjY2VzcygpXG4gICAgfVxuICB9LFxuICBzaG93UmV2aXZlU3VjY2VzcygpIHtcbiAgICAvL2NvbnNvbGUubG9nKCfmiZPlvIDlpI3mtLvmiJDlip/pobXpnaInKVxuICAgIHRoaXMucmV2aXZlUGFnZS5nZXRDaGlsZEJ5TmFtZSgnYXNrUmV2aXZlJykuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLnJldml2ZVBhZ2UuZ2V0Q2hpbGRCeU5hbWUoJ3N1Y2Nlc3NSZXZpdmUnKS5hY3RpdmUgPSB0cnVlXG4gIH0sXG4gIG9uUmV2aXZlQ2VydGFpbkJ0bigpIHtcbiAgICB0aGlzLl9jb250cm9sbGVyLnBhZ2VNYW5hZ2VyLnJlbW92ZVBhZ2UoMilcbiAgICB0aGlzLnJldml2ZVBhZ2UuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLl9zdGF0dXMgPSAxXG4gICAgdGhpcy5fc2NvcmUub25SZXZpdmUoKVxuICB9LFxuICB1cGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuaXNSYW5nZUFjdGlvbikge1xuICAgICAgdGhpcy5yYW5nZVNwcml0ZS5maWxsUmFuZ2UgLT0gMSAvIDYwXG4gICAgfVxuICB9LFxuICBvblNraXBSZXZpdmUoKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnJldml2ZVRpbWVyKVxuICAgIHRoaXMuX2NvbnRyb2xsZXIucGFnZU1hbmFnZXIucGFnZXNbNV0uYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLl9zY29yZS5vbkdhbWVPdmVyKHRydWUpXG4gICAgdGhpcy5pc1JhbmdlQWN0aW9uID0gZmFsc2VcbiAgfSxcbiAgcmVzdGFydCgpIHtcbiAgICB0aGlzLl9jb250cm9sbGVyLnBhZ2VNYW5hZ2VyLm9uT3BlblBhZ2UoMSlcbiAgICB0aGlzLnJlY292ZXJ5QWxsQmxvY2tzKCkudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLmdhbWVTdGFydCgpXG4gICAgfSlcbiAgfSxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS3pgZPlhbfnm7jlhbMtLS0tLS0tLS0tLS0tLS1cbiAgLy8g5YKo5a2Y55So5oi354K55Ye75pe255qE5pa55Z2XIOeUqOS6jueUn+aIkOmBk+WFt1xuICBvblVzZXJUb3VjaGVkKGlpZCwgamlkLCBpdGVtVHlwZSwgY29sb3IsIHdhcm5pbmcsIHBvcykge1xuICAgIHRoaXMudGFyZ2V0ID0ge1xuICAgICAgaTogaWlkLFxuICAgICAgajogamlkLFxuICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgaXRlbVR5cGU6IGl0ZW1UeXBlLFxuICAgICAgeDogcG9zLngsXG4gICAgICB5OiBwb3MueSxcbiAgICAgIHdhcm5pbmc6IHdhcm5pbmdcbiAgICB9XG4gIH0sXG4gIC8vIOeUn+aIkOmBk+WFtyB0eXBlIDHkuLrlj4zlgI3lgI3mlbAgMuS4uueCuOW8uSAz5Li65Yqg5LqU55m+XG4gIGdlbmVyYXRlUHJvcEl0ZW0odHlwZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyDmmK/lkKblgZrpgZPlhbfnlJ/miJDliqjnlLtcbiAgICAgIHRoaXMubWFwW3RoaXMudGFyZ2V0LmldW3RoaXMudGFyZ2V0LmpdID0gdGhpcy5pbnN0YW50aWF0ZUJsb2NrKHRoaXMsIHtcbiAgICAgICAgeDogdGhpcy50YXJnZXQuaixcbiAgICAgICAgeTogdGhpcy50YXJnZXQuaSxcbiAgICAgICAgY29sb3I6IHRoaXMudGFyZ2V0LmNvbG9yLFxuICAgICAgICB3aWR0aDogdGhpcy5ibG9ja1dpZHRoLFxuICAgICAgICBzdGFydFRpbWU6IG51bGxcbiAgICAgIH0sIHRoaXMuYmxvY2tzQ29udGFpbmVyLCB0eXBlKVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSwgMzAwKVxuICAgIH0pXG4gIH0sXG4gIGNoZWNrR2VuZXJhdGVQcm9wKGNoYWluKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICh0aGlzLnRhcmdldC53YXJuaW5nKSB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVQcm9wSXRlbSh0aGlzLnRhcmdldC53YXJuaW5nKS50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHJlc29sdmUoKVxuICAgIH0pXG4gIH0sXG4gIG9uSXRlbSh0eXBlLCBjb2xvciwgcG9zKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIC8vIOWIhuaVsOe/u+WAjSDmnIDpq5jlhavlgI1cbiAgICAgICAgdGhpcy5fc2NvcmUudGlwQm94LmluaXQodGhpcy5fc2NvcmUsIDEpXG4gICAgICAgIHRoaXMuX3Njb3JlLmFkZE11bHQoY29sb3IsIHBvcylcbiAgICAgICAgdGhpcy5fY29udHJvbGxlci5tdXNpY01hbmFnZXIub25Eb3VibGUoKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93TnVtOyBpKyspIHsgLy/ooYxcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMucm93TnVtOyBqKyspIHsgLy/liJdcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcFtpXVtqXSAmJiB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5fc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgbGV0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvcy54IC0gdGhpcy5tYXBbaV1bal0ueCwgMikgKyBNYXRoLnBvdyhwb3MueSAtIHRoaXMubWFwW2ldW2pdLnksIDIpKVxuICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgIT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLnN1cmZhY2VBY3Rpb24oZGlzdGFuY2UpXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICAvLyDngrjlvLkg5raI6Zmk5ZCM56eN6aKc6Imy55qEXG4gICAgICAgIHRoaXMuX3Njb3JlLnRpcEJveC5pbml0KHRoaXMuX3Njb3JlLCAyKVxuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKEFDLnNoYWNrQWN0aW9uKDAuMSwgMTApKVxuICAgICAgICBpZiAodGhpcy5fY29udHJvbGxlci5zb2NpYWwubm9kZS5hY3RpdmUpIHtcbiAgICAgICAgICB0aGlzLl9jb250cm9sbGVyLnNvY2lhbC5vblNoYWtlUGhvbmUoKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNQcm9wQ2hhaW4gPSB0cnVlXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXIubXVzaWNNYW5hZ2VyLm9uQm9vbSgpXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dOdW07IGkrKykgeyAvL+ihjFxuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5yb3dOdW07IGorKykgeyAvL+WIl1xuICAgICAgICAgICAgaWYgKHRoaXMubWFwW2ldW2pdICYmIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yID09IGNvbG9yICYmIHRoaXMubWFwW2ldW2pdICYmIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLl9zdGF0dXMgIT0gMikge1xuICAgICAgICAgICAgICB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5vblRvdWNoZWQoY29sb3IsIGZhbHNlLCB0cnVlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMubWFwW2ldW2pdLnJ1bkFjdGlvbihBQy5yb2NrQWN0aW9uKDAuMiwgMTApKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAzOiAvLzogIOWKoOatpeaVsFxuICAgICAgICB0aGlzLl9zY29yZS50aXBCb3guaW5pdCh0aGlzLl9zY29yZSwgNClcbiAgICAgICAgdGhpcy5fY29udHJvbGxlci5tdXNpY01hbmFnZXIub25Eb3VibGUoKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93TnVtOyBpKyspIHsgLy/ooYxcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMucm93TnVtOyBqKyspIHsgLy/liJdcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcFtpXVtqXSAmJiB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5fc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgbGV0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvcy54IC0gdGhpcy5tYXBbaV1bal0ueCwgMikgKyBNYXRoLnBvdyhwb3MueSAtIHRoaXMubWFwW2ldW2pdLnksIDIpKVxuICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgIT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLnN1cmZhY2VBY3Rpb24oZGlzdGFuY2UpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2NvcmUub25TdGVwKDMpLnRoZW4oKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDogLy8gOiDmtojpmaTlhajpg6jljZXouqvnmoTmlrnlnZdcbiAgICAgICAgdGhpcy5fc2NvcmUudGlwQm94LmluaXQodGhpcy5fc2NvcmUsIDUpXG4gICAgICAgIHRoaXMuaXNQcm9wQ2hhaW4gPSB0cnVlXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXIubXVzaWNNYW5hZ2VyLm9uTWFnaWMoKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93TnVtOyBpKyspIHsgLy/ooYxcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMucm93TnVtOyBqKyspIHsgLy/liJdcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcFtpXVtqXSAmJiB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5pc1NpbmdsZSAmJiB0aGlzLm1hcFtpXVtqXSAmJiB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5fc3RhdHVzICE9IDIpIHtcbiAgICAgICAgICAgICAgbGV0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvcy54IC0gdGhpcy5tYXBbaV1bal0ueCwgMikgKyBNYXRoLnBvdyhwb3MueSAtIHRoaXMubWFwW2ldW2pdLnksIDIpKVxuICAgICAgICAgICAgICB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5vblRvdWNoZWQoY29sb3IsIGZhbHNlLCB0cnVlLCBkaXN0YW5jZSlcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLprZTms5Xmo5Lop6blj5HnmoTngrlcIiwgaSxqLHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yLCB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5pc1NpbmdsZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9LFxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLSDpooTliLbkvZPlrp7kvovljJYtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8g55Sf5oiQ5a+56LGh5rGgXG4gIGdlbmVyYXRlUG9vbCgpIHtcbiAgICB0aGlzLmJsb2NrUG9vbCA9IG5ldyBjYy5Ob2RlUG9vbCgpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLnBvdyh0aGlzLnJvd051bSwgMik7IGkrKykge1xuICAgICAgbGV0IGJsb2NrID0gY2MuaW5zdGFudGlhdGUodGhpcy5ibG9ja1ByZWZhYilcbiAgICAgIHRoaXMuYmxvY2tQb29sLnB1dChibG9jaylcbiAgICB9XG4gIH0sXG4gIC8vIOWunuS+i+WMluWNleS4quaWueWdl1xuICBpbnN0YW50aWF0ZUJsb2NrKHNlbGYsIGRhdGEsIHBhcmVudCwgaXRlbVR5cGUsIHBvcykge1xuICAgIGl0ZW1UeXBlID0gaXRlbVR5cGUgPyBpdGVtVHlwZSA6IDBcbiAgICBpZiAoaXRlbVR5cGUgIT0gMCkge1xuICAgICAgLy8gY29uc29sZS5sb2coXCLpgZPlhbfoioLngrnmlbDmja5cIiwgZGF0YSwgaXRlbVR5cGUpXG4gICAgfVxuICAgIGxldCBibG9jayA9IG51bGxcbiAgICBpZiAoc2VsZi5ibG9ja1Bvb2wgJiYgc2VsZi5ibG9ja1Bvb2wuc2l6ZSgpID4gMCkge1xuICAgICAgYmxvY2sgPSBzZWxmLmJsb2NrUG9vbC5nZXQoKVxuICAgIH0gZWxzZSB7XG4gICAgICBibG9jayA9IGNjLmluc3RhbnRpYXRlKHNlbGYuYmxvY2tQcmVmYWIpXG4gICAgfVxuICAgIGJsb2NrLnBhcmVudCA9IHBhcmVudFxuICAgIGJsb2NrLnNjYWxlID0gMVxuICAgIGJsb2NrLnggPSAwXG4gICAgYmxvY2sueSA9IDBcbiAgICBibG9jay5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5pbml0KHNlbGYsIGRhdGEsIHRoaXMuYmxvY2tXaWR0aCwgaXRlbVR5cGUsIHBvcylcbiAgICByZXR1cm4gYmxvY2tcbiAgfSxcbiAgLy8g5Zue5pS25omA5pyJ6IqC54K5XG4gIHJlY292ZXJ5QWxsQmxvY2tzKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLmJsb2Nrc0NvbnRhaW5lci5jaGlsZHJlblxuICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgIGxldCBsZW5ndGggPSBjaGlsZHJlbi5sZW5ndGhcbiAgICAgICAgLy8gICBjb25zb2xlLmxvZyhsZW5ndGgpXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0aGlzLmJsb2NrUG9vbC5wdXQoY2hpbGRyZW5bMF0pXG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd051bTsgaSsrKSB7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLnJvd051bTsgaisrKSB7XG4gICAgICAgICAgICB0aGlzLm1hcFtpXVtqXSA9IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlc29sdmUoJycpXG4gICAgfSlcbiAgfSxcblxufSk7Il19
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
    this._controller = g._controller;
    this.score = 0;
    this.leftStep = this._controller.config.json.originStep;
    this.chain = 1;
    this.level = 1;
    this.reviveTime = 0;
    this.closeMultLabel();
    this.levelData = g._controller.gameData.json.levelData;
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

    if (this._controller.social.node.active) {
      var height = this._controller.social.getHighestLevel();

      if (height) {
        this.onStep(this.levelData[+height - 1].giftStep);
      }
    }
  },
  start: function start() {
    this.generatePool();
    this.bindNode();
  },
  generatePool: function generatePool() {
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
    scoreParticle.getComponent('scoreParticle').init(self, pos, this._controller.config.json.scoreParticleTime);
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

    score = score || this._controller.config.json.scoreBase; // 一次消除可以叠chain

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
    var addScore = score == this._controller.config.json.scoreBase ? score + (this.chain > 16 ? 16 : this.chain - 1) * 10 : score; // let addScore = score == 10 ? score * (this.chain > 10 ? 10 : this.chain) : score

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
      var config = _this3._controller.config.json.chainConfig;

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
    if (this.multiple < this._controller.config.json.maxMultiple) {
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
    this._controller.pageManager.addPage(2);

    this._controller.pageManager.addPage(3);

    this._controller.musicManager.onWin();

    this.successDialog.init(this, this.level, this.levelData, this.score); //升级之后的等级

    this.characterMgr.onLevelUp();
    this.characterMgr.onSuccessDialog(this.level);
    this._game._status = 2;

    if (this._controller.social.node.active) {
      this._controller.social.openBannerAdv();
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

    this._controller.pageManager.onOpenPage(1);

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

      if (this._controller.social.node.active) {
        // 仅上传分数
        this._controller.social.onGameOver(this.level, this.score);
      }
    } else if (!isTrue) {
      this._game.askRevive();
    }
  },
  onDoubleStepBtn: function onDoubleStepBtn() {
    if (this._controller.social.node.active) {
      this._controller.social.onReviveButton(0);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzY29yZS5qcyJdLCJuYW1lcyI6WyJBQyIsInJlcXVpcmUiLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInNjb3JlUHJlZmFiIiwiUHJlZmFiIiwic2NvcmVQYXJ0aWNsZVByZWZhYiIsIm1haW5TY29yZUxhYmVsIiwiTGFiZWwiLCJzdWNjZXNzRGlhbG9nIiwiY2hhcmFjdGVyTWdyIiwiZmFpbERpYWxvZyIsIk5vZGUiLCJtdWx0UHJvcFByZWZhYiIsImNoYWluU3ByaXRlRnJhbWVBcnIiLCJTcHJpdGVGcmFtZSIsInN0ZXBBbmlMYWJlbCIsInRpcEJveCIsImluaXQiLCJnIiwiX2dhbWUiLCJfY29udHJvbGxlciIsInNjb3JlIiwibGVmdFN0ZXAiLCJjb25maWciLCJqc29uIiwib3JpZ2luU3RlcCIsImNoYWluIiwibGV2ZWwiLCJyZXZpdmVUaW1lIiwiY2xvc2VNdWx0TGFiZWwiLCJsZXZlbERhdGEiLCJnYW1lRGF0YSIsIm5hbWVMYWJlbCIsInN0cmluZyIsInByb2dyZXNzQmFyIiwibGVmdFN0ZXBMYWJlbCIsIm5vZGUiLCJydW5BY3Rpb24iLCJoaWRlIiwic2NvcmVUaW1lciIsImN1cnJlbnRBZGRlZFNjb3JlIiwiYWN0aXZlIiwic2hvd0hlcm9DaGFyYWN0ZXIiLCJoaWRlQ2hhaW5TcHJpdGUiLCJzb2NpYWwiLCJoZWlnaHQiLCJnZXRIaWdoZXN0TGV2ZWwiLCJvblN0ZXAiLCJnaWZ0U3RlcCIsInN0YXJ0IiwiZ2VuZXJhdGVQb29sIiwiYmluZE5vZGUiLCJzY29yZVBvb2wiLCJOb2RlUG9vbCIsImkiLCJpbnN0YW50aWF0ZSIsInB1dCIsInNjb3JlUGFydGljbGVQb29sIiwic2NvcmVQYXJ0aWNsZSIsIm11bHRQcm9wUG9vbCIsIm11bHRQcm9wIiwiaW5zdGFudGlhdGVTY29yZSIsInNlbGYiLCJudW0iLCJwb3MiLCJzaXplIiwiZ2V0IiwicGFyZW50Iiwic2NvcmVDb250YWluZXIiLCJnZXRDb21wb25lbnQiLCJzY29yZVBhcnRpY2xlVGltZSIsImdldENoaWxkQnlOYW1lIiwibXVsdExhYmVsIiwiY2hhaW5TcHJpdGUiLCJTcHJpdGUiLCJmYWlsU2NvcmUiLCJmYWlsTmFtZSIsImZhaWxTcHJpdGUiLCJmYWlsSGlnaFNjb3JlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbkdhbWVPdmVyIiwic2hvd1N0ZXBBbmkiLCJhZGRTY29yZSIsInNjb3JlQmFzZSIsImNoYWluVGltZXIiLCJjbGVhclRpbWVvdXQiLCJpbml0Q3VycmVudFNjb3JlTGFiZWwiLCJzZXRUaW1lb3V0Iiwib25DdXJyZW50U2NvcmVMYWJlbCIsIngiLCJ5IiwiY2FsbEZ1bmMiLCJtdWx0aXBsZSIsImNoZWNrTGV2ZWxVcCIsImNoZWNrQ2hhaW4iLCJjaGVja0NoYWluVGltZXIiLCJjaGFpbkNvbmZpZyIsImxlbmd0aCIsIm1heCIsIm1pbiIsInNob3dDaGFpblNwcml0ZSIsImlkIiwic3ByaXRlRnJhbWUiLCJzY2FsZSIsInBvcE91dCIsImxldmVsTGltaXQiLCJvbkxldmVsVXAiLCJhZGRNdWx0IiwiY29sb3IiLCJtYXhNdWx0aXBsZSIsInNob3dNdWx0TGFiZWwiLCJjYWxsYmFjayIsImFjdGlvbiIsInNwYXduIiwibW92ZVRvIiwic2NhbGVUbyIsImVhc2luZyIsImVhc2VCYWNrT3V0Iiwic2VxIiwic2VxdWVuY2UiLCJwYWdlTWFuYWdlciIsImFkZFBhZ2UiLCJtdXNpY01hbmFnZXIiLCJvbldpbiIsIm9uU3VjY2Vzc0RpYWxvZyIsIl9zdGF0dXMiLCJvcGVuQmFubmVyQWR2IiwiaGlkZU5leHRMZXZlbERhdGEiLCJvbkxldmVsVXBCdXR0b24iLCJkb3VibGUiLCJjb25zb2xlIiwibG9nIiwiaXNMZXZlbFVwIiwiY3VycmVudFRhcmdldCIsIm9uT3BlblBhZ2UiLCJzdGVwIiwib25MZXZlbFVwQnRuIiwibmFtZSIsInRoZW4iLCJzaG93TmV4dExldmVsRGF0YSIsInRvZ2dsZVZpc2liaWxpdHkiLCJtb3ZlQnkiLCJpc1RydWUiLCJnYW1lT3ZlciIsInVwZGF0ZUZhaWxQYWdlIiwiYXNrUmV2aXZlIiwib25Eb3VibGVTdGVwQnRuIiwib25SZXZpdmVCdXR0b24iLCJvbkRvdWJsZVN0ZXAiLCJvblJldml2ZSIsIm5leHRMZXZlbERhdGEiLCJvbkZhaWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFJQSxJQUFJQSxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxTQUFELENBQWhCOztBQUVBQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUVQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsV0FBVyxFQUFFSixFQUFFLENBQUNLLE1BRE47QUFFVkMsSUFBQUEsbUJBQW1CLEVBQUVOLEVBQUUsQ0FBQ0ssTUFGZDtBQUdWRSxJQUFBQSxjQUFjLEVBQUVQLEVBQUUsQ0FBQ1EsS0FIVDtBQUlWQyxJQUFBQSxhQUFhLEVBQUVWLE9BQU8sQ0FBQyxlQUFELENBSlo7QUFLVlcsSUFBQUEsWUFBWSxFQUFFWCxPQUFPLENBQUMsV0FBRCxDQUxYO0FBTVZZLElBQUFBLFVBQVUsRUFBRVgsRUFBRSxDQUFDWSxJQU5MO0FBT1ZDLElBQUFBLGNBQWMsRUFBRWIsRUFBRSxDQUFDSyxNQVBUO0FBUVY7QUFDQTtBQUNBUyxJQUFBQSxtQkFBbUIsRUFBRSxDQUFDZCxFQUFFLENBQUNlLFdBQUosQ0FWWDtBQVdWQyxJQUFBQSxZQUFZLEVBQUVoQixFQUFFLENBQUNRLEtBWFA7QUFhVjtBQUNBUyxJQUFBQSxNQUFNLEVBQUVsQixPQUFPLENBQUMsUUFBRDtBQWRMLEdBRkw7QUFrQlBtQixFQUFBQSxJQWxCTyxnQkFrQkZDLENBbEJFLEVBa0JDO0FBQ04sU0FBS0MsS0FBTCxHQUFhRCxDQUFiO0FBQ0EsU0FBS0UsV0FBTCxHQUFtQkYsQ0FBQyxDQUFDRSxXQUFyQjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxDQUFiO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixLQUFLRixXQUFM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QUNEO0FBQ0YsR0EvU007QUFnVFBDLEVBQUFBLGVBaFRPLDZCQWdUVztBQUNoQixRQUFJLEtBQUtoSSxXQUFMLENBQWlCd0IsTUFBakIsQ0FBd0JSLElBQXhCLENBQTZCSyxNQUFqQyxFQUF5QztBQUN2QyxXQUFLckIsV0FBTCxDQUFpQndCLE1BQWpCLENBQXdCeUcsY0FBeEIsQ0FBdUMsQ0FBdkM7QUFDRCxLQUZELE1BRU87QUFDTCxXQUFLbkIsZUFBTCxDQUFxQixDQUFyQjtBQUNEO0FBQ0YsR0F0VE07QUF1VFBvQixFQUFBQSxZQXZUTywwQkF1VFE7QUFDYixTQUFLcEIsZUFBTCxDQUFxQixDQUFyQjtBQUNELEdBelRNO0FBMFRQcUIsRUFBQUEsUUExVE8sc0JBMFRJO0FBQ1QsU0FBSzNILFVBQUwsSUFBbUIsQ0FBbkI7QUFDQSxTQUFLbUIsTUFBTCxDQUFZLENBQVosRUFBZTZGLElBQWY7QUFDRCxHQTdUTTtBQThUUDtBQUNBQyxFQUFBQSxpQkEvVE8sK0JBK1RhO0FBQ2xCLFFBQUlXLGFBQWEsR0FBRyxLQUFLMUgsU0FBTCxDQUFlLEtBQUtILEtBQXBCLENBQXBCO0FBQ0QsR0FqVU07QUFrVVA7QUFDQXNHLEVBQUFBLGlCQW5VTywrQkFtVWEsQ0FFbkIsQ0FyVU07QUFzVVBpQixFQUFBQSxjQXRVTyw0QkFzVVU7QUFDZixTQUFLdkUsU0FBTCxDQUFlMUMsTUFBZixHQUF3QixPQUFPLEtBQUtaLEtBQUwsR0FBYSxFQUFwQixDQUF4QjtBQUNBLFNBQUtaLFlBQUwsQ0FBa0JnSixNQUFsQixDQUF5QixLQUFLOUgsS0FBOUI7QUFDQSxTQUFLaUQsUUFBTCxDQUFjM0MsTUFBZCxHQUF1QixLQUFLSCxTQUFMLENBQWUsS0FBS0gsS0FBTCxHQUFhLENBQTVCLEVBQStCZ0gsSUFBdEQsQ0FIZSxDQUlmO0FBQ0Q7QUEzVU0sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAYXV0aG9yIGhleXVjaGFuZ1xuICogQGZpbGUgIFVJIOWIhuaVsOaOp+WItuWZqFxuICovXG52YXIgQUMgPSByZXF1aXJlKCdHYW1lQWN0JylcblxuY2MuQ2xhc3Moe1xuICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBzY29yZVByZWZhYjogY2MuUHJlZmFiLFxuICAgIHNjb3JlUGFydGljbGVQcmVmYWI6IGNjLlByZWZhYixcbiAgICBtYWluU2NvcmVMYWJlbDogY2MuTGFiZWwsXG4gICAgc3VjY2Vzc0RpYWxvZzogcmVxdWlyZSgnc3VjY2Vzc0RpYWxvZycpLFxuICAgIGNoYXJhY3Rlck1ncjogcmVxdWlyZSgnY2hhcmFjdGVyJyksXG4gICAgZmFpbERpYWxvZzogY2MuTm9kZSxcbiAgICBtdWx0UHJvcFByZWZhYjogY2MuUHJlZmFiLFxuICAgIC8vIHByb2dyZXNzQmFyOiByZXF1aXJlKCdwcm9ncmVzcycpLFxuICAgIC8vIGxlZnRTdGVwTGFiZWw6IGNjLkxhYmVsLFxuICAgIGNoYWluU3ByaXRlRnJhbWVBcnI6IFtjYy5TcHJpdGVGcmFtZV0sXG4gICAgc3RlcEFuaUxhYmVsOiBjYy5MYWJlbCxcblxuICAgIC8v5o+Q56S65bCP5qGGXG4gICAgdGlwQm94OiByZXF1aXJlKCd0aXBCb3gnKVxuICB9LFxuICBpbml0KGcpIHtcbiAgICB0aGlzLl9nYW1lID0gZ1xuICAgIHRoaXMuX2NvbnRyb2xsZXIgPSBnLl9jb250cm9sbGVyXG4gICAgdGhpcy5zY29yZSA9IDBcbiAgICB0aGlzLmxlZnRTdGVwID0gdGhpcy5fY29udHJvbGxlci5jb25maWcuanNvbi5vcmlnaW5TdGVwXG4gICAgdGhpcy5jaGFpbiA9IDFcbiAgICB0aGlzLmxldmVsID0gMVxuICAgIHRoaXMucmV2aXZlVGltZSA9IDBcbiAgICB0aGlzLmNsb3NlTXVsdExhYmVsKClcbiAgICB0aGlzLmxldmVsRGF0YSA9IGcuX2NvbnRyb2xsZXIuZ2FtZURhdGEuanNvbi5sZXZlbERhdGFcbiAgICB0aGlzLm5hbWVMYWJlbC5zdHJpbmcgPSBcIuiQjOW/g+aCplwiXG4gICAgdGhpcy5wcm9ncmVzc0Jhci5pbml0KDAsIHRoaXMubGV2ZWxEYXRhW3RoaXMubGV2ZWwgLSAxXSwgdGhpcy5sZXZlbClcbiAgICB0aGlzLmxlZnRTdGVwTGFiZWwuc3RyaW5nID0gdGhpcy5sZWZ0U3RlcFxuICAgIHRoaXMuc3RlcEFuaUxhYmVsLm5vZGUucnVuQWN0aW9uKGNjLmhpZGUoKSlcbiAgICB0aGlzLnNjb3JlVGltZXIgPSBbXVxuICAgIHRoaXMuY3VycmVudEFkZGVkU2NvcmUgPSAwXG4gICAgdGhpcy5tYWluU2NvcmVMYWJlbC5ub2RlLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5jaGFyYWN0ZXJNZ3Iuc2hvd0hlcm9DaGFyYWN0ZXIodGhpcy5sZXZlbClcbiAgICB0aGlzLmhpZGVDaGFpblNwcml0ZSgpXG5cbiAgICB0aGlzLnRpcEJveC5pbml0KHRoaXMsIDApXG4gICAgaWYgKHRoaXMuX2NvbnRyb2xsZXIuc29jaWFsLm5vZGUuYWN0aXZlKSB7XG4gICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5fY29udHJvbGxlci5zb2NpYWwuZ2V0SGlnaGVzdExldmVsKClcbiAgICAgIGlmIChoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5vblN0ZXAodGhpcy5sZXZlbERhdGFbK2hlaWdodCAtIDFdLmdpZnRTdGVwKVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5nZW5lcmF0ZVBvb2woKVxuICAgIHRoaXMuYmluZE5vZGUoKVxuICB9LFxuICBnZW5lcmF0ZVBvb2woKSB7XG4gICAgdGhpcy5zY29yZVBvb2wgPSBuZXcgY2MuTm9kZVBvb2woKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjA7IGkrKykge1xuICAgICAgbGV0IHNjb3JlID0gY2MuaW5zdGFudGlhdGUodGhpcy5zY29yZVByZWZhYilcbiAgICAgIHRoaXMuc2NvcmVQb29sLnB1dChzY29yZSlcbiAgICB9XG4gICAgdGhpcy5zY29yZVBhcnRpY2xlUG9vbCA9IG5ldyBjYy5Ob2RlUG9vbCgpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDsgaSsrKSB7XG4gICAgICBsZXQgc2NvcmVQYXJ0aWNsZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc2NvcmVQYXJ0aWNsZVByZWZhYilcbiAgICAgIHRoaXMuc2NvcmVQYXJ0aWNsZVBvb2wucHV0KHNjb3JlUGFydGljbGUpXG4gICAgfVxuICAgIHRoaXMubXVsdFByb3BQb29sID0gbmV3IGNjLk5vZGVQb29sKClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgbGV0IG11bHRQcm9wID0gY2MuaW5zdGFudGlhdGUodGhpcy5tdWx0UHJvcFByZWZhYilcbiAgICAgIHRoaXMubXVsdFByb3BQb29sLnB1dChtdWx0UHJvcClcbiAgICB9XG4gIH0sXG4gIC8vIOWunuS+i+WMluWNleS4quaWueWdl1xuICBpbnN0YW50aWF0ZVNjb3JlKHNlbGYsIG51bSwgcG9zKSB7XG4gICAgbGV0IHNjb3JlID0gbnVsbFxuICAgIGlmIChzZWxmLnNjb3JlUG9vbCAmJiBzZWxmLnNjb3JlUG9vbC5zaXplKCkgPiAwKSB7XG4gICAgICBzY29yZSA9IHNlbGYuc2NvcmVQb29sLmdldCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHNjb3JlID0gY2MuaW5zdGFudGlhdGUoc2VsZi5zY29yZVByZWZhYilcbiAgICB9XG4gICAgc2NvcmUucGFyZW50ID0gdGhpcy5zY29yZUNvbnRhaW5lclxuICAgIHNjb3JlLmdldENvbXBvbmVudCgnc2NvcmVDZWxsJykuaW5pdChzZWxmLCBudW0sIHBvcylcblxuICAgIGxldCBzY29yZVBhcnRpY2xlID0gbnVsbFxuICAgIGlmIChzZWxmLnNjb3JlUGFydGljbGVQb29sICYmIHNlbGYuc2NvcmVQYXJ0aWNsZVBvb2wuc2l6ZSgpID4gMCkge1xuICAgICAgc2NvcmVQYXJ0aWNsZSA9IHNlbGYuc2NvcmVQYXJ0aWNsZVBvb2wuZ2V0KClcbiAgICB9IGVsc2Uge1xuICAgICAgc2NvcmVQYXJ0aWNsZSA9IGNjLmluc3RhbnRpYXRlKHNlbGYuc2NvcmVQYXJ0aWNsZVByZWZhYilcbiAgICB9XG4gICAgc2NvcmVQYXJ0aWNsZS5wYXJlbnQgPSB0aGlzLnNjb3JlQ29udGFpbmVyXG4gICAgc2NvcmVQYXJ0aWNsZS5nZXRDb21wb25lbnQoJ3Njb3JlUGFydGljbGUnKS5pbml0KHNlbGYsIHBvcywgdGhpcy5fY29udHJvbGxlci5jb25maWcuanNvbi5zY29yZVBhcnRpY2xlVGltZSlcbiAgfSxcbiAgYmluZE5vZGUoKSB7XG4gICAgdGhpcy5sZWZ0U3RlcExhYmVsID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdVSScpLmdldENoaWxkQnlOYW1lKCdsZWZ0U3RlcE5vZGUnKS5nZXRDaGlsZEJ5TmFtZSgnTGFiZWwnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpXG4gICAgdGhpcy5wcm9ncmVzc0JhciA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnVUknKS5nZXRDaGlsZEJ5TmFtZSgnc2NvcmVOb2RlJykuZ2V0Q2hpbGRCeU5hbWUoJ3Byb2dyZXNzQmFyJykuZ2V0Q29tcG9uZW50KCdwcm9ncmVzcycpXG4gICAgdGhpcy5zY29yZUNvbnRhaW5lciA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnVUknKS5nZXRDaGlsZEJ5TmFtZSgnc2NvcmVHcm91cCcpXG4gICAgdGhpcy5tdWx0TGFiZWwgPSB0aGlzLm1haW5TY29yZUxhYmVsLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ211bHQnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpXG4gICAgdGhpcy5uYW1lTGFiZWwgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ1VJJykuZ2V0Q2hpbGRCeU5hbWUoJ3Njb3JlTm9kZScpLmdldENoaWxkQnlOYW1lKCdwcm9ncmVzc0JhcicpLmdldENoaWxkQnlOYW1lKCduYW1lJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKVxuICAgIC8vIOWksei0peaXtuabtOaWsOWksei0pVVJXG4gICAgdGhpcy5jaGFpblNwcml0ZSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnVUknKS5nZXRDaGlsZEJ5TmFtZSgnY2hhaW5TcHJpdGUnKS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKVxuICAgIHRoaXMuZmFpbFNjb3JlID0gdGhpcy5mYWlsRGlhbG9nLmdldENoaWxkQnlOYW1lKCdpbmZvJykuZ2V0Q2hpbGRCeU5hbWUoJ3Njb3JlJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKVxuICAgIHRoaXMuZmFpbE5hbWUgPSB0aGlzLmZhaWxEaWFsb2cuZ2V0Q2hpbGRCeU5hbWUoJ2luZm8nKS5nZXRDaGlsZEJ5TmFtZSgnbGV2ZWwnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpXG4gICAgdGhpcy5mYWlsU3ByaXRlID0gdGhpcy5mYWlsRGlhbG9nLmdldENoaWxkQnlOYW1lKCdpbmZvJykuZ2V0Q2hpbGRCeU5hbWUoJ3Nwcml0ZScpLmdldENvbXBvbmVudChjYy5TcHJpdGUpXG4gICAgdGhpcy5mYWlsSGlnaFNjb3JlID0gdGhpcy5mYWlsRGlhbG9nLmdldENoaWxkQnlOYW1lKCdpbmZvJykuZ2V0Q2hpbGRCeU5hbWUoJ2hpZ2hTY29yZScpLmdldENvbXBvbmVudChjYy5MYWJlbClcbiAgfSxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0g5YiG5pWw5o6n5Yi2IC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyDlop7liqAg5YeP5bCR5q2l5pWw5bm25LiU5Yi35pawVUlcbiAgb25TdGVwKG51bSkge1xuICAgIHRoaXMubGVmdFN0ZXAgKz0gbnVtXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICh0aGlzLmxlZnRTdGVwIDwgMCkge1xuICAgICAgICB0aGlzLmxlZnRTdGVwID0gMFxuICAgICAgICB0aGlzLm9uR2FtZU92ZXIoKVxuICAgICAgICByZXNvbHZlKGZhbHNlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZSh0cnVlKVxuICAgICAgfVxuICAgICAgdGhpcy5sZWZ0U3RlcExhYmVsLnN0cmluZyA9IHRoaXMubGVmdFN0ZXBcbiAgICAgIGlmIChudW0gPiAwKSB7XG4gICAgICAgIHRoaXMuc2hvd1N0ZXBBbmkobnVtKVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgLy/lop7liqDliIbmlbDmgLvmjqfliLYg6I635Y+W6L+e5Ye7XG4gIGFkZFNjb3JlKHBvcywgc2NvcmUpIHtcbiAgICBzY29yZSA9IHNjb3JlIHx8IHRoaXMuX2NvbnRyb2xsZXIuY29uZmlnLmpzb24uc2NvcmVCYXNlXG4gICAgLy8g5LiA5qyh5raI6Zmk5Y+v5Lul5Y+gY2hhaW5cbiAgICBpZiAodGhpcy5jaGFpblRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5jaGFpblRpbWVyKVxuICAgIH1cbiAgICB0aGlzLmluaXRDdXJyZW50U2NvcmVMYWJlbCgpXG4gICAgdGhpcy5jaGFpblRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMub25DdXJyZW50U2NvcmVMYWJlbCh0aGlzLmN1cnJlbnRBZGRlZFNjb3JlLCB7XG4gICAgICAgICAgeDogLTYwLFxuICAgICAgICAgIHk6IDM1NVxuICAgICAgICB9LCBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zY29yZSArPSB0aGlzLmN1cnJlbnRBZGRlZFNjb3JlICogdGhpcy5tdWx0aXBsZVxuICAgICAgICAgIHRoaXMuY2hlY2tMZXZlbFVwKClcbiAgICAgICAgICB0aGlzLmNoYWluID0gMVxuICAgICAgICAgIHRoaXMuY2xvc2VNdWx0TGFiZWwoKVxuICAgICAgICAgIHRoaXMuaGlkZUNoYWluU3ByaXRlKClcbiAgICAgICAgICB0aGlzLmN1cnJlbnRBZGRlZFNjb3JlID0gMFxuICAgICAgICAgIHRoaXMubWFpblNjb3JlTGFiZWwubm9kZS5hY3RpdmUgPSBmYWxzZVxuICAgICAgICB9LCB0aGlzKSlcbiAgICAgIH0sIDUwMCAvIDFcbiAgICAgIC8vIChjYy5nYW1lLmdldEZyYW1lUmF0ZSgpIC8gNjApXG4gICAgKVxuICAgIGxldCBhZGRTY29yZSA9IHNjb3JlID09IHRoaXMuX2NvbnRyb2xsZXIuY29uZmlnLmpzb24uc2NvcmVCYXNlID8gKHNjb3JlICsgKHRoaXMuY2hhaW4gPiAxNiA/IDE2IDogKHRoaXMuY2hhaW4gLSAxKSkgKiAxMCkgOiBzY29yZVxuICAgIC8vIGxldCBhZGRTY29yZSA9IHNjb3JlID09IDEwID8gc2NvcmUgKiAodGhpcy5jaGFpbiA+IDEwID8gMTAgOiB0aGlzLmNoYWluKSA6IHNjb3JlXG4gICAgdGhpcy5jdXJyZW50QWRkZWRTY29yZSArPSBhZGRTY29yZVxuICAgIHRoaXMubWFpblNjb3JlTGFiZWwuc3RyaW5nID0gdGhpcy5jdXJyZW50QWRkZWRTY29yZVxuICAgIHRoaXMuaW5zdGFudGlhdGVTY29yZSh0aGlzLCBhZGRTY29yZSwgcG9zKVxuICAgIHRoaXMuY2hhaW4rK1xuICAgIHRoaXMuY2hlY2tDaGFpbigpXG4gIH0sXG4gIC8vIOWIpOaWrei/nuWHu1xuICBjaGVja0NoYWluKCkge1xuICAgIGlmICh0aGlzLmNoZWNrQ2hhaW5UaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuY2hlY2tDaGFpblRpbWVyKVxuICAgIH1cbiAgICB0aGlzLmNoZWNrQ2hhaW5UaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgbGV0IGNvbmZpZyA9IHRoaXMuX2NvbnRyb2xsZXIuY29uZmlnLmpzb24uY2hhaW5Db25maWdcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29uZmlnLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmNoYWluIDw9IGNvbmZpZ1tpXS5tYXggJiYgdGhpcy5jaGFpbiA+PSBjb25maWdbaV0ubWluKSB7XG4gICAgICAgICAgLy8gIGNvbnNvbGUubG9nKGNvbmZpZ1tpXS50ZXh0KVxuICAgICAgICAgIHRoaXMuc2hvd0NoYWluU3ByaXRlKGkpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCAyMDApXG4gIH0sXG4gIHNob3dDaGFpblNwcml0ZShpZCkge1xuICAgIHRoaXMuY2hhaW5TcHJpdGUuc3ByaXRlRnJhbWUgPSB0aGlzLmNoYWluU3ByaXRlRnJhbWVBcnJbaWRdXG4gICAgdGhpcy5jaGFpblNwcml0ZS5ub2RlLnNjYWxlID0gMC41XG4gICAgdGhpcy5jaGFpblNwcml0ZS5ub2RlLmFjdGl2ZSA9IHRydWVcbiAgICB0aGlzLmNoYWluU3ByaXRlLm5vZGUucnVuQWN0aW9uKEFDLnBvcE91dCgwLjMpKVxuICB9LFxuICBoaWRlQ2hhaW5TcHJpdGUoKSB7XG4gICAgdGhpcy5jaGFpblNwcml0ZS5ub2RlLmFjdGl2ZSA9IGZhbHNlXG4gIH0sXG4gIGNoZWNrTGV2ZWxVcCgpIHtcbiAgICBpZiAodGhpcy5sZXZlbCA8IHRoaXMubGV2ZWxEYXRhLmxlbmd0aCAmJiB0aGlzLnNjb3JlID49IHRoaXMubGV2ZWxEYXRhW3RoaXMubGV2ZWwgLSAxXS5zY29yZSkge1xuICAgICAgdGhpcy5sZXZlbCsrXG4gICAgICB0aGlzLmxldmVsID4gKHRoaXMubGV2ZWxEYXRhLmxlbmd0aCArIDEpID8gdGhpcy5sZXZlbExpbWl0KCkgOiB0aGlzLm9uTGV2ZWxVcCgpXG4gICAgfVxuICAgIHRoaXMucHJvZ3Jlc3NCYXIuaW5pdCh0aGlzLnNjb3JlLCB0aGlzLmxldmVsRGF0YVt0aGlzLmxldmVsIC0gMV0sIHRoaXMubGV2ZWwpXG4gIH0sXG4gIC8vIOWinuWKoOWAjeaVsFxuICBhZGRNdWx0KGNvbG9yLCBwb3MpIHtcbiAgICAvL1RPRE86IOWKqOaAgeeUn+aIkOS4gOS4quWbvueJhyDnp7vliqjliLBtdWx0TGFiZWzkuIog5pyJYnVnXG4gICAgLy8gaWYgKHRoaXMubXVsdFByb3BQb29sLnNpemUoKSA+IDApIHtcbiAgICAvLyAgIGxldCBtdWx0UHJvcCA9IHRoaXMubXVsdFByb3BQb29sLmdldCgpXG4gICAgLy8gICBtdWx0UHJvcC5wYXJlbnQgPSB0aGlzLm1haW5TY29yZUxhYmVsLm5vZGVcbiAgICAvLyAgIG11bHRQcm9wLnggPSBwb3MueFxuICAgIC8vICAgbXVsdFByb3AueSA9IHBvcy55XG4gICAgLy8gICBtdWx0UHJvcC5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSA9IHRoaXMuX2dhbWUucHJvcFNwcml0ZUZyYW1lW2NvbG9yIC0gMV1cbiAgICAvLyAgIG11bHRQcm9wLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5tb3ZlVG8oMC4yLCAxODcsIDApLCBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgLy8gICAgIHRoaXMubXVsdFByb3BQb29sLnB1dChtdWx0UHJvcClcbiAgICAvLyAgIH0pKSlcbiAgICAvLyB9XG4gICAgaWYgKHRoaXMubXVsdGlwbGUgPCB0aGlzLl9jb250cm9sbGVyLmNvbmZpZy5qc29uLm1heE11bHRpcGxlKSB7XG4gICAgICB0aGlzLm11bHRpcGxlICo9IDJcbiAgICAgIHRoaXMuc2hvd011bHRMYWJlbCgpXG4gICAgfVxuICB9LFxuICAvLyDlhbPpl63lgI3mlbDnmoTmlbDlrZfmmL7npLpcbiAgY2xvc2VNdWx0TGFiZWwoKSB7XG4gICAgdGhpcy5tdWx0aXBsZSA9IDFcbiAgICB0aGlzLm11bHRMYWJlbC5ub2RlLmFjdGl2ZSA9IGZhbHNlXG4gIH0sXG4gIHNob3dNdWx0TGFiZWwoKSB7XG4gICAgdGhpcy5tdWx0TGFiZWwubm9kZS5zY2FsZSA9IDAuNVxuICAgIHRoaXMubXVsdExhYmVsLnN0cmluZyA9IHRoaXMubXVsdGlwbGVcbiAgICB0aGlzLm11bHRMYWJlbC5ub2RlLmFjdGl2ZSA9IHRydWVcbiAgICB0aGlzLm11bHRMYWJlbC5ub2RlLnJ1bkFjdGlvbihBQy5wb3BPdXQoMC4zKSlcbiAgfSxcbiAgLy8g5aKe5Yqg5YiG5pWw5YCN5pWwXG4gIGluaXRDdXJyZW50U2NvcmVMYWJlbCgpIHtcbiAgICB0aGlzLm1haW5TY29yZUxhYmVsLm5vZGUuYWN0aXZlID0gdHJ1ZVxuICAgIHRoaXMubWFpblNjb3JlTGFiZWwubm9kZS54ID0gMFxuICAgIHRoaXMubWFpblNjb3JlTGFiZWwubm9kZS55ID0gMFxuICAgIHRoaXMubWFpblNjb3JlTGFiZWwubm9kZS5zY2FsZSA9IDFcbiAgfSxcbiAgLy8g55Sf5oiQ5bCP55qE5YiG5pWw6IqC54K5XG4gIG9uQ3VycmVudFNjb3JlTGFiZWwobnVtLCBwb3MsIGNhbGxiYWNrKSB7XG4gICAgLy8gVE9ETzog5aKe5Yqg5LiA5Liq5pKS6Iqx54m55pWIXG4gICAgdGhpcy5tYWluU2NvcmVMYWJlbC5zdHJpbmcgPSBudW1cbiAgICBsZXQgYWN0aW9uID0gY2Muc3Bhd24oY2MubW92ZVRvKDAuMiwgcG9zLngsIHBvcy55KSwgY2Muc2NhbGVUbygwLjIsIDAuNCkpLmVhc2luZyhjYy5lYXNlQmFja091dCgpKVxuICAgIGxldCBzZXEgPSBjYy5zZXF1ZW5jZShhY3Rpb24sIGNhbGxiYWNrKVxuICAgIHRoaXMubWFpblNjb3JlTGFiZWwubm9kZS5ydW5BY3Rpb24oc2VxKVxuICB9LFxuICAvLyDljYfnuqdcbiAgb25MZXZlbFVwKCkge1xuICAgIHRoaXMuX2NvbnRyb2xsZXIucGFnZU1hbmFnZXIuYWRkUGFnZSgyKVxuICAgIHRoaXMuX2NvbnRyb2xsZXIucGFnZU1hbmFnZXIuYWRkUGFnZSgzKVxuICAgIHRoaXMuX2NvbnRyb2xsZXIubXVzaWNNYW5hZ2VyLm9uV2luKClcbiAgICB0aGlzLnN1Y2Nlc3NEaWFsb2cuaW5pdCh0aGlzLCB0aGlzLmxldmVsLCB0aGlzLmxldmVsRGF0YSwgdGhpcy5zY29yZSkgLy/ljYfnuqfkuYvlkI7nmoTnrYnnuqdcbiAgICB0aGlzLmNoYXJhY3Rlck1nci5vbkxldmVsVXAoKVxuICAgIHRoaXMuY2hhcmFjdGVyTWdyLm9uU3VjY2Vzc0RpYWxvZyh0aGlzLmxldmVsKVxuICAgIHRoaXMuX2dhbWUuX3N0YXR1cyA9IDJcbiAgICBpZiAodGhpcy5fY29udHJvbGxlci5zb2NpYWwubm9kZS5hY3RpdmUpIHtcbiAgICAgIHRoaXMuX2NvbnRyb2xsZXIuc29jaWFsLm9wZW5CYW5uZXJBZHYoKVxuICAgIH1cbiAgfSxcbiAgLy8g562J57qn6ZmQ5Yi2XG4gIGxldmVsTGltaXQoKSB7XG4gICAgLy9jb25zb2xlLmxvZygn562J57qn6L6+5Yiw5LiK6ZmQJylcbiAgICB0aGlzLmhpZGVOZXh0TGV2ZWxEYXRhKClcbiAgfSxcbiAgLy8g54K55Ye75Y2H57qn5oyJ6ZKuXG4gIG9uTGV2ZWxVcEJ1dHRvbihkb3VibGUpIHtcbiAgICBjb25zb2xlLmxvZyhkb3VibGUpXG4gICAgaWYgKHRoaXMuaXNMZXZlbFVwKSB7XG4gICAgICByZXR1cm5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pc0xldmVsVXAgPSB0cnVlXG4gICAgfVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5pc0xldmVsVXAgPSBmYWxzZVxuICAgIH0sIDUwMClcbiAgICBpZiAoZG91YmxlICYmIGRvdWJsZS5jdXJyZW50VGFyZ2V0KSB7XG4gICAgICBkb3VibGUgPSAxXG4gICAgfSBlbHNlIHtcbiAgICAgIGRvdWJsZSA9IGRvdWJsZSB8fCAxXG4gICAgfVxuICAgIHRoaXMuX2NvbnRyb2xsZXIucGFnZU1hbmFnZXIub25PcGVuUGFnZSgxKVxuICAgIHRoaXMuaW5pdEN1cnJlbnRTY29yZUxhYmVsKClcbiAgICB0aGlzLm1haW5TY29yZUxhYmVsLnN0cmluZyA9IHRoaXMubGV2ZWxEYXRhW3RoaXMubGV2ZWwgLSAyXS5zdGVwICogZG91YmxlXG4gICAgdGhpcy5jaGFyYWN0ZXJNZ3Iub25MZXZlbFVwQnRuKHRoaXMubGV2ZWwpXG4gICAgdGhpcy5uYW1lTGFiZWwuc3RyaW5nID0gdGhpcy5sZXZlbERhdGFbdGhpcy5sZXZlbCAtIDFdLm5hbWVcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMub25DdXJyZW50U2NvcmVMYWJlbCh0aGlzLmxldmVsRGF0YVt0aGlzLmxldmVsIC0gMl0uc3RlcCAqIGRvdWJsZSwge1xuICAgICAgICB4OiAtMjQ4LFxuICAgICAgICB5OiAzNTBcbiAgICAgIH0sIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgLy8gdGhpcy50aXBCb3guaW5pdCh0aGlzKSDmr4/mrKHljYfnuqflsLHlko/or5dcbiAgICAgICAgdGhpcy5vblN0ZXAodGhpcy5sZXZlbERhdGFbdGhpcy5sZXZlbCAtIDJdLnN0ZXAgKiBkb3VibGUpLnRoZW4oKVxuICAgICAgICB0aGlzLl9nYW1lLl9zdGF0dXMgPSAxXG4gICAgICAgIHRoaXMubWFpblNjb3JlTGFiZWwubm9kZS5hY3RpdmUgPSBmYWxzZVxuICAgICAgfSkpXG4gICAgfSwgMzAwKTtcbiAgICB0aGlzLnNob3dOZXh0TGV2ZWxEYXRhKClcbiAgICB0aGlzLmNoZWNrTGV2ZWxVcCgpXG4gIH0sXG4gIC8vIHRvZG86IOaWsOWinuS4gOS4qiDliqjnlLsg5pWw5a2X5LiK5rWu5ZKM57yp5pS+XG4gIHNob3dTdGVwQW5pKG51bSkge1xuICAgIHRoaXMuc3RlcEFuaUxhYmVsLnN0cmluZyA9ICcrJyArIChudW0gKyAnJylcbiAgICB0aGlzLnN0ZXBBbmlMYWJlbC5ub2RlLnggPSAtMjQ4XG4gICAgdGhpcy5zdGVwQW5pTGFiZWwubm9kZS55ID0gNDAwXG4gICAgdGhpcy5zdGVwQW5pTGFiZWwubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2MudG9nZ2xlVmlzaWJpbGl0eSgpLCBjYy5tb3ZlQnkoMC42LCAwLCA2MCksIGNjLnRvZ2dsZVZpc2liaWxpdHkoKSkpXG4gICAgbGV0IGFjdGlvbiA9IGNjLnNlcXVlbmNlKGNjLnNjYWxlVG8oMC4yLCAwLjgpLCBBQy5wb3BPdXQoMC44KSlcbiAgICB0aGlzLmxlZnRTdGVwTGFiZWwubm9kZS5wYXJlbnQucnVuQWN0aW9uKGFjdGlvbilcbiAgfSxcbiAgLy8g5ri45oiP57uT5p2fXG4gIC8vIHRvZG8g5aSN5rS7XG4gIG9uR2FtZU92ZXIoaXNUcnVlKSB7XG4gICAgaXNUcnVlID0gaXNUcnVlIHx8IDBcbiAgICBpZiAodGhpcy5fZ2FtZS5fc3RhdHVzICE9IDMgJiYgKGlzVHJ1ZSB8fCB0aGlzLnJldml2ZVRpbWUgPj0gMykpIHtcbiAgICAgIHRoaXMuX2dhbWUuZ2FtZU92ZXIoKVxuICAgICAgdGhpcy51cGRhdGVGYWlsUGFnZSgpXG4gICAgICBpZiAodGhpcy5fY29udHJvbGxlci5zb2NpYWwubm9kZS5hY3RpdmUpIHtcbiAgICAgICAgLy8g5LuF5LiK5Lyg5YiG5pWwXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXIuc29jaWFsLm9uR2FtZU92ZXIodGhpcy5sZXZlbCwgdGhpcy5zY29yZSlcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFpc1RydWUpIHtcbiAgICAgIHRoaXMuX2dhbWUuYXNrUmV2aXZlKClcbiAgICB9XG4gIH0sXG4gIG9uRG91YmxlU3RlcEJ0bigpIHtcbiAgICBpZiAodGhpcy5fY29udHJvbGxlci5zb2NpYWwubm9kZS5hY3RpdmUpIHtcbiAgICAgIHRoaXMuX2NvbnRyb2xsZXIuc29jaWFsLm9uUmV2aXZlQnV0dG9uKDApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25MZXZlbFVwQnV0dG9uKDIpXG4gICAgfVxuICB9LFxuICBvbkRvdWJsZVN0ZXAoKSB7XG4gICAgdGhpcy5vbkxldmVsVXBCdXR0b24oMilcbiAgfSxcbiAgb25SZXZpdmUoKSB7XG4gICAgdGhpcy5yZXZpdmVUaW1lICs9IDFcbiAgICB0aGlzLm9uU3RlcCg1KS50aGVuKClcbiAgfSxcbiAgLy8g5bGV56S65LiL5LiA57qn55qE5L+h5oGvXG4gIHNob3dOZXh0TGV2ZWxEYXRhKCkge1xuICAgIGxldCBuZXh0TGV2ZWxEYXRhID0gdGhpcy5sZXZlbERhdGFbdGhpcy5sZXZlbF1cbiAgfSxcbiAgLy8g6L6+5Yiw5pyA6auY57qn5LmL5ZCOIOmakOiXj1xuICBoaWRlTmV4dExldmVsRGF0YSgpIHtcblxuICB9LFxuICB1cGRhdGVGYWlsUGFnZSgpIHtcbiAgICB0aGlzLmZhaWxTY29yZS5zdHJpbmcgPSBcIiBcIiArICh0aGlzLnNjb3JlICsgJycpXG4gICAgdGhpcy5jaGFyYWN0ZXJNZ3Iub25GYWlsKHRoaXMubGV2ZWwpXG4gICAgdGhpcy5mYWlsTmFtZS5zdHJpbmcgPSB0aGlzLmxldmVsRGF0YVt0aGlzLmxldmVsIC0gMV0ubmFtZVxuICAgIC8vdGhpcy5mYWlsSGlnaFNjb3JlLnN0cmluZyA9IFwi5q2j5Zyo6I635Y+W5oKo55qE5pyA6auY5YiGLi4uXCJcbiAgfSxcblxufSk7Il19
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

    this._score = s;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzY29yZVBhcnRpY2xlLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwicGFydGljbGUiLCJQYXJ0aWNsZVN5c3RlbSIsImluaXQiLCJzIiwicG9zIiwidGltZSIsIl9zY29yZSIsIm5vZGUiLCJ4IiwieSIsImFjdGl2ZSIsInNjYWxlIiwic2V0VGltZW91dCIsInN0b3BTeXN0ZW0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBR1BDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxRQUFRLEVBQUVKLEVBQUUsQ0FBQ0s7QUFESCxHQUhMO0FBT1A7QUFFQTtBQUNBQyxFQUFBQSxJQVZPLGdCQVVGQyxDQVZFLEVBVUNDLEdBVkQsRUFVTUMsSUFWTixFQVVZO0FBQUE7O0FBQ2pCLFNBQUtDLE1BQUwsR0FBY0gsQ0FBZDtBQUNBLFNBQUtJLElBQUwsQ0FBVUMsQ0FBVixHQUFjSixHQUFHLENBQUNJLENBQWxCO0FBQ0EsU0FBS0QsSUFBTCxDQUFVRSxDQUFWLEdBQWNMLEdBQUcsQ0FBQ0ssQ0FBbEI7QUFDQSxTQUFLRixJQUFMLENBQVVHLE1BQVYsR0FBbUIsSUFBbkIsQ0FKaUIsQ0FLakI7O0FBQ0EsU0FBS0gsSUFBTCxDQUFVSSxLQUFWLEdBQWtCLENBQWxCO0FBQ0FDLElBQUFBLFVBQVUsQ0FBQyxZQUFNO0FBQ2IsTUFBQSxLQUFJLENBQUNMLElBQUwsQ0FBVUcsTUFBVixHQUFtQixLQUFuQjs7QUFDQSxNQUFBLEtBQUksQ0FBQ1YsUUFBTCxDQUFjYSxVQUFkLEdBRmEsQ0FHYjs7QUFDRCxLQUpPLEVBSUxSLElBQUksR0FBRyxDQUpGLENBS1I7QUFMUSxLQUFWO0FBT0QsR0F4Qk0sQ0EwQlA7O0FBMUJPLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gIHByb3BlcnRpZXM6IHtcbiAgICBwYXJ0aWNsZTogY2MuUGFydGljbGVTeXN0ZW0sXG4gIH0sXG5cbiAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XG5cbiAgLy8gb25Mb2FkICgpIHt9LFxuICBpbml0KHMsIHBvcywgdGltZSkge1xuICAgIHRoaXMuX3Njb3JlID0gc1xuICAgIHRoaXMubm9kZS54ID0gcG9zLnhcbiAgICB0aGlzLm5vZGUueSA9IHBvcy55XG4gICAgdGhpcy5ub2RlLmFjdGl2ZSA9IHRydWVcbiAgICAvLyB0aGlzLnBhcnRpY2xlLnJlc2V0U3lzdGVtKClcbiAgICB0aGlzLm5vZGUuc2NhbGUgPSAxXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMubm9kZS5hY3RpdmUgPSBmYWxzZVxuICAgICAgICB0aGlzLnBhcnRpY2xlLnN0b3BTeXN0ZW0oKVxuICAgICAgICAvLyAgcy5zY29yZVBhcnRpY2xlUG9vbC5wdXQodGhpcy5ub2RlKVxuICAgICAgfSwgdGltZSAvIDFcbiAgICAgIC8vKGNjLmdhbWUuZ2V0RnJhbWVSYXRlKCkgLyA2MClcbiAgICApXG4gIH1cblxuICAvLyB1cGRhdGUgKGR0KSB7fSxcbn0pOyJdfQ==
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

    this._score = s;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzY29yZUNlbGwuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJsYWJlbCIsIkxhYmVsIiwiaW5pdCIsInMiLCJudW0iLCJwb3MiLCJfc2NvcmUiLCJub2RlIiwieCIsInkiLCJzdHJpbmciLCJzY2FsZSIsImFjdGlvbjEiLCJzY2FsZVRvIiwiYWN0aW9uMiIsIm1vdmVCeSIsImFjdGlvbjMiLCJtb3ZlVG8iLCJhY3Rpb240Iiwic3BhMSIsInNwYXduIiwic3BhMiIsInNlcSIsInNlcXVlbmNlIiwiY2FsbEZ1bmMiLCJzY29yZVBvb2wiLCJwdXQiLCJydW5BY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBR1BDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxLQUFLLEVBQUVKLEVBQUUsQ0FBQ0ssS0FEQSxDQUVWOztBQUZVLEdBSEw7QUFPUDtBQUVBO0FBQ0FDLEVBQUFBLElBVk8sZ0JBVUZDLENBVkUsRUFVQ0MsR0FWRCxFQVVNQyxHQVZOLEVBVVc7QUFBQTs7QUFDaEIsU0FBS0MsTUFBTCxHQUFjSCxDQUFkO0FBQ0EsU0FBS0ksSUFBTCxDQUFVQyxDQUFWLEdBQWNILEdBQUcsQ0FBQ0csQ0FBbEI7QUFDQSxTQUFLRCxJQUFMLENBQVVFLENBQVYsR0FBY0osR0FBRyxDQUFDSSxDQUFsQjtBQUNBLFNBQUtULEtBQUwsQ0FBV1UsTUFBWCxHQUFvQk4sR0FBcEIsQ0FKZ0IsQ0FLaEI7O0FBQ0EsU0FBS0csSUFBTCxDQUFVSSxLQUFWLEdBQWtCLENBQWxCO0FBQ0EsU0FBS1gsS0FBTCxDQUFXTyxJQUFYLENBQWdCQyxDQUFoQixHQUFvQixDQUFwQjtBQUNBLFNBQUtSLEtBQUwsQ0FBV08sSUFBWCxDQUFnQkUsQ0FBaEIsR0FBb0IsQ0FBcEI7QUFDQSxTQUFLVCxLQUFMLENBQVdPLElBQVgsQ0FBZ0JJLEtBQWhCLEdBQXdCLENBQXhCO0FBQ0EsUUFBSUMsT0FBTyxHQUFHaEIsRUFBRSxDQUFDaUIsT0FBSCxDQUFXLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsQ0FBZDtBQUNBLFFBQUlDLE9BQU8sR0FBR2xCLEVBQUUsQ0FBQ21CLE1BQUgsQ0FBVSxHQUFWLEVBQWUsQ0FBZixFQUFrQixFQUFsQixDQUFkO0FBQ0EsUUFBSUMsT0FBTyxHQUFHcEIsRUFBRSxDQUFDcUIsTUFBSCxDQUFVLEdBQVYsRUFBZSxDQUFmLEVBQWtCLENBQWxCLENBQWQ7QUFDQSxRQUFJQyxPQUFPLEdBQUd0QixFQUFFLENBQUNpQixPQUFILENBQVcsR0FBWCxFQUFnQixHQUFoQixFQUFxQixHQUFyQixDQUFkLENBYmdCLENBY2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFFBQUlNLElBQUksR0FBR3ZCLEVBQUUsQ0FBQ3dCLEtBQUgsQ0FBU1IsT0FBVCxFQUFrQkUsT0FBbEIsQ0FBWDtBQUNBLFFBQUlPLElBQUksR0FBR3pCLEVBQUUsQ0FBQ3dCLEtBQUgsQ0FBU0osT0FBVCxFQUFrQkUsT0FBbEIsQ0FBWDtBQUNBLFFBQUlJLEdBQUcsR0FBRzFCLEVBQUUsQ0FBQzJCLFFBQUgsQ0FBWUosSUFBWixFQUFrQkUsSUFBbEIsRUFBd0J6QixFQUFFLENBQUM0QixRQUFILENBQVksWUFBTTtBQUNsRHJCLE1BQUFBLENBQUMsQ0FBQ3NCLFNBQUYsQ0FBWUMsR0FBWixDQUFnQixLQUFJLENBQUNuQixJQUFyQjtBQUNELEtBRmlDLEVBRS9CLElBRitCLENBQXhCLENBQVY7QUFHQSxTQUFLQSxJQUFMLENBQVVvQixTQUFWLENBQW9CTCxHQUFwQjtBQUNELEdBckNNLENBdUNQOztBQXZDTyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbGFiZWw6IGNjLkxhYmVsLFxuICAgIC8vcGFydGljbGU6IGNjLlBhcnRpY2xlU3lzdGVtLFxuICB9LFxuICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcblxuICAvLyBvbkxvYWQgKCkge30sXG4gIGluaXQocywgbnVtLCBwb3MpIHtcbiAgICB0aGlzLl9zY29yZSA9IHNcbiAgICB0aGlzLm5vZGUueCA9IHBvcy54XG4gICAgdGhpcy5ub2RlLnkgPSBwb3MueVxuICAgIHRoaXMubGFiZWwuc3RyaW5nID0gbnVtXG4gICAgLy90aGlzLnBhcnRpY2xlLnJlc2V0U3lzdGVtKClcbiAgICB0aGlzLm5vZGUuc2NhbGUgPSAxXG4gICAgdGhpcy5sYWJlbC5ub2RlLnggPSAwXG4gICAgdGhpcy5sYWJlbC5ub2RlLnkgPSAwXG4gICAgdGhpcy5sYWJlbC5ub2RlLnNjYWxlID0gMVxuICAgIGxldCBhY3Rpb24xID0gY2Muc2NhbGVUbygwLjEsIDEuMiwgMS4yKVxuICAgIGxldCBhY3Rpb24yID0gY2MubW92ZUJ5KDAuMSwgMCwgMzApXG4gICAgbGV0IGFjdGlvbjMgPSBjYy5tb3ZlVG8oMC4yLCAwLCAwKVxuICAgIGxldCBhY3Rpb240ID0gY2Muc2NhbGVUbygwLjIsIDAuNSwgMC41KVxuICAgIC8vIGxldCBzZXEgPSBjYy5zZXF1ZW5jZShhY3Rpb24xLCBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgLy8gICBsZXQgc2VxMiA9IGNjLnNlcXVlbmNlKGFjdGlvbjMsIGNjLm1vdmVCeSgwLjEsIDAsIDApLCBhY3Rpb240LCBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgLy8gICAgIHMuc2NvcmVQb29sLnB1dCh0aGlzLm5vZGUpXG4gICAgLy8gICB9LCB0aGlzKSlcbiAgICAvLyAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxMilcbiAgICAvLyB9LCB0aGlzKSlcbiAgICAvLyB0aGlzLmxhYmVsLm5vZGUucnVuQWN0aW9uKHNlcSlcbiAgICBsZXQgc3BhMSA9IGNjLnNwYXduKGFjdGlvbjEsIGFjdGlvbjIpXG4gICAgbGV0IHNwYTIgPSBjYy5zcGF3bihhY3Rpb24zLCBhY3Rpb240KVxuICAgIGxldCBzZXEgPSBjYy5zZXF1ZW5jZShzcGExLCBzcGEyLCBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICBzLnNjb3JlUG9vbC5wdXQodGhpcy5ub2RlKVxuICAgIH0sIHRoaXMpKVxuICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKVxuICB9XG5cbiAgLy8gdXBkYXRlIChkdCkge30sXG59KTsiXX0=
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
    this._score = s;

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
      _this.init(_this._score, -1);
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
    //this.openTimer = setTimeout(this.init(this._score, null), this._score.level * 2000)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFx0aXBCb3guanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJsYWJlbCIsIkxhYmVsIiwic3RhcnQiLCJ0aXAiLCJvdGhlclRpcCIsImluaXQiLCJzIiwidHlwZSIsIl9zY29yZSIsInN0cmluZyIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImxlbmd0aCIsIm9wZW5UaXBCb3giLCJnYXBUaW1lciIsImNsZWFySW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImlzT3BlbiIsImFjdGlvbiIsInNjYWxlVG8iLCJlYXNpbmciLCJlYXNlQmFja091dCIsInNxIiwic2VxdWVuY2UiLCJjYWxsRnVuYyIsIm5vZGUiLCJydW5BY3Rpb24iLCJjbG9zZVRpbWVyIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImNsb3NlVGlvQm94Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0FBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBR1BDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxLQUFLLEVBQUVKLEVBQUUsQ0FBQ0s7QUFEQSxHQUhMO0FBTVBDLEVBQUFBLEtBTk8sbUJBTUM7QUFDTixTQUFLQyxHQUFMLEdBQVcsQ0FBQyxlQUFELEVBQWtCLGlCQUFsQixFQUFxQyxnQkFBckMsRUFBdUQsV0FBdkQsRUFBbUUsV0FBbkUsRUFBK0UsZUFBL0UsQ0FBWDtBQUNBLFNBQUtDLFFBQUwsR0FBZ0IsQ0FDZCxtQkFEYyxFQUVkLGlCQUZjLEVBR2QscUJBSGMsRUFJZCxzQkFKYyxFQUtkLHNCQUxjLEVBTWQsb0JBTmMsRUFPZCxtQkFQYyxFQVFkLGtCQVJjLEVBU2QsMkJBVGMsRUFVZCwwQkFWYyxFQVdkLG9CQVhjLEVBWWQsd0JBWmMsRUFhZCw0QkFiYyxFQWNkLGNBZGMsRUFlZCxrQkFmYyxFQWdCZCxpQkFoQmMsRUFpQmQsNEJBakJjLEVBa0JkLG9CQWxCYyxFQW1CZCxrQkFuQmMsRUFvQmQsdUJBcEJjLENBQWhCO0FBc0JELEdBOUJNO0FBK0JQQyxFQUFBQSxJQS9CTyxnQkErQkZDLENBL0JFLEVBK0JDQyxJQS9CRCxFQStCTztBQUFBOztBQUFFO0FBQ2QsU0FBS0MsTUFBTCxHQUFjRixDQUFkOztBQUNBLFFBQUlDLElBQUksR0FBRyxDQUFYLEVBQWM7QUFDWixXQUFLUCxLQUFMLENBQVdTLE1BQVgsR0FBb0IsS0FBS04sR0FBTCxDQUFTSSxJQUFULENBQXBCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsV0FBS1AsS0FBTCxDQUFXUyxNQUFYLEdBQW9CLEtBQUtMLFFBQUwsQ0FBY00sSUFBSSxDQUFDQyxLQUFMLENBQVdELElBQUksQ0FBQ0UsTUFBTCxLQUFnQixLQUFLUixRQUFMLENBQWNTLE1BQXpDLENBQWQsQ0FBcEI7QUFDRDs7QUFDRCxTQUFLQyxVQUFMOztBQUNBLFFBQUksS0FBS0MsUUFBVCxFQUFtQjtBQUNqQkMsTUFBQUEsYUFBYSxDQUFDLEtBQUtELFFBQU4sQ0FBYjtBQUNEOztBQUNELFNBQUtBLFFBQUwsR0FBZ0JFLFdBQVcsQ0FBQyxZQUFNO0FBQ2hDLE1BQUEsS0FBSSxDQUFDWixJQUFMLENBQVUsS0FBSSxDQUFDRyxNQUFmLEVBQXVCLENBQUMsQ0FBeEI7QUFDRCxLQUYwQixFQUV4QixJQUZ3QixDQUEzQjtBQUdELEdBN0NNO0FBOENQTSxFQUFBQSxVQTlDTyx3QkE4Q007QUFBQTs7QUFDWCxRQUFJLENBQUMsS0FBS0ksTUFBVixFQUFrQjtBQUNoQjtBQUNBLFVBQUlDLE1BQU0sR0FBR3ZCLEVBQUUsQ0FBQ3dCLE9BQUgsQ0FBVyxHQUFYLEVBQWdCLENBQWhCLEVBQW1CQyxNQUFuQixDQUEwQnpCLEVBQUUsQ0FBQzBCLFdBQUgsQ0FBZSxHQUFmLENBQTFCLENBQWI7QUFDQSxVQUFJQyxFQUFFLEdBQUczQixFQUFFLENBQUM0QixRQUFILENBQVlMLE1BQVosRUFBb0J2QixFQUFFLENBQUM2QixRQUFILENBQVksWUFBTTtBQUM3QyxRQUFBLE1BQUksQ0FBQ1AsTUFBTCxHQUFjLElBQWQ7QUFDRCxPQUY0QixDQUFwQixDQUFUO0FBR0EsV0FBS1EsSUFBTCxDQUFVQyxTQUFWLENBQW9CSixFQUFwQjtBQUNEOztBQUNELFFBQUksS0FBS0ssVUFBVCxFQUFxQjtBQUNuQkMsTUFBQUEsWUFBWSxDQUFDLEtBQUtELFVBQU4sQ0FBWjtBQUNEOztBQUNELFNBQUtBLFVBQUwsR0FBa0JFLFVBQVUsQ0FBQyxZQUFNO0FBQ2pDLE1BQUEsTUFBSSxDQUFDQyxXQUFMO0FBQ0QsS0FGMkIsRUFFekIsSUFGeUIsQ0FBNUI7QUFHRCxHQTdETTtBQThEUEEsRUFBQUEsV0E5RE8seUJBOERPO0FBQUE7O0FBQ1osUUFBSVosTUFBTSxHQUFHdkIsRUFBRSxDQUFDd0IsT0FBSCxDQUFXLEdBQVgsRUFBZ0IsQ0FBaEIsQ0FBYjtBQUNBLFFBQUlHLEVBQUUsR0FBRzNCLEVBQUUsQ0FBQzRCLFFBQUgsQ0FBWUwsTUFBWixFQUFvQnZCLEVBQUUsQ0FBQzZCLFFBQUgsQ0FBWSxZQUFNO0FBQzdDLE1BQUEsTUFBSSxDQUFDUCxNQUFMLEdBQWMsS0FBZDtBQUNELEtBRjRCLENBQXBCLENBQVQ7QUFHQSxTQUFLUSxJQUFMLENBQVVDLFNBQVYsQ0FBb0JKLEVBQXBCLEVBTFksQ0FNWjtBQUNBO0FBQ0E7QUFDQTtBQUNELEdBeEVNLENBeUVQOztBQXpFTyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvLyDmj5DnpLrmoYYvL+mcgOimgeWFtuS7luS7o+eggeiBlOezuyBCYXRjaE1pY2hhZWxiWEt4eUpAZ21haWwuY29tXG5jYy5DbGFzcyh7XG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbGFiZWw6IGNjLkxhYmVsLFxuICB9LFxuICBzdGFydCgpIHtcbiAgICB0aGlzLnRpcCA9IFsn5LiA5qyh5oCn5aSn6YeP5raI6Zmk5Y+v6I635b6X6YGT5YW3IScsICdYMumBk+WFt+WPr+S7pee/u+WAjeS4gOasoea2iOmZpOeahOWIhuaVsCcsICfngrjlvLnpgZPlhbflj6/ku6XmtojpmaTlhajlsY/lkIzoibLmlrnlnZcnLCAn5Y2V5Liq5pa55Z2X5peg5rOV5raI6Zmk5ZOmJywn5o2h5Yiw5a6d566x77yB5Yqg5Lik5q2l77yBJywn5LuZ5aWz5qOS5Y+v5Lul5raI6Zmk5omA5pyJ5Y2V5Liq5pa55Z2XJ11cbiAgICB0aGlzLm90aGVyVGlwID0gW1xuICAgICAgJ+WTjuWRgO+8jOS7iuWkqeeahOaYn+aYn+WlveWDj+WcqOWvueaIkeecqOecvOWRou+8gScsXG4gICAgICAn5Za1772e5pep5a6J77yM5Y+I5piv5YWD5rCU5ruh5ruh55qE5LiA5aSp77yBJyxcbiAgICAgICflmL/lmL/vvIzmiJHmmK/kuI3mmK/kuJbnlYzkuIrmnIDlj6/niLHnmoTlsI/ku5nlpbPlkYDvvJ8nLFxuICAgICAgJ+WXr+WTvO+8jOimgeS4jeimgeWQg+mil+ezlu+8jOeUnOeUnOeahO+8jOWwseWDj+aIkeS4gOagt+OAgicsXG4gICAgICAn5ZOO5ZGA77yM6L+Z5Liq5bCP5YWU5a2Q5YWs5LuU5aW95YOP5Zyo6K+05a6D5Zac5qyi5oiR5ZGi77yBJyxcbiAgICAgICflmLvlmLvvvIzku4rlpKnnmoTpo47lpb3muKnmn5TvvIzlsLHlg4/kvaDnmoTmi6XmirHjgIInLFxuICAgICAgJ+WXt+WRnO+9nuaIkemlv+S6hu+8jOaIkeS7rOWOu+WQg+eCueWlveWQg+eahOWQp++8gScsXG4gICAgICAn5L2g55yL77yM6YKj5py15LqR5aW95YOP5LiA5Y+q5aSn5qOJ6Iqx57OW5ZOm77yBJyxcbiAgICAgICfmr4/kuKrlpbPlranlrZDpg73mmK/mjonokL3kurrpl7TnmoTlsI/lpKnkvb/vvIzopoHlpb3lpb3niLHmiqToh6rlt7Hlk6bjgIInLFxuICAgICAgJ+WYv+WYv++8jOaIkeS7iuWkqeWtpuS6huS4gOS4quaWsOmtlOazle+8jOWPr+S7peWPmOWHuuWlveWkmuWwj+aYn+aYn++8gScsXG4gICAgICAn5ZOO5ZGA77yM5oiR55qE5bCP54aK6aW85bmy5aW95YOP5Zyo6Lef5oiR6K+06K+d5ZGi77yBJyxcbiAgICAgICfkvaDnnIvvvIzpgqPkuKrlvanombnlsLHlg4/miJHku6znmoTmoqbmg7PvvIznu5rkuL3lj4jpgaXkuI3lj6/lj4onLFxuICAgICAgJ+WYv+WYv++8jOaIkeS7iuWkqeaNoeWIsOS6huS4gOeJh+Wbm+WPtuiNie+8jOW4jOacm+Wug+iDveW4pue7meaIkeS7rOWlvei/kOOAgicsXG4gICAgICAn5Ze35Ze377yM5oiR5LuK5aSp5Lmf6KaB5Yqg5rK56bit77yBJyxcbiAgICAgICfkvaDnnIvvvIzpgqPkuKrmnIjkuq7lpb3lg4/lnKjlr7nmiJHku6zlvq7nrJHjgIInLFxuICAgICAgJ+WXr+WTvO+8jOaIkeS7iuWkqeimgeWBmuS4gOS4queUnOeUnOeahOaipuOAgicsXG4gICAgICAn5Zi/5Zi/77yM5oiR5LuK5aSp5a2m5Lya5LqG5LiA5Liq5paw55qE6a2U5rOV77yM5Y+v5Lul5Y+Y5Ye65aW95aSa5bCP6Iqx5py177yBJyxcbiAgICAgICfll6/vvZ7ov5nkuKrom4vns5XlpKrnvo7lkbPkuobvvIzlsLHlg4/kvaDnmoTnrJHlrrnjgIInLFxuICAgICAgJ+mBh+ingeS9oO+8jOaYr+aIkeS6uueUn+S4reacgOe+juS4veeahOaEj+WkluOAgicsXG4gICAgICAn5L2g55yL77yM6YKj5Liq5aSV6Ziz5aW95YOP5Zyo6K+05a6D5Lmf6IiN5LiN5b6X5LuK5aSp57uT5p2f44CCJ1xuICAgIF1cbiAgfSxcbiAgaW5pdChzLCB0eXBlKSB7IC8v5LygdHlwZeaYr+mBk+WFt+inpuWPkSDkuI3kvKDmmK/pmo/mnLrop6blj5FcbiAgICB0aGlzLl9zY29yZSA9IHNcbiAgICBpZiAodHlwZSA+IDApIHtcbiAgICAgIHRoaXMubGFiZWwuc3RyaW5nID0gdGhpcy50aXBbdHlwZV1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYWJlbC5zdHJpbmcgPSB0aGlzLm90aGVyVGlwW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMub3RoZXJUaXAubGVuZ3RoKV1cbiAgICB9XG4gICAgdGhpcy5vcGVuVGlwQm94KClcbiAgICBpZiAodGhpcy5nYXBUaW1lcikge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmdhcFRpbWVyKVxuICAgIH1cbiAgICB0aGlzLmdhcFRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgdGhpcy5pbml0KHRoaXMuX3Njb3JlLCAtMSlcbiAgICB9LCA1MDAwKVxuICB9LFxuICBvcGVuVGlwQm94KCkge1xuICAgIGlmICghdGhpcy5pc09wZW4pIHtcbiAgICAgIC8vIOWKqOeUuyDliqjnlLvlm57mjolcbiAgICAgIGxldCBhY3Rpb24gPSBjYy5zY2FsZVRvKDAuMywgMSkuZWFzaW5nKGNjLmVhc2VCYWNrT3V0KDIuMCkpXG4gICAgICBsZXQgc3EgPSBjYy5zZXF1ZW5jZShhY3Rpb24sIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgdGhpcy5pc09wZW4gPSB0cnVlXG4gICAgICB9KSlcbiAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc3EpXG4gICAgfVxuICAgIGlmICh0aGlzLmNsb3NlVGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmNsb3NlVGltZXIpXG4gICAgfVxuICAgIHRoaXMuY2xvc2VUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5jbG9zZVRpb0JveCgpXG4gICAgfSwgNDAwMClcbiAgfSxcbiAgY2xvc2VUaW9Cb3goKSB7XG4gICAgbGV0IGFjdGlvbiA9IGNjLnNjYWxlVG8oMC4zLCAwKVxuICAgIGxldCBzcSA9IGNjLnNlcXVlbmNlKGFjdGlvbiwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgdGhpcy5pc09wZW4gPSBmYWxzZVxuICAgIH0pKVxuICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc3EpXG4gICAgLy8gaWYgKHRoaXMub3BlblRpbWVyKSB7XG4gICAgLy8gICBjbGVhclRpbWVvdXQodGhpcy5jbG9zZVRpbWVyKVxuICAgIC8vIH1cbiAgICAvL3RoaXMub3BlblRpbWVyID0gc2V0VGltZW91dCh0aGlzLmluaXQodGhpcy5fc2NvcmUsIG51bGwpLCB0aGlzLl9zY29yZS5sZXZlbCAqIDIwMDApXG4gIH0sXG4gIC8vIHVwZGF0ZSAoZHQpIHt9LFxufSk7Il19
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
    this._controller = g._controller; // 计算宽

    this.lightSprite.node.active = false; //  this.lightSprite.spriteFrame = this._game.blockSprite[this.color - 1]

    this.node.width = this.node.height = width;
    this.startTime = data.startTime;
    this.iid = data.y;
    this.jid = data.x; // console.log('生成方块位置', data.y, data.x)

    this.node.x = -(730 / 2 - g.gap - width / 2) + pos.x * (width + g.gap);
    this.node.y = 730 / 2 - g.gap - width / 2 - pos.y * (width + g.gap);
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
          this.colorSprite.node.height += this._game.gap * 2;
          this.colorSprite.node.y += this._game.gap;
          this.growType = 1;
        }

        break;

      case 2:
        if (this.growType != 2) {
          this.colorSprite.node.height += this._game.gap * 2;
          this.colorSprite.node.y -= this._game.gap;
          this.growType = 1;
        }

        break;

      case 3:
        if (this.growType != 1) {
          this.colorSprite.node.width += this._game.gap * 2;
          this.colorSprite.node.x -= this._game.gap;
          this.growType = 2;
        }

        break;

      case 4:
        if (this.growType != 1) {
          this.colorSprite.node.width += this._game.gap * 2;
          this.colorSprite.node.x += this._game.gap;
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

        this._game._score.tipBox.init(this._game._score, 3);

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

        this._game._score.onStep(-1).then(function (res) {
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

    self._controller.musicManager.onPlayAudio(0 //self._game._score.chain - 1
    );

    if (this._itemType != 0) {
      // console.log("触发了道具", this._itemType)
      self._game.onItem(this._itemType, color, {
        x: this.node.x,
        y: this.node.y
      });
    }

    self._game._score.addScore(cc.v2(this.node.x, this.node.y - this.node.width + this._game.gap), this._itemType == 3 ? this._game._controller.config.json.propConfig[2].score : null); // 连锁状态


    if (isChain) {
      if (self.iid - 1 >= 0) {
        self._game.map[self.iid - 1][self.jid].getComponent('element').onTouched(color);
      }

      if (self.iid + 1 < this._game.rowNum) {
        self._game.map[self.iid + 1][self.jid].getComponent('element').onTouched(color);
      }

      if (self.jid - 1 >= 0) {
        self._game.map[self.iid][self.jid - 1].getComponent('element').onTouched(color);
      }

      if (self.jid + 1 < this._game.rowNum) {
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

    var action = cc.moveBy(0.25, 0, -y * (this._game.gap + this._game.blockWidth)).easing(cc.easeBounceOut(5 / y)); //1 * y / this._game.animationSpeed

    var seq = cc.sequence(action, cc.callFunc(function () {
      _this2._status = 1; //  this._game.checkNeedGenerator()
    }, this));
    this.node.runAction(seq);
  },
  playStartAction: function playStartAction() {
    var _this3 = this;

    this.node.scaleX = 0;
    this.node.scaleY = 0;
    var action = cc.scaleTo(0.8 / this._game.animationSpeed, 1, 1).easing(cc.easeBackOut());
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
        var action1 = cc.scaleTo(0.2 / self._game.animationSpeed, 1.1);
        var action2 = cc.moveTo(0.2 / self._game.animationSpeed, _this4._game.target.x, _this4._game.target.y);
        var action3 = cc.scaleTo(0.2, 0);
        var seq = cc.sequence(action1, cc.callFunc(function () {
          resolve('');
        }, _this4), cc.spawn(action2, action3));
      } else {
        action = cc.scaleTo(0.2 / self._game.animationSpeed, 0, 0);
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
      var action = cc.scaleTo(0.4 / _this5._game.animationSpeed, 0.8, 0.8);
      var action1 = cc.scaleTo(0.4 / _this5._game.animationSpeed, 1, 1);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxlbGVtZW50LmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiX3N0YXR1cyIsIl9pdGVtVHlwZSIsIndhcm5pbmdTcHJpdGUiLCJTcHJpdGUiLCJsaWdodFNwcml0ZSIsImluaXQiLCJnIiwiZGF0YSIsIndpZHRoIiwiaXRlbVR5cGUiLCJwb3MiLCJfZ2FtZSIsIngiLCJ5Iiwid2FybmluZ1R5cGUiLCJpc1B1c2giLCJiaW5kRXZlbnQiLCJjb2xvciIsIk1hdGgiLCJjZWlsIiwicmFuZG9tIiwiY29sb3JTcHJpdGUiLCJub2RlIiwiZ2V0Q2hpbGRCeU5hbWUiLCJnZXRDb21wb25lbnQiLCJzcHJpdGVGcmFtZSIsInByb3BTcHJpdGVGcmFtZSIsImJsb2NrU3ByaXRlIiwiX3dpZHRoIiwiX2NvbnRyb2xsZXIiLCJhY3RpdmUiLCJoZWlnaHQiLCJzdGFydFRpbWUiLCJpaWQiLCJqaWQiLCJnYXAiLCJhbmdsZSIsInBsYXlTdGFydEFjdGlvbiIsIm9uV2FybmluZyIsInR5cGUiLCJ3YXJuaW5nU3ByaXRlRnJhbWUiLCJhY3Rpb24xIiwiYmxpbmsiLCJ3YXJuaW5nSW5pdCIsImdyb3dJbml0IiwiZ3Jvd1R5cGUiLCJncm93Iiwib24iLCJOb2RlIiwiRXZlbnRUeXBlIiwiVE9VQ0hfU1RBUlQiLCJvblRvdWNoZWQiLCJpc0NoYWluIiwiaXNCb21iIiwidGltZSIsInNldFRpbWVvdXQiLCJKU09OIiwic3RyaW5naWZ5Iiwic2VsZiIsInBsYXlEaWVBY3Rpb24iLCJ0aGVuIiwib25CbG9ja1BvcCIsImlzU2luZ2xlIiwic2NhbGUiLCJfc2NvcmUiLCJ0aXBCb3giLCJzY2FsZVRvIiwiYWN0aW9uMiIsImVhc2luZyIsImVhc2VCYWNrT3V0IiwiYWN0aW9uIiwic2VxdWVuY2UiLCJydW5BY3Rpb24iLCJvblVzZXJUb3VjaGVkIiwib25TdGVwIiwicmVzIiwiY2hlY2tOZWVkRmFsbCIsIm11c2ljTWFuYWdlciIsIm9uUGxheUF1ZGlvIiwib25JdGVtIiwiYWRkU2NvcmUiLCJ2MiIsImNvbmZpZyIsImpzb24iLCJwcm9wQ29uZmlnIiwic2NvcmUiLCJtYXAiLCJyb3dOdW0iLCJwbGF5RmFsbEFjdGlvbiIsIm1vdmVCeSIsImJsb2NrV2lkdGgiLCJlYXNlQm91bmNlT3V0Iiwic2VxIiwiY2FsbEZ1bmMiLCJzY2FsZVgiLCJzY2FsZVkiLCJhbmltYXRpb25TcGVlZCIsImNsZWFyVGltZW91dCIsInN1cmZhY2VUaW1lciIsInN0b3BBbGxBY3Rpb25zIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJtb3ZlVG8iLCJ0YXJnZXQiLCJhY3Rpb24zIiwic3Bhd24iLCJzdXJmYWNlQWN0aW9uIiwiZGVsYSIsImdlbmVyYXRlUHJvcEFjdGlvbiIsImdlbmVyYXRlSXRlbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUlBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNQLGFBQVNELEVBQUUsQ0FBQ0UsU0FETDtBQUVQQyxFQUFBQSxVQUFVLEVBQUU7QUFDVkMsSUFBQUEsT0FBTyxFQUFFLENBREM7QUFDRTtBQUNaQyxJQUFBQSxTQUFTLEVBQUUsQ0FGRDtBQUVJO0FBQ2RDLElBQUFBLGFBQWEsRUFBRU4sRUFBRSxDQUFDTyxNQUhSO0FBSVZDLElBQUFBLFdBQVcsRUFBRVIsRUFBRSxDQUFDTztBQUpOLEdBRkw7QUFRUEUsRUFBQUEsSUFSTyxnQkFRRkMsQ0FSRSxFQVFDQyxJQVJELEVBUU9DLEtBUlAsRUFRY0MsUUFSZCxFQVF3QkMsR0FSeEIsRUFRNkI7QUFDbEMsU0FBS0MsS0FBTCxHQUFhTCxDQUFiO0FBQ0EsU0FBS04sT0FBTCxHQUFlLENBQWY7O0FBQ0EsUUFBSVUsR0FBSixFQUFTLENBQ1A7QUFDRDs7QUFDREEsSUFBQUEsR0FBRyxHQUFHQSxHQUFHLElBQUk7QUFDWEUsTUFBQUEsQ0FBQyxFQUFFTCxJQUFJLENBQUNLLENBREc7QUFFWEMsTUFBQUEsQ0FBQyxFQUFF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QWdQUGUsRUFBQUEsYUFoUE8seUJBZ1BPQyxJQWhQUCxFQWdQYTtBQUFBOztBQUNsQixTQUFLVixZQUFMLEdBQW9CM0MsVUFBVSxDQUFDLFlBQU07QUFDbkMsVUFBSWUsTUFBTSxHQUFHMUUsRUFBRSxDQUFDc0UsT0FBSCxDQUFXLE1BQU0sTUFBSSxDQUFDdkQsS0FBTCxDQUFXcUYsY0FBNUIsRUFBNEMsR0FBNUMsRUFBaUQsR0FBakQsQ0FBYjtBQUNBLFVBQUl2RCxPQUFPLEdBQUc3QyxFQUFFLENBQUNzRSxPQUFILENBQVcsTUFBTSxNQUFJLENBQUN2RCxLQUFMLENBQVdxRixjQUE1QixFQUE0QyxDQUE1QyxFQUErQyxDQUEvQyxDQUFkOztBQUNBLE1BQUEsTUFBSSxDQUFDMUUsSUFBTCxDQUFVa0QsU0FBVixDQUFvQjVFLEVBQUUsQ0FBQzJFLFFBQUgsQ0FBWUQsTUFBWixFQUFvQjdCLE9BQXBCLENBQXBCO0FBQ0QsS0FKNkIsRUFJM0JtRSxJQUoyQixDQUE5QjtBQUtELEdBdFBNO0FBdVBQQyxFQUFBQSxrQkF2UE8sZ0NBdVBjLENBRXBCLENBelBNO0FBMFBQQyxFQUFBQSxZQTFQTyx3QkEwUE12RSxJQTFQTixFQTBQWTtBQUNqQixTQUFLdEMsU0FBTCxHQUFpQnNDLElBQWpCO0FBQ0Q7QUE1UE0sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAYXV0aG9yIGhleXVjaGFuZ1xuICogQGZpbGUg5Y2V5Liq5pa55Z2X5o6n5Yi2XG4gKi9cbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgX3N0YXR1czogMCwgLy8x5Li65Y+v6Kem5Y+R54K55Ye7IDLkuLrlt7Lnu4/mtojlpLFcbiAgICBfaXRlbVR5cGU6IDAsIC8v5paw5aKe6YGT5YW35Yqf6IO9IDHkuLrlj4zlgI3lgI3mlbAgMuS4uueCuOW8uVxuICAgIHdhcm5pbmdTcHJpdGU6IGNjLlNwcml0ZSxcbiAgICBsaWdodFNwcml0ZTogY2MuU3ByaXRlLFxuICB9LFxuICBpbml0KGcsIGRhdGEsIHdpZHRoLCBpdGVtVHlwZSwgcG9zKSB7XG4gICAgdGhpcy5fZ2FtZSA9IGdcbiAgICB0aGlzLl9zdGF0dXMgPSAxXG4gICAgaWYgKHBvcykge1xuICAgICAgLy9jYy5sb2coJ+eUn+aIkOeahOaWueWdlycsIHBvcylcbiAgICB9XG4gICAgcG9zID0gcG9zIHx8IHtcbiAgICAgIHg6IGRhdGEueCxcbiAgICAgIHk6IGRhdGEueVxuICAgIH1cbiAgICB0aGlzLl9pdGVtVHlwZSA9IGl0ZW1UeXBlIHx8IDBcbiAgICB0aGlzLndhcm5pbmdUeXBlID0gMFxuICAgIHRoaXMuaXNQdXNoID0gZmFsc2VcbiAgICB0aGlzLmJpbmRFdmVudCgpXG4gICAgdGhpcy5jb2xvciA9IGRhdGEuY29sb3IgfHwgTWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiA0KVxuICAgIHRoaXMuY29sb3JTcHJpdGUgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ2NvbG9yJykuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSlcbiAgICB0aGlzLmNvbG9yU3ByaXRlLnNwcml0ZUZyYW1lID0gaXRlbVR5cGUgPyBnLnByb3BTcHJpdGVGcmFtZVsoaXRlbVR5cGUgLSAxKSAqIDQgKyB0aGlzLmNvbG9yIC0gMV0gOiB0aGlzLl9nYW1lLmJsb2NrU3ByaXRlW3RoaXMuY29sb3IgLSAxXVxuICAgIHRoaXMud2FybmluZ1Nwcml0ZS5zcHJpdGVGcmFtZSA9ICcnXG4gICAgdGhpcy5fd2lkdGggPSB3aWR0aFxuICAgIHRoaXMuX2NvbnRyb2xsZXIgPSBnLl9jb250cm9sbGVyXG4gICAgLy8g6K6h566X5a69XG4gICAgdGhpcy5saWdodFNwcml0ZS5ub2RlLmFjdGl2ZSA9IGZhbHNlXG4gICAgLy8gIHRoaXMubGlnaHRTcHJpdGUuc3ByaXRlRnJhbWUgPSB0aGlzLl9nYW1lLmJsb2NrU3ByaXRlW3RoaXMuY29sb3IgLSAxXVxuICAgIHRoaXMubm9kZS53aWR0aCA9IHRoaXMubm9kZS5oZWlnaHQgPSB3aWR0aFxuICAgIHRoaXMuc3RhcnRUaW1lID0gZGF0YS5zdGFydFRpbWVcbiAgICB0aGlzLmlpZCA9IGRhdGEueVxuICAgIHRoaXMuamlkID0gZGF0YS54XG4gICAgLy8gY29uc29sZS5sb2coJ+eUn+aIkOaWueWdl+S9jee9ricsIGRhdGEueSwgZGF0YS54KVxuICAgIHRoaXMubm9kZS54ID0gLSg3MzAgLyAyIC0gZy5nYXAgLSB3aWR0aCAvIDIpICsgcG9zLnggKiAod2lkdGggKyBnLmdhcClcbiAgICB0aGlzLm5vZGUueSA9ICg3MzAgLyAyIC0gZy5nYXAgLSB3aWR0aCAvIDIpIC0gcG9zLnkgKiAod2lkdGggKyBnLmdhcClcbiAgICB0aGlzLm5vZGUuYW5nbGUgPSAwXG4gICAgdGhpcy5wbGF5U3RhcnRBY3Rpb24oKVxuICB9LFxuICBvbldhcm5pbmcodHlwZSkge1xuICAgIHRoaXMud2FybmluZ1Nwcml0ZS5zcHJpdGVGcmFtZSA9IHRoaXMuX2dhbWUud2FybmluZ1Nwcml0ZUZyYW1lW3R5cGUgLSAxXSB8fCAnJ1xuICAgIHRoaXMud2FybmluZ1R5cGUgPSB0eXBlXG4gICAgLy8gICB0aGlzLmxpZ2h0U3ByaXRlLm5vZGUuYWN0aXZlID0gdHJ1ZVxuICAgIGxldCBhY3Rpb24xID0gY2MuYmxpbmsoMSwgMTApXG4gICAgLy8gICB0aGlzLmxpZ2h0U3ByaXRlLm5vZGUucnVuQWN0aW9uKGFjdGlvbjEpXG4gIH0sXG4gIHdhcm5pbmdJbml0KCkge1xuICAgIHRoaXMud2FybmluZ1Nwcml0ZS5zcHJpdGVGcmFtZSA9ICcnXG4gICAgLy8gIHRoaXMubGlnaHRTcHJpdGUubm9kZS5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMuaXNQdXNoID0gZmFsc2VcbiAgfSxcbiAgZ3Jvd0luaXQoKSB7XG4gICAgdGhpcy5ncm93VHlwZSA9IDBcbiAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUuaGVpZ2h0ID0gdGhpcy5jb2xvclNwcml0ZS5ub2RlLndpZHRoID0gdGhpcy5fd2lkdGhcbiAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUueSA9IHRoaXMuY29sb3JTcHJpdGUubm9kZS54ID0gMFxuICB9LFxuICBncm93KHR5cGUpIHsgLy8xMjM0IOS4iuS4i+W3puWPs1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICBpZiAodGhpcy5ncm93VHlwZSAhPSAyKSB7XG4gICAgICAgICAgdGhpcy5jb2xvclNwcml0ZS5ub2RlLmhlaWdodCArPSB0aGlzLl9nYW1lLmdhcCAqIDJcbiAgICAgICAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUueSArPSB0aGlzLl9nYW1lLmdhcFxuICAgICAgICAgIHRoaXMuZ3Jvd1R5cGUgPSAxXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaWYgKHRoaXMuZ3Jvd1R5cGUgIT0gMikge1xuICAgICAgICAgIHRoaXMuY29sb3JTcHJpdGUubm9kZS5oZWlnaHQgKz0gdGhpcy5fZ2FtZS5nYXAgKiAyXG4gICAgICAgICAgdGhpcy5jb2xvclNwcml0ZS5ub2RlLnkgLT0gdGhpcy5fZ2FtZS5nYXBcbiAgICAgICAgICB0aGlzLmdyb3dUeXBlID0gMVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDM6XG4gICAgICAgIGlmICh0aGlzLmdyb3dUeXBlICE9IDEpIHtcbiAgICAgICAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUud2lkdGggKz0gdGhpcy5fZ2FtZS5nYXAgKiAyXG4gICAgICAgICAgdGhpcy5jb2xvclNwcml0ZS5ub2RlLnggLT0gdGhpcy5fZ2FtZS5nYXBcbiAgICAgICAgICB0aGlzLmdyb3dUeXBlID0gMlxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDQ6XG4gICAgICAgIGlmICh0aGlzLmdyb3dUeXBlICE9IDEpIHtcbiAgICAgICAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUud2lkdGggKz0gdGhpcy5fZ2FtZS5nYXAgKiAyXG4gICAgICAgICAgdGhpcy5jb2xvclNwcml0ZS5ub2RlLnggKz0gdGhpcy5fZ2FtZS5nYXBcbiAgICAgICAgICB0aGlzLmdyb3dUeXBlID0gMlxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9LFxuICBiaW5kRXZlbnQoKSB7XG4gICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm9uVG91Y2hlZCwgdGhpcylcblxuICB9LFxuICAvLyDnlKjmiLfngrnlh7sg5oiW6ICF6KKr5YW25LuW5pa55Z2X6Kem5Y+RXG4gIG9uVG91Y2hlZChjb2xvciwgaXNDaGFpbiwgaXNCb21iLCB0aW1lKSB7IC8v6YGT5YW35paw5aKe5Y+C5pWwIGlzQ2hhaW7mmK/lkKbov57plIEgaXNCb21i5piv5ZCm5by65Yi25raI6ZmkXG4gICAgaWYgKHRpbWUpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLm9uVG91Y2hlZChjb2xvciwgZmFsc2UsIGlzQm9tYilcbiAgICAgIH0sIHRpbWUpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaXNDaGFpbiA9IEpTT04uc3RyaW5naWZ5KGlzQ2hhaW4pID09ICdudWxsJyA/IHRydWUgOiBpc0NoYWluXG4gICAgaXNCb21iID0gaXNCb21iID8gaXNCb21iIDogZmFsc2VcbiAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICAvLyDniIbngrjop6blj5FcbiAgICBpZiAodGhpcy5fc3RhdHVzID09IDEgJiYgaXNCb21iID09IHRydWUpIHtcbiAgICAgIHRoaXMuX3N0YXR1cyA9IDJcbiAgICAgIHRoaXMucGxheURpZUFjdGlvbigpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLm9uQmxvY2tQb3AoY29sb3IsIGlzQ2hhaW4sIGlzQm9tYilcbiAgICAgIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoY29sb3IudHlwZSkge1xuICAgICAgLy8g5LiA5a6a5piv55So5oi35Li75Yqo6Kem5Y+RIOS/neWtmOi/meS4quWdkOagh+e7mWdhbWVcbiAgICAgIGlmICh0aGlzLmlzU2luZ2xlICYmIHRoaXMuX2l0ZW1UeXBlIDw9IDEpIHtcbiAgICAgICAgdGhpcy5ub2RlLnNjYWxlID0gMVxuICAgICAgICB0aGlzLl9nYW1lLl9zY29yZS50aXBCb3guaW5pdCh0aGlzLl9nYW1lLl9zY29yZSwgMylcbiAgICAgICAgbGV0IGFjdGlvbjEgPSBjYy5zY2FsZVRvKDAuMSwgMS4xLCAwLjkpXG4gICAgICAgIGxldCBhY3Rpb24yID0gY2Muc2NhbGVUbygwLjMsIDEpLmVhc2luZyhjYy5lYXNlQmFja091dCgyLjApKVxuICAgICAgICBsZXQgYWN0aW9uID0gY2Muc2VxdWVuY2UoYWN0aW9uMSwgYWN0aW9uMilcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihhY3Rpb24pXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgLy8gY29uc29sZS5sb2coJ+aWueWdl+S9jee9ricsIHRoaXMuaWlkLCB0aGlzLmppZCwgdGhpcy5faXRlbVR5cGUpXG4gICAgICBjb2xvciA9IHRoaXMuY29sb3JcbiAgICAgIGlmICh0aGlzLl9zdGF0dXMgPT0gMSAmJiB0aGlzLl9nYW1lLl9zdGF0dXMgPT0gMSAmJiB0aGlzLmNvbG9yID09IGNvbG9yKSB7XG4gICAgICAgIHRoaXMuX2dhbWUub25Vc2VyVG91Y2hlZCh0aGlzLmlpZCwgdGhpcy5qaWQsIHRoaXMuX2l0ZW1UeXBlLCB0aGlzLmNvbG9yLCB0aGlzLndhcm5pbmdUeXBlLCB7XG4gICAgICAgICAgeDogdGhpcy5ub2RlLngsXG4gICAgICAgICAgeTogdGhpcy5ub2RlLnlcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5fZ2FtZS5fc2NvcmUub25TdGVwKC0xKS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlEaWVBY3Rpb24oKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5vbkJsb2NrUG9wKGNvbG9yLCBudWxsLCBudWxsKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOeUseWFtuS7luaWueWdl+inpuWPkVxuICAgICAgaWYgKHRoaXMuX3N0YXR1cyA9PSAxICYmIHRoaXMuX2dhbWUuX3N0YXR1cyA9PSA1ICYmIHRoaXMuY29sb3IgPT0gY29sb3IpIHtcbiAgICAgICAgdGhpcy5wbGF5RGllQWN0aW9uKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5vbkJsb2NrUG9wKGNvbG9yLCBudWxsLCBudWxsKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgb25CbG9ja1BvcChjb2xvciwgaXNDaGFpbiwgaXNCb21iKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgaXNDaGFpbiA9IEpTT04uc3RyaW5naWZ5KGlzQ2hhaW4pID09ICdudWxsJyA/IHRydWUgOiBpc0NoYWluXG4gICAgaXNCb21iID0gaXNCb21iID8gaXNCb21iIDogZmFsc2VcbiAgICBzZWxmLl9nYW1lLmNoZWNrTmVlZEZhbGwoKVxuICAgIHNlbGYuX2dhbWUuX3N0YXR1cyA9IDVcbiAgICBzZWxmLl9jb250cm9sbGVyLm11c2ljTWFuYWdlci5vblBsYXlBdWRpbygwXG4gICAgICAvL3NlbGYuX2dhbWUuX3Njb3JlLmNoYWluIC0gMVxuICAgIClcbiAgICBpZiAodGhpcy5faXRlbVR5cGUgIT0gMCkge1xuICAgICAgLy8gY29uc29sZS5sb2coXCLop6blj5HkuobpgZPlhbdcIiwgdGhpcy5faXRlbVR5cGUpXG5cbiAgICAgIHNlbGYuX2dhbWUub25JdGVtKHRoaXMuX2l0ZW1UeXBlLCBjb2xvciwge1xuICAgICAgICB4OiB0aGlzLm5vZGUueCxcbiAgICAgICAgeTogdGhpcy5ub2RlLnlcbiAgICAgIH0pXG4gICAgfVxuICAgIHNlbGYuX2dhbWUuX3Njb3JlLmFkZFNjb3JlKGNjLnYyKHRoaXMubm9kZS54LCB0aGlzLm5vZGUueSAtIHRoaXMubm9kZS53aWR0aCArIHRoaXMuX2dhbWUuZ2FwKSwgdGhpcy5faXRlbVR5cGUgPT0gMyA/IHRoaXMuX2dhbWUuX2NvbnRyb2xsZXIuY29uZmlnLmpzb24ucHJvcENvbmZpZ1syXS5zY29yZSA6IG51bGwpXG5cbiAgICAvLyDov57plIHnirbmgIFcbiAgICBpZiAoaXNDaGFpbikge1xuICAgICAgaWYgKChzZWxmLmlpZCAtIDEpID49IDApIHtcbiAgICAgICAgc2VsZi5fZ2FtZS5tYXBbc2VsZi5paWQgLSAxXVtzZWxmLmppZF0uZ2V0Q29tcG9uZW50KCdlbGVtZW50Jykub25Ub3VjaGVkKGNvbG9yKVxuICAgICAgfVxuICAgICAgaWYgKChzZWxmLmlpZCArIDEpIDwgdGhpcy5fZ2FtZS5yb3dOdW0pIHtcbiAgICAgICAgc2VsZi5fZ2FtZS5tYXBbc2VsZi5paWQgKyAxXVtzZWxmLmppZF0uZ2V0Q29tcG9uZW50KCdlbGVtZW50Jykub25Ub3VjaGVkKGNvbG9yKVxuICAgICAgfVxuICAgICAgaWYgKChzZWxmLmppZCAtIDEpID49IDApIHtcbiAgICAgICAgc2VsZi5fZ2FtZS5tYXBbc2VsZi5paWRdW3NlbGYuamlkIC0gMV0uZ2V0Q29tcG9uZW50KCdlbGVtZW50Jykub25Ub3VjaGVkKGNvbG9yKVxuICAgICAgfVxuICAgICAgaWYgKChzZWxmLmppZCArIDEpIDwgdGhpcy5fZ2FtZS5yb3dOdW0pIHtcbiAgICAgICAgc2VsZi5fZ2FtZS5tYXBbc2VsZi5paWRdW3NlbGYuamlkICsgMV0uZ2V0Q29tcG9uZW50KCdlbGVtZW50Jykub25Ub3VjaGVkKGNvbG9yKVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcGxheUZhbGxBY3Rpb24oeSwgZGF0YSkgeyAvL+S4i+mZjeS6huWHoOS4quagvOWtkFxuICAgIHRoaXMuX3N0YXR1cyA9IDBcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5paWQgPSBkYXRhLnlcbiAgICAgIHRoaXMuamlkID0gZGF0YS54XG4gICAgfVxuICAgIGxldCBhY3Rpb24gPSBjYy5tb3ZlQnkoMC4yNSwgMCwgLXkgKiAodGhpcy5fZ2FtZS5nYXAgKyB0aGlzLl9nYW1lLmJsb2NrV2lkdGgpKS5lYXNpbmcoY2MuZWFzZUJvdW5jZU91dCg1IC8geSkpIC8vMSAqIHkgLyB0aGlzLl9nYW1lLmFuaW1hdGlvblNwZWVkXG4gICAgbGV0IHNlcSA9IGNjLnNlcXVlbmNlKGFjdGlvbiwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgdGhpcy5fc3RhdHVzID0gMVxuICAgICAgLy8gIHRoaXMuX2dhbWUuY2hlY2tOZWVkR2VuZXJhdG9yKClcbiAgICB9LCB0aGlzKSlcbiAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSlcbiAgfSxcbiAgcGxheVN0YXJ0QWN0aW9uKCkge1xuICAgIHRoaXMubm9kZS5zY2FsZVggPSAwXG4gICAgdGhpcy5ub2RlLnNjYWxlWSA9IDBcbiAgICBsZXQgYWN0aW9uID0gY2Muc2NhbGVUbygwLjggLyB0aGlzLl9nYW1lLmFuaW1hdGlvblNwZWVkLCAxLCAxKS5lYXNpbmcoY2MuZWFzZUJhY2tPdXQoKSlcbiAgICBsZXQgc2VxID0gY2Muc2VxdWVuY2UoYWN0aW9uLCBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICB0aGlzLl9zdGF0dXMgPSAxXG4gICAgfSwgdGhpcykpXG4gICAgLy8g5aaC5p6c5pyJ5bu26L+f5pe26Ze05bCx55So5bu26L+f5pe26Ze0XG4gICAgaWYgKHRoaXMuc3RhcnRUaW1lKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSlcbiAgICAgICAgfSwgdGhpcy5zdGFydFRpbWUgLyAxXG4gICAgICAgIC8vIChjYy5nYW1lLmdldEZyYW1lUmF0ZSgpIC8gNjApXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oc2VxKVxuICAgIH1cbiAgfSxcbiAgcGxheURpZUFjdGlvbigpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICBjbGVhclRpbWVvdXQodGhpcy5zdXJmYWNlVGltZXIpXG4gICAgdGhpcy5ub2RlLnN0b3BBbGxBY3Rpb25zKClcbiAgICB0aGlzLl9zdGF0dXMgPSAyXG4gICAgdGhpcy5ub2RlLnNjYWxlWCA9IDFcbiAgICB0aGlzLm5vZGUuc2NhbGVZID0gMVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgYWN0aW9uXG4gICAgICBpZiAodGhpcy53YXJuaW5nU3ByaXRlLnNwcml0ZUZyYW1lKSB7IC8v5pyJ6YGT5YW36aKE6K2mXG4gICAgICAgIGxldCBhY3Rpb24xID0gY2Muc2NhbGVUbygwLjIgLyBzZWxmLl9nYW1lLmFuaW1hdGlvblNwZWVkLCAxLjEpXG4gICAgICAgIGxldCBhY3Rpb24yID0gY2MubW92ZVRvKDAuMiAvIHNlbGYuX2dhbWUuYW5pbWF0aW9uU3BlZWQsIHRoaXMuX2dhbWUudGFyZ2V0LngsIHRoaXMuX2dhbWUudGFyZ2V0LnkpXG4gICAgICAgIGxldCBhY3Rpb24zID0gY2Muc2NhbGVUbygwLjIsIDApXG4gICAgICAgIHZhciBzZXEgPSBjYy5zZXF1ZW5jZShhY3Rpb24xLCBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSgnJylcbiAgICAgICAgfSwgdGhpcyksIGNjLnNwYXduKGFjdGlvbjIsIGFjdGlvbjMpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWN0aW9uID0gY2Muc2NhbGVUbygwLjIgLyBzZWxmLl9nYW1lLmFuaW1hdGlvblNwZWVkLCAwLCAwKVxuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoYWN0aW9uLCBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSgnJylcbiAgICAgICAgfSwgdGhpcykpXG4gICAgICB9XG4gICAgICBzZWxmLm5vZGUucnVuQWN0aW9uKHNlcSlcbiAgICB9KTtcbiAgfSxcbiAgc3VyZmFjZUFjdGlvbihkZWxhKSB7XG4gICAgdGhpcy5zdXJmYWNlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGxldCBhY3Rpb24gPSBjYy5zY2FsZVRvKDAuNCAvIHRoaXMuX2dhbWUuYW5pbWF0aW9uU3BlZWQsIDAuOCwgMC44KVxuICAgICAgbGV0IGFjdGlvbjEgPSBjYy5zY2FsZVRvKDAuNCAvIHRoaXMuX2dhbWUuYW5pbWF0aW9uU3BlZWQsIDEsIDEpXG4gICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGFjdGlvbiwgYWN0aW9uMSkpXG4gICAgfSwgZGVsYSlcbiAgfSxcbiAgZ2VuZXJhdGVQcm9wQWN0aW9uKCkge1xuXG4gIH0sXG4gIGdlbmVyYXRlSXRlbSh0eXBlKSB7XG4gICAgdGhpcy5faXRlbVR5cGUgPSB0eXBlXG4gIH0sXG59KTsiXX0=
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
    this.mapLength = g.rowNum;

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
    var propConfig = g._controller.config.json.propConfig;
    this._game = g;
    this.map = g.map;
    this.mapLength = g.rowNum;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxlbGVtZW50Q2hlY2suanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJncm91cHMiLCJtYXAiLCJtYXBMZW5ndGgiLCJpbml0IiwiZyIsIl9nYW1lIiwicm93TnVtIiwiaSIsImoiLCJnZXRDb21wb25lbnQiLCJpc1NpbmdsZSIsIndhcm5pbmdJbml0IiwiZWxlbWVudENoZWNrIiwicHJvcENvbmZpZyIsIl9jb250cm9sbGVyIiwiY29uZmlnIiwianNvbiIsIm1pbiIsImxlbmd0aCIsInB1c2hQb3AiLCJ0YXJnZXQiLCJ4IiwiaWlkIiwieSIsImppZCIsImNvbG9yIiwiY29uc29sZSIsImxvZyIsInoiLCJtYXgiLCJ3YXJuaW5nIiwidHlwZSIsImlzUHVzaCIsInB1c2giLCJncm91cCIsIml0ZW0iLCJvbldhcm5pbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFJQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFFUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLE1BQU0sRUFBRSxFQURFO0FBRVZDLElBQUFBLEdBQUcsRUFBRSxFQUZLO0FBR1ZDLElBQUFBLFNBQVMsRUFBRTtBQUhELEdBRkw7QUFPUEMsRUFBQUEsSUFQTyxnQkFPRkMsQ0FQRSxFQU9DO0FBQ04sU0FBS0MsS0FBTCxHQUFhRCxDQUFiO0FBQ0EsU0FBS0gsR0FBTCxHQUFXRyxDQUFDLENBQUNILEdBQWI7QUFDQSxTQUFLQyxTQUFMLEdBQWlCRSxDQUFDLENBQUNFLE1BQW5COztBQUNBLFNBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLTCxTQUF6QixFQUFvQ0ssQ0FBQyxFQUFyQyxFQUF5QztBQUFFO0FBQ3pDLFdBQUtQLE1BQUwsQ0FBWU8sQ0FBWixJQUFpQixFQUFqQjs7QUFDQSxXQUFLLElBQUlD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QVlFLENBQUMsR0FBRyxDQUFoQixDQUFiLEVBQWlDaEIsQ0FBakMsRUFBb0NDLENBQXBDO0FBQ0Q7QUFDRjs7QUFDRCxRQUFLZSxDQUFDLEdBQUcsQ0FBTCxHQUFVLEtBQUtyQixTQUFuQixFQUE4QjtBQUM1QixVQUFJLENBQUMsS0FBS0QsR0FBTCxDQUFTb0IsQ0FBVCxFQUFZRSxDQUFDLEdBQUcsQ0FBaEIsRUFBbUJkLFlBQW5CLENBQWdDLFNBQWhDLEVBQTJDdUIsTUFBNUMsSUFBc0QsS0FBSy9CLEdBQUwsQ0FBU29CLENBQVQsRUFBWUUsQ0FBQyxHQUFHLENBQWhCLEVBQW1CZCxZQUFuQixDQUFnQyxTQUFoQyxFQUEyQ2dCLEtBQTNDLElBQW9ETCxNQUFNLENBQUNYLFlBQVAsQ0FBb0IsU0FBcEIsRUFBK0JnQixLQUE3SSxFQUFvSjtBQUNsSixhQUFLTixPQUFMLENBQWEsS0FBS2xCLEdBQUwsQ0FBU29CLENBQVQsRUFBWUUsQ0FBQyxHQUFHLENBQWhCLENBQWIsRUFBaUNoQixDQUFqQyxFQUFvQ0MsQ0FBcEM7QUFDRDtBQUNGLEtBM0JtQixDQTZCcEI7O0FBRUQsR0FoR007QUFpR1BzQixFQUFBQSxPQWpHTyxtQkFpR0NDLElBakdELEVBaUdPRyxLQWpHUCxFQWlHYztBQUNuQkEsSUFBQUEsS0FBSyxDQUFDakMsR0FBTixDQUFVLFVBQUFrQyxJQUFJLEVBQUk7QUFDaEJBLE1BQUFBLElBQUksQ0FBQzFCLFlBQUwsQ0FBa0IsU0FBbEIsRUFBNkIyQixTQUE3QixDQUF1Q0wsSUFBdkM7QUFDRCxLQUZEO0FBR0Q7QUFyR00sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAYXV0aG9yIGhleXVjaGFuZ1xuICogQGZpbGUg5qOA5rWL57uE5Lu2XG4gKi9cbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgZ3JvdXBzOiBbXSxcbiAgICBtYXA6IFtdLFxuICAgIG1hcExlbmd0aDogOFxuICB9LFxuICBpbml0KGcpIHtcbiAgICB0aGlzLl9nYW1lID0gZ1xuICAgIHRoaXMubWFwID0gZy5tYXBcbiAgICB0aGlzLm1hcExlbmd0aCA9IGcucm93TnVtXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1hcExlbmd0aDsgaSsrKSB7IC8v6KGMXG4gICAgICB0aGlzLmdyb3Vwc1tpXSA9IFtdXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMubWFwTGVuZ3RoOyBqKyspIHsgLy/liJdcbiAgICAgICAgLy8gdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuZ3Jvd0luaXQoKSAvL+WFqOmDqOWIneWni+WMllxuICAgICAgICBpZiAoIXRoaXMubWFwW2ldW2pdKSB7XG4gICAgICAgICAgLy8gICAgY2MubG9nKCfmiqXplJl4LHk6JywgaSwgailcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5pc1NpbmdsZSA9IGZhbHNlXG4gICAgICAgIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLndhcm5pbmdJbml0KClcbiAgICAgICAgdGhpcy5ncm91cHNbaV1bal0gPSBbXVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgZWxlbWVudENoZWNrKGcpIHsgLy/or6Xlh73mlbDkuLvopoHnlKjkuo7mo4DmtYvkuIDkuKrljLrlnZfog73lkKblvaLmiJDpgZPlhbfnrYlcbiAgICBsZXQgcHJvcENvbmZpZyA9IGcuX2NvbnRyb2xsZXIuY29uZmlnLmpzb24ucHJvcENvbmZpZ1xuICAgIHRoaXMuX2dhbWUgPSBnXG4gICAgdGhpcy5tYXAgPSBnLm1hcFxuICAgIHRoaXMubWFwTGVuZ3RoID0gZy5yb3dOdW1cbiAgICBsZXQgbWluID0gOTk5XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wQ29uZmlnLmxlbmd0aDsgaSsrKSB7XG4gICAgICBtaW4gPSBwcm9wQ29uZmlnW2ldLm1pbiA8IG1pbiA/IHByb3BDb25maWdbaV0ubWluIDogbWluXG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5tYXBMZW5ndGg7IGkrKykgeyAvL+ihjFxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLm1hcExlbmd0aDsgaisrKSB7IC8v5YiXXG4gICAgICAgIHRoaXMucHVzaFBvcCh0aGlzLm1hcFtpXVtqXSwgaSwgailcbiAgICAgICAgbGV0IHRhcmdldCA9IHRoaXMubWFwW2ldW2pdXG4gICAgICAgIGxldCB4ID0gdGFyZ2V0LmdldENvbXBvbmVudCgnZWxlbWVudCcpLmlpZFxuICAgICAgICBsZXQgeSA9IHRhcmdldC5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5qaWRcbiAgICAgICAgbGV0IGlzU2luZ2xlID0gdHJ1ZVxuICAgICAgICBpZiAoKHggLSAxKSA+PSAwICYmIHRoaXMubWFwW3ggLSAxXVt5XS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvciA9PSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IpIHtcbiAgICAgICAgICBpc1NpbmdsZSA9IGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCh4ICsgMSkgPCB0aGlzLm1hcExlbmd0aCAmJiB0aGlzLm1hcFt4ICsgMV1beV0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IgPT0gdGFyZ2V0LmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yKSB7XG4gICAgICAgICAgaXNTaW5nbGUgPSBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCh5IC0gMSkgPj0gMCAmJiB0aGlzLm1hcFt4XVt5IC0gMV0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IgPT0gdGFyZ2V0LmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yKSB7XG4gICAgICAgICAgaXNTaW5nbGUgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGlmICgoeSArIDEpIDwgdGhpcy5tYXBMZW5ndGggJiYgdGhpcy5tYXBbeF1beSArIDFdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmNvbG9yID09IHRhcmdldC5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvcikge1xuICAgICAgICAgIGlzU2luZ2xlID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5pc1NpbmdsZSA9IGlzU2luZ2xlXG4gICAgICAgIGNvbnNvbGUubG9nKGksIGosIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnZWxlbWVudCcpLmlzU2luZ2xlLCB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvcilcbiAgICAgICAgaWYgKHRoaXMuZ3JvdXBzW2ldW2pdLmxlbmd0aCA+PSBtaW4pIHtcbiAgICAgICAgICBmb3IgKGxldCB6ID0gMDsgeiA8IHByb3BDb25maWcubGVuZ3RoOyB6KyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdyb3Vwc1tpXVtqXS5sZW5ndGggPD0gcHJvcENvbmZpZ1t6XS5tYXggJiYgdGhpcy5ncm91cHNbaV1bal0ubGVuZ3RoID49IHByb3BDb25maWdbel0ubWluKSB7XG4gICAgICAgICAgICAgIHRoaXMud2FybmluZyhwcm9wQ29uZmlnW3pdLnR5cGUsIHRoaXMuZ3JvdXBzW2ldW2pdKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcHVzaFBvcCh0YXJnZXQsIGksIGopIHsgLy/nlKjkuo7liKTmlq3kuIDkuKrmlrnlnZflm5vkuKrmlrnlkJHkuIrnmoTmlrnlnZfpopzoibLmmK/lkKbkuIDmoLcg5aaC5p6c5LiA5qC35YiZ5Yqg5YWl57uEIOWmguaenOe7hOmVv+W6puWwj+S6jjHliJnov5Tlm55mYWxzZT9cbiAgICAvLyBpZiAodGFyZ2V0LmdldENvbXBvbmVudCgnZWxlbWVudCcpLmlzUHVzaD09dHJ1ZSkge1xuICAgIC8vICAgcmV0dXJuXG4gICAgLy8gfVxuICAgIHRhcmdldC5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5pc1B1c2ggPSB0cnVlXG4gICAgdGhpcy5ncm91cHNbaV1bal0ucHVzaCh0YXJnZXQpXG4gICAgbGV0IHggPSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuaWlkXG4gICAgbGV0IHkgPSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuamlkXG4gICAgaWYgKCh4IC0gMSkgPj0gMCkge1xuICAgICAgaWYgKCF0aGlzLm1hcFt4IC0gMV1beV0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuaXNQdXNoICYmIHRoaXMubWFwW3ggLSAxXVt5XS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvciA9PSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IpIHtcbiAgICAgICAgdGhpcy5wdXNoUG9wKHRoaXMubWFwW3ggLSAxXVt5XSwgaSwgailcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCh4ICsgMSkgPCB0aGlzLm1hcExlbmd0aCkge1xuICAgICAgaWYgKCF0aGlzLm1hcFt4ICsgMV1beV0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuaXNQdXNoICYmIHRoaXMubWFwW3ggKyAxXVt5XS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvciA9PSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IpIHtcbiAgICAgICAgdGhpcy5wdXNoUG9wKHRoaXMubWFwW3ggKyAxXVt5XSwgaSwgailcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCh5IC0gMSkgPj0gMCkge1xuICAgICAgaWYgKCF0aGlzLm1hcFt4XVt5IC0gMV0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuaXNQdXNoICYmIHRoaXMubWFwW3hdW3kgLSAxXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvciA9PSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IpIHtcbiAgICAgICAgdGhpcy5wdXNoUG9wKHRoaXMubWFwW3hdW3kgLSAxXSwgaSwgailcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCh5ICsgMSkgPCB0aGlzLm1hcExlbmd0aCkge1xuICAgICAgaWYgKCF0aGlzLm1hcFt4XVt5ICsgMV0uZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuaXNQdXNoICYmIHRoaXMubWFwW3hdW3kgKyAxXS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5jb2xvciA9PSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdlbGVtZW50JykuY29sb3IpIHtcbiAgICAgICAgdGhpcy5wdXNoUG9wKHRoaXMubWFwW3hdW3kgKyAxXSwgaSwgailcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDliKTmlq3mlrnlnZfmmK/lkKbljZXouqtcblxuICB9LFxuICB3YXJuaW5nKHR5cGUsIGdyb3VwKSB7XG4gICAgZ3JvdXAubWFwKGl0ZW0gPT4ge1xuICAgICAgaXRlbS5nZXRDb21wb25lbnQoJ2VsZW1lbnQnKS5vbldhcm5pbmcodHlwZSlcbiAgICB9KVxuICB9XG59KTsiXX0=
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
    this._controller = c;

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
    var data = this._controller.gameData.json.levelData[+level - 1];

    var heightScore = this._controller.social.getHighestScore();

    this.avatar.getChildByName('name').getComponent(cc.Label).string = '历史最高:' + data.name;
    this.avatar.getChildByName('score').getComponent(cc.Label).string = '分数' + heightScore;
    setTimeout(function () {
      _this._controller.scoreMgr.characterMgr.showAvatarCharacter(+level, _this.avatar.getChildByName('db'));
    }, 1000);
  },
  loadContainer: function loadContainer(level) {
    var _this2 = this;

    var data = this._controller.gameData.json.levelData;
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

      this._controller.scoreMgr.characterMgr.showCharacter(level + 1, card.getChildByName('db'));
    } else {
      card.getChildByName('name').getComponent(cc.Label).string = '???';
      card.getChildByName('giftStep').getComponent(cc.Label).string = "开局奖励???步";
      card.getChildByName('db').color = cc.Color.BLACK;

      this._controller.scoreMgr.characterMgr.showCharacter(level + 1, card.getChildByName('db'), cc.Color.BLACK);
    } // this._controller.scoreMgr.characterMgr.showCharacter(level + 1, card.getChildByName('db'), 0)

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxpbGx1c3RyYXRpdmUuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJjb250YWluZXIiLCJOb2RlIiwiYXZhdGFyIiwicHJlZmFiIiwiUHJlZmFiIiwiaW5pdCIsImMiLCJfY29udHJvbGxlciIsInNvY2lhbCIsIm5vZGUiLCJhY3RpdmUiLCJoaWdoTGV2ZWwiLCJnZXRIaWdoZXN0TGV2ZWwiLCJzaG93QXZhdGFyIiwibG9hZENvbnRhaW5lciIsImxldmVsIiwiZGF0YSIsImdhbWVEYXRhIiwianNvbiIsImxldmVsRGF0YSIsImhlaWdodFNjb3JlIiwiZ2V0SGlnaGVzdFNjb3JlIiwiZ2V0Q2hpbGRCeU5hbWUiLCJnZXRDb21wb25lbnQiLCJMYWJlbCIsInN0cmluZyIsIm5hbWUiLCJzZXRUaW1lb3V0Iiwic2NvcmVNZ3IiLCJjaGFyYWN0ZXJNZ3IiLCJzaG93QXZhdGFyQ2hhcmFjdGVyIiwiY2xlYXJDb250YWluZXIiLCJpIiwibGVuZ3RoIiwiY2FyZCIsImluc3RhbnRpYXRlIiwicGFyZW50IiwiaW5pdENhcmQiLCJjaGlsZHJlbiIsIm1hcCIsIml0ZW0iLCJkZXN0cm95IiwiaW5mbyIsInNlbGZMZXZlbCIsImNvbG9yIiwiQ29sb3IiLCJXSElURSIsImdpZnRTdGVwIiwic2hvd0NoYXJhY3RlciIsIkJMQUNLIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7QUFHQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFFUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLFNBQVMsRUFBRUosRUFBRSxDQUFDSyxJQURKO0FBRVZDLElBQUFBLE1BQU0sRUFBRU4sRUFBRSxDQUFDSyxJQUZEO0FBR1ZFLElBQUFBLE1BQU0sRUFBRVAsRUFBRSxDQUFDUTtBQUhELEdBRkw7QUFPUEMsRUFBQUEsSUFQTyxnQkFPRkMsQ0FQ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QUF2QyxDQUFxRGpDLEtBQUssR0FBRyxDQUE3RCxFQUFnRW1CLElBQUksQ0FBQ1osY0FBTCxDQUFvQixJQUFwQixDQUFoRSxFQUEyRjFCLEVBQUUsQ0FBQ2lELEtBQUgsQ0FBU0ksS0FBcEc7QUFDRCxLQVpvQyxDQWFyQzs7QUFDRDtBQS9ETSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBhdXRob3IgaGV5dWNoYW5nXG4gKi9cbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgY29udGFpbmVyOiBjYy5Ob2RlLFxuICAgIGF2YXRhcjogY2MuTm9kZSxcbiAgICBwcmVmYWI6IGNjLlByZWZhYixcbiAgfSxcbiAgaW5pdChjKSB7XG4gICAgdGhpcy5fY29udHJvbGxlciA9IGNcblxuICAgIGlmIChjLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgbGV0IGhpZ2hMZXZlbCA9IGMuc29jaWFsLmdldEhpZ2hlc3RMZXZlbCgpXG4gICAgICBpZiAoaGlnaExldmVsKSB7XG4gICAgICAgIHRoaXMuc2hvd0F2YXRhcihoaWdoTGV2ZWwpXG4gICAgICAgIHRoaXMubG9hZENvbnRhaW5lcigraGlnaExldmVsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hdmF0YXIuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgdGhpcy5sb2FkQ29udGFpbmVyKDEpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXZhdGFyLmFjdGl2ZSA9IGZhbHNlXG4gICAgfVxuICB9LFxuICBzaG93QXZhdGFyKGxldmVsKSB7XG4gICAgdGhpcy5hdmF0YXIuYWN0aXZlID0gdHJ1ZVxuICAgIGxldCBkYXRhID0gdGhpcy5fY29udHJvbGxlci5nYW1lRGF0YS5qc29uLmxldmVsRGF0YVsrbGV2ZWwgLSAxXVxuICAgIGxldCBoZWlnaHRTY29yZSA9IHRoaXMuX2NvbnRyb2xsZXIuc29jaWFsLmdldEhpZ2hlc3RTY29yZSgpXG4gICAgdGhpcy5hdmF0YXIuZ2V0Q2hpbGRCeU5hbWUoJ25hbWUnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9ICfljoblj7LmnIDpq5g6JyArIGRhdGEubmFtZVxuICAgIHRoaXMuYXZhdGFyLmdldENoaWxkQnlOYW1lKCdzY29yZScpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gJ+WIhuaVsCcgKyBoZWlnaHRTY29yZVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fY29udHJvbGxlci5zY29yZU1nci5jaGFyYWN0ZXJNZ3Iuc2hvd0F2YXRhckNoYXJhY3RlcigrbGV2ZWwsIHRoaXMuYXZhdGFyLmdldENoaWxkQnlOYW1lKCdkYicpKVxuICAgIH0sIDEwMDApXG4gIH0sXG4gIGxvYWRDb250YWluZXIobGV2ZWwpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuX2NvbnRyb2xsZXIuZ2FtZURhdGEuanNvbi5sZXZlbERhdGFcbiAgICB0aGlzLmNsZWFyQ29udGFpbmVyKClcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMucHJlZmFiKVxuICAgICAgICBjYXJkLnBhcmVudCA9IHRoaXMuY29udGFpbmVyXG4gICAgICAgIHRoaXMuaW5pdENhcmQoY2FyZCwgZGF0YVtpXSwgaSwgbGV2ZWwpXG4gICAgICB9XG4gICAgfSwgMTAwMClcbiAgfSxcbiAgY2xlYXJDb250YWluZXIoKSB7XG4gICAgdGhpcy5jb250YWluZXIuY2hpbGRyZW4ubWFwKGl0ZW0gPT4ge1xuICAgICAgaXRlbS5kZXN0cm95KClcbiAgICB9KVxuICB9LFxuICBpbml0Q2FyZChjYXJkLCBpbmZvLCBsZXZlbCwgc2VsZkxldmVsKSB7XG4gICAgaWYgKGxldmVsIDwgc2VsZkxldmVsKSB7XG4gICAgICBjYXJkLmdldENoaWxkQnlOYW1lKCduYW1lJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBpbmZvLm5hbWVcbiAgICAgIC8vY2FyZC5nZXRDaGlsZEJ5TmFtZSgnc2NvcmUnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IFwi5b6X5YiGOlwiICsgaW5mby5zY29yZVxuICAgICAgY2FyZC5nZXRDaGlsZEJ5TmFtZSgnZGInKS5jb2xvciA9IGNjLkNvbG9yLldISVRFXG4gICAgICBjYXJkLmdldENoaWxkQnlOYW1lKCdnaWZ0U3RlcCcpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCLlvIDlsYDlpZblirFcIiArIGluZm8uZ2lmdFN0ZXAgKyBcIuatpVwiXG4gICAgICB0aGlzLl9jb250cm9sbGVyLnNjb3JlTWdyLmNoYXJhY3Rlck1nci5zaG93Q2hhcmFjdGVyKGxldmVsICsgMSwgY2FyZC5nZXRDaGlsZEJ5TmFtZSgnZGInKSlcbiAgICB9IGVsc2Uge1xuICAgICAgY2FyZC5nZXRDaGlsZEJ5TmFtZSgnbmFtZScpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gJz8/PydcbiAgICAgIGNhcmQuZ2V0Q2hpbGRCeU5hbWUoJ2dpZnRTdGVwJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIuW8gOWxgOWlluWKsT8/P+atpVwiXG4gICAgICBjYXJkLmdldENoaWxkQnlOYW1lKCdkYicpLmNvbG9yID0gY2MuQ29sb3IuQkxBQ0tcbiAgICAgIHRoaXMuX2NvbnRyb2xsZXIuc2NvcmVNZ3IuY2hhcmFjdGVyTWdyLnNob3dDaGFyYWN0ZXIobGV2ZWwgKyAxLCBjYXJkLmdldENoaWxkQnlOYW1lKCdkYicpLCBjYy5Db2xvci5CTEFDSylcbiAgICB9XG4gICAgLy8gdGhpcy5fY29udHJvbGxlci5zY29yZU1nci5jaGFyYWN0ZXJNZ3Iuc2hvd0NoYXJhY3RlcihsZXZlbCArIDEsIGNhcmQuZ2V0Q2hpbGRCeU5hbWUoJ2RiJyksIDApXG4gIH1cbn0pOyJdfQ==
//------QC-SOURCE-SPLIT------
