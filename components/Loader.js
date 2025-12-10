import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <Loader2
      size={18}
      className="spin"
      style={{ display: "inline-block" }}
    />
  );
}
