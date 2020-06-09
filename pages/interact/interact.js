import {Service} from '../base/service';
import {formatDate} from '../base/format-date'

//interact.js
//获取应用实例
const app = getApp()

Page({
  data: {
    articles: [],
    hasArticle: false,
  },
  onPullDownRefresh: function() {
    this.getArticles()
  },
  onShow: function() {
    app.globalData.userIDLC.call(this.getArticles)
  },
  onLoad: function () {},
  getArticles: function() {
    wx.showLoading({
      title: '正在加载列表…',
    })
    Service.getArticles({role: 'comment'}).then(resp => {
      resp.forEach(item => {
        item.create_time = formatDate(item.create_time)
      })
      this.setData({
        articles: resp,
        hasArticle: !!resp.length,
      })
      wx.hideLoading()
    })
  },
  navigateComment: function(e) {
    wx.navigateTo({
      url: `/pages/comment/comment?aid=${e.currentTarget.dataset.aid}`,
    })
  },
})
