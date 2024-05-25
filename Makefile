MODULE=esnext
TARGET=esnext

all:
	tsc -m ${MODULE} -t ${TARGET} *.ts
