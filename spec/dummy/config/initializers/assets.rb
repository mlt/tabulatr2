Rails.application.config.assets.precompile += %w( standard-loader.gif )

if ActiveRecord.version.release() >= Gem::Version.new('5.2.0')
  Rails.application.config.assets.precompile += %w( application_52.js )
end
