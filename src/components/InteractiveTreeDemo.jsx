import React, { useState, useRef, useMemo, useCallback } from 'react';
import { 
  ChevronRight, 
  Star, 
  Save, 
  FolderOpen, 
  Layers, 
  Undo2, 
  Search, 
  Link2, 
  FolderPlus,
  X
} from 'lucide-react';

const FOLDER_PALETTE = ["#2B2B2B", "#1f3a63", "#2f6b3a", "#7a3b2e", "#5a3b7a", "#2e6b6b"];

function darkerFolderBack(frontColor) {
  const hex = (frontColor || "#2B2B2B").replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return "#242424";
  const ratio = 0x24 / 0x2b;
  const channels = [0, 2, 4].map((start) => {
    const value = parseInt(hex.slice(start, start + 2), 16);
    return Math.max(0, Math.min(255, Math.round(value * ratio))).toString(16).padStart(2, "0");
  });
  return `#${channels.join("")}`;
}

function FolderGlyph({ color }) {
  const front = color || "#2B2B2B";
  const back = darkerFolderBack(front);
  return (
    <svg viewBox="0 0 16 13" style={{ width: '16px', height: '14px', flexShrink: 0 }} aria-hidden="true">
      <path d="M0 2.4C0 1.4 0.8 0.6 1.8 0.6H6L7.4 2H14.2C15.2 2 16 2.8 16 3.8V10.6C16 11.6 15.2 12.4 14.2 12.4H1.8C0.8 12.4 0 11.6 0 10.6V2.4Z" fill={back} />
      <path d="M0 4.2H16V10.6C16 11.6 15.2 12.4 14.2 12.4H1.8C0.8 12.4 0 11.6 0 10.6V4.2Z" fill={front} />
    </svg>
  );
}

function LinkGlyph({ link }) {
  const [broken, setBroken] = useState(false);
  if (link.icon && !broken) {
    return (
      <img
        src={link.icon}
        width="13"
        height="13"
        onError={() => setBroken(true)}
        style={{ flexShrink: 0, borderRadius: 2, objectFit: 'contain' }}
        alt=""
      />
    );
  }
  const fallback = (link.title || link.url || "?").trim().charAt(0).toUpperCase();
  return (
    <span
      style={{
        width: '13px',
        height: '13px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        borderRadius: '3px',
        backgroundColor: '#2080FF',
        color: '#FFFFFF',
        fontSize: '8.5px',
        lineHeight: 1,
        fontWeight: 700,
      }}
    >
      {fallback}
    </span>
  );
}

const INITIAL_WORKSPACES = [
  { id: 'ws-personal', name: 'Personal' },
  { id: 'ws-client', name: 'Client Work' },
  { id: 'ws-phd', name: 'PhD Research' }
];

const INITIAL_FOLDERS = [
  {
    id: 'f-ai',
    workspaceId: 'ws-personal',
    parentId: null,
    name: 'AI Assistants & Research',
    color: '#1f3a63',
    starred: true,
    createdAt: 1000,
  },
  {
    id: 'f-dev',
    workspaceId: 'ws-personal',
    parentId: null,
    name: 'React 19 & Frontend Docs',
    color: '#2f6b3a',
    starred: false,
    createdAt: 2000,
  },
  {
    id: 'f-read',
    workspaceId: 'ws-personal',
    parentId: null,
    name: 'Architecture & Design',
    color: '#7a3b2e',
    starred: false,
    createdAt: 3000,
  },
  {
    id: 'f-client',
    workspaceId: 'ws-client',
    parentId: null,
    name: 'Client Redesign 2026',
    color: '#5a3b7a',
    starred: true,
    createdAt: 1000,
  },
  {
    id: 'f-phd',
    workspaceId: 'ws-phd',
    parentId: null,
    name: 'Neural Systems & Agents',
    color: '#2e6b6b',
    starred: false,
    createdAt: 1000,
  }
];

