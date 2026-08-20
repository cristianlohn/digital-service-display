import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (unless tenant-specific)
     * - public files with extensions (.svg, .png, .jpg, .jpeg, .webp, .css, .js)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "localhost:3000";
  const path = url.pathname;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

  // Se for rota administrativa (/admin) ou api, mantém sem reescrita
  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // Remove porta e remove prefixo www. para normalização
  const cleanHost = hostname.replace(`:${url.port}`, "").toLowerCase();
  const currentHost = cleanHost.replace(/^www\./, "");

  const isLocalhost =
    currentHost.includes("localhost") || currentHost.includes("127.0.0.1");

  let tenantIdentifier = "dall-automacao";
  let rewritePath = "";

  const pathParts = path.split("/").filter(Boolean);
  const firstSegment = pathParts[0];

  if (isLocalhost) {
    if (currentHost.includes(".localhost")) {
      // Ex: catuto.localhost:3000 -> tenant = "catuto"
      tenantIdentifier = currentHost.split(".localhost")[0];
      rewritePath = `/${tenantIdentifier}${path === "/" ? "" : path}`;
    } else if (firstSegment) {
      // Ex: localhost:3000/catuto
      tenantIdentifier = firstSegment;
      const subPath = pathParts.slice(1).join("/");
      rewritePath = `/${tenantIdentifier}${subPath ? `/${subPath}` : ""}`;
    } else {
      tenantIdentifier = "dall-automacao";
      rewritePath = `/${tenantIdentifier}`;
    }
  } else if (currentHost.endsWith(".vercel.app")) {
    // Acesso pelo domínio da Vercel (ex: digital-service-display.vercel.app)
    if (firstSegment) {
      // Ex: digital-service-display.vercel.app/catuto -> carrega o tenant "catuto"
      tenantIdentifier = firstSegment;
      const subPath = pathParts.slice(1).join("/");
      rewritePath = `/${tenantIdentifier}${subPath ? `/${subPath}` : ""}`;
    } else {
      // Acesso à raiz sem slug: carrega o tenant padrão de demonstração
      tenantIdentifier = "dall-automacao";
      rewritePath = `/${tenantIdentifier}`;
    }
  } else if (currentHost === rootDomain) {
    // Domínio principal da plataforma SaaS
    if (firstSegment) {
      tenantIdentifier = firstSegment;
      const subPath = pathParts.slice(1).join("/");
      rewritePath = `/${tenantIdentifier}${subPath ? `/${subPath}` : ""}`;
    } else {
      tenantIdentifier = "dall-automacao";
      rewritePath = `/${tenantIdentifier}`;
    }
  } else if (currentHost.endsWith(`.${rootDomain}`)) {
    // Subdomínio da plataforma (ex: catuto.plataforma.com.br)
    tenantIdentifier = currentHost.replace(`.${rootDomain}`, "");
    rewritePath = `/${tenantIdentifier}${path === "/" ? "" : path}`;
  } else {
    // Domínio próprio do cliente (ex: catuto.com.br ou dallautomacao.com.br)
    tenantIdentifier = currentHost;
    rewritePath = `/${tenantIdentifier}${path === "/" ? "" : path}`;
  }

  const responseUrl = new URL(rewritePath, req.url);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-tenant-domain", tenantIdentifier);
  requestHeaders.set("x-tenant-host", hostname);

  return NextResponse.rewrite(responseUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}
