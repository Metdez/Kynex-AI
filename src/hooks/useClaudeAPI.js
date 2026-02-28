import { useState } from 'react';

const MOCK_CAMPAIGN_DATA = {
  strategy:
    'Target Austin homeowners aged 35-65 through a multi-angle creative approach testing pain points, aspirational lifestyle, and social proof messaging. Leverage Facebook/Instagram\'s interest targeting to reach homeowners actively browsing home improvement content, combined with lookalike audiences built from existing customer data.',
  audiences: [
    { name: 'Austin Homeowners 35-65', type: 'interest', size: 340000 },
    { name: 'Home Improvement Enthusiasts', type: 'interest', size: 180000 },
    { name: 'Recent Home Buyers (Lookalike)', type: 'lookalike', size: 95000 },
  ],
  variations: [
    {
      headline: 'Transform Your Kitchen This Spring',
      body: 'Tired of cooking in a dated kitchen with cracked countertops and cabinets from the 90s? Prestige Kitchen & Bath has helped 500+ Austin families create stunning kitchens that increase home value and bring daily joy. Our expert designers will create a free 3D rendering of your dream space. Limited consultation spots available this month.',
      cta: 'Get Free Estimate',
    },
    {
      headline: 'Your Dream Kitchen, Built by Experts',
      body: 'Imagine hosting dinner parties in a kitchen with custom cabinetry, quartz countertops, and designer lighting. Prestige Kitchen & Bath turns those Pinterest boards into reality. Rated #1 in Austin for kitchen remodels — see why 500+ homeowners trust us with their most important room. Free design consultation included.',
      cta: 'See Transformations',
    },
    {
      headline: 'Your Neighbors Are Remodeling',
      body: 'Have you noticed the stunning kitchens popping up in your neighborhood? Austin homeowners are upgrading — and Prestige Kitchen & Bath is behind the best ones. With 200+ five-star reviews and an average project value of $35K, we deliver luxury results at honest prices. Book your free consultation before our spring calendar fills up.',
      cta: 'Book Free Consultation',
    },
  ],
  landingPage: {
    headline: "Austin's Premier Kitchen & Bath Remodeler",
    subheadline: '500+ Happy Homeowners. 5-Star Rated. Free Consultation.',
    cta: 'Book Your Free Design Consultation',
    testimonial:
      '"Prestige transformed our 1990s kitchen into a modern masterpiece. On time, on budget, and the team was incredible." — Sarah & Mike T., Austin',
  },
  budgetRecommendation: {
    daily: 150,
    monthly: 4500,
    estimatedCPL: 185,
    estimatedBookedCalls: 24,
  },
};

const SYSTEM_PROMPT =
  'You are the AI engine inside a growth co-pilot for a home renovation business called Prestige Kitchen & Bath in Austin, TX. Average project value: $35,000. Target audience: homeowners in Austin considering kitchen or bathroom remodels. Brand voice: professional, warm, trustworthy. Respond ONLY with the requested content, no preamble.';

export default function useClaudeAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const generate = async (prompt) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

    if (!apiKey) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setResult(MOCK_CAMPAIGN_DATA);
      setLoading(false);
      return MOCK_CAMPAIGN_DATA;
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const text = data.content?.[0]?.text || '';

      try {
        const parsed = JSON.parse(text);
        setResult(parsed);
        setLoading(false);
        return parsed;
      } catch {
        const fallback = { ...MOCK_CAMPAIGN_DATA, strategy: text };
        setResult(fallback);
        setLoading(false);
        return fallback;
      }
    } catch (err) {
      setError(err.message);
      setResult(MOCK_CAMPAIGN_DATA);
      setLoading(false);
      return MOCK_CAMPAIGN_DATA;
    }
  };

  return { generate, loading, error, result };
}
