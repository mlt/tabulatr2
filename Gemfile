source 'https://rubygems.org'

gemspec

gem 'jquery-rails'
gem 'turbolinks'
gem 'x-editable-rails', '~> 1.5.1'
# x-editable-rails depends on coffee for some ajax form mumbo jumbo with data-model and more
gem 'coffee-rails', '~> 4.2.2'
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]

group :test do
  gem 'capybara-screenshot', github: 'mlt/capybara-screenshot', branch: 'gcs'
end

group :development, :test do
  gem 'sass-rails', '~> 5.0.7'
  gem 'bootstrap-sass', '~> 3.0.3.0'
end
