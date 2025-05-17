
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { seedDoctorSchedules } from '@/utils/seedScheduleData';
import { Loader2 } from 'lucide-react';

const SeedScheduleButton = () => {
  const [loading, setLoading] = useState(false);

  const handleSeedSchedules = async () => {
    setLoading(true);
    try {
      await seedDoctorSchedules();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleSeedSchedules} 
      disabled={loading}
      className="ml-2"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin ml-1" />
          جاري الإعداد...
        </>
      ) : (
        'تجهيز جداول الأطباء'
      )}
    </Button>
  );
};

export default SeedScheduleButton;
