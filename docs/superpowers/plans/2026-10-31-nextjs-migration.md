# Next.js 14+ Migration & Modern UI/UX Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the MERN Book Reading & Management Platform into a unified full-stack Next.js 14+ (App Router) codebase with TypeScript, Tailwind CSS, serverless cached Mongoose, Jose Edge Middleware, Cloudinary streaming, and a modern digital library UI/UX.

**Architecture:** Combine backend and client into a single Next.js App Router codebase at root. Database connections use a global cached singleton in `@/lib/db.ts`. Edge middleware (`middleware.ts`) protects `/shelf` and `/admin` routes using `jose` with HTTP-only cookies. A binary streaming proxy route `/api/books/[id]/pdf` streams PDF data to eliminate CORS issues for the reader. Modern UI uses `next-themes` (deep slate dark/light mode), glassmorphism, glowing borders, dynamic SEO metadata Server Components, Kanban shelf, and an analytical admin dashboard.

**Tech Stack:** Next.js 14+ (App Router), React 18/19, TypeScript 5, Tailwind CSS, Mongoose, Jose, JsonWebToken, Bcryptjs, Cloudinary, Lucide-React, Next-Themes.

**Spec:** `docs/superpowers/specs/2026-10-31-nextjs-migration-design.md`

## Global Constraints
- Target Framework: Next.js 14+ with App Router (no legacy pages router).
- TypeScript: strict mode enabled, zero `any` in public interfaces.
- Authentication: HTTP-only secure cookie named `token`; Edge-compatible verification in `middleware.ts` via `jose`.
- Database: Mongoose cached singleton pattern in `@/lib/db.ts` to prevent serverless connection exhaustion.
- Styling: Tailwind CSS with deep slate theme (`bg-slate-950`), frosted glass cards (`backdrop-blur-md`), and glowing accent borders.
- Legacy directory cleanup: Replace `Backend/` and `client/` in-place while transferring environment variables to `.env.local`.

---

### Task 1: Environment Setup & Next.js 14+ Project Scaffolding

**Files:**
- Create: `.env.local`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `.gitignore`
- Remove: `Backend/`, `client/`

**Interfaces:**
- Produces: Working Next.js 14+ App Router project root with all dependencies installed.

- [ ] **Step 1: Extract environment variables from `Backend/.env` into `.env.local`**
Ensure `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and `NEXT_PUBLIC_APP_URL` are recorded in `.env.local`.

- [ ] **Step 2: Clean up legacy folders and configure root `package.json`**
Remove `Backend/` and `client/` directories.
Create root `package.json` with scripts:
```json
{
  "name": "student-e-library",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cloudinary": "^2.5.1",
    "clsx": "^2.1.1",
    "jose": "^5.9.6",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.475.0",
    "mongoose": "^8.9.5",
    "next": "^14.2.23",
    "next-themes": "^0.4.4",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^3.0.1"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.8",
    "@types/node": "^20.17.16",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.1",
    "eslint-config-next": "^14.2.23",
    "postcss": "^8.5.1",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3"
  }
}
```

- [ ] **Step 3: Create `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `.gitignore`**
Configure path aliases (`@/*` pointing to `./*`).
Configure Tailwind with `darkMode: 'class'` and slate colors.
Configure `next.config.mjs` with remote image domains for Cloudinary (`res.cloudinary.com`).

- [ ] **Step 4: Install dependencies**
Run `npm install` and verify `node_modules` is populated.

- [ ] **Step 5: Verify setup and commit**
Run: `npm run lint` or `npx tsc --noEmit`
Commit: `git commit -m "chore: scaffold Next.js 14 App Router project with TypeScript and Tailwind"`

---

### Task 2: Cached Database Connection & Mongoose Schemas

**Files:**
- Create: `lib/db.ts`
- Create: `lib/models/Book.ts`
- Create: `lib/models/User.ts`
- Create: `types/index.ts`
- Create: `tests/db.test.ts` (or node verification script)

**Interfaces:**
- Produces:
  - `connectToDatabase(): Promise<typeof mongoose>`
  - `Book`: Model for book documents
  - `User`: Model for user documents with `shelf` subdocuments
  - `IBook`, `IUser`, `IShelfItem` TypeScript interfaces

- [ ] **Step 1: Define TypeScript interfaces in `types/index.ts`**
```typescript
export interface IShelfItem {
  book: string | IBook;
  status: 'reading' | 'saved' | 'completed';
  currentPage: number;
  totalPages: number;
  lastReadAt: string | Date;
}

export interface IBook {
  _id: string;
  title: string;
  author: string;
  description?: string;
  category: string;
  fileUrl: string;
  coverImage?: string;
  totalPages?: number;
  uploadedBy?: {
    _id: string;
    name: string;
    email: string;
  } | string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  shelf: IShelfItem[];
  savedBooks?: string[];
  createdAt: string;
  updatedAt: string;
}
```

- [ ] **Step 2: Implement serverless cached database connection in `lib/db.ts`**
Implement the global caching pattern with `bufferCommands: false` to eliminate multiple connections in serverless routes.

- [ ] **Step 3: Implement `lib/models/Book.ts`**
Export `Book` model ensuring `mongoose.models.Book || mongoose.model('Book', BookSchema)`.

- [ ] **Step 4: Implement `lib/models/User.ts` with backward compatibility**
Export `User` model with `shelf: [ShelfItemSchema]` and `savedBooks: [{ type: Schema.Types.ObjectId, ref: 'Book' }]`. Add pre-save or getter logic so legacy `savedBooks` automatically populate `shelf`.

- [ ] **Step 5: Verify connection and models with verification script**
Run a standalone node script with `dotenv` to verify Mongoose initializes without errors and schema definitions compile.
Commit: `git commit -m "feat(db): add cached mongoose connection and User/Book models"`

---

### Task 3: Authentication Utilities, Edge Middleware & Auth Route Handlers

**Files:**
- Create: `lib/auth.ts`
- Create: `lib/edge-auth.ts`
- Create: `middleware.ts`
- Create: `app/api/auth/register/route.ts`
- Create: `app/api/auth/login/route.ts`
- Create: `app/api/auth/logout/route.ts`
- Create: `app/api/auth/me/route.ts`

**Interfaces:**
- Consumes: `lib/db.ts`, `lib/models/User.ts`
- Produces:
  - `signToken(payload)`: generates JWT string
  - `verifyToken(token)`: decodes JWT payload in Node runtime
  - `verifyEdgeToken(token)`: decodes JWT payload in Edge runtime using `jose`
  - `setAuthCookie(response, token)` / `clearAuthCookie(response)`
  - Edge middleware protecting `/shelf`, `/admin`, and redirecting authenticated visitors from `/login`

- [ ] **Step 1: Implement `lib/auth.ts` and `lib/edge-auth.ts`**
Use `bcryptjs` for password hashing and verification.
Use `jsonwebtoken` for Node routes and `jose` (`jwtVerify`) for Edge middleware.

- [ ] **Step 2: Implement `app/api/auth/register/route.ts` and `app/api/auth/login/route.ts`**
Handle POST requests. Validate inputs. Return user payload and set HTTP-only cookie `token` (`httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/'`).

- [ ] **Step 3: Implement `app/api/auth/logout/route.ts` and `app/api/auth/me/route.ts`**
Logout clears the `token` cookie.
Me endpoint extracts cookie, verifies token, connects to DB, returns user profile without password.

- [ ] **Step 4: Implement `middleware.ts`**
Use Next.js Edge Middleware matcher:
`matcher: ['/shelf/:path*', '/admin/:path*', '/books/:id/read', '/login', '/register']`
Verify token with `verifyEdgeToken()`.
Redirect unauthenticated users to `/login`.
Redirect non-admin users attempting to access `/admin` to `/`.
Redirect logged-in users from `/login` or `/register` to `/books`.

- [ ] **Step 5: Verify auth routes & middleware**
Commit: `git commit -m "feat(auth): add edge middleware, JWT cookies, and auth route handlers"`

---

### Task 4: Cloudinary Upload, PDF Streaming & Book Route Handlers

**Files:**
- Create: `lib/cloudinary.ts`
- Create: `app/api/upload/route.ts`
- Create: `app/api/books/route.ts`
- Create: `app/api/books/[id]/route.ts`
- Create: `app/api/books/[id]/pdf/route.ts`

**Interfaces:**
- Consumes: `lib/db.ts`, `lib/models/Book.ts`, `lib/auth.ts`
- Produces:
  - POST `/api/upload`: handles `multipart/form-data`, uploads buffer to Cloudinary, returns secure URLs
  - GET `/api/books`: returns filtered/searched books
  - POST `/api/books`: admin-only route to create book
  - GET `/api/books/[id]`: returns single book by ID
  - PUT/DELETE `/api/books/[id]`: admin-only update and delete
  - GET `/api/books/[id]/pdf`: streams PDF binary with appropriate headers

- [ ] **Step 1: Implement `lib/cloudinary.ts` and `app/api/upload/route.ts`**
Configure Cloudinary with `v2`.
Use `upload_stream` wrapped in a Promise to upload buffers directly from `request.formData()`.
Categorize cover images to `elibrary/covers` and PDFs to `elibrary/books` with `resource_type: 'raw'`.

- [ ] **Step 2: Implement `app/api/books/route.ts`**
GET: parse `category`, `search`, and optional `sort`. Build Mongoose query. Populate `uploadedBy`.
POST: check auth cookie (admin only). Validate fields. Create and return book document.

- [ ] **Step 3: Implement `app/api/books/[id]/route.ts`**
GET: find book by ID with `populate('uploadedBy', 'name email')`. Return 404 if not found.
PUT: check admin role. Update book.
DELETE: check admin role. Delete book.

- [ ] **Step 4: Implement `app/api/books/[id]/pdf/route.ts` (Streaming Proxy)**
Fetch book from DB to get `fileUrl`.
Fetch remote PDF stream from Cloudinary.
Return a `Response(stream, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'inline' } })`.

- [ ] **Step 5: Verify routes**
Commit: `git commit -m "feat(api): add books CRUD, Cloudinary upload, and PDF proxy stream routes"`

---

### Task 5: Shelf & Admin Stats API Route Handlers

**Files:**
- Create: `app/api/shelf/route.ts`
- Create: `app/api/shelf/progress/route.ts`
- Create: `app/api/stats/route.ts`

**Interfaces:**
- Consumes: `lib/db.ts`, `lib/models/User.ts`, `lib/models/Book.ts`, `lib/auth.ts`
- Produces:
  - GET `/api/shelf`: returns populated shelf items for logged-in user
  - POST `/api/shelf`: toggles or adds a book to shelf
  - PATCH `/api/shelf/progress`: updates `currentPage`, `totalPages`, or `status` ('reading', 'saved', 'completed')
  - GET `/api/stats`: admin analytics aggregation

- [ ] **Step 1: Implement `app/api/shelf/route.ts`**
GET: authenticate user from cookie. Find user, populate `shelf.book`. If `shelf` is empty but `savedBooks` has entries, populate from `savedBooks`. Return shelf array.
POST: accept `{ bookId, status }`. If book already in shelf, update status or toggle removal if requested. Return updated shelf item.

- [ ] **Step 2: Implement `app/api/shelf/progress/route.ts`**
PATCH: accept `{ bookId, currentPage, totalPages, status }`.
Locate shelf item for book. Update progress and set `lastReadAt = new Date()`.
If `currentPage >= totalPages`, automatically mark `status = 'completed'`.

- [ ] **Step 3: Implement `app/api/stats/route.ts`**
Admin check. Aggregate:
- Total books count
- Total registered students count
- Total books in user shelves
- Genre distribution breakdown
Return JSON summary.

- [ ] **Step 4: Verify shelf & stats routes**
Commit: `git commit -m "feat(api): add shelf management, reading progress, and admin stats routes"`

---

### Task 6: Global Layout, Theme System & Glassmorphic Navigation

**Files:**
- Create: `app/globals.css`
- Create: `components/theme-provider.tsx`
- Create: `components/theme-toggle.tsx`
- Create: `components/navbar.tsx`
- Create: `components/footer.tsx`
- Create: `context/auth-context.tsx`
- Create: `app/layout.tsx`

**Interfaces:**
- Produces:
  - Global responsive layout with deep slate / light theme
  - `AuthProvider` supplying user session, login, logout, and shelf refresh
  - Glassmorphic top navbar with search shortcut, theme toggle, and user avatar dropdown

- [ ] **Step 1: Configure `app/globals.css`**
Set up Tailwind directives. Define custom glow variables, smooth scroll, glass backdrop styles, custom scrollbar.

- [ ] **Step 2: Implement `components/theme-provider.tsx` and `components/theme-toggle.tsx`**
Wrap `next-themes` ThemeProvider (`attribute="class"`, `defaultTheme="dark"`).
Build ThemeToggle button with Sun/Moon icon transitions and glowing border.

- [ ] **Step 3: Implement `context/auth-context.tsx`**
Provide `user`, `loading`, `login(credentials)`, `register(data)`, `logout()`, `refreshUser()`.
Fetch `/api/auth/me` on mount.

- [ ] **Step 4: Implement `components/navbar.tsx` and `components/footer.tsx`**
Navbar: Glassmorphic bar (`sticky top-0 z-40 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/80`).
Links: "Catalog", "My Shelf", "Admin" (if admin), with active state highlighting.
User menu: Avatar with user initials, role badge, Logout button.
Footer: Modern footer with branding, links, and copyright.

- [ ] **Step 5: Wire into `app/layout.tsx`**
Assemble providers (`ThemeProvider`, `AuthProvider`), `Navbar`, `children`, and `Footer`.
Commit: `git commit -m "feat(ui): add layout, auth provider, theme system, and glassmorphic navbar"`

---

### Task 7: Catalog & Home Experience (`/` and `/books`)

**Files:**
- Create: `components/book-card.tsx`
- Create: `components/book-filters.tsx`
- Create: `app/page.tsx`
- Create: `app/books/page.tsx`
- Create: `app/login/page.tsx`
- Create: `app/register/page.tsx`

**Interfaces:**
- Produces:
  - Dynamic landing page with hero, stats ticker, featured books, and category highlights
  - Catalog page (`/books`) with real-time category pills, search input, and animated hover cards
  - High-converting glassmorphic Login and Register views

- [ ] **Step 1: Implement `components/book-card.tsx`**
Card with 3:4 aspect ratio cover, glass badge for category, star rating (1-5), glowing hover lift, and quick "Add to Shelf" button with optimistic feedback.

- [ ] **Step 2: Implement `components/book-filters.tsx`**
Search bar with debounce and clear button.
Horizontal scrollable category pills ("All", "Computer Science", "Fiction", "Science Fiction", "Mathematics", "Physics", "Web", "Other") with active glow.

- [ ] **Step 3: Implement `app/page.tsx` (Landing Page)**
Hero section with gradient heading, quick search, featured reads carousel, value propositions, and direct "Browse Library" CTA.

