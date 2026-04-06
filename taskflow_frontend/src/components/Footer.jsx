export default function Footer() {
  return (
    <footer className="w-full border-t border-on-surface/10 mt-auto">
      <div className="w-full py-8 px-8 flex flex-col md:flex-row justify-between items-center max-w-[1440px] mx-auto gap-4">
        <span className="text-[11px] uppercase tracking-[0.05em] text-on-surface/40">
          © {new Date().getFullYear()} TaskFlow. Designed for Cognitive Sanctuary.
        </span>
        <div className="flex gap-8">
          {['Privacy Policy', 'Terms of Service', 'Help Center'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[11px] uppercase tracking-[0.05em] text-on-surface/40 hover:text-primary transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
