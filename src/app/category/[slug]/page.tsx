'use client';

import { useParams } from 'next/navigation';
import CategoryBrowser from '@/components/CategoryBrowser';

export default function CategorySlugPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  // Capitalize nicely for the title (e.g. "smartphones" → "Smartphones")
  const displayTitle = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <CategoryBrowser 
      initialCategorySlug={slug} 
      title={displayTitle} 
    />
  );
}
