import { useState, useEffect, useRef, useCallback } from 'react';

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const intervalRef = useRef(null);
  const sectionRef = useRef(null);

  const testimonials = [
    {
      text: "AquaFuture transformed our shrimp farm completely. The AI disease detection caught a white spot outbreak 3 days before visual symptoms appeared, saving us over $200,000 in potential losses. The ROI on this platform is extraordinary.",
      name: "Captain James Reyes",
      role: "CEO, Pacific Shrimp Co.",
      avatar: "JR",
    },
    {
      text: "We've increased our salmon production by 35% while reducing feed costs by 20%. The automated feeding system alone paid for the entire platform subscription in the first quarter. Absolutely game-changing technology.",
      name: "Dr. Sarah Lindström",
      role: "Director, Nordic Aqua Farms",
      avatar: "SL",
    },
    {
      text: "Managing 50+ oyster beds across three coastal sites used to be a logistics nightmare. AquaFuture's IoT sensors and centralized dashboard give us complete visibility. Our harvest quality has improved dramatically.",
      name: "Marcus Chen",
      role: "Founder, Pearl Coast Oysters",
      avatar: "MC",
    },
    {
      text: "The blockchain traceability feature has opened premium markets we never had access to before. Our lobsters now command 30% higher prices because buyers can verify our sustainable farming practices instantly.",
      name: "Isabella Rodriguez",
      role: "Operations Manager, Atlantic Seafarms",
      avatar: "IR",
    },
    {
      text: "As a seaweed farmer, I was skeptical about tech solutions. But AquaFuture's satellite monitoring and growth prediction models have made our harvesting 10x more efficient. We now supply three countries from a single farm.",
      name: "Takeshi Watanabe",
      role: "Owner, Green Ocean Seaweed",
      avatar: "TW",
    },
  ];

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % testimonials.length);
    }, 5000);
  }, [testimonials.length]);

  useEffect(() => {
    startAutoPlay();
    return () => clearInterval(intervalRef.current);
  }, [startAutoPlay]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = (index) => {
    setActive(index);
    startAutoPlay();
  };

  const prev = () => goTo((active - 1 + testimonials.length) % testimonials.length);
  const next = () => goTo((active + 1) % testimonials.length);

  return (
    <section className="testimonials" id="testimonials" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-badge">
            <span className="badge-dot"></span>
            Testimonials
          </div>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">
            Trusted by aqua farmers worldwide — hear how AquaFuture is 
            transforming their operations.
          </p>
        </div>

        <div className="testimonial-carousel reveal">
          <div className="testimonial-card" key={active}>
            <span className="testimonial-quote">"</span>
            <p className="testimonial-text">{testimonials[active].text}</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">{testimonials[active].avatar}</div>
              <div className="testimonial-author-info">
                <h4>{testimonials[active].name}</h4>
                <p>{testimonials[active].role}</p>
              </div>
            </div>
          </div>

          <div className="testimonial-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`testimonial-dot ${active === i ? 'active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <div className="testimonial-nav">
            <button className="testimonial-nav-btn" onClick={prev} aria-label="Previous testimonial">
              ←
            </button>
            <button className="testimonial-nav-btn" onClick={next} aria-label="Next testimonial">
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
