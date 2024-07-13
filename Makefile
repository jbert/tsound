all: build

build:
	tsc

serve:
	live-server

build-watch:
	ls *.ts *.html | entr make build
