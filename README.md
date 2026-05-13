# 🛡️ Parola Güçlülük Kontrolü (Password Strength Checker)

Bu proje, kullanıcıların belirledikleri parolaların ne kadar güvenli olduğunu anlık olarak test eden, puanlayan ve kullanıcılara daha güvenli parolalar oluşturmaları için rehberlik eden web tabanlı bir uygulamadır.

Bu çalışma, **Gazi Üniversitesi Bilgisayar Mühendisliği Bölümü BMT216 Web Arayüz Geliştirme** dersi proje ödevi kapsamında **Grup 4** tarafından geliştirilmiştir.

## 🌟 Özellikler

* **Anlık Analiz:** Parola yazıldığı anda karakter uzunluğu, büyük/küçük harf, rakam ve özel karakter kullanımı dinamik olarak kontrol edilir.
* **Güvenlik Puanlaması:** Girilen parolaya 0 ile 100 arasında bir güvenlik puanı atanır ve zayıf, orta, güçlü, çok güçlü seviyelerinde derecelendirilir.
* **Sızdırılmış/Yaygın Parola Kontrolü:** "123456", "password", "admin" gibi sık kullanılan güvensiz parolalar tespit edilerek kullanıcı uyarılır.
* **Kırılma Süresi Tahmini:** Girilen parolanın olası bir siber saldırıda (brute-force) ne kadar sürede kırılabileceğine dair tahmini süre sunulur.
* **Örnek Parola Üretici:** Kullanıcı dilerse sistemin sunduğu rastgele, güçlü ve karmaşık parolayı tek tıkla üretip kopyalayabilir.
* **Tam Mobil Uyumluluk:** Responsive tasarım sayesinde telefon, tablet ve masaüstü bilgisayarlarda kusursuz görünüm sağlar.

## 🛠️ Kullanılan Teknolojiler

Projenin geliştirilme sürecinde aşağıdaki web teknolojilerinden yararlanılmıştır:

* **HTML5:** Sayfa iskeleti ve semantik yapı.
* **CSS3 & Bootstrap 5:** Sayfa tasarımı, grid yapısı ve mobil uyumluluk (Responsive Design).
* **JavaScript & jQuery:** DOM manipülasyonu, anlık şifre gücü algoritması hesaplamaları ve etkileşimli bileşenler.
* **Bootstrap Icons:** Arayüzdeki görsel ikonlar.

## 🚀 Kurulum ve Çalıştırma

Proje tamamen istemci taraflı (client-side) çalıştığı için herhangi bir sunucu kurulumuna ihtiyaç duymaz.

1. Bu depoyu bilgisayarınıza klonlayın:
   ```bash
   git clone [https://github.com/kullaniciadiniz/parola-kontrol.git](https://github.com/kullaniciadiniz/parola-kontrol.git)

2. İndirdiğiniz klasörün içindeki index.html dosyasını favori web tarayıcınızda (Chrome, Safari, Firefox vb.) açın.

3. Uygulama anında kullanıma hazırdır!

📝 Lisans
Bu proje eğitim amaçlı geliştirilmiştir. Ticari bir sistemin veya gerçek bir siber güvenlik uygulamasının yerini tutmaz.
