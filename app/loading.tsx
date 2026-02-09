import L4Logo from "@/components/L4Logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-5">
        <L4Logo size={96} animated />

        <span className="text-[11px] tracking-[0.2em] text-white/50">
          PREPARING YOUR EXPERIENCE
        </span>
      </div>
    </div>
  );
}
