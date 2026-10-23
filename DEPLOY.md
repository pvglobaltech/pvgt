# ParahVine GlobalTech — Deployment Guide
## Hosting on Render + Connecting www.parahvineglobaltech.com

---

## STEP 1 — Push your code to GitHub

1. Open a terminal in your project folder and run:

```
git add .
git commit -m "Upgrade: Node.js backend with PostgreSQL database"
git push origin main
```

---

## STEP 2 — Create a Render account

- Go to **https://render.com** and sign up (free).
- Connect your **GitHub account** to Render.

---

## STEP 3 — Create a new Web Service on Render

1. Click **"New +"** → **"Web Service"**
2. Select your GitHub repository: **pvgt**
3. Fill in:
   - **Name:** `parahvine-globaltech`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or Starter for always-on)
4. Click **"Create Web Service"**

> Render will automatically detect `render.yaml` and set up the database too.

---

## STEP 4 — Add a PostgreSQL Database on Render

1. In your Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Name it: `parahvine-db`
3. Plan: **Free**
4. Click **"Create Database"**
5. Copy the **"Internal Database URL"**
6. Go to your Web Service → **Environment** tab
7. Add environment variable:
   - Key: `DATABASE_URL`
   - Value: *(paste the Internal Database URL)*

---

## STEP 5 — Add your Email (SMTP) environment variables

In your Web Service → **Environment** tab, add these:

| Key         | Value                                      |
|-------------|---------------------------------------------|
| `SMTP_HOST` | Your email host (e.g. `smtp.zoho.com` or `smtp.gmail.com`) |
| `SMTP_PORT` | `587`                                       |
| `SMTP_SECURE` | `false`                                   |
| `SMTP_USER` | `team@parahvineglobaltech.com`              |
| `SMTP_PASS` | Your email password                         |
| `NODE_ENV`  | `production`                                |

### Getting SMTP settings from Porkbun:
- Log in to **porkbun.com** → go to your domain
- Click **"Email Hosting"** and set up your mailbox for `team@parahvineglobaltech.com`
- Porkbun uses **Zoho Mail** — your SMTP settings will be:
  - Host: `smtp.zoho.com`
  - Port: `587`
  - User: `team@parahvineglobaltech.com`
  - Pass: your Zoho mail password

---

## STEP 6 — Connect your custom domain on Render

1. In your Web Service → **"Settings"** → **"Custom Domains"**
2. Click **"Add Custom Domain"**
3. Enter: `parahvineglobaltech.com` and `www.parahvineglobaltech.com`
4. Render will give you **DNS records** to add

---

## STEP 7 — Add DNS records in Porkbun

1. Log in to **porkbun.com** → click your domain → **"DNS"**
2. Add these records (Render will show you the exact values):

| Type  | Host  | Value / Points To                     |
|-------|-------|---------------------------------------|
| CNAME | www   | your-app-name.onrender.com            |
| A     | @     | (Render's IP address — they'll show it) |

3. Wait 5–30 minutes for DNS to propagate.
4. Render will automatically issue a free **SSL certificate** (HTTPS).

---

## STEP 8 — Test everything

1. Visit `https://www.parahvineglobaltech.com`
2. Go to the **Contact** page and submit a test message
3. Check that:
   - You receive a notification email at `team@parahvineglobaltech.com`
   - The sender receives an auto-reply email
   - The message is stored in the database (check Render PostgreSQL dashboard)

---

## Your website structure

```
pvgt/
├── server.js          ← Node.js/Express backend (NEW)
├── package.json       ← Dependencies (NEW)
├── render.yaml        ← Render deployment config (NEW)
├── .env.example       ← Example environment variables (NEW)
├── .gitignore         ← Keeps .env and node_modules out of GitHub (NEW)
├── index.html         ← Home page (updated email/footer)
├── pvcontactus.html   ← Contact page with real form — NO more Google Form (UPDATED)
├── pvservices.html    ← Services page (updated footer)
├── pvaboutus.html     ← About Us page (updated footer)
├── pvportfolio.html   ← Portfolio page (updated footer)
├── softwarepurchase.html  (updated email)
├── private-policy.html    (updated email)
└── [all images and videos remain as-is]
```

---

## Database

All contact form submissions are saved in a PostgreSQL table called `contact_messages` with these columns:

- `id` — auto-incrementing ID
- `full_name` — sender's name
- `email` — sender's email
- `phone` — sender's phone (optional)
- `subject` — enquiry subject
- `message` — full message
- `submitted_at` — timestamp

You can view them anytime in the **Render PostgreSQL dashboard**.

---

*Built by Kiro for ParahVine GlobalTech — www.parahvineglobaltech.com*
