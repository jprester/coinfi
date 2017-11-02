Rails.application.routes.draw do
  devise_scope :user do
    get "/register" => "users/registrations#new", as: "new_user_registration"
  end
  devise_for :users,
    controllers: {
      registrations: 'users/registrations',
      omniauth_callbacks: 'users/omniauth_callbacks'
    },
    path: '',
    path_names: { sign_in: 'login', sign_out: 'logout'}

  namespace :admin do
    resources :coins
    resources :articles
    get 'reddit' => 'articles#reddit'
    root to: "coins#index"
  end

  get '/token-sale', to: 'users#token_sale', as: 'user_root'
  root 'pages#home'

  get '/' => 'pages#home', as: 'home'
  get '/about' => 'pages#about'
  get '/contact' => 'pages#contact'
  get '/daily' => 'pages#daily', as: 'daily'
  get '/identify-whale-price-manipulation' => 'pages#identify_whale_price_manipulation'
  get '/detect-coins-about-to-moon' => 'pages#detect_coins_about_to_moon'
  get '/find-relevant-news' => 'pages#find_relevant_news'
  get '/display-research-pieces' => 'pages#display_research_pieces'
  get '/cloak-trading' => 'pages#cloak_trading'
  get '/identify-best-priced-exchange' => 'pages#identify_best_priced_exchange'
  #get '/research-bad-actors' => 'pages#research_bad_actors'
  #get '/facilitate-altcoin-coverage' => 'pages#facilitate_altcoin_coverage'
  #get '/thanks' => 'pages#thanks', as: 'thanks'
  #get '/customize' => 'pages#customize', as: 'customize'
  # post '/subscribe'
  #post '/segment'

  get '/token-sale' => 'users#token_sale'
  post '/token-sale' => 'users#update'

  resources :coins, only: [:index, :show]

  get '/historical/:symbol' => 'data#historical'
end
