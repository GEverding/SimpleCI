
DATE=$(shell date +%I:%M%p)
CHECK=\033[32m✔\033[39m

all: build components
	@echo "SimpleCI successfully built at $(DATE)"

build:
	@redo -j12 all
	@echo "Compiling SimpleCI...          $(CHECK) Done"

components: 
	@component build --js -o public/js -f component.js > /dev/null
	@echo "Compiling Components...        $(CHECK) Done"

clean:
	@redo clean


.PHONY: all build components
