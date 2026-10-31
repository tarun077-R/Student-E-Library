# System Design Specification: Next.js 14+ Migration & Modern UI/UX Overhaul

- **Project:** Student E-Library (`student-e-library`)
- **Date:** October 31, 2026
- **Status:** Approved / In Progress
- **Target Architecture:** Next.js 14+ App Router, Full-Stack TypeScript, Tailwind CSS, Mongoose Serverless Cache, Jose Edge Middleware, Cloudinary Streaming

---

## 1. Executive Summary
The goal of this project is to refactor and migrate the existing MERN stack ("student-e-library") into a unified, high-performance Next.js 14+ (App Router) codebase running TypeScript and Tailwind CSS. The migration eliminates separate frontend/backend repositories, implements connection-cached serverless database pooling, leverages Edge Middleware for route protection, enables rich dynamic Server Component SEO metadata, and completely overhauls the UI/UX into a modern digital library dashboard with light/dark themes, an interactive catalog, a distraction-free PDF reader, a Kanban user shelf, and an analytical admin suite.

---

## 2. Architecture & Tech Stack

### 2.1 Core Technologies
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript 5+ (Strict Mode)
- **Styling:** Tailwind CSS with `@tailwindcss/typography`, custom glassmorphism utilities, and glowing accent borders
- **Database:** MongoDB Atlas via Mongoose with global connection caching
- **Authentication:** HTTP-only secure cookie with JWT; Edge Runtime verification via `jose`; Node runtime via `jsonwebtoken` and `bcryptjs`
- **File Storage:** Cloudinary for cover images and raw PDF storage
- **PDF Delivery:** Next.js Route Handler streaming proxy (`/api/books/[id]/pdf`) to eliminate cross-origin restrictions for client-side canvas rendering
- **Icons & Theme:** `lucide-react`, `next-themes` (Dark/Light mode support)

### 2.2 Directory Layout
```
student-e-library/
├── app/
│   ├── layout.tsx                # Root layout with ThemeProvider, AuthProvider, Navbar, Footer
│   ├── page.tsx                  # Landing page with hero, featured books, and category highlights
│   ├── books/
│   │   ├── page.tsx              # Catalog browsing (server rendered, real-time filters, search)
│   │   └── [id]/
│   │       ├── page.tsx          # Book details with dynamic SEO metadata & CTA
│   │       └── read/
│   │           └── page.tsx      # Distraction-free PDF reader UI
│   ├── shelf/
│   │   └── page.tsx              # User shelf (Kanban & tabbed views, reading progress bars)
│   ├── admin/
│   │   └── page.tsx              # Admin analytical dashboard & book upload/management
│   ├── login/
│   │   └── page.tsx              # Glassmorphic user login page
│   ├── register/
│   │   └── page.tsx              # Glassmorphic user registration page
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   ├── books/
│   │   │   ├── route.ts          # GET books (with search & filters), POST book (admin)
│   │   │   └── [id]/
│   │   │       ├── route.ts      # GET book, PUT book, DELETE book
│   │   │       └── pdf/route.ts  # Binary streaming proxy for PDF reader
│   │   ├── shelf/
│   │   │   ├── route.ts          # GET user shelf items, POST toggle/add book
│   │   │   └── progress/route.ts # PATCH update reading progress (page, status)
│   │   ├── stats/route.ts        # Admin analytics KPI data
│   │   └── upload/route.ts       # Cloudinary upload handler (PDF and cover image)
│   └── globals.css               # Tailwind directives, theme variables, glassmorphism
├── components/
│   ├── navbar.tsx                # Glassmorphic navigation header
│   ├── footer.tsx                # Clean footer
│   ├── theme-toggle.tsx          # Deep dark / light mode toggle
│   ├── book-card.tsx             # Interactive hover card with badges & shelf quick-add
│   ├── book-filters.tsx          # Search bar, category quick pills, and sort controls
│   ├── pdf-reader/
│   │   ├── viewer.tsx            # PDF canvas & iframe fallback viewer
│   │   ├── toolbar.tsx           # Page jump, zoom in/out, dark/sepia/light toggle
│   │   └── outline-sidebar.tsx   # Chapters and outline navigation drawer
│   ├── shelf/
│   │   ├── kanban-board.tsx      # Reading / Saved / Completed columns with progress
│   │   └── progress-modal.tsx    # Modal to update current page & reading status
│   └── admin/
│       ├── stats-cards.tsx       # KPI analytical widgets
│       ├── book-table.tsx        # Searchable, filterable book management table
│       └── upload-dropzone.tsx   # Drag-and-drop cover & PDF uploader with live preview
├── lib/
│   ├── db.ts                     # Cached Mongoose connection helper
│   ├── models/
│   │   ├── User.ts               # User schema with shelf items & progress
│   │   └── Book.ts               # Book schema
│   ├── auth.ts                   # Node JWT sign/verify and bcrypt password hashing
│   ├── edge-auth.ts              # Edge JWT verify helper using `jose`
│   └── cloudinary.ts             # Cloudinary upload stream helper
├── middleware.ts                 # Edge middleware for /shelf and /admin route protection
├── types/                        # TypeScript interfaces for Book, User, Shelf, and APIs
├── .env.local                    # Environment configuration
└── tailwind.config.ts            # Tailwind config with custom colors and glass effects
```

