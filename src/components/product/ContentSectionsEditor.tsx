import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { ContentSection } from './ContentSections';

interface ContentSectionsEditorProps {
  sections: ContentSection[];
  onChange: (sections: ContentSection[]) => void;
}

const SECTION_TYPES = [
  { value: 'rich_text', label: 'Rich Text' },
  { value: 'faq', label: 'FAQ' },
  { value: 'size_guide', label: 'Size Guide' },
  { value: 'ingredients', label: 'Ingredients / Materials' },
];

export function ContentSectionsEditor({ sections, onChange }: ContentSectionsEditorProps) {
  const addSection = () => {
    onChange([...sections, {
      type: 'rich_text',
      title: 'Details',
      content: '',
      items: [],
      enabled: true,
      order: sections.length,
    }]);
  };

  const updateSection = (idx: number, updates: Partial<ContentSection>) => {
    const updated = [...sections];
    updated[idx] = { ...updated[idx], ...updates };
    onChange(updated);
  };

  const removeSection = (idx: number) => {
    onChange(sections.filter((_, i) => i !== idx));
  };

  const addFaqItem = (idx: number) => {
    const s = { ...sections[idx] };
    s.items = [...(s.items || []), { q: '', a: '' }];
    const updated = [...sections];
    updated[idx] = s;
    onChange(updated);
  };

  const updateFaqItem = (sIdx: number, fIdx: number, field: 'q' | 'a', value: string) => {
    const s = { ...sections[sIdx] };
    const items = [...(s.items || [])];
    items[fIdx] = { ...items[fIdx], [field]: value };
    s.items = items;
    const updated = [...sections];
    updated[sIdx] = s;
    onChange(updated);
  };

  const removeFaqItem = (sIdx: number, fIdx: number) => {
    const s = { ...sections[sIdx] };
    s.items = (s.items || []).filter((_, i) => i !== fIdx);
    const updated = [...sections];
    updated[sIdx] = s;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Content Sections</Label>
        <Button variant="outline" size="sm" onClick={addSection}>
          <Plus className="h-4 w-4 mr-1" /> Add Section
        </Button>
      </div>

      {sections.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
          No content sections. Add FAQ, Size Guide, or custom content.
        </p>
      )}

      {sections.map((section, idx) => (
        <div key={idx} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <Select
              value={section.type}
              onValueChange={(v) => updateSection(idx, { type: v as ContentSection['type'], title: SECTION_TYPES.find(t => t.value === v)?.label || section.title })}
            >
              <SelectTrigger className="w-40 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SECTION_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              value={section.title}
              onChange={(e) => updateSection(idx, { title: e.target.value })}
              className="flex-1 h-8"
              placeholder="Section title"
            />
            <Switch
              checked={section.enabled}
              onCheckedChange={(c) => updateSection(idx, { enabled: c })}
            />
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeSection(idx)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {section.type === 'faq' ? (
            <div className="space-y-2 pl-6">
              {(section.items || []).map((item, fIdx) => (
                <div key={fIdx} className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <Input
                      value={item.q}
                      onChange={(e) => updateFaqItem(idx, fIdx, 'q', e.target.value)}
                      placeholder="Question"
                      className="h-8 text-sm"
                    />
                    <Input
                      value={item.a}
                      onChange={(e) => updateFaqItem(idx, fIdx, 'a', e.target.value)}
                      placeholder="Answer"
                      className="h-8 text-sm"
                    />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFaqItem(idx, fIdx)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addFaqItem(idx)}>
                <Plus className="h-3 w-3 mr-1" /> Add Q&A
              </Button>
            </div>
          ) : (
            <Textarea
              value={section.content || ''}
              onChange={(e) => updateSection(idx, { content: e.target.value })}
              rows={3}
              placeholder={
                section.type === 'size_guide' ? 'Enter size chart or measurements...' :
                section.type === 'ingredients' ? 'List ingredients, materials, or composition...' :
                'Enter content...'
              }
              className="ml-6"
            />
          )}
        </div>
      ))}
    </div>
  );
}
