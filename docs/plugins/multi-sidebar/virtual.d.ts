declare module "virtual:starlight-multi-sidebar/config" {
  const Config: import("./config.ts").MultiSidebarConfig;
  export default Config;
}

declare module "virtual:starlight/user-images" {
  type ImageMetadata = import("astro").ImageMetadata;
  export const logos: {
    dark?: ImageMetadata;
    light?: ImageMetadata;
  };
}
