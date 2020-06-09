class LoadCallback {
  constructor() {
    this.loaded = false;
    this.callbacks = new Set();
  }

  done() {
    this.loaded = true;
    let callbacks = Array.from(this.callbacks);
    for (const callback of callbacks) {
      callback();
      this.callbacks.delete(callback);
    }
  }

  call(callback) {
    if (this.loaded) {
      callback();
    } else {
      this.callbacks.add(callback);
    }
  }
}

export {LoadCallback}