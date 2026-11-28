-- When a service was suspended. Kept by a trigger so every way of suspending (billing, staff, resellers,
-- imports) records it: set when the status becomes SUSPENDED, cleared when it leaves SUSPENDED.
ALTER TABLE "Service" ADD COLUMN "suspendedAt" TIMESTAMP(3);

CREATE OR REPLACE FUNCTION service_suspended_at() RETURNS trigger AS $$
BEGIN
  IF NEW."status" = 'SUSPENDED' THEN
    IF TG_OP = 'INSERT' OR OLD."status" IS DISTINCT FROM 'SUSPENDED' THEN
      -- a date given with the change (e.g. an import) wins; otherwise now
      IF TG_OP = 'INSERT' OR NEW."suspendedAt" IS NOT DISTINCT FROM OLD."suspendedAt" THEN
        NEW."suspendedAt" := COALESCE(NEW."suspendedAt", now() AT TIME ZONE 'UTC');
      END IF;
    END IF;
  ELSE
    NEW."suspendedAt" := NULL;
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER "Service_suspended_at" BEFORE INSERT OR UPDATE OF "status", "suspendedAt" ON "Service"
  FOR EACH ROW EXECUTE FUNCTION service_suspended_at();

-- services suspended today: the last successful suspend in their setup log (left empty when unknown)
UPDATE "Service" s SET "suspendedAt" = l."at"
FROM (SELECT "serviceId", MAX("createdAt") AS "at" FROM "ProvisioningLog" WHERE "action" = 'suspend' AND "success" GROUP BY "serviceId") l
WHERE s."id" = l."serviceId" AND s."status" = 'SUSPENDED';
