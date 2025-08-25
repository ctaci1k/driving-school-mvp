// app\dashboard\page.tsx

import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function DashboardRedirectPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return redirect("/login")
  }

  switch (session.user.role) {
    case "ADMIN":
      return redirect("/admin-dashboard")
    case "INSTRUCTOR":
      return redirect("/instructor-dashboard")
    case "STUDENT":
      return redirect("/student/dashboard")
    default:
      return redirect("/login")
  }
}
