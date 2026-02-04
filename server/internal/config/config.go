package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Addr     string
	Port     string
	DistPath string
	IdeasDir string
}

func LoadConfig() *Config {
	if err := godotenv.Load(".env.local"); err == nil {
		log.Println("Loaded .env.local file")
	} else if err := godotenv.Load(".env"); err == nil {
		log.Println("Loaded .env file")
	} else {
		log.Println("No .env.local or .env file found")
	}

	return &Config{
		Addr:     getEnv("ADDR", "localhost"),
		Port:     getEnv("PORT", "80"),
		DistPath: getEnv("DIST_PATH", ""),
		IdeasDir: getEnv("IDEAS_DIR", ""),
	}
}

func getEnv(key, defaultValue string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}
	return defaultValue
}
