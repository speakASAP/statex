'use client';

import React from 'react';
import { ClassComposer } from '@/lib/classComposition';
import { Container, Section } from '@/components/atoms';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

interface PricingSectionProps {
  title?: string;
  subtitle?: string;
  tiers?: PricingTier[];
  className?: string;
}

export function PricingSection({ 
  title = "Transparent Pricing", 
  subtitle = "Choose the plan that fits your business needs",
  tiers = [],
  className = "" 
}: PricingSectionProps) {
  const composer = new ClassComposer('pricing-section', className);

  const defaultTiers: PricingTier[] = [
    {
      name: "Starter",
      price: "€99",
      period: "month",
      features: ["Basic features", "Email support", "5GB storage", "Basic analytics"],
      cta: "Get Started"
    },
    {
      name: "Professional",
      price: "€299",
      period: "month",
      features: ["Advanced features", "Priority support", "25GB storage", "Advanced analytics", "Custom integrations"],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "€999",
      period: "month",
      features: ["All features", "24/7 support", "Unlimited storage", "Custom analytics", "Dedicated account manager", "SLA guarantee"],
      cta: "Contact Sales"
    }
  ];

  const displayTiers = tiers.length > 0 ? tiers : defaultTiers;

  return (
    <Section className={composer.getClasses()}>
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {displayTiers.map((tier, index) => (
            <div 
              key={index}
              className={`relative p-6 rounded-lg border-2 ${
                tier.popular 
                  ? 'border-blue-500 bg-blue-50 shadow-lg' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                  <span className="text-gray-600">/{tier.period}</span>
                </div>
                
                <ul className="text-left space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  tier.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  {tier.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
