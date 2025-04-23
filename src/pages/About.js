import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      <div className="container">
        <div className="about-header">
          <h1>About SoftBrace Strips</h1>
          <p className="subtitle">
            Providing innovative joint support solutions since 2023
          </p>
        </div>

        <section className="about-mission">
          <h2>Our Mission</h2>
          <p>
            At SoftBrace Strips, we're committed to helping people stay active and 
            pain-free by providing comfortable, effective joint support solutions. 
            Our mission is to develop products that allow people to continue doing 
            what they love despite joint pain or injuries.
          </p>
        </section>

        <section className="about-story">
          <h2>Our Story</h2>
          <div className="story-content">
            <div className="story-text">
              <p>
                SoftBrace Strips was founded by a team of healthcare professionals 
                and athletes who were frustrated with the limitations of traditional 
                joint supports. They saw a need for flexible, comfortable strips that 
                could provide targeted support without restricting movement.
              </p>
              <p>
                After years of research and development, we launched our first line 
                of SoftBrace Strips in 2023. Since then, we've been helping thousands 
                of people overcome joint pain and maintain their active lifestyles.
              </p>
            </div>
            <div className="story-image">
              {/* Placeholder for story image */}
              <div className="image-placeholder">Company Image</div>
            </div>
          </div>
        </section>

        <section className="about-values">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Innovation</h3>
              <p>Constantly improving our products to provide the best support possible</p>
            </div>
            <div className="value-card">
              <h3>Quality</h3>
              <p>Using premium materials and rigorous testing to ensure product excellence</p>
            </div>
            <div className="value-card">
              <h3>Comfort</h3>
              <p>Designing products that are comfortable for all-day wear</p>
            </div>
            <div className="value-card">
              <h3>Accessibility</h3>
              <p>Making effective joint support available to everyone who needs it</p>
            </div>
          </div>
        </section>

        <section className="about-team">
          <h2>Our Team</h2>
          <p className="team-intro">
            The SoftBrace Strips team combines expertise in medical science, product design, 
            and athletic performance to create the most effective joint support products on the market.
          </p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo">
                {/* Placeholder for team member photo */}
                <div className="image-placeholder">Photo</div>
              </div>
              <h3>Dr. Sarah Johnson</h3>
              <p className="member-role">Founder & Chief Medical Officer</p>
            </div>
            <div className="team-member">
              <div className="member-photo">
                {/* Placeholder for team member photo */}
                <div className="image-placeholder">Photo</div>
              </div>
              <h3>Michael Chen</h3>
              <p className="member-role">Product Development Lead</p>
            </div>
            <div className="team-member">
              <div className="member-photo">
                {/* Placeholder for team member photo */}
                <div className="image-placeholder">Photo</div>
              </div>
              <h3>Tanya Williams</h3>
              <p className="member-role">Athletic Performance Specialist</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 