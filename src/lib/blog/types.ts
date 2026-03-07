export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  publishDate: string;
  updatedDate: string;
  author: {
    name: string;
    role: string;
  };
  category: string;
  tags: string[];
  readTime: number;
  featuredImage?: string;
  featuredImageAlt?: string;
  content: string;
  faqs: {
    question: string;
    answer: string;
  }[];
}
