// A reusable component that shows which tag is currently being used to filter blog posts.
// It also provides a "Clear filter" button to reset the tag selection.

"use client";

export default function TagFilterDisplay({
  tag,
  onClear,
}: {
  tag: string;
  onClear: () => void;
}) {
  return (
    <div className="mb-6">
      <span className="text-sm" style={{ color: "var(--color-muted-text)" }}>
        Filtering by tag:
        <span
          className="ml-1 font-semibold"
          style={{ color: "var(--color-foreground)" }}
        >
          #{tag}
        </span>
      </span>

      <button
        onClick={onClear}
        className="ml-4 text-sm cursor-pointer hover:brightness-70"
        style={{
          color: "var(--color-primary)",
          textDecoration: "underline",
        }}
      >
        Clear filter
      </button>
    </div>
  );
}
