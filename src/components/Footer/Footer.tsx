"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, MessageSquare, Globe, Share2, X } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [globalSettings, setGlobalSettings] = useState<any>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isKvkkModalOpen, setIsKvkkModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/public/settings");
        if (response.ok) {
          const data = await response.json();
          if (data.settings?.global_settings) {
            setGlobalSettings(data.settings.global_settings);
          }
        }
      } catch (error) {
        console.error("Error loading settings in footer:", error);
      }
    }
    fetchSettings();
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} container`}>
        <div className={styles.grid}>
          {/* Logo & Description */}
          <div className={styles.brandCol}>
            <div className={styles.logoWrapper}>
              <Image
                src="/logo.png"
                alt="Türkçe ÖABTdeyiz Logo"
                fill
                sizes="150px"
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className={styles.description}>
              {globalSettings?.footerAbout || "Türkçe ÖABT Alan Sınavı hazırlık sürecinde Türkiye'nin en seçkin kadrosuyla canlı dersler, konu anlatımları ve interaktif deneme sınavları platformu."}
            </p>
            <div className={styles.socials}>
              <a
                href={globalSettings?.socialYoutube || "https://youtube.com"}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="YouTube"
              >
                <Globe size={18} />
              </a>
              <a
                href={globalSettings?.socialInstagram || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <Share2 size={18} />
              </a>
              <a
                href={globalSettings?.whatsappNumber ? `https://wa.me/${globalSettings.whatsappNumber.replace(/[^0-9]/g, '')}` : "https://wa.me"}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="WhatsApp"
              >
                <MessageSquare size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={styles.title}>Hızlı Bağlantılar</h3>
            <ul className={styles.linksList}>
              <li>
                <Link href="/" className={styles.link}>Anasayfa</Link>
              </li>
              <li>
                <Link href="/egitimlerimiz" className={styles.link}>Eğitimlerimiz</Link>
              </li>
              <li>
                <Link href="/yayinlar" className={styles.link}>Yayınlarımız</Link>
              </li>
              <li>
                <Link href="/kadromuz" className={styles.link}>Kadro</Link>
              </li>
              <li>
                <Link href="/basarilarimiz" className={styles.link}>Başarılarımız</Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className={styles.title}>Destek</h3>
            <ul className={styles.linksList}>
              <li>
                <Link href="/oabt-rehberi" className={styles.link}>ÖABT Rehberi</Link>
              </li>
              <li>
                <Link href="/sss" className={styles.link}>Sıkça Sorulan Sorular</Link>
              </li>
              <li>
                <Link href="/iletisim" className={styles.link}>İletişim</Link>
              </li>
              <li>
                <Link href="/hakkimizda" className={styles.link}>Hakkımızda</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className={styles.title}>İletişim Bilgileri</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <MapPin size={18} className={styles.contactIcon} />
                <span>{globalSettings?.contactAddress || "Kızılay, Atatürk Bulvarı No: 123, Çankaya / Ankara"}</span>
              </li>
              <li className={styles.contactItem}>
                <Phone size={18} className={styles.contactIcon} />
                <a href={globalSettings?.contactPhone ? `tel:${globalSettings.contactPhone.replace(/[^0-9+]/g, '')}` : "tel:+905555555555"} className={styles.link}>
                  {globalSettings?.contactPhone || "+90 (555) 555 55 55"}
                </a>
              </li>
              <li className={styles.contactItem}>
                <Mail size={18} className={styles.contactIcon} />
                <a href={globalSettings?.contactEmail ? `mailto:${globalSettings.contactEmail}` : "mailto:info@turkceoabtdeyiz.com"} className={styles.link}>
                  {globalSettings?.contactEmail || "info@turkceoabtdeyiz.com"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className={styles.bottomBar}>
          <p>{globalSettings?.copyrightText || `© ${currentYear} Türkçe ÖABTdeyiz. Tüm Hakları Saklıdır.`}</p>
          <div className={styles.bottomLinks}>
            <button onClick={() => setIsContractModalOpen(true)} className={styles.bottomLinkBtn}>
              Mesafeli Satış Sözleşmesi
            </button>
            <button onClick={() => setIsPrivacyModalOpen(true)} className={styles.bottomLinkBtn}>
              Gizlilik Politikası
            </button>
            <button onClick={() => setIsKvkkModalOpen(true)} className={styles.bottomLinkBtn}>
              KVKK Aydınlatma Metni
            </button>
          </div>
        </div>
      </div>

      {/* Contract Modal */}
      {isContractModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsContractModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Mesafeli Satış Sözleşmesi</h2>
              <button className={styles.modalClose} onClick={() => setIsContractModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <h3>KULLANICI SÖZLEŞMESİ, KULLANIM KOŞULLARI ve İADE KOŞULLARI</h3>
              <ul>
                <li><strong>Taraflar:</strong> İşbu Türkçe Öabtdeyiz Online Kullanıcı Sözleşmesi ve Kullanım Koşulları (kısaca “Sözleşme”) www.turkceoabtdeyiz.com uzantılı web sitesinin, aplikasyonunun ve buna bağlı tüm uygulamaların (kısaca “Site”) tüm haklarının sahibi olan Türkçe Öabtdeyiz ile kimlik ve iletişim bilgilerini işbu Sözleşme’nin kabulü öncesinde sisteme tanımlamış olan veya tanımlamamış olsa dahi Site’den hizmet satın alan Kullanıcı arasındadır.</li>
                <li><strong>Sözleşme’nin Konusu:</strong> İşbu Sözleşme’nin konusu Türkçe Öabtdeyiz’nın sahibi olduğu platform üzerinden hizmet satın alma imkanının sağlanması ve tarafların karşılıklı hak ve yükümlülüklerinin belirlenmesidir. Kullanıcının, Site’den alışveriş yapması halinde, işbu Sözleşme’nin tamamını okuduğunu, anladığını ve tüm hükümlerini onayladığını kabul, beyan ve taahhüt eder.</li>
              </ul>
              
              <h3>Türkçe Öabtdeyiz’in Hakları</h3>
              <ul>
                <li>Türkçe Öabtdeyiz güvenlik nedeniyle Müşteri’nin Site üzerindeki her türlü aktivitesini izleyebilir, kayda alabilir ve/veya gerekli gördüğünde, Kullanıcı dondurma, Kullanıcı iptal etme ve benzeri her türlü müdahalede bulunabilir.</li>
                <li>Türkçe Öabtdeyiz önceden Kullanıcı’ya bildirimde bulunmaksızın Site'nin biçim ve içeriğini kısmen ve/veya tamamen değiştirebileceği gibi, Site'nin yayın yaptığı alan adını değiştirebilir, farklı alt alan adları kullanabilir, alan adı yönlendirmesi yapabilir ve/veya alan adını kapatabilir.</li>
                <li>Türkçe Öabtdeyiz Sözleşme’de belirtilen iş ve/veya işlemlerin daha etkin gerçekleştirilebilmesi açısından dilediği zaman hizmet, satış şartları ve/veya işleyişte değişiklikler ve/veya güncellemeler yapabilir. Kullanıcılar işbu değişiklikleri kabul ettiklerini, bu değişikliklere uygun davranacaklarını şimdiden kabul ve beyan ederler.</li>
                <li>Türkçe Öabtdeyiz 6698 sayılı Kanun hükümleri uyarınca aydınlatma yükümlülüğü ve gerekmesi halinde rıza alma yükümlüklerini yerine getirmek ve sair güvenlik önlemlerine uymak şartıyla kullanıcı profili ve pazar araştırmaları yapmak, satış ve site kullanım istatistikleri oluşturmak gibi amaçlar dahil ancak bunlarla sınırlı olmamak üzere tüm yasal amaçlar için, Kullanıcı'nın kimlik, adres, iletişim ve site kullanım bilgilerini bir veri tabanında toplayabilir ve bu bilgileri işleyebilir. Ayrıca Türkçe Öabtdeyiz bu bilgileri, yasaların getirdiği zorunluluklara uyma amacıyla veya yetkili adli veya idari otoritenin yürüttüğü soruşturma veya araştırma açısından talep edilmesi durumunda veya kullanıcıların hak ve güvenliklerinin korunması amacıyla üçüncü kişi/kurumlarla paylaşabilir.</li>
                <li>Türkçe Öabtdeyiz sisteminde satışa sunulan ürünlerin ve hizmetlerin fiyat ve ürün özellik bilgilerini değiştirme yükümlülüğü Türkçe Öabtdeyiz ‘ya aittir.</li>
                <li>Türkçe Öabtdeyiz, ileride doğacak teknik zaruretler ve mevzuata uyum amacıyla kullanıcıların aleyhine olmamak kaydıyla işbu Sözleşme’nin uygulamasında değişiklikler yapabilir, mevcut maddelerini değiştirebilir veya yeni maddeler ilave edebilir.</li>
                <li>Kullanıcı tarafından veya sadece referans kolaylığı nedeniyle Türkçe Öabtdeyiz tarafından link verilmiş ise bu Türkçe Öabtdeyiz’nın verilen linklerin yöneldiği internet sitelerini desteklemek amacıyla verilmiş olduğu anlamında yorumlanamaz veya Türkçe Öabtdeyiz tarafından söz konusu internet sitesi veya içeriğine yönelik herhangi bir beyan veya garanti verildiği şeklinde kabul edilemez. Bu şekilde erişilen siteler, dosyalar ve içerikler ile ilgili Türkçe Öabtdeyiz hiçbir sorumluluk kabul etmez.</li>
              </ul>

              <h3>Müşteri’nin Yükümlülükleri</h3>
              <ul>
                <li>Kullanıcı hizmet almak olmak isterse, Site’de belirtilen satın alma prosedürünü yerine getirerek satın alma işlemini yapması ile tamamlanır. Kullanıcı, hizmeti satın almakla birlikte, işbu Sözleşme hükümlerini, üyeliğe ve hizmetlere ilişkin Türkçe Öabtdeyiz tarafından açıklanan/açıklanacak her türlü beyanı da kabul etmiş olmaktadır.</li>
                <li>Kullanıcı, işlemlerinde belirtmiş olduğu kimlik, ödeme bilgileri, adres ve/veya iletişim bilgilerinin eksiksiz ve doğru olduğunu, bilgilerinde değişiklik olması halinde bu bilgileri derhal yazılı olarak Türkçe Öabtdeyiz’ya ileteceğini, eksik, güncel olmayan ve/veya yanlış bilgi vermesi nedeniyle ortaya çıkabilecek her türlü hukuki uyuşmazlık ve/veya zarardan sadece kendisinin sorumlu olacağını kabul ve beyan eder. Türkçe Öabtdeyiz ’ya bu nedenle hiçbir sorumluluk izafe edilemez.</li>
                <li>Kullanıcı, Site’de belirtilen hizmetlerden faydalanırken T.C. yasalarına ve genel ahlak kurallarına uygun hareket edeceğini, hakaret, tehdit, iftira, taciz ve benzeri eylemlerde bulunmayacağını, siyasi ve/veya ideolojik propaganda yapmayacağını, diğer Müşteri'leri rahatsız edici davranışlar içine girmeyeceğini, kişi ve/veya kurumları lekeleyici her türlü davranıştan uzak duracağını ve Site'de verilen hizmetlerin aksamasına ya da kesilmesine neden olabilecek her türlü hareketten kaçınacağını, aksi halde oluşacak her türlü zarardan bizzat sorumlu olacağını kabul ve taahhüt eder.</li>
                <li>Kullanıcı, üçüncü şahısların fikri mülkiyet hukuku kapsamındaki haklarını ihlal etmeyeceğini, üçüncü kişilerin telif haklarına saygılı olacağını, haksız rekabette bulunmayacağını ve üçüncü şahısların ticari sırlarına ve özel hayatlarına saygılı olacağını kabul ve taahhüt eder.</li>
                <li>Kullanıcı, Site'yi kullanırken, kullanıcı adı, şifre ve benzeri bilgilerini başkalarıyla paylaşmayacağını ve bu güvenliğinden bizzat ve sadece kendisinin sorumlu olacağını, hiçbir şekilde Türkçe Öabtdeyiz’nın sorumlu olmayacağını kabul ve beyan eder.</li>
                <li>Kullanıcı, hileli davranışlarda bulunmayacağını, Site'nin güvenlik mekanizmasına müdahale etmeyeceğini aksi halde oluşabilecek her türlü zarardan sorumlu olduğunu ve Türkçe Öabtdeyiz’nın uğrayacağı tüm zararları karşılayacağını taahhüt eder.</li>
                <li>Kullanıcı’nın, bilgisayar donanımını etkileyen virüs saldırılarından ve/veya Site’den edindiği bilgiler sebebiyle veya Site’ye erişimine ve kullanımına ilişkin olarak doğrudan veya dolaylı olarak meydana gelebilecek zararlardan Türkçe Öabtdeyiz sorumlu değildir.</li>
              </ul>

              <h3>İPTAL İADE KOŞULLARI</h3>
              <p><strong>Hizmet İade Koşulları</strong></p>
              <p>6502 sayılı Kanun ve 29188 sayılı Resmî Gazete’de yayımlanarak yürürlüğe giren Mesafeli Sözleşmeler Yönetmeliği md. 15 kapsamında “Elektronik ortamda anında ifa edilen hizmetler veya tükeciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmeler”den olup, üyelik hesabının açıldığına dair bilgilendirme mesajının HİZMET ALAN’a gönderimi ile HİZMET ALAN’ın cayma hakkı ortadan kalkmış olmaktadır. HİZMET ALAN, kendisine gönderilen mesajı almadığını, mesajı açmadığını, hesabı kullanmadığını v.b. iddia etmek sureyle cayma beyanında bulunsa dahi, bilgilendirme metnini ihtiva eden mesajın SATICI’dan çıkmış olması sebebiyle sözleşme konusu ürün, HİZMET ALAN’a teslim edilmiş sayılır.</p>
              
              <ol style={{ marginLeft: "20px", marginBottom: "16px", color: "#475569" }}>
                <li style={{ marginBottom: "8px" }}>Türkiye Cumhuriyeti Ticaret Bakanlığı'nca yayımlanan Mesafeli Sözleşme gereğince "Uzaktan eğitim gibi elektronik ortamda anında ifa edilen hizmetlerde" cayma hakkı kullanılmamaktadır. BKNZ: (Tüketicinin Korunması ve Piyasa Gözetimi Genel Müdürlüğü | T.C. Ticaret Bakanlığı)</li>
                <li style={{ marginBottom: "8px" }}>Satın aldığınız canlı/online ders yahut video ders paketlerinde satın alma gerçekleştiği andan itibaren 24 saat içerisinde turkceoabtdeyiz@gmail.com adresine dilekçeyle başvuruda bulunmanız durumunda %10 oranında cayma bedeli uygulanarak iptal- iade/cayma gerçekleştirilir. İade hakkının kullanılması durumunda -varsa- alıcıya gönderilen hediye kitabın ücreti ayrıca tahsis edilir.</li>
                <li style={{ marginBottom: "8px" }}>Kamp, soru çözümü ve deneme paketlerinde iade süreci bulunmamaktadır.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* KVKK Modal */}
      {isKvkkModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsKvkkModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>KVKK Aydınlatma Metni</h2>
              <button className={styles.modalClose} onClick={() => setIsKvkkModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <h3>TÜRKÇE ÖABTDEYİZ – KİŞİSEL VERİLERİN KORUNMASI VE İŞLENMESİNE İLİŞKİN AYDINLATMA METNİ</h3>
              <p>İşbu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) ve ilgili mevzuat uyarınca, TÜRKÇE ÖABTDEYİZ (“Kurum”) olarak veri sorumlusu sıfatıyla, uzaktan eğitim platformumuzu kullanan kursiyerlerin, üyelerin, velilerin ve ziyaretçilerin (“İlgili Kişi”) kişisel verilerinin işlenme süreçleri hakkında bilgilendirilmesi amacıyla hazırlanmıştır.</p>
              
              <h3>1. Veri Sorumlusunun Kimliği</h3>
              <p>KVKK uyarınca kişisel verileriniz; veri sorumlusu sıfatıyla TÜRKÇE ÖABTDEYİZ tarafından aşağıda açıklanan kapsamda işlenebilecektir.</p>
              
              <h3>2. Toplanan Kişisel Verileriniz</h3>
              <p>Kurumumuz tarafından sunulan uzaktan eğitim, canlı ders, deneme sınavı, rehberlik ve üyelik hizmetleri kapsamında işlenen kişisel verileriniz şunlardır:</p>
              <ul>
                <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, T.C. kimlik numarası (fatura ve yasal zorunluluk hallerinde).</li>
                <li><strong>İletişim Bilgileri:</strong> E-posta adresi, cep telefonu numarası, ikametgah/posta adresi.</li>
                <li><strong>Müşteri İşlem / Eğitim Verileri:</strong> Satın alınan eğitim paketleri, ders katılım oranları, deneme sınavı sonuçları, performans analiz raporları, platform içi kullanım logları ve tercihler.</li>
                <li><strong>Finansal Bilgiler:</strong> Fatura bilgileri, ödeme türü (Kredi kartı/banka kartı detayları doğrudan güvenli ödeme kuruluşları aracılığıyla işlenmekte olup, Kurumumuz tarafından sistemde saklanmamaktadır).</li>
                <li><strong>Görsel ve İşitsel Kayıtlar:</strong> Canlı dersler sırasında platform üzerinden paylaşılan sesli veya görüntülü katılım verileri, destek hattı görüşme kayıtları.</li>
                <li><strong>İşlem Güvenliği Bilgileri:</strong> IP adresi bilgileri, site içi internet erişim logları, kullanıcı adı ve şifre bilgileri.</li>
              </ul>

              <h3>3. Kişisel Verilerin İşlenme Amaçları</h3>
              <p>Toplanan kişisel verileriniz, KVKK’nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları ve kuralları dahilinde, Kurumumuz lehine ve operasyonel güvenliğin sağlanması amacıyla şu amaçlarla işlenmektedir:</p>
              <ul>
                <li>Uzaktan eğitim hizmetlerinin kesintisiz, güvenli ve eksiksiz bir şekilde sunulması, kullanıcı hesaplarının oluşturulması ve yetkilendirilmesi.</li>
                <li>Satın alınan ürün ve hizmetlerin faturalandırılması, muhasebe kayıtlarının tutulması ve tahsilat işlemlerinin gerçekleştirilmesi.</li>
                <li>Kursiyerlerin başarı durumlarının takip edilmesi, deneme sınavı sonuçlarının raporlanması, kişiye özel rehberlik ve eğitim koçluğu hizmetlerinin sağlanması.</li>
                <li>Platform altyapısının güvenliğinin sağlanması, siber saldırıların önlenmesi, sistem performansının optimize edilmesi ve teknik hataların giderilmesi.</li>
                <li>Fikri mülkiyet haklarının (5846 sayılı Fikir ve Sanat Eserleri Kanunu kapsamındaki ders içerikleri, video ve materyallerin) korunması, korsan kullanımın ve yetkisiz paylaşımın önlenmesi.</li>
                <li>Kurumumuz tarafından sunulan yeni eğitim kampanyaları, indirimler, güncel ÖABT içerikleri ve duyuruların tarafınıza iletilmesi (ilgili pazarlama onayları çerçevesinde).</li>
                <li>Yetkili kurum ve kuruluşlara mevzuattan kaynaklı bilgi verme yükümlülüklerinin yerine getirilmesi.</li>
              </ul>

              <h3>4. Kişisel Verilerin Aktarıldığı Taraflar ve Aktarım Amaçları</h3>
              <p>Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda, kanuni yükümlülükler ve Kurumun ticari/hukuki güvenliği çerçevesinde şu taraflarla paylaşılabilir:</p>
              <ul>
                <li>Hizmet aldığımız veya iş birliği yaptığımız güvenli altyapı, sunucu (hosting), SMS/e-posta gönderim sağlayıcıları ve ödeme kuruluşlarına (yalnızca hizmetin gerektirdiği ölçüde ve gizlilik sözleşmeleri kapsamında).</li>
                <li>Hukuki uyuşmazlıkların giderilmesi, talep veya denetimler kapsamında yetkili adli ve idari kamu kurumlarına.</li>
                <li>Kurumun fikri mülkiyet haklarını korumak ve hukuki süreçleri yürütmek amacıyla avukatlar, mali müşavirler ve denetçilere.</li>
              </ul>

              <h3>5. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h3>
              <p>Kişisel verileriniz; web sitemiz, mobil uygulamamız, çağrı merkezimiz, canlı ders oturumları, üyelik formları ve çerezler (cookies) aracılığıyla elektronik ortamda otomatik olan veya olmayan yöntemlerle toplanmaktadır. Bu veriler, KVKK m. 5/2 hükmü uyarınca "Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması", "Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması" ve "Bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması" hukuki sebeplerine dayanarak işlenmektedir.</p>

              <h3>6. İlgili Kişinin (Kullanıcının) KVKK Kapsamındaki Hakları</h3>
              <p>KVKK’nın 11. maddesi uyarınca, Kurumumuza başvurarak aşağıdaki haklarınızı kullanabilirsiniz:</p>
              <ul>
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
                <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme,</li>
                <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
                <li>KVKK mevzuatında öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme,</li>
                <li>Aktarıldığı üçüncü kişilere yukarıdaki işlemlerin bildirilmesini isteme,</li>
                <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
                <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde giderilmesini talep etme.</li>
              </ul>

              <h3>7. Başvuru Yöntemi</h3>
              <p>Yukarıda belirtilen haklarınızı kullanmak ve taleplerinizi iletmek hususunda, KVKK gereğince yazılı olarak veya kayıtlı elektronik posta (KEP) adresi, güvenli elektronik imza, mobil imza ya da daha önce sistemimizde bildirilen ve sistemimizde kayıtlı bulunan e-posta adresinizi kullanmak suretiyle TÜRKÇE ÖABTDEYİZ resmi iletişim kanalları üzerinden kurumumuza başvurabilirsiniz. Başvurularınız yasal süreler içerisinde (en geç 30 gün içinde) sonuçlandırılacaktır.</p>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {isPrivacyModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsPrivacyModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Gizlilik Politikası</h2>
              <button className={styles.modalClose} onClick={() => setIsPrivacyModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <h3>TÜRKÇE ÖABTDEYİZ – GİZLİLİK POLİTİKASI</h3>
              
              <h3>1. Taraflar ve Kapsam</h3>
              <p>İşbu Gizlilik Politikası, TÜRKÇE ÖABTDEYİZ uzaktan eğitim platformu ("Kurum") tarafından sunulan tüm çevrim içi eğitim, canlı ders, video içerik, doküman, sınav ve rehberlik hizmetlerinden yararlanan üyeleri, kursiyerleri ve web sitesi/uygulama ziyaretçilerini ("Kullanıcı") kapsar. Kurum, kullanıcıların kişisel verilerinin korunmasına ve gizliliğine üst düzeyde önem verir.</p>
              
              <h3>2. Toplanan Kişisel Veriler</h3>
              <p>Kurumumuz, sunulan eğitim hizmetlerinin eksiksiz yerine getirilmesi, sistem güvenliğinin sağlanması ve yasal yükümlülüklerin yerine getirilmesi amacıyla şu verileri toplayabilir:</p>
              <ul>
                <li>Ad, soyad, T.C. kimlik numarası (gerekli olduğu durumlarda fatura ve resmi kayıtlar için), iletişim bilgileri (telefon numarası, e-posta adresi).</li>
                <li>Ödeme ve finansal işlem bilgileri (kredi kartı bilgileri doğrudan anlaşmalı güvenli ödeme kuruluşları aracılığıyla işlenir; Kurum, kart bilgilerini sisteminde saklamaz).</li>
                <li>Platform içi kullanım verileri, ders katılım raporları, deneme sınavı sonuçları, IP adresleri ve çerez (cookie) kayıtları.</li>
              </ul>

              <h3>3. Verilerin Kullanım Amaçları</h3>
              <p>Toplanan kişisel veriler, tamamen yasal sınırlar içerisinde ve Kurum’un ticari ve operasyonel çıkarları doğrultusunda şu amaçlarla işlenir:</p>
              <ul>
                <li>Kullanıcı hesabı oluşturulması, platforma erişimin yetkilendirilmesi ve eğitim hizmetlerinin kesintisiz sunulması.</li>
                <li>Satın alınan ürün ve hizmetlerin faturalandırılması, tahsilat işlemlerinin gerçekleştirilmesi.</li>
                <li>Kurum içi kalite standartlarının artırılması, sistem performansının optimize edilmesi ve teknik sorunların giderilmesi.</li>
                <li>Kullanıcılara ait deneme sınavı analizlerinin yapılması, başarı durumlarının raporlanması ve kişiselleştirilmiş rehberlik hizmeti sunulması.</li>
                <li>Kurum tarafından sunulan yeni eğitim paketleri, kampanyalar, indirimler ve duyuruların kullanıcılara iletilmesi (Pazarlama ve bilgilendirme izni kapsamında).</li>
              </ul>

              <h3>4. Fikri Mülkiyet ve İçerik Gizliliği</h3>
              <ul>
                <li>TÜRKÇE ÖABTDEYİZ platformunda yer alan tüm ders videoları, soru bankaları, deneme sınavları, PDF dokümanları, ses dosyaları, grafikler ve yazılımlar 5846 sayılı Fikir ve Sanat Eserleri Kanunu ve ilgili mevzuat gereğince tamamen Kurumun mülkiyetindedir.</li>
                <li>Kullanıcı, platformda kendisine sunulan içerikleri yalnızca bireysel öğrenim amacıyla kullanmayı kabul eder. İçeriklerin kopyalanması, çoğaltılması, indirilmesi (izin verilenler hariç), ekran kaydı alınması, üçüncü kişilerle paylaşılması veya herhangi bir mecrada (sosyal medya, internet siteleri vb.) yayınlanması kesinlikle yasaktır.</li>
                <li>Bu kuralın ihlal edildiğinin tespiti durumunda, Kurum kullanıcının hesabını önceden haber vermeksizin ve ücret iadesi yapmaksızın kalıcı olarak kapatma, hukuki yollara başvurma ve uğradığı maddi/manevi zararların tazminini talep etme hakkını saklı tutar.</li>
              </ul>

              <h3>5. Hesap Güvenliği ve Kullanıcı Sorumluluğu</h3>
              <ul>
                <li>Kullanıcı, sisteme kaydolurken belirlediği kullanıcı adı ve şifrenin güvenliğinden bizzat sorumludur. Bu bilgilerin üçüncü kişilerle paylaşılması, devredilmesi veya ortak kullanılması yasaktır.</li>
                <li>Hesap bilgilerinin paylaşılmasından kaynaklanan her türlü güvenlik ihlali, veri sızıntısı veya yetkisiz erişimde sorumluluk tamamen kullanıcıya aittir. Kurum, bu tür kullanımlardan doğacak zararlardan sorumlu tutulamaz.</li>
              </ul>

              <h3>6. Üçüncü Taraflarla Veri Paylaşımı</h3>
              <p>Kullanıcıya ait kişisel veriler, kanuni zorunluluklar haricinde ve kullanıcının açık rızası olmaksızın üçüncü şahıslarla ticari amaçla paylaşılmaz. Ancak şu istisnai durumlarda veriler paylaşılabilir:</p>
              <ul>
                <li>Adli ve idari makamlardan usulüne uygun olarak gelen bilgi ve belge talepleri doğrultusunda.</li>
                <li>Ödeme altyapısı, sunucu barındırma (hosting), SMS ve e-posta gönderim sağlayıcıları gibi hizmet alınan güvenli iş ortaklarına, yalnızca hizmetin gerektirdiği ölçüde.</li>
              </ul>

              <h3>7. Çerez (Cookie) Politikası</h3>
              <p>Platform, kullanıcı deneyimini iyileştirmek, site trafiğini analiz etmek ve oturum güvenliğini sağlamak amacıyla çerezler kullanır. Kullanıcı, tarayıcı ayarları üzerinden çerezleri reddetme hakkına sahiptir; ancak çerezlerin reddedilmesi durumunda platformun bazı özelliklerinin düzgün çalışmayabileceğini kabul eder.</p>

              <h3>8. Gizlilik Politikasında Değişiklikler</h3>
              <p>TÜRKÇE ÖABTDEYİZ, işbu Gizlilik Politikası hükümlerini dilediği zaman tek taraflı olarak güncelleme veya değiştirme hakkını saklı tutar. Yapılan değişiklikler platformda yayınlandığı tarihten itibaren geçerlilik kazanır. Kullanıcı, hizmetlerden yararlanmaya devam etmekle güncel politikayı kabul etmiş sayılır.</p>

              <h3>9. Yürürlük ve Yetki</h3>
              <p>İşbu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili Türk mevzuatına uygun olarak hazırlanmıştır. Politikanın uygulanmasından doğabilecek her türlü ihtilafta, Kurum merkezinin bulunduğu yer mahkemeleri ve icra daireleri yetkilidir.</p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
