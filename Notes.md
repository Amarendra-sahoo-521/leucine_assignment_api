## Key decisions & trade-offs

- **ORM:** Used TypeORM over Prisma or raw parameterized SQL. Reason: prior
  familiarity, and its entity/migration model maps cleanly onto `Equipment`,
  `CleaningRecord`, and `AuditLog`.

- **Audit log schema:** One row per **changed field** per update, rather than
  a single JSON diff blob per update event.

  ```ts
  // AuditLog entity (simplified)
  {
    id: number;
    record_id: number;      // FK -> CleaningRecord
    changed_by: string | null;
    changed_at: string | null;
    field_name: string;
    old_value: string | null;
    new_value: string | null;
  }
  ```

  This makes correctness easy to assert directly (`field`, `old`, `new` are
  independently queryable) at the cost of more rows per save event.

- **`cleanedBy` vs. `changed_by`:** Stored as separate plain-text fields.
  `cleanedBy` is who physically performed the cleaning; `changed_by` is who
  made the data entry. No auth was required by the spec, so both are
  free-text for now — kept distinct in the schema because they're
  conceptually different and would diverge once real auth exists.

- **Pagination:** Offset-based, computed as:

  ```ts
  const skip = (page - 1) * limit;
  const [data, total] = await repository.findAndCount({ where, skip, take: limit });
  ```

  Simple, correct, and sufficient at this data scale.

- **Equipment audit trail — not implemented.** The spec scopes the audit
  requirement to `CleaningRecord` only ("every time a cleaning record is
  created or updated..."). `Equipment` updates (including status changes to
  `retired`) are plain writes with no audit rows. Extending audit coverage to
  `Equipment` would require either a nullable second FK on `AuditLog` or a
  polymorphic `entity_type` / `entity_id` pair — more schema complexity than
  the assignment asks for.

## What I'd do differently with more time

- Switch to **keyset (cursor) pagination** instead of offset — offset
  degrades on large tables and isn't stable under concurrent inserts; this
  was listed as a stretch goal.
- Add real **auth / current-user** context so `cleanedBy` and `changed_by`
  reflect an actual authenticated identity instead of free text.
- Strengthen **server-side validation** with structured, field-level error
  responses.

## Deliberately left out

- Equipment-level audit trail (see decision above).
- Any implicit business rule cascading `Equipment.status` from
  `CleaningRecord` activity (e.g. auto-retiring equipment) — not specified
  in the brief, so not invented.
- [Add here, if true: Docker/docker-compose, if not completed.]