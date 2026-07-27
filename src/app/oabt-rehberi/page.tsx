import { BookOpen, Calendar, Award, CheckSquare, BarChart2 } from "lucide-react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "../Home.module.css";

export default function OabtGuidancePage() {
  const examStructure = [
    { section: "Dil Bilgisi ve Fonetik", count: "16 Soru", weight: "%20", desc: "Ses bilgisi, şekil bilgisi, cümle bilgisi ve kelime grupları." },
    { section: "Okuma ve Yazma Eğitimi (Anlam)", count: "12 Soru", weight: "%15", desc: "Okuma teknikleri, yazma türleri, kelime hazinesi ve anlam bilgisi." },
    { section: "Türk Edebiyatı (Halk, Divan, Yeni)", count: "22 Soru", weight: "%27.5", desc: "Dönem özellikleri, yazar-eser eşleştirmeleri, edebi akımlar ve şiir tahlilleri." },
    { section: "Dil Bilimi ve Çocuk Edebiyatı", count: "10 Soru", weight: "%12.5", desc: "Dil bilimi kuramları, dünya dilleri ve çocuk edebiyatı eserleri/tarihçesi." },
    { section: "Alan Eğitimi (Metotlar)", count: "15 Soru", weight: "%25", desc: "Türkçe öğretim programı, öğrenme alanları, ölçme-değerlendirme yöntemleri." }
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
                <span>ÖABT Türkçe Soru Dağılımı (75 Soru)</span>
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
                    <h4 style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-primary)", marginBottom: "4px" }}>Alan Eğitimini Hafife Almayın</h4>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                      Sınavın %25&apos;ini oluşturan 15 soruluk Alan Eğitimi kısmı, genellikle en belirleyici bölümdür. Öğretim programı kazanımlarına ve öğrenme alanları metotlarına eksiksiz hakim olmalısınız.
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
                    <h4 style={{ fontSize: "15px", fontWeight: 600, color: "var(--color-primary)", marginBottom: "4px" }}>Düzenli Şiir Tahlili Yapın</h4>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                      Divan ve Eski Türk edebiyatı sorularında aruz vezni, edebi sanatlar ve beyit şerhleri önemli yer tutar. Her gün en az 3-4 beyti tahlil etmek kelime dağarcığınızı ve şerh kabiliyetinizi canlı tutar.
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
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
