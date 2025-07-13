import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Routes, Route, Navigate } from 'react-router-dom';

// --- ICONS (using SVG for self-containment) ---
const MailIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
);
const LinkedinIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const CodeIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
);
const BrainCircuitIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.73c0 .27.16.58.67.5A10 10 0 0 0 22 12 10 10 0 0 0 12 2Z"></path></svg>
);
const BriefcaseIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);
const GraduationCapIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
);
const StarIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);
const CompassIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
);

// --- HOOKS ---

// Custom hook to detect when an element is on screen
const useOnScreen = (options) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                // Optional: unobserve after it's visible once
                // observer.unobserve(entry.target);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return [ref, isVisible];
};

// Custom hook for the typing effect
const useTypingEffect = (text, speed = 100) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        setDisplayedText(''); // Reset on text change
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, speed);

        return () => clearInterval(typingInterval);
    }, [text, speed]);

    return displayedText;
};


// --- COMPONENTS ---

const Starfield = () => {
    // This component creates a cool, animated starfield background
    useEffect(() => {
        const canvas = document.getElementById('starfield');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = document.body.scrollHeight; // Make canvas as tall as the page
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const stars = [];
        const numStars = 400; // More stars for a denser field

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random(),
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2
            });
        }

        let animationFrameId;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            stars.forEach(star => {
                star.x += star.vx;
                star.y += star.vy;

                if (star.x < 0 || star.x > canvas.width) star.vx = -star.vx;
                if (star.y < 0 || star.y > canvas.height) star.vy = -star.vy;

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.fill();
            });
            
            animationFrameId = requestAnimationFrame(animate);
        }

        animate();
        
        // Recalculate canvas size on content changes
        const observer = new MutationObserver(resizeCanvas);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        }
    }, []);

    return <canvas id="starfield" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, width: '100%', height: '100%' }}></canvas>;
};

const AnimatedSection = ({ children }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.2 });
    return (
        <section
            ref={ref}
            className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            {children}
        </section>
    );
};

const Header = () => {
    const { t } = useTranslation();
    const typedTitle = useTypingEffect(t('title'), 70);
    return (
        <header className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative z-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900 via-gray-900/80 to-transparent"></div>
            <div className="relative z-10">
                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-4">
                    {t('name')}
                </h1>
                <p className="text-xl md:text-2xl text-teal-400 font-mono h-8">
                    {typedTitle}
                    <span className="animate-ping">_</span>
                </p>
                <div className="mt-6 max-w-3xl mx-auto text-gray-300 text-lg leading-relaxed space-y-4">
                   {t('about', { returnObjects: true }).map((paragraph, index) => (
                       <p key={index}>{paragraph}</p>
                   ))}
                </div>
                <div className="mt-8 flex justify-center items-center space-x-6">
                    <a href={`mailto:${t('contact.email')}`} className="group flex items-center space-x-2 text-teal-400 hover:text-white transition-colors duration-300 bg-teal-400/10 hover:bg-teal-400/20 px-4 py-2 rounded-lg">
                        <MailIcon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                        <span className="font-semibold">{t('buttons.email_me')}</span>
                    </a>
                    <a href={t('contact.linkedin')} target="_blank" rel="noopener noreferrer" className="group flex items-center space-x-2 text-teal-400 hover:text-white transition-colors duration-300 bg-teal-400/10 hover:bg-teal-400/20 px-4 py-2 rounded-lg">
                        <LinkedinIcon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                        <span className="font-semibold">{t('buttons.linkedin')}</span>
                    </a>
                </div>
            </div>
        </header>
    );
}

const SectionTitle = ({ icon, children }) => {
    const IconComponent = icon;
    return (
        <div className="flex items-center justify-center space-x-4 mb-12">
            <IconComponent className="w-10 h-10 text-teal-400" />
            <h2 className="text-4xl font-bold text-white text-center">{children}</h2>
        </div>
    );
};

const TimelineItem = ({ item, icon }) => {
    const IconComponent = icon;
    return (
        <div className="relative pl-12 pb-12">
            <div className="absolute left-0 top-1.5 w-6 h-6 bg-gray-800 border-2 border-teal-400 rounded-full flex items-center justify-center">
                <IconComponent className="w-3 h-3 text-teal-400" />
            </div>
            <div className="absolute left-3 top-8 w-px h-full bg-teal-400/30"></div>
            <p className="text-gray-400 text-sm mb-1">{item.period}</p>
            <h3 className="font-bold text-white text-xl">{item.role || item.degree}</h3>
            <p className="text-teal-400 font-medium">{item.company || item.institution}</p>
            {item.description && <p className="text-gray-300 mt-2">{item.description}</p>}
        </div>
    );
};

