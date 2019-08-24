source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

gemspec

gem 'turbolinks'
gem 'x-editable-rails', '~> 1.5.1'
# x-editable-rails depends on coffee for some ajax form mumbo jumbo with data-model and more
gem 'coffee-rails', '~> 4.2.2'
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]

group :test do
  gem 'capybara-screenshot', github: 'mlt/capybara-screenshot', branch: 'gcs'
end

group :development, :test do
  gem 'sass-rails'
  gem 'bootstrap-sass'
end
