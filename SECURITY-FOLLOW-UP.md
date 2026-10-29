# Password security follow-up

## Resolution status

Both reported issues are fixed:

- Session checks now read `sessionVersion` directly from the database instead
  of using a process-local cache, so password changes are enforced across app
  instances without a cache-expiry delay.
- Password changes and resets invalidate outstanding reset tokens in the same
  transaction as the password update.

The focused `password-security.test.ts` suite passes all 16 tests. ESLint,
Prettier, and `tsc --noEmit` also pass.

## Goal

Close two edge cases in password changes so that changing a password reliably
revokes existing sessions and invalidates outstanding password-reset links.

## 1. Ensure every existing session is revoked

**Severity:** Medium
**Relevant code:**

- [`src/auth.ts`](./src/auth.ts) — records the session authentication time in
  whole seconds with `Math.floor(Date.now() / 1000)`.
- [`src/lib/session-invalidation.ts`](./src/lib/session-invalidation.ts) —
  `isSessionStale` compares that value with the password-change time rounded
  down to whole seconds, using a strict `<` comparison.
- [`src/lib/actions/change-password.ts`](./src/lib/actions/change-password.ts) —
  updates `passwordChangedAt` when the password changes.

### Problem

If a session was created in the same second as the password change, both
timestamps can be equal. Since the stale-session check only rejects timestamps
that are strictly earlier, that session may remain valid. This makes the
"sign out on every device" behavior unreliable in this timing edge case.

### Recommended fix

Use a revocation mechanism that does not depend on comparing rounded
timestamps. For example, maintain a per-user session/password version, include
the current version in each session token, and reject tokens whose version no
longer matches the user's current version. Increment the version when a
password is changed or reset. Keep the existing behavior that sends the user
back to login after changing their password.

### Acceptance checks

- A session created before a password change is rejected, including when both
  events occur within the same second.
- A new login after the password change works immediately, including within
  that same second.
- Verify this behavior for both the change-password and reset-password flows.

## 2. Invalidate outstanding reset links after a password change

**Severity:** Medium
**Relevant code:**

- [`src/lib/actions/change-password.ts`](./src/lib/actions/change-password.ts) —
  updates the password but does not invalidate other reset-token records.
- [`src/lib/actions/reset-password.ts`](./src/lib/actions/reset-password.ts) —
  accepts a reset token when its `usedAt` is `null` and it has not expired.
  The token-claim update also uses `usedAt: null` to prevent reuse of that
  particular token; it does not invalidate sibling tokens for the same user.

### Problem

An unused reset link issued before a normal password change can remain valid
until it expires. Someone who already has that link may still use it to set a
different password after the account owner changed their password.

### Recommended fix

In the same database transaction that changes the password, invalidate all
unused reset tokens belonging to that user. Marking them used or deleting them
are possible approaches; follow the existing token-retention conventions.
Ensure the password update and token invalidation either both succeed or both
roll back.

### Acceptance checks

- Request two reset links, use one, and verify the other can no longer change
  the password.
- Request a reset link, change the password through settings, and verify the
  outstanding link can no longer change the password.
- Verify a valid, unused reset link still works before a separate password
  change invalidates it.
- Verify repeated or concurrent attempts to use a token cannot set the
  password more than once.

## Scope and validation

Keep the changes limited to password/session invalidation and reset-token
lifecycle behavior. Add or update focused tests for the acceptance checks
above, then run the repository's relevant lint, type-check, and test commands.
No database migration should be needed to invalidate reset-token rows; a
session-version approach may require a schema migration.
