---
name: design
description: >-
  Unrestricted, deep-dive interactive Game Architecture & Design Workshop. Takes a user's
  game idea with zero market research and zero question limits, guides the user through a
  thorough stage-by-stage Q&A (using ask_question) covering every single mechanic, rule,
  map, AI behavior, progression table, 3D model, and UI element, and saves the complete
  specification in its own folder under backlog/game-plans/<game-id>/ (STATUS.json + DESIGN.md + SPEC.json).
  Use when the user types /design or wants to plan a new game idea in full detail.
metadata:
  icon: architecture
---

# /design — Detaylı & Limitsiz İnteraktif Oyun Planlama Atölyesi

Kullanıcının verdiği oyun fikrini **sıfır dış pazar araştırması** ile, **hiçbir soru veya tur sınırı olmadan**, oyunun en ince detayına kadar adım adım soru-cevap (`ask_question`) şeklinde planlar ve her oyunu kendi özel klasörüne (**`backlog/game-plans/<game-id>/`**) kaydeder.

> **TEMEL İLKELER (KESİN KURALLAR):**
> 1. **Pazar Araştırması Yok:** `search_web` ile dış trend/pazar araması yapma. Fikir tamamen kullanıcıya aittir; odak noktan %100 bu fikri kullanıcıyla birlikte en ince ayrıntısına kadar olgunlaştırmaktır.
> 2. **Soru & Tur Limiti Yok:** 3 soru veya 3 tur kısıtlaması yoktur. Oyunun hiçbir mekaniği, formülü, haritası, bot davranışı veya görsel detayı belirsiz kalmayana kadar soru-cevap turlarına devam et.
> 3. **Planlama Sırasında Kod Yazma:** Tasarım tamamen bitip kullanıcı son onayı verene kadar oyun kaynak kodu (`src/`) yazma.

---

## 6 Aşamalı Derin Planlama Atölyesi (`ask_question` ile Adım Adım)

Her aşamada `ask_question` aracını kullanarak seçenekler sun (önerilen seçeneği `(Önerilen)` ile başlat; kullanıcı isterse kendi cevabını da yazabilir). Bir aşamadaki tüm detaylar netleşmeden diğer aşamaya geçme:

### Aşama 1: Çekirdek Kimlik, Tür, Kamera & Kontrol Mekanikleri
- **Oyun Kimliği:** Oyun adı (`<game-id>` klasör adı ve başlığı), temel amacı ve oyuncunun ilk 2 saniyede yapacağı ana eylem.
- **Kontrol Şeması:** Kamera yönüne göre (camera-relative) hareket, sanal joystick, fare/dokunmatik nişan alma, özel aksiyon tuşları (zıplama, ateş, drift, vinç, hamle vb.).
- **Kamera Perspektifi & Ergonomi:** Kamera açısı (TPS takip, izometrik 45°, üstten bakış, 360° yörünge), portre (9:16) ve yatay (16:9) FOV/mesafe değerleri, sarsıntı (screen shake) ve yakınlaşma (zoom) tepkileri.

### Aşama 2: Oynanış Döngüsü, Fizik Kuralları & Matematiksel Denge
- **Fizik & Hareket Parametreleri:** Hız, ivme, sürtünme, ağırlık/kütle hissi, çarpışma tepkileri, mermi/nesne fiziği.
- **Maç / Bölüm Akışı:** Kazanma ve kaybetme koşulları, süre sınırı veya dalga/etap yapısı, doğma (spawn) koruması, yeniden doğma kuralları.
- **Zorluk Seçimi (`Kolay / Normal / Zor`):** Başlangıç menüsündeki 3 zorluk seviyesinin hız, hasar, süre ve rakip agresifliğini hangi çarpanlarla değiştireceği.

### Aşama 3: Yapay Zeka (Bot AI), Düşmanlar & Özel Mekanikler/Silahlar
- **Rakip / Bot Yapısı:** Bot sayısı, botların karar verme mantığı (hedef seçimi, kaçınma, saldırı, kaynak toplama), köşelerde/engellerde takılmayı önleyen kurtarma (unstuck) algoritması.
- **Özel Silahlar / Yetenekler / Eşyalar:** Oyundaki tüm silahların, güç küplerinin, tuzakların veya özel araç mekaniklerinin (hasar, menzil, dolum süresi, görsel etkisi) tek tek listesi.

