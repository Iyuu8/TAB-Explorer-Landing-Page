# TAB Explorer — Version History & Feature Tracker

This document tracks the progress, features, and changes introduced across the different updates of **TAB Explorer**. Each update is documented with a dedicated section detailing all user-facing features, enhancements, and improvements, serving as a comprehensive log of the extension's evolution over time.

---

# Version 1.01

> **Status:** Current Chrome Web Store Release  
> **Release Focus:** Foundational Launch & Local File Integration

Version 1.01 represents the initial release of TAB Explorer on the Chrome Web Store. It reimagines tab management by replacing messy bookmark piles and overwhelming tab clutter with an intuitive, file-explorer-style workspace right inside Google Chrome's native side panel.

Below is the complete guide to all features and capabilities available in Version 1.01.

---

### 1. Chrome Side Panel Integration
* **Docked & Always Accessible:** TAB Explorer lives inside Chrome's native side panel. It stays open and pinned alongside your active browsing window without covering your web pages or requiring a separate tab.
* **1-Click Launch:** Simply click the TAB Explorer icon in your browser toolbar to instantly open or close the panel.
* **Full-Page View:** For times when you want a wide, spacious command center to organize lots of projects at once, clicking the maximize icon in the top header opens TAB Explorer as a full browser tab.

---

### 2. Workspaces: Context Separation
* **Dedicated Workspaces:** Create distinct, isolated workspaces for different parts of your life (for example: *Work*, *Studies*, *Client Projects*, *Personal Browsing*, or *Research*).
* **Workspace Switcher Bar:** A clean horizontal bar of pills sits right at the top of your workspace. Each workspace has its own color-coded dot and can be switched with a single click.
* **Mouse-Wheel Scrolling:** If you have many workspaces, simply hover over the switcher bar and scroll your mouse wheel to glide smoothly left and right across them.
* **Workspace Management:** Right-click any workspace pill or header to rename it, edit its settings, or safely delete it when a project is completed.
* **Workspace Tree Collapse:** Collapse the entire folder tree of your active workspace with a single click on the workspace header chevron for a compact view.

---

### 3. File-Explorer Folder Hierarchy
* **Nested Folders & Subfolders:** Structure your saved tabs exactly like folders on your computer. You can nest folders arbitrarily deep (e.g., *College > Semester 1 > Biology > Research Papers*).
* **Visual Connecting Guides:** Subtle vertical guidelines connect folders to their parent containers, making deep folder hierarchies easy to scan at a glance.
* **Folder Item Count Badges:** Every folder shows a discrete badge indicating the number of direct items inside it.
* **Expand & Collapse Chevrons:** Expand or collapse any folder at any time to keep your workspace tidy. The extension remembers which folders you left open even after closing Chrome.

---

### 4. 1-Click Tab Saving
* **Instant Capture:** Click the **Save Tabs** button in the top toolbar (or press `Ctrl+Shift+S` / `Cmd+Shift+S`) to capture all currently open browser tabs into your workspace in one go.
* **Target Destination Choice:** Choose exactly where to save your current tabs:
  * At the root of your active workspace.
  * Inside an existing folder.
  * Directly into a brand new folder created during the save process.
* **Two Smart Saving Modes:**
  * **Append Mode:** Adds the open tabs to your chosen folder while automatically skipping any links that are already saved there, preventing duplicate clutter.
  * **Replace Mode:** Completely replaces the contents of the target folder with your current open tabs, perfect for updating an ongoing project session.
* **Automatic Cleanliness:** Internal browser pages (such as blank new tabs or browser settings) are automatically filtered out, ensuring only real websites are saved.

---

### 5. Safe & Smart Tab Opening
* **Open Single Links:** Double-click any saved link or select it and hit `Enter` to open it immediately in a new browser tab.
* **Open Whole Folders:** Click **Open Tabs** in the toolbar or right-click any folder and select **Open** to launch all the links saved inside that folder.
* **Batch Freeze Protection:** Opening dozens of tabs at once can freeze or crash your browser. TAB Explorer includes built-in safeguards:
  * Displays a confirmation warning when launching large groups of tabs.
  * Opens tabs in controlled, throttled batches (batches of 10 with short intervals) so Chrome remains completely responsive and smooth.

---

### 6. Local File & Document Support *(New in 1.01)*
* **Organize Local Documents:** TAB Explorer is not limited to web addresses. You can now save and organize local files stored on your computer (such as PDF textbooks, HTML documentation, text files, and images) right alongside your web bookmarks.
* **Flexible File Path Input:** Paste local file paths directly into the link creation modal (supports Windows drive paths like `C:\Documents\paper.pdf`, macOS/Linux paths, and network share paths).
* **Drag-and-Drop File Paths:** Drag file paths directly into your folders or workspace to instantly register them as saved items.
* **Automatic Title Detection:** When adding a local file, TAB Explorer automatically derives a clean document name from the file path if you don't provide a custom title.
* **Dedicated File Glyphs:** Local files display a clean document icon rather than a website favicon so you can distinguish local files from web links at a glance.
* **Guided Permission Check:** If Chrome requires file access permissions to open local files, TAB Explorer displays a helpful notification guiding you to enable "Allow access to file URLs" in Chrome's extension settings.

---

