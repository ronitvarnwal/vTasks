import Navbar from "@/components/navbar"

export default function Dailytask() {
  return (
    <div className="bg-zinc-50 h-full">
      <Navbar />
      <div className="pt-25 px-5">
        <h1 className="text-3xl text-zinc-900 font-semibold tracking-tight">Daily Task</h1>
        <div className="pt-10">
          <textarea placeholder="Start typing" className="w-full focus:outline-black textarea1 text-lg text-zinc-70 h-7"></textarea>
          <textarea placeholder="Start typing" className="w-full focus:outline-black textarea1 text-lg text-zinc-700 h-7"></textarea>
        </div>
      </div>
    </div>
  );
}