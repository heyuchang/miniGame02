
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