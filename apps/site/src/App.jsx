import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Layout from "./components/layout";
import { BackgroundFX } from "./components/fx";
import Homepage from "./screens/Homepage";
import TallyOnCloud from "./screens/vps/tallyoncloud";
import Windows from "./screens/vps/windows";
import Linux from "./screens/vps/linux";
import ResellerHosting from "./screens/hosting/resellerHosting";
import SharedHosting from "./screens/hosting/sharedHosting";
import Forex from "./screens/vps/forex";
import DedicatedServer from "./screens/servers/dedicatedserver";
import GoldVps from "./screens/vps/goldvps";
import N8n from "./screens/vps/n8n";
import GpuServer from "./screens/servers/gpuserver";
import Colocation from "./screens/servers/colocation";
import WordpressHosting from "./screens/hosting/wordpressHosting";
import Support from "./screens/support";
import ChatWidget from "./components/chatbot";
import LoginModal from "./components/loginmodal";
import Refund from "./screens/legal/refund";
import Privacy from "./screens/legal/privacy";
import Terms from "./screens/legal/terms";
import Aup from "./screens/legal/aup";
import Sla from "./screens/legal/sla";
import About from "./screens/company/about";
import Contact from "./screens/company/contact";
import Careers from "./screens/company/careers";
import Datacenters from "./screens/company/datacenters";
import Partner from "./screens/company/partner";
import Login from "./screens/company/login";
import { Blog, BlogPost } from "./screens/resources/blog";
import KnowledgeBase from "./screens/resources/knowledgeBase";
import Tutorials from "./screens/resources/tutorials";
import ServerStatus from "./screens/resources/serverStatus";
import ApiDocs from "./screens/resources/apiDocs";
import { CloudHosting, BusinessCloud, StorageSolutions, ManagedKubernetes } from "./screens/cloud/cloudPages";

const ComingSoon = () => (
  <Layout>
    <section className="relative min-h-[80vh] overflow-hidden bg-slate-950 flex items-center">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="container-x relative mx-auto w-full px-6 py-5">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Launching Soon
          </div>

          {/* Heading */}
          <div className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
            Something Powerful
            <span className="block text-green-400">Is Coming Soon</span>
          </div>

          {/* Description */}
          <div className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-sm">
            We're working on something amazing for you. This service is
            currently under development and will be available soon. Stay tuned
            for a faster, more secure and reliable hosting experience.
          </div>

          {/* Feature Cards */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-sm">
              <div className="text-2xl">⚡</div>
              <h3 className="mt-3 font-semibold text-white">
                High Performance
              </h3>
              <p className="mt-1 text-sm text-slate-500">Built for speed</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-sm">
              <div className="text-2xl">🔒</div>
              <h3 className="mt-3 font-semibold text-white">Secure</h3>
              <p className="mt-1 text-sm text-slate-500">
                Enterprise-grade security
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-sm">
              <div className="text-2xl">🚀</div>
              <h3 className="mt-3 font-semibold text-white">Ready to Scale</h3>
              <p className="mt-1 text-sm text-slate-500">Grow without limits</p>
            </div>
          </div>

          {/* Button */}
          <div className="mt-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-7 py-3.5 font-semibold text-slate-950 shadow-lg shadow-green-500/20 transition-all duration-300 hover:bg-green-400 hover:shadow-green-500/30"
            >
              Back to Home
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>

          {/* Bottom Text */}
          <p className="mt-8 text-xs text-slate-600">
            Thank you for your patience. We can't wait to show you what's
            coming.
          </p>
        </div>
      </div>
    </section>
  </Layout>
);

// SPA navigation keeps the old scroll position. Start every page at the top, or
// jump to the #anchor (e.g. /#vps-plans) once the new page has rendered.
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const t = setTimeout(
      () => document.getElementById(hash.slice(1))?.scrollIntoView(),
      80,
    );
    return () => clearTimeout(t);
  }, [pathname, hash]);
  return null;
};

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <BackgroundFX />
    <Routes>
      <Route path="/" element={<Homepage />} />

      <Route path="/support" element={<Support />} />

      <Route path="/vps/windows-vps" element={<Windows />} />

      <Route path="/vps/linux-vps" element={<Linux />} />

      <Route path="/vps/forex-vps" element={<Forex />} />

      <Route path="/vps/gold-vps" element={<GoldVps />} />

      <Route path="/vps/n8n-vps" element={<N8n />} />

      <Route path="/hosting/reseller-hosting" element={<ResellerHosting />} />

      <Route path="/hosting/shared-hosting" element={<SharedHosting />} />

      <Route path="/hosting/wordpress-hosting" element={<WordpressHosting />} />

      <Route path="/server/dedicated-servers" element={<DedicatedServer />} />

      <Route path="/server/gpu-servers" element={<GpuServer />} />

      <Route path="/server/colocation" element={<Colocation />} />

      <Route path="/cloud-solution/tally-on-cloud" element={<TallyOnCloud />} />

      {/* Legal */}
      <Route path="/refund-policy" element={<Refund />} />
      <Route path="/privacy-policy" element={<Privacy />} />
      <Route path="/privacy-and-policy" element={<Privacy />} />
      <Route path="/terms-conditions" element={<Terms />} />
      <Route path="/terms-and-conditions" element={<Terms />} />
      <Route path="/acceptable-use" element={<Aup />} />
      <Route path="/sla" element={<Sla />} />

      {/* Company */}
      <Route path="/about-us" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/datacenters" element={<Datacenters />} />
      <Route path="/partner-program" element={<Partner />} />
      <Route path="/login" element={<Login />} />

      {/* Resources */}
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/knowledge-base" element={<KnowledgeBase />} />
      <Route path="/tutorials" element={<Tutorials />} />
      <Route path="/server-status" element={<ServerStatus />} />
      <Route path="/api-docs" element={<ApiDocs />} />

      {/* Cloud solutions */}
      <Route path="/cloud-hosting" element={<CloudHosting />} />
      <Route path="/business-cloud" element={<BusinessCloud />} />
      <Route path="/storage-solutions" element={<StorageSolutions />} />
      <Route path="/managed-kubernetes" element={<ManagedKubernetes />} />

      {/* Coming Soon for unavailable pages */}
      <Route path="*" element={<ComingSoon />} />
    </Routes>
    <ChatWidget />
    <LoginModal />
  </BrowserRouter>
);

export default App;
