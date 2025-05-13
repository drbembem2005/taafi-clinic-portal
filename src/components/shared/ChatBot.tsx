
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
      text: 'مرحباً بك في عيادات تعافي التخصصية! كيف يمكنني مساعدتك؟',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const botResponses = [
    {
      trigger: /تخصصات/i,
      response: 'نقدم 14 تخصصاً طبياً منها: طب الأطفال، النساء والتوليد، الجلدية، الجراحة العامة، الباطنة، العظام، الأسنان وغيرها. هل تريد معرفة المزيد عن تخصص معين؟',
    },
    {
      trigger: /مواعيد|ساعات العمل/i,
      response: 'العيادة تعمل من السبت إلى الخميس من الساعة 10 صباحاً حتى 10 مساءً. الجمعة مغلق.',
    },
    {
      trigger: /موقع|عنوان|الوصول/i,
      response: 'نحن في ميدان الحصري، أبراج برعي بلازا، برج رقم ٢، بجوار محل شعبان للملابس، الدور الثالث (يوجد أسانسير) – 6 أكتوبر، القاهرة',
    },
    {
      trigger: /حجز|موعد/i,
      response: 'يمكنك حجز موعد من خلال الاتصال على رقم 01119007403 أو من خلال زيارة صفحة الحجز في موقعنا. هل تريد التواصل مع خدمة الحجز الآن؟',
    },
    {
      trigger: /أسعار|تكلفة|رسوم/i,
      response: 'تختلف الرسوم حسب التخصص والطبيب. يمكنك زيارة صفحة الأطباء لمعرفة التفاصيل الكاملة للرسوم.',
    },
    {
      trigger: /التأمين|تأمين/i,
      response: 'نعم، نتعامل مع العديد من شركات التأمين الطبي. يمكنك الاتصال بنا على 38377766 لمعرفة ما إذا كانت شركة التأمين الخاصة بك مغطاة.',
    },
    {
      trigger: /.+/i, // Default response for any other message
      response: 'شكراً لتواصلك معنا. هل تحتاج مساعدة في حجز موعد أو معرفة المزيد عن خدماتنا؟ يمكنك أيضاً التواصل معنا مباشرة على 01119007403.',
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
      <div className="fixed bottom-6 left-6 z-50">
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
                      {msg.text}
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
