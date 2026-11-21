/**
 * PrimoCloud catalogue — generated from the plan cards on the website (apps/site/src/screens/**).
 * Each plan's `slug` is the one its "Deploy …" / "Order Now" button links to
 * (/order/configure?product=<slug>), so keep the two in step when you add or rename a plan.
 *
 * Prices are the website's USD prices. INR is USD × USD_TO_INR (seed.ts), the same rate the
 * website's currency switch uses (apps/site/src/context/CurrencyContext.jsx → INR_RATE).
 * After the first seed, prices are managed in Admin → Products; re-seeding never overwrites them.
 */
import type { ProductType, Provisioner } from "../src/db";

export interface CatalogPlan {
  name: string;
  slug: string;
  tagline: string;
  /** monthly price in USD */
  usd: number;
  /** per-month price in USD when billed yearly (omitted = no annual cycle) */
  usdAnnual?: number;
  /** one-time setup fee in USD on monthly billing (waived on annual) */
  setupUsd?: number;
  featured?: boolean;
  cpu?: number;
  ram?: number; // GB
  disk?: number; // GB
  bw?: number | null; // GB, null = unmetered
  ipv4?: number;
  features: string[];
}
export interface CatalogGroup {
  name: string;
  slug: string;
  headline: string;
  type: ProductType;
  provisioner: Provisioner;
  /** OS templates offered: linux, windows, any (both) or none */
  os: "linux" | "windows" | "any" | "none";
  resellerEnabled: boolean;
  plans: CatalogPlan[];
}

export const CATALOG: CatalogGroup[] = [
  {
    "name": "Cloud VPS",
    "slug": "cloud-vps",
    "headline": "High-performance VPS for apps, staging and production",
    "type": "VPS_LINUX",
    "provisioner": "PROXMOX",
    "os": "any",
    "resellerEnabled": true,
    "plans": [
      {
        "name": "Starter VPS",
        "slug": "vps-starter",
        "tagline": "Light apps & staging",
        "usd": 6.99,
        "usdAnnual": 5.59,
        "cpu": 1,
        "ram": 2,
        "disk": 40,
        "bw": 2048,
        "ipv4": 1,
        "features": [
          "1 vCPU (High Clock)",
          "2 GB DDR4 RAM",
          "40 GB NVMe SSD Storage",
          "2 TB Bandwidth @ 1 Gbps",
          "1 Dedicated IPv4 Address",
          "Linux OS (Ubuntu, Alma, Debian)"
        ]
      },
      {
        "name": "Business VPS",
        "slug": "vps-business",
        "tagline": "Optimized for production",
        "usd": 14.99,
        "usdAnnual": 11.99,
        "featured": true,
        "cpu": 2,
        "ram": 4,
        "disk": 80,
        "bw": 5120,
        "ipv4": 1,
        "features": [
          "2 vCPU Dedicated Core Share",
          "4 GB DDR4 RAM",
          "80 GB NVMe SSD (Gen4)",
          "5 TB Bandwidth @ 10 Gbps",
          "1 Dedicated IPv4 + /64 IPv6",
          "Linux or Windows Server OS"
        ]
      },
      {
        "name": "Professional VPS",
        "slug": "vps-professional",
        "tagline": "Databases & ERP systems",
        "usd": 29.99,
        "usdAnnual": 23.99,
        "cpu": 4,
        "ram": 8,
        "disk": 160,
        "bw": 10240,
        "ipv4": 2,
        "features": [
          "4 vCPU High-Frequency",
          "8 GB DDR4 RAM",
          "160 GB NVMe SSD Storage",
          "10 TB Bandwidth @ 10 Gbps",
          "2 Dedicated IPv4 Addresses",
          "Automated Daily Snapshot"
        ]
      },
      {
        "name": "Enterprise VPS",
        "slug": "vps-enterprise",
        "tagline": "Heavy compute & fintech",
        "usd": 59.99,
        "usdAnnual": 47.99,
        "cpu": 8,
        "ram": 16,
        "disk": 320,
        "bw": null,
        "ipv4": 3,
        "features": [
          "8 vCPU Dedicated Compute",
          "16 GB DDR4 RAM",
          "320 GB Pure NVMe Storage",
          "Unmetered Bandwidth",
          "3 Dedicated IPv4 + /64 IPv6",
          "Priority 24/7 SLA SysAdmin"
        ]
      }
    ]
  },
  {
    "name": "Linux VPS",
    "slug": "linux-vps",
    "headline": "AMD EPYC Linux VPS with full root access",
    "type": "VPS_LINUX",
    "provisioner": "PROXMOX",
    "os": "linux",
    "resellerEnabled": true,
    "plans": [
      {
        "name": "Lin-Starter",
        "slug": "lin-starter",
        "tagline": "Ideal for personal dev servers, lightweight APIs, or proxy gateways.",
        "usd": 6.99,
        "usdAnnual": 5.59,
        "cpu": 1,
        "ram": 2,
        "disk": 40,
        "bw": 2048,
        "ipv4": 1,
        "features": [
          "1 vCPU @ 3.4GHz+ AMD EPYC",
          "2 GB DDR5 ECC RAM",
          "40 GB NVMe Gen4 Storage",
          "2 TB Bandwidth @ 1 Gbps",
          "1 Dedicated IPv4 + /64 IPv6",
          "Full Root / SSH Console"
        ]
      },
      {
        "name": "Lin-Dev",
        "slug": "lin-dev",
        "tagline": "Perfect for microservices, staging, Docker containers, and web apps.",
        "usd": 14.99,
        "usdAnnual": 11.99,
        "featured": true,
        "cpu": 2,
        "ram": 4,
        "disk": 80,
        "bw": 5120,
        "ipv4": 1,
        "features": [
          "2 vCPU @ 3.7GHz+ AMD EPYC",
          "4 GB DDR5 ECC RAM",
          "80 GB NVMe Gen4 Storage",
          "5 TB Bandwidth @ 1 Gbps",
          "1 Dedicated IPv4 + /64 IPv6",
          "Automated Daily Snapshots",
          "1-Click App Catalog (Docker/LEMP)"
        ]
      },
      {
        "name": "Lin-Pro",
        "slug": "lin-pro",
        "tagline": "Built for intensive databases, high-traffic SaaS, and CI/CD runners.",
        "usd": 28.99,
        "usdAnnual": 23.19,
        "cpu": 4,
        "ram": 8,
        "disk": 160,
        "bw": 10240,
        "ipv4": 2,
        "features": [
          "4 vCPU @ 3.7GHz+ Dedicated",
          "8 GB DDR5 ECC RAM",
          "160 GB NVMe Gen4 Storage",
          "10 TB Bandwidth @ 1 Gbps",
          "2 Dedicated IPv4 + /64 IPv6",
          "24/7 Priority SysAdmin Support",
          "Custom Reverse DNS / rDNS"
        ]
      },
      {
        "name": "Lin-Scale",
        "slug": "lin-scale",
        "tagline": "Enterprise computing for clusters, big data, and high-concurrency APIs.",
        "usd": 56.99,
        "usdAnnual": 45.59,
        "cpu": 8,
        "ram": 16,
        "disk": 320,
        "bw": null,
        "ipv4": 3,
        "features": [
          "8 vCPU Dedicated Zen 4",
          "16 GB DDR5 ECC RAM",
          "320 GB NVMe Gen4 RAID-10",
          "Unmetered Bandwidth @ 10 Gbps",
          "3 Dedicated IPv4 + /64 IPv6",
          "Private 10G VPC Network",
          "99.99% Hardware SLA SLA"
        ]
      }
    ]
  },
  {
    "name": "Windows VPS",
    "slug": "windows-vps",
    "headline": "Windows Server VPS with full RDP access",
    "type": "VPS_WINDOWS",
    "provisioner": "PROXMOX",
    "os": "windows",
    "resellerEnabled": true,
    "plans": [
      {
        "name": "Win-Basic",
        "slug": "win-basic",
        "tagline": "Perfect for basic administrative tools, light bots, and single-user remote workspace.",
        "usd": 12.99,
        "usdAnnual": 10.39,
        "cpu": 2,
        "ram": 4,
        "disk": 60,
        "bw": 3072,
        "ipv4": 1,
        "features": [
          "2 vCPU Cores @ 3.4GHz+",
          "4 GB DDR4 ECC RAM",
          "60 GB Gen4 NVMe RAID-10",
          "3 TB Bandwidth @ 1 Gbps",
          "1 Dedicated IPv4 Address",
          "Full Administrator Access",
          "Windows Server 2022 / 2025"
        ]
      },
      {
        "name": "Win-Pro",
        "slug": "win-pro",
        "tagline": "Recommended for Forex MT4/MT5, multi-session RDP, and IIS microservices.",
        "usd": 24.99,
        "usdAnnual": 19.99,
        "featured": true,
        "cpu": 4,
        "ram": 8,
        "disk": 120,
        "bw": 6144,
        "ipv4": 1,
        "features": [
          "4 vCPU Cores @ 3.4GHz+",
          "8 GB DDR4 ECC RAM",
          "120 GB Gen4 NVMe RAID-10",
          "6 TB Bandwidth @ 1 Gbps",
          "1 Dedicated IPv4 + /64 IPv6",
          "Automated Daily Backups",
          "Instant Reboot & 1-Click OS Reset"
        ]
      },
      {
        "name": "Win-Elite",
        "slug": "win-elite",
        "tagline": "Tailored for MSSQL servers, enterprise accounting (Tally/QuickBooks), and multi-tenant teams.",
        "usd": 48.99,
        "usdAnnual": 39.19,
        "cpu": 8,
        "ram": 16,
        "disk": 240,
        "bw": 10240,
        "ipv4": 2,
        "features": [
          "8 vCPU Cores @ 3.7GHz+",
          "16 GB DDR4/DDR5 ECC RAM",
          "240 GB Gen4 NVMe RAID-10",
          "10 TB Bandwidth @ 1 Gbps",
          "2 Dedicated IPv4 Addresses",
          "24/7 Priority SysAdmin Support",
          "Enhanced Layer 7 DDoS Guard"
        ]
      },
      {
        "name": "Win-Extreme",
        "slug": "win-extreme",
        "tagline": "Heavy compute node for Hyper-V nested virtualization, large trading farms, and corporate ERP.",
        "usd": 89.99,
        "usdAnnual": 71.99,
        "cpu": 16,
        "ram": 32,
        "disk": 500,
        "ipv4": 3,
        "features": [
          "16 vCPU Cores Dedicated Core",
          "32 GB DDR5 High-Speed RAM",
          "500 GB Gen4 NVMe RAID-10",
          "Unmetered Transfer @ 10 Gbps",
          "3 Dedicated IPv4 Addresses",
          "Dedicated 10Gbps Uplink Port",
          "Dedicated TAM (Technical Mgr)"
        ]
      }
    ]
  },
  {
    "name": "Forex VPS",
    "slug": "forex-vps",
    "headline": "Low-latency VPS for MT4 / MT5 trading",
    "type": "VPS_FOREX",
    "provisioner": "PROXMOX",
    "os": "windows",
    "resellerEnabled": false,
    "plans": [
      {
        "name": "Trader Basic",
        "slug": "forex-trader-basic",
        "tagline": "Designed for solo retail traders operating 1-2 standard automated terminals.",
        "usd": 9.99,
        "usdAnnual": 7.99,
        "cpu": 1,
        "ram": 2,
        "disk": 50,
        "ipv4": 1,
        "features": [
          "1 vCPU @ 3.4GHz+ AMD EPYC",
          "2 GB DDR5 ECC RAM",
          "50 GB NVMe Gen4 Storage",
          "1–2 MT4 / MT5 Terminals",
          "Equinix LD4 (London) or NY4 (NY)",
          "99.99% Trading SLA"
        ]
      },
      {
        "name": "Trader Pro",
        "slug": "forex-trader-pro",
        "tagline": "Optimized for active algorithmic traders managing multiple asset pairs.",
        "usd": 19.99,
        "usdAnnual": 15.99,
        "featured": true,
        "cpu": 2,
        "ram": 4,
        "disk": 90,
        "ipv4": 1,
        "features": [
          "2 vCPU @ 3.7GHz+ Dedicated",
          "4 GB DDR5 ECC RAM",
          "90 GB NVMe Gen4 Storage",
          "3–6 MT4 / MT5 Terminals",
          "Automated Crash-Guardian Daemon",
          "Unmetered 1Gbps Direct Fiber"
        ]
      },
      {
        "name": "Algo Master",
        "slug": "forex-algo-master",
        "tagline": "Heavy-duty compute for tick scalpers, cTrader, and multi-broker setups.",
        "usd": 34.99,
        "usdAnnual": 27.99,
        "cpu": 4,
        "ram": 8,
        "disk": 160,
        "ipv4": 1,
        "features": [
          "4 vCPU @ 3.8GHz+ Dedicated",
          "8 GB DDR5 ECC RAM",
          "160 GB NVMe Gen4 Storage",
          "8–15 MT4 / MT5 / cTrader Bots",
          "Dedicated Clean Static IPv4",
          "24/7 Priority Quant Support"
        ]
      },
      {
        "name": "High-Frequency Quant",
        "slug": "forex-hf-quant",
        "tagline": "Enterprise cluster for fund managers, Python FIX API & prop firm trading pools.",
        "usd": 64.99,
        "usdAnnual": 51.99,
        "cpu": 8,
        "ram": 16,
        "disk": 320,
        "ipv4": 1,
        "features": [
          "8 vCPU Bare-Metal Pinning",
          "16 GB DDR5 ECC RAM",
          "320 GB NVMe Gen4 Storage",
          "Unlimited Trading Bots & FIX Engines",
          "Dual Broker Cross-Connect Peering",
          "99.999% Financial SLA"
        ]
      }
    ]
  },
  {
    "name": "Gold VPS",
    "slug": "gold-vps",
    "headline": "Premium high-frequency VPS",
    "type": "VPS_GOLD",
    "provisioner": "PROXMOX",
    "os": "linux",
    "resellerEnabled": true,
    "plans": [
      {
        "name": "Gold-1",
        "slug": "gold-1",
        "tagline": "Perfect for API gateways, microservices, and dedicated trading bots.",
        "usd": 39.99,
        "usdAnnual": 31.99,
        "cpu": 4,
        "ram": 16,
        "disk": 200,
        "bw": 10240,
        "ipv4": 2,
        "features": [
          "4 Dedicated AMD EPYC Cores",
          "16 GB DDR5 ECC Registered",
          "200 GB PCIe Gen5 NVMe RAID-10",
          "10 TB Bandwidth @ 2.5 Gbps",
          "2 Dedicated Clean IPv4 + /64 IPv6",
          "Automated Daily Snapshots"
        ]
      },
      {
        "name": "Gold-2",
        "slug": "gold-2",
        "tagline": "The sweet spot for mission-critical SaaS, PostgreSQL clusters & low-latency execution.",
        "usd": 79.99,
        "usdAnnual": 63.99,
        "featured": true,
        "cpu": 8,
        "ram": 32,
        "disk": 450,
        "bw": 20480,
        "ipv4": 3,
        "features": [
          "8 Dedicated AMD EPYC Cores",
          "32 GB DDR5 ECC Registered",
          "450 GB PCIe Gen5 NVMe RAID-10",
          "20 TB Bandwidth @ 5 Gbps Port",
          "3 Dedicated Clean IPv4 + /64 IPv6",
          "Daily Snapshots + 1-Click Rollback",
          ">VIP Queue & Direct Slack Support"
        ]
      },
      {
        "name": "Gold-3",
        "slug": "gold-3",
        "tagline": "Massive memory footprint for Redis datasets, ClickHouse, and high-load CI/CD builders.",
        "usd": 149.99,
        "usdAnnual": 119.99,
        "cpu": 16,
        "ram": 64,
        "disk": 900,
        "bw": 40960,
        "ipv4": 4,
        "features": [
          "16 Dedicated AMD EPYC Cores",
          "64 GB DDR5 ECC Registered",
          "900 GB PCIe Gen5 NVMe RAID-10",
          "40 TB Bandwidth @ 10 Gbps Port",
          "4 Dedicated Clean IPv4 + /64 IPv6",
          "Custom rDNS & BGP Announced IPs"
        ]
      },
      {
        "name": "Gold-Extreme",
        "slug": "gold-extreme",
        "tagline": "Complete socket partition. Replaces dedicated metal with dynamic cloud snapshotting.",
        "usd": 279.99,
        "usdAnnual": 223.99,
        "cpu": 32,
        "ram": 128,
        "disk": 1843,
        "bw": null,
        "ipv4": 6,
        "features": [
          "32 Dedicated AMD Cores (Full Socket)",
          "128 GB DDR5 ECC Registered",
          "1.8 TB PCIe Gen5 NVMe RAID-10",
          "Unmetered Bandwidth @ 10 Gbps",
          "6 Dedicated Clean IPv4 + Subnet",
          ">Dedicated Lead Architect Assigned"
        ]
      }
    ]
  },
  {
    "name": "n8n VPS",
    "slug": "n8n-vps",
    "headline": "Self-hosted n8n with unlimited workflows",
    "type": "VPS_N8N",
    "provisioner": "PROXMOX",
    "os": "linux",
    "resellerEnabled": false,
    "plans": [
      {
        "name": "n8n-Starter",
        "slug": "n8n-starter",
        "tagline": "Ideal for solo founders, developers, and pilot automation projects.",
        "usd": 19.99,
        "usdAnnual": 15.99,
        "cpu": 2,
        "ram": 4,
        "disk": 60,
        "ipv4": 1,
        "features": [
          "2 vCPU AMD EPYC™ Gen4",
          "4 GB High-Speed DDR5 RAM",
          "60 GB NVMe PCIe 4.0 Storage",
          "Unmetered Executions & Webhooks",
          "Pre-configured SSL & Custom Domain",
          "Automated Daily Snapshots"
        ]
      },
      {
        "name": "n8n-Pro",
        "slug": "n8n-pro",
        "tagline": "Engineered for high-volume SaaS operations & RevOps pipelines.",
        "usd": 39.99,
        "usdAnnual": 31.99,
        "featured": true,
        "cpu": 4,
        "ram": 8,
        "disk": 120,
        "ipv4": 1,
        "features": [
          "4 Dedicated AMD EPYC™ Cores",
          "8 GB DDR5 RAM",
          "120 GB Enterprise NVMe Gen4",
          "Dedicated Redis & 8 Parallel Workers",
          "Unlimited Webhooks & Data Transfers",
          "Priority Slack & Discord Support",
          "1-Click Backup & Instant Rollback"
        ]
      },
      {
        "name": "n8n-Business",
        "slug": "n8n-business",
        "tagline": "Multi-team workflows with concurrent AI model chaining.",
        "usd": 79.99,
        "usdAnnual": 63.99,
        "cpu": 8,
        "ram": 16,
        "disk": 250,
        "ipv4": 1,
        "features": [
          "8 Dedicated AMD EPYC™ Cores",
          "16 GB DDR5 ECC Memory",
          "250 GB NVMe Gen4 Storage",
          "32 Concurrency Redis Worker Queue",
          "Custom NPM & Python Packages Allowed",
          "SSO / SAML Authentication Ready",
          "99.99% Financial Uptime SLA"
        ]
      },
      {
        "name": "n8n-Enterprise",
        "slug": "n8n-enterprise",
        "tagline": "Mission-critical high-availability cluster with managed failover.",
        "usd": 149.99,
        "usdAnnual": 119.99,
        "cpu": 16,
        "ram": 32,
        "disk": 500,
        "ipv4": 1,
        "features": [
          "16 Dedicated AMD EPYC™ Cores",
          "32 GB DDR5 ECC Memory",
          "500 GB PCIe Gen5 NVMe RAID-10",
          "Dedicated PostgreSQL HA Cluster",
          "Dual Redis Broker with Auto-Failover",
          "VIP 15-Minute Human Response SLA",
          "Dedicated IPv4 + IPv6 /48 BGP"
        ]
      }
    ]
  },
  {
    "name": "Tally on Cloud",
    "slug": "tally-on-cloud",
    "headline": "Tally Prime on a secure cloud server",
    "type": "TALLY",
    "provisioner": "PROXMOX",
    "os": "windows",
    "resellerEnabled": false,
    "plans": [
      {
        "name": "Single User",
        "slug": "tally-single-user",
        "tagline": "Freelancers & small shops",
        "usd": 9.99,
        "usdAnnual": 7.99,
        "cpu": 2,
        "ram": 4,
        "disk": 50,
        "ipv4": 1,
        "features": [
          "1 Concurrent User",
          "2 vCPU · 4 GB RAM",
          "50 GB NVMe Storage",
          "Tally Prime & ERP 9 Ready",
          "Daily Automated Backup",
          "Remote Printing"
        ]
      },
      {
        "name": "Business Team",
        "slug": "tally-business-team",
        "tagline": "Growing finance teams",
        "usd": 24.99,
        "usdAnnual": 19.99,
        "featured": true,
        "cpu": 4,
        "ram": 8,
        "disk": 120,
        "ipv4": 1,
        "features": [
          "Up to 5 Concurrent Users",
          "4 vCPU · 8 GB RAM",
          "120 GB NVMe Storage",
          "Multi-Company Support",
          "Hourly Automated Backup",
          "Role-Based Data Rights"
        ]
      },
      {
        "name": "Enterprise Team",
        "slug": "tally-enterprise-team",
        "tagline": "Multi-branch companies",
        "usd": 49.99,
        "usdAnnual": 39.99,
        "cpu": 8,
        "ram": 16,
        "disk": 250,
        "ipv4": 1,
        "features": [
          "Up to 15 Concurrent Users",
          "8 vCPU · 16 GB RAM",
          "250 GB NVMe Storage",
          "Custom TDL & ODBC Support",
          "Geo-Redundant Backup",
          "Priority 24/7 Support"
        ]
      },
      {
        "name": "CA & Agency Hub",
        "slug": "tally-ca-agency-hub",
        "tagline": "Firms managing many clients",
        "usd": 99.99,
        "usdAnnual": 79.99,
        "cpu": 16,
        "ram": 32,
        "disk": 500,
        "ipv4": 1,
        "features": [
          "Up to 40 Concurrent Users",
          "16 vCPU · 32 GB RAM",
          "500 GB NVMe Storage",
          "Unlimited Client Companies",
          "Dedicated Account Manager",
          "White-Glove Migration"
        ]
      }
    ]
  },
  {
    "name": "Shared Hosting",
    "slug": "shared-hosting",
    "headline": "Fast NVMe web hosting with cPanel",
    "type": "SHARED",
    "provisioner": "MANUAL",
    "os": "none",
    "resellerEnabled": false,
    "plans": [
      {
        "name": "Starter",
        "slug": "shared-starter",
        "tagline": "Ideal for personal blogs, portfolios, and single websites.",
        "usd": 3.75,
        "usdAnnual": 2.99,
        "features": [
          "1 Website",
          "15 GB Pure NVMe Storage",
          "Unmetered Bandwidth",
          "10 Business Email Accounts",
          "Free Let's Encrypt Wildcard SSL",
          "1 vCPU • 1 GB RAM CageFS Cap",
          "cPanel + Softaculous 1-Click"
        ]
      },
      {
        "name": "Business",
        "slug": "shared-business",
        "tagline": "Engineered for growing businesses, clients & e-commerce.",
        "usd": 7.49,
        "usdAnnual": 5.99,
        "featured": true,
        "features": [
          ">Unlimited Websites",
          "50 GB Pure NVMe Storage",
          "Unmetered Bandwidth",
          "Unlimited Business Emails",
          "Free Domain Name (1st Year)",
          "2 vCPU • 2 GB RAM + LiteSpeed Cache",
          "JetBackup 30-Day Snapshot Retention"
        ]
      },
      {
        "name": "Turbo Pro",
        "slug": "shared-turbo-pro",
        "tagline": "High-traffic WooCommerce, busy blogs & power users.",
        "usd": 12.49,
        "usdAnnual": 9.99,
        "features": [
          "Unlimited Websites",
          "100 GB Pure NVMe Storage",
          "Unthrottled 600,000 Inodes",
          "Free Domain + Dedicated IP",
          "3 vCPU • 4 GB RAM Turbo Compute",
          "Redis & Memcached Object Caching",
          "VIP Priority 24/7/365 Support SLA"
        ]
      },
      {
        "name": "Enterprise Cloud",
        "slug": "shared-enterprise-cloud",
        "tagline": "Mission-critical corporate sites with highest isolated limits.",
        "usd": 22.5,
        "usdAnnual": 17.99,
        "features": [
          "Unlimited Websites",
          "Unlimited NVMe Enterprise Disk",
          "Dedicated IPv4 & IPv6 Subnet",
          "4 vCPU • 8 GB RAM CageFS Cap",
          "Imunify360 Proactive Defense WAF",
          "Staging Envs & Git Version Control",
          "Dedicated Account Mgr + Migration"
        ]
      }
    ]
  },
  {
    "name": "Reseller Hosting",
    "slug": "reseller-hosting",
    "headline": "White-label hosting for agencies and resellers",
    "type": "RESELLER_HOSTING",
    "provisioner": "MANUAL",
    "os": "none",
    "resellerEnabled": false,
    "plans": [
      {
        "name": "Reseller Start",
        "slug": "reseller-start",
        "tagline": "Perfect for freelance web designers launching their first 10-15 client sites.",
        "usd": 19.99,
        "usdAnnual": 15.99,
        "features": [
          "25 cPanel Accounts",
          "50 GB NVMe Gen4 Storage",
          "1 TB Unmetered Bandwidth",
          "Free SSL & Daily JetBackup",
          "LiteSpeed Web Server Included"
        ]
      },
      {
        "name": "Reseller Pro",
        "slug": "reseller-pro",
        "tagline": "Ideal for growing digital agencies managing recurring client retainers.",
        "usd": 34.99,
        "usdAnnual": 27.99,
        "featured": true,
        "features": [
          "60 cPanel Accounts",
          "120 GB NVMe Gen4 Storage",
          "3 TB Unmetered Bandwidth",
          "Free WHMCS Starter License",
          "Free Dedicated Clean Static IP",
          "JetBackup 30-Day Retention",
          "1-Click Staging & WP-CLI"
        ]
      },
      {
        "name": "Reseller Elite",
        "slug": "reseller-elite",
        "tagline": "Built for established design studios with high-traffic e-commerce stores.",
        "usd": 64.99,
        "usdAnnual": 51.99,
        "features": [
          "120 cPanel Accounts",
          "250 GB NVMe Gen4 Storage",
          "6 TB Unmetered Bandwidth",
          "Free WHMCS Pro License",
          "2 Dedicated Clean IPs",
          "Priority Tier-3 SysAdmin Support",
          "Redis Object Cache Support"
        ]
      },
      {
        "name": "Reseller Scale",
        "slug": "reseller-scale",
        "tagline": "Maximum horsepower with dedicated core allocations and white-glove migration.",
        "usd": 119.99,
        "usdAnnual": 95.99,
        "features": [
          "250 cPanel Accounts",
          "500 GB NVMe Gen4 Storage",
          "12 TB Unmetered Bandwidth",
          "Free WHMCS Business License",
          "4 Dedicated Clean IPs",
          "Direct Slack Engineering Channel",
          "15-Minute Guaranteed SLA"
        ]
      }
    ]
  },
  {
    "name": "WordPress Hosting",
    "slug": "wordpress-hosting",
    "headline": "Managed WordPress & WooCommerce hosting",
    "type": "WORDPRESS",
    "provisioner": "MANUAL",
    "os": "none",
    "resellerEnabled": false,
    "plans": [
      {
        "name": "WP Starter",
        "slug": "wp-starter",
        "tagline": "Ideal for personal blogs, simple portfolios, and early-stage projects.",
        "usd": 2.99,
        "usdAnnual": 2.39,
        "features": [
          "1 WordPress Site",
          "15 GB NVMe Storage",
          "Unmetered Bandwidth",
          "10 Business Email Inboxes",
          "Free AutoSSL Certificate",
          "1 vCPU / 1 GB RAM CageFS",
          "cPanel + WP Toolkit Integration"
        ]
      },
      {
        "name": "WP Business",
        "slug": "wp-business",
        "tagline": "Engineered for growing businesses, fast content creators & landing pages.",
        "usd": 5.99,
        "usdAnnual": 4.79,
        "featured": true,
        "features": [
          "5 WordPress Sites",
          "50 GB PCIe 4.0 NVMe Storage",
          "Unlimited Business Emails",
          "Free Domain (1st Year)",
          "Free Wildcard SSL + HTTP/3",
          "2 vCPU / 2 GB RAM + LSCache",
          "Redis Cache (128MB)",
          "JetBackup 30-Day Retention"
        ]
      },
      {
        "name": "WooCommerce Pro",
        "slug": "wp-woocommerce-pro",
        "tagline": "Dedicated PHP workers designed for transactional carts and heavy catalogs.",
        "usd": 9.99,
        "usdAnnual": 7.99,
        "features": [
          "15 WP / WooCommerce Stores",
          "100 GB Pure NVMe Storage",
          "Free Domain + Dedicated IP",
          "3 vCPU / 4 GB Compute",
          "Dedicated PHP Workers (Parallel)",
          "Redis Object Cache (256MB)",
          "Imunify360 WAF & Malware Purge"
        ]
      },
      {
        "name": "WP Enterprise",
        "slug": "wp-enterprise",
        "tagline": "Maximum dedicated container allocation for high-traffic agencies & publishers.",
        "usd": 24.99,
        "usdAnnual": 19.99,
        "features": [
          "Unlimited WordPress Sites",
          "200 GB Enterprise NVMe Storage",
          "Dedicated IPv4 & IPv6 Subnet",
          "4 vCPU / 8 GB RAM CageFS",
          "Git CI/CD, WP-CLI & Staging Matrix",
          "Redis 512MB Dedicated Pool",
          "Priority 15-min SLA Support"
        ]
      }
    ]
  },
  {
    "name": "Dedicated Servers",
    "slug": "dedicated-servers",
    "headline": "Bare-metal servers, fully yours",
    "type": "DEDICATED",
    "provisioner": "MANUAL",
    "os": "none",
    "resellerEnabled": false,
    "plans": [
      {
        "name": "DS-Silver",
        "slug": "ds-silver",
        "tagline": "Optimized for high-traffic websites, microservices, and dedicated CI/CD build nodes.",
        "usd": 169.0,
        "usdAnnual": 135.0,
        "features": [
          "developer_boardAMD EPYC 7443P (24C / 48T @ 3.2GHz)",
          "memory128 GB DDR4 ECC Registered RAM",
          "storage2x 1.92 TB PCIe Gen4 NVMe (Soft RAID-1)",
          "router1 Gbps Unmetered (30 TB Guaranteed)",
          "hub/29 IPv4 Subnet (5 Usable IPs) + /64 IPv6",
          "terminalDedicated Out-of-band IPMI / KVM"
        ]
      },
      {
        "name": "DS-Gold",
        "slug": "ds-gold",
        "tagline": "Engineered for enterprise databases, production ERPs, and heavy multi-tenant backends.",
        "usd": 299.0,
        "usdAnnual": 239.0,
        "featured": true,
        "features": [
          "developer_boardDual Intel Xeon 4410Y (24C / 48T)",
          "memory256 GB DDR5 ECC 4800MHz RAM",
          "storage4x 3.84 TB Gen4 NVMe (HW RAID-10)",
          "speed10 Gbps Redundant Uplink (50 TB Bandwidth)",
          "security1.2+ Tbps Layer 3/4/7 DDoS Protection",
          "timer15-Minute Hardware Swap Guarantee"
        ]
      },
      {
        "name": "DS-Platinum",
        "slug": "ds-platinum",
        "tagline": "Built for mission-critical PostgreSQL/Oracle clusters, Apache Spark, and Elasticsearch.",
        "usd": 499.0,
        "usdAnnual": 399.0,
        "features": [
          "developer_boardAMD EPYC 9354 (32C / 64T @ 3.8GHz)",
          "memory512 GB DDR5 ECC High-Density RAM",
          "storage6x 3.84 TB Gen5 NVMe (HW RAID-6 + BBU)",
          "speed10 Gbps Dedicated Unmetered Port",
          "lanDedicated Private VLAN + Dual 10G SFP+",
          "support_agentAssigned Account Solutions Architect"
        ]
      },
      {
        "name": "DS-Ultra",
        "slug": "ds-ultra",
        "tagline": "Flagship compute monster for Proxmox/VMware clusters, private cloud, and AI inference.",
        "usd": 999.0,
        "usdAnnual": 799.0,
        "features": [
          "developer_boardDual AMD EPYC 9654 (192C / 384T @ 3.7GHz)",
          "memory1.5 TB (1536 GB) DDR5 ECC Reg RAM",
          "storage8x 7.68 TB NVMe U.2 (60TB usable RAID-10)",
          "speed2x 25 Gbps LACP Uplink (Unmetered)",
          "boltDual Redundant 1600W Titanium PSUs",
          "tuneFull Custom Private Rack Options"
        ]
      }
    ]
  },
  {
    "name": "GPU Servers",
    "slug": "gpu-servers",
    "headline": "NVIDIA RTX, A100 & H100 GPU servers",
    "type": "GPU",
    "provisioner": "MANUAL",
    "os": "none",
    "resellerEnabled": false,
    "plans": [
      {
        "name": "Pro-Workstation — 1x NVIDIA RTX 4090 24GB",
        "slug": "gpu-rtx-4090",
        "tagline": "Fine-tuning 7B models, Stable Diffusion XL, Unreal 5 renders.",
        "usd": 189.0,
        "features": [
          "24GB GDDR6X Liquid-Cooled",
          "16 AMD EPYC 9004 Cores (3.7GHz)",
          "64 GB DDR5 ECC Memory",
          "1.0 TB PCIe Gen5 NVMe SSD",
          "10 TB Bandwidth @ 2.5 Gbps Port",
          "IPMI / KVM Root Control"
        ]
      },
      {
        "name": "Inference Engine — 2x RTX 6000 Ada 48GB (96GB VRAM)",
        "slug": "gpu-rtx-6000-ada",
        "tagline": "vLLM production inference, 70B Quantized models, Computer Vision.",
        "usd": 649.0,
        "features": [
          "96GB GDDR6 ECC Total VRAM",
          "32 AMD EPYC 9004 Cores",
          "128 GB DDR5 ECC Memory",
          "2x 1.92 TB Gen5 NVMe RAID-1",
          "25 TB Bandwidth @ 10 Gbps Port",
          "Dual GPU P2P PCIe Gen5"
        ]
      },
      {
        "name": "Enterprise Titan — 4x NVIDIA A100 80GB SXM4 (320GB HBM2e)",
        "slug": "gpu-a100-titan",
        "tagline": "Llama-3 70B full fine-tuning, continuous pre-training, multi-modal LLM.",
        "usd": 1899.0,
        "featured": true,
        "features": [
          "320GB HBM2e (2 TB/s/GPU)",
          "600 GB/s NVLink Mesh Fabric",
          "64 AMD EPYC 9654 Cores",
          "256 GB DDR5 ECC Memory",
          "2x 3.84 TB PCIe Gen5 NVMe RAID-1",
          "400G HDR InfiniBand + 10G Uplink"
        ]
      },
      {
        "name": "Supercluster Node — 8x NVIDIA H100 80GB SXM5 (640GB HBM3)",
        "slug": "gpu-h100-node",
        "tagline": "Foundation model pre-training, Mixture-of-Experts (MoE), Bio-AlphaFold 3.",
        "usd": 4299.0,
        "features": [
          "640GB HBM3 (3.35 TB/s/GPU)",
          "900 GB/s NVSwitch Fabric",
          "Dual AMD EPYC 9654 (192 Cores)",
          "1.5 TB DDR5 ECC 4800MHz",
          "4x 7.68 TB Gen5 NVMe RAID-10",
          "3.2 Tbps Quantum-2 NDR (8x 400G)"
        ]
      }
    ]
  },
  {
    "name": "Colocation",
    "slug": "colocation",
    "headline": "Rack space in a Tier III data centre",
    "type": "COLOCATION",
    "provisioner": "MANUAL",
    "os": "none",
    "resellerEnabled": false,
    "plans": [
      {
        "name": "1U / 2U Shared",
        "slug": "colo-1u-2u",
        "tagline": "Ideal for custom firewalls, edge appliances, and remote backup nodes.",
        "usd": 79.0,
        "usdAnnual": 63.0,
        "setupUsd": 99,
        "features": [
          "1U or 2U 19\" Rackmount Space",
          "1.0 Amp @ 230V (A+B Dual Feeds)",
          "10 TB Bandwidth on 1 Gbps Port",
          "2 Usable IPv4 + /64 IPv6 Subnet",
          "2 Hours/Mo Free Smart Hands",
          "Remote Reboot Switched PDU Port"
        ]
      },
      {
        "name": "Quarter Rack",
        "slug": "colo-quarter-rack",
        "tagline": "Dedicated lockable compartment for scaling enterprise teams.",
        "usd": 249.0,
        "usdAnnual": 199.0,
        "setupUsd": 199,
        "features": [
          "10U Lockable Mesh Compartment",
          "4.0 Amps @ 230V (Dedicated Circuits)",
          "30 TB Bandwidth on 10 Gbps Uplink",
          "/29 IPv4 (5 IPs) + /48 IPv6 Subnet",
          "Free BGP Peering & BYOIP Routing",
          "4 Hours/Mo Included Smart Hands"
        ]
      },
      {
        "name": "Half Rack",
        "slug": "colo-half-rack",
        "tagline": "High-density containment for database arrays and virtualization clusters.",
        "usd": 449.0,
        "usdAnnual": 359.0,
        "setupUsd": 299,
        "featured": true,
        "features": [
          "21U Secure Private Caged Partition",
          "8.0 Amps @ 230V (Expandable to 16A)",
          "100 TB Bandwidth on Dual 10 Gbps Ports",
          "/28 IPv4 (13 IPs) + Custom Reverse DNS",
          "1 Gbps Cross-Connect to MMR included",
          "8 Hours/Mo Priority Smart Hands"
        ]
      },
      {
        "name": "Full Private Rack",
        "slug": "colo-full-rack",
        "tagline": "Sovereign enterprise cabinet with private biometric front/rear doors.",
        "usd": 799.0,
        "usdAnnual": 639.0,
        "setupUsd": 499,
        "features": [
          "42U / 48U APC NetShelter Cabinet",
          "16A to 32A @ 230V (Up to 15 kW Dense)",
          "Unmetered 10G or 40G Direct Fiber",
          "/27 Dedicated IPv4 + Dedicated VLAN / VRF",
          "24/7 Unescorted Biometric Badge Access",
          "Dedicated Technical Account Manager"
        ]
      }
    ]
  }
];
