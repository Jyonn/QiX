class Store {
  static load(key) {
    return wx.getStorageSync(key);
  }

  static save(key, value) {
    wx.setStorageSync(key, value);
  }

  static remove(key) {
    wx.removeStorageSync(key);
  }
}

export {Store}
