# GitHub Followers Utility

A CLI tool for managing GitHub follow/unfollow actions.

> [!WARNING]
> This tool is for educational purposes only. Use it responsibly and in compliance with [GitHub's Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service).
>
> Improper use of this tool for automate actions on GitHub might result in your account being **flagged** or **BANNED**. I am not responsible for any consequences that may arise from this scenario.

# Features

- Export users you are following to a CSV file.
- Export organization members to a CSV file.
- Follow/unfollow users from a CSV file.
- Follow/unfollow all members of an organization.

# Installation

Clone this repository and install the required dependencies:

```bash
git clone https://github.com/Hoshinowo-Yuki/github-followers-utility.git
cd github-followers-utility
```

```bash
npm install axios commander
```

and set it up with your GitHub credentials:

```bash
export GITHUB_USERNAME=your_username
export GITHUB_TOKEN=your_personal_access_token
```

# Usage

Export following users to a CSV file:

```bash
node script.js export-following following.csv
```

Follow users from a specified CSV file:

```bash
node script.js follow-from-csv following.csv --delay 10
```

# License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
