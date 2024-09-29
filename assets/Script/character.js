cc.Class({
  extends: cc.Component,

  properties: {
    levelUp1: cc.Node,
    levelUp2: cc.Node,
    character: cc.Node,
    fail: cc.Node,
  },
  start() {
    cc.assetManager.loadBundle('game', (err, bundle) => {
      self.bundle = bundle;
    });
  },



  onWalk(target) {
    target.playAnimation('walk', -1)
  },
  onLevelUp() {
    //this.levelUp2.getComponent(dragonBones.ArmatureDisplay).playAnimation('jump', -1)
  },
  onSuccessDialog(level) {
    this.showCharacter(level, this.levelUp2)

  },
  onLevelUpBtn(level) {
    this.showHeroCharacter(level)
  },
  onFail(level) {
    this.showCharacter(level, this.fail)
  },

  initStartPage() {

  },

  showHeroCharacter(level, target, color) {
    target = target || this.character

    let loadRes = 'heroPrefab/heroSpine' + level
    this.loadHeroPrefab(loadRes, target, color);
  },

  loadHeroPrefab(prefabPath, target, color) {

    if (self.heroPrefab) {
      // cc.assetManager.releaseAsset(self.heroPrefab);
      // cc.de(prefab);
      self.heroPrefab.destroy();
      self.heroPrefab = null;
      // self.bundle.release(self.heroPrefabPath, cc.Prefab);
    }

    self.bundle.load(prefabPath, cc.Prefab, (err, prefab) => {
      if (err) {
        console.error('加载 Prefab 失败：', err);
        return;
      }

      self.heroPrefabPath = prefabPath

      // Prefab 加载成功后，使用 instantiate 方法创建实例
      self.heroPrefab = cc.instantiate(prefab);
      // 将实例添加到当前节点下
      this.node.addChild(self.heroPrefab);
      // 可以设置新节点的位置等属性

      self.heroPrefab.setParent(target);
      self.heroPrefab.setPosition(0, 0, 0);

      if (color) {
        self.heroPrefab.color = color
      }
      else {
        self.heroPrefab.color = cc.Color.WHITE
      }
    });
  },


  showCharacter(level, target, color) {
    target = target || this.character

    let loadRes = 'heroPrefab/heroSpine' + level
    this.loadAvatarPrefab(loadRes, target, color);
  },

  loadPrefab(prefabPath, target, color) {
    self.bundle.load(prefabPath, cc.Prefab, (err, prefab) => {
      if (err) {
        console.error('加载 Prefab 失败：', err);
        return;
      }

      // if (self.heroAvatarPrefab) {
      //   cc.assetManager.releaseAsset(self.heroAvatarPrefab);
      // }
      // Prefab 加载成功后，使用 instantiate 方法创建实例
      let instPrefab = cc.instantiate(prefab);
      // 将实例添加到当前节点下
      this.node.addChild(instPrefab);
      // 可以设置新节点的位置等属性

      instPrefab.setParent(target);
      instPrefab.setPosition(0, 0, 0);

      if (color) {
        instPrefab.color = color
      }
      else {
        instPrefab.color = cc.Color.WHITE
      }
    });
  },


  showAvatarCharacter(level, target, color) {
    target = target || this.character

    let loadRes = 'heroPrefab/heroSpine' + level
    this.loadAvatarPrefab(loadRes, target, color);
  },

  loadAvatarPrefab(prefabPath, target, color) {
    if (self.heroAvatarPrefab) {
      // cc.assetManager.releaseAsset(self.heroAvatarPrefab);
      self.heroAvatarPrefab.destroy();
      self.heroAvatarPrefab = null;
      // self.bundle.release(self.heroAvatarPrefabPath, cc.Prefab);
    }

    if (self.heroAvatarPrefabPath != prefabPath) {
      self.bundle.load(prefabPath, cc.Prefab, (err, prefab) => {
        if (err) {
          console.error('加载 Prefab 失败：', err);
          return;
        }
  
        self.heroAvatarPrefabPath = prefabPath
  
        // Prefab 加载成功后，使用 instantiate 方法创建实例
        self.heroAvatarPrefab = cc.instantiate(prefab);
        // 将实例添加到当前节点下
        this.node.addChild(self.heroAvatarPrefab);
        // 可以设置新节点的位置等属性
  
        self.heroAvatarPrefab.setParent(target);
        self.heroAvatarPrefab.setPosition(0, 0, 0);
  
        if (color) {
          self.heroAvatarPrefab.color = color
        }
        else {
          self.heroAvatarPrefab.color = cc.Color.WHITE
        }
      });
    }
  },
});