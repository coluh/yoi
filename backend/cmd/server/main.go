package main

import (
	"os"
	"path/filepath"
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

	dist := filepath.Join("..", "frontend", "dist")
	if _, err := os.Stat(dist); err == nil {
		r.GET("/", func(ctx *gin.Context) {
			ctx.File(filepath.Join(dist, "index.html"))
		})
		r.Static("/assets", filepath.Join(dist, "assets"))
	}

	r.Run(cfg.Addr + ":" + cfg.Port)
}
