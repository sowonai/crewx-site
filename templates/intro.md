---
sidebar_position: 1
title: Introduction
---

import TemplateCard from '@site/src/components/TemplateCard';

# 🚀 CrewX Templates

A **collection of pre-configured templates** to help you get started with CrewX projects quickly.

## 📦 Available Templates

<div className="row">
  <div className="col col--6">
    <TemplateCard
      name="wbs-automation"
      displayName="WBS Automation"
      description="WBS (Work Breakdown Structure) based project automation template"
      version="1.0.0"
      author="SowonLabs"
      tags={["automation", "wbs", "project-management", "coordinator"]}
      features={[
        "Coordinator agent for automatic task execution",
        "Phase-based parallel execution",
        "Git-based time tracking",
        "1-hour interval automation loop"
      ]}
      crewxVersion=">=0.7.0"
    />
  </div>
  <div className="col col--6">
    <TemplateCard
      name="docusaurus-i18n"
      displayName="Docusaurus i18n"
      description="Docusaurus site template with AI-powered automatic translation (Korean ↔ English)"
      version="1.0.0"
      author="SowonLabs"
      tags={["docusaurus", "i18n", "translation", "documentation", "blog"]}
      features={[
        "Docusaurus 3.9.2 pinned version",
        "Pre-configured Korean/English i18n",
        "Automatic translation scripts",
        "CrewX translation agent included",
        "Write once, publish in both languages"
      ]}
      crewxVersion=">=0.7.0"
    />
  </div>
</div>

<div className="row" style={{marginTop: '1rem'}}>
  <div className="col col--6">
    <TemplateCard
      name="crewx-skill"
      displayName="CrewX Skill"
      description="Claude Code skill for CrewX CLI framework assistance"
      version="1.0.0"
      author="SowonLabs"
      tags={["claude-code", "skill", "assistant", "documentation"]}
      features={[
        "Auto-activating CrewX expert skill",
        "Complete command reference",
        "Configuration guidance",
        "Multi-AI workflow recommendations",
        "Troubleshooting assistance"
      ]}
      crewxVersion=">=0.7.0"
    />
  </div>
</div>

---

## 📖 Quick Start

### Install a Template

```bash
# 1. Install template
crewx template init [template-name]

# 2. Navigate to directory
cd [template-name]

# 3. Check configuration
cat crewx.yaml

# 4. Run agents
crewx agent ls                    # List available agents
crewx q "@agent_name question"    # Query mode
crewx x "@agent_name task"        # Execute mode
```

### Install to Specific Directory

```bash
# Apply template to existing project
cd my-project
crewx template init wbs-automation
```

---

## 🔗 Template Repository

All templates are maintained in the official repository:

👉 [github.com/sowonlabs/crewx-templates](https://github.com/sowonlabs/crewx-templates)
