-- The IPs a service last had, kept even when they're taken off it (sync trouble, Virtualizor down), so the
-- address still shows and can be searched. Updated by the service IP history trigger on every assignment.
ALTER TABLE "Service" ADD COLUMN "lastKnownIps" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
CREATE INDEX "Service_lastKnownIps_idx" ON "Service" USING GIN ("lastKnownIps");

CREATE OR REPLACE FUNCTION service_ip_event(svc TEXT, addr TEXT, act TEXT, src TEXT, prim BOOLEAN, nt TEXT, actor TEXT) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "Service" WHERE id = svc) THEN RETURN; END IF;
  INSERT INTO "ServiceIpEvent" ("id", "serviceId", "address", "action", "source", "isPrimary", "note", "actorId", "createdAt")
  VALUES (md5(random()::text || clock_timestamp()::text), svc, addr, act, COALESCE(src, 'PANEL'), COALESCE(prim, false), nt, actor, now() AT TIME ZONE 'UTC');
  IF act = 'ASSIGNED' THEN
    -- what it holds now plus this one (the row being written isn't visible yet), primary first
    UPDATE "Service" SET "lastKnownIps" = ARRAY(
      SELECT a FROM (
        SELECT "address" AS a, "isPrimary" AS p FROM "IpAddress" WHERE "serviceId" = svc AND "address" <> addr
        UNION ALL SELECT addr, COALESCE(prim, false)
      ) x ORDER BY p DESC, a
    ) WHERE id = svc;
  END IF;
END $$ LANGUAGE plpgsql;

-- starting point: the IPs each service has now; services with none get the last ones their history shows
UPDATE "Service" s SET "lastKnownIps" = x.ips
FROM (SELECT "serviceId", ARRAY_AGG("address" ORDER BY "isPrimary" DESC, "address") AS ips FROM "IpAddress" WHERE "serviceId" IS NOT NULL GROUP BY "serviceId") x
WHERE s.id = x."serviceId";
UPDATE "Service" s SET "lastKnownIps" = x.ips
FROM (
  SELECT e."serviceId", ARRAY_AGG(DISTINCT e."address") AS ips
  FROM "ServiceIpEvent" e
  JOIN (SELECT "serviceId", MAX("createdAt") AS at FROM "ServiceIpEvent" WHERE "action" = 'ASSIGNED' GROUP BY "serviceId") m
    ON m."serviceId" = e."serviceId" AND e."createdAt" = m.at AND e."action" = 'ASSIGNED'
  GROUP BY e."serviceId"
) x
WHERE s.id = x."serviceId" AND cardinality(s."lastKnownIps") = 0;
