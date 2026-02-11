package handler

import "time"

// fe/src/api/types.ts

type GetArticleResp struct {
	Id     string    `json:"id"`
	Title    string    `json:"title"`
	Content  string    `json:"content"`
	UpdatedAt time.Time `json:"updatedAt"`
	Summary  string    `json:"summary"`
}

type GetArticleListResp struct {
	Articles []GetArticleResp `json:"articles"`
	Total    int              `json:"total"`
}
