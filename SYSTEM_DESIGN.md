
# تصميم النظام - عيادات تعافي التخصصية

## نظرة عامة على المعمارية

يتبع نظام عيادات تعافي معمارية حديثة قائمة على المكونات (Component-Based Architecture) مع فصل واضح بين الطبقات، مما يضمن قابلية الصيانة والتوسع والأداء العالي.

## معمارية النظام الكاملة

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (العميل)                    │
├─────────────────────────────────────────────────────────────┤
│  React App (SPA) + TypeScript + Tailwind CSS              │
│  ├── Components (المكونات)                                 │
│  ├── Pages (الصفحات)                                       │
│  ├── Services (الخدمات)                                    │
│  └── State Management (إدارة الحالة)                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  Nginx Web Server + Docker Container                       │
│  ├── Static File Serving                                   │
│  ├── Gzip Compression                                      │
│  ├── Caching Headers                                       │
│  └── Health Checks                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  Supabase Backend-as-a-Service                             │
│  ├── PostgreSQL Database                                   │
│  ├── Authentication & Authorization                        │
│  ├── Row Level Security (RLS)                             │
│  ├── Real-time Subscriptions                              │
│  └── RESTful APIs                                          │
└─────────────────────────────────────────────────────────────┘
```

## الطبقات التفصيلية

### 1. طبقة العرض (Presentation Layer)

#### معمارية المكونات (Component Architecture)
```
src/components/
├── ui/                    # المكونات الأساسية
│   ├── button.tsx         # مكون الأزرار
│   ├── input.tsx          # مكون الإدخال
│   ├── dialog.tsx         # مكون النوافذ المنبثقة
│   └── ...
├── shared/                # المكونات المشتركة
│   ├── DoctorCard.tsx     # بطاقة الطبيب
│   ├── SpecialtyCard.tsx  # بطاقة التخصص
│   ├── ChatBot/           # نظام الشات بوت
│   └── ...
├── booking/               # مكونات نظام الحجز
│   ├── BookingWizard.tsx  # معالج الحجز
│   ├── DoctorSelection.tsx # اختيار الطبيب
│   └── ...
└── health-tools/          # مكونات الأدوات الصحية
    ├── BMICalculator.tsx  # حاسبة كتلة الجسم
    ├── CalorieCalculator.tsx # حاسبة السعرات
    └── ...
```

#### إدارة الحالة (State Management)
```typescript
// Pattern: Component State + Context API
interface AppState {
  user: User | null;
  appointments: Appointment[];
  doctors: Doctor[];
  specialties: Specialty[];
}

// استخدام React Hooks للحالة المحلية
const [appointments, setAppointments] = useState<Appointment[]>([]);

// استخدام React Query للبيانات المرتبطة بالخادم
const { data: doctors, isLoading } = useQuery({
  queryKey: ['doctors'],
  queryFn: getDoctors
});
```

### 2. طبقة الخدمات (Service Layer)

#### هيكل الخدمات
```typescript
// src/services/doctorService.ts
export class DoctorService {
  async getDoctors(): Promise<Doctor[]> {
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        specialty:specialties(*)
      `);
    
    if (error) throw error;
    return data;
  }
  
  async getDoctorById(id: number): Promise<Doctor> {
    // تنفيذ الحصول على طبيب محدد
  }
  
  async getDoctorsBySpecialty(specialtyId: number): Promise<Doctor[]> {
    // تنفيذ البحث بالتخصص
  }
}
```

#### نمط Repository Pattern
```typescript
interface Repository<T> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T>;
  create(entity: T): Promise<T>;
  update(id: number, entity: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}

class DoctorRepository implements Repository<Doctor> {
  // تنفيذ العمليات الأساسية
}
```

### 3. طبقة البيانات (Data Layer)

#### تصميم قاعدة البيانات
```sql
-- جدول التخصصات
CREATE TABLE specialties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الأطباء
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty_id INTEGER REFERENCES specialties(id),
  bio TEXT,
  experience_years INTEGER,
  consultation_fee DECIMAL(10,2),
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول مواعيد الأطباء
CREATE TABLE doctor_schedules (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES doctors(id),
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true
);

-- جدول المواعيد المحجوزة
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES doctors(id),
  patient_name VARCHAR(255) NOT NULL,
  patient_phone VARCHAR(20) NOT NULL,
  patient_email VARCHAR(255),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Row Level Security (RLS)
```sql
-- تأمين البيانات على مستوى الصفوف
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- سياسة للقراءة (جميع المستخدمين يمكنهم قراءة المواعيد المتاحة)
CREATE POLICY "Anyone can view available appointments" ON appointments
FOR SELECT USING (true);

-- سياسة للإدراج (فقط المستخدمين المصادق عليهم)
CREATE POLICY "Users can create appointments" ON appointments
FOR INSERT WITH CHECK (true);
```

## أنماط التصميم المستخدمة

### 1. Component Composition Pattern
```typescript
// مكون مركب للبحث والفلترة
function DoctorSearch() {
  return (
    <SearchContainer>
      <SearchInput placeholder="ابحث عن طبيب..." />
      <SpecialtyFilter />
      <ExperienceFilter />
      <SearchResults />
    </SearchContainer>
  );
}
```

### 2. Custom Hooks Pattern
```typescript
// hook مخصص لإدارة عملية الحجز
function useBookingFlow() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({});
  
  const goToNextStep = () => setStep(prev => prev + 1);
  const goToPreviousStep = () => setStep(prev => prev - 1);
  
  const submitBooking = async () => {
    try {
      await bookingService.createAppointment(bookingData);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };
  
  return {
    step,
    bookingData,
    setBookingData,
    goToNextStep,
    goToPreviousStep,
    submitBooking
  };
}
```

### 3. Provider Pattern للشات بوت
```typescript
interface ChatBotContext {
  messages: Message[];
  isOpen: boolean;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

const ChatBotProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  // منطق إدارة الشات بوت
  
  return (
    <ChatBotContext.Provider value={contextValue}>
      {children}
    </ChatBotContext.Provider>
  );
};
```

## الأمان والحماية

### 1. أمان العميل (Client-Side Security)
```typescript
// التحقق من صحة المدخلات
const appointmentSchema = z.object({
  doctorId: z.number().positive(),
  patientName: z.string().min(2).max(100),
  patientPhone: z.string().regex(/^[0-9]{11}$/),
  appointmentDate: z.date().min(new Date()),
  appointmentTime: z.string()
});

// استخدام التحقق
try {
  const validData = appointmentSchema.parse(formData);
  await submitAppointment(validData);
} catch (error) {
  // معالجة أخطاء التحقق
}
```

### 2. أمان الخادم (Server-Side Security)
```sql
-- RLS لحماية البيانات الحساسة
CREATE POLICY "Users can only view their own appointments" 
ON appointments FOR SELECT 
USING (auth.uid() = user_id);

-- فهرسة للأداء والأمان
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
```

## الأداء والتحسين

### 1. تحسين العميل
```typescript
// Lazy Loading للمكونات
const HealthTools = lazy(() => import('./pages/HealthTools'));
const Booking = lazy(() => import('./pages/Booking'));

// Memoization للمكونات المكلفة
const DoctorCard = memo(({ doctor }: { doctor: Doctor }) => {
  return (
    <Card>
      {/* محتوى البطاقة */}
    </Card>
  );
});

// تحسين الصور
const OptimizedImage = ({ src, alt }: ImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
};
```

### 2. تحسين الشبكة
```typescript
// React Query للتخزين المؤقت
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 دقائق
      cacheTime: 10 * 60 * 1000, // 10 دقائق
    },
  },
});

