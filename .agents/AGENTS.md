# Proje Kuralları (turkceoabtdeyiz-web)

Bu dosya, `turkceoabtdeyiz-web` projesi geliştirilirken uyulması gereken genel prensipleri, tasarım kurallarını ve teknik kısıtlamaları içerir.

## 1. Genel Kurallar
* **Kullanıcı ve Üyelik Sistemi:** Ziyaretçiler üye olmadan satın alım yapamaz. Öğrenci girişi ve kayıt süreçleri zorunludur.
* **Şifre ve Güvenlik Yönetimi:** admin şifreleri görebilmelidir Admin panelinden öğrencilerin şifreleri için sıfırlama/güncelleme yetkisi sunulmalıdır.
* **Dinamik İçerik Yönetimi (CMS):** Sitede görünen tüm dinamik alanlar (eğitimler, ürün kategorileri, ürün sıralamaları, açıklamalar, başarılar, kadro, SSS, slider) admin panelinden kolayca aktif/pasif edilebilir ve düzenlenebilir olmalıdır.
* **İşlem Bildirimleri:** Kullanıcı veya admin tarafından yapılan tüm işlemler (kayıt, giriş, ekleme, güncelleme, silme, ödeme vb.) sonrasında ekranda modern ve şık başarılı/başarısız bildirimleri (toast notification) gösterilmelidir.
* **Görsel ve Medya Yüklemeleri:** Slider görselleri, ürün görselleri ve videoları gibi tüm medya yükleme alanları modern sürükle-bırak/upload arayüzü ile yapılmalı; link/URL girişi olmamalıdır. Görsel yüklenen her alanda önerilen tasarım ölçüleri (px) mutlaka yazmalıdır.
* **Dil ve İsimlendirme:** Arayüz dili Türkçe, kodlama ve veritabanı isimlendirmeleri İngilizce olacaktır.

## 2. Tasarım ve Estetik Standartları
* **Tema ve Atmosfer:** Aydınlık, ferah, göz yormayan, premium bir açık tema tasarımı.
* **Renk Paleti (Altın Rengi Dengesi):**
  * Arka Plan: `#faf9f6` (Alabaster Warm White) ve `#ffffff` (Saf Beyaz)
  * Birincil / Logo Rengi: `#b89047` (Logo Altın/Bronz) - **ÖNEMLİ:** Altın tonları baskın kullanılmayacak, sadece ince detaylarda, derecelendirmelerde, aktif durumlarda ve detay aksanlarında (accent color) şık ve az miktarda yer alacaktır.
  * İkincil / Kontrast Rengi: `#1e293b` (Slate/Antrasit - Butonlar, başlıklar ve ana kontrast ögeleri bu koyu tonda olacaktır)
  * Yazı Rengi: `#1e293b` (Ana metinler) ve `#475569` (İkincil metinler)
  * Kenarlıklar: `#f1f0ea` (Sıcak bej/gri)
* **Modallar ve Pop-up'lar:** Tüm modal ve pop-up bileşenleri sitenin modern açık tema çizgisine uygun, akıcı animasyonlu ve temiz olmalıdır.
* **Ürün ve Satış Odaklı Tasarım:** Ana hedef ürün satışı olduğundan, **tüm aktif ürünler/kurs paketleri doğrudan anasayfa üzerinde listelenecektir**. Ürün listeleme ve ürün detay sayfaları modern, güven veren ve yüksek dönüşüm odaklı tasarlanmalıdır.
* **Kusursuz Mobil Uyum (Responsive):** Mobil uyumluluğa **çok ciddi dikkat edilmelidir**. Tüm menü, sepet, ödeme ve admin ekranları mobil cihazlarda %100 kusursuz çalışmalıdır.
* **Bileşen Stilleri:** Yumuşak köşeler (border-radius: 8px/12px), hafif ve modern gölgeler (box-shadow), butonlarda ve linklerde akıcı hover geçiş efektleri (micro-animations).

## 3. Teknik Mimari ve Kod Standartları
* **Teknoloji Yığını (Tech Stack):** Next.js (App Router), TypeScript, React.
* **Veritabanı ve ORM:** PostgreSQL ve Prisma ORM.
* **Stil Yönetimi (Styling):** Vanilla CSS ve CSS Modules (`*.module.css`). Tailwind CSS kullanılmayacaktır.
* **Modüler Kod Yapısı:** Projede modüler, okunabilir ve clean-code prensiplerine uygun kod yazılacaktır. **Tek bir kod dosyası kesinlikle 1000 satırı aşmayacaktır.**
* **Kupon Sistemi:** Hem ürüne özel hem de genel sepete uygulanabilir indirim kuponu oluşturma sistemi kurulacaktır. Hangi ürünlerin kupon kullanımına açık olacağı tek tek ayarlanabilmelidir.
* **Ödeme Altyapısı:** PayTR entegrasyonu (başarılı/başarısız ödeme yönlendirmeleri, PayTR callback doğrulama imzası).
* **Sepet (Cart) Aksiyonları:** Yerel depolama (localStorage) ile sepet verisini koruyan, kullanıcı giriş yapınca sepet senkronizasyonu sağlayan, modern ve akıcı sepet çekmecesi (drawer) yapısı.
* **Klasör Yapısı:**
  * `src/app/` -> Sayfalar ve API rotaları
  * `src/components/` -> Yeniden kullanılabilir UI bileşenleri
  * `src/lib/` -> Yardımcı kütüphaneler (Prisma client, PayTR helper, utility fonksiyonları)
  * `prisma/` -> Veritabanı şeması ve göç (migration) dosyaları


