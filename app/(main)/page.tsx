import { Button } from "@/components/ui/button"

export default function Home() {
  type TaskBoxType = {
    title: string;
    description: string;
  };
  const TaskBoxes: TaskBoxType[] = [
    {
      title: "Daily Tasks",
      description: "Write and manage things taht you have to do today. mark them as completed or not."
    },
    {
      title: "Weekly Tasks",
      description: "Write and manage things taht you have to do today. mark them as completed or not."
    },
    {
      title: "Weekly Tasks",
      description: "Write and manage things taht you have to do today. mark them as completed or not."
    },
  ]
  return (
    <>
    <div className="transition-color duration-200 bg-gray-50 px-5 pb-10 pt-30 dark:bg-zinc-950">
      <h1 className="transition-color duration-300 text-gray-950 tracking-tight text-4xl font-bold tracking-tight dark:text-white">I'm Ronit! the owner BITCH!</h1>
      <p className="transition-all duration-300 text-zinc-500 text-xl mt-7 font-normal tracking-tight dark:text-zinc-400">this website is for adding <span className="text-stone-700 font-medium dark:text-zinc-200">tasks</span> and improveing your <span className="text-stone-700 font-medium dark:text-zinc-200">productivity</span> with simple and clean ui. you can add daily, weekly and monthly tasks as you want. the creator of the website is <span className="text-stone-700 font-medium dark:text-zinc-200">Ronit</span>.</p>
      <div className="flex space-x-5">
      <button className="bg-gray-950 text-zinc-50 w-50 h-10 text-center rounded-xl mt-10 font-medium cursor-pointer transition-all duration-300 focus:bg-gray-900 black-button dark:bg-zinc-50 dark:text-zinc-950">Get started</button>
      <button className="transition-color duration-300 bg-gray-100 text-gray-950 w-50 h-10 text-center rounded-xl mt-10 font-semibold transition-all gray-button dark:bg-zinc-800 dark:text-zinc-50">Add tasks</button>
      </div>
    </div>
      <div className="transition-color duration-200 bg-gray-50 py-10 dark:bg-zinc-950">
        <h1 className="transition-color duration-300 text-gray-950 tracking-tight text-4xl font-bold text-center px-15 dark:text-white">One Platform. All your todos, tasks, routine, & habits</h1>
        <p className="transition-color duration-300 text-lg text-zinc-500 text-center px-8 pt-8">A great user experience this is our goal-add your daily, weekly, monthly tasks not and achieve your goal.</p>
      </div>
      <div className="transition-color duration-200 py-5 bg-gray-50 flex space-y-10 flex-wrap py-10 justify-center dark:bg-zinc-950">  
        {TaskBoxes.map(TaskBox => (  
      <div className="basis-1/3 flex-auto min-w-115 px-5">
        <div key={TaskBox.title} className="transition-all duration-200 px-8 py-8 h-50 rounded-2xl shadow-md shadow-zinc-300/50 bg-white/35 task-box dark:bg-black/35 dark:shadow-zinc-600/50">  
          <h2 className="transition-color duration-300 text-2xl text-gray-950 font-extrabold tracking-tight dark:text-white">{TaskBox.title}</h2>  
          <p className="transition-color duration-300 text-lg text-gray-700/90 mt-3 font-normal dark:text-zinc-300">{TaskBox.description}</p>  
        </div>  
      </div>
        ))}  
      </div>
      <div className="transition-color duration-200 space-y-13 bg-gray-50 py-10 dark:bg-zinc-950">
        <h2 className="transition-color duration-300 text-gray-950 text-4xl font-extrabold text-center dark:text-white">Ready to try vTasks?</h2>
        <div className="flex justify-center">
        <button className="transition-color duration-300 bg-gray-950 text-xl text-gray-50 font-semibold rounded-lg w-55 h-10 black-button dark:bg-zinc-50 dark:text-zinc-950">Explore vTasks</button>
        </div>
      </div>
    </>
  );
}
