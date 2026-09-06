const story = [
  "Hey, my name is Angel and I was born in Venezuela in 1996.",
  "Since I was a child I've loved computers. I got my first computer when I was about 10 years old and it changed my life.",
  "I developed plugins and mods for my favorite videogames, watched hundreds of pirated movies, and read hundreds of Wikipedia pages. But it was only entertainment and curiosity.",
  "Soon enough, I had to earn a living to keep it going. I started working when I was 14 making hamburger paties with my Italian uncle. My second job was making hot dogs and burgers at his food kiosk when I was about 17.",
  "Then I decided that wasn't the job I wanted to do for the rest of my life. While I was studying Modern Languages in college, I found I could make money on the internet. And that's when I discovered the endless opportunities online.",
  "After searching frenetically for opportunities to earn online, I found something cool: you didn't have to join scams or pyramid schemes to make money, you could actually SELL YOUR SKILLS.",
  "That's when my reading and writing hobby became more useful. A few months in, I got my first online gig writing a SEO blog post for a gambling website (not proud of that, but I was desperate at the moment, what can I say). It was a success.",
  "I made more money on that gig that I made cooking for my uncle in a month. So I couldn't stop...",
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
            <p key={paragraph} className={paragraph === 'So I did.' ? 'turning-point' : undefined}>
              {paragraph}
            </p>
          ),
        )}
      </article>

      <a
        className="surprise-button"
        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        aria-label="Click for a surprise"
      >
        click for a surprise
      </a>
    </main>
  );
}
