
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
require('./assets/Script/cell');
require('./assets/Script/character');
require('./assets/Script/check');
require('./assets/Script/controller');
require('./assets/Script/game');
require('./assets/Script/musicMgr');
require('./assets/Script/pageMgr');
require('./assets/Script/pictorial');
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
                    var __filename = 'preview-scripts/assets/Script/cell.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'dbc3cQxtHpPj77TncyB18gQ', 'cell');
// Script/cell.js

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

    self._controller.musicMgr.onPlayAudio(0 //self._game._score.chain - 1
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
        self._game.map[self.iid - 1][self.jid].getComponent('cell').onTouched(color);
      }

      if (self.iid + 1 < this._game.rowNum) {
        self._game.map[self.iid + 1][self.jid].getComponent('cell').onTouched(color);
      }

      if (self.jid - 1 >= 0) {
        self._game.map[self.iid][self.jid - 1].getComponent('cell').onTouched(color);
      }

      if (self.jid + 1 < this._game.rowNum) {
        self._game.map[self.iid][self.jid + 1].getComponent('cell').onTouched(color);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxjZWxsLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiX3N0YXR1cyIsIl9pdGVtVHlwZSIsIndhcm5pbmdTcHJpdGUiLCJTcHJpdGUiLCJsaWdodFNwcml0ZSIsImluaXQiLCJnIiwiZGF0YSIsIndpZHRoIiwiaXRlbVR5cGUiLCJwb3MiLCJfZ2FtZSIsIngiLCJ5Iiwid2FybmluZ1R5cGUiLCJpc1B1c2giLCJiaW5kRXZlbnQiLCJjb2xvciIsIk1hdGgiLCJjZWlsIiwicmFuZG9tIiwiY29sb3JTcHJpdGUiLCJub2RlIiwiZ2V0Q2hpbGRCeU5hbWUiLCJnZXRDb21wb25lbnQiLCJzcHJpdGVGcmFtZSIsInByb3BTcHJpdGVGcmFtZSIsImJsb2NrU3ByaXRlIiwiX3dpZHRoIiwiX2NvbnRyb2xsZXIiLCJhY3RpdmUiLCJoZWlnaHQiLCJzdGFydFRpbWUiLCJpaWQiLCJqaWQiLCJnYXAiLCJhbmdsZSIsInBsYXlTdGFydEFjdGlvbiIsIm9uV2FybmluZyIsInR5cGUiLCJ3YXJuaW5nU3ByaXRlRnJhbWUiLCJhY3Rpb24xIiwiYmxpbmsiLCJ3YXJuaW5nSW5pdCIsImdyb3dJbml0IiwiZ3Jvd1R5cGUiLCJncm93Iiwib24iLCJOb2RlIiwiRXZlbnRUeXBlIiwiVE9VQ0hfU1RBUlQiLCJvblRvdWNoZWQiLCJpc0NoYWluIiwiaXNCb21iIiwidGltZSIsInNldFRpbWVvdXQiLCJKU09OIiwic3RyaW5naWZ5Iiwic2VsZiIsInBsYXlEaWVBY3Rpb24iLCJ0aGVuIiwib25CbG9ja1BvcCIsImlzU2luZ2xlIiwic2NhbGUiLCJfc2NvcmUiLCJ0aXBCb3giLCJzY2FsZVRvIiwiYWN0aW9uMiIsImVhc2luZyIsImVhc2VCYWNrT3V0IiwiYWN0aW9uIiwic2VxdWVuY2UiLCJydW5BY3Rpb24iLCJvblVzZXJUb3VjaGVkIiwib25TdGVwIiwicmVzIiwiY2hlY2tOZWVkRmFsbCIsIm11c2ljTWdyIiwib25QbGF5QXVkaW8iLCJvbkl0ZW0iLCJhZGRTY29yZSIsInYyIiwiY29uZmlnIiwianNvbiIsInByb3BDb25maWciLCJzY29yZSIsIm1hcCIsInJvd051bSIsInBsYXlGYWxsQWN0aW9uIiwibW92ZUJ5IiwiYmxvY2tXaWR0aCIsImVhc2VCb3VuY2VPdXQiLCJzZXEiLCJjYWxsRnVuYyIsInNjYWxlWCIsInNjYWxlWSIsImFuaW1hdGlvblNwZWVkIiwiY2xlYXJUaW1lb3V0Iiwic3VyZmFjZVRpbWVyIiwic3RvcEFsbEFjdGlvbnMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIm1vdmVUbyIsInRhcmdldCIsImFjdGlvbjMiLCJzcGF3biIsInN1cmZhY2VBY3Rpb24iLCJkZWxhIiwiZ2VuZXJhdGVQcm9wQWN0aW9uIiwiZ2VuZXJhdGVJdGVtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBSUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBRVBDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxPQUFPLEVBQUUsQ0FEQztBQUNFO0FBQ1pDLElBQUFBLFNBQVMsRUFBRSxDQUZEO0FBRUk7QUFDZEMsSUFBQUEsYUFBYSxFQUFFTixFQUFFLENBQUNPLE1BSFI7QUFJVkMsSUFBQUEsV0FBVyxFQUFFUixFQUFFLENBQUNPO0FBSk4sR0FGTDtBQVFQRSxFQUFBQSxJQVJPLGdCQVFGQyxDQVJFLEVBUUNDLElBUkQsRUFRT0MsS0FSUCxFQVFjQyxRQVJkLEVBUXdCQyxHQVJ4QixFQVE2QjtBQUNsQyxTQUFLQyxLQUFMLEdBQWFMLENBQWI7QUFDQSxTQUFLTixPQUFMLEdBQWUsQ0FBZjs7QUFDQSxRQUFJVSxHQUFKLEVBQVMsQ0FDUDtBQUNEOztBQUNEQSxJQUFBQSxHQUFHLEdBQUdBLEdBQUcsSUFBSTtBQUNYRSxNQUFBQSxDQUFDLEVBQUVMLElBQUksQ0FBQ0ssQ0FERztBQUVYQyxNQUFBQSxDQUFDLEVBQUVOLElBQUks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QUFBQSxhQWhQTyx5QkFnUE9DLElBaFBQLEVBZ1BhO0FBQUE7O0FBQ2xCLFNBQUtWLFlBQUwsR0FBb0IzQyxVQUFVLENBQUMsWUFBTTtBQUNuQyxVQUFJZSxNQUFNLEdBQUcxRSxFQUFFLENBQUNzRSxPQUFILENBQVcsTUFBTSxNQUFJLENBQUN2RCxLQUFMLENBQVdxRixjQUE1QixFQUE0QyxHQUE1QyxFQUFpRCxHQUFqRCxDQUFiO0FBQ0EsVUFBSXZELE9BQU8sR0FBRzdDLEVBQUUsQ0FBQ3NFLE9BQUgsQ0FBVyxNQUFNLE1BQUksQ0FBQ3ZELEtBQUwsQ0FBV3FGLGNBQTVCLEVBQTRDLENBQTVDLEVBQStDLENBQS9DLENBQWQ7O0FBQ0EsTUFBQSxNQUFJLENBQUMxRSxJQUFMLENBQVVrRCxTQUFWLENBQW9CNUUsRUFBRSxDQUFDMkUsUUFBSCxDQUFZRCxNQUFaLEVBQW9CN0IsT0FBcEIsQ0FBcEI7QUFDRCxLQUo2QixFQUkzQm1FLElBSjJCLENBQTlCO0FBS0QsR0F0UE07QUF1UFBDLEVBQUFBLGtCQXZQTyxnQ0F1UGMsQ0FFcEIsQ0F6UE07QUEwUFBDLEVBQUFBLFlBMVBPLHdCQTBQTXZFLElBMVBOLEVBMFBZO0FBQ2pCLFNBQUt0QyxTQUFMLEdBQWlCc0MsSUFBakI7QUFDRDtBQTVQTSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBhdXRob3IgaGV5dWNoYW5nXG4gKiBAZmlsZSDljZXkuKrmlrnlnZfmjqfliLZcbiAqL1xuY2MuQ2xhc3Moe1xuICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBfc3RhdHVzOiAwLCAvLzHkuLrlj6/op6blj5Hngrnlh7sgMuS4uuW3sue7j+a2iOWksVxuICAgIF9pdGVtVHlwZTogMCwgLy/mlrDlop7pgZPlhbflip/og70gMeS4uuWPjOWAjeWAjeaVsCAy5Li654K45by5XG4gICAgd2FybmluZ1Nwcml0ZTogY2MuU3ByaXRlLFxuICAgIGxpZ2h0U3ByaXRlOiBjYy5TcHJpdGUsXG4gIH0sXG4gIGluaXQoZywgZGF0YSwgd2lkdGgsIGl0ZW1UeXBlLCBwb3MpIHtcbiAgICB0aGlzLl9nYW1lID0gZ1xuICAgIHRoaXMuX3N0YXR1cyA9IDFcbiAgICBpZiAocG9zKSB7XG4gICAgICAvL2NjLmxvZygn55Sf5oiQ55qE5pa55Z2XJywgcG9zKVxuICAgIH1cbiAgICBwb3MgPSBwb3MgfHwge1xuICAgICAgeDogZGF0YS54LFxuICAgICAgeTogZGF0YS55XG4gICAgfVxuICAgIHRoaXMuX2l0ZW1UeXBlID0gaXRlbVR5cGUgfHwgMFxuICAgIHRoaXMud2FybmluZ1R5cGUgPSAwXG4gICAgdGhpcy5pc1B1c2ggPSBmYWxzZVxuICAgIHRoaXMuYmluZEV2ZW50KClcbiAgICB0aGlzLmNvbG9yID0gZGF0YS5jb2xvciB8fCBNYXRoLmNlaWwoTWF0aC5yYW5kb20oKSAqIDQpXG4gICAgdGhpcy5jb2xvclNwcml0ZSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnY29sb3InKS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKVxuICAgIHRoaXMuY29sb3JTcHJpdGUuc3ByaXRlRnJhbWUgPSBpdGVtVHlwZSA/IGcucHJvcFNwcml0ZUZyYW1lWyhpdGVtVHlwZSAtIDEpICogNCArIHRoaXMuY29sb3IgLSAxXSA6IHRoaXMuX2dhbWUuYmxvY2tTcHJpdGVbdGhpcy5jb2xvciAtIDFdXG4gICAgdGhpcy53YXJuaW5nU3ByaXRlLnNwcml0ZUZyYW1lID0gJydcbiAgICB0aGlzLl93aWR0aCA9IHdpZHRoXG4gICAgdGhpcy5fY29udHJvbGxlciA9IGcuX2NvbnRyb2xsZXJcbiAgICAvLyDorqHnrpflrr1cbiAgICB0aGlzLmxpZ2h0U3ByaXRlLm5vZGUuYWN0aXZlID0gZmFsc2VcbiAgICAvLyAgdGhpcy5saWdodFNwcml0ZS5zcHJpdGVGcmFtZSA9IHRoaXMuX2dhbWUuYmxvY2tTcHJpdGVbdGhpcy5jb2xvciAtIDFdXG4gICAgdGhpcy5ub2RlLndpZHRoID0gdGhpcy5ub2RlLmhlaWdodCA9IHdpZHRoXG4gICAgdGhpcy5zdGFydFRpbWUgPSBkYXRhLnN0YXJ0VGltZVxuICAgIHRoaXMuaWlkID0gZGF0YS55XG4gICAgdGhpcy5qaWQgPSBkYXRhLnhcbiAgICAvLyBjb25zb2xlLmxvZygn55Sf5oiQ5pa55Z2X5L2N572uJywgZGF0YS55LCBkYXRhLngpXG4gICAgdGhpcy5ub2RlLnggPSAtKDczMCAvIDIgLSBnLmdhcCAtIHdpZHRoIC8gMikgKyBwb3MueCAqICh3aWR0aCArIGcuZ2FwKVxuICAgIHRoaXMubm9kZS55ID0gKDczMCAvIDIgLSBnLmdhcCAtIHdpZHRoIC8gMikgLSBwb3MueSAqICh3aWR0aCArIGcuZ2FwKVxuICAgIHRoaXMubm9kZS5hbmdsZSA9IDBcbiAgICB0aGlzLnBsYXlTdGFydEFjdGlvbigpXG4gIH0sXG4gIG9uV2FybmluZyh0eXBlKSB7XG4gICAgdGhpcy53YXJuaW5nU3ByaXRlLnNwcml0ZUZyYW1lID0gdGhpcy5fZ2FtZS53YXJuaW5nU3ByaXRlRnJhbWVbdHlwZSAtIDFdIHx8ICcnXG4gICAgdGhpcy53YXJuaW5nVHlwZSA9IHR5cGVcbiAgICAvLyAgIHRoaXMubGlnaHRTcHJpdGUubm9kZS5hY3RpdmUgPSB0cnVlXG4gICAgbGV0IGFjdGlvbjEgPSBjYy5ibGluaygxLCAxMClcbiAgICAvLyAgIHRoaXMubGlnaHRTcHJpdGUubm9kZS5ydW5BY3Rpb24oYWN0aW9uMSlcbiAgfSxcbiAgd2FybmluZ0luaXQoKSB7XG4gICAgdGhpcy53YXJuaW5nU3ByaXRlLnNwcml0ZUZyYW1lID0gJydcbiAgICAvLyAgdGhpcy5saWdodFNwcml0ZS5ub2RlLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5pc1B1c2ggPSBmYWxzZVxuICB9LFxuICBncm93SW5pdCgpIHtcbiAgICB0aGlzLmdyb3dUeXBlID0gMFxuICAgIHRoaXMuY29sb3JTcHJpdGUubm9kZS5oZWlnaHQgPSB0aGlzLmNvbG9yU3ByaXRlLm5vZGUud2lkdGggPSB0aGlzLl93aWR0aFxuICAgIHRoaXMuY29sb3JTcHJpdGUubm9kZS55ID0gdGhpcy5jb2xvclNwcml0ZS5ub2RlLnggPSAwXG4gIH0sXG4gIGdyb3codHlwZSkgeyAvLzEyMzQg5LiK5LiL5bem5Y+zXG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGlmICh0aGlzLmdyb3dUeXBlICE9IDIpIHtcbiAgICAgICAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUuaGVpZ2h0ICs9IHRoaXMuX2dhbWUuZ2FwICogMlxuICAgICAgICAgIHRoaXMuY29sb3JTcHJpdGUubm9kZS55ICs9IHRoaXMuX2dhbWUuZ2FwXG4gICAgICAgICAgdGhpcy5ncm93VHlwZSA9IDFcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBpZiAodGhpcy5ncm93VHlwZSAhPSAyKSB7XG4gICAgICAgICAgdGhpcy5jb2xvclNwcml0ZS5ub2RlLmhlaWdodCArPSB0aGlzLl9nYW1lLmdhcCAqIDJcbiAgICAgICAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUueSAtPSB0aGlzLl9nYW1lLmdhcFxuICAgICAgICAgIHRoaXMuZ3Jvd1R5cGUgPSAxXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaWYgKHRoaXMuZ3Jvd1R5cGUgIT0gMSkge1xuICAgICAgICAgIHRoaXMuY29sb3JTcHJpdGUubm9kZS53aWR0aCArPSB0aGlzLl9nYW1lLmdhcCAqIDJcbiAgICAgICAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUueCAtPSB0aGlzLl9nYW1lLmdhcFxuICAgICAgICAgIHRoaXMuZ3Jvd1R5cGUgPSAyXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgaWYgKHRoaXMuZ3Jvd1R5cGUgIT0gMSkge1xuICAgICAgICAgIHRoaXMuY29sb3JTcHJpdGUubm9kZS53aWR0aCArPSB0aGlzLl9nYW1lLmdhcCAqIDJcbiAgICAgICAgICB0aGlzLmNvbG9yU3ByaXRlLm5vZGUueCArPSB0aGlzLl9nYW1lLmdhcFxuICAgICAgICAgIHRoaXMuZ3Jvd1R5cGUgPSAyXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH0sXG4gIGJpbmRFdmVudCgpIHtcbiAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMub25Ub3VjaGVkLCB0aGlzKVxuXG4gIH0sXG4gIC8vIOeUqOaIt+eCueWHuyDmiJbogIXooqvlhbbku5bmlrnlnZfop6blj5FcbiAgb25Ub3VjaGVkKGNvbG9yLCBpc0NoYWluLCBpc0JvbWIsIHRpbWUpIHsgLy/pgZPlhbfmlrDlop7lj4LmlbAgaXNDaGFpbuaYr+WQpui/numUgSBpc0JvbWLmmK/lkKblvLrliLbmtojpmaRcbiAgICBpZiAodGltZSkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMub25Ub3VjaGVkKGNvbG9yLCBmYWxzZSwgaXNCb21iKVxuICAgICAgfSwgdGltZSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpc0NoYWluID0gSlNPTi5zdHJpbmdpZnkoaXNDaGFpbikgPT0gJ251bGwnID8gdHJ1ZSA6IGlzQ2hhaW5cbiAgICBpc0JvbWIgPSBpc0JvbWIgPyBpc0JvbWIgOiBmYWxzZVxuICAgIGxldCBzZWxmID0gdGhpc1xuICAgIC8vIOeIhueCuOinpuWPkVxuICAgIGlmICh0aGlzLl9zdGF0dXMgPT0gMSAmJiBpc0JvbWIgPT0gdHJ1ZSkge1xuICAgICAgdGhpcy5fc3RhdHVzID0gMlxuICAgICAgdGhpcy5wbGF5RGllQWN0aW9uKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMub25CbG9ja1BvcChjb2xvciwgaXNDaGFpbiwgaXNCb21iKVxuICAgICAgfSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChjb2xvci50eXBlKSB7XG4gICAgICAvLyDkuIDlrprmmK/nlKjmiLfkuLvliqjop6blj5Eg5L+d5a2Y6L+Z5Liq5Z2Q5qCH57uZZ2FtZVxuICAgICAgaWYgKHRoaXMuaXNTaW5nbGUgJiYgdGhpcy5faXRlbVR5cGUgPD0gMSkge1xuICAgICAgICB0aGlzLm5vZGUuc2NhbGUgPSAxXG4gICAgICAgIHRoaXMuX2dhbWUuX3Njb3JlLnRpcEJveC5pbml0KHRoaXMuX2dhbWUuX3Njb3JlLCAzKVxuICAgICAgICBsZXQgYWN0aW9uMSA9IGNjLnNjYWxlVG8oMC4xLCAxLjEsIDAuOSlcbiAgICAgICAgbGV0IGFjdGlvbjIgPSBjYy5zY2FsZVRvKDAuMywgMSkuZWFzaW5nKGNjLmVhc2VCYWNrT3V0KDIuMCkpXG4gICAgICAgIGxldCBhY3Rpb24gPSBjYy5zZXF1ZW5jZShhY3Rpb24xLCBhY3Rpb24yKVxuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGFjdGlvbilcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICAvLyBjb25zb2xlLmxvZygn5pa55Z2X5L2N572uJywgdGhpcy5paWQsIHRoaXMuamlkLCB0aGlzLl9pdGVtVHlwZSlcbiAgICAgIGNvbG9yID0gdGhpcy5jb2xvclxuICAgICAgaWYgKHRoaXMuX3N0YXR1cyA9PSAxICYmIHRoaXMuX2dhbWUuX3N0YXR1cyA9PSAxICYmIHRoaXMuY29sb3IgPT0gY29sb3IpIHtcbiAgICAgICAgdGhpcy5fZ2FtZS5vblVzZXJUb3VjaGVkKHRoaXMuaWlkLCB0aGlzLmppZCwgdGhpcy5faXRlbVR5cGUsIHRoaXMuY29sb3IsIHRoaXMud2FybmluZ1R5cGUsIHtcbiAgICAgICAgICB4OiB0aGlzLm5vZGUueCxcbiAgICAgICAgICB5OiB0aGlzLm5vZGUueVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLl9nYW1lLl9zY29yZS5vblN0ZXAoLTEpLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgIHRoaXMucGxheURpZUFjdGlvbigpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLm9uQmxvY2tQb3AoY29sb3IsIG51bGwsIG51bGwpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8g55Sx5YW25LuW5pa55Z2X6Kem5Y+RXG4gICAgICBpZiAodGhpcy5fc3RhdHVzID09IDEgJiYgdGhpcy5fZ2FtZS5fc3RhdHVzID09IDUgJiYgdGhpcy5jb2xvciA9PSBjb2xvcikge1xuICAgICAgICB0aGlzLnBsYXlEaWVBY3Rpb24oKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLm9uQmxvY2tQb3AoY29sb3IsIG51bGwsIG51bGwpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBvbkJsb2NrUG9wKGNvbG9yLCBpc0NoYWluLCBpc0JvbWIpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICBpc0NoYWluID0gSlNPTi5zdHJpbmdpZnkoaXNDaGFpbikgPT0gJ251bGwnID8gdHJ1ZSA6IGlzQ2hhaW5cbiAgICBpc0JvbWIgPSBpc0JvbWIgPyBpc0JvbWIgOiBmYWxzZVxuICAgIHNlbGYuX2dhbWUuY2hlY2tOZWVkRmFsbCgpXG4gICAgc2VsZi5fZ2FtZS5fc3RhdHVzID0gNVxuICAgIHNlbGYuX2NvbnRyb2xsZXIubXVzaWNNZ3Iub25QbGF5QXVkaW8oMFxuICAgICAgLy9zZWxmLl9nYW1lLl9zY29yZS5jaGFpbiAtIDFcbiAgICApXG4gICAgaWYgKHRoaXMuX2l0ZW1UeXBlICE9IDApIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwi6Kem5Y+R5LqG6YGT5YW3XCIsIHRoaXMuX2l0ZW1UeXBlKVxuXG4gICAgICBzZWxmLl9nYW1lLm9uSXRlbSh0aGlzLl9pdGVtVHlwZSwgY29sb3IsIHtcbiAgICAgICAgeDogdGhpcy5ub2RlLngsXG4gICAgICAgIHk6IHRoaXMubm9kZS55XG4gICAgICB9KVxuICAgIH1cbiAgICBzZWxmLl9nYW1lLl9zY29yZS5hZGRTY29yZShjYy52Mih0aGlzLm5vZGUueCwgdGhpcy5ub2RlLnkgLSB0aGlzLm5vZGUud2lkdGggKyB0aGlzLl9nYW1lLmdhcCksIHRoaXMuX2l0ZW1UeXBlID09IDMgPyB0aGlzLl9nYW1lLl9jb250cm9sbGVyLmNvbmZpZy5qc29uLnByb3BDb25maWdbMl0uc2NvcmUgOiBudWxsKVxuXG4gICAgLy8g6L+e6ZSB54q25oCBXG4gICAgaWYgKGlzQ2hhaW4pIHtcbiAgICAgIGlmICgoc2VsZi5paWQgLSAxKSA+PSAwKSB7XG4gICAgICAgIHNlbGYuX2dhbWUubWFwW3NlbGYuaWlkIC0gMV1bc2VsZi5qaWRdLmdldENvbXBvbmVudCgnY2VsbCcpLm9uVG91Y2hlZChjb2xvcilcbiAgICAgIH1cbiAgICAgIGlmICgoc2VsZi5paWQgKyAxKSA8IHRoaXMuX2dhbWUucm93TnVtKSB7XG4gICAgICAgIHNlbGYuX2dhbWUubWFwW3NlbGYuaWlkICsgMV1bc2VsZi5qaWRdLmdldENvbXBvbmVudCgnY2VsbCcpLm9uVG91Y2hlZChjb2xvcilcbiAgICAgIH1cbiAgICAgIGlmICgoc2VsZi5qaWQgLSAxKSA+PSAwKSB7XG4gICAgICAgIHNlbGYuX2dhbWUubWFwW3NlbGYuaWlkXVtzZWxmLmppZCAtIDFdLmdldENvbXBvbmVudCgnY2VsbCcpLm9uVG91Y2hlZChjb2xvcilcbiAgICAgIH1cbiAgICAgIGlmICgoc2VsZi5qaWQgKyAxKSA8IHRoaXMuX2dhbWUucm93TnVtKSB7XG4gICAgICAgIHNlbGYuX2dhbWUubWFwW3NlbGYuaWlkXVtzZWxmLmppZCArIDFdLmdldENvbXBvbmVudCgnY2VsbCcpLm9uVG91Y2hlZChjb2xvcilcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHBsYXlGYWxsQWN0aW9uKHksIGRhdGEpIHsgLy/kuIvpmY3kuoblh6DkuKrmoLzlrZBcbiAgICB0aGlzLl9zdGF0dXMgPSAwXG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMuaWlkID0gZGF0YS55XG4gICAgICB0aGlzLmppZCA9IGRhdGEueFxuICAgIH1cbiAgICBsZXQgYWN0aW9uID0gY2MubW92ZUJ5KDAuMjUsIDAsIC15ICogKHRoaXMuX2dhbWUuZ2FwICsgdGhpcy5fZ2FtZS5ibG9ja1dpZHRoKSkuZWFzaW5nKGNjLmVhc2VCb3VuY2VPdXQoNSAvIHkpKSAvLzEgKiB5IC8gdGhpcy5fZ2FtZS5hbmltYXRpb25TcGVlZFxuICAgIGxldCBzZXEgPSBjYy5zZXF1ZW5jZShhY3Rpb24sIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgIHRoaXMuX3N0YXR1cyA9IDFcbiAgICAgIC8vICB0aGlzLl9nYW1lLmNoZWNrTmVlZEdlbmVyYXRvcigpXG4gICAgfSwgdGhpcykpXG4gICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihzZXEpXG4gIH0sXG4gIHBsYXlTdGFydEFjdGlvbigpIHtcbiAgICB0aGlzLm5vZGUuc2NhbGVYID0gMFxuICAgIHRoaXMubm9kZS5zY2FsZVkgPSAwXG4gICAgbGV0IGFjdGlvbiA9IGNjLnNjYWxlVG8oMC44IC8gdGhpcy5fZ2FtZS5hbmltYXRpb25TcGVlZCwgMSwgMSkuZWFzaW5nKGNjLmVhc2VCYWNrT3V0KCkpXG4gICAgbGV0IHNlcSA9IGNjLnNlcXVlbmNlKGFjdGlvbiwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgdGhpcy5fc3RhdHVzID0gMVxuICAgIH0sIHRoaXMpKVxuICAgIC8vIOWmguaenOacieW7tui/n+aXtumXtOWwseeUqOW7tui/n+aXtumXtFxuICAgIGlmICh0aGlzLnN0YXJ0VGltZSkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihzZXEpXG4gICAgICAgIH0sIHRoaXMuc3RhcnRUaW1lIC8gMVxuICAgICAgICAvLyAoY2MuZ2FtZS5nZXRGcmFtZVJhdGUoKSAvIDYwKVxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHNlcSlcbiAgICB9XG4gIH0sXG4gIHBsYXlEaWVBY3Rpb24oKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuc3VyZmFjZVRpbWVyKVxuICAgIHRoaXMubm9kZS5zdG9wQWxsQWN0aW9ucygpXG4gICAgdGhpcy5fc3RhdHVzID0gMlxuICAgIHRoaXMubm9kZS5zY2FsZVggPSAxXG4gICAgdGhpcy5ub2RlLnNjYWxlWSA9IDFcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IGFjdGlvblxuICAgICAgaWYgKHRoaXMud2FybmluZ1Nwcml0ZS5zcHJpdGVGcmFtZSkgeyAvL+aciemBk+WFt+mihOitplxuICAgICAgICBsZXQgYWN0aW9uMSA9IGNjLnNjYWxlVG8oMC4yIC8gc2VsZi5fZ2FtZS5hbmltYXRpb25TcGVlZCwgMS4xKVxuICAgICAgICBsZXQgYWN0aW9uMiA9IGNjLm1vdmVUbygwLjIgLyBzZWxmLl9nYW1lLmFuaW1hdGlvblNwZWVkLCB0aGlzLl9nYW1lLnRhcmdldC54LCB0aGlzLl9nYW1lLnRhcmdldC55KVxuICAgICAgICBsZXQgYWN0aW9uMyA9IGNjLnNjYWxlVG8oMC4yLCAwKVxuICAgICAgICB2YXIgc2VxID0gY2Muc2VxdWVuY2UoYWN0aW9uMSwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoJycpXG4gICAgICAgIH0sIHRoaXMpLCBjYy5zcGF3bihhY3Rpb24yLCBhY3Rpb24zKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFjdGlvbiA9IGNjLnNjYWxlVG8oMC4yIC8gc2VsZi5fZ2FtZS5hbmltYXRpb25TcGVlZCwgMCwgMClcbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKGFjdGlvbiwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoJycpXG4gICAgICAgIH0sIHRoaXMpKVxuICAgICAgfVxuICAgICAgc2VsZi5ub2RlLnJ1bkFjdGlvbihzZXEpXG4gICAgfSk7XG4gIH0sXG4gIHN1cmZhY2VBY3Rpb24oZGVsYSkge1xuICAgIHRoaXMuc3VyZmFjZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBsZXQgYWN0aW9uID0gY2Muc2NhbGVUbygwLjQgLyB0aGlzLl9nYW1lLmFuaW1hdGlvblNwZWVkLCAwLjgsIDAuOClcbiAgICAgIGxldCBhY3Rpb24xID0gY2Muc2NhbGVUbygwLjQgLyB0aGlzLl9nYW1lLmFuaW1hdGlvblNwZWVkLCAxLCAxKVxuICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShhY3Rpb24sIGFjdGlvbjEpKVxuICAgIH0sIGRlbGEpXG4gIH0sXG4gIGdlbmVyYXRlUHJvcEFjdGlvbigpIHtcblxuICB9LFxuICBnZW5lcmF0ZUl0ZW0odHlwZSkge1xuICAgIHRoaXMuX2l0ZW1UeXBlID0gdHlwZVxuICB9LFxufSk7Il19
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
    checkMgr: require("check"),
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

        _this2.checkMgr.check(_this2);
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
          if (_this4.map[i][j].getComponent('cell')._status == 2) {
            _this4.blockPool.put(_this4.map[i][j]);

            _this4.map[i][j] = null;
            canFall++;
          } else {
            if (canFall != 0) {
              _this4.map[i + canFall][j] = _this4.map[i][j];
              _this4.map[i][j] = null;

              _this4.map[i + canFall][j].getComponent('cell').playFallAction(canFall, {
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

          _this4.map[k][j].getComponent('cell').playFallAction(canFall, null);
        }
      }

      setTimeout(function () {
        _this4.checkMgr.init(_this4);

        _this4.checkMgr.check(_this4);

        _this4._status = 1;
      }, 250);
    });
  },
  gameOver: function gameOver() {
    this._status = 3;

    this._controller.pageMgr.addPage(2);

    this._controller.pageMgr.addPage(4);

    if (this._controller.social.node.active) {
      this._controller.social.closeBannerAdv();
    }
  },
  // todo 复活
  askRevive: function askRevive() {
    var _this5 = this;

    this._controller.pageMgr.addPage(2);

    this._controller.pageMgr.addPage(5);

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
    this._controller.pageMgr.removePage(2);

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
    this._controller.pageMgr.pages[5].active = false;

    this._score.onGameOver(true);

    this.isRangeAction = false;
  },
  restart: function restart() {
    var _this6 = this;

    this._controller.pageMgr.onOpenPage(1);

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

        this._controller.musicMgr.onDouble();

        for (var i = 0; i < this.rowNum; i++) {
          //行
          for (var j = 0; j < this.rowNum; j++) {
            //列
            if (this.map[i][j] && this.map[i][j].getComponent('cell')._status == 1) {
              var distance = Math.sqrt(Math.pow(pos.x - this.map[i][j].x, 2) + Math.pow(pos.y - this.map[i][j].y, 2));

              if (distance != 0) {
                this.map[i][j].getComponent('cell').surfaceAction(distance);
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

        this._controller.musicMgr.onBoom();

        for (var _i = 0; _i < this.rowNum; _i++) {
          //行
          for (var _j = 0; _j < this.rowNum; _j++) {
            //列
            if (this.map[_i][_j] && this.map[_i][_j].getComponent('cell').color == color && this.map[_i][_j] && this.map[_i][_j].getComponent('cell')._status != 2) {
              this.map[_i][_j].getComponent('cell').onTouched(color, false, true);
            } else {
              this.map[_i][_j].runAction(AC.rockAction(0.2, 10));
            }
          }
        }

        break;

      case 3:
        //:  加步数
        this._score.tipBox.init(this._score, 4);

        this._controller.musicMgr.onDouble();

        for (var _i2 = 0; _i2 < this.rowNum; _i2++) {
          //行
          for (var _j2 = 0; _j2 < this.rowNum; _j2++) {
            //列
            if (this.map[_i2][_j2] && this.map[_i2][_j2].getComponent('cell')._status == 1) {
              var _distance = Math.sqrt(Math.pow(pos.x - this.map[_i2][_j2].x, 2) + Math.pow(pos.y - this.map[_i2][_j2].y, 2));

              if (_distance != 0) {
                this.map[_i2][_j2].getComponent('cell').surfaceAction(_distance);
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

        this._controller.musicMgr.onMagic();

        for (var _i3 = 0; _i3 < this.rowNum; _i3++) {
          //行
          for (var _j3 = 0; _j3 < this.rowNum; _j3++) {
            //列
            if (this.map[_i3][_j3] && this.map[_i3][_j3].getComponent('cell').isSingle && this.map[_i3][_j3] && this.map[_i3][_j3].getComponent('cell')._status != 2) {
              var _distance2 = Math.sqrt(Math.pow(pos.x - this.map[_i3][_j3].x, 2) + Math.pow(pos.y - this.map[_i3][_j3].y, 2));

              this.map[_i3][_j3].getComponent('cell').onTouched(color, false, true, _distance2);

              console.log("魔法棒触发的点", _i3, _j3, this.map[_i3][_j3].getComponent('cell').color, this.map[_i3][_j3].getComponent('cell').isSingle);
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
    block.getComponent('cell').init(self, data, this.blockWidth, itemType, pos);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxnYW1lLmpzIl0sIm5hbWVzIjpbIkFDIiwicmVxdWlyZSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwiX3N0YXR1cyIsImJsb2NrUHJlZmFiIiwiUHJlZmFiIiwiYmxvY2tTcHJpdGUiLCJTcHJpdGVGcmFtZSIsIndhcm5pbmdTcHJpdGVGcmFtZSIsInByb3BTcHJpdGVGcmFtZSIsImNoZWNrTWdyIiwicmV2aXZlUGFnZSIsIk5vZGUiLCJzdGFydCIsImJpbmROb2RlIiwiZ2VuZXJhdGVQb29sIiwibG9hZFJlcyIsImluaXQiLCJjIiwiX2NvbnRyb2xsZXIiLCJfc2NvcmUiLCJzY29yZU1nciIsInJvd051bSIsImNvbmZpZyIsImpzb24iLCJnYXAiLCJhbmltYXRpb25TcGVlZCIsImJsb2NrV2lkdGgiLCJyZXZpdmVUaW1lciIsImJsb2Nrc0NvbnRhaW5lciIsIm5vZGUiLCJnZXRDaGlsZEJ5TmFtZSIsImdhbWVTdGFydCIsInJlY292ZXJ5QWxsQmxvY2tzIiwidGhlbiIsIm1hcFNldCIsInJlc3VsdCIsIm51bSIsIm1hcCIsIkFycmF5Iiwic2VsZiIsImEiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJiIiwiZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiaSIsImoiLCJpdGVtVHlwZSIsImluc3RhbnRpYXRlQmxvY2siLCJ4IiwieSIsIndpZHRoIiwic3RhcnRUaW1lIiwic3RhcnRBbmltYXRpb25UaW1lIiwic2V0VGltZW91dCIsImNoZWNrIiwiY2hlY2tOZWVkRmFsbCIsImNoZWNrTmVlZEZhbGxUaW1lciIsImNsZWFyVGltZW91dCIsIm9uRmFsbCIsImNoZWNrR2VuZXJhdGVQcm9wIiwiY2hhaW4iLCJjYW5GYWxsIiwiZ2V0Q29tcG9uZW50IiwiYmxvY2tQb29sIiwicHV0IiwicGxheUZhbGxBY3Rpb24iLCJrIiwiZ2FtZU92ZXIiLCJwYWdlTWdyIiwiYWRkUGFnZSIsInNvY2lhbCIsImFjdGl2ZSIsImNsb3NlQmFubmVyQWR2IiwiYXNrUmV2aXZlIiwicmFuZ2VTcHJpdGUiLCJTcHJpdGUiLCJmaWxsUmFuZ2UiLCJpc1JhbmdlQWN0aW9uIiwibnVtTGFiZWwiLCJMYWJlbCIsInN0cmluZyIsImNsZWFySW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsIm9uU2tpcFJldml2ZSIsIm9uUmV2aXZlQnV0dG9uIiwic2hvd1Jldml2ZVN1Y2Nlc3MiLCJvblJldml2ZUNlcnRhaW5CdG4iLCJyZW1vdmVQYWdlIiwib25SZXZpdmUiLCJ1cGRhdGUiLCJwYWdlcyIsIm9uR2FtZU92ZXIiLCJyZXN0YXJ0Iiwib25PcGVuUGFnZSIsIm9uVXNlclRvdWNoZWQiLCJpaWQiLCJqaWQiLCJjb2xvciIsIndhcm5pbmciLCJwb3MiLCJ0YXJnZXQiLCJnZW5lcmF0ZVByb3BJdGVtIiwidHlwZSIsIm9uSXRlbSIsInRpcEJveCIsImFkZE11bHQiLCJtdXNpY01nciIsIm9uRG91YmxlIiwiZGlzdGFuY2UiLCJzcXJ0IiwicG93Iiwic3VyZmFjZUFjdGlvbiIsInJ1bkFjdGlvbiIsInNoYWNrQWN0aW9uIiwib25TaGFrZVBob25lIiwiaXNQcm9wQ2hhaW4iLCJvbkJvb20iLCJvblRvdWNoZWQiLCJyb2NrQWN0aW9uIiwib25TdGVwIiwib25NYWdpYyIsImlzU2luZ2xlIiwiY29uc29sZSIsImxvZyIsIk5vZGVQb29sIiwiYmxvY2siLCJpbnN0YW50aWF0ZSIsImRhdGEiLCJwYXJlbnQiLCJzaXplIiwiZ2V0Iiwic2NhbGUiLCJjaGlsZHJlbiIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUlBLElBQUlBLEVBQUUsR0FBR0MsT0FBTyxDQUFDLFNBQUQsQ0FBaEI7O0FBQ0FDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBRVBDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxPQUFPLEVBQUUsQ0FEQztBQUNFO0FBQ1pDLElBQUFB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LFFBQTdELEVBQXVFcUQsR0FBdkU7QUFDQSxXQUFPMEIsS0FBUDtBQUNELEdBMVZNO0FBMlZQO0FBQ0FsRyxFQUFBQSxpQkE1Vk8sK0JBNFZhO0FBQUE7O0FBQ2xCLFdBQU8sSUFBSWMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QyxVQUFJeUYsUUFBUSxHQUFHLE1BQUksQ0FBQzdHLGVBQUwsQ0FBcUI2RyxRQUFwQzs7QUFDQSxVQUFJQSxRQUFRLENBQUNDLE1BQVQsSUFBbUIsQ0FBdkIsRUFBMEI7QUFDeEIsWUFBSUEsTUFBTSxHQUFHRCxRQUFRLENBQUNDLE1BQXRCLENBRHdCLENBRXhCOztBQUNBLGFBQUssSUFBSXpGLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd5RixNQUFwQixFQUE0QnpGLENBQUMsRUFBN0IsRUFBaUM7QUFDL0IsVUFBQSxNQUFJLENBQUNtQixTQUFMLENBQWVDLEdBQWYsQ0FBbUJvRSxRQUFRLENBQUMsQ0FBRCxDQUEzQjtBQUNEOztBQUNELGFBQUssSUFBSXhGLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUcsTUFBSSxDQUFDNUIsTUFBekIsRUFBaUM0QixHQUFDLEVBQWxDLEVBQXNDO0FBQ3BDLGVBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxNQUFJLENBQUM3QixNQUF6QixFQUFpQzZCLENBQUMsRUFBbEMsRUFBc0M7QUFDcEMsWUFBQSxNQUFJLENBQUNiLEdBQUwsQ0FBU1ksR0FBVCxFQUFZQyxDQUFaLElBQWlCLElBQWpCO0FBQ0Q7QUFDRjtBQUNGOztBQUNESCxNQUFBQSxPQUFPLENBQUMsRUFBRCxDQUFQO0FBQ0QsS0FmTSxDQUFQO0FBZ0JEO0FBN1dNLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBoZXl1Y2hhbmdcbiAqIEBmaWxlIOa4uOaIj+aOp+WItlxuICovXG52YXIgQUMgPSByZXF1aXJlKCdHYW1lQWN0JylcbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgX3N0YXR1czogMCwgLy8wIOacquW8gOWniyAxIOa4uOaIj+W8gOWniyAyIOa4uOaIj+aaguWBnCAzIOa4uOaIj+e7k+adnyA0IOS4i+iQveeKtuaAgSA15peg5rOV6Kem5pG454q25oCBXG4gICAgYmxvY2tQcmVmYWI6IGNjLlByZWZhYixcbiAgICBibG9ja1Nwcml0ZTogW2NjLlNwcml0ZUZyYW1lXSwgLy90b2RvOiDmjaLmiJDliqjmgIHnlJ/miJAg5pqC5LiN5aSE55CGXG4gICAgd2FybmluZ1Nwcml0ZUZyYW1lOiBbY2MuU3ByaXRlRnJhbWVdLFxuICAgIHByb3BTcHJpdGVGcmFtZTogW2NjLlNwcml0ZUZyYW1lXSxcbiAgICBjaGVja01ncjogcmVxdWlyZShcImNoZWNrXCIpLFxuICAgIHJldml2ZVBhZ2U6IGNjLk5vZGUsXG4gIH0sXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuYmluZE5vZGUoKVxuICAgIHRoaXMuZ2VuZXJhdGVQb29sKClcbiAgICB0aGlzLmxvYWRSZXMoKVxuICB9LFxuICBsb2FkUmVzKCkge1xuXG4gIH0sXG4gIGluaXQoYykge1xuICAgIHRoaXMuX2NvbnRyb2xsZXIgPSBjXG4gICAgdGhpcy5fc2NvcmUgPSBjLnNjb3JlTWdyXG4gICAgdGhpcy5yb3dOdW0gPSBjLmNvbmZpZy5qc29uLnJvd051bVxuICAgIHRoaXMuZ2FwID0gYy5jb25maWcuanNvbi5nYXBcbiAgICB0aGlzLmFuaW1hdGlvblNwZWVkID0gYy5jb25maWcuanNvbi5nYXBcbiAgICB0aGlzLmJsb2NrV2lkdGggPSAoNzMwIC0gKHRoaXMucm93TnVtICsgMSkgKiB0aGlzLmdhcCkgLyB0aGlzLnJvd051bVxuICAgIHRoaXMucmV2aXZlVGltZXIgPSBudWxsXG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLmdhcClcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuYmxvY2tXaWR0aClcbiAgfSxcbiAgLy8g5Yqo5oCB6I635Y+W6ZyA6KaB5Yqo5oCB5o6n5Yi255qE57uE5Lu2XG4gIGJpbmROb2RlKCkge1xuICAgIHRoaXMuYmxvY2tzQ29udGFpbmVyID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdtYXAnKVxuICB9LFxuICAvLy0tLS0tLS0tLS0tLS0tLS0g5ri45oiP5o6n5Yi2IC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyDmuLjmiI/lvIDlp4tcbiAgZ2FtZVN0YXJ0KCkge1xuICAgIHRoaXMucmVjb3ZlcnlBbGxCbG9ja3MoKS50aGVuKClcbiAgICB0aGlzLl9zY29yZS5pbml0KHRoaXMpXG4gICAgdGhpcy5tYXBTZXQodGhpcy5yb3dOdW0pLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coJ+a4uOaIj+eKtuaAgeaUueWPmCcsIHJlc3VsdClcbiAgICAgIHRoaXMuX3N0YXR1cyA9IDFcbiAgICB9KVxuXG4gIH0sXG4gIC8vIOWIneWni+WMluWcsOWbvlxuICBtYXBTZXQobnVtKSB7XG4gICAgdGhpcy5tYXAgPSBuZXcgQXJyYXkoKVxuICAgIGxldCBzZWxmID0gdGhpc1xuICAgIC8vIOeUn+aIkOS4pOS4qumaj+acuueahOWvueixoeaVsOe7hFxuICAgIGxldCBhID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtKVxuICAgIGxldCBiID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtKVxuXG4gICAgbGV0IGMgPSBNYXRoLmZsb29yKDEgKyBNYXRoLnJhbmRvbSgpICogKG51bSAtIDEpKSAtIDFcbiAgICBhID09IGMgPyBjKysgOiAnJ1xuICAgIGxldCBkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtKVxuXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW07IGkrKykgeyAvL+ihjFxuICAgICAgICB0aGlzLm1hcFtpXSA9IG5ldyBBcnJheSgpXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtOyBqKyspIHsgLy/liJdcbiAgICAgICAgICBsZXQgaXRlbVR5cGUgPSAoaSA9PSBhICYmIGogPT0gYikgPyAxIDogKGkgPT0gYyAmJiBqID09IGQpID8gMiA6IDBcbiAgICAgICAgICBzZWxmLm1hcFtpXVtqXSA9IHNlbGYuaW5zdGFudGlhdGVCbG9jayhzZWxmLCB7XG4gICAgICAgICAgICB4OiBqLFxuICAgICAgICAgICAgeTogaSxcbiAgICAgICAgICAgIHdpZHRoOiBzZWxmLmJsb2NrV2lkdGgsXG4gICAgICAgICAgICBzdGFydFRpbWU6IChpICsgaiArIDEpICogc2VsZi5fY29udHJvbGxlci5jb25maWcuanNvbi5zdGFydEFuaW1hdGlvblRpbWUgLyBudW0gKiAyXG4gICAgICAgICAgfSwgc2VsZi5ibG9ja3NDb250YWluZXIsIGl0ZW1UeXBlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmNoZWNrTWdyLmluaXQodGhpcylcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoJzIwMCBPSycpO1xuICAgICAgICAgIHRoaXMuY2hlY2tNZ3IuY2hlY2sodGhpcylcbiAgICAgICAgfSwgc2VsZi5fY29udHJvbGxlci5jb25maWcuanNvbi5zdGFydEFuaW1hdGlvblRpbWUgKiBudW0gLyAyIC8gMVxuICAgICAgICAvLyAgKGNjLmdhbWUuZ2V0RnJhbWVSYXRlKCkgLyA2MClcbiAgICAgIClcbiAgICB9KVxuICB9LFxuICAvL+mYsuaKluWKqCDliKTmlq3mmK/lkKbpnIDopoHmo4DmtYvkuIvokL1cbiAgY2hlY2tOZWVkRmFsbCgpIHtcbiAgICBpZiAodGhpcy5jaGVja05lZWRGYWxsVGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmNoZWNrTmVlZEZhbGxUaW1lcilcbiAgICB9XG4gICAgdGhpcy5jaGVja05lZWRGYWxsVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXR1cyA9PSA1KSB7XG4gICAgICAgICAgdGhpcy5fc3RhdHVzID0gNFxuICAgICAgICAgIHRoaXMub25GYWxsKClcbiAgICAgICAgfVxuICAgICAgfSwgMzAwIC8gMVxuICAgICAgLy8gKGNjLmdhbWUuZ2V0RnJhbWVSYXRlKCkgLyA2MClcbiAgICApXG4gIH0sXG4gIC8v5pa55Z2X5LiL6JC9XG4gIG9uRmFsbCgpIHtcbiAgICB0aGlzLmNoZWNrR2VuZXJhdGVQcm9wKHRoaXMuX3Njb3JlLmNoYWluKS50aGVuKCgpID0+IHtcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgbGV0IGNhbkZhbGwgPSAwXG4gICAgICAvL+S7juavj+S4gOWIl+eahOacgOS4i+mdouS4gOS4quW8gOWni+W+gOS4iuWIpOaWrVxuICAgICAgLy/lpoLmnpzmnInnqbog5bCx5Yik5pat5pyJ5Yeg5Liq56m6IOeEtuWQjuiuqeacgOS4iuaWueeahOaWueWdl+aOieiQveS4i+adpVxuICAgICAgZm9yIChsZXQgaiA9IHRoaXMucm93TnVtIC0gMTsgaiA+PSAwOyBqLS0pIHtcbiAgICAgICAgY2FuRmFsbCA9IDBcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMucm93TnVtIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICBpZiAodGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdjZWxsJykuX3N0YXR1cyA9PSAyKSB7XG4gICAgICAgICAgICB0aGlzLmJsb2NrUG9vbC5wdXQodGhpcy5tYXBbaV1bal0pXG4gICAgICAgICAgICB0aGlzLm1hcFtpXVtqXSA9IG51bGxcbiAgICAgICAgICAgIGNhbkZhbGwrK1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoY2FuRmFsbCAhPSAwKSB7XG4gICAgICAgICAgICAgIHRoaXMubWFwW2kgKyBjYW5GYWxsXVtqXSA9IHRoaXMubWFwW2ldW2pdXG4gICAgICAgICAgICAgIHRoaXMubWFwW2ldW2pdID0gbnVsbFxuICAgICAgICAgICAgICB0aGlzLm1hcFtpICsgY2FuRmFsbF1bal0uZ2V0Q29tcG9uZW50KCdjZWxsJykucGxheUZhbGxBY3Rpb24oY2FuRmFsbCwge1xuICAgICAgICAgICAgICAgIHg6IGosXG4gICAgICAgICAgICAgICAgeTogaSArIGNhbkZhbGwsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgY2FuRmFsbDsgaysrKSB7XG4gICAgICAgICAgdGhpcy5tYXBba11bal0gPSB0aGlzLmluc3RhbnRpYXRlQmxvY2sodGhpcywge1xuICAgICAgICAgICAgeDogaixcbiAgICAgICAgICAgIHk6IGssXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ibG9ja1dpZHRoLFxuICAgICAgICAgICAgc3RhcnRUaW1lOiBudWxsXG4gICAgICAgICAgfSwgdGhpcy5ibG9ja3NDb250YWluZXIsICcnLCB7XG4gICAgICAgICAgICB4OiBqLFxuICAgICAgICAgICAgeTogLWNhbkZhbGwgKyBrXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLm1hcFtrXVtqXS5nZXRDb21wb25lbnQoJ2NlbGwnKS5wbGF5RmFsbEFjdGlvbihjYW5GYWxsLCBudWxsKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5jaGVja01nci5pbml0KHRoaXMpXG4gICAgICAgIHRoaXMuY2hlY2tNZ3IuY2hlY2sodGhpcylcbiAgICAgICAgdGhpcy5fc3RhdHVzID0gMVxuICAgICAgfSwgMjUwKVxuICAgIH0pXG4gIH0sXG4gIGdhbWVPdmVyKCkge1xuICAgIHRoaXMuX3N0YXR1cyA9IDNcbiAgICB0aGlzLl9jb250cm9sbGVyLnBhZ2VNZ3IuYWRkUGFnZSgyKVxuICAgIHRoaXMuX2NvbnRyb2xsZXIucGFnZU1nci5hZGRQYWdlKDQpXG4gICAgaWYgKHRoaXMuX2NvbnRyb2xsZXIuc29jaWFsLm5vZGUuYWN0aXZlKSB7XG4gICAgICB0aGlzLl9jb250cm9sbGVyLnNvY2lhbC5jbG9zZUJhbm5lckFkdigpXG4gICAgfVxuICB9LFxuICAvLyB0b2RvIOWkjea0u1xuICBhc2tSZXZpdmUoKSB7XG4gICAgdGhpcy5fY29udHJvbGxlci5wYWdlTWdyLmFkZFBhZ2UoMilcbiAgICB0aGlzLl9jb250cm9sbGVyLnBhZ2VNZ3IuYWRkUGFnZSg1KVxuICAgIHRoaXMucmV2aXZlUGFnZS5hY3RpdmUgPSB0cnVlXG4gICAgdGhpcy5yZXZpdmVQYWdlLmdldENoaWxkQnlOYW1lKCdhc2tSZXZpdmUnKS5hY3RpdmUgPSB0cnVlXG4gICAgdGhpcy5yZXZpdmVQYWdlLmdldENoaWxkQnlOYW1lKCdzdWNjZXNzUmV2aXZlJykuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLnJhbmdlU3ByaXRlID0gdGhpcy5yZXZpdmVQYWdlLmdldENoaWxkQnlOYW1lKCdhc2tSZXZpdmUnKS5nZXRDaGlsZEJ5TmFtZSgnbnVtQmcnKS5nZXRDaGlsZEJ5TmFtZSgnc3ByaXRlJykuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSlcbiAgICB0aGlzLnJhbmdlU3ByaXRlLmZpbGxSYW5nZSA9IDFcbiAgICB0aGlzLmlzUmFuZ2VBY3Rpb24gPSB0cnVlXG4gICAgbGV0IG51bUxhYmVsID0gdGhpcy5yZXZpdmVQYWdlLmdldENoaWxkQnlOYW1lKCdhc2tSZXZpdmUnKS5nZXRDaGlsZEJ5TmFtZSgnbnVtQmcnKS5nZXRDaGlsZEJ5TmFtZSgnbnVtJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKVxuICAgIG51bUxhYmVsLnN0cmluZyA9IDlcbiAgICBpZiAodGhpcy5yZXZpdmVUaW1lcikge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnJldml2ZVRpbWVyKVxuICAgIH1cbiAgICB0aGlzLnJldml2ZVRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgaWYgKCtudW1MYWJlbC5zdHJpbmcgPiAwKSB7XG4gICAgICAgIG51bUxhYmVsLnN0cmluZy0tXG4gICAgICAgIHRoaXMucmFuZ2VTcHJpdGUuZmlsbFJhbmdlID0gMVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vblNraXBSZXZpdmUoKVxuICAgICAgfVxuICAgIH0sIDEwMDApXG5cbiAgfSxcbiAgb25SZXZpdmVCdXR0b24oKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnJldml2ZVRpbWVyKVxuICAgIHRoaXMuaXNSYW5nZUFjdGlvbiA9IGZhbHNlXG4gICAgaWYgKHRoaXMuX2NvbnRyb2xsZXIuc29jaWFsLm5vZGUuYWN0aXZlKSB7XG4gICAgICB0aGlzLl9jb250cm9sbGVyLnNvY2lhbC5vblJldml2ZUJ1dHRvbigxKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNob3dSZXZpdmVTdWNjZXNzKClcbiAgICB9XG4gIH0sXG4gIHNob3dSZXZpdmVTdWNjZXNzKCkge1xuICAgIC8vY29uc29sZS5sb2coJ+aJk+W8gOWkjea0u+aIkOWKn+mhtemdoicpXG4gICAgdGhpcy5yZXZpdmVQYWdlLmdldENoaWxkQnlOYW1lKCdhc2tSZXZpdmUnKS5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMucmV2aXZlUGFnZS5nZXRDaGlsZEJ5TmFtZSgnc3VjY2Vzc1Jldml2ZScpLmFjdGl2ZSA9IHRydWVcbiAgfSxcbiAgb25SZXZpdmVDZXJ0YWluQnRuKCkge1xuICAgIHRoaXMuX2NvbnRyb2xsZXIucGFnZU1nci5yZW1vdmVQYWdlKDIpXG4gICAgdGhpcy5yZXZpdmVQYWdlLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5fc3RhdHVzID0gMVxuICAgIHRoaXMuX3Njb3JlLm9uUmV2aXZlKClcbiAgfSxcbiAgdXBkYXRlKCkge1xuICAgIGlmICh0aGlzLmlzUmFuZ2VBY3Rpb24pIHtcbiAgICAgIHRoaXMucmFuZ2VTcHJpdGUuZmlsbFJhbmdlIC09IDEgLyA2MFxuICAgIH1cbiAgfSxcbiAgb25Ta2lwUmV2aXZlKCkge1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5yZXZpdmVUaW1lcilcbiAgICB0aGlzLl9jb250cm9sbGVyLnBhZ2VNZ3IucGFnZXNbNV0uYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLl9zY29yZS5vbkdhbWVPdmVyKHRydWUpXG4gICAgdGhpcy5pc1JhbmdlQWN0aW9uID0gZmFsc2VcbiAgfSxcbiAgcmVzdGFydCgpIHtcbiAgICB0aGlzLl9jb250cm9sbGVyLnBhZ2VNZ3Iub25PcGVuUGFnZSgxKVxuICAgIHRoaXMucmVjb3ZlcnlBbGxCbG9ja3MoKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuZ2FtZVN0YXJ0KClcbiAgICB9KVxuICB9LFxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLemBk+WFt+ebuOWFsy0tLS0tLS0tLS0tLS0tLVxuICAvLyDlgqjlrZjnlKjmiLfngrnlh7vml7bnmoTmlrnlnZcg55So5LqO55Sf5oiQ6YGT5YW3XG4gIG9uVXNlclRvdWNoZWQoaWlkLCBqaWQsIGl0ZW1UeXBlLCBjb2xvciwgd2FybmluZywgcG9zKSB7XG4gICAgdGhpcy50YXJnZXQgPSB7XG4gICAgICBpOiBpaWQsXG4gICAgICBqOiBqaWQsXG4gICAgICBjb2xvcjogY29sb3IsXG4gICAgICBpdGVtVHlwZTogaXRlbVR5cGUsXG4gICAgICB4OiBwb3MueCxcbiAgICAgIHk6IHBvcy55LFxuICAgICAgd2FybmluZzogd2FybmluZ1xuICAgIH1cbiAgfSxcbiAgLy8g55Sf5oiQ6YGT5YW3IHR5cGUgMeS4uuWPjOWAjeWAjeaVsCAy5Li654K45by5IDPkuLrliqDkupTnmb5cbiAgZ2VuZXJhdGVQcm9wSXRlbSh0eXBlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIOaYr+WQpuWBmumBk+WFt+eUn+aIkOWKqOeUu1xuICAgICAgdGhpcy5tYXBbdGhpcy50YXJnZXQuaV1bdGhpcy50YXJnZXQual0gPSB0aGlzLmluc3RhbnRpYXRlQmxvY2sodGhpcywge1xuICAgICAgICB4OiB0aGlzLnRhcmdldC5qLFxuICAgICAgICB5OiB0aGlzLnRhcmdldC5pLFxuICAgICAgICBjb2xvcjogdGhpcy50YXJnZXQuY29sb3IsXG4gICAgICAgIHdpZHRoOiB0aGlzLmJsb2NrV2lkdGgsXG4gICAgICAgIHN0YXJ0VGltZTogbnVsbFxuICAgICAgfSwgdGhpcy5ibG9ja3NDb250YWluZXIsIHR5cGUpXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9LCAzMDApXG4gICAgfSlcbiAgfSxcbiAgY2hlY2tHZW5lcmF0ZVByb3AoY2hhaW4pIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHRoaXMudGFyZ2V0Lndhcm5pbmcpIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVByb3BJdGVtKHRoaXMudGFyZ2V0Lndhcm5pbmcpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmVzb2x2ZSgpXG4gICAgfSlcbiAgfSxcbiAgb25JdGVtKHR5cGUsIGNvbG9yLCBwb3MpIHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgLy8g5YiG5pWw57+75YCNIOacgOmrmOWFq+WAjVxuICAgICAgICB0aGlzLl9zY29yZS50aXBCb3guaW5pdCh0aGlzLl9zY29yZSwgMSlcbiAgICAgICAgdGhpcy5fc2NvcmUuYWRkTXVsdChjb2xvciwgcG9zKVxuICAgICAgICB0aGlzLl9jb250cm9sbGVyLm11c2ljTWdyLm9uRG91YmxlKClcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd051bTsgaSsrKSB7IC8v6KGMXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLnJvd051bTsgaisrKSB7IC8v5YiXXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBbaV1bal0gJiYgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdjZWxsJykuX3N0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhwb3MueCAtIHRoaXMubWFwW2ldW2pdLngsIDIpICsgTWF0aC5wb3cocG9zLnkgLSB0aGlzLm1hcFtpXVtqXS55LCAyKSlcbiAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlICE9IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2NlbGwnKS5zdXJmYWNlQWN0aW9uKGRpc3RhbmNlKVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgLy8g54K45by5IOa2iOmZpOWQjOenjeminOiJsueahFxuICAgICAgICB0aGlzLl9zY29yZS50aXBCb3guaW5pdCh0aGlzLl9zY29yZSwgMilcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihBQy5zaGFja0FjdGlvbigwLjEsIDEwKSlcbiAgICAgICAgaWYgKHRoaXMuX2NvbnRyb2xsZXIuc29jaWFsLm5vZGUuYWN0aXZlKSB7XG4gICAgICAgICAgdGhpcy5fY29udHJvbGxlci5zb2NpYWwub25TaGFrZVBob25lKClcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlzUHJvcENoYWluID0gdHJ1ZVxuICAgICAgICB0aGlzLl9jb250cm9sbGVyLm11c2ljTWdyLm9uQm9vbSgpXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dOdW07IGkrKykgeyAvL+ihjFxuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5yb3dOdW07IGorKykgeyAvL+WIl1xuICAgICAgICAgICAgaWYgKHRoaXMubWFwW2ldW2pdICYmIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnY2VsbCcpLmNvbG9yID09IGNvbG9yICYmIHRoaXMubWFwW2ldW2pdICYmIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnY2VsbCcpLl9zdGF0dXMgIT0gMikge1xuICAgICAgICAgICAgICB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2NlbGwnKS5vblRvdWNoZWQoY29sb3IsIGZhbHNlLCB0cnVlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMubWFwW2ldW2pdLnJ1bkFjdGlvbihBQy5yb2NrQWN0aW9uKDAuMiwgMTApKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAzOiAvLzogIOWKoOatpeaVsFxuICAgICAgICB0aGlzLl9zY29yZS50aXBCb3guaW5pdCh0aGlzLl9zY29yZSwgNClcbiAgICAgICAgdGhpcy5fY29udHJvbGxlci5tdXNpY01nci5vbkRvdWJsZSgpXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dOdW07IGkrKykgeyAvL+ihjFxuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5yb3dOdW07IGorKykgeyAvL+WIl1xuICAgICAgICAgICAgaWYgKHRoaXMubWFwW2ldW2pdICYmIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnY2VsbCcpLl9zdGF0dXMgPT0gMSkge1xuICAgICAgICAgICAgICBsZXQgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3cocG9zLnggLSB0aGlzLm1hcFtpXVtqXS54LCAyKSArIE1hdGgucG93KHBvcy55IC0gdGhpcy5tYXBbaV1bal0ueSwgMikpXG4gICAgICAgICAgICAgIGlmIChkaXN0YW5jZSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdjZWxsJykuc3VyZmFjZUFjdGlvbihkaXN0YW5jZSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zY29yZS5vblN0ZXAoMykudGhlbigpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0OiAvLyA6IOa2iOmZpOWFqOmDqOWNlei6q+eahOaWueWdl1xuICAgICAgICB0aGlzLl9zY29yZS50aXBCb3guaW5pdCh0aGlzLl9zY29yZSwgNSlcbiAgICAgICAgdGhpcy5pc1Byb3BDaGFpbiA9IHRydWVcbiAgICAgICAgdGhpcy5fY29udHJvbGxlci5tdXNpY01nci5vbk1hZ2ljKClcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJvd051bTsgaSsrKSB7IC8v6KGMXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLnJvd051bTsgaisrKSB7IC8v5YiXXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBbaV1bal0gJiYgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdjZWxsJykuaXNTaW5nbGUgJiYgdGhpcy5tYXBbaV1bal0gJiYgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdjZWxsJykuX3N0YXR1cyAhPSAyKSB7XG4gICAgICAgICAgICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhwb3MueCAtIHRoaXMubWFwW2ldW2pdLngsIDIpICsgTWF0aC5wb3cocG9zLnkgLSB0aGlzLm1hcFtpXVtqXS55LCAyKSlcbiAgICAgICAgICAgICAgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdjZWxsJykub25Ub3VjaGVkKGNvbG9yLCBmYWxzZSwgdHJ1ZSwgZGlzdGFuY2UpXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi6a2U5rOV5qOS6Kem5Y+R55qE54K5XCIsIGksaix0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2NlbGwnKS5jb2xvciwgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdjZWxsJykuaXNTaW5nbGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0g6aKE5Yi25L2T5a6e5L6L5YyWLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIOeUn+aIkOWvueixoeaxoFxuICBnZW5lcmF0ZVBvb2woKSB7XG4gICAgdGhpcy5ibG9ja1Bvb2wgPSBuZXcgY2MuTm9kZVBvb2woKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5wb3codGhpcy5yb3dOdW0sIDIpOyBpKyspIHtcbiAgICAgIGxldCBibG9jayA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYmxvY2tQcmVmYWIpXG4gICAgICB0aGlzLmJsb2NrUG9vbC5wdXQoYmxvY2spXG4gICAgfVxuICB9LFxuICAvLyDlrp7kvovljJbljZXkuKrmlrnlnZdcbiAgaW5zdGFudGlhdGVCbG9jayhzZWxmLCBkYXRhLCBwYXJlbnQsIGl0ZW1UeXBlLCBwb3MpIHtcbiAgICBpdGVtVHlwZSA9IGl0ZW1UeXBlID8gaXRlbVR5cGUgOiAwXG4gICAgaWYgKGl0ZW1UeXBlICE9IDApIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwi6YGT5YW36IqC54K55pWw5o2uXCIsIGRhdGEsIGl0ZW1UeXBlKVxuICAgIH1cbiAgICBsZXQgYmxvY2sgPSBudWxsXG4gICAgaWYgKHNlbGYuYmxvY2tQb29sICYmIHNlbGYuYmxvY2tQb29sLnNpemUoKSA+IDApIHtcbiAgICAgIGJsb2NrID0gc2VsZi5ibG9ja1Bvb2wuZ2V0KClcbiAgICB9IGVsc2Uge1xuICAgICAgYmxvY2sgPSBjYy5pbnN0YW50aWF0ZShzZWxmLmJsb2NrUHJlZmFiKVxuICAgIH1cbiAgICBibG9jay5wYXJlbnQgPSBwYXJlbnRcbiAgICBibG9jay5zY2FsZSA9IDFcbiAgICBibG9jay54ID0gMFxuICAgIGJsb2NrLnkgPSAwXG4gICAgYmxvY2suZ2V0Q29tcG9uZW50KCdjZWxsJykuaW5pdChzZWxmLCBkYXRhLCB0aGlzLmJsb2NrV2lkdGgsIGl0ZW1UeXBlLCBwb3MpXG4gICAgcmV0dXJuIGJsb2NrXG4gIH0sXG4gIC8vIOWbnuaUtuaJgOacieiKgueCuVxuICByZWNvdmVyeUFsbEJsb2NrcygpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IGNoaWxkcmVuID0gdGhpcy5ibG9ja3NDb250YWluZXIuY2hpbGRyZW5cbiAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggIT0gMCkge1xuICAgICAgICBsZXQgbGVuZ3RoID0gY2hpbGRyZW4ubGVuZ3RoXG4gICAgICAgIC8vICAgY29uc29sZS5sb2cobGVuZ3RoKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5ibG9ja1Bvb2wucHV0KGNoaWxkcmVuWzBdKVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dOdW07IGkrKykge1xuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5yb3dOdW07IGorKykge1xuICAgICAgICAgICAgdGhpcy5tYXBbaV1bal0gPSBudWxsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXNvbHZlKCcnKVxuICAgIH0pXG4gIH0sXG5cbn0pOyJdfQ==
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
    this._controller.pageMgr.addPage(2);

    this._controller.pageMgr.addPage(3);

    this._controller.musicMgr.onWin();

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

    this._controller.pageMgr.onOpenPage(1);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxzY29yZS5qcyJdLCJuYW1lcyI6WyJBQyIsInJlcXVpcmUiLCJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInNjb3JlUHJlZmFiIiwiUHJlZmFiIiwic2NvcmVQYXJ0aWNsZVByZWZhYiIsIm1haW5TY29yZUxhYmVsIiwiTGFiZWwiLCJzdWNjZXNzRGlhbG9nIiwiY2hhcmFjdGVyTWdyIiwiZmFpbERpYWxvZyIsIk5vZGUiLCJtdWx0UHJvcFByZWZhYiIsImNoYWluU3ByaXRlRnJhbWVBcnIiLCJTcHJpdGVGcmFtZSIsInN0ZXBBbmlMYWJlbCIsInRpcEJveCIsImluaXQiLCJnIiwiX2dhbWUiLCJfY29udHJvbGxlciIsInNjb3JlIiwibGVmdFN0ZXAiLCJjb25maWciLCJqc29uIiwib3JpZ2luU3RlcCIsImNoYWluIiwibGV2ZWwiLCJyZXZpdmVUaW1lIiwiY2xvc2VNdWx0TGFiZWwiLCJsZXZlbERhdGEiLCJnYW1lRGF0YSIsIm5hbWVMYWJlbCIsInN0cmluZyIsInByb2dyZXNzQmFyIiwibGVmdFN0ZXBMYWJlbCIsIm5vZGUiLCJydW5BY3Rpb24iLCJoaWRlIiwic2NvcmVUaW1lciIsImN1cnJlbnRBZGRlZFNjb3JlIiwiYWN0aXZlIiwic2hvd0hlcm9DaGFyYWN0ZXIiLCJoaWRlQ2hhaW5TcHJpdGUiLCJzb2NpYWwiLCJoZWlnaHQiLCJnZXRIaWdoZXN0TGV2ZWwiLCJvblN0ZXAiLCJnaWZ0U3RlcCIsInN0YXJ0IiwiZ2VuZXJhdGVQb29sIiwiYmluZE5vZGUiLCJzY29yZVBvb2wiLCJOb2RlUG9vbCIsImkiLCJpbnN0YW50aWF0ZSIsInB1dCIsInNjb3JlUGFydGljbGVQb29sIiwic2NvcmVQYXJ0aWNsZSIsIm11bHRQcm9wUG9vbCIsIm11bHRQcm9wIiwiaW5zdGFudGlhdGVTY29yZSIsInNlbGYiLCJudW0iLCJwb3MiLCJzaXplIiwiZ2V0IiwicGFyZW50Iiwic2NvcmVDb250YWluZXIiLCJnZXRDb21wb25lbnQiLCJzY29yZVBhcnRpY2xlVGltZSIsImdldENoaWxkQnlOYW1lIiwibXVsdExhYmVsIiwiY2hhaW5TcHJpdGUiLCJTcHJpdGUiLCJmYWlsU2NvcmUiLCJmYWlsTmFtZSIsImZhaWxTcHJpdGUiLCJmYWlsSGlnaFNjb3JlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbkdhbWVPdmVyIiwic2hvd1N0ZXBBbmkiLCJhZGRTY29yZSIsInNjb3JlQmFzZSIsImNoYWluVGltZXIiLCJjbGVhclRpbWVvdXQiLCJpbml0Q3VycmVudFNjb3JlTGFiZWwiLCJzZXRUaW1lb3V0Iiwib25DdXJyZW50U2NvcmVMYWJlbCIsIngiLCJ5IiwiY2FsbEZ1bmMiLCJtdWx0aXBsZSIsImNoZWNrTGV2ZWxVcCIsImNoZWNrQ2hhaW4iLCJjaGVja0NoYWluVGltZXIiLCJjaGFpbkNvbmZpZyIsImxlbmd0aCIsIm1heCIsIm1pbiIsInNob3dDaGFpblNwcml0ZSIsImlkIiwic3ByaXRlRnJhbWUiLCJzY2FsZSIsInBvcE91dCIsImxldmVsTGltaXQiLCJvbkxldmVsVXAiLCJhZGRNdWx0IiwiY29sb3IiLCJtYXhNdWx0aXBsZSIsInNob3dNdWx0TGFiZWwiLCJjYWxsYmFjayIsImFjdGlvbiIsInNwYXduIiwibW92ZVRvIiwic2NhbGVUbyIsImVhc2luZyIsImVhc2VCYWNrT3V0Iiwic2VxIiwic2VxdWVuY2UiLCJwYWdlTWdyIiwiYWRkUGFnZSIsIm11c2ljTWdyIiwib25XaW4iLCJvblN1Y2Nlc3NEaWFsb2ciLCJfc3RhdHVzIiwib3BlbkJhbm5lckFkdiIsImhpZGVOZXh0TGV2ZWxEYXRhIiwib25MZXZlbFVwQnV0dG9uIiwiZG91YmxlIiwiY29uc29sZSIsImxvZyIsImlzTGV2ZWxVcCIsImN1cnJlbnRUYXJnZXQiLCJvbk9wZW5QYWdlIiwic3RlcCIsIm9uTGV2ZWxVcEJ0biIsIm5hbWUiLCJ0aGVuIiwic2hvd05leHRMZXZlbERhdGEiLCJ0b2dnbGVWaXNpYmlsaXR5IiwibW92ZUJ5IiwiaXNUcnVlIiwiZ2FtZU92ZXIiLCJ1cGRhdGVGYWlsUGFnZSIsImFza1Jldml2ZSIsIm9uRG91YmxlU3RlcEJ0biIsIm9uUmV2aXZlQnV0dG9uIiwib25Eb3VibGVTdGVwIiwib25SZXZpdmUiLCJuZXh0TGV2ZWxEYXRhIiwib25GYWlsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBSUEsSUFBSUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsU0FBRCxDQUFoQjs7QUFFQUMsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFFUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLFdBQVcsRUFBRUosRUFBRSxDQUFDSyxNQUROO0FBRVZDLElBQUFBLG1CQUFtQixFQUFFTixFQUFFLENBQUNLLE1BRmQ7QUFHVkUsSUFBQUEsY0FBYyxFQUFFUCxFQUFFLENBQUNRLEtBSFQ7QUFJVkMsSUFBQUEsYUFBYSxFQUFFVixPQUFPLENBQUMsZUFBRCxDQUpaO0FBS1ZXLElBQUFBLFlBQVksRUFBRVgsT0FBTyxDQUFDLFdBQUQsQ0FMWDtBQU1WWSxJQUFBQSxVQUFVLEVBQUVYLEVBQUUsQ0FBQ1ksSUFOTDtBQU9WQyxJQUFBQSxjQUFjLEVBQUViLEVBQUUsQ0FBQ0ssTUFQVDtBQVFWO0FBQ0E7QUFDQVMsSUFBQUEsbUJBQW1CLEVBQUUsQ0FBQ2QsRUFBRSxDQUFDZSxXQUFKLENBVlg7QUFXVkMsSUFBQUEsWUFBWSxFQUFFaEIsRUFBRSxDQUFDUSxLQVhQO0FBYVY7QUFDQVMsSUFBQUEsTUFBTSxFQUFFbEIsT0FBTyxDQUFDLFFBQUQ7QUFkTCxHQUZMO0FBa0JQbUIsRUFBQUEsSUFsQk8sZ0JBa0JGQyxDQWxCRSxFQWtCQztBQUNOLFNBQUtDLEtBQUwsR0FBYUQsQ0FBYjtBQUNBLFNBQUtFLFdBQUwsR0FBbUJGLENBQUMsQ0FBQ0UsV0FBckI7QUFDQSxTQUFLQyxLQUFMLEdBQWEsQ0FBYjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0IsS0FBS0YsV0FBTCxDQUFpQkcs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LEdBL1NNO0FBZ1RQQyxFQUFBQSxlQWhUTyw2QkFnVFc7QUFDaEIsUUFBSSxLQUFLaEksV0FBTCxDQUFpQndCLE1BQWpCLENBQXdCUixJQUF4QixDQUE2QkssTUFBakMsRUFBeUM7QUFDdkMsV0FBS3JCLFdBQUwsQ0FBaUJ3QixNQUFqQixDQUF3QnlHLGNBQXhCLENBQXVDLENBQXZDO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsV0FBS25CLGVBQUwsQ0FBcUIsQ0FBckI7QUFDRDtBQUNGLEdBdFRNO0FBdVRQb0IsRUFBQUEsWUF2VE8sMEJBdVRRO0FBQ2IsU0FBS3BCLGVBQUwsQ0FBcUIsQ0FBckI7QUFDRCxHQXpUTTtBQTBUUHFCLEVBQUFBLFFBMVRPLHNCQTBUSTtBQUNULFNBQUszSCxVQUFMLElBQW1CLENBQW5CO0FBQ0EsU0FBS21CLE1BQUwsQ0FBWSxDQUFaLEVBQWU2RixJQUFmO0FBQ0QsR0E3VE07QUE4VFA7QUFDQUMsRUFBQUEsaUJBL1RPLCtCQStUYTtBQUNsQixRQUFJVyxhQUFhLEdBQUcsS0FBSzFILFNBQUwsQ0FBZSxLQUFLSCxLQUFwQixDQUFwQjtBQUNELEdBalVNO0FBa1VQO0FBQ0FzRyxFQUFBQSxpQkFuVU8sK0JBbVVhLENBRW5CLENBclVNO0FBc1VQaUIsRUFBQUEsY0F0VU8sNEJBc1VVO0FBQ2YsU0FBS3ZFLFNBQUwsQ0FBZTFDLE1BQWYsR0FBd0IsT0FBTyxLQUFLWixLQUFMLEdBQWEsRUFBcEIsQ0FBeEI7QUFDQSxTQUFLWixZQUFMLENBQWtCZ0osTUFBbEIsQ0FBeUIsS0FBSzlILEtBQTlCO0FBQ0EsU0FBS2lELFFBQUwsQ0FBYzNDLE1BQWQsR0FBdUIsS0FBS0gsU0FBTCxDQUFlLEtBQUtILEtBQUwsR0FBYSxDQUE1QixFQUErQmdILElBQXRELENBSGUsQ0FJZjtBQUNEO0FBM1VNLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBoZXl1Y2hhbmdcbiAqIEBmaWxlICBVSSDliIbmlbDmjqfliLblmahcbiAqL1xudmFyIEFDID0gcmVxdWlyZSgnR2FtZUFjdCcpXG5cbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgc2NvcmVQcmVmYWI6IGNjLlByZWZhYixcbiAgICBzY29yZVBhcnRpY2xlUHJlZmFiOiBjYy5QcmVmYWIsXG4gICAgbWFpblNjb3JlTGFiZWw6IGNjLkxhYmVsLFxuICAgIHN1Y2Nlc3NEaWFsb2c6IHJlcXVpcmUoJ3N1Y2Nlc3NEaWFsb2cnKSxcbiAgICBjaGFyYWN0ZXJNZ3I6IHJlcXVpcmUoJ2NoYXJhY3RlcicpLFxuICAgIGZhaWxEaWFsb2c6IGNjLk5vZGUsXG4gICAgbXVsdFByb3BQcmVmYWI6IGNjLlByZWZhYixcbiAgICAvLyBwcm9ncmVzc0JhcjogcmVxdWlyZSgncHJvZ3Jlc3MnKSxcbiAgICAvLyBsZWZ0U3RlcExhYmVsOiBjYy5MYWJlbCxcbiAgICBjaGFpblNwcml0ZUZyYW1lQXJyOiBbY2MuU3ByaXRlRnJhbWVdLFxuICAgIHN0ZXBBbmlMYWJlbDogY2MuTGFiZWwsXG5cbiAgICAvL+aPkOekuuWwj+ahhlxuICAgIHRpcEJveDogcmVxdWlyZSgndGlwQm94JylcbiAgfSxcbiAgaW5pdChnKSB7XG4gICAgdGhpcy5fZ2FtZSA9IGdcbiAgICB0aGlzLl9jb250cm9sbGVyID0gZy5fY29udHJvbGxlclxuICAgIHRoaXMuc2NvcmUgPSAwXG4gICAgdGhpcy5sZWZ0U3RlcCA9IHRoaXMuX2NvbnRyb2xsZXIuY29uZmlnLmpzb24ub3JpZ2luU3RlcFxuICAgIHRoaXMuY2hhaW4gPSAxXG4gICAgdGhpcy5sZXZlbCA9IDFcbiAgICB0aGlzLnJldml2ZVRpbWUgPSAwXG4gICAgdGhpcy5jbG9zZU11bHRMYWJlbCgpXG4gICAgdGhpcy5sZXZlbERhdGEgPSBnLl9jb250cm9sbGVyLmdhbWVEYXRhLmpzb24ubGV2ZWxEYXRhXG4gICAgdGhpcy5uYW1lTGFiZWwuc3RyaW5nID0gXCLokIzlv4PmgqZcIlxuICAgIHRoaXMucHJvZ3Jlc3NCYXIuaW5pdCgwLCB0aGlzLmxldmVsRGF0YVt0aGlzLmxldmVsIC0gMV0sIHRoaXMubGV2ZWwpXG4gICAgdGhpcy5sZWZ0U3RlcExhYmVsLnN0cmluZyA9IHRoaXMubGVmdFN0ZXBcbiAgICB0aGlzLnN0ZXBBbmlMYWJlbC5ub2RlLnJ1bkFjdGlvbihjYy5oaWRlKCkpXG4gICAgdGhpcy5zY29yZVRpbWVyID0gW11cbiAgICB0aGlzLmN1cnJlbnRBZGRlZFNjb3JlID0gMFxuICAgIHRoaXMubWFpblNjb3JlTGFiZWwubm9kZS5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMuY2hhcmFjdGVyTWdyLnNob3dIZXJvQ2hhcmFjdGVyKHRoaXMubGV2ZWwpXG4gICAgdGhpcy5oaWRlQ2hhaW5TcHJpdGUoKVxuXG4gICAgdGhpcy50aXBCb3guaW5pdCh0aGlzLCAwKVxuICAgIGlmICh0aGlzLl9jb250cm9sbGVyLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgbGV0IGhlaWdodCA9IHRoaXMuX2NvbnRyb2xsZXIuc29jaWFsLmdldEhpZ2hlc3RMZXZlbCgpXG4gICAgICBpZiAoaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMub25TdGVwKHRoaXMubGV2ZWxEYXRhWytoZWlnaHQgLSAxXS5naWZ0U3RlcClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuZ2VuZXJhdGVQb29sKClcbiAgICB0aGlzLmJpbmROb2RlKClcbiAgfSxcbiAgZ2VuZXJhdGVQb29sKCkge1xuICAgIHRoaXMuc2NvcmVQb29sID0gbmV3IGNjLk5vZGVQb29sKClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDIwOyBpKyspIHtcbiAgICAgIGxldCBzY29yZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc2NvcmVQcmVmYWIpXG4gICAgICB0aGlzLnNjb3JlUG9vbC5wdXQoc2NvcmUpXG4gICAgfVxuICAgIHRoaXMuc2NvcmVQYXJ0aWNsZVBvb2wgPSBuZXcgY2MuTm9kZVBvb2woKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjA7IGkrKykge1xuICAgICAgbGV0IHNjb3JlUGFydGljbGUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnNjb3JlUGFydGljbGVQcmVmYWIpXG4gICAgICB0aGlzLnNjb3JlUGFydGljbGVQb29sLnB1dChzY29yZVBhcnRpY2xlKVxuICAgIH1cbiAgICB0aGlzLm11bHRQcm9wUG9vbCA9IG5ldyBjYy5Ob2RlUG9vbCgpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgIGxldCBtdWx0UHJvcCA9IGNjLmluc3RhbnRpYXRlKHRoaXMubXVsdFByb3BQcmVmYWIpXG4gICAgICB0aGlzLm11bHRQcm9wUG9vbC5wdXQobXVsdFByb3ApXG4gICAgfVxuICB9LFxuICAvLyDlrp7kvovljJbljZXkuKrmlrnlnZdcbiAgaW5zdGFudGlhdGVTY29yZShzZWxmLCBudW0sIHBvcykge1xuICAgIGxldCBzY29yZSA9IG51bGxcbiAgICBpZiAoc2VsZi5zY29yZVBvb2wgJiYgc2VsZi5zY29yZVBvb2wuc2l6ZSgpID4gMCkge1xuICAgICAgc2NvcmUgPSBzZWxmLnNjb3JlUG9vbC5nZXQoKVxuICAgIH0gZWxzZSB7XG4gICAgICBzY29yZSA9IGNjLmluc3RhbnRpYXRlKHNlbGYuc2NvcmVQcmVmYWIpXG4gICAgfVxuICAgIHNjb3JlLnBhcmVudCA9IHRoaXMuc2NvcmVDb250YWluZXJcbiAgICBzY29yZS5nZXRDb21wb25lbnQoJ3Njb3JlQ2VsbCcpLmluaXQoc2VsZiwgbnVtLCBwb3MpXG5cbiAgICBsZXQgc2NvcmVQYXJ0aWNsZSA9IG51bGxcbiAgICBpZiAoc2VsZi5zY29yZVBhcnRpY2xlUG9vbCAmJiBzZWxmLnNjb3JlUGFydGljbGVQb29sLnNpemUoKSA+IDApIHtcbiAgICAgIHNjb3JlUGFydGljbGUgPSBzZWxmLnNjb3JlUGFydGljbGVQb29sLmdldCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHNjb3JlUGFydGljbGUgPSBjYy5pbnN0YW50aWF0ZShzZWxmLnNjb3JlUGFydGljbGVQcmVmYWIpXG4gICAgfVxuICAgIHNjb3JlUGFydGljbGUucGFyZW50ID0gdGhpcy5zY29yZUNvbnRhaW5lclxuICAgIHNjb3JlUGFydGljbGUuZ2V0Q29tcG9uZW50KCdzY29yZVBhcnRpY2xlJykuaW5pdChzZWxmLCBwb3MsIHRoaXMuX2NvbnRyb2xsZXIuY29uZmlnLmpzb24uc2NvcmVQYXJ0aWNsZVRpbWUpXG4gIH0sXG4gIGJpbmROb2RlKCkge1xuICAgIHRoaXMubGVmdFN0ZXBMYWJlbCA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnVUknKS5nZXRDaGlsZEJ5TmFtZSgnbGVmdFN0ZXBOb2RlJykuZ2V0Q2hpbGRCeU5hbWUoJ0xhYmVsJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKVxuICAgIHRoaXMucHJvZ3Jlc3NCYXIgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ1VJJykuZ2V0Q2hpbGRCeU5hbWUoJ3Njb3JlTm9kZScpLmdldENoaWxkQnlOYW1lKCdwcm9ncmVzc0JhcicpLmdldENvbXBvbmVudCgncHJvZ3Jlc3MnKVxuICAgIHRoaXMuc2NvcmVDb250YWluZXIgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ1VJJykuZ2V0Q2hpbGRCeU5hbWUoJ3Njb3JlR3JvdXAnKVxuICAgIHRoaXMubXVsdExhYmVsID0gdGhpcy5tYWluU2NvcmVMYWJlbC5ub2RlLmdldENoaWxkQnlOYW1lKCdtdWx0JykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKVxuICAgIHRoaXMubmFtZUxhYmVsID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdVSScpLmdldENoaWxkQnlOYW1lKCdzY29yZU5vZGUnKS5nZXRDaGlsZEJ5TmFtZSgncHJvZ3Jlc3NCYXInKS5nZXRDaGlsZEJ5TmFtZSgnbmFtZScpLmdldENvbXBvbmVudChjYy5MYWJlbClcbiAgICAvLyDlpLHotKXml7bmm7TmlrDlpLHotKVVSVxuICAgIHRoaXMuY2hhaW5TcHJpdGUgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ1VJJykuZ2V0Q2hpbGRCeU5hbWUoJ2NoYWluU3ByaXRlJykuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSlcbiAgICB0aGlzLmZhaWxTY29yZSA9IHRoaXMuZmFpbERpYWxvZy5nZXRDaGlsZEJ5TmFtZSgnaW5mbycpLmdldENoaWxkQnlOYW1lKCdzY29yZScpLmdldENvbXBvbmVudChjYy5MYWJlbClcbiAgICB0aGlzLmZhaWxOYW1lID0gdGhpcy5mYWlsRGlhbG9nLmdldENoaWxkQnlOYW1lKCdpbmZvJykuZ2V0Q2hpbGRCeU5hbWUoJ2xldmVsJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKVxuICAgIHRoaXMuZmFpbFNwcml0ZSA9IHRoaXMuZmFpbERpYWxvZy5nZXRDaGlsZEJ5TmFtZSgnaW5mbycpLmdldENoaWxkQnlOYW1lKCdzcHJpdGUnKS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKVxuICAgIHRoaXMuZmFpbEhpZ2hTY29yZSA9IHRoaXMuZmFpbERpYWxvZy5nZXRDaGlsZEJ5TmFtZSgnaW5mbycpLmdldENoaWxkQnlOYW1lKCdoaWdoU2NvcmUnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpXG4gIH0sXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tIOWIhuaVsOaOp+WItiAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8g5aKe5YqgIOWHj+WwkeatpeaVsOW5tuS4lOWIt+aWsFVJXG4gIG9uU3RlcChudW0pIHtcbiAgICB0aGlzLmxlZnRTdGVwICs9IG51bVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAodGhpcy5sZWZ0U3RlcCA8IDApIHtcbiAgICAgICAgdGhpcy5sZWZ0U3RlcCA9IDBcbiAgICAgICAgdGhpcy5vbkdhbWVPdmVyKClcbiAgICAgICAgcmVzb2x2ZShmYWxzZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUodHJ1ZSlcbiAgICAgIH1cbiAgICAgIHRoaXMubGVmdFN0ZXBMYWJlbC5zdHJpbmcgPSB0aGlzLmxlZnRTdGVwXG4gICAgICBpZiAobnVtID4gMCkge1xuICAgICAgICB0aGlzLnNob3dTdGVwQW5pKG51bSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuXG4gIC8v5aKe5Yqg5YiG5pWw5oC75o6n5Yi2IOiOt+WPlui/nuWHu1xuICBhZGRTY29yZShwb3MsIHNjb3JlKSB7XG4gICAgc2NvcmUgPSBzY29yZSB8fCB0aGlzLl9jb250cm9sbGVyLmNvbmZpZy5qc29uLnNjb3JlQmFzZVxuICAgIC8vIOS4gOasoea2iOmZpOWPr+S7peWPoGNoYWluXG4gICAgaWYgKHRoaXMuY2hhaW5UaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuY2hhaW5UaW1lcilcbiAgICB9XG4gICAgdGhpcy5pbml0Q3VycmVudFNjb3JlTGFiZWwoKVxuICAgIHRoaXMuY2hhaW5UaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLm9uQ3VycmVudFNjb3JlTGFiZWwodGhpcy5jdXJyZW50QWRkZWRTY29yZSwge1xuICAgICAgICAgIHg6IC02MCxcbiAgICAgICAgICB5OiAzNTVcbiAgICAgICAgfSwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2NvcmUgKz0gdGhpcy5jdXJyZW50QWRkZWRTY29yZSAqIHRoaXMubXVsdGlwbGVcbiAgICAgICAgICB0aGlzLmNoZWNrTGV2ZWxVcCgpXG4gICAgICAgICAgdGhpcy5jaGFpbiA9IDFcbiAgICAgICAgICB0aGlzLmNsb3NlTXVsdExhYmVsKClcbiAgICAgICAgICB0aGlzLmhpZGVDaGFpblNwcml0ZSgpXG4gICAgICAgICAgdGhpcy5jdXJyZW50QWRkZWRTY29yZSA9IDBcbiAgICAgICAgICB0aGlzLm1haW5TY29yZUxhYmVsLm5vZGUuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgfSwgdGhpcykpXG4gICAgICB9LCA1MDAgLyAxXG4gICAgICAvLyAoY2MuZ2FtZS5nZXRGcmFtZVJhdGUoKSAvIDYwKVxuICAgIClcbiAgICBsZXQgYWRkU2NvcmUgPSBzY29yZSA9PSB0aGlzLl9jb250cm9sbGVyLmNvbmZpZy5qc29uLnNjb3JlQmFzZSA/IChzY29yZSArICh0aGlzLmNoYWluID4gMTYgPyAxNiA6ICh0aGlzLmNoYWluIC0gMSkpICogMTApIDogc2NvcmVcbiAgICAvLyBsZXQgYWRkU2NvcmUgPSBzY29yZSA9PSAxMCA/IHNjb3JlICogKHRoaXMuY2hhaW4gPiAxMCA/IDEwIDogdGhpcy5jaGFpbikgOiBzY29yZVxuICAgIHRoaXMuY3VycmVudEFkZGVkU2NvcmUgKz0gYWRkU2NvcmVcbiAgICB0aGlzLm1haW5TY29yZUxhYmVsLnN0cmluZyA9IHRoaXMuY3VycmVudEFkZGVkU2NvcmVcbiAgICB0aGlzLmluc3RhbnRpYXRlU2NvcmUodGhpcywgYWRkU2NvcmUsIHBvcylcbiAgICB0aGlzLmNoYWluKytcbiAgICB0aGlzLmNoZWNrQ2hhaW4oKVxuICB9LFxuICAvLyDliKTmlq3ov57lh7tcbiAgY2hlY2tDaGFpbigpIHtcbiAgICBpZiAodGhpcy5jaGVja0NoYWluVGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmNoZWNrQ2hhaW5UaW1lcilcbiAgICB9XG4gICAgdGhpcy5jaGVja0NoYWluVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGxldCBjb25maWcgPSB0aGlzLl9jb250cm9sbGVyLmNvbmZpZy5qc29uLmNoYWluQ29uZmlnXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbmZpZy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5jaGFpbiA8PSBjb25maWdbaV0ubWF4ICYmIHRoaXMuY2hhaW4gPj0gY29uZmlnW2ldLm1pbikge1xuICAgICAgICAgIC8vICBjb25zb2xlLmxvZyhjb25maWdbaV0udGV4dClcbiAgICAgICAgICB0aGlzLnNob3dDaGFpblNwcml0ZShpKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgMjAwKVxuICB9LFxuICBzaG93Q2hhaW5TcHJpdGUoaWQpIHtcbiAgICB0aGlzLmNoYWluU3ByaXRlLnNwcml0ZUZyYW1lID0gdGhpcy5jaGFpblNwcml0ZUZyYW1lQXJyW2lkXVxuICAgIHRoaXMuY2hhaW5TcHJpdGUubm9kZS5zY2FsZSA9IDAuNVxuICAgIHRoaXMuY2hhaW5TcHJpdGUubm9kZS5hY3RpdmUgPSB0cnVlXG4gICAgdGhpcy5jaGFpblNwcml0ZS5ub2RlLnJ1bkFjdGlvbihBQy5wb3BPdXQoMC4zKSlcbiAgfSxcbiAgaGlkZUNoYWluU3ByaXRlKCkge1xuICAgIHRoaXMuY2hhaW5TcHJpdGUubm9kZS5hY3RpdmUgPSBmYWxzZVxuICB9LFxuICBjaGVja0xldmVsVXAoKSB7XG4gICAgaWYgKHRoaXMubGV2ZWwgPCB0aGlzLmxldmVsRGF0YS5sZW5ndGggJiYgdGhpcy5zY29yZSA+PSB0aGlzLmxldmVsRGF0YVt0aGlzLmxldmVsIC0gMV0uc2NvcmUpIHtcbiAgICAgIHRoaXMubGV2ZWwrK1xuICAgICAgdGhpcy5sZXZlbCA+ICh0aGlzLmxldmVsRGF0YS5sZW5ndGggKyAxKSA/IHRoaXMubGV2ZWxMaW1pdCgpIDogdGhpcy5vbkxldmVsVXAoKVxuICAgIH1cbiAgICB0aGlzLnByb2dyZXNzQmFyLmluaXQodGhpcy5zY29yZSwgdGhpcy5sZXZlbERhdGFbdGhpcy5sZXZlbCAtIDFdLCB0aGlzLmxldmVsKVxuICB9LFxuICAvLyDlop7liqDlgI3mlbBcbiAgYWRkTXVsdChjb2xvciwgcG9zKSB7XG4gICAgLy9UT0RPOiDliqjmgIHnlJ/miJDkuIDkuKrlm77niYcg56e75Yqo5YiwbXVsdExhYmVs5LiKIOaciWJ1Z1xuICAgIC8vIGlmICh0aGlzLm11bHRQcm9wUG9vbC5zaXplKCkgPiAwKSB7XG4gICAgLy8gICBsZXQgbXVsdFByb3AgPSB0aGlzLm11bHRQcm9wUG9vbC5nZXQoKVxuICAgIC8vICAgbXVsdFByb3AucGFyZW50ID0gdGhpcy5tYWluU2NvcmVMYWJlbC5ub2RlXG4gICAgLy8gICBtdWx0UHJvcC54ID0gcG9zLnhcbiAgICAvLyAgIG11bHRQcm9wLnkgPSBwb3MueVxuICAgIC8vICAgbXVsdFByb3AuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuc3ByaXRlRnJhbWUgPSB0aGlzLl9nYW1lLnByb3BTcHJpdGVGcmFtZVtjb2xvciAtIDFdXG4gICAgLy8gICBtdWx0UHJvcC5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2MubW92ZVRvKDAuMiwgMTg3LCAwKSwgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgIC8vICAgICB0aGlzLm11bHRQcm9wUG9vbC5wdXQobXVsdFByb3ApXG4gICAgLy8gICB9KSkpXG4gICAgLy8gfVxuICAgIGlmICh0aGlzLm11bHRpcGxlIDwgdGhpcy5fY29udHJvbGxlci5jb25maWcuanNvbi5tYXhNdWx0aXBsZSkge1xuICAgICAgdGhpcy5tdWx0aXBsZSAqPSAyXG4gICAgICB0aGlzLnNob3dNdWx0TGFiZWwoKVxuICAgIH1cbiAgfSxcbiAgLy8g5YWz6Zet5YCN5pWw55qE5pWw5a2X5pi+56S6XG4gIGNsb3NlTXVsdExhYmVsKCkge1xuICAgIHRoaXMubXVsdGlwbGUgPSAxXG4gICAgdGhpcy5tdWx0TGFiZWwubm9kZS5hY3RpdmUgPSBmYWxzZVxuICB9LFxuICBzaG93TXVsdExhYmVsKCkge1xuICAgIHRoaXMubXVsdExhYmVsLm5vZGUuc2NhbGUgPSAwLjVcbiAgICB0aGlzLm11bHRMYWJlbC5zdHJpbmcgPSB0aGlzLm11bHRpcGxlXG4gICAgdGhpcy5tdWx0TGFiZWwubm9kZS5hY3RpdmUgPSB0cnVlXG4gICAgdGhpcy5tdWx0TGFiZWwubm9kZS5ydW5BY3Rpb24oQUMucG9wT3V0KDAuMykpXG4gIH0sXG4gIC8vIOWinuWKoOWIhuaVsOWAjeaVsFxuICBpbml0Q3VycmVudFNjb3JlTGFiZWwoKSB7XG4gICAgdGhpcy5tYWluU2NvcmVMYWJlbC5ub2RlLmFjdGl2ZSA9IHRydWVcbiAgICB0aGlzLm1haW5TY29yZUxhYmVsLm5vZGUueCA9IDBcbiAgICB0aGlzLm1haW5TY29yZUxhYmVsLm5vZGUueSA9IDBcbiAgICB0aGlzLm1haW5TY29yZUxhYmVsLm5vZGUuc2NhbGUgPSAxXG4gIH0sXG4gIC8vIOeUn+aIkOWwj+eahOWIhuaVsOiKgueCuVxuICBvbkN1cnJlbnRTY29yZUxhYmVsKG51bSwgcG9zLCBjYWxsYmFjaykge1xuICAgIC8vIFRPRE86IOWinuWKoOS4gOS4quaSkuiKseeJueaViFxuICAgIHRoaXMubWFpblNjb3JlTGFiZWwuc3RyaW5nID0gbnVtXG4gICAgbGV0IGFjdGlvbiA9IGNjLnNwYXduKGNjLm1vdmVUbygwLjIsIHBvcy54LCBwb3MueSksIGNjLnNjYWxlVG8oMC4yLCAwLjQpKS5lYXNpbmcoY2MuZWFzZUJhY2tPdXQoKSlcbiAgICBsZXQgc2VxID0gY2Muc2VxdWVuY2UoYWN0aW9uLCBjYWxsYmFjaylcbiAgICB0aGlzLm1haW5TY29yZUxhYmVsLm5vZGUucnVuQWN0aW9uKHNlcSlcbiAgfSxcbiAgLy8g5Y2H57qnXG4gIG9uTGV2ZWxVcCgpIHtcbiAgICB0aGlzLl9jb250cm9sbGVyLnBhZ2VNZ3IuYWRkUGFnZSgyKVxuICAgIHRoaXMuX2NvbnRyb2xsZXIucGFnZU1nci5hZGRQYWdlKDMpXG4gICAgdGhpcy5fY29udHJvbGxlci5tdXNpY01nci5vbldpbigpXG4gICAgdGhpcy5zdWNjZXNzRGlhbG9nLmluaXQodGhpcywgdGhpcy5sZXZlbCwgdGhpcy5sZXZlbERhdGEsIHRoaXMuc2NvcmUpIC8v5Y2H57qn5LmL5ZCO55qE562J57qnXG4gICAgdGhpcy5jaGFyYWN0ZXJNZ3Iub25MZXZlbFVwKClcbiAgICB0aGlzLmNoYXJhY3Rlck1nci5vblN1Y2Nlc3NEaWFsb2codGhpcy5sZXZlbClcbiAgICB0aGlzLl9nYW1lLl9zdGF0dXMgPSAyXG4gICAgaWYgKHRoaXMuX2NvbnRyb2xsZXIuc29jaWFsLm5vZGUuYWN0aXZlKSB7XG4gICAgICB0aGlzLl9jb250cm9sbGVyLnNvY2lhbC5vcGVuQmFubmVyQWR2KClcbiAgICB9XG4gIH0sXG4gIC8vIOetiee6p+mZkOWItlxuICBsZXZlbExpbWl0KCkge1xuICAgIC8vY29uc29sZS5sb2coJ+etiee6p+i+vuWIsOS4iumZkCcpXG4gICAgdGhpcy5oaWRlTmV4dExldmVsRGF0YSgpXG4gIH0sXG4gIC8vIOeCueWHu+WNh+e6p+aMiemSrlxuICBvbkxldmVsVXBCdXR0b24oZG91YmxlKSB7XG4gICAgY29uc29sZS5sb2coZG91YmxlKVxuICAgIGlmICh0aGlzLmlzTGV2ZWxVcCkge1xuICAgICAgcmV0dXJuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaXNMZXZlbFVwID0gdHJ1ZVxuICAgIH1cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuaXNMZXZlbFVwID0gZmFsc2VcbiAgICB9LCA1MDApXG4gICAgaWYgKGRvdWJsZSAmJiBkb3VibGUuY3VycmVudFRhcmdldCkge1xuICAgICAgZG91YmxlID0gMVxuICAgIH0gZWxzZSB7XG4gICAgICBkb3VibGUgPSBkb3VibGUgfHwgMVxuICAgIH1cbiAgICB0aGlzLl9jb250cm9sbGVyLnBhZ2VNZ3Iub25PcGVuUGFnZSgxKVxuICAgIHRoaXMuaW5pdEN1cnJlbnRTY29yZUxhYmVsKClcbiAgICB0aGlzLm1haW5TY29yZUxhYmVsLnN0cmluZyA9IHRoaXMubGV2ZWxEYXRhW3RoaXMubGV2ZWwgLSAyXS5zdGVwICogZG91YmxlXG4gICAgdGhpcy5jaGFyYWN0ZXJNZ3Iub25MZXZlbFVwQnRuKHRoaXMubGV2ZWwpXG4gICAgdGhpcy5uYW1lTGFiZWwuc3RyaW5nID0gdGhpcy5sZXZlbERhdGFbdGhpcy5sZXZlbCAtIDFdLm5hbWVcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMub25DdXJyZW50U2NvcmVMYWJlbCh0aGlzLmxldmVsRGF0YVt0aGlzLmxldmVsIC0gMl0uc3RlcCAqIGRvdWJsZSwge1xuICAgICAgICB4OiAtMjQ4LFxuICAgICAgICB5OiAzNTBcbiAgICAgIH0sIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgLy8gdGhpcy50aXBCb3guaW5pdCh0aGlzKSDmr4/mrKHljYfnuqflsLHlko/or5dcbiAgICAgICAgdGhpcy5vblN0ZXAodGhpcy5sZXZlbERhdGFbdGhpcy5sZXZlbCAtIDJdLnN0ZXAgKiBkb3VibGUpLnRoZW4oKVxuICAgICAgICB0aGlzLl9nYW1lLl9zdGF0dXMgPSAxXG4gICAgICAgIHRoaXMubWFpblNjb3JlTGFiZWwubm9kZS5hY3RpdmUgPSBmYWxzZVxuICAgICAgfSkpXG4gICAgfSwgMzAwKTtcbiAgICB0aGlzLnNob3dOZXh0TGV2ZWxEYXRhKClcbiAgICB0aGlzLmNoZWNrTGV2ZWxVcCgpXG4gIH0sXG4gIC8vIHRvZG86IOaWsOWinuS4gOS4qiDliqjnlLsg5pWw5a2X5LiK5rWu5ZKM57yp5pS+XG4gIHNob3dTdGVwQW5pKG51bSkge1xuICAgIHRoaXMuc3RlcEFuaUxhYmVsLnN0cmluZyA9ICcrJyArIChudW0gKyAnJylcbiAgICB0aGlzLnN0ZXBBbmlMYWJlbC5ub2RlLnggPSAtMjQ4XG4gICAgdGhpcy5zdGVwQW5pTGFiZWwubm9kZS55ID0gNDAwXG4gICAgdGhpcy5zdGVwQW5pTGFiZWwubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2MudG9nZ2xlVmlzaWJpbGl0eSgpLCBjYy5tb3ZlQnkoMC42LCAwLCA2MCksIGNjLnRvZ2dsZVZpc2liaWxpdHkoKSkpXG4gICAgbGV0IGFjdGlvbiA9IGNjLnNlcXVlbmNlKGNjLnNjYWxlVG8oMC4yLCAwLjgpLCBBQy5wb3BPdXQoMC44KSlcbiAgICB0aGlzLmxlZnRTdGVwTGFiZWwubm9kZS5wYXJlbnQucnVuQWN0aW9uKGFjdGlvbilcbiAgfSxcbiAgLy8g5ri45oiP57uT5p2fXG4gIC8vIHRvZG8g5aSN5rS7XG4gIG9uR2FtZU92ZXIoaXNUcnVlKSB7XG4gICAgaXNUcnVlID0gaXNUcnVlIHx8IDBcbiAgICBpZiAodGhpcy5fZ2FtZS5fc3RhdHVzICE9IDMgJiYgKGlzVHJ1ZSB8fCB0aGlzLnJldml2ZVRpbWUgPj0gMykpIHtcbiAgICAgIHRoaXMuX2dhbWUuZ2FtZU92ZXIoKVxuICAgICAgdGhpcy51cGRhdGVGYWlsUGFnZSgpXG4gICAgICBpZiAodGhpcy5fY29udHJvbGxlci5zb2NpYWwubm9kZS5hY3RpdmUpIHtcbiAgICAgICAgLy8g5LuF5LiK5Lyg5YiG5pWwXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXIuc29jaWFsLm9uR2FtZU92ZXIodGhpcy5sZXZlbCwgdGhpcy5zY29yZSlcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFpc1RydWUpIHtcbiAgICAgIHRoaXMuX2dhbWUuYXNrUmV2aXZlKClcbiAgICB9XG4gIH0sXG4gIG9uRG91YmxlU3RlcEJ0bigpIHtcbiAgICBpZiAodGhpcy5fY29udHJvbGxlci5zb2NpYWwubm9kZS5hY3RpdmUpIHtcbiAgICAgIHRoaXMuX2NvbnRyb2xsZXIuc29jaWFsLm9uUmV2aXZlQnV0dG9uKDApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25MZXZlbFVwQnV0dG9uKDIpXG4gICAgfVxuICB9LFxuICBvbkRvdWJsZVN0ZXAoKSB7XG4gICAgdGhpcy5vbkxldmVsVXBCdXR0b24oMilcbiAgfSxcbiAgb25SZXZpdmUoKSB7XG4gICAgdGhpcy5yZXZpdmVUaW1lICs9IDFcbiAgICB0aGlzLm9uU3RlcCg1KS50aGVuKClcbiAgfSxcbiAgLy8g5bGV56S65LiL5LiA57qn55qE5L+h5oGvXG4gIHNob3dOZXh0TGV2ZWxEYXRhKCkge1xuICAgIGxldCBuZXh0TGV2ZWxEYXRhID0gdGhpcy5sZXZlbERhdGFbdGhpcy5sZXZlbF1cbiAgfSxcbiAgLy8g6L6+5Yiw5pyA6auY57qn5LmL5ZCOIOmakOiXj1xuICBoaWRlTmV4dExldmVsRGF0YSgpIHtcblxuICB9LFxuICB1cGRhdGVGYWlsUGFnZSgpIHtcbiAgICB0aGlzLmZhaWxTY29yZS5zdHJpbmcgPSBcIiBcIiArICh0aGlzLnNjb3JlICsgJycpXG4gICAgdGhpcy5jaGFyYWN0ZXJNZ3Iub25GYWlsKHRoaXMubGV2ZWwpXG4gICAgdGhpcy5mYWlsTmFtZS5zdHJpbmcgPSB0aGlzLmxldmVsRGF0YVt0aGlzLmxldmVsIC0gMV0ubmFtZVxuICAgIC8vdGhpcy5mYWlsSGlnaFNjb3JlLnN0cmluZyA9IFwi5q2j5Zyo6I635Y+W5oKo55qE5pyA6auY5YiGLi4uXCJcbiAgfSxcblxufSk7Il19
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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/check.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'a3721/aOY1GFrIWHHBzYGsi', 'check');
// Script/check.js

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
        // this.map[i][j].getComponent('cell').growInit() //全部初始化
        if (!this.map[i][j]) {//    cc.log('报错x,y:', i, j)
        }

        this.map[i][j].getComponent('cell').isSingle = false;
        this.map[i][j].getComponent('cell').warningInit();
        this.groups[i][j] = [];
      }
    }
  },
  check: function check(g) {
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
        var x = target.getComponent('cell').iid;
        var y = target.getComponent('cell').jid;
        var isSingle = true;

        if (x - 1 >= 0 && this.map[x - 1][y].getComponent('cell').color == target.getComponent('cell').color) {
          isSingle = false;
        }

        if (x + 1 < this.mapLength && this.map[x + 1][y].getComponent('cell').color == target.getComponent('cell').color) {
          isSingle = false;
        }

        if (y - 1 >= 0 && this.map[x][y - 1].getComponent('cell').color == target.getComponent('cell').color) {
          isSingle = false;
        }

        if (y + 1 < this.mapLength && this.map[x][y + 1].getComponent('cell').color == target.getComponent('cell').color) {
          isSingle = false;
        }

        this.map[_i][j].getComponent('cell').isSingle = isSingle;
        console.log(_i, j, this.map[_i][j].getComponent('cell').isSingle, this.map[_i][j].getComponent('cell').color);

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
    // if (target.getComponent('cell').isPush==true) {
    //   return
    // }
    target.getComponent('cell').isPush = true;
    this.groups[i][j].push(target);
    var x = target.getComponent('cell').iid;
    var y = target.getComponent('cell').jid;

    if (x - 1 >= 0) {
      if (!this.map[x - 1][y].getComponent('cell').isPush && this.map[x - 1][y].getComponent('cell').color == target.getComponent('cell').color) {
        this.pushPop(this.map[x - 1][y], i, j);
      }
    }

    if (x + 1 < this.mapLength) {
      if (!this.map[x + 1][y].getComponent('cell').isPush && this.map[x + 1][y].getComponent('cell').color == target.getComponent('cell').color) {
        this.pushPop(this.map[x + 1][y], i, j);
      }
    }

    if (y - 1 >= 0) {
      if (!this.map[x][y - 1].getComponent('cell').isPush && this.map[x][y - 1].getComponent('cell').color == target.getComponent('cell').color) {
        this.pushPop(this.map[x][y - 1], i, j);
      }
    }

    if (y + 1 < this.mapLength) {
      if (!this.map[x][y + 1].getComponent('cell').isPush && this.map[x][y + 1].getComponent('cell').color == target.getComponent('cell').color) {
        this.pushPop(this.map[x][y + 1], i, j);
      }
    } // 判断方块是否单身

  },
  warning: function warning(type, group) {
    group.map(function (item) {
      item.getComponent('cell').onWarning(type);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxjaGVjay5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsImdyb3VwcyIsIm1hcCIsIm1hcExlbmd0aCIsImluaXQiLCJnIiwiX2dhbWUiLCJyb3dOdW0iLCJpIiwiaiIsImdldENvbXBvbmVudCIsImlzU2luZ2xlIiwid2FybmluZ0luaXQiLCJjaGVjayIsInByb3BDb25maWciLCJfY29udHJvbGxlciIsImNvbmZpZyIsImpzb24iLCJtaW4iLCJsZW5ndGgiLCJwdXNoUG9wIiwidGFyZ2V0IiwieCIsImlpZCIsInkiLCJqaWQiLCJjb2xvciIsImNvbnNvbGUiLCJsb2ciLCJ6IiwibWF4Iiwid2FybmluZyIsInR5cGUiLCJpc1B1c2giLCJwdXNoIiwiZ3JvdXAiLCJpdGVtIiwib25XYXJuaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBSUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBRVBDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxNQUFNLEVBQUUsRUFERTtBQUVWQyxJQUFBQSxHQUFHLEVBQUUsRUFGSztBQUdWQyxJQUFBQSxTQUFTLEVBQUU7QUFIRCxHQUZMO0FBT1BDLEVBQUFBLElBUE8sZ0JBT0ZDLENBUEUsRUFPQztBQUNOLFNBQUtDLEtBQUwsR0FBYUQsQ0FBYjtBQUNBLFNBQUtILEdBQUwsR0FBV0csQ0FBQyxDQUFDSCxHQUFiO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQkUsQ0FBQyxDQUFDRSxNQUFuQjs7QUFDQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS0wsU0FBekIsRUFBb0NLLENBQUMsRUFBckMsRUFBeUM7QUFBRTtBQUN6QyxXQUFLUCxNQUFMLENBQVlPLENBQVosSUFBaUIsRUFBakI7O0FBQ0EsV0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FB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QUFoQixDQUFiLEVBQWlDaEIsQ0FBakMsRUFBb0NDLENBQXBDO0FBQ0Q7QUFDRjs7QUFDRCxRQUFLZSxDQUFDLEdBQUcsQ0FBTCxHQUFVLEtBQUtyQixTQUFuQixFQUE4QjtBQUM1QixVQUFJLENBQUMsS0FBS0QsR0FBTCxDQUFTb0IsQ0FBVCxFQUFZRSxDQUFDLEdBQUcsQ0FBaEIsRUFBbUJkLFlBQW5CLENBQWdDLE1BQWhDLEVBQXdDdUIsTUFBekMsSUFBbUQsS0FBSy9CLEdBQUwsQ0FBU29CLENBQVQsRUFBWUUsQ0FBQyxHQUFHLENBQWhCLEVBQW1CZCxZQUFuQixDQUFnQyxNQUFoQyxFQUF3Q2dCLEtBQXhDLElBQWlETCxNQUFNLENBQUNYLFlBQVAsQ0FBb0IsTUFBcEIsRUFBNEJnQixLQUFwSSxFQUEySTtBQUN6SSxhQUFLTixPQUFMLENBQWEsS0FBS2xCLEdBQUwsQ0FBU29CLENBQVQsRUFBWUUsQ0FBQyxHQUFHLENBQWhCLENBQWIsRUFBaUNoQixDQUFqQyxFQUFvQ0MsQ0FBcEM7QUFDRDtBQUNGLEtBM0JtQixDQTZCcEI7O0FBRUQsR0FoR007QUFpR1BzQixFQUFBQSxPQWpHTyxtQkFpR0NDLElBakdELEVBaUdPRyxLQWpHUCxFQWlHYztBQUNuQkEsSUFBQUEsS0FBSyxDQUFDakMsR0FBTixDQUFVLFVBQUFrQyxJQUFJLEVBQUk7QUFDaEJBLE1BQUFBLElBQUksQ0FBQzFCLFlBQUwsQ0FBa0IsTUFBbEIsRUFBMEIyQixTQUExQixDQUFvQ0wsSUFBcEM7QUFDRCxLQUZEO0FBR0Q7QUFyR00sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAYXV0aG9yIGhleXVjaGFuZ1xuICogQGZpbGUg5qOA5rWL57uE5Lu2XG4gKi9cbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgZ3JvdXBzOiBbXSxcbiAgICBtYXA6IFtdLFxuICAgIG1hcExlbmd0aDogOFxuICB9LFxuICBpbml0KGcpIHtcbiAgICB0aGlzLl9nYW1lID0gZ1xuICAgIHRoaXMubWFwID0gZy5tYXBcbiAgICB0aGlzLm1hcExlbmd0aCA9IGcucm93TnVtXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1hcExlbmd0aDsgaSsrKSB7IC8v6KGMXG4gICAgICB0aGlzLmdyb3Vwc1tpXSA9IFtdXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMubWFwTGVuZ3RoOyBqKyspIHsgLy/liJdcbiAgICAgICAgLy8gdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdjZWxsJykuZ3Jvd0luaXQoKSAvL+WFqOmDqOWIneWni+WMllxuICAgICAgICBpZiAoIXRoaXMubWFwW2ldW2pdKSB7XG4gICAgICAgICAgLy8gICAgY2MubG9nKCfmiqXplJl4LHk6JywgaSwgailcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1hcFtpXVtqXS5nZXRDb21wb25lbnQoJ2NlbGwnKS5pc1NpbmdsZSA9IGZhbHNlXG4gICAgICAgIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnY2VsbCcpLndhcm5pbmdJbml0KClcbiAgICAgICAgdGhpcy5ncm91cHNbaV1bal0gPSBbXVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgY2hlY2soZykgeyAvL+ivpeWHveaVsOS4u+imgeeUqOS6juajgOa1i+S4gOS4quWMuuWdl+iDveWQpuW9ouaIkOmBk+WFt+etiVxuICAgIGxldCBwcm9wQ29uZmlnID0gZy5fY29udHJvbGxlci5jb25maWcuanNvbi5wcm9wQ29uZmlnXG4gICAgdGhpcy5fZ2FtZSA9IGdcbiAgICB0aGlzLm1hcCA9IGcubWFwXG4gICAgdGhpcy5tYXBMZW5ndGggPSBnLnJvd051bVxuICAgIGxldCBtaW4gPSA5OTlcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BDb25maWcubGVuZ3RoOyBpKyspIHtcbiAgICAgIG1pbiA9IHByb3BDb25maWdbaV0ubWluIDwgbWluID8gcHJvcENvbmZpZ1tpXS5taW4gOiBtaW5cbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1hcExlbmd0aDsgaSsrKSB7IC8v6KGMXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMubWFwTGVuZ3RoOyBqKyspIHsgLy/liJdcbiAgICAgICAgdGhpcy5wdXNoUG9wKHRoaXMubWFwW2ldW2pdLCBpLCBqKVxuICAgICAgICBsZXQgdGFyZ2V0ID0gdGhpcy5tYXBbaV1bal1cbiAgICAgICAgbGV0IHggPSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdjZWxsJykuaWlkXG4gICAgICAgIGxldCB5ID0gdGFyZ2V0LmdldENvbXBvbmVudCgnY2VsbCcpLmppZFxuICAgICAgICBsZXQgaXNTaW5nbGUgPSB0cnVlXG4gICAgICAgIGlmICgoeCAtIDEpID49IDAgJiYgdGhpcy5tYXBbeCAtIDFdW3ldLmdldENvbXBvbmVudCgnY2VsbCcpLmNvbG9yID09IHRhcmdldC5nZXRDb21wb25lbnQoJ2NlbGwnKS5jb2xvcikge1xuICAgICAgICAgIGlzU2luZ2xlID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBpZiAoKHggKyAxKSA8IHRoaXMubWFwTGVuZ3RoICYmIHRoaXMubWFwW3ggKyAxXVt5XS5nZXRDb21wb25lbnQoJ2NlbGwnKS5jb2xvciA9PSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdjZWxsJykuY29sb3IpIHtcbiAgICAgICAgICBpc1NpbmdsZSA9IGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKHkgLSAxKSA+PSAwICYmIHRoaXMubWFwW3hdW3kgLSAxXS5nZXRDb21wb25lbnQoJ2NlbGwnKS5jb2xvciA9PSB0YXJnZXQuZ2V0Q29tcG9uZW50KCdjZWxsJykuY29sb3IpIHtcbiAgICAgICAgICBpc1NpbmdsZSA9IGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCh5ICsgMSkgPCB0aGlzLm1hcExlbmd0aCAmJiB0aGlzLm1hcFt4XVt5ICsgMV0uZ2V0Q29tcG9uZW50KCdjZWxsJykuY29sb3IgPT0gdGFyZ2V0LmdldENvbXBvbmVudCgnY2VsbCcpLmNvbG9yKSB7XG4gICAgICAgICAgaXNTaW5nbGUgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnY2VsbCcpLmlzU2luZ2xlID0gaXNTaW5nbGVcbiAgICAgICAgY29uc29sZS5sb2coaSwgaiwgdGhpcy5tYXBbaV1bal0uZ2V0Q29tcG9uZW50KCdjZWxsJykuaXNTaW5nbGUsIHRoaXMubWFwW2ldW2pdLmdldENvbXBvbmVudCgnY2VsbCcpLmNvbG9yKVxuICAgICAgICBpZiAodGhpcy5ncm91cHNbaV1bal0ubGVuZ3RoID49IG1pbikge1xuICAgICAgICAgIGZvciAobGV0IHogPSAwOyB6IDwgcHJvcENvbmZpZy5sZW5ndGg7IHorKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdXBzW2ldW2pdLmxlbmd0aCA8PSBwcm9wQ29uZmlnW3pdLm1heCAmJiB0aGlzLmdyb3Vwc1tpXVtqXS5sZW5ndGggPj0gcHJvcENvbmZpZ1t6XS5taW4pIHtcbiAgICAgICAgICAgICAgdGhpcy53YXJuaW5nKHByb3BDb25maWdbel0udHlwZSwgdGhpcy5ncm91cHNbaV1bal0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBwdXNoUG9wKHRhcmdldCwgaSwgaikgeyAvL+eUqOS6juWIpOaWreS4gOS4quaWueWdl+Wbm+S4quaWueWQkeS4iueahOaWueWdl+minOiJsuaYr+WQpuS4gOagtyDlpoLmnpzkuIDmoLfliJnliqDlhaXnu4Qg5aaC5p6c57uE6ZW/5bqm5bCP5LqOMeWImei/lOWbnmZhbHNlP1xuICAgIC8vIGlmICh0YXJnZXQuZ2V0Q29tcG9uZW50KCdjZWxsJykuaXNQdXNoPT10cnVlKSB7XG4gICAgLy8gICByZXR1cm5cbiAgICAvLyB9XG4gICAgdGFyZ2V0LmdldENvbXBvbmVudCgnY2VsbCcpLmlzUHVzaCA9IHRydWVcbiAgICB0aGlzLmdyb3Vwc1tpXVtqXS5wdXNoKHRhcmdldClcbiAgICBsZXQgeCA9IHRhcmdldC5nZXRDb21wb25lbnQoJ2NlbGwnKS5paWRcbiAgICBsZXQgeSA9IHRhcmdldC5nZXRDb21wb25lbnQoJ2NlbGwnKS5qaWRcbiAgICBpZiAoKHggLSAxKSA+PSAwKSB7XG4gICAgICBpZiAoIXRoaXMubWFwW3ggLSAxXVt5XS5nZXRDb21wb25lbnQoJ2NlbGwnKS5pc1B1c2ggJiYgdGhpcy5tYXBbeCAtIDFdW3ldLmdldENvbXBvbmVudCgnY2VsbCcpLmNvbG9yID09IHRhcmdldC5nZXRDb21wb25lbnQoJ2NlbGwnKS5jb2xvcikge1xuICAgICAgICB0aGlzLnB1c2hQb3AodGhpcy5tYXBbeCAtIDFdW3ldLCBpLCBqKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoKHggKyAxKSA8IHRoaXMubWFwTGVuZ3RoKSB7XG4gICAgICBpZiAoIXRoaXMubWFwW3ggKyAxXVt5XS5nZXRDb21wb25lbnQoJ2NlbGwnKS5pc1B1c2ggJiYgdGhpcy5tYXBbeCArIDFdW3ldLmdldENvbXBvbmVudCgnY2VsbCcpLmNvbG9yID09IHRhcmdldC5nZXRDb21wb25lbnQoJ2NlbGwnKS5jb2xvcikge1xuICAgICAgICB0aGlzLnB1c2hQb3AodGhpcy5tYXBbeCArIDFdW3ldLCBpLCBqKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoKHkgLSAxKSA+PSAwKSB7XG4gICAgICBpZiAoIXRoaXMubWFwW3hdW3kgLSAxXS5nZXRDb21wb25lbnQoJ2NlbGwnKS5pc1B1c2ggJiYgdGhpcy5tYXBbeF1beSAtIDFdLmdldENvbXBvbmVudCgnY2VsbCcpLmNvbG9yID09IHRhcmdldC5nZXRDb21wb25lbnQoJ2NlbGwnKS5jb2xvcikge1xuICAgICAgICB0aGlzLnB1c2hQb3AodGhpcy5tYXBbeF1beSAtIDFdLCBpLCBqKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoKHkgKyAxKSA8IHRoaXMubWFwTGVuZ3RoKSB7XG4gICAgICBpZiAoIXRoaXMubWFwW3hdW3kgKyAxXS5nZXRDb21wb25lbnQoJ2NlbGwnKS5pc1B1c2ggJiYgdGhpcy5tYXBbeF1beSArIDFdLmdldENvbXBvbmVudCgnY2VsbCcpLmNvbG9yID09IHRhcmdldC5nZXRDb21wb25lbnQoJ2NlbGwnKS5jb2xvcikge1xuICAgICAgICB0aGlzLnB1c2hQb3AodGhpcy5tYXBbeF1beSArIDFdLCBpLCBqKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIOWIpOaWreaWueWdl+aYr+WQpuWNlei6q1xuXG4gIH0sXG4gIHdhcm5pbmcodHlwZSwgZ3JvdXApIHtcbiAgICBncm91cC5tYXAoaXRlbSA9PiB7XG4gICAgICBpdGVtLmdldENvbXBvbmVudCgnY2VsbCcpLm9uV2FybmluZyh0eXBlKVxuICAgIH0pXG4gIH1cbn0pOyJdfQ==
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
                    var __filename = 'preview-scripts/assets/Script/pageMgr.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'a1bb7xaDvtHXLTuIo0MRIEu', 'pageMgr');
// Script/pageMgr.js

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxwYWdlTWdyLmpzIl0sIm5hbWVzIjpbIkFDIiwicmVxdWlyZSIsImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwic3RhdHVzIiwicGFnZXMiLCJOb2RlIiwic3RhcnQiLCJsYXRlU3RhcnQiLCJ3aWR0aCIsIndpblNpemUiLCJ3aW5kb3ciLCJoZWlnaHQiLCJhZG9wdENhbnZhcyIsImNhbnZhcyIsImRpcmVjdG9yIiwiZ2V0U2NlbmUiLCJnZXRDaGlsZEJ5TmFtZSIsImdldENvbXBvbmVudCIsIkNhbnZhcyIsInJhdGVSIiwiZGVzaWduUmVzb2x1dGlvbiIsInJhdGVWIiwiZml0SGVpZ2h0IiwiZml0V2lkdGgiLCJvbk9wZW5QYWdlIiwibnVtIiwiY2FsbEZ1biIsImNsb3NlQWxsUGFnZXMiLCJhY3RpdmUiLCJhZGRQYWdlIiwic2NhbGUiLCJydW5BY3Rpb24iLCJwb3BPdXQiLCJyZW1vdmVQYWdlIiwic2VxdWVuY2UiLCJwb3BJbiIsImNhbGxGdW5jIiwib25CdXR0b25PcGVuUGFnZSIsImV2ZW50IiwiY3VzdCIsIm9uQnV0dG9uQWRkUGFnZSIsIm9uQnV0dG9uUmVtb3ZlUGFnZSIsImZvckVhY2giLCJlbGVtZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBSUEsSUFBSUEsRUFBRSxHQUFHQyxPQUFPLENBQUMsU0FBRCxDQUFoQjs7QUFDQUMsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFFUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLE1BQU0sRUFBRSxDQURFO0FBQ0M7QUFDWEMsSUFBQUEsS0FBSyxFQUFFLENBQUNMLEVBQUUsQ0FBQ00sSUFBSjtBQUZHLEdBRkw7QUFNUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQyxFQUFBQSxLQWRPLG1CQWNDO0FBQ04sU0FBS0MsU0FBTDtBQUNELEdBaEJNO0FB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eUI7QUFDOUIsU0FBS04sVUFBTCxDQUFnQk0sSUFBaEI7QUFDRCxHQXhFTTtBQXlFUFosRUFBQUEsYUF6RU8sMkJBeUVTO0FBQ2QsU0FBS3ZCLEtBQUwsQ0FBV3NDLE9BQVgsQ0FBbUIsVUFBQUMsT0FBTyxFQUFJO0FBQzVCQSxNQUFBQSxPQUFPLENBQUNmLE1BQVIsR0FBaUIsS0FBakI7QUFDRCxLQUZEO0FBR0Q7QUE3RU0sQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAYXV0aG9yIGhleXVjaGFuZ1xuICogQGZpbGUgIOmAmueUqOmhtemdouaOp+WItuWZqOWSjOmAgumFjVxuICovXG52YXIgQUMgPSByZXF1aXJlKCdHYW1lQWN0JylcbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgc3RhdHVzOiAwLCAvL+mhtemdoueKtuaAgVxuICAgIHBhZ2VzOiBbY2MuTm9kZV0sXG4gIH0sXG4gIC8vIDAg5byA5aeL5ri45oiP6aG16Z2iXG4gIC8vIDEg5ri45oiP6aG16Z2iXG4gIC8vIDIgVUnpobXpnaJcbiAgLy8gMyDov4flhbPpobXpnaJcbiAgLy8gNCDlpLHotKXpobXpnaJcbiAgLy8gNSDlpI3mtLvpobXpnaJcbiAgLy8gNiDmjpLooYzmppzpobXpnaJcblxuICBzdGFydCgpIHtcbiAgICB0aGlzLmxhdGVTdGFydCgpXG4gIH0sXG4gIGxhdGVTdGFydCgpIHtcbiAgICB0aGlzLndpZHRoID0gY2Mud2luU2l6ZS53aWR0aFxuICAgIHdpbmRvdy53aWR0aCA9IHRoaXMud2lkdGhcbiAgICB0aGlzLmhlaWdodCA9IGNjLndpblNpemUuaGVpZ2h0XG4gICAgd2luZG93LmhlaWdodCA9IHRoaXMuaGVpZ2h0XG4gICAgLy8g5a2Y5Li65YWo5bGA5Y+Y6YePXG4gICAgdGhpcy5hZG9wdENhbnZhcygpXG4gIH0sXG4gIC8vIOmAgumFjeino+WGs+aWueahiFxuICBhZG9wdENhbnZhcygpIHtcbiAgICBsZXQgY2FudmFzID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZSgnQ2FudmFzJykuZ2V0Q29tcG9uZW50KGNjLkNhbnZhcylcbiAgICAvLyDorr7orqHliIbovqjnjofmr5RcbiAgICBsZXQgcmF0ZVIgPSBjYW52YXMuZGVzaWduUmVzb2x1dGlvbi5oZWlnaHQgLyBjYW52YXMuZGVzaWduUmVzb2x1dGlvbi53aWR0aDtcbiAgICAvLyDmmL7npLrliIbovqjnjofmr5RcbiAgICBsZXQgcmF0ZVYgPSB0aGlzLmhlaWdodCAvIHRoaXMud2lkdGg7XG4gICAgaWYgKHJhdGVWID4gcmF0ZVIpIHtcbiAgICAgIGNhbnZhcy5maXRIZWlnaHQgPSBmYWxzZTtcbiAgICAgIGNhbnZhcy5maXRXaWR0aCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbnZhcy5maXRIZWlnaHQgPSB0cnVlO1xuICAgICAgY2FudmFzLmZpdFdpZHRoID0gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIG9uT3BlblBhZ2UobnVtLCBjYWxsRnVuKSB7XG4gICAgdGhpcy5jbG9zZUFsbFBhZ2VzKClcbiAgICB0aGlzLnBhZ2VzW251bV0uYWN0aXZlID0gdHJ1ZVxuICAgIC8vIGlmIChjYWxsRnVuKSB7XG4gICAgLy8gICB0aGlzLmNhbGxGdW4oKTtcbiAgICAvLyB9XG4gIH0sXG4gIGFkZFBhZ2UobnVtLCBjYWxsRnVuKSB7XG4gICAgdGhpcy5wYWdlc1tudW1dLnNjYWxlID0gMC41XG4gICAgdGhpcy5wYWdlc1tudW1dLmFjdGl2ZSA9IHRydWVcbiAgICB0aGlzLnBhZ2VzW251bV0ucnVuQWN0aW9uKEFDLnBvcE91dCgwLjUpKVxuICAgIC8vIGlmIChjYWxsRnVuKSB7XG4gICAgLy8gICB0aGlzLmNhbGxGdW4oKTtcbiAgICAvLyB9XG4gIH0sXG4gIHJlbW92ZVBhZ2UobnVtLCBjYWxsRnVuKSB7XG4gICAgdGhpcy5wYWdlc1tudW1dLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShBQy5wb3BJbigwLjUpLGNjLmNhbGxGdW5jKCgpPT57XG4gICAgICB0aGlzLnBhZ2VzW251bV0uYWN0aXZlID0gZmFsc2VcbiAgICB9LHRoaXMpKSlcbiAgICAvLyBpZiAoY2FsbEZ1bikge1xuICAgIC8vICAgdGhpcy5jYWxsRnVuKCk7XG4gICAgLy8gfVxuICB9LFxuICBvbkJ1dHRvbk9wZW5QYWdlKGV2ZW50LCBjdXN0KSB7XG4gICAgdGhpcy5vbk9wZW5QYWdlKGN1c3QpO1xuICB9LFxuICBvbkJ1dHRvbkFkZFBhZ2UoZXZlbnQsIGN1c3QpIHtcbiAgICB0aGlzLmFkZFBhZ2UoY3VzdCk7XG4gIH0sXG4gIG9uQnV0dG9uUmVtb3ZlUGFnZShldmVudCwgY3VzdCkge1xuICAgIHRoaXMucmVtb3ZlUGFnZShjdXN0KTtcbiAgfSxcbiAgY2xvc2VBbGxQYWdlcygpIHtcbiAgICB0aGlzLnBhZ2VzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICBlbGVtZW50LmFjdGl2ZSA9IGZhbHNlXG4gICAgfSk7XG4gIH0sXG59KTsiXX0=
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
    musicMgr: require('musicMgr'),
    //音乐控制组件
    game: require('game'),
    //主游戏控制器
    pageMgr: require('pageMgr'),
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

    this.musicMgr.init();
    this.lateStart();
  },
  lateStart: function lateStart() {
    if (this.social.node.active) {
      this.social.closeBannerAdv();
    }

    this.pictorial.getComponent('pictorial').init(this);
    this.startPage.bannerNode.scale = 1;
    this.pageMgr.onOpenPage(0);
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
    this.pageMgr.onOpenPage(1);
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
      this.pageMgr.addPage(6);
    }
  },
  closeGroupRank: function closeGroupRank() {
    this.groupRank.active = false;
    this.navNode.active = true;

    if (this.social.node.active) {
      this.social.closeGroupRank();
      this.pageMgr.removePage(6);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxjb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwibXVzaWNNZ3IiLCJyZXF1aXJlIiwiZ2FtZSIsInBhZ2VNZ3IiLCJzb2NpYWwiLCJjb25maWciLCJKc29uQXNzZXQiLCJnYW1lRGF0YSIsInNjb3JlTWdyIiwidG90YWxSYW5rIiwiTm9kZSIsImdyb3VwUmFuayIsInN0YXJ0UGFnZSIsIm5hdk5vZGUiLCJwaWN0b3JpYWwiLCJoZWxwUGFnZSIsInN0YXJ0IiwiYWN0aXZlIiwiaW5pdCIsIm5vZGUiLCJsYXRlU3RhcnQiLCJjbG9zZUJhbm5lckFkdiIsImdldENvbXBvbmVudCIsImJhbm5lck5vZGUiLCJzY2FsZSIsIm9uT3BlblBhZ2UiLCJvbkdhbWVTdGFydEJ1dHRvbiIsIm9wZW5CYW5uZXJBZHYiLCJzaG93QW5pbWF0aW9uIiwidGhlbiIsImdhbWVTdGFydCIsImNsb3NlUmFuayIsIm9wZW5SYW5rIiwic2hvd1JhbmsiLCJvcGVuR3JvdXBSYW5rIiwic2hvd0dyb3VwUmFuayIsImFkZFBhZ2UiLCJjbG9zZUdyb3VwUmFuayIsInJlbW92ZVBhZ2UiLCJvcGVuUGljdG9yaWFsIiwiY2xvc2VQaWN0b3JpYWwiLCJvcGVuSGVscFBhZ2UiLCJjbG9zZUhlbHBQYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBSUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBRVBDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxRQUFRLEVBQUVDLE9BQU8sQ0FBQyxVQUFELENBRFA7QUFDcUI7QUFDL0JDLElBQUFBLElBQUksRUFBRUQsT0FBTyxDQUFDLE1BQUQsQ0FGSDtBQUVhO0FBQ3ZCRSxJQUFBQSxPQUFPLEVBQUVGLE9BQU8sQ0FBQyxTQUFELENBSE47QUFHbUI7QUFDN0JHLElBQUFBLE1BQU0s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QUtiLE1BQUwsQ0FBWWUsSUFBWixDQUFpQkYsTUFBckIsRUFBNkI7QUFDM0IsV0FBS2IsTUFBTCxDQUFZK0IsYUFBWjtBQUNBLFdBQUtoQyxPQUFMLENBQWFpQyxPQUFiLENBQXFCLENBQXJCO0FBQ0Q7QUFDRixHQXBFTTtBQXFFUEMsRUFBQUEsY0FyRU8sNEJBcUVVO0FBQ2YsU0FBSzFCLFNBQUwsQ0FBZU0sTUFBZixHQUF3QixLQUF4QjtBQUNBLFNBQUtKLE9BQUwsQ0FBYUksTUFBYixHQUFzQixJQUF0Qjs7QUFDQSxRQUFJLEtBQUtiLE1BQUwsQ0FBWWUsSUFBWixDQUFpQkYsTUFBckIsRUFBNkI7QUFDM0IsV0FBS2IsTUFBTCxDQUFZaUMsY0FBWjtBQUNBLFdBQUtsQyxPQUFMLENBQWFtQyxVQUFiLENBQXdCLENBQXhCO0FBQ0Q7QUFDRixHQTVFTTtBQTZFUEMsRUFBQUEsYUE3RU8sMkJBNkVTO0FBQ2QsU0FBS3pCLFNBQUwsQ0FBZUcsTUFBZixHQUF3QixJQUF4QjtBQUNELEdBL0VNO0FBZ0ZQdUIsRUFBQUEsY0FoRk8sNEJBZ0ZVO0FBQ2YsU0FBSzFCLFNBQUwsQ0FBZUcsTUFBZixHQUF3QixLQUF4QjtBQUNELEdBbEZNO0FBbUZQd0IsRUFBQUEsWUFuRk8sMEJBbUZRO0FBQ2IsU0FBSzFCLFFBQUwsQ0FBY0UsTUFBZCxHQUF1QixJQUF2QjtBQUNELEdBckZNO0FBc0ZQeUIsRUFBQUEsYUF0Rk8sMkJBc0ZTO0FBQ2QsU0FBSzNCLFFBQUwsQ0FBY0UsTUFBZCxHQUF1QixLQUF2QjtBQUNEO0FBeEZNLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBoZXl1Y2hhbmdcbiAqIEBmaWxlIOS4u+aOp+WItuWZqFxuICovXG5jYy5DbGFzcyh7XG4gIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcbiAgcHJvcGVydGllczoge1xuICAgIG11c2ljTWdyOiByZXF1aXJlKCdtdXNpY01ncicpLCAvL+mfs+S5kOaOp+WItue7hOS7tlxuICAgIGdhbWU6IHJlcXVpcmUoJ2dhbWUnKSwgLy/kuLvmuLjmiI/mjqfliLblmahcbiAgICBwYWdlTWdyOiByZXF1aXJlKCdwYWdlTWdyJyksIC8v6aG16Z2i5o6n5Yi25ZmoXG4gICAgc29jaWFsOiByZXF1aXJlKCdzb2NpYWwnKSwgLy/mjpLooYzmppzjgIHlub/lkYrmjqfliLblmahcbiAgICBjb25maWc6IGNjLkpzb25Bc3NldCxcbiAgICBnYW1lRGF0YTogY2MuSnNvbkFzc2V0LFxuICAgIHNjb3JlTWdyOiByZXF1aXJlKCdzY29yZScpLCAvL+WIhuaVsCDnibnmlYjmjqfliLZcbiAgICB0b3RhbFJhbms6IGNjLk5vZGUsXG4gICAgZ3JvdXBSYW5rOiBjYy5Ob2RlLFxuICAgIHN0YXJ0UGFnZTogcmVxdWlyZSgnc3RhcnRQYWdlJyksXG4gICAgbmF2Tm9kZTogY2MuTm9kZSxcbiAgICBwaWN0b3JpYWw6IGNjLk5vZGUsXG4gICAgaGVscFBhZ2U6IGNjLk5vZGUsXG4gIH0sXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMudG90YWxSYW5rLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5waWN0b3JpYWwuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLmdhbWUuaW5pdCh0aGlzKVxuICAgIGlmICh0aGlzLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5zb2NpYWwuaW5pdCh0aGlzKVxuICAgIH1cbiAgICB0aGlzLm11c2ljTWdyLmluaXQoKVxuICAgIHRoaXMubGF0ZVN0YXJ0KClcbiAgfSxcbiAgbGF0ZVN0YXJ0KCkge1xuICAgIGlmICh0aGlzLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5zb2NpYWwuY2xvc2VCYW5uZXJBZHYoKVxuICAgIH1cbiAgICB0aGlzLnBpY3RvcmlhbC5nZXRDb21wb25lbnQoJ3BpY3RvcmlhbCcpLmluaXQodGhpcylcbiAgICB0aGlzLnN0YXJ0UGFnZS5iYW5uZXJOb2RlLnNjYWxlID0gMVxuICAgIHRoaXMucGFnZU1nci5vbk9wZW5QYWdlKDApXG4gIH0sXG4gIG9uR2FtZVN0YXJ0QnV0dG9uKCkge1xuICAgIC8vIFRPRE86ICDlop7liqDkuIDkuKrliqjnlLtcbiAgICBpZiAodGhpcy5zb2NpYWwubm9kZS5hY3RpdmUpIHtcbiAgICAgIHRoaXMuc29jaWFsLm9wZW5CYW5uZXJBZHYoKVxuICAgIH1cbiAgICB0aGlzLnN0YXJ0UGFnZS5zaG93QW5pbWF0aW9uKCkudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLmdhbWVTdGFydCgpXG4gICAgfSlcbiAgfSxcbiAgZ2FtZVN0YXJ0KCkge1xuICAgIHRoaXMucGFnZU1nci5vbk9wZW5QYWdlKDEpXG4gICAgdGhpcy5nYW1lLmdhbWVTdGFydCgpXG4gIH0sXG4gIGNsb3NlUmFuaygpIHtcbiAgICB0aGlzLnRvdGFsUmFuay5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMubmF2Tm9kZS5hY3RpdmUgPSB0cnVlXG4gICAgaWYgKHRoaXMuc29jaWFsLm5vZGUuYWN0aXZlKSB7XG4gICAgICB0aGlzLnNvY2lhbC5jbG9zZVJhbmsoKVxuICAgIH1cbiAgfSxcbiAgb3BlblJhbmsoKSB7XG4gICAgdGhpcy50b3RhbFJhbmsuYWN0aXZlID0gdHJ1ZVxuICAgIHRoaXMubmF2Tm9kZS5hY3RpdmUgPSBmYWxzZVxuICAgIGlmICh0aGlzLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgdGhpcy5zb2NpYWwuc2hvd1JhbmsoKVxuICAgIH1cbiAgfSxcbiAgb3Blbkdyb3VwUmFuaygpIHtcbiAgICB0aGlzLmdyb3VwUmFuay5hY3RpdmUgPSB0cnVlXG4gICAgaWYgKHRoaXMuc29jaWFsLm5vZGUuYWN0aXZlKSB7XG4gICAgICB0aGlzLnNvY2lhbC5zaG93R3JvdXBSYW5rKClcbiAgICAgIHRoaXMucGFnZU1nci5hZGRQYWdlKDYpXG4gICAgfVxuICB9LFxuICBjbG9zZUdyb3VwUmFuaygpIHtcbiAgICB0aGlzLmdyb3VwUmFuay5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMubmF2Tm9kZS5hY3RpdmUgPSB0cnVlXG4gICAgaWYgKHRoaXMuc29jaWFsLm5vZGUuYWN0aXZlKSB7XG4gICAgICB0aGlzLnNvY2lhbC5jbG9zZUdyb3VwUmFuaygpXG4gICAgICB0aGlzLnBhZ2VNZ3IucmVtb3ZlUGFnZSg2KVxuICAgIH1cbiAgfSxcbiAgb3BlblBpY3RvcmlhbCgpIHtcbiAgICB0aGlzLnBpY3RvcmlhbC5hY3RpdmUgPSB0cnVlXG4gIH0sXG4gIGNsb3NlUGljdG9yaWFsKCkge1xuICAgIHRoaXMucGljdG9yaWFsLmFjdGl2ZSA9IGZhbHNlXG4gIH0sXG4gIG9wZW5IZWxwUGFnZSgpIHtcbiAgICB0aGlzLmhlbHBQYWdlLmFjdGl2ZSA9IHRydWVcbiAgfSxcbiAgY2xvc2VIZWxwUGFnZSgpIHtcbiAgICB0aGlzLmhlbHBQYWdlLmFjdGl2ZSA9IGZhbHNlXG4gIH1cbn0pOyJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/musicMgr.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '0fd3emgDv1Pc6rR7NiVJ4q/', 'musicMgr');
// Script/musicMgr.js

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxtdXNpY01nci5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInZvbHVtZSIsImF1ZGlvcyIsIkF1ZGlvU291cmNlIiwiYXVkaW9QcmVmYWIiLCJQcmVmYWIiLCJiZ011c2ljIiwid2luQXVkaW8iLCJkb3VibGVBdWRpbyIsImJvb21BdWRpbyIsIm1hZ2ljQXVkaW8iLCJpbml0IiwiYXVkaW8iLCJpbnN0YW5jZUF1ZGlvIiwiY3JlYXRlTXVzaWNQb29sIiwiY2hhbmdlVm9sIiwidm9sIiwiZm9yRWFjaCIsIml0ZW0iLCJpbmRleCIsIm9uUGxheUF1ZGlvIiwibnVtIiwic2VsZiIsImlzUGxheWluZyIsIm11c2ljIiwibXVzaWNQb29sIiwic2l6ZSIsImdldCIsImluc3RhbnRpYXRlIiwicGFyZW50Iiwibm9kZSIsImdldENvbXBvbmVudCIsInBsYXkiLCJyZXdpbmQiLCJwYXVzZUJnIiwicGF1c2UiLCJyZXN1bWVCZyIsInJlc3VtZSIsInN0YXJ0IiwiY2hlY2tCZyIsIm9uV2luIiwib25Eb3VibGUiLCJvbkJvb20iLCJvbk1hZ2ljIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBSUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ1AsYUFBU0QsRUFBRSxDQUFDRSxTQURMO0FBRVBDLEVBQUFBLFVBQVUsRUFBRTtBQUNWQyxJQUFBQSxNQUFNLEVBQUUsQ0FERTtBQUVWQyxJQUFBQSxNQUFNLEVBQUUsQ0FBQ0wsRUFBRSxDQUFDTSxXQUFKLENBRkU7QUFHVkMsSUFBQUEsV0FBVyxFQUFFUCxFQUFFLENBQUNRLE1BSE47QUFJVkMsSUFBQUEsT0FBTyxFQUFFVCxFQUFFLENBQUNNLFdBSkY7QUFLVkksSUFBQUEsUUFBUSxFQUFFVixFQUFFLENBQUNNLFdBTEg7QUFNVkssSUFBQUEsV0FBVyxFQUFFWCxFQUFFLENBQUNNLFdBTk47QUFPVk0sSUFBQUEsU0FBUyxF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akI7QUFDRCxHQW5GTTtBQXFGUFUsRUFBQUEsTUFyRk8sb0JBcUZFO0FBQ1AsU0FBS2pDLFNBQUwsQ0FBZXdCLE1BQWY7QUFDQSxTQUFLeEIsU0FBTCxDQUFldUIsSUFBZjtBQUNELEdBeEZNO0FBeUZQVyxFQUFBQSxPQXpGTyxxQkF5Rkc7QUFDUixTQUFLakMsVUFBTCxDQUFnQnVCLE1BQWhCO0FBQ0EsU0FBS3ZCLFVBQUwsQ0FBZ0JzQixJQUFoQjtBQUNEO0FBNUZNLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGF1dGhvciBoZXl1Y2hhbmdcbiAqIEBmaWxlICDpn7PkuZDmjqfliLbnu4Tku7ZcbiAqL1xuY2MuQ2xhc3Moe1xuICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG4gIHByb3BlcnRpZXM6IHtcbiAgICB2b2x1bWU6IDEsXG4gICAgYXVkaW9zOiBbY2MuQXVkaW9Tb3VyY2VdLFxuICAgIGF1ZGlvUHJlZmFiOiBjYy5QcmVmYWIsXG4gICAgYmdNdXNpYzogY2MuQXVkaW9Tb3VyY2UsXG4gICAgd2luQXVkaW86IGNjLkF1ZGlvU291cmNlLFxuICAgIGRvdWJsZUF1ZGlvOiBjYy5BdWRpb1NvdXJjZSxcbiAgICBib29tQXVkaW86IGNjLkF1ZGlvU291cmNlLFxuICAgIG1hZ2ljQXVkaW86IGNjLkF1ZGlvU291cmNlLFxuICAgIC8vYXVkaW9Tb3VyY2U6IGNjLkF1ZGlvU291cmNlLFxuICB9LFxuICBpbml0KCkge1xuICAgIHRoaXMuYXVkaW8gPSBbXVxuICAgIHRoaXMuaW5zdGFuY2VBdWRpbygpXG4gICAgdGhpcy5jcmVhdGVNdXNpY1Bvb2woKVxuICB9LFxuICBjcmVhdGVNdXNpY1Bvb2woKSB7XG4gICAgLy8gdGhpcy5tdXNpY1Bvb2wgPSBuZXcgY2MuTm9kZVBvb2woKVxuICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgMjA7IGkrKykge1xuICAgIC8vICAgbGV0IG11c2ljID0gY2MuaW5zdGFudGlhdGUodGhpcy5hdWRpb1ByZWZhYilcbiAgICAvLyAgIHRoaXMubXVzaWNQb29sLnB1dChtdXNpYylcbiAgICAvLyB9XG4gIH0sXG4gIGluc3RhbmNlQXVkaW8oKSB7XG5cbiAgfSxcbiAgY2hhbmdlVm9sKHZvbCkge1xuICAgIHRoaXMudm9sdW1lID0gdm9sXG4gICAgdGhpcy5hdWRpb3MuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIC8vIGl0ZW0udm9sdW1lID0gdm9sXG4gICAgICB0aGlzLmF1ZGlvc1tpbmRleF0udm9sdW1lID0gdm9sXG4gICAgfSlcbiAgfSxcbiAgb25QbGF5QXVkaW8obnVtKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgaWYgKCF0aGlzLmF1ZGlvc1tudW1dIHx8IHRoaXMuYXVkaW9zW251bV0uaXNQbGF5aW5nKSB7XG4gICAgICBpZiAodGhpcy5hdWRpb3NbbnVtICsgMV0pIHtcbiAgICAgICAgc2VsZi5vblBsYXlBdWRpbyhudW0gKyAxKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygn5Yib5bu65paw55qE6Z+z5LmQ5a6e5L6LJylcbiAgICAgICAgbGV0IG11c2ljID0gbnVsbFxuICAgICAgICBpZiAoc2VsZi5tdXNpY1Bvb2wgJiYgc2VsZi5tdXNpY1Bvb2wuc2l6ZSgpID4gMCkge1xuICAgICAgICAgIG11c2ljID0gc2VsZi5tdXNpY1Bvb2wuZ2V0KClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtdXNpYyA9IGNjLmluc3RhbnRpYXRlKHNlbGYuYXVkaW9QcmVmYWIpXG4gICAgICAgIH1cbiAgICAgICAgbXVzaWMucGFyZW50ID0gc2VsZi5ub2RlXG4gICAgICAgIHRoaXMuYXVkaW9zW251bSArIDFdID0gbXVzaWMuZ2V0Q29tcG9uZW50KGNjLkF1ZGlvU291cmNlKVxuICAgICAgICBtdXNpYy5nZXRDb21wb25lbnQoY2MuQXVkaW9Tb3VyY2UpLnBsYXkoKVxuICAgICAgfVxuICAgICAgLy8gaWYgKG51bSA8IHRoaXMuYXVkaW9zLmxlbmd0aCkge1xuICAgICAgLy8gICB0aGlzLmF1ZGlvc1tudW1dLnN0b3AoKVxuICAgICAgLy8gICB0aGlzLmF1ZGlvc1tudW1dLnJld2luZCgpXG4gICAgICAvLyAgIHRoaXMuYXVkaW9zW251bV0ucGxheSgpXG4gICAgICAvLyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCfkvb/nlKjml6fnmoTpn7PkuZAnKVxuICAgICAgdGhpcy5hdWRpb3NbbnVtXS5yZXdpbmQoKVxuICAgICAgdGhpcy5hdWRpb3NbbnVtXS5wbGF5KClcbiAgICB9XG4gIH0sXG4gIHBhdXNlQmcoKSB7XG4gICAgdGhpcy5iZ011c2ljLnBhdXNlKClcbiAgfSxcbiAgcmVzdW1lQmcoKSB7XG4gICAgdGhpcy5iZ011c2ljLnJlc3VtZSgpXG4gIH0sXG4gIHN0YXJ0KCkge1xuICAgIC8vIHRoaXMub25QbGF5QXVkaW8oMSk7XG4gIH0sXG4gIGNoZWNrQmcoKSB7XG5cbiAgfSxcbiAgb25XaW4oKSB7XG4gICAgdGhpcy53aW5BdWRpby5yZXdpbmQoKVxuICAgIHRoaXMud2luQXVkaW8ucGxheSgpXG4gIH0sXG5cbiAgb25Eb3VibGUoKSB7XG4gICAgdGhpcy5kb3VibGVBdWRpby5yZXdpbmQoKVxuICAgIHRoaXMuZG91YmxlQXVkaW8ucGxheSgpXG4gIH0sXG5cbiAgb25Cb29tKCkge1xuICAgIHRoaXMuYm9vbUF1ZGlvLnJld2luZCgpXG4gICAgdGhpcy5ib29tQXVkaW8ucGxheSgpXG4gIH0sXG4gIG9uTWFnaWMoKSB7XG4gICAgdGhpcy5tYWdpY0F1ZGlvLnJld2luZCgpXG4gICAgdGhpcy5tYWdpY0F1ZGlvLnBsYXkoKVxuICB9LFxufSk7Il19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/pictorial.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '0e40bxKGytLiJwQbi3sCcB6', 'pictorial');
// Script/pictorial.js

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxwaWN0b3JpYWwuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJjb250YWluZXIiLCJOb2RlIiwiYXZhdGFyIiwicHJlZmFiIiwiUHJlZmFiIiwiaW5pdCIsImMiLCJfY29udHJvbGxlciIsInNvY2lhbCIsIm5vZGUiLCJhY3RpdmUiLCJoaWdoTGV2ZWwiLCJnZXRIaWdoZXN0TGV2ZWwiLCJzaG93QXZhdGFyIiwibG9hZENvbnRhaW5lciIsImxldmVsIiwiZGF0YSIsImdhbWVEYXRhIiwianNvbiIsImxldmVsRGF0YSIsImhlaWdodFNjb3JlIiwiZ2V0SGlnaGVzdFNjb3JlIiwiZ2V0Q2hpbGRCeU5hbWUiLCJnZXRDb21wb25lbnQiLCJMYWJlbCIsInN0cmluZyIsIm5hbWUiLCJzZXRUaW1lb3V0Iiwic2NvcmVNZ3IiLCJjaGFyYWN0ZXJNZ3IiLCJzaG93QXZhdGFyQ2hhcmFjdGVyIiwiY2xlYXJDb250YWluZXIiLCJpIiwibGVuZ3RoIiwiY2FyZCIsImluc3RhbnRpYXRlIiwicGFyZW50IiwiaW5pdENhcmQiLCJjaGlsZHJlbiIsIm1hcCIsIml0ZW0iLCJkZXN0cm95IiwiaW5mbyIsInNlbGZMZXZlbCIsImNvbG9yIiwiQ29sb3IiLCJXSElURSIsImdpZnRTdGVwIiwic2hvd0NoYXJhY3RlciIsIkJMQUNLIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7QUFHQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDUCxhQUFTRCxFQUFFLENBQUNFLFNBREw7QUFFUEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLFNBQVMsRUFBRUosRUFBRSxDQUFDSyxJQURKO0FBRVZDLElBQUFBLE1BQU0sRUFBRU4sRUFBRSxDQUFDSyxJQUZEO0FBR1ZFLElBQUFBLE1BQU0sRUFBRVAsRUFBRSxDQUFDUTtBQUhELEdBRkw7QUFPUEMsRUFBQUEsSUFQTyxnQkFPRkMsQ0FQRSxF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QyxDQUFxRGpDLEtBQUssR0FBRyxDQUE3RCxFQUFnRW1CLElBQUksQ0FBQ1osY0FBTCxDQUFvQixJQUFwQixDQUFoRSxFQUEyRjFCLEVBQUUsQ0FBQ2lELEtBQUgsQ0FBU0ksS0FBcEc7QUFDRCxLQVpvQyxDQWFyQzs7QUFDRDtBQS9ETSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBhdXRob3IgaGV5dWNoYW5nXG4gKi9cbmNjLkNsYXNzKHtcbiAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgY29udGFpbmVyOiBjYy5Ob2RlLFxuICAgIGF2YXRhcjogY2MuTm9kZSxcbiAgICBwcmVmYWI6IGNjLlByZWZhYixcbiAgfSxcbiAgaW5pdChjKSB7XG4gICAgdGhpcy5fY29udHJvbGxlciA9IGNcblxuICAgIGlmIChjLnNvY2lhbC5ub2RlLmFjdGl2ZSkge1xuICAgICAgbGV0IGhpZ2hMZXZlbCA9IGMuc29jaWFsLmdldEhpZ2hlc3RMZXZlbCgpXG4gICAgICBpZiAoaGlnaExldmVsKSB7XG4gICAgICAgIHRoaXMuc2hvd0F2YXRhcihoaWdoTGV2ZWwpXG4gICAgICAgIHRoaXMubG9hZENvbnRhaW5lcigraGlnaExldmVsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hdmF0YXIuYWN0aXZlID0gZmFsc2VcbiAgICAgICAgdGhpcy5sb2FkQ29udGFpbmVyKDEpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXZhdGFyLmFjdGl2ZSA9IGZhbHNlXG4gICAgfVxuICB9LFxuICBzaG93QXZhdGFyKGxldmVsKSB7XG4gICAgdGhpcy5hdmF0YXIuYWN0aXZlID0gdHJ1ZVxuICAgIGxldCBkYXRhID0gdGhpcy5fY29udHJvbGxlci5nYW1lRGF0YS5qc29uLmxldmVsRGF0YVsrbGV2ZWwgLSAxXVxuICAgIGxldCBoZWlnaHRTY29yZSA9IHRoaXMuX2NvbnRyb2xsZXIuc29jaWFsLmdldEhpZ2hlc3RTY29yZSgpXG4gICAgdGhpcy5hdmF0YXIuZ2V0Q2hpbGRCeU5hbWUoJ25hbWUnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9ICfljoblj7LmnIDpq5g6JyArIGRhdGEubmFtZVxuICAgIHRoaXMuYXZhdGFyLmdldENoaWxkQnlOYW1lKCdzY29yZScpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gJ+WIhuaVsCcgKyBoZWlnaHRTY29yZVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fY29udHJvbGxlci5zY29yZU1nci5jaGFyYWN0ZXJNZ3Iuc2hvd0F2YXRhckNoYXJhY3RlcigrbGV2ZWwsIHRoaXMuYXZhdGFyLmdldENoaWxkQnlOYW1lKCdkYicpKVxuICAgIH0sIDEwMDApXG4gIH0sXG4gIGxvYWRDb250YWluZXIobGV2ZWwpIHtcbiAgICBsZXQgZGF0YSA9IHRoaXMuX2NvbnRyb2xsZXIuZ2FtZURhdGEuanNvbi5sZXZlbERhdGFcbiAgICB0aGlzLmNsZWFyQ29udGFpbmVyKClcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgY2FyZCA9IGNjLmluc3RhbnRpYXRlKHRoaXMucHJlZmFiKVxuICAgICAgICBjYXJkLnBhcmVudCA9IHRoaXMuY29udGFpbmVyXG4gICAgICAgIHRoaXMuaW5pdENhcmQoY2FyZCwgZGF0YVtpXSwgaSwgbGV2ZWwpXG4gICAgICB9XG4gICAgfSwgMTAwMClcbiAgfSxcbiAgY2xlYXJDb250YWluZXIoKSB7XG4gICAgdGhpcy5jb250YWluZXIuY2hpbGRyZW4ubWFwKGl0ZW0gPT4ge1xuICAgICAgaXRlbS5kZXN0cm95KClcbiAgICB9KVxuICB9LFxuICBpbml0Q2FyZChjYXJkLCBpbmZvLCBsZXZlbCwgc2VsZkxldmVsKSB7XG4gICAgaWYgKGxldmVsIDwgc2VsZkxldmVsKSB7XG4gICAgICBjYXJkLmdldENoaWxkQnlOYW1lKCduYW1lJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBpbmZvLm5hbWVcbiAgICAgIC8vY2FyZC5nZXRDaGlsZEJ5TmFtZSgnc2NvcmUnKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IFwi5b6X5YiGOlwiICsgaW5mby5zY29yZVxuICAgICAgY2FyZC5nZXRDaGlsZEJ5TmFtZSgnZGInKS5jb2xvciA9IGNjLkNvbG9yLldISVRFXG4gICAgICBjYXJkLmdldENoaWxkQnlOYW1lKCdnaWZ0U3RlcCcpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gXCLlvIDlsYDlpZblirFcIiArIGluZm8uZ2lmdFN0ZXAgKyBcIuatpVwiXG4gICAgICB0aGlzLl9jb250cm9sbGVyLnNjb3JlTWdyLmNoYXJhY3Rlck1nci5zaG93Q2hhcmFjdGVyKGxldmVsICsgMSwgY2FyZC5nZXRDaGlsZEJ5TmFtZSgnZGInKSlcbiAgICB9IGVsc2Uge1xuICAgICAgY2FyZC5nZXRDaGlsZEJ5TmFtZSgnbmFtZScpLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gJz8/PydcbiAgICAgIGNhcmQuZ2V0Q2hpbGRCeU5hbWUoJ2dpZnRTdGVwJykuZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBcIuW8gOWxgOWlluWKsT8/P+atpVwiXG4gICAgICBjYXJkLmdldENoaWxkQnlOYW1lKCdkYicpLmNvbG9yID0gY2MuQ29sb3IuQkxBQ0tcbiAgICAgIHRoaXMuX2NvbnRyb2xsZXIuc2NvcmVNZ3IuY2hhcmFjdGVyTWdyLnNob3dDaGFyYWN0ZXIobGV2ZWwgKyAxLCBjYXJkLmdldENoaWxkQnlOYW1lKCdkYicpLCBjYy5Db2xvci5CTEFDSylcbiAgICB9XG4gICAgLy8gdGhpcy5fY29udHJvbGxlci5zY29yZU1nci5jaGFyYWN0ZXJNZ3Iuc2hvd0NoYXJhY3RlcihsZXZlbCArIDEsIGNhcmQuZ2V0Q2hpbGRCeU5hbWUoJ2RiJyksIDApXG4gIH1cbn0pOyJdfQ==
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
