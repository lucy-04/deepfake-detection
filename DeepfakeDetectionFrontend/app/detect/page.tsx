import { redirect } from "next/navigation"

// This project only does image detection, so /detect just sends you there.
export default function DetectPage() {
  redirect("/detect/image")
}
