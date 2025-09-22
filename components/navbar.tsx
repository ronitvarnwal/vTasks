import ToggleDark from "./toggle-dark"

export default function Navbar() {
  return (
    <>
      <nav className="transition-color duration-200 bg-zinc-50/75 h-20 top-0 right-0 left-0 fixed flex backdrop-blur-sm items-center px-5 justify-between dark:bg-zinc-950/75 z-100">
        <h1 className="transition-color duration-300 text-zinc-950 text-3xl font-bold dark:text-white">vTasks</h1>
        <div className="flex items-center space-x-2">
          <ToggleDark />
          {/* {theme === 'light' ? (
          <img src="/menu.svg" className="w-10 h-10"/>) : (
      <img src="/white-menu.svg" className="w-10 h-10" />)
          } */}
        </div>
      </nav>
    </>
  );
}