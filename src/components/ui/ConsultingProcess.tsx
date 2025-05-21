
import { useEffect, useState } from 'react';

interface ProcessStep {
  id: number;
  title: string;
  description: string;
}

const steps: ProcessStep[] = [
  {
    id: 1,
    title: "Discovery",
    description: "We begin with a comprehensive review of your current website and digital assets. Our team analyzes your goals, audience, and business objectives."
  },
  {
    id: 2,
    title: "Strategy",
    description: "Based on our findings, we develop a tailored strategy that aligns with your brand. This includes sitemap, wireframes, and technological recommendations."
  },
  {
    id: 3,
    title: "Design",
    description: "Our designers create a visual identity that reflects your brand's essence while ensuring a modern, user-friendly experience across all devices."
  },
  {
    id: 4,
    title: "Development",
    description: "Our development team brings the designs to life, focusing on clean code, performance optimization, and accessibility compliance."
  },
  {
    id: 5,
    title: "Testing",
    description: "We rigorously test across browsers and devices to ensure your site functions flawlessly under all conditions."
  },
  {
    id: 6,
    title: "Launch",
    description: "After final approval, we handle the technical aspects of launching your new site and ensure a smooth transition."
  },
  {
    id: 7,
    title: "Support",
    description: "Our relationship doesn't end at launch. We provide ongoing support, analytics, and optimization recommendations."
  }
];

const ConsultingProcess = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [animationDirection, setAnimationDirection] = useState<'next' | 'prev'>('next');
  
  const handleStepClick = (id: number) => {
    setAnimationDirection(id > activeStep ? 'next' : 'prev');
    setActiveStep(id);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationDirection('next');
      setActiveStep(current => current < steps.length ? current + 1 : 1);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-12">
      <div className="mb-12">
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:px-0 md:mx-0 scrollbar-hide">
          <div className="flex space-x-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`flex items-center justify-center min-w-[2.5rem] h-10 rounded-full transition-all px-4
                  ${activeStep === step.id 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <span className="font-medium">{step.id}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-[2px] bg-gray-200 w-full relative mb-8">
          <div 
            className="absolute h-full bg-black transition-all duration-500 ease-in-out"
            style={{ 
              width: `${(activeStep / steps.length) * 100}%` 
            }}
          />
        </div>
      </div>
      
      <div className="relative h-[300px]">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`absolute top-0 left-0 w-full transition-all duration-500 ease-in-out
              ${activeStep === step.id ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none'}
              ${activeStep !== step.id && animationDirection === 'next' ? 'translate-x-10' : ''}
              ${activeStep !== step.id && animationDirection === 'prev' ? '-translate-x-10' : ''}
            `}
          >
            <h3 className="text-3xl font-medium mb-4">{step.title}</h3>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsultingProcess;