### Aşama 4: Dünya, Haritalar / Biyomlar & Çevre Tasarımı
- **Harita & Biyom Çeşitliliği:** Oyunda yer alacak tüm haritaların/biyomların (en az 3 farklı harita/bölge) isimleri, boyutları, zemin sürtünme/fizik farkları.
- **Dinamik Engeller & Çevre Elemanları:** Her haritaya özgü hareketli engeller, yıkılabilir yapılar, rampalar, tehlike alanları (fırtına çemberi, lav/su/uçurum) ve haritalar arası geçiş kuralları.

### Aşama 5: Gelişim Hissiyatı (Progression), Garaj/Mağaza & Ekonomi
- **Oyun İçi Gelişim:** Maç/bölüm içinde seviye atlama, büyüme, güçlenme veya kombo barı mekaniği.
- **Kalıcı Garaj / Mağaza & Yükseltmeler:** Kalıcı altın/puan kazanımı, açılabilir karakter/araç görünümleri (en az 6 görünüm) ve kalıcı istatistik yükseltme ağacı (Hız, Güç, Zırh/Menzil vb.).
- **Ödüllü Reklam & Kurtarıcı Güçlendiriciler:** Oyun içi alt bar güçlendiricileri (Boosters), kaybetmeye yakın "Çok Yaklaştın!" (Near-Miss Revive) kurtarma mekaniği ve bölüm sonu kazanç çarpanı.

### Aşama 6: 3D Görsel Sanat (`PrefabFactory`), Ses & HUD Arayüzü
- **Soft Daylight Renk Paleti:** Gökyüzü, güneş ışığı, zemin ve harita renk kodları (karanlık boşluk veya aşırı parlak beyaz olmadan).
- **3D Model & Prefab Listesi (`PrefabFactory`):** Oyuncu karakteri/aracı, botlar, silahlar, çevre nesneleri ve efektlerin çok parçalı prosedürel 3D (`ProceduralMeshBuilder`) ve `.glb` hot-swap (`ASSETS_NEEDED.md`) detayları.
- **HUD & Ses Tasarımı:** Ekranda görünecek göstergeler (skor, sıralama, mini-bar, cephane/hız göstergesi) ve prosedürel Web Audio ses efektleri.

---

## Planlama Sonu: Klasör Bazlı Kayıt (`backlog/game-plans/<game-id>/`)

Tüm aşamalar tamamlanıp kullanıcı **"Plan tamam, kaydet"** dediğinde, oyunu kendi özel klasörüne (`backlog/game-plans/<game-id>/`) şu 3 kapsamlı dosyayla kaydet:

1. **`backlog/game-plans/<game-id>/STATUS.json`:**
   ```json
   {
     "id": "<game-id>",
     "title": "<OYUN BAŞLIĞI // ALT BAŞLIK>",
     "category": "<kategori>",
     "status": "ready",
     "priority": 1,
     "createdAt": "YYYY-MM-DD",
     "updatedAt": "YYYY-MM-DD"
   }
   ```
2. **`backlog/game-plans/<game-id>/DESIGN.md`:**
   6 aşamada konuşulan **her bir detayın, formülün, haritanın, bot davranışının, yükseltme tablosunun ve görsel kuralın** hiçbir özetleme/kırpma yapılmadan yazıldığı eksiksiz Oyun Tasarım Dokümanı.
3. **`backlog/game-plans/<game-id>/SPEC.json`:**
   Çoklu Ajan ekibinin (`studio-architect`, `studio-3d-artist`, `studio-gameplay-engineer`, `studio-qa-critic`) doğrudan okuyacağı makine-okunur tam teknik şartname (`palette`, `cameraSpec`, `physicsSpec`, `aiSpec`, `mapsSpec`, `progressionSpec`, `prefabContract`, `hudAndUiSpec`, `fileArchitecture`).
