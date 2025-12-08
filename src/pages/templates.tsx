import React from 'react';
import Layout from '@theme/Layout';
import TemplateCard from '@site/src/components/TemplateCard';
import styles from './templates.module.css';

export default function Templates(): JSX.Element {
  return (
    <Layout
      title="Templates"
      description="CrewX Templates - Pre-configured templates to get started quickly">
      <main className={styles.templatesPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>🚀 CrewX Templates</h1>
            <p className={styles.subtitle}>
              A <strong>collection of pre-configured templates</strong> to help you get started with CrewX projects quickly.
            </p>
          </div>

          <section className={styles.templatesSection}>
            <h2>📦 Available Templates</h2>
            <div className={styles.templateGrid}>
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
              <TemplateCard
                name="gmail-skill"
                displayName="Gmail Skill"
                description="Claude Code skill for Gmail integration and email management"
                version="1.0.0"
                author="SowonLabs"
                tags={["gmail", "email", "skill", "google"]}
                features={[
                  "Gmail API integration",
                  "Email sending and reading",
                  "Message management",
                  "Label organization"
                ]}
                crewxVersion=">=0.7.0"
              />
              <TemplateCard
                name="google-calendar-skill"
                displayName="Google Calendar Skill"
                description="Claude Code skill for Google Calendar integration"
                version="1.0.0"
                author="SowonLabs"
                tags={["calendar", "scheduling", "skill", "google"]}
                features={[
                  "Google Calendar API integration",
                  "Event creation and management",
                  "Schedule viewing",
                  "Meeting coordination"
                ]}
                crewxVersion=">=0.7.0"
              />
              <TemplateCard
                name="google-drive-skill"
                displayName="Google Drive Skill"
                description="Claude Code skill for Google Drive file management"
                version="1.0.0"
                author="SowonLabs"
                tags={["drive", "storage", "skill", "google"]}
                features={[
                  "Google Drive API integration",
                  "File upload and download",
                  "Folder management",
                  "Sharing and permissions"
                ]}
                crewxVersion=">=0.7.0"
              />
              <TemplateCard
                name="notion-skill"
                displayName="Notion Skill"
                description="Claude Code skill for Notion workspace integration"
                version="1.0.0"
                author="SowonLabs"
                tags={["notion", "productivity", "skill", "database"]}
                features={[
                  "Notion API integration",
                  "Page and database management",
                  "Content synchronization",
                  "Query and update capabilities"
                ]}
                crewxVersion=">=0.7.0"
              />
              <TemplateCard
                name="image-resizer-skill"
                displayName="Image Resizer Skill"
                description="Claude Code skill for image resizing and optimization"
                version="1.0.0"
                author="SowonLabs"
                tags={["image", "resize", "skill", "media"]}
                features={[
                  "Image resizing",
                  "Format conversion",
                  "Batch processing",
                  "Quality optimization"
                ]}
                crewxVersion=">=0.7.0"
              />
              <TemplateCard
                name="ocr-extractor-skill"
                displayName="OCR Extractor Skill"
                description="Claude Code skill for text extraction from images"
                version="1.0.0"
                author="SowonLabs"
                tags={["ocr", "text-extraction", "skill", "vision"]}
                features={[
                  "OCR text extraction",
                  "Multiple language support",
                  "Image preprocessing",
                  "High accuracy recognition"
                ]}
                crewxVersion=">=0.7.0"
              />
              <TemplateCard
                name="md-to-pdf-skill"
                displayName="Markdown to PDF Skill"
                description="Claude Code skill for converting Markdown to PDF"
                version="1.0.0"
                author="SowonLabs"
                tags={["markdown", "pdf", "skill", "conversion"]}
                features={[
                  "Markdown to PDF conversion",
                  "Custom styling support",
                  "Table of contents generation",
                  "Syntax highlighting"
                ]}
                crewxVersion=">=0.7.0"
              />
              <TemplateCard
                name="slack-upload-skill"
                displayName="Slack Upload Skill"
                description="Claude Code skill for Slack file uploads and messaging"
                version="1.0.0"
                author="SowonLabs"
                tags={["slack", "upload", "skill", "messaging"]}
                features={[
                  "Slack API integration",
                  "File upload to channels",
                  "Message posting",
                  "Channel management"
                ]}
                crewxVersion=">=0.7.0"
              />
            </div>
          </section>

          <section className={styles.quickStartSection}>
            <h2>📖 Quick Start</h2>

            <div className={styles.instructions}>
              <h3>Install a Template</h3>
              <pre><code>{`# 1. Install template
crewx template init [template-name]

# 2. Navigate to directory
cd [template-name]

# 3. Check configuration
cat crewx.yaml

# 4. Run agents
crewx agent ls                    # List available agents
crewx q "@agent_name question"    # Query mode
crewx x "@agent_name task"        # Execute mode`}</code></pre>

              <h3>Install to Specific Directory</h3>
              <pre><code>{`# Apply template to existing project
cd my-project
crewx template init wbs-automation`}</code></pre>
            </div>
          </section>

          <section className={styles.repositorySection}>
            <h2>🔗 Template Repository</h2>
            <p>
              All templates are maintained in the official repository:
            </p>
            <p>
              👉 <a href="https://github.com/sowonlabs/crewx-templates" target="_blank" rel="noopener noreferrer">
                github.com/sowonlabs/crewx-templates
              </a>
            </p>
          </section>
        </div>
      </main>
    </Layout>
  );
}
