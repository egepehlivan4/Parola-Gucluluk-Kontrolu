$(document).ready(function () {
  // en cok kullanilan ve aninda kirilan sifreleri ekledik
  const commonPasswords = [
    "123456",
    "12345678",
    "123456789",
    "password",
    "qwerty",
    "abc123",
    "admin",
    "parola",
    "sifre",
    "şifre",
    "fenerbahçe",
    "galatasaray",
    "beşiktaş",
    "trabzonspor"
  ];

  // programdaki kurallarin yesil tik/kirmizi carpi olacagini belirleyen fonksiyon
  function updateRule(id, isOk) {
    const rule = $(id);
    const icon = rule.find("i");

    if (isOk) {
      rule.addClass("ok");
      icon.removeClass("bi-x-circle").addClass("bi-check-circle-fill");
    } else {
      rule.removeClass("ok");
      icon.removeClass("bi-check-circle-fill").addClass("bi-x-circle");
    }
  }

  // puan 0-40 arasi ise kirmizi, 40-70 arasi ise sari, 70-100 arasi ise yesil renk doner
  function getColor(score) {
    if (score < 40) return "#dc3545"; // Bootstrap danger rengi
    if (score < 70) return "#ffc107"; // Bootstrap warning rengi
    return "#198754"; // Bootstrap success rengi
  }

  // puana gore durumu metin olarak yazdirma islemi
  function getLevel(score, length) {
    if (length === 0) return "Parola bekleniyor";
    if (score < 40) return "Zayıf";
    if (score < 70) return "Orta";
    if (score < 90) return "Güçlü";
    return "Çok güçlü";
  }

  // girilen karakterlere bakilarak yapilan tur tahmini icin fonksiyon
  function getPasswordType(password) {
    if (password.length === 0) return "Bekleniyor";
    if (/^[0-9]+$/.test(password)) return "Sadece rakamlı parola";
    if (/^[a-zA-ZçğıöşüÇĞİÖŞÜ]+$/.test(password)) return "Sadece harfli parola";
    if (password.length >= 12) return "Uzun ve karışık parola";
    return "Standart parola";
  }

  // saniye cinsinden kirilma suresini okunabilir metine ceviriyor
  function formatCrackTime(seconds) {
    if (seconds < 1) return "1 saniyeden az";
    if (seconds < 60) return Math.round(seconds) + " saniye";
    if (seconds < 3600) return Math.round(seconds / 60) + " dakika";
    if (seconds < 86400) return Math.round(seconds / 3600) + " saat";
    if (seconds < 2592000) return Math.round(seconds / 86400) + " gün";
    if (seconds < 31536000) return Math.round(seconds / 2592000) + " ay";

    const years = seconds / 31536000;
    if (years < 1000000) return Math.round(years).toLocaleString("tr-TR") + " yıl";
    return years.toExponential(1).replace(".", ",") + " yıl";
  }

  // Biraz matematik: Olası kombinasyon sayısını hesaplayıp saniyede 1 milyar deneme ile bölüyoruz
  function estimateCrackTime(password) {
    if (password.length === 0) return "Bekleniyor";

    const lowerPassword = password.toLowerCase();
    const uniqueChars = new Set(lowerPassword).size;
    const isCommon = commonPasswords.includes(lowerPassword);
   
    // girilen sifrenin icinde bilindik sifreler varsa true doner
    const hasCommonPart = commonPasswords.some(function (item) {
      return lowerPassword.includes(item) && lowerPassword !== item;
    });

    if (isCommon) return "çok kısa";

    let charsetSize = 0;
 
    // turkce karakterleri de hesaplamaya ekledik
    if (/[a-zçğıöşü]/.test(password)) charsetSize += 32;
    if (/[A-ZÇĞİÖŞÜ]/.test(password)) charsetSize += 32;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^A-Za-zÇĞİÖŞÜçğıöşü0-9\s]/.test(password)) charsetSize += 32;
    if (/\s/.test(password)) charsetSize += 1;

    let effectiveLength = password.length;
    charsetSize = Math.max(charsetSize, uniqueChars, 1);

    // ayni harf tekrari varsa veya abcd gibi siraliysa uzunluktan dusup zayiflatma islemi
    if (/(.)\1\1/i.test(password)) effectiveLength *= 0.5;
    if (uniqueChars <= 3) effectiveLength = Math.min(effectiveLength, uniqueChars + 2);
    if (/abc|abcd|1234|2345|3456|4567|5678|6789|qwerty|asdf/i.test(password)) effectiveLength -= 3;
    if (/^[0-9]+$/.test(password)) effectiveLength -= 2;
    if (hasCommonPart) effectiveLength -= 4;

    effectiveLength = Math.max(1, Math.round(effectiveLength));

    // saniyede 1 milyar deneme varsayiyoruz
    const guessesPerSecond = 1000000000;
    const totalGuesses = Math.pow(charsetSize, effectiveLength);
    const averageSeconds = totalGuesses / guessesPerSecond / 2;

    return formatCrackTime(averageSeconds);
  }

  // puanlama algoritmasi
  function analyzePassword(password) {
    const lowerPassword = password.toLowerCase();
    const uniqueChars = new Set(lowerPassword).size;
    const hasOnlyOneRepeatedChar = password.length > 0 && uniqueChars === 1;
    const containsCommonPassword = commonPasswords.some(function (item) {
      return lowerPassword.includes(item) && lowerPassword !== item;
    });

    // kural degiskenleri, regex ile string icinde harf/sayi araniyor
    const rules = {
      length: password.length >= 8,
      upper: /[A-ZÇĞİÖŞÜ]/.test(password),
      lower: /[a-zçğıöşü]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-zÇĞİÖŞÜçğıöşü0-9\s]/.test(password),
      notCommon: password.length > 0 && !commonPasswords.includes(lowerPassword) && !containsCommonPassword
    };

    let score = 0;
    let suggestions = [];

    // kutu bos ise her sey sifirlanir
    if (password.length === 0) {
      return { score, rules, suggestions: ["Parola yazınca öneriler burada gösterilecek."] };
    }

    // karakter sayisi uzadikca puan kazanma islemi
    const firstPart = Math.min(password.length, 8) * 5;
    const secondPart = Math.max(0, Math.min(password.length, 12) - 8) * 5;
    const thirdPart = Math.max(0, Math.min(password.length, 16) - 12) * 3;
    const extraPart = Math.min(Math.max(0, password.length - 16) * 1, 8);
    const lengthScore = firstPart + secondPart + thirdPart + extraPart;

    let varietyScore = 0;
 
    // kucuk, buyuk harf, rakam, ozel karakter varsa ekstra puan veren, yoksa tavsiye kutusunda mesaj gosteren islemler
    if (rules.lower) varietyScore += 4;
    else suggestions.push("Küçük harf eklemek okunabilir ve dengeli bir parola oluşturur.");

    if (rules.upper) varietyScore += 5;
    else suggestions.push("Büyük harf eklemek skoru biraz artırır, ancak uzunluk tek başına da değerlidir.");

    if (rules.number) varietyScore += 6;
    else suggestions.push("Rakam eklemek ek çeşitlilik sağlar.");

    if (rules.symbol) varietyScore += 7;
    else suggestions.push("Özel karakter eklemek ek bonus sağlar. Örneğin !, ?, @ gibi.");

    if (/\s/.test(password) && password.length >= 14) varietyScore += 3;

    let uniqueScore = 0;
    if (!hasOnlyOneRepeatedChar) {
      uniqueScore = Math.min(10, Math.max(0, uniqueChars - 1));
    }

    let penalty = 0; // basit sifre girenlerin puani kirilir

    if (commonPasswords.includes(lowerPassword)) {
      penalty += 45;
      suggestions.push("Bu parola çok yaygın. Daha özgün bir parola seçin.");
    } else if (containsCommonPassword) {
      penalty += 20;
      suggestions.push("Parolanın içinde yaygın bir kelime veya parola kalıbı geçiyor.");
    }

    if (/^[0-9]+$/.test(password)) {
      penalty += 20;
      suggestions.push("Sadece rakamlardan oluşan parolalar daha kolay tahmin edilebilir.");
    }

    if (/(.)\1\1/i.test(password)) {
      penalty += 18;
      suggestions.push("Aynı karakteri art arda tekrar etmekten kaçının.");
    }

    if (password.length >= 8 && uniqueChars <= 3) {
      penalty += 25;
      suggestions.push("Benzersiz karakter sayısı çok düşük. Daha farklı harfler veya kelimeler kullanın.");
    }

    if (/abc|abcd|1234|2345|3456|4567|5678|6789|qwerty|asdf/i.test(password)) {
      penalty += password.length < 8 ? 15 : (password.length < 14 ? 8 : 10);
      suggestions.push("Sıralı karakter kalıpları tahmin edilebilir olduğu için ceza alır.");
    }

    if (password.length < 8) {
      suggestions.push("Parolanızı en az 8 karakter yapın.");
    } else if (password.length < 12) {
      suggestions.push("12 karakter ve üzeri parolalar daha güvenlidir.");
    } else if (password.length < 16) {
      suggestions.push("16 karaktere yaklaşmak skoru belirgin şekilde artırır.");
    }

    // toplami hesaplayip 0-100 arasi puanliyoruz
    score = lengthScore + varietyScore + uniqueScore - penalty;
    score = Math.max(0, Math.min(100, Math.round(score)));

    // puan durumuna gore oneri gosterilir
    if (score >= 90) {
      suggestions = ["Parolanız çok güçlü görünüyor. Farklı hesaplarda aynı parolayı kullanmayın."];
    } else if (score >= 75 && suggestions.length === 0) {
      suggestions = ["Parolanız güçlü görünüyor. Daha fazla çeşitlilik isterseniz rakam veya özel karakter ekleyebilirsiniz."];
    } else if (score >= 60 && suggestions.length === 0) {
      suggestions = ["Parolanız orta-iyi seviyede. Biraz daha uzun yapmak veya çeşitlilik eklemek iyi olur."];
    }

    return { score, rules, suggestions };
  }

  // html arayuzunu guncelleyen tetikleyici fonksiyon
  function updateUI() {
    const password = $("#passwordInput").val(); // jQuery ile inputun degerini aliyoruz
    const result = analyzePassword(password);
    const color = getColor(result.score);
    const level = getLevel(result.score, password.length);

    // secicilerle html elementlerine hesaplanan degerleri basiyoruz
    $("#scoreNumber").text(result.score).css("color", color);
    $("#scoreInfo").text(result.score + " / 100");
    $("#strengthText").text(level).css("color", color);
    $("#scoreBar").css({ width: result.score + "%", backgroundColor: color });

    updateRule("#ruleLength", result.rules.length);
    updateRule("#ruleUpper", result.rules.upper);
    updateRule("#ruleLower", result.rules.lower);
    updateRule("#ruleNumber", result.rules.number);
    updateRule("#ruleSymbol", result.rules.symbol);
    updateRule("#ruleCommon", result.rules.notCommon);

    // map ile string dizisini HTML <div> elemanlarina cevirip birlestiriyoruz
    const suggestionHtml = result.suggestions.map(function (item) {
      return "<div><i class='bi bi-info-circle me-1'></i>" + item + "</div>";
    }).join("");

    $("#suggestionBox").html(suggestionHtml);
    $("#passwordType").text(getPasswordType(password));
    $("#passwordStatus").text(level);
    $("#crackTime").text(estimateCrackTime(password));
  }

  // rastgele bir karakter cekmek icin yardimci fonksiyon
  function randomFrom(text) {
    return text[Math.floor(Math.random() * text.length)];
  }

  // butona basinca otomatik sifre ureten fonksiyon
  function generatePassword() {
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // karismamasi icin O, I gibi harfleri eliyoruz
    const lower = "abcdefghijkmnopqrstuvwxyz"; // l harfini eliyoruz
    const numbers = "23456789"; // 0 ve 1'i eliyoruz
    const symbols = "!@#$%?";
    const all = upper + lower + numbers + symbols;

    let password = "";
    // en az 1 tane buyuk, kucuk, sayi ve sembol garanti olmasini sagliyoruz
    password += randomFrom(upper);
    password += randomFrom(lower);
    password += randomFrom(numbers);
    password += randomFrom(symbols);

    // ustune 8 tane daha rastgele karakter ekleyip 12'ye tamamlıyoruz
    for (let i = 0; i < 8; i++) {
      password += randomFrom(all);
    }

    // garanti eklenen karakterler hep basta kalmamasini sagliyoruz, bunun icin dizi karistiriliyor
    return password.split("").sort(function () {
      return Math.random() - 0.5;
    }).join("");
  }

  // olay dinleyiciler
  // klavyeden her harf basildiginda arayuz guncellenir
  $("#passwordInput").on("input", updateUI);

  // goz ikonuna basildiginda sifreyi açik metne veya tekrar noktalara ceviriyor
  $("#showBtn").on("click", function () {
    const input = $("#passwordInput");
    const icon = $(this).find("i");
    const isHidden = input.attr("type") === "password";

    input.attr("type", isHidden ? "text" : "password");
    icon.toggleClass("bi-eye bi-eye-slash");
  });

  // inputun icini bosaltma butonu
  $("#clearBtn").on("click", function () {
    $("#passwordInput").val("");
    updateUI(); // sifirlandiktan sonra bar vb geri cekmesi icin UI tekrar cagiriliyor
  });

  // parola uretme butonu
  $("#generateBtn").on("click", function () {
    const password = generatePassword();
    $("#generatedPassword").text(password);
    $("#passwordInput").val(password); // inputa da atiyoruz ki direkt bar puanı hesaplansın
    updateUI();
  });

  // kopyala butonu
  $("#copyBtn").on("click", function () {
    const text = $("#generatedPassword").text();

    if (text === "Henüz parola üretilmedi.") {
      alert("Önce parola üretin.");
      return;
    }

    navigator.clipboard.writeText(text);
  });

  // sayfa ilk yuklendiginde bekleniyor vb. yaziların gelmesi icin bos calistiriyoruz
  updateUI();
});