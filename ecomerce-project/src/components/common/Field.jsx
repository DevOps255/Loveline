import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const C = {
    primary:   '#9d174d',
    accent:    '#db2777',
    text:      '#500724',
    error:     '#be123c',
};

export default function Field({ icon: Icon, placeholder, type = 'text', value, onChange, error, name }) {
    const [focused, setFocused] = useState(false);
    const [showPwd, setShowPwd]  = useState(false);
    const isPwd = type === 'password';
    const actualType = isPwd ? (showPwd ? 'text' : 'password') : type;
    const hasError = !!error;

    return (
        <div style={{ width: '100%', marginBottom: '4px' }}>
            <motion.div
                animate={{
                    boxShadow: hasError ? `0 0 0 2px ${C.error}55` : focused ? `0 0 0 2px ${C.accent}44, 0 4px 20px rgba(219,39,119,0.1)` : '0 2px 8px rgba(157,23,77,0.06)',
                }}
                transition={{ duration: 0.25 }}
                style={{
                    position: 'relative', display: 'flex', alignItems: 'center',
                    background: focused ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${hasError ? C.error + '66' : focused ? C.accent + '55' : 'rgba(255,255,255,0.75)'}`,
                    borderRadius: '14px', overflow: 'hidden', transition: 'background 0.25s',
                }}
            >
                <div style={{ paddingLeft: '16px', display: 'flex', alignItems: 'center', flexShrink: 0, color: hasError ? C.error : focused ? C.accent : C.primary, opacity: focused || hasError ? 1 : 0.45 }}>
                    <Icon size={16} />
                </div>
                <input
                    name={name} type={actualType} value={value} placeholder={placeholder}
                    onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    style={{ flex: 1, padding: '14px 12px', background: 'transparent', border: 'none', outline: 'none', fontFamily: "'Raleway', sans-serif", fontSize: '14px', color: C.text, width: '100%' }}
                />
                {isPwd && (
                    <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ padding: '0 14px', background: 'none', border: 'none', cursor: 'pointer', color: C.primary, opacity: 0.4 }}>
                        {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                )}
            </motion.div>
            <AnimatePresence>
                {hasError && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ fontFamily: "'Raleway', sans-serif", fontSize: '11px', color: C.error, paddingLeft: '16px', paddingTop: '4px' }}>
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}
