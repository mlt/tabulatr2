# require "turbolinks/redirection"

class ApplicationController < ActionController::Base
  # include Turbolinks::Redirection

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
end
