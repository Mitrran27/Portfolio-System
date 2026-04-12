# Portfolio System — Full Stack
> Vue.js + Node.js + Supabase | Admin Panel + Portfolio Site

## 📁 Project Structure

```
portfolio-system/
├── backend/                  # Node.js + Express API (shared)
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js           # JWT login
│   │   ├── messages.js       # Contact messages CRUD
│   │   └── portfolio.js      # Profile, projects, skills, socials
│   ├── middleware/auth.js
│   ├── config/supabase.js
│   └── .env.example
│
├── frontend-portfolio/       # Vue.js public portfolio (port 5173)
│   └── src/components/
│       ├── HeroSection.vue
│       ├── AboutSection.vue
│       ├── SkillsSection.vue
│       ├── ProjectsSection.vue
│       └── ContactSection.vue
│
├── frontend-admin/           # Vue.js admin panel (port 5174)
│   └── src/
│       ├── components/
│       │   ├── ui/           # Modal, Tooltip, Toast, ConfirmDialog
│       │   └── layout/       # Header, Sidebar, MessagesSidebar
│       ├── views/            # Dashboard, Messages, Portfolio, Projects, Skills, Socials
│       └── stores/           # Pinia: auth, messages, portfolio
│
└── database/schema.sql       # Run this in Supabase SQL Editor first
```

---

## 🚀 Setup Guide

### 1. Supabase Setup
1. Go to [supabase.com](https://supabase.com) → New project
2. Open **SQL Editor** → paste contents of `database/schema.sql` → Run
3. Copy your **Project URL** and **service_role key** from Settings → API

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_KEY, JWT_SECRET
npm install
npm run dev        # Runs on http://localhost:3001
```

### 3. Portfolio Frontend
```bash
cd frontend-portfolio
npm install
npm run dev        # Runs on http://localhost:5173
```

### 4. Admin Panel
```bash
cd frontend-admin
npm install
npm run dev        # Runs on http://localhost:5174
```

---

## 🔐 Default Admin Login
After running schema.sql, the default credentials are:
- **Email:** `admin@yourdomain.com`
- **Password:** `Admin@123456`

**⚠️ Change this immediately!** Either update the `admins` table directly in Supabase
or generate a new bcrypt hash with `bcrypt.hashSync('YourPassword', 10)`.

To create a new admin hash via Node.js:
```js
import bcrypt from 'bcryptjs'
console.log(bcrypt.hashSync('YourNewPassword', 10))
```
Then `UPDATE admins SET password_hash = '...' WHERE email = '...'` in Supabase.

---

## 🌟 Features

### Portfolio Site
- Dynamic content from Supabase (profile, projects, skills, socials)
- Typewriter hero animation
- Scroll-triggered section reveals
- Neon cyberpunk v4 aesthetic (Orbitron + Exo 2 fonts)
- Contact form → saves to DB

### Admin Panel
- JWT-authenticated login
- **Dashboard** — stats overview + recent messages
- **Messages** — two-panel view, mark read/unread, delete, reply via email
- **🔔 Notification bell** — live unread count badge, polls every 60s
- **Messages Drawer** — slide-in sidebar accessible from header bell
- **Profile** — edit name, title, bio, location, email, avatar, resume URL
- **Projects** — full CRUD with modal, tech stack, featured flag
- **Skills** — grouped by category, proficiency bar, add/edit/delete
- **Social Links** — manage all social URLs

### Reusable Components (Admin)
| Component | Purpose |
|---|---|
| `AppModal` | Teleported modal with backdrop, slots for body + footer |
| `AppTooltip` | CSS hover tooltip wrapper |
| `AppToast` | Global toast notifications (success/error/info) |
| `ConfirmDialog` | Promise-based confirm modal |
| `AdminHeader` | Sticky header with notification bell + logout |
| `AdminSidebar` | Collapsible nav with unread badge |
| `MessagesSidebar` | Slide-in messages drawer with read/delete/tab-filter |

---

## 🔧 Environment Variables (backend/.env)

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
JWT_SECRET=change-this-to-something-long-and-random
PORT=3001
PORTFOLIO_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

---

## 🌐 Production Deployment

### Backend → Railway / Render / Fly.io
- Set all env vars in platform dashboard
- `npm start`

### Frontends → Vercel / Netlify
- Set `VITE_API_URL` if not using proxy
- Build command: `npm run build`
- Update CORS origins in `backend/server.js`
