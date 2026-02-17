import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type StorefrontTheme = 'default' | 'minimal' | 'elegant' | 'playful' | 'bold';

interface ThemeContextType {
  theme: StorefrontTheme;
  setTheme: (theme: StorefrontTheme) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'default',
  setTheme: () => {},
  isLoading: true,
});

export const THEME_OPTIONS: { value: StorefrontTheme; label: string; description: string }[] = [
  { value: 'default', label: 'Zoho Classic', description: 'Clean blue & white professional design' },
  { value: 'minimal', label: 'Minimal Clean', description: 'White space, subtle borders, simple typography' },
  { value: 'elegant', label: 'Elegant Luxury', description: 'Dark tones, serif fonts, gold accents' },
  { value: 'playful', label: 'Playful Modern', description: 'Rounded shapes, gradients, vibrant colors' },
  { value: 'bold', label: 'Bold Vibrant', description: 'Strong colors, large imagery, dynamic layout' },
];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<StorefrontTheme>('default');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTheme();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-storefront-theme', theme);
  }, [theme]);

  const fetchTheme = async () => {
    const { data } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'storefront_theme')
      .single();
    if (data?.value) {
      const val = data.value as { theme: StorefrontTheme };
      setThemeState(val.theme || 'default');
    }
    setIsLoading(false);
  };

  const setTheme = async (newTheme: StorefrontTheme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-storefront-theme', newTheme);
    
    // Upsert to store_settings
    const { data: existing } = await supabase
      .from('store_settings')
      .select('id')
      .eq('key', 'storefront_theme')
      .single();

    if (existing) {
      await supabase
        .from('store_settings')
        .update({ value: { theme: newTheme } as any })
        .eq('key', 'storefront_theme');
    } else {
      await supabase
        .from('store_settings')
        .insert({ key: 'storefront_theme', value: { theme: newTheme } as any });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useStorefrontTheme = () => useContext(ThemeContext);