// تحسين طلبات API
const getDoctorsWithSpecialties = async () => {
  const { data } = await supabase
    .from('doctors')
    .select(`
      id,
      name,
      bio,
      experience_years,
      consultation_fee,
      specialty:specialties(id, name)
    `)
    .order('name');
  
  return data;
};
```

## نشر النظام (Deployment Architecture)

### 1. معمارية الحاويات (Container Architecture)
```dockerfile
# Multi-stage build للتحسين
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

### 2. إعداد Nginx للأداء
```nginx
server {
    listen 8080;
    
    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 3. مراقبة الأداء
```typescript
// تتبع الأداء
const performanceMetrics = {
  measurePageLoad: () => {
    const navTiming = performance.getEntriesByType('navigation')[0];
    console.log('Page Load Time:', navTiming.loadEventEnd - navTiming.fetchStart);
  },
  
  measureComponentRender: (componentName: string) => {
    performance.mark(`${componentName}-start`);
    // بعد الرندر
    performance.mark(`${componentName}-end`);
    performance.measure(componentName, `${componentName}-start`, `${componentName}-end`);
  }
};
```

## قابلية التوسع (Scalability)

### 1. توسع الواجهة الأمامية
- **Code Splitting**: تقسيم الكود حسب المسارات
- **Tree Shaking**: إزالة الكود غير المستخدم
- **Bundle Optimization**: تحسين حجم الحزم

### 2. توسع قاعدة البيانات
- **Database Indexing**: فهرسة الاستعلامات الشائعة
- **Connection Pooling**: تجميع الاتصالات
- **Read Replicas**: نسخ للقراءة

### 3. مراقبة النظام
```typescript
// مراقبة الأخطاء والأداء
interface SystemMonitoring {
  logError: (error: Error, context: string) => void;
  trackUserAction: (action: string, metadata: object) => void;
  measurePerformance: (metric: string, value: number) => void;
}

const monitoring: SystemMonitoring = {
  logError: (error, context) => {
    console.error(`[${context}] Error:`, error);
    // إرسال إلى خدمة المراقبة
  },
  
  trackUserAction: (action, metadata) => {
    // تتبع تفاعلات المستخدم
  },
  
  measurePerformance: (metric, value) => {
    // قياس الأداء
  }
};
```

## الخلاصة

يوفر تصميم النظام معمارية قوية ومرنة تدعم:
- **قابلية الصيانة**: كود منظم ومفصول بوضوح
- **الأداء العالي**: تحسينات شاملة للسرعة
- **الأمان**: طبقات حماية متعددة
- **قابلية التوسع**: إمكانية النمو مع الاحتياجات
- **تجربة المستخدم**: واجهة سلسة ومتجاوبة

هذا التصميم يضمن أن النظام يمكنه التعامل مع متطلبات عيادات تعافي الحالية والمستقبلية بكفاءة عالية.
