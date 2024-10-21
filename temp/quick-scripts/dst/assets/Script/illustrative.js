
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