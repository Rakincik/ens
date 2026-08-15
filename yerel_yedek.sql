--
-- PostgreSQL database dump
--

\restrict RgOXihaIjZQqh3yB1gA31MswLcdgKfsUmqNW0UcBqdfzXtdLE1fQ5xa8KYwylp6

-- Dumped from database version 15.15
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    "orderIndex" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: ContentSettings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContentSettings" (
    key text NOT NULL,
    value text NOT NULL
);


ALTER TABLE public."ContentSettings" OWNER TO postgres;

--
-- Name: Coupon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Coupon" (
    id text NOT NULL,
    code text NOT NULL,
    "discountType" text NOT NULL,
    "discountValue" double precision NOT NULL,
    "courseId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "expiryDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "influencerEmail" text,
    "influencerName" text,
    "startDate" timestamp(3) without time zone,
    "usageCount" integer DEFAULT 0 NOT NULL,
    "usageLimit" integer
);


ALTER TABLE public."Coupon" OWNER TO postgres;

--
-- Name: Course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Course" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    price double precision NOT NULL,
    "originalPrice" double precision,
    "isActive" boolean DEFAULT true NOT NULL,
    image text,
    "isCouponEligible" boolean DEFAULT true NOT NULL,
    "orderIndex" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    type text DEFAULT 'COURSE'::text NOT NULL,
    features text[]
);


ALTER TABLE public."Course" OWNER TO postgres;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "totalAmount" double precision NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "paymentId" text,
    "couponId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "courseId" text NOT NULL,
    price double precision NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO postgres;

--
-- Name: SupportMessage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SupportMessage" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    message text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SupportMessage" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    name text NOT NULL,
    surname text NOT NULL,
    phone text,
    role text DEFAULT 'STUDENT'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _CategoryToCourse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_CategoryToCourse" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_CategoryToCourse" OWNER TO postgres;

--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name, "orderIndex") FROM stdin;
99ff1092-3560-45c9-a56b-8de38fd4b684	CANLI DERSLER	1
6ec0ab5c-6e86-49c6-af5b-382dbf5aa919	VİDEO DERSLER	2
21d2024e-99ef-41f6-9ec8-359796623413	GENEL TEKRAR	3
640cc353-2e3e-4ede-a400-d44f7a5763f0	ONLINE DENEME	4
\.


--
-- Data for Name: ContentSettings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContentSettings" (key, value) FROM stdin;
faq	[{"q":"Dersleri sonradan tekrar izleyebilir miyim?","a":"Evet, tüm canlı derslerimiz yayın bittikten hemen sonra sisteme yüklenir. Sınav gününe kadar sınırsız kez geriye dönük izleyebilirsiniz."},{"q":"Dökümanlar ve PDF kaynaklar adrese gönderiliyor mu?","a":"Eğitim paketlerimize dahil olan PDF dökümanları dijital olarak öğrenci panelinize yüklenir. Kitap veya fiziksel yayın gönderimleri ürün açıklamalarında ayrıca belirtilir."},{"q":"Ödemelerde taksit imkanı var mı?","a":"PayTR güvenli ödeme altyapımız sayesinde tüm banka ve kredi kartlarına 12 aya varan taksit seçenekleriyle ödeme yapabilirsiniz."},{"q":"Kupon kodlarını nasıl kullanırım?","a":"Kupon kodunuzu sepet çekmecesinde veya satın alma aşamasındaki kupon girişi alanına yazıp 'Uygula' butonuna basarak sepetinize yansıtabilirsiniz."}]
slider	[{"title":"Türkçe ÖABT'de Türkiye'nin En Seçkin Eğitmen Kadrosu","subtitle":"ÖSYM formatında güncel canlı dersler, konu anlatımları ve soru çözüm kampları.","buttonText":"Eğitimleri İncele","buttonLink":"#kurslar"},{"title":"Derece Yapan Öğrencilerin Tercihi","subtitle":"Geçen yıl Türkiye derecesi yapan onlarca Türkçe öğretmeni sınav sürecini bizimle tamamladı.","buttonText":"Başarılarımızı Gör","buttonLink":"/basarilarimiz"}]
achievements	[{"name":"Merve K.","rank":"Türkiye 4.sü","year":"2025 KPSS","comment":"Hocalarımın ilgisi ve dökümanların kalitesi sayesinde bu başarıyı elde ettim."},{"name":"Selin Y.","rank":"Türkiye 12.si","year":"2025 KPSS","comment":"Canlı ders sonrasındaki soru-cevap saatleri eksiklerimi kapatmamda çok etkili oldu."},{"name":"Kadir T.","rank":"Türkiye 27.si","year":"2024 KPSS","comment":"Dil bilgisi kampları ve online deneme sınavları tam ÖSYM ayarındaydı."}]
teachers	[{"name":"Rüstem Hoca","title":"Dil Bilgisi ve Alan Eğitimi Uzmanı","bio":"12 yıllık ÖABT tecrübesiyle, sınavda çıkan tüm dil bilgisi konularının ve alan eğitimi yöntemlerinin mimarı."},{"name":"Ömer Hoca","title":"Edebiyat ve Alan Bilgisi Uzmanı","bio":"Divan edebiyatından halk edebiyatına, ÖABT sınavının ezber bozan taktikleriyle dersleri eğlenceli kılan eğitmenimiz."},{"name":"Murat Hoca","title":"Rehberlik ve Motivasyon Danışmanı","bio":"Sınav hazırlık sürecinizde haftalık çalışma planları ve mentörlük desteğiyle her an yanınızda olan rehberimiz."}]
corporate_settings	{"teachers":[{"name":"ENES KAAN ŞAHİN","title":"DÖRT TEMEL BECERİ, DİL BİLİM","bio":"","image":"https://turkceoabtdeyiz.com/uploads/instructors/a5271cc045ce4f0b1ac05e37f32e70dc.jpg"},{"name":"ASIM KARA","title":"YENİ TÜRK EDEBİYATI, DİL BİLGİSİ","bio":"","image":"https://turkceoabtdeyiz.com/uploads/instructors/3d8d990334c513dd3e38199e5d9ab0cb.jpeg"},{"name":"FATİH BEDİR","title":"DİL BİLGİSİ, DİL BİLİM","bio":"","image":"https://turkceoabtdeyiz.com/uploads/instructors/60a008bb18610d0da8884fd3a0f70754.jpeg"},{"name":"İLKER HAYAT","title":"ESKİ TÜRK EDEBİYATI, BEYİT ŞERHLERİ","bio":"","image":"https://turkceoabtdeyiz.com/uploads/instructors/e5da046c731e35e49e642617d7aca8d7.jpeg"},{"name":"ALİ ZEYBEK","title":"HALK EDEBİYATI, EDEBİYAT BİLGİ VE KURAMLARI","bio":"","image":"https://turkceoabtdeyiz.com/uploads/instructors/45066bcd4933eb68ed583c89ccb40710.jpeg"},{"name":"İSA KURTUL","title":"ÇOCUK EDEBİYATI","bio":"","image":"https://turkceoabtdeyiz.com/uploads/instructors/7423a6838c3db23604aedbef89bb222b.jpeg"},{"name":"BÜŞRA ÖZBAĞ","title":"REHBERLİK","bio":"","image":"https://turkceoabtdeyiz.com/uploads/instructors/eadcede202d8dae7e0f5648d4d8912af.jpeg"}]}
\.


--
-- Data for Name: Coupon; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Coupon" (id, code, "discountType", "discountValue", "courseId", "isActive", "expiryDate", "createdAt", "influencerEmail", "influencerName", "startDate", "usageCount", "usageLimit") FROM stdin;
34dc51dc-aa76-4141-bdad-36096c1f9bb0	TEST20	PERCENTAGE	20	\N	t	\N	2026-07-27 05:27:43.882	\N	\N	\N	0	\N
\.


