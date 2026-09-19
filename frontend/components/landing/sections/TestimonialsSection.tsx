'use client';

import { X } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <section id="case-studies" className="landing-testimonials-section">
      <div className="landing-testimonials-container">
        
        <div className="landing-testimonial-card">
          <div className="landing-testimonial-header">
            <div className="landing-testimonial-profile">
              <div className="landing-testimonial-avatar-icon">OH</div>
              <div className="landing-testimonial-meta">
                <h4>OpenHome</h4>
                <p>Working with Memorable on Faster, Cheaper Agents</p>
              </div>
            </div>
            <div className="landing-testimonial-icon">
              <X className="w-4 h-4" />
            </div>
          </div>
          <p className="landing-testimonial-content">
            Most memory tools store what happened. Memorable stores how things get done. It watches an agent's own successful runs and turns them into reusable workflows, so the path an agent worked out once becomes a path it can follow.
          </p>
          <div className="landing-testimonial-date">openhome.com</div>
        </div>

        <div className="landing-testimonial-card">
          <div className="landing-testimonial-header">
            <div className="landing-testimonial-profile">
              <div className="landing-testimonial-avatar-img">A</div>
              <div className="landing-testimonial-meta">
                <h4>Adam</h4>
                <p>Creator and Investor</p>
              </div>
            </div>
            <div className="landing-testimonial-icon">
              <X className="w-4 h-4" />
            </div>
          </div>
          <p className="landing-testimonial-content">
            Bro is in YC headstart, he will be at 10m ARR before starting the batch
          </p>
          <div className="landing-testimonial-date">Sep 17</div>
        </div>
      </div>
    </section>
  );
}
