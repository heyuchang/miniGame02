
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