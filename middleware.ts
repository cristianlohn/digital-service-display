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

  // Remove porta para comparação
  const currentHost = hostname.replace(`:${url.port}`, "");

  let tenantIdentifier = "dall-automacao";

  const isLocalhost =
    hostname.includes("localhost") || hostname.includes("127.0.0.1");

  if (isLocalhost) {
    if (hostname.includes(".localhost")) {
      tenantIdentifier = hostname.split(".localhost")[0];
    } else {
      tenantIdentifier = "dall-automacao";
    }
  } else if (hostname.endsWith(".vercel.app")) {
    // Deploy gratuito na Vercel: carrega o tenant padrão de demonstração
    tenantIdentifier = "dall-automacao";
  } else if (hostname === rootDomain || hostname === `www.${rootDomain}`) {
    // Domínio raiz configurado
    tenantIdentifier = "dall-automacao";
  } else if (hostname.endsWith(`.${rootDomain}`)) {
    // Subdomínio da plataforma (ex: dall.suaplataforma.com.br)
    tenantIdentifier = hostname.replace(`.${rootDomain}`, "");
  } else {
    // Domínio personalizado do cliente (ex: dallautomacao.com.br)
    tenantIdentifier = currentHost;
  }

  // Evita duplicação do slug no path
  let rewritePath = `/${tenantIdentifier}`;
  if (path !== "/") {
    if (path.startsWith(`/${tenantIdentifier}`)) {
      rewritePath = path;
    } else {
      rewritePath = `/${tenantIdentifier}${path}`;
    }
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
