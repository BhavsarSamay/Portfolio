import { useId } from "react";

// Slowly rotating circular label. Decorative, so it is hidden from assistive tech.
export default function RingText({ text = "Product · Systems · Full-Stack · AI · ", className = "" }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={`ring ${className}`} viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <path id={id} d="M100 100m-82 0a82 82 0 1 1 164 0a82 82 0 1 1-164 0" />
      </defs>
      <text>
        <textPath href={`#${id}`} textLength="512" lengthAdjust="spacing">{text.repeat(2)}</textPath>
      </text>
    </svg>
  );
}
