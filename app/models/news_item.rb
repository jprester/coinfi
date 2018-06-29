class NewsItem < ApplicationRecord
  belongs_to :feed_source
  has_one :user # References the Admin user who tagged this NewsItem
  has_one :news_item_raw
  has_many :mentions, class_name: 'NewsCoinMention'
  has_many :coins, through: :mentions

  has_many :news_item_categorizations, dependent: :destroy
  has_many :news_categories, through: :news_item_categorizations

  default_scope -> { order(feed_item_published_at: :desc) }
  scope :pending, -> { where(is_human_tagged: nil) }
  scope :tagged, -> { where(is_human_tagged: true) }

  alias_method :categories, :news_categories

  after_create :link_coin_from_feedsource
  after_create_commit :notify_news_tagger

  def coin_link_data
    coins.map { |coin| coin.as_json(only: [:symbol, :slug] ) }
  end

  def coin_symbols
    coins.pluck(:symbol).join(', ')
  end

  def news_category_names
    news_categories.pluck(:name).join(', ')
  end

  def feed_source_name
    feed_source.name
  end

  private

  def link_coin_from_feedsource
    feed_source.coin.news_items << self
    save
  end

  def notify_news_tagger
    news_tagger_endpoint = ENV['NEWS_TAGGER_ENDPOINT']
    return unless news_tagger_endpoint.present?

    auth = {username: ENV.fetch('NEWS_TAGGER_BASIC_AUTH_USERNAME'), password: ENV.fetch('NEWS_TAGGER_BASIC_AUTH_PASSWORD')}
    puts HTTParty.post "#{news_tagger_endpoint}/#{self.id}/assign_entities", basic_auth: auth
  end
end
