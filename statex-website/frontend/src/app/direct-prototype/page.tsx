import { DirectForm } from '@/components/forms/DirectForm';

export default function DirectPrototypePage() {
  return (
    <div className="stx-page-container">
      <div className="stx-page-header">
        <h1>Get Your Free Prototype</h1>
        <p>This form sends data directly to our notification service</p>
      </div>

      <DirectForm
        formType="prototype"
        title="Submit your requirements"
        subtitle="Tell us about your idea — we'll create a working prototype for free"
        submitButtonText="🚀 Get Prototype in 24 Hours"
      />
    </div>
  );
}

