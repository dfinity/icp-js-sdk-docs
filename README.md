# ICP JavaScript SDK Docs

This repository contains the documentation for the ICP JavaScript SDK hosted on
[js.icp.build](https://js.icp.build).

## Adding your project

1. Add an entry to the list of projects in the
   [`projects.json`](./projects.json) file:

   ```json
   [
     {
       "title": "Core",
       "description": "Base library for Internet Computer apps.",
       "repository": "dfinity/icp-js-core",
       "subdirectory": "core"
     },
     // other entries...
     {
       "repository": "$YOUR_GITHUB_ORGANIZATION/$YOUR_PROJECT_NAME",
       "subdirectory": "$YOUR_PROJECT_NAME"
     }
   ]
   ```

2. Add a link and short description for the sub-project in the
   [`index.mdx`](./docs/src/content/docs/index.mdx) file:

   ```html
   <CardGrid stagger>
     <Card title="ICP JS SDK Core">
       Build applications that interact with the Internet Computer from browsers,
       Node.js, and other JavaScript runtimes.

       <LinkButton
         href="/core/latest"
         variant="minimal"
         icon="right-caret"
         iconPlacement="start"
       >
         Get started with <code class="dfn-text-highlight">@icp-sdk/core</code>
       </LinkButton>
     </Card>
     <!-- other entries... -->
     <Card title="$YOUR_PROJECT_TITLE">
       $YOUR_PROJECT_DESCRIPTION

       <LinkButton
         href="/$YOUR_PROJECT_NAME/latest"
         variant="minimal"
         icon="right-caret"
         iconPlacement="start"
       >
         Get started with <code class="dfn-text-highlight"
         >$YOUR_PROJECT_TITLE</code>
       </LinkButton>
     </Card>
   </CardGrid>
   ```

3. Optionally add any necessary redirects for your project in the
   [`redirects.ts`](./redirects.ts) file:
   ```ts
   import { type StorageConfigRedirect } from "@junobuild/config";

   export const REDIRECTS: StorageConfigRedirect[] = [
     {
       source: "/core",
       location: "/core/latest",
       code: 302,
     },
     // other entries
     {
       source: "/$YOUR_PROJECT_NAME",
       location: "/$YOUR_PROJECT_NAME/latest",
       code: 302,
     },
   ];
   ```

   > Note: you may need to add both the exact path and the path with a trailing
   > slash for the redirect to work.

4. Optionally add any necessary rewrites for your project in the
   [`rewrites.ts`](./rewrites.ts) file:

   ```ts
   import { type StorageConfigRewrite } from "@junobuild/config";

   export const REWRITES: StorageConfigRewrite[] = [
     {
       source: "/core/libs/**",
       destination: "/core/libs/index.html",
     },
     // other entries
     {
       source: "/$YOUR_PROJECT_NAME/libs/**",
       destination: "/$YOUR_PROJECT_NAME/libs/index.html",
     },
   ];
   ```

5. After making your changes, please refer to
   [CONTRIBUTING.md](.github/CONTRIBUTING.md), where you can find all you need
   to know to contribute to this project.

## License

This project is licensed under the [Apache-2.0 License](LICENSE).
