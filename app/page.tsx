'use client';

import { useEffect, useState } from 'react';

type Phase = 'ready' | 'erasing' | 'loading' | 'done';
const welcome = "yo what's up";
const instruction = 'ask a question';
const loadingWords = [
  'loading...', 'thinking...', 'wait a few seconds...', 'cargando...', 'pensando...', 'espera unos segundos...',
  'chargement...', 'réflexion...', 'attendez quelques secondes...', 'laden...', 'denke nach...', 'warte ein paar Sekunden...',
  'caricamento...', 'sto pensando...', 'aspetta qualche secondo...', 'carregando...', 'pensando...', 'espere alguns segundos...',
  '読み込み中...', '考え中...', '数秒お待ちください...', '読み込み...', '생각 중...', '잠시만 기다려 주세요...',
  '加载中...', '思考中...', '请稍等几秒...', 'загрузка...', 'думаю...', 'подождите несколько секунд...',
  'betöltés...', 'gondolkodom...', 'várj néhány másodpercet...', 'indlæser...', 'tænker...', 'vent et par sekunder...',
  'laster...', 'tenker...', 'vent noen sekunder...', 'laddar...', 'tänker...', 'vänta några sekunder...',
  'ladataan...', 'mietin...', 'odota hetki...', 'indlæser...', 'jeg tænker...', 'vent lidt...',
  'bezig met laden...', 'ik denk na...', 'wacht een paar seconden...', 'carregant...', 'pensant...', 'espera uns segons...',
  'cargando...', 'estoy pensando...', 'espera unos segundos...', 'muirir...', 'ag smaoineamh...', 'fan cúpla soicind...',
  'טעינה...', 'חושב...', 'חכה כמה שניות...', 'تحميل...', 'أفكر...', 'انتظر بضع ثوانٍ...',
  'लोड हो रहा है...', 'सोच रहा हूँ...', 'कुछ सेकंड प्रतीक्षा करें...', 'yükleniyor...', 'düşünüyorum...', 'birkaç saniye bekle...',
  'yükleniyor...', 'düşünüyorum...', 'birkaç saniye bekleyin...', 'carregando...', 'pensando...', 'espere alguns segundos...',
  'memuat...', 'sedang berpikir...', 'tunggu beberapa detik...', 'กำลังโหลด...', 'กำลังคิด...', 'รอสักครู่...',
  'กำลังโหลด...', 'คิดอยู่...', 'รออีกสักครู่...', 'กำลังโหลด...', 'กำลังคิด...', 'อีกไม่กี่วินาที...',
  'লোড হচ্ছে...', 'ভাবছি...', 'কয়েক সেকেন্ড অপেক্ষা করুন...', 'লোড হচ্ছে...', 'ভাবছি...', 'অপেক্ষা করুন...',
  'loading...', 'thinking...', 'wait a few seconds...', 'almost there...', 'one moment...', 'just a sec...',
  'processing...', 'working on it...', 'hold tight...', 'nearly ready...',
];

export default function Home() {
  const [written, setWritten] = useState(welcome);
  const [question, setQuestion] = useState('');
  const [phase, setPhase] = useState<Phase>('ready');
  const [remaining, setRemaining] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true);
      return;
    }
    setWritten('');
    let index = 0;
    const timer = window.setInterval(() => {
      setWritten(welcome.slice(0, ++index));
      if (index >= welcome.length) window.clearInterval(timer);
    }, 65);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (phase === 'erasing') {
      const total = welcome.length + instruction.length + question.trim().length;
      const started = performance.now();
      const timer = window.setInterval(() => {
        const left = Math.max(0, Math.ceil(total * (1 - (performance.now() - started) / 1600)));
        setRemaining(left);
        if (!left) setPhase('loading');
      }, 25);
      return () => window.clearInterval(timer);
    }
    if (phase === 'loading') {
      const timer = window.setTimeout(() => setPhase('done'), 5000);
      return () => window.clearTimeout(timer);
    }
  }, [phase, question]);

  function sendQuestion() {
    if (phase !== 'ready' || !question.trim()) return;
    setRemaining(welcome.length + instruction.length + question.trim().length);
    setPhase(reducedMotion ? 'loading' : 'erasing');
  }

  if (phase === 'loading') {
    return <main className={`loading-screen ${reducedMotion ? 'reduced' : ''}`} aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading, thinking, wait a few seconds.</span>
      {loadingWords.map((word, index) => <span className="loading-word" aria-hidden="true" key={`${word}-${index}`} style={{ left: `${(index * 37) % 93}%`, top: `${(index * 61) % 91}%`, animationDelay: `${(index % 17) * -0.18}s` }}>{word}</span>)}
    </main>;
  }

  if (phase === 'done') {
    return <main className="ending" aria-live="polite"><div className="final-content"><h1 className="final-message">ok click below</h1><a className="video-button" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">click here</a></div></main>;
  }

  return (
    <main className="terminal">
      <section className="console" aria-label="Ask a question" aria-busy={phase === 'erasing'}>
        <h1 aria-label={phase === 'ready' ? welcome : 'Clearing terminal'}><span aria-hidden="true">{phase === 'ready' ? written : welcome.slice(0, remaining)}</span>{phase === 'ready' && <span className="cursor" aria-hidden="true">▌</span>}</h1>
        <p id="question-instruction">{phase === 'ready' ? instruction : instruction.slice(0, Math.max(0, remaining - welcome.length))}</p>
        {phase === 'ready' ? <form onSubmit={(event) => {event.preventDefault(); sendQuestion();}}>
          <input aria-label="Your question" aria-describedby="question-instruction" placeholder="type here..." value={question} onChange={(event) => setQuestion(event.target.value)} autoComplete="off" maxLength={2000} required enterKeyHint="send" />
          <button type="submit" aria-label="Send question" disabled={!question.trim()}>enter ↵</button>
        </form> : <div className="sent-question">{question.trim().slice(0, Math.max(0, remaining - welcome.length - instruction.length))}</div>}
      </section>
    </main>
  );
}
