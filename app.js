import {LoadCallback} from './pages/base/load-callback'
import {Service} from './pages/base/service'
import {Request} from './pages/base/request'

//app.js
App({
  onLaunch: function () {
    this.globalData.userInfoLC.call(this.updateUserInfo);

    wx.login({
      success: res => {
        Service.code2session({code: res.code}).then(resp => {
          Request.saveToken(resp.token);
          this.globalData.userID = resp.user_id
          this.globalData.userIDLC.done()
          wx.getSetting({
            success: res => {
              if (!res.authSetting['scope.userInfo']) {
                return console.log('没有授权')
              }
              wx.getUserInfo({
                success: res => {
                  this.setUserInfo(res);
                }
              })
            }
          })
        })
      }
    })
  },
  updateUserInfo: function() {
    Service.updateUserInfo({
      encryptedData: this.globalData.userInfo.encryptedData,
      iv: this.globalData.userInfo.iv,
    }).then(resp => {
      console.log(resp);
    })
  },
  setUserInfo: function(res) {
    this.globalData.userInfo = {
      info: res.userInfo,
      encryptedData: res.encryptedData,
      iv: res.iv,
    }
    this.globalData.userInfoLC.done();
  },
  globalData: {
    userInfo: null,
    userInfoLC: new LoadCallback(),
    userID: null,
    userIDLC: new LoadCallback(),
    candidates: {
      authors: [],
      origins: [],
    }
  }
})