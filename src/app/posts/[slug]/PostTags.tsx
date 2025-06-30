"use client";

import Tag from "@/app/components/ui/Tag";
import { useTagNavigation } from "@/app/hooks/useTagNavigation";

type Props = {
  tags: string[];
};

export default function PostTags({ tags }: Props) {
  const goToTagPage = useTagNavigation();

  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-6">
      {tags.map((tag) => (
        <Tag key={tag} name={tag} onClick={() => goToTagPage(tag)} />
      ))}
    </div>
  );
}
