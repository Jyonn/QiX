Component({
  properties: {
    title: String,
    max_length: {
      type: Number,
      value: -1
    },
    use_textarea: Boolean,
    placeholder: String,
    submit_text: String,
    init_text: String,
    candidates: Array,
    hint: String,
  },
  data: {
    is_writing: false,
    input_text: '',
  },
  lifetimes: {
    ready: function() {
      this.setData({
        input_text: this.properties.init_text
      })
    }
  },
  methods: {
    inputing: function(e) {
      this.setData({
        input_text: e.detail.value
      })
    },
    stopWrite: function() {
      this.setData({
        is_writing: false
      })
    },
    startWrite: function() {
      this.setData({
        is_writing: true
      })
    },
    submitInput: function() {
      this.triggerEvent('submit', this.data.input_text)
      this.stopWrite()
    },
    cancelInput: function() {
      this.triggerEvent('cancel', this.data.input_text)
      this.stopWrite()
    },
    autoFill: function(e) {
      this.setData({
        input_text: e.currentTarget.dataset.value
      })
    }
  },
})