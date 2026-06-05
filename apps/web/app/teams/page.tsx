import { redirect } from "next/navigation";

/** Legacy URL — footer/bookmarks may still point here. */
export default function TeamsRedirectPage() {
  redirect("/team");
}
