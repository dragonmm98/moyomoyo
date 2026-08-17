"use client";

import { useState } from "react";
import { useLanguage } from "./i18n/LanguageProvider";

const COUPON_CODE = "LITTLELOVE10";

export default function CouponCard() {
  const { t } = useLanguage();
  const [claimed, setClaimed] = useState(false);
  const [copied, setCopied] = useState(false);

  async function claimCoupon() {
    setClaimed(true);
    try {
      await navigator.clipboard.writeText(COUPON_CODE);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button className={`coupon-card${claimed ? " is-claimed" : ""}`} type="button" onClick={claimCoupon} aria-live="polite">
      <span className="coupon-kicker">{t.coupon.kicker}</span>
      <span className="coupon-value">10% <i>{t.coupon.off}</i></span>
      <span className="coupon-divider" />
      {claimed ? (
        <span className="coupon-code"><small>{t.coupon.yourCode}</small><b>{COUPON_CODE}</b><em>{copied ? t.coupon.copied : t.coupon.tapCopy}</em></span>
      ) : (
        <span className="coupon-action">{t.coupon.click} <b>↗</b></span>
      )}
      <span className="coupon-terms">{t.coupon.terms}</span>
    </button>
  );
}
