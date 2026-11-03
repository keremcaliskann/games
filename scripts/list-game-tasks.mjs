#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, '..');

const studioTodoPath = path.join(workspaceRoot, 'backlog', 'studio-todo.json');
const gamePlansDir = path.join(workspaceRoot, 'backlog', 'game-plans');
const gamesCatalogPath = path.join(workspaceRoot, 'games.json');

const studioTodo = fs.existsSync(studioTodoPath)
  ? JSON.parse(fs.readFileSync(studioTodoPath, 'utf8'))
  : [];

const gamePlans = [];
if (fs.existsSync(gamePlansDir)) {
  for (const entry of fs.readdirSync(gamePlansDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const statusFile = path.join(gamePlansDir, entry.name, 'STATUS.json');
    if (fs.existsSync(statusFile)) {
      try {
        gamePlans.push(JSON.parse(fs.readFileSync(statusFile, 'utf8')));
      } catch {
        // Ignore malformed status file
      }
    }
  }
}

const gamesCatalog = fs.existsSync(gamesCatalogPath)
  ? JSON.parse(fs.readFileSync(gamesCatalogPath, 'utf8')).filter((g) => g.active !== false)
  : [];
const activeGameIds = new Set(gamesCatalog.map((g) => g.id));

console.log(`\n===============================================================`);
console.log(`🎮 STUDIO GÖREV VE OYUN PLAN LİSTELERİ (/tasks)`);
console.log(`===============================================================\n`);

const activeStudioTodo = studioTodo.filter(
  (t) => (t.status === 'ready' || t.status === 'in_progress') && activeGameIds.has(t.gameId)
);
const completedStudioTodo = studioTodo.filter((t) => t.status === 'completed');

console.log(`📌 1. AKTİF OYUN GERİ BİLDİRİM & DÜZELTME LİSTESİ (backlog/studio-todo.json):`);
if (activeStudioTodo.length === 0) {
  console.log(`  (Bekleyen aktif görev bulunmamaktadır. Toplam ${completedStudioTodo.length} görev tamamlandı.)`);
} else {
  for (const t of activeStudioTodo) {
    console.log(`  • [${t.priority}] [${t.gameId}] ${t.title} (${t.type || 'upgrade'})`);
  }
}

console.log(`\n---------------------------------------------------------------`);
console.log(`📂 2. PLANLANMIŞ YENİ OYUN KLASÖRLERİ (backlog/game-plans/<game-id>/):`);

const readyPlans = gamePlans
  .filter((p) => p.status === 'ready' || p.status === 'in_progress' || p.status === 'draft')
  .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

if (readyPlans.length === 0) {
  console.log(`  (Henüz bekleyen planlanmış oyun yok. '/design <oyun fikri>' ile yeni oyun planlayabilirsiniz.)`);
} else {
  for (const p of readyPlans) {
    console.log(`  • [#${p.priority ?? 1}] [${p.status.toUpperCase()}] ${p.title} (backlog/game-plans/${p.id}/)`);
  }
}

console.log(`\n---------------------------------------------------------------`);
console.log(`🌐 3. YAYINDAKİ AKTİF OYUNLAR (games.json — ${gamesCatalog.length} Oyun):`);
for (const g of gamesCatalog) {
  console.log(`  ✔ ${g.title} (${g.id})`);
}
console.log(`===============================================================\n`);
