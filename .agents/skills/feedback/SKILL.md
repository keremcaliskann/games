---
name: feedback
description: >-
  Plans and applies user feedback for a specified existing game (/feedback <oyun-adı> <notlar>
  or "feedback <oyun-adı>: ..."). Investigates root causes in the game's codebase, clarifies
  any design choices with the user, plans the exact file-level fixes/upgrades, and applies
  them directly to the game (or queues them if requested).
metadata:
  icon: build_circle
---

# /feedback <oyun-adı> — Oyun Geri Bildirim Planlama & Uyarlama Yeteneği

Kullanıcı bir oyun hakkında geri bildirim verdiğinde (`/feedback <oyun-adı> ...` veya `feedback <oyun-adı>: ...`), geri bildirimleri analiz eder, teknik olarak planlar ve oyuna uyarlar.

> **PASİF OYUN KURALI:** `games.json` içinde `"active": false` olan oyunlarda işlem yapma; kullanıcı özellikle aktif edilmesini isterse önce sor.

---

## Çalışma Akışı (4 Adım)

### Adım 1: Hedef Oyunu Bul & Kök Neden Analizi Yap
1. `<oyun-adı>` ifadesini `games.json` ve çalışma alanındaki oyun klasörleriyle eşleştir (ör. `smash-karts` → `smash-karts-brawl-3d`).
2. Kullanıcının yazdığı her geri bildirim maddesi için ilgili kaynak dosyaları (`src/game/**`, `src/render/**`, `src/input/**`, `src/ui/**`, `src/main.ts`) incele (çoklu dosya analizinde **Argon Medium** `research` alt ajanı kullanabilirsin).
3. Her geri bildirimin **kök nedenini** (hangi dosya, hangi satır, hangi mantık/fizik/görsel parametre) tespit et.

### Adım 2: Tasarım Tercihlerini Netleştir & Uyarlama Planı Sun
1. Eğer geri bildirim maddelerinde birden fazla uygulama seçeneği varsa (ör. *"farklı haritalar ekle"*, *"gelişim hissiyatını artır"*, *"oynanış çok hızlı"*), `ask_question` ile kullanıcıya net seçenekler sorarak nasıl olmasını istediğini kesinleştir.
2. Yapılacak değişiklikleri madde madde özetleyen kısa bir **Geri Bildirim Uyarlama Planı** çıkar.

### Adım 3: Çoklu Ajan veya Cerrahi Müdahale ile Oyuna Uyarla
1. Değişiklikleri oyunun ilgili modüllerine uygula:
   - Görsel/3D model (`src/render/**`) ve Oynanış/Fizik/AI (`src/game/**`, `src/ui/**`) katmanları birlikte değişiyorsa **Argon Medium** alt ajanlarıyla (`studio-3d-artist` / `studio-gameplay-engineer`) veya doğrudan cerrahi düzenlemelerle (`edit_file`) kodla.
2.*(Not: Kullanıcı "şimdi yapma, listeye ekle" derse değişiklikleri `backlog/studio-todo.json` içine `status: "ready"` olarak kaydet.)*

### Adım 4: Doğrulama & Canlıya Gönderim (`origin/main`)
1. `node scripts/sync-shared-core.mjs` çalıştır.
2. `npm --prefix <game-id> run typecheck` ve `npm --prefix <game-id> run build` komutlarıyla 0 hata olduğunu doğrula.
3. Değişiklikleri İngilizce Conventional Commit (`fix(<game-id>): ...` veya `feat(<game-id>): ...`) ile kaydet ve `git push origin main` ile gönder.
4. Kullanıcıya `<= 6 satırlık` Türkçe uçak bakım raporu (`DISCREPANCY / ROOT CAUSE / CORRECTIVE ACTION / VERIFICATION`) sun.
