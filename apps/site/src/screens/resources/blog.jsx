import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Page, Hero, Sec, Cta, L, I, cardHover, Code } from "../../components/kit";
import { posts } from "../../data/posts";

export const Blog = () => {
  const tags = ["All", ...new Set(posts.map((p) => p.tag))];
  const [tag, setTag] = useState("All");
  const list = tag === "All" ? posts : posts.filter((p) => p.tag === tag);

  return (
    <Page>
      <Hero pill="Blog" title="Guides and ideas for" accent="running things online" sub="Practical articles on hosting, servers, security and performance, written by the people who run the infrastructure." />
      <Sec>
        <div className="flex flex-wrap gap-2 mb-space-lg">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t)}
              className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-colors ${tag === t ? "bg-primary-container text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {list.map((p) => (
            <L key={p.slug} href={`/blog/${p.slug}`} className={`flex flex-col p-space-lg ${cardHover}`}>
              <div className="w-full h-28 rounded-lg bg-gradient-to-br from-primary-container/90 to-secondary flex items-center justify-center text-on-primary mb-space-md">
                <I n={p.icon} c="text-[44px]" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-secondary-container/50 text-on-secondary-container font-mono-code text-[11px] font-semibold">{p.tag}</span>
                <span className="font-body-sm text-[12px] text-on-surface-variant">{p.read}</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">{p.title}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed flex-1">{p.excerpt}</p>
              <span className="mt-space-md font-label-md text-label-md text-primary font-semibold inline-flex items-center gap-1">Read article <I n="arrow_forward" c="text-[16px]" /></span>
            </L>
          ))}
        </div>
      </Sec>
    </Page>
  );
};

export const BlogPost = () => {
  const { slug } = useParams();
  const i = posts.findIndex((p) => p.slug === slug);
  const p = posts[i];

  if (!p)
    return (
      <Page>
        <Hero pill="Blog" title="Article not" accent="found" sub="That article does not exist or has moved.">
          <div className="mt-space-lg"><L href="/blog" className="text-primary font-semibold hover:underline">Back to the blog</L></div>
        </Hero>
      </Page>
    );

  const next = posts[(i + 1) % posts.length];

  return (
    <Page>
      <Hero pill={p.tag} title={p.title} sub={p.excerpt}>
        <div className="mt-space-sm font-mono-code text-label-sm text-on-surface-variant">{p.date} · {p.read}</div>
      </Hero>
      <section className="relative w-full py-space-xl">
        <div className="relative max-w-3xl mx-auto px-margin-mobile lg:px-margin">
          <article className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-lg lg:p-space-xl flex flex-col gap-space-md">
            {p.body.map((b, k) =>
              typeof b === "string" ? (
                <p key={k} className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{b}</p>
              ) : b.h ? (
                <h2 key={k} className="font-headline-md text-headline-md font-bold text-on-surface mt-space-sm">{b.h}</h2>
              ) : (
                <Code key={k} title="terminal">{b.code}</Code>
              ),
            )}
          </article>
          <div className="mt-space-lg flex flex-col sm:flex-row items-stretch justify-between gap-space-md">
            <L href="/blog" className="inline-flex items-center gap-1 font-label-lg text-label-lg text-primary font-semibold hover:underline"><I n="arrow_back" c="text-[18px]" />All articles</L>
            <L href={`/blog/${next.slug}`} className="inline-flex items-center gap-1 font-label-lg text-label-lg text-primary font-semibold hover:underline">Next: {next.title}<I n="arrow_forward" c="text-[18px]" /></L>
          </div>
        </div>
      </section>
      <Cta title="Need help putting this into practice?" text="Our engineers are on chat, phone and tickets around the clock." primary={["Open a ticket", "/support"]} secondary={["Contact us", "/contact"]} />
    </Page>
  );
};
