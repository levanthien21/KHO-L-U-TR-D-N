"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Snippet } from "@/types";

interface RepositoryContextType {
  snippets: Snippet[];
  addSnippet: (snippet: Snippet) => void;
  updateSnippet: (id: string, updatedSnippet: Partial<Snippet>) => void;
  deleteSnippet: (id: string) => void;
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined);

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("freelancer-snippets");
    if (saved) {
      try {
        setSnippets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse snippets from local storage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("freelancer-snippets", JSON.stringify(snippets));
    }
  }, [snippets, isLoaded]);

  const addSnippet = (snippet: Snippet) => {
    setSnippets((prev) => [...prev, snippet]);
  };

  const updateSnippet = (id: string, updatedSnippet: Partial<Snippet>) => {
    setSnippets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedSnippet } : s))
    );
  };

  const deleteSnippet = (id: string) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
  };

  if (!isLoaded) {
    return null; 
  }

  return (
    <RepositoryContext.Provider value={{ snippets, addSnippet, updateSnippet, deleteSnippet }}>
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepository() {
  const context = useContext(RepositoryContext);
  if (context === undefined) {
    throw new Error("useRepository must be used within a RepositoryProvider");
  }
  return context;
}
