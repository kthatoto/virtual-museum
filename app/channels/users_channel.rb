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
    name = data['name']
    position = data['position']
    User.find_by(name: name).update(position: position)
    ActionCable.server.broadcast 'users_channel', name: name, position: position
  end
end
