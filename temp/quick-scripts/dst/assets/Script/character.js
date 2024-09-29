
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