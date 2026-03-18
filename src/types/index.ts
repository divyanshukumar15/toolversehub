export interface Tool {
  id: string;
  name: string;
  slug: string;
  category: 'text' | 'math' | 'image' | 'utility';
  icon: string;
  shortDesc: string;
  metaTitle: string;
  metaDesc: string;
  h1: string;
  intro: string;
  usageGuide: string[];
  features: string[];
  benefits: string[];
  faqs: { q: string; a: string }[];
  programmaticSections: { title: string; content: string }[];
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  slug: string;
  metaTitle: string;
  metaDesc: string;
  h1: string;
  intro: string;
}
