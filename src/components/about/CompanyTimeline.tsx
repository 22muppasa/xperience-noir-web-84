
import React from 'react';

const CompanyTimeline = () => {
  const timelineEvents = [
    { year: "2018", description: "XPerience was founded with a single coding bootcamp and a vision to make tech education more accessible." },
    { year: "2019", description: "Launched our consulting division to help small businesses and nonprofits establish effective online presences." },
    { year: "2020", description: "Pivoted to virtual learning during the pandemic and expanded our reach to students nationwide." },
    { year: "2022", description: "Established our scholarship program to support students from underrepresented groups in tech." },
    { year: "2024", description: "Celebrating our growth to over 4,500 graduates and 200+ business clients across the country." },
  ];

  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4 md:mb-6">Our Journey</h2>
          <p className="text-base md:text-lg text-gray-600">
            Since our founding in 2018, we've been committed to making technology education accessible and helping businesses succeed in the digital economy.
          </p>
        </div>
        
        <div className="space-y-8 md:space-y-12">
          {timelineEvents.map((event, index) => (
            <div key={event.year} className="relative pl-8 md:pl-0">
              {/* Timeline line - hidden on mobile, visible on md+ screens */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-px bg-gray-300"></div>
              
              <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                {index % 2 === 0 ? (
                  <>
                    <div className="md:text-right md:pr-8 relative mb-4 md:mb-0">
                      {/* Timeline dot - hidden on mobile, visible on md+ screens */}
                      <div className="hidden md:block absolute right-0 top-0 transform translate-x-1/2 w-4 h-4 bg-black rounded-full"></div>
                      <h3 className="text-lg md:text-xl font-medium mb-2">{event.year}</h3>
                      <p className="text-sm md:text-base text-gray-600">
                        {event.description}
                      </p>
                    </div>
                    <div className="md:pl-8"></div>
                  </>
                ) : (
                  <>
                    <div className="md:pr-8"></div>
                    <div className="md:pl-8 relative">
                      {/* Timeline dot - hidden on mobile, visible on md+ screens */}
                      <div className="hidden md:block absolute left-0 top-0 transform -translate-x-1/2 w-4 h-4 bg-black rounded-full"></div>
                      <h3 className="text-lg md:text-xl font-medium mb-2">{event.year}</h3>
                      <p className="text-sm md:text-base text-gray-600">
                        {event.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyTimeline;
