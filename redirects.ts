import { type StorageConfigRedirect } from "@junobuild/config";

export const REDIRECTS: StorageConfigRedirect[] = [
  {
    source: "/core",
    location: "/core/latest",
    code: 302,
  },
  {
    source: "/core/",
    location: "/core/latest",
    code: 302,
  },
  {
    source: "/pic-js",
    location: "/pic-js/latest",
    code: 302,
  },
  {
    source: "/pic-js/",
    location: "/pic-js/latest",
    code: 302,
  },
];
