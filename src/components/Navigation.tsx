import { Link as ScrollLink } from "react-scroll";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "About", to: "about" },
  { name: "Research", to: "research" },
  { name: "News", to: "news" },
  { name: "Reviewer", to: "reviewer" },
  { name: "Contact", to: "contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass" data-testid="navbar">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <ScrollLink
          to="about"
          smooth={true}
          duration={500}
          className="font-mono text-sm text-white/90 cursor-pointer shrink-0 tracking-wider"
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
              offset={-60}
              className="text-xs font-mono text-white/40 hover:text-white cursor-pointer transition-colors uppercase tracking-widest"
              data-testid={`link-nav-${item.to}`}
            >
              {item.name}
            </ScrollLink>
          ))}
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-mobile-menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-white/5 bg-background px-6 py-4"
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <ScrollLink
                key={item.name}
                to={item.to}
                smooth={true}
                duration={500}
                offset={-60}
                onClick={() => setIsOpen(false)}
                className="text-xs font-mono text-white/40 hover:text-white cursor-pointer uppercase tracking-widest"
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
