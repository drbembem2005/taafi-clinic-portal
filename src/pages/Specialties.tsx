
import { useState, useEffect } from 'react';
import { getSpecialties, Specialty } from '@/services/specialtyService';
import SpecialtyCard from '@/components/shared/SpecialtyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Specialties = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        console.log('Fetching specialties...');
        setLoading(true);
        setError(null);
        const fetchedSpecialties = await getSpecialties();
        console.log('Fetched specialties:', fetchedSpecialties);
        setSpecialties(fetchedSpecialties);
      } catch (err) {
        console.error('Error fetching specialties:', err);
        setError('حدث خطأ أثناء تحميل التخصصات. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">التخصصات الطبية</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden h-64">
              <Skeleton className="h-full w-full" />
            </div>
          ))}
        </div>
      ) : specialties.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty) => (
            <SpecialtyCard key={specialty.id} specialty={specialty} />
          ))}
        </div>
      ) : !error && (
        <div className="text-center py-12">
          <p className="text-gray-500">لا توجد تخصصات متاحة حاليًا</p>
        </div>
      )}
    </div>
  );
};

export default Specialties;
