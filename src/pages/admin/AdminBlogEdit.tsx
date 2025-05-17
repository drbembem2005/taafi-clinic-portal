
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogPost } from '@/services/blogService';
import { supabase } from '@/integrations/supabase/client';

const AdminBlogEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
  });
  
  useEffect(() => {
    if (id) {
      fetchPost(parseInt(id, 10));
    }
  }, [id]);
  
  const fetchPost = async (postId: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();
      
      if (error) throw error;
      
      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image || '',
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء جلب بيانات المقال',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/-+/g, '-'); // Replace multiple - with single -
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug === '' ? generateSlug(title) : prev.slug,
    }));
  };
  
  const handleSubmit = async () => {
    // Validate form
    if (!formData.title || !formData.slug || !formData.content || !formData.excerpt) {
      toast({
        title: 'خطأ في البيانات',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }
    
    setSaving(true);
    
    try {
      const now = new Date().toISOString();
      
      if (id) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: formData.title,
            slug: formData.slug,
            excerpt: formData.excerpt,
            content: formData.content,
            image: formData.image || null,
            updated_at: now,
          })
          .eq('id', parseInt(id, 10));
        
        if (error) throw error;
        
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث المقال بنجاح',
        });
      } else {
        // Create new post
        const { error } = await supabase.from('blog_posts').insert({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          image: formData.image || null,
          published_at: now,
          created_at: now,
          updated_at: now,
        });
        
        if (error) throw error;
        
        toast({
          title: 'تمت الإضافة',
          description: 'تم نشر المقال بنجاح',
        });
      }
      
      navigate('/management-portal/blog');
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ المقال',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8 border-4 border-brand rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {id ? 'تعديل مقال' : 'إضافة مقال جديد'}
        </h1>
        <div className="flex space-x-2 rtl:space-x-reverse">
          <Button variant="outline" onClick={() => navigate('/management-portal/blog')}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'جاري الحفظ...' : id ? 'تحديث المقال' : 'نشر المقال'}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>المعلومات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">عنوان المقال</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="عنوان المقال"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">الرابط المختصر</label>
              <Input
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="example-article-slug"
                dir="ltr"
              />
              <p className="text-xs text-gray-500 mt-1">
                سيظهر المقال على الرابط: /blog/{formData.slug || 'example-slug'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">صورة المقال (رابط)</label>
              <Input
                name="image"
                value={formData.image || ''}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                dir="ltr"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">وصف مختصر</label>
              <Textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="ملخص قصير للمقال (يظهر في قائمة المقالات)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>محتوى المقال</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="اكتب محتوى المقال هنا..."
              className="min-h-[400px]"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminBlogEdit;
