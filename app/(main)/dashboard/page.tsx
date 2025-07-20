'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation';

type Task = {
  id: string;
  title: string;
  complete: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  frequency: 'daily' | 'weekly' | 'monthly';
}

export default function Dashboard() {
  const [dailyTask, setDailyTask] = useState<string>('');
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
  const [weeklyTask, setWeeklyTask] = useState<string>('');
  const [weeklyTasks, setWeeklyTasks] = useState<Task[]>([]);
  const [monthlyTask, setMonthlyTask] = useState<string>('');
  const [monthlyTasks, setMonthlyTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // Check current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          router.push('/login');
          return;
        }

        if (!session || !session.user) {
          console.log('No active session found');
          router.push('/login');
          return;
        }

        setUser(session.user);
        await fetchTasks();
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from("todos")
          .select("*")
          .order("id", { ascending: true });
        
        if (error) {
          console.error("Error fetching tasks:", error);
          return;
        }
        
        const daily = data?.filter((task: Task) => task.frequency === "daily") ?? [];
        const weekly = data?.filter((task: Task) => task.frequency === "weekly") ?? [];
        const monthly = data?.filter((task: Task) => task.frequency === "monthly") ?? [];

        setDailyTasks(daily.map((task: any) => ({
          id: task.id,
          title: task.title,
          complete: task.complete,
          priority: task.priority,
          frequency: task.frequency,
        })));  
        
        setWeeklyTasks(weekly.map((task: any) => ({
          id: task.id,
          title: task.title,
          complete: task.complete,
          priority: task.priority,
          frequency: task.frequency,
        })));
        
        setMonthlyTasks(monthly.map((task: any) => ({
          id: task.id,
          title: task.title,
          complete: task.complete,
          priority: task.priority,
          frequency: task.frequency,
        })));
      } catch (error) {
        console.error("Error in fetchTasks:", error);
      }
    };
    const fetchNotes = async () => {
      try{
        const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('id', { ascending: true })
        if(error) {
          console.error("Error fetching notes:", error)
          return;
        }
        setNotes(data.map((note: any) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          created_at: note.created_at,
        })))
      }
      catch (error) {
        console.error("Error in fetchNotes:", error);
      }
    }

    checkAuthAndFetchData();
    fetchNotes();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/login');
        } else if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          fetchTasks();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const addDailyTask = async () => {
    if (dailyTask.trim() === '') return;

    if (!user) {
      alert("You must be logged in to add tasks.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([
          {
            title: dailyTask,
            complete: false,
            priority: 'medium',
            frequency: 'daily',
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Error adding task:", error);
        alert("Failed to add task: " + error.message);
        return;
      }

      if (data) {
        setDailyTasks(prev => [
          ...prev,
          {
            id: data.id,
            title: data.title,
            complete: data.complete,
            priority: data.priority,
            frequency: data.frequency,
          }
        ]);
        setDailyTask('');
      }
    } catch (error) {
      console.error("Error adding daily task:", error);
      alert("Failed to add task. Please try again.");
    }
  };

  const addWeeklyTask = async () => {
    if (weeklyTask.trim() === '') return;

    if (!user) {
      alert("You must be logged in to add tasks.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([
          {
            title: weeklyTask,
            complete: false,
            priority: 'medium',
            frequency: 'weekly',
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Error adding task:", error);
        alert("Failed to add task: " + error.message);
        return;
      }

      if (data) {
        setWeeklyTasks(prev => [
          ...prev,
          {
            id: data.id,
            title: data.title,
            complete: data.complete,
            priority: data.priority,
            frequency: data.frequency,
          }
        ]);
        setWeeklyTask('');
      }
    } catch (error) {
      console.error("Error adding weekly task:", error);
      alert("Failed to add task. Please try again.");
    }
  };

  const addMonthlyTask = async () => {
    if (monthlyTask.trim() === '') return;

    if (!user) {
      alert("You must be logged in to add tasks.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([
          {
            title: monthlyTask,
            complete: false,
            priority: 'medium',
            frequency: 'monthly',
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Error adding task:", error);
        alert("Failed to add task: " + error.message);
        return;
      }

      if (data) {
        setMonthlyTasks(prev => [
          ...prev,
          {
            id: data.id,
            title: data.title,
            complete: data.complete,
            priority: data.priority,
            frequency: data.frequency,
          }
        ]);
        setMonthlyTask('');
      }
    } catch (error) {
      console.error("Error adding monthly task:", error);
      alert("Failed to add task. Please try again.");
    }
  };

  const toggleTaskComplete = async (taskId: string, frequency: 'daily' | 'weekly' | 'monthly') => {
    const currentTasks = frequency === 'daily' ? dailyTasks : 
                        frequency === 'weekly' ? weeklyTasks : monthlyTasks;
    
    const task = currentTasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const { error } = await supabase
        .from('todos')
        .update({ complete: !task.complete })
        .eq('id', taskId);

      if (error) {
        console.error("Error updating task:", error);
        return;
      }

      // Update local state
      if (frequency === 'daily') {
        setDailyTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, complete: !t.complete } : t
        ));
      } else if (frequency === 'weekly') {
        setWeeklyTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, complete: !t.complete } : t
        ));
      } else {
        setMonthlyTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, complete: !t.complete } : t
        ));
      }
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      router.push('/login');
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen bg-zinc-50">
  //       <div className="text-lg text-zinc-700">Loading...</div>
  //     </div>
  //   );
  // }

  return (
    <>
      <main className="bg-zinc-50 pt-30">
        <div className="px-5 pb-8 flex justify-between items-center">
          <div>
            <h2 className="text-gray-950 text-3xl font-medium tracking-tight">Welcome to dashboard, </h2>
            <h2 className="text-gray-950 text-3xl font-medium tracking-tight">
              {localStorage.getItem('name') || user?.email?.split('@')[0] || 'User'}!
            </h2>
            <p className="text-zinc-700 text-lg mt-3">Let's be productive today.</p>
          </div>
          
        </div>
        
        <div className="py-10 space-y-5">
          <div className="bg-zinc-100/40 border-2 border-white/75 inset-shadow-2xs inset-shadow-zinc-300/40 shadow-sm shadow-zinc-300/50 rounded-3xl px-4 py-5 h-70 mx-5">
            <div className="flex justify-between">
            <h3 className="text-2xl text-zinc-800 font-medium tracking-tight">Daily Tasks</h3>
            <button className="bg-zinc-100/80 border-1 border-white/75 inset-shadow-xs inset-shadow-zinc-100/25 w-9 h-9 rounded-lg flex justify-center items-center overflow-visible hover:bg-zinc-200" onClick={() => router.push("/notes")}>
              <img src="/external-link.svg" alt="logo" className="h-4 w-4 opacity-90 ml-[2px]" />
              </button>
            </div>
            <div className="transition-all duration-300 flex items-center dark:border-zinc-600 pt-4 space-x-4">
              <input 
                type="text" 
                placeholder="add task.." 
                className="transition-all duration-300 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-gray-900/70 block w-full p-2 h-9 dark:bg-zinc-950 dark:placeholder-zinc-500 dark:border-zinc-600" 
                value={dailyTask} 
                onChange={(e) => setDailyTask(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addDailyTask();
                  }
                }}
              /> 
              <button 
                className="transition-all duration-300 bg-gray-950 text-zinc-50 w-25 h-9 text-center rounded-lg font-medium black-button dark:bg-zinc-50 dark:text-zinc-950" 
                onClick={addDailyTask}
              >
                Add
              </button>
            </div>
            <ul className="text-zinc-700 px-2 pt-4 text-lg space-y-2">
              {dailyTasks.map((task) => (
                <li 
                  key={task.id} 
                  className={`cursor-pointer ${task.complete ? 'line-through opacity-60' : ''}`}
                  onClick={() => toggleTaskComplete(task.id, 'daily')}
                >
                  {task.title}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col">
            <div className="w-full p-5 py-10">
              <div className="bg-zinc-100/40 border-2 border-white/75 inset-shadow-2xs inset-shadow-zinc-300/40 shadow-sm shadow-zinc-300/50 rounded-3xl p-4 h-60">
                <div className="flex justify-between">
            <h3 className="text-2xl text-zinc-800 font-medium tracking-tight">Weekly Tasks</h3>
            <button className="bg-zinc-100/80 border-1 border-white/75 inset-shadow-xs inset-shadow-zinc-100/25 w-9 h-9 rounded-lg flex justify-center items-center overflow-visible hover:bg-zinc-200" onClick={() => router.push("/notes")}>
              <img src="/external-link.svg" alt="logo" className="h-4 w-4 opacity-90 ml-[2px]" />
              </button>
            </div>
                <div className="transition-all duration-300 flex items-center dark:border-zinc-600 pt-4 space-x-4">
                  <input 
                    type="text" 
                    placeholder="add task.." 
                    className="transition-all duration-300 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-gray-900/70 block w-full p-2 h-9 dark:bg-zinc-950 dark:placeholder-zinc-500 dark:border-zinc-600"
                    value={weeklyTask}
                    onChange={(e) => setWeeklyTask(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addWeeklyTask();
                      }
                    }}
                  /> 
                  <button 
                    className="transition-all duration-300 bg-gray-950 text-zinc-50 w-25 h-9 text-center rounded-lg font-medium black-button dark:bg-zinc-50 dark:text-zinc-950"
                    onClick={addWeeklyTask}
                  >
                    Add
                  </button>
                </div>
                <ul className="text-zinc-700 px-2 pt-4 text-lg space-y-2">
                  {weeklyTasks.map((task) => (
                    <li 
                      key={task.id} 
                      className={`cursor-pointer ${task.complete ? 'line-through opacity-60' : ''}`}
                      onClick={() => toggleTaskComplete(task.id, 'weekly')}
                    >
                      {task.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="basis-1/2 flex-auto w-full p-5">
              <div className="bg-zinc-100/40 border-2 border-white/75 inset-shadow-2xs inset-shadow-zinc-300/40 shadow-sm shadow-zinc-300/50 rounded-3xl p-5 h-auto">
                <div className="flex justify-between">
            <h3 className="text-2xl text-zinc-800 font-medium tracking-tight">Monthly Tasks</h3>
            <button className="bg-zinc-100/80 border-1 border-white/75 inset-shadow-xs inset-shadow-zinc-100/25 w-9 h-9 rounded-lg flex justify-center items-center overflow-visible hover:bg-zinc-200" onClick={() => router.push("/notes")}>
              <img src="/external-link.svg" alt="logo" className="h-4 w-4 opacity-90 ml-[2px]" />
              </button>
            </div>
                <div className="transition-all duration-300 flex items-center dark:border-zinc-600 pt-4 space-x-4">
                  <input 
                    type="text" 
                    placeholder="add task.." 
                    className="transition-all duration-300 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-gray-900/70 block w-full p-2 h-9 dark:bg-zinc-950 dark:placeholder-zinc-500 dark:border-zinc-600"
                    value={monthlyTask}
                    onChange={(e) => setMonthlyTask(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addMonthlyTask();
                      }
                    }}
                  /> 
                  <button 
                    className="transition-all duration-300 bg-gray-950 text-zinc-50 w-25 h-9 text-center rounded-lg font-medium black-button dark:bg-zinc-50 dark:text-zinc-950"
                    onClick={addMonthlyTask}
                  >
                    Add
                  </button>
                </div>
                <ul className="text-zinc-700 px-2 pt-4 text-lg space-y-2">
                  {monthlyTasks.map((task) => (
                    <li 
                      key={task.id} 
                      className={`cursor-pointer ${task.complete ? 'line-through opacity-60' : ''}`}
                      onClick={() => toggleTaskComplete(task.id, 'monthly')}
                    >
                      {task.title}
                    </li>
                  ))}
                </ul>
                </div>        
            </div>
          </div>
          
          <div className="bg-zinc-100/40 border-2 border-white/75 inset-shadow-2xs inset-shadow-zinc-300/40 shadow-sm shadow-zinc-300/50 rounded-3xl p-4 h-120 mx-5">
             <div className="flex justify-between">{/*border-1 border-zinc-300/60 */}
            <h3 className="text-2xl text-zinc-800 font-medium tracking-tight">Notes</h3>
              <button className="bg-zinc-100/80 border-1 border-white/75 inset-shadow-xs inset-shadow-zinc-100/25 w-10 h-10 rounded-lg flex justify-center items-center overflow-visible hover:bg-zinc-200" onClick={() => router.push("/notes")}>
              <img src="/external-link.svg" alt="logo" className="h-5 w-5 opacity-90 ml-[2px]" />
              </button>
              </div>
            <div className="flex py-5 gap-5">
              {notes.map((note) => (
  <div className="bg-zinc-100/30 border-2 border-white/60 inset-shadow-xs inset-shadow-zinc-100/30 transition-all duration-200 h-35 w-50 p-3 rounded-2xl flex flex-col justify-between note-box" key={note.id}>
    <div className="flex-1">
      <h4 className="text-zinc-800 text-lg font-medium truncate mb-1">{note.title}</h4>
      <p className="text-zinc-700 overflow-hidden text-ellipsis line-clamp-3">{note.content}</p>
    </div>
    <div className="flex-shrink-0 mt-2">
      <p className="text-zinc-600 text-sm">Jun 6, 2025</p>
    </div>
  </div>
))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}