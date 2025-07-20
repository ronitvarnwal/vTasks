'use client';
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

type NoteProps = {
  params: {
    id: string; // UUID
  };
};

export default function Note({ params }: NoteProps) {
  const router = useRouter();
  const noteId = params.id;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [titleActive, setTitleActive] = useState(false);
  const [contentActive, setContentActive] = useState(false);

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };
  useEffect(() => {
    const fetchNote = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("title, content")
        .eq("id", noteId)
        .single();

      if (error) {
        console.error("Error fetching note:", error);
        return;
      }

      if (data) {
        setTitle(data.title || "");
        setContent(data.content || "");
      }
    };

    if (noteId && typeof noteId === "string" && noteId.length === 36) {
      fetchNote();
    } else {
      console.error("Invalid UUID:", noteId);
    }
  }, [noteId]);

  useEffect(() => {
    autoResize(titleRef.current);
    autoResize(contentRef.current);
  }, [title, content]);

  const saveNote = async () => {
    if (isSaving) return;

    setIsSaving(true);

    const updates = {
      title: title,
      content: content,
    };

    const { error } = await supabase
      .from("notes")
      .update(updates)
      .eq("id", noteId);

    if (error) {
      console.error("Error saving note:", error);
    }

    setIsSaving(false);
  };

  const isTextareaActive = titleActive || contentActive;
  
  const deleteNote = async () => {
    try {
      const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);
      
      if(error) {
        alert(JSON.stringify(error));
        return;
      }
    }
    catch (error) {
      console.error("Error deleting note:", error);
    }
    finally {
      router.push('/notes');
    }
  }
  const handleBack = () => {
    saveNote();
    { (window.history.length > 1) ? router.back()
        : 
        router.push('/notes') }
  }
  
  return (
    <div className="h-full bg-zinc-50 px-2">
      <div className="h-20 bg-zinc-50/60 flex justify-between items-center px-4">
        <button className="bg-zinc-100/80 border-1 border-white/75 inset-shadow-xs inset-shadow-zinc-100/25 w-10 h-10 rounded-lg flex justify-center items-center overflow-visible hover:bg-zinc-200">
         <img src="/right-arrow.svg" alt="logo" className="h-6 w-6 transform rotate-180 opacity-80" onClick={handleBack} />
        </button>
        {isTextareaActive ? (
        <button className="bg-zinc-100/80 border-1 border-white/75 inset-shadow-xs inset-shadow-zinc-100/25 w-10 h-10 rounded-lg flex justify-center items-center overflow-visible hover:bg-zinc-200">
        <img
          src="/tick-icon.svg"
          alt="save"
          className={`h-6 w-6 opacity-80 ${isSaving ? 'opacity-50' : 'cursor-pointer'}`}
          onClick={saveNote}
        />
        </button>
      ) : (
        <button className="bg-zinc-100/80 border-2 border-white/75 inset-shadow-xs inset-shadow-zinc-100/25 w-10 h-10 rounded-lg flex justify-center items-center overflow-visible hover:bg-zinc-200">
          <img src="/delete-icon.svg" alt="delete" className="h-10 w-10 opacity-80" onClick={deleteNote} /> 
        </button>
      )}
      </div>

      <div className="pt-2 pl-4">
        <p className="text-zinc-400">July 4, 7:28PM</p>
      </div>

      <div className="px-4 pt-5">
        <textarea
          placeholder="Title"
          className="w-full h-auto focus:outline-none textarea font-medium text-3xl text-zinc-800 tracking-tighter"
          ref={titleRef}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            autoResize(titleRef.current);
          }}
          onFocus={() => setTitleActive(true)}
           onBlur={() => {setTimeout(() => setTitleActive(false), 100)}} 
        />

        <textarea
          placeholder="Start typing"
          className="w-full focus:outline-none textarea1 text-lg text-zinc-700"
          ref={contentRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            autoResize(contentRef.current);
          }}
          onFocus={() => setContentActive(true)}
          onBlur={() => {setTimeout(() => setContentActive(false), 100)}}
        />
      </div>
    </div>
  );
}