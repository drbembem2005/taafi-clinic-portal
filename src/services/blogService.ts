
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  excerpt: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });
    
    if (error) {
      toast({
        title: "Error fetching blog posts",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      toast({
        title: "Error fetching blog post",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
};
