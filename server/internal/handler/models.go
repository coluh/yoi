package handler

import "time"

// fe/src/api/types.ts

type GetArticleResp struct {
	Name     string    `json:"id"`
	Title    string    `json:"title"`
	Content  string    `json:"content"`
	UpdateAt time.Time `json:"updateAt"`
	Summary  string    `json:"summary"`
}

type GetArticleListResp struct {
	Articles []GetArticleResp `json:"articles"`
	Total    int              `json:"total"`
}
