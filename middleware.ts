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

  // Root domain da plataforma configurado nas variáveis de ambiente
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

  // Identificação de ambiente de desenvolvimento ou subdomínio/domínio customizado
  let currentHost = hostname.replace(`:${url.port}`, ""); // Remove porta para comparação limpa

  // Verifica se é rota do painel administrativo global (/admin) ou api
  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // Define o domínio/slug do tenant
  let tenantIdentifier = "dall-automacao"; // Fallback padrão de teste

  const isLocalhost =
    hostname.includes("localhost") || hostname.includes("127.0.0.1");

  if (isLocalhost) {
    if (hostname.includes(".localhost")) {
      // Ex: dall.localhost:3000 -> tenant = "dall"
      tenantIdentifier = hostname.split(".localhost")[0];
    } else {
      // localhost:3000 direto
      tenantIdentifier = "dall-automacao";
    }
  } else if (hostname.endsWith(".vercel.app")) {
    // Vercel Free / Preview Deployments (ex: meu-projeto.vercel.app)
    // Se a rota for raiz, carrega o tenant padrão de teste ("dall-automacao")
    tenantIdentifier = "dall-automacao";
  } else if (hostname === rootDomain || hostname === `www.${rootDomain}`) {
    // Acesso ao domínio principal da plataforma SaaS
    tenantIdentifier = "platform-home";
  } else if (hostname.endsWith(`.${rootDomain}`)) {
    // Subdomínio da plataforma: ex: dall.plataforma.com.br -> "dall"
    tenantIdentifier = hostname.replace(`.${rootDomain}`, "");
  } else {
    // Domínio próprio / custom domain: ex: dallautomacao.com.br
    tenantIdentifier = currentHost;
  }

  // Clona a URL para reescrita interna no App Router
  const responseUrl = new URL(`/${tenantIdentifier}${path === "/" ? "" : path}`, req.url);

  // Propaga o header com o tenant identificado
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-tenant-domain", tenantIdentifier);
  requestHeaders.set("x-tenant-host", hostname);

  return NextResponse.rewrite(responseUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}
