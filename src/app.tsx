import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { SiteHeader } from '@components/site-header';
import { HomePage } from '@home-page';
import { ProjectPage } from '@project-page';
import { ProjectsArchivePage } from '@projects-archive-page';
import { NotFoundPage } from '@not-found-page';
import { ScrollToTop } from '@components/scroll-to-top';
import { AdminPage } from '@admin-page';
import i18n, { languageFromPath } from '@i18n/index';
export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin-maloba';
  const language = languageFromPath(location.pathname);

  useEffect(() => {
    document.documentElement.lang = language;
    if (i18n.resolvedLanguage !== language) void i18n.changeLanguage(language);
  }, [language]);

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <SiteHeader />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/es" replace />} />
          <Route path="/es" element={<HomePage />} />
          <Route path="/en" element={<HomePage />} />
          <Route path="/es/projects" element={<ProjectsArchivePage />} />
          <Route path="/en/projects" element={<ProjectsArchivePage />} />
          <Route path="/es/projects/:slug" element={<ProjectPage />} />
          <Route path="/en/projects/:slug" element={<ProjectPage />} />
          <Route path="/projects/:slug" element={<LegacyProjectRedirect />} />
          <Route path="/admin-maloba" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function LegacyProjectRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/es/projects/${slug ?? ''}`} replace />;
}
