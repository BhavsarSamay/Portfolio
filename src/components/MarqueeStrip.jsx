const ITEMS = [
  'Product Manager',
  'Full-Stack Engineer',
  'AI Builder',
  'Node.js',
  'React',
  'LangChain',
  'Socket.io',
  'MongoDB',
  'System Architecture',
  'RAG Pipelines',
  'Microservices',
  'Ahmedabad India',
  'Available for Work',
];

export default function MarqueeStrip() {
  // Duplicate for seamless loop
  const all = [...ITEMS, ...ITEMS];

  return (
    <div className="marquee-wrap" role="marquee" aria-label="Skills and roles ticker">
      <div className="marquee-track">
        {all.map((item, i) => (
          <div key={i} className="marquee-item">
            <div className="marquee-dot" aria-hidden="true" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
