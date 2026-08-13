"use client";

import { useState } from "react";
import { useRepository } from "../context/RepositoryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Tag, Trash2, Upload, FileArchive, Download } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { toast } from "sonner";

export default function RepositoryPage() {
  const { snippets, addSnippet, deleteSnippet } = useRepository();
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form states for upload
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const filteredSnippets = snippets.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        addSnippet({
          id: Date.now().toString(),
          title: title || data.fileName,
          description,
          code: "",
          language: "file",
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          createdAt: new Date().toISOString()
        });
        toast.success("Đã tải lên file thành công");
        setIsUploadOpen(false);
        setUploadFile(null);
        setTitle("");
        setDescription("");
        setTags("");
      } else {
        toast.error("Lỗi khi tải file: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      toast.error("Lỗi kết nối khi tải file");
    } finally {
      setIsUploading(false);
    }
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 tracking-tight flex items-center gap-3">
            <FileArchive className="w-10 h-10 text-sky-400" />
            Kho Lưu Trữ Dự Án
          </h1>
          <p className="text-slate-400 mt-2">Quản lý và lưu trữ các file, công cụ quan trọng của bạn.</p>
        </div>
        
        <div className="flex gap-3">
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger>
              <Button className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow-[0_0_20px_rgba(14,165,233,0.3)] border-none rounded-xl h-12 px-6">
                <div className="flex items-center"><Upload className="mr-2 h-5 w-5" /> Tải lên File</div>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-slate-900 border-white/10 text-slate-50 glass-panel">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">Tải lên File</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-5 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-slate-300">Chọn File</Label>
                  <Input 
                    id="file" 
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)} 
                    className="bg-slate-800/50 border-white/10 file:text-slate-300 file:bg-slate-700 file:border-none file:rounded-md file:px-4 file:py-1 cursor-pointer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uploadTitle" className="text-slate-300">Tiêu đề (tuỳ chọn)</Label>
                  <Input 
                    id="uploadTitle" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Tên file..."
                    className="bg-slate-800/50 border-white/10 focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uploadDesc" className="text-slate-300">Mô tả (tuỳ chọn)</Label>
                  <Input 
                    id="uploadDesc" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Mô tả file..."
                    className="bg-slate-800/50 border-white/10 focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uploadTags" className="text-slate-300">Tags (tuỳ chọn, cách nhau bởi dấu phẩy)</Label>
                  <Input 
                    id="uploadTags" 
                    value={tags} 
                    onChange={(e) => setTags(e.target.value)} 
                    placeholder="tool, zip, app"
                    className="bg-slate-800/50 border-white/10 focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isUploading || !uploadFile} className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-8">
                    {isUploading ? "Đang tải lên..." : "Tải lên"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <div className="mb-8 relative max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-500" />
        </div>
        <Input
          type="text"
          placeholder="Tìm kiếm file theo tiêu đề hoặc thẻ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-800/40 border-white/10 text-slate-200 focus-visible:ring-indigo-500 h-12 rounded-xl"
        />
      </div>

      {snippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-3xl border border-white/5">
          <div className="h-20 w-20 bg-sky-500/10 rounded-full flex items-center justify-center mb-6">
            <FileArchive className="h-10 w-10 text-sky-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-200 mb-2">Kho lưu trữ trống</h3>
          <p className="text-slate-400 max-w-md">Bạn chưa có file nào được tải lên. Hãy tải lên các file để lưu trữ an toàn nhé.</p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSnippets.map((snippet) => (
              <motion.div key={snippet.id} variants={item} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}>
                <Card className="glass-panel border-white/5 h-full flex flex-col hover:border-sky-500/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] group rounded-2xl overflow-hidden bg-gradient-to-b from-slate-800/40 to-slate-900/60">
                  <CardHeader className="pb-3 flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-100 group-hover:text-sky-300 transition-colors">{snippet.title}</CardTitle>
                      {snippet.description && <p className="text-sm text-slate-400 mt-1 line-clamp-1">{snippet.description}</p>}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10" onClick={() => deleteSnippet(snippet.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="relative flex-1 rounded-lg bg-sky-500/5 border border-sky-500/20 flex flex-col items-center justify-center p-6 text-center group/file">
                      <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-4 group-hover/file:scale-110 transition-transform duration-300">
                        <FileArchive className="w-8 h-8 text-sky-400" />
                      </div>
                      <h4 className="text-slate-200 font-medium mb-1 line-clamp-1 w-full" title={snippet.fileName || snippet.title}>{snippet.fileName || snippet.title}</h4>
                      <p className="text-sm text-slate-500 mb-6">File đính kèm</p>
                      
                      {snippet.fileUrl ? (
                        <a href={snippet.fileUrl} download className="inline-flex items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-300 hover:bg-sky-500/20 transition-colors">
                          <Download className="w-4 h-4 mr-2" />
                          Tải Xuống Ngay
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Không có file</span>
                      )}
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {snippet.tags.map((tag, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-500/10 text-sky-300 border border-sky-500/20">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">
                        {format(new Date(snippet.createdAt), "dd/MM/yyyy", { locale: vi })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
