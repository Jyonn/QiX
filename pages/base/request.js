import {Store} from './store';

class Method {
  static staticConstructor() {
      this.GET = 'get';
      this.POST = 'post';
      this.PUT = 'put';
      this.DELETE = 'delete';
  }
}

class ErrorHandler {
  static handler(error) {
    if (error.hasOwnProperty('msg')) {
      error = error.msg;
      wx.showToast({
        title: error,
        icon: 'none'
      })
    }
    // console.error(error);
    return Promise.reject(error);
  }
}

class Request {
  static staticConstructor() {
    this.token = Store.load('token')
    this._handler = null
  }

  static saveToken(token) {
    this.token = token;
    Store.save('token', token);
  }

  static removeToken() {
    Store.remove('token');
  }

  static setHandler(handler) {
    this._handler = handler;
  }

  static getQueryString(params) {
    const esc = encodeURIComponent;
    return Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');
  }

  static async baseFetch(method, url, data=null) {
    if (url[0] == '/') {
      url = 'https://wx.6-79.cn' + url
    }
    if ((method === Method.GET || method === Method.DELETE) && data) {
        url += '?' + this.getQueryString(data);
        data = null;
    }
    let req = new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: method,
        data: data || '',
        header: {
          'Content-type': "application/json",
          'Token': this.token || '',
        },
        success: resolve,
        fail: reject
      })
    })
    return req.then((resp) => {
      resp = resp.data;
      if (!resp.hasOwnProperty('code')) {
        return ErrorHandler.handler(resp);
      }
      if (resp.code !== 0) {
        if (!this._handler || this._handler(resp)) {
          console.log(resp.msg);
        }
        return ErrorHandler.handler(resp);
      }
      return resp.body;
    }).catch(ErrorHandler.handler);
  }
  static async get(url, data=null) {
    return this.baseFetch(Method.GET, url, data);
  }
  static async post(url, data=null) {
    return this.baseFetch(Method.POST, url, data);
  }
  static async put(url, data=null) {
    return this.baseFetch(Method.PUT, url, data);
  }
  static async delete(url, data=null) {
    return this.baseFetch(Method.DELETE, url, data);
  }
}

Method.staticConstructor();
Request.staticConstructor();

export {Request}