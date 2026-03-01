"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

interface Photo {
  id: string;
  date: string;
  filename: string;
  category: string;
  url: string;
}

const categories = [
  { value: "front", label: "Front" },
  { value: "side", label: "Side" },
  { value: "back", label: "Back" },
];

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState("front");
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split("T")[0]);
  const [isUploading, setIsUploading] = useState(false);
  const [comparePhotos, setComparePhotos] = useState<{ before: Photo | null; after: Photo | null }>({
    before: null,
    after: null,
  });

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/photos");
      const data = await response.json();
      setPhotos(data.photos);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("category", uploadCategory);
      formData.append("date", uploadDate);

      const response = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsModalOpen(false);
        setUploadFile(null);
        fetchPhotos();
      }
    } catch (error) {
      console.error("Failed to upload photo:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      const response = await fetch(`/api/photos/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchPhotos();
      }
    } catch (error) {
      console.error("Failed to delete photo:", error);
    }
  };

  const filteredPhotos =
    selectedCategory === "all"
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  const openCompare = () => {
    const sortedPhotos = [...filteredPhotos].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setComparePhotos({
      before: sortedPhotos[0] || null,
      after: sortedPhotos[sortedPhotos.length - 1] || null,
    });
    setIsCompareOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Progress Photos</h1>
            <p className="text-slate-400">Track your visual progress</p>
          </div>
          <div className="flex gap-2">
            {filteredPhotos.length >= 2 && (
              <Button variant="secondary" onClick={openCompare}>
                Compare
              </Button>
            )}
            <Button onClick={() => setIsModalOpen(true)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-gradient-primary text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? "bg-gradient-primary text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
          </div>
        ) : filteredPhotos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-slate-400 mb-4">No photos yet</p>
              <Button onClick={() => setIsModalOpen(true)}>Upload your first photo</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-[3/4] rounded-lg overflow-hidden bg-slate-800 group"
              >
                <Image
                  src={photo.url}
                  alt={`Progress photo - ${photo.category}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-sm font-medium">{formatDate(photo.date)}</p>
                    <p className="text-slate-300 text-xs capitalize">{photo.category}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Photo">
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Photo</label>
              <div
                className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors"
                onClick={() => document.getElementById("photo-input")?.click()}
              >
                {uploadFile ? (
                  <p className="text-white">{uploadFile.name}</p>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-slate-400">Click to select a photo</p>
                  </>
                )}
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setUploadCategory(cat.value)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      uploadCategory === cat.value
                        ? "bg-gradient-primary text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Date"
              type="date"
              value={uploadDate}
              onChange={(e) => setUploadDate(e.target.value)}
            />

            <Button type="submit" className="w-full" isLoading={isUploading} disabled={!uploadFile}>
              Upload Photo
            </Button>
          </form>
        </Modal>

        {/* Compare Modal */}
        <Modal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          title="Before & After"
          className="max-w-3xl"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400 mb-2 text-center">Before</p>
              {comparePhotos.before && (
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-slate-700">
                  <Image
                    src={comparePhotos.before.url}
                    alt="Before"
                    fill
                    className="object-cover"
                  />
                  <p className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                    {formatDate(comparePhotos.before.date)}
                  </p>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-2 text-center">After</p>
              {comparePhotos.after && (
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-slate-700">
                  <Image
                    src={comparePhotos.after.url}
                    alt="After"
                    fill
                    className="object-cover"
                  />
                  <p className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                    {formatDate(comparePhotos.after.date)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
