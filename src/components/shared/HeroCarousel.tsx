
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: '/lovable-uploads/d6fc17dc-87c4-4be4-b217-48c01b58e6c1.png',
    title: 'مرحباً بك في تعافي التخصصية!',
    description: 'رعاية طبية متكاملة بأحدث التقنيات وبأيدي نخبة من الأطباء المتخصصين',
    buttonText: 'احجز موعداً',
    buttonLink: '/booking',
  },
  {
    id: 2,
    image: '/lovable-uploads/d803ed52-76e2-41fb-979e-a23a19d6b039.png',
    title: '14 تخصصاً طبياً تحت سقف واحد',
    description: 'فريق متكامل من الاستشاريين والأخصائيين لتقديم أفضل رعاية طبية',
    buttonText: 'تعرف على تخصصاتنا',
    buttonLink: '/specialties',
  },
  {
    id: 3,
    image: '/lovable-uploads/d6fc17dc-87c4-4be4-b217-48c01b58e6c1.png',
    title: 'متابعة دقيقة وأجهزة متطورة',
    description: 'نستخدم أحدث الأجهزة والتقنيات الطبية لتشخيص وعلاج مختلف الحالات',
    buttonText: 'اكتشف خدماتنا',
    buttonLink: '/about',
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-[70vh] max-h-[600px] min-h-[400px] overflow-hidden">
      <AnimatePresence mode="wait">
        {slides.map((slide, index) => (
          <motion.div
            key={slide.id}
            className={`absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10 flex items-center justify-center ${
              index === currentSlide ? 'block' : 'hidden'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="container px-4 mx-auto text-center text-white">
              <motion.h2 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {slide.title}
              </motion.h2>
              <motion.p 
                className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {slide.description}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button 
                  size="lg" 
                  className="bg-brand hover:bg-brand-dark text-white px-6 py-6 text-xl"
                  asChild
                >
                  <a href={slide.buttonLink}>{slide.buttonText}</a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}

        {/* Background Images */}
        <AnimatePresence>
          <motion.div
            key={`image-${currentSlide}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="object-cover w-full h-full"
            />
          </motion.div>
        </AnimatePresence>

        {/* Slider Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default HeroCarousel;
