import { useEffect, useRef } from 'react';

export default function Pricing() {
  const sectionRef = useRef(null);

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

  const plans = [
    {
      icon: '🐠',
      name: 'Starter',
      desc: 'Perfect for small ponds and single-species farms',
      price: 49,
      featured: false,
      features: [
        'Up to 5 ponds/cages',
        'Basic water quality sensors',
        'Daily analytics reports',
        'Email alerts',
        'Species database access',
        'Community support',
      ],
    },
    {
      icon: '🦈',
      name: 'Professional',
      desc: 'For growing multi-species aquaculture operations',
      price: 149,
      featured: true,
      popular: true,
      features: [
        'Up to 50 ponds/cages',
        'Advanced IoT sensor suite',
        'Real-time AI monitoring',
        'Automated feeding control',
        'Disease prediction alerts',
        'Drone surveillance integration',
        'Priority 24/7 support',
        'Blockchain traceability',
      ],
    },
    {
      icon: '🐋',
      name: 'Enterprise',
      desc: 'Full-scale operations with unlimited capacity',
      price: 399,
      featured: false,
      features: [
        'Unlimited ponds/cages',
        'Custom sensor deployment',
        'Satellite monitoring',
        'Advanced genomics integration',
        'Multi-site dashboard',
        'API & custom integrations',
        'Dedicated account manager',
        'On-site installation support',
        'SLA guaranteed uptime',
      ],
    },
  ];

  return (
    <section className="pricing" id="pricing" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-badge">
            <span className="badge-dot"></span>
            Pricing
          </div>
          <h2 className="section-title">Choose Your Plan</h2>
          <p className="section-subtitle">
            Scalable pricing designed for aqua farms of every size. 
            Start small and grow with us.
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`pricing-card reveal ${plan.featured ? 'featured' : ''}`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              {plan.popular && <div className="pricing-popular">Most Popular</div>}
              <div className="pricing-icon">{plan.icon}</div>
              <h3>{plan.name}</h3>
              <p className="pricing-desc">{plan.desc}</p>
              <div className="pricing-amount">
                <span className="pricing-currency">$</span>
                <span className="pricing-value">{plan.price}</span>
                <span className="pricing-period">/month</span>
              </div>
              <div className="pricing-features">
                {plan.features.map((feat, j) => (
                  <div key={j} className="pricing-feature">
                    <span className="check">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
              <button className={`pricing-btn ${plan.featured ? 'pricing-btn-primary' : 'pricing-btn-secondary'}`}>
                {plan.featured ? 'Get Started Now' : 'Start Free Trial'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
