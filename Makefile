MODULE=esnext
TARGET=esnext

all: build

build:
	tsc -m ${MODULE} -t ${TARGET} *.ts

serve:
	live-server

build-watch:
	ls *.ts *.html | entr make build
