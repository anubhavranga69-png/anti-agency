import { redirect } from "next/navigation";

/**
 * The admin login screen has moved to /admin/login.
 * Redirect /admin → /admin/login so existing links and bookmarks continue to work.
 */
export default function AdminIndexPage() {
  redirect("/admin/login");
}
