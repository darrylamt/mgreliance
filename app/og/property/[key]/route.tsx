/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- satori renders plain <img> */
import { ImageResponse } from "next/og";
import {
  OG_COLORS,
  Chip,
  Eyebrow,
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
import { renderPageCard } from "@/lib/og/page-card";

export const runtime = "edge";

export async function GET(_req: Request, { params }: { params: { key: string } }) {
  const [assets, property] = await Promise.all([loadOgAssets(), fetchPropertyForOg(params.key)]);

  if (!property) {
    return renderPageCard(assets, {
      eyebrow: "Properties",
      title: "Homes, land & commercial space in Accra.",
    });
  }

  const photo = ogSafeImage(property.images?.find((img) => ogSafeImage(img)));
  const title = clip(tidyCase(property.title), 70);
  const specs = propertySpecs(property);

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
        {/* Text */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "28px 8px 28px 28px",
          }}
        >
          <Logo src={assets.logoSrc} height={50} />

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Eyebrow>
              {STATUS_LABELS[property.status]} · {TYPE_LABELS[property.type]}
            </Eyebrow>
            <div
              style={{
                fontSize: title.length > 45 ? 46 : 54,
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: -1.5,
                color: OG_COLORS.ink,
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: 24, fontWeight: 500, color: OG_COLORS.muted }}>
              {clip(tidyCase(property.location), 48)}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {specs.length > 0 && (
              <div style={{ display: "flex", gap: 10 }}>
                {specs.map((s) => (
                  <Chip key={s} size={20}>
                    {s}
                  </Chip>
                ))}
              </div>
            )}
            <div
              style={{
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: -1,
                color: OG_COLORS.primary,
              }}
            >
              {property.price ? clip(property.price, 26) : "Price on request"}
            </div>
          </div>
        </div>

        {/* Photo */}
        <div
          style={{
            width: 560,
            display: "flex",
            borderRadius: 36,
            overflow: "hidden",
            background: OG_COLORS.primary,
            position: "relative",
          }}
        >
          {photo ? (
            <img src={photo} width={560} height={574} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          ) : (
            <div style={{ display: "flex", flex: 1 }} />
          )}
          <div style={{ position: "absolute", top: 24, left: 24, display: "flex" }}>
            <Chip size={22}>{STATUS_LABELS[property.status]}</Chip>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: assets.fonts }
  ));
}
