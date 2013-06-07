
all: components
	@echo "Build Done"

components:
	@echo "Building Components"
	@component build --js -o public/js -f component.js
	@echo "Components Built"

.PHONY: all components
