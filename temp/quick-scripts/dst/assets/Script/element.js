
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