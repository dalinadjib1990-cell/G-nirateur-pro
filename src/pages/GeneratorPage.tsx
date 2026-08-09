import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Save, FileText, FileSpreadsheet, ListTodo, Download, Printer, User, School, BookOpen, Layers, Palette, Sparkles, Table, Hexagon, Smile, GraduationCap, Heart, Coffee, Zap, ZoomIn, ZoomOut, Maximize, Languages, Droplet, ImagePlus, Leaf, Star, Volume2, VolumeX, LogOut, Shield, Bot, Settings, Image as ImageIcon, X, Bookmark, RotateCcw, Check, Phone, CheckCircle2, Lock } from 'lucide-react';
import { TeacherInfo, GenerationType, SubjectInfo, Exercise } from '../types';
import { soundManager } from '../audio';
import html2pdf from 'html2pdf.js';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc, collection, getDocs, query, where, increment } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useDownloads } from '../contexts/DownloadsContext';
import DownloadsModal from '../components/DownloadsModal';
import { expertChatEmitter, profileModalEmitter } from '../App';
import { uploadImage } from '../lib/cloudinary';

// Simple unique ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

const ADHKAR_LIST = [
  "سبحان الله",
  "الحمد لله",
  "لا إله إلا الله",
  "الله أكبر",
  "لا حول ولا قوة إلا بالله",
  "اللهم صل وسلم على نبينا محمد",
  "أستغفر الله وأتوب إليه",
  "حسبي الله ونعم الوكيل",
  "سبحان الله العظيم",
  "لا إله إلا أنت سبحانك إني كنت من الظالمين"
];

