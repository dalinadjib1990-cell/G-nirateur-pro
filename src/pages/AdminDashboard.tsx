import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, setDoc, serverTimestamp, query, where, increment } from 'firebase/firestore';
import { useAuth, UserData } from '../contexts/AuthContext';
import { Settings, BarChart3, Trash2, Edit, Plus, RefreshCw, Home, User, Lock, KeyRound, Copy, CheckCircle2, Users, Key, Power, Search, ImageMinus, Activity, Eye, EyeOff, Zap, ShieldCheck, AlertTriangle, XCircle, Check, Ban, UserX } from 'lucide-react';
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
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
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
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, generationsRemaining: newAmount } : u));
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
      // Optimistic state update: set active, pro, and give generations
      setUsers(prev => prev.map(u => u.uid === uid ? {
        ...u,
        isActive: true,
        isPro: true,
        generationsRemaining: (u.generationsRemaining && u.generationsRemaining > 0) ? u.generationsRemaining : 300
      } : u));

      await updateDoc(doc(db, 'users', uid), {
        isActive: true,
        isPro: true,
        generationsRemaining: 300
      });
      fetchUsers();
    } catch (error) {
      console.error('Error activating user:', error);
      alert('حدث خطأ أثناء تفعيل المستخدم.');
      fetchUsers();
    }
  };

  const handleDeactivateUser = async (uid: string) => {
    try {
      // Optimistic state update: set inactive
      setUsers(prev => prev.map(u => u.uid === uid ? {
        ...u,
        isActive: false,
        isPro: false,
        generationsRemaining: 0
      } : u));

      await updateDoc(doc(db, 'users', uid), {
        isActive: false,
        isPro: false,
        generationsRemaining: 0
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('حدث خطأ أثناء إيقاف المستخدم.');
      fetchUsers();
    }
  };

  const handleBanAndDeleteUser = async (userToBan: UserData) => {
    if (!userToBan.uid) return;
    const userName = `${userToBan.firstName || ''} ${userToBan.lastName || ''}`.trim() || 'المستخدم';
    const confirmMsg = `هل أنت متأكد من حظر وإزالة هذا الحساب نهائياً؟\n\nالاسم: ${userName}\nالبريد: ${userToBan.email || 'غير مدخل'}\nالهاتف: ${userToBan.phone || 'غير مدخل'}\n\nعند الحظر لن يستطيع صاحب هذا الحساب أو البريد/الهاتف التسجيل أو الدخول مجدداً.`;
    
    if (window.confirm(confirmMsg)) {
      try {
        // 1. Create ban records
        if (userToBan.email) {
          const cleanEmail = userToBan.email.toLowerCase().trim();
          await setDoc(doc(db, 'banned_emails', cleanEmail), {
            bannedAt: Date.now(),
            email: cleanEmail,
            uid: userToBan.uid,
            reason: 'حظر وإزالة من قبل الإدارة'
          });
        }
        if (userToBan.phone) {
          const cleanPhone = userToBan.phone.trim();
          await setDoc(doc(db, 'banned_phones', cleanPhone), {
            bannedAt: Date.now(),
            phone: cleanPhone,
            uid: userToBan.uid,
            reason: 'حظر وإزالة من قبل الإدارة'
          });
        }
        await setDoc(doc(db, 'banned_users', userToBan.uid), {
          bannedAt: Date.now(),
          uid: userToBan.uid,
          email: userToBan.email || '',
          phone: userToBan.phone || '',
          reason: 'حظر وإزالة من قبل الإدارة'
        });

        // 2. Delete user doc
        await deleteDoc(doc(db, 'users', userToBan.uid));
        
        // 3. Update local state
        setUsers(prev => prev.filter(u => u.uid !== userToBan.uid));
        alert(`تم إزالة الحساب (${userName}) وحظر البريد/الهاتف نهائياً بنجاح.`);
        fetchUsers();
      } catch (error) {
        console.error('Error banning user:', error);
        alert('حدث خطأ أثناء حظر وإزالة الحساب.');
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

  const activeUsersCount = users.filter(u => u.isActive).length;
  const inactiveUsersCount = users.length - activeUsersCount;

  const filteredUsers = users.filter(u => {
    const query = searchQuery.toLowerCase().trim();
    const matchesStatus = 
      userStatusFilter === 'all' ? true :
      userStatusFilter === 'active' ? !!u.isActive :
      !u.isActive;

    if (!matchesStatus) return false;
    if (!query) return true;

    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const email = (u.email || '').toLowerCase();
    const phone = (u.phone || '').toLowerCase();
    const stateName = (u.state || '').toLowerCase();
    const phase = (u.phase || '').toLowerCase();

    return fullName.includes(query) || email.includes(query) || phone.includes(query) || stateName.includes(query) || phase.includes(query);
  });

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
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              
              {/* Stats Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">إجمالي الحسابات</p>
                    <h3 className="text-2xl font-bold text-slate-800">{users.length}</h3>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Users size={22} />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-emerald-600 mb-1">الحسابات المفعلة</p>
                    <h3 className="text-2xl font-bold text-emerald-700">{activeUsersCount}</h3>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <CheckCircle2 size={22} />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-amber-600 mb-1">غير مفعلة / في الانتظار</p>
                    <h3 className="text-2xl font-bold text-amber-700">{inactiveUsersCount}</h3>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <XCircle size={22} />
                  </div>
                </div>
              </div>

              {/* Header & Controls */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">إدارة المستخدمين والتفعيلات</h2>
                  <p className="text-sm text-slate-500">البحث بالاسم أو البريد، تفعيل الحسابات، وتحديد الرصيد أو الحظر النهائي.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  {/* Status Filter Tabs */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setUserStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${userStatusFilter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      الكل ({users.length})
                    </button>
                    <button
                      onClick={() => setUserStatusFilter('active')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${userStatusFilter === 'active' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      المفعلة ({activeUsersCount})
                    </button>
                    <button
                      onClick={() => setUserStatusFilter('inactive')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${userStatusFilter === 'inactive' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      غير المفعلة ({inactiveUsersCount})
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative flex-1 sm:w-64">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="بحث بالاسم، البريد، أو الهاتف..." 
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 font-semibold">المستخدم</th>
                        <th className="px-6 py-4 font-semibold">البريد الإلكتروني / الهاتف</th>
                        <th className="px-6 py-4 font-semibold">رصيد التوليد</th>
                        <th className="px-6 py-4 font-semibold">المستهلك</th>
                        <th className="px-6 py-4 font-semibold">الحالة</th>
                        <th className="px-6 py-4 font-semibold text-center">إجراءات التفعيل والحظر</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map(user => (
                        <tr key={user.uid} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800">{user.firstName} {user.lastName}</div>
                            {(user.state || user.phase) && (
                              <div className="text-xs text-slate-400 mt-0.5">
                                {user.state} {user.phase ? `• ${user.phase}` : ''}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-600 text-sm" dir="ltr" style={{textAlign: 'right'}}>
                            <div>{user.email || 'بدون بريد'}</div>
                            {user.phone && <div className="text-xs text-slate-400 mt-0.5" dir="ltr">{user.phone}</div>}
                          </td>
                          <td className="px-6 py-4">
                            <input 
                              type="number" 
                              defaultValue={user.generationsRemaining}
                              onBlur={(e) => handleUpdateGenerations(user.uid!, parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border border-slate-200 rounded-lg text-center font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{user.totalGenerations || 0}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${user.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                              {user.isActive ? 'حساب مفعل' : 'غير مفعل (في الانتظار)'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {!user.isActive ? (
                                <button 
                                  onClick={() => handleActivateUser(user.uid!)} 
                                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                                >
                                  <CheckCircle2 size={16} />
                                  تفعيل الحساب
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleDeactivateUser(user.uid!)} 
                                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                                >
                                  <XCircle size={16} />
                                  تعطيل الحساب
                                </button>
                              )}
                              
                              <button 
                                onClick={() => handleBanAndDeleteUser(user)} 
                                className="px-3 py-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all text-xs font-bold flex items-center gap-1 border border-red-200"
                                title="إزالة هذا الحساب وحظره نهائياً من التسجيل"
                              >
                                <UserX size={16} />
                                حظر وإزالة
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                            {fetchError ? (
                              <span className="text-red-500 font-semibold">{fetchError}</span>
                            ) : (
                              'لا يوجد مستخدمين يطابقون شروط البحث أو الفلترة.'
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

