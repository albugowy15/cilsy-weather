import { LoaderCircle } from "lucide-react";
import * as React from "react";

const LoadingSpin = (props: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <p className="leading-7 [&:not(:first-child)]:mt-3">{props.message}...</p>
      <LoaderCircle className="h-10 w-10 animate-spin" />
    </div>
  );
};

export default LoadingSpin;
