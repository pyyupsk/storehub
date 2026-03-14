# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-03-14

### 🚀 Features

- *(api)* Add StoreHub client and endpoint tests
- *(types)* Add missing isMemcApplied and deductedTax fields from real API

### 🐛 Bug Fixes

- *(scripts)* Fix setup-repo ruleset and label handling ([#3](https://github.com/pyyupsk/storehub/issues/3))

### 🚜 Refactor

- *(storehub)* Split modules and harden query serialization
- *(api)* Modularize core and feature resources
- Migrate to antfu eslint config and modernize codebase

### 📚 Documentation

- Add initial README
- Complete documentation overhaul for StoreHub client library

### ⚙️ Miscellaneous Tasks

- Initialize project from pyyupsk/npm-ts-template
- Skip workflow jobs when required secrets are missing
- *(repo)* Rename npm-ts-template references to storehub
- Make coverage threshold non-blocking
- *(package)* Update metadata for StoreHub client library
- Update workflows to Node.js 24 and fix release script
- *(knip)* Fix configuration to ignore eslint transitive deps
