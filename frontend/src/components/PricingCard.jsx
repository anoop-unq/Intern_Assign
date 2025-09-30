import React from 'react';

const PricingCard = ({ plan }) => {
  return (
    <div className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
      plan.popular 
        ? 'border-blue-500 scale-105 ring-2 ring-blue-200' 
        : 'border-gray-200'
    }`}>
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
          <div className="text-4xl font-bold text-blue-600 mb-4">{plan.price}</div>
        </div>
        
        {/* Features List */}
        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start text-gray-600">
              {/* Tailwind CSS Check Icon */}
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1 bg-white transform rotate-45 translate-y-[1px] -translate-x-[1px]"></div>
                <div className="w-3 h-1 bg-white transform -rotate-45 translate-y-[1px] translate-x-[1px]"></div>
              </div>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        {/* CTA Button */}
        <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
          plan.popular
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:shadow-md'
        }`}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default PricingCard;