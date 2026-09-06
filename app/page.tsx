'use client';

import { useEffect, useState } from 'react';

type Phase = 'ready' | 'erasing' | 'black' | 'done';
const welcome = "yo what's up";
const instruction = 'ask a question';

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
        if (!left) setPhase('black');
      }, 25);
      return () => window.clearInterval(timer);
    }
    if (phase === 'black') {
      const timer = window.setTimeout(() => setPhase('done'), 4000);
      return () => window.clearTimeout(timer);
    }
  }, [phase, question]);

  function sendQuestion() {
    if (phase !== 'ready' || !question.trim()) return;
    setRemaining(welcome.length + instruction.length + question.trim().length);
    setPhase(reducedMotion ? 'black' : 'erasing');
  }

  if (phase === 'black' || phase === 'done') {
    return <main className="ending" aria-live="polite" aria-busy={phase === 'black'}>{phase === 'done' && <div className="final-content"><h1 className="final-message">ok click below</h1><a className="video-button" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">click here</a></div>}</main>;
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
