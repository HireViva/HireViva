import { motion } from "framer-motion";
import {
  Linkedin,
  Github,
  Mail,
  MapPin,
  Phone
} from "lucide-react";
import { Link } from "react-router-dom";



const footerLinks = {
  company: [
    { label: "About Us", href: "/about-us" },
    { label: "Contact", href: "/contact" },
    { label: "Pricing", href: "/pricing" },

    { label: "Terms and Conditions", href: "/terms-and-conditions" },
    { label: "Cancellation and Refund Policy", href: "/cancellation-and-refund-policy" }
  ]
};

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Footer() {




  return (
    <footer className="relative border-t border-border/30 py-8">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] pointer-events-none">
        <div className="glow-orb w-full h-full bg-purple-glow/10" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 container mx-auto px-4"
      >
        {/* Single Row Footer Layout */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8"
        >
          {/* Logo/Brand - Left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-glow to-cyan-accent flex items-center justify-center">
              <span className="text-foreground font-bold text-lg">H</span>
            </div>
            <motion.span
              className="brand-text text-2xl font-bold bg-gradient-to-r from-purple-glow via-cyan-accent to-pink-500 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: '200% 200%' }}
            >
              HireViva
            </motion.span>
          </div>

          {/* Navigation Links - Center */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => e.preventDefault()}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Links - Right */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                onClick={(e) => e.preventDefault()}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-purple-glow/20 transition-all"
                aria-label={social.label}
              >
                <social.icon size={16} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Copyright - Bottom */}
        <motion.div
          variants={itemVariants}
          className="mt-6 pt-6 border-t border-border/30 text-center"
        >
          <p className="text-muted-foreground text-sm">
            © 2026 HireViva. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}
