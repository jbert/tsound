all: build

build:
	tsc && pnpm exec rollup -c

serve:
	live-server

build-watch:
	ls *.ts *.html | entr make build
