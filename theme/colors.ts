// ConnectEd Theme Color System

export const colors = {
  // Primary - Main brand identity, CTAs, links, active states
  primary: {
    DEFAULT: '#2A519C',
    hover: '#1F3F7A',
    text: '#FFFFFF',
  },

  // Secondary - Emotional brand anchor, community feel
  secondary: {
    DEFAULT: '#BF247A',
    hover: '#A31F67',
    text: '#FFFFFF',
  },

  // Accent - Draw attention without urgency
  accent: {
    DEFAULT: '#F7C65C',
    text: '#2A2A2A',
  },

  // Success - Positive feedback, confirmations
  success: {
    DEFAULT: '#35A675',
    text: '#FFFFFF',
  },

  // Warning - Caution but not danger
  warning: {
    DEFAULT: '#F7C65C',
    text: '#2A2A2A',
  },

  // Error / Danger - Clear but not aggressive
  error: {
    DEFAULT: '#D64545',
    text: '#FFFFFF',
  },

  // Backgrounds & Surfaces
  background: {
    DEFAULT: '#FFFFFF',
    surface: '#F7F8FA',
    border: '#EAECEF',
  },

  // Text Colors
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    muted: '#9CA3AF',
  },
} as const;