--
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Course" (id, title, description, price, "originalPrice", "isActive", image, "isCouponEligible", "orderIndex", "createdAt", type, features) FROM stdin;
1bfa3615-7f26-4f34-a9d4-0922aebbc692	2027 ERKEN KAYIT CANLI TÜRKÇE ÖABT + VİDEO AGS	<h4>Eğitim&nbsp;Hakkında</h4><p><strong>#2027AGS&nbsp;kapsamında&nbsp;</strong>Eğitimuzem&nbsp;kurumuyla&nbsp;iş&nbsp;birliğine&nbsp;gidilmiştir.&nbsp;Türkçe&nbsp;ÖABT&nbsp;dersleri&nbsp;kurumumuzdan&nbsp;AGS&nbsp;dersleriyse&nbsp;Eğitimuzem&nbsp;kurumundan&nbsp;verilmektedir.&nbsp;</p><p>Türkçe&nbsp;ÖABT&nbsp;canlı,&nbsp;AGS&nbsp;video&nbsp;ders&nbsp;paketidir.&nbsp;AGS&nbsp;kapsamında&nbsp;canlı&nbsp;ders&nbsp;satışı&nbsp;bulunmamaktadır.&nbsp;</p><p>Türkçe&nbsp;ÖABT&nbsp;uzaktan&nbsp;eğitim&nbsp;ders&nbsp;içerikleri&nbsp;diğer&nbsp;eğitim&nbsp;paketleri&nbsp;içerisinde&nbsp;detaylandırılarak&nbsp;anlatılmıştır.&nbsp;</p><p><strong>AGS&nbsp;DERS&nbsp;PAKETİ&nbsp;İÇERİĞİ:</strong></p><p>Zeynep&nbsp;SALMAN&nbsp;İÇLİ&nbsp;Koordinatörlüğünde&nbsp;Akademi&nbsp;Giriş&nbsp;Sınavı&nbsp;MEB&nbsp;AGS&nbsp;2027</p><p>&nbsp;</p><p>&nbsp;<strong>Açıklama</strong>:&nbsp;Eğitim&nbsp;Bilimleri&nbsp;ve&nbsp;Türk&nbsp;Milli&nbsp;Eğitim&nbsp;Sistemi,&nbsp;Mevzuat&nbsp;Bilgisi,&nbsp;Sözel&nbsp;Yetenek,&nbsp;Sayısal&nbsp;Yetenek,&nbsp;Tarih&nbsp;ve&nbsp;Türkiye&nbsp;Coğrafyası&nbsp;dersleri&nbsp;konu&nbsp;anlatım&nbsp;paketidir.&nbsp;Tüm&nbsp;dersler&nbsp;konu&nbsp;anlatımı&nbsp;ÖSYM&nbsp;formatına&nbsp;uygun&nbsp;şekilde&nbsp;eğitmenlerimiz&nbsp;tarafından&nbsp;verilmektedir&nbsp;her&nbsp;derste&nbsp;ünite&nbsp;sonlarında&nbsp;öğretmenlerimiz&nbsp;örnek&nbsp;sorularla&nbsp;konuları&nbsp;pekiştirip&nbsp;daha&nbsp;kalıcı&nbsp;öğrenmenizi&nbsp;sağlar.&nbsp;</p><p>&nbsp;</p><p>&nbsp;Online&nbsp;derslerimizde&nbsp;Youtube&nbsp;ders&nbsp;videolarından&nbsp;farkı&nbsp;olarak&nbsp;her&nbsp;ünite&nbsp;sonunda&nbsp;ders&nbsp;esnasında&nbsp;konu&nbsp;pekiştirmek&nbsp;adına&nbsp;soru&nbsp;çözümleri&nbsp;yapılmaktadır.&nbsp;Ayrıca&nbsp;<strong><em>Whatsapp&nbsp;soru&nbsp;çözüm&nbsp;gruplarımız</em></strong>&nbsp;sayesinde&nbsp;yapamadığınız&nbsp;soruları&nbsp;öğretmenlerimize&nbsp;sorabiliyorsunuz.</p><p><strong>Öğretmen&nbsp;Kadrosu&nbsp;</strong></p><p><strong>Zeynep&nbsp;SALMAN&nbsp;İÇLİ:&nbsp;</strong>(Öğretim&nbsp;Yöntem&nbsp;ve&nbsp;Teknikleri-&nbsp;Sınıf&nbsp;Yönetimi-Eğitimin&nbsp;Temelleri-Türk&nbsp;Eğitim&nbsp;Sisteminin&nbsp;Genel&nbsp;Yapısı-Program&nbsp;Okuryazarlığı)</p><p>&nbsp;<strong>Bünyamin&nbsp;ATALAY-Bulut&nbsp;VURDUM:&nbsp;</strong>(Öğrenme&nbsp;Psikolojisi&nbsp;-&nbsp;Gelişim&nbsp;Psikolojisi)</p><p>&nbsp;<strong>Bulut&nbsp;VURDUM:&nbsp;</strong>(Rehberlik&nbsp;)</p><p>&nbsp;<strong>Bünyamin&nbsp;ATALAY:&nbsp;</strong>(Türkiye&nbsp;Yüzyılı&nbsp;Maarif&nbsp;Modeli-&nbsp;Türk&nbsp;Milli&nbsp;Eğitim&nbsp;Sistemi-Eğitim&nbsp;ve&nbsp;Öğretim&nbsp;Teknolojileri)</p><p>&nbsp;<strong>Emre&nbsp;Korcan&nbsp;DEMİR:&nbsp;</strong>(Eğitimde&nbsp;Ölçme&nbsp;ve&nbsp;Değerlendirme)</p><p>&nbsp;<strong>Aydın&nbsp;YÜCE:&nbsp;</strong>Tarih&nbsp;(100&nbsp;Saat)&nbsp;&nbsp;&nbsp;</p><p>&nbsp;<strong>Alican&nbsp;DEMİR:&nbsp;</strong>Türkiye&nbsp;Coğrafyası&nbsp;(40&nbsp;Saat)</p><p>&nbsp;<strong>Berk&nbsp;EKİCİ:&nbsp;</strong>Sözel&nbsp;Yetenek&nbsp;-&nbsp;Dil&nbsp;Bilgisi&nbsp;(42&nbsp;Saat)</p><p>&nbsp;<strong>Dilek&nbsp;ÇAKAN:&nbsp;</strong>Sayısal&nbsp;Yetenek&nbsp;-&nbsp;Geometri&nbsp;(120&nbsp;Saat)</p><p>&nbsp;<strong>Zeynep&nbsp;SALMAN&nbsp;İÇLİ&nbsp;-&nbsp;Emrah&nbsp;Vahap&nbsp;ÖZKARACA</strong>:&nbsp;Mevzuat&nbsp;Bilgisi<em>(36&nbsp;Saat)&nbsp;(Anayasa,&nbsp;1739&nbsp;sayılı&nbsp;Milli&nbsp;Eğitim&nbsp;Temel&nbsp;Kanunu,222&nbsp;sayılı&nbsp;İlköğretim&nbsp;ve&nbsp;Eğitim&nbsp;7528&nbsp;sayılı&nbsp;Öğretmenlik&nbsp;Meslek&nbsp;&nbsp;Kanunu)</em>&nbsp;&nbsp;</p><p><strong>Programın&nbsp;Başlama&nbsp;Tarihi:&nbsp;EKİM&nbsp;2026-&nbsp;HAZİRAN&nbsp;2027</strong></p><p><strong>&nbsp;Toplam&nbsp;Ders&nbsp;Saati&nbsp;600&nbsp;saat</strong></p><p><strong>UYARI:</strong>&nbsp;ÖSYM&nbsp;tarafından&nbsp;açıklanacak&nbsp;takvime&nbsp;göre,&nbsp;günlük&nbsp;ders&nbsp;saati&nbsp;ve&nbsp;haftalık&nbsp;ders&nbsp;günü&nbsp;sayısında&nbsp;artış&nbsp;yapabilir.</p><p><strong>Temel&nbsp;Matematik&nbsp;Dersi</strong>:Derslerimiz&nbsp;başlamadan&nbsp;önce&nbsp;öğrencilerimiz&nbsp;için&nbsp;&nbsp;<strong>12&nbsp;ders&nbsp;saati&nbsp;temel&nbsp;matematik&nbsp;dersimiz</strong>&nbsp;yapılacaktır&nbsp;ve&nbsp;bu&nbsp;derslerimiz&nbsp;sonucunda&nbsp;<strong>sayısal</strong>&nbsp;ve&nbsp;<strong>sözel&nbsp;</strong>olmak&nbsp;üzere&nbsp;iki&nbsp;ayrı&nbsp;matematik&nbsp;sınıfımız&nbsp;olacaktır.</p><p>&nbsp;<strong>Eğitimcilere&nbsp;Soru&nbsp;Sorma:&nbsp;</strong>Canlı&nbsp;derslerin&nbsp;başlamasının&nbsp;ardından&nbsp;oluşturulan&nbsp;özel&nbsp;gruplar&nbsp;(WP)&nbsp;üzerinden&nbsp;eğitimcilerinize&nbsp;doğrudan&nbsp;soru&nbsp;sorabilirsiniz.</p><p>&nbsp;<strong>Genel&nbsp;Tekrar</strong>:&nbsp;Derslerin&nbsp;bitiminde&nbsp;düzenleyeceğimiz,&nbsp;aldığınız&nbsp;paket&nbsp;programının&nbsp;genel&nbsp;tekrarlarına&nbsp;ücretsiz&nbsp;katılım&nbsp;gösterebileceksiniz.</p><p>&nbsp;<strong>Online&nbsp;Denem:&nbsp;</strong>Bu&nbsp;programa&nbsp;kayıt&nbsp;olan&nbsp;kursiyerlerimize&nbsp;ücretsiz&nbsp;8&nbsp;adet&nbsp;Türkiye&nbsp;Geneli&nbsp;Online&nbsp;deneme&nbsp;sınavı&nbsp;uygulanacaktır.</p><p>&nbsp;<strong>Derslerin&nbsp;Tekrar&nbsp;İzlenmesi:&nbsp;</strong>Canlı&nbsp;dersler&nbsp;işlendikten&nbsp;<strong>30&nbsp;Dakika</strong>&nbsp;içerisinde&nbsp;kayıt&nbsp;altına&nbsp;alınan&nbsp;dersleri,&nbsp;2028&nbsp;AGS&nbsp;tarihine&nbsp;kadar&nbsp;dilediğiniz&nbsp;kadar&nbsp;izleyebilirsiniz.&nbsp;Videolarda&nbsp;hızlandırma,&nbsp;ileri&nbsp;ve&nbsp;geri&nbsp;sarma&nbsp;özelliği&nbsp;bulunmaktadır.</p><p><strong>Satın&nbsp;alınan&nbsp;her&nbsp;bir&nbsp;içerik&nbsp;1&nbsp;kullanıcıya&nbsp;özeldir.&nbsp;Bu&nbsp;konuda&nbsp;gerekli&nbsp;IP&nbsp;ve&nbsp;cihaz&nbsp;kayıtları&nbsp;düzenli&nbsp;olarak&nbsp;tutulmaktadır.&nbsp;</strong></p><p>&nbsp;</p><p>&nbsp;<strong>Sınava&nbsp;Son&nbsp;1&nbsp;Ay&nbsp;Kala&nbsp;Yapacağımız&nbsp;Çalışmalar</strong>:&nbsp;Sınava&nbsp;son&nbsp;&nbsp;1&nbsp;ay&nbsp;kala&nbsp;Zeynep&nbsp;Salman&nbsp;İçli&nbsp;koordinatörlüğünde&nbsp;oluşturacağımız&nbsp;WP&nbsp;grubumuz&nbsp;ile&nbsp;ders&nbsp;çalışma,&nbsp;yönlendirme,&nbsp;motivasyon&nbsp;ve&nbsp;ödevlendirmeler&nbsp;yapılarak&nbsp;sınav&nbsp;hazırlık&nbsp;sürecinizi&nbsp;birlikte&nbsp;tamamlayacağız.</p><p>&nbsp;<strong>Bireysel&nbsp;Rehberlik&nbsp;Desteği</strong>:&nbsp;Kaygı&nbsp;Yönetimi&nbsp;,&nbsp;Motivasyon&nbsp;,&nbsp;Stresle&nbsp;Baş&nbsp;Etme&nbsp;&nbsp;ve&nbsp;AGS&nbsp;sürecine&nbsp;hazırlıkla&nbsp;ilgili&nbsp;tercih&nbsp;ettiğiniz&nbsp;zamanlarda&nbsp;&nbsp;ücretsiz&nbsp;bireysel&nbsp;olarak&nbsp;rehberlik&nbsp;desteği&nbsp;hizmeti&nbsp;verilecektir.</p><p>&nbsp;<strong>Rehberlik&nbsp;Hizmeti</strong>:&nbsp;Bu&nbsp;eğitim&nbsp;programını&nbsp;alan&nbsp;tüm&nbsp;kişilere&nbsp;Zeynep&nbsp;SALMAN&nbsp;İÇLİ&nbsp;koordinatörlüğünde,&nbsp;öğrenme&nbsp;düzeyinizdeki&nbsp;gelişim&nbsp;takip&nbsp;edilip&nbsp;rehberlik&nbsp;hizmeti&nbsp;sunulacaktır.&nbsp;Zeynep&nbsp;SALMAN&nbsp;İÇLİ&nbsp;tarafından&nbsp;WhatsApp&nbsp;gruplarında&nbsp;haftalık&nbsp;çalışma&nbsp;programı&nbsp;hazırlanacaktır.&nbsp;Ayda&nbsp;1&nbsp;kere&nbsp;genel&nbsp;durumunuzla&nbsp;ilgili&nbsp;değerlendirme&nbsp;yapılacaktır.&nbsp;Talepleriniz&nbsp;doğrultusunda&nbsp;sınırsız&nbsp;bireysel&nbsp;rehberlik&nbsp;hizmeti&nbsp;de&nbsp;dönem&nbsp;boyunca&nbsp;sizlere&nbsp;bu&nbsp;paket&nbsp;içerisinde&nbsp;sunulacaktır.</p><p>&nbsp;</p><p>&nbsp;<strong>Eğitimuzem&nbsp;tarafından&nbsp;bu&nbsp;paket&nbsp;doğrultusunda&nbsp;AGS&nbsp;kitap&nbsp;gönderimi&nbsp;yapılmamaktadır.&nbsp;</strong></p><p><strong>Diğer&nbsp;avantajların&nbsp;tamamı&nbsp;paket&nbsp;kapsamında&nbsp;geçerlidir.&nbsp;</strong></p><p>⚠️<strong>ERKEN&nbsp;KAYIT&nbsp;KAPSAMINDA&nbsp;HER&nbsp;AY&nbsp;FİYAT&nbsp;GÜNCELLEMESİ&nbsp;YAPILMAKTADIR.</strong></p><p>HER&nbsp;SORUNUZ&nbsp;İÇİN&nbsp;WHATSAP&nbsp;İLETİŞİM&nbsp;HATTINA&nbsp;ULAŞABİLİRSİNİZ.&nbsp;SİTEDEKİ&nbsp;WHATSAP&nbsp;SİMGESİNE&nbsp;DOKUNMANIZ&nbsp;YETERLİ:&nbsp;0&nbsp;537&nbsp;743&nbsp;24&nbsp;48</p><p><strong>#BİRLİKTEÇOKDAHAGÜÇLÜ</strong></p><p>PAKETİ&nbsp;SATIN&nbsp;ALDIKTAN&nbsp;SONRA&nbsp;WHATSAAP&nbsp;NUMARASINA&nbsp;YAZARAK&nbsp;PANEL&nbsp;GİRİŞ&nbsp;BİLGİLERİNİZİ&nbsp;ALINIZ.</p><h6>Özet</h6><p>2027&nbsp;ERKEN&nbsp;KAYIT&nbsp;CANLI&nbsp;TÜRKÇE&nbsp;ÖABT&nbsp;+&nbsp;AGS&nbsp;VİDEO&nbsp;DERS&nbsp;PAKETİ</p>	14000	19000	t	/uploads/courses/course-46-7533bbb75cc71d9d822f8ab1bea218ca.png	t	0	2026-07-27 04:45:32.987	COURSE	{Video}
668d3200-9148-4045-aaee-ff0890c55f4c	2027 ERKEN KAYIT TÜRKÇE ÖABT + AGS VİDEO DERS PAKETİ	<h4>Eğitim&nbsp;Hakkında</h4><p><strong>#2027AGS&nbsp;kapsamında&nbsp;</strong>Eğitimuzem&nbsp;kurumuyla&nbsp;iş&nbsp;birliğine&nbsp;gidilmiştir.&nbsp;Türkçe&nbsp;ÖABT&nbsp;dersleri&nbsp;kurumumuzdan&nbsp;AGS&nbsp;dersleriyse&nbsp;Eğitimuzem&nbsp;kurumundan&nbsp;verilmektedir.&nbsp;</p><p>Türkçe&nbsp;ÖABT&nbsp;uzaktan&nbsp;eğitim&nbsp;ders&nbsp;içerikleri&nbsp;diğer&nbsp;eğitim&nbsp;paketleri&nbsp;içerisinde&nbsp;detaylandırılarak&nbsp;anlatılmıştır.&nbsp;</p><p><strong>AGS&nbsp;DERS&nbsp;PAKETİ&nbsp;İÇERİĞİ:</strong></p><p>Zeynep&nbsp;SALMAN&nbsp;İÇLİ&nbsp;Koordinatörlüğünde&nbsp;Akademi&nbsp;Giriş&nbsp;Sınavı&nbsp;MEB&nbsp;AGS&nbsp;2027</p><p>&nbsp;</p><p>&nbsp;<strong>Açıklama</strong>:&nbsp;Eğitim&nbsp;Bilimleri&nbsp;ve&nbsp;Türk&nbsp;Milli&nbsp;Eğitim&nbsp;Sistemi,&nbsp;Mevzuat&nbsp;Bilgisi,&nbsp;Sözel&nbsp;Yetenek,&nbsp;Sayısal&nbsp;Yetenek,&nbsp;Tarih&nbsp;ve&nbsp;Türkiye&nbsp;Coğrafyası&nbsp;dersleri&nbsp;konu&nbsp;anlatım&nbsp;paketidir.&nbsp;Tüm&nbsp;dersler&nbsp;konu&nbsp;anlatımı&nbsp;ÖSYM&nbsp;formatına&nbsp;uygun&nbsp;şekilde&nbsp;eğitmenlerimiz&nbsp;tarafından&nbsp;verilmektedir&nbsp;her&nbsp;derste&nbsp;ünite&nbsp;sonlarında&nbsp;öğretmenlerimiz&nbsp;örnek&nbsp;sorularla&nbsp;konuları&nbsp;pekiştirip&nbsp;daha&nbsp;kalıcı&nbsp;öğrenmenizi&nbsp;sağlar.&nbsp;</p><p>&nbsp;</p><p>&nbsp;Online&nbsp;derslerimizde&nbsp;Youtube&nbsp;ders&nbsp;videolarından&nbsp;farkı&nbsp;olarak&nbsp;her&nbsp;ünite&nbsp;sonunda&nbsp;ders&nbsp;esnasında&nbsp;konu&nbsp;pekiştirmek&nbsp;adına&nbsp;soru&nbsp;çözümleri&nbsp;yapılmaktadır.&nbsp;Ayrıca&nbsp;<strong><em>Whatsapp&nbsp;soru&nbsp;çözüm&nbsp;gruplarımız</em></strong>&nbsp;sayesinde&nbsp;yapamadığınız&nbsp;soruları&nbsp;öğretmenlerimize&nbsp;sorabiliyorsunuz.</p><p><strong>Öğretmen&nbsp;Kadrosu&nbsp;</strong></p><p><strong>Zeynep&nbsp;SALMAN&nbsp;İÇLİ:&nbsp;</strong>(Öğretim&nbsp;Yöntem&nbsp;ve&nbsp;Teknikleri-&nbsp;Sınıf&nbsp;Yönetimi-Eğitimin&nbsp;Temelleri-Türk&nbsp;Eğitim&nbsp;Sisteminin&nbsp;Genel&nbsp;Yapısı-Program&nbsp;Okuryazarlığı)</p><p>&nbsp;<strong>Bünyamin&nbsp;ATALAY-Bulut&nbsp;VURDUM:&nbsp;</strong>(Öğrenme&nbsp;Psikolojisi&nbsp;-&nbsp;Gelişim&nbsp;Psikolojisi)</p><p>&nbsp;<strong>Bulut&nbsp;VURDUM:&nbsp;</strong>(Rehberlik&nbsp;)</p><p>&nbsp;<strong>Bünyamin&nbsp;ATALAY:&nbsp;</strong>(Türkiye&nbsp;Yüzyılı&nbsp;Maarif&nbsp;Modeli-&nbsp;Türk&nbsp;Milli&nbsp;Eğitim&nbsp;Sistemi-Eğitim&nbsp;ve&nbsp;Öğretim&nbsp;Teknolojileri)</p><p>&nbsp;<strong>Emre&nbsp;Korcan&nbsp;DEMİR:&nbsp;</strong>(Eğitimde&nbsp;Ölçme&nbsp;ve&nbsp;Değerlendirme)</p><p>&nbsp;<strong>Aydın&nbsp;YÜCE:&nbsp;</strong>Tarih&nbsp;(100&nbsp;Saat)&nbsp;&nbsp;&nbsp;</p><p>&nbsp;<strong>Alican&nbsp;DEMİR:&nbsp;</strong>Türkiye&nbsp;Coğrafyası&nbsp;(40&nbsp;Saat)</p><p>&nbsp;<strong>Berk&nbsp;EKİCİ:&nbsp;</strong>Sözel&nbsp;Yetenek&nbsp;-&nbsp;Dil&nbsp;Bilgisi&nbsp;(42&nbsp;Saat)</p><p>&nbsp;<strong>Dilek&nbsp;ÇAKAN:&nbsp;</strong>Sayısal&nbsp;Yetenek&nbsp;-&nbsp;Geometri&nbsp;(120&nbsp;Saat)</p><p>&nbsp;<strong>Zeynep&nbsp;SALMAN&nbsp;İÇLİ&nbsp;-&nbsp;Emrah&nbsp;Vahap&nbsp;ÖZKARACA</strong>:&nbsp;Mevzuat&nbsp;Bilgisi<em>(36&nbsp;Saat)&nbsp;(Anayasa,&nbsp;1739&nbsp;sayılı&nbsp;Milli&nbsp;Eğitim&nbsp;Temel&nbsp;Kanunu,222&nbsp;sayılı&nbsp;İlköğretim&nbsp;ve&nbsp;Eğitim&nbsp;7528&nbsp;sayılı&nbsp;Öğretmenlik&nbsp;Meslek&nbsp;&nbsp;Kanunu)</em>&nbsp;&nbsp;</p><p><strong>Programın&nbsp;Başlama&nbsp;Tarihi:&nbsp;EKİM&nbsp;2026-&nbsp;HAZİRAN&nbsp;2027</strong></p><p><strong>&nbsp;Toplam&nbsp;Ders&nbsp;Saati&nbsp;600&nbsp;saat</strong></p><p><strong>UYARI:</strong>&nbsp;ÖSYM&nbsp;tarafından&nbsp;açıklanacak&nbsp;takvime&nbsp;göre,&nbsp;günlük&nbsp;ders&nbsp;saati&nbsp;ve&nbsp;haftalık&nbsp;ders&nbsp;günü&nbsp;sayısında&nbsp;artış&nbsp;yapabilir.</p><p><strong>Temel&nbsp;Matematik&nbsp;Dersi</strong>:Derslerimiz&nbsp;başlamadan&nbsp;önce&nbsp;öğrencilerimiz&nbsp;için&nbsp;&nbsp;<strong>12&nbsp;ders&nbsp;saati&nbsp;temel&nbsp;matematik&nbsp;dersimiz</strong>&nbsp;yapılacaktır&nbsp;ve&nbsp;bu&nbsp;derslerimiz&nbsp;sonucunda&nbsp;<strong>sayısal</strong>&nbsp;ve&nbsp;<strong>sözel&nbsp;</strong>olmak&nbsp;üzere&nbsp;iki&nbsp;ayrı&nbsp;matematik&nbsp;sınıfımız&nbsp;olacaktır.</p><p>&nbsp;<strong>Eğitimcilere&nbsp;Soru&nbsp;Sorma:&nbsp;</strong>Canlı&nbsp;derslerin&nbsp;başlamasının&nbsp;ardından&nbsp;oluşturulan&nbsp;özel&nbsp;gruplar&nbsp;(WP)&nbsp;üzerinden&nbsp;eğitimcilerinize&nbsp;doğrudan&nbsp;soru&nbsp;sorabilirsiniz.</p><p>&nbsp;<strong>Genel&nbsp;Tekrar</strong>:&nbsp;Derslerin&nbsp;bitiminde&nbsp;düzenleyeceğimiz,&nbsp;aldığınız&nbsp;paket&nbsp;programının&nbsp;genel&nbsp;tekrarlarına&nbsp;ücretsiz&nbsp;katılım&nbsp;gösterebileceksiniz.</p><p>&nbsp;<strong>Online&nbsp;Denem:&nbsp;</strong>Bu&nbsp;programa&nbsp;kayıt&nbsp;olan&nbsp;kursiyerlerimize&nbsp;ücretsiz&nbsp;8&nbsp;adet&nbsp;Türkiye&nbsp;Geneli&nbsp;Online&nbsp;deneme&nbsp;sınavı&nbsp;uygulanacaktır.</p><p>&nbsp;<strong>Derslerin&nbsp;Tekrar&nbsp;İzlenmesi:&nbsp;</strong>Canlı&nbsp;dersler&nbsp;işlendikten&nbsp;<strong>30&nbsp;Dakika</strong>&nbsp;içerisinde&nbsp;kayıt&nbsp;altına&nbsp;alınan&nbsp;dersleri,&nbsp;2028&nbsp;AGS&nbsp;tarihine&nbsp;kadar&nbsp;dilediğiniz&nbsp;kadar&nbsp;izleyebilirsiniz.&nbsp;Videolarda&nbsp;hızlandırma,&nbsp;ileri&nbsp;ve&nbsp;geri&nbsp;sarma&nbsp;özelliği&nbsp;bulunmaktadır.</p><p><strong>Satın&nbsp;alınan&nbsp;her&nbsp;bir&nbsp;içerik&nbsp;1&nbsp;kullanıcıya&nbsp;özeldir.&nbsp;Bu&nbsp;konuda&nbsp;gerekli&nbsp;IP&nbsp;ve&nbsp;cihaz&nbsp;kayıtları&nbsp;düzenli&nbsp;olarak&nbsp;tutulmaktadır.&nbsp;</strong></p><p>&nbsp;</p><p>&nbsp;<strong>Sınava&nbsp;Son&nbsp;1&nbsp;Ay&nbsp;Kala&nbsp;Yapacağımız&nbsp;Çalışmalar</strong>:&nbsp;Sınava&nbsp;son&nbsp;&nbsp;1&nbsp;ay&nbsp;kala&nbsp;Zeynep&nbsp;Salman&nbsp;İçli&nbsp;koordinatörlüğünde&nbsp;oluşturacağımız&nbsp;WP&nbsp;grubumuz&nbsp;ile&nbsp;ders&nbsp;çalışma,&nbsp;yönlendirme,&nbsp;motivasyon&nbsp;ve&nbsp;ödevlendirmeler&nbsp;yapılarak&nbsp;sınav&nbsp;hazırlık&nbsp;sürecinizi&nbsp;birlikte&nbsp;tamamlayacağız.</p><p>&nbsp;<strong>Bireysel&nbsp;Rehberlik&nbsp;Desteği</strong>:&nbsp;Kaygı&nbsp;Yönetimi&nbsp;,&nbsp;Motivasyon&nbsp;,&nbsp;Stresle&nbsp;Baş&nbsp;Etme&nbsp;&nbsp;ve&nbsp;AGS&nbsp;sürecine&nbsp;hazırlıkla&nbsp;ilgili&nbsp;tercih&nbsp;ettiğiniz&nbsp;zamanlarda&nbsp;&nbsp;ücretsiz&nbsp;bireysel&nbsp;olarak&nbsp;rehberlik&nbsp;desteği&nbsp;hizmeti&nbsp;verilecektir.</p><p>&nbsp;<strong>Rehberlik&nbsp;Hizmeti</strong>:&nbsp;Bu&nbsp;eğitim&nbsp;programını&nbsp;alan&nbsp;tüm&nbsp;kişilere&nbsp;Zeynep&nbsp;SALMAN&nbsp;İÇLİ&nbsp;koordinatörlüğünde,&nbsp;öğrenme&nbsp;düzeyinizdeki&nbsp;gelişim&nbsp;takip&nbsp;edilip&nbsp;rehberlik&nbsp;hizmeti&nbsp;sunulacaktır.&nbsp;Zeynep&nbsp;SALMAN&nbsp;İÇLİ&nbsp;tarafından&nbsp;WhatsApp&nbsp;gruplarında&nbsp;haftalık&nbsp;çalışma&nbsp;programı&nbsp;hazırlanacaktır.&nbsp;Ayda&nbsp;1&nbsp;kere&nbsp;genel&nbsp;durumunuzla&nbsp;ilgili&nbsp;değerlendirme&nbsp;yapılacaktır.&nbsp;Talepleriniz&nbsp;doğrultusunda&nbsp;sınırsız&nbsp;bireysel&nbsp;rehberlik&nbsp;hizmeti&nbsp;de&nbsp;dönem&nbsp;boyunca&nbsp;sizlere&nbsp;bu&nbsp;paket&nbsp;içerisinde&nbsp;sunulacaktır.</p><p>&nbsp;</p><p>&nbsp;<strong>Eğitimuzem&nbsp;tarafından&nbsp;bu&nbsp;paket&nbsp;doğrultusunda&nbsp;AGS&nbsp;kitap&nbsp;gönderimi&nbsp;yapılmamaktadır.&nbsp;</strong></p><p><strong>Diğer&nbsp;avantajların&nbsp;tamamı&nbsp;paket&nbsp;kapsamında&nbsp;geçerlidir.&nbsp;</strong></p><p>⚠️<strong>ERKEN&nbsp;KAYIT&nbsp;KAPSAMINDA&nbsp;HER&nbsp;AY&nbsp;FİYAT&nbsp;GÜNCELLEMESİ&nbsp;YAPILMAKTADIR.</strong></p><p>HER&nbsp;SORUNUZ&nbsp;İÇİN&nbsp;WHATSAP&nbsp;İLETİŞİM&nbsp;HATTINA&nbsp;ULAŞABİLİRSİNİZ.&nbsp;SİTEDEKİ&nbsp;WHATSAP&nbsp;SİMGESİNE&nbsp;DOKUNMANIZ&nbsp;YETERLİ:&nbsp;0&nbsp;537&nbsp;743&nbsp;24&nbsp;48</p><p><strong>#BİRLİKTEÇOKDAHAGÜÇLÜ</strong></p><p>PAKETİ&nbsp;SATIN&nbsp;ALDIKTAN&nbsp;SONRA&nbsp;WHATSAAP&nbsp;NUMARASINA&nbsp;YAZARAK&nbsp;PANEL&nbsp;GİRİŞ&nbsp;BİLGİLERİNİZİ&nbsp;ALINIZ.</p><p>&nbsp;</p><h6>Özet</h6><p>2027&nbsp;ERKEN&nbsp;KAYIT&nbsp;TÜRKÇE&nbsp;ÖABT&nbsp;+&nbsp;AGS&nbsp;VİDEO&nbsp;DERS&nbsp;PAKETİ</p>	13000	18000	t	/uploads/courses/course-45-31fde21c2e3c175569569d53d1fe6a64.png	t	0	2026-07-27 04:45:32.939	COURSE	{Video}
ca85e9ef-4d18-4935-84ac-d5ac67d6b424	2027 ERKEN KAYIT TÜRKÇE ÖABT VİDEO DERS PAKETİ	<h4>Eğitim&nbsp;Hakkında</h4><p><strong>2027&nbsp;TÜRKÇE&nbsp;ÖABT&nbsp;VİDEO&nbsp;DERS&nbsp;PAKETİ&nbsp;-&nbsp;ERKEN&nbsp;KAYIT</strong></p><p>&quot;Önce&nbsp;Türkçe&nbsp;ÖABTDEYİZ&nbsp;sonra&nbsp;Türkiye&nbsp;derecesi!&quot;</p><p>✅Video&nbsp;ders&nbsp;paketi&nbsp;olup&nbsp;çekilen&nbsp;derslerin&nbsp;tamamı&nbsp;sadece&nbsp;10&nbsp;dakika&nbsp;içerisinde&nbsp;sisteme&nbsp;düşmektedir.</p><p>&nbsp;✅2026&nbsp;ÖABT&nbsp;sınavına&nbsp;yönelik&nbsp;hazırlanan&nbsp;toplam&nbsp;900&nbsp;ders&nbsp;saatinden&nbsp;oluşan&nbsp;ders&nbsp;çekimi,&nbsp;soru&nbsp;çözümü&nbsp;ve&nbsp;kamp&nbsp;uygulamalarının&nbsp;tamamı&nbsp;anında&nbsp;panelinize&nbsp;tanımlanarak&nbsp;aktif&nbsp;hale&nbsp;getirilecektir.&nbsp;</p><p>&nbsp;✅Paneliniz&nbsp;2027&nbsp;ÖABT&nbsp;sınavına&nbsp;kadar&nbsp;aktif&nbsp;halde&nbsp;kalacaktır.&nbsp;</p><p>&nbsp;✅Konu&nbsp;anlatım&nbsp;aralığı&nbsp;2026&nbsp;Ekim&nbsp;Sonu&nbsp;-&nbsp;2027&nbsp;Mayıs&nbsp;Sonu,&nbsp;ders&nbsp;saatleri&nbsp;19.00-22.00</p><p>&nbsp;✅Fark&nbsp;Yaratan&nbsp;Eğitim&nbsp;Modeli:&nbsp;Ara&nbsp;değerlendirme&nbsp;sistemiyle&nbsp;her&nbsp;dersin&nbsp;ünitesi&nbsp;bittiğinde&nbsp;sıcağı&nbsp;sıcağına&nbsp;soru&nbsp;çözümü&nbsp;yapılır.&nbsp;Soru&nbsp;çözmeyi&nbsp;sene&nbsp;sonuna&nbsp;bırakmaz,&nbsp;konuları&nbsp;dönem&nbsp;içinde&nbsp;somutlaştırırsınız.</p><h3><strong>ERKEN&nbsp;KAYIT&nbsp;DÖNEMİ&nbsp;CANLI&nbsp;DERS&nbsp;PAKETİNİN&nbsp;TÜM&nbsp;AVANTAJLARI&nbsp;</strong></h3><p>✅<strong>10&nbsp;ADET&nbsp;TÜRKİYE&nbsp;GENELİ&nbsp;ONLİNE&nbsp;DENEME:</strong>&nbsp;Türkiye&#39;nin&nbsp;kendi&nbsp;alanında&nbsp;en&nbsp;geniş&nbsp;katılımlı&nbsp;denemeleri&nbsp;ve&nbsp;bu&nbsp;denemelerin&nbsp;detaylı&nbsp;video&nbsp;çözümleri.</p><p>&nbsp;​​​​​✅<strong>​​​GENEL&nbsp;TEKRAR&nbsp;KAMPLARI:</strong>&nbsp;Sene&nbsp;ortası&nbsp;ve&nbsp;sene&nbsp;sonu&nbsp;efsane&nbsp;tekrar/soru&nbsp;kampları&nbsp;(En&nbsp;az&nbsp;50&#39;şer&nbsp;saat).</p><p>&nbsp;✅<strong>SORU&nbsp;ÇÖZÜM&nbsp;GRUPLARI:</strong>&nbsp;Binlerce&nbsp;Türkçe&nbsp;öğretmeninden&nbsp;oluşan&nbsp;soru&nbsp;çözüm&nbsp;grupları.&nbsp;Takıldığınız&nbsp;sorularda&nbsp;yalnız&nbsp;değilsiniz.</p><p>&nbsp;✅<strong>BEYİT&nbsp;ŞERHLERİ:</strong>&nbsp;Kurumumuz&nbsp;beyit&nbsp;şerhlerini&nbsp;ayrı&nbsp;bir&nbsp;ders&nbsp;olarak&nbsp;ele&nbsp;alarak&nbsp;uygulamaya&nbsp;dayalı&nbsp;eksiklerinizi&nbsp;gidermek&nbsp;için&nbsp;50&nbsp;ders&nbsp;saati&nbsp;bir&nbsp;eğitim&nbsp;gerçekleştirmektedir.&nbsp;</p><p>&nbsp;✅<strong>DİL&nbsp;BİLGİSİ&nbsp;ÇÖZÜMLEMELERİ:<em>&nbsp;</em></strong>Kurumumuzda&nbsp;dil&nbsp;bilgisi&nbsp;dersinin&nbsp;ana&nbsp;anlatımından&nbsp;sonra&nbsp;konu&nbsp;konu&nbsp;ayrıştırılmış&nbsp;soru&nbsp;çözüm&nbsp;uygulamaları&nbsp;gerçekleştirilmektedir.</p><p>&nbsp;✅<strong>YAYIN&nbsp;DESTEĞİ<em>:</em></strong>&nbsp;Dört&nbsp;Temel&nbsp;Beceri&nbsp;konu&nbsp;anlatım&nbsp;kitabı&nbsp;erken&nbsp;kayıt&nbsp;kapsamında&nbsp;tüm&nbsp;kursiyerlerimize&nbsp;hediye&nbsp;gönderilmektedir.&nbsp;Diğer&nbsp;derslerin&nbsp;konu&nbsp;anlatım&nbsp;fasikülleri&nbsp;sisteme&nbsp;PDF&nbsp;olarak&nbsp;yüklenmekte&nbsp;olup&nbsp;istediğiniz&nbsp;zaman&nbsp;indirebilir&nbsp;veya&nbsp;çıktı&nbsp;alabilirsiniz.&nbsp;</p><p>&nbsp;✅<strong>​​​​​​KESİNTİSİZ&nbsp;REHBERLİK</strong>:<strong><em>&nbsp;</em></strong>Kurumumuzda&nbsp;her&nbsp;ay&nbsp;düzenli&nbsp;rehberlik&nbsp;dersleri&nbsp;yapılmaktadır.&nbsp;Rehberlik&nbsp;derslerimiz&nbsp;Zeynep&nbsp;SALMAN&nbsp;ve&nbsp;Enes&nbsp;Kaan&nbsp;ŞAHİN&nbsp;koordinesinde&nbsp;gerçekleştirilir.</p><p>&nbsp;✅<strong>GÜÇLÜ&nbsp;ALTYAPI:<em>&nbsp;</em></strong>Panelinizde&nbsp;video&nbsp;hızlandırma,&nbsp;video&nbsp;takip,&nbsp;online&nbsp;deneme,&nbsp;sınırsız&nbsp;izleme&nbsp;vb.&nbsp;gibi&nbsp;teknik&nbsp;imkanlar&nbsp;bulunmakta&nbsp;olup&nbsp;çekilen&nbsp;her&nbsp;ders&nbsp;10&nbsp;dakika&nbsp;içinde&nbsp;sisteme&nbsp;düşer.&nbsp;Sınav&nbsp;gününe&nbsp;kadar&nbsp;kesintisiz&nbsp;bir&nbsp;eğitim&nbsp;sunulmaktadır.</p><p>&nbsp;✅<strong>ARA&nbsp;DEĞERLENDİRME&nbsp;SİSTEMİ:<em>&nbsp;</em></strong>Her&nbsp;dersin&nbsp;ardından&nbsp;ara&nbsp;değerlendirme&nbsp;sistemiyle&nbsp;anında&nbsp;soru&nbsp;çözümü&nbsp;gerçekleştirilmektedir.&nbsp;</p><p><strong>TOPLAM&nbsp;HEDEFLENEN&nbsp;DERS&nbsp;SAATİ&nbsp;ASGARİ&nbsp;600&nbsp;SAATTİR.&nbsp;SENE&nbsp;İÇİNDE&nbsp;EN&nbsp;AZ&nbsp;50&nbsp;DERS&nbsp;SAATİ&nbsp;SORU&nbsp;ÇÖZÜMÜ,&nbsp;SENE&nbsp;SONU&nbsp;EN&nbsp;AZ&nbsp;50&nbsp;DERS&nbsp;SAATİ&nbsp;GENEL&nbsp;TEKRAR&nbsp;KAMPI&nbsp;UYGULAMASI&nbsp;YAPILMAKTADIR.&nbsp;</strong></p><p>Her&nbsp;dersin&nbsp;bir&nbsp;ünitesi&nbsp;bittiğinde&nbsp;ilgili&nbsp;alana&nbsp;yönelik&nbsp;SORU&nbsp;ÇÖZÜMÜ&nbsp;düzenlenerek&nbsp;ARA&nbsp;DEĞERLENDİRME&nbsp;gerçekleştirilecektir.&nbsp;</p><p>Sadece&nbsp;sene&nbsp;sonunda&nbsp;değil,&nbsp;sene&nbsp;içinde&nbsp;de&nbsp;soru&nbsp;çözerek&nbsp;konuları&nbsp;daha&nbsp;somut&nbsp;hale&nbsp;getirmeyi&nbsp;amaçlıyoruz.</p><p>⚠️Ders&nbsp;özelinde&nbsp;asgari&nbsp;düzeyde&nbsp;gerçekleştirilecek&nbsp;konu&nbsp;anlatım&nbsp;saatleri&nbsp;aşağıdaki&nbsp;gibidir:</p><p>⏳YENİ&nbsp;TÜRK&nbsp;EDEBİYATI:&nbsp;&nbsp;80&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;Asım&nbsp;Kara&nbsp;Hoca</p><p>&nbsp;⏳EDEBİYAT&nbsp;BİLGİ&nbsp;VE&nbsp;KURAMLARI:&nbsp;&nbsp;30&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;Ali&nbsp;Zeybek&nbsp;Hoca</p><p>&nbsp;⏳ÇOCUK&nbsp;EDEBİYATI:&nbsp;30&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;İsa&nbsp;Kurtul&nbsp;Hoca</p><p>&nbsp;⏳DÖRT&nbsp;TEMEL&nbsp;BECERİ:&nbsp;90&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;Enes&nbsp;Hoca</p><p>&nbsp;⏳ESKİ&nbsp;TÜRK&nbsp;EDEBİYATI&nbsp;:&nbsp;60&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;İlker&nbsp;Hayat&nbsp;Hoca&nbsp;</p><p>&nbsp;⏳BEYİT&nbsp;ŞERHLERİ:&nbsp;&nbsp;50&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;&nbsp;Ali&nbsp;Zeybek&nbsp;-&nbsp;İlker&nbsp;Hayat&nbsp;Hoca</p><p>&nbsp;⏳HALK&nbsp;EDEBİYATI:&nbsp;40&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;Ali&nbsp;Zeybek</p><p>&nbsp;⏳DİL&nbsp;BİLİM&nbsp;BİRİNCİ&nbsp;ANLATIM:&nbsp;40&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;Fatih&nbsp;Bedir&nbsp;Hoca</p><p>&nbsp;⏳DİL&nbsp;BİLİM&nbsp;İKİNCİ&nbsp;ANLATIM:&nbsp;30&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;Enes&nbsp;Hoca</p><p>&nbsp;⏳DİL&nbsp;BİLGİSİ&nbsp;BİRİNCİ&nbsp;ANLATIM:&nbsp;40&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;Fatih&nbsp;Bedir&nbsp;Hoca</p><p>&nbsp;⏳DİL&nbsp;BİLGİSİ&nbsp;İKİNCİ&nbsp;ANLATIM:&nbsp;&nbsp;30&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;Asım&nbsp;Hoca&nbsp;</p><p>⚠️Sistemimizde;&nbsp;Asım&nbsp;Kara&nbsp;-&nbsp;Çocuk&nbsp;Edebiyatı,&nbsp;Fatih&nbsp;&nbsp;Avcı&nbsp;-&nbsp;Halk&nbsp;Edebiyatı/Şerhler,&nbsp;Umut&nbsp;Tulpar&nbsp;Hoca&nbsp;-&nbsp;Dil&nbsp;Bilim/Dil&nbsp;Bilgisi&nbsp;video&nbsp;ders&nbsp;çekimleri&nbsp;de&nbsp;yer&nbsp;almaktadır.&nbsp;</p><p>DİL&nbsp;BİLGİSİ,&nbsp;DİL&nbsp;BİLİM&nbsp;VE&nbsp;BEYİT&nbsp;ŞERHLERİ&nbsp;ÜÇ&nbsp;FARKLI&nbsp;HOCA;&nbsp;ÇOCUK&nbsp;EDEBİYATI&nbsp;VE&nbsp;HALK&nbsp;EDEBİYATI&nbsp;DERSLERİNDE&nbsp;İKİ&nbsp;FARKLI&nbsp;HOCA&nbsp;ANLATIMINDAN&nbsp;YARARLANABİLECEKSİNİZ.&nbsp;</p><p>⚠️<strong>ERKEN&nbsp;KAYIT&nbsp;KAPSAMINDA&nbsp;HER&nbsp;AY&nbsp;FİYAT&nbsp;GÜNCELLEMESİ&nbsp;YAPILMAKTADIR.</strong></p><p>HER&nbsp;SORUNUZ&nbsp;İÇİN&nbsp;WHATSAP&nbsp;İLETİŞİM&nbsp;HATTINA&nbsp;ULAŞABİLİRSİNİZ.&nbsp;SİTEDEKİ&nbsp;WHATSAP&nbsp;SİMGESİNE&nbsp;DOKUNMANIZ&nbsp;YETERLİ:&nbsp;0&nbsp;537&nbsp;743&nbsp;24&nbsp;48</p><p><strong>#BİRLİKTEÇOKDAHAGÜÇLÜ</strong></p><p>PAKETİ&nbsp;SATIN&nbsp;ALDIKTAN&nbsp;SONRA&nbsp;WHATSAAP&nbsp;NUMARASINA&nbsp;YAZARAK&nbsp;PANEL&nbsp;GİRİŞ&nbsp;BİLGİLERİNİZİ&nbsp;ALINIZ.</p><h6>Özet</h6><p>2027&nbsp;ERKEN&nbsp;KAYIT&nbsp;TÜRKÇE&nbsp;ÖABT&nbsp;VİDEO&nbsp;DERS&nbsp;PAKETİ</p>	11000	15000	t	/uploads/courses/course-41-15f5a2252a3d69f7320847fba5d8ec03.png	t	0	2026-07-27 04:45:32.884	COURSE	{Video}
fa970da4-d5b0-4147-93bb-17c79e258c06	2027 ERKEN KAYIT TÜRKÇE ÖABT CANLI DERS PAKETİ	<h4>Eğitim&nbsp;Hakkında</h4><p><strong>2027&nbsp;TÜRKÇE&nbsp;ÖABT&nbsp;CANLI&nbsp;DERS&nbsp;PAKETİ&nbsp;-&nbsp;ERKEN&nbsp;KAYIT</strong></p><p>&quot;Önce&nbsp;Türkçe&nbsp;ÖABTDEYİZ&nbsp;sonra&nbsp;Türkiye&nbsp;derecesi!&quot;</p><p>✅Canlı&nbsp;ders&nbsp;paketi&nbsp;olup&nbsp;çekilen&nbsp;derslerin&nbsp;tamamı&nbsp;sadece&nbsp;10&nbsp;dakika&nbsp;içerisinde&nbsp;sisteme&nbsp;düşmektedir.</p><p>&nbsp;✅2026&nbsp;ÖABT&nbsp;sınavına&nbsp;yönelik&nbsp;hazırlanan&nbsp;toplam&nbsp;900&nbsp;ders&nbsp;saatinden&nbsp;oluşan&nbsp;ders&nbsp;çekimi,&nbsp;soru&nbsp;çözümü&nbsp;ve&nbsp;kamp&nbsp;uygulamalarının&nbsp;tamamı&nbsp;anında&nbsp;panelinize&nbsp;tanımlanarak&nbsp;aktif&nbsp;hale&nbsp;getirilecektir.&nbsp;</p><p>&nbsp;✅Paneliniz&nbsp;2027&nbsp;ÖABT&nbsp;sınavına&nbsp;kadar&nbsp;aktif&nbsp;halde&nbsp;kalacaktır.&nbsp;</p><p>&nbsp;✅Konu&nbsp;anlatım&nbsp;aralığı&nbsp;2026&nbsp;Ekim&nbsp;Sonu&nbsp;-&nbsp;2027&nbsp;Mayıs&nbsp;Sonu,&nbsp;ders&nbsp;saatleri&nbsp;19.00-22.00</p><p>&nbsp;✅Fark&nbsp;Yaratan&nbsp;Eğitim&nbsp;Modeli:&nbsp;Ara&nbsp;değerlendirme&nbsp;sistemiyle&nbsp;her&nbsp;dersin&nbsp;ünitesi&nbsp;bittiğinde&nbsp;sıcağı&nbsp;sıcağına&nbsp;soru&nbsp;çözümü&nbsp;yapılır.&nbsp;Soru&nbsp;çözmeyi&nbsp;sene&nbsp;sonuna&nbsp;bırakmaz,&nbsp;konuları&nbsp;dönem&nbsp;içinde&nbsp;somutlaştırırsınız.</p><h3><strong>ERKEN&nbsp;KAYIT&nbsp;DÖNEMİ&nbsp;CANLI&nbsp;DERS&nbsp;PAKETİNİN&nbsp;TÜM&nbsp;AVANTAJLARI&nbsp;</strong></h3><p>✅<strong>10&nbsp;ADET&nbsp;TÜRKİYE&nbsp;GENELİ&nbsp;ONLİNE&nbsp;DENEME:</strong>&nbsp;Türkiye&#39;nin&nbsp;kendi&nbsp;alanında&nbsp;en&nbsp;geniş&nbsp;katılımlı&nbsp;denemeleri&nbsp;ve&nbsp;bu&nbsp;denemelerin&nbsp;detaylı&nbsp;video&nbsp;çözümleri.</p><p>&nbsp;​​​​​✅<strong>​​​GENEL&nbsp;TEKRAR&nbsp;KAMPLARI:</strong>&nbsp;Sene&nbsp;ortası&nbsp;ve&nbsp;sene&nbsp;sonu&nbsp;efsane&nbsp;tekrar/soru&nbsp;kampları&nbsp;(En&nbsp;az&nbsp;50&#39;şer&nbsp;saat).</p><p>&nbsp;✅<strong>SORU&nbsp;ÇÖZÜM&nbsp;GRUPLARI:</strong>&nbsp;Binlerce&nbsp;Türkçe&nbsp;öğretmeninden&nbsp;oluşan&nbsp;soru&nbsp;çözüm&nbsp;grupları.&nbsp;Takıldığınız&nbsp;sorularda&nbsp;yalnız&nbsp;değilsiniz.</p><p>&nbsp;✅<strong>BEYİT&nbsp;ŞERHLERİ:</strong>&nbsp;Kurumumuz&nbsp;beyit&nbsp;şerhlerini&nbsp;ayrı&nbsp;bir&nbsp;ders&nbsp;olarak&nbsp;ele&nbsp;alarak&nbsp;uygulamaya&nbsp;dayalı&nbsp;eksiklerinizi&nbsp;gidermek&nbsp;için&nbsp;50&nbsp;ders&nbsp;saati&nbsp;bir&nbsp;eğitim&nbsp;gerçekleştirmektedir.&nbsp;</p><p>&nbsp;✅<strong>DİL&nbsp;BİLGİSİ&nbsp;ÇÖZÜMLEMELERİ:<em>&nbsp;</em></strong>Kurumumuzda&nbsp;dil&nbsp;bilgisi&nbsp;dersinin&nbsp;ana&nbsp;anlatımından&nbsp;sonra&nbsp;konu&nbsp;konu&nbsp;ayrıştırılmış&nbsp;soru&nbsp;çözüm&nbsp;uygulamaları&nbsp;gerçekleştirilmektedir.</p><p>&nbsp;✅<strong>YAYIN&nbsp;DESTEĞİ<em>:</em></strong>&nbsp;Dört&nbsp;Temel&nbsp;Beceri&nbsp;konu&nbsp;anlatım&nbsp;kitabı&nbsp;erken&nbsp;kayıt&nbsp;kapsamında&nbsp;tüm&nbsp;kursiyerlerimize&nbsp;hediye&nbsp;gönderilmektedir.&nbsp;Diğer&nbsp;derslerin&nbsp;konu&nbsp;anlatım&nbsp;fasikülleri&nbsp;sisteme&nbsp;PDF&nbsp;olarak&nbsp;yüklenmekte&nbsp;olup&nbsp;istediğiniz&nbsp;zaman&nbsp;indirebilir&nbsp;veya&nbsp;çıktı&nbsp;alabilirsiniz.&nbsp;</p><p>&nbsp;✅<strong>​​​​​​KESİNTİSİZ&nbsp;REHBERLİK</strong>:<strong><em>&nbsp;</em></strong>Kurumumuzda&nbsp;her&nbsp;ay&nbsp;düzenli&nbsp;rehberlik&nbsp;dersleri&nbsp;yapılmaktadır.&nbsp;Rehberlik&nbsp;derslerimiz&nbsp;Zeynep&nbsp;SALMAN&nbsp;ve&nbsp;Enes&nbsp;Kaan&nbsp;ŞAHİN&nbsp;koordinesinde&nbsp;gerçekleştirilir.</p><p>&nbsp;✅<strong>GÜÇLÜ&nbsp;ALTYAPI:<em>&nbsp;</em></strong>Panelinizde&nbsp;video&nbsp;hızlandırma,&nbsp;video&nbsp;takip,&nbsp;online&nbsp;deneme,&nbsp;sınırsız&nbsp;izleme&nbsp;vb.&nbsp;gibi&nbsp;teknik&nbsp;imkanlar&nbsp;bulunmakta&nbsp;olup&nbsp;çekilen&nbsp;her&nbsp;ders&nbsp;10&nbsp;dakika&nbsp;içinde&nbsp;sisteme&nbsp;düşer.&nbsp;Sınav&nbsp;gününe&nbsp;kadar&nbsp;kesintisiz&nbsp;bir&nbsp;eğitim&nbsp;sunulmaktadır.</p><p>&nbsp;✅<strong>ARA&nbsp;DEĞERLENDİRME&nbsp;SİSTEMİ:<em>&nbsp;</em></strong>Her&nbsp;dersin&nbsp;ardından&nbsp;ara&nbsp;değerlendirme&nbsp;sistemiyle&nbsp;anında&nbsp;soru&nbsp;çözümü&nbsp;gerçekleştirilmektedir.&nbsp;</p><p><strong>TOPLAM&nbsp;HEDEFLENEN&nbsp;DERS&nbsp;SAATİ&nbsp;ASGARİ&nbsp;600&nbsp;SAATTİR.&nbsp;SENE&nbsp;İÇİNDE&nbsp;EN&nbsp;AZ&nbsp;50&nbsp;DERS&nbsp;SAATİ&nbsp;SORU&nbsp;ÇÖZÜMÜ,&nbsp;SENE&nbsp;SONU&nbsp;EN&nbsp;AZ&nbsp;50&nbsp;DERS&nbsp;SAATİ&nbsp;GENEL&nbsp;TEKRAR&nbsp;KAMPI&nbsp;UYGULAMASI&nbsp;YAPILMAKTADIR.&nbsp;</strong></p><p>Her&nbsp;dersin&nbsp;bir&nbsp;ünitesi&nbsp;bittiğinde&nbsp;ilgili&nbsp;alana&nbsp;yönelik&nbsp;SORU&nbsp;ÇÖZÜMÜ&nbsp;düzenlenerek&nbsp;ARA&nbsp;DEĞERLENDİRME&nbsp;gerçekleştirilecektir.&nbsp;</p><p>Sadece&nbsp;sene&nbsp;sonunda&nbsp;değil,&nbsp;sene&nbsp;içinde&nbsp;de&nbsp;soru&nbsp;çözerek&nbsp;konuları&nbsp;daha&nbsp;somut&nbsp;hale&nbsp;getirmeyi&nbsp;amaçlıyoruz.</p><p>⚠️Ders&nbsp;özelinde&nbsp;asgari&nbsp;düzeyde&nbsp;gerçekleştirilecek&nbsp;konu&nbsp;anlatım&nbsp;saatleri&nbsp;aşağıdaki&nbsp;gibidir:</p><p>⏳YENİ&nbsp;TÜRK&nbsp;EDEBİYATI:&nbsp;&nbsp;80&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;Asım&nbsp;Kara&nbsp;Hoca</p><p>&nbsp;⏳EDEBİYAT&nbsp;BİLGİ&nbsp;VE&nbsp;KURAMLARI:&nbsp;&nbsp;30&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;Ali&nbsp;Zeybek&nbsp;Hoca</p><p>&nbsp;⏳ÇOCUK&nbsp;EDEBİYATI:&nbsp;30&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;İsa&nbsp;Kurtul&nbsp;Hoca</p><p>&nbsp;⏳DÖRT&nbsp;TEMEL&nbsp;BECERİ:&nbsp;90&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;Enes&nbsp;Hoca</p><p>&nbsp;⏳ESKİ&nbsp;TÜRK&nbsp;EDEBİYATI&nbsp;:&nbsp;60&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;İlker&nbsp;Hayat&nbsp;Hoca&nbsp;</p><p>&nbsp;⏳BEYİT&nbsp;ŞERHLERİ:&nbsp;&nbsp;50&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;&nbsp;Ali&nbsp;Zeybek&nbsp;-&nbsp;İlker&nbsp;Hayat&nbsp;Hoca</p><p>&nbsp;⏳HALK&nbsp;EDEBİYATI:&nbsp;40&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;Ali&nbsp;Zeybek</p><p>&nbsp;⏳DİL&nbsp;BİLİM&nbsp;BİRİNCİ&nbsp;ANLATIM:&nbsp;40&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;Fatih&nbsp;Bedir&nbsp;Hoca</p><p>&nbsp;⏳DİL&nbsp;BİLİM&nbsp;İKİNCİ&nbsp;ANLATIM:&nbsp;30&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;Enes&nbsp;Hoca</p><p>&nbsp;⏳DİL&nbsp;BİLGİSİ&nbsp;BİRİNCİ&nbsp;ANLATIM:&nbsp;40&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;Fatih&nbsp;Bedir&nbsp;Hoca</p><p>&nbsp;⏳DİL&nbsp;BİLGİSİ&nbsp;İKİNCİ&nbsp;ANLATIM:&nbsp;&nbsp;30&nbsp;DERS&nbsp;SAATİ&nbsp;-&nbsp;Asım&nbsp;Hoca&nbsp;</p><p>⚠️Sistemimizde;&nbsp;Asım&nbsp;Kara&nbsp;-&nbsp;Çocuk&nbsp;Edebiyatı,&nbsp;Fatih&nbsp;&nbsp;Avcı&nbsp;-&nbsp;Halk&nbsp;Edebiyatı/Şerhler,&nbsp;Umut&nbsp;Tulpar&nbsp;Hoca&nbsp;-&nbsp;Dil&nbsp;Bilim/Dil&nbsp;Bilgisi&nbsp;video&nbsp;ders&nbsp;çekimleri&nbsp;de&nbsp;yer&nbsp;almaktadır.&nbsp;</p><p>DİL&nbsp;BİLGİSİ,&nbsp;DİL&nbsp;BİLİM&nbsp;VE&nbsp;BEYİT&nbsp;ŞERHLERİ&nbsp;ÜÇ&nbsp;FARKLI&nbsp;HOCA;&nbsp;ÇOCUK&nbsp;EDEBİYATI&nbsp;VE&nbsp;HALK&nbsp;EDEBİYATI&nbsp;DERSLERİNDE&nbsp;İKİ&nbsp;FARKLI&nbsp;HOCA&nbsp;ANLATIMINDAN&nbsp;YARARLANABİLECEKSİNİZ.&nbsp;</p><p>⚠️<strong>ERKEN&nbsp;KAYIT&nbsp;KAPSAMINDA&nbsp;HER&nbsp;AY&nbsp;FİYAT&nbsp;GÜNCELLEMESİ&nbsp;YAPILMAKTADIR.</strong></p><p>HER&nbsp;SORUNUZ&nbsp;İÇİN&nbsp;WHATSAP&nbsp;İLETİŞİM&nbsp;HATTINA&nbsp;ULAŞABİLİRSİNİZ.&nbsp;SİTEDEKİ&nbsp;WHATSAP&nbsp;SİMGESİNE&nbsp;DOKUNMANIZ&nbsp;YETERLİ:&nbsp;0&nbsp;537&nbsp;743&nbsp;24&nbsp;48</p><p><strong>#BİRLİKTEÇOKDAHAGÜÇLÜ</strong></p><p>PAKETİ&nbsp;SATIN&nbsp;ALDIKTAN&nbsp;SONRA&nbsp;WHATSAAP&nbsp;NUMARASINA&nbsp;YAZARAK&nbsp;PANEL&nbsp;GİRİŞ&nbsp;BİLGİLERİNİZİ&nbsp;ALINIZ.</p><h6>Özet</h6><p>2027&nbsp;ERKEN&nbsp;KAYIT&nbsp;TÜRKÇE&nbsp;ÖABT&nbsp;CANLI&nbsp;DERS&nbsp;PAKETİ</p>	12000	18000	t	/uploads/courses/course-42-cbfe76ac8b0e346abdde2d568861bd0d.png	t	0	2026-07-27 04:45:32.741	COURSE	{Canlı}
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, "userId", "totalAmount", status, "paymentId", "couponId", "createdAt") FROM stdin;
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (id, "orderId", "courseId", price) FROM stdin;
\.


