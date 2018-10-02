class UsersChannel < ApplicationCable::Channel
  def subscribed
    stream_from "users_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak
    ActionCable.server.broadcast 'users_channel', position: data['position']
  end
end
