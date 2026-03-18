import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPaths = ["/dashboard", "/request", "/profile", "/api/agent"];
const adminPaths = ["/dashboard/admin"];
const donorPaths = ["/dashboard/donor"];
const agentPaths = ["/dashboard/agent", "/api/agent"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = (process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET)?.trim();
  const token = await getToken({ req, secret });

  const requiresAuth = protectedPaths.some((path) => pathname.startsWith(path));

  if (requiresAuth && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const role = (token?.role as string) ?? "USER";

  if (adminPaths.some((path) => pathname.startsWith(path)) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (
    donorPaths.some((path) => pathname.startsWith(path)) &&
    role !== "DONOR" &&
    role !== "ADMIN" &&
    role !== "USER"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (
    agentPaths.some((path) => pathname.startsWith(path)) &&
    role !== "AGENT" &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/request",
    "/donors",
    "/profile/:path*",
    "/api/agent/:path*"
  ],
};

