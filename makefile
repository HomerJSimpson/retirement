all : show.html

usage :
	@echo Usage:

run :
	./s.rb

show.html : fiddle.template.html Demo/demo.css Demo/demo.html Demo/demo.js
	m4 < $< > $@

clean:
	-rm -f demo.html demo.css demo.js
