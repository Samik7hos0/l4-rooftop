"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FilterType } from "../page";

type Props = {
  open: boolean;
  onClose: () => void;
  query: string;
  setQuery: (v: string) => void;
  filter: FilterType;
  setFilter: (v: FilterType) => void;
};

export default function ToolbarModal({
  open,
  onClose,
  query,
  setQuery,
  filter,
  setFilter,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
            className="
              w-[92%] max-w-lg
              rounded-2xl
              bg-black/90
              border border-white/10
              shadow-2xl
              p-6 space-y-5
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="text-white/70 text-sm">Quick Tools</p>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white transition"
              >
                Esc
              </button>
            </div>

            {/* Search */}
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reservations…"
              className="
                w-full px-4 py-3 rounded-lg
                bg-black border border-white/15
                text-white placeholder-white/40
                focus:outline-none focus:ring-1 focus:ring-white/30
              "
            />

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                "all",
                "today",
                "pending",
                "confirmed",
                "large",
                "special",
                "past",
              ].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as FilterType)}
                  className={`
                    px-3 py-1.5 rounded-md text-sm transition
                    ${
                      filter === f
                        ? "bg-white text-black"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }
                  `}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Mobile close */}
            <button
              onClick={onClose}
              className="md:hidden w-full py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
