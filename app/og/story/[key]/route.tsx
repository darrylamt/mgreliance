/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- satori renders plain <img> */
import { ImageResponse } from "next/og";
import {
  OG_COLORS,
  Chip,
  Logo,
  clip,
  fetchPropertyForOg,
  loadOgAssets,
  ogSafeImage,
  propertySpecs,
  tidyCase,
  STATUS_LABELS,
  TYPE_LABELS,
  withOgCache,
} from "@/lib/og/shared";

export const runtime = "edge";

/** 1080×1920 portrait card for WhatsApp Status / Instagram Stories. */
export async function GET(req: Request, { params }: { params: { key: string } }) {
  const [assets, property] = await Promise.all([loadOgAssets(), fetchPropertyForOg(params.key)]);
  if (!property) return new Response("Not found", { status: 404 });

  const photos = (property.images || []).map(ogSafeImage).filter(Boolean) as string[];
  const title = clip(tidyCase(property.title), 64);
  const specs = propertySpecs(property);
  const download = new URL(req.url).searchParams.has("download");

  const res = withOgCache(new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: OG_COLORS.bg,
          fontFamily: "Jakarta",
          padding: 40,
          gap: 40,
        }}
      >
        {/* Photos */}
        <div
          style={{
            height: 1080,
            display: "flex",
            borderRadius: 56,
            overflow: "hidden",
            background: OG_COLORS.primary,
            position: "relative",
          }}
        >
          {photos[0] && (
            <img src={photos[0]} width={1000} height={1080} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          )}
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 40,
              right: 40,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Logo src={assets.logoSrc} height={64} />
            <Chip size={30}>{STATUS_LABELS[property.status]}</Chip>
          </div>
          {photos[1] && (
            <div
              style={{
                position: "absolute",
                bottom: 40,
                right: 40,
                width: 300,
                height: 220,
                display: "flex",
                borderRadius: 32,
                overflow: "hidden",
                border: "8px solid #fff",
              }}
            >
              <img src={photos[1]} width={300} height={220} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24, padding: "0 16px" }}>
          <div style={{ fontSize: 30, fontWeight: 500, color: OG_COLORS.muted, letterSpacing: 3, textTransform: "uppercase" }}>
            {`${TYPE_LABELS[property.type]} · ${clip(tidyCase(property.location), 32)}`}
          </div>
          <div style={{ fontSize: title.length > 40 ? 62 : 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, color: OG_COLORS.ink }}>
            {title}
          </div>
          {specs.length > 0 && (
            <div style={{ display: "flex", gap: 14 }}>
              {specs.map((s) => (
                <Chip key={s} size={30}>
                  {s}
                </Chip>
              ))}
            </div>
          )}
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2, color: OG_COLORS.primary, marginTop: 8 }}>
            {property.price ? clip(property.price, 22) : "Price on request"}
          </div>
        </div>

        {/* Contact bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 40,
            background: OG_COLORS.primary,
            padding: "36px 44px",
            color: "#fff",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 26, fontWeight: 500, color: "rgba(255,255,255,0.65)" }}>WhatsApp or call</div>
            <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -0.5 }}>024 427 4630</div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: OG_COLORS.accent }}>mgrelianceproperties.com</div>
        </div>
      </div>
    ),
    { width: 1080, height: 1920, fonts: assets.fonts }
  ));
  if (download) {
    const name = params.key.replace(/[^a-z0-9-]/gi, "").slice(0, 60);
    res.headers.set("Content-Disposition", `attachment; filename="mg-reliance-${name}.png"`);
  }
  return res;
}