---

## 3. Database Schema & Serverless Caching

### 3.1 Connection Strategy (`@/lib/db.ts`)
To prevent connection exhaustion across serverless function invocations:
- Cache the mongoose connection and promise in `global.mongoose`.
- Reuse existing connection when ready (`readyState === 1`).
- Disable `bufferCommands`.

### 3.2 Book Schema (`@/lib/models/Book.ts`)
- `title`: String (required, trimmed)
- `author`: String (required, trimmed)
- `description`: String
- `category`: String (required, indexed)
- `fileUrl`: String (required, Cloudinary raw PDF URL)
- `coverImage`: String (Cloudinary image URL)
- `uploadedBy`: ObjectId ref `User`
- `totalPages`: Number (default: 0)
- `timestamps`: true

### 3.3 User Schema (`@/lib/models/User.ts`)
- `name`: String (required)
- `email`: String (required, unique, lowercase)
- `password`: String (hashed with bcryptjs, 10 rounds)
- `role`: String ('student' | 'admin', default: 'student')
- `shelf`: Array of subdocuments:
  - `book`: ObjectId ref `Book`
  - `status`: String ('reading' | 'saved' | 'completed', default: 'saved')
  - `currentPage`: Number (default: 0)
  - `totalPages`: Number (default: 1)
  - `lastReadAt`: Date (default: Date.now)
- `savedBooks`: Array of ObjectId ref `Book` (maintained for backward compatibility)
- `timestamps`: true

---

## 4. Authentication & Edge Middleware

### 4.1 Token & Cookies
- Token contains: `{ id, email, name, role }`.
- Valid for 7 days.
- Stored in HTTP-only cookie named `token`, with `sameSite: 'lax'`, `secure: true` in production, `path: '/'`.

### 4.2 Edge Route Protection (`middleware.ts`)
Using `jose`:
- Requests to `/shelf*`, `/api/shelf*`, `/books/*/read`:
  - Token verified; if missing or invalid, redirect to `/login?redirect=<target>` or return 401 JSON.
- Requests to `/admin*`, `/api/admin*`:
  - Token verified; if `role !== 'admin'`, redirect to `/` or return 403 JSON.
- Requests to `/login` or `/register`:
  - If valid token present, redirect to `/books`.

---

## 5. Storage & PDF Streaming

### 5.1 Cloudinary Serverless Uploads (`app/api/upload/route.ts`)
- Accepts `multipart/form-data` with fields `file` (PDF) and/or `coverImage` (image).
- Streams buffer to Cloudinary:
  - Cover images uploaded to `elibrary/covers` (resource_type: image).
  - PDFs uploaded to `elibrary/books` (resource_type: raw, format: pdf, access_mode: public).
- Returns URLs and metadata to client.

### 5.2 PDF Proxy Stream (`app/api/books/[id]/pdf/route.ts`)
- Streams PDF binary with headers:
  - `Content-Type: application/pdf`
  - `Content-Disposition: inline; filename="book.pdf"`
  - `Cache-Control: public, max-age=86400, stale-while-revalidate=43200`
- Eliminates CORS issues for client-side PDF rendering.

---

## 6. Modern UI/UX Design

### 6.1 Theme & Styling
- **Dark Theme:** Deep slate `#0b0f19` and `#0f172a`, card backgrounds in `rgba(15, 23, 42, 0.75)` with `backdrop-blur-md`, glowing borders (`border-slate-800` to `border-indigo-500/50` on hover).
- **Light Theme:** Pristine slate `#f8fafc`, pure white glass cards, crisp slate text.
- Integrated with `next-themes` for instant toggle without flicker.

### 6.2 Key Views
1. **Catalog (`/books`):**
   - Real-time search by title and author.
   - Category filter pills with active glow states.
   - Smooth hover cards with 3D lift, category badge, rating stars, and one-click "Add to Shelf".
2. **Book Details (`/books/[id]`):**
   - Server Component with `generateMetadata()` for dynamic OpenGraph, Twitter card, and Schema.org Book JSON-LD.
   - High-resolution cover with ambient back-glow, metadata badges, synopsis, and action buttons ("Read Now", "Add to Shelf").
3. **PDF Reader (`/books/[id]/read`):**
   - Distraction-free canvas/stream viewer.
   - Page navigation dock, zoom slider, full-screen mode, reading progress auto-save, and chapter navigation drawer.
4. **User Shelf (`/shelf`):**
   - Kanban board and tabbed switcher for "Currently Reading", "Saved", and "Completed".
   - Progress bars showing percentage and page count (`Page X of Y`), with quick-update modal.
5. **Admin Panel (`/admin`):**
   - Analytics summary cards: Total Books, Active Readers, Total Reads.
   - Tabular book manager with search, edit, and deletion.
   - Drag-and-drop cover and PDF uploader with live preview card before submit.

---

## 7. Migration Plan & Backward Compatibility
- Existing MongoDB data remains 100% compatible.
- The `User` model automatically maps existing `savedBooks` IDs to `shelf` items with status `'saved'` if `shelf` is empty.
- Root repository replaced cleanly with Next.js 14+ TypeScript App Router.
