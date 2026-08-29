import React from 'react';

/**
 * Testimonials Component
 * Displays student success stories with profile cards
 */

const TESTIMONIALS = [
    {
        name: 'Shreya Prasad',
        role: 'Software Engineer 2',
        company: 'Uber',
        companyColor: '#00d26a',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        linkedin: 'https://linkedin.com',
        testimonial: 'HireViva helped me master the core concepts, and the System Design course gave me the structure I needed to tackle tough interview questions. These resources played a big role in helping me land a Frontend Engineer role at Uber. Thank you, HireViva!'
    },
    {
        name: 'Abhay Goel',
        role: 'Analyst',
        company: 'Goldman Sachs',
        companyColor: '#7c3aed',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        linkedin: 'https://linkedin.com',
        testimonial: "I joined Goldman Sachs as a Frontend Developer Analyst with a 160% salary hike. HireViva's JavaScript and React courses made a huge impact on my learning. They helped me understand the core concepts clearly and crack all four interview rounds. Big thanks to the team!"
    },
    {
        name: 'Saurabh Singh',
        role: 'Senior Software Engineer',
        company: 'Fivetran',
        companyColor: '#06b6d4',
        image: 'https://randomuser.me/api/portraits/men/75.jpg',
        linkedin: 'https://linkedin.com',
        testimonial: "A big thanks to HireViva and the team! The React course was a game-changer. It gave me the confidence to switch to a React Developer role and helped me land a 95% salary hike. HireViva's way of simplifying complex topics completely changed how I approach frontend development. Truly grateful!"
    },
    {
        name: 'Priya Sharma',
        role: 'Software Development Engineer',
        company: 'Adobe',
        companyColor: '#ff0000',
        image: 'https://randomuser.me/api/portraits/women/68.jpg',
        linkedin: 'https://linkedin.com',
        testimonial: "HireViva's DSA course and mock interviews were instrumental in my preparation. The structured approach helped me crack Adobe's interview in my first attempt. The mentorship and guidance I received here were invaluable. Highly recommend to anyone preparing for tech interviews!"
    },
    {
        name: 'Rahul Verma',
        role: 'Backend Developer',
        company: 'Swiggy',
        companyColor: '#fc8019',
        image: 'https://randomuser.me/api/portraits/men/52.jpg',
        linkedin: 'https://linkedin.com',
        testimonial: "From struggling with coding problems to landing my dream job at Swiggy - HireViva made it possible. The problem-solving techniques and the aptitude preparation gave me an edge over other candidates. Got a 120% salary hike! Forever grateful to this platform."
    },
    {
        name: 'Ananya Reddy',
        role: 'Full Stack Developer',
        company: 'Razorpay',
        companyColor: '#528ff0',
        image: 'https://randomuser.me/api/portraits/women/33.jpg',
        linkedin: 'https://linkedin.com',
        testimonial: "The comprehensive curriculum at HireViva covered everything from basics to advanced topics. The AI interview practice sessions were exactly what I needed to build confidence. Successfully cracked Razorpay's interview and now working on exciting fintech products!"
    }
];

const LinkedInIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a66c2">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const Testimonials = () => {
    return (
        <section className="testimonials-section">
            <div className="testimonials-container">
                {/* Heading */}
                <h2 className="testimonials-heading">
                    Hear From Our Students, Who've Cracked Big{' '}
                    <span className="gradient-text">Tech Companies</span>
                </h2>

                {/* Subtext */}
                <p className="testimonials-subtext">
                    Nothing speaks louder than the voices of our learners. Discover stories of transformation, growth, and success directly from students.
                </p>

                {/* Testimonial Cards Grid */}
                <div className="testimonials-grid">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <div key={index} className="testimonial-card">
                            {/* Card Header - Profile Info */}
                            <div className="testimonial-header">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="testimonial-avatar"
                                />
                                <div className="testimonial-info">
                                    <div className="testimonial-name-row">
                                        <h3 className="testimonial-name">{testimonial.name}</h3>
                                        <a
                                            href={testimonial.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="linkedin-link"
                                        >
                                            <LinkedInIcon />
                                        </a>
                                    </div>
                                    <p className="testimonial-role">{testimonial.role}</p>
                                    <p
                                        className="testimonial-company"
                                        style={{ color: testimonial.companyColor }}
                                    >
                                        {testimonial.company}
                                    </p>
                                </div>
                            </div>

                            {/* Testimonial Text */}
                            <p className="testimonial-text">{testimonial.testimonial}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
