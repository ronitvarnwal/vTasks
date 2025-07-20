

export default function Footer() {
  type FooterLinkType = {
    title: string;
    link: string;
  }
  const FooterLinks: FooterLinkType[] = [
    {
      title: "Home",
      link: "/"
    },
    {
      title: "Explore",
      link: "/"
    },
    {
      title: "About",
      link: "/"
    },
    {
      title: "Contact Us",
      link: "/"
    }
    
  ]
  return (
    <>
      <footer className="transition-color duration-200 bg-gray-50 px-5 py-10 dark:bg-zinc-950">
        <div>
          <h1 className="transition-all duration-300 text-2xl text-gray-950 font-bold tracking-tight dark:text-white">vTasks</h1>
        </div>
        <div className="py-10">
        {FooterLinks.map((FooterLink) => (
        <div key={FooterLink.title} className="transition-all duration-300 py-7 border-b border-zinc-200 dark:border-zinc-600">
          <h2 className="transition-all duration-300 text-lg text-stone-700 font-medium tracking-tight dark:text-stone-300">{FooterLink.title}</h2>
        </div>
        ))}
        </div>
        <div className="space-y-4 pt-10">
          <p className="transition-all duration-300 text-gray-600/80 dark:text-zinc-500">Stay updated with vTasks</p>
          <div className="transition-all duration-300 flex items-center space-x-5 border-b border-zinc-200 pb-23 dark:border-zinc-600">
          <input type="email" placeholder="enter email..." className="transition-all duration-300 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-gray-900/70 block w-full p-2 h-10 dark:bg-zinc-950 dark:placeholder-zinc-500 dark:border-zinc-600" /> 
          <button className="transition-all duration-300 bg-gray-950 text-zinc-50 w-50 h-10 text-center rounded-xl font-medium black-button dark:bg-zinc-50 dark:text-zinc-950">Subscribe</button>
          </div>
          <p className="transition-all duration-300 text-gray-600/80 pt-5 text-center dark:text-zinc-500">© 2023 vTasks. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}