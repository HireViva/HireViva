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
    { name: 'Uber', logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPUAAACUCAMAAAB8x5+oAAAAY1BMVEUAAAD///8TExOjo6OsrKz8/Pz09PSMjIx7e3vFxcVubm4cHBw1NTUmJiZGRkbd3d3k5OROTk7u7u7W1tY/Pz+WlpbMzMyGhoa5ubkKCgpcXFwrKytzc3OdnZ1VVVWysrJkZGQuJtUhAAAHmklEQVR4nO2b7bayLBCGK0UlNb8/Mk3P/yhfK9MBAaG93W/PWnP/SwXnwgGGgQ4HFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQqD/XQMtZnV6R+1KirE7TRW+5Zue7Wftb8o6LqF6RMyjSv6mt5Vqc7Gbtb8kjP6K2BdQRUn+nkBqpFUJqpEbqLxdSI7VCSI3USP3lQmqkVgiptamvv2Xwr2h3aj85e5VbdEXhVm0TmFt4Soa2esprh49ScmEw6gav7Esdnq06S+dXODG1XCP/Dz2rz2JnLl/a3eDLHk7cwp1UzNcqy67pKCv8I+rcKuMjLyeqPV13v9tluqogLjuJx7gOmTWZSqN3i2XwY+9H7dsxqJsBzyqd9yR1Kq6AxPNrOerlkcfvCwVtlv3Jt66co1wkvmy95dpL2uzVcKJ246hbxtH+gtqPFCY/1W+8RMX8fMt6YGOpK7aG/amvmzaPiht5977Z2+XTindzhtrjTNid+l6ovBuYLRuNk1KnPLG48pA64YfBvanjWgt67JydGLvZ7B7vt7PeAqiPGf/s3tT6cqwfQfODg6tq7b+mTst+jMwsGq07OynW1V9W0E5puVXldnQ9+zPbsN9DnRb3/Oafrlc/DC4tXd0f+NpDvk/Tcx48e8Lplt/51xBYXkIdZw/VsDftSx3xUCd+cCb8QMxVREP2ts/dT0F5EXV/FyHsSR17gtInyjp6xN5uWCaBzTnrDMDoFTWpJQj7UZNaskCqmEmFMCPaFRpO+A89PWPBdnOWpuWp07MMYTdqYkmDkIEZlWL4PWE1pL5JKiggdjk3DUcdN1KE3agFo/Msdm7ql+bJgd2kli/GO1B8CclZ6lTUv3amVp/suUP74mG+XoPLgkD7IHyQvl2CoSa2Yj27EzUVLgUXtfDhuWfnwPUdaad8KARmO+10kaFWNto+1OlmwgR+rOz9NBymZMPvJNhs784EqYlyTbcPtaJLvQUHpKln+iB4djaKh+DZbFqsQ+pUuYDfhbrUSOpV4Pn+NQyfgYPbW+XBxybTYA2pI2XhXahdjVoCMGtPmRU4MssmrVkJaKLJtSC1uoPsQR0Jo0BOJ1ji9bFAX483y/sgtu1fMTakVjf8HtQbA5GgmufHgqGm7QcburnL01P+E1IrZ4A9qEXLR4GSiKsGhmxptCn4dLCiVrvbDtTy8JfRDTj0M6ps17lvXeU8NVHnYPfIm21mfZ+6gsErfrgoHNUNdfn/qUvplgwr0DHTB3XxOXXyBdR61UBqJ/gZdbM/NQwG/1Hqszk1/PvAP0rdAOpSmLrgdYXWiaizD/s1+L03dQ6otWKqQwiXSz84oQGDs9cYDkwhRjKmhmsfVfZhUQATIcL5ulWWfwvO15Sfr/OTb6KrKTVciQu3Ingl0LWEsZneP6TuILiyHtXcQXPqhXecDKhhnlWck+Tr3qI+1huJlJfgVPD0jgDsEagXijLL9Knh2KQVSzIJTiE1SITJBddMU7/swZVPziwZUOcQott+GZumF6+vdfwzgBuQrzgaJnw/cXEDaiaVozH8slukYmqdURymEKxXLQ1cRn3wsU2o4UR0LLa6JAxHpdTHYtNmmOQk77kDjjGafxqFMqFmXJZsZby41aCEerMaBvCd7WNcfPu8zkom1OzBmVgdWPHbrLJ8+FZ8xkSfcx8O4UiZbfiLm/H9yISaW9dSxcuuNr/xLt37UGeRWmYwWUJCZp+3V2KPy6bUY/ujEXXOHgGwpelJv1ttEMv3uTrF3H+G/QRuavrsDYXDeE9TLKYnGVFfubC/lozAN3u9K67Yye1lffvEbuUyWzOM3xHxEcIFelwwwQjDiJrfBz9mwoOeQyk4RKbatS8H4du4xiPsKUFmYiRU3HI3a64iBbOOGfXB40Zmh65WX0EvzOUpzyqkIhdtM7bxuAEgYe/GopOTLfxKhM6uaUjNxIIv7pJZODW1JH+pPpdCUn7WbTKulzi8W3E5QxLxK7imZKtYkpOm1IfVobTH++yqueR3ryvX/VmP+iHazi54sdZtt/KG06omB5yoSWz+9FU6zDeNqQP9k22G1A8TopLSbH1YbLwjyGOEK8d7sGUlLTOBw8HFvDH14SIySix4alu4vtY8UCnbmQ9qjbO37xpgIsScmtmAUap0QZML82ad5iZGLEm6BKtgSFoDk/35gFrzoO6RXhrwLYU50pCfE8TKBpkpfqGHzdXwCbVeE9vBYdjw8Cwch+rtmnqVYWeNDkf4Gj6iPpy8rXfFj8hXg/oQdOvCjJyzOlt12TyEnHr8+P8Z9citNtZ+7pjqUI8Bn/Jz29sZuru6x3XraPVT6of5RPLHGqefliV61KPZmbQmrXTi4UIdWQ3CbC7cvzZenbtlzM89JI2Wtm3iWel8tVgu1vN3vNcR/+ckJ85czb2RUWER8bYQJ6aSvH0VLUaY5yQOedWXWZw6DiFOGkdlXcBo4hrOus0A/nIROu+ptelSU1bWrqk5F7enWRSnD42mUNuTroRPwDDDt7wVDG3lFoXrnRM9f5TX1Dxrqtoh//A/qmEytJ7nnYeLvpugUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoX6Lv0HiO15/u+NwDUAAAAASUVORK5CYII=' },
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
