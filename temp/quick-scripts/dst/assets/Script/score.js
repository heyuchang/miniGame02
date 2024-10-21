
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