- [ ] **Step 4: Implement `app/books/page.tsx` (Catalog Browsing)**
Fetch books via API or direct DB in Server Component with dynamic search params support.
Provide real-time filtering, responsive grid (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`), empty state, and skeleton loading.

- [ ] **Step 5: Implement `app/login/page.tsx` & `app/register/page.tsx`**
Glassmorphic card centered on dark slate background, form validation, error banners, and seamless redirect to requested page after login.
Commit: `git commit -m "feat(catalog): add landing, catalog browsing with filters, and auth pages"`

---

### Task 8: Book Details Page (`/books/[id]`) with Dynamic SEO Metadata

**Files:**
- Create: `app/books/[id]/page.tsx`
- Create: `components/book-details/shelf-action-button.tsx`

**Interfaces:**
- Consumes: `lib/db.ts`, `lib/models/Book.ts`
- Produces:
  - Server Component with `generateMetadata()` generating Title, Description, OpenGraph images, and JSON-LD Book schema
  - Split showcase layout with high-res cover, ambient reflection glow, metadata badges, synopsis, and "Start Reading" CTA

- [ ] **Step 1: Implement `generateMetadata` for dynamic SEO**
Extract book ID from params. Fetch book from database. Return metadata object with OpenGraph images and canonical URLs.

- [ ] **Step 2: Implement Book Details Layout**
Cover container with ambient back-glow.
Category pill, title, author, total pages, upload date, star rating.
Synopsis paragraph with high readability typography.
CTA group: Prominent "Start Reading" button (links to `/books/[id]/read`), "Add to Shelf" button with status options, and "Download PDF".
Inject `<script type="application/ld+json">` for Google Book Schema.

- [ ] **Step 3: Implement `components/book-details/shelf-action-button.tsx`**
Client Component allowing users to add/change status ("Currently Reading", "Saved", "Completed") with instant feedback.
Commit: `git commit -m "feat(book-details): add SEO-optimized book details page with dynamic metadata"`

---

### Task 9: Distraction-Free PDF Reader UI (`/books/[id]/read`)

**Files:**
- Create: `components/pdf-reader/viewer.tsx`
- Create: `components/pdf-reader/toolbar.tsx`
- Create: `components/pdf-reader/outline-sidebar.tsx`
- Create: `app/books/[id]/read/page.tsx`

**Interfaces:**
- Consumes: `/api/books/[id]/pdf` stream route, `/api/shelf/progress`
- Produces:
  - Distraction-free full-screen reader
  - Auto-hiding top & bottom control docks on inactivity
  - Zoom slider, page jump input, theme toggle (Paper, Sepia, Deep Dark)
  - Automatic reading progress persistence

- [ ] **Step 1: Implement `components/pdf-reader/toolbar.tsx`**
Top bar: Book title, author, back button, theme picker (Paper, Sepia, Deep Dark).
Bottom dock: Previous/Next page buttons, page input (`Page X of Y`), zoom controls (`-`, `100%`, `+`, fit width), full-screen toggle.

- [ ] **Step 2: Implement `components/pdf-reader/outline-sidebar.tsx`**
Collapsible side menu for chapters, bookmarks, and quick page jumping.

- [ ] **Step 3: Implement `components/pdf-reader/viewer.tsx`**
Render PDF using canvas or high-fidelity viewer connecting to `/api/books/[id]/pdf`.
Support theme CSS filters (inverted deep dark, warm sepia, crisp light paper).
Track `currentPage` and trigger debounced PATCH to `/api/shelf/progress`.

- [ ] **Step 4: Implement `app/books/[id]/read/page.tsx`**
Render reader without main Navbar/Footer. Set up mouse-move idle detection to auto-hide docks after 3 seconds.
Commit: `git commit -m "feat(reader): add distraction-free PDF reader with themes, zoom, and progress tracking"`

---

### Task 10: User Shelf Kanban & Reading Progress (`/shelf`)

**Files:**
- Create: `components/shelf/kanban-board.tsx`
- Create: `components/shelf/progress-modal.tsx`
- Create: `app/shelf/page.tsx`

**Interfaces:**
- Consumes: `/api/shelf`, `/api/shelf/progress`
- Produces:
  - Interactive shelf with Kanban columns: "Currently Reading", "Saved", "Completed"
  - Tabbed list alternative view
  - Reading progress bars with percentage completion
  - Quick page update dialog

- [ ] **Step 1: Implement `components/shelf/kanban-board.tsx`**
Three columns: "Currently Reading", "Saved", "Completed".
Each card displays book cover, title, author, reading progress bar (`Page X of Y`), and "Resume Reading" button.
Actions to move book between columns or remove from shelf.

- [ ] **Step 2: Implement `components/shelf/progress-modal.tsx`**
Modal to update current page and status, calculating percentage dynamically.

- [ ] **Step 3: Implement `app/shelf/page.tsx`**
Protected page (guarded by Edge middleware).
Displays user stats header (Books in shelf, currently reading, completed).
Switcher between Kanban Board and Tabbed List view.
Empty state with "Explore Catalog" recommendation.
Commit: `git commit -m "feat(shelf): add user shelf with Kanban board and reading progress tracking"`

---

### Task 11: Admin Analytical Dashboard & Book Manager (`/admin`)

**Files:**
- Create: `components/admin/stats-cards.tsx`
- Create: `components/admin/book-table.tsx`
- Create: `components/admin/upload-dropzone.tsx`
- Create: `app/admin/page.tsx`

**Interfaces:**
- Consumes: `/api/stats`, `/api/books`, `/api/upload`
- Produces:
  - KPI analytical cards (Total Books, Active Readers, Total Shelved, Genre split)
  - Searchable, sortable book table with delete and edit triggers
  - Drag-and-drop file upload with live cover & PDF previews

- [ ] **Step 1: Implement `components/admin/stats-cards.tsx`**
Metrics cards with glowing borders: Total Books, Registered Students, Active Readers, Total Shelf Adds.

- [ ] **Step 2: Implement `components/admin/upload-dropzone.tsx`**
Dual dropzone:
1. Cover image dropzone with instant client preview.
2. PDF file dropzone with size and filename display.
Live book card preview on the side showing how the book will appear in the catalog.
Progress bar during upload to `/api/upload`.

- [ ] **Step 3: Implement `components/admin/book-table.tsx`**
Table displaying cover thumbnail, title, author, category, upload date, and actions (View, Edit, Delete with ConfirmDialog).

- [ ] **Step 4: Implement `app/admin/page.tsx`**
Protected admin route. Tabbed view ("Analytics & Books", "+ Upload New Book").
Connects to `/api/stats` and handles book additions with instant list refresh.
Commit: `git commit -m "feat(admin): add analytical dashboard, book manager, and drag-and-drop uploader"`

---

### Task 12: End-to-End Verification, Seed Script & Production Build

**Files:**
- Create: `scripts/seed.ts`
- Modify: `README.md`
- Verify: Full production build `npm run build`

**Interfaces:**
- Produces:
  - Working database seed script to populate sample books and test users
  - Passing TypeScript compilation and Next.js production build
  - Clean updated `README.md` with instructions for running and deploying

- [ ] **Step 1: Create `scripts/seed.ts`**
Script to seed initial admin user, student user, and curated books with covers and sample PDF links.

- [ ] **Step 2: Test complete user journeys**
Verify:
1. Visitor browses catalog, searches, filters by category.
2. Visitor clicks book, views Server Component details with SEO metadata.
3. Registration & login creates HTTP-only cookie and updates navbar.
4. User adds book to shelf, updates page progress, views Kanban board.
5. User reads book in distraction-free reader with zoom and themes.
6. Admin accesses `/admin`, views analytics, uploads new book with drag-and-drop.

- [ ] **Step 3: Run production build**
Execute `npm run build` to verify zero TypeScript errors, valid route generation, and proper static/server component splitting.

- [ ] **Step 4: Update `README.md` and commit**
Document architecture, environment variables, and scripts.
Commit: `git commit -m "docs: update README with Next.js 14 architecture and setup guide"`
