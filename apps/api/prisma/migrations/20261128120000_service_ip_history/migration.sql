-- Service IP history: every IP a service gets or loses, whoever changed it (panel, staff, import, or
-- Virtualizor itself as found by a sync). Written by a trigger so no code path can skip it.
ALTER TABLE "IpAddress" ADD COLUMN "changeSource" TEXT, ADD COLUMN "changeNote" TEXT, ADD COLUMN "changeActorId" TEXT;

CREATE TABLE "ServiceIpEvent" (
  "id" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "note" TEXT,
  "actorId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ServiceIpEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ServiceIpEvent_serviceId_createdAt_idx" ON "ServiceIpEvent"("serviceId", "createdAt");
CREATE INDEX "ServiceIpEvent_address_createdAt_idx" ON "ServiceIpEvent"("address", "createdAt");

CREATE OR REPLACE FUNCTION service_ip_event(svc TEXT, addr TEXT, act TEXT, src TEXT, prim BOOLEAN, nt TEXT, actor TEXT) RETURNS void AS $$
BEGIN
  -- a service being deleted takes its IPs' links with it: nothing to record for it any more
  IF NOT EXISTS (SELECT 1 FROM "Service" WHERE id = svc) THEN RETURN; END IF;
  INSERT INTO "ServiceIpEvent" ("id", "serviceId", "address", "action", "source", "isPrimary", "note", "actorId", "createdAt")
  VALUES (md5(random()::text || clock_timestamp()::text), svc, addr, act, COALESCE(src, 'PANEL'), COALESCE(prim, false), nt, actor, now() AT TIME ZONE 'UTC');
END $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION service_ip_history() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD."serviceId" IS NOT NULL THEN
      PERFORM service_ip_event(OLD."serviceId", OLD."address", 'REMOVED', OLD."changeSource", OLD."isPrimary", COALESCE(OLD."changeNote", 'IP deleted'), OLD."changeActorId");
    END IF;
    RETURN OLD;
  END IF;
  IF TG_OP = 'INSERT' THEN
    IF NEW."serviceId" IS NULL THEN RETURN NEW; END IF;
    PERFORM service_ip_event(NEW."serviceId", NEW."address", 'ASSIGNED', NEW."changeSource", NEW."isPrimary", NEW."changeNote", NEW."changeActorId");
  ELSIF NEW."serviceId" IS DISTINCT FROM OLD."serviceId" THEN
    IF OLD."serviceId" IS NOT NULL THEN
      PERFORM service_ip_event(OLD."serviceId", OLD."address", 'REMOVED', NEW."changeSource", OLD."isPrimary", NEW."changeNote", NEW."changeActorId");
    END IF;
    IF NEW."serviceId" IS NOT NULL THEN
      PERFORM service_ip_event(NEW."serviceId", NEW."address", 'ASSIGNED', NEW."changeSource", NEW."isPrimary", NEW."changeNote", NEW."changeActorId");
    END IF;
  ELSE
    RETURN NEW; -- not an assignment change: keep any hint (e.g. for a delete that follows)
  END IF;
  NEW."changeSource" := NULL;
  NEW."changeNote" := NULL;
  NEW."changeActorId" := NULL;
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER "IpAddress_service_history" BEFORE INSERT OR UPDATE OR DELETE ON "IpAddress"
  FOR EACH ROW EXECUTE FUNCTION service_ip_history();

-- starting point: what each service has today
INSERT INTO "ServiceIpEvent" ("id", "serviceId", "address", "action", "source", "isPrimary", "note", "createdAt")
SELECT md5(random()::text || clock_timestamp()::text), ip."serviceId", ip."address", 'ASSIGNED', 'PANEL', ip."isPrimary", 'IP the service had when history started', COALESCE(s."createdAt", ip."createdAt")
FROM "IpAddress" ip JOIN "Service" s ON s.id = ip."serviceId";
