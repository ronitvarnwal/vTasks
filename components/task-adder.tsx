import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'

type Task = {
  id: string | number;
  title: string;
  complete: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  frequency: 'daily' | 'weekly' | 'monthly';
}
type TaskAdderProps = {
  parentIsOpen: boolean;
  onClose: () => void;
  sendData: (data: Task) => void;
}

export default function TaskAdder({parentIsOpen, onClose, sendData}: TaskAdderProps) {

  const [task, setTask] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<string>('daily');
  const [priority, setPriority] = useState<string>('normal');
  const [user, setUser] = useState<any>(null);
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
      }
          catch (error) {
            console.error('Auth check error:', error);
          }
        }
    checkAuthAndFetchData();
  },[])
  const addTask = async () => {
    if (task.trim() === '') return;
    setSubmitting(true);
    try {
      onClose();
      const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          title: task,
          complete: false,
          priority: priority,
          frequency: frequency,
          user_id: user.id,
        }
      ])
      .select("*")
      .single();
      
      if (error) {
        console.error("Error adding task:", error);
        return;
      }
      const newTask: Task = {
        id: data.id,
        title: data.title,
        complete: data.complete,
        priority: data.priority,
        frequency: data.frequency,
      }
      sendData(newTask);
      setTask('');
      setFrequency('daily');
      setPriority('normal');

      
    }
    catch (error) {
      console.error("Error adding task:", error);
      alert(error);
    }
    finally{
      setSubmitting(false);
    }
  }
  return (
    <>
      {parentIsOpen && (
    <div className="bg-zinc-900/40 h-full fixed w-full backdrop-blur-sm z-200">
      
      <div className="h-18 w-full flex gap-3 items-center px-4 flex">

      </div>
     <div className="w-full flex justify-center h-full items-center pb-50">
      <div className="bg-zinc-50 border-2 border-white/75 inset-shadow-2xs inset-shadow-zinc-300/40 rounded-3xl h-auto mx-5 mt-10 px-4 pt-5 mb-2 max-w-170 w-full">
        <div className="w-full flex justify-end pr-2">
        <button onClick={onClose}>
          <img src="/cancel-icon.svg" alt="logo" className="h-5 w-5 opacity-90"/>
        </button>
        </div>

      <div className="pt-1 pb-3 px-2 border-b border-zinc-200/80">
        <input type="text" placeholder="add task.." className="w-full focus:outline-none text-xl font-md text-zinc-800 tracking-tighter pb-1 transition-all duration-300" onChange={(e) => setTask(e.target.value)} />
      </div>
      <div className="flex flex-col gap-5 mt-5">
        <div className="text-zinc-800/90 font-medium tracking-tighter text-xl ml-1">Frequency</div>
        <div className="h-10 w-full rounded-md border-1 border-white/75 inset-shadow-2xs inset-shadow-zinc-100/80 flex flex-col shadow-sm shadow-zinc-200/40">
          <ul className="flex px-3 items-center mt-[-3px]">
            <li className={`text-zinc-700 text-lg tracking-tighter font-medium p-2 w-full text-center transition-all duration-200 ${frequency === "daily" && "mt-[-4px]" }`} 
          onClick={() => setFrequency("daily")}>Daily</li>
            <li className={`text-zinc-700 text-lg tracking-tighter font-medium rounded-lg p-2 w-full text-center transition-all duration-200 ${frequency === "weekly" && "mt-[-4px]" }`} 
              onClick={() => setFrequency("weekly")}>Weekly</li>
            <li className={`text-zinc-700 text-lg tracking-tighter font-medium rounded-lg p-2 w-full text-center transition-all duration-200 ${frequency === "monthly" && "mt-[-4px]" }`}
              onClick={() => setFrequency("monthly")}>
              Monthly</li>
          </ul>
          <div className="px-4">
          <div className={`h-1 w-[30.5%] bg-zinc-800 rounded-full mt-[-8px] ml-[0.7%] transition-all duration-300 ${frequency === "weekly" && "ml-[35%]" } ${frequency === "monthly" && "ml-[69.5%]" }`}></div>
          </div> 
        </div>
      </div>
      <div className="pt-15 pb-5">
        <h2 className="text-zinc-800/90 tracking-tighter font-medium text-xl ml-1">Priority</h2>
        <div className="">
        <ul className="grid grid-cols-4 grid-row-1 h-10 rounded-md border-1 border-white/75 inset-shadow-2xs inset-shadow-zinc-100/80 px-2 py-1 mt-5 mb-10 shadow-sm shadow-zinc-200/40">
          <li className={`text-lg tracking-tighter text-centre flex justify-center items-center rounded-md transition-all duration-200 ${priority === "low" ? "text-green-700 bg-green-200 inset-shadow-xs inset-shadow-green-300/70 shadow-2xs shadow-zinc-200/50" : "text-zinc-700"}`}
            onClick={() => setPriority("low")}
            >
            <span>low</span>
          </li>
          <li className={`text-lg tracking-tighter text-centre flex justify-center items-center rounded-md transition-all duration-200 ${priority === "normal" ? "text-gray-700 bg-gray-200 inset-shadow-xs inset-shadow-gray-300/70 shadow-2xs shadow-zinc-200/50" : "text-zinc-700"}`}
            onClick={() => setPriority("normal")}
            >
            <span>normal</span>
          </li>
          <li className={`text-lg tracking-tighter text-centre flex justify-center items-center rounded-md transition-all duration-200 ${priority === "medium" ? "text-yellow-700 bg-yellow-200 inset-shadow-xs inset-shadow-yellow-300/70 shadow-2xs shadow-zinc-200/50" : "text-zinc-700"}`}
            onClick={() =>setPriority("medium")}
            >
            <span>medium</span>
          </li>
          <li className={`text-lg tracking-tighter text-centre flex justify-center items-center rounded-md transition-all duration-200 ${priority === "high" ? "text-red-700 bg-red-200 inset-shadow-xs inset-shadow-red-300/70 shadow-2xs shadow-zinc-200/50" : "text-zinc-700"}`}
            onClick={() => setPriority("high")}>
            <span>high</span>
          </li>
        </ul>
        </div>
        <div className="mt-5 border-t border-zinc-200/60 pt-5">
          <button className={`${submitting ? "text-zinc-800/70" : "text-zinc-800/90 shadow-sm shadow-zinc-200/60"} text-xl font-medium tracking-tight border-1 border-white/75 bg-zinc-100/70 inset-shadow-2xs inset-shadow-zinc-100/80  w-full h-10 rounded-2xl flex justify-center items-center transition-all duration-200`} onClick={addTask} disabled={submitting}>Create Task</button>
        </div>
      </div>
        
      </div>
</div>
    </div>
      )}
    </>
  );
}