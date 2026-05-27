import { motion } from "framer-motion";

export function AuthBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <motion.div
        className="absolute -top-1/3 left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, oklch(0.78 0.13 200 / 0.18), transparent 35%, oklch(0.55 0.18 280 / 0.14) 60%, transparent 80%, oklch(0.78 0.13 200 / 0.18))",
          filter: "blur(80px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-[-200px] right-[-200px] h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.13 200 / 0.15), transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background/80" />
    </div>
  );
}
