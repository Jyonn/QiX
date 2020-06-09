import {Service} from '../base/service'
import {formatDate} from '../base/format-date'
import { LoadCallback } from '../base/load-callback'

const app = getApp()

const AUTHOR = 'author'
const TITLE = 'title'
const ORIGIN = 'origin'

Page({
  data: {
    article: {
      aid: null,
      title: '留言板不存在',
      create_time: '',
      author: '奇奇十号',
      origin: 'MasterWhole',
      comments: [],
      all_comments: [],
      my_comments: [],
      self_product: false,
      require_review: false,
      allow_open_reply: false,
      user: {
        user_id: null,
        nickname: '',
        avatar: null
      }
    },
    hasUserInfo: false,
    qinput: null,
    loaded: false,
    is_owner: false,
    user_id: null,
    editInfo: {
      mode: null,
      title: null,
      placeholder: null
    },
    replyHint: null,
    replyCid: null,
    // comment_list: [],
    // comment_type: 'selected',
  },
  setUserInfo: function() {
    this.setData({
      hasUserInfo: true,
    })
  },
  getUserInfo: function(e) {
    if (e.detail.errMsg != "getUserInfo:ok") {
      return
    }
    app.setUserInfo(e.detail)
    this.startWrite()
  },
  startLoad: function() {
    wx.showLoading({
      title: '正在加载留言…',
    })
  },
  finishLoad: function() {
    wx.hideLoading()
    this.setData({
      loaded: true
    })
  },
  onLoad: function(e) {
    this.startLoad()

    this.data.article.aid = e.aid
    this.qinput = this.selectComponent('#qinput')
    this.qedit = this.selectComponent('#qedit')
    this.qreply = this.selectComponent('#qreply')

    app.globalData.userInfoLC.call(this.setUserInfo);
    app.globalData.userIDLC.call(this.getArticle)
  },

  getArticle: function() {
    let aid = this.data.article.aid
    this.setData({
      userID: app.globalData.userID
    })

    Service.getArticleInfo({aid: aid}).then(resp => {
      resp.create_time = formatDate(resp.create_time)
      this.setData({
        article: resp,
        is_owner: this.data.userID == resp.user.user_id
      })
      wx.setNavigationBarTitle({
        title: resp.origin || '',
      })
      this.finishLoad()
    }).catch(resp => {
      this.finishLoad()
    })
  },
  submitComment: function(e) {
    Service.postComment({
      aid: this.data.article.aid,
      content: e.detail,
    }).then(resp => {
      let article = this.data.article
      article.comments.push(resp)
      this.setData({
        article: article,
      })
    })
  },
  submitReply: function(e) {
    Service.replyComment({
      aid: this.data.article.aid,
      cid: this.data.replyCid,
      content: e.detail,
    }).then(resp => {
      wx.showToast({
        title: '回复成功',
      })
      this.getArticle()
    }).catch(() => {})
  },
  startWrite: function() {
    this.qinput.startWrite()
  },
  onShareAppMessage: function() {
    return {
      title: `邀请您查看${this.data.article.origin}的留言板`,
      path: `/pages/comment/comment?aid=${this.data.article.aid}`
    }
  },
  tapComment: function(e) {
    let type = e.target.dataset.type
    let cid = e.currentTarget.dataset.cid
    let content = e.currentTarget.dataset.content
    if (type == 'delete') {
      return this.deleteComment(cid)
    } else {
      return this.replyComment(cid, content)
    }
  },
  replyComment: function(cid, content) {
    this.setData({
      replyHint: `回复：${content}`,
      replyCid: cid,
    })
    this.qreply.startWrite()
  },
  deleteReply: function(e) {
    let cid = e.currentTarget.dataset.cid
    this.deleteComment(cid)
  },
  deleteComment: function(cid) {
    wx.showModal({
      content: "确认删除留言？",
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          Service.deleteComment({
            aid: this.data.article.aid,
            cid: cid
          }).then(resp => {
            // let index = this.getIndexOfComment(cid)
            // if (index > -1) {
            //   this.data.article.comments.splice(index, 1)
            //   this.setData({
            //     article: this.data.article
            //   })
            // }
            this.getArticle()
          })
        }
      }
    })
  },
  getIndexOfComment: function(cid) {
    let index = -1
    this.data.article.comments.forEach((item, i) => {
      if (cid == item.cid) {
        index = i
      }
    })
    return index
  },

  editTitle: function() {
    this.showEditor(TITLE)
  },
  editAuthor: function() {
    this.showEditor(AUTHOR)
  },
  editOrigin: function() {
    this.showEditor(ORIGIN)
  },
  showEditor: function(mode) {
    if (!this.data.is_owner) {
      return
    }
    let placeholder, title, initText
    if (mode == TITLE) {
      placeholder = '此处输入文章标题'
      title = '填写标题'
      initText = this.data.article.title
    } else if (mode == AUTHOR) {
      placeholder = '此处输入文章作者'
      title = '填写作者'
      initText = this.data.article.author
    } else {
      placeholder = '此处输入公众号名称'
      title = '填写公众号'
      initText = this.data.article.origin
    }
    if (this.data.editInfo.mode != mode) {
      this.qedit.setData({
        input_text: initText
      })
    }
    this.setData({
      editInfo: {
        placeholder: placeholder,
        title: title,
        mode: mode
      }
    })
    this.qedit.startWrite()
  },
  finishEdit: function(e) {
    let article = this.data.article
    if (this.data.editInfo.mode == TITLE) {
      article.title = e.detail
    } else if (this.data.editInfo.mode == AUTHOR) {
      article.author = e.detail
    } else {
      article.origin = e.detail
    }
    Service.updateArticle(article).then(resp => {
      this.setData({
        article: article
      })
    })
  },
})