import { SessionProvider } from "@/lib/session";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { WhatsAppFab } from "@/components/whatsapp-fab";

export const metadata = { title: "Order" };
export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SiteHeader />
      <div className="min-h-[60vh] bg-gradient-to-b from-[#eefaf3] via-[#f6fbf8] to-[#f6fbf8]">{children}</div>
      <SiteFooter />
      <WhatsAppFab />
    </SessionProvider>
  );
}
