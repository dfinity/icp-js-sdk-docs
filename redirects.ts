import { type StorageConfigRedirect } from "@junobuild/config";

export const REDIRECTS: StorageConfigRedirect[] = [
  {
    source: "/",
    location: "/core/latest",
    code: 302,
  },
  // Legacy pages where the agent-js docs were hosted
  {
    source: "/core/libs/**",
    location: "/agent/latest",
    code: 302,
  },
  {
    source: "/core/changelog",
    location: "/agent/latest/changelog",
    code: 302,
  },
  {
    source: "/core/release-notes/v300",
    location: "/agent/latest/release-notes/v300",
    code: 302,
  },
];
