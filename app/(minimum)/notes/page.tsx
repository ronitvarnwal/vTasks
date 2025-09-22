'use client';
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation";
import link from "next/link";
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/navbar"

export default function Notes() {
  
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [hover, setHover] = useState<boolean>(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<any[]>([]);
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState<boolean>(false);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  
  // Add refs for better scroll detection
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const hasMoved = useRef<boolean>(false);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try{
        const { data: { session}, error: sessionError } = await supabase.auth.getSession()
        if(sessionError) {
          console.error('Session error:', sessionError);
          router.push('/login');
          return;
        }
        if(!session || !session.user) {
          console.log('No active session found');
          router.push('/login');
          return;
        }
        setUser(session.user);
        await fetchNotes(session.user);
      }
      catch(error) {
        console.error('Auth check error:', error);
        router.push('/login');
      }
    }
    const fetchNotes = async (currentUser: any) => {
      try{
      const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('id', { ascending: true })
        
        if(error) {
          console.error("Error fetching notes:", error);
          return;
        }
        setNotes(data.map((note: any) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          created_at: note.created_at,
        })))
      }
      catch (error){
        console.error("Error in fetchNotes:", error);
        
      }
    }
    checkAuthAndFetchData();
    
  }, [router])

  // Improved scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set new timeout with longer delay
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // Reduced from 200ms for better responsiveness
    };

    // Listen to window scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  
 const createNote = async () => {
    if(!user) {
      alert("You must be logged in to add notes.");
      return;
    }
    try {
      const {data, error} = await supabase
      .from('notes')
      .insert([
        {
          title: '',
          content: '',
          user_id: user.id,
        }
      ])
      .select()
      .single();
      if(error) {
        console.error("Error adding note:", error);
        alert("Failed to add note: " + error.message);
        return;
      }
      if(data) {
        router.push(`/notes/${data.id}`);
      }
    }
   catch (error) {
      console.error("Error adding note:", error);
      alert("Failed to add note. Please try again.");
   }
  }
  
  const toggleSelect = (id: any) => {
    if (!selectionMode) {
      setSelectionMode(true);
    }

    setSelectedNotes((prev) => {
      const newSelection = prev.includes(id) 
        ? prev.filter((nid) => nid !== id) 
        : [...prev, id];
      return newSelection;
    });
  }
  
  const clearSelection = () => {
    setSelectionMode(false);
    setSelectedNotes([]);
  }

  const handleDelete = async () => {
    if(selectedNotes.length === 0) return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedNotes.length} note(s)?`);
    if (!confirmDelete) return;
    
    try{
      await Promise.all(
        selectedNotes.map(async (id) => {
          await supabase
          .from('notes')
          .delete()
          .eq('id', id)
        })
      )
      
      // Refresh notes after deletion
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('id', { ascending: true })
      
      if(!error) {
        setNotes(data.map((note: any) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          created_at: note.created_at,
        })))
      }
    }
    catch (error) {
      console.error("Error deleting notes:", error);
      alert("Failed to delete notes. Please try again.");
    }
    clearSelection();
  }

  // Enhanced touch event handling
  const handleTouchStart = (e: React.TouchEvent, noteId: any) => {
    if (isScrolling) return;
    
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    hasMoved.current = false;
    setIsLongPress(false);
    
    const timer = setTimeout(() => {
      if (!hasMoved.current && !isScrolling) {
        setIsLongPress(true);
        toggleSelect(noteId);
      }
    }, 500); // Slightly longer delay for better UX
    
    setLongPressTimer(timer);
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    // If user moves finger more than 10px, consider it a scroll/swipe
    if (deltaX > 10 || deltaY > 10) {
      hasMoved.current = true;
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
    }
  }

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    touchStartRef.current = null;
    hasMoved.current = false;
  }

  // Keep mouse events for desktop
  const handleMouseDown = (noteId: any) => {
    if (isScrolling) return;
    setIsLongPress(false);
    const timer = setTimeout(() => {
      setIsLongPress(true);
      toggleSelect(noteId);
    }, 500);
    setLongPressTimer(timer);
  }

  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }

  const handleNoteClick = (noteId: any) => {
    // Prevent click if it was a long press or scrolling
    if (isLongPress || isScrolling) {
      setIsLongPress(false);
      return;
    }

    if (!selectionMode) {
      router.push(`/notes/${noteId}`);
    } else {
      toggleSelect(noteId);
    }
  }

  const handleRedirectClick = (e: React.MouseEvent, noteId: any) => {
    e.stopPropagation();
    router.push(`/notes/${noteId}`);
  }
  
  return (
    <>
      <div className="h-full bg-zinc-50">
      {selectionMode ? (
      <div className="transition-color duration-200 bg-zinc-50/75 h-20 top-0 right-0 left-0 fixed flex backdrop-blur-sm items-center px-5 justify-between dark:bg-zinc-950/75">
        <button className="bg-zinc-100/80 border-1 border-white/75 inset-shadow-xs inset-shadow-zinc-100/25 w-10 h-10 rounded-lg flex justify-center items-center overflow-visible hover:bg-zinc-200">
        <img src="/cancel-icon.svg" alt="cancel" className="h-6 w-6 opacity-90" onClick={clearSelection} />
        </button>
        <p className="font-medium tracking-tight text-md">{selectedNotes.length} Selected</p>
        <button className="bg-zinc-100/80 border-1 border-white/75 inset-shadow-xs inset-shadow-zinc-100/25 w-10 h-10 rounded-lg flex justify-center items-center overflow-visible hover:bg-zinc-200 animate-spin">
        <img src="/delete-icon.svg" alt="delete" className="h-10 w-10 opacity-90 " onClick={handleDelete} />
        </button>
      </div>
    ) : (
      <Navbar />
    )
        
      }
      
    <div className="h-full bg-zinc-50 mt-20 p-5">
        <input type="search" placeholder="search notes..." className="bg-zinc-200/40 bg-zinc-100/30 border-2 border-white/75 inset-shadow-xs inset-shadow-zinc-100/25 rounded-full w-full h-10 p-3" />
      <div>
        <div className="flex flex-col py-5 gap-5">
          {notes.map((note) => (
        <div 
          className={`transition-all duration-200 bg-zinc-100/30 border-2 border-white/75 inset-shadow-xs inset-shadow-zinc-100/25 h-40 w-full p-3 rounded-2xl flex flex-col justify-between cursor-pointer select-none ${
            selectedNotes.includes(note.id) ? 'bg-zinc-200/40 border-zinc-200/40' : ''
          } ${selectionMode || 'note-box'}`} 
          key={note.id} 
          onClick={() => handleNoteClick(note.id)}
          onMouseDown={() => handleMouseDown(note.id)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={(e) => handleTouchStart(e, note.id)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
                <div>
                  <div className="flex justify-between">
                  <h4 className="text-zinc-800 text-lg font-medium min-h-8">{note.title || 'Untitled'}</h4>
                    {selectionMode ? (
                                <div className="h-8 w-8 min-w-8"></div>
          
          ) : (
                      <button 
                      className="bg-zinc-200/30 w-8 h-8 rounded-lg flex justify-center items-center overflow-visible min-w-8" 
                      onClick={(e) => handleRedirectClick(e, note.id)}
                    >
                      
                      <img src="/redirect-icon.svg" alt="logo" className="h-5 w-5 opacity-80" />
                    </button>
          )}
                  </div>
                  <p className="text-zinc-700">{note.content}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-zinc-600 text-sm">{note.created_at}</p>
                  {selectionMode && (
                    <div>
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedNotes.includes(note.id) 
                          ? 'bg-zinc-950 border-zinc-950' 
                          : 'bg-zinc-200'
                      }`}>
                        {selectedNotes.includes(note.id) && (
                          <img src="/tick-icon.svg" alt="tick" className="h-4 w-4 filter brightness-0 invert"
                       /> )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
      ))}
        </div>
      </div>

      {selectionMode || (
      <div>
        <div className="bg-zinc-50 rounded-full w-20 h-20 fixed text-3xl shadow-lg text-center flex items-center justify-center pb-2 bottom-15 right-10 cursor-pointer hover:bg-zinc-100" onClick={createNote}>
          <p className="text-[70px] font-extralight text-zinc-800">+</p>
        </div>
      </div>
      )}
    </div>
      </div>
    </>
  );
}