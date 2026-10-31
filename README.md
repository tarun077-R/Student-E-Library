# 📚 Student E-Library — Modern Full-Stack Book Reading Platform

A premium full-stack digital library and reading management platform built with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **MongoDB Atlas (Mongoose)**, and **Cloudinary**.

Students can browse an interactive catalog, read books distraction-free with customizable themes and zoom, manage personal reading shelves via an interactive Kanban board, and track their reading progress in real-time.

---

## ✨ Features

- ⚡ **Next.js 14+ App Router & TypeScript:** Single unified codebase replacing separate Express and Vite projects with serverless-ready architecture.
- 🔐 **HTTP-Only Cookie JWT & Edge Middleware:** Sub-millisecond route guarding (`middleware.ts`) powered by `jose` for `/shelf` and `/admin` routes.
- 💾 **Serverless Mongoose Connection Pooling:** Cached singleton pattern in `@/lib/db.ts` to prevent database connection exhaustion.
- 🎨 **Modern Digital Library UI/UX:**
  - Deep dark slate & light mode theme toggle with subtle ambient glows and smooth transitions.
  - Glassmorphic navigation bars (`backdrop-blur-xl`).
  - Interactive 3D hover cards with category badges, star ratings, and instant shelf actions.
  - Real-time catalog search and category quick pills.
- 📖 **Distraction-Free PDF Reader (`/books/[id]/read`):**
  - High-performance reader powered by a dedicated streaming proxy route (`/api/books/[id]/pdf`) to eliminate CORS restrictions.
  - Auto-hiding control docks on inactivity.
  - Reading themes: **Slate Dark**, **Warm Sepia**, and **Paper Light**.
  - Precise page navigation, zoom slider (50% – 200%), and chapter outline sidebar.
  - Automatic progress synchronization to the user's shelf.
- 📚 **Personal Shelf Kanban Board (`/shelf`):**
  - Drag / toggle categorization: **Currently Reading**, **Want to Read (Saved)**, and **Completed**.
  - Dynamic completion progress bars with page tracking (`Page X of Y`).
  - Quick update progress modal.
- 🛡️ **Administrative Analytics & Book Manager (`/admin`):**
  - KPI summary dashboard (Total Books, Registered Students, Active Readers, Total Shelved, Genre split).
  - Searchable catalog management table with quick actions.
  - Dynamic drag-and-drop cover & PDF uploader with live preview card before publishing.
- 🔍 **SEO & Server Components:**
  - Dynamic OpenGraph and Twitter card metadata generation (`generateMetadata`).
  - Schema.org `Book` JSON-LD structured data for Google Search indexing.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript 5+
- **Styling:** Tailwind CSS, Lucide React icons, Next-Themes
- **Database:** MongoDB Atlas via Mongoose
- **Authentication:** JWT, Jose (Edge runtime), Bcryptjs, HTTP-only secure cookies
- **Storage & Streaming:** Cloudinary Node SDK

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node v20/v22)
- MongoDB Atlas cluster
- Cloudinary account

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/tarunrwat/Student-E-Liberary.git
cd Student-E-Liberary
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Seeding (Optional)
Seed the initial demo admin and student accounts:
```bash
npx tsx scripts/seed.ts
```
* **Admin Login:** `admin@elibrary.com` / `Admin@123456`
* **Student Login:** `student@elibrary.com` / `Student@123456`

### 5. Running the Application
#### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Production Build
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx                # Root layout with ThemeProvider, AuthProvider, Navbar, Footer
│   ├── page.tsx                  # Landing page (hero, stats, featured books)
│   ├── books/
│   │   ├── page.tsx              # Catalog browsing with real-time filters & search
│   │   └── [id]/
│   │       ├── page.tsx          # Book details with dynamic SEO metadata
│   │       └── read/
│   │           └── page.tsx      # Distraction-free PDF reader interface
│   ├── shelf/
│   │   └── page.tsx              # User shelf (Kanban board & tabbed view)
│   ├── admin/
│   │   └── page.tsx              # Admin analytical dashboard & book manager
│   ├── login/
│   │   └── page.tsx              # Glassmorphic user login
│   ├── register/
│   │   └── page.tsx              # Glassmorphic user registration
│   └── api/
│       ├── auth/                 # Login, register, logout, me
│       ├── books/                # Books CRUD & PDF streaming proxy
│       ├── shelf/                # Shelf items & reading progress tracking
│       ├── stats/                # Admin analytics KPIs
│       └── upload/               # Cloudinary multipart upload handler
├── components/
│   ├── navbar.tsx                # Glassmorphic top navigation bar
│   ├── footer.tsx                # Clean modern footer
│   ├── theme-toggle.tsx          # Slate dark / light mode toggle
│   ├── book-card.tsx             # 3D interactive hover book card
│   ├── book-filters.tsx          # Real-time search bar & category quick pills
│   ├── pdf-reader/               # Viewer, toolbar, and outline sidebar
│   ├── shelf/                    # Kanban board & progress update modal
│   └── admin/                    # KPI cards, book table & drag-and-drop uploader
├── context/
│   └── auth-context.tsx          # Client authentication state hook
├── lib/
│   ├── db.ts                     # Cached Mongoose connection singleton
│   ├── models/                   # User and Book schemas
│   ├── auth.ts                   # Node JWT & bcrypt utilities
│   ├── edge-auth.ts              # Edge JWT verification with jose
│   └── cloudinary.ts             # Cloudinary stream upload helper
├── middleware.ts                 # Next.js Edge Middleware for route protection
└── types/                        # TypeScript interfaces
```

---

## 👨‍💻 Developer
Crafted with ❤️ by **Tarun Rawat**
