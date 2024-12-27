const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { Command } = require("commander");

// Load GitHub credentials from environment variables
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const BASE_URL = "https://api.github.com";

// Enum for GitHub API Endpoints
const GitHubAPI = Object.freeze({
  FOLLOWING: "/user/following",
  ORG_MEMBERS: "/orgs/{org}/members",
  FOLLOW_USER: "/user/following/{username}",
  UNFOLLOW_USER: "/user/following/{username}",
});

// Helper function to construct URLs
const constructUrl = (endpoint, params = {}) => {
  let url = BASE_URL + endpoint;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`{${key}}`, value);
  });
  return url;
};

// Helper function for GitHub API requests
const githubRequest = async (method, endpoint, params = {}, data = null) => {
  const url = constructUrl(endpoint, params);
  try {
    const response = await axios({
      method,
      url,
      auth: {
        username: GITHUB_USERNAME,
        password: GITHUB_TOKEN,
      },
      data,
      params,
    });
    return response.data;
  } catch (error) {
    console.error(`Error: ${error.response?.data?.message || error.message}`);
    return null;
  }
};

// Get the list of users the authenticated user is following
const getFollowingUsers = async () => {
  let users = [];
  let page = 1;
  while (true) {
    const data = await githubRequest("get", GitHubAPI.FOLLOWING, {
      page,
      per_page: 100,
    });
    if (!data || data.length === 0) break;
    users = users.concat(data);
    page++;
  }
  return users;
};

// Get the list of organization members
const getOrgMembers = async (org) => {
  let members = [];
  let page = 1;
  while (true) {
    const data = await githubRequest("get", GitHubAPI.ORG_MEMBERS, {
      org,
      page,
      per_page: 100,
    });
    if (!data || data.length === 0) break;
    members = members.concat(data);
    page++;
  }
  return members;
};

// Follow a specific user
const followUser = async (username) => {
  const response = await githubRequest(
    "put",
    GitHubAPI.FOLLOW_USER,
    { username }
  );
  if (response === null) {
    console.error(`Failed to follow ${username}`);
  }
};

// Unfollow a specific user
const unfollowUser = async (username) => {
  const response = await githubRequest(
    "delete",
    GitHubAPI.UNFOLLOW_USER,
    { username }
  );
  if (response === null) {
    console.error(`Failed to unfollow ${username}`);
  }
};

// Save user data to a CSV file
const saveCsv = (users, filename) => {
  const csvHeader = "Username,URL\n";
  const csvRows = users.map(({ login, html_url }) => `${login},${html_url}`).join("\n");
  const csvData = csvHeader + csvRows;
  fs.writeFileSync(filename, csvData, "utf8");
  console.log(`Successfully saved to ${filename}`);
};

// Load user data from a CSV file
const loadCsv = (filename) => {
  const data = fs.readFileSync(filename, "utf8");
  const rows = data.split("\n").slice(1).filter(row => row.trim());
  return rows.map(row => {
    const [username, url] = row.split(",");
    return { username, url };
  });
};

// CLI commands
const program = new Command();

program
  .name("GitHub CLI")
  .description("A CLI tool for managing GitHub follow/unfollow actions")
  .version("1.0.0");

program
  .command("export-following <filename>")
  .description("Export the list of users you are following to a CSV file")
  .action(async (filename) => {
    const users = await getFollowingUsers();
    saveCsv(users, filename);
  });

program
  .command("export-org-members <org> <filename>")
  .description("Export the members of an organization to a CSV file")
  .action(async (org, filename) => {
    const users = await getOrgMembers(org);
    saveCsv(users, filename);
  });

program
  .command("follow-from-csv <filename>")
  .description("Follow users listed in a CSV file")
  .option("-d, --delay <seconds>", "Delay between follow requests in seconds", 30)
  .action(async (filename, options) => {
    const users = loadCsv(filename);
    for (const { username } of users) {
      await followUser(username);
      await new Promise((resolve) => setTimeout(resolve, options.delay * 1000));
    }
  });

program
  .command("unfollow-from-csv <filename>")
  .description("Unfollow users listed in a CSV file")
  .option("-d, --delay <seconds>", "Delay between unfollow requests in seconds", 5)
  .action(async (filename, options) => {
    const users = loadCsv(filename);
    for (const { username } of users) {
      await unfollowUser(username);
      await new Promise((resolve) => setTimeout(resolve, options.delay * 1000));
    }
  });

program
  .command("follow-org-members <org>")
  .description("Follow all members of an organization")
  .option("-d, --delay <seconds>", "Delay between follow requests in seconds", 30)
  .action(async (org, options) => {
    const users = await getOrgMembers(org);
    for (const { login } of users) {
      await followUser(login);
      await new Promise((resolve) => setTimeout(resolve, options.delay * 1000));
    }
  });

program
  .command("unfollow-org-members <org>")
  .description("Unfollow all members of an organization")
  .option("-d, --delay <seconds>", "Delay between unfollow requests in seconds", 5)
  .action(async (org, options) => {
    const users = await getOrgMembers(org);
    for (const { login } of users) {
      await unfollowUser(login);
      await new Promise((resolve) => setTimeout(resolve, options.delay * 1000));
    }
  });

// Parse CLI arguments
program.parse(process.argv);
