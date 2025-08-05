import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface FullScreenLoaderProps {
  message?: string;
}

const FullScreenLoader = ({ message = "Processing..." }: FullScreenLoaderProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 text-white animate-spin mb-4" />
        <p className="text-white text-sm text-center">{message}</p>
      </div>
    </div>,
    document.body
  );
};

export default FullScreenLoader;
