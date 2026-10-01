---
type: architecture_document
title: Authentication & Identity Entities
status: active
target_file: api/src/Entity/Auth/
---

# Authentication & Identity Entities

## Architectural Role

The `App\Entity\Auth` namespace in [api/src/Entity/Auth/](../../../../api/src/Entity/Auth/) encapsulates identity management, credential security, token lifecycle, and site-level discretionary access control for the MEDGREENREV platform. All entities map to the PostgreSQL `auth` schema, ensuring strict isolation between user accounts and archaeological research data.

---

## Entity Models & Contracts

### 1. `User`
* **Path:** [api/src/Entity/Auth/User.php](../../../../api/src/Entity/Auth/User.php)
* **Table:** `auth.users`
* **Core Responsibilities:**
  * Implements Symfony `UserInterface` and `PasswordAuthenticatedUserInterface`.
  * Manages user credentials: `$id` (UUID v4), `$email` (unique), `$password` (hashed with Argon2id / bcrypt), `$roles` (JSON array), and `$enabled` (boolean account flag).
  * Enforces password security via `#[IsStrongPassword]` and role integrity via `#[IsValidRole]`.
* **API Platform Endpoints & Custom Handlers:**
  * `/users/me`: Uses `CurrentUserProvider` to return the profile of the authenticated requester.
  * `/users/{id}/change_password`: Custom patch endpoint using `UserPasswordChangeInputDto` and `UserPasswordChangeProcessor` to validate existing password and hash the new credential.
  * `Post` registration: Automatically hashes plain-text passwords using `UserPasswordHasherProcessor`.

### 2. `RefreshToken`
* **Path:** [api/src/Entity/Auth/RefreshToken.php](../../../../api/src/Entity/Auth/RefreshToken.php)
* **Table:** `auth.refresh_tokens`
* **Core Responsibilities:**
  * Extends Gesdinet's `RefreshToken` contract (`Gesdinet\JWTRefreshTokenBundle\Entity\RefreshToken`).
  * Stores cryptographic refresh tokens mapped to usernames with an explicit expiration timestamp (`$valid`).
  * Enables long-lived client sessions without exposing persistent long-lived access JWTs.

### 3. `SiteUserPrivilege`
* **Path:** [api/src/Entity/Auth/SiteUserPrivilege.php](../../../../api/src/Entity/Auth/SiteUserPrivilege.php)
* **Table:** `auth.site_user_privileges`
* **Core Responsibilities:**
  * Grants site-specific permissions linking a `User` to an `ArchaeologicalSite`.
  * Unique Constraint: `#[ORM\UniqueConstraint(columns: ['user_id', 'site_id'])]` ensures a user holds at most one privilege record per excavation site.
  * **Privilege Levels:**
    * `PRIVILEGE_USER = 1`: Grants permission to add and edit stratigraphic units, contexts, samples, and specialist analyses within the site.
    * `PRIVILEGE_EDITOR = 2`: Grants permission to edit or delete the site itself and manage collaborator privileges.
* **Referential Integrity & Security Filtering:**
  * Uses `ON DELETE CASCADE` on both `user_id` and `site_id`, automatically cleaning up permissions when a user or site is deleted.
  * Collection access is restricted via `EditorUserSitePrivilegeExtension` (editors manage privileges on their own sites) and `CurrentUserSitePrivilegeExtension` (`/users/me/site_user_privileges`).

---

## Key Relationships

* **Entity Root:** [api/src/Entity/Auth/](../../../../api/src/Entity/Auth/)
* **Authorization Specification:** [Authorization & Security Model](../authorization.md)
* **Query Extensions:** [Doctrine ORM Query Extensions & Security Filtering](../query_extensions_filtering.md)
* **Foreign Key Policies:** [Foreign Key Deletion & Referential Integrity Policies](../foreign_key_policies.md)
* **Spatial Sites Entity:** [Stratigraphy & Spatial Sites](./stratigraphy_sites.md)

---

## Related Nodes

* Back to [Domain Entities Subsystem](./index.md)
* Back to [Backend Hub](../index.md)
* Back to [Main Knowledge Graph Index](../../index.md)
