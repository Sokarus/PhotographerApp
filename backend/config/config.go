package config

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v2"
)

type Config struct {
	Database struct {
		Host     string `yaml:"host"`
		Port     int    `yaml:"port"`
		User     string `yaml:"user"`
		Password string `yaml:"password"`
		DbName   string `yaml:"dbname"`
		SslMode  string `yaml:"sslmode"`
	} `yaml:"database"`
	Auth struct {
		JwtKey string `yaml:"jwtKey"`
	} `yaml:"auth"`
}

func LoadConfig() (*Config, error) {
	data, err := os.ReadFile("/root/config.yaml")
	if err != nil {
		return nil, fmt.Errorf("не удалось прочитать файл конфигурации: %w", err)
	}

	var config Config
	err = yaml.Unmarshal(data, &config)
	if err != nil {
		return nil, fmt.Errorf("ошибка парсинга файла конфигурации: %w", err)
	}

	return &config, nil
}
