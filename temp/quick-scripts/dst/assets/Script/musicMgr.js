
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