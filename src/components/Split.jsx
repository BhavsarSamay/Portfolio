// Splits text into masked words and characters for GSAP reveals.
// The visible markup is aria-hidden; the wrapper carries the real text for screen readers.
export default function Split({ text, as: Tag = "span", className = "", chars = true }) {
  const words = text.split(" ");
  return (
    <Tag className={`split ${className}`} aria-label={text}>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i}>
            <span className="w">
              {chars
                ? [...word].map((ch, j) => (
                    <span className="c" key={j}>
                      {ch}
                    </span>
                  ))
                : <span className="c">{word}</span>}
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
