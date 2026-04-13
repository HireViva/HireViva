import React from 'react';

/**
 * TrustedCompanies Component
 * 
 * Features TWO rows of company logos:
 * - Row 1: Scrolls LEFT → RIGHT
 * - Row 2: Scrolls RIGHT → LEFT
 * 
 * HOW THE INFINITE SCROLLING WORKS:
 * ---------------------------------
 * 1. Each row has duplicated logos (2 identical sets side by side)
 * 2. CSS keyframes animate the container by -50% (one full set width)
 * 3. When animation completes, it seamlessly resets - creating infinite loop
 * 4. Row 2 uses reverse animation (starts at -50%, ends at 0%)
 */

// Split companies into two rows for better visual distribution
const ROW_1_COMPANIES = [
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Atlassian', logo: 'https://cdn.worldvectorlogo.com/logos/atlassian-1.svg' },
    { name: 'Cisco', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg' },
    { name: 'Flipkart', logo: 'https://1000logos.net/wp-content/uploads/2021/02/Flipkart-logo.jpg' },
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Infosys', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
];

const ROW_2_COMPANIES = [
    { name: 'Accenture', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg' },
    { name: 'Yahoo', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Yahoo%21_%282019%29.svg' },
    { name: 'Zomato', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png' },
    { name: 'Oracle', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg' },
    { name: 'Paytm', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg' },
    { name: 'PhonePe', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg' },
    { name: 'Uber', logo: 'data:image/png;base64,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' },
];

const TrustedCompanies = () => {
    return (
        <section className="trusted-companies-section">
            <div className="trusted-container">
                {/* Badge */}
                <div className="trusted-badge">
                    TOP COMPANIES WHERE OUR STUDENTS WORK
                </div>

                {/* Heading with gradient text */}
                <h2 className="trusted-heading">
                    Trusted By Leading <span className="gradient-text">Companies</span>
                </h2>

                {/* Subtext paragraph */}
                <p className="trusted-subtext">
                    Our students have gone on to build careers at some of the world's most renowned organizations.
                    Their success is proof that the skills you gain here open doors to top opportunities across the industry.
                </p>

                {/* Logo Slider Container */}
                <div className="logo-sliders-container">

                    {/* ROW 1: Scrolls Left to Right */}
                    <div className="logo-slider-wrapper">
                        <div className="slider-fade-left" />
                        <div className="slider-fade-right" />
                        <div className="logo-slider-track scroll-left-to-right">
                            {/* First set of logos */}
                            {ROW_1_COMPANIES.map((company, index) => (
                                <div key={`r1-first-${index}`} className="logo-item">
                                    <img
                                        src={company.logo}
                                        alt={`${company.name} logo`}
                                        title={company.name}
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                            {/* Duplicate for seamless loop */}
                            {ROW_1_COMPANIES.map((company, index) => (
                                <div key={`r1-second-${index}`} className="logo-item">
                                    <img
                                        src={company.logo}
                                        alt={`${company.name} logo`}
                                        title={company.name}
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ROW 2: Scrolls Right to Left (opposite direction) */}
                    <div className="logo-slider-wrapper">
                        <div className="slider-fade-left" />
                        <div className="slider-fade-right" />
                        <div className="logo-slider-track scroll-right-to-left">
                            {/* First set of logos */}
                            {ROW_2_COMPANIES.map((company, index) => (
                                <div key={`r2-first-${index}`} className="logo-item">
                                    <img
                                        src={company.logo}
                                        alt={`${company.name} logo`}
                                        title={company.name}
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                            {/* Duplicate for seamless loop */}
                            {ROW_2_COMPANIES.map((company, index) => (
                                <div key={`r2-second-${index}`} className="logo-item">
                                    <img
                                        src={company.logo}
                                        alt={`${company.name} logo`}
                                        title={company.name}
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TrustedCompanies;
