import Image from "next/image";

/**
 * Brand mark shown above the login card.
 * Links back to the homepage and displays the ANTI-AGENCY logo + Admin Portal label.
 */
export default function AdminBrand() {
  return (
    <a
      href="/"
      className="relative z-10 flex items-center gap-3 mb-10 group"
      aria-label="Back to Anti-Agency homepage"
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-[#E40101]/50 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(228,1,1,0.3)]">
        <Image
          src="/logo.svg"
          alt="Anti-Agency Logo"
          width={28}
          height={28}
          className="w-7 h-auto"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-heading text-2xl tracking-wider text-white font-bold">
          ANTI<span className="text-[#E40101]">-AGENCY</span>
        </span>
        <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-mono -mt-1">
          Admin Portal
        </span>
      </div>
    </a>
  );
}
