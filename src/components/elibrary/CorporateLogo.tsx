import sunuLogo from "@/assets/sunu-logo.png.asset.json";
import { cn } from "@/lib/utils";

/** Tenant branding config: swap src/alt per organisation to change the corporate logo everywhere. */
export const tenantBranding = { logoSrc: sunuLogo.url, logoAlt: "SUNU Assurances" };

export function CorporateLogo({ className }: { className?: string }) {
  return <img src={tenantBranding.logoSrc} alt={tenantBranding.logoAlt} width={540} height={282} className={cn("h-auto w-auto object-contain", className)} />;
}
