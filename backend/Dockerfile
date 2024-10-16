FROM golang:1.23-alpine as build

WORKDIR /app

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . ./

RUN go build -o main .

FROM alpine:latest

WORKDIR /root/

COPY --from=build /app/main .
COPY --from=build /app/config.yaml .

EXPOSE 8080

CMD ["./main"]