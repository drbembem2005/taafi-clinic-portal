
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { LinkIcon, PhoneCall, MessageCircle, User, Stethoscope, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDoctors, getDoctorsBySpecialtyId, type Doctor } from '@/services/doctorService';
import { getSpecialties, type Specialty } from '@/services/specialtyService';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: Option[];
  doctors?: Doctor[];
  specialties?: Specialty[];
  links?: ActionLink[];
  richContent?: string;
}

interface Option {
  id: string;
  text: string;
  action: string;
}

interface ActionLink {
  type: 'booking' | 'whatsapp' | 'phone' | 'link';
  text: string;
  url: string;
  icon: 'phone' | 'message' | 'link';
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Define responseOptions
  const responseOptions: Record<string, Option[]> = {
    main: [
      { id: 'specialties', text: 'التخصصات الطبية', action: 'specialties' },
      { id: 'booking', text: 'حجز موعد', action: 'booking' },
      { id: 'hours', text: 'مواعيد العمل', action: 'hours' },
      { id: 'location', text: 'الموقع والعنوان', action: 'location' },
      { id: 'insurance', text: 'التأمين الطبي', action: 'insurance' },
      { id: 'contact', text: 'معلومات الاتصال', action: 'contact' },
      { id: 'doctors', text: 'الأطباء المتاحون', action: 'doctors' },
      { id: 'prices', text: 'الأسعار والرسوم', action: 'prices' }
    ],
    specialties: [
      { id: 'view-all-specialties', text: 'عرض جميع التخصصات', action: 'view-all-specialties' },
      { id: 'back', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }
    ],
    booking: [
      { id: 'book-online', text: 'حجز موعد عبر الموقع', action: 'book-online' },
      { id: 'book-whatsapp', text: 'حجز موعد عبر الواتساب', action: 'book-whatsapp' },
      { id: 'book-phone', text: 'حجز موعد عبر الهاتف', action: 'book-phone' },
      { id: 'back', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }
    ],
    doctors: [
      { id: 'view-all-doctors', text: 'عرض جميع الأطباء', action: 'view-all-doctors' },
      { id: 'back', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }
    ]
  };

  // Add back-to-main to responseOptions
  responseOptions['back-to-main'] = responseOptions.main;

  // Scroll to bottom of messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableNode = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableNode) {
        scrollableNode.scrollTop = scrollableNode.scrollHeight;
      }
    }
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 1,
        text: 'مرحباً بك في عيادات تعافي التخصصية! 👋\nكيف يمكنني مساعدتك اليوم؟',
        sender: 'bot',
        timestamp: new Date(),
        options: responseOptions.main
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Handle text message send
  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');

    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: 'شكراً لتواصلك معنا. يرجى اختيار أحد الخيارات التالية:',
        sender: 'bot',
        timestamp: new Date(),
        options: responseOptions.main
      };
      
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  // Handle option selection
  const handleOptionClick = async (action: string) => {
    // Find the selected option text
    const selectedOption = Object.values(responseOptions)
      .flat()
      .find(option => option.action === action);

    if (!selectedOption) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: selectedOption.text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let botMessage: Message;

      switch (action) {
        case 'specialties':
        case 'view-all-specialties':
          const specialties = await getSpecialties();
          botMessage = {
            id: messages.length + 2,
            text: 'تضم عيادات تعافي التخصصات الطبية التالية:',
            sender: 'bot',
            timestamp: new Date(),
            specialties: specialties,
            options: [{ id: 'back', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
            links: [
              { 
                type: 'booking',
                text: 'حجز موعد',
                url: '/booking',
                icon: 'link'
              }
            ]
          };
          break;

        case 'doctors':
        case 'view-all-doctors':
          const doctors = await getDoctors();
          botMessage = {
            id: messages.length + 2,
            text: 'الأطباء المتاحون في عيادات تعافي:',
            sender: 'bot',
            timestamp: new Date(),
            doctors: doctors,
            options: [{ id: 'back', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
            links: [
              { 
                type: 'booking',
                text: 'حجز موعد',
                url: '/booking',
                icon: 'link'
              }
            ]
          };
          break;

        case 'booking':
          botMessage = {
            id: messages.length + 2,
            text: 'يمكنك حجز موعد في عيادات تعافي بعدة طرق:',
            sender: 'bot',
            timestamp: new Date(),
            options: responseOptions.booking,
            links: [
              { 
                type: 'booking',
                text: 'حجز موعد الآن',
                url: '/booking',
                icon: 'link'
              },
              { 
                type: 'whatsapp',
                text: 'تواصل عبر واتساب',
                url: 'https://wa.me/201119007403?text=مرحباً، أود حجز موعد في عيادات تعافي',
                icon: 'message'
              },
              { 
                type: 'phone',
                text: 'اتصل بنا',
                url: 'tel:+201119007403',
                icon: 'phone'
              }
            ]
          };
          break;

        case 'book-online':
          botMessage = {
            id: messages.length + 2,
            text: 'يمكنك حجز موعد مباشرة من خلال موقعنا الإلكتروني بالضغط على زر "حجز موعد" أدناه واتباع الخطوات البسيطة.',
            sender: 'bot',
            timestamp: new Date(),
            options: [{ id: 'booking', text: 'خيارات الحجز الأخرى', action: 'booking' }, { id: 'main', text: 'القائمة الرئيسية', action: 'back-to-main' }],
            links: [
              { 
                type: 'booking',
                text: 'حجز موعد الآن',
                url: '/booking',
                icon: 'link'
              }
            ]
          };
          break;

        case 'book-whatsapp':
          botMessage = {
            id: messages.length + 2,
            text: 'يمكنك حجز موعد عبر الواتساب. سيقوم فريقنا بالرد عليك فوراً لتأكيد حجزك.',
            sender: 'bot',
            timestamp: new Date(),
            options: [{ id: 'booking', text: 'خيارات الحجز الأخرى', action: 'booking' }, { id: 'main', text: 'القائمة الرئيسية', action: 'back-to-main' }],
            links: [
              { 
                type: 'whatsapp',
                text: 'تواصل عبر واتساب',
                url: 'https://wa.me/201119007403?text=مرحباً، أود حجز موعد في عيادات تعافي',
                icon: 'message'
              }
            ]
          };
          break;

        case 'book-phone':
          botMessage = {
            id: messages.length + 2,
            text: 'يمكنك حجز موعد عن طريق الاتصال بنا مباشرة خلال ساعات العمل من السبت إلى الخميس من 10 صباحاً حتى 10 مساءً.',
            sender: 'bot',
            timestamp: new Date(),
            richContent: '• 01119007403\n• 38377766',
            options: [{ id: 'booking', text: 'خيارات الحجز الأخرى', action: 'booking' }, { id: 'main', text: 'القائمة الرئيسية', action: 'back-to-main' }],
            links: [
              { 
                type: 'phone',
                text: 'اتصل بنا',
                url: 'tel:+201119007403',
                icon: 'phone'
              }
            ]
          };
          break;

        case 'hours':
          botMessage = {
            id: messages.length + 2,
            text: 'ساعات العمل في عيادات تعافي:',
            sender: 'bot',
            timestamp: new Date(),
            richContent: '• من السبت إلى الخميس: 10 صباحاً - 10 مساءً\n• الجمعة: مغلق\n\nللطوارئ بعد ساعات العمل، يرجى الاتصال على 01119007403',
            options: [{ id: 'back', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
            links: [
              { 
                type: 'phone',
                text: 'اتصل بنا',
                url: 'tel:+201119007403',
                icon: 'phone'
              }
            ]
          };
          break;

        case 'location':
          botMessage = {
            id: messages.length + 2,
            text: 'موقعنا:',
            sender: 'bot',
            timestamp: new Date(),
            richContent: 'ميدان الحصري، أبراج برعي بلازا، برج رقم ٢\nبجوار محل شعبان للملابس، الدور الثالث (يوجد أسانسير)\n6 أكتوبر، القاهرة',
            options: [{ id: 'back', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
            links: [
              { 
                type: 'link',
                text: 'فتح الخريطة',
                url: 'https://maps.google.com/?q=29.9771391,30.9428551',
                icon: 'link'
              }
            ]
          };
          break;

        case 'insurance':
          botMessage = {
            id: messages.length + 2,
            text: 'نتعامل مع العديد من شركات التأمين الطبي:',
            sender: 'bot',
            timestamp: new Date(),
            richContent: '• ميد نت\n• جلوب ميد\n• نكست كير\n• كير بلس\n• وثائق تأمين البنوك\n\nللاستفسار عن تغطية وثيقتك، اتصل بنا على 38377766',
            options: [{ id: 'back', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
            links: [
              { 
                type: 'phone',
                text: 'اتصل للاستفسار',
                url: 'tel:+2038377766',
                icon: 'phone'
              }
            ]
          };
          break;

        case 'contact':
          botMessage = {
            id: messages.length + 2,
            text: 'معلومات الاتصال:',
            sender: 'bot',
            timestamp: new Date(),
            richContent: '• رقم الهاتف: 38377766\n• الموبايل: 01119007403\n• الواتساب: 01119007403\n• البريد الإلكتروني: info@taafi-clinics.com',
            options: [{ id: 'back', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
            links: [
              { 
                type: 'phone',
                text: 'اتصل بنا',
                url: 'tel:+201119007403',
                icon: 'phone'
              },
              { 
                type: 'whatsapp',
                text: 'واتساب',
                url: 'https://wa.me/201119007403',
                icon: 'message'
              }
            ]
          };
          break;

        case 'prices':
          botMessage = {
            id: messages.length + 2,
            text: 'تختلف رسوم الكشف حسب التخصص والطبيب:',
            sender: 'bot',
            timestamp: new Date(),
            richContent: '• رسوم الكشف العادي: تتراوح من 200 إلى 500 جنيه\n• رسوم الاستشارة: تتراوح من 100 إلى 200 جنيه\n• الفحوصات الإضافية: تُحدد حسب نوع الفحص',
            options: [{ id: 'back', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
            links: [
              { 
                type: 'booking',
                text: 'حجز موعد',
                url: '/booking',
                icon: 'link'
              }
            ]
          };
          break;

        case 'back-to-main':
        default:
          botMessage = {
            id: messages.length + 2,
            text: 'كيف يمكنني مساعدتك اليوم؟',
            sender: 'bot',
            timestamp: new Date(),
            options: responseOptions.main
          };
          break;
      }

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 800);

    } catch (error) {
      console.error('Error fetching data:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: 'عذراً، حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.',
        sender: 'bot',
        timestamp: new Date(),
        options: responseOptions.main
      };
      
      setTimeout(() => {
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
      }, 500);
    }
  };

  // Function to handle specialty selection
  const handleSpecialtyClick = async (specialtyId: number, specialtyName: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: specialtyName,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const doctors = await getDoctorsBySpecialtyId(specialtyId);
      const botMessage: Message = {
        id: messages.length + 2,
        text: `أطباء ${specialtyName}:`,
        sender: 'bot',
        timestamp: new Date(),
        doctors: doctors,
        options: [
          { id: 'specialties', text: 'الرجوع للتخصصات', action: 'view-all-specialties' },
          { id: 'main', text: 'القائمة الرئيسية', action: 'back-to-main' }
        ],
        links: [
          { 
            type: 'booking',
            text: `حجز موعد في ${specialtyName}`,
            url: `/booking?specialty=${encodeURIComponent(specialtyName)}`,
            icon: 'link'
          }
        ]
      };
      
      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setIsLoading(false);
    }
  };

  // Function to render action links
  const renderActionLinks = (links: ActionLink[]) => {
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {links.map((link, index) => {
          const IconComponent = 
            link.icon === 'phone' ? PhoneCall :
            link.icon === 'message' ? MessageCircle :
            LinkIcon;
            
          if (link.url.startsWith('http') || link.url.startsWith('tel:') || link.url.startsWith('mailto:')) {
            return (
              <a 
                key={index}
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-brand/90 px-3 py-1.5 text-sm text-white hover:bg-brand transition-colors"
              >
                <IconComponent size={16} />
                <span>{link.text}</span>
              </a>
            );
          }
          
          return (
            <Link
              key={index}
              to={link.url}
              className="inline-flex items-center gap-2 rounded-md bg-brand/90 px-3 py-1.5 text-sm text-white hover:bg-brand transition-colors"
            >
              <IconComponent size={16} />
              <span>{link.text}</span>
            </Link>
          );
        })}
      </div>
    );
  };

  // Function to render specialty cards
  const renderSpecialtyCards = (specialties: Specialty[]) => {
    return (
      <div className="grid grid-cols-1 gap-3 mt-3">
        {specialties.map((specialty) => (
          <Card 
            key={specialty.id} 
            className="p-3 hover:bg-brand/5 cursor-pointer transition-colors border-l-4 border-l-brand/20"
            onClick={() => handleSpecialtyClick(specialty.id, specialty.name)}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                <Stethoscope size={20} className="text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 mb-1">{specialty.name}</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{specialty.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  // Function to render doctor cards
  const renderDoctorCards = (doctors: Doctor[]) => {
    return (
      <div className="grid grid-cols-1 gap-3 mt-3">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="p-3 bg-gradient-to-r from-brand/5 to-transparent border border-brand/10">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-brand/20">
                <div className="bg-gradient-to-br from-brand/20 to-brand/40 h-full w-full rounded-full flex items-center justify-center">
                  <User size={20} className="text-brand" />
                </div>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900">{doctor.name}</h4>
                <div className="flex items-center gap-1 mt-1">
                  <Stethoscope size={12} className="text-brand" />
                  <p className="text-xs text-gray-600">متخصص</p>
                </div>
                {doctor.fees && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-brand font-medium">
                      كشف: {doctor.fees.examination} جنيه
                    </span>
                  </div>
                )}
              </div>
              <Link 
                to={`/booking?doctor=${doctor.id}`}
                className="shrink-0 text-xs bg-brand text-white hover:bg-brand-dark px-3 py-1.5 rounded-md transition-colors"
              >
                حجز موعد
              </Link>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-20 left-4 z-50 flex flex-col gap-3 lg:bottom-8">
        <Button
          className="w-14 h-14 rounded-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand shadow-lg transform hover:scale-105 transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 left-6 z-50 bg-white rounded-xl shadow-2xl w-80 md:w-96 overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand to-brand-dark text-white p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white/20">
                  <div className="bg-white/20 h-full w-full rounded-full flex items-center justify-center">
                    <Stethoscope size={20} className="text-white" />
                  </div>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">مساعد تعافي الذكي</h3>
                  <p className="text-sm opacity-90">متاح 24/7 لخدمتك</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="h-80 p-4 bg-gray-50/30" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="space-y-3">
                    <div
                      className={`flex ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.sender === 'bot' && (
                        <Avatar className="h-8 w-8 ml-2">
                          <div className="bg-gradient-to-br from-brand to-brand-dark h-full w-full rounded-full flex items-center justify-center">
                            <Stethoscope size={16} className="text-white" />
                          </div>
                        </Avatar>
                      )}
                      
                      <div
                        className={`rounded-xl px-4 py-2 max-w-[85%] shadow-sm ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-brand to-brand-dark text-white'
                            : 'bg-white text-gray-800 border border-gray-100'
                        }`}
                      >
                        {msg.text.split('\n').map((line, index) => (
                          <span key={index}>
                            {line}
                            {index < msg.text.split('\n').length - 1 && <br />}
                          </span>
                        ))}

                        {/* Rich content */}
                        {msg.sender === 'bot' && msg.richContent && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            {msg.richContent.split('\n').map((line, index) => (
                              <div key={index} className="text-sm text-gray-600">
                                {line}
                                {index < msg.richContent!.split('\n').length - 1 && <br />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {msg.sender === 'user' && (
                        <Avatar className="h-8 w-8 mr-2">
                          <div className="bg-gray-300 h-full w-full rounded-full flex items-center justify-center">
                            <User size={16} className="text-gray-600" />
                          </div>
                        </Avatar>
                      )}
                    </div>
                    
                    {/* Specialty Cards */}
                    {msg.sender === 'bot' && msg.specialties && msg.specialties.length > 0 && (
                      <div className="mr-10">
                        {renderSpecialtyCards(msg.specialties)}
                      </div>
                    )}

                    {/* Doctor Cards */}
                    {msg.sender === 'bot' && msg.doctors && msg.doctors.length > 0 && (
                      <div className="mr-10">
                        {renderDoctorCards(msg.doctors)}
                      </div>
                    )}

                    {/* Action Links */}
                    {msg.sender === 'bot' && msg.links && msg.links.length > 0 && (
                      <div className="mr-10">
                        {renderActionLinks(msg.links)}
                      </div>
                    )}
                    
                    {/* Option buttons */}
                    {msg.sender === 'bot' && msg.options && msg.options.length > 0 && (
                      <div className="mr-10 flex flex-wrap gap-2 justify-start">
                        {msg.options.map((option) => (
                          <Badge
                            key={option.id}
                            className="bg-gradient-to-r from-brand/10 to-brand/5 hover:from-brand/20 hover:to-brand/10 text-brand hover:text-brand-dark cursor-pointer px-3 py-1.5 border border-brand/20 transition-all"
                            onClick={() => handleOptionClick(option.action)}
                          >
                            {option.text}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <Avatar className="h-8 w-8 ml-2">
                      <div className="bg-gradient-to-br from-brand to-brand-dark h-full w-full rounded-full flex items-center justify-center">
                        <Stethoscope size={16} className="text-white" />
                      </div>
                    </Avatar>
                    <div className="bg-white rounded-xl px-4 py-2 border border-gray-100 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-brand rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-gray-100 p-3 bg-white flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 border-gray-200 focus:border-brand rounded-lg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <Button
                className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand px-4"
                onClick={handleSendMessage}
                type="button"
                disabled={isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transform rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
