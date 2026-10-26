#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, '..');

const studioTodoPath = path.join(workspaceRoot, 'backlog', 'studio-todo.json');
const ideasBacklogPath = path.join(workspaceRoot, 'backlog', 'ideas-backlog.json');
const gamesCatalogPath = path.join(workspaceRoot, 'games.json');

const studioTodo = fs.existsSync(studioTodoPath)
  ? JSON.parse(fs.readFileSync(studioTodoPath, 'utf8'))
  : [];

const ideasBacklog = fs.existsSync(ideasBacklogPath)
  ? JSON.parse(fs.readFileSync(ideasBacklogPath, 'utf8'))
  : [];

const gamesCatalog = fs.existsSync(gamesCatalogPath)
  ? JSON.parse(fs.readFileSync(gamesCatalogPath, 'utf8'))
  : [];

console.log(`\n===============================================================`);
console.log(`🎮 STUDIO GÖREV VE GELİŞTİRME LİSTELERİ (/gametasks)`);
console.log(`===============================================================\n`);

console.log(`📌 1. AKTİF OYUN İYİLEŞTİRME & HATA LİSTESİ (backlog/studio-todo.json):`);
if (studioTodo.length === 0) {
  console.log(`  (Bekleyen görev bulunmamaktadır.)`);
} else {
  const p0 = studioTodo.filter(t => t.priority === 'P0');
  const p1 = studioTodo.filter(t => t.priority === 'P1');
  const p2 = studioTodo.filter(t => t.priority === 'P2');

  if (p0.length > 0) {
    console.log(`\n  🚨 [P0 - KRİTİK HATALAR] (${p0.length} görev):`);
    for (const t of p0) {
      console.log(`    • [${t.gameId}] ${t.title} (Skor: ${t.priorityScore})`);
    }
  }

  if (p1.length > 0) {
    console.log(`\n  ⚡ [P1 - ÖNEMLİ MEKANİK / UX İYİLEŞTİRMELERİ] (${p1.length} görev):`);
    for (const t of p1) {
      console.log(`    • [${t.gameId}] ${t.title} (${t.type}) - Skor: ${t.priorityScore}`);
    }
  }

  if (p2.length > 0) {
    console.log(`\n  ✨ [P2 - GÖRSEL CİLALAMA & DETAYLAR] (${p2.length} görev):`);
    for (const t of p2) {
      console.log(`    • [${t.gameId}] ${t.title} (${t.type}) - Skor: ${t.priorityScore}`);
    }
  }
}

console.log(`\n---------------------------------------------------------------`);
console.log(`🚀 2. YENİ OYUN KUYRUĞU (backlog/ideas-backlog.json):`);

const queued = ideasBacklog
  .filter(i => i.status === 'ready' && i.rank != null)
  .sort((a, b) => a.rank - b.rank);

const inProgress = ideasBacklog.filter(i => i.status === 'in_progress');
const completed = ideasBacklog.filter(i => i.status === 'completed');

if (inProgress.length > 0) {
  console.log(`\n  🔨 [ŞU AN GELİŞTİRİLİYOR]:`);
  for (const g of inProgress) {
    console.log(`    ▶ [${g.id}] ${g.title} (${g.category}) - Skor: ${g.revenueScore}/100`);
  }
}

console.log(`\n  📋 [SIRADAKİ OYUN GELİŞTİRME PLANI]:`);
for (const g of queued) {
  console.log(`    #${g.rank} | ${g.title} | ${g.category} | Skor: ${g.revenueScore}/100`);
}

console.log(`\n  ✅ [TAMAMLANMIŞ VE YAYINDA OLAN OYUNLAR] (${completed.length} oyun):`);
for (const g of completed) {
  console.log(`    ✔ ${g.title} (${g.id})`);
}

console.log(`\n---------------------------------------------------------------`);
console.log(`🌐 PORTAL DURUMU: Toplam ${gamesCatalog.length} oyun katalogda aktif.`);
console.log(`===============================================================\n`);
