package handler

import (
	"crypto/md5"
	"encoding/hex"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
)

type Article struct {
	// dir that the article in
	dir string
	// filename without extension
	name string
	// id
	id string
}

type ArticleHandler struct {
	articlesDirs []string

	articleList []Article
}

func NewArticleHandler(dirsString string) *ArticleHandler {
	return &ArticleHandler{
		articlesDirs: strings.Split(dirsString, ":"),
	}
}

func (h *ArticleHandler) RegisterRoutes(r *gin.Engine) {
	g := r.Group("/api/articles")
	{
		g.GET("", h.GetArticleList)
		g.GET("/:id", h.GetArticle)
		g.GET("/:id/*filepath", h.GetArticleImage)
	}
}

func generateID(path string) string {
	h := md5.Sum([]byte(path))
	return hex.EncodeToString(h[:])[:16]
}

// TODO: cache?
func (h *ArticleHandler) scanArticles() {

	h.articleList = nil

	for _, v := range h.articlesDirs {
		filepath.WalkDir(v, func(path string, d fs.DirEntry, err error) error {
			if err != nil {
				return err
			}

			if !d.IsDir() && (filepath.Ext(d.Name()) == ".md") {
				// this is an article
				rel, _ := filepath.Rel(v, path)
				h.articleList = append(h.articleList, Article{
					dir:  filepath.Dir(path),
					name: strings.TrimSuffix(d.Name(), ".md"),
					id:   generateID(rel),
				})
			}

			return nil
		})
	}
}

func getArticleInfo(contentMd string) (title, summary string) {

	re := regexp.MustCompile(`^#\s+(.+)$`)

	for line := range strings.SplitSeq(contentMd, "\n") {
		if title == "" {
			if match := re.FindStringSubmatch(line); match != nil {
				title = strings.TrimSpace(match[1])
			}
		}
		if len(summary) < 50 {
			if strings.HasPrefix(line, "#") || strings.HasPrefix(line, "*") {
				continue
			}
			summary = summary + line
		}
	}

	return
}

// traverse these dirs, build a list of all md files as articles
func (h *ArticleHandler) GetArticleList(ctx *gin.Context) {
	h.scanArticles()
	if h.articleList == nil {
		ctx.JSON(http.StatusOK, GetArticleListResp{})
		return
	}

	articles := []GetArticleResp{}
	for _, v := range h.articleList {
		path := filepath.Join(v.dir, v.name+".md")
		contentBytes, err := os.ReadFile(path)
		if err != nil {
			continue
		}
		content := string(contentBytes)
		title, summary := getArticleInfo(content)
		info, _ := os.Stat(path)
		articles = append(articles, GetArticleResp{
			Id:     v.id,
			Title:    title,
			UpdatedAt: info.ModTime(),
			Summary:  summary,
		})
	}

	ctx.JSON(http.StatusOK, GetArticleListResp{
		articles,
		len(articles),
	})
}

func (h *ArticleHandler) GetArticle(ctx *gin.Context) {
	if h.articleList == nil {
		h.scanArticles()
	}

	id := ctx.Param("id")
	if id == "" {
		fail(ctx, 400, "empty id")
		return
	}

	for _, v := range h.articleList {
		if id == v.id {
			path := filepath.Join(v.dir, v.name+".md")
			contentBytes, err := os.ReadFile(path)
			if err != nil {
				fail(ctx, 500, "open file: "+err.Error())
				return
			}
			content := string(contentBytes)
			title, _ := getArticleInfo(content)
			info, _ := os.Stat(path)
			ctx.JSON(200, GetArticleResp{
				Id:     v.id,
				Title:    title,
				Content:  content,
				UpdatedAt: info.ModTime(),
			})
			return
		}
	}

	fail(ctx, 404, "no such article")
}

func (h *ArticleHandler) GetArticleImage(ctx *gin.Context) {
	if h.articleList == nil {
		h.scanArticles()
	}

	id := ctx.Param("id")
	filePath := ctx.Param("filepath")
	if strings.Contains(filePath, "..") {
		fail(ctx, 403, "url contains illegal path")
		return
	}

	for _, v := range h.articleList {
		if id == v.id {
			path := filepath.Join(v.dir, filePath)
			if _, err := os.Stat(path); err != nil {
				fail(ctx, 404, "no such file")
				return
			}
			ctx.File(path)
			return
		}
	}

	fail(ctx, 404, "no such article")
}
