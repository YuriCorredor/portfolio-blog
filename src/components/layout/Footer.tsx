export default function Footer() {
  return (
    <footer className='flex flex-col justify-center items-center w-full h-16 bg-black text-white'>
      <div className="flex w-full justify-center border-t-[1px] border-slate-700">
          <p className="p-2 pt-3 text-xs text-bold text-slate-200">© Copyright | Yuri Corredor | Made with ❤️ and Next.js</p>
      </div>
      <div>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/YuriCorredor"
          className="p-2 text-xs text-bold text-slate-200 hover:text-sky-400 transition-all"
        >
          Github
        </a>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.linkedin.com/in/yuri-corredor/"
          className="p-2 text-xs text-bold text-slate-200 hover:text-sky-400 transition-all"
        >
          LinkedIn
        </a>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://yuricorredor.com.br/"
          className="p-2 text-xs text-bold text-slate-200 hover:text-sky-400 transition-all"
        >
          Portfolio
        </a>
      </div>
    </footer>
  )
}
