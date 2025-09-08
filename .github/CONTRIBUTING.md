# Contributing

Thank you for your interest in contributing to the ICP JavaScript SDK Docs. By
participating in this project, you agree to abide by our
[Code of Conduct](./CODE_OF_CONDUCT.md).

As a member of the community, you are invited and encouraged to contribute by
submitting issues, offering suggestions for improvements, adding review comments
to existing pull requests, or creating new pull requests to fix issues.

All contributions to DFINITY documentation and the developer community are
respected and appreciated. Your participation is an important factor in the
success of the Internet Computer.

## Prerequisites

Before contributing, please take a few minutes to review these contributor
guidelines. The contributor guidelines are intended to make the contribution
process easy and effective for everyone involved in addressing your issue,
assessing changes, and finalizing your pull requests.

Before contributing, consider the following:

- If you want to report an issue, click
  [issues](https://github.com/dfinity/icp-js-sdk-docs/issues).
- If you have more general questions related to this package and its use, post a
  message to the [community forum](https://forum.dfinity.org/).
- If you are reporting a bug, provide as much information about the problem as
  possible.
- If you want to contribute directly to this repository, typical fixes might
  include any of the following:
  - Fixes to resolve bugs or documentation errors
  - Code improvements
  - Feature requests
  - Note that any contribution to this repository must be submitted in the form
    of a **pull request**.
- If you are creating a pull request, be sure that the pull request only
  implements one fix or suggestion.

If you are new to working with GitHub repositories and creating pull requests,
consider exploring
[First Contributions](https://github.com/firstcontributions/first-contributions)
or
[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github).

## Reporting an issue

To open a new issue:

1. Click
   [create a new issue](https://github.com/dfinity/icp-js-sdk-docs/issues/new).
2. Type a title and description, then click **Submit new issue**.
   - Be as clear and descriptive as possible.
   - For any problem, describe it in detail, including details about the crate,
     the version of the code you are using, the results you expected, and how
     the actual results differed from your expectations.

## Submitting a pull request

If you want to submit a pull request to fix an issue or add a feature, here's a
summary of what you need to do:

### Forking the repository

1. Make sure you have a GitHub account, an internet connection, and access to a
   terminal shell or GitHub Desktop application for running commands.
2. Navigate to the
   [repository's homepage](https://github.com/dfinity/icp-js-sdk-docs) in a web
   browser.
3. Click **Fork** to create a copy of the repository under your GitHub account
   or organization name.
4. Clone the forked repository to your local machine.
   ```shell
   git clone "https://github.com/$YOUR_USERNAME/icp-js-sdk-docs.git"
   ```
5. Change into the directory of the cloned repository:
   ```shell
   cd icp-js-sdk-docs
   ```
6. Create a new branch for your fix by running a command similar to the
   following:
   ```shell
   git checkout -b $YOUR_BRANCH_NAME
   ```

### Install dependencies

1. Install [Deno](https://docs.deno.com/runtime/#quick-install).
2. Install Deno dependencies:
   ```bash
   deno i --allow-scripts
   ```

### Making a pull request

3. Open the file you want to fix in a text editor and make the appropriate
   changes for the issue you are trying to address.
4. Add the file contents of the changed files to the index `git` uses to manage
   the state of the project by running a command similar to the following:
   ```shell
   git add $PATH_TO_CHANGED_FILE
   ```
5. Make sure to have
   [Commitizen](https://commitizen-tools.github.io/commitizen/#installation)
   installed.
6. Commit your changes to store the contents you added to the index along with a
   descriptive message by running the following:
   ```shell
   cz commit
   ```
7. Push the changes to the remote repository by running a command similar to the
   following:
   ```shell
   git push origin $YOUR_BRANCH_NAME
   ```
8. Create a new pull request (PR) for the branch you pushed to the upstream
   GitHub repository.
   - The PR title should be auto-populated based on your commit message.
   - Provide a PR message that includes a short description of the changes made.
9. Wait for the pull request to be reviewed.
10. Make changes to the pull request, if requested. When making subsequent
    commits, you no longer need to follow conventional commits. Only the first
    commit message will be used.
11. Celebrate your success after your pull request is merged!

## Commands

### Serve root docs project

To serve the root docs project, run:

```shell
deno task docs:start
```

> Note: You need to run `deno task docs:prebuild` before to ensure the projects
> files are added to the docs.

### Build root docs project

To build the root docs project, run:

```shell
deno task docs:build
```

### Update projects schema

If you make changes to the [`projects-schema.json`](../projects-schema.json)
file, you need to update the [`projects-schema.d.ts`](../projects-schema.d.ts)
file. To do this, run:

```shell
deno task types:projects
```

### Serve all docs using Juno

To start the Juno emulator, run:

```shell
deno task juno dev start
```

In another terminal, to login to the Juno emulator, run:

```shell
deno task juno login --mode development --emulator
```

To deploy the canister, run:

```shell
deno task juno deploy --mode development --immediate
```

### Server all docs using DFX

Alternatively, to use DFX, first start the local replica:

```shell
dfx start --background
```

Then deploy the canister:

```shell
dfx deploy
```

### Manually pull sub-project assets

To manually pull assets from a sub-project (where `$YOUR_PROJECT_REPOSITORY` is
the `repository` attribute from a project listed in the `projects.json` file),
run:

```shell
deno task pull-project-docs --project $YOUR_PROJECT_REPOSITORY
```
