import React from 'react';
import BrowardHeader from '@/components/layout/BrowardHeader';
import BrowardHero from '@/components/layout/BrowardHero';
import BrowardFooter from '@/components/layout/BrowardFooter';
import BrowardButton from '@/components/ui/broward-button';
import BrowardCard from '@/components/ui/broward-card';
import BrowardInput from '@/components/ui/broward-input';
import ThemeToggle from '@/components/ui/theme-toggle';
import { 
  ShieldIcon, 
  HandshakeIcon, 
  DocumentIcon, 
  CheckIcon,
  LandmarkCourthouse,
  LandmarkBeach,
  LandmarkPort
} from '@/components/ui/broward-icons';

const BrowardDesignSystem: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <BrowardHeader />
      
      <BrowardHero 
        title="Broward County Design System" 
        subtitle="A comprehensive design system for the Consumer Protection Division"
      />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="font-serif text-2xl mb-6 text-bc-navy dark:text-bc-blue">Color Palette</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="rounded-lg overflow-hidden shadow-md">
              <div className="h-24 bg-bc-blue"></div>
              <div className="p-3 bg-white dark:bg-neutral-100">
                <p className="font-medium">Primary Blue</p>
                <p className="text-sm text-neutral-500">#005A9C</p>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-md">
              <div className="h-24 bg-bc-navy"></div>
              <div className="p-3 bg-white dark:bg-neutral-100">
                <p className="font-medium">Navy</p>
                <p className="text-sm text-neutral-500">#003366</p>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-md">
              <div className="h-24 bg-bc-teal"></div>
              <div className="p-3 bg-white dark:bg-neutral-100">
                <p className="font-medium">Teal</p>
                <p className="text-sm text-neutral-500">#00859B</p>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-md">
              <div className="h-24 bg-bc-gold"></div>
              <div className="p-3 bg-white dark:bg-neutral-100">
                <p className="font-medium">Gold</p>
                <p className="text-sm text-neutral-500">#F3D54E</p>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-md">
              <div className="h-24 bg-bc-sand"></div>
              <div className="p-3 bg-white dark:bg-neutral-100">
                <p className="font-medium">Sand</p>
                <p className="text-sm text-neutral-500">#F0E6D2</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="font-serif text-xl mb-4">Gradient Combinations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg overflow-hidden shadow-md">
                <div className="h-24 bg-gradient-to-r from-bc-blue to-bc-teal"></div>
                <div className="p-3 bg-white dark:bg-neutral-100">
                  <p className="font-medium">Blue to Teal</p>
                </div>
              </div>
              
              <div className="rounded-lg overflow-hidden shadow-md">
                <div className="h-24 bg-gradient-to-r from-bc-navy to-bc-blue"></div>
                <div className="p-3 bg-white dark:bg-neutral-100">
                  <p className="font-medium">Navy to Blue</p>
                </div>
              </div>
              
              <div className="rounded-lg overflow-hidden shadow-md">
                <div className="h-24 bg-gradient-to-r from-bc-teal to-bc-gold"></div>
                <div className="p-3 bg-white dark:bg-neutral-100">
                  <p className="font-medium">Teal to Gold</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="font-serif text-2xl mb-6 text-bc-navy dark:text-bc-blue">Typography</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-serif text-xl mb-4">Headings (Merriweather)</h3>
              
              <div className="space-y-4 bg-white dark:bg-neutral-100 p-6 rounded-lg shadow-md">
                <div>
                  <h1 className="font-serif text-4xl">Heading 1</h1>
                  <p className="text-sm text-neutral-500">font-size: var(--fs-4xl)</p>
                </div>
                
                <div>
                  <h2 className="font-serif text-3xl">Heading 2</h2>
                  <p className="text-sm text-neutral-500">font-size: var(--fs-3xl)</p>
                </div>
                
                <div>
                  <h3 className="font-serif text-2xl">Heading 3</h3>
                  <p className="text-sm text-neutral-500">font-size: var(--fs-2xl)</p>
                </div>
                
                <div>
                  <h4 className="font-serif text-xl">Heading 4</h4>
                  <p className="text-sm text-neutral-500">font-size: var(--fs-xl)</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-serif text-xl mb-4">Body Text (Inter)</h3>
              
              <div className="space-y-4 bg-white dark:bg-neutral-100 p-6 rounded-lg shadow-md">
                <div>
                  <p className="text-lg">Large Text</p>
                  <p className="text-sm text-neutral-500">font-size: var(--fs-lg)</p>
                </div>
                
                <div>
                  <p className="text-base">Base Text</p>
                  <p className="text-sm text-neutral-500">font-size: var(--fs-base)</p>
                </div>
                
                <div>
                  <p className="text-sm">Small Text</p>
                  <p className="text-sm text-neutral-500">font-size: var(--fs-sm)</p>
                </div>
                
                <div>
                  <p className="text-xs">Extra Small Text</p>
                  <p className="text-sm text-neutral-500">font-size: var(--fs-xs)</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="font-serif text-2xl mb-6 text-bc-navy dark:text-bc-blue">Buttons</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-4 bg-white dark:bg-neutral-100 p-6 rounded-lg shadow-md">
              <h3 className="font-serif text-xl mb-4">Primary</h3>
              <div className="space-y-4">
                <BrowardButton variant="primary" size="lg">Large Button</BrowardButton>
                <BrowardButton variant="primary" size="md">Medium Button</BrowardButton>
                <BrowardButton variant="primary" size="sm">Small Button</BrowardButton>
              </div>
            </div>
            
            <div className="space-y-4 bg-white dark:bg-neutral-100 p-6 rounded-lg shadow-md">
              <h3 className="font-serif text-xl mb-4">Secondary</h3>
              <div className="space-y-4">
                <BrowardButton variant="secondary" size="lg">Large Button</BrowardButton>
                <BrowardButton variant="secondary" size="md">Medium Button</BrowardButton>
                <BrowardButton variant="secondary" size="sm">Small Button</BrowardButton>
              </div>
            </div>
            
            <div className="space-y-4 bg-white dark:bg-neutral-100 p-6 rounded-lg shadow-md">
              <h3 className="font-serif text-xl mb-4">Outline</h3>
              <div className="space-y-4">
                <BrowardButton variant="outline" size="lg">Large Button</BrowardButton>
                <BrowardButton variant="outline" size="md">Medium Button</BrowardButton>
                <BrowardButton variant="outline" size="sm">Small Button</BrowardButton>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="font-serif text-2xl mb-6 text-bc-navy dark:text-bc-blue">Form Elements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6 bg-white dark:bg-neutral-100 p-6 rounded-lg shadow-md">
              <h3 className="font-serif text-xl mb-4">Floating Labels</h3>
              
              <BrowardInput 
                label="Full Name" 
                floating={true} 
                placeholder="Enter your full name"
              />
              
              <BrowardInput 
                label="Email Address" 
                type="email" 
                floating={true} 
                placeholder="Enter your email address"
              />
              
              <BrowardInput 
                label="Password" 
                type="password" 
                floating={true} 
                placeholder="Enter your password"
              />
              
              <BrowardInput 
                label="Phone Number" 
                type="tel" 
                floating={true} 
                placeholder="Enter your phone number"
                error="Please enter a valid phone number"
              />
            </div>
            
            <div className="space-y-6 bg-white dark:bg-neutral-100 p-6 rounded-lg shadow-md">
              <h3 className="font-serif text-xl mb-4">Standard Labels</h3>
              
              <BrowardInput 
                label="Full Name" 
                floating={false} 
                placeholder="Enter your full name"
              />
              
              <BrowardInput 
                label="Email Address" 
                type="email" 
                floating={false} 
                placeholder="Enter your email address"
              />
              
              <BrowardInput 
                label="Password" 
                type="password" 
                floating={false} 
                placeholder="Enter your password"
              />
              
              <BrowardInput 
                label="Phone Number" 
                type="tel" 
                floating={false} 
                placeholder="Enter your phone number"
                error="Please enter a valid phone number"
              />
            </div>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="font-serif text-2xl mb-6 text-bc-navy dark:text-bc-blue">Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BrowardCard 
              title="Standard Card" 
              subtitle="With title and subtitle"
              elevation="sm"
            >
              <p className="mb-4">This is a standard card with a title and subtitle. It has minimal elevation.</p>
              <BrowardButton variant="primary">Learn More</BrowardButton>
            </BrowardCard>
            
            <BrowardCard elevation="md">
              <p className="mb-4">This card has no title or subtitle, but includes content and a medium elevation.</p>
              <p className="mb-4">Cards are versatile containers that can hold various types of content.</p>
              <BrowardButton variant="secondary">View Details</BrowardButton>
            </BrowardCard>
            
            <BrowardCard 
              title="Featured Card" 
              elevation="lg"
              className="bg-gradient-to-br from-bc-blue-60 to-bc-teal-70 text-white"
            >
              <p className="mb-4">This is a featured card with a gradient background and high elevation.</p>
              <BrowardButton variant="outline" className="bg-white text-bc-blue border-white hover:bg-bc-blue hover:text-white">
                Get Started
              </BrowardButton>
            </BrowardCard>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="font-serif text-2xl mb-6 text-bc-navy dark:text-bc-blue">Icons & Illustrations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-neutral-100 p-6 rounded-lg shadow-md">
              <h3 className="font-serif text-xl mb-4">Icon Set</h3>
              
              <div className="flex flex-wrap gap-8">
                <div className="flex flex-col items-center">
                  <ShieldIcon size={32} className="text-bc-blue mb-2" />
                  <span className="text-sm">Shield</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <HandshakeIcon size={32} className="text-bc-blue mb-2" />
                  <span className="text-sm">Handshake</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <DocumentIcon size={32} className="text-bc-blue mb-2" />
                  <span className="text-sm">Document</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <CheckIcon size={32} className="text-bc-blue mb-2" />
                  <span className="text-sm">Check</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-neutral-100 p-6 rounded-lg shadow-md">
              <h3 className="font-serif text-xl mb-4">Shield to Checkmark Animation</h3>
              
              <div className="flex justify-center">
                <ShieldCheckmarkAnimation size={100} />
              </div>
              
              <p className="text-center text-sm text-neutral-500 mt-4">
                Hover over the shield to see the animation
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-100 p-6 rounded-lg shadow-md">
            <h3 className="font-serif text-xl mb-4">Broward County Landmarks</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <LandmarkCourthouse />
                <span className="text-sm mt-2">Courthouse</span>
              </div>
              
              <div className="flex flex-col items-center">
                <LandmarkBeach />
                <span className="text-sm mt-2">Beach</span>
              </div>
              
              <div className="flex flex-col items-center">
                <LandmarkPort />
                <span className="text-sm mt-2">Port</span>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="font-serif text-2xl mb-6 text-bc-navy dark:text-bc-blue">Patterns & Backgrounds</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="coastal-pattern rounded-lg p-6 h-48 flex items-center justify-center">
              <p className="text-bc-navy font-medium">Coastal Pattern Background</p>
            </div>
            
            <div className="wave-animation bg-bc-blue rounded-lg p-6 h-48 flex items-center justify-center">
              <p className="text-white font-medium">Wave Animation Background</p>
            </div>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="font-serif text-2xl mb-6 text-bc-navy dark:text-bc-blue">Theme Toggle</h2>
          
          <div className="bg-white dark:bg-neutral-100 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <p>Toggle between light and dark mode:</p>
              <ThemeToggle />
            </div>
          </div>
        </section>
      </main>
      
      <BrowardFooter />
    </div>
  );
}

export default BrowardDesignSystem;