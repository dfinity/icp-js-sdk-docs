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
    source: "/auth",
    location: "/auth/latest",
    code: 302,
  },
  {
    source: "/auth/",
    location: "/auth/latest",
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
  {
    source: "/bindgen",
    location: "/bindgen/latest",
    code: 302,
  },
  {
    source: "/bindgen/",
    location: "/bindgen/latest",
    code: 302,
  },
];
