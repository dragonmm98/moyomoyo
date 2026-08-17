"use client";

import CouponCard from "./CouponCard";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "./i18n/LanguageProvider";
import { assetUrl } from "./site-config";

const ingredientImages = [
  assetUrl("/ingredient-peppermint.webp"),
  assetUrl("/ingredient-glycerin.webp"),
  assetUrl("/ingredient-amino.webp"),
  assetUrl("/ingredient-panthenol.webp"),
  assetUrl("/ingredient-allantoin.webp"),
];

function Logo({ light = false, homeLabel }: { light?: boolean; homeLabel: string }) {
  return (
    <a href="#top" className={`logo logo-image${light ? " logo-light" : ""}`} aria-label={homeLabel}>
      <Image
        src={assetUrl("/moyomoyo-logo.png")}
        alt="Moyomoyo"
        width={405}
        height={191}
        sizes={light ? "(max-width: 760px) 120px, 132px" : "(max-width: 760px) 96px, 112px"}
        loading={light ? "lazy" : "eager"}
        decoding="async"
      />
    </a>
  );
}

function IngredientSpotlight({
  ingredient,
  image,
  alt,
}: {
  ingredient: { number: string; name: string; role: string; note: string };
  image: string;
  alt: string;
}) {
  return (
    <article className="ingredient-spotlight">
      <figure className="ingredient-bubble"><Image src={image} alt={alt} width={1000} height={1000} sizes="(max-width: 760px) 74px, 102px" loading="lazy" decoding="async" /><span>{ingredient.number}</span></figure>
      <header><p>{ingredient.role}</p><h3>{ingredient.name}</h3><small>{ingredient.note}</small></header>
    </article>
  );
}

function NavLinks({ t }: { t: ReturnType<typeof useLanguage>["t"] }) {
  return (
    <>
      <a href="#product">{t.nav.product}</a>
      <a href="#brand-story">{t.nav.brandStory}</a>
      <a href="#promise">{t.nav.promise}</a>
      <a href="#review">{t.nav.review}</a>
      <a href="#purchase">{t.nav.purchase}</a>
      <a href="#qa">{t.nav.qa}</a>
      <a href="#contact">{t.nav.contact}</a>
    </>
  );
}

function Arrow() { return <span className="cta-arrow" aria-hidden="true"><i /></span>; }

