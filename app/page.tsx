'use client';

import { Fragment, useState } from 'react';

const story = [
  "Hey, my name is Angel and I was born in Venezuela in 1996.",
  "Since I was a child I've loved computers. I got my first computer when I was about 10 years old and it changed my life.",
  "I developed plugins and mods for my favorite videogames, watched hundreds of pirated movies, and read hundreds of Wikipedia pages. But it was only entertainment and curiosity.",
  "Soon enough, I had to earn a living to keep it going. I started working when I was 14 making hamburger patties with my Italian uncle. My second job was making hot dogs and burgers at his food kiosk when I was about 17.",
  "Then I decided that wasn't the job I wanted to do for the rest of my life. While I was studying Modern Languages in college, I found I could make money on the internet. And that's when I discovered the endless opportunities online.",
  "After searching frenetically for opportunities, I found something cool: you didn't have to join scams or pyramid schemes to make money, you could actually SELL YOUR SKILLS.",
  "That's when my reading and writing hobby became more useful. A few months in, I got my first online gig writing an SEO blog post for a gambling website (not proud of that, but I was desperate at the moment, what can I say). It was a success.",
  "I made more money on that gig than I made cooking for my uncle in a month. So I couldn't stop...",
  "Months later I had enough work to be able to hire other people to help me. I was literally running an agency by myself. A nameless agency, but it was working. I went from making $30 a month cooking for my uncle, to making over $2k a month writing online.",
  "That was enough to update my ambitions. I could live in almost any other country by that time. And sure enough, 2 years later I made enough money to be able to move out of my home country.",
  "So I did.",
  "By that point I had already been working as a content writer and copywriter for about 4 years and was making enough money to sustain a life in a country that was SUBSTANTIALLY more expensive than where I came from.",
  "But even though the money was good, I wasn't enjoying the work as much anymore. Not only because I knew I didn't want to keep doing this for the rest of my life, but also because I knew there were more opportunities out there.",
  "So I decided to make the BIGGEST jump. I started learning how to code to become a developer.",
  "And that's where my life REALLY started...",
];

export default function Home() {
  const [storyOpen, setStoryOpen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);

  return (
    <main className="story-page">
      <article className="story" aria-label="Angel's story">
        <header className="intro">
          <h1>Hey, I’m Angel.<br />I like to build stuff. Usually from nothing to <em>something.</em></h1>
          <p className="intro-description">A developer and former Product Lead, born in Venezuela. Most recently, I built and launched APEX on iOS and Android as its sole engineer.</p>
        </header>
        <div className="intro-actions">
          <button type="button" aria-expanded={storyOpen} aria-controls="full-story" onClick={() => setStoryOpen(!storyOpen)}>
            {storyOpen ? 'HIDE MY STORY' : 'READ MY STORY'}
          </button>
          <a href="/Angel_Gomez_Mobile_Software_Engineer.pdf" target="_blank" rel="noopener noreferrer">CHECK MY RESUME</a>
          <button type="button" aria-expanded={overviewOpen} aria-controls="quick-overview" onClick={() => setOverviewOpen(!overviewOpen)}>
            WHAT I’VE BUILT
          </button>
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
              <p>Helped shape a trading product and led five engineers and one designer as the team reached $500M+ in trading volume.</p>
              <span className="work-detail">Engineering · UI/UX · Product strategy</span>
            </a>
          </div>
        </section>
        <div id="full-story" hidden={!storyOpen}>
        <div className="reading-progress" aria-hidden="true" />
        <h2 className="chapter">{story[0]}</h2>
        {story.slice(1).map((paragraph, index) => (
          <Fragment key={paragraph}>
            {index === 3 && <h2 className="chapter"><span>02 · 2017 — 2021</span>Making a living online</h2>}
            <p key={paragraph} className={paragraph === 'So I did.' || paragraph === "And that's where my life REALLY started..." ? 'turning-point' : undefined}>
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

      <a
        className="surprise-button"
        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Click for a surprise"
      >
        click for a surprise
      </a>
    </main>
  );
}
