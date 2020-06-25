# 4. Conventional Commits format for commits

Date: 2020-06-25

## Status

Status: Accepted on 2020-06-25

## Context

Commit messages can be unclear, incomplete or even confusing. It makes it difficult to understand the code history and what the code does over time. It is also a lost opportunity to harvest automatically information to create, for instance, change logs as part of an automated release process.

With proper commit convention can be achieved:

- better development flow and consistency in commits
- ability to generate change log automatically
- possibility to trigger publish processes (in future)
- making it easier for people to contribute without wondering about commit message format
- each change will have it's assigned type and scope

Automated tools we use support conventional commits format. Those are:

- [Snyk](https://snyk.io/)
- [Renovate Bot](https://renovatebot.com/)

Some big projects uses conventional commits format:

- [Angular](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines): FE framework
- [yargs](https://github.com/yargs/yargs): everyone's favorite pirate themed command line argument parser.
- [istanbuljs](https://github.com/istanbuljs/istanbuljs): a collection of open-source tools and libraries for adding test coverage to your JavaScript tests.
- [uPortal-home](https://github.com/UW-Madison-DoIT/angularjs-portal) and [uPortal-application-framework](https://github.com/UW-Madison-DoIT/uw-frame): Optional supplemental user interface enhancing [Apereo uPortal](https://www.apereo.org/projects/uportal).
- [massive.js](https://github.com/dmfay/massive-js): A data access library for Node and PostgreSQL.
- [electron](https://github.com/electron/electron): Build cross-platform desktop apps with JavaScript, HTML, and CSS.
- [scroll-utility](https://github.com/LeDDGroup/scroll-utility): A simple to use scroll utility package for centering elements, and smooth animations
- [Blaze UI](https://github.com/BlazeUI/blaze): Framework-free open source UI toolkit.
- [Monica](https://github.com/monicahq/monica): An open source personal relationship management system.
- [mhy](https://mhy.js.org): 🧩 A zero-config, out-of-the-box, multi-purpose toolbox and development environment.
- [sharec](https://github.com/lamartire/sharec): Minimalistic tool for boilerplating and configuration versioning.
- [Nintex Forms](https://www.nintex.com/workflow-automation/modern-forms/): Easily create dynamic online forms to capture and submit accurate and current data.

Project restrictions:

- no deadline on implementation
- not much experience and konwladge in conventional commits in a team yet
- not experience in setting up automatic publish process in a team

Other:

- [https://github.com/conventional-changelog](https://github.com/conventional-changelog)

## Decision

Use [Conventional Commits](https://www.conventionalcommits.org) specification with [Conventional Changelog](https://github.com/conventional-changelog/conventional-changelog) set of tools because it allows for:

- Automatically generating CHANGELOGs.
- Automatically determining a semantic version bump (based on the types of commits landed).
- Communicating the nature of changes to teammates, the public, and other stakeholders.
- Triggering build and publish processes.
- Making it easier for people to contribute to your projects, by allowing them to explore a more structured commit history.

## Consequences

- we force developers to group code changes and assign type/scope for each change which may take some extra effort at the beginning
- there are other tools like [semantic-release](https://github.com/semantic-release/semantic-release) out there with possibility to set up automatic release process but with more complex configuration
- no automatic release yet
