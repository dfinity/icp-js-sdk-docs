## Unreleased

### Feat

- track copy page events in matomo (#154)
- copy page button (#150)
- copy markdown integration (#148)
- add canisters project (#142)
- enable mermaid charts (#134)
- add bindgen project (#121)
- add auth project (#117)
- project switcher categories (#113)
- add matomo analytics (#95)
- add pic-js project (#92)
- use markdown for projects assets (#89)
- add root site content (#70)
- add root starlight docs website (#62)
- agent folder (#31)
- add commit hash to the automated PR (#29)
- pull project docs action (#12)
- temporary root files (#8)
- add initial core website, repo configuration and docs (#1)
- initial commit

### Fix

- ignore copy page button in pagefind and markdown (#152)
- padding and border radius for inline code elements (#138)
- reduce space between elements in project switcher (#122)
- set environment in the pull-docs job (#97)
- add both trailing slash and non trailing slash to redirects for `/core` (#87)
- upload both compressed and uncompressed html files (#83)
- skip github zipball top level directory (#50)
- unzip file at the proper path (#46)
- give permissions to script (#35)
- make sure the dist/{project} directory exists (#18)
- sync project json files (#15)

### Refactor

- move components to folders (#104)
- render React components at build time (#103)
- move agent to core and configure rewrites for redirect (#68)
- simplify pull-projects-docs action (#27)
