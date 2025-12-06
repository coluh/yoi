package handler

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

type IdeaHandler struct {
	ideasDir string
}

func NewIdeaHandler(ideasDir string) *IdeaHandler {
	return &IdeaHandler{
		ideasDir: ideasDir,
	}
}

func (h *IdeaHandler) RegisterRoutes(router *gin.Engine) {
	group := router.Group("/api/ideas")
	{
		group.GET("", h.GetIdeaList)
		group.GET("/:title", h.GetIdea)
		group.Static("/img", filepath.Join(h.ideasDir, "img"))
	}
}

func (h *IdeaHandler) GetIdeaList(ctx *gin.Context) {
	entry, err := os.ReadDir(h.ideasDir)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "unable to read ideas dir: " + err.Error()})
		return
	}

	var mds []string
	for _, f := range entry {
		if !f.IsDir() && strings.HasSuffix(f.Name(), ".md") {
			mds = append(mds, f.Name()[:len(f.Name())-3])
		}
	}
	ctx.JSON(http.StatusOK, gin.H{"titles": mds})
}

func (h *IdeaHandler) GetIdea(ctx *gin.Context) {
	title := ctx.Param("title")
	if title == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "title cannot be empty"})
		return
	}

	filename := title + ".md"
	path := filepath.Join(h.ideasDir, filename)
	data, err := os.ReadFile(path)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "unable to read file: " + err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"content": string(data)})
}

func (h *IdeaHandler) GetIdeaImg(ctx *gin.Context) {
	imgname := ctx.Param("imgname")
	path := filepath.Join(h.ideasDir, "img", imgname)
	ctx.File(path)
}