### 7. Automatic Session Recovery (Crash & Restart Guard)
* **Background Tab Tracking:** The extension quietly maintains an automatic rolling snapshot of your open tabs in the background as you browse.
* **Smart Restart Detection:** If Chrome crashes, restarts, or closes unexpectedly and reopens without your previous tabs, TAB Explorer automatically detects the missing tabs.
* **1-Click Restore Prompt:** A restore banner appears at the top of the side panel offering to reopen your entire previous browsing session with a single click.

---

### 8. Cross-Workspace Instant Search
* **Search Everything at Once:** The top search bar searches across all your workspaces simultaneously.
* **Comprehensive Matching:** Instantly matches folder names, link titles, and full web addresses.
* **Breadcrumb Navigation:** Each search result displays its full location path (e.g., *Work Workspace > Q3 Report > References*), making it effortless to see where any saved link or folder belongs.

---

### 9. Desktop-Class File Explorer Controls
* **Multi-Selection:**
  * Click individual items to select them.
  * Hold `Ctrl` (or `Cmd` on Mac) and click to select multiple specific items.
  * Hold `Shift` and click to select a continuous range of items.
  * Press `Ctrl+A` / `Cmd+A` to select all visible items in the active workspace.
* **Drag-and-Drop Organization:**
  * Freely drag and drop links and folders to reorder them or move them into another folder.
  * Drop items directly onto workspace pills in the top bar to move them between workspaces.
* **Full Right-Click Context Menu:**
  * Right-click any workspace, folder, or link to access familiar commands: *Open*, *Rename*, *Cut*, *Copy*, *Paste*, *New Folder*, *New Link / File*, *Delete*, and *Edit*.
* **Cut, Copy & Paste:**
  * Cut items to move them to a new folder or workspace.
  * Copy items to duplicate them. Copying a folder duplicates the folder along with all nested subfolders and links inside it.
  * Built-in safeguards prevent invalid operations (such as attempting to paste a folder into itself).
* **Inline Renaming:** Press `F2` on any selected folder, workspace, or link to rename it immediately without opening a popup dialog.

---

### 10. Visual Customization & Personalization
* **Color-Coded Folders:** Assign custom colors to folders using a curated color palette or by entering any custom color code. The folder icon dynamically recolors to match your choice.
* **Starred Folders:** Star your most frequently used or important folders. Starred folders display a filled star and automatically pin to the top of their folder level for fast access.
* **Smart Brand Icons:** Automatically recognizes and applies high-resolution brand logos for popular platforms and tools, including:
  * AI Tools: *ChatGPT, Claude, Gemini, DeepSeek, Kimi*
  * Productivity & Code: *Google Drive, Gmail, Google Search, GitHub, Notion, Slack, Figma*
  * Media & Social: *YouTube, Facebook, Instagram, LinkedIn, Reddit, X (Twitter), WhatsApp*
* **Automatic Favicon Fallback:** For other websites, TAB Explorer automatically fetches website icons through Chrome's native icon cache or Google's favicon service, falling back to clean letter badges if no icon exists.
* **Custom Link Icons:** Override any link's icon by picking from preset brand logos or providing your own custom image URL.

---

### 11. 50-Step History & Undo
* **Complete Peace of Mind:** Every organizational action can be undone:
  * Creating, renaming, or editing folders and links.
  * Deleting items.
  * Moving items via drag and drop.
  * Cutting and pasting.
  * Saving tabs (Append or Replace).
  * Importing data or resetting workspaces.
* **Quick Undo Access:** Click the **Undo** button in the toolbar or press `Ctrl+Z` / `Cmd+Z`.
* **Persistent History:** Up to 50 previous actions are remembered, and your undo history stays intact even if you close and reopen the side panel.

---

### 12. Backup, Migration & Portability
* **Export Backup:** Download a portable, lightweight JSON backup file containing all your workspaces, folders, links, custom colors, and settings.
* **Import Data:** Restore your data from a backup file or migrate your setup to another computer or browser profile with full data validation.
* **Clean Slate Reset:** Clear all current data back to a clean default workspace whenever you want a fresh start (which can also be undone if clicked by mistake).

---

### 13. Keyboard Shortcuts Reference
TAB Explorer provides a comprehensive set of keyboard shortcuts for fast, mouse-free productivity:

| Shortcut | Action |
|---|---|
| `Ctrl` / `Cmd` + `Shift` + `S` | Open the Save Tabs dialog |
| `Ctrl` / `Cmd` + `Z` | Undo last action (up to 50 steps) |
| `Ctrl` / `Cmd` + `A` | Select all visible items |
| `Ctrl` / `Cmd` + `C` | Copy selected items |
| `Ctrl` / `Cmd` + `X` | Cut selected items |
| `Ctrl` / `Cmd` + `V` | Paste cut or copied items into selected folder |
| `F2` | Rename selected item inline |
| `Enter` | Open selected link(s) or folder |
| `Delete` / `Backspace` | Delete selected item(s) |
| `Escape` | Clear current selection or close open dialogs/menus |

*(Shortcuts are automatically bypassed when typing in text fields to avoid interference.)*

---

### 14. Local-First Privacy & Zero Tracking
* **100% On-Device Storage:** All your workspaces, links, folders, and preferences are stored exclusively on your own computer.
* **No Accounts or Cloud Servers:** No sign-up, no passwords, and no cloud synchronization needed.
* **No Telemetry or Tracking:** Zero analytics, zero ad trackers, and zero network calls back to external servers.
* **No Content Reading:** The extension never reads webpage contents, form inputs, or passwords.
