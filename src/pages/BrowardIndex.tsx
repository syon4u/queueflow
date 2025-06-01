import React from 'react';
import { Link } from 'react-router-dom';
import BrowardHeader from '@/components/layout/BrowardHeader';
import BrowardHero from '@/components/layout/BrowardHero';
import BrowardFooter from '@/components/layout/BrowardFooter';
import BrowardButton from '@/components/ui/broward-button';
import BrowardCard from '@/components/ui/broward-card';
import { 
  ShieldIcon, 
  HandshakeIcon, 
  DocumentIcon, 
  CheckIcon,
  LandmarkCourthouse,
  LandmarkBeach,
  LandmarkPort
} from '@/components/ui/broward-icons';

const BrowardIndex: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <BrowardHeader />
      
      <BrowardHero 
        title="Protecting Broward County Consumers" 
        subtitle="Ensuring fair business practices and consumer rights through education, mediation, and enforcement"
      />
      
      <main className="container mx-auto px-4 py-12">
        {/* Services Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-bc-navy dark:text-bc-blue mb-4">Our Services</h2>
            <p className="max-w-2xl mx-auto text-neutral-600 dark:text-neutral-400">
              The Consumer Protection Division provides a variety of services to help protect 
              Broward County residents from unfair business practices.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BrowardCard className="text-center">
              <div className="flex justify-center mb-4">
                <ShieldIcon size={48} className="text-bc-blue" />
              </div>
              <h3 className="font-serif text-xl mb-2">Consumer Complaints</h3>
              <p className="mb-4 text-neutral-600 dark:text-neutral-400">
                File complaints against businesses for unfair practices, fraud, or deceptive advertising.
              </p>
              <BrowardButton variant="primary">File a Complaint</BrowardButton>
            </BrowardCard>
            
            <BrowardCard className="text-center">
              <div className="flex justify-center mb-4">
                <HandshakeIcon size={48} className="text-bc-teal" />
              </div>
              <h3 className="font-serif text-xl mb-2">Mediation Services</h3>
              <p className="mb-4 text-neutral-600 dark:text-neutral-400">
                Our mediators help resolve disputes between consumers and businesses.
              </p>
              <BrowardButton variant="secondary">Request Mediation</BrowardButton>
            </BrowardCard>
            
            <BrowardCard className="text-center">
              <div className="flex justify-center mb-4">
                <DocumentIcon size={48} className="text-bc-navy" />
              </div>
              <h3 className="font-serif text-xl mb-2">Business Licensing</h3>
              <p className="mb-4 text-neutral-600 dark:text-neutral-400">
                Apply for or renew business licenses and permits required by county ordinances.
              </p>
              <BrowardButton variant="outline">Apply for License</BrowardButton>
            </BrowardCard>
          </div>
        </section>
        
        {/* About Section with Landmarks */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-serif text-3xl text-bc-navy dark:text-bc-blue mb-4">About Broward County</h2>
              <p className="mb-4 text-neutral-600 dark:text-neutral-400">
                Broward County is home to nearly 2 million residents and millions of annual visitors. 
                Our Consumer Protection Division works to ensure fair treatment for all consumers 
                and businesses in our diverse community.
              </p>
              <p className="mb-6 text-neutral-600 dark:text-neutral-400">
                From our beautiful beaches to our bustling port and vibrant courthouse, 
                we're committed to maintaining the highest standards of consumer protection 
                throughout the county.
              </p>
              <BrowardButton variant="primary">Learn More</BrowardButton>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="flex justify-center">
                <LandmarkCourthouse />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex justify-center">
                  <LandmarkBeach />
                </div>
                <div className="flex justify-center">
                  <LandmarkPort />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action with Wave Background */}
        <section className="mb-16">
          <div className="wave-animation bg-gradient-to-r from-bc-navy to-bc-blue rounded-lg p-8 md:p-12 text-center">
            <h2 className="font-serif text-3xl text-white mb-4">Need Assistance?</h2>
            <p className="text-bc-sand mb-8 max-w-2xl mx-auto">
              Our team is ready to help with consumer complaints, business licensing, 
              and other consumer protection matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BrowardButton 
                variant="primary" 
                className="bg-bc-gold text-bc-navy hover:bg-bc-sand"
              >
                Schedule an Appointment
              </BrowardButton>
              <BrowardButton 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-bc-navy"
              >
                Contact Us
              </BrowardButton>
            </div>
          </div>
        </section>
        
        {/* Recent Updates with Coastal Pattern */}
        <section className="mb-16">
          <div className="coastal-pattern rounded-lg p-8">
            <h2 className="font-serif text-2xl text-bc-navy mb-6 text-center">Recent Updates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BrowardCard>
                <p className="text-sm text-bc-teal mb-2">May 15, 2025</p>
                <h3 className="font-serif text-lg mb-2">Consumer Alert: Home Repair Scams</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Be aware of unlicensed contractors offering home repairs after recent storms.
                </p>
                <Link to="/alerts" className="text-bc-blue dark:text-bc-teal font-medium hover:underline">
                  Read More
                </Link>
              </BrowardCard>
              
              <BrowardCard>
                <p className="text-sm text-bc-teal mb-2">May 10, 2025</p>
                <h3 className="font-serif text-lg mb-2">New Online Complaint System</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Our new online system makes it easier to file and track consumer complaints.
                </p>
                <Link to="/news" className="text-bc-blue dark:text-bc-teal font-medium hover:underline">
                  Read More
                </Link>
              </BrowardCard>
              
              <BrowardCard>
                <p className="text-sm text-bc-teal mb-2">May 5, 2025</p>
                <h3 className="font-serif text-lg mb-2">Business License Renewal Deadline</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Reminder: Business licenses must be renewed by June 30, 2025.
                </p>
                <Link to="/news" className="text-bc-blue dark:text-bc-teal font-medium hover:underline">
                  Read More
                </Link>
              </BrowardCard>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-bc-navy dark:text-bc-blue mb-4">Making an Impact</h2>
            <p className="max-w-2xl mx-auto text-neutral-600 dark:text-neutral-400">
              Our division works tirelessly to protect consumers and ensure fair business practices.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <BrowardCard className="text-center">
              <h3 className="font-serif text-4xl text-bc-blue mb-2">2,500+</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Consumer complaints resolved annually
              </p>
            </BrowardCard>
            
            <BrowardCard className="text-center">
              <h3 className="font-serif text-4xl text-bc-teal mb-2">$1.2M</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Recovered for consumers last year
              </p>
            </BrowardCard>
            
            <BrowardCard className="text-center">
              <h3 className="font-serif text-4xl text-bc-navy mb-2">15,000+</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Business licenses issued and renewed
              </p>
            </BrowardCard>
            
            <BrowardCard className="text-center">
              <h3 className="font-serif text-4xl text-bc-gold mb-2">98%</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Customer satisfaction rating
              </p>
            </BrowardCard>
          </div>
        </section>
      </main>
      
      <BrowardFooter />
    </div>
  );
};

export default BrowardIndex;