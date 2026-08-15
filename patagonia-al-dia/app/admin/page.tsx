import { requireAuth } from "../../lib/auth";
import rawData from "../../content/site.json";
import type { SiteData } from "../../lib/types";
import AdminEditor from "./AdminEditor";

export default function AdminPage() {
  requireAuth();
  const data = rawData as SiteData;
  return <AdminEditor initialData={data} />;
}
