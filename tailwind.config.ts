import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

// The single Tailwind config. A minimal tailwind.config.js used to sit beside
// this file and, because Tailwind resolves the .js first, silently replaced it —
// none of the tokens below (bc-* colours, shadow-card, text-body-*, animate-*)
// were ever generated. Everything the .js had is folded in here.
//
// Deliberately NOT enabled, to keep the rendered CSS byte-for-byte compatible
// with what the app shipped with (each is a visible change to review on its own):
//   darkMode: ["class"]        – `dark:` utilities currently follow the OS, not the toggle
//   container: { center, padding: '2rem', screens: { '2xl': '1400px' } }
//   fontFamily.serif: Merriweather   – `font-serif` currently resolves to the browser default
//   colors.sidebar.*           – would restyle the mounted shadcn sidebar
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Brand Colors
				'bc-blue': '#005A9C',
				'bc-navy': '#003366',
				'bc-teal': '#00859B',
				'bc-gold': '#F3D54E',
				'bc-sand': '#F0E6D2',
				'bc-blue-60': 'rgba(0, 90, 156, 0.6)',
				'bc-teal-70': 'rgba(0, 133, 155, 0.7)',
				'bc-gold-80': 'rgba(243, 213, 78, 0.8)',
				// Semantic Status Colors
				success: {
					DEFAULT: '#10b981',
					foreground: '#ffffff',
					muted: '#d1fae5',
					'muted-foreground': '#059669'
				},
				warning: {
					DEFAULT: '#f59e0b',
					foreground: '#ffffff',
					muted: '#fef3c7',
					'muted-foreground': '#d97706'
				},
				error: {
					DEFAULT: '#ef4444',
					foreground: '#ffffff',
					muted: '#fee2e2',
					'muted-foreground': '#dc2626'
				},
				info: {
					DEFAULT: '#3b82f6',
					foreground: '#ffffff',
					muted: '#dbeafe',
					'muted-foreground': '#2563eb'
				},
				neutral: {
					50: '#fafafa',
					100: '#f5f5f5',
					200: '#e5e5e5',
					300: '#d4d4d4',
					400: '#a3a3a3',
					500: '#737373',
					600: '#525252',
					700: '#404040',
					800: '#262626',
					900: '#171717',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			// Design Token Spacing Scale
			spacing: {
				'xs': '0.25rem',    // 4px
				'sm': '0.5rem',     // 8px
				'md': '1rem',       // 16px
				'lg': '1.5rem',     // 24px
				'xl': '2rem',       // 32px
				'2xl': '3rem',      // 48px
				'3xl': '4rem',      // 64px
			},
			// Typography Scale
			fontSize: {
				'heading-xs': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],  // 14px
				'heading-sm': ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],       // 16px
				'heading-md': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }],  // 18px
				'heading-lg': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],   // 20px
				'heading-xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],       // 24px
				'heading-2xl': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }], // 30px
				'body-xs': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],         // 12px
				'body-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],     // 14px
				'body-md': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],          // 16px
				'body-lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }],     // 18px
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'pulse-light': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' },
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)',
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)',
					},
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
				'wave': {
					'0%': { backgroundPositionX: '0' },
					'100%': { backgroundPositionX: '1200px' },
				},
				// Landing fx (src/components/landing/fx/Marquee.tsx)
				marquee: {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(calc(-100% - var(--gap)))' },
				},
				'marquee-vertical': {
					from: { transform: 'translateY(0)' },
					to: { transform: 'translateY(calc(-100% - var(--gap)))' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-light': 'pulse-light 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'fade-in-up': 'fade-in-up 0.5s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'wave': 'wave 10s linear infinite',
				marquee: 'marquee var(--duration) infinite linear',
				'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
				// Landing page (src/styles/landing.css): signage display face + serif accent word
				signage: ['"Bricolage Grotesque"', 'Inter', 'system-ui', 'sans-serif'],
				accent: ['"Instrument Serif"', 'Georgia', 'serif'],
			},
			boxShadow: {
				'card': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.1)',
				'card-hover': '0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.1)',
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
