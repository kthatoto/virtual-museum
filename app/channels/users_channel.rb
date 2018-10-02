class UsersChannel < ApplicationCable::Channel
  def subscribed
    stream_from "users_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def register(data)
    User.find_or_create_by(name: data['name'])
  end

  def speak(data)
    position = data['position']
    ActionCable.server.broadcast 'users_channel', position: data['position']
  end
end
