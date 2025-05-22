
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'مرحباً بك في عيادات تعافي التخصصية! 👋\nكيف يمكنني مساعدتك اليوم؟\n\nيمكنك طرح سؤال عن:\n1️⃣ التخصصات الطبية\n2️⃣ حجز موعد\n3️⃣ مواعيد العمل\n4️⃣ الموقع والعنوان\n5️⃣ التأمين الطبي',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  // Enhanced bot responses with more categories and detailed answers
  const botResponses = [
    // Medical Specialties Category
    {
      trigger: /تخصصات|تخصص|طبيب|دكتور|أطباء|اطباء/i,
      response: 'تضم عيادات تعافي 14 تخصصاً طبياً تشمل:\n\n' +
        '🔹 طب الأطفال\n' +
        '🔹 النساء والتوليد\n' +
        '🔹 الجلدية والتجميل\n' +
        '🔹 الجراحة العامة\n' +
        '🔹 الباطنة\n' +
        '🔹 العظام\n' +
        '🔹 المسالك البولية\n' +
        '🔹 الأنف والأذن والحنجرة\n' +
        '🔹 العيون\n' +
        '🔹 المخ والأعصاب\n' +
        '🔹 الأسنان\n\n' +
        'هل ترغب في معرفة المزيد عن أي تخصص محدد؟',
    },
    // Working Hours Category
    {
      trigger: /مواعيد|ساعات العمل|وقت العمل|متى تفتح|متى تغلق/i,
      response: '⏰ *ساعات العمل*\n\n' +
        '🔹 السبت إلى الخميس: 10 صباحاً - 10 مساءً\n' +
        '🔹 الجمعة: مغلق\n\n' +
        'نرحب بكم خلال هذه الأوقات. للطوارئ بعد ساعات العمل، يرجى الاتصال على 01119007403.'
    },
    // Location Category
    {
      trigger: /موقع|عنوان|الوصول|مكان|أين|اين|وين|فين|location|address/i,
      response: '📍 *موقعنا*\n\n' +
        'ميدان الحصري، أبراج برعي بلازا، برج رقم ٢\n' +
        'بجوار محل شعبان للملابس، الدور الثالث (يوجد أسانسير)\n' +
        '6 أكتوبر، القاهرة\n\n' +
        'يمكنك الاطلاع على الخريطة من خلال زيارة صفحة "تواصل معنا" في موقعنا.'
    },
    // Appointment Category
    {
      trigger: /حجز|موعد|الحجز|حجوزات|حجز موعد|أحجز|احجز/i,
      response: '📅 *حجز المواعيد*\n\n' +
        'يمكنك حجز موعد بإحدى الطرق التالية:\n\n' +
        '🔹 الاتصال على رقم 01119007403\n' +
        '🔹 عبر موقعنا الإلكتروني (صفحة الحجز)\n' +
        '🔹 من خلال الواتساب 01119007403\n' +
        '🔹 زيارة العيادة مباشرة\n\n' +
        'يرجى الوصول قبل موعدك بـ 15 دقيقة لإكمال الإجراءات.'
    },
    // Insurance Category
    {
      trigger: /تأمين|التأمين|تامين|شركات التأمين|شركة التأمين/i,
      response: '🏥 *التأمين الطبي*\n\n' +
        'نتعامل مع العديد من شركات التأمين الطبي بما في ذلك:\n\n' +
        '🔹 ميد نت\n' +
        '🔹 جلوب ميد\n' +
        '🔹 نكست كير\n' +
        '🔹 كير بلس\n' +
        '🔹 وثائق تأمين البنوك\n\n' +
        'لمعرفة ما إذا كانت وثيقة التأمين الخاصة بك مغطاة، يرجى الاتصال بنا على 38377766.'
    },
    // Pricing Category
    {
      trigger: /أسعار|تكلفة|رسوم|سعر|كم السعر|تكاليف/i,
      response: '💰 *الرسوم والأسعار*\n\n' +
        'تختلف الرسوم حسب التخصص والطبيب. تتراوح أسعار الكشف من 200 إلى 500 جنيه.\n\n' +
        'يمكنك زيارة صفحة الأطباء في موقعنا لمعرفة التفاصيل الكاملة للرسوم لكل طبيب وتخصص.'
    },
    // Contact Information
    {
      trigger: /اتصال|اتصل|تواصل|التواصل|رقم الهاتف|رقم التليفون|تليفون|هاتف|واتساب|whatsapp/i,
      response: '📞 *معلومات الاتصال*\n\n' +
        '🔹 رقم الهاتف: 38377766\n' +
        '🔹 الموبايل: 01119007403\n' +
        '🔹 الواتساب: 01119007403\n' +
        '🔹 البريد الإلكتروني: info@taafi-clinics.com\n\n' +
        'نرحب باستفساراتكم في أي وقت خلال ساعات العمل.'
    },
    // Doctors Category
    {
      trigger: /دكتور|طبيب|الأطباء|الاطباء|دكاترة|doctors/i,
      response: '👨‍⚕️👩‍⚕️ *الأطباء*\n\n' +
        'يضم فريقنا الطبي نخبة من أفضل الأطباء والاستشاريين في مختلف التخصصات.\n\n' +
        'يمكنك الاطلاع على قائمة الأطباء وسيرتهم الذاتية والتخصصات والمواعيد المتاحة من خلال زيارة صفحة "الأطباء" في موقعنا.'
    },
    // Help Command
    {
      trigger: /مساعدة|مساعده|help|ساعدني/i,
      response: '📋 *قائمة المساعدة*\n\n' +
        'يمكنك السؤال عن:\n\n' +
        '1️⃣ التخصصات الطبية - معلومات عن التخصصات المتوفرة\n' +
        '2️⃣ حجز موعد - كيفية حجز موعد مع طبيب\n' +
        '3️⃣ مواعيد العمل - ساعات عمل العيادة\n' +
        '4️⃣ الموقع والعنوان - كيفية الوصول إلينا\n' +
        '5️⃣ التأمين الطبي - شركات التأمين المعتمدة\n' +
        '6️⃣ الأطباء - معلومات عن أطبائنا\n' +
        '7️⃣ الأسعار - معلومات عن رسوم الكشف\n' +
        '8️⃣ الاتصال - أرقام التواصل معنا'
    },
    // Default Response
    {
      trigger: /.+/i, // Default response for any other message
      response: 'شكراً لتواصلك معنا. هل يمكنني مساعدتك في أمر آخر؟\n\n' +
        'يمكنك الاستفسار عن:\n' +
        '• التخصصات الطبية\n' +
        '• حجز موعد\n' +
        '• مواعيد العمل\n' +
        '• موقعنا\n' +
        '• التأمين الطبي\n\n' +
        'أو اكتب "مساعدة" لعرض قائمة الخيارات. للتواصل المباشر: 01119007403'
    },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');

    // Find matching bot response
    setTimeout(() => {
      const botResponse = botResponses.find((response) => 
        response.trigger.test(userMessage.text)
      );

      const responseText = botResponse ? botResponse.response : botResponses[botResponses.length - 1].response;

      const botMessage: Message = {
        id: messages.length + 2,
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
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
            <ScrollArea className="h-80 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
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
