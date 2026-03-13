# 📚 Student E-Library

A full-stack MERN web application where students can browse, read, and manage books online.

## 🔗 Links
- **Live Demo:** [student-e-library.netlify.app](https://student-e-library.netlify.app)
- **Backend API:** [student-e-library.onrender.com](https://student-e-library.onrender.com)

## ✨ Features
- 🔐 JWT Authentication with httpOnly cookies
- 📖 Browse & read books online
- 🔍 Search & filter by category
- 📚 Save books to personal shelf
- ☁️ PDF & image upload via Cloudinary
- 🛡️ Admin panel to manage books

## 🛠️ Tech Stack
**Frontend:** React, Vite, Tailwind CSS, React Router

**Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose

**Other:** Cloudinary, JWT, Multer, Bcrypt

## 🚀 Getting Started

### Backend
```bash
cd Backend
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

### Environment Variables
Create `.env` in Backend folder:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 👨‍💻 Developer
Made with ❤️ by Tarun Rawat
