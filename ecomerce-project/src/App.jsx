/* ═══════════════════════════════════════════════════════════════
   ───────────────────────────────────────────────────────────────
   MODE ACTUEL : développement (pas de barrière d'authentification)
   Pour activer l'auth en production → voir section "DÉPLOIEMENT"
   en bas de ce fichier.
   ═══════════════════════════════════════════════════════════════ */

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './config/routes';
import './App.css';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}