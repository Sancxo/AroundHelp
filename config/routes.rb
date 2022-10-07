Rails.application.routes.draw do
  devise_for :users,
    controllers: {
      sessions: 'users/sessions',
      registrations: 'users/registrations'
    }

  authenticate :user do
    get 'user', to: 'users#this'
    get 'users/:id', to: 'users#show'

    resources :needs
    resources :addresses
  end
  
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
