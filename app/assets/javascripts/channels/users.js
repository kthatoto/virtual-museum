App.users = App.cable.subscriptions.create("UsersChannel", {
  connected: function() {
    // Called when the subscription is ready for use on the server
    console.log("connected!")
    const name = localStorage.getItem("name")
    if (name === null) {
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
    console.log(data);
  },

  speak: function(position) {
    return this.perform('speak', {position: position});
  }
});
