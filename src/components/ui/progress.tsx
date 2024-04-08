import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { value: number }
>((props, ref) => {
  const { className, value, ...rest } = props;
  const [progressValue, setProgressValue] = React.useState(0);

  React.useEffect(() => {
    if (value > progressValue) {
      const increment = 30;
      const interval = 900 / (100 / increment);
      const timer = setInterval(() => {
        setProgressValue(prevValue => {
          const newValue = prevValue + increment;
          return newValue > value ? value : newValue;
        });
      }, interval);
      return () => clearInterval(timer);
    }
  }, [value, progressValue]);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...rest}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - progressValue}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };