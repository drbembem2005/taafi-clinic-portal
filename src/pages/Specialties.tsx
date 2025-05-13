
import { useState, useEffect } from 'react';
import { getSpecialties, Specialty } from '@/services/specialtyService';
import SpecialtyCard from '@/components/shared/SpecialtyCard';
import { Skeleton } from '@/components/ui/skeleton';

const Specialties = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialties = async () => {
      setLoading(true);
      const fetchedSpecialties = await getSpecialties();
      setSpecialties(fetchedSpecialties);
      setLoading(false);
    };

    fetchSpecialties();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">التخصصات الطبية</h1>
      
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden h-64">
              <Skeleton className="h-full w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty) => (
            <SpecialtyCard key={specialty.id} specialty={specialty} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Specialties;
