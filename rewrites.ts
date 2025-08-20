import { type StorageConfigRewrite } from "@junobuild/config";

export const REWRITES: StorageConfigRewrite[] = [
  {
    source: "/core/libs/**",
    destination: "/core/libs/index.html",
  },
];
