---
trigger: model_decision
description: "YouTube Playables native monetization, universal portal ad adapter (Yandex, CrazyGames, Poki), UI design standards, and disabled-state ad availability policy."
---

# Monetization & Ad Standards Policy

## 1. Architectural Boundary
All advertising and monetization logic must reside behind a unified interface in `src/platform/ads.ts`. Game systems and UI components must never invoke platform SDKs directly.

```
game/systems/economy.ts ──> platform/ads.ts (UniversalAdProvider)
                              ├── 1. YouTube Playables (ytgame.ads)
                              ├── 2. Yandex Games (ysdk.adv)
                              ├── 3. CrazyGames (CrazyGames.SDK.ad)
                              ├── 4. Poki (PokiSDK)
                              └── 5. MockAdProvider (GitHub Pages / Local Dev)
```

---

## 2. Standard `IAdProvider` Interface

```ts
export interface IAdProvider {
  initialize(): Promise<void>;
  showInterstitial(placement?: string): Promise<boolean>;
  showRewarded(placement?: string): Promise<boolean>;
  isRewardedReady(): boolean;
  onAvailabilityChange?(callback: (isReady: boolean) => void): void;
}
```

### Universal Runtime Detection
1. **YouTube Playables (`window.ytgame?.IN_PLAYABLES_ENV`):**
   - Must strictly verify `window.ytgame.IN_PLAYABLES_ENV === true` before invoking native SDK methods.
   - `showInterstitial()` calls `await ytgame.ads.requestInterstitialAd()`.
   - `showRewarded()` calls `await ytgame.ads.requestRewardedAd()`.
2. **Web Portals (`YaGames`, `CrazyGames.SDK`, `PokiSDK`):**
   - Automatically maps rewarded and interstitial calls to the active portal SDK without requiring manual code changes.
3. **GitHub Pages & Local Preview (`MockAdProvider`):**
   - When running on GitHub Pages or locally (`!IN_PLAYABLES_ENV` and no external portal SDK), renders an interactive 2-second simulation reel so all reward callbacks can be tested.

---

## 3. Ad Availability & Disabled State Invariant (Mandatory)

> [!IMPORTANT]
> **Reklama Erişim Yoksa Butonlar Kapalı Olmalıdır:**
> Eğer oyuncunun internet bağlantısı yoksa (`!navigator.onLine`), reklam engelleyici tespit edilmişse veya platform reklam envanteri boş döndüyse (`isRewardedReady() === false`), reklama bağımlı tüm butonlar ve rozetler **otomatik olarak devre dışı bırakılmalı (disabled/grayed out) veya gizlenmelidir**.

### Uygulama Kuralları:
1. **`isRewardedReady(): boolean` Kontrolü:**
   - Reklam butonları oluşturulurken ve açılır pencereler (modallar) gösterilirken mutlaka `ads.isRewardedReady()` sorgulanmalıdır.
2. **Görsel Durum (UI Disabled State):**
   - **Gizleme (Hide):** Alternatif eylem olan yerlerde (örneğin Bölüm Sonu ekranında sadece standart "Geç" butonu kalır, 3x Çarpan butonu gizlenir).
   - **Devre Dışı Bırakma (Disable):** Buton görünür kalacaksa `opacity: 0.35; pointer-events: none; cursor: not-allowed;` stili uygulanmalı ve `🎬 REKLAM YOK` etiketi gösterilmelidir.
3. **Oyuncu Aldatılmamalıdır:** Tıklandığında hiçbir şey yapmayacak veya hata verecek hiçbir reklam butonu aktif halde tutulamaz.

---

## 4. UI ve Tasarım Standartları (3 Zorunlu Kanca)

Her oyunda 3 gelir kancası şu görsel ve işlevsel standartlara uymalıdır:

### Hook 1: In-Level Rescue Booster (Oyun İçi Kurtarıcı Güçlendirici)
* **Tasarım:** Alt çubukta veya coin yanındaki butonlarda `[🎬 FREE]` ya da `[+🎬]` etiketi.
* **Tıklama:** Tıklandığında anında ödüllü reklam başlatılır, başarıyla tamamlandığında güçlendirici (Çekiç, İpucu, Kalkan) hemen uygulanır.

### Hook 2: Near-Miss Revive Modal (Kıl Payı Canlanma)
* **Tasarım:** Kaybetme anında açılan yüksek kontrastlı uyarı kartı (`ÇOK YAKLAŞTIN!`).
* **Buton Stili:** Parlayan zümrüt yeşili degrade (`linear-gradient(135deg, #10b981, #059669)`), üzerinde `🎬 İZLE & DEVAM ET (+KALKAN/+HAMLE)`.
* **Ad Unavailable:** Reklam yoksa doğrudan normal Game Over ekranına geçilir.

### Hook 3: Victory Multiplier Needle Bar (Bölüm Sonu Çarpan İbresi)
* **Tasarım:** Bölüm bittiğinde 1.5x - 5x arasında gidip gelen osilasyonlu ibre (`#f59e0b` amber renk).
* **Buton Stili:** Altın/amber degrade (`linear-gradient(135deg, #f59e0b, #d97706)` ile `#000` metin).
* **Ad Unavailable:** Reklam yoksa çarpan kutusu gizlenir, oyuncuya sadece temel coin ödülü sunulur.

---

## 5. Simülasyon Reklam Modalı Tasarım Standardı (Mock Ad Overlay)

GitHub Pages ve yerel test ortamında açılan simülasyon modalı standart bir arayüze sahip olmalıdır:
* **Arka Plan:** `rgba(3, 7, 18, 0.95)` koyu cam efekti (`backdrop-filter: blur(8px)`).
* **Başlık:** Küçük cyan takip yazısı: `YOUTUBE PLAYABLES REWARD REEL // SPONSOR`.
* **Geri Sayım:** Ortada 2 saniyelik sayaç (`2s` -> `1s` -> `TAMAMLANDI!`).
* **Buton:** 2 saniye dolana kadar devre dışı (`LÜTFEN BEKLEYİN...`), süre bitince yeşil aktif (`ÖDÜLÜ AL & DEVAM ET`).
