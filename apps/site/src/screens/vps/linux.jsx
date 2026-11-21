import { orderUrl } from "../../lib/panel";
import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/layout";
import { useMotion } from "../../components/motion";
import { useCurrency } from "../../context/CurrencyContext";
import { I, Pill, Sec, Head, cardHover, IconBox } from "../../components/ui";

// ---------- content (taken from the HTML design) ----------
const trust = [
  ["verified_user", "99.99%", "SLA Uptime Guarantee"],
  ["developer_board", "100% Dedicated", "KVM Hypervisor Isolation"],
  ["speed", "<1ms", "Tier-1 Network Latency"],
  ["swap_calls", "1 - 10 Gbps", "Redundant Uplinks"],
];
const pillars = [
  [
    "terminal",
    "Unrestricted Root & SSH",
    "Full sudo privileges, kernel compilation, custom sysctl tuning, Netfilter/UFW firewall rules, and total autonomy with zero vendor lock-in.",
  ],
  [
    "memory",
    "AMD EPYC™ Zen 4 Compute",
    "Sustained high single-thread clock speeds, non-oversold dedicated vCPU pinning, and zero noisy neighbors ruining compiler jobs or DB queries.",
  ],
  [
    "hard_drive_2",
    "PCIe Gen4 NVMe RAID-10",
    "Direct PCIe lane saturation achieving over 7,000 MB/s sequential read/write and 150,000+ IOPS for intensive database transactions.",
  ],
  [
    "code_blocks",
    "Modern Dev Automation",
    "RESTful API, Terraform provider, robust CLI tooling, cloud-init user-data manifests, and custom ISO upload via emergency out-of-band VNC.",
  ],
];
const plans = [
  {
    n: "Lin-Starter", slug: "lin-starter",
    d: "Ideal for personal dev servers, lightweight APIs, or proxy gateways.",
    p: [6.99, 5.59],
    cta: "Deploy Starter",
    s: [
      "1 vCPU @ 3.4GHz+ AMD EPYC",
      "2 GB DDR5 ECC RAM",
      "40 GB NVMe Gen4 Storage",
      "2 TB Bandwidth @ 1 Gbps",
      "1 Dedicated IPv4 + /64 IPv6",
      "Full Root / SSH Console",
    ],
  },
  {
    n: "Lin-Dev", slug: "lin-dev",
    d: "Perfect for microservices, staging, Docker containers, and web apps.",
    p: [14.99, 11.99],
    feat: true,
    cta: "Deploy Lin-Dev",
    s: [
      "2 vCPU @ 3.7GHz+ AMD EPYC",
      "4 GB DDR5 ECC RAM",
      "80 GB NVMe Gen4 Storage",
      "5 TB Bandwidth @ 1 Gbps",
      "1 Dedicated IPv4 + /64 IPv6",
      "Automated Daily Snapshots",
      "1-Click App Catalog (Docker/LEMP)",
    ],
  },
  {
    n: "Lin-Pro", slug: "lin-pro",
    d: "Built for intensive databases, high-traffic SaaS, and CI/CD runners.",
    p: [28.99, 23.19],
    cta: "Deploy Lin-Pro",
    s: [
      "4 vCPU @ 3.7GHz+ Dedicated",
      "8 GB DDR5 ECC RAM",
      "160 GB NVMe Gen4 Storage",
      "10 TB Bandwidth @ 1 Gbps",
      "2 Dedicated IPv4 + /64 IPv6",
      "24/7 Priority SysAdmin Support",
      "Custom Reverse DNS / rDNS",
    ],
  },
  {
    n: "Lin-Scale", slug: "lin-scale",
    d: "Enterprise computing for clusters, big data, and high-concurrency APIs.",
    p: [56.99, 45.59],
    cta: "Deploy Lin-Scale",
    s: [
      "8 vCPU Dedicated Zen 4",
      "16 GB DDR5 ECC RAM",
      "320 GB NVMe Gen4 RAID-10",
      "Unmetered Bandwidth @ 10 Gbps",
      "3 Dedicated IPv4 + /64 IPv6",
      "Private 10G VPC Network",
      "99.99% Hardware SLA SLA",
    ],
  },
];
const priceTrust = [
  ["verified", "30-Day Money-Back Guarantee"],
  ["bolt", "Instant Cloud-Init Setup in <55s"],
  ["money_off", "No Setup Fees & Cancel Anytime"],
];
const distros = [
  [
    "terminal",
    "Ubuntu Server",
    "24.04 LTS / 22.04 LTS",
    "Standard",
    "Canonical certified cloud images with upstream Linux 6.8 kernel, native MicroK8s tooling, and systemd optimizers.",
  ],
  [
    "circle",
    "Debian GNU/Linux",
    "12 Bookworm / 11 Bullseye",
    "Rock-Solid",
    "Ultra-lightweight baseline footprint, maximal uptime consistency, zero telemetry overhead, and vast APT repository ecosystem.",
  ],
  [
    "security",
    "AlmaLinux",
    "9.4 / 8.9 (1:1 RHEL)",
    "Enterprise",
    "1:1 binary-compatible RHEL clone backed by the AlmaLinux Foundation. Pre-configured SELinux policies for enterprise workloads.",
  ],
  [
    "shield",
    "Rocky Linux",
    "9.4 Production",
    "Community",
    "Designed by CentOS founder Gregory Kurtzer. Full binary compatibility with Red Hat Enterprise Linux for hyper-reliable computing.",
  ],
  [
    "package_2",
    "Alpine Linux",
    "v3.20 (musl & busybox)",
    "Micro 5MB",
    "Extreme lightweight security-oriented distribution built on musl libc. Ideal for raw Docker engines and ultra-low RAM footprint tasks.",
  ],
  [
    "developer_mode",
    "Arch Linux & Custom ISO",
    "Rolling / Bring Your Own",
    "Unrestricted",
    "Rolling-release Arch Linux or upload any bootable raw ISO file via the control panel to boot your custom BSD, NixOS, or live recovery kernel.",
  ],
];
const why = [
  [
    "security",
    "1.2+ Tbps Layer 3/4/7 DDoS Protection",
    "Hardware in-line automated scrubbing with BGP FlowSpec. Stops UDP amplification, SYN floods, and HTTP floods without dropping legitimate API requests.",
  ],
  [
    "layers",
    "Pure KVM Hardware Virtualization",
    "No OpenVZ or LXC shared namespaces. Dedicated hardware instruction pass-through ensures your memory and CPU cycles remain isolated and unshared.",
  ],
  [
    "deployed_code",
    "Pre-Installed Developer Stacks",
    "1-click automated deployment for Docker & Docker Compose, LEMP/LAMP, Node.js runtime, Python FastAPI, PostgreSQL 16, and WireGuard VPN.",
  ],
  [
    "history",
    "Snapshot & Backup Automation",
    "Point-in-time filesystem snapshots executed in seconds. Schedule daily or weekly offsite automated backups to redundant S3 object storage.",
  ],
  [
    "emergency",
    "Out-of-Band VNC & Rescue Shell",
    "Misconfigured iptables or broken SSH keys? Access HTML5 Web VNC console directly through IPMI hypervisor, or boot into a PXE RAM-rescue OS.",
  ],
  [
    "support_agent",
    "24/7 Tier-3 Linux SysAdmins",
    "No tier-1 canned script responders. Speak directly with certified Red Hat (RHCE) and Linux Foundation (LFCS) engineers via live ticket and chat.",
  ],
];
const useCases = [
  [
    "language",
    "Web Apps & REST APIs",
    "High-throughput Node.js, Go, Python (Django/FastAPI), and PHP/Laravel instances with reverse NGINX or Caddy proxies.",
  ],
  [
    "hub",
    "Microservices & K8s",
    "Deploy lightweight k3s nodes, MicroK8s, or multi-container Docker Compose microservices backed by local NVMe persistent volumes.",
  ],
  [
    "database",
    "High-Concurrency DBs",
    "PostgreSQL, MySQL, MariaDB, and in-memory Redis clusters fine-tuned for high write operations and zero I/O wait latency.",
  ],
  [
    "integration_instructions",
    "CI/CD Runners & Pipelines",
    "Dedicated self-hosted GitHub Actions runners, GitLab CI daemons, and Jenkins workers for fast compilation and test matrices.",
  ],
  [
    "vpn_lock",
    "VPN, Proxy & Secure Mesh",
    "Host private WireGuard or OpenVPN bastions with clean, static IPv4 and IPv6 subnets, unmetered port forwarding, and full MTU tuning.",
  ],
  [
    "smart_toy",
    "Algorithmic Bots & Workers",
    "Reliable headless Chromium instances, web scraping fleets, background queue listeners (Celery, BullMQ), and trading automation.",
  ],
];
const tooling = [
  [
    "Official Terraform Provider:",
    "Manage instances, DNS records, block volumes, and firewall rules in version-controlled HCL files.",
  ],
  [
    "Cloud-Init Native Support:",
    "Inject YAML configuration on first boot: create users, install packages, write configs, and register node telemetry.",
  ],
  [
    "Comprehensive REST API & Webhooks:",
    "Full CRUD capability with granular API tokens, JSON responses, and webhook callbacks for lifecycle events.",
  ],
];
const tfCls = {
  k: "text-secondary-fixed",
  t: "text-tertiary-fixed",
  s: "text-primary-fixed",
  "": "",
};
const tf = [
  [
    ["k", "terraform"],
    ["", " {"],
  ],
  [
    ["", "  "],
    ["t", "required_providers"],
    ["", " {"],
  ],
  [["", "    primo = {"]],
  [
    ["", "      source  = "],
    ["s", '"primocloud/primo"'],
  ],
  [
    ["", "      version = "],
    ["s", '"~> 2.4.0"'],
  ],
  [["", "    }"]],
  [["", "  }"]],
  [["", "}"]],
  [["", ""]],
  [
    ["k", "resource"],
    ["", " "],
    ["s", '"primo_vps"'],
    ["", " "],
    ["t", '"web_node"'],
    ["", " {"],
  ],
  [
    ["", "  plan       = "],
    ["s", '"lin-dev"'],
  ],
  [
    ["", "  os         = "],
    ["s", '"ubuntu-24.04-lts"'],
  ],
  [
    ["", "  region     = "],
    ["s", '"fra-1"'],
  ],
  [["", "  ssh_keys   = [primo_ssh_key.dev_key.id]"]],
  [
    ["", "  backups    = "],
    ["t", "true"],
  ],
  [["", ""]],
  [["", "  user_data  = <<-EOF"]],
  [["", "    #cloud-config"]],
  [["", "    package_update: true"]],
  [["", "    packages:"]],
  [["", "      - docker.io"]],
  [["", "      - docker-compose"]],
  [["", "      - nginx"]],
  [["", "    runcmd:"]],
  [["", "      - systemctl enable --now docker"]],
  [["", "  EOF"]],
  [["", ""]],
  [
    ["", "  tags = ["],
    ["s", '"production"'],
    ["", ", "],
    ["s", '"web"'],
    ["", "]"],
  ],
  [["", "}"]],
];
const tfText = tf.map((l) => l.map((s) => s[1]).join("")).join("\n");
const compare = [
  [
    "Processor Architecture",
    "AMD EPYC™ 9654 (Up to 3.7+ GHz)",
    "Older Intel Xeon E5 / Skylake",
    "Oversold Legacy Cores",
  ],
  [
    "Disk Read/Write Throughput",
    "Up to 7,200 MB/s (PCIe Gen4 NVMe RAID-10)",
    "450 - 550 MB/s (SATA SSD)",
    "80 - 140 MB/s (Throttled HDD)",
  ],
  [
    "Virtualization Architecture",
    "100% Dedicated KVM Hypervisor",
    "OpenVZ / Shared Container",
    "Multi-tenant cPanel Shared",
  ],
  [
    "Custom Kernel & Modules",
    "Full Sudo, Custom Kernel, BPF, WireGuard",
    "Restricted Host Shared Kernel",
    "No Kernel Access or Root",
  ],
  [
    "DDoS Mitigation Stack",
    "1.2+ Tbps Automated Layer 3 - 7 Included",
    "Basic Null-Route / Extra Cost",
    "None (Account Suspended on Flood)",
  ],
  [
    "Provisioning Speed",
    "<55 Seconds Automated Cloud-Init",
    "5 to 15 Minutes",
    "Manual Billing Review (2-24 hrs)",
  ],
];
const reviews = [
  [
    "AL",
    "Alex Lindqvist",
    "Lead DevOps Engineer, PayPulse SaaS",
    '"We migrated 42 production microservices from a major legacy cloud provider to PRIMO Linux VPS. Our build times dropped by 38% thanks to the raw AMD EPYC clock speeds, and our monthly compute bill was cut in half."',
  ],
  [
    "DK",
    "David Kowalski",
    "Infrastructure Architect, CartFlow",
    '"Pure KVM isolation makes all the difference for our PostgreSQL databases. In four years with other VPS vendors, noisy neighbors caused massive latency spikes. With PRIMO, our I/O wait is virtually zero even at peak Black Friday load."',
  ],
  [
    "SL",
    "Sarah Lin",
    "OSS Core Maintainer & Staff Engineer",
    '"Being able to upload my own custom Arch kernel and configure BPF tracing via full root access without hypervisor restrictions is phenomenal. Their Terraform provider fits right into our GitOps pipeline seamlessly."',
  ],
];
const faqs = [
  [
    "Do I get complete root access with my Linux VPS?",
    "Yes, 100%. You receive unrestricted root privileges with full sudo access. You can compile custom kernels, write complex Netfilter/IPTables or UFW rules, manage daemons, and install any package or dependency without vendor limits.",
  ],
  [
    "Which Linux distributions and versions are supported?",
    "We provide 1-click cloud templates for Ubuntu Server (24.04 and 22.04 LTS), Debian (12 and 11), AlmaLinux (9.4 and 8.9), Rocky Linux (9.4), and Alpine Linux (3.20). You can also upload your own ISO image.",
  ],
  [
    "Can I mount a custom ISO or run my own custom kernel?",
    "Yes. You can paste any publicly accessible URL to an ISO file via the control panel or upload it directly. You can boot into your custom OS or installer using the emergency out-of-band HTML5 VNC console.",
  ],
  [
    "How fast is server provisioning and activation?",
    "Our automated orchestration cluster provisions KVM compute slices, formats NVMe partitions, generates network configurations, and finishes cloud-init execution in under 55 seconds on average.",
  ],
  [
    "Does PRIMO CLOUD support Docker and Kubernetes?",
    "Yes. Because our instances run true KVM hardware virtualization with native Linux kernel support, Docker, Docker Compose, MicroK8s, and lightweight k3s run out-of-the-box with overlay2 storage drivers and full cgroup v2 support.",
  ],
  [
    "What happens if I lock myself out of SSH or misconfigure firewall?",
    "You will never lose access. Our web console provides out-of-band HTML5 VNC access that communicates directly with the physical hypervisor, bypassing network configurations and SSH demons. You can also boot into a live RAM rescue mode.",
  ],
  [
    "Can I upgrade my CPU, RAM, or NVMe storage without losing data?",
    "Yes. You can scale your tier up at any time with a single reboot. Your NVMe root partition and swap spaces resize automatically upon restart without data disruption.",
  ],
  [
    "Is DDoS protection included by default on all Linux VPS plans?",
    "Yes, comprehensive 1.2+ Tbps multi-layer DDoS protection is enabled by default on all instances at no extra charge. Our Corero and Arbor scrubbing systems filter malicious traffic automatically.",
  ],
  [
    "Do you offer automated backups and point-in-time snapshots?",
    "Yes. You can create manual live snapshots in seconds before performing OS upgrades or testing configs. We also provide daily scheduled offsite backups replicated across isolated data centers.",
  ],
  [
    "Can I deploy using Terraform, Cloud-Init, or the REST API?",
    "Absolutely. We are an API-first cloud platform. You can automate complete cluster lifecycles using our documented REST endpoints, the official Terraform provider, or custom cloud-init scripts.",
  ],
];

