package yandex

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"mime/multipart"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type Yandex struct {
	Url       string
	Bucket    string
	Region    string
	KeyId     string
	AccessKey string
}

// Deprecated code by yandex https://yandex.cloud/ru/docs/storage/tools/aws-sdk-go
func (y *Yandex) getClientInstance() *s3.Client {
	customResolver := aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
		if service == s3.ServiceID && region == "ru-central1" {
			return aws.Endpoint{
				PartitionID:   "yc",
				URL:           "https://storage.yandexcloud.net",
				SigningRegion: "ru-central1",
			}, nil
		}
		return aws.Endpoint{}, fmt.Errorf("unknown endpoint requested")
	})
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithEndpointResolverWithOptions(customResolver))
	if err != nil {
		log.Fatal(err)
	}
	return s3.NewFromConfig(cfg)
}

func (y Yandex) UploadPhoto(fileHeader *multipart.FileHeader, path string) error {
	client := y.getClientInstance()
	file, err := fileHeader.Open()
	if err != nil {
		log.Printf("Error opening file: %v", err)
		return err
	}
	defer file.Close()

	buf := new(bytes.Buffer)
	_, err = io.Copy(buf, file)

	if err != nil {
		return err
	}

	_, err = client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(y.Bucket),
		Key:    aws.String(path + fileHeader.Filename),
		Body:   buf,
	})

	if err != nil {
		log.Printf("Error loading photo to yandex cloud: %v", err)
		return err
	}

	return nil
}
