import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import IntroAnimation from '../../components/landing/IntroAnimation';
import Navbar from '../../components/landing/Navbar';
import Hero from '../../components/landing/Hero';
import PhotoStrip from '../../components/landing/PhotoStrip';
import Features from '../../components/landing/Features';
import RopeGallery from '../../components/landing/RopeGallery';
import Testimonials from '../../components/landing/Testimonials';
import Pricing from '../../components/landing/Pricing';
import Footer from '../../components/landing/Footer';

function RevealSection({ children, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {children}
        </motion.div>
    );
}

export default function LandingPage() {
    const [introComplete, setIntroComplete] = useState(false);
    return (
        <>
            <AnimatePresence>
                {!introComplete && <IntroAnimation onComplete={() => setIntroComplete(true)} />}
            </AnimatePresence>
            <AnimatePresence>
                {introComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.9 }}
                        style={{ minHeight: '100vh', background: 'var(--bg)' }}
                    >
                        <Navbar />
                        <motion.div
                            initial={{ opacity: 0, y: 56 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.1, delay: 0.2 }}
                        >
                            <Hero />
                        </motion.div>
                        <RevealSection delay={0.05}><PhotoStrip /></RevealSection>
                        <RevealSection delay={0.08}><Features /></RevealSection>
                        <RevealSection delay={0.05}><RopeGallery /></RevealSection>
                        <RevealSection delay={0.05}><Testimonials /></RevealSection>
                        <RevealSection delay={0.05}><Pricing /></RevealSection>
                        <RevealSection><Footer /></RevealSection>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
