let env = {
    USER_DATA_PATH: "",
}

class FileSystemManager {
    stat() {
        return {}
    }
}

class WXColl {
    get() {
        return new Promise(()=>{}, ()=>{})
    }
}

class WXDB {
    collection() {
        return new WXColl
    }
}

class WXClcoud {
    constructor() {
    }

    database() {
        return new WXDB
    }
}

class wechat {
    constructor() {
        this.env = env
        this.cloud = new WXClcoud()
    }

    createInnerAudioContext () { 
        return {
            stop() {},
            play() {},
            onSeeked() {},
        }
    }
    getSystemInfoSync () {
        return {}
    }

    showShareMenu() {

    }

    updateShareMenu() {

    }

    onShareAppMessage() {
        
    }
    shareAppMessage() {
        
    }
    createRewardedVideoAd() {
        return {
            onLoad() {},
            onError() {},
            onClose() {},
            load() {
                return new Promise(()=>{}, ()=>{})
            }
        }
    }
    vibrateShort() {}

    createBannerAd() {
        return {
            onLoad() {},
            onResize() {},
            onError() {},
            show() {},
            hide() {},
            destroy() {},
        }
    }

    getFileSystemManager() {
        if (!this.fs) {
            this.fs = new FileSystemManager
        }
        return this.fs
    }

    login() {

    }

    getSystemInfo() {

    }

    onShow() {
        
    }
    postMessage() {
      
    }

    request(e) {
    }

    onAudioInterruptionEnd () {

    }

    onHide() {

    }

    getStorageSync() {
        return ""
    }
}

if (!window.wx) {
    window.wx = new wechat
}

