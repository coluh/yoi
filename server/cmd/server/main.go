package main

import (
	"os"
	"path/filepath"
	"strings"
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

	setupApiRoutes(r, cfg)
	r.NoRoute(func(ctx *gin.Context) {
		url := ctx.Request.URL.Path
		url = strings.TrimPrefix(url, "/")
		if url == "" || url == "home" {
			url = "index"
		}

		path := filepath.Join(cfg.DistPath, url)
		if _, err := os.Stat(path); err != nil {
			path = path + ".html"
		}
		ctx.File(path)
	})

	r.Run(cfg.Addr + ":" + cfg.Port)
}

func setupApiRoutes(r *gin.Engine, cfg *config.Config) {
	handler.NewIdeaHandler(cfg.IdeasDir).RegisterRoutes(r)
	handler.NewArticleHandler(cfg.ArticlesDirs).RegisterRoutes(r)
	api := r.Group("/api")
	{
		api.GET("/health", handler.CheckHealth)
	}
}
