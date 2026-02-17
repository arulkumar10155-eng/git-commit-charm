import { memo } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

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
    <Accordion type="multiple" className="w-full">
      {enabled.map((section, i) => (
        <AccordionItem key={i} value={`section-${i}`}>
          <AccordionTrigger className="text-sm font-semibold">
            <span className="flex items-center gap-2">
              {section.title}
              <Badge variant="outline" className="text-[10px] font-normal capitalize">{section.type.replace('_', ' ')}</Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {section.type === 'faq' && section.items ? (
              <div className="space-y-3">
                {section.items.map((item, j) => (
                  <div key={j} className="border-l-2 border-primary/30 pl-3">
                    <p className="font-medium text-sm text-foreground">{item.q}</p>
                    <p className="text-sm text-muted-foreground mt-1">{item.a}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap text-sm">
                {section.content || 'No content available.'}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
});