const INITIAL_LINKS = [
  // Links in Personal / AI folder
  { id: 'l1', workspaceId: 'ws-personal', parentId: 'f-ai', title: 'ChatGPT — GPT-4o Workspace', url: 'https://chatgpt.com', icon: 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=64' },
  { id: 'l2', workspaceId: 'ws-personal', parentId: 'f-ai', title: 'Claude 3.7 Sonnet Thinking', url: 'https://claude.ai', icon: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=64' },
  { id: 'l3', workspaceId: 'ws-personal', parentId: 'f-ai', title: 'Google Gemini Pro', url: 'https://gemini.google.com', icon: 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=64' },
  { id: 'l4', workspaceId: 'ws-personal', parentId: 'f-ai', title: 'DeepSeek R1 Reasoning', url: 'https://deepseek.com', icon: 'https://www.google.com/s2/favicons?domain=deepseek.com&sz=64' },

  // Links in Personal / Dev folder
  { id: 'l5', workspaceId: 'ws-personal', parentId: 'f-dev', title: 'React Official Documentation', url: 'https://react.dev', icon: 'https://www.google.com/s2/favicons?domain=react.dev&sz=64' },
  { id: 'l6', workspaceId: 'ws-personal', parentId: 'f-dev', title: 'GitHub — TAB Explorer Repo', url: 'https://github.com/Iyuu8/TAB-Explorer', icon: 'https://www.google.com/s2/favicons?domain=github.com&sz=64' },
  { id: 'l7', workspaceId: 'ws-personal', parentId: 'f-dev', title: 'Chrome Extensions API Docs', url: 'https://developer.chrome.com', icon: 'https://www.google.com/s2/favicons?domain=developer.chrome.com&sz=64' },

  // Links in Personal / Reading folder
  { id: 'l8', workspaceId: 'ws-personal', parentId: 'f-read', title: 'Local-First Software: You Own Your Data', url: 'https://inkandswitch.com', icon: 'https://www.google.com/s2/favicons?domain=inkandswitch.com&sz=64' },
  { id: 'l9', workspaceId: 'ws-personal', parentId: 'f-read', title: 'The Anatomy of a Fast Browser Extension', url: 'https://web.dev', icon: 'https://www.google.com/s2/favicons?domain=web.dev&sz=64' },

  // Link directly in Personal workspace root (parentId: null)
  { id: 'l-root', workspaceId: 'ws-personal', parentId: null, title: 'Personal Dashboard & Mail', url: 'https://mail.google.com', icon: 'https://www.google.com/s2/favicons?domain=mail.google.com&sz=64' },

  // Client Work folder links
  { id: 'l10', workspaceId: 'ws-client', parentId: 'f-client', title: 'Figma — Brand Design System', url: 'https://figma.com', icon: 'https://www.google.com/s2/favicons?domain=figma.com&sz=64' },
  { id: 'l11', workspaceId: 'ws-client', parentId: 'f-client', title: 'Notion — Sprint Planning & Scope', url: 'https://notion.so', icon: 'https://www.google.com/s2/favicons?domain=notion.so&sz=64' },
  { id: 'l12', workspaceId: 'ws-client', parentId: 'f-client', title: 'Google Drive — Delivery Assets', url: 'https://drive.google.com', icon: 'https://www.google.com/s2/favicons?domain=drive.google.com&sz=64' },

  // PhD Research folder links
  { id: 'l13', workspaceId: 'ws-phd', parentId: 'f-phd', title: 'arXiv — Large Language Agent Frameworks', url: 'https://arxiv.org', icon: 'https://www.google.com/s2/favicons?domain=arxiv.org&sz=64' },
  { id: 'l14', workspaceId: 'ws-phd', parentId: 'f-phd', title: 'Google Scholar Search', url: 'https://scholar.google.com', icon: 'https://www.google.com/s2/favicons?domain=google.com&sz=64' },
];

export default function InteractiveTreeDemo() {
  const [workspaces, setWorkspaces] = useState(INITIAL_WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('ws-personal');
  const [folders, setFolders] = useState(INITIAL_FOLDERS);
  const [links, setLinks] = useState(INITIAL_LINKS);

  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState({
    'f-ai': true,
    'f-dev': true,
    'f-read': false,
    'f-client': true,
    'f-phd': true,
  });

  const [workspaceCollapsed, setWorkspaceCollapsed] = useState(false);

  // Undo history stack (stores snapshots of workspaces, folders, links)
  const [history, setHistory] = useState([]);

  // Selection state
  const [selection, setSelection] = useState([]);
  const [lastSelected, setLastSelected] = useState(null);

  // Drag and Drop state
  const [draggedItems, setDraggedItems] = useState(null);
  const [dragOverTarget, setDragOverTarget] = useState(null);

  // Hidden File input ref for JSON import
  const importInputRef = useRef(null);
  const containerRef = useRef(null);

  // Active modal state: null | 'saveTabs' | 'newWorkspace' | 'newFolder' | 'newLink'
  const [activeModal, setActiveModal] = useState(null);

  // Save Tabs Modal states
  const [saveTargetId, setSaveTargetId] = useState('__new__');
  const [saveMode, setSaveMode] = useState('append'); // 'append' | 'replace'
  const [newSaveFolderName, setNewSaveFolderName] = useState('Saved Session');

  // New Workspace / Folder / Link modal states
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_PALETTE[1]);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const activeWorkspace = useMemo(
    () => workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0],
    [workspaces, activeWorkspaceId]
  );

  const pushHistory = useCallback(() => {
    setHistory((prev) => [
      JSON.parse(JSON.stringify({ workspaces, folders, links, activeWorkspaceId })),
      ...prev
    ].slice(0, 50));
  }, [workspaces, folders, links, activeWorkspaceId]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[0];
    setHistory((h) => h.slice(1));
    setWorkspaces(prev.workspaces);
    setFolders(prev.folders);
    setLinks(prev.links);
    setActiveWorkspaceId(prev.activeWorkspaceId || prev.workspaces[0]?.id || 'ws-personal');
    setSelection([]);
  }, [history]);

  // Folders for active workspace
  const wsFolders = useMemo(
    () => folders.filter((f) => f.workspaceId === activeWorkspaceId),
    [folders, activeWorkspaceId]
  );

  // Links for active workspace
  const wsLinks = useMemo(
    () => links.filter((l) => l.workspaceId === activeWorkspaceId),
    [links, activeWorkspaceId]
  );

  // Sort folders with Starred at top (replicates useTabExplorer.js)
  const sortFolders = useCallback((list) => {
    return [...list].sort((a, b) => {
      if (!!a.starred !== !!b.starred) return a.starred ? -1 : 1;
      return (a.createdAt || 0) - (b.createdAt || 0);
    });
  }, []);

  const childFolders = useCallback(
    (parentId) => sortFolders(wsFolders.filter((f) => f.parentId === parentId)),
    [wsFolders, sortFolders]
  );

  const childLinks = useCallback(
    (parentId) => wsLinks.filter((l) => l.parentId === parentId),
    [wsLinks]
  );

  const directCount = useCallback(
    (folderId) => childFolders(folderId).length + childLinks(folderId).length,
    [childFolders, childLinks]
  );

  // Flat list of visible items for Shift+Click range selection
  const flatVisible = useMemo(() => {
    const list = [{ type: 'workspace', id: activeWorkspaceId }];
    if (!workspaceCollapsed) {
      function walk(parentId) {
        childFolders(parentId).forEach((f) => {
          list.push({ type: 'folder', id: f.id });
          if (expanded[f.id]) walk(f.id);
        });
        childLinks(parentId).forEach((l) => {
          list.push({ type: 'link', id: l.id });
        });
      }
      walk(null);
    }
    return list;
  }, [activeWorkspaceId, workspaceCollapsed, childFolders, childLinks, expanded]);

  const isSelected = useCallback((type, id) => {
    return selection.some((s) => s.type === type && s.id === id);
  }, [selection]);

  const clearSelection = useCallback(() => {
    setSelection([]);
    setLastSelected(null);
  }, []);

  // Currently selected folder ID: if single folder selected, return its ID; otherwise null (root)
  const selectedFolderId = useMemo(() => {
    if (selection.length === 1 && selection[0].type === 'folder') {
      return selection[0].id;
    }
    return null;
  }, [selection]);

  const handleDeleteSelection = useCallback(() => {
    if (selection.length === 0) return;
    pushHistory();
    const folderIdsToDelete = new Set(selection.filter((s) => s.type === 'folder').map((s) => s.id));
    const linkIdsToDelete = new Set(selection.filter((s) => s.type === 'link').map((s) => s.id));

    // Also collect all descendants of deleted folders
    function collectDescendants(fid) {
      folders.filter((f) => f.parentId === fid).forEach((sub) => {
        folderIdsToDelete.add(sub.id);
        collectDescendants(sub.id);
      });
      links.filter((l) => l.parentId === fid).forEach((subL) => {
        linkIdsToDelete.add(subL.id);
      });
    }
    Array.from(folderIdsToDelete).forEach(collectDescendants);

    setFolders((prev) => prev.filter((f) => !folderIdsToDelete.has(f.id)));
    setLinks((prev) => prev.filter((l) => !linkIdsToDelete.has(l.id)));
    clearSelection();
  }, [selection, pushHistory, folders, links, clearSelection]);

  // Selection handler supporting single click, Ctrl/Cmd toggle, and Shift range selection
  const handleSelect = useCallback((type, id, e) => {
    if (e) e.stopPropagation();

    // 1. Shift + click -> Range selection
    if (e && e.shiftKey && lastSelected) {
      const a = flatVisible.findIndex((x) => x.type === lastSelected.type && x.id === lastSelected.id);
      const b = flatVisible.findIndex((x) => x.type === type && x.id === id);
      if (a !== -1 && b !== -1) {
        const [lo, hi] = a < b ? [a, b] : [b, a];
        setSelection(flatVisible.slice(lo, hi + 1));
        return;
      }
    }

    // 2. Ctrl / Cmd + click -> Multi-selection toggle
    if (e && (e.ctrlKey || e.metaKey)) {
      setSelection((prev) => {
        const exists = prev.some((s) => s.type === type && s.id === id);
        if (exists) {
          return prev.filter((s) => !(s.type === type && s.id === id));
        }
        return [...prev, { type, id }];
      });
      setLastSelected({ type, id });
      return;
    }

    // 3. Plain single click -> Select this item only
    setSelection([{ type, id }]);
    setLastSelected({ type, id });
  }, [flatVisible, lastSelected]);

  // Keyboard shortcut listener on demo container
  const handleKeyDown = useCallback((e) => {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

    if (e.key === 'Escape') {
      clearSelection();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      setSelection(flatVisible);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selection.length > 0) {
        e.preventDefault();
        handleDeleteSelection();
      }
    }
  }, [clearSelection, flatVisible, selection, handleDeleteSelection]);

  const toggleFolder = (folderId, e) => {
    if (e) e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  // Toggle star moves folder immediately to top due to sortFolders
  const toggleStar = (e, folderId) => {
    e.stopPropagation();
    pushHistory();
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, starred: !f.starred } : f))
    );
  };

  // Single-item delete from row X button
  const handleDeleteOne = (type, id, e) => {
    if (e) e.stopPropagation();
    pushHistory();
    if (type === 'folder') {
      const folderIdsToDelete = new Set([id]);
      const linkIdsToDelete = new Set();
      function collectDesc(fid) {
        folders.filter((f) => f.parentId === fid).forEach((sub) => {
          folderIdsToDelete.add(sub.id);
          collectDesc(sub.id);
        });
        links.filter((l) => l.parentId === fid).forEach((subL) => linkIdsToDelete.add(subL.id));
      }
      collectDesc(id);
      setFolders((prev) => prev.filter((f) => !folderIdsToDelete.has(f.id)));
      setLinks((prev) => prev.filter((l) => !linkIdsToDelete.has(l.id)));
    } else {
      setLinks((prev) => prev.filter((l) => l.id !== id));
    }
    setSelection((prev) => prev.filter((s) => !(s.type === type && s.id === id)));
  };

  // Track blocked links when browser popup blocker intervenes
  const [blockedLinks, setBlockedLinks] = useState([]);
  const [batchTargetLinks, setBatchTargetLinks] = useState([]);
  const [openedCount, setOpenedCount] = useState(0);

  // Double click opens link in new tab
  const handleOpenLink = (link) => {
    window.open(link.url, '_blank');
  };

  const handleOpenSingleTab = (link) => {
    window.open(link.url, '_blank');
    setBlockedLinks((prev) => prev.filter((b) => b.id !== link.id));
    setOpenedCount((prev) => prev + 1);
  };

  const handleOpenNextBlocked = () => {
    if (blockedLinks.length === 0) return;
    const next = blockedLinks[0];
    window.open(next.url, '_blank');
    setBlockedLinks((prev) => prev.slice(1));
    setOpenedCount((prev) => prev + 1);
  };

  // Toolbar Open Tabs button:
  // Collects all unique links from selected folders, selected links, or current workspace
  const handleToolbarOpenTabs = () => {
    let targetLinks = [];

    if (selection.length > 0) {
      const seen = new Set();
      selection.forEach((s) => {
        if (s.type === 'link') {
          const l = links.find((x) => x.id === s.id);
          if (l && !seen.has(l.id)) {
            seen.add(l.id);
            targetLinks.push(l);
          }
        } else if (s.type === 'folder') {
          // Recursively collect links inside this folder
          const stack = [s.id];
          while (stack.length > 0) {
            const fid = stack.pop();
            for (const l of links) {
              if (l.parentId === fid && !seen.has(l.id)) {
                seen.add(l.id);
                targetLinks.push(l);
              }
            }
            for (const f of folders) {
              if (f.parentId === fid) {
                stack.push(f.id);
              }
            }
          }
        } else if (s.type === 'workspace') {
          for (const l of links) {
            if (l.workspaceId === s.id && !seen.has(l.id)) {
              seen.add(l.id);
              targetLinks.push(l);
            }
          }
        }
      });
    } else {
      // Nothing selected -> open all links in active workspace
      targetLinks = links.filter((l) => l.workspaceId === activeWorkspaceId);
    }

    if (targetLinks.length === 0) return;

    setBatchTargetLinks(targetLinks);

    // If only 1 link, open directly without batch dialog
    if (targetLinks.length === 1) {
      window.open(targetLinks[0].url, '_blank');
      return;
    }

    // Attempt to open all links synchronously
    let opened = 0;
    const blocked = [];
    targetLinks.forEach((l) => {
      try {
        const win = window.open(l.url, '_blank');
        if (!win) {
          blocked.push(l);
        } else {
          opened++;
        }
      } catch (e) {
        blocked.push(l);
      }
    });

    setOpenedCount(opened);
    setBlockedLinks(blocked);

    try {
      window.focus();
    } catch {}

    if (blocked.length > 0) {
      setActiveModal('batchTabs');
    } else {
      setActiveModal(null);
    }
  };

  // Drag and Drop (Folders and Links, within and across workspaces)
  const handleDragStart = (e, item) => {
    const isItemInSelection = selection.some((s) => s.type === item.type && s.id === item.id);
    const itemsToDrag = isItemInSelection && selection.length > 1 ? selection : [item];

    setDraggedItems(itemsToDrag);
    e.dataTransfer.setData('application/json', JSON.stringify(itemsToDrag));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetKey) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTarget(targetKey);
  };

  const handleDragLeave = (e, targetKey) => {
    e.stopPropagation();
    setDragOverTarget((prev) => (prev === targetKey ? null : prev));
  };

  // Move items to a folder or to the workspace root
  const moveItems = useCallback((items, targetFolderId, targetWorkspaceId) => {
    pushHistory();
    const folderIds = new Set(items.filter((i) => i.type === 'folder').map((i) => i.id));
    const linkIds = new Set(items.filter((i) => i.type === 'link').map((i) => i.id));

    // Descendants when moving workspace
    const descFolderIds = new Set();
    const descLinkIds = new Set();
    function collectDesc(fid) {
      folders.filter((f) => f.parentId === fid).forEach((sub) => {
        descFolderIds.add(sub.id);
        collectDesc(sub.id);
      });
      links.filter((l) => l.parentId === fid).forEach((subL) => descLinkIds.add(subL.id));
    }
    folderIds.forEach(collectDesc);

    setFolders((prev) =>
      prev.map((f) => {
        if (folderIds.has(f.id)) {
          return { ...f, parentId: targetFolderId, workspaceId: targetWorkspaceId };
        }
        if (descFolderIds.has(f.id)) {
          return { ...f, workspaceId: targetWorkspaceId };
        }
        return f;
      })
    );

    setLinks((prev) =>
      prev.map((l) => {
        if (linkIds.has(l.id)) {
          return { ...l, parentId: targetFolderId, workspaceId: targetWorkspaceId };
        }
        if (descLinkIds.has(l.id)) {
          return { ...l, workspaceId: targetWorkspaceId };
        }
        return l;
      })
    );

    if (targetFolderId && targetWorkspaceId === activeWorkspaceId) {
      setExpanded((prev) => ({ ...prev, [targetFolderId]: true }));
    }
    clearSelection();
  }, [pushHistory, folders, links, activeWorkspaceId, clearSelection]);

  const handleDropOnFolder = (e, targetFolderId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverTarget(null);
    if (!draggedItems) return;
    moveItems(draggedItems, targetFolderId, activeWorkspaceId);
    setDraggedItems(null);
  };

  const handleDropOnWorkspace = (destWsId) => {
    if (!draggedItems) return;
    moveItems(draggedItems, null, destWsId);
    setActiveWorkspaceId(destWsId);
    setDraggedItems(null);
  };

  // Export JSON backup
  const handleExport = () => {
    const payload = {
      app: "TabExplorer",
      exportedAt: new Date().toISOString(),
      data: {
        workspaces,
        folders,
        links,
        activeWorkspaceId,
        expanded
      }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tabexplorer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || ""));
        const candidate = parsed.data || parsed;
        if (candidate.workspaces && candidate.workspaces.length) {
          pushHistory();
          setWorkspaces(candidate.workspaces);
          setFolders(candidate.folders || []);
          setLinks(candidate.links || []);
          setActiveWorkspaceId(candidate.activeWorkspaceId || candidate.workspaces[0].id);
          setExpanded(candidate.expanded || {});
          clearSelection();
        }
      } catch {
        // silent fail
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Reset to default data
  const handleReset = () => {
    if (window.confirm("Reset all TabExplorer workspaces, folders, and links to default? You can undo this action with the Undo button.")) {
      pushHistory();
      setWorkspaces(INITIAL_WORKSPACES);
      setActiveWorkspaceId('ws-personal');
      setFolders(INITIAL_FOLDERS);
      setLinks(INITIAL_LINKS);
      setExpanded({
        'f-ai': true,
        'f-dev': true,
        'f-read': false,
        'f-client': true,
        'f-phd': true,
      });
      clearSelection();
    }
  };

  // Save Tabs Execution: Supports creating a new folder directly or saving to root / existing folder
  const executeSaveTabs = () => {
    pushHistory();
    const mockNewTabs = [
      { id: 'mock-' + Date.now() + '-1', title: 'Chrome Web Store: TAB Explorer', url: 'https://chromewebstore.google.com', icon: 'https://www.google.com/s2/favicons?domain=google.com&sz=64' },
      { id: 'mock-' + Date.now() + '-2', title: 'GitHub — TAB Explorer Source', url: 'https://github.com/Iyuu8/TAB-Explorer', icon: 'https://www.google.com/s2/favicons?domain=github.com&sz=64' },
      { id: 'mock-' + Date.now() + '-3', title: 'MDN Web Docs: Browser Extensions', url: 'https://developer.mozilla.org', icon: 'https://www.google.com/s2/favicons?domain=mozilla.org&sz=64' },
    ];

    if (saveTargetId === '__new__') {
      const folderName = newSaveFolderName.trim() || ('Saved Tabs ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      const newF = {
        id: 'folder-' + Date.now(),
        workspaceId: activeWorkspaceId,
        parentId: null,
        name: folderName,
        color: FOLDER_PALETTE[1],
        starred: false,
        createdAt: Date.now(),
      };
      const toAdd = mockNewTabs.map((t) => ({
        ...t,
        workspaceId: activeWorkspaceId,
        parentId: newF.id,
        createdAt: Date.now(),
      }));

      setFolders((prev) => [...prev, newF]);
      setLinks((prev) => [...prev, ...toAdd]);
      setExpanded((prev) => ({ ...prev, [newF.id]: true }));
    } else if (saveTargetId === '__root__') {
      // Save directly into the workspace root (parentId: null)
      const toAdd = mockNewTabs.map((t) => ({
        ...t,
        workspaceId: activeWorkspaceId,
        parentId: null,
        createdAt: Date.now(),
      }));
      setLinks((prev) => [...prev, ...toAdd]);
    } else {
      // Existing folder
      const targetFolderId = saveTargetId;
      const toAdd = mockNewTabs.map((t) => ({
        ...t,
        workspaceId: activeWorkspaceId,
        parentId: targetFolderId,
        createdAt: Date.now(),
      }));

      if (saveMode === 'replace') {
        setLinks((prev) => [
          ...prev.filter((l) => l.parentId !== targetFolderId),
          ...toAdd
        ]);
      } else {
        setLinks((prev) => [...prev, ...toAdd]);
      }
      setExpanded((prev) => ({ ...prev, [targetFolderId]: true }));
    }

    setActiveModal(null);
    setNewSaveFolderName('Saved Session');
  };

  const executeCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) return;
    pushHistory();
    const name = newWorkspaceName.trim();
    const newWs = {
      id: 'ws-' + Date.now(),
      name,
    };
    setWorkspaces((prev) => [...prev, newWs]);
    setActiveWorkspaceId(newWs.id);
    setNewWorkspaceName('');
    setActiveModal(null);
  };

  // Create folder: Directly inside selected folder or inside active workspace (no redundant dropdown)
  const executeCreateFolder = () => {
    if (!newFolderName.trim()) return;
    pushHistory();
    const parentId = selectedFolderId; // If folder selected -> subfolder; if not -> workspace root
    const newF = {
      id: 'folder-' + Date.now(),
      workspaceId: activeWorkspaceId,
      parentId,
      name: newFolderName.trim(),
      color: newFolderColor,
      starred: false,
      createdAt: Date.now(),
    };
    setFolders((prev) => [...prev, newF]);
    if (parentId) {
      setExpanded((prev) => ({ ...prev, [parentId]: true }));
    }
    setNewFolderName('');
    setActiveModal(null);
  };

  // Create link: Directly inside selected folder or workspace root (no redundant dropdown)
  const executeCreateLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
    pushHistory();

    const parentId = selectedFolderId; // If folder selected -> inside folder; if not -> workspace root (parentId: null)
    const domain = newLinkUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
    const newL = {
      id: 'link-' + Date.now(),
      workspaceId: activeWorkspaceId,
      parentId,
      title: newLinkTitle.trim(),
      url: newLinkUrl.trim(),
      icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      createdAt: Date.now(),
    };

    setLinks((prev) => [...prev, newL]);
    if (parentId) {
      setExpanded((prev) => ({ ...prev, [parentId]: true }));
    }
    setNewLinkTitle('');
    setNewLinkUrl('');
    setActiveModal(null);
  };

  // Cross-workspace search calculation (replicates globalSearchResults from useTabExplorer.js)
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedFolders = folders.filter((f) => f.name.toLowerCase().includes(q));
    const matchedLinks = links.filter((l) => l.title.toLowerCase().includes(q) || (l.url || '').toLowerCase().includes(q));

    return { folders: matchedFolders, links: matchedLinks };
  }, [searchQuery, folders, links]);

  // Click on empty demo space clears selection
  const handleEmptyClick = (e) => {
    if (e.target.closest('button, input, select')) return;
    clearSelection();
  };

  // Recursive folder renderer (replicates Tree.jsx renderFolder)
  const renderFolderNode = (folder, depth) => {
    const isOpen = !!expanded[folder.id];
    const kids = childFolders(folder.id);
    const kidLinks = childLinks(folder.id);
    const count = directCount(folder.id);
    const selected = isSelected('folder', folder.id);
    const isFolderDropTarget = dragOverTarget === `folder:${folder.id}`;

    return (
      <div key={folder.id} style={{ marginBottom: '1px' }}>
        <div
          className={`demo-row${selected ? ' demo-row-selected' : ''}`}
          style={{
            paddingLeft: `${10 + depth * 14}px`,
            backgroundColor: isFolderDropTarget ? 'rgba(32, 128, 255, 0.15)' : undefined,
            outline: isFolderDropTarget ? '2px dashed #2080FF' : 'none',
            outlineOffset: '-2px',
          }}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, { type: 'folder', id: folder.id })}
          onDragOver={(e) => handleDragOver(e, `folder:${folder.id}`)}
          onDragLeave={(e) => handleDragLeave(e, `folder:${folder.id}`)}
          onDrop={(e) => handleDropOnFolder(e, folder.id)}
          onClick={(e) => handleSelect('folder', folder.id, e)}
          onDoubleClick={(e) => toggleFolder(folder.id, e)}
          title="Single click to select • Double click to expand • Drag to move"
        >
          {/* Chevron Toggle Button */}
          <button
            onClick={(e) => toggleFolder(folder.id, e)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              color: selected ? '#FFFFFF' : '#4B5563',
            }}
            title={isOpen ? "Collapse folder" : "Expand folder"}
          >
            <ChevronRight
              size={13}
              style={{
                transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.12s ease',
              }}
            />
          </button>

          {/* SVG Folder Glyph with real color */}
          <FolderGlyph color={folder.color} />

          {/* Folder Title */}
          <span
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: 600,
              fontSize: '12.5px',
              flex: 1,
              marginRight: '6px',
            }}
          >
            {folder.name}
          </span>

          {/* Authentic Folder Actions: Only Delete X, Star, and Wide Badge (NO EXTRA FOLDER ICON!) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            {/* Delete X on hover/select */}
            <button
              className="demo-row-delete-btn"
              onClick={(e) => handleDeleteOne('folder', folder.id, e)}
              title="Delete folder"
            >
              <X size={12} strokeWidth={2.5} />
            </button>

            {/* Star / Pin Button */}
            <button
              className={`demo-star-btn${folder.starred ? ' demo-star-btn-active' : ''}`}
              onClick={(e) => toggleStar(e, folder.id)}
              title={folder.starred ? "Unpin folder" : "Pin folder to top"}
            >
              <Star
                size={13}
                fill={folder.starred ? (selected ? '#FFFFFF' : '#00054B') : 'transparent'}
                stroke={selected ? '#FFFFFF' : '#00054B'}
              />
            </button>

            {/* Authentic Wide & Slender Badge (min-width 24px, height 12px) */}
            <span className="folder-count-badge">
              {count}
            </span>
          </div>
        </div>

        {/* Sub-items (nested folders & links) */}
        {isOpen && (
          <div style={{ position: 'relative' }}>
            {/* Vertical guideline */}
            <div
              style={{
                position: 'absolute',
                left: `${18 + depth * 14}px`,
                top: 0,
                bottom: 0,
                width: '1px',
                backgroundColor: '#7EBCE6',
                opacity: 0.5,
              }}
            />
            {kids.length === 0 && kidLinks.length === 0 ? (
              <div style={{ paddingLeft: `${28 + depth * 14}px`, paddingY: '4px', fontSize: '11px', color: '#94A3B8', fontStyle: 'italic' }}>
                Empty folder
              </div>
            ) : (
              <>
                {kids.map((subF) => renderFolderNode(subF, depth + 1))}
                {kidLinks.map((l) => renderLinkNode(l, depth + 1))}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // Link renderer (handles both root links and folder sub-links)
  const renderLinkNode = (link, depth) => {
    const isLinkSelected = isSelected('link', link.id);
    return (
      <div
        key={link.id}
        className={`demo-row${isLinkSelected ? ' demo-row-selected' : ''}`}
        style={{
          paddingLeft: `${10 + depth * 14 + (depth === 0 ? 0 : 4)}px`,
          marginBottom: '1px',
        }}
        draggable={true}
        onDragStart={(e) => handleDragStart(e, { type: 'link', id: link.id })}
        onClick={(e) => handleSelect('link', link.id, e)}
        onDoubleClick={() => handleOpenLink(link)}
        title={`Single click to select (${link.title}) • Double-click to open tab`}
      >
        <LinkGlyph link={link} />
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '12px',
            flex: 1,
          }}
        >
          {link.title}
        </span>

        {/* Delete X button on hover/select */}
        <button
          className="demo-row-delete-btn"
          onClick={(e) => handleDeleteOne('link', link.id, e)}
          title="Delete link"
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleEmptyClick}
      style={{
        width: '100%',
        maxWidth: '380px',
        height: '620px',
        backgroundColor: '#F0FAFF',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 12px 35px -8px rgba(0, 65, 101, 0.16), 0 0 0 1px rgba(126, 188, 230, 0.35)',
        overflow: 'hidden',
        fontFamily: '"Newblack", "Segoe UI", Arial, sans-serif',
        userSelect: 'none',
        position: 'relative',
        outline: 'none',
      }}
    >
      {/* Modals without redundant options & with Create New Folder option for Save Tabs */}
      {activeModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(20, 35, 50, 0.45)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '18px',
              width: '100%',
              maxWidth: activeModal === 'batchTabs' ? '360px' : '310px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
              border: '1px solid #D2E7F5',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1F2D3A' }}>
                {activeModal === 'saveTabs' && 'Save Current Tabs'}
                {activeModal === 'newWorkspace' && 'New Workspace'}
                {activeModal === 'newFolder' && (selectedFolderId ? 'New Subfolder' : 'New Folder')}
                {activeModal === 'newLink' && (selectedFolderId ? 'New Link in Folder' : 'New Link in Workspace')}
                {activeModal === 'batchTabs' && `Open Tabs (${batchTargetLinks.length})`}
              </span>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setBlockedLinks([]);
                }}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Save Tabs Modal Form: includes "Create new folder..." option */}
            {activeModal === 'saveTabs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '11px', color: '#5B7086' }}>Target Folder:</div>
                <select
                  value={saveTargetId}
                  onChange={(e) => setSaveTargetId(e.target.value)}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid #CDDCE7',
                    fontSize: '12px',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="__new__">Create new folder...</option>
                  <option value="__root__">Workspace root (outside folders)</option>
                  {wsFolders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>

                {saveTargetId === '__new__' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '11px', color: '#5B7086' }}>New folder name:</div>
                    <input
                      type="text"
                      autoFocus
                      placeholder="Folder name (e.g. Research Session)"
                      value={newSaveFolderName}
                      onChange={(e) => setNewSaveFolderName(e.target.value)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: '1px solid #CDDCE7',
                        fontSize: '12px',
                        outline: 'none',
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') executeSaveTabs();
                      }}
                    />
                  </div>
                )}

                <div style={{ fontSize: '11px', color: '#5B7086', marginTop: '2px' }}>Save Mode:</div>
                <div style={{ display: 'flex', border: '1px solid #CDDCE7', borderRadius: '6px', overflow: 'hidden' }}>
                  <button
                    type="button"
                    onClick={() => setSaveMode('append')}
                    style={{
                      flex: 1,
                      padding: '5px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: saveMode === 'append' ? '#2080FF' : '#FFF',
                      color: saveMode === 'append' ? '#FFF' : '#5B7086',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Append
                  </button>
                  <button
                    type="button"
                    onClick={() => setSaveMode('replace')}
                    style={{
                      flex: 1,
                      padding: '5px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: saveMode === 'replace' ? '#2080FF' : '#FFF',
                      color: saveMode === 'replace' ? '#FFF' : '#5B7086',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Replace
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                  <button
                    onClick={() => setActiveModal(null)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', fontSize: '11.5px', backgroundColor: '#EEF4F9', color: '#4A6172', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeSaveTabs}
                    style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', fontSize: '11.5px', backgroundColor: '#2080FF', color: '#FFF', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Save Tabs
                  </button>
                </div>
              </div>
            )}

            {/* New Workspace Modal */}
            {activeModal === 'newWorkspace' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  autoFocus
                  placeholder="Workspace name..."
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  style={{
                    padding: '7px 8px',
                    borderRadius: '6px',
                    border: '1px solid #CDDCE7',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') executeCreateWorkspace();
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                  <button
                    onClick={() => setActiveModal(null)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', fontSize: '11.5px', backgroundColor: '#EEF4F9', color: '#4A6172', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeCreateWorkspace}
                    disabled={!newWorkspaceName.trim()}
                    style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', fontSize: '11.5px', backgroundColor: '#2080FF', color: '#FFF', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Create
                  </button>
                </div>
              </div>
            )}

            {/* New Folder Modal (Creates in selected folder or in workspace root) */}
            {activeModal === 'newFolder' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  autoFocus
                  placeholder={selectedFolderId ? "Subfolder name..." : "Folder name..."}
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  style={{
                    padding: '7px 8px',
                    borderRadius: '6px',
                    border: '1px solid #CDDCE7',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') executeCreateFolder();
                  }}
                />
                <div style={{ fontSize: '11px', color: '#5B7086' }}>Folder Color:</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {FOLDER_PALETTE.map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewFolderColor(c)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: c,
                        border: newFolderColor === c ? '2px solid #2080FF' : '2px solid transparent',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                  <button
                    onClick={() => setActiveModal(null)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', fontSize: '11.5px', backgroundColor: '#EEF4F9', color: '#4A6172', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeCreateFolder}
                    disabled={!newFolderName.trim()}
                    style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', fontSize: '11.5px', backgroundColor: '#2080FF', color: '#FFF', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Create
                  </button>
                </div>
              </div>
            )}

            {/* New Link Modal (Creates directly inside selected folder OR directly in workspace root — NO dropdown!) */}
            {activeModal === 'newLink' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                <div style={{ fontSize: '11px', color: '#5B7086' }}>
                  Location: <strong>{selectedFolderId ? `Folder "${folders.find((f) => f.id === selectedFolderId)?.name}"` : `Workspace Root (${activeWorkspace.name})`}</strong>
                </div>
                <input
                  type="text"
                  autoFocus
                  placeholder="Name (e.g. Notion Workspace)"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  style={{ padding: '7px 8px', borderRadius: '6px', border: '1px solid #CDDCE7', fontSize: '12px', outline: 'none' }}
                />
                <input
                  type="text"
                  placeholder="URL (https://notion.so)"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  style={{ padding: '7px 8px', borderRadius: '6px', border: '1px solid #CDDCE7', fontSize: '12px', outline: 'none' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') executeCreateLink();
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                  <button
                    onClick={() => setActiveModal(null)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', fontSize: '11.5px', backgroundColor: '#EEF4F9', color: '#4A6172', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeCreateLink}
                    disabled={!newLinkTitle.trim() || !newLinkUrl.trim()}
                    style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', fontSize: '11.5px', backgroundColor: '#2080FF', color: '#FFF', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Add Link
                  </button>
                </div>
              </div>
            )}

            {/* Batch Open Tabs Modal (Handles browser pop-up blocker gracefully with direct open actions) */}
            {activeModal === 'batchTabs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {/* Status indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#EAF4FA',
                    border: '1px solid #7EBCE6',
                    borderRadius: '8px',
                    padding: '8px 12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: blockedLinks.length === 0 ? '#10B981' : '#2080FF',
                      }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#004165' }}>
                      {blockedLinks.length === 0
                        ? `All ${batchTargetLinks.length} tabs opened!`
                        : `${openedCount} opened • ${blockedLinks.length} blocked by browser`}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#5B7086' }}>
                    Total: {batchTargetLinks.length}
                  </span>
                </div>

                {blockedLinks.length > 0 && (
                  <>
                    {/* Reason explanation */}
                    <div
                      style={{
                        backgroundColor: '#FFFBEB',
                        border: '1px solid #FCD34D',
                        borderRadius: '8px',
                        padding: '9px 11px',
                        fontSize: '11px',
                        color: '#92400E',
                        lineHeight: 1.45,
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: '2px', color: '#78350F' }}>
                        Why did only 1 tab open automatically?
                      </div>
                      Standard web pages are restricted to opening 1 tab per click unless pop-ups are allowed. In the installed <strong>TAB Explorer Chrome extension</strong>, all tabs open silently in the background without pop-up blockers.
                    </div>

                    {/* How to enable 1-click opening */}
                    <div
                      style={{
                        backgroundColor: '#F0FAFF',
                        border: '1px solid #BCE0F7',
                        borderRadius: '8px',
                        padding: '9px 11px',
                        fontSize: '11px',
                        color: '#004165',
                        lineHeight: 1.45,
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: '3px' }}>
                        To enable 1-click batching on this demo:
                      </div>
                      Click the <strong>Pop-up blocked</strong> icon in Chrome’s address bar (top right) ➔ select <strong>"Always allow pop-ups and redirects from this site"</strong>.
                    </div>

                    {/* Pending tabs list */}
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginTop: '2px' }}>
                      Click to open remaining tabs:
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        maxHeight: '140px',
                        overflowY: 'auto',
                        paddingRight: '2px',
                      }}
                      className="tree-scroll-container"
                    >
                      {blockedLinks.map((link) => (
                        <div
                          key={link.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 8px',
                            backgroundColor: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            borderRadius: '6px',
                            gap: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                            <LinkGlyph link={link} />
                            <span
                              style={{
                                fontSize: '11.5px',
                                color: '#1E293B',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {link.title}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenSingleTab(link)}
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#2080FF',
                              backgroundColor: '#EFF6FF',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              border: '1px solid #BFDBFE',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Open ↗
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Footer Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', gap: '8px' }}>
                  {blockedLinks.length > 0 ? (
                    <>
                      <button
                        type="button"
                        onClick={handleOpenNextBlocked}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#004165',
                          color: '#FFF',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Open Next Tab ({blockedLinks.length})
                      </button>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={handleToolbarOpenTabs}
                          title="Retry opening all after allowing pop-ups in address bar"
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #7EBCE6',
                            backgroundColor: '#EAF4FA',
                            color: '#004165',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Retry All
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveModal(null);
                            setBlockedLinks([]);
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#E2E8F0',
                            color: '#475569',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal(null);
                        setBlockedLinks([]);
                      }}
                      style={{
                        width: '100%',
                        padding: '7px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#2080FF',
                        color: '#FFF',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Done
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Extension Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 18px 8px',
          borderBottom: '1px solid #7EBCE6',
          backgroundColor: '#F0FAFF',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/assets/logo.png"
            alt="Logo"
            style={{ width: '28px', height: '28px', objectFit: 'contain' }}
            onError={(e) => { e.currentTarget.src = './assets/logo.png'; }}
          />
          <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px' }}>
            <span style={{ color: '#2080FF' }}>TAB</span>{' '}
            <span style={{ color: '#363636' }}>Explorer</span>
          </span>
        </div>
        <div
          style={{
            fontSize: '11px',
            color: '#004165',
            backgroundColor: '#D6ECFA',
            padding: '3px 8px',
            borderRadius: '100px',
            fontWeight: 600,
          }}
        >
          Side Panel
        </div>
      </div>

      {/* Toolbar (All 4 Replicated Buttons) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          padding: '10px 16px 8px',
        }}
      >
        <button
          onClick={() => setActiveModal('saveTabs')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            height: '48px',
            backgroundColor: '#F0FAFF',
            border: '1.5px solid #7EBCE6',
            borderRadius: '8px',
            color: '#004165',
            fontSize: '10.5px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Save tabs to folder or workspace"
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#86BBD8'; e.currentTarget.style.color = '#FFF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F0FAFF'; e.currentTarget.style.color = '#004165'; }}
        >
          <Save size={16} strokeWidth={2.2} />
          <span>save tabs</span>
        </button>

        <button
          onClick={handleToolbarOpenTabs}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            height: '48px',
            backgroundColor: '#F0FAFF',
            border: '1.5px solid #7EBCE6',
            borderRadius: '8px',
            color: '#004165',
            fontSize: '10.5px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title={selection.length > 0 ? `Open ${selection.length} selected item(s)` : "Open all workspace tabs"}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#86BBD8'; e.currentTarget.style.color = '#FFF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F0FAFF'; e.currentTarget.style.color = '#004165'; }}
        >
          <FolderOpen size={16} strokeWidth={2.2} />
          <span>open tabs</span>
        </button>

        <button
          onClick={() => setActiveModal('newWorkspace')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            height: '48px',
            backgroundColor: '#F0FAFF',
            border: '1.5px solid #7EBCE6',
            borderRadius: '8px',
            color: '#004165',
            fontSize: '10.5px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Create workspace"
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#86BBD8'; e.currentTarget.style.color = '#FFF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F0FAFF'; e.currentTarget.style.color = '#004165'; }}
        >
          <Layers size={16} strokeWidth={2.2} />
          <span>new workspace</span>
        </button>

        <button
          onClick={handleUndo}
          disabled={history.length === 0}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            height: '48px',
            backgroundColor: '#F0FAFF',
            border: '1.5px solid #7EBCE6',
            borderRadius: '8px',
            color: history.length === 0 ? '#94A3B8' : '#004165',
            fontSize: '10.5px',
            fontWeight: 600,
            cursor: history.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            opacity: history.length === 0 ? 0.6 : 1,
          }}
          title="Undo last change"
          onMouseEnter={(e) => {
            if (history.length > 0) {
              e.currentTarget.style.backgroundColor = '#86BBD8';
              e.currentTarget.style.color = '#FFF';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F0FAFF';
            e.currentTarget.style.color = history.length === 0 ? '#94A3B8' : '#004165';
          }}
        >
          <Undo2 size={16} strokeWidth={2.2} />
          <span>undo ({history.length})</span>
        </button>
      </div>

      {/* Search Bar */}
      <div
        style={{
          margin: '0 16px 8px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#EAF4FA',
          border: '1.5px solid #7EBCE6',
          borderRadius: '9px',
          padding: '0 8px 0 4px',
          gap: '8px',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            backgroundColor: '#86BBD8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
          }}
        >
          <Search size={13} strokeWidth={2.5} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search folders & links across workspaces..."
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            flex: 1,
            fontSize: '12px',
            color: '#111827',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{ fontSize: '11px', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Workspace Switcher Row — Dropping onto any workspace pill moves dragged items across workspaces! */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '4px 16px 8px',
          borderBottom: '1px solid #7EBCE6',
          overflowX: 'auto',
        }}
        className="tree-scroll-container"
      >
        {workspaces.map((w) => {
          const isActive = activeWorkspaceId === w.id;
          const isDropOverWs = dragOverTarget === `workspace:${w.id}`;
          return (
            <button
              key={w.id}
              onClick={() => {
                setActiveWorkspaceId(w.id);
                clearSelection();
              }}
              onDragOver={(e) => handleDragOver(e, `workspace:${w.id}`)}
              onDragLeave={(e) => handleDragLeave(e, `workspace:${w.id}`)}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragOverTarget(null);
                handleDropOnWorkspace(w.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: isDropOverWs ? '#BAE6FD' : 'transparent',
                border: isDropOverWs ? '1.5px dashed #2080FF' : 'none',
                borderRadius: '6px',
                color: isActive ? '#004165' : '#5B6B79',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                padding: '3px 6px',
                transition: 'all 0.12s ease',
              }}
              title={`Switch to ${w.name} (Drop items here to move across workspaces)`}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#004165' : '#8F9AA0',
                  boxShadow: isActive ? '0 0 6px rgba(0, 65, 101, 0.5)' : 'none',
                }}
              />
              <span>{w.name}</span>
            </button>
          );
        })}
      </div>

      {/* Workspace Active Header */}
      {!searchResults && (
        <div
          onClick={(e) => handleSelect('workspace', activeWorkspaceId, e)}
          onDragOver={(e) => handleDragOver(e, '__root__')}
          onDragLeave={(e) => handleDragLeave(e, '__root__')}
          onDrop={(e) => handleDropOnFolder(e, null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 16px',
            backgroundColor: isSelected('workspace', activeWorkspaceId)
              ? '#2080FF'
              : dragOverTarget === '__root__'
              ? '#BAE6FD'
              : '#E2F1FB',
            color: isSelected('workspace', activeWorkspaceId) ? '#FFFFFF' : '#111827',
            borderBottom: '1px solid #CDE6F7',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setWorkspaceCollapsed(!workspaceCollapsed);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: isSelected('workspace', activeWorkspaceId) ? '#FFFFFF' : '#004165',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
              }}
              title={workspaceCollapsed ? "Expand workspace" : "Collapse workspace"}
            >
              <ChevronRight
                size={14}
                style={{
                  transform: workspaceCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
                  transition: 'transform 0.12s ease',
                }}
              />
            </button>
            <span>{activeWorkspace.name} Workspace</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveModal('newLink');
              }}
              title={selectedFolderId ? "Add link inside selected folder" : "Add link directly inside workspace root"}
              style={{
                color: isSelected('workspace', activeWorkspaceId) ? '#FFFFFF' : '#004165',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <Link2 size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveModal('newFolder');
              }}
              title={selectedFolderId ? "Add subfolder inside selected folder" : "Add folder to workspace"}
              style={{
                color: isSelected('workspace', activeWorkspaceId) ? '#FFFFFF' : '#004165',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <FolderPlus size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Tree Content Area — Strictly hidden scrollbar */}
      <div
        className="tree-scroll-container"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '6px 0',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onDragOver={(e) => handleDragOver(e, '__root__')}
        onDragLeave={(e) => handleDragLeave(e, '__root__')}
        onDrop={(e) => handleDropOnFolder(e, null)}
      >
        {/* Global Search Results Mode */}
        {searchResults ? (
          <div>
            <div style={{ padding: '4px 16px 8px', fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>
              Search Results ({searchResults.folders.length + searchResults.links.length})
            </div>

            {searchResults.folders.map((folder) => {
              const selected = isSelected('folder', folder.id);
              const ws = workspaces.find((w) => w.id === folder.workspaceId);
              return (
                <div
                  key={`sf-${folder.id}`}
                  className={`demo-row${selected ? ' demo-row-selected' : ''}`}
                  onClick={(e) => handleSelect('folder', folder.id, e)}
                  style={{ paddingLeft: '14px' }}
                >
                  <FolderGlyph color={folder.color} />
                  <span style={{ fontSize: '13px', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {folder.name}
                    <span style={{ fontSize: '11px', fontWeight: 400, opacity: 0.7, marginLeft: '6px' }}>
                      ({ws ? ws.name : ''})
                    </span>
                  </span>
                  <span className="folder-count-badge">
                    {directCount(folder.id)}
                  </span>
                </div>
              );
            })}

            {searchResults.links.map((link) => {
              const selected = isSelected('link', link.id);
              const ws = workspaces.find((w) => w.id === link.workspaceId);
              const parentF = folders.find((f) => f.id === link.parentId);
              return (
                <div
                  key={`sl-${link.id}`}
                  className={`demo-row${selected ? ' demo-row-selected' : ''}`}
                  onClick={(e) => handleSelect('link', link.id, e)}
                  onDoubleClick={() => handleOpenLink(link)}
                  style={{ paddingLeft: '14px' }}
                  title="Single click to select • Double click to open tab"
                >
                  <LinkGlyph link={link} />
                  <span style={{ fontSize: '12.5px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {link.title}
                    <span style={{ fontSize: '11px', opacity: 0.7, marginLeft: '6px' }}>
                      ({ws ? ws.name : ''}{parentF ? ` / ${parentF.name}` : ''})
                    </span>
                  </span>
                </div>
              );
            })}

            {searchResults.folders.length === 0 && searchResults.links.length === 0 && (
              <div style={{ padding: '28px', textAlign: 'center', color: '#8F9AA0', fontSize: '13px' }}>
                No matching folders or links found across any workspace.
              </div>
            )}
          </div>
        ) : workspaceCollapsed ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#8F9AA0', fontSize: '12.5px' }}>
            Workspace is collapsed. Click the arrow above to expand.
          </div>
        ) : childFolders(null).length === 0 && childLinks(null).length === 0 ? (
          <div style={{ padding: '28px', textAlign: 'center', color: '#8F9AA0', fontSize: '13px' }}>
            No folders or links yet. Click the + icons above to create one.
          </div>
        ) : (
          <>
            {/* 1. Folders at workspace root */}
            {childFolders(null).map((folder) => renderFolderNode(folder, 0))}

            {/* 2. Direct links at workspace root (parentId: null) */}
            {childLinks(null).map((link) => renderLinkNode(link, 0))}
          </>
        )}
      </div>

      {/* Extension Footer / Status Bar (Export, Import, Reset are 100% Functional!) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderTop: '1px solid #7EBCE6',
          fontSize: '11px',
          color: '#3A3A3A',
          backgroundColor: '#F0FAFF',
        }}
      >
        <span>
          {selection.length > 0 ? (
            <strong style={{ color: '#2080FF' }}>{selection.length} Selected</strong>
          ) : (
            `${workspaces.length} Workspaces • ${wsFolders.length} Folders • ${wsLinks.length} Links`
          )}
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleExport}
            title="Download JSON backup"
            style={{
              color: '#004165',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              textDecoration: 'underline',
              fontSize: '11px',
              fontFamily: 'inherit',
            }}
          >
            Export
          </button>
          <button
            onClick={() => importInputRef.current && importInputRef.current.click()}
            title="Import JSON backup"
            style={{
              color: '#004165',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              textDecoration: 'underline',
              fontSize: '11px',
              fontFamily: 'inherit',
            }}
          >
            Import
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
          <button
            onClick={handleReset}
            title="Reset data to initial state"
            style={{
              color: '#004165',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              textDecoration: 'underline',
              fontSize: '11px',
              fontFamily: 'inherit',
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
