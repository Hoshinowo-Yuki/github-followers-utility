# GitHub Followers Utility

A CLI tool for managing GitHub follow/unfollow actions.

## Features

- Export users you are following to a CSV file.
- Export organization members to a CSV file.
- Follow/unfollow users from a CSV file.
- Follow/unfollow all members of an organization.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Yuzuk1Shimotsuki/github-followers-utility.git
   cd github-followers-utility

2. Install dependencies:

   ```bash
   npm install axios commander
   ```

3. Set up your GitHub credentials:

   ```bash
   export GITHUB_USERNAME=your_username
   export GITHUB_TOKEN=your_personal_access_token
   ```

## Usage

- Export following users to CSV:

  ```bash
  node script.js export-following following.csv
  ```

- Follow users from CSV:

  ```bash
  node script.js follow-from-csv following.csv --delay 10
  ```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
