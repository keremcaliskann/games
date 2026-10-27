---
name: tasks
description: >-
  Displays all studio task lists and queues from backlog/studio-todo.json and
  backlog/ideas-backlog.json with zero conversational padding. Use when the user types /tasks or asks to see task lists.
---

# /tasks — Studio Task & Backlog Lists

Displays all studio task lists, pending upgrades, bugfixes, and queued game ideas with zero conversational padding or extraneous commentary.

## Execution Guide

When `/tasks` is invoked or the user asks to inspect task lists:

1. **Read Task Data:**
   - Run `node scripts/list-game-tasks.mjs` or read `backlog/studio-todo.json` and `backlog/ideas-backlog.json`.

2. **Output Rule (Strict List Only — No Fluff):**
   - Output **ONLY** the structured markdown tables / lists.
   - Do **NOT** output conversational intros, conclusions, explanatory guides, or commentary.

### Output Structure:

#### 1. Aktif Oyun İyileştirme & Hata Listesi (`backlog/studio-todo.json`)
Tablo halinde: Öncelik (`P0`/`P1`/`P2`), Oyun (`gameId`), Görev Başlığı, Tür, Skor.
*(Eğer bekleyen aktif görev yoksa: "Aktif bekleyen görev yok.")*

#### 2. Yeni Oyun Geliştirme Kuyruğu (`backlog/ideas-backlog.json`)
Tablo halinde: Sıra (`#1`, `#2`...), Oyun Adı, Kategori, Skor.

#### 3. Yayındaki Oyunlar (`games.json`)
Tamamlanmış ve portala eklenmiş oyunların kısa listesi.
