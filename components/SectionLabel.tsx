export default function SectionLabel({ index, path }: { index: string; path: string }) {
  return (
    <p className="section-label mono">
      <span className="accent">{index}</span> {"//"} ~/{path}
    </p>
  );
}
