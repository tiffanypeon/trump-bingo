# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
## run this in the console, doesn't work from seed file
# NYT already insulted people
# doc = File.open('app/assets/trump.html') { |f| Nokogiri::HTML(f) }
# doc.css('div.g-entity-name').each do |entity|
#   InsultedParty.create(name: entity.children.first.text)
# end

# Top 100 movies
# doc = File.open('app/assets/movies.html') { |f| Nokogiri::HTML(f) }
# doc.css("td.title").each do |title|
#  InsultedParty.create(name: title.children.first.children.text, kind: 'movie')
# end

# Top 100 actors
# doc = File.open('app/assets/actors.html') { |f| Nokogiri::HTML(f) }
# doc.css("td.name").each do |name|
#  InsultedParty.create(name: name.children.first.children.text, kind: 'actor')
# end

# Top 50 actresses
# doc = File.open('app/assets/actresses.html') { |f| Nokogiri::HTML(f) }
# doc.css("td.name").each do |name|
#  InsultedParty.create(name: name.children.first.children.text, kind: 'actress')
# end

# Top 100 songs
# doc = File.open('app/assets/singles.html') { |f| Nokogiri::HTML(f) }
# doc.css("h2.chart-row__song").each do |name|
#  InsultedParty.create(name: name.children.first.text, kind: 'song')
# end

# Top cities
# doc = File.open('app/assets/cities.html') { |f| Nokogiri::HTML(f) }
# cities = doc.css("table.sortable > tbody tr").slice(0,303)
# cities.each do |name|
#  InsultedParty.create(name: name.css("td")[1].children.first.children.text, kind: 'city')
# end

