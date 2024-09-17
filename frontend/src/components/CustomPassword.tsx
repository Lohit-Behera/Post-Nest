import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";

const CustomPassword = forwardRef<HTMLInputElement, { placeholder: string }>(
  ({ placeholder, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="flex h-9 w-full rounded-md border border-input bg-background shadow-sm transition-colors placeholder:text-muted-foreground focus-within:ring-1 ring-ring">
        <Input
          className="h-auto border-0 focus-visible:outline-none focus-visible:ring-0 bg-background w-full"
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="px-1 py-1 cursor-pointer"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </span>
      </div>
    );
  }
);

export default CustomPassword;
