import { type StorageConfigRedirect } from "@junobuild/config";

export const REDIRECTS: StorageConfigRedirect[] = [
  {
    source: "/core/",
    location: "/core/latest",
    code: 302,
  },
];
