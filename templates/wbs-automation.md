---
sidebar_position: 2
title: WBS Automation
---

# WBS Automation Template

Work Breakdown Structure (WBS) based project automation template with AI coordinator.

## 🎯 Overview

This template enables automated project management based on WBS methodology, where a coordinator agent automatically executes tasks according to your project plan.

## ✨ Key Features

- **Coordinator Agent**: Automatically executes tasks based on WBS
- **Phase-based Parallel Processing**: Run multiple tasks in parallel within each phase
- **Git-based Time Tracking**: Track time spent on each task using Git commits
- **1-hour Automation Loop**: Continuous automation with periodic checks

## 🚀 Quick Start

### Installation

```bash
crewx template init wbs-automation
cd wbs-automation
```

### Usage

```bash
# View WBS structure
cat wbs.md

# Start automation
crewx x "@coordinator Start automation according to WBS"

# Check progress
crewx q "@coordinator Show current progress"
```

## 📋 Template Structure

```
wbs-automation/
├── crewx.yaml          # Agent configuration
├── wbs.md              # Work Breakdown Structure
└── README.md           # Usage guide
```

## 🔧 Configuration

Edit `wbs.md` to define your project structure:

```markdown
# Project WBS

## Phase 1: Setup
- [ ] Task 1.1
- [ ] Task 1.2

## Phase 2: Development
- [ ] Task 2.1
- [ ] Task 2.2
```

## 🤖 Agents Included

- **@coordinator**: WBS-based task automation coordinator
- **@developer**: Development task execution agent

## 📦 Requirements

- CrewX >= 0.7.0
- Git repository (for time tracking)

## 🔗 Resources

- [Template Repository](https://github.com/sowonlabs/crewx-templates/tree/main/wbs-automation)
- [WBS Methodology Guide](https://en.wikipedia.org/wiki/Work_breakdown_structure)