--
-- Data for Name: SupportMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SupportMessage" (id, name, email, phone, message, "isRead", "createdAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, "passwordHash", name, surname, phone, role, "createdAt") FROM stdin;
4e14bfed-d446-407c-8a32-3080e5e04157	admin@turkceoabtdeyiz.com	$2b$10$UjQSkIBWMqc.VYBgljWmZOEaJu4s.9/XdqyAWV15pVpoBAAgY.KGG	Rüstem	Hoca	\N	ADMIN	2026-07-27 03:58:50.632
5b5f06cc-5a25-44af-8135-ba131274a004	ogrenci@email.com	test.toa.2026	Ahmet	Yılmaz	\N	STUDENT	2026-07-27 03:58:50.696
\.


--
-- Data for Name: _CategoryToCourse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_CategoryToCourse" ("A", "B") FROM stdin;
99ff1092-3560-45c9-a56b-8de38fd4b684	1bfa3615-7f26-4f34-a9d4-0922aebbc692
6ec0ab5c-6e86-49c6-af5b-382dbf5aa919	668d3200-9148-4045-aaee-ff0890c55f4c
6ec0ab5c-6e86-49c6-af5b-382dbf5aa919	ca85e9ef-4d18-4935-84ac-d5ac67d6b424
99ff1092-3560-45c9-a56b-8de38fd4b684	fa970da4-d5b0-4147-93bb-17c79e258c06
\.


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: ContentSettings ContentSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContentSettings"
    ADD CONSTRAINT "ContentSettings_pkey" PRIMARY KEY (key);


--
-- Name: Coupon Coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Coupon"
    ADD CONSTRAINT "Coupon_pkey" PRIMARY KEY (id);


--
-- Name: Course Course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: SupportMessage SupportMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupportMessage"
    ADD CONSTRAINT "SupportMessage_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _CategoryToCourse _CategoryToCourse_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_CategoryToCourse"
    ADD CONSTRAINT "_CategoryToCourse_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: Coupon_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Coupon_code_key" ON public."Coupon" USING btree (code);


--
-- Name: Order_paymentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Order_paymentId_key" ON public."Order" USING btree ("paymentId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: _CategoryToCourse_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_CategoryToCourse_B_index" ON public."_CategoryToCourse" USING btree ("B");


--
-- Name: OrderItem OrderItem_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Order Order_couponId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES public."Coupon"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _CategoryToCourse _CategoryToCourse_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_CategoryToCourse"
    ADD CONSTRAINT "_CategoryToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _CategoryToCourse _CategoryToCourse_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_CategoryToCourse"
    ADD CONSTRAINT "_CategoryToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict RgOXihaIjZQqh3yB1gA31MswLcdgKfsUmqNW0UcBqdfzXtdLE1fQ5xa8KYwylp6

