// app/components/ui/TagFilterDisplay.tsx
import Link from "next/link";
import clsx from "clsx";

type Props = {
  tag: string;
  className?: string;
  /** Where “Browse by Tag” should point (defaults to /tags) */
  browseHref?: string;
  /** Custom label (defaults to "Browse by Tag") */
  browseLabel?: string;
  /** Hide the “Blogs” link when true */
  hideBlogs?: boolean;
};

export default function TagFilterDisplay({
  tag,
  className,
  browseHref = "/tags",
  browseLabel = "Browse by Tag",
}: Props) {
  return (
    <div className={clsx("flex items-center justify-between", className)}>
      <nav className="flex items-center gap-4 text-sm">
        <Link href={browseHref} className="hover:underline">
          {browseLabel}
        </Link>
      </nav>
      <p className="text-sm text-muted-foreground">
        Showing posts tagged with: <strong>#{tag.toLowerCase()}</strong>
      </p>
    </div>
  );
}
