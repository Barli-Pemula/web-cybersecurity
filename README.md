# Personal Digital Threat Detector 🛡️

Aplikasi web edukatif interaktif untuk meningkatkan kesadaran keamanan digital pemula. Dirancang dengan estetika "doodle" yang ramai dan menyenangkan, aplikasi ini mengajarkan konsep cybersecurity dasar melalui alat interaktif dan konten edukatif.

## 🎯 Tujuan Aplikasi

Personal Digital Threat Detector bertujuan untuk:

1. **Mengedukasi Pemula**: Membuat cybersecurity accessible untuk semua orang, bukan hanya technical experts
2. **Interaktif & Engaging**: Menggunakan animasi dan visual yang menyenangkan untuk meningkatkan engagement
3. **Praktis & Actionable**: Memberikan tools nyata yang dapat digunakan sehari-hari untuk melindungi diri
4. **Berbasis Sains**: Semua algoritma didasarkan pada prinsip cybersecurity yang sebenarnya

## ✨ Fitur Utama

### 1. Home/Dashboard (Halaman Utama)
- **Hero Section**: Pengenalan aplikasi dan value proposition
- **Security Statistics**: Menampilkan statistik real-world tentang ancaman digital
- **Security Tips**: 4 tips essensial untuk keamanan digital
- **Quick Links**: Akses cepat ke fitur Password Checker, URL Checker, dan 2FA Checker
- **Doodle Elements**: Geometric shapes animasi untuk visual interest

### 2. Password Strength Checker 🔐
Menganalisis kekuatan password secara real-time dengan:

#### Fitur Utama:
- **Real-Time Analysis**: Feedback langsung saat mengetik
- **Entropy Calculation**: Menghitung randomness password menggunakan formula: `E = log2(R^L)`
  - R = character set size (26 lowercase + 26 uppercase + 10 digits + 32 special chars = 94)
  - L = password length
- **Brute-Force Time Estimation**: Estimasi waktu crack dengan GPU modern (~1 miliar guesses/detik)
- **Character Type Analysis**: Menganalisis uppercase, lowercase, numbers, special characters
- **Pattern Detection**: Mendeteksi common patterns (repeated chars, sequential, dictionary words)
- **Visual Strength Meter**: Progress bar dengan color coding (weak/fair/good/strong/very-strong)
- **Actionable Recommendations**: Saran spesifik untuk meningkatkan password

#### Konsep Cybersecurity:
```
PASSWORD ENTROPY FORMULA:
Entropy = password_length × log2(charset_size)

Contoh "Kx9#mP2@Lq":
- Length = 10
- Charset = 94 (semua tipe karakter)
- Entropy = 10 × log2(94) ≈ 65.7 bits
- Crack Time: Jutaan tahun dengan brute-force

REAL-WORLD CONTEXT:
- Brute-force adalah worst-case scenario
- Kebanyakan breaches menggunakan: dictionary attacks, rainbow tables, social engineering
- Strong password melindungi terhadap SEMUA metode attack
```

### 3. URL Phishing Checker 🔗
Mendeteksi suspicious URLs menggunakan pattern recognition:

#### Fitur Utama:
- **Real-Time URL Analysis**: Parsing dan analisis URL saat diketik
- **Typosquatting Detection**: Mendeteksi character substitution attacks
  - 0 (zero) vs O (letter)
  - 1 (one) vs I/L (letters)
  - 5 (five) vs S (letter)
  - Missing vowels
  - Repeated characters
- **Protocol Check**: HTTPS vs HTTP (encryption indicator)
- **Domain Verification**: Mengidentifikasi domain sebenarnya vs subdomain
- **Subdomain Spoofing Detection**: Mendeteksi `google.com.attacker.com` pattern
- **Suspicious Path Detection**: Login, verify, redirect parameters
- **Risk Scoring**: 0-100 score dengan risk levels (safe/suspicious/dangerous)
- **Educational Explanations**: Penjelasan untuk setiap deteksi

#### Konsep Cybersecurity:
```
URL STRUCTURE:
https://subdomain.example.com:443/path?query=value#fragment
|      |         |       |    |    |    |      |        |
Protocol Domain  Subdomain TLD Port Path Query String Fragment

PHISHING TACTICS:
1. TYPOSQUATTING: gooqle.com (q vs o), amaz0n.com (0 vs o)
2. SUBDOMAIN SPOOFING: google.com.attacker.com (attacker.com adalah real domain)
3. PROTOCOL DOWNGRADE: http:// vs https:// (no encryption)
4. SUSPICIOUS PATHS: /login, /verify, /redirect

REAL-WORLD CONTEXT:
- 90% breaches dimulai dengan phishing emails
- Humans adalah weakest link dalam security
- URL analysis adalah first line of defense
```

### 4. Two-Factor Authentication (2FA) Checker 🔐
Membandingkan metode 2FA dan membantu memilih yang terbaik untuk setiap skenario:

#### Fitur Utama:
- **Method Comparison**: Perbandingan detail SMS, Authenticator App, dan Biometric
- **Security Scoring**: Rating 0-100 untuk setiap metode
- **Use Case Analysis**: Rekomendasi berdasarkan personal, banking, atau work accounts
- **Vulnerability Assessment**: Penjelasan kerentanan setiap metode (SIM swapping, interception)
- **Technical Details**: Cara kerja, recovery options, dan best practices
- **Interactive Selection**: Pilih metode untuk melihat pros/cons detail
- **Educational Content**: Penjelasan lengkap tentang 2FA dan real-world attacks

#### Konsep Cybersecurity:
```
TWO-FACTOR AUTHENTICATION (2FA):
- Requires: "Something you know" (password) + "Something you have" (device)
- Or: "Something you know" + "Something you are" (biometric)
- Security Principle: Defense in depth - attacker harus compromise DUA sistem

METHOD COMPARISON:
1. SMS (Low Security - 40/100)
   - Vulnerable to SIM swapping, interception
   - Works on any phone
   - Slower than other methods

2. Authenticator App (High Security - 85/100)
   - Uses TOTP (Time-based One-Time Password)
   - Immune to SIM swapping
   - Works offline
   - Requires backup codes

3. Biometric (Highest Security - 95/100)
   - Fingerprint, face recognition
   - Tied to device, can't be intercepted
   - Fastest and most convenient
   - Requires device with biometric hardware

REAL-WORLD CONTEXT:
- SIM Swapping: Attacker convinces carrier to transfer phone number
- SMS Interception: Possible dengan compromised carrier atau network access
- 2FA blocks 99.9% of account takeover attacks
- Enable 2FA on ALL accounts that support it
```

## 🎨 Design System - Doodle Aesthetic

### Color Palette
- **Primary (Teal)**: `oklch(0.55 0.15 200)` - Trust, security, calm
- **Accent (Coral)**: `oklch(0.65 0.18 30)` - Attention, warning, action
- **Secondary (Mustard)**: `oklch(0.75 0.15 60)` - Energy, optimism
- **Tertiary (Lavender)**: `oklch(0.70 0.12 280)` - Creativity, balance
- **Background (Cream)**: `oklch(0.97 0.01 70)` - Warm, approachable

### Design Elements
- **Geometric Shapes**: Circles, squares, blobs dengan soft shadows
- **Animations**: Framer Motion untuk smooth transitions dan micro-interactions
- **Typography**: Bold sans-serif headers untuk contrast dengan floating visual elements
- **Spacing**: Consistent padding dan margins untuk visual hierarchy

## 🚀 Cara Menjalankan Project

### Prerequisites
- Node.js 18+ (project menggunakan Node 22.13.0)
- pnpm (package manager)

### Setup Lokal

1. **Clone atau navigate ke project directory**
   ```bash
   cd /home/ubuntu/personal-digital-threat-detector
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Jalankan development server**
   ```bash
   pnpm dev
   ```
   Server akan berjalan di `http://localhost:3000`

4. **Buka di browser**
   - Navigasi ke `http://localhost:3000`
   - Atau akses public URL yang disediakan oleh dev server

### Build untuk Production

```bash
pnpm build
pnpm start
```

### Menjalankan Tests

```bash
pnpm test
```

Tests mencakup:
- Password Strength Checker logic (entropy, crack time estimation)
- URL Phishing Checker logic (URL parsing, typosquatting detection)
- Authentication flow

## 📁 Struktur Project

