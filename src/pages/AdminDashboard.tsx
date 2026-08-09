import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, query, where, increment } from 'firebase/firestore';
import { useAuth, UserData } from '../contexts/AuthContext';
import { Settings, BarChart3, Trash2, Edit, Plus, RefreshCw, Home, User, Lock, KeyRound, Copy, CheckCircle2, Users, Key, Power, Search, ImageMinus, Activity, Eye, EyeOff, Zap, ShieldCheck, AlertTriangle, XCircle, Check } from 'lucide-react';
import { updatePassword, updateEmail } from 'firebase/auth';
import { uploadImage } from '../lib/cloudinary';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'keys' | 'settings'>('users');
  
  // Settings state
  const [profilePic, setProfilePic] = useState(userData?.profilePic || '');
  const [firstName, setFirstName] = useState(userData?.firstName || '');
  const [lastName, setLastName] = useState(userData?.lastName || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [newPassword, setNewPassword] = useState('');
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [keys, setKeys] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Advanced Key Statistics State
  const [keysList, setKeysList] = useState<any[]>([]);
  const [totalGenerations, setTotalGenerations] = useState<number>(0);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [totalKeysCount, setTotalKeysCount] = useState<number>(0);
  const [isLoadingKeys, setIsLoadingKeys] = useState<boolean>(false);
  const [keySearchQuery, setKeySearchQuery] = useState<string>('');
  const [keyStatusFilter, setKeyStatusFilter] = useState<'all' | 'active' | 'rate_limited' | 'disabled'>('all');
  const [visibleKeys, setVisibleKeys] = useState<{ [id: string]: boolean }>({});
  const [testingKeys, setTestingKeys] = useState<{ [id: string]: boolean }>({});
  const [testResults, setTestResults] = useState<{ [id: string]: { success: boolean; message: string; latencyMs?: number } }>({});
  const [isTestingAll, setIsTestingAll] = useState<boolean>(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setFetchError(null);
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData: UserData[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ uid: doc.id, ...doc.data() } as UserData);
      });
      setUsers(usersData);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setFetchError(error.message || 'حدث خطأ غير معروف');
      if (error.code === 'permission-denied') {
        alert('صلاحيات غير كافية لجلب المستخدمين. يرجى تعديل قواعد بيانات Firestore للسماح بالوصول (read).');
      }
    }
  };

  const fetchKeysStats = async () => {
    setIsLoadingKeys(true);
    try {
      // 1. Fetch from server API endpoint
      const res = await fetch('/api/keys-stats');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.keys)) {
          setKeysList(data.keys);
          setTotalGenerations(data.totalGenerations || 0);
          setActiveCount(data.activeCount || 0);
          setTotalKeysCount(data.totalKeysCount || 0);
          setIsLoadingKeys(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend /api/keys-stats not responding, using client fallback:', e);
    }

    // 2. Client-side fallback using getAllApiKeysInfo
    try {
      const { getAllApiKeysInfo } = await import('../lib/apiKeyHelper');
      const stats = await getAllApiKeysInfo();
      setKeysList(stats.keys);
      setTotalGenerations(stats.totalGenerations);
      setActiveCount(stats.activeCount);
      setTotalKeysCount(stats.totalKeysCount);
    } catch (error) {
      console.error('Error fetching key stats:', error);
    } finally {
      setIsLoadingKeys(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchKeysStats();
  }, []);

  useEffect(() => {
    if (userData) {
      setProfilePic(userData.profilePic || '');
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setEmail(userData.email || '');
    }
  }, [userData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      if(url) {
        setProfilePic(url);
        if(userData?.uid) {
          await updateDoc(doc(db, 'users', userData.uid), {
            profilePic: url
          });
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleRemoveProfilePic = async () => {
    try {
      setProfilePic('');
      if(userData?.uid) {
        await updateDoc(doc(db, 'users', userData.uid), {
          profilePic: ''
        });
      }
    } catch (error) {
      console.error('Remove pic error:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if(userData?.uid) {
        await updateDoc(doc(db, 'users', userData.uid), {
          firstName,
          lastName,
          email
        });
      }
      
      if(newPassword && auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setNewPassword('');
      }
      
      alert('تم حفظ الإعدادات الشخصية بنجاح');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    }
  };

  const handleUpdateGenerations = async (uid: string, newAmount: number) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        generationsRemaining: newAmount
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating generations:', error);
    }
  };

  const handleActivateUser = async (uid: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        isActive: true,
        isPro: true,
        generationsRemaining: 300
      });
      fetchUsers();
    } catch (error) {
      console.error('Error activating user:', error);
      alert('حدث خطأ أثناء تفعيل المستخدم.');
    }
  };

  const handleDeactivateUser = async (uid: string) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        isActive: false,
        isPro: false,
        generationsRemaining: 0
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('حدث خطأ أثناء إيقاف المستخدم.');
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if(window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      try {
        await deleteDoc(doc(db, 'users', uid));
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Key Handlers & Testing
  const handleTestSingleKey = async (keyInfo: any) => {
    const keyId = keyInfo.id;
    setTestingKeys(prev => ({ ...prev, [keyId]: true }));
    try {
      const res = await fetch('/api/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyInfo.key })
      });
      const data = await res.json();
      setTestResults(prev => ({
        ...prev,
        [keyId]: {
          success: data.success,
          message: data.message || data.error || 'تم الاختبار',
          latencyMs: data.latencyMs
        }
      }));
    } catch (err: any) {
      setTestResults(prev => ({
        ...prev,
        [keyId]: {
          success: false,
          message: err.message || 'فشل الاتصال بالخادم'
        }
      }));
    } finally {
      setTestingKeys(prev => ({ ...prev, [keyId]: false }));
    }
  };

  const handleTestAllKeys = async () => {
    setIsTestingAll(true);
    for (const k of keysList) {
      await handleTestSingleKey(k);
    }
    setIsTestingAll(false);
    fetchKeysStats();
  };

  const handleToggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const handleCopyKey = (keyStr: string, id: string) => {
    navigator.clipboard.writeText(keyStr);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleAddKey = async () => {
    const key = window.prompt('أدخل مفتاح الـ API الجديد (Gemini API Key):');
    if (!key || key.trim().length < 10) return;
    
    const provider = window.prompt('أدخل اسم المزود (افتراضي: Gemini AI):') || 'Gemini AI';

    try {
      await addDoc(collection(db, 'api_keys'), {
        key: key.trim(),
        provider,
        isActive: true,
        error: null,
        createdAt: serverTimestamp()
      });
      fetchKeysStats();
      alert('تمت إضافة المفتاح إلى Firestore بنجاح وسيتناوب في التوليدات تلقائياً!');
    } catch (error) {
      console.error('Error adding API key:', error);
      alert('حدث خطأ أثناء إضافة المفتاح.');
    }
  };

  const handleToggleKeyStatus = async (keyInfo: any) => {
    try {
      const isCurrentlyActive = keyInfo.isActive && keyInfo.status !== 'disabled';
      const newActive = !isCurrentlyActive;

      const { doc: firestoreDoc, setDoc: firestoreSetDoc } = await import('firebase/firestore');
      await firestoreSetDoc(firestoreDoc(db, 'api_key_stats', keyInfo.id), {
        disabled: !newActive,
        status: newActive ? 'active' : 'disabled'
      }, { merge: true });

      if (keyInfo.source === 'firestore' && keyInfo.dbDocId) {
        await updateDoc(doc(db, 'api_keys', keyInfo.dbDocId), {
          isActive: newActive
        });
      }

      fetchKeysStats();
    } catch (error) {
      console.error('Error toggling key status:', error);
    }
  };

  const handleDeleteKey = async (keyInfo: any) => {
    if (window.confirm(`هل أنت متأكد من حذف المفتاح (${keyInfo.maskedKey})؟`)) {
      try {
        if (keyInfo.dbDocId) {
          await deleteDoc(doc(db, 'api_keys', keyInfo.dbDocId));
        }
        const { doc: firestoreDoc, deleteDoc: firestoreDeleteDoc } = await import('firebase/firestore');
        await firestoreDeleteDoc(firestoreDoc(db, 'api_key_stats', keyInfo.id)).catch(() => {});
        
        fetchKeysStats();
      } catch (error) {
        console.error('Error deleting key:', error);
      }
    }
  };

  const filteredUsers = users.filter(u => 
    `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.phone || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans" dir="rtl">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 flex items-center justify-center border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-wider text-indigo-400">لوحة التحكم</h1>
        </div>
        
        <div className="flex flex-col p-4 flex-1 gap-2">
          <button 
            onClick={() => setActiveTab('users')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users size={20} />
            <span className="font-medium">إدارة المستخدمين</span>
          </button>

          <button 
            onClick={() => setActiveTab('keys')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'keys' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Key size={20} />
            <span className="font-medium">مفاتيح الـ API</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <User size={20} />
            <span className="font-medium">الإعدادات الشخصية</span>
          </button>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <Home size={20} />
            <span className="font-medium">العودة للرئيسية</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {activeTab === 'users' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">إدارة المستخدمين</h2>
                  <p className="text-slate-500">تعديل الأرصدة، وتفعيل أو حذف حسابات المستخدمين.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="بحث بالاسم، الإيميل، أو الهاتف..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 font-semibold">المستخدم</th>
                        <th className="px-6 py-4 font-semibold">البريد</th>
                        <th className="px-6 py-4 font-semibold">الرصيد المتبقي</th>
                        <th className="px-6 py-4 font-semibold">إجمالي التوليد</th>
                        <th className="px-6 py-4 font-semibold">الحالة</th>
                        <th className="px-6 py-4 font-semibold text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map(user => (
                        <tr key={user.uid} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-800">{user.firstName} {user.lastName}</td>
                          <td className="px-6 py-4 text-slate-600" dir="ltr" style={{textAlign: 'right'}}>
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {user.email}
                          </td>
                          <td className="px-6 py-4">
                            <input 
                              type="number" 
                              defaultValue={user.generationsRemaining}
                              onBlur={(e) => handleUpdateGenerations(user.uid!, parseInt(e.target.value))}
                              className="w-20 px-2 py-1 border border-slate-200 rounded-lg text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </td>
                          <td className="px-6 py-4 text-slate-600">{user.totalGenerations || 0}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {user.isActive ? 'نشط' : 'موقوف'}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex justify-center gap-2">
                            {!user.isActive ? (
                              <button 
                                onClick={() => handleActivateUser(user.uid!)} 
                                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors"
                              >
                                تفعيل
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleDeactivateUser(user.uid!)} 
                                className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-colors"
                              >
                                تعطيل
                              </button>
                            )}
                            <button onClick={() => handleDeleteUser(user.uid!)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                            {fetchError ? (
                              <span className="text-red-500 font-semibold">{fetchError}</span>
                            ) : (
                              'لا يوجد مستخدمين.'
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-1 flex items-center gap-3">
                    <Key className="text-indigo-600" size={32} />
                    مفاتيح الـ API وإحصائيات الاستهلاك
                  </h2>
                  <p className="text-slate-500">
                    مراقبة وإدارة مفاتيح Vercel البيئية و Firestore، وتناوب التوليدات تلقائياً (Round-Robin).
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleTestAllKeys}
                    disabled={isTestingAll || isLoadingKeys || keysList.length === 0}
                    className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Zap size={18} className={isTestingAll ? 'animate-bounce' : ''} />
                    {isTestingAll ? 'جاري اختبار كافة المفاتيح...' : 'اختبار شامل للمفاتيح'}
                  </button>
                  <button 
                    onClick={fetchKeysStats}
                    disabled={isLoadingKeys}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors"
                    title="تحديث البيانات"
                  >
                    <RefreshCw size={18} className={isLoadingKeys ? 'animate-spin' : ''} />
                    تحديث
                  </button>
                  <button 
                    onClick={handleAddKey} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-transform active:scale-95"
                  >
                    <Plus size={18} />
                    إضافة مفتاح جديد
                  </button>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">إجمالي المفاتيح المكتشفة</p>
                    <h3 className="text-3xl font-extrabold text-slate-800">{totalKeysCount} <span className="text-sm font-normal text-slate-500">مفتاح</span></h3>
                    <p className="text-xs text-indigo-600 font-medium mt-1">تشمل مفاتيح البيئة (Vercel) + Firestore</p>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Key size={28} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">المفاتيح النشطة</p>
                    <h3 className="text-3xl font-extrabold text-emerald-600">{activeCount} / {totalKeysCount}</h3>
                    <p className="text-xs text-emerald-600 font-medium mt-1">جاهزة للتوليد ومفعلة</p>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <ShieldCheck size={28} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">إجمالي عمليات التوليد</p>
                    <h3 className="text-3xl font-extrabold text-slate-800">{totalGenerations.toLocaleString('ar-DZ')} <span className="text-sm font-normal text-slate-500">توليد</span></h3>
                    <p className="text-xs text-slate-500 mt-1">عبر كافة المفاتيح المتناوبة</p>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                    <Activity size={28} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">معدل الاستهلاك / المفتاح</p>
                    <h3 className="text-3xl font-extrabold text-slate-800">
                      {totalKeysCount > 0 ? (totalGenerations / totalKeysCount).toFixed(1) : 0}
                    </h3>
                    <p className="text-xs text-indigo-600 font-medium mt-1">توليد لكل مفتاح (توزيع متكافئ)</p>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <BarChart3 size={28} />
                  </div>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="بحث باسم المفتاح، الرمز، أو المصدر..."
                    value={keySearchQuery}
                    onChange={(e) => setKeySearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setKeyStatusFilter('all')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${keyStatusFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    الكل ({keysList.length})
                  </button>
                  <button
                    onClick={() => setKeyStatusFilter('active')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${keyStatusFilter === 'active' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    النشطة ({keysList.filter(k => k.isActive && k.status !== 'rate_limited' && k.status !== 'error').length})
                  </button>
                  <button
                    onClick={() => setKeyStatusFilter('rate_limited')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${keyStatusFilter === 'rate_limited' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    تجاوز الحد (429) ({keysList.filter(k => k.status === 'rate_limited').length})
                  </button>
                  <button
                    onClick={() => setKeyStatusFilter('disabled')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${keyStatusFilter === 'disabled' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    الموقوفة ({keysList.filter(k => !k.isActive || k.status === 'disabled' || k.status === 'error').length})
                  </button>
                </div>
              </div>

              {/* Keys Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3.5 font-bold">مصدر المفتاح والمزود</th>
                        <th className="px-5 py-3.5 font-bold">المفتاح والمعاينة</th>
                        <th className="px-5 py-3.5 font-bold">الحالة التشغيلية</th>
                        <th className="px-5 py-3.5 font-bold text-center">عدد التوليدات</th>
                        <th className="px-5 py-3.5 font-bold">نسبة التناوب والتوزيع</th>
                        <th className="px-5 py-3.5 font-bold">آخر استخدام</th>
                        <th className="px-5 py-3.5 font-bold text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {keysList
                        .filter(k => {
                          const matchesQuery = !keySearchQuery || 
                            k.envVarName?.toLowerCase().includes(keySearchQuery.toLowerCase()) ||
                            k.maskedKey?.toLowerCase().includes(keySearchQuery.toLowerCase()) ||
                            k.key?.toLowerCase().includes(keySearchQuery.toLowerCase());
                          
                          if (!matchesQuery) return false;
                          if (keyStatusFilter === 'active') return k.isActive && k.status !== 'rate_limited' && k.status !== 'error';
                          if (keyStatusFilter === 'rate_limited') return k.status === 'rate_limited';
                          if (keyStatusFilter === 'disabled') return !k.isActive || k.status === 'disabled' || k.status === 'error';
                          return true;
                        })
                        .map((keyInfo, index) => {
                          const isVisible = !!visibleKeys[keyInfo.id];
                          const isTesting = !!testingKeys[keyInfo.id];
                          const testRes = testResults[keyInfo.id];

                          return (
                            <tr key={keyInfo.id || index} className="hover:bg-slate-50/70 transition-colors">
                              {/* Source */}
                              <td className="px-5 py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                                    {keyInfo.envVarName || 'GEMINI_API_KEY'}
                                  </span>
                                  <span className="text-xs text-slate-400 mt-0.5">
                                    {keyInfo.source === 'env' ? '⚙️ متغير بيئة Vercel' : '📁 قاعدة بيانات Firestore'}
                                  </span>
                                </div>
                              </td>

                              {/* Key Preview & Actions */}
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2 font-mono text-xs text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg w-fit" dir="ltr">
                                  <span>{isVisible ? keyInfo.key : keyInfo.maskedKey}</span>
                                  <button
                                    onClick={() => handleToggleKeyVisibility(keyInfo.id)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                    title={isVisible ? 'إخفاء' : 'إظهار'}
                                  >
                                    {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                                  </button>
                                  <button
                                    onClick={() => handleCopyKey(keyInfo.key, keyInfo.id)}
                                    className="text-slate-400 hover:text-indigo-600 transition-colors relative"
                                    title="نسخ المفتاح"
                                  >
                                    {copiedKeyId === keyInfo.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                  </button>
                                </div>
                              </td>

                              {/* Status */}
                              <td className="px-5 py-4">
                                {keyInfo.status === 'rate_limited' ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                    <AlertTriangle size={14} className="text-amber-600" />
                                    تجاوز الحد (429 Rate Limit)
                                  </span>
                                ) : !keyInfo.isActive || keyInfo.status === 'disabled' ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                                    <XCircle size={14} className="text-red-600" />
                                    موقوف / معطل
                                  </span>
                                ) : keyInfo.status === 'error' ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                    <XCircle size={14} className="text-rose-600" />
                                    خطأ بالمفتاح
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    نشط ومتناوب (Active)
                                  </span>
                                )}

                                {testRes && (
                                  <div className={`mt-1.5 text-xs font-semibold px-2 py-0.5 rounded border ${testRes.success ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    {testRes.message}
                                  </div>
                                )}
                              </td>

                              {/* Usage Count */}
                              <td className="px-5 py-4 text-center">
                                <span className="text-base font-extrabold text-slate-800">
                                  {keyInfo.usageCount || 0}
                                </span>
                                <span className="text-xs text-slate-400 block">توليد</span>
                              </td>

                              {/* Share % Progress Bar */}
                              <td className="px-5 py-4 min-w-[140px]">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs font-bold text-slate-600">
                                    <span>{keyInfo.usagePercentage || 0}%</span>
                                    <span className="text-slate-400 font-normal">حصة التناوب</span>
                                  </div>
                                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div
                                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                                      style={{ width: `${Math.min(100, Math.max(2, keyInfo.usagePercentage || 0))}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>

                              {/* Last Used */}
                              <td className="px-5 py-4 text-xs text-slate-500">
                                {keyInfo.lastUsedAt ? new Date(keyInfo.lastUsedAt).toLocaleString('ar-DZ') : 'لم يُستخدم بعد'}
                              </td>

                              {/* Actions */}
                              <td className="px-5 py-4">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleTestSingleKey(keyInfo)}
                                    disabled={isTesting}
                                    className="p-2 text-slate-600 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 rounded-lg transition-colors"
                                    title="اختبار المفتاح مع Gemini API"
                                  >
                                    <Zap size={16} className={isTesting ? 'animate-spin text-amber-500' : ''} />
                                  </button>

                                  <button
                                    onClick={() => handleToggleKeyStatus(keyInfo)}
                                    className={`p-2 rounded-lg transition-colors ${keyInfo.isActive && keyInfo.status !== 'disabled' ? 'text-emerald-600 hover:text-amber-600 bg-emerald-50 hover:bg-amber-50' : 'text-slate-400 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50'}`}
                                    title="تفعيل / إيقاف المفتاح"
                                  >
                                    <Power size={16} />
                                  </button>

                                  {keyInfo.source === 'firestore' && (
                                    <button
                                      onClick={() => handleDeleteKey(keyInfo)}
                                      className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors"
                                      title="حذف المفتاح المخصص"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                      {keysList.length === 0 && !isLoadingKeys && (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                            لا توجد مفاتيح مكتشفة حالياً. يمكنك إضافة مفاتيح في بيئة Vercel كـ GEMINI_API_KEY_1..30 أو إضافتها هنا.
                          </td>
                        </tr>
                      )}

                      {isLoadingKeys && (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                            <RefreshCw size={24} className="animate-spin text-indigo-600 mx-auto mb-2" />
                            جاري جلب إحصائيات ومفاتيح Vercel و Firestore...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">الإعدادات الشخصية</h2>
                <p className="text-slate-500">إدارة معلومات حسابك وصورتك الشخصية وكلمة المرور.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
                
                {/* Profile Picture Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-100">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 shadow-md flex-shrink-0 relative group">
                    {profilePic ? (
                      <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-300">
                        <User size={40} />
                      </div>
                    )}
                  </div>
                  <div className="text-center sm:text-right flex flex-col items-center sm:items-start gap-2">
                    <h3 className="font-bold text-lg text-slate-800 mb-1">{userData?.firstName} {userData?.lastName}</h3>
                    <div className="flex gap-2">
                      <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-block">
                        تغيير الصورة
                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      </label>
                      {profilePic && (
                        <button onClick={handleRemoveProfilePic} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                          <ImageMinus size={16} /> حذف
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Info Section */}
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <User size={18} className="text-slate-400" />
                    المعلومات الشخصية
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">الاسم</label>
                      <input 
                        type="text" 
                        value={firstName} 
                        onChange={e => setFirstName(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">اللقب</label>
                      <input 
                        type="text" 
                        value={lastName} 
                        onChange={e => setLastName(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-slate-600 mb-1">البريد الإلكتروني</label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" 
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Section */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Lock size={18} className="text-slate-400" />
                    كلمة المرور
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value)} 
                      placeholder="كلمة المرور الجديدة (اختياري)" 
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={handleUpdateProfile} 
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-sm transition-colors"
                  >
                    حفظ جميع التغييرات
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

