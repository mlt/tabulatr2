# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "tabulatr/version"

Gem::Specification.new do |s|
  s.name        = "tabulatr2"
  s.version     = Tabulatr::VERSION.dup
  s.platform    = Gem::Platform::RUBY
  s.summary     = "A tight DSL to build tables of ActiveRecord "+
                  "models with sorting, pagination, finding/filtering, "+
                  "selecting and batch actions."
  s.email       = "open-source@metaminded.com"
  s.homepage    = "http://github.com/metaminded/tabulatr2"
  s.description = "A tight DSL to build tables of ActiveRecord "+
                  "models with sorting, pagination, finding/filtering, "+
                  "selecting and batch actions. " +
                  "Tries to do for tables what formtastic and simple_form did "+
                  "for forms."
  s.authors     = ['Peter Horn', 'Florian Thomas', 'René Sprotte']
  s.license       = 'MIT'
  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.rdoc_options  = ['--charset=UTF-8']


  s.add_runtime_dependency('rails', '> 4.0')
  s.add_dependency('slim', '>= 2.0')
  s.add_dependency('tilt', '> 1.4')
  s.add_dependency('font-awesome-rails', '>= 4.0')
  s.add_development_dependency('rspec-rails', '>= 3.1.0')
  s.add_development_dependency('capybara', '>= 2.4.1')
  # s.add_development_dependency 'appraisal'
  s.add_development_dependency 'better_errors'
  s.add_development_dependency 'simplecov'
  s.add_development_dependency 'selenium-webdriver'
  s.add_development_dependency 'webdrivers'
  s.add_development_dependency 'google-cloud-storage' if ENV['CI']
  if defined?(JRUBY_VERSION)
    s.add_development_dependency 'activerecord-jdbc-adapter'
    s.add_development_dependency 'activerecord-jdbcsqlite3-adapter'
  else
    s.add_development_dependency 'sqlite3' #, '>= 1.4')
    s.add_development_dependency 'binding_of_caller'
  end
  s.add_development_dependency 'minitest'
  s.add_development_dependency 'launchy'
  s.add_development_dependency 'database_cleaner'
end
