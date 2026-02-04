import L4Logo from "@/components/L4Logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <L4Logo size={80} animated />

        <span className="text-xs text-white/50 tracking-wide">
          Preparing your experience
        </span>
      </div>
    </div>
  );
}
