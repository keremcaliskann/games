# 📁 `backlog/game-plans/<game-id>/` — Kullanıcı Odaklı Detaylı Oyun Planları Klasörü

Bu klasör, `/design` veya `/fikir` yeteneği ile adım adım planlanan her oyunun tüm tasarım ve teknik mimari dosyalarını kendi alt klasöründe (`backlog/game-plans/<game-id>/`) barındırır.

## Klasör Yapısı (Her Oyun İçin Ayrı Klasör)

```
backlog/game-plans/
└── <game-id>/
    ├── STATUS.json   # Oyunun durumu ("draft" | "ready" | "in_progress" | "completed") ve öncelik sırası
    ├── DESIGN.md     # Baştan sona tüm oynanış, kamera, fizik, AI, harita, gelişim ve görsel tasarım detayları
    └── SPEC.json     # 4'lü Çoklu Ajan (studio-architect, studio-3d-artist, studio-gameplay-engineer, studio-qa-critic) kod sözleşmesi
```
