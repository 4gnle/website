"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";

const destination = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

export function Surprise() {
  const [seconds, setSeconds] = useState(2);
  const dialog = useRef<HTMLDialogElement>(null);
  const cleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    const cancel = () => cleanup.current?.();
    window.addEventListener("pagehide", cancel);
    return () => {
      window.removeEventListener("pagehide", cancel);
      cancel();
    };
  }, []);

  function startSurprise() {
    if (cleanup.current || !dialog.current) return;

    let cancelled = false;
    let context: AudioContext | undefined;
    let sound: AudioBufferSourceNode | undefined;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const previousOverflow = document.body.style.overflow;

    cleanup.current = () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      sound?.stop();
      if (context && context.state !== "closed") void context.close().catch(() => {});
      dialog.current?.close();
      document.body.style.overflow = previousOverflow;
      cleanup.current = null;
    };

    setSeconds(3);
    document.body.style.overflow = "hidden";
    dialog.current.showModal();

    // Unlock audio during the click, before the countdown consumes user activation.
    let audioReady: Promise<AudioBuffer | null> = Promise.resolve(null);
    try {
      const audioContext = new AudioContext();
      context = audioContext;
      const resumed = audioContext.resume();
      audioReady = Promise.all([
        resumed,
        fetch("/scary-sound.mp3")
          .then((response) => {
            if (!response.ok) throw new Error("Sound unavailable");
            return response.arrayBuffer();
          })
          .then((buffer) => audioContext.decodeAudioData(buffer)),
      ]).then(([, buffer]) => buffer).catch(() => null);
    } catch {
      // Continue with the image and redirect if audio is unavailable.
    }

    const face = new Image();
    face.src = "/scary-face.jpg";
    const imageReady = face.decode().catch(() => {});

    // Prepare the assets behind the overlay so the reveal and sound start together.
    void Promise.all([audioReady, imageReady]).then(([buffer]) => {
      if (cancelled) return;
      timers.push(setTimeout(() => setSeconds(2), 1000));
      timers.push(setTimeout(() => setSeconds(1), 2000));
      timers.push(setTimeout(() => {
        setSeconds(0);
        if (buffer && context) {
          sound = context.createBufferSource();
          sound.buffer = buffer;
          sound.loop = true;
          sound.connect(context.destination);
          sound.start();
          sound.stop(context.currentTime + 4);
        }
        timers.push(setTimeout(() => {
          cleanup.current?.();
          window.location.assign(destination);
        }, 4000));
      }, 3000));
    });
  }

  return (
    <>
      <button type="button" className="surprise-button" aria-haspopup="dialog" onClick={startSurprise}>
        <span className="surprise-click">CLICK</span><span className="surprise-tap">TAP</span>{" "}FOR A SURPRISE
      </button>
      <dialog ref={dialog} className="surprise-overlay" aria-label="Surprise" onCancel={() => cleanup.current?.()}>
        {seconds > 0 ? (
          <output className="surprise-countdown" aria-live="polite" aria-atomic="true">
            <span className="surprise-spinner" aria-hidden="true" />
            <p>Wait {seconds} {seconds === 1 ? "second" : "seconds"}…</p>
          </output>
        ) : (
          <NextImage className="surprise-face" src="/scary-face.jpg" alt="Scary face" fill unoptimized loading="eager" />
        )}
      </dialog>
    </>
  );
}
