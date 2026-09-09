'use client';

import { Fragment, useState } from 'react';

const story = [
  "Hey, my name is Angel and I was born in Venezuela in 1996.",
  "Since I was a child I've loved computers. I got my first computer when I was about 10 years old and it changed my life.",
  "I developed plugins and mods for my favorite videogames, watched thousands of movies, and read hundreds of Wikipedia pages. My curiosity led to learning about ANYTHING I could land my hands on.",
  "But it wasn't only curiosity. I did it for a purpose. I wanted to learn more about the world around me. Sadly, I couldn't ONLY do that with my life...",
  "Mostly because I started working at 14, making hamburger patties with my Italian uncle and later cooking at his food kiosk. So I couldn't spend all my time on the computer.",
  "Eventually, I decided that wasn't the job I wanted to do for the rest of my life. While studying Modern Languages in college, I started looking for ways to earn a living online.",
  "After searching frenetically for opportunities, I found something cool: you didn't have to join scams or pyramid schemes to make money, you could actually SELL YOUR SKILLS.",
  "In 2017, my reading and writing hobby became my first online gig: a paid SEO article. It worked, and I kept going.",
  "After hundreds of articles, blog posts and landing pages, the work grew so much that I had to hire other writers to help me. Without really planning it, I'd built a small writing agency. I went from making $30 a month cooking for my uncle to over $2k a month writing online.",
  "Moving abroad started to feel possible. Eventually, I saved enough to leave Venezuela.",
  "So I did.",
  "Writing supported my life in a country that was SUBSTANTIALLY more expensive than where I came from. It remained my work until 2021.",
  "But I wanted more. Making plugins and mods for videogames had given me a glimpse of what I could do with software. Even though I'd barely known what I was doing back then, I felt I had a talent for it.",
  "So, while I was still writing, I started learning how to code. I was ready to make the BIGGEST jump yet and become a software engineer.",
  "And this is where EVERYTHING changed...",
];

export default function Home() {
  const [openSection, setOpenSection] = useState<'story' | 'overview' | null>(null);
  const storyOpen = openSection === 'story';
  const overviewOpen = openSection === 'overview';

  return (
    <main className="story-page">
      <article className="story" aria-label="Angel's story">
        <header className="intro">
          <h1><span className="greeting"><img className="portrait" src="/angel.png" alt="Angel Gomez" width={90} height={90} /> <span>Hey, I’m Angel.</span></span>I like to build stuff. Usually from nothing to <em>something.</em></h1>
          <p className="intro-description">A developer and former Product Lead, born in Venezuela. Most recently, I built and launched <a href="https://www.apexfitness.app" target="_blank" rel="noopener noreferrer">APEX</a> on <a href="https://apps.apple.com/us/app/apex-lifting-and-diet-coach/id6760598647" target="_blank" rel="noopener noreferrer">iOS</a> and <a href="https://play.google.com/store/apps/details?id=app.apexfitness.apex" target="_blank" rel="noopener noreferrer">Android</a> as its sole engineer.</p>
        </header>
        <div className="intro-actions">
          <button type="button" aria-expanded={storyOpen} aria-controls="full-story" onClick={() => setOpenSection(storyOpen ? null : 'story')}>
            {storyOpen ? 'HIDE MY STORY' : 'READ MY STORY'}
          </button>
          <button type="button" aria-expanded={overviewOpen} aria-controls="quick-overview" onClick={() => setOpenSection(overviewOpen ? null : 'overview')}>
            WHAT I’VE BUILT
          </button>
          <a href="/Angel_Gomez_Mobile_Software_Engineer.pdf" target="_blank" rel="noopener noreferrer">CHECK MY RESUME</a>
        </div>
        <div className="availability"><span>Open to engineering roles</span><a href="mailto:ajgcdev@gmail.com" target="_blank" rel="noopener noreferrer">Let’s talk ↗</a></div>
        <section id="quick-overview" className="selected-work" aria-label="What I've built" hidden={!overviewOpen}>
          <div className="work-grid">
            <a className="work-card" href="https://www.apexfitness.app" target="_blank" rel="noopener noreferrer">
              <span className="eyebrow">2025 — PRESENT · SOLO ENGINEER</span>
              <h3>APEX <span aria-hidden="true">↗</span></h3>
              <p>AI fitness and nutrition coaching. From product design to the backend, built and launched on iOS and Android.</p>
              <span className="work-detail">React Native · Expo · TypeScript</span>
            </a>
            <a className="work-card" href="https://pear.garden" target="_blank" rel="noopener noreferrer">
              <span className="eyebrow">2022 — 2024 · FOUNDING ENGINEER → PRODUCT LEAD</span>
              <h3>Pear Protocol <span aria-hidden="true">↗</span></h3>
              <p>Helped shape a trading product and led five engineers and one designer. Together, we reached $500M in trading volume and over 1,000 users. I also helped raise $3M in capital.</p>
              <span className="work-detail">Engineering · UI/UX · Product strategy</span>
            </a>
          </div>
        </section>
        <div id="full-story" hidden={!storyOpen}>
        <div className="reading-progress" aria-hidden="true" />
        <h2 className="chapter">{story[0]}</h2>
        {story.slice(1).map((paragraph, index) => (
          <Fragment key={paragraph}>
            {index === 5 && <h2 className="chapter"><span>02 · 2017 — 2021</span>Making a living online</h2>}
            <p key={paragraph} className={paragraph === 'So I did.' || paragraph === "And this is where EVERYTHING changed..." ? 'turning-point' : undefined}>
              {paragraph.includes('SELL YOUR SKILLS') ? (
                <>
                  {paragraph.split('SELL YOUR SKILLS')[0]}
                  <a href="https://www.freelancer.com/u/angelgomez33" target="_blank" rel="noopener noreferrer">SELL YOUR SKILLS</a>
                  {paragraph.split('SELL YOUR SKILLS')[1]}
                </>
              ) : paragraph}
            </p>
          </Fragment>
          ))}
        <h2 className="chapter"><span>03 · 2021 — 2024</span>Building with a team</h2>
        <p>
          My first job as a coder was at <a href="https://reimagined.fi/" target="_blank" rel="noopener noreferrer">Reimagined Finance</a>.
          {' '}After a year of learning how to code, I landed a front-end gig and took ownership of the entire front end for a now-dead project that was pretty neat when it was alive.
        </p>
        <p>
          I worked there for a year, from November 2021 to November 2022. When ReFi came to an end, the founders and I decided to launch a new project: <a href="https://pear.garden" target="_blank" rel="noopener noreferrer">Pear Protocol</a>.
        </p>
        <p>
          I joined Pear as a founding engineer and Lead Developer, then eventually took on the Product Lead role. I stayed until November 2024.
        </p>
        <p>
          Those three years were some of the most productive of my life. I went from coding interfaces to planning the entire UI/UX and helping shape a product I was proud of. Along the way, I led a team of five engineers and one designer.
        </p>
        <p>
          During my time at Pear, we reached more than 1,000 users, generated over $500,000 in revenue on more than $500 million in trading volume, and raised over $3 million to keep the project going.
        </p>
        <p>
          I learned as much as I could, both by diving headfirst into the work and from my coworkers (some of the smartest people I&apos;ve ever met).
        </p>
        <p>
          But while it was great, I knew I wanted to do something more. Crypto and Pear gave me the confidence to think bigger. Eventually, I wanted to build something of my own.
        </p>
        <p className="turning-point">That&apos;s when APEX was born...</p>
        <h2 className="chapter"><span>04 · 2025 — PRESENT</span>Building something of my own</h2>
        <p>
          APEX was completely different from what I’d done at Pear. This time, I was working by myself. And I was stepping into something new: mobile development.
        </p>
        <p>
          The closest I’d come was making websites work on smaller screens. Building an app felt like a massive undertaking, especially because I wanted to turn it into a product people would pay for.
        </p>
        <p>
          I had the confidence, but there was a lot I still needed to learn. So, once again, I took a chance on an idea and started figuring out how to turn it into a business.
        </p>
        <p>
          <a href="https://www.apexfitness.app" target="_blank" rel="noopener noreferrer">APEX Lifting and Diet Coach</a> became my WHOLE life. Nothing else I’ve built has come close to that level of personal investment.
        </p>
        <p>
          I went from never having built a mobile app to launching on iOS and Android and getting hundreds of installs in a month. I handled everything from the design and code to the website and launch.
        </p>
        <p>
          Along the way, I learned how to turn LLMs and AI services into tools people could actually use to plan their training and nutrition.
        </p>
        <p>
          I even started an Instagram account for it, where I consistently post fitness content. As of September 2026, it has more than 1,800 followers.
        </p>
        <h2 className="chapter"><span>05 · WHAT’S NEXT</span>Still curious.</h2>
        <p>
          Now I’m looking for my next role. Building APEX taught me how much I can do on my own, but my time at Pear showed me how much I can learn and accomplish with a good team.
        </p>
        <p>
          I want to bring both experiences into whatever comes next: building useful products, taking responsibility for the work, and learning from people who care about what they’re making.
        </p>
        <p className="story-ending">
          I’m still the same kid who got his first computer and wanted to figure everything out. Now I have the chance to build some of it.
        </p>
        </div>
        <footer className="social-footer">
          <h2>You can find me at</h2>
          <div className="social-links">
            <a href="https://www.x.com/4gnle" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.835L0 1.154h7.594l5.243 6.932 6.064-6.933Zm-1.29 19.49h2.039L6.487 3.24H4.3l13.31 17.403Z" /></svg>
              X / Twitter <span aria-hidden="true">↗</span>
            </a>
            <a href="https://www.instagram.com/4gnlefitness" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              Instagram <span aria-hidden="true">↗</span>
            </a>
          </div>
        </footer>
      </article>
    </main>
  );
}
