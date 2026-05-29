import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LILY_PARTICLES = ['🌸', '🌺', '🌼', '🌷', '🌻', '💐', '🌸', '🌺'];

function FadeInSection({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const heroRef = useRef(null);
  const particlesRef = useRef([]);

  // Floating particles
  useEffect(() => {
    const particles = particlesRef.current;
    particles.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50,
        scale: 0.6 + Math.random() * 0.8,
        opacity: 0,
      });
      gsap.to(el, {
        y: -100,
        x: `+=${(Math.random() - 0.5) * 200}`,
        opacity: 0.8,
        duration: 6 + Math.random() * 4,
        delay: i * 0.7,
        repeat: -1,
        ease: 'none',
        yoyo: false,
        onRepeat: () => {
          gsap.set(el, { y: window.innerHeight + 50, x: Math.random() * window.innerWidth, opacity: 0 });
        }
      });
    });
    return () => {
      particles.forEach(el => el && gsap.killTweensOf(el));
    };
  }, []);

  const STEPS = [
    { icon: '🌰', title: 'Pick a hobby', desc: 'Type anything — "I want to feel creative", "something calming at night". AI understands your vibe.' },
    { icon: '🌱', title: 'Get your path', desc: 'AI builds a custom 10-step learning journey tailored exactly to where you are.' },
    { icon: '🪴', title: 'Grow your garden', desc: 'Complete tasks and watch your lily bloom — from tiny seed to radiant full bloom.' },
    { icon: '🌺', title: 'Find your people', desc: 'A community of honest learners. No highlight reels. Just real progress and raw reactions.' },
    { icon: '🌸', title: 'Help others bloom', desc: 'Become a mentor. Share your journey. Grow your Bloomometer and lift others.' },
  ];

  const FEATURES = [
    {
      icon: '🧠',
      title: 'AI-Powered Learning Paths',
      desc: 'Not generic tutorials — personalized 10-step journeys that adapt to your pace, schedule, and learning style.',
      color: 'var(--blue-pale)',
      border: 'var(--blue-soft)',
    },
    {
      icon: '🌸',
      title: 'The Bloom Journey',
      desc: 'Seed → Sprout → Bud → Bloom → Full Bloom. Every hobby grows visually as you progress.',
      color: 'var(--brown-pale)',
      border: 'var(--brown-light)',
    },
    {
      icon: '🤝',
      title: 'Honest Community',
      desc: 'Raw videos, real reactions, no filters. A community that celebrates "worst days" as much as best ones.',
      color: 'var(--gold-pale)',
      border: 'var(--gold-light)',
    },
  ];

  const TESTIMONIALS = [
    {
      initials: 'AM', name: 'Aditi M.', hobby: 'Watercolor Painting',
      quote: "I tried 4 apps before HobbyLily. They all made me feel behind. Here, I posted my worst painting and got the most encouraging responses I've ever seen.",
      color: '#A8C4D4',
    },
    {
      initials: 'RS', name: 'Rohan S.', hobby: 'Guitar',
      quote: "The AI path actually understood I only have 20 minutes a day. It didn't push me to practice 2 hours. My lily is at Bud stage after 3 weeks!",
      color: '#C9920A',
    },
    {
      initials: 'JK', name: 'Jamie K.', hobby: 'Sourdough Baking',
      quote: "I love that there are no follower counts. I'm not performing. I'm actually learning. My bread went from hockey puck to genuinely edible.",
      color: '#A67C5B',
    },
  ];

  const MANIFESTO = [
    'No likes. Only reactions that mean something.',
    'No follower counts. You\'re finding your people.',
    'No algorithm pushing perfection.',
    'Progress over polish. Consistency beats talent.',
  ];

  return (
    <div style={{ background: 'var(--cream)', overflowX: 'hidden' }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 2rem',
        background: 'rgba(250, 248, 240, 0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.jpg" alt="HobbyLily" style={{ height: '36px', borderRadius: '8px' }} />
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/login" style={{ color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 500, fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>
            Sign in
          </Link>
          <Link to="/signup" className="btn btn-primary btn-sm">Start Growing →</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingTop: '64px',
        background: 'linear-gradient(160deg, var(--cream) 0%, var(--brown-pale) 50%, var(--cream-dark) 100%)',
      }}>
        {/* Floating lily particles */}
        {LILY_PARTICLES.map((emoji, i) => (
          <div
            key={i}
            ref={el => particlesRef.current[i] = el}
            style={{ position: 'absolute', fontSize: '2rem', pointerEvents: 'none', zIndex: 1, userSelect: 'none' }}
          >
            {emoji}
          </div>
        ))}

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '780px', padding: '0 2rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ marginBottom: '1.5rem' }}
          >
            <img src="/logo.jpg" alt="HobbyLily Logo" style={{ width: '100px', borderRadius: '20px', boxShadow: '0 8px 32px rgba(107,66,38,0.2)' }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
              fontWeight: 700,
              color: 'var(--ink)',
              marginBottom: '1.2rem',
              lineHeight: 1.15,
            }}
          >
            Your hobby deserves<br />
            <em style={{ color: 'var(--brown-coffee)' }}>a garden.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: 'var(--ink-soft)',
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.7,
              fontFamily: 'var(--font-body)',
            }}
          >
            Instagram shows you everyone's best day and makes you feel behind.{' '}
            <strong style={{ color: 'var(--brown-coffee)' }}>HobbyLily</strong> shows you everyone's worst day — and makes you feel brave enough to start yours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/signup" className="btn btn-primary">Start Growing →</Link>
            <a href="#how-it-works" className="btn btn-ghost">See how it works</a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            style={{
              marginTop: '3.5rem',
              display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap',
            }}
          >
            {[['🌸', '12,400+', 'Gardeners'], ['🌺', '94,000+', 'Tasks Done'], ['⭐', '4.9/5', 'Community Love']].map(([icon, val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem' }}>{icon}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)' }}>{val}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2,
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', letterSpacing: '0.1em', fontFamily: 'var(--font-body)' }}>SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '1.2rem' }}
          >↓</motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" style={{ padding: '7rem 2rem', background: 'var(--white)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <FadeInSection>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', letterSpacing: '0.15em', color: 'var(--brown-light)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              How It Works
            </p>
            <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--ink)', marginBottom: '4rem' }}>
              Five steps to your first bloom
            </h2>
          </FadeInSection>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {STEPS.map((step, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div style={{
                  display: 'flex', gap: '2rem', alignItems: 'flex-start', padding: '1.5rem 0',
                  borderBottom: i < STEPS.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '16px', flexShrink: 0,
                    background: 'var(--brown-pale)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                  }}>
                    {step.icon}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.78rem', color: 'var(--gold)', letterSpacing: '0.1em' }}>STEP {i + 1}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--ink)', marginBottom: '6px' }}>{step.title}</h3>
                    <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>{step.desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '7rem 2rem', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FadeInSection>
            <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--ink)', marginBottom: '1rem' }}>
              Everything you need to actually grow
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--ink-muted)', marginBottom: '3.5rem', fontFamily: 'var(--font-body)', fontSize: '1.05rem' }}>
              Not just another app. A whole philosophy of learning.
            </p>
          </FadeInSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map((f, i) => (
              <FadeInSection key={i} delay={i * 0.12}>
                <div className="card card-lift" style={{
                  padding: '2rem',
                  background: f.color,
                  border: `1.5px solid ${f.border}30`,
                  cursor: 'default',
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--ink)', marginBottom: '0.75rem' }}>{f.title}</h3>
                  <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>{f.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section style={{ padding: '7rem 2rem', background: 'var(--white)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FadeInSection>
            <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--ink)', marginBottom: '0.75rem' }}>
              Real gardeners, real growth
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--ink-muted)', marginBottom: '3.5rem', fontFamily: 'var(--font-body)' }}>
              No paid testimonials. Just honest learners sharing their journey.
            </p>
          </FadeInSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {TESTIMONIALS.map((t, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div className="card" style={{ padding: '1.75rem', position: 'relative' }}>
                  <div style={{
                    position: 'absolute', top: '1.25rem', right: '1.5rem',
                    fontFamily: 'Georgia', fontSize: '3.5rem', lineHeight: 1,
                    color: 'var(--gold)', opacity: 0.25,
                  }}>"</div>
                  <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontFamily: 'var(--font-body)', marginBottom: '1.25rem', fontStyle: 'italic' }}>
                    "{t.quote}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: t.color, color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-body)',
                    }}>{t.initials}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>{t.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>Learning {t.hobby}</div>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Manifesto ── */}
      <section style={{
        padding: '7rem 2rem',
        background: 'linear-gradient(135deg, var(--cream-dark), var(--brown-pale))',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <FadeInSection>
            <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🌿</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: 'var(--ink)', marginBottom: '2.5rem' }}>
              The HobbyLily Manifesto
            </h2>
          </FadeInSection>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {MANIFESTO.map((line, i) => (
              <FadeInSection key={i} delay={i * 0.15}>
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                  fontStyle: 'italic',
                  color: 'var(--ink-soft)',
                  padding: '1rem 1.5rem',
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                }}>
                  {line}
                </p>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: '7rem 2rem', background: 'var(--white)', textAlign: 'center' }}>
        <FadeInSection>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌸</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--ink)', marginBottom: '1rem' }}>
            Ready to plant your first seed?
          </h2>
          <p style={{ color: 'var(--ink-muted)', marginBottom: '2.5rem', fontFamily: 'var(--font-body)', fontSize: '1.05rem' }}>
            Free to start. No credit card. Just you and your hobby.
          </p>
          <Link to="/signup" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '14px 36px' }}>
            Start Growing for Free →
          </Link>
        </FadeInSection>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: 'var(--ink)',
        padding: '3rem 2rem',
        color: 'var(--cream-dark)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <img src="/logo.jpg" alt="HobbyLily" style={{ height: '32px', borderRadius: '8px', opacity: 0.9 }} />
            </div>
            <p style={{ color: 'var(--ink-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>
              Grow. Together. Honestly. 🌸
            </p>
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {['About', 'Community', 'Blog'].map(link => (
              <span key={link} style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer' }}>
                {link}
              </span>
            ))}
          </div>
          <p style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-body)', fontSize: '0.78rem', width: '100%', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
            © 2026 HobbyLily. Made with 🌸 for learners everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}
