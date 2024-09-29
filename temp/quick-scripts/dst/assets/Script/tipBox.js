
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