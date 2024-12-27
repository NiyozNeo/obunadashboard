"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const protectedRoutes = ["/", "/dashboard", "/profile"];
const publicRoutes = ["/login", "/signup"];

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   // Get session from localStorage
  //   const session = localStorage.getItem("session");
  //   const parsedSession = session ? session : null;

  //   // Check if the current route is protected
  //   const isProtectedRoute = protectedRoutes.includes(pathname);
  //   const isPublicRoute = publicRoutes.includes(pathname);

  //   // Logic for redirecting
  //   if (isProtectedRoute && !parsedSession) {
  //     router.replace("/login");
  //   }

  //   // Logic for preventing logged-in users from accessing public routes
  //   if (
  //     isPublicRoute &&
  //     parsedSession &&
  //     !pathname.startsWith("/dashboard")
  //   ) {
  //     router.replace("/dashboard");
  //   }
  // }, [pathname, router]);

  return <>{children}</>;
}
