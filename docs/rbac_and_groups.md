# RBAC & Group Management System

## Role Definitions

| Role             | Scope          | Permissions                                                                                        |
| :--------------- | :------------- | :------------------------------------------------------------------------------------------------- |
| **System Admin** | Global         | Manage all markets, users, and platform settings. **Can create Public Groups.**                    |
| **Group Admin**  | Group-Specific | Manage group members, rules, and create group-only markets. **Creates Private Groups by default.** |
| **User**         | Individual     | Participate in markets, join groups, manage personal wallet.                                       |

---

## Group Visibility & Discovery

Ante Social supports two primary visibility tiers for groups:

### 1. Public Groups

- **Created By**: System Admins.
- **Discovery**: Automatically listed on the main "Groups" page for everyone.
- **Access**: Open for anyone to view and join (unless rules specify otherwise).

### 2. Private Groups

- **Created By**: Group Admins.
- **Discovery**: Hidden from the global Groups page.
- **Access**: Only visible and accessible to members or those with a direct invite link.
- **Dashboard**: Only appears in the "Your Groups" section for authenticated members.

---

## Group Administrative Journeys

### 1. Group Rule Configuration

Group Admins can define custom parameters for their communities:

- **Membership Approval**: Manual vs Automatic.
- **Market Creation**: Who can propose markets (Admin-only vs Member-voted).
- **Betting Limits**: Min/Max buy-in for group markets.

### 2. Viral Growth (Invites)

Unique invite links are generated per group. These links can:

- Be set to expire after N uses.
- Include a "Welcome Bonus" (mocked via backend air-drop).

### 3. Market Categorization

All markets created via the Group Admin dashboard must be tagged with a **Category**. This allows for:

- Better filtering on the main discovery feed.
- Interest-based recommendations.

---

## Technical Flow: Group Market Creation

1. Admin opens `MarketCreationWizard`.
2. Wizard detects `group_admin` role and fetches `managed_groups`.
3. Admin selects a group and a category.
4. On launch, the API assigns `groupId` and `visibility` (public/private) to the group document.
5. The Groups Page filters listings: `Public === true || User.memberships.includes(groupId)`.
6. Public Groups are flagged in the UI for easy discovery, while Private Groups show a "Shield" icon.
