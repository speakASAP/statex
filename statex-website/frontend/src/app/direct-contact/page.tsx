import { DirectForm } from '@/components/forms/DirectForm';

export default function DirectContactPage() {
  return (
    <div className="stx-page-container">
      <div className="stx-page-header">
        <h1>Contact Us Directly</h1>
        <p>This form sends data directly to our notification service</p>
      </div>

      <DirectForm
        formType="contact"
        title="Send us a Message"
        subtitle="We'll get back to you within 24 hours"
        submitButtonText="📤 Send Message"
      />
    </div>
  );
}

