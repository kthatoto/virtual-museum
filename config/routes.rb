Rails.application.routes.draw do

  root "top#index"
  mount ActionCable.server => "/cable"
end
