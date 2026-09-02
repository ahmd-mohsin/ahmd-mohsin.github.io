import { Link as ScrollLink } from "react-scroll";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "About", to: "about" },
  { name: "Research", to: "research" },
  { name: "News", to: "news" },
  { name: "Service", to: "reviewer" },
  { name: "Contact", to: "contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass" data-testid="navbar">
      <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between gap-4">
        <ScrollLink
          to="about"
          smooth={true}
          duration={500}
          className="font-mono text-xs text-[#f48fb1] cursor-pointer shrink-0 tracking-wider hover:text-[#ffc1d9] transition-colors"
          data-testid="link-home"
        >
          mohsin
        </ScrollLink>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <ScrollLink
              key={item.name}
              to={item.to}
              smooth={true}
              duration={500}
              offset={-48}
              className="text-[11px] font-mono text-[#c79bad] hover:text-[#f48fb1] cursor-pointer transition-colors uppercase tracking-widest"
              data-testid={`link-nav-${item.to}`}
            >
              {item.name}
            </ScrollLink>
          ))}
        </div>

        <button
          className="md:hidden text-[#c79bad] hover:text-[#f48fb1] transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-mobile-menu"
        >
          {isOpen ? <X className="w-5 h-5" strokeWidth={2.5} /> : <Menu className="w-5 h-5" strokeWidth={2.5} />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="md:hidden border-t border-[#b07f95]/20 bg-[#070b0a]/95 px-6 py-5"
        >
          <div className="flex flex-col gap-5">
            {navItems.map((item) => (
              <ScrollLink
                key={item.name}
                to={item.to}
                smooth={true}
                duration={500}
                offset={-48}
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-mono text-[#c79bad] hover:text-[#f48fb1] cursor-pointer uppercase tracking-widest"
                data-testid={`link-mobile-${item.to}`}
              >
                {item.name}
              </ScrollLink>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
