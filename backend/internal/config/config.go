package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Addr string
	Port string
	IdeasDir string
}

func LoadConfig() *Config {
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("Failed to load .env file:", err.Error())
	}

	return &Config{
		Addr: getEnv("ADDR", "localhost"),
		Port: getEnv("PORT", "8080"),
		IdeasDir: getEnv("IDEAS_DIR", ""),
	}
}

func getEnv(key, defaultValue string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}
	return defaultValue
}
