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
      <div className="max-w-6xl mx-auto px-6 h-10 flex items-center justify-between gap-4">
        <ScrollLink
          to="about"
          smooth={true}
          duration={500}
          className="font-mono text-xs text-[#f0f4ee] cursor-pointer shrink-0 tracking-wider"
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
              offset={-40}
              className="text-[10px] font-mono text-[#3d5239] hover:text-[#c8d4c0] cursor-pointer transition-colors uppercase tracking-widest"
              data-testid={`link-nav-${item.to}`}
            >
              {item.name}
            </ScrollLink>
          ))}
        </div>

        <button
          className="md:hidden text-[#7a9472]"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-mobile-menu"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="md:hidden border-t border-[#1a2818] bg-[#070d07] px-6 py-4"
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <ScrollLink
                key={item.name}
                to={item.to}
                smooth={true}
                duration={500}
                offset={-40}
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-mono text-[#3d5239] hover:text-[#c8d4c0] cursor-pointer uppercase tracking-widest"
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
