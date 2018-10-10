source 'https://rubygems.org'

gemspec

gem 'jquery-rails'
gem 'turbolinks'
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]

group :development, :test do
  gem 'better_errors'
  gem 'binding_of_caller', platforms: :ruby
end

group :test do
  gem 'simplecov', :require => false
  gem 'selenium-webdriver'
  gem 'chromedriver-helper' if ENV['CI']
  gem 'capybara-screenshot'
end


group :development, :test do
  if defined?(JRUBY_VERSION)
    gem 'rails', '~> 4.2.10'
    gem 'activerecord-jdbc-adapter', '~> 1.3.25'
    gem 'activerecord-jdbcsqlite3-adapter'
  else
    gem 'sqlite3'
  end
  gem 'minitest'
  gem 'launchy'
  gem 'database_cleaner', '< 1.1.0'
  gem 'sass-rails', '~> 4.0.0', '>= 4.0.2'
  gem 'bootstrap-sass', '~> 3.0.3.0'
end
