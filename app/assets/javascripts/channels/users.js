App.users = App.cable.subscriptions.create("UsersChannel", {
  connected: function() {
    // Called when the subscription is ready for use on the server
    console.log("connected!")
    let name = localStorage.getItem("name")
    if (!name) {
      name = Math.random().toString(36).slice(-8)
      localStorage.setItem("name", name)
    }
    this.perform('register', {name: name})
  },

  disconnected: function() {
    // Called when the subscription has been terminated by the server
    console.log("disconnected!")
  },

  received: function(data) {
    // Called when there's incoming data on the websocket for this channel
    window.vue.$children[0].received(data)
  },

  speak: function(data) {
    const position = data.position
    const color = data.color
    formattedPosition = `x:${position.x},y:${position.y},z:${position.z}`
    return this.perform('speak', {
      name: localStorage.getItem("name"),
      position: formattedPosition,
      color: color
    })
  }
});
