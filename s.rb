#! /usr/bin/env ruby

require 'Nokogiri'
require 'open-uri'

def usage(s)
	$stderr.puts(s)
	$stderr.puts("Usage: #{File.basename($0)}: <jsFiddle Id>")
	exit(2)
end

def write_jsfiddle_src(src, src_type)
	File.open('demo.' + src_type, 'w') do |f|
		f.puts src
	end
end

loop { case ARGV[0]
	when /^-/ then  usage("Unknown option: #{ARGV[0].inspect}")
	else break
end; }

if ARGV.any?
	doc = Nokogiri::HTML(open("http://jsfiddle.net/#{ARGV[0]}"))

	write_jsfiddle_src(doc.css('textarea#id_code_html').text, 'html')
	write_jsfiddle_src(doc.css('textarea#id_code_js').text, 'js')
	write_jsfiddle_src(doc.css('textarea#id_code_css').text, 'css')
end
