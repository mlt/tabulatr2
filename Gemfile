source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

gemspec

gem 'turbolinks'
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]

group :test do
  gem 'capybara-screenshot', github: 'mlt/capybara-screenshot', branch: 'gcs'
end

group :development, :test do
  gem 'sass-rails'
  gem 'bootstrap-sass'
end
