require 'sinatra'
require 'json'

set :haml, :format => :html5
set :public_folder, File.dirname(__FILE__) + '/static'

get '/' do
  last_ratings = request.cookies['last-ratings']
  if last_ratings.nil?
    @last_ratings = []
  else
    @last_ratings = JSON.parse(last_ratings.to_s)
  end
  haml :index
end

post '/create_rating' do
  content_type :json

  last_ratings = request.cookies['last-ratings']
  if last_ratings.nil?
    ratings = []
  else
    ratings = JSON.parse(last_ratings.to_s)
  end

  ratings << params[:rating]
  response.set_cookie('last-ratings', :value => ratings.to_json, :expires => Time.now + (60 * 60))

  params[:rating].to_json
end