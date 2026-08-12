"use client";

import { useState } from "react";
import { useRepository } from "../context/RepositoryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Code2, Copy, Search, Tag, Trash2, Check, Upload, FileArchive, Download } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { toast } from "sonner";
import Editor from "@monaco-editor/react";

export default function RepositoryPage() {
  const { snippets, addSnippet, deleteSnippet } = useRepository();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [tags, setTags] = useState("");

  const filteredSnippets = snippets.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;

    addSnippet({
      id: Date.now().toString(),
      title,
      description,
      code,
      language: language || "text",
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString()
    });

    toast.success("Đã thêm đoạn code mới");
    setIsOpen(false);
    
    // Reset form
    setTitle("");
    setDescription("");
    setCode("");
    setLanguage("");
    setTags("");
  };

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

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Đã sao chép vào clipboard");
    setTimeout(() => setCopiedId(null), 2000);
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
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight flex items-center gap-3">
            <Code2 className="w-10 h-10 text-indigo-400" />
            Kho Lưu Trữ Code & Tool
          </h1>
          <p className="text-slate-400 mt-2">Quản lý và sử dụng lại các đoạn code, thư viện của bạn.</p>
        </div>
        
        <div className="flex gap-3">
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger>
              <Button variant="outline" className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10 rounded-xl h-12 px-6 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                <div className="flex items-center"><Upload className="mr-2 h-5 w-5" /> Tải lên File (.zip)</div>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-slate-900 border-white/10 text-slate-50 glass-panel">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">Tải lên File Công Cụ</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-5 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-slate-300">Chọn File (ưu tiên .zip)</Label>
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
                    placeholder="Tên công cụ..."
                    className="bg-slate-800/50 border-white/10 focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uploadDesc" className="text-slate-300">Mô tả (tuỳ chọn)</Label>
                  <Input 
                    id="uploadDesc" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Mô tả công cụ..."
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
                  <Button type="submit" disabled={isUploading || !uploadFile} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8">
                    {isUploading ? "Đang tải lên..." : "Tải lên"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] border-none rounded-xl h-12 px-6">
                <div className="flex items-center"><Plus className="mr-2 h-5 w-5" /> Thêm Code Mới</div>
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-slate-900 border-white/10 text-slate-50 glass-panel">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Thêm Snippet Mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">Tiêu đề</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Ví dụ: Fetch API Helper"
                  className="bg-slate-800/50 border-white/10 focus-visible:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">Mô tả ngắn</Label>
                <Input 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Mô tả chức năng của đoạn code..."
                  className="bg-slate-800/50 border-white/10 focus-visible:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-slate-300">Ngôn ngữ</Label>
                  <Input 
                    id="language" 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)} 
                    placeholder="Tên ngôn ngữ (ts, js, python...)"
                    className="bg-slate-800/50 border-white/10 focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-slate-300">Tags (cách nhau bởi dấu phẩy)</Label>
                  <Input 
                    id="tags" 
                    value={tags} 
                    onChange={(e) => setTags(e.target.value)} 
                    placeholder="react, api, utils"
                    className="bg-slate-800/50 border-white/10 focus-visible:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="code" className="text-slate-300">Nội dung Code</Label>
                <div className="border border-white/10 rounded-md overflow-hidden h-[300px]">
                  <Editor
                    height="100%"
                    language={language || "javascript"}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8">
                  Lưu Snippet
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
          placeholder="Tìm kiếm code theo tiêu đề hoặc thẻ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-800/40 border-white/10 text-slate-200 focus-visible:ring-indigo-500 h-12 rounded-xl"
        />
      </div>

      {snippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-3xl border border-white/5">
          <div className="h-20 w-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
            <Code2 className="h-10 w-10 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-200 mb-2">Kho lưu trữ trống</h3>
          <p className="text-slate-400 max-w-md">Bạn chưa có đoạn code hoặc tool nào. Hãy thêm các đoạn code thường xuyên sử dụng để tiết kiệm thời gian nhé.</p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSnippets.map((snippet) => (
              <motion.div key={snippet.id} variants={item} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}>
                <Card className="glass-panel border-white/5 h-full flex flex-col hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] group rounded-2xl overflow-hidden bg-gradient-to-b from-slate-800/40 to-slate-900/60">
                  <CardHeader className="pb-3 flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">{snippet.title}</CardTitle>
                      {snippet.description && <p className="text-sm text-slate-400 mt-1 line-clamp-1">{snippet.description}</p>}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10" onClick={() => deleteSnippet(snippet.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {snippet.fileUrl ? (
                      <div className="relative flex-1 rounded-lg bg-indigo-500/5 border border-indigo-500/20 flex flex-col items-center justify-center p-6 text-center group/file">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover/file:scale-110 transition-transform duration-300">
                          <FileArchive className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h4 className="text-slate-200 font-medium mb-1 line-clamp-1 w-full" title={snippet.fileName}>{snippet.fileName}</h4>
                        <p className="text-sm text-slate-500 mb-6">File nén đính kèm</p>
                        <a href={snippet.fileUrl} download className="inline-flex items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300 hover:bg-indigo-500/20 transition-colors">
                          <Download className="w-4 h-4 mr-2" />
                          Tải Xuống Ngay
                        </a>
                      </div>
                    ) : (
                      <div className="relative group/code flex-1 rounded-lg overflow-hidden bg-[#0d1117] border border-white/5">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-white/5 text-xs text-slate-400 font-medium uppercase tracking-wider">
                          <span>{snippet.language || "text"}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-slate-400 hover:text-white hover:bg-white/10 rounded" 
                            onClick={() => handleCopy(snippet.code, snippet.id)}
                          >
                            {copiedId === snippet.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                        <div className="p-4 overflow-auto max-h-[200px] text-sm font-mono text-slate-300 custom-scrollbar">
                          <pre><code>{snippet.code}</code></pre>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {snippet.tags.map((tag, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
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
