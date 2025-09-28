'use client';

import React from 'react';
import { Text } from './Text';
import { ClassComposer } from '../../lib/classComposition';

// Simple generic card for basic usage
interface SimpleCardProps {
  className?: string;
  children?: React.ReactNode;
}

export function Card({ className = '', children }: SimpleCardProps) {
  return (
    <div className={`stx-card ${className}`.trim()}>
      {children}
    </div>
  );
}

// Simple sub-components for generic usage
export function CardHeader({ className = '', children }: SimpleCardProps) {
  return <div className={`stx-card__header ${className}`.trim()}>{children}</div>;
}

export function CardTitle({ className = '', children }: SimpleCardProps) {
  return <div className={`stx-card__title ${className}`.trim()}>{children}</div>;
}

export function CardDescription({ className = '', children }: SimpleCardProps) {
  return <div className={`stx-card__description ${className}`.trim()}>{children}</div>;
}

export function CardContent({ className = '', children }: SimpleCardProps) {
  return <div className={`stx-card__content ${className}`.trim()}>{children}</div>;
}

export function CardFooter({ className = '', children }: SimpleCardProps) {
  return <div className={`stx-card__footer ${className}`.trim()}>{children}</div>;
}

interface BaseCardProps {
  pageType?: 'homepage' | 'about' | 'service' | 'solution' | 'legal' | 'prototype';
  cardType: 'values' | 'team' | 'culture' | 'testimonial';
  className?: string;
  children?: React.ReactNode;
  abTest?: { experimentId: string; variant: string };
}

interface ValuesCardProps extends BaseCardProps {
  cardType: 'values';
  icon: string;
  title: string;
  description: string;
}

interface TeamCardProps extends BaseCardProps {
  cardType: 'team';
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  skills?: string[];
}

interface CultureCardProps extends BaseCardProps {
  cardType: 'culture';
  emoji: string;
  title: string;
  description: string;
}

interface TestimonialCardProps extends BaseCardProps {
  cardType: 'testimonial';
  quote: string;
  author: {
    name: string;
    role: string;
    company: string;
    avatar?: string;
  };
}

type CardProps = ValuesCardProps | TeamCardProps | CultureCardProps | TestimonialCardProps;

export function TypedCard(props: CardProps) {
  const { pageType = 'homepage', cardType, className = '', abTest } = props;

  // Generate classes using composition engine
  const composer = new ClassComposer(pageType);
  const classSet = composer.compose({
    section: 'cards',
    variant: cardType,
    abTest,
    pageType,
    theme: 'light',
    customClasses: []
  });

  const cardClasses = [classSet.container, className].filter(Boolean).join(' ');

  const renderCardContent = () => {
    switch (props.cardType) {
      case 'values':
        return (
          <>
            <div
              className={classSet.elements['icon']}
              data-testid="stx-card-icon"
            >
              {props.icon}
            </div>
            <Text
              variant="h3"
              className={classSet.elements['title']}
              data-testid="stx-card-title"
            >
              {props.title}
            </Text>
            <Text
              variant="bodyMedium"
              className={classSet.elements['description']}
              data-testid="stx-card-description"
            >
              {props.description}
            </Text>
          </>
        );

      case 'team':
        return (
          <>
            <div
              className={classSet.elements['avatar']}
              data-testid="stx-card-avatar"
            >
              {props.avatar || props.name.split(' ').map(n => n[0]).join('')}
            </div>
            <Text
              variant="h3"
              className={classSet.elements['name']}
              data-testid="stx-card-name"
            >
              {props.name}
            </Text>
            <Text
              variant="bodyMedium"
              className={classSet.elements['role']}
              data-testid="stx-card-role"
            >
              {props.role}
            </Text>
            <Text
              variant="bodySmall"
              className={classSet.elements['bio']}
              data-testid="stx-card-bio"
            >
              {props.bio}
            </Text>
            {props.skills && props.skills.length > 0 && (
              <div
                className={classSet.elements['skills']}
                data-testid="stx-card-skills"
              >
                {props.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={classSet.elements['skillTag']}
                    data-testid="stx-card-skill-tag"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </>
        );

      case 'culture':
        return (
          <>
            <span
              className={classSet.elements['emoji']}
              data-testid="stx-card-emoji"
            >
              {props.emoji}
            </span>
            <Text
              variant="h3"
              className={classSet.elements['title']}
              data-testid="stx-card-title"
            >
              {props.title}
            </Text>
            <Text
              variant="bodyMedium"
              className={classSet.elements['description']}
              data-testid="stx-card-description"
            >
              {props.description}
            </Text>
          </>
        );

      case 'testimonial':
        return (
          <>
            <div
              className={classSet.elements['quote']}
              data-testid="stx-card-quote"
            >
              "{props.quote}"
            </div>
            <div
              className={classSet.elements['author']}
              data-testid="stx-card-author"
            >
              <div className={classSet.elements['authorInfo']}>
                <div
                  className={classSet.elements['name']}
                  data-testid="stx-card-author-name"
                >
                  {props.author.name}
                </div>
                <div
                  className={classSet.elements['role']}
                  data-testid="stx-card-author-role"
                >
                  {props.author.role}
                </div>
                <div
                  className={classSet.elements['company']}
                  data-testid="stx-card-author-company"
                >
                  {props.author.company}
                </div>
              </div>
            </div>
          </>
        );

      default:
        return (props as BaseCardProps).children ?? null;
    }
  };

  return (
    <div
      className={cardClasses}
      data-testid={`stx-card-${cardType}`}
      data-card-type={cardType}
    >
      {renderCardContent()}
    </div>
  );
}

// Convenience components for specific card types
export function ValuesCard(props: Omit<ValuesCardProps, 'cardType'>) {
  return <TypedCard {...props} cardType="values" />;
}

export function TeamCard(props: Omit<TeamCardProps, 'cardType'>) {
  return <TypedCard {...props} cardType="team" />;
}

export function CultureCard(props: Omit<CultureCardProps, 'cardType'>) {
  return <TypedCard {...props} cardType="culture" />;
}

export function TestimonialCard(props: Omit<TestimonialCardProps, 'cardType'>) {
  return <TypedCard {...props} cardType="testimonial" />;
}
