---
name: tasks
description: >-
  Displays all studio task lists and planned game folders from backlog/studio-todo.json
  and backlog/game-plans/*/STATUS.json with zero conversational padding.
  Use when the user types /tasks or asks to see task lists.
---

# /tasks — Studio Task & Planned Games Lists

Displays all pending feedback tasks (`backlog/studio-todo.json`), planned game folders (`backlog/game-plans/<game-id>/`), and active published games (`games.json`) with zero conversational padding.

## Execution Guide

1. **Read Task Data:**
   - Run `node scripts/list-game-tasks.mjs` or read `backlog/studio-todo.json` and `backlog/game-plans/*/STATUS.json`.
2. **Output Rule (Strict List Only — No Fluff):**
   - Output **ONLY** the structured markdown tables / lists:
     1. **Aktif Oyun Geri Bildirim & Düzeltme Listesi (`backlog/studio-todo.json`)**
     2. **Planlanmış Yeni Oyun Klasörleri (`backlog/game-plans/<game-id>/`)**
     3. **Yayındaki Aktif Oyunlar (`games.json`)**
