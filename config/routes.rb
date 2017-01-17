Rails.application.routes.draw do
  root to: "cards#new"

  resource :card, only: [:new, :create, :show]
end
