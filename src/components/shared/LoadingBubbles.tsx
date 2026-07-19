interface LoadingBubblesProps {
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { dot: "h-1.5 w-1.5", gap: "gap-1", container: "py-1" },
  md: { dot: "h-3 w-3", gap: "gap-1.5", container: "py-4" },
  lg: { dot: "h-4 w-4", gap: "gap-2", container: "py-16" },
};

export default function LoadingBubbles({ size = "md" }: LoadingBubblesProps) {
  const { dot, gap, container } = sizeMap[size];

  return (
    <div className={`flex items-center justify-center ${container}`}>
      <div className={`flex ${gap}`}>
        <div className={`${dot} bg-primary animate-bounce rounded-full [animation-delay:0ms]`} />
        <div className={`${dot} bg-primary animate-bounce rounded-full [animation-delay:150ms]`} />
        <div className={`${dot} bg-primary animate-bounce rounded-full [animation-delay:300ms]`} />
      </div>
    </div>
  );
}
