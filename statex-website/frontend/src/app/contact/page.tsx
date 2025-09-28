'use client';

import React from 'react';
import { HeroSpacer } from '@/components/atoms';
import { FormSection } from '@/components/sections/FormSection';

export default function ContactPage() {



  return (
    <>
      <HeroSpacer />
      {/* Contact Form Section */}
      <section className="stx-form-block" id="contact-form">
        <div className="stx-form-block__container">

          <div className="stx-form__container">
            <FormSection
              pageType="prototype"
              variant="contact"
              title="Send us a Message"
              subtitle="We'll get back to you within 24 hours"
              showVoiceRecording={true}
              showFileUpload={true}
              showContactFields={true}
              placeholder="💡 Tell us about your project - Describe what you need in detail:
• What type of project are you planning
• What are your main goals
• What is your timeline
• What is your budget range
• Any specific requirements or preferences
• How did you hear about us
• Any additional information..."
              submitButtonText="📤 Send Message"
              defaultName="PartyZan"
              defaultDescription="Make a website to offer website creation solutions. It will offer webshops with payment possibilities, sites with booking, website as landing etc. We will host solutions on our platform."
            />
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="stx-section stx-contact-info-section">
        <div className="stx-container">
          <div className="stx-contact-info-grid">
            <div className="stx-contact-info-card">
              <div className="stx-contact-info-icon">📧</div>
              <h3 className="stx-contact-info-title">Email</h3>
              <p className="stx-contact-info-value">info@statex.cz</p>
              <p className="stx-contact-info-description">We'll respond within 24 hours</p>
            </div>

            <div className="stx-contact-info-card">
              <div className="stx-contact-info-icon">📞</div>
              <h3 className="stx-contact-info-title">Phone</h3>
              <p className="stx-contact-info-value">+420 774 287 541</p>
              <p className="stx-contact-info-description">Monday - Friday: 9:00 AM - 6:00 PM CET</p>
            </div>

            <div className="stx-contact-info-card">
              <div className="stx-contact-info-icon">📍</div>
              <h3 className="stx-contact-info-title">Location</h3>
              <p className="stx-contact-info-value">Prague, Czech Republic</p>
              <p className="stx-contact-info-description">Available for meetings and consultations</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
