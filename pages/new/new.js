// pages/new/new.js
import {Service} from '../base/service'

const app = getApp()

const AUTHOR = 'author'
const TITLE = 'title'
const ORIGIN = 'origin'

Page({
  data: {
    title: "文章标题",
    author: "作者",
    origin: "公众号名称",
    mode: null,
    editTitle: null,
    placeholder: null,
    candidates: [],
    selfProduct: false,
    requireReview: false,
    allowOpenReply: false,
  },

  onLoad: function (options) {
    this.qinput = this.selectComponent('#qinput')
  },
  switchSelfProduct: function(e) {
    this.setData({
      selfProduct: e.detail.value
    })
  },
  switchRequireReview: function(e) {
    this.setData({
      requireReview: e.detail.value
    })
  },
  switchAllowOpenReply: function(e) {
    this.setData({
      allowOpenReply: e.detail.value
    })
  },
  editTitle: function() {
    this.showEditor(TITLE)
  },
  editAuthor: function() {
    this.setData({
      candidates: app.globalData.candidates.authors
    })
    this.showEditor(AUTHOR)
  },
  editOrigin: function() {
    this.setData({
      candidates: app.globalData.candidates.origins
    })
    this.showEditor(ORIGIN)
  },
  showEditor: function(mode) {
    let placeholder, editTitle
    if (mode == TITLE) {
      placeholder = '此处输入文章标题'
      editTitle = '填写标题'
    } else if (mode == AUTHOR) {
      placeholder = '此处输入文章作者'
      editTitle = '填写作者'
    } else {
      placeholder = '此处输入公众号名称'
      editTitle = '填写公众号'
    }
    if (this.data.mode != mode) {
      this.qinput.setData({
        input_text: null
      })
    }
    this.setData({
      placeholder: placeholder,
      editTitle: editTitle,
      mode: mode
    })
    this.qinput.startWrite()
  },
  finishEdit: function(e) {
    console.log(e)
    if (this.data.mode == TITLE) {
      this.setData({title: e.detail})
    } else if (this.data.mode == AUTHOR) {
      this.setData({author: e.detail})
    } else {
      this.setData({origin: e.detail})
    }
  },
  resetInput: function() {
    this.setData({
      title: "文章标题",
      author: "作者",
      origin: "公众号名称",
    })
  },
  postArticle: function() {
    Service.postArticle({
      title: this.data.title,
      author: this.data.author,
      origin: this.data.origin,
      selfProduct: this.data.selfProduct,
      requireReview: this.data.requireReview,
      allowOpenReply: this.data.allowOpenReply,
    }).then(resp => {
      wx.setClipboardData({
        data: `/pages/comment/comment?aid=${resp.aid}`,
      })
      wx.showModal({
        content: "链接已复制到剪贴板",
        showCancel: false,
        success: () => {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      })
      this.resetInput()
    })
  }
})