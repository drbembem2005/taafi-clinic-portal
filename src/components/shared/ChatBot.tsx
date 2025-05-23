
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { LinkIcon, PhoneCall, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: Option[];
  doctorInfo?: DoctorInfo;
  links?: ActionLink[];
  richContent?: string;
}

interface Option {
  id: string;
  text: string;
  action: string;
}

interface DoctorInfo {
  name: string;
  specialty: string;
  imageUrl?: string;
  id?: number;
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Define responseOptions at the top
  const responseOptions: Record<string, Option[]> = {
    main: [
      { id: 'specialties', text: 'التخصصات الطبية', action: 'specialties' },
      { id: 'booking', text: 'حجز موعد', action: 'booking' },
      { id: 'hours', text: 'مواعيد العمل', action: 'hours' },
      { id: 'location', text: 'الموقع والعنوان', action: 'location' },
      { id: 'insurance', text: 'التأمين الطبي', action: 'insurance' },
      { id: 'contact', text: 'معلومات الاتصال', action: 'contact' },
      { id: 'doctors', text: 'معلومات عن الأطباء', action: 'doctors' },
      { id: 'prices', text: 'الأسعار والرسوم', action: 'prices' }
    ],
    specialties: [
      { id: 'specialties-list', text: 'عرض التخصصات', action: 'specialties-list' },
      { id: 'pediatric', text: 'طب الأطفال', action: 'pediatric' },
      { id: 'gynecology', text: 'النساء والتوليد', action: 'gynecology' },
      { id: 'dermatology', text: 'الجلدية والتجميل', action: 'dermatology' },
      { id: 'back', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }
    ],
    booking: [
      { id: 'book-online', text: 'حجز موعد عبر الموقع', action: 'book-online' },
      { id: 'book-whatsapp', text: 'حجز موعد عبر الواتساب', action: 'book-whatsapp' },
      { id: 'book-phone', text: 'حجز موعد عبر الهاتف', action: 'book-phone' },
      { id: 'back', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }
    ],
    doctors: [
      { id: 'doctors-pediatric', text: 'أطباء الأطفال', action: 'doctors-pediatric' },
      { id: 'doctors-gynecology', text: 'أطباء النساء والتوليد', action: 'doctors-gynecology' },
      { id: 'doctors-dermatology', text: 'أطباء الجلدية', action: 'doctors-dermatology' },
      { id: 'back', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }
    ]
  };
  
  // Define back-to-main separately after responseOptions is defined
  responseOptions['back-to-main'] = responseOptions.main;

  // Sample doctor data for rich responses
  const doctorProfiles: Record<string, DoctorInfo[]> = {
    'pediatric': [
      { 
        name: 'د. حنان زغلول', 
        specialty: 'طب الأطفال وحديثي الولادة',
        imageUrl: '/placeholder.svg',
        id: 1
      },
      { 
        name: 'د. سمية علي عسكر', 
        specialty: 'طب الأطفال وحديثي الولادة',
        imageUrl: '/placeholder.svg',
        id: 2
      }
    ],
    'gynecology': [
      { 
        name: 'د. عزة عبدالوارث', 
        specialty: 'النساء والتوليد والعقم',
        imageUrl: '/placeholder.svg',
        id: 5
      },
      { 
        name: 'د. عبير عوض', 
        specialty: 'النساء والتوليد والعقم',
        imageUrl: '/placeholder.svg',
        id: 6
      }
    ],
    'dermatology': [
      { 
        name: 'د. نرمين ابراهيم', 
        specialty: 'الجلدية والتجميل',
        imageUrl: '/placeholder.svg',
        id: 3
      },
      { 
        name: 'د. بسمة محمد ربيع', 
        specialty: 'الجلدية والتجميل',
        imageUrl: '/placeholder.svg',
        id: 4
      },
      { 
        name: 'د. محمد عبدالودود', 
        specialty: 'الجلدية والتجميل',
        imageUrl: '/placeholder.svg',
        id: 13
      }
    ]
  };

  const botResponses: Record<string, { 
    text: string, 
    options?: Option[], 
    doctorInfo?: DoctorInfo[], 
    links?: ActionLink[],
    richContent?: string
  }> = {
    'specialties': {
      text: 'تضم عيادات تعافي 14 تخصصاً طبياً، ما هو التخصص الذي تريد معرفة المزيد عنه؟',
      options: responseOptions.specialties
    },
    'specialties-list': {
      text: 'تضم عيادات تعافي التخصصات التالية:',
      richContent: '• طب الأطفال: متابعة نمو الطفل والوقاية من الأمراض والعلاج\n• النساء والتوليد: رعاية صحة المرأة ومتابعة الحمل والولادة\n• الجلدية والتجميل: علاج أمراض الجلد والشعر وإجراءات التجميل\n• الجراحة العامة: العمليات الجراحية والمناظير\n• الباطنة: تشخيص وعلاج الأمراض الداخلية\n• العظام: علاج إصابات وأمراض العظام والمفاصل\n• المسالك البولية: علاج أمراض الجهاز البولي\n• الأنف والأذن والحنجرة: علاج مشاكل السمع والأنف والحنجرة\n• العيون: تصحيح النظر وعلاج أمراض العين\n• المخ والأعصاب: تشخيص وعلاج اضطرابات الجهاز العصبي\n• الأسنان: علاج وتجميل الأسنان',
      options: [{ id: 'back', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
      links: [
        { 
          type: 'booking',
          text: 'حجز موعد',
          url: '/booking',
          icon: 'link'
        }
      ]
    },
    'pediatric': {
      text: 'قسم طب الأطفال في عيادات تعافي يقدم رعاية طبية متكاملة للأطفال من الولادة وحتى سن المراهقة. يشمل الخدمات الوقائية، التطعيمات، متابعة النمو، وعلاج الأمراض الشائعة.',
      options: [{ id: 'back', text: 'الرجوع للتخصصات', action: 'specialties' }, { id: 'main', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
      doctorInfo: doctorProfiles.pediatric,
      links: [
        { 
          type: 'booking',
          text: 'حجز موعد مع طبيب أطفال',
          url: '/booking?specialty=طب الأطفال',
          icon: 'link'
        }
      ]
    },
    'gynecology': {
      text: 'قسم النساء والتوليد يقدم رعاية شاملة لصحة المرأة بما في ذلك: متابعة الحمل، الولادة، أمراض النساء، تنظيم الأسرة، وفحوصات ما قبل الزواج.',
      options: [{ id: 'back', text: 'الرجوع للتخصصات', action: 'specialties' }, { id: 'main', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
      doctorInfo: doctorProfiles.gynecology,
      links: [
        { 
          type: 'booking',
          text: 'حجز موعد مع طبيب نساء وتوليد',
          url: '/booking?specialty=النساء والتوليد',
          icon: 'link'
        }
      ]
    },
    'dermatology': {
      text: 'قسم الجلدية والتجميل يقدم تشخيص وعلاج مختلف أمراض الجلد والشعر والأظافر، بالإضافة إلى الإجراءات التجميلية مثل الفيلر، البوتكس، وعلاجات تجديد البشرة.',
      options: [{ id: 'back', text: 'الرجوع للتخصصات', action: 'specialties' }, { id: 'main', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
      doctorInfo: doctorProfiles.dermatology,
      links: [
        { 
          type: 'booking',
          text: 'حجز موعد مع طبيب جلدية',
          url: '/booking?specialty=الجلدية والتجميل',
          icon: 'link'
        }
      ]
    },
    'doctors': {
      text: 'اختر التخصص لعرض الأطباء المتخصصين:',
      options: responseOptions.doctors,
    },
    'doctors-pediatric': {
      text: 'أطباء قسم طب الأطفال:',
      doctorInfo: doctorProfiles.pediatric,
      options: [{ id: 'doctors', text: 'الرجوع للتخصصات', action: 'doctors' }, { id: 'main', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
      links: [
        { 
          type: 'booking',
          text: 'حجز موعد مع طبيب أطفال',
          url: '/booking?specialty=طب الأطفال',
          icon: 'link'
        }
      ]
    },
    'doctors-gynecology': {
      text: 'أطباء قسم النساء والتوليد:',
      doctorInfo: doctorProfiles.gynecology,
      options: [{ id: 'doctors', text: 'الرجوع للتخصصات', action: 'doctors' }, { id: 'main', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
      links: [
        { 
          type: 'booking',
          text: 'حجز موعد مع طبيب نساء وتوليد',
          url: '/booking?specialty=النساء والتوليد',
          icon: 'link'
        }
      ]
    },
    'doctors-dermatology': {
      text: 'أطباء قسم الجلدية والتجميل:',
      doctorInfo: doctorProfiles.dermatology,
      options: [{ id: 'doctors', text: 'الرجوع للتخصصات', action: 'doctors' }, { id: 'main', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
      links: [
        { 
          type: 'booking',
          text: 'حجز موعد مع طبيب جلدية',
          url: '/booking?specialty=الجلدية والتجميل',
          icon: 'link'
        }
      ]
    },
    'booking': {
      text: 'يمكنك حجز موعد في عيادات تعافي بعدة طرق:',
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
          url: 'https://wa.me/201119007403',
          icon: 'message'
        },
        { 
          type: 'phone',
          text: 'اتصل بنا',
          url: 'tel:+201119007403',
          icon: 'phone'
        }
      ]
    },
    'book-online': {
      text: 'يمكنك حجز موعد مباشرة من خلال موقعنا الإلكتروني بالضغط على زر "حجز موعد" أدناه واتباع الخطوات البسيطة لاختيار التخصص والطبيب والوقت المناسب.',
      options: [{ id: 'booking', text: 'خيارات الحجز الأخرى', action: 'booking' }, { id: 'main', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
      links: [
        { 
          type: 'booking',
          text: 'حجز موعد الآن',
          url: '/booking',
          icon: 'link'
        }
      ]
    },
    'book-whatsapp': {
      text: 'يمكنك حجز موعد عبر الواتساب بإرسال رسالة لنا. سيقوم فريق خدمة العملاء بالرد عليك في أقرب وقت ممكن لتأكيد حجزك ومساعدتك في اختيار الطبيب والوقت المناسب.',
      options: [{ id: 'booking', text: 'خيارات الحجز الأخرى', action: 'booking' }, { id: 'main', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
      links: [
        { 
          type: 'whatsapp',
          text: 'تواصل عبر واتساب',
          url: 'https://wa.me/201119007403',
          icon: 'message'
        }
      ]
    },
    'book-phone': {
      text: 'يمكنك حجز موعد عن طريق الاتصال بنا مباشرة على الأرقام التالية خلال ساعات العمل من السبت إلى الخميس من 10 صباحًا حتى 10 مساءً.\n\n• 01119007403\n• 38377766',
      options: [{ id: 'booking', text: 'خيارات الحجز الأخرى', action: 'booking' }, { id: 'main', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
      links: [
        { 
          type: 'phone',
          text: 'اتصل بنا',
          url: 'tel:+201119007403',
          icon: 'phone'
        }
      ]
    },
    'hours': {
      text: 'ساعات العمل في عيادات تعافي:',
      richContent: '• من السبت إلى الخميس: 10 صباحًا - 10 مساءً\n• الجمعة: مغلق\n\nللطوارئ بعد ساعات العمل، يرجى الاتصال على الرقم 01119007403.',
      options: [{ id: 'back', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
      links: [
        { 
          type: 'phone',
          text: 'اتصل بنا',
          url: 'tel:+201119007403',
          icon: 'phone'
        }
      ]
    },
    'location': {
      text: 'موقعنا:',
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
    },
    'insurance': {
      text: 'نتعامل مع العديد من شركات التأمين الطبي بما في ذلك:',
      richContent: '• ميد نت\n• جلوب ميد\n• نكست كير\n• كير بلس\n• وثائق تأمين البنوك\n\nلمعرفة ما إذا كانت وثيقة التأمين الخاصة بك مغطاة، يرجى الاتصال بنا على 38377766.',
      options: [{ id: 'back', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
      links: [
        { 
          type: 'phone',
          text: 'اتصل للاستفسار',
          url: 'tel:+2038377766',
          icon: 'phone'
        }
      ]
    },
    'contact': {
      text: 'معلومات الاتصال:',
      richContent: '• رقم الهاتف: 38377766\n• الموبايل: 01119007403\n• الواتساب: 01119007403\n• البريد الإلكتروني: info@taafi-clinics.com\n\nنرحب باستفساراتكم في أي وقت خلال ساعات العمل.',
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
          text: 'تواصل عبر واتساب',
          url: 'https://wa.me/201119007403',
          icon: 'message'
        }
      ]
    },
    'prices': {
      text: 'تختلف رسوم الكشف حسب التخصص والطبيب.',
      richContent: '• رسوم الكشف العادي: تتراوح من 200 إلى 500 جنيه\n• رسوم الاستشارة: تتراوح من 100 إلى 200 جنيه\n• الفحوصات الإضافية: تُحدد حسب نوع الفحص\n\nيمكنك زيارة صفحة الأطباء في موقعنا لمعرفة التفاصيل الكاملة للرسوم لكل طبيب وتخصص.',
      options: [{ id: 'back', text: 'الرجوع للقائمة الرئيسية', action: 'back-to-main' }],
      links: [
        { 
          type: 'booking',
          text: 'حجز موعد',
          url: '/booking',
          icon: 'link'
        }
      ]
    },
    'back-to-main': {
      text: 'كيف يمكنني مساعدتك اليوم؟',
      options: responseOptions.main
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableNode = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableNode) {
        scrollableNode.scrollTop = scrollableNode.scrollHeight;
      }
    }
  }, [messages]);

  // Initial welcome message with category options
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

    // Default to showing main menu for text input
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

  // Handle option selection with proper type checking
  const handleOptionClick = (action: string) => {
    // Add user selection as a message
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

    // Send bot response based on the selected option
    setTimeout(() => {
      const response = botResponses[action] || {
        text: 'عذراً، لم أفهم طلبك. يرجى اختيار أحد الخيارات.',
        options: responseOptions.main
      };

      const botMessage: Message = {
        id: messages.length + 2,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        options: response.options || [],
        doctorInfo: response.doctorInfo,
        links: response.links,
        richContent: response.richContent
      };
      
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
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
            
          // For external links
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
          
          // For internal router links
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

  // Function to render doctor info cards
  const renderDoctorInfoCards = (doctors: DoctorInfo[]) => {
    return (
      <div className="space-y-3 mt-3">
        {doctors.map((doctor, index) => (
          <Card key={index} className="p-3 flex items-center gap-3 bg-brand/5 border">
            <Avatar className="h-12 w-12 border">
              <img src={doctor.imageUrl || '/placeholder.svg'} alt={doctor.name} />
            </Avatar>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{doctor.name}</h4>
              <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
            </div>
            <Link 
              to={`/booking?doctor=${doctor.id}`}
              className="shrink-0 text-xs bg-brand/90 text-white hover:bg-brand px-2 py-1 rounded"
            >
              حجز موعد
            </Link>
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
          className="w-14 h-14 rounded-full bg-brand hover:bg-brand-dark shadow-lg"
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
            className="fixed bottom-24 left-6 z-50 bg-white rounded-lg shadow-xl w-80 md:w-96 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="bg-brand text-white p-4">
              <h3 className="text-lg font-bold">مساعد تعافي</h3>
              <p className="text-sm opacity-90">كيف يمكننا مساعدتك؟</p>
            </div>

            {/* Messages */}
            <ScrollArea className="h-80 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    <div
                      className={`flex ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.sender === 'bot' && (
                        <Avatar className="h-8 w-8 ml-2">
                          <div className="bg-brand h-full w-full rounded-full flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-5 w-5 text-white"
                            >
                              <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.046 15.253c-.058.468.172.92.57 1.175A9.953 9.953 0 008 18c1.982 0 3.83-.578 5.384-1.573.398-.254.628-.707.57-1.175a6.001 6.001 0 00-11.908 0z" />
                            </svg>
                          </div>
                        </Avatar>
                      )}
                      
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          msg.sender === 'user'
                            ? 'bg-brand text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {msg.text.split('\n').map((line, index) => (
                          <span key={index}>
                            {line}
                            {index < msg.text.split('\n').length - 1 && <br />}
                          </span>
                        ))}

                        {/* Rich content with more detailed info */}
                        {msg.sender === 'bot' && msg.richContent && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            {msg.richContent.split('\n').map((line, index) => (
                              <div key={index} className="text-sm">
                                {line}
                                {index < msg.richContent.split('\n').length - 1 && <br />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {msg.sender === 'user' && (
                        <Avatar className="h-8 w-8 mr-2">
                          <div className="bg-gray-300 h-full w-full rounded-full flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-5 w-5 text-gray-600"
                            >
                              <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                            </svg>
                          </div>
                        </Avatar>
                      )}
                    </div>
                    
                    {/* Doctor Info Cards */}
                    {msg.sender === 'bot' && msg.doctorInfo && msg.doctorInfo.length > 0 && (
                      renderDoctorInfoCards(msg.doctorInfo)
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
                            className="bg-brand/10 hover:bg-brand/20 text-brand hover:text-brand-dark cursor-pointer px-3 py-1.5"
                            onClick={() => handleOptionClick(option.action)}
                          >
                            {option.text}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t p-3 flex">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 ml-3"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button
                className="bg-brand hover:bg-brand-dark"
                onClick={handleSendMessage}
                type="button"
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

