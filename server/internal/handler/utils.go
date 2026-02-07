package handler

import (
	"github.com/gin-gonic/gin"
)

func fail(ctx *gin.Context, code int, msg string) {
	ctx.JSON(code, gin.H{"error": msg})
}