```
personal-digital-threat-detector/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx                 # Halaman utama dengan statistics & tips
│   │   │   ├── PasswordChecker.tsx      # Password strength analyzer
│   │   │   ├── PasswordChecker.test.ts  # Password logic tests
│   │   │   ├── URLChecker.tsx           # Phishing detector
│   │   │   └── URLChecker.test.ts       # URL logic tests
│   │   ├── components/
│   │   │   ├── DoodleLayout.tsx         # Global navigation & layout
│   │   │   ├── DoodleShape.tsx          # Decorative geometric shapes
│   │   │   ├── AnimatedCard.tsx         # Reusable card with animations
│   │   │   └── InfoTooltip.tsx          # Educational tooltips
│   │   ├── App.tsx                      # Routes & layout wrapper
│   │   ├── index.css                    # Global styles & design system
│   │   └── main.tsx                     # React entry point
│   ├── public/
│   │   └── favicon.ico
│   └── index.html
├── server/
│   ├── routers.ts                       # tRPC procedures
│   ├── db.ts                            # Database queries
│   └── _core/                           # Framework internals
├── drizzle/
│   └── schema.ts                        # Database schema
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 🔐 Cybersecurity Concepts Explained

### Password Entropy
Password entropy mengukur randomness dan complexity. Formula: `E = log2(R^L)`
- Semakin tinggi entropy, semakin sulit di-crack
- Minimum recommended: 50 bits (untuk personal use)
- Strong: 70+ bits (untuk sensitive accounts)

### Brute-Force Attack Time
Estimasi berdasarkan:
- Modern GPU: ~1 miliar guesses per detik
- Average case: Found at 50% of attempts (hence /2)
- Formula: `Time = (2^entropy / 2) / guesses_per_second`

### Phishing Detection
Menggunakan pattern recognition untuk:
- Typosquatting (character substitution)
- Subdomain spoofing
- Protocol downgrade (HTTP vs HTTPS)
- Suspicious paths dan parameters

## 📚 Educational Content

Setiap halaman mencakup:
- **Detailed Comments**: Kode dijelaskan dengan komentar cybersecurity yang detail
- **Info Tooltips**: Hover untuk penjelasan konsep
- **Real-World Examples**: Contoh attack nyata dan bagaimana melindungi diri
- **Actionable Tips**: Langkah konkret untuk meningkatkan security

## 🎓 Learning Outcomes

Setelah menggunakan aplikasi ini, pengguna akan memahami:
1. Apa itu password entropy dan mengapa penting
2. Bagaimana password cracking bekerja di dunia nyata
3. Taktik phishing umum dan cara mengidentifikasinya
4. Best practices untuk keamanan digital sehari-hari
5. Mengapa cybersecurity adalah tanggung jawab bersama

## 🔧 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **Animation**: Framer Motion
- **Backend**: Express.js, tRPC
- **Database**: MySQL/TiDB dengan Drizzle ORM
- **Build Tool**: Vite
- **Testing**: Vitest
- **Routing**: Wouter (client-side)
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React

## 🎯 Design Philosophy

### Untuk Pemula
- Tidak ada jargon teknis yang berlebihan
- Visual yang friendly dan approachable
- Penjelasan step-by-step untuk setiap konsep

### Interaktif & Engaging
- Real-time feedback saat user input
- Smooth animations untuk visual delight
- Doodle elements untuk mengurangi "security fatigue"

### Akurat & Edukatif
- Semua algoritma berdasarkan cybersecurity principles
- Detailed comments menjelaskan logika
- Real-world context untuk setiap konsep

## 📝 Contoh Penggunaan

### Password Checker
1. User membuka halaman Password Checker
2. Mengetik password (misalnya "MyP@ssw0rd123")
3. Aplikasi menampilkan:
   - Strength level: "Strong"
   - Entropy: ~65 bits
   - Crack time: ~1000 years
   - Feedback: "Good password length", "Excellent character diversity"
   - Recommendations: "Consider using 12+ characters"

### URL Checker
1. User membuka halaman URL Checker
2. Paste URL (misalnya "https://www.amaz0n.com")
3. Aplikasi menampilkan:
   - Risk level: "Suspicious"
   - Issues: "Contains 0 (zero) - verify this is not a typo"
   - Components breakdown: Protocol, domain, TLD
   - Educational explanation: Typosquatting attack example

## 🤝 Contributing

Untuk menambah fitur atau memperbaiki bug:
1. Buat branch baru: `git checkout -b feature/nama-fitur`
2. Commit changes: `git commit -m "Add: deskripsi fitur"`
3. Push ke branch: `git push origin feature/nama-fitur`
4. Buat Pull Request

## 📄 License

MIT License - Bebas digunakan untuk tujuan edukatif dan komersial

## 🙋 Support & Feedback

Untuk pertanyaan, saran, atau laporan bug:
- Buat issue di repository
- Hubungi tim development
- Berikan feedback tentang pengalaman pengguna

## 🎉 Acknowledgments

Aplikasi ini dibuat dengan passion untuk cybersecurity education dan user experience design. Terima kasih kepada:
- Cybersecurity community untuk best practices
- Framer Motion untuk animation library yang powerful
- Tailwind CSS untuk utility-first CSS framework
- Semua pengguna yang memberikan feedback

---

**Happy Learning! 🚀 Lindungi diri Anda dari ancaman digital dengan pengetahuan dan tools yang tepat.**
