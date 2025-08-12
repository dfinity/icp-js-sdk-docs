import * as cli from "@std/cli";
import * as path from "@std/path";
import { setOutput } from "@actions/core";
import { getOctokit } from "@actions/github";
import { loadProjectConfig, PROJECTS_FILE_NAME } from "./utils/projects.ts";

const SCRIPT_DIR = path.dirname(path.fromFileUrl(import.meta.url));
const ROOT_DIR = path.join(SCRIPT_DIR, "..");
const PROJECTS_FILE = path.join(ROOT_DIR, PROJECTS_FILE_NAME);

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

  const project = await loadProjectConfig(PROJECTS_FILE, args.project);
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
  setOutput("commit_sha", latestCommitSha);
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in sync-project-docs script:", message);

    Deno.exit(1);
  }
}
