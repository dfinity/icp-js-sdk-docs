import * as cli from "@std/cli";
import { setOutput } from "@actions/core";
import { getOctokit } from "@actions/github";
import { loadProjectConfig } from "./utils/projects.ts";

async function main() {
  const args = cli.parseArgs(Deno.args, {
    string: ["project", "token"],
  });
  if (!args.project) {
    throw new Error("Error: --project argument is required");
  }
  if (!args.token) {
    throw new Error("Error: --token argument is required");
  }

  const project = await loadProjectConfig(args.project);
  if (!project) {
    throw new Error(
      `Error: Project "${args.project}" not found in projects.json`,
    );
  }

  const octokit = getOctokit(args.token);
  const [owner, repo] = project.repository.split("/");
  const { data: contents } = await octokit.rest.repos.listCommits({
    owner,
    repo,
    sha: project.branch,
    page: 1,
    per_page: 1,
  });

  const latestCommitSha = contents[0].sha;
  const latestCommitShortSha = latestCommitSha.slice(0, 7);
  setOutput("commit_sha", latestCommitSha);
  setOutput("commit_short_sha", latestCommitShortSha);
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    console.error("Error in sync-project-docs script:", error);

    Deno.exit(1);
  }
}
