App.users = App.cable.subscriptions.create("UsersChannel", {
  connected: function() {
    // Called when the subscription is ready for use on the server
  },

  disconnected: function() {
    // Called when the subscription has been terminated by the server
  },

  received: function(data) {
    // Called when there's incoming data on the websocket for this channel
  },

  speak: function(position) {
    return this.perform('speak', position: position);
  }
});
