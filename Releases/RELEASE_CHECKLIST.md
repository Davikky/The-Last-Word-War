# The Last Word War™

# Release Checklist v1.0

**Purpose**

This checklist defines the standard release procedure for The Last Word War™. Every public or internal release should complete each applicable step before a version tag is created.

---

# Phase 1 — Development

## Code Completion

* [ ] Planned features completed.
* [ ] Planned refactoring completed.
* [ ] Critical bugs resolved.
* [ ] Working tree clean (`git status`).

## Code Quality

* [ ] Project compiles successfully.
* [ ] No new console errors.
* [ ] No unresolved merge conflicts.
* [ ] No temporary debugging code remains.

---

# Phase 2 — Testing

## Local Testing

* [ ] Create Room.
* [ ] Join Room.
* [ ] Start Game.
* [ ] Sentence submission.
* [ ] Score updates.
* [ ] Timeout handling.
* [ ] Final Round.
* [ ] Sudden Death.
* [ ] Draw resolution.
* [ ] Game Over.
* [ ] Rematch.
* [ ] Start New Play.

## Online Testing

* [ ] Remote multiplayer tested.
* [ ] Realtime synchronization verified.
* [ ] Session recovery verified.
* [ ] Timeout synchronization verified.
* [ ] Host authority verified.

---

# Phase 3 — Documentation

* [ ] Version number updated in the application.
* [ ] Release notes created.
* [ ] README updated (if necessary).
* [ ] Development Journal updated (if applicable).
* [ ] Design documents updated (if applicable).

---

# Phase 4 — Repository

## Commit

```bash
git status
git add .
git commit -m "Release vX.Y.Z"
git push
```

## Merge

```bash
git checkout main
git pull origin main
git merge <release-branch>
git push origin main
```

---

# Phase 5 — Version Tag

Create the release tag.

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```

Verify:

```bash
git tag
```

---

# Phase 6 — Deployment

* [ ] Deployment completed successfully.
* [ ] Live application accessible.
* [ ] Correct version displayed.
* [ ] Contact information verified.
* [ ] Smoke test completed on deployed application.

---

# Phase 7 — Post-Release

* [ ] Release archived.
* [ ] Roadmap reviewed.
* [ ] Next development branch created.
* [ ] Next milestone documented.

---

# Success Criteria

A release is considered complete only when:

* every planned feature for the release has been implemented;
* documentation matches the released software;
* the tagged version corresponds exactly to the deployed code;
* the deployed application passes the post-release smoke test.

---

# Version History

## v1.0

Initial standardized release checklist for The Last Word War™.

