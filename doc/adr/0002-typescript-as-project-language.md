# 2. TypeScript as project language

Date: 2020-04-09

## Status

Status: Accepted on 2020-04-09

## Context

* This is Open Source app which may be used by big variety of projects
* TypeScript is widely known nowadays, so there is high chance to get contribution from other peple if this technology is used
* Project's author and main contibutor (@kopach) is fluent in this technology, so no need in spending extra efort in learning something differrent
* TypeScript is type safe, so more secure and potentially should prevent from common mistakes
* TypeScript integrates well with JavaScript so all libraries from both ecosystems can be used easilly

## Decision

Use TypeScript as main and only programming language in this project

## Consequences

* A bit more boilerplate code in comparison to JavaScript, thus more effort to write on the beginning
* Sometimes there could be issues related to TypeScript itself, e.g. wrong/outdated types defined under `@types/...` project
