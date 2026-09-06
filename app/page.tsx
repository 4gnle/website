'use client';

import { useEffect, useState } from 'react';

const welcome = 'Hello, stranger.\nWhat’s on your mind?';

export default function Home() {
  const [written, setWritten] = useState(welcome);
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState('');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setWritten('');
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setWritten(welcome.slice(0, index));
      if (index >= welcome.length) window.clearInterval(timer);
    }, 45);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="terminal">
      <header className="topbar">
        <span className="identity"><span className="terminal-icon" aria-hidden="true">&gt;_</span> ask.exe</span>
        <span className="edition">a space for curiosity</span>
      </header>
      <section className="console" aria-label="Question terminal">
        <p className="command"><span className="path">C:\\visitor&gt;</span> start conversation</p>
        <p className="system">Welcome. No commands to learn. Just words.</p>
        <h1 aria-label={welcome}><span aria-hidden="true">{written}</span><span className="cursor" aria-hidden="true">▌</span></h1>
        <p className="invitation" id="question-instruction">Ask a question. Start anywhere.</p>
        {submitted && <div className="transcript" role="status"><p><span className="path">&gt;</span> {submitted}</p><p className="system">This terminal is a preview. Answers aren’t connected yet.</p></div>}
        <form onSubmit={(event) => {event.preventDefault(); if(question.trim()) {setSubmitted(question.trim()); setQuestion('');}}}>
          <label className="input-row">
            <span className="prompt" aria-hidden="true">&gt;</span>
            <input aria-label="Your question" aria-describedby="question-instruction" placeholder="Type your question here..." value={question} onChange={(event) => setQuestion(event.target.value)} autoComplete="off" maxLength={2000} />
            <button type="submit" aria-label="Enter question" disabled={!question.trim()}>enter <span aria-hidden="true">↵</span></button>
          </label>
        </form>
        <p className="hint">Press Enter when you’re ready.</p>
      </section>
      <footer><span><span className="status-dot" aria-hidden="true" /> awaiting your curiosity</span><span>no wrong questions.</span></footer>
    </main>
  );
}
