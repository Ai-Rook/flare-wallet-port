import re

with open('App.js', 'r') as f:
    content = f.read()

# Remove 'cards' and 'markets' (Prices) from TABS — keep Home, Wallet, Agent, Profile
old_tabs = """const TABS = [
  { key: 'home', label: 'Home' },
  { key: 'cards', label: 'Cards' },
  { key: 'wallet', label: 'Wallet' },
  { key: 'markets', label: 'Prices' },
  { key: 'agentic', label: 'Agent' },
  { key: 'profile', label: 'Profile' },
];"""

new_tabs = """const TABS = [
  { key: 'home', label: 'Home' },
  { key: 'wallet', label: 'Wallet' },
  { key: 'agentic', label: 'Agent' },
  { key: 'profile', label: 'Profile' },
];"""

content = content.replace(old_tabs, new_tabs)

# Fix tab split — first 2 left, FAB, last 2 right (was first 2 / last 4)
old_split = "const leftTabs = TABS.slice(0, 2);\n  const rightTabs = TABS.slice(2);"
new_split = "const leftTabs = TABS.slice(0, 2);\n  const rightTabs = TABS.slice(2);"
# This still works — 2 left, 2 right with FAB in middle

content = content.replace(old_split, new_split)

with open('App.js', 'w') as f:
    f.write(content)

print("TABS FIXED")
