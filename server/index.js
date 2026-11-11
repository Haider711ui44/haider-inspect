import React, {useMemo, useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {Activity, ArrowLeftRight, CalendarClock, ChartNoAxesCombined, CircleHelp, Globe2, LayoutDashboard, LogOut, Menu, MessageSquareText, Settings, ShieldCheck, Users, X} from 'lucide-react';
import './style.css';

const copy = {
  ar:{dir:'rtl',brand:'حيدر 711 X',tag:'لوحة إدارة حسابك على X',overview:'نظرة عامة',posts:'المنشورات المجدولة',followers:'إدارة المتابعين',activity:'سجل النشاط',settings:'الإعدادات',connect:'ربط حساب X',connectHint:'اربط حسابك عبر صفحة X الرسمية. لن نطلب كلمة مرورك هنا.',login:'تسجيل الدخول باستخدام X',welcome:'مرحبًا بك في حيدر 711 X',subtitle:'مساحة واحدة لإدارة منشوراتك ومتابعة أداء حسابك.',followersN:'المتابعون',following:'يتابعهم',postsN:'المنشورات',composer:'إنشاء منشور مجدول',text:'نص المنشور',placeholder:'اكتب منشورك هنا… استخدم {number} في موضع الرقم المتغير.',start:'رقم البداية',end:'رقم النهاية',step:'مقدار الزيادة',interval:'الفاصل بالدقائق',preview:'معاينة المنشورات',schedule:'حفظ الجدولة والنشر الآن',sample:'مثال: تحديث جديد، الرقم هو {number}',notice:'هذه النسخة متصلة بخادم حيدر على Render لنشر التغريدات مباشرة.',manual:'إدارة المتابعين',manualHint:'اعرض القوائم وحللها، ثم نفّذ الإجراءات يدويًا عبر الوظائف الرسمية المتاحة. لا توجد متابعة أو إلغاء متابعة آلية.',notConnected:'غير متصل',connected:'متصل بالحساب',language:'اللغة',arabic:'العربية',english:'English',russian:'Русский',empty:'لا توجد عمليات بعد',saved:'تم إرسال المنشور إلى X بنجاح!'},
  en:{dir:'ltr',brand:'Haider 711 X',tag:'Your X account workspace',overview:'Overview',posts:'Scheduled posts',followers:'Followers',activity:'Activity log',settings:'Settings',connect:'Connect X account',connectHint:'Connect through the official X authorization page. We never ask for your password here.',login:'Continue with X',welcome:'Welcome to Haider 711 X',subtitle:'One workspace for publishing and understanding your account.',followersN:'Followers',following:'Following',postsN:'Posts',composer:'Create a scheduled post',text:'Post text',placeholder:'Write your post… use {number} where the changing number belongs.',start:'Start number',end:'End number',step:'Increment',interval:'Interval in minutes',preview:'Preview posts',schedule:'Save & Publish Now',sample:'Example: A new update, number {number}',notice:'This version is connected to Haider backend on Render.',manual:'Follower management',manualHint:'Review and analyze lists, then take actions manually through supported official features. No automated follow/unfollow.',notConnected:'Not connected',connected:'Connected',language:'Language',arabic:'العربية',english:'English',russian:'Русский',empty:'No activity yet',saved:'Post published successfully to X!'},
  ru:{dir:'ltr',brand:'Haider 711 X',tag:'Панель управления аккаунтом X',overview:'Обзор',posts:'Запланированные публикации',followers:'Подписчики',activity:'Журнал действий',settings:'Настройки',connect:'Подключить аккаунт X',connectHint:'Подключение выполняется через официальную страницу X. Мы не запрашиваем ваш пароль.',login:'Войти через X',welcome:'Добро пожаловать в Haider 711 X',subtitle:'Единое пространство для публикаций и анализа аккаунта.',followersN:'Подписчики',following:'Подписки',postsN:'Публикации',composer:'Создать публикацию',text:'Текст публикации',placeholder:'Введите текст… используйте {number} для изменяемого числа.',start:'Начальное число',end:'Конечное число',step:'Шаг увеличения',interval:'Интервал в минутах',preview:'Предпросмотр публикаций',schedule:'Опубликовать сейчас',sample:'Пример: Новое обновление, номер {number}',notice:'Версия подключена к серверу Render.',manual:'Управление подписчиками',manualHint:'Просматривайте и анализируйте списки, а действия выполняйте вручную через официальные функции. Автоматической подписки и отписки нет.',notConnected:'Не подключён',connected:'Подключено',language:'Языك',arabic:'العربية',english:'English',russian:'Русский',empty:'Пока нет действий',saved:'Опубликовано успешно!'}
};

function App(){
  const [lang,setLang]=useState('ar'),[section,setSection]=useState('overview'),[post,setPost]=useState('تحديث جديد، الرقم هو {number}'),[start,setStart]=useState(100),[end,setEnd]=useState(105),[step,setStep]=useState(1),[interval,setInterval]=useState(10),[saved,setSaved]=useState(false),[mobile,setMobile]=useState(false);
  const [username, setUsername] = useState(null);
  
  const t=copy[lang];
  const nums=useMemo(()=>{let a=[],s=Number(start),e=Number(end),d=Math.max(1,Number(step)||1);if(e>=s){for(let n=s;n<=e&&a.length<8;n+=d)a.push(n)}else{for(let n=s;n>=e&&a.length<8;n-=d)a.push(n)}return a},[start,end,step]);
  const preview=nums.map(n=>post.includes('{number}')?post.replaceAll('{number}',n):post+' '+n);
  const nav=[['overview',LayoutDashboard,t.overview],['posts',CalendarClock,t.posts],['followers',Users,t.followers],['activity',Activity,t.activity],['settings',Settings,t.settings]];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get('user');
    if (user) {
      setUsername(user);
    }
  }, []);

  const handleConnectX = () => {
    window.location.href = 'https://haider-inspect.onrender.com/api/auth/twitter';
  };

  const handlePostTweet = async () => {
    if (!post) {
      alert('يرجى كتابة نص المنشور أولاً');
      return;
    }
    
    try {
      const response = await fetch('https://haider-inspect.onrender.com/api/tweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: preview[0] || post }),
      });
      const data = await response.json();
      
      if (data.success) {
        alert('تم نشر التغريدة بنجاح على حسابك في X!');
        setSaved(true);
        setTimeout(()=>setSaved(false), 4000);
      } else {
        if (data.error && data.error.includes("تسجيل الدخول")) {
          alert("انتهت الجلسة، جاري إعادة تحويلك للتفويض...");
          handleConnectX();
        } else {
          alert('حدث خطأ أثناء النشر: ' + data.error);
        }
      }
    } catch (error) {
      console.error('Error posting tweet:', error);
      alert('فشل الاتصال بالسيرفر، تأكد من التفويض');
    }
  };

  return <div className="app" dir={t.dir}>
   <aside className={`sidebar ${mobile?'open':''}`}><div className="brand"><div className="mark">X</div><div><b>{t.brand}</b><small>{t.tag}</small></div></div><button className="mobile-close" onClick={()=>setMobile(false)}><X/></button>
    <div className="nav-label">{t.overview}</div>{nav.map(([id,Icon,label])=><button key={id} className={`nav ${section===id?'active':''}`} onClick={()=>{setSection(id);setMobile(false)}}><Icon size={18}/><span>{label}</span></button>)}
    <div className="sidebar-bottom"><div className="secure"><ShieldCheck size={18}/><span>{t.notice}</span></div><div className="profile"><div className="avatar">{username ? username[0].toUpperCase() : 'H'}</div><div><b>{username ? `@${username}` : t.brand}</b><small>{username ? t.connected : t.notConnected}</small></div></div></div>
   </aside>
   {mobile&&<div className="scrim" onClick={()=>setMobile(false)}/>}
   <main className="main"><header><button className="menu" onClick={()=>setMobile(true)}><Menu/></button><div className="crumb">{t.brand}<span>/</span>{nav.find(n=>n[0]===section)?.[2]}</div><div className="head-actions"><label className="lang"><Globe2 size={16}/><select value={lang} onChange={e=>setLang(e.target.value)} aria-label={t.language}><option value="ar">{t.arabic}</option><option value="en">{t.english}</option><option value="ru">{t.russian}</option></select></label><div className="status"><i/>{username ? `@${username}` : t.notConnected}</div></div></header>
    {section==='overview'&&<><section className="hero"><div><span className="eyebrow">X · SOCIAL WORKSPACE</span><h1>{t.welcome}</h1><p>{t.subtitle}</p><button className="primary" onClick={handleConnectX}> <X size={18}/>{username ? `حساب متصل (${username})` : t.connect}</button></div><div className="hero-orb">X<span>711</span></div></section><section className="stats"><Stat icon={Users} label={t.followersN} value="—"/><Stat icon={ArrowLeftRight} label={t.following} value="—"/><Stat icon={MessageSquareText} label={t.postsN} value="—"/></section><section className="grid"><div className="panel wide"><div className="panel-title"><div><h2>{t.composer}</h2><p>{t.sample}</p></div><CalendarClock/></div><Composer t={t} post={post} setPost={setPost} start={start} setStart={setStart} end={end} setEnd={setEnd} step={step} setStep={setStep} interval={interval} setInterval={setInterval} preview={preview} onSave={handlePostTweet} saved={saved}/></div><div className="panel"><div className="panel-title"><h2>{t.connect}</h2><ShieldCheck/></div><p className="muted">{t.connectHint}</p><button className="outline" onClick={handleConnectX}><X size={17}/>{t.login}</button><div className="note">{t.notice}</div></div></section></>}
    {section==='posts'&&<section className="panel standalone"><h2>{t.composer}</h2><Composer t={t} post={post} setPost={setPost} start={start} setStart={setStart} end={end} setEnd={setEnd} step={step} setStep={setStep} interval={interval} setInterval={setInterval} preview={preview} onSave={handlePostTweet} saved={saved}/></section>}
    {section==='followers'&&<section className="panel standalone"><h2>{t.manual}</h2><p className="muted">{t.manualHint}</p><div className="empty"><Users size={32}/><b>{username ? `@${username}` : t.notConnected}</b><span>{t.connectHint}</span></div></section>}
    {section==='activity'&&<section className="panel standalone"><h2>{t.activity}</h2><div className="empty"><Activity size={32}/>{t.empty}</div></section>}
    {section==='settings'&&<section className="panel standalone"><h2>{t.connect}</h2><p className="muted">{t.connectHint}</p><div className="connect-box"><div className="xlarge">X</div><div><b>{username ? `@${username}` : t.notConnected}</b><p className="muted">{t.notice}</p></div></div><button className="outline" onClick={handleConnectX}><X size={18}/>{t.login}</button></section>}
    <footer>© 2026 {t.brand} <span>•</span> Private workspace prototype</footer>
   </main>
  </div>
}
function Stat({icon:Icon,label,value}){return <div className="stat"><div className="stat-icon"><Icon size={20}/></div><div><small>{label}</small><strong>{value}</strong></div><span className="stat-dash">—</span></div>}
function Composer({t,post,setPost,start,setStart,end,setEnd,step,setStep,interval,setInterval,preview,onSave,saved}){return <div className="composer"><label>{t.text}</label><textarea value={post} onChange={e=>setPost(e.target.value)} placeholder={t.placeholder}/><div className="fields"><Field label={t.start} value={start} set={setStart}/><Field label={t.end} value={end} set={setEnd}/><Field label={t.step} value={step} set={setStep}/><Field label={t.interval} value={interval} set={setInterval}/></div><div className="preview-head"><b>{t.preview}</b><span>{preview.length} posts · {interval} min</span></div><div className="preview-list">{preview.map((p,i)=><div className="preview-row" key={i}><span>{i+1}</span><p>{p}</p></div>)}</div><button className="primary" onClick={onSave}>{t.schedule}</button>{saved&&<span className="saved">{t.saved}</span>}</div>}
function Field({label,value,set}){return <label className="field">{label}<input type="number" value={value} onChange={e=>set(e.target.value)}/></label>}
createRoot(document.getElementById('root')).render(<App/>);