import { BookOpen, Calendar, Award, CheckSquare, BarChart2 } from "lucide-react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "../Home.module.css";

export default function OabtGuidancePage() {
  const examStructure = [
    { section: "Anlama ve Anlatma Teknikleri", count: "16 Soru", weight: "%32", desc: "Dinleme, konuşma, okuma ve yazma eğitimi" },
    { section: "Dil Bilgisi ve Dil Bilimi", count: "12 Soru", weight: "%24", desc: "Ses bilgisi, şekil bilgisi, cümle bilgisi, kelime grupları ve dil bilim" },
    { section: "Çocuk Edebiyatı", count: "3 Soru", weight: "%6", desc: "Çocuk edebiyatı eserleri/tarihçesi" },
    { section: "Türk Halk Edebiyatı", count: "5 Soru", weight: "%10", desc: "Anonim, Aşık ve Tasavvuf Türk edebiyatı özellikleri" },
    { section: "Eski Türk Edebiyatı", count: "5 Soru", weight: "%10", desc: "Beyit şerhleri, söz sanatları, yazar-eser eşleştirmeleri" },
    { section: "Yeni Türk Edebiyatı", count: "5 Soru", weight: "%10", desc: "Dönem özellikleri, yazar-eser eşleştirmeleri" },
    { section: "Edebiyat Bilgi ve Kuramları", count: "4 Soru", weight: "%8", desc: "Edebi akımlar/kuramlar, dünya edebiyatı ve şiir tahlilleri" }
  ];

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.section}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>ÖABT Rehberlik Köşesi</h1>
              <p className={styles.sectionDesc}>
                Türkçe Öğretmenliği Alan Sınavı (ÖABT) formatı, konu ağırlıkları ve sınav kazandıran ders çalışma stratejileri rehberiniz.
              </p>
            </div>

            {/* Sınav Yapısı */}
            <div className={styles.courseCard} style={{ padding: "32px", marginBottom: "40px" }}>
              <h2 style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--color-primary)",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <BarChart2 size={20} style={{ color: "var(--color-accent)" }} />
                <span>ÖABT Türkçe Soru Dağılımı (50 Soru)</span>
              </h2>

              <div style={{ overflowX: "auto" }}>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                  textAlign: "left"
                }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border-color)", color: "var(--color-primary)" }}>
                      <th style={{ padding: "12px 8px", fontWeight: 700 }}>Konu Alanı</th>
                      <th style={{ padding: "12px 8px", fontWeight: 700 }}>Soru Sayısı</th>
                      <th style={{ padding: "12px 8px", fontWeight: 700 }}>Ağırlık</th>
                      <th style={{ padding: "12px 8px", fontWeight: 700 }}>Kapsam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examStructure.map((item, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                        <td style={{ padding: "12px 8px", fontWeight: 600, color: "var(--color-primary)" }}>{item.section}</td>
                        <td style={{ padding: "12px 8px" }}>{item.count}</td>
                        <td style={{ padding: "12px 8px", color: "var(--color-accent)", fontWeight: 600 }}>{item.weight}</td>
                        <td style={{ padding: "12px 8px", fontSize: "13px" }}>{item.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Çalışma Taktikleri */}
            <div className={styles.courseCard} style={{ padding: "32px", gap: "20px", display: "flex", flexDirection: "column" }}>
              <h2 style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <Award size={20} style={{ color: "var(--color-accent)" }} />
                <span>Sınav Kazandıran 4 Altın Kural</span>
              </h2>

              <ul style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "20px"
              }}>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-accent)",
                    fontWeight: 700,
                    fontSize: "12px",
                    flexShrink: 0
                  }}>1</div>
                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-primary)", marginBottom: "4px" }}>Canlı Dersleri ve Tekrar Videolarını Sınırsız Avantaja Çevirin</h4>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                      Uzaktan eğitimin en büyük gücü esnekliktir. Kaçırdığınız ya da zorlandığınız konuları dilediğiniz kadar tekrar izleyebilme imkanınızı en verimli şekilde kullanın. Kurumumuzun akıllı asistan sistemi ve sınırsız video tekrar paketiyle eksik olduğunuz konuları pekiştirerek kalıcı öğrenme sağlayın.
                    </p>
                  </div>
                </li>

                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-accent)",
                    fontWeight: 700,
                    fontSize: "12px",
                    flexShrink: 0
                  }}>2</div>
                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-primary)", marginBottom: "4px" }}>Alanın En Büyüğü Olan Yayınevimizin Basılı Kitaplarıyla Sağlam Adımlar Atın</h4>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                      Sadece dijitalde değil, basılı yayıncılıkta da alanın zirvesindeyiz. Yılların tecrübesiyle hazırladığımız ve ÖABT Türkçe&apos;nin referans kitabı kabul edilen güçlü yayın portföyümüzdeki soru bankaları ve konu anlatımlı eserlerimizle çalışın. Çözemediğiniz veya yanlış yaptığınız her soruyu kesip bir deftere yapıştırarak, yayınevimizin uzman hocalarının kaleme aldığı detaylı çözümleriyle birlikte sınav gününe kadar en büyük yardımcınız olacak kusursuz bir &apos;Hata Defteri&apos; oluşturun.
                    </p>
                  </div>
                </li>

                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-accent)",
                    fontWeight: 700,
                    fontSize: "12px",
                    flexShrink: 0
                  }}>3</div>
                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-primary)", marginBottom: "4px" }}>Hatalarınızı Analiz Edin</h4>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                      Çözdüğünüz denemelerde yanlış yaptığınız her soruyu kesip bir deftere yapıştırın ve doğru çözümünü altına yazın. Sınava son bir ay kala en büyük yardımcınız bu &apos;Hata Defteri&apos; olacaktır.
                    </p>
                  </div>
                </li>

                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-accent)",
                    fontWeight: 700,
                    fontSize: "12px",
                    flexShrink: 0
                  }}>4</div>
                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-primary)", marginBottom: "4px" }}>Türkiye Geneli Deneme Kamplarıyla Sınav Provası Yapın</h4>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                      Gerçek sınav atmosferini yakalamak, zaman yönetimi ve stres kontrolü için hayatidir. Kurumumuz tarafından düzenlenen Türkiye Geneli ÖABT Türkçe Deneme Sınavları ve detaylı karne analizleri ile eksiklerinizi zamanında fark edin, sınav günü karşınıza çıkabilecek tüm sürprizlere bizimle hazırlanın.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
