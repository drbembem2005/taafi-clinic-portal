import { motion } from 'framer-motion';

const About = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">عن عيادات تعافي التخصصية</h1>
            <p className="text-xl text-gray-600">
              مركز طبي متكامل يضم نخبة من الأطباء في مختلف التخصصات
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">من نحن</h2>
              <div className="w-20 h-1 bg-brand mb-6"></div>
              <p className="text-gray-700 mb-4">
                عيادات تعافي التخصصية هي مركز طبي رائد في مدينة ٦ أكتوبر، يقدم رعاية طبية متكاملة على أعلى مستوى من الجودة والاحترافية.
              </p>
              <p className="text-gray-700 mb-4">
                نسعى دائماً لتقديم أفضل الخدمات الطبية باستخدام أحدث التقنيات والأجهزة، وبأيدي نخبة من الأطباء المتخصصين في مختلف المجالات الطبية.
              </p>
              <p className="text-gray-700">
                نفتخر بتوفير بيئة طبية متطورة ومريحة تضمن للمراجعين الحصول على أفضل تجربة علاجية في جو من الخصوصية والاهتمام.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src="/lovable-uploads/d6fc17dc-87c4-4be4-b217-48c01b58e6c1.png"
                alt="عيادات تعافي التخصصية"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision and Mission */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              className="bg-white p-8 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex justify-center mb-4 text-brand">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">رؤيتنا</h3>
              <p className="text-gray-700 text-center">
                نتطلع إلى أن نكون الوجهة الأولى للرعاية الصحية المتكاملة في مدينة ٦ أكتوبر والمناطق المحيطة بها، من خلال تقديم خدمات طبية متميزة ومبتكرة تسهم في تحسين جودة حياة المرضى وتعزيز صحتهم.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="flex justify-center mb-4 text-brand">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">رسالتنا</h3>
              <p className="text-gray-700 text-center">
                نلتزم بتقديم رعاية طبية شاملة وعالية الجودة في بيئة آمنة ومريحة، من خلال فريق طبي متميز وباستخدام أحدث التقنيات، مع التركيز على تلبية احتياجات المرضى وتجاوز توقعاتهم في جميع مراحل الرعاية الطبية.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">موقعنا</h2>
            <div className="w-24 h-1 bg-brand mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              ميدان الحصري، أبراج برعي بلازا، برج رقم ٢، بجوار محل شعبان للملابس، الدور الثالث (يوجد أسانسير) – 6 أكتوبر، القاهرة
            </p>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13824.76275261958!2d31.0113088!3d29.9733345!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDA1JzQ2LjMiTiAzMcKwMDEnMTUuNCJF!5e0!3m2!1sen!2seg!4v1629458450283!5m2!1sen!2seg"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
