ENV["RAILS_ENV"] ||= 'test'
require 'simplecov'
SimpleCov.start do
  add_filter "/spec/"
end

require File.expand_path("../dummy/config/environment.rb",  __FILE__)
if ActiveRecord.version.release() < Gem::Version.new('5.2.0')
  ActiveRecord::Migrator.migrate File.expand_path("../dummy/db/migrate_42/", __FILE__)
else
  begin
    # https://github.com/rails/rails/issues/22261
    ActiveRecord::Migration.maintain_test_schema!
  rescue ActiveRecord::PendingMigrationError => e
    puts e.to_s.strip
    exit 1
  end
end

require 'rspec/rails'
require 'capybara/rspec'
require 'capybara-screenshot/rspec'
require 'database_cleaner'
require 'spec_helper'
if ENV['CI']
  require 'webdrivers/chromedriver'
  require 'google-cloud-storage'
end

Capybara.javascript_driver = :chrome # :selenium_chrome_headless
Capybara.server = :webrick

Capybara.register_driver :chrome do |app|
  Capybara::Selenium::Driver.load_selenium
  browser_options = ::Selenium::WebDriver::Chrome::Options.new
  browser_options.args << '--headless'
  browser_options.args << '--window-size=1366,768'
  browser_options.args << '--disable-gpu' if Gem.win_platform?
  Capybara::Selenium::Driver.new(app, browser: :chrome, options: browser_options)
end

Capybara::Screenshot.register_driver(:chrome) do |driver, path|
  driver.browser.save_screenshot(path)
end

Capybara::Screenshot.register_filename_prefix_formatter(:rspec) do |example|
  "screenshot_#{example.description.gsub(' ', '-').gsub(/^.*\/spec\//,'')}"
end

if ENV['CI']
  Capybara::Screenshot.gcs_configuration = {
    credentials: 'gcs_credentials.json',
    bucket_name: "jksdhgjkdhgjkd",
  }

  Capybara::Screenshot.gcs_object_configuration = {
    content_encoding: 'gzip',
    acl: 'public_read'
  }
end

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join("../support/**/*.rb")].each { |f| require f }

RSpec.configure do |config|
  config.use_transactional_fixtures = false
end