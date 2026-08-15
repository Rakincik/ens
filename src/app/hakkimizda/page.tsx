"use client";

import Link from "next/link";
import { ClipboardList, BookOpen, Laptop, MessageCircle } from "lucide-react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "./hakkimizda.module.css";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Sevgili Öğretmenim, Biz Kimiz?</h1>
          <p className={styles.heroSubtitle}>Türkiye'nin Kendi Alanında En Büyük Uzaktan Eğitim ve Yayıncılık Platformu</p>
        </section>

        <div className={styles.container}>
          {/* Neden Biz Section */}
          <section className={styles.whySection}>
            <div className={styles.whyContent}>
              <h2>Neden Türkçe ÖABTDEYİZ?</h2>
              <p>Her sene binlerce Türkçe öğretmenimizi platformumuzda ağırlamaktan gurur duyuyoruz. Misyonumuz; öğretmenlerimizin kendilerini geliştirmesi, akademik ve doğru bilgiye ekonomik bir süreçle ulaşmasını sağlamaktır.</p>
              <p>Her ders özelinde oluşturduğumuz içerikler yüzlerce makale, tez ve kitabın harmanlanmasından oluşmaktadır. Her sene <strong>50 binden fazla kitabı</strong> Türkçe öğretmenleriyle buluşturan ve alanında açık ara Türkiye'nin en çok tercih edilen yayınevi olarak, hazırlık sürecinizin hiçbir aşamasında eksiğinizi bırakmıyoruz.</p>
            </div>
            <div className={styles.whyImageWrapper}>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
                alt="Neden Türkçe ÖABTdeyiz" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>
          </section>

          {/* Özellikler Grid */}
          <section className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <ClipboardList size={32} />
              </div>
              <h3 className={styles.featureTitle}>Ara Değerlendirme Sistemi</h3>
              <p className={styles.featureDesc}>Sene boyunca işlediğimiz her üniteden sonra soru çözümleri gerçekleştirerek konuları somutlaştırıyoruz. Öğrenme eksikliklerini belirlemeye ve alanınızda uzmanlaşmanıza odaklanıyoruz.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <BookOpen size={32} />
              </div>
              <h3 className={styles.featureTitle}>Kesintisiz Yayın Desteği</h3>
              <p className={styles.featureDesc}>Başka bir konu anlatımına ihtiyaç duymamanız için, sene başında seçtiğiniz bir eseri evinize ücretsiz gönderiyoruz. Ayrıca tüm ders fasiküllerimizi PDF olarak sistemimizden indirebilirsiniz.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Laptop size={32} />
              </div>
              <h3 className={styles.featureTitle}>Türkiye Geneli Online Denemeler</h3>
              <p className={styles.featureDesc}>Tamamı video çözümlü 10 yeni nesil Türkiye Geneli online deneme ile sizi destekliyoruz. Kurum dışı katılımlarla birlikte binlerce aday arasındaki mevcut sıralamanızı görebilirsiniz.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <MessageCircle size={32} />
              </div>
              <h3 className={styles.featureTitle}>Düzenli Rehberlik</h3>
              <p className={styles.featureDesc}>Sınav sürecinin her anında yanınızda olmak önceliğimizdir. Her ay yaptığımız rehberlik çalışmalarıyla gerekli bilişsel ve duyuşsal desteği sağlayarak sizi başarıya taşıyoruz.</p>
            </div>
          </section>

          {/* İndirim Banner */}
          <section className={styles.discountBanner}>
            <div className={styles.discountPercent}>%</div>
            <div className={styles.discountContent}>
              <h3>Erken İndirim Fırsatını Kaçırmayın!</h3>
              <p>
                Kurs fiyatlarımız 1 Eylül'e kadar <strong>%30 indirimli</strong> olarak satışa sunulmuştur.<br/>
                Ayrıca 5 kişilik bir grubun kurs paketlerimizden herhangi birine kaydolması halinde <span className={styles.discountHighlight}>ek %5 indirim</span> imkanı daha sağlıyoruz.
              </p>
            </div>
          </section>

          {/* Bize Katılın */}
          <section className={styles.joinSection}>
            <h2 className={styles.joinHashtag}>#BİRLİKTEÇOKDAHAGÜÇLÜ</h2>
            <p className={styles.joinDesc}>
              Gerekli bilişsel ve duyuşsal desteğin ardından arzulanan başarının geleceğine yürekten inanıyoruz.
            </p>
            <Link href="/egitimlerimiz" className={styles.joinBtn}>
              Bize Katılın
            </Link>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
