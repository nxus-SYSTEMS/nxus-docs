---
title: Local Control Decisions
description: How to keep local actions bounded before they cross a consequence boundary.
---

Some workflows need a local control decision before an action crosses a
consequence boundary. That decision can combine configuration, authority,
capability availability, and the current context before choosing whether to
continue, pause for review, or stop.

## Policy Before Preference

Evaluate stronger policy before local preferences. A local preference can tune
ordinary behavior, but it should not bypass a stronger rule that protects a
critical boundary.

## Authority In Context

For sensitive actions, consider the actor, action, resource, and context
together. A decision is easier to explain when the reason is tied to the
specific action being requested and the boundary it would cross.

## Capability Availability

When a capability is not available in the current context, keep the action
unavailable and explain the safe next step. Good denial text is short,
non-sensitive, and focused on what can happen next.

## Consequence Boundaries

Read-only operations can still create observable traces, review obligations,
or follow-on effects. Treat the consequence boundary as the point where an
operation may affect external systems, review queues, audit trails, or
user-visible outcomes.

## Advanced Extensions

An advanced extension action should stay unavailable until local checks confirm
that the action is allowed for this installation. If those checks do not pass,
the safe response is to keep the action unavailable and route the user toward
review or an allowed alternative.

## Safe Denial Text

Use denial text that explains the local outcome without exposing private
policy details:

- "This action is unavailable in the current context."
- "Review local policy or choose an allowed action."
- "No external action was taken."
