package main

import (
	"yoi/internal/config"
	"yoi/internal/handler"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()

	// gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	// r.SetTrustedProxies([]string{"127.0.0.1"})

	api := r.Group("/api")
	{
		api.GET("/health", handler.CheckHealth)
	}

	r.Run(cfg.Addr + ":" + cfg.Port)
}
