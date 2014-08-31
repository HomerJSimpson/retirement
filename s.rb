#! /Users/nlehman/local/bin/ruby

require 'Nokogiri'
require 'open-uri'

def write_jsfiddle_src(src, src_type)
	File.open('demo.' + src_type, 'w') do |f|
		f.puts src
	end
end

doc = Nokogiri::HTML(open("http://jsfiddle.net/homerj/8wn3w44v/"))

write_jsfiddle_src(doc.css('textarea#id_code_html').text, 'html')
write_jsfiddle_src(doc.css('textarea#id_code_js').text, 'js')
write_jsfiddle_src(doc.css('textarea#id_code_css').text, 'css')
