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
  return (
    <main className="story-page">
      <article className="story" aria-label="Angel's story">
        {story.map((paragraph, index) =>
          index === 0 ? (
            <h1 key={paragraph}>{paragraph}</h1>
          ) : (
            <p key={paragraph} className={paragraph === 'So I did.' || paragraph === "And that's where my life REALLY started..." ? 'turning-point' : undefined}>
              {paragraph}
            </p>
          ),
        )}
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
        <p>
          Now I’m looking for my next role. Building APEX taught me how much I can do on my own, but my time at Pear showed me how much I can learn and accomplish with a good team.
        </p>
        <p>
          I want to bring both experiences into whatever comes next: building useful products, taking responsibility for the work, and learning from people who care about what they’re making.
        </p>
        <p>
          I’m still the same kid who got his first computer and wanted to figure everything out. Now I have the chance to build some of it.
        </p>
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
