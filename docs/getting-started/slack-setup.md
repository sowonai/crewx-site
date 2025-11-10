# Slack App Installation Guide

Step-by-step instructions for connecting the CrewX Slack bot to your workspace.

## 📋 Overview

The integration requires three Slack credentials. After creating the Slack App, gather the following and store them securely:

1. **Bot User OAuth Token** (`xoxb-…`)
2. **App-Level Token** (`xapp-…`)
3. **Signing Secret**

---

## ⚡ Quick Setup (using the manifest)

If you prefer not to configure scopes and events manually, you can import the manifest bundled in this repository.

1. Go to the [Slack App dashboard](https://api.slack.com/apps).
2. Select **Create New App → From an app manifest**.
3. Choose your workspace and paste the contents of `slack-app-manifest.yaml` from the project root.
4. Review the summary and click **Create**. All required scopes, events, and Socket Mode settings will be preconfigured.
5. Continue with the sections below to issue tokens and configure environment variables.

> The manifest includes OAuth scopes, event subscriptions, and Socket Mode configuration, so you can skip the manual setup steps if desired.

---

## 🚀 Step-by-step setup

### Step 1: Create the Slack App

1. Visit [https://api.slack.com/apps](https://api.slack.com/apps).
2. Click **Create New App**.
3. Choose **From scratch**.
4. Enter `CrewX` as the App Name.
5. Select the target workspace.
6. Click **Create App**.

---

### Step 2: Add Bot Token scopes ⚡

> **Important:** Scopes must be configured before you can install the app and receive tokens.

1. In the left sidebar, open **OAuth & Permissions**.
2. Scroll to the **Scopes** section.
3. Under **Bot Token Scopes**, click **Add an OAuth Scope**.
4. Add each of the following scopes individually:

   | Scope | Purpose |
   |-------|---------|
   | `app_mentions:read` | Read messages when the bot is mentioned |
   | `chat:write` | Send messages as the bot |
   | `channels:history` | Read channel messages (thread history) |
   | `channels:read` | View channel metadata |
   | `reactions:write` | Add emoji reactions (bot status indicators) |
   | `reactions:read` | Read existing reactions |
   | `im:history` | Read direct message history |
   | `groups:history` | Read private channel history (optional) |

✅ Make sure all scopes are added before proceeding.

> **Why reactions are required?**  
> The bot reacts with 👀 while it is processing a request, ✅ on success, and ❌ on errors so that the channel can see status updates at a glance.

> **Why history scopes are required?**  
> `channels:history` is necessary to reconstruct thread context. `im:history` enables the same behaviour inside direct messages.

---

### Step 3: Enable Socket Mode 🔌

1. In the sidebar, open **Socket Mode**.
2. Toggle **Enable Socket Mode** to **On**.
3. When prompted:
   - Enter `crewx-socket` as the token name.
   - Click **Add Scope**, choose `connections:write`, then click **Generate**.
4. Copy the generated App-Level Token (`xapp-…`) and store it securely.
   > You will not be able to view it again later.

```
Example: xapp-1-A01234567-1234567890123-abcdefghijklmnop
```

---

### Step 4: Configure Event Subscriptions 📡

1. In the sidebar, open **Event Subscriptions**.
2. Toggle **Enable Events** to **On**.
3. Scroll to **Subscribe to bot events** and click **Add Bot User Event**.
4. Add the following events:

   | Event | Purpose |
   |-------|---------|
   | `app_mention` | Trigger when someone mentions @crewx |
   | `message.channels` | Listen to channel messages (optional) |

5. Click **Save Changes**.

---

### Step 5: Install the app to your workspace 🏢

1. Open **Install App** in the sidebar.
2. Click **Install to Workspace**.
3. Review the requested permissions (message access, channel info, send messages).
4. Click **Allow**.
5. Copy the Bot User OAuth Token (`xoxb-…`) displayed after installation.

```
Example: xoxb-XXXXXXXXXXXX-XXXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX
```

---

### Step 6: Collect the Signing Secret 🔐

1. Navigate to **Basic Information**.
2. Under **App Credentials**, locate **Signing Secret**.
3. Click **Show**, copy the value, and store it in your secrets manager.

> Keep all three credentials (`xoxb`, `xapp`, `Signing Secret`) secure. They will be stored in a local environment file shortly.

---

## 🧾 Environment variables

Create a `.env.slack` file in the project root:

```bash
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-level-token
SLACK_SIGNING_SECRET=your-signing-secret

# Optional overrides
SLACK_LOG_LEVEL=info
SLACK_MAX_RESPONSE_LENGTH=400000
```

> Do not commit this file to source control.

---

## 🚀 Run the bot

After the environment variables are in place, start the Slack bot:

```bash
# Build once (if you have not already)
npm run build

# Default: query-only mode with the Claude agent
source .env.slack && crewx slack

# Allow agents to perform execute tasks (file changes, migrations, etc.)
source .env.slack && crewx slack --mode execute

# Mention-Only mode: Bot only responds when @mentioned
source .env.slack && crewx slack --mention-only

# Switch the default agent
source .env.slack && crewx slack --agent gemini
source .env.slack && crewx slack --agent copilot

# Enable verbose logging
source .env.slack && crewx slack --log
source .env.slack && crewx slack --agent gemini --log
```

You should see:

```
⚡️ CrewX Slack Bot is running!
📱 Socket Mode: Enabled
🤖 Using default agent for Slack: claude
⚙️  Slack bot mode: query
```

---

## 🎯 Mention-Only Mode

By default, CrewX Slack Bot responds to all messages in channels where it's invited. **Mention-Only mode** changes this behavior so the bot only responds when explicitly @mentioned.

### When to Use Mention-Only Mode

**Use Mention-Only when:**
- Bot is in busy channels where not all messages need AI responses
- You want to reduce noise and token usage
- Team prefers opt-in AI assistance
- Bot shares space with other bots or workflows

**Use Default mode when:**
- Dedicated AI assistance channels
- Small team channels where AI context is always helpful
- You want seamless, always-available AI support

### How It Works

**Default Mode (Always Listening):**
```
User: "How do I implement authentication?"
Bot: 🤖 [Responds automatically]
```

**Mention-Only Mode:**
```
User: "How do I implement authentication?"
Bot: [No response]

User: "@crewx How do I implement authentication?"
Bot: 🤖 [Responds when mentioned]
```

### Starting in Mention-Only Mode

```bash
# Query mode with mention-only
source .env.slack && crewx slack --mention-only

# Execute mode with mention-only
source .env.slack && crewx slack --mode execute --mention-only

# With specific agent
source .env.slack && crewx slack --agent gemini --mention-only
```

### Direct Messages (DMs)

Mention-Only mode **does not affect** direct messages. The bot always responds to DMs regardless of this setting:

```
# DMs always work in both modes
[Direct message to @crewx]
User: "Help me debug this error"
Bot: 🤖 [Always responds in DMs]
```

### Comparison Table

| Feature | Default Mode | Mention-Only Mode |
|---------|--------------|-------------------|
| Channel messages | All messages | Only @mentions |
| Thread replies | All messages in thread | Only when @mentioned |
| Direct messages | ✅ Responds | ✅ Responds |
| Token usage | Higher (all messages) | Lower (opt-in only) |
| Best for | Dedicated AI channels | Busy multi-purpose channels |

### Tips

1. **Choose mode per workspace** - Different Slack workspaces may need different modes
2. **Combine with channels** - Use default mode in `#ai-help` channel, mention-only in `#general`
3. **Team preference** - Ask your team which mode they prefer
4. **Test both** - Try each mode to see what fits your workflow

---

## 🧪 Quick test checklist

1. Invite the bot to a channel:
   ```
   /invite @crewx
   ```
2. Send a message:
   ```
   @crewx Hello! What can you help me with?
   ```
3. The bot replies in-thread ✔️

---

## ❓ Troubleshooting

### Bot is not responding

1. Confirm the bot was invited to the channel (`/invite @crewx`).
2. Verify all three tokens and ensure there are no leading/trailing spaces.
3. Ensure Socket Mode is enabled on [https://api.slack.com/apps](https://api.slack.com/apps).
4. Confirm that `app_mention` and any other required events are subscribed.

### “Missing Scope” errors

The bot is missing permissions. Return to **Step 2** and confirm every scope is present:

- `app_mentions:read`
- `chat:write`
- `channels:history`
- `channels:read`
- `reactions:write`
- `reactions:read`
- `im:history`
- `groups:history` (optional)

After adding scopes, reinstall the app:

1. Open **OAuth & Permissions**.
2. Click **Install App** → **Reinstall to Workspace**.
3. Approve the updated scope list.

### Thread context is missing

- Ensure the history scopes (`channels:history`, `im:history`) are present.
- Reinstall the app after adding new scopes to refresh the permission grant.

### View detailed logs

```bash
source .env.slack && crewx slack --log-level debug
```

---

## 📚 Next steps

- [Slack Bot Usage Guide](./README_SLACK_BOT.md)
- [Advanced configuration](./SLACK_BOT_SETUP.md)
- [Agent customization](./crewx.yaml)

---

## 🔒 Security notes

- Never commit `.env.slack` to source control.
- Do not share tokens in public channels or repositories.
- If a credential leaks, rotate it immediately from [https://api.slack.com/apps](https://api.slack.com/apps).

---

**You’re all set!** 🎉 CrewX is ready to work inside Slack.
