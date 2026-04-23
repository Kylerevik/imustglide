# iMUSTGLIDE 🎮

> A full-stack gaming services platform for competitive League of Legends players.  
> **Live site:** [https://imustglide.gg](https://imustglide.gg)

---

## 📌 About

iMUSTGLIDE is a web-based marketplace where players can purchase **ELO boosting**, **coaching sessions**, and **smurf accounts**. The platform features a complete authentication system, role-based access control, a loyalty reward system, Stripe payments, store credits, and dedicated panels for admins, boosters, and coaches.

> ⚠️ **Note:** The source code in this repository is designed to run on a **localhost (MAMP)** environment. The live production version is hosted at [https://imustglide.gg](https://imustglide.gg).

---

## 🚀 Features

- 🔐 Session-based authentication with bcrypt password hashing
- 👥 Role-based access control — `customer`, `booster`, `coach`, `admin`
- ⚔️ ELO Boosting calculator with dynamic pricing
- 🎓 Coaching session packages with specialization selection
- 🛒 Smurf account listings with region filtering
- 💳 Stripe card payments + Store Credits checkout
- 🏆 9-tier loyalty rank system (Starter → Eternal)
- 💎 Loot Points earned on every purchase
- 🎟️ Discount code system with usage limits
- 🛡️ Admin Panel — user management, orders, discount codes
- ⚡ Booster Panel — claim and complete boost orders
- 📚 Coach Panel — claim and complete coaching sessions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| UI Framework | Bootstrap 5.3.2 |
| Backend | PHP 8.3 |
| Database | MySQL 8.0 |
| Local Server | MAMP |
| Live Hosting | Hetzner VPS (CPX22, Nuremberg) |
| Domain | imustglide.gg via Porkbun |
| DNS / CDN | Cloudflare |
| SSL | Let's Encrypt (Certbot) |
| Payments | Stripe API |

---

## 💻 Running Locally (MAMP)

### Prerequisites

- [MAMP](https://www.mamp.info/) installed on your machine
- A browser (Chrome, Firefox, etc.)

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/your-username/imustglide.git
```

**2. Copy the project to MAMP's web root**

Place the project folder inside your MAMP `htdocs` directory:
```
C:\MAMP\htdocs\imustglide\   (Windows)
/Applications/MAMP/htdocs/imustglide/   (macOS)
```

**3. Start MAMP servers**

Open MAMP and click **Start Servers**. Make sure both Apache and MySQL are running (green lights).

**4. Import the database**

- Open [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
- Create a new database named `imustglide`
- Click **Import** → select the `imustglide.sql` file from the project root → click **Go**

**5. Configure the database connection**

Open `config/database.php` and make sure the credentials match your MAMP setup:

```php
$host     = 'localhost';
$dbname   = 'imustglide';
$username = 'root';      // MAMP default
$password = 'root';      // MAMP default
```

**6. Open the project in your browser**

```
http://localhost/imustglide/index.html
```

---

## 👤 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | asdasd |
| Booster | booster@gmail.com | teszt123 |
| Coach | coach@gmail.com | teszt123 |
| Customer | nemtudom@gmail.com | halacska |

---

## 📁 Project Structure

```
imustglide/
├── api/                  # PHP API endpoints
│   ├── login.php
│   ├── register.php
│   ├── logout.php
│   ├── check_session.php
│   ├── get_profile.php
│   ├── update_profile.php
│   ├── get_services.php
│   ├── get_loyalty_info.php
│   ├── confirm_payment.php
│   ├── create_payment_intent.php
│   ├── admin_api.php
│   ├── booster_api.php
│   └── coach_api.php
├── config/
│   └── database.php      # Database connection
├── pics/                 # Images and assets
├── index.html            # Homepage
├── login.html
├── register.html
├── profile.html
├── lol-boosting.html
├── lol-coaching.html
├── lol-smurfs.html
├── admin-panel.html
├── booster-panel.html
├── coach-panel.html
├── checkout.html
├── blog.html
├── *.css                 # Stylesheets
├── *.js                  # Frontend scripts
└── imustglide.sql        # Database export
```

---

## ⚠️ Known Limitations

- **Currency modal** — opens and saves selection visually, but does not recalculate prices (UI only)
- **Language switching** — preference is saved but frontend does not switch text
- **Lootboxes / Affiliate / Discord** — navigation links present but not implemented (coming soon)
- **Achievements** — loyalty system returns empty array, not yet implemented
- **Multi-game** — database structured for multiple games, but only League of Legends content is populated

---

## 👨‍💻 Team

| Name | Role |
|------|------|
| Illés Gergely | Full-Stack Developer |
| Märcz Tádé | Full-Stack Developer |
| Varga Máté | Full-Stack Developer |

**School:** Baranya Vármegyei SZC Radnóti Miklós Közgazdasági Technikum  
**Year:** 2025/2026

---

## 📄 License

This project was created as a final exam project (*vizsgaremek*) and is not licensed for commercial use.
