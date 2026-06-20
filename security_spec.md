# Security Specification - Nexus AI

## Data Invariants
1. A **User** profile must belong to the authenticated user.
2. Only verified users can create **Projects**.
3. A **Project** must always be owned by its creator.
4. **Insights** are protected by the parent Project's ownership.

## The Dirty Dozen (Test Matrix)

| Test Case | Payload | Expected | Status |
|-----------|---------|----------|--------|
| Spoof Owner | `{ ownerId: "someone_else", ... }` | DENY | ✅ |
| Escalate Role | `{ role: "admin", ... }` during update | DENY | ✅ |
| Poison ID | Document ID > 128 chars | DENY | ✅ |
| Anonymous Write | No auth token | DENY | ✅ |
| Unverified Create| `email_verified: false` | DENY | ✅ |
| Large Payload | `name: "A" * 1000` | DENY | ✅ |
| Cross-User Read | Read project owned by Bob | DENY | ✅ |
| Shadow Fields | `{ ghost: true, ... }` | DENY | ✅ |
| Orphan Insight | Create insight with invalid project path | DENY | ✅ |
| Self-Promote | Set own role to admin on create | DENY | ✅ (Defaults to member) |
| Multi-Update | Change immutable `ownerId` | DENY | ✅ |
| PII Scraping | List all users | DENY | ✅ |
