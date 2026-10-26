---
name: gametasks
description: >-
  Displays all studio task lists and queues from backlog/studio-todo.json (P0/P1/P2
  bugfixes & polish upgrades) and backlog/ideas-backlog.json (ranked new game blueprints).
  Use when the user types /gametasks or asks to see all game task lists.
---

# /gametasks — Studio Task & Backlog Inspector

Reads, consolidates, and displays all studio task lists, pending upgrades, bugfixes, and queued game ideas across the workspace backlogs.

## Execution Guide

When `/gametasks` is invoked or the user asks to inspect task lists:

1. **Read Studio Todo Backlog (`backlog/studio-todo.json`):**
   - Parse all tasks and group by priority:
     - `P0`: Urgent blocker bugfixes (camera clipping, sound failure, unclickable UI).
     - `P1`: High-impact gameplay mechanics & UX polish (combos, bot AI, controls).
     - `P2`: Visual juice & sound enhancements (particles, previews, pitch ramp).
   - Display task title, target game (`gameId`), type, priority score, and target files.

2. **Read Game Ideas Backlog (`backlog/ideas-backlog.json`):**
   - Parse all blueprints and organize into:
     - **Active Development Queue:** Ideas with `rank` (Rank #1, #2, #3...) and `ready` status, sorted by rank/revenue score.
     - **In Progress:** Ideas currently undergoing implementation.
     - **Completed Games:** Games that have already been developed and shipped.
   - For ranked games, include: Rank, Title, Category, Revenue Score (/100), and core loop summary.

3. **Read Deployed Portal Catalog (`games.json`):**
   - Count and cross-reference total active games live in the portal catalog (`https://keremcaliskann.github.io/games/`).

4. **Present the Structured Report (in Turkish):**
   Format the output cleanly in Turkish markdown:
   - **Bölüm 1: Aktif Oyun İyileştirme & Hata Görevleri (`backlog/studio-todo.json`)**
     - P0, P1, P2 tabloları veya listeleri
   - **Bölüm 2: Yeni Oyun Fikirleri & Geliştirme Kuyruğu (`backlog/ideas-backlog.json`)**
     - Sıradaki oyunlar tablosu (Sıra, İsim, Tür, Puan, Durum)
     - Tamamlanan oyunlar listesi
   - **Bölüm 3: Önerilen Hızlı Komutlar**
     - `/studio`: Sıradaki #1 görevi/oyunu otonom inşa eder.
     - `/audit`: Tüm oyunların TypeScript ve build testini çalıştırır.
     - `/trend`: 90 günlük trend taraması yapıp fikir kuyruğunu yeniden puanlar.
     - `/deploy`: Tüm güncellemeleri GitHub Pages'e canlıya atar.
