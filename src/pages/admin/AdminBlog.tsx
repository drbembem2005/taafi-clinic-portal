
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, Plus, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { BlogPost, getBlogPosts } from '@/services/blogService';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getBlogPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء جلب المقالات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const openDeleteDialog = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    try {
      if (!selectedPost) return;
      
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', selectedPost.id);
        
      if (error) throw error;
      
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المقال بنجاح',
      });
      
      fetchPosts();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حذف المقال',
        variant: 'destructive',
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ar });
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة المدونة</h1>
        <Button asChild>
          <Link to="/management-portal/blog/create">
            <Plus className="h-4 w-4 mr-2" /> إضافة مقال
          </Link>
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>العنوان</TableHead>
              <TableHead>الرابط</TableHead>
              <TableHead>تاريخ النشر</TableHead>
              <TableHead className="w-[140px]">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">جاري التحميل...</TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">لا توجد مقالات</TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell dir="ltr">{post.slug}</TableCell>
                  <TableCell>{post.published_at ? formatDate(post.published_at) : 'غير منشور'}</TableCell>
                  <TableCell className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Button asChild size="sm" variant="ghost">
                      <Link to={`/blog/${post.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link to={`/management-portal/blog/edit/${post.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => openDeleteDialog(post)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>هل أنت متأكد من حذف المقال "{selectedPost?.title}"؟</p>
            <p className="text-sm text-red-500 mt-2">لا يمكن التراجع عن هذا الإجراء.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleDelete}>حذف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