const useJitter = (base, spread, ms = 1600, dec = 1) => {
  const [v, setV] = useState(base);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(
      () => setV(+(base + (Math.random() - 0.5) * spread * 2).toFixed(dec)),
      ms,
    );
    return () => clearInterval(t);
  }, [base, spread, ms, dec]);
  return v;
};

const Bar = ({ pct, on }) => (
  <div className="w-full bg-surface-variant/30 h-1.5 rounded-full overflow-hidden">
    <div
      className="bg-gradient-to-r from-primary-container to-primary-fixed h-full rounded-full transition-[width] duration-1000 ease-out"
      style={{ width: on ? `${pct}%` : "0%" }}
    />
  </div>
);

const Linux = () => {
  const rootRef = useRef(null);
  useMotion(rootRef);
  const { fmt } = useCurrency();
  const [yearly, setYearly] = useState(false);
  const [faqOpen, setFaqOpen] = useState([]);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(0); // terminal reveal
  const [run, setRun] = useState(0);
  const [on, setOn] = useState(false);
  const cpu = useJitter(12.4, 3);
  const iops = useJitter(4120, 250, 1800, 0);
  const dashCpu = useJitter(14.2, 3);

  // terminal: reveal lines one by one (instantly if reduced motion)
  useEffect(() => {
    setStep(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(7);
      return;
    }
    const t = setInterval(
      () =>
        setStep((s) => {
          if (s >= 7) {
            clearInterval(t);
            return s;
          }
          return s + 1;
        }),
      650,
    );
    return () => clearInterval(t);
  }, [run]);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), 300);
    return () => clearTimeout(t);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tfText);
    } catch (e) {
      /* clipboard blocked */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const toggleFaq = (i) =>
    setFaqOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  const show = (n) =>
    `transition-all duration-500 ${step >= n ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`;
  const tab =
    "px-4 py-1.5 rounded-lg font-label-md text-label-md transition-all";
  const btnSec =
    "inline-flex items-center justify-center font-label-md text-label-md bg-surface-container hover:bg-surface-container-high text-on-surface px-6 py-2.5 rounded-lg transition-colors";

  return (
    <Layout>
      <div ref={rootRef} className="flex flex-col w-full">
        {/* 1 HERO */}
        <section className="relative w-full bg-surface-container-low py-space-lg lg:py-12 overflow-hidden">
          <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(11,175,96,0.18)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
          <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin flex flex-col gap-space-xl">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto gap-space-md">
              <div className="inline-flex items-center gap-space-xs px-3 py-1 bg-surface-container-lowest border border-primary-container/20 shadow-sm rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-label-sm text-label-sm text-primary  uppercase">
                  KVM Virtualization • Full Root Access • Deploy in &lt;55
                  Seconds
                </span>
              </div>
              <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
                High-Performance Developer Cloud:{" "}
                <span className="bg-gradient-to-r from-primary-container via-secondary to-primary-container bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">
                  Dedicated Linux VPS
                </span>{" "}
                with Pure Root Control
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
                Deploy bare-metal fast Linux virtual servers powered by AMD
                EPYC™ processors, PCIe Gen4 NVMe arrays, custom cloud-init
                scripts, and native Docker & Kubernetes readiness.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-space-md pt-space-xs">
                <a
                  href="#pricing-matrix"
                  className="group relative overflow-hidden inline-flex items-center justify-center font-label-lg text-label-lg bg-gradient-to-r from-primary-container to-secondary text-on-primary px-8 py-3.5 rounded-xl shadow-md shadow-primary-container/30 transition-all hover:shadow-lg hover:-translate-y-0.5 before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700"
                >
                  Deploy Linux VPS Now
                </a>
                <a
                  href="#distros-section"
                  className="inline-flex items-center justify-center font-label-lg text-label-lg bg-surface-container-lowest border border-outline-variant hover:bg-secondary-container/20 hover:border-primary-container/50 text-on-surface px-8 py-3.5 rounded-xl shadow-sm transition-all"
                >
                  Explore Distributions
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter bg-surface-container-lowest border border-outline-variant rounded-xl p-space-md shadow-sm">
              {trust.map(([n, v, l]) => (
                <div key={l} className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center text-primary shrink-0">
                    <I n={n} c="text-[22px]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      {v}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {l}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* terminal */}
            <div className="w-full bg-inverse-surface rounded-xl shadow-2xl shadow-primary/10 p-space-lg text-inverse-on-surface flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-error" />
                  <span className="w-3 h-3 rounded-full bg-surface-container" />
                  <span className="w-3 h-3 rounded-full bg-primary-container" />
                  <span className="ml-2 font-mono-code text-body-sm text-surface-variant truncate">
                    primo@cloud-node-fra:~ (x86_64 KVM)
                  </span>
                </div>
                <div className="flex items-center gap-space-sm font-mono-code text-label-sm text-surface-variant">
                  <button
                    type="button"
                    onClick={() => setRun((r) => r + 1)}
                    className="inline-flex items-center gap-1 hover:text-primary-fixed transition-colors"
                  >
                    <I n="replay" c="text-[14px]" />
                    Replay
                  </button>
                  <span className="hidden sm:inline-flex items-center gap-1 text-primary-fixed">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-ping" />{" "}
                    Live Telemetry
                  </span>
                  <span className="hidden md:inline">
                    Kernel 6.8.0-31-generic
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                <div className="lg:col-span-8 font-mono-code text-mono-code flex flex-col gap-1.5 min-w-0 overflow-x-auto">
                  <div
                    className={`flex items-center gap-2 text-primary-fixed whitespace-nowrap ${show(0)}`}
                  >
                    <span className="text-surface-variant">$</span>
                    <span>
                      primo vps create --os ubuntu-24.04-lts --cores 4 --ram 8GB
                      --region frankfurt
                    </span>
                  </div>
                  <p
                    className={`text-surface-variant whitespace-nowrap ${show(1)}`}
                  >
                    [1/5] Initializing AMD EPYC Zen 4 vCPU topology pinning...
                    done (0.42s)
                  </p>
                  <p
                    className={`text-surface-variant whitespace-nowrap ${show(2)}`}
                  >
                    [2/5] Allocating 80GB NVMe storage slice on RAID-10 pool...
                    done (0.88s)
                  </p>
                  <p
                    className={`text-surface-variant whitespace-nowrap ${show(3)}`}
                  >
                    [3/5] Injecting ed25519 public SSH keys & cloud-init
                    manifest...
                  </p>
                  <div
                    className={`w-full bg-surface-variant/20 rounded-full h-2 my-1 overflow-hidden ${show(3)}`}
                  >
                    <div
                      className="bg-primary-container h-full rounded-full transition-all duration-[2000ms] ease-out"
                      style={{ width: step >= 4 ? "100%" : "0%" }}
                    />
                  </div>
                  <p
                    className={`text-primary-fixed whitespace-nowrap ${show(5)}`}
                  >
                    [4/5] Dedicated IPv4 provisioned: 185.192.84.210 | IPv6:
                    2a02:4780:dead:beef::1
                  </p>
                  <p
                    className={`text-on-secondary font-bold whitespace-nowrap ${show(6)}`}
                  >
                    [5/5] SUCCESS: Instance 'srv-fra-dev-01' ready in 48.2s.
                    Docker & WireGuard operational.
                  </p>
                  <p
                    className={`flex items-center gap-1 text-surface-variant ${show(7)}`}
                  >
                    $
                    <span className="inline-block w-2 h-4 bg-primary-container animate-pulse" />
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-space-sm bg-surface-variant/10 border border-white/10 p-space-md rounded-lg">
                  <div className="flex items-center justify-between text-body-sm font-mono-code">
                    <span className="text-surface-variant">
                      CPU Load (4 vCPUs)
                    </span>
                    <span className="text-primary-fixed font-bold">{cpu}%</span>
                  </div>
                  <Bar on={on} pct={cpu} />
                  <div className="flex items-center justify-between text-body-sm font-mono-code">
                    <span className="text-surface-variant">ECC RAM Active</span>
                    <span className="text-primary-fixed font-bold">
                      1.4 GB / 8 GB
                    </span>
                  </div>
                  <Bar on={on} pct={17.5} />
                  <div className="flex items-center justify-between text-body-sm font-mono-code">
                    <span className="text-surface-variant">
                      NVMe IOPS Baseline
                    </span>
                    <span className="text-primary-fixed font-bold">
                      {iops.toLocaleString()} IOPS
                    </span>
                  </div>
                  <Bar on={on} pct={28} />
                  <div className="pt-space-xs flex items-center justify-between font-mono-code text-label-sm text-surface-variant">
                    <span>
                      BPF Tracing:{" "}
                      <strong className="text-primary-fixed">Active</strong>
                    </span>
                    <span>
                      WireGuard:{" "}
                      <strong className="text-primary-fixed">Mesh On</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2 PILLARS */}
        <Sec>
          <Head
            pill="Engineered for Devs"
            title="Architectural Hardware Without Compromises"
            sub="We build our virtualization stack from the silicon layer up, discarding legacy container tricks for authentic KVM hardware virtualization."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {pillars.map(([n, t, d]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col gap-space-xs ${cardHover}`}
              >
                <IconBox n={n} size="w-12 h-12 rounded-lg" fs="text-[28px]" />
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {t}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </Sec>

        {/* 3 PRICING */}
        <Sec bg="bg-surface-container-low" id="pricing-matrix">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto gap-space-xs mb-space-xl">
            <Pill>Predictable Pricing</Pill>
            <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold mt-space-xs">
              Pure Resource Compute Tiers
            </h2>
            <div className="mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-primary-container to-secondary" />
            <p className="font-body-md text-body-md text-on-surface-variant">
              Clear monthly pricing with zero surprise egress bandwidth
              invoices. Upgrade or scale anytime.
            </p>
            <div className="mt-space-sm inline-flex items-center gap-3 bg-surface-container-lowest border border-outline-variant p-1.5 rounded-xl shadow-sm">
              <button
                type="button"
                onClick={() => setYearly(false)}
                className={`${tab} ${!yearly ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                className={`${tab} flex items-center gap-1.5 ${yearly ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                <span>Annual</span>
                <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-label-sm text-label-sm">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter items-stretch">
            {plans.map((p) => (
              <div
                key={p.n}
                className={`rounded-xl p-space-lg flex flex-col justify-between gap-space-md relative overflow-hidden ${p.feat ? "bg-gradient-to-b from-secondary-container/20 to-surface-container-lowest ring-2 ring-primary shadow-2xl shadow-primary-container/25 lg:-translate-y-2" : "bg-surface-container-lowest border border-outline-variant shadow-sm hover:shadow-xl hover:border-primary-container/40 transition-all duration-300"}`}
              >
                {p.feat && (
                  <div className="absolute top-0 right-0 bg-primary text-on-primary font-label-sm text-label-sm px-3 py-1 rounded-bl-lg font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div className="flex flex-col gap-space-sm">
                  <span
                    className={`font-headline-sm text-headline-sm font-bold ${p.feat ? "text-primary" : "text-on-surface"}`}
                  >
                    {p.n}
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {p.d}
                  </p>
                  <div className="flex items-baseline gap-1 my-space-xs">
                    <span className="font-display-lg text-display-lg font-bold text-on-surface">
                      {fmt(p.p[yearly ? 1 : 0])}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      / month
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface pt-space-xs">
                    {p.s.map((x) => (
                      <li key={x} className="flex items-center gap-2">
                        <I n="check_circle" c="text-primary text-[18px]" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={/^Contact/.test(p.cta ?? "") ? "/contact" : orderUrl(p.slug, yearly)}
                  className={`w-full inline-flex items-center justify-center font-label-md text-label-md py-2.5 rounded-lg transition-all ${p.feat ? "bg-gradient-to-r from-primary-container to-secondary text-on-primary shadow-md shadow-primary-container/30 hover:-translate-y-0.5" : "bg-surface-container hover:bg-primary-container hover:text-on-primary text-on-surface"}`}
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-space-lg text-on-surface-variant font-body-sm text-body-sm pt-space-lg">
            {priceTrust.map(([n, t]) => (
              <span key={t} className="flex items-center gap-1.5">
                <I n={n} c="text-primary text-[18px]" />
                {t}
              </span>
            ))}
          </div>
        </Sec>

        {/* 4 DISTROS */}
        <Sec id="distros-section">
          <Head
            pill="Operating System Matrix"
            title="Supported Linux Distros & Custom Kernels"
            sub="Select your preferred production-hardened Linux distribution with optimized cloud kernels, or bring your own proprietary image via custom ISO upload."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {distros.map(([n, t, v, b, d]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col gap-space-sm ${cardHover}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <IconBox
                      n={n}
                      size="w-10 h-10 rounded-lg"
                      fs="text-[24px]"
                      mb=""
                    />
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        {t}
                      </h3>
                      <span className="font-mono-code text-body-sm text-primary">
                        {v}
                      </span>
                    </div>
                  </div>
                  <span className="bg-surface-container text-on-surface-variant text-label-sm font-label-sm px-2 py-0.5 rounded whitespace-nowrap">
                    {b}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant pt-2">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </Sec>

        {/* 5 WHY */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="SysAdmin Features"
            title="Why Engineering Teams Choose PRIMO Linux VPS"
            sub="Built by Linux engineers for Linux engineers. Every aspect is fine-tuned for high uptime and rapid incident recovery."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {why.map(([n, t, d]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col gap-space-sm ${cardHover}`}
              >
                <IconBox
                  n={n}
                  size="w-10 h-10 rounded-lg"
                  fs="text-[24px]"
                  mb=""
                />
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {t}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </Sec>

        {/* 6 USE CASES */}
        <Sec>
          <Head
            pill="Workload Specialization"
            title="Tailored for Production Scale"
            sub="From high-concurrency microservices to low-latency financial bots, PRIMO Linux instances deliver rock-solid predictability."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {useCases.map(([n, t, d]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col gap-space-sm ${cardHover}`}
              >
                <div className="flex items-center gap-space-sm">
                  <I
                    n={n}
                    c="text-primary text-[24px] transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6"
                  />
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {t}
                  </h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </Sec>

        {/* 7 TOOLING */}
        <Sec bg="bg-surface-container-low">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <Pill c="w-fit">Infrastructure as Code</Pill>
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                Automate Everything with our REST API & Terraform
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Treat your Linux VPS instances as disposable, reproducible
                compute. Provision, snapshot, destroy, and reconfigure servers
                programmatically without touching a web UI.
              </p>
              <div className="flex flex-col gap-space-sm pt-space-xs">
                {tooling.map(([t, d]) => (
                  <div key={t} className="flex items-start gap-3">
                    <I n="check" c="text-primary text-[20px] mt-0.5" />
                    <div>
                      <strong className="font-headline-sm text-body-md text-on-surface">
                        {t}
                      </strong>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                <a
                  href="/api-docs"
                  className="inline-flex items-center justify-center font-label-md text-label-md bg-gradient-to-r from-primary-container to-secondary text-on-primary px-6 py-2.5 rounded-lg shadow-sm hover:-translate-y-0.5 transition-all"
                >
                  Read API Documentation
                </a>
                <a href="#" className={btnSec}>
                  View Terraform Registry
                </a>
              </div>
            </div>
            <div className="lg:col-span-6 min-w-0 bg-inverse-surface rounded-xl shadow-2xl shadow-primary/10 p-space-md text-inverse-on-surface flex flex-col gap-space-sm">
              <div className="flex items-center justify-between pb-space-xs">
                <span className="font-mono-code text-body-sm text-surface-variant">
                  main.tf — Terraform Manifest
                </span>
                <button
                  type="button"
                  onClick={copy}
                  className="flex items-center gap-1 font-mono-code text-label-sm text-surface-variant hover:text-primary-fixed transition-colors"
                >
                  <I n={copied ? "check" : "content_copy"} c="text-[16px]" />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <pre className="font-mono-code text-mono-code text-surface-container-lowest overflow-x-auto leading-relaxed p-space-xs">
                <code>
                  {tf.map((line, i) => (
                    <div key={i} className="whitespace-pre">
                      {line.map(([c, t], j) => (
                        <span key={j} className={tfCls[c]}>
                          {t}
                        </span>
                      ))}
                      {line.every(([, t]) => !t) && " "}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </Sec>

        {/* 8 BENCHMARK */}
        <Sec>
          <Head
            pill="Benchmark Validation"
            title="Architectural Benchmark Comparison"
            sub="See how dedicated PRIMO KVM hypervisors compare against generic budget cloud providers and legacy hosts."
          />
          <div className="w-full overflow-x-auto bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl">
            <table className="w-full min-w-[760px] text-left border-collapse font-body-sm text-body-sm">
              <thead>
                <tr className="text-on-surface font-headline-sm text-body-md">
                  <th className="p-space-md bg-surface-container-low">
                    Performance Vector
                  </th>
                  <th className="p-space-md bg-gradient-to-r from-primary-container to-secondary text-on-primary font-bold">
                    <span className="flex items-center gap-2">
                      <I n="star" c="text-[18px]" />
                      PRIMO CLOUD Linux VPS
                    </span>
                  </th>
                  <th className="p-space-md bg-surface-container-low text-on-surface-variant">
                    Generic Commodity Cloud
                  </th>
                  <th className="p-space-md bg-surface-container-low text-on-surface-variant">
                    Legacy Shared Hosting
                  </th>
                </tr>
              </thead>
              <tbody className="text-on-surface">
                {compare.map(([a, b, c, d], i) => (
                  <tr
                    key={a}
                    className={`${i % 2 ? "bg-surface-container-low/40" : "bg-surface-container-lowest"} hover:bg-secondary-container/10 transition-colors`}
                  >
                    <td className="p-space-md font-bold">{a}</td>
                    <td className="p-space-md text-primary font-bold">
                      <span className="flex items-center gap-2">
                        <I
                          n="check_circle"
                          c="text-[18px] text-primary-container shrink-0"
                        />
                        {b}
                      </span>
                    </td>
                    <td className="p-space-md text-on-surface-variant">{c}</td>
                    <td className="p-space-md text-on-surface-variant">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>

        {/* 9 DASHBOARD */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Intuitive Console"
            title="Engineered for Operational Speed"
            sub="Manage your Linux servers with enterprise clarity. Perform instant reboots, snapshot rollbacks, firewall updates, or launch out-of-band VNC consoles."
          />
          <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl p-space-lg flex flex-col gap-space-md">
            <div className="flex flex-wrap items-center justify-between gap-space-md pb-space-sm">
              <div className="flex items-center gap-space-md">
                <div className="w-12 h-12 rounded-xl bg-secondary-container/40 flex items-center justify-center text-primary">
                  <I n="dns" c="text-[28px]" />
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-space-xs">
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      srv-eu-fra01.primo.internal
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />{" "}
                      ONLINE
                    </span>
                  </div>
                  <span className="font-mono-code text-body-sm text-on-surface-variant">
                    Ubuntu 24.04 LTS • IP: 185.192.84.210 • Frankfurt, DE
                    (fra-1)
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  ["terminal", "Web SSH"],
                  ["restart_alt", "Reboot"],
                  ["camera_alt", "Snapshot"],
                  ["desktop_windows", "VNC Console", true],
                ].map(([n, t, p]) => (
                  <button
                    key={t}
                    className={`inline-flex items-center gap-1.5 font-label-md text-label-md px-3.5 py-2 rounded-lg transition-colors ${p ? "bg-primary hover:bg-secondary text-on-primary" : "bg-surface-container hover:bg-surface-container-high text-on-surface"}`}
                  >
                    <I n={n} c="text-[18px]" />
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter pt-space-xs">
              {[
                ["CPU Load (4 vCPUs)", `${dashCpu}%`, "@ 3.7GHz Base", dashCpu],
                ["RAM Allocation", "2.1 GB", "of 8.0 GB DDR5", 26.25],
                ["NVMe Disk Usage", "32.4 GB", "of 160 GB Gen4", 20.25],
                ["Bandwidth Egress", "1.8 TB", "of 10 TB Monthly", 18],
              ].map(([l, v, s, w]) => (
                <div
                  key={l}
                  className="bg-surface-container-low border border-outline-variant p-space-md rounded-lg flex flex-col gap-space-xs"
                >
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {l}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-headline-md text-headline-md font-bold text-on-surface">
                      {v}
                    </span>
                    <span className="font-label-sm text-label-sm text-primary">
                      {s}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-container to-secondary h-full rounded-full transition-[width] duration-1000 ease-out"
                      style={{ width: on ? `${w}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter pt-space-xs">
              <div className="lg:col-span-6 bg-surface-container-low border border-outline-variant p-space-md rounded-lg flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm text-body-md font-bold text-on-surface">
                    Authorized SSH Keys (2 Active)
                  </span>
                  <button className="font-label-sm text-label-sm text-primary hover:underline">
                    + Add Key
                  </button>
                </div>
                <div className="flex flex-col gap-2 font-mono-code text-body-sm">
                  {[
                    ["id_ed25519_devops_team", "SHA256:d8a2...3f1c"],
                    ["ci_cd_deploy_runner", "SHA256:4b91...7e2a"],
                  ].map(([k, h]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between gap-2 bg-surface-container-lowest p-2 rounded shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <I n="key" c="text-primary text-[18px]" />
                        <span>{k}</span>
                      </div>
                      <span className="text-label-sm text-on-surface-variant">
                        {h}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-6 bg-surface-container-low border border-outline-variant p-space-md rounded-lg flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm text-body-md font-bold text-on-surface">
                    Cloud Firewall Security Group (Active)
                  </span>
                  <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">
                    Default Ingress
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono-code text-body-sm text-center">
                  {[
                    ["PORT 22 / TCP", "SSH (Whitelisted)"],
                    ["PORT 80 / TCP", "HTTP (Global)"],
                    ["PORT 443 / TCP", "HTTPS (Global)"],
                  ].map(([a, b]) => (
                    <div
                      key={a}
                      className="bg-surface-container-lowest p-2 rounded shadow-sm"
                    >
                      <span className="text-primary font-bold">{a}</span>
                      <p className="text-label-sm text-on-surface-variant">
                        {b}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Sec>

        {/* 10 TESTIMONIALS */}
        <Sec>
          <Head
            pill="Trusted by Engineers"
            title="What Systems Architects Say"
            sub="Developers and DevOps leaders trust PRIMO Linux VPS instances to power their production environments."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {reviews.map(([i, n, r, t]) => (
              <div
                key={n}
                className="bg-surface-container-lowest border border-outline-variant p-space-lg rounded-xl shadow-sm relative flex flex-col justify-between gap-space-md hover:shadow-xl hover:-translate-y-1 hover:border-primary-container/40 transition-all duration-300"
              >
                <div className="flex flex-col gap-space-sm">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, k) => (
                      <I key={k} n="star" c="text-[18px]" />
                    ))}
                  </div>
                  <I
                    n="format_quote"
                    c="absolute top-4 right-5 text-[56px] text-primary-container/15"
                  />
                  <p className="relative font-body-md text-body-md text-on-surface-variant">
                    {t}
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-space-xs">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center font-bold text-on-primary font-headline-sm">
                    {i}
                  </div>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1 font-headline-sm text-body-md font-bold text-on-surface">
                      {n}
                      <I n="verified" c="text-[16px] text-primary-container" />
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {r}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 11 FAQ */}
        <Sec bg="bg-surface-container-low">
          <Head
            pill="Technical FAQ"
            title="Frequently Asked Questions"
            sub="Everything you need to know about our Linux VPS architecture, deployment options, and root privileges."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-start">
            {[faqs.slice(0, 5), faqs.slice(5)].map((col, c) => (
              <div key={c} className="flex flex-col gap-space-md">
                {col.map(([q, a], j) => {
                  const i = c * 5 + j;
                  const open = faqOpen.includes(i);
                  return (
                    <div
                      key={q}
                      className={`bg-surface-container-lowest rounded-xl border overflow-hidden shadow-sm transition-all duration-300 ${open ? "border-primary-container shadow-md shadow-primary-container/10" : "border-outline-variant"}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(i)}
                        className="w-full p-space-md flex items-center justify-between gap-3 text-left"
                      >
                        <span className="font-headline-sm text-body-md font-bold text-on-surface">
                          {i + 1}. {q}
                        </span>
                        <I
                          n="expand_more"
                          c={`text-primary shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-space-md pb-space-md font-body-sm text-body-sm text-on-surface-variant">
                            {a}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Sec>

        {/* 12 CTA */}
        <section className="w-full bg-surface py-space-xl">
          <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
            <div className="bg-gradient-to-r from-primary via-secondary to-primary-container bg-[length:200%_auto] animate-[shimmer_8s_linear_infinite] text-on-primary rounded-xl p-space-xl shadow-2xl shadow-primary/20 flex flex-col items-center text-center gap-space-lg relative overflow-hidden">
              <span className="pointer-events-none absolute -left-10 top-6 h-40 w-40 rounded-full bg-white/10 animate-float" />
              <span className="pointer-events-none absolute -right-8 bottom-4 h-52 w-52 rounded-full bg-white/10 animate-float [animation-delay:1.5s]" />
              <div className="relative flex flex-col gap-space-xs max-w-3xl">
                <h2 className="font-headline-xl text-headline-xl font-bold tracking-tight">
                  Ready to Deploy Your High-Performance Linux VPS?
                </h2>
                <p className="font-body-lg text-body-lg text-inverse-on-surface opacity-95">
                  Launch your development or production environment in under 55
                  seconds with pure root freedom, modern AMD EPYC compute, and
                  an unyielding 99.99% uptime guarantee.
                </p>
              </div>
              <div className="relative flex flex-wrap items-center justify-center gap-space-md">
                <a
                  href="#pricing-matrix"
                  className="inline-flex items-center justify-center font-label-lg text-label-lg bg-surface-container-lowest text-primary hover:bg-surface-container px-8 py-3.5 rounded-xl shadow-md font-bold transition-all hover:-translate-y-0.5"
                >
                  Deploy Linux VPS Now
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center font-label-lg text-label-lg bg-on-primary/10 hover:bg-on-primary/20 border border-white/30 text-on-primary px-8 py-3.5 rounded-xl backdrop-blur-sm transition-all"
                >
                  Speak to Linux Solutions Specialist
                </a>
              </div>
              <div className="relative flex flex-wrap items-center justify-center gap-space-lg font-body-sm text-body-sm text-inverse-on-surface opacity-90 pt-space-xs">
                {[
                  ["verified", "30-Day Money-Back Guarantee"],
                  ["bolt", "Instant Automated Setup"],
                  ["support_agent", "24/7 Expert SysAdmin Support"],
                ].map(([n, t]) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <I n={n} c="text-[18px]" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Linux;