function Portfolio() {
    const { t } = useTranslation();
    const portfolioData = {
        skills: t('skills.items', { returnObjects: true }),
        experience: t('experience.items', { returnObjects: true }),
        projects: t('projects.items', { returnObjects: true }),
        education: t('education.items', { returnObjects: true }),
        approach: t('approach.items', { returnObjects: true }),
    }
    return (
        <div className="bg-gray-900 text-gray-200 font-sans relative">
            <Starfield />
            <div className="relative z-10">
                <Header />
                
                <main className="container mx-auto px-4 py-16 space-y-24">
                    <AnimatedSection>
                        <SectionTitle icon={CompassIcon}>{t('approach.title')}</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {portfolioData.approach.map(item => (
                                <div key={item.title} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 transform hover:-translate-y-1">
                                    <h3 className="text-xl font-bold text-teal-400 mb-2">{item.title}</h3>
                                    <p className="text-gray-300">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>

                    <AnimatedSection>
                        <SectionTitle icon={BrainCircuitIcon}>{t('skills.title')}</SectionTitle>
                        <div className="space-y-6">
                            {Object.entries(portfolioData.skills).map(([category, skillsList]) => (
                                <div key={category} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                                    <h3 className="font-semibold text-teal-400 mb-4 text-lg">{t(`skills.categories.${category}`)}</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {skillsList.map(skill => (
                                            <span key={skill} className="bg-gray-700 text-gray-200 text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 hover:bg-teal-500 hover:text-gray-900 cursor-default">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                    
                    <AnimatedSection>
                        <SectionTitle icon={CodeIcon}>{t('projects.title')}</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {portfolioData.projects.map(project => (
                                <div key={project.title} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/20 hover:border-teal-400/50 transform hover:-translate-y-2">
                                    <div className="p-6 flex-grow">
                                        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                        <p className="text-gray-300 mb-4 flex-grow">{project.description}</p>
                                    </div>
                                    <div className="p-6 bg-gray-900/50 border-t border-gray-700 group-hover:border-teal-400/30 transition-colors duration-300">
                                        <h4 className="text-sm font-semibold text-teal-400 mb-2">{t('projects.tech_stack')}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tech.map(t => (
                                                <span key={t} className="bg-teal-900/70 text-teal-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                    
                    <AnimatedSection>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                            <div>
                                <SectionTitle icon={BriefcaseIcon}>{t('experience.title')}</SectionTitle>
                                <div className="relative border-l-2 border-teal-400/30 ml-3">
                                    {portfolioData.experience.map(exp => <TimelineItem key={exp.role+exp.company} item={exp} icon={BriefcaseIcon} />)}
                                </div>
                            </div>
                            <div>
                                <SectionTitle icon={GraduationCapIcon}>{t('education.title')}</SectionTitle>
                                <div className="relative border-l-2 border-teal-400/30 ml-3">
                                    {portfolioData.education.map(edu => <TimelineItem key={edu.degree} item={edu} icon={GraduationCapIcon} />)}
                                </div>
                                <div className="mt-12">
                                    <h3 className="font-bold text-white text-xl flex items-center gap-3 mb-2"><StarIcon className="w-6 h-6 text-yellow-400"/>{t('certification.title')}</h3>
                                    <p className="text-gray-300">{t('certification.value')}</p>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </main>

                <footer className="text-center py-12 px-4 relative z-10 border-t border-gray-800">
                    <h2 className="text-3xl font-bold text-white mb-4">{t('footer.title')}</h2>
                    <p className="text-gray-400 max-w-xl mx-auto mb-8">
                        {t('footer.description')}
                    </p>
                    <div className="flex justify-center items-center space-x-6">
                        <a href={`mailto:${t('contact.email')}`} className="group flex items-center space-x-2 text-teal-400 hover:text-white transition-colors duration-300 bg-teal-400/10 hover:bg-teal-400/20 px-4 py-2 rounded-lg">
                            <MailIcon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                            <span className="font-semibold">{t('contact.email')}</span>
                        </a>
                    </div>
                     <p className="mt-12 text-gray-500">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
                </footer>
            </div>
        </div>
    );
}

const LanguageWrapper = () => {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return <Portfolio />;
};

const LoadingSpinner = () => (
  <div className="min-h-screen flex justify-center items-center bg-gray-900">
    <svg className="animate-spin h-10 w-10 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
);

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/:lang" element={<LanguageWrapper />} />
        <Route path="/" element={<Navigate to="/en" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
