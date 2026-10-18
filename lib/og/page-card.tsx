/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- satori renders plain <img> */
import { ImageResponse } from "next/og";
import { OG_COLORS, Eyebrow, Logo, withOgCache } from "./shared";

type Assets = Awaited<ReturnType<typeof import("./shared").loadOgAssets>>;

interface PageCardOptions {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Optional photo shown on the right. */
  image?: string | null;
}

/** Generic branded card: green panel, big headline, optional photo. */
export function renderPageCard(assets: Assets, { eyebrow, title, subtitle, image }: PageCardOptions) {
  return withOgCache(new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: OG_COLORS.bg,
          fontFamily: "Jakarta",
          padding: 28,
          gap: 28,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: 36,
            background: OG_COLORS.primary,
            padding: 52,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Soft gold glow, echoing the site's CTA block */}
          <div
            style={{
              position: "absolute",
              right: -200,
              top: -200,
              width: 560,
              height: 560,
              background: "radial-gradient(circle, rgba(201,168,76,0.32) 0%, rgba(201,168,76,0) 65%)",
            }}
          />
          <Logo src={assets.logoSrc} height={50} />
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", color: "rgba(255,255,255,0.7)" }}>
              <Eyebrow size={22}>
                <span style={{ color: "rgba(255,255,255,0.75)" }}>{eyebrow}</span>
              </Eyebrow>
            </div>
            <div
              style={{
                fontSize: image ? (title.length > 40 ? 52 : 60) : title.length > 50 ? 62 : 72,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: -2,
                color: "#fff",
                maxWidth: image ? 560 : 980,
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div style={{ fontSize: 26, fontWeight: 500, color: "rgba(255,255,255,0.7)", maxWidth: 900 }}>
                {subtitle}
              </div>
            )}
          </div>
          <div style={{ display: "flex", fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>
            mgrelianceproperties.com
          </div>
        </div>

        {image && (
          <div style={{ width: 460, display: "flex", borderRadius: 36, overflow: "hidden" }}>
            <img src={image} width={460} height={574} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630, fonts: assets.fonts }
  ));
}