export default function GeneratorPage() {
  const { user, userData, signOut, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const { addFile, unreadCount } = useDownloads();
  const [isDownloadsModalOpen, setIsDownloadsModalOpen] = useState(false);

  const isAdmin = userData?.role === 'admin' || 
                  userData?.email === 'dalinadjib1990@gmail.com' || 
                  user?.email === 'dalinadjib1990@gmail.com' || 
                  userData?.phone?.includes('0771167330') || 
                  user?.phone?.includes('0771167330') ||
                  userData?.email?.includes('0771167330');

  const isProUser = Boolean(
    isAdmin || 
    userData?.isPro === true || 
    userData?.isActive === true || 
    userData?.role === 'pro'
  );

  const [darkMode, setDarkMode] = useState(false);
  const [appBgImage, setAppBgImage] = useState<string | null>(null);
  const [appBgColor, setAppBgColor] = useState<string>('');
  const bgInputRef = useRef<HTMLInputElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dhikrState, setDhikrState] = useState<{ tabId: string, text: string, timestamp: number } | null>(null);
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo>({
    firstName: '',
    lastName: '',
    school: '',
    phase: '',
    level: '',
    subject: '',
  });

  useEffect(() => {
    if (userData) {
      setTeacherInfo(prev => ({
        ...prev,
        firstName: prev.firstName || userData.firstName || '',
        lastName: prev.lastName || userData.lastName || '',
        phase: prev.phase || userData.phase || ''
      }));
    }
  }, [userData]);
  const [generationType, setGenerationType] = useState<GenerationType>('memo');
  
  // Form state
  const [memoSection, setMemoSection] = useState('');
  const [memoDomain, setMemoDomain] = useState('');
  const [memoContent, setMemoContent] = useState('');
  const [contentStyle, setContentStyle] = useState('standard');
  const [designStyle, setDesignStyle] = useState('style1');
  const [pageFrame, setPageFrame] = useState('none');
  const [aiPrompt, setAiPrompt] = useState('');
  
  // Test/Series specific state
  const [exercises, setExercises] = useState<Exercise[]>([{ id: generateId(), section: '', competencies: [''] }]);
  const [hasIntegration, setHasIntegration] = useState(false);
  const [includeSolution, setIncludeSolution] = useState(false);
  const [examType, setExamType] = useState('فرض 1');
  const [examTerm, setExamTerm] = useState('الفصل الأول');
  const [examDuration, setExamDuration] = useState('ساعة واحدة');
  
  const [selectedProfileImage, setSelectedProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [generatedHtml, setGeneratedHtml] = useState(() => {
    try {
      return sessionStorage.getItem('currentGeneratedHtml') || '';
    } catch (e) {
      return '';
    }
  });

  const updateGeneratedHtml = (html: string) => {
    setGeneratedHtml(html);
    try {
      if (html) {
        sessionStorage.setItem('currentGeneratedHtml', html);
      } else {
        sessionStorage.removeItem('currentGeneratedHtml');
      }
    } catch (e) {
      console.error(e);
    }
  };
  const [isGenerating, setIsGenerating] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const [generatingDhikr, setGeneratingDhikr] = useState('');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isGenerating) {
      setGeneratingDhikr(ADHKAR_LIST[Math.floor(Math.random() * ADHKAR_LIST.length)]);
      interval = setInterval(() => {
        setGeneratingDhikr(ADHKAR_LIST[Math.floor(Math.random() * ADHKAR_LIST.length)]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);
  useEffect(() => {
    if (generationType === 'visual' && !designStyle.startsWith('visual_')) {
      setDesignStyle('visual_nature');
    } else if (generationType !== 'visual' && designStyle.startsWith('visual_')) {
      setDesignStyle('style1');
    }
  }, [generationType, designStyle]);

  const [previewFontSize, setPreviewFontSize] = useState(16);
  const [docColor, setDocColor] = useState('#1e40af');
  const [documentLanguage, setDocumentLanguage] = useState('ar');
  const [includeWatermark, setIncludeWatermark] = useState(false);

  // Scaling logic
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScale, setAutoScale] = useState(1);
  const [manualScale, setManualScale] = useState(1);

  useEffect(() => {
    let animationFrameId: number;
    
    const updateScale = () => {
      if (containerRef.current) {
        // A4 width in pixels is roughly 794px at 96 DPI (210mm)
        // We add minimal padding for better aesthetics (16px total)
        const containerWidth = containerRef.current.clientWidth;
        const targetWidth = 794;
        
        let newScale = 1;
        if (containerWidth > 0 && containerWidth < targetWidth + 16) {
          newScale = Math.max(0.1, (containerWidth - 16) / targetWidth);
        }
        
        setAutoScale(prev => {
          // Only update if difference is significant to avoid ResizeObserver infinite loops
          if (Math.abs(prev - newScale) > 0.01) {
            return newScale;
          }
          return prev;
        });
      }
    };

    const handleResize = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateScale);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      updateScale();
    }

    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const effectiveScale = autoScale * manualScale;

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const activeUid = user?.uid || 'guest';

  useEffect(() => {
    const savedBgImage = localStorage.getItem(`appBgImage_${activeUid}`);
    const savedBgColor = localStorage.getItem(`appBgColor_${activeUid}`);
    if (savedBgImage) setAppBgImage(savedBgImage);
    if (savedBgColor) setAppBgColor(savedBgColor);
  }, [activeUid]);

  const handleAppBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAppBgImage(result);
        localStorage.setItem(`appBgImage_${activeUid}`, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAppBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setAppBgColor(color);
    localStorage.setItem(`appBgColor_${activeUid}`, color);
  };

  useEffect(() => {
    const userStorageKey = `generateProData_${activeUid}`;
    const saved = localStorage.getItem(userStorageKey);
    let parsed: any = {};
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {
        console.error("Could not parse saved user data", e);
      }
    }

    const savedTeacher = parsed.teacherInfo || {};
    setTeacherInfo({
      firstName: userData?.firstName !== undefined ? userData.firstName : (savedTeacher.firstName || ''),
      lastName: userData?.lastName !== undefined ? userData.lastName : (savedTeacher.lastName || ''),
      school: userData?.school !== undefined ? userData.school : (savedTeacher.school || ''),
      phase: userData?.phase !== undefined ? userData.phase : (savedTeacher.phase || ''),
      subject: userData?.subject !== undefined ? userData.subject : (savedTeacher.subject || ''),
      level: userData?.level !== undefined ? userData.level : (savedTeacher.level || ''),
    });

    setMemoSection(parsed.memoSection || '');
    setMemoDomain(parsed.memoDomain || '');
    setMemoContent(parsed.memoContent || '');

    if (parsed.documentLanguage) setDocumentLanguage(parsed.documentLanguage);
    if (parsed.includeWatermark !== undefined) setIncludeWatermark(parsed.includeWatermark);
    if (parsed.hasIntegration !== undefined) setHasIntegration(parsed.hasIntegration);
    if (parsed.includeSolution !== undefined) setIncludeSolution(parsed.includeSolution);
    if (parsed.contentStyle) setContentStyle(parsed.contentStyle);
    if (parsed.designStyle) setDesignStyle(parsed.designStyle);
    if (parsed.pageFrame) setPageFrame(parsed.pageFrame);
    if (parsed.examType) setExamType(parsed.examType);
    if (parsed.examTerm) setExamTerm(parsed.examTerm);
    if (parsed.examDuration) setExamDuration(parsed.examDuration);
  }, [activeUid]);

  const [lessonSaveMessage, setLessonSaveMessage] = useState<string | null>(null);

  const saveCurrentPreferences = (overrides?: Record<string, any>) => {
    try {
      const userStorageKey = `generateProData_${user?.uid || 'guest'}`;
      const currentData = JSON.parse(localStorage.getItem(userStorageKey) || '{}');
      const newData = {
        ...currentData,
        teacherInfo,
        memoSection,
        memoDomain,
        memoContent,
        documentLanguage,
        includeWatermark,
        hasIntegration,
        includeSolution,
        contentStyle,
        designStyle,
        pageFrame,
        examType,
        examTerm,
        examDuration,
        ...overrides
      };
      localStorage.setItem(userStorageKey, JSON.stringify(newData));
    } catch (e) {
      console.error("Could not auto-save preferences", e);
    }
  };

  const handleSaveLessonElements = () => {
    if (!memoSection && !memoDomain && !memoContent && !aiPrompt && exercises.every(e => !e.section)) {
      alert('يرجى كتابة المقطع أو الميدان أو المورد المعرفي أو التوجيهات قبل الحفظ.');
      return;
    }
    const uid = user?.uid || 'guest';
    const subjectKey = `lesson_elements_${uid}_${teacherInfo.subject || 'default'}`;
    const lastKey = `lesson_elements_${uid}_last`;
    const dataToSave = {
      memoSection,
      memoDomain,
      memoContent,
      aiPrompt,
      exercises,
      subject: teacherInfo.subject,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(subjectKey, JSON.stringify(dataToSave));
    localStorage.setItem(lastKey, JSON.stringify(dataToSave));
    saveCurrentPreferences();

    if (soundEnabled) soundManager.playGenerateComplete();
    setLessonSaveMessage('تم حفظ معلومات المقطع والكفاءات والتوجيهات بنجاح!');
    setTimeout(() => setLessonSaveMessage(null), 3500);
  };

  const handleLoadLessonElements = () => {
    const uid = user?.uid || 'guest';
    const subjectKey = `lesson_elements_${uid}_${teacherInfo.subject || 'default'}`;
    const lastKey = `lesson_elements_${uid}_last`;
    const savedSubjectData = localStorage.getItem(subjectKey) || localStorage.getItem(lastKey);
    if (savedSubjectData) {
      try {
        const parsed = JSON.parse(savedSubjectData);
        if (parsed.memoSection !== undefined) setMemoSection(parsed.memoSection);
        if (parsed.memoDomain !== undefined) setMemoDomain(parsed.memoDomain);
        if (parsed.memoContent !== undefined) setMemoContent(parsed.memoContent);
        if (parsed.aiPrompt !== undefined) setAiPrompt(parsed.aiPrompt);
        if (parsed.exercises && Array.isArray(parsed.exercises)) setExercises(parsed.exercises);
        setLessonSaveMessage('تم استرجاع معلومات دروسك وكفاءاتك المحفوظة بنجاح!');
        setTimeout(() => setLessonSaveMessage(null), 3500);
      } catch (e) {
        console.error(e);
      }
    } else {
      alert('لا توجد معلومات محفوظة لهذه المادة في حسابك الشخصي حتى الآن. أدخل البيانات واضغط على "حفظ المعلومات والمعطيات".');
    }
  };

  const handleResetInputs = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة تعيين جميع الحقول وتفريغ البيانات للكتابة مجدداً؟')) {
      setMemoSection('');
      setMemoDomain('');
      setMemoContent('');
      setAiPrompt('');
      setExercises([{ id: generateId(), section: '', competencies: [''] }]);
      saveCurrentPreferences({
        memoSection: '',
        memoDomain: '',
        memoContent: '',
        aiPrompt: ''
      });
      if (soundEnabled) soundManager.playTabClick();
      setLessonSaveMessage('تم إعادة تعيين جميع الحقول بنجاح للكتابة مجدداً.');
      setTimeout(() => setLessonSaveMessage(null), 3500);
    }
  };

  const handleSaveTeacher = async () => {
    saveCurrentPreferences();
    if (userData?.uid) {
      try {
        await updateDoc(doc(db, 'users', userData.uid), {
          firstName: teacherInfo.firstName,
          lastName: teacherInfo.lastName,
          school: teacherInfo.school,
          phase: teacherInfo.phase,
          subject: teacherInfo.subject,
          level: teacherInfo.level
        });
        await refreshUserData();
      } catch (e) {
        console.error("Failed to update user profile in Firestore", e);
      }
    }
    alert('تم حفظ معلوماتك الشخصية وإعداداتك في حسابك بنجاح!');
  };

  const isFreeMode = !isProUser;

  let designStyles = [
    { id: 'style1', label: 'كلاسيكي', icon: BookOpen, color: '#1e40af', twColor: 'text-blue-600', twBg: 'bg-blue-100', twBorder: 'border-blue-200' },
    { id: 'style5', label: 'داكن', icon: Printer, color: '#334155', twColor: 'text-slate-700', twBg: 'bg-slate-200', twBorder: 'border-slate-300' },
    { id: 'style2', label: 'إبداعي', icon: Palette, color: '#9333ea', twColor: 'text-purple-600', twBg: 'bg-purple-100', twBorder: 'border-purple-200', isPro: true },
    { id: 'style3', label: 'عصري', icon: Sparkles, color: '#059669', twColor: 'text-emerald-600', twBg: 'bg-emerald-100', twBorder: 'border-emerald-200', isPro: true },
    { id: 'style6', label: 'هندسي', icon: Hexagon, color: '#0891b2', twColor: 'text-cyan-600', twBg: 'bg-cyan-100', twBorder: 'border-cyan-200', isPro: true },
    { id: 'style7', label: 'مرح', icon: Smile, color: '#db2777', twColor: 'text-pink-600', twBg: 'bg-pink-100', twBorder: 'border-pink-200', isPro: true },
    { id: 'style8', label: 'أكاديمي', icon: GraduationCap, color: '#4f46e5', twColor: 'text-indigo-600', twBg: 'bg-indigo-100', twBorder: 'border-indigo-200', isPro: true },
    { id: 'style9', label: 'ناعم', icon: Heart, color: '#e11d48', twColor: 'text-rose-600', twBg: 'bg-rose-100', twBorder: 'border-rose-200', isPro: true },
    { id: 'style10', label: 'بني', icon: Coffee, color: '#92400e', twColor: 'text-orange-800', twBg: 'bg-orange-100', twBorder: 'border-orange-200', isPro: true },
    { id: 'style13', label: 'خارق للعادة', icon: Layers, color: '#0369a1', twColor: 'text-sky-700', twBg: 'bg-sky-100', twBorder: 'border-sky-200', isPro: true },
    { id: 'style14', label: 'طبيعي', icon: Leaf, color: '#65a30d', twColor: 'text-lime-600', twBg: 'bg-lime-100', twBorder: 'border-lime-200', isPro: true },
    { id: 'style15', label: 'ذهبي', icon: Star, color: '#ca8a04', twColor: 'text-yellow-600', twBg: 'bg-yellow-100', twBorder: 'border-yellow-200', isPro: true }
  ];

  if (generationType === 'visual') {
    designStyles = [
      { id: 'visual_nature', label: 'تفاعلي - طبيعة (أخضر)', icon: Leaf, color: '#65a30d', twColor: 'text-lime-600', twBg: 'bg-lime-100', twBorder: 'border-lime-200' },
      { id: 'visual_elegant', label: 'تفاعلي - أناقة (بنفسجي)', icon: Palette, color: '#9333ea', twColor: 'text-purple-600', twBg: 'bg-purple-100', twBorder: 'border-purple-200' },
      { id: 'visual_geometric', label: 'تفاعلي - هندسي (برتقالي)', icon: Hexagon, color: '#f97316', twColor: 'text-orange-600', twBg: 'bg-orange-100', twBorder: 'border-orange-200' }
    ];
  }

  const contentStyles = [
    { id: 'concise', label: 'مختصر هادف', icon: Zap },
    { id: 'standard', label: 'مضمون عادي', icon: FileText },
    { id: 'detailed', label: 'مفصل', icon: Table },
  ];

  const pageFrames = [
    { id: 'none', label: 'بدون إطار' },
    { id: 'simple', label: 'إطار بسيط' },
    { id: 'double', label: 'إطار مزدوج', isPro: true },
    { id: 'ornate', label: 'إطار مزخرف مميز', isPro: true },
    { id: '3d', label: 'إطار 3D', isPro: true }
  ];

  const handleColorChange = (newColor: string) => {
    const oldColor = docColor;
    setDocColor(newColor);
    saveCurrentPreferences({ docColor: newColor });

    if (generatedHtml) {
      let updated = generatedHtml;
      // 1. Replace var(--doc-color, ...)
      updated = updated.replace(/var\(--doc-color,\s*[^)]+\)/gi, `var(--doc-color, ${newColor})`);
      
      // 2. Replace explicit hex color if present
      if (oldColor && oldColor.toLowerCase() !== newColor.toLowerCase()) {
        const escOld = oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        updated = updated.replace(new RegExp(escOld, 'gi'), newColor);
      }
      
      // 3. Catch common fallback hex colors if replacing from default
      const commonColors = ['#1e40af', '#1d4ed8', '#2563eb', '#3b82f6', '#0284c7', '#0f766e', '#15803d', '#be123c', '#7c3aed', '#9333ea', '#f97316', '#65a30d'];
      if (oldColor) {
        commonColors.forEach(c => {
          if (c.toLowerCase() === oldColor.toLowerCase()) {
            const escC = c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            updated = updated.replace(new RegExp(escC, 'gi'), newColor);
          }
        });
      }

      updateGeneratedHtml(updated);
    }
  };

  const handleDesignStyleChange = (styleId: string) => {
    if (soundEnabled) soundManager.playTabClick();
    setDesignStyle(styleId);
    const selected = designStyles.find(s => s.id === styleId);
    if (selected && selected.color) {
      handleColorChange(selected.color);
    } else {
      saveCurrentPreferences({ designStyle: styleId });
    }
  };

  const profileInputRef = useRef<HTMLInputElement>(null);
  const handleProfileImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && userData) {
      setSelectedProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
      
      setIsUploadingProfile(true);
      setUploadProgress(10);
      try {
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 500);

        let url;
        try {
          url = await uploadImage(file);
        } catch (uploadError) {
          console.warn("Firebase upload failed, falling back to base64:", uploadError);
          // Fallback to base64 if Firebase storage fails (e.g., due to rules)
          url = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
          });
        }
        
        clearInterval(progressInterval);
        setUploadProgress(100);

        if(url) {
          await updateDoc(doc(db, 'users', userData.uid), {
            profilePic: url
          });
          refreshUserData();
          setTimeout(() => {
            setSelectedProfileImage(null);
            setProfileImagePreview(null);
          }, 1000);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('حدث خطأ أثناء رفع الصورة');
        setSelectedProfileImage(null);
        setProfileImagePreview(null);
      } finally {
        setIsUploadingProfile(false);
        setUploadProgress(0);
      }
    }
  };

  const handleProfileCancel = () => {
    setSelectedProfileImage(null);
    setProfileImagePreview(null);
    if (profileInputRef.current) {
      profileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!userData) {
      alert('الرجاء تسجيل الدخول أولاً.');
      navigate('/login');
      return;
    }

    if (!isAdmin && userData.role !== 'admin' && (userData.generationsRemaining === undefined || userData.generationsRemaining <= 0)) {
      alert('عذراً، لقد استنفدت عدد التوليدات المتاحة لك. الرجاء التواصل مع الإدارة لتجديد الاشتراك.');
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    if (soundEnabled) soundManager.playGenerateStart();
    setIsGenerating(true);
    updateGeneratedHtml('');
    
    let subjectInfo: SubjectInfo = {};
    if (generationType === 'memo' || generationType === 'summary' || generationType === 'visual' || generationType.startsWith('cutout')) {
      subjectInfo = { section: memoSection, domain: memoDomain, content: memoContent };
    } else {
      subjectInfo = { 
        exercises, 
        hasIntegrationSituation: hasIntegration,
        includeSolution,
        ...(generationType === 'test' ? {
          examType,
          term: examTerm,
          duration: examDuration,
          includeSolution
        } : {})
      };
    }
    
    const selectedDesignLabel = designStyles.find(s => s.id === designStyle)?.label || 'كلاسيكي';
    const selectedContentLabel = contentStyles.find(s => s.id === contentStyle)?.label || 'مضمون عادي';
    const selectedFrameLabel = pageFrames.find(s => s.id === pageFrame)?.label || 'بدون إطار';

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        signal: abortController.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationType,
          teacherInfo,
          subjectInfo,
          includeSolution,
          documentLanguage,
          includeWatermark,
          contentStyle: selectedContentLabel,
          designStyle: selectedDesignLabel,
          pageFrame: selectedFrameLabel,
          aiPrompt
        })
      });
      let data;
      try {
        if (!res.ok) {
           if (res.status === 504) throw new Error('انتهى وقت الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
           const text = await res.text();
           try { data = JSON.parse(text); } catch(e) { throw new Error(text || 'خطأ في الخادم (Server Error)'); }
        } else {
           data = await res.json();
        }
      } catch (e: any) {
        throw new Error(e.message || 'Server returned an invalid response. Please try again.');
      }
      
      if (data?.error) throw new Error(data.error);
      
      // Strip any <style> tags to prevent the AI from accidentally corrupting the global app layout
      let safeHtml = data.content;
      if (typeof safeHtml === 'string') {
        safeHtml = safeHtml.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, '');
        // Use DOMParser to ensure all tags are perfectly balanced so it doesn't break React's DOM tree
        try {
          const doc = new DOMParser().parseFromString(safeHtml, 'text/html');
          safeHtml = doc.body.innerHTML;
        } catch (parseError) {
          console.error("DOMParser error:", parseError);
        }
      }
      
      updateGeneratedHtml(safeHtml);
      
      // Update generation quota in Firestore
      if (!isAdmin && userData.role !== 'admin') {
        try {
          const { doc, updateDoc, increment } = await import('firebase/firestore');
          const { db } = await import('../lib/firebase');
          const userRef = doc(db, 'users', userData.uid);
          await updateDoc(userRef, {
            generationsRemaining: increment(-1),
            totalGenerations: increment(1)
          });
          refreshUserData();
        } catch (err) {
          console.error('Error updating quota:', err);
        }
      } else if (userData) {
        try {
          const { doc, updateDoc, increment } = await import('firebase/firestore');
          const { db } = await import('../lib/firebase');
          const userRef = doc(db, 'users', userData.uid);
          await updateDoc(userRef, {
            totalGenerations: increment(1)
          });
          refreshUserData();
        } catch (err) {
          console.error('Error updating total generations:', err);
        }
      }

      if (soundEnabled) soundManager.playGenerateComplete();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Generation aborted by user.');
        return;
      }
      console.error(err);
      alert(err.message || 'حدث خطأ أثناء التوليد. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getFrameStyle = (frameId: string, color: string): React.CSSProperties => {
    switch (frameId) {
      case 'simple': return { border: `2px solid ${color}`, margin: '4mm', padding: '5mm', minHeight: 'calc(297mm - 8mm)', boxSizing: 'border-box', borderRadius: '4px' };
      case 'double': return { border: `4px double ${color}`, margin: '4mm', padding: '5mm', minHeight: 'calc(297mm - 8mm)', boxSizing: 'border-box', borderRadius: '4px' };
      case 'ornate': return { 
          border: `2px dashed ${color}`, 
          outline: `2px solid ${color}`, 
          outlineOffset: '-5px',
          margin: '5mm',
          padding: '6mm',
          minHeight: 'calc(297mm - 10mm)',
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          borderRadius: '4px'
      };
      case '3d': return { 
          borderTop: `3px solid ${color}`, 
          borderLeft: `3px solid ${color}`, 
          borderBottom: `6px solid ${color}`, 
          borderRight: `6px solid ${color}`, 
          margin: '4mm',
          padding: '5mm',
          minHeight: 'calc(297mm - 8mm)',
          boxSizing: 'border-box',
          borderRadius: '4px'
      };
      default: return { padding: '6mm', minHeight: '297mm', boxSizing: 'border-box' };
    }
  };

  const getGenerateButtonClasses = () => {
    let gradient = 'from-indigo-600 via-purple-600 to-indigo-600 shadow-indigo-500/50';
    if (generationType === 'test') gradient = 'from-rose-500 via-pink-600 to-rose-500 shadow-rose-500/50';
    else if (generationType === 'series') gradient = 'from-emerald-500 via-teal-600 to-emerald-500 shadow-emerald-500/50';
    else if (generationType === 'summary') gradient = 'from-amber-500 via-orange-600 to-amber-500 shadow-amber-500/50';
    
    return `w-full mt-6 bg-gradient-to-r ${gradient} bg-size-200 hover:bg-pos-100 text-white p-4 rounded-xl font-extrabold text-lg shadow-xl flex flex-col items-center justify-center min-h-[72px] gap-1 disabled:opacity-90 transition-all transform hover:-translate-y-1 active:scale-95 overflow-hidden relative`;
  };

  const exportToPDF = async () => {
    
    const originalElement = document.querySelector('.a4-page') as HTMLElement;
    if (!originalElement) return;

    // Clone the element to avoid breaking the UI during generation
    const clone = originalElement.cloneNode(true) as HTMLElement;
    
    // Create a temporary container off-screen
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '794px';
    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);

    // Apply PDF-specific styles to the clone
    clone.style.transform = 'none';
    clone.style.position = 'relative';
    clone.style.overflow = 'visible';
    clone.style.width = '100%';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';

    const opt = {
      margin:       [5, 0] as [number, number],
      filename:     'document.pdf',
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true, windowWidth: 794 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      pagebreak:    { mode: ['css', 'legacy'] }
    };

    try {
      const pdfBlob = await html2pdf().from(clone).set(opt).output('blob');
      
      let title = 'مستند';
      if (generationType === 'memo') title = 'مذكرة درس';
      else if (generationType === 'test') title = 'تقويم';
      else if (generationType === 'series') title = 'سلسلة تمارين';
      else if (generationType === 'summary') title = 'ملخص';
      else if (generationType === 'visual') title = 'وثيقة تفاعلية';
      else if (generationType.startsWith('cutout')) title = 'قصاصات';
      
      const fileName = `${title}_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.pdf`;
      
      await addFile(fileName, 'pdf', pdfBlob);
      if (soundEnabled) soundManager.playGenerateComplete();
      setIsDownloadsModalOpen(true);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      // Remove the temporary clone from DOM
      document.body.removeChild(tempContainer);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInsertImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      const imgHtml = `<div style="text-align: center; margin: 15px 0;"><img src="${base64Url}" style="max-width: 80%; border-radius: 8px; border: 2px solid var(--doc-color); display: inline-block;" alt="مرفق" /></div>`;
      updateGeneratedHtml(generatedHtml + imgHtml);
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const exportToWord = async () => {
    if (!generatedHtml) return;

    // Replace CSS variables with explicit hex colors for Word compatibility
    const currentColor = docColor || '#1e40af';
    let htmlForWord = generatedHtml
      .replace(/var\(--doc-color,\s*([^)]+)\)/gi, currentColor)
      .replace(/var\(--doc-color\)/gi, currentColor);

    // Convert CSS gradients to solid background colors so MS Word renders backgrounds properly
    htmlForWord = htmlForWord.replace(/background:\s*linear-gradient\([^;)]+\)/gi, `background-color: ${currentColor}`);

    let wordFrameStyle = '';
    if (pageFrame === 'simple') {
      wordFrameStyle = `border: 2px solid ${currentColor}; padding: 12px; border-radius: 4px; box-sizing: border-box;`;
    } else if (pageFrame === 'double') {
      wordFrameStyle = `border: 4px double ${currentColor}; padding: 12px; border-radius: 4px; box-sizing: border-box;`;
    } else if (pageFrame === 'ornate') {
      wordFrameStyle = `border: 2px dashed ${currentColor}; outline: 2px solid ${currentColor}; outline-offset: -4px; padding: 16px; border-radius: 4px; background-color: #ffffff; box-sizing: border-box;`;
    } else if (pageFrame === '3d') {
      wordFrameStyle = `border-top: 3px solid ${currentColor}; border-left: 3px solid ${currentColor}; border-bottom: 5px solid ${currentColor}; border-right: 5px solid ${currentColor}; padding: 12px; border-radius: 4px; box-sizing: border-box;`;
    }

    const framedContent = wordFrameStyle
      ? `<div style="${wordFrameStyle}">${htmlForWord}</div>`
      : htmlForWord;

    const wordHtml = `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>وثيقة Word</title>
<!--[if gte mso 9]>
<xml>
 <w:WordDocument>
  <w:View>Print</w:View>
  <w:Zoom>100</w:Zoom>
  <w:DoNotOptimizeForBrowser/>
 </w:WordDocument>
</xml>
<![endif]-->
<style>
  @page WordSection1 {
    size: 210mm 297mm;
    margin: 1.5cm 1.5cm 1.5cm 1.5cm;
    mso-header-margin: 36.0pt;
    mso-footer-margin: 36.0pt;
    mso-paper-source: 0;
  }
  div.WordSection1 { page: WordSection1; }
  body {
    font-family: 'Arial', 'Traditional Arabic', sans-serif;
    direction: rtl;
    text-align: right;
    font-size: 13pt;
    line-height: 1.5;
    color: #000000;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 15px;
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
  }
  td, th {
    padding: 6px 10px;
    vertical-align: top;
  }
  .watermark-bg {
    display: none;
  }
</style>
</head>
<body lang="AR-DZ" dir="rtl" style="text-align: right;">
<div class="WordSection1" dir="rtl" style="direction: rtl; text-align: right; font-family: 'Arial', sans-serif;">
${framedContent}
</div>
</body>
</html>`;

    const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword;charset=utf-8' });
    
    let title = 'مستند';
    if (generationType === 'memo') title = 'مذكرة درس';
    else if (generationType === 'test') title = 'تقويم';
    else if (generationType === 'series') title = 'سلسلة تمارين';
    else if (generationType === 'summary') title = 'ملخص';
    else if (generationType === 'visual') title = 'وثيقة تفاعلية';
    else if (generationType.startsWith('cutout')) title = 'قصاصات';
    
    const fileName = `${title}_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.doc`;
    
    try {
      await addFile(fileName, 'word', blob);
      if (soundEnabled) soundManager.playGenerateComplete();
      setIsDownloadsModalOpen(true);
    } catch (error) {
      console.error("Word export failed", error);
    }
  };

  const addExercise = () => {
    if (isFreeMode && exercises.length >= 2) {
      alert('في النسخة المجانية يمكنك إضافة تمرينين فقط. يرجى تفعيل الوضع الاحترافي!');
      return;
    }
    setExercises([...exercises, { id: generateId(), section: '', competencies: [''] }]);
  };
  const removeExercise = (id: string) => setExercises(exercises.filter(ex => ex.id !== id));
  
  const updateExerciseSection = (id: string, section: string) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, section } : ex));
  };
  const addCompetency = (exId: string) => {
    setExercises(exercises.map(ex => ex.id === exId ? { ...ex, competencies: [...ex.competencies, ''] } : ex));
  };
  const updateCompetency = (exId: string, compIndex: number, value: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id !== exId) return ex;
      const newComps = [...ex.competencies];
      newComps[compIndex] = value;
      return { ...ex, competencies: newComps };
    }));
  };
  const removeCompetency = (exId: string, compIndex: number) => {
    setExercises(exercises.map(ex => {
      if (ex.id !== exId) return ex;
      return { ...ex, competencies: ex.competencies.filter((_, i) => i !== compIndex) };
    }));
  };

  const phases = ['الابتدائي', 'المتوسط', 'الثانوي'];
  const primaryLevels = ['السنة الأولى ابتدائي', 'السنة الثانية ابتدائي', 'السنة الثالثة ابتدائي', 'السنة الرابعة ابتدائي', 'السنة الخامسة ابتدائي'];
  const middleLevels = ['السنة الأولى متوسط', 'السنة الثانية متوسط', 'السنة الثالثة متوسط', 'السنة الرابعة متوسط'];
  const highLevels = ['السنة الأولى ثانوي', 'السنة الثانية ثانوي', 'السنة الثالثة ثانوي'];
  
  const getLevelsForPhase = (phase: string) => {
    if (phase === 'الابتدائي') return primaryLevels;
    if (phase === 'المتوسط') return middleLevels;
    if (phase === 'الثانوي') return highLevels;
    return [...primaryLevels, ...middleLevels, ...highLevels];
  };

  const subjects = [
    'الرياضيات', 'اللغة العربية', 'التربية الإسلامية', 'التربية العلمية',
    'التربية المدنية', 'التاريخ والجغرافيا', 'اللغة الفرنسية', 'اللغة الإنجليزية',
    'العلوم الفيزيائية والتكنولوجيا', 'علوم الطبيعة والحياة', 'الفلسفة', 'الإعلام الآلي', 'التربية التشكيلية', 'التربية الموسيقية', 'التربية البدنية'
  ];

  return (
    <div 
      className="min-h-screen transition-colors duration-300 relative"
      style={{
        backgroundColor: appBgColor || undefined,
        backgroundImage: appBgImage ? `url(${appBgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Light Strip Animation at the top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70 z-50 overflow-hidden no-print">
        <div className="w-full h-full bg-white/50 animate-light-strip"></div>
      </div>

      {/* Top Activation & Contact Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border-b border-amber-500/40 text-amber-200 py-2 px-3 no-print relative z-50 shadow-md">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs md:text-sm font-bold">
          <div className="flex items-center gap-2 text-amber-300">
            <Sparkles size={16} className="text-amber-400 animate-pulse shrink-0" />
            <span className="text-amber-100">لتفعيل الاشتراك والتواصل المباشر مع الأستاذ دالي نجيب:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Facebook Link */}
            <a 
              href="https://www.facebook.com/dali.nadjib.14" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg shadow-md transition-all hover:scale-105 active:scale-95 text-xs font-bold"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>فايسبوك Facebook</span>
            </a>

            {/* WhatsApp Link */}
            <a 
              href="https://wa.me/213673831994" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg shadow-md transition-all hover:scale-105 active:scale-95 text-xs font-bold"
            >
              <Phone size={14} className="shrink-0" />
              <span>واتساب (0673831994)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Top Banner (Dhikr) */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-1.5 md:py-2 relative shadow-md no-print w-full overflow-hidden">
        <div className="w-full h-full bg-white/50 animate-light-strip absolute top-0 left-0"></div>
        <div className="container mx-auto px-4 flex items-center text-xs md:text-sm font-medium relative z-10 w-full overflow-hidden">
          <div className="w-full overflow-hidden" dir="ltr">
            <div className="animate-marquee inline-flex whitespace-nowrap">
              {ADHKAR_LIST.join(' ❁ ')} ❁ {ADHKAR_LIST.join(' ❁ ')}
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-black/40 backdrop-blur-xl border-b border-amber-900/50 shadow-[0_2px_15px_rgba(212,175,55,0.1)] py-2 px-2 md:py-3 md:px-4 no-print sticky top-0 z-40 transition-colors duration-300 relative overflow-hidden">
        {/* Shine effect over the entire header */}
        <div className="animate-shine-sweep mix-blend-overlay opacity-50 z-0"></div>
        
        <div className="container mx-auto flex justify-between items-center gap-1 md:gap-2 relative z-10">
          {/* Logo Section */}
          <div className="flex items-center gap-1.5 md:gap-3 shrink-0 relative overflow-hidden rounded-xl p-1">
            <div className="absolute inset-0 animate-shine-sweep mix-blend-overlay opacity-80 z-20"></div>
            <div className="relative w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-700 p-0.5 shadow-lg shadow-amber-500/20 shrink-0 overflow-hidden group">
              <div className="w-full h-full bg-[#0a0a0a] rounded-[10px] flex items-center justify-center overflow-hidden border border-amber-500/30">
                 <img src="/icon.svg" alt="Logo" className="w-full h-full object-cover rounded-[10px]" />
              </div>
            </div>
            <div className="flex flex-col shrink-0 truncate justify-center">
              <div className="hidden sm:flex items-center gap-1.5" dir="ltr">
                <h1 className="text-base md:text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 tracking-tight leading-none truncate">
                  PRO GÉNÉRATEUR
                </h1>
                <span className="text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse">🇩🇿</span>
              </div>
              <div className="sm:hidden flex items-center gap-1" dir="ltr">
                <h1 className="text-sm font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 tracking-tight leading-none truncate">
                  PRO AI
                </h1>
                <span className="text-sm drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] animate-pulse">🇩🇿</span>
              </div>
              <p className="hidden sm:block text-[9px] md:text-xs text-amber-500/80 font-bold mt-0.5 tracking-wide truncate">المساعد الذكي للأستاذ</p>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0 py-1">
            
            {/* Profile Picture & PRO status */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="flex flex-col items-end">
                <span className="hidden sm:block text-[11px] md:text-xs font-bold text-amber-100 truncate max-w-[90px]">
                  {userData?.firstName || "مستخدم"}
                </span>
                {isProUser ? (
                  <span className="hidden sm:flex items-center gap-1 bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse">
                    <CheckCircle2 size={10} className="text-emerald-400 shrink-0" />
                    <span>الوضع الاحترافي PRO 🟢</span>
                  </span>
                ) : (
                  <span className="hidden sm:flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    <span>وضع عادي</span>
                  </span>
                )}
              </div>
              <input type="file" ref={profileInputRef} onChange={handleProfileImageSelect} className="hidden" accept="image/*" />
              <button 
                onClick={() => profileInputRef.current?.click()}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden shrink-0 ring-2 ${isProUser ? 'ring-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'ring-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]'} relative group`}
                title="تغيير الصورة الشخصية"
              >
                {(profileImagePreview || userData?.profilePic) ? (
                  <img src={profileImagePreview || userData!.profilePic} alt="Profile" className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.firstName || 'U')}&background=random` }} />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-slate-700 transition-colors">
                    <User size={14} />
                  </div>
                )}
              </button>
            </div>

            {/* Grid for stacking tool buttons */}
            <div className="grid grid-rows-2 grid-flow-col gap-1 md:gap-1.5 items-center">
              <button 
                onClick={() => setIsDownloadsModalOpen(true)}
                className="relative p-1 md:p-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-amber-900/30 text-amber-400 transition-colors flex items-center justify-center w-9 h-9 md:w-10 md:h-10"
                title="التنزيلات"
              >
                <Download size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <div className="flex flex-col items-center justify-center gap-1">
                <button 
                  onClick={() => expertChatEmitter.dispatchEvent(new Event('open'))}
                  className="relative rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-600/20 hover:from-amber-500/40 hover:to-orange-600/40 border border-amber-500/50 text-amber-400 transition-all flex items-center justify-center w-9 h-9 md:w-10 md:h-10 group shadow-[0_0_15px_rgba(245,158,11,0.3)] overflow-hidden"
                  title="الخبير التربوي"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  {(userData?.expertAvatar || localStorage.getItem('expertAvatar')) ? (
                    <img src={userData?.expertAvatar || localStorage.getItem('expertAvatar')!} alt="Expert" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  ) : (
                    <Bot size={22} className="group-hover:scale-110 transition-transform" />
                  )}
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse z-20"></span>
                </button>
                <span className="text-[9px] md:text-[10px] font-semibold text-amber-400/90 whitespace-nowrap">الخبير التربوي</span>
              </div>

              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1 md:p-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-amber-900/30 text-amber-400 transition-colors flex items-center justify-center w-9 h-9 md:w-10 md:h-10"
                title={soundEnabled ? "إيقاف الصوت" : "تشغيل الصوت"}
              >
                {soundEnabled ? <Volume2 size={18} className="text-amber-400" /> : <VolumeX size={18} className="text-red-500/80" />}
              </button>
              
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-1 md:p-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-amber-900/30 text-amber-400 transition-colors flex items-center justify-center w-9 h-9 md:w-10 md:h-10"
                title="تغيير المظهر"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="relative group flex items-center justify-center w-9 h-9 md:w-10 md:h-10">
                <button className="w-full h-full rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-amber-900/30 text-amber-400 transition-colors flex items-center justify-center" title="تغيير لون الخلفية">
                  <Palette size={18} />
                </button>
                <input 
                  type="color" 
                  value={appBgColor || '#f8f9fa'}
                  onChange={handleAppBgColorChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>

              <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center">
                <input type="file" ref={bgInputRef} onChange={handleAppBgUpload} className="hidden" accept="image/*" />
                <button 
                  onClick={() => {
                    if (isFreeMode) {
                      alert('هذه الخاصية متاحة للمشتركين فقط. يرجى الترقية!');
                      return;
                    }
                    bgInputRef.current?.click();
                  }}
                  className="w-full h-full rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-amber-900/30 text-amber-400 transition-colors flex items-center justify-center relative group"
                  title="تغيير صورة الخلفية (للمشتركين فقط)"
                >
                  <ImagePlus size={18} />
                  {isFreeMode && (
                    <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center backdrop-blur-[1px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 drop-shadow-md"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center bg-[#1a1a1a] rounded-lg border border-amber-900/30 px-2 py-1 gap-1 text-amber-400">
                <Languages size={16} className="shrink-0 text-amber-400" />
                <select 
                  value={documentLanguage} 
                  onChange={(e) => {
                    const newLang = e.target.value;
                    setDocumentLanguage(newLang);
                    saveCurrentPreferences({ documentLanguage: newLang });
                  }}
                  className="bg-transparent border-none text-xs font-extrabold text-amber-100 outline-none cursor-pointer text-center appearance-none px-1"
                  title="تغيير لغة الوثيقة والمنصة (العربية / الفرنسية / الإنجليزية)"
                >
                  <option value="ar" className="bg-slate-900 text-white">🇩🇿 AR</option>
                  <option value="fr" className="bg-slate-900 text-white">🇫🇷 FR</option>
                  <option value="en" className="bg-slate-900 text-white">🇬🇧 EN</option>
                </select>
              </div>
            </div>
            
            <div className="w-px h-12 bg-amber-900/50 mx-0.5 md:mx-1"></div>
            
            {/* Admin controls */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="flex flex-col gap-1">
                <button onClick={() => profileModalEmitter.dispatchEvent(new Event('open'))} className="p-1 md:p-1.5 text-blue-400 hover:bg-blue-900/30 bg-slate-900/50 rounded-lg transition-colors border border-blue-500/20 flex items-center justify-center w-8 h-8 md:w-9 md:h-9" title="تحديث الملف الشخصي">
                  <Settings size={16} />
                </button>
                {isAdmin && (
                  <button onClick={() => navigate('/admin')} className="p-1 md:p-1.5 text-amber-300 hover:bg-amber-900/40 bg-gradient-to-r from-amber-600 to-indigo-600 rounded-lg transition-all border border-amber-400/40 flex items-center justify-center w-8 h-8 md:w-9 md:h-9 shadow-md" title="لوحة التحكم">
                    <Shield size={16} className="animate-pulse" />
                  </button>
                )}
                <button onClick={() => { signOut(); navigate('/login'); }} className="p-1 md:p-1.5 text-red-400 hover:bg-red-900/30 bg-slate-900/50 rounded-lg transition-colors border border-red-500/20 flex items-center justify-center w-8 h-8 md:w-9 md:h-9" title="تسجيل الخروج">
                  <LogOut size={16} />
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1600px] mx-auto p-2 md:p-4 lg:p-6 flex flex-col xl:flex-row gap-4 lg:gap-6">
        {/* Controls Sidebar */}
        <div className="w-full xl:w-[420px] flex flex-col gap-4 lg:gap-6 no-print shrink-0">
          
          {/* Teacher Profile Card */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-100/50 dark:border-slate-800/50 p-6 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500 group-hover:w-2 transition-all"></div>
            <div className="flex justify-between items-start mb-5">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                <User className="text-indigo-500" size={22} />
                معلومات الأستاذ
              </h2>
              <div className="flex flex-col items-center gap-2">
                <button 
                  onClick={() => profileInputRef.current?.click()}
                  className="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] relative group cursor-pointer"
                  title="تغيير الصورة الشخصية"
                >
                  {(profileImagePreview || userData?.profilePic) ? (
                    <img src={profileImagePreview || userData!.profilePic} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.firstName || 'U')}&background=random` }} />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                      <User size={24} />
                    </div>
                  )}
                </button>
                {isUploadingProfile && (
                  <div className="flex flex-col items-center gap-1 w-full mt-1">
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold animate-pulse">جاري الحفظ...</span>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-1 overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-1 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Status Card - PRO Mode Banner */}
            {isProUser ? (
              <div className="mb-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-4 rounded-xl border-2 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 animate-pulse"></div>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0 animate-bounce" />
                    <h3 className="text-sm font-black bg-gradient-to-r from-emerald-300 via-teal-200 to-green-300 bg-clip-text text-transparent">
                      {isAdmin ? 'حساب مسؤول - الوضع الاحترافي' : 'حساب مفعل - الوضع الاحترافي (PRO)'}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 text-[10px] font-black tracking-wide flex items-center gap-1 shadow-sm">
                    <Zap size={11} className="text-amber-300 fill-amber-300" />
                    مفعل 🟢
                  </span>
                </div>

                <p className="text-[11px] text-emerald-200/90 font-medium mb-3 leading-relaxed">
                  تهانينا يا أستاذ! تم ترقية حسابك بنجاح للوضع الاحترافي وتفعيل جميع الميزات المتقدمة.
                </p>

                {/* Features Checklist */}
                <div className="grid grid-cols-1 gap-1.5 text-xs text-emerald-100 bg-emerald-950/70 p-2.5 rounded-lg border border-emerald-500/30 mb-3 text-right">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 font-extrabold shrink-0" />
                    <span>توليد غير محدود للمواضيع والاختبارات والمذكرات</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 font-extrabold shrink-0" />
                    <span>جميع التصاميم، الإطارات، والخلفيات الحصرية مفتوحة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 font-extrabold shrink-0" />
                    <span>استجابة فائقة السرعة مع خبير الذكاء الاصطناعي</span>
                  </div>
                </div>

                {/* Green Activation Progress Bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-[10px] font-bold text-emerald-300">
                    <span>حالة الرصيد والتفعيل</span>
                    <span>وضع مفعّل ⚡</span>
                  </div>
                  <div className="w-full bg-emerald-950 rounded-full h-2.5 border border-emerald-500/40 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_12px_rgba(16,185,129,0.8)] transition-all duration-500" 
                      style={{ width: `${isAdmin ? 100 : Math.min(100, Math.max(0, ((userData?.generationsRemaining ?? 300) / 300) * 100))}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => navigate('/admin')}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-extrabold text-xs shadow-md transition-all"
                    >
                      <Shield size={15} />
                      <span>دخول لوحة التحكم</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { signOut(); navigate('/login'); }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/40 font-bold text-xs transition-all"
                  >
                    <LogOut size={14} />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-5 bg-gradient-to-br from-slate-900 to-red-950 p-4 rounded-xl border border-red-500/40 text-white shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Lock size={14} className="text-amber-400" />
                    حساب عادي - لترقية حسابك اتصل بالمطور
                  </h3>
                  <button
                    type="button"
                    onClick={() => { signOut(); navigate('/login'); }}
                    className="flex items-center gap-1 text-xs text-red-300 hover:text-white font-bold underline"
                  >
                    <LogOut size={13} />
                    <span>خروج</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
                  احصل على الوضع الاحترافي لتوليد غير محدود لجميع المواضيع والمذكرات وتصميم خلفيات خاصة.
                </p>

                {/* Direct Contact Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <a
                    href="https://wa.me/213673831994"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md"
                  >
                    <Phone size={13} />
                    <span>واتساب (0673831994)</span>
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition-all shadow-md"
                  >
                    <span>فايسبوك Facebook</span>
                  </a>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-amber-300">
                    <span>رصيد التوليد المتاح</span>
                    <span>حساب عادي 🔒</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                    <div 
                      className="h-2 rounded-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, ((userData?.generationsRemaining ?? 0) / 30) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400 uppercase tracking-wider">الاسم</label>
                <div className="relative">
                  <input type="text" value={teacherInfo.firstName} onChange={e => setTeacherInfo({...teacherInfo, firstName: e.target.value})} className="w-full pl-3 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow" />
                  <User className="absolute right-3 top-3 text-slate-400" size={16} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400 uppercase tracking-wider">اللقب</label>
                <div className="relative">
                  <input type="text" value={teacherInfo.lastName} onChange={e => setTeacherInfo({...teacherInfo, lastName: e.target.value})} className="w-full pl-3 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow" />
                  <User className="absolute right-3 top-3 text-slate-400" size={16} />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400 uppercase tracking-wider">المؤسسة</label>
              <div className="relative">
                <input type="text" value={teacherInfo.school} onChange={e => setTeacherInfo({...teacherInfo, school: e.target.value})} className="w-full pl-3 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow" />
                <School className="absolute right-3 top-3 text-slate-400" size={16} />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400 uppercase tracking-wider">المادة</label>
              <div className="relative">
                <select value={teacherInfo.subject} onChange={e => setTeacherInfo({...teacherInfo, subject: e.target.value})} className="w-full pl-3 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow appearance-none">
                  <option value="">اختر المادة...</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <BookOpen className="absolute right-3 top-3 text-slate-400" size={16} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400 uppercase tracking-wider">الطور</label>
                <div className="relative">
                  <select value={teacherInfo.phase} onChange={e => setTeacherInfo({...teacherInfo, phase: e.target.value, level: ''})} className="w-full pl-3 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow appearance-none">
                    <option value="">اختر...</option>
                    {phases.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <Layers className="absolute right-3 top-3 text-slate-400" size={16} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400 uppercase tracking-wider">المستوى</label>
                <div className="relative">
                  <select value={teacherInfo.level} onChange={e => setTeacherInfo({...teacherInfo, level: e.target.value})} className="w-full pl-3 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow appearance-none" disabled={!teacherInfo.phase}>
                    <option value="">اختر...</option>
                    {getLevelsForPhase(teacherInfo.phase).map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <GraduationCap className="absolute right-3 top-3 text-slate-400" size={16} />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={handleSaveTeacher} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <Save size={18} /> حفظ الإعدادات كافتراضية
              </button>
            </div>
          </div>

          {/* Generator Controls */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-100/50 dark:border-slate-800/50 p-6">
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-3 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl mb-6 shadow-inner">
              {[
                { id: 'memo', icon: FileText, label: 'مذكرة', bg: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', shadowColor: 'rgba(99, 102, 241, 0.5)' },
                { id: 'test', icon: FileSpreadsheet, label: 'اختبار/فرض', bg: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400', shadowColor: 'rgba(244, 63, 94, 0.5)' },
                { id: 'series', icon: ListTodo, label: 'سلسلة تمارين', bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', shadowColor: 'rgba(16, 185, 129, 0.5)' },
                { id: 'summary', icon: Layers, label: 'ملخص', bg: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', shadowColor: 'rgba(245, 158, 11, 0.5)' },
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => {
                    if (soundEnabled) soundManager.playTabClick();
                    setGenerationType(tab.id as GenerationType);
                    const randomDhikr = ADHKAR_LIST[Math.floor(Math.random() * ADHKAR_LIST.length)];
                    setDhikrState({ tabId: tab.id, text: randomDhikr, timestamp: Date.now() });
                  }}
                  className={`group relative flex-1 min-w-[110px] flex flex-col items-center justify-center gap-2 py-3 px-2 text-sm font-bold rounded-xl transition-all duration-300 border ${
                    generationType === tab.id 
                      ? 'bg-white dark:bg-slate-800 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.1)] scale-105 border-slate-200 dark:border-slate-700 z-10 ' + tab.text
                      : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-700/50 ' + tab.text
                  }`}
                >
                  <div className="relative">
                    <tab.icon size={24} className={`transition-all duration-300 ${tab.text} ${generationType === tab.id ? 'animate-moving-shadow' : 'opacity-60 group-hover:opacity-100 group-hover:scale-110'}`} style={{ filter: generationType === tab.id ? `drop-shadow(0 0 8px ${tab.shadowColor})` : '' }} />
                    {dhikrState?.tabId === tab.id && (
                      <div 
                        key={dhikrState.timestamp} 
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl shadow-[0_10px_25px_-5px_rgba(16,185,129,0.5)] border-2 border-emerald-300/50 dark:border-emerald-600/50 animate-float-dhikr pointer-events-none z-50 flex items-center justify-center gap-2"
                        style={{ fontFamily: "'Amiri', 'Tajawal', sans-serif" }}
                      >
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-500 rotate-45 border-b-2 border-r-2 border-emerald-300/50 dark:border-emerald-600/50 rounded-sm"></div>
                        <span className="text-lg font-bold drop-shadow-md relative z-10">{dhikrState.text}</span>
                        <Sparkles size={16} className="text-yellow-200 relative z-10 animate-pulse" />
                      </div>
                    )}
                  </div>
                  <span className={generationType === tab.id ? tab.text : ''}>{tab.label}</span>
                </button>
              ))}
              
              <div className="w-full mt-2 border-t border-slate-200 dark:border-slate-700 pt-3 flex flex-wrap gap-2">
                <span className="w-full text-xs font-bold text-slate-400 mb-1">قصاصات وملاحق (8 في الورقة)</span>
                {[
                  { id: 'cutout_start', icon: Zap, label: 'وضعيات انطلاقية' },
                  { id: 'cutout_learning', icon: BookOpen, label: 'وضعيات تعلمية' },
                  { id: 'cutout_integration', icon: Hexagon, label: 'وضعيات إدماجية' },
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => {
                      if (soundEnabled) soundManager.playTabClick();
                      setGenerationType(tab.id as GenerationType);
                      const randomDhikr = ADHKAR_LIST[Math.floor(Math.random() * ADHKAR_LIST.length)];
                      setDhikrState({ tabId: tab.id, text: randomDhikr, timestamp: Date.now() });
                    }}
                    className={`relative flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 px-2 text-xs font-bold rounded-lg transition-all border ${
                      generationType === tab.id 
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 shadow-sm z-10' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <tab.icon size={14} className={generationType === tab.id ? 'stroke-current' : ''} />
                    {tab.label}
                    {dhikrState?.tabId === tab.id && (
                      <div 
                        key={dhikrState.timestamp} 
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl shadow-[0_10px_25px_-5px_rgba(16,185,129,0.5)] border-2 border-emerald-300/50 dark:border-emerald-600/50 animate-float-dhikr pointer-events-none z-50 flex items-center justify-center gap-2"
                        style={{ fontFamily: "'Amiri', 'Tajawal', sans-serif" }}
                      >
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-500 rotate-45 border-b-2 border-r-2 border-emerald-300/50 dark:border-emerald-600/50 rounded-sm"></div>
                        <span className="text-lg font-bold drop-shadow-md relative z-10">{dhikrState.text}</span>
                        <Sparkles size={16} className="text-yellow-200 relative z-10 animate-pulse" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Inputs based on type */}
            {(generationType === 'memo' || generationType === 'summary' || generationType === 'visual' || generationType.startsWith('cutout')) ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-indigo-50/80 dark:bg-indigo-950/40 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/40 shadow-sm">
                  <span className="text-xs font-bold text-indigo-800 dark:text-indigo-200 flex items-center gap-1.5">
                    <Bookmark size={16} className="text-indigo-600 dark:text-indigo-400" /> عناصر الدرس (الجيل الثاني)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      type="button" 
                      onClick={handleSaveLessonElements}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 transition transform active:scale-95"
                      title="حفظ المقطع والميدان والمورد لاستخدامهم لاحقاً"
                    >
                      <Save size={13} /> حفظ المعطيات
                    </button>
                    <button 
                      type="button" 
                      onClick={handleLoadLessonElements}
                      className="text-xs bg-indigo-100 dark:bg-indigo-900/60 hover:bg-indigo-200 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-200 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                      title="استرجاع عناصر الدرس المحفوظة سابقاً"
                    >
                      <RotateCcw size={13} /> استرجاع
                    </button>
                    <button 
                      type="button" 
                      onClick={handleResetInputs}
                      className="text-xs bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                      title="تفريغ الحقول وإعادة التعيين للكتابة مجدداً"
                    >
                      <RotateCcw size={13} className="rotate-180" /> إعادة تعيين
                    </button>
                  </div>
                </div>

                {lessonSaveMessage && (
                  <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800 animate-in fade-in flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-600" /> {lessonSaveMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400 uppercase tracking-wider">المقطع</label>
                  <input type="text" placeholder="مثال: التغذية عند الإنسان" value={memoSection} onChange={e => { setMemoSection(e.target.value); saveCurrentPreferences({ memoSection: e.target.value }); }} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400 uppercase tracking-wider">الميدان</label>
                  <input type="text" placeholder="مثال: الإنسان والصحة" value={memoDomain} onChange={e => { setMemoDomain(e.target.value); saveCurrentPreferences({ memoDomain: e.target.value }); }} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400 uppercase tracking-wider">المورد / المحتوى المعرفي</label>
                  <input type="text" placeholder="مثال: الهضم" value={memoContent} onChange={e => { setMemoContent(e.target.value); saveCurrentPreferences({ memoContent: e.target.value }); }} className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" />
                </div>
                
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-indigo-50/80 dark:bg-indigo-950/40 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/40 shadow-sm">
                  <span className="text-xs font-bold text-indigo-800 dark:text-indigo-200 flex items-center gap-1.5">
                    <Bookmark size={16} className="text-indigo-600 dark:text-indigo-400" /> خيارات ومعلومات موضوع التقويم
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      type="button" 
                      onClick={handleSaveLessonElements}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 transition transform active:scale-95"
                      title="حفظ معلومات وتقويمات الفرض لاستخدامهم لاحقاً"
                    >
                      <Save size={13} /> حفظ المعطيات
                    </button>
                    <button 
                      type="button" 
                      onClick={handleLoadLessonElements}
                      className="text-xs bg-indigo-100 dark:bg-indigo-900/60 hover:bg-indigo-200 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-200 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                      title="استرجاع معلومات الفرض المحفوظة سابقاً"
                    >
                      <RotateCcw size={13} /> استرجاع
                    </button>
                    <button 
                      type="button" 
                      onClick={handleResetInputs}
                      className="text-xs bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                      title="تفريغ الحقول وإعادة التعيين للكتابة مجدداً"
                    >
                      <RotateCcw size={13} className="rotate-180" /> إعادة تعيين
                    </button>
                  </div>
                </div>

                {lessonSaveMessage && (
                  <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800 animate-in fade-in flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-600" /> {lessonSaveMessage}
                  </div>
                )}

                {generationType === 'test' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400 uppercase tracking-wider">نوع التقويم</label>
                        <select value={examType} onChange={e => setExamType(e.target.value)} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                          <option value="فرض 1">الفرض الأول</option>
                          <option value="فرض 2">الفرض الثاني</option>
                          <option value="اختبار 1">اختبار الفصل الأول</option>
                          <option value="اختبار 2">اختبار الفصل الثاني</option>
                          <option value="اختبار 3">اختبار الفصل الثالث</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400 uppercase tracking-wider">الفصل</label>
                        <select value={examTerm} onChange={e => setExamTerm(e.target.value)} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                          <option value="الفصل الأول">الفصل الأول</option>
                          <option value="الفصل الثاني">الفصل الثاني</option>
                          <option value="الفصل الثالث">الفصل الثالث</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400 uppercase tracking-wider">التوقيت</label>
                        <select value={examDuration} onChange={e => setExamDuration(e.target.value)} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                          <option value="ساعة واحدة">ساعة واحدة (1 سا)</option>
                          <option value="ساعة ونصف">ساعة ونصف (1.5 سا)</option>
                          <option value="ساعتان">ساعتان (2 سا)</option>
                        </select>
                      </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-700 dark:text-slate-300 font-bold bg-indigo-50 dark:bg-indigo-900/20 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-800/30 transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/40">
                      <input type="checkbox" checked={hasIntegration} onChange={e => { setHasIntegration(e.target.checked); saveCurrentPreferences({ hasIntegration: e.target.checked }); }} className="rounded text-indigo-600 focus:ring-indigo-500 w-5 h-5 accent-indigo-600" />
                      تضمين وضعية إدماجية
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer text-sm text-slate-700 dark:text-slate-300 font-bold bg-amber-50 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/40 transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/40">
                      <input 
                        type="checkbox" 
                        checked={includeSolution} 
                        onChange={e => { 
                          setIncludeSolution(e.target.checked); 
                          saveCurrentPreferences({ includeSolution: e.target.checked }); 
                        }} 
                        className="rounded text-amber-600 focus:ring-amber-500 w-5 h-5 accent-amber-600 mt-0.5" 
                      />
                      <div className="flex flex-col">
                        <span className="text-amber-900 dark:text-amber-200 font-bold flex items-center gap-1.5">
                          <Sparkles size={15} className="text-amber-600" /> تضمين الحل النموذجي والتصحيح
                        </span>
                        <span className="text-xs text-amber-700 dark:text-amber-400 font-normal mt-0.5">
                          عند عدم التفعيل (افتراضي): يتم توليد موضوع الفرض/الاختبار فقط بدون إجابات. وعند التفعيل: يتم توليد الفرض أولاً ثم إلحاق الحل النموذجي وشبكة التنقيط في صفحة جديدة بأسفل الفرض.
                        </span>
                      </div>
                    </label>
                  </div>
                )}
                
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 dark:text-white">التمارين ({exercises.length})</h3>
                    <button onClick={addExercise} className="text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg font-semibold transition">
                      + إضافة تمرين
                    </button>
                  </div>
                  
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    {exercises.map((ex, index) => (
                      <div key={ex.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">التمرين {index + 1}</span>
                          {exercises.length > 1 && (
                            <button onClick={() => removeExercise(ex.id)} className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">حذف</button>
                          )}
                        </div>
                        <input type="text" placeholder="المقطع" value={ex.section} onChange={e => updateExerciseSection(ex.id, e.target.value)} className="w-full p-2.5 mb-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                        
                        <div className="space-y-2 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                          <label className="block text-xs font-bold text-slate-500 mb-2">الكفاءات المستهدفة</label>
                          {ex.competencies.map((comp, cIndex) => (
                            <div key={cIndex} className="flex gap-2">
                              <input type="text" placeholder="مثال: يفسر ظاهرة..." value={comp} onChange={e => updateCompetency(ex.id, cIndex, e.target.value)} className="flex-1 p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-1 focus:ring-indigo-500" />
                              {ex.competencies.length > 1 && (
                                <button onClick={() => removeCompetency(ex.id, cIndex)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg text-xs transition">✕</button>
                              )}
                            </div>
                          ))}
                          <button onClick={() => addCompetency(ex.id)} className="text-xs font-bold text-indigo-500 mt-2 hover:text-indigo-700">+ إضافة كفاءة</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Universal Styling Options for all generation types */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
              
              {/* Document Language Selection */}
              <div>
                <label className="block text-xs font-bold mb-3 text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Languages size={16} className="text-amber-500" />
                  لغة الوثيقة (Document Language)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ar', flag: '🇩🇿', label: 'العربية' },
                    { id: 'fr', flag: '🇫🇷', label: 'Français' },
                    { id: 'en', flag: '🇬🇧', label: 'English' },
                  ].map(lang => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => {
                        if (soundEnabled) soundManager.playTabClick();
                        setDocumentLanguage(lang.id);
                        saveCurrentPreferences({ documentLanguage: lang.id });
                      }}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all border ${
                        documentLanguage === lang.id
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-transparent shadow-md scale-[1.02]'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="text-sm">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Content Style */}
              <div>
                <label className="block text-xs font-bold mb-3 text-slate-800 dark:text-slate-200 uppercase tracking-wider">ستايل المضمون (كيفية عرض المحتوى)</label>
                <div className="flex flex-wrap gap-3">
                  {contentStyles.map(style => (
                    <button
                      key={style.id}
                      onClick={() => {
                        if (soundEnabled) soundManager.playTabClick();
                        setContentStyle(style.id);
                      }}
                      className={`flex-1 min-w-[120px] flex justify-center items-center gap-2 p-3 rounded-xl border-2 text-sm font-bold transition-all relative overflow-hidden group ${
                        contentStyle === style.id 
                          ? 'bg-amber-500 text-white border-amber-600 shadow-[0_4px_0_0_#b45309] hover:translate-y-1 hover:shadow-[0_0px_0_0_#b45309]' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-300 dark:hover:border-amber-700 hover:-translate-y-1 hover:shadow-[0_4px_0_0_#cbd5e1] dark:hover:shadow-[0_4px_0_0_#334155]'
                      }`}
                    >
                      {/* Glass effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <style.icon size={18} className={contentStyle === style.id ? 'animate-bounce' : ''} />
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Design Style */}
              <div>
                <label className="block text-xs font-bold mb-3 text-slate-800 dark:text-slate-200 uppercase tracking-wider">ستايل التصميم والألوان</label>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {designStyles.map(style => {
                    const isLocked = isFreeMode && style.isPro;
                    return (
                      <button
                        key={style.id}
                        onClick={() => {
                          if (isLocked) {
                            alert('هذا التصميم متاح للمشتركين فقط. يرجى الترقية لفتحه!');
                            return;
                          }
                          handleDesignStyleChange(style.id);
                        }}
                        className={`relative flex flex-col items-center justify-center gap-2 transition-all group ${
                          designStyle === style.id ? 'transform scale-110' : 'hover:transform hover:scale-105 hover:-translate-y-1 opacity-80 hover:opacity-100'
                        } ${isLocked ? 'grayscale opacity-60 hover:grayscale-0' : ''}`}
                        style={{ width: '70px' }}
                      >
                        {isLocked && (
                          <div className="absolute top-0 right-0 z-20 bg-slate-900/80 rounded-full p-1 shadow-sm border border-slate-700/50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                          </div>
                        )}
                        {/* Magic Ball 3D Element */}
                        <div 
                          className={`w-14 h-14 rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-1 ${
                            designStyle === style.id 
                              ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]' 
                              : 'shadow-[0_6px_15px_-3px_rgba(0,0,0,0.15)] group-hover:shadow-[0_10px_20px_-3px_rgba(0,0,0,0.25)]'
                          }`}
                          style={{
                            background: designStyle === style.id 
                              ? `radial-gradient(circle at 35% 25%, #ffffff 0%, ${style.color} 55%, #090d16 110%)` 
                              : `radial-gradient(circle at 35% 25%, #ffffff 0%, ${style.color}dd 60%, #1e293b 120%)`,
                            color: 'white',
                            boxShadow: designStyle === style.id 
                              ? `0 12px 24px -4px ${style.color}80, inset 0 -4px 8px rgba(0,0,0,0.4)` 
                              : `0 6px 16px -2px ${style.color}40, inset 0 -3px 6px rgba(0,0,0,0.3)`
                          }}
                        >
                          {/* 3D Specular Top Glare */}
                          <div className="absolute top-1 left-2 w-5 h-3 bg-white/70 rounded-full blur-[0.6px] -rotate-45 pointer-events-none" />
                          {/* 3D Bottom Rim Reflection */}
                          <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />
                          <style.icon size={22} className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] text-white transform transition-transform group-hover:scale-110" />
                        </div>
                        <span className={`text-[11px] text-center font-extrabold transition-colors ${designStyle === style.id ? 'text-indigo-600 dark:text-indigo-400 scale-105' : 'text-slate-600 dark:text-slate-400'}`}>
                          {style.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Page Frame */}
              <div>
                <label className="block text-xs font-bold mb-3 text-slate-800 dark:text-slate-200 uppercase tracking-wider">إطار الصفحة</label>
                <div className="flex flex-wrap gap-3">
                  {pageFrames.map(frame => {
                    const isLocked = isFreeMode && frame.isPro;
                    return (
                      <button
                        key={frame.id}
                        onClick={() => {
                          if (isLocked) {
                            alert('هذا الإطار متاح للمشتركين فقط. يرجى الترقية لفتحه!');
                            return;
                          }
                          if (soundEnabled) soundManager.playTabClick();
                          setPageFrame(frame.id);
                          saveCurrentPreferences({ pageFrame: frame.id });
                        }}
                        className={`flex-1 min-w-[85px] py-2.5 px-2 rounded-xl border-2 text-xs font-bold transition-all relative group flex flex-col items-center gap-1.5 overflow-hidden ${
                          pageFrame === frame.id 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-[0_6px_18px_-4px_rgba(15,23,42,0.4)] scale-105 dark:bg-slate-100 dark:text-slate-900 dark:border-white' 
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-0.5 hover:shadow-md'
                        } ${isLocked ? 'opacity-60' : ''}`}
                      >
                        {isLocked && (
                          <div className="absolute top-1 right-1 z-20 text-slate-400 dark:text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                          </div>
                        )}
                        
                        {/* Miniature 3D Frame Visual Preview */}
                        <div className="w-10 h-7 rounded flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                          {frame.id === 'none' && (
                            <div className="w-7 h-5 bg-white border border-slate-200 dark:border-slate-700 rounded-[1px] shadow-2xs" />
                          )}
                          {frame.id === 'simple' && (
                            <div className="w-7 h-5 bg-white border-2 border-indigo-500 rounded-[1px] shadow-2xs" />
                          )}
                          {frame.id === 'double' && (
                            <div className="w-7 h-5 bg-white border-[3px] border-double border-indigo-600 rounded-[1px] shadow-2xs" />
                          )}
                          {frame.id === 'ornate' && (
                            <div className="w-7 h-5 bg-white border border-dashed border-amber-600 rounded-[1px] outline outline-1 outline-amber-600 -outline-offset-2 shadow-2xs flex items-center justify-center">
                              <div className="w-1 h-1 bg-amber-500 rounded-full" />
                            </div>
                          )}
                          {frame.id === '3d' && (
                            <div className="w-7 h-5 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-800 dark:to-indigo-950 border-t-2 border-l-2 border-r-4 border-b-4 border-indigo-600 rounded-[2px] shadow-[2px_3px_6px_rgba(0,0,0,0.2)] flex items-center justify-center transform -rotate-1 group-hover:rotate-0 transition-transform">
                              <span className="text-[8px] font-black tracking-tighter text-indigo-700 dark:text-indigo-300 drop-shadow-2xs">3D</span>
                            </div>
                          )}
                        </div>

                        <span className="text-[11px] font-extrabold">{frame.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* AI Instruction Prompt & Watermark */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-700 dark:text-slate-300 font-bold bg-sky-50 dark:bg-sky-900/20 p-3 rounded-xl border border-sky-100 dark:border-sky-800/30 transition-colors hover:bg-sky-100 dark:hover:bg-sky-900/40">
                <input type="checkbox" checked={includeWatermark} onChange={e => setIncludeWatermark(e.target.checked)} className="rounded text-sky-600 focus:ring-sky-500 w-5 h-5 accent-sky-600" />
                <Droplet size={18} className="text-sky-500" />
                إضافة علامة مائية للمادة (Watermark)
              </label>

              <div>
                <label className="block text-xs font-semibold mb-2 text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={14} className="text-yellow-500" />
                  توجيه الذكاء الاصطناعي (اختياري)
                </label>
                <textarea 
                  rows={3} 
                  placeholder="اكتب أي تعليمات إضافية، مثلاً: ركز على أسئلة الفهم، أضف أشكال هندسية لتوضيح الفكرة..." 
                  value={aiPrompt} 
                  onChange={e => setAiPrompt(e.target.value)} 
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-shadow"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-4">
              {(!generatedHtml) && (
                <button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className={getGenerateButtonClasses()}
                  style={{ backgroundSize: '200% auto' }}
                >
                  {isGenerating ? (
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-3">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>جاري التوليد الخارق...</span>
                      </div>
                      <span className="text-sm font-arabic font-bold text-white/90 animate-pulse">{generatingDhikr}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Zap size={22} className="fill-current" />
                      توليد حصري مميز
                    </div>
                  )}
                </button>
              )}

              {(isGenerating || generatedHtml) && (
                <button 
                  onClick={() => {
                    if (abortControllerRef.current) {
                      abortControllerRef.current.abort();
                    }
                    if (soundEnabled) soundManager.playTabClick();
                    updateGeneratedHtml('');
                    setIsGenerating(false);
                  }} 
                  className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-red-500/30 border border-red-400"
                >
                  <X size={22} />
                  تراجع عن التوليد (إلغاء ومسح)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Preview Area (A4) */}
        <div className="flex-1 flex flex-col items-center">
          
          <div className="w-full flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-4 no-print bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-4 rounded-xl shadow-sm border border-slate-100/50 dark:border-slate-800/50">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 shrink-0">
              <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 p-1.5 rounded-lg">
                <FileText size={20} />
              </span>
              ورقة المعاينة
            </h3>
            
            <div className="flex flex-wrap gap-3 items-center justify-end">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <button onClick={() => setManualScale(Math.max(0.5, manualScale - 0.1))} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm transition text-slate-600 dark:text-slate-400" title="تصغير الورقة">
                  <ZoomOut size={16} />
                </button>
                <span className="text-xs font-bold font-mono w-10 text-center text-slate-700 dark:text-slate-300">
                  {Math.round(manualScale * 100)}%
                </span>
                <button onClick={() => setManualScale(Math.min(2, manualScale + 0.1))} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm transition text-slate-600 dark:text-slate-400" title="تكبير الورقة">
                  <ZoomIn size={16} />
                </button>
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                <button onClick={() => setManualScale(1)} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm transition text-slate-600 dark:text-slate-400" title="استعادة الحجم الأصلي">
                  <Maximize size={16} />
                </button>
              </div>

              {/* Color, Font Size & Frame Selector */}
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <input 
                  type="color" 
                  value={docColor} 
                  onChange={e => handleColorChange(e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent"
                  title="تغيير لون العناوين والزخارف (يتغير مباشرة في المستند)"
                />
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                <button onClick={() => setPreviewFontSize(Math.max(10, previewFontSize - 1))} className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm transition font-bold" title="تصغير الخط">-</button>
                <span className="text-xs font-mono w-6 text-center text-slate-700 dark:text-slate-300 font-bold">{previewFontSize}</span>
                <button onClick={() => setPreviewFontSize(Math.min(30, previewFontSize + 1))} className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm transition font-bold" title="تكبير الخط">+</button>
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                <select 
                  value={pageFrame} 
                  onChange={e => {
                    if (soundEnabled) soundManager.playTabClick();
                    setPageFrame(e.target.value);
                    saveCurrentPreferences({ pageFrame: e.target.value });
                  }}
                  className="text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 outline-none cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition"
                  title="تغيير شكل إطار الصفحة"
                >
                  {pageFrames.map(f => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleInsertImage} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={!generatedHtml}
                  className="relative group overflow-hidden flex items-center gap-2 bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-[0_4px_0_0_#059669] hover:translate-y-1 hover:shadow-[0_0px_0_0_#059669] active:scale-95"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <ImagePlus size={16} /> صورة/شكل
                </button>
                <button 
                  onClick={() => window.print()} 
                  disabled={!generatedHtml}
                  className="relative group overflow-hidden flex items-center gap-2 bg-gradient-to-b from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-[0_4px_0_0_#334155] hover:translate-y-1 hover:shadow-[0_0px_0_0_#334155] active:scale-95"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Printer size={16} /> طباعة
                </button>
                <button 
                  onClick={exportToPDF} 
                  disabled={!generatedHtml}
                  className="relative group overflow-hidden flex items-center gap-2 bg-gradient-to-b from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-[0_4px_0_0_#be123c] hover:translate-y-1 hover:shadow-[0_0px_0_0_#be123c] active:scale-95"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Download size={16} /> PDF
                </button>
                <button 
                  onClick={exportToWord} 
                  disabled={!generatedHtml}
                  className="relative group overflow-hidden flex items-center gap-2 bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-[0_4px_0_0_#1d4ed8] hover:translate-y-1 hover:shadow-[0_0px_0_0_#1d4ed8] active:scale-95"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Download size={16} /> Word
                </button>
              </div>
            </div>
          </div>

          {/* Scaled A4 Container */}
          <div ref={containerRef} className="a4-container rounded-xl shadow-inner relative flex-1 min-h-[600px] w-full overflow-auto bg-slate-100 dark:bg-slate-800/50" style={{ display: 'flex', justifyContent: 'center' }}>
            {generatedHtml ? (
              <div style={{ width: 794 * effectiveScale, height: 1122 * effectiveScale, position: 'relative' }}>
                <div 
                  className="a4-page print-area bg-white text-black outline-none transition-transform duration-200 ease-out absolute top-0 left-0 overflow-hidden"
                  style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: `${previewFontSize}px`,
                    '--doc-color': docColor,
                    transform: `scale(${effectiveScale})`,
                    transformOrigin: 'top left',
                    width: '210mm',
                    minHeight: '297mm',
                    boxSizing: 'border-box',
                  } as React.CSSProperties}
                >
                  <div
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: generatedHtml }}
                    style={getFrameStyle(pageFrame, docColor)}
                    className="w-full h-full min-h-[297mm]"
                  />
                </div>
              </div>
            ) : (
              <div style={{ width: 794 * effectiveScale, height: 1122 * effectiveScale, position: 'relative' }}>
                <div 
                  className="a4-page print-area bg-white text-slate-300 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 transition-transform duration-200 ease-out absolute top-0 left-0"
                  style={{ 
                    transform: `scale(${effectiveScale})`,
                    transformOrigin: 'top left',
                    width: '210mm',
                    minHeight: '297mm',
                  }}
                >
                  <div className="bg-slate-50 p-8 rounded-full mb-6 relative">
                    <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20"></div>
                    <FileText size={80} className="text-slate-300" />
                  </div>
                  <p className="text-2xl font-bold text-slate-400">ورقة A4 جاهزة للتوليد</p>
                  <p className="text-base mt-2 text-slate-400/80">املأ المعلومات واضغط على زر التوليد الحصري</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      <DownloadsModal 
        isOpen={isDownloadsModalOpen} 
        onClose={() => setIsDownloadsModalOpen(false)} 
      />
    </div>
  );
}

