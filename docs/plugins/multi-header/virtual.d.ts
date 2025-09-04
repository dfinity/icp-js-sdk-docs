declare module "virtual:starlight-multi-header/config" {
  const Config: import("./config.ts").MultiHeaderConfig;
  export default Config;
}

declare module "virtual:starlight/user-images" {
  type ImageMetadata = import("astro").ImageMetadata;
  export const logos: {
    dark?: ImageMetadata;
    light?: ImageMetadata;
  };
}
