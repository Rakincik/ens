const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const htmlDescription = `
<h4>Eğitim Hakkında</h4>
<p>#2027AGS kapsamında Eğitimuzem kurumuyla iş birliğine gidilmiştir. Türkçe ÖABT dersleri kurumumuzdan AGS dersleriyse Eğitimuzem kurumundan verilmektedir.</p>
<p>Türkçe ÖABT canlı, AGS video ders paketidir. AGS kapsamında canlı ders satışı bulunmamaktadır.</p>
<p>Türkçe ÖABT uzaktan eğitim ders içerikleri diğer eğitim paketleri içerisinde detaylandırılarak anlatılmıştır.</p>

<h4 style="margin-top:24px;">AGS DERS PAKETİ İÇERİĞİ:</h4>
<p><strong>Zeynep SALMAN İÇLİ Koordinatörlüğünde Akademi Giriş Sınavı MEB AGS 2027</strong></p>
<p><strong>Açıklama:</strong> Eğitim Bilimleri ve Türk Milli Eğitim Sistemi, Mevzuat Bilgisi, Sözel Yetenek, Sayısal Yetenek, Tarih ve Türkiye Coğrafyası dersleri konu anlatım paketidir. Tüm dersler konu anlatımı ÖSYM formatına uygun şekilde eğitmenlerimiz tarafından verilmektedir her derste ünite sonlarında öğretmenlerimiz örnek sorularla konuları pekiştirip daha kalıcı öğrenmenizi sağlar.</p>
<p>Online derslerimizde Youtube ders videolarından farkı olarak her ünite sonunda ders esnasında konu pekiştirmek adına soru çözümleri yapılmaktadır. Ayrıca <strong>Whatsapp soru çözüm gruplarımız</strong> sayesinde yapamadığınız soruları öğretmenlerimize sorabiliyorsunuz.</p>

<h5 style="margin-top:24px;">Öğretmen Kadrosu</h5>
<ul style="list-style-type: disc; margin-left: 20px; line-height: 1.8;">
  <li><strong>Zeynep SALMAN İÇLİ:</strong> (Öğretim Yöntem ve Teknikleri - Sınıf Yönetimi - Eğitimin Temelleri - Türk Eğitim Sisteminin Genel Yapısı - Program Okuryazarlığı)</li>
  <li><strong>Bünyamin ATALAY - Bulut VURDUM:</strong> (Öğrenme Psikolojisi - Gelişim Psikolojisi)</li>
  <li><strong>Bulut VURDUM:</strong> (Rehberlik)</li>
  <li><strong>Bünyamin ATALAY:</strong> (Türkiye Yüzyılı Maarif Modeli - Türk Milli Eğitim Sistemi - Eğitim ve Öğretim Teknolojileri)</li>
  <li><strong>Emre Korcan DEMİR:</strong> (Eğitimde Ölçme ve Değerlendirme)</li>
  <li><strong>Aydın YÜCE:</strong> Tarih (100 Saat)</li>
  <li><strong>Alican DEMİR:</strong> Türkiye Coğrafyası (40 Saat)</li>
  <li><strong>Berk EKİCİ:</strong> Sözel Yetenek - Dil Bilgisi (42 Saat)</li>
  <li><strong>Dilek ÇAKAN:</strong> Sayısal Yetenek - Geometri (120 Saat)</li>
  <li><strong>Zeynep SALMAN İÇLİ - Emrah Vahap ÖZKARACA:</strong> Mevzuat Bilgisi (36 Saat) (Anayasa, 1739 sayılı Milli Eğitim Temel Kanunu, 222 sayılı İlköğretim ve Eğitim 7528 sayılı Öğretmenlik Meslek Kanunu)</li>
</ul>

<p style="margin-top:16px;"><strong>Programın Başlama Tarihi:</strong> EKİM 2026 - HAZİRAN 2027<br>
<strong>Toplam Ders Saati:</strong> 600 saat</p>

<div style="background-color: #fff3cd; color: #856404; padding: 12px; border-left: 4px solid #ffeeba; margin-top: 16px; border-radius: 4px;">
  <strong>UYARI:</strong> ÖSYM tarafından açıklanacak takvime göre, günlük ders saati ve haftalık ders günü sayısında artış yapabilir.
</div>

<ul style="list-style-type: disc; margin-left: 20px; margin-top: 24px; line-height: 1.8;">
  <li><strong>Temel Matematik Dersi:</strong> Derslerimiz başlamadan önce öğrencilerimiz için 12 ders saati temel matematik dersimiz yapılacaktır ve bu derslerimiz sonucunda sayısal ve sözel olmak üzere iki ayrı matematik sınıfımız olacaktır.</li>
  <li><strong>Eğitimcilere Soru Sorma:</strong> Canlı derslerin başlamasının ardından oluşturulan özel gruplar (WP) üzerinden eğitimcilerinize doğrudan soru sorabilirsiniz.</li>
  <li><strong>Genel Tekrar:</strong> Derslerin bitiminde düzenleyeceğimiz, aldığınız paket programının genel tekrarlarına ücretsiz katılım gösterebileceksiniz.</li>
  <li><strong>Online Deneme:</strong> Bu programa kayıt olan kursiyerlerimize ücretsiz 8 adet Türkiye Geneli Online deneme sınavı uygulanacaktır.</li>
  <li><strong>Derslerin Tekrar İzlenmesi:</strong> Canlı dersler işlendikten 30 Dakika içerisinde kayıt altına alınan dersleri, 2028 AGS tarihine kadar dilediğiniz kadar izleyebilirsiniz. Videolarda hızlandırma, ileri ve geri sarma özelliği bulunmaktadır.</li>
</ul>

<p style="margin-top:16px; font-style: italic;">Satın alınan her bir içerik 1 kullanıcıya özeldir. Bu konuda gerekli IP ve cihaz kayıtları düzenli olarak tutulmaktadır.</p>

<ul style="list-style-type: disc; margin-left: 20px; margin-top: 24px; line-height: 1.8;">
  <li><strong>Sınava Son 1 Ay Kala Yapacağımız Çalışmalar:</strong> Sınava son 1 ay kala Zeynep Salman İçli koordinatörlüğünde oluşturacağımız WP grubumuz ile ders çalışma, yönlendirme, motivasyon ve ödevlendirmeler yapılarak sınav hazırlık sürecinizi birlikte tamamlayacağız.</li>
  <li><strong>Bireysel Rehberlik Desteği:</strong> Kaygı Yönetimi, Motivasyon, Stresle Baş Etme ve AGS sürecine hazırlıkla ilgili tercih ettiğiniz zamanlarda ücretsiz bireysel olarak rehberlik desteği hizmeti verilecektir.</li>
  <li><strong>Rehberlik Hizmeti:</strong> Bu eğitim programını alan tüm kişilere Zeynep SALMAN İÇLİ koordinatörlüğünde, öğrenme düzeyinizdeki gelişim takip edilip rehberlik hizmeti sunulacaktır. Zeynep SALMAN İÇLİ tarafından WhatsApp gruplarında haftalık çalışma programı hazırlanacaktır. Ayda 1 kere genel durumunuzla ilgili değerlendirme yapılacaktır. Talepleriniz doğrultusunda sınırsız bireysel rehberlik hizmeti de dönem boyunca sizlere bu paket içerisinde sunulacaktır.</li>
</ul>

<p style="margin-top:24px;"><strong>Eğitimuzem tarafından bu paket doğrultusunda AGS kitap gönderimi yapılmamaktadır.</strong></p>
<p>Diğer avantajların tamamı paket kapsamında geçerlidir.</p>

<p style="color: #d9534f; font-weight: bold;">⚠️ ERKEN KAYIT KAPSAMINDA HER AY FİYAT GÜNCELLEMESİ YAPILMAKTADIR.</p>
<p><strong>HER SORUNUZ İÇİN WHATSAPP İLETİŞİM HATTINA ULAŞABİLİRSİNİZ. SİTEDEKİ WHATSAPP SİMGESİNE DOKUNMANIZ YETERLİ: 0 537 743 24 48</strong></p>
<p style="font-weight: bold; color: var(--color-primary);">#BİRLİKTEÇOKDAHAGÜÇLÜ</p>
<p style="background-color: #d4edda; color: #155724; padding: 12px; border-radius: 4px; border: 1px solid #c3e6cb; margin-top: 16px;">
  <strong>PAKETİ SATIN ALDIKTAN SONRA WHATSAPP NUMARASINA YAZARAK PANEL GİRİŞ BİLGİLERİNİZİ ALINIZ.</strong>
</p>
`;

async function main() {
  const result = await prisma.course.updateMany({
    where: { title: "2027 ERKEN KAYIT CANLI TÜRKÇE ÖABT + AGS VİDEO DERS PAKETİ" },
    data: { description: htmlDescription }
  });
  console.log("Update complete:", result);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
