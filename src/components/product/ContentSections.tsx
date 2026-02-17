import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export interface ContentSection {
  type: 'rich_text' | 'faq' | 'size_guide' | 'ingredients';
  title: string;
  content?: string;
  items?: { q: string; a: string }[];
  enabled: boolean;
  order: number;
}

interface ContentSectionsProps {
  sections: ContentSection[];
}

export const ContentSections = memo(function ContentSections({ sections }: ContentSectionsProps) {
  const enabled = sections.filter(s => s.enabled).sort((a, b) => a.order - b.order);
  if (enabled.length === 0) return null;

  return (
    <div className="space-y-8">
      {enabled.map((section, i) => (
        <div key={i}>
          {i > 0 && <Separator className="mb-8" />}
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">
              {section.title}
            </h2>
            {section.type === 'faq' && section.items ? (
              <div className="space-y-4">
                {section.items.map((item, j) => (
                  <div key={j}>
                    <p className="font-semibold text-sm text-foreground mb-1">{item.q}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                {section.content || 'No content available.'}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});
