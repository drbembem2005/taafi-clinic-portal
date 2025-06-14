
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Video, Phone, MessageCircle, Clock, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const TelemedicineSection = () => {
  const features = [
    {
      icon: Video,
      title: 'استشارة بالفيديو',
      description: 'تواصل مع الطبيب وجهاً لوجه من منزلك'
    },
    {
      icon: Phone,
      title: 'استشارة صوتية',
      description: 'استشارة طبية سريعة عبر المكالمة الصوتية'
    },
    {
      icon: MessageCircle,
      title: 'واتساب',
      description: 'تواصل مع الطبيب عبر تطبيق واتساب'
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'وفر وقتك',
      description: 'لا حاجة للانتظار أو السفر للعيادة'
    },
    {
      icon: Shield,
      title: 'آمن ومضمون',
      description: 'حماية كاملة لبياناتك الشخصية والطبية'
    },
    {
      icon: Users,
      title: 'أطباء متخصصون',
      description: 'نفس فريق الأطباء المتميزين في العيادة'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">الكشف الأونلاين</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            احصل على استشارة طبية متخصصة من منزلك مع أطباء تعافي عبر الفيديو أو الهاتف أو واتساب
          </p>
          <div className="w-24 h-1 bg-brand mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand to-brand-light rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h4>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link to="/telemedicine">
            <Button 
              size="lg" 
              className="bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              اطلب استشارة أونلاين الآن
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TelemedicineSection;
