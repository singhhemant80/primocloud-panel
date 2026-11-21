import { useLayoutEffect } from "react";
import Topbar from "./topbar";
import Footer from "./footer";

/**
 * The topbar is `position: fixed`, so it takes no space in the flow. <main> is
 * pushed down by the topbar's real height (--header-h) so page content - and
 * every page's hero - starts BELOW it instead of hiding behind it.
 *
 * index.css provides fallback values for --header-h; this effect keeps it exact
 * if the topbar's height ever changes (edits, font load, breakpoint change).
 */
const Layout = ({ children }) => {
  useLayoutEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const root = document.documentElement;
    const sync = () => {
      // The top offer strip collapses once you scroll; only measure the
      // expanded state so the layout doesn't jump while scrolling.
      if (window.scrollY > 8) return;
      root.style.setProperty("--header-h", `${header.offsetHeight}px`);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar />
      <main className="pc-main flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
