import {Request} from './request'

class Service {
  static code2session({code}) {
    return Request.get('/user/code', {code: code})
  }

  static updateUserInfo({encryptedData, iv}) {
    return Request.put('/user/', {
      encrypted_data: encryptedData,
      iv: iv,
    })
  }

  static getArticleInfo({aid}) {
    return Request.get(`/article/${aid}`)
  }

  static getArticles({role}) {
    return Request.get('/article/', {role: role || 'owner'})
  }

  static deleteArticle({aid}) {
    return Request.delete(`/article/${aid}`)
  }

  static getComments({aid}) {
    return Request.get(`/article/${aid}/comment`)
  }

  static postComment({aid, content}) {
    return Request.post(`/article/${aid}/comment`, {content: content})
  }

  static replyComment({aid, content, cid}) {
    return Request.post(`/article/${aid}/comment`, {
      content: content,
      reply_to: cid
    })
  }

  static postArticle({title, origin, author, selfProduct, requireReview, allowOpenReply}) {
    return Request.post(`/article/`, {
      title: title,
      origin: origin,
      author: author,
      self_product: selfProduct,
      require_review: requireReview,
      allow_open_reply: allowOpenReply,
    })
  }

  static deleteComment({aid, cid}) {
    return Request.delete(`/article/${aid}/comment/${cid}`)
  }

  static updateArticle({aid, title, origin, author}) {
    return Request.put(`/article/${aid}`, {
      title: title,
      origin: origin,
      author: author
    })
  }
}

export {Service}