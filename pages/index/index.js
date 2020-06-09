import {Service} from '../base/service';
import {formatDate} from '../base/format-date'

//index.js
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
    // this.getArticles()
  },
  onLoad: function () {},
  getArticles: function() {
    wx.showLoading({
      title: '正在加载列表…',
    })
    Service.getArticles({role: 'owner'}).then(resp => {
      let origins = new Set()
      let authors = new Set()

      resp.forEach(item => {
        item.create_time = formatDate(item.create_time)
        origins.add(item.origin)
        authors.add(item.author)
      })
      app.globalData.candidates = {
        origins: Array.from(origins),
        authors: Array.from(authors)
      }
      this.setData({
        articles: resp,
        hasArticle: !!resp.length,
      })
      wx.hideLoading()
    })
  },
  newArticle: function() {
    wx.navigateTo({
      url: '/pages/new/new',
    })
  },
  navigateComment: function(aid) {
    wx.navigateTo({
      url: `/pages/comment/comment?aid=${aid}`,
    })
  },
  copyLink: function(aid) {
    wx.setClipboardData({
      data: `/pages/comment/comment?aid=${aid}`,
    })
  },
  deleteArticle: function(aid) {
    wx.showModal({
      content: "确认删除？",
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          Service.deleteArticle({aid: aid}).then(() => {
            this.getArticles()
          })
        }
      }
    })
  },
  tapArticle: function(e) {
    let type = e.target.dataset.type
    let aid = e.currentTarget.dataset.aid
    if (type == 'copy') {
      this.copyLink(aid)
    } else if (type == 'delete') {
      this.deleteArticle(aid)
    } else {
      this.navigateComment(aid)
    }
  }
})
