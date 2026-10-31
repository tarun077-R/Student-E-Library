'use client';

import React, { useState } from 'react';
import { Upload, Image as ImageIcon, FileText, Check, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface UploadDropzoneProps {
  onSuccess: () => void;
}

const COMMON_CATEGORIES = [
  'Computer Science',
  'Fiction',
  'Novel',
  'Science Fiction',
  'Non-fiction',
  'Mathematics',
  'Physics',
  'Web',
  'Other',
];

export function UploadDropzone({ onSuccess }: UploadDropzoneProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCoverSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file for the cover (JPG, PNG, WebP)');
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setError('');
  };

  const handlePdfSelect = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setError('Please select a valid PDF file');
      return;
    }
    setPdfFile(file);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const finalCategory = category === 'Other' && customCategory.trim() ? customCategory.trim() : category;

    if (!title.trim() || !author.trim() || !finalCategory || !pdfFile) {
      setError('Title, author, category, and PDF file are required');
      return;
    }

    try {
      setUploading(true);

      // Step 1: Upload files to Cloudinary via /api/upload
      const formData = new FormData();
      formData.append('file', pdfFile);
      if (coverFile) {
        formData.append('coverImage', coverFile);
      }

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const uploadData = await uploadRes.json();
        throw new Error(uploadData.message || 'File upload failed');
      }

      const uploadData = await uploadRes.json();

      // Step 2: Create Book Record via /api/books
      const bookRes = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          author,
          category: finalCategory,
          description,
          fileUrl: uploadData.fileUrl,
          coverImage: uploadData.coverImage || '',
          totalPages: 50,
        }),
      });

      if (!bookRes.ok) {
        const bookData = await bookRes.json();
        throw new Error(bookData.message || 'Failed to save book to catalog');
      }

      setSuccess(true);
      // Reset form
      setTitle('');
      setAuthor('');
      setDescription('');
      setCoverFile(null);
      setCoverPreview(null);
      setPdfFile(null);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 7 cols: Dynamic Form with Drag-and-Drop */}
      <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Book published to digital library catalog successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Book Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Clean Architecture"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Author Name *</label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Robert C. Martin"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Category *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COMMON_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                  category === cat
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {category === 'Other' && (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom category name..."
              className="w-full mt-2 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          )}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Synopsis / Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of the book's topics and target audience..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Dual Drag-and-Drop Zones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Cover Dropzone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Cover Image</label>
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) handleCoverSelect(e.dataTransfer.files[0]);
              }}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl bg-slate-900/40 hover:bg-slate-900/70 transition-all cursor-pointer group"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleCoverSelect(e.target.files[0])}
                className="hidden"
              />
              <ImageIcon className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 transition-colors mb-2" />
              <p className="text-xs font-semibold text-slate-300 text-center">
                {coverFile ? coverFile.name : 'Drag & drop cover or click to browse'}
              </p>
              <span className="text-[10px] text-slate-500 mt-1">JPG, PNG, WebP</span>
            </label>
          </div>

          {/* PDF File Dropzone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">PDF Document *</label>
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) handlePdfSelect(e.dataTransfer.files[0]);
              }}
              className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer group ${
                pdfFile
                  ? 'border-emerald-500/50 bg-emerald-950/10'
                  : 'border-slate-800 hover:border-indigo-500/50 bg-slate-900/40 hover:bg-slate-900/70'
              }`}
            >
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => e.target.files?.[0] && handlePdfSelect(e.target.files[0])}
                className="hidden"
              />
              <FileText
                className={`w-8 h-8 mb-2 transition-colors ${
                  pdfFile ? 'text-emerald-400' : 'text-slate-500 group-hover:text-indigo-400'
                }`}
              />
              <p className="text-xs font-semibold text-slate-300 text-center truncate max-w-[200px]">
                {pdfFile ? pdfFile.name : 'Drag & drop PDF book or browse'}
              </p>
              <span className="text-[10px] text-slate-500 mt-1">
                {pdfFile ? `${(pdfFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Standard PDF format'}
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-glow-md hover:shadow-glow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Uploading to Cloud & Catalog...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Publish Book to Library</span>
            </>
          )}
        </button>
      </form>

      {/* Right 4 cols: Instant Live Card Preview */}
      <div className="lg:col-span-4 sticky top-24 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Live Catalog Preview</span>
        </div>

        <div className="w-full max-w-[260px] mx-auto rounded-2xl glass-panel p-3 border border-slate-800 shadow-xl">
          <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-900 relative">
            {coverPreview ? (
              <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-slate-600">
                <ImageIcon className="w-10 h-10 mb-2" />
                <span className="text-xs font-semibold">Cover preview will show here</span>
              </div>
            )}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700 text-[10px] font-bold text-indigo-300">
              {category === 'Other' && customCategory ? customCategory : category}
            </div>
          </div>

          <div className="mt-3">
            <h4 className="text-xs font-bold text-white truncate">
              {title || 'Book Title Here'}
            </h4>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {author || 'Author Name'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

