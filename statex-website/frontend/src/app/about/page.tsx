'use client';

import { useEffect } from 'react';
import { HeroSpacer } from '@/components/atoms';

export default function AboutPage() {
  useEffect(() => {
    // Animate metrics on scroll
    const observerOptions = {
      threshold: 0.5,
      triggerOnce: true
    };

    const animateCounters = (entries: IntersectionObserverEntry[], _observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target as HTMLElement;
          const text = counter.textContent || '';
          const target = parseInt(text);

          if (!isNaN(target)) {
            const increment = target / 50;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.textContent = target.toString();
                clearInterval(timer);
              } else {
                counter.textContent = Math.floor(current).toString();
              }
            }, 20);
          }
        }
      });
    };

    const observer = new IntersectionObserver(animateCounters, observerOptions);

    // Observe all metric numbers
    document.querySelectorAll('.stx-metrics__number').forEach(counter => {
      observer.observe(counter);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="stx-page">
      <HeroSpacer />

      {/* About Hero Section */}
      <section className="stx-about-hero">
        <div className="stx-about-hero__container">
          <h1 className="stx-about-hero__title">Our Story: Innovation Through Technology</h1>
          <p className="stx-about-hero__subtitle">We are a team of passionate technologists dedicated to transforming businesses through AI-powered solutions. Based in the heart of Europe, we serve clients across the EU with cutting-edge development services and rapid prototyping capabilities.</p>

          <div className="stx-about-hero__cta">
            <a href="/free-prototype" className="stx-button stx-button--primary">
              Get Free Prototype
            </a>
          </div>

          <div className="stx-metrics">
            <div className="stx-metrics__item">
              <div className="stx-metrics__number">500+</div>
              <div className="stx-metrics__label">Projects Delivered</div>
            </div>
            <div className="stx-metrics__item">
              <div className="stx-metrics__number">15+</div>
              <div className="stx-metrics__label">Countries Served</div>
            </div>
            <div className="stx-metrics__item">
              <div className="stx-metrics__number">9</div>
              <div className="stx-metrics__label">Languages Supported</div>
            </div>
            <div className="stx-metrics__item">
              <div className="stx-metrics__number">24h</div>
              <div className="stx-metrics__label">Average Prototype Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="stx-story">
        <div className="stx-about-page-container">
          <div className="stx-story__grid">
            <div className="stx-story__content">
              <h2>Born from Innovation</h2>
              <p>Statex was founded with a simple yet ambitious vision: to revolutionize how businesses approach software development and digital transformation. Our journey began when a group of experienced developers and AI specialists recognized the growing gap between traditional development timelines and modern business needs.</p>

              <p>We saw businesses struggling with months-long development cycles, expensive custom solutions, and the inability to quickly validate ideas. This sparked our mission to create a new paradigm in software development—one where ideas could be transformed into working prototypes in hours, not months.</p>

              <p>Today, we're proud to serve hundreds of businesses across Europe, helping them accelerate their digital initiatives while maintaining the highest standards of quality and security.</p>
            </div>

            <div className="stx-story__visual">
              <div className="stx-story__icon">🚀</div>
              <h3>Accelerating Innovation</h3>
              <p>From concept to working prototype, we bridge the gap between vision and reality through cutting-edge AI technology and human expertise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="stx-values">
        <div className="stx-about-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Our Core Values</h2>
            <p className="stx-section-subtitle">The principles that guide everything we do and shape our approach to client partnerships.</p>
          </div>

          <div className="stx-values__grid">
            <div className="stx-values__card">
              <div className="stx-values__icon">⚡</div>
              <h3 className="stx-values__card-title">Speed & Efficiency</h3>
              <p className="stx-values__card-description">We believe time is your most valuable asset. Our AI-powered approach delivers results in hours, not weeks, without compromising quality.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🎯</div>
              <h3 className="stx-values__card-title">Quality Excellence</h3>
              <p className="stx-values__card-description">Every project meets the highest standards of code quality, security, and performance. We never compromise on excellence.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🤝</div>
              <h3 className="stx-values__card-title">Client Partnership</h3>
              <p className="stx-values__card-description">We build lasting relationships based on trust, transparency, and mutual success. Your goals become our mission.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🌍</div>
              <h3 className="stx-values__card-title">European Focus</h3>
              <p className="stx-values__card-description">Deep understanding of European business culture, regulations, and market needs drives everything we create.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">🔒</div>
              <h3 className="stx-values__card-title">Security First</h3>
              <p className="stx-values__card-description">GDPR compliance, data protection, and security best practices are built into every solution from day one.</p>
            </div>

            <div className="stx-values__card">
              <div className="stx-values__icon">💡</div>
              <h3 className="stx-values__card-title">Innovation Drive</h3>
              <p className="stx-values__card-description">We constantly explore new technologies and methodologies to stay ahead of industry trends and deliver cutting-edge solutions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="stx-team">
        <div className="stx-about-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Meet Our International Team</h2>
            <div className="stx-team__intro">
              <p>Our diverse team of experts brings together decades of experience in software development, AI, and business transformation. Based across Europe, we understand the unique challenges and opportunities in different markets.</p>
            </div>
          </div>

          <div className="stx-team__grid">
            <div className="stx-team__member">
              <div className="stx-team__avatar">SS</div>
              <h3 className="stx-team__name">Sergej Stašok</h3>
              <p className="stx-team__role">Founder & CEO</p>
              <p className="stx-team__bio">Visionary leader with 15+ years in software development and AI. Drives our innovation strategy and client relationships across European markets.</p>
              <div className="stx-team__skills">
                <span className="stx-team__skill-tag">AI Strategy</span>
                <span className="stx-team__skill-tag">Leadership</span>
                <span className="stx-team__skill-tag">Business Development</span>
              </div>
            </div>

            <div className="stx-team__member">
              <div className="stx-team__avatar">AT</div>
              <h3 className="stx-team__name">Anna Thompson</h3>
              <p className="stx-team__role">Head of Development</p>
              <p className="stx-team__bio">Full-stack architect specializing in scalable web applications and AI integration. Leads our technical excellence initiatives.</p>
              <div className="stx-team__skills">
                <span className="stx-team__skill-tag">Node.js</span>
                <span className="stx-team__skill-tag">React</span>
                <span className="stx-team__skill-tag">AI Integration</span>
              </div>
            </div>

            <div className="stx-team__member">
              <div className="stx-team__avatar">MK</div>
              <h3 className="stx-team__name">Martin Kovář</h3>
              <p className="stx-team__role">AI Solutions Architect</p>
              <p className="stx-team__bio">Prague-based AI specialist focusing on machine learning implementations and intelligent automation solutions for European businesses.</p>
              <div className="stx-team__skills">
                <span className="stx-team__skill-tag">Machine Learning</span>
                <span className="stx-team__skill-tag">Python</span>
                <span className="stx-team__skill-tag">Data Analysis</span>
              </div>
            </div>

            <div className="stx-team__member">
              <div className="stx-team__avatar">EL</div>
              <h3 className="stx-team__name">Elena López</h3>
              <p className="stx-team__role">UX/UI Design Lead</p>
              <p className="stx-team__bio">Creative designer ensuring every interface is intuitive, accessible, and optimized for European user preferences and accessibility standards.</p>
              <div className="stx-team__skills">
                <span className="stx-team__skill-tag">UI/UX Design</span>
                <span className="stx-team__skill-tag">Accessibility</span>
                <span className="stx-team__skill-tag">User Research</span>
              </div>
            </div>

            <div className="stx-team__member">
              <div className="stx-team__avatar">TM</div>
              <h3 className="stx-team__name">Thomas Müller</h3>
              <p className="stx-team__role">DevOps Engineer</p>
              <p className="stx-team__bio">Infrastructure expert ensuring scalable, secure deployments across European cloud providers with GDPR-compliant architectures.</p>
              <div className="stx-team__skills">
                <span className="stx-team__skill-tag">Docker</span>
                <span className="stx-team__skill-tag">AWS</span>
                <span className="stx-team__skill-tag">Security</span>
              </div>
            </div>

            <div className="stx-team__member">
              <div className="stx-team__avatar">FR</div>
              <h3 className="stx-team__name">François Robert</h3>
              <p className="stx-team__role">Quality Assurance Lead</p>
              <p className="stx-team__bio">Meticulous testing specialist ensuring every deliverable meets our exceptional quality standards and European compliance requirements.</p>
              <div className="stx-team__skills">
                <span className="stx-team__skill-tag">Test Automation</span>
                <span className="stx-team__skill-tag">Quality Assurance</span>
                <span className="stx-team__skill-tag">GDPR Compliance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="stx-culture">
        <div className="stx-about-page-container">
          <div className="stx-section-header">
            <h2 className="stx-section-title">Our Culture</h2>
            <p className="stx-section-subtitle">The environment and values that make Statex a unique place to work and partner with.</p>
          </div>

          <div className="stx-culture__grid">
            <div className="stx-culture__item">
              <span className="stx-culture__emoji">🌟</span>
              <h3 className="stx-culture__title">Excellence</h3>
              <p className="stx-culture__description">We strive for perfection in every line of code and every client interaction.</p>
            </div>

            <div className="stx-culture__item">
              <span className="stx-culture__emoji">🤖</span>
              <h3 className="stx-culture__title">Innovation</h3>
              <p className="stx-culture__description">Embracing cutting-edge AI and technology to solve complex challenges.</p>
            </div>

            <div className="stx-culture__item">
              <span className="stx-culture__emoji">🌍</span>
              <h3 className="stx-culture__title">Global Mindset</h3>
              <p className="stx-culture__description">European roots with international perspective and multicultural understanding.</p>
            </div>

            <div className="stx-culture__item">
              <span className="stx-culture__emoji">⚡</span>
              <h3 className="stx-culture__title">Agility</h3>
              <p className="stx-culture__description">Fast-paced environment with rapid iteration and continuous improvement.</p>
            </div>

            <div className="stx-culture__item">
              <span className="stx-culture__emoji">🎯</span>
              <h3 className="stx-culture__title">Results-Driven</h3>
              <p className="stx-culture__description">Focus on delivering measurable value and tangible business outcomes.</p>
            </div>

            <div className="stx-culture__item">
              <span className="stx-culture__emoji">🤝</span>
              <h3 className="stx-culture__title">Collaboration</h3>
              <p className="stx-culture__description">Teamwork and knowledge sharing across disciplines and borders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="stx-about-cta">
        <div className="stx-about-page-container">
          <div className="stx-about-cta__content">
            <h2 className="stx-about-cta__title">Join Our Success Story</h2>
            <p className="stx-about-cta__description">Ready to experience the future of software development? Let's transform your ideas into reality together.</p>
            <div className="stx-about-cta__buttons">
              <a href="/free-prototype" className="stx-about-cta__btn--primary">
                Get Free Prototype
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