export default function Home() {
  const { t, locale } = useLanguage();
  const reviewWallSrc = {
    en: "/global-reviews-grid.png",
    fil: "/global-reviews-grid-fil.png",
    ru: "/global-reviews-grid-ru.png",
  }[locale];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.qa.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <header className="main-header" id="top">
        <Logo homeLabel={t.nav.home} />
        <nav aria-label={t.nav.main}><NavLinks t={t} /></nav>
        <aside className="header-tools" aria-label={t.nav.tools}>
          <LanguageSwitcher />
          <a href="#purchase" aria-label={t.nav.bagAria}>{t.nav.bag} <span>0</span></a>
        </aside>
        <LanguageSwitcher className="lang-switch-header-mobile" />
        <details className="mobile-menu">
          <summary aria-label={t.nav.menu}>{t.nav.menu}</summary>
          <nav aria-label={t.nav.mobile}>
            <NavLinks t={t} />
          </nav>
        </details>
      </header>

      <main>

      <section className="hero" aria-labelledby="hero-title">
        <Image className="hero-image" src={assetUrl("/hero-mother-baby.png")} alt={t.hero.imageAlt} width={1672} height={941} sizes="100vw" loading="eager" fetchPriority="high" decoding="async" />
        <div className="hero-shade" aria-hidden="true" />
        <header className="hero-copy">
          <p className="overline">{t.hero.overline}</p>
          <h1 id="hero-title">{t.hero.title}<br />{t.hero.title2}<br /><em>{t.hero.titleEm}</em></h1>
          <p>{t.hero.body}</p>
          <a className="pill-button" href="#brand-story">{t.hero.cta} <Arrow /></a>
        </header>
        <a href="#brand-story" className="scroll-mark" aria-label={t.hero.scrollAria}><span>{t.hero.scroll}</span><i>↓</i></a>
      </section>

      <section className="belief" id="brand-story">
        <div className="belief-number">01</div>
        <div className="belief-copy">
          <p className="overline">{t.belief.overline}</p>
          <h2>{t.belief.title}<br /><em>{t.belief.titleEm}</em></h2>
          <blockquote>{t.belief.quote}<br />{t.belief.quote2}<br />{t.belief.quote3}</blockquote>
          <p className="body-copy">{t.belief.body}</p>
        </div>
        <div className="belief-aside"><span>{t.belief.asideKicker}</span><b>{t.belief.aside}</b><i>♡</i></div>
      </section>

      <section className="story-visual">
        <figure className="story-visual-image"><Image src={assetUrl("/global-baby-skin-science.png")} alt={t.story.imageAlt} width={1122} height={1402} sizes="(max-width: 760px) calc(100vw - 36px), 53vw" loading="lazy" decoding="async" /></figure>
        <div className="story-visual-copy">
          <p className="overline">{t.story.overline}</p>
          <h2>{t.story.title}<br />{t.story.title2}</h2>
          <p>{t.story.body}</p>
          <div className="micro-list">{t.story.points.map((point) => <span key={point}>{point}</span>)}</div>
        </div>
      </section>

      <section className="product" id="product">
        <header className="product-intro">
          <p className="overline">{t.product.overline}</p>
          <h2>{t.product.title}<br /><em>{t.product.titleEm}</em></h2>
          <p>{t.product.body}</p>
          <div className="product-facts"><span><b>50 ml</b>{t.product.factSerum}</span><span><b>86.8%</b>{t.product.factNatural}</span><span><b>0</b>{t.product.factFinish}</span></div>
          <small>{t.product.note}</small>
        </header>
        <figure className="product-photo"><Image src={assetUrl("/product-still-life.png")} alt={t.product.imageAlt} width={1536} height={1024} sizes="(max-width: 760px) 100vw, 59vw" loading="lazy" decoding="async" /></figure>
      </section>

      <section className="ingredients">
        <header className="section-title-row"><div><p className="overline">{t.ingredients.overline}</p><h2>{t.ingredients.title}<br />{t.ingredients.title2}</h2></div><p>{t.ingredients.intro}</p></header>
        <div className="ingredient-showcase" aria-label={t.ingredients.showcaseAria}>
          <div className="ingredient-list ingredient-list-left">
            {t.ingredients.items.slice(0, 3).map((ingredient, index) => (
              <IngredientSpotlight key={ingredient.number} ingredient={ingredient} image={ingredientImages[index]} alt={t.ingredients.itemAlt(ingredient.name)} />
            ))}
          </div>
          <figure className="ingredient-product">
            <div className="ingredient-product-halo" aria-hidden="true" />
            <Image src={assetUrl("/product-still-life.png")} alt={t.ingredients.imageAlt} width={1536} height={1024} sizes="(max-width: 760px) calc(100vw - 60px), 34vw" loading="lazy" decoding="async" />
            <figcaption><b>{t.ingredients.caption}</b><span>{t.ingredients.captionMeta}</span></figcaption>
          </figure>
          <div className="ingredient-list ingredient-list-right">
            {t.ingredients.items.slice(3).map((ingredient, index) => (
              <IngredientSpotlight key={ingredient.number} ingredient={ingredient} image={ingredientImages[index + 3]} alt={t.ingredients.itemAlt(ingredient.name)} />
            ))}
          </div>
          <div className="ingredient-benefits">
            <span><b>86.8%</b> {t.ingredients.benefitNatural}</span>
            <span><b>{t.ingredients.benefitMoisture}</b> {t.ingredients.benefitMoistureNote}</span>
            <span><b>{t.ingredients.benefitComfort}</b> {t.ingredients.benefitComfortNote}</span>
            <span><b>{t.ingredients.benefitDaily}</b> {t.ingredients.benefitDailyNote}</span>
          </div>
          <p className="ingredient-footnote">{t.ingredients.footnote}</p>
        </div>
      </section>

      <section className="promise" id="promise">
        <header className="promise-heading"><p className="overline">{t.promise.overline}</p><h2>{t.promise.title}<br />{t.promise.title2}</h2><p>{t.promise.intro}</p></header>
        <div className="promise-cards">
          {t.promise.cards.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
        </div>
        <div className="proof-grid">
          <figure className="proof-main">
            {locale === "en" ? (
              <Image src={assetUrl("/global-testing-certificates.png")} alt={t.promise.imageAlt} width={1254} height={1254} sizes="86vw" loading="lazy" decoding="async" />
            ) : (
              <div className="proof-panel">
                <header className="proof-intro">
                  <p>{t.promise.proofKicker}</p>
                  <h3>{t.promise.proofHeading}</h3>
                  <p>{t.promise.proofSub}</p>
                </header>
                <div className="proof-docs">
                  <article className="proof-doc">
                    <h4>{t.promise.sheetTitle}</h4>
                    <dl>
                      <div><dt>{t.promise.productNameLabel}</dt><dd>{t.promise.productName}</dd></div>
                      <div><dt>{t.promise.reportNoLabel}</dt><dd>{t.promise.reportNo}</dd></div>
                      <div><dt>{t.promise.testTypeLabel}</dt><dd>{t.promise.testType}</dd></div>
                      <div><dt>{t.promise.resultLabel}</dt><dd>{t.promise.result}</dd></div>
                      <div><dt>{t.promise.judgmentLabel}</dt><dd>{t.promise.result}</dd></div>
                    </dl>
                    <p>{t.promise.sheetSummary}</p>
                  </article>
                  <article className="proof-doc">
                    <h4>{t.promise.lab}</h4>
                    <p className="proof-doc-kicker">{t.promise.reportTitle}</p>
                    <ul>
                      {t.promise.assessments.map((item) => (
                        <li key={item.name}><span>{item.name}</span><b>{item.result}</b></li>
                      ))}
                    </ul>
                    <p><span>{t.promise.institutionLabel}</span> {t.promise.institution}</p>
                  </article>
                  <article className="proof-doc proof-cert">
                    <aside className="proof-seal" aria-hidden="true">
                      <small>{t.promise.sealTop}</small>
                      <b>{t.promise.sealCenter}</b>
                      <small>{t.promise.sealBottom}</small>
                    </aside>
                    <h4>{t.promise.certTitle}</h4>
                    <p className="proof-doc-kicker">{t.promise.certBy}</p>
                    <dl>
                      <div><dt>{t.promise.requestedLabel}</dt><dd>{t.promise.requested}</dd></div>
                      <div><dt>{t.promise.sampleLabel}</dt><dd>{t.promise.productName}</dd></div>
                      <div><dt>{t.promise.gradeLabel}</dt><dd>{t.promise.grade}</dd></div>
                    </dl>
                  </article>
                </div>
              </div>
            )}
            <figcaption><b>{t.promise.proofTitle}</b><span>{t.promise.proofNote}</span></figcaption>
          </figure>
        </div>
      </section>

      <section className="review" id="review">
        <header className="review-header"><div><p className="overline">{t.review.overline}</p><h2>{t.review.title}<br /><em>{t.review.titleEm}</em></h2></div><div className="rating"><b>4.9</b><span aria-label={t.review.stars}>★★★★★</span><small>{t.review.ratingNote}</small></div></header>
        <figure className="review-wall"><Image src={assetUrl(reviewWallSrc)} alt={t.review.wallAlt} width={1672} height={941} sizes="90vw" loading="lazy" decoding="async" /></figure>
        <div className="review-editorial">
          <figure className="before-after"><Image src={assetUrl("/before-after.png")} alt={t.review.beforeAlt} width={485} height={843} sizes="(max-width: 760px) calc(100vw - 32px), 23vw" loading="lazy" decoding="async" /><figcaption>{t.review.beforeCaption}<br /><span>{t.review.beforeNote}</span></figcaption></figure>
          <figure className="review-quote"><Image src={assetUrl("/global-real-reviews.png")} alt={t.review.quoteAlt} width={1122} height={1402} sizes="(max-width: 760px) calc(100vw - 32px), 44vw" loading="lazy" decoding="async" /><figcaption>{t.review.quote}</figcaption></figure>
          <figure className="review-event"><CouponCard /><figcaption>{t.review.couponCaption}<br /><span>{t.review.couponNote}</span></figcaption></figure>
        </div>
      </section>

      <section className="purchase" id="purchase">
        <header className="purchase-copy"><p className="overline">{t.purchase.overline}</p><h2>{t.purchase.title}<br />{t.purchase.title2}<br /><em>{t.purchase.titleEm}</em></h2><p>{t.purchase.body}</p><a className="pill-button pill-light" href={`mailto:hello@moyomoyo.co?subject=${encodeURIComponent(t.purchase.mailSubject)}`}>{t.purchase.cta} <Arrow /></a></header>
        <figure className="purchase-image"><Image src={assetUrl("/global-purchase-options.png")} alt={t.purchase.imageAlt} width={1122} height={1402} sizes="(max-width: 760px) calc(100vw - 32px), 59vw" loading="lazy" decoding="async" /></figure>
      </section>

      <section className="care-guide">
        <figure className="care-guide-image"><video autoPlay muted loop playsInline preload="none" poster={assetUrl("/product-still-life.png")} aria-label={t.care.videoAria}><source src={assetUrl("/how-to-apply.mp4")} type="video/mp4" /></video></figure>
        <div className="care-guide-copy"><p className="overline">{t.care.overline}</p><h2>{t.care.title}<br />{t.care.title2}</h2><ol>{t.care.steps.map((step) => <li key={step.title}><b>{step.title}</b><span>{step.text}</span></li>)}</ol></div>
      </section>

      <section className="qa" id="qa">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
        />
        <header className="qa-title"><p className="overline">{t.qa.overline}</p><h2>{t.qa.title}<br />{t.qa.title2}</h2><p>{t.qa.intro}</p></header>
        <div className="qa-list">
          {t.qa.faqs.map((faq, i) => <details key={faq.q} open={i === 0}><summary><span>0{i + 1}</span>{faq.q}<i>+</i></summary><p>{faq.a}</p></details>)}
        </div>
      </section>

      <section className="closing">
        <figure className="closing-image"><video autoPlay muted loop playsInline preload="none" poster={assetUrl("/product-still-life.png")} aria-label={t.closing.videoAria}><source src={assetUrl("/moyomoyo-premium-hero.mp4")} type="video/mp4" /></video></figure>
        <header className="closing-copy"><p className="overline">{t.closing.overline}</p><h2>{t.closing.title}<br /><em>{t.closing.titleEm}</em></h2><a href="#purchase" className="pill-button">{t.closing.cta} <Arrow /></a></header>
      </section>

      <section className="contact" id="contact">
        <header className="contact-copy">
          <p className="overline">{t.contact.overline}</p>
          <h2>{t.contact.title}<br /><em>{t.contact.titleEm}</em></h2>
          <p>{t.contact.intro}</p>
        </header>
        <div className="contact-details">
          {t.contact.items.map((item) => (
            <p key={item.label}>
              <span>{item.label}</span>
              {"href" in item && item.href ? <a href={item.href}>{item.value}</a> : <b>{item.value}</b>}
            </p>
          ))}
          <small>{t.contact.escrow}</small>
        </div>
      </section>

      </main>

      <footer>
        <Logo light homeLabel={t.nav.home} />
        <p>{t.footer.tagline}</p>
        <nav className="footer-links" aria-label={t.nav.footer}><NavLinks t={t} /></nav>
        <div className="footer-bottom"><span>{t.footer.rights}</span><span>{t.footer.places}</span></div>
      </footer>
      <a className="mobile-buy" href="#purchase">{t.footer.shop} <Arrow /></a>
    </>
  );
}
