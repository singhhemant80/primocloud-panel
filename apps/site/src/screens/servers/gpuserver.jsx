import { orderUrl } from "../../lib/panel";
import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/layout";
import { useMotion } from "../../components/motion";
import { useCurrency } from "../../context/CurrencyContext";
import { I, Pill, Sec, Head, cardHover, IconBox } from "../../components/ui";

// ---------- content (taken from the HTML design) ----------
const heroStats = [
  ["100% Pinned", "Zero Hypervisor Steal"],
  ["3.2 Tbps", "Quantum-2 InfiniBand"],
  ["80–640GB", "HBM3 Ultra-VRAM", 1],
  ["<5-Min Setup", "Slurm & PyTorch 2.4"],
];
const heroBadges = [
  ["verified", "Root / IPMI Direct KVM"],
  ["cloud_sync", "Pre-baked CUDA 12.4"],
  ["currency_exchange", "Zero Egress Invoicing"],
];
const gpuBase = [
  [98, 48, 382, 96],
  [97, 49, 395, 96],
  [99, 47, 378, 96],
  [98, 51, 410, 96],
];
const pillars = [
  [
    "developer_board",
    "True Bare-Metal Zero Virtualization",
    "No hypervisor layer, no vGPU slicing, and zero kernel abstraction. You own 100% of tensor cores, CUDA cores, and ultra-wide memory buses directly with native bare-metal OS root permissions.",
    "Zero CPU Steal / Direct KVM",
  ],
  [
    "hub",
    "900 GB/s SXM5 NVLink & NVSwitch",
    "Full-mesh bi-directional GPU-to-GPU interconnect over SXM5 baseboards. Eliminate host PCIe 5.0 bottlenecks completely during all-reduce steps in multi-GPU distributed model parallelisms.",
    "7x Faster than PCIe Gen5",
  ],
  [
    "speed",
    "Quantum-2 400G NDR InfiniBand",
    "Sub-microsecond RDMA fabrics and RoCE v2 networking. Scale horizontally from 8 to 1,024 GPUs with non-blocking line-rate throughput and zero host CPU memory copies.",
    "3.2 Tbps Aggregated Fabric",
  ],
  [
    "layers",
    "Turnkey AI Stacks & MLOps Ready",
    "Pre-baked OS images with CUDA 12.4, PyTorch 2.4, vLLM, TensorRT-LLM, DeepSpeed, Hugging Face, and Slurm workload cluster scheduler provisioned in under 300 seconds.",
    "Instant 1-Click Launchers",
  ],
];
const plans = [
  {
    eyebrow: "Model Fine-Tuning & VFX",
    n: "Pro-Workstation", slug: "gpu-rtx-4090",
    sub: "1x NVIDIA RTX 4090 24GB",
    p: [189, 0.35],
    note: "Deploy within 5 minutes",
    cta: "Deploy RTX 4090",
    best: "Fine-tuning 7B models, Stable Diffusion XL, Unreal 5 renders.",
    s: [
      "**24GB GDDR6X** Liquid-Cooled",
      "16 AMD EPYC 9004 Cores (3.7GHz)",
      "64 GB DDR5 ECC Memory",
      "1.0 TB PCIe Gen5 NVMe SSD",
      "10 TB Bandwidth @ 2.5 Gbps Port",
      "IPMI / KVM Root Control",
    ],
  },
  {
    eyebrow: "High-Concurrency Serving",
    n: "Inference Engine", slug: "gpu-rtx-6000-ada",
    sub: "2x RTX 6000 Ada 48GB (96GB VRAM)",
    p: [649, 1.15],
    note: "Zero Setup Fee Guarantee",
    cta: "Deploy RTX 6000",
    best: "vLLM production inference, 70B Quantized models, Computer Vision.",
    s: [
      "**96GB GDDR6 ECC** Total VRAM",
      "32 AMD EPYC 9004 Cores",
      "128 GB DDR5 ECC Memory",
      "2x 1.92 TB Gen5 NVMe RAID-1",
      "25 TB Bandwidth @ 10 Gbps Port",
      "Dual GPU P2P PCIe Gen5",
    ],
  },
  {
    eyebrow: "Deep Learning Foundation",
    n: "Enterprise Titan", slug: "gpu-a100-titan",
    feat: true,
    sub: "4x NVIDIA A100 80GB SXM4 (320GB HBM2e)",
    p: [1899, 3.25],
    note: "Unmetered Bandwidth Included",
    cta: "Deploy 4x A100 Titan",
    best: "Llama-3 70B full fine-tuning, continuous pre-training, multi-modal LLM.",
    s: [
      "**320GB HBM2e (2 TB/s/GPU)**",
      "**600 GB/s NVLink Mesh Fabric**",
      "64 AMD EPYC 9654 Cores",
      "256 GB DDR5 ECC Memory",
      "2x 3.84 TB PCIe Gen5 NVMe RAID-1",
      "400G HDR InfiniBand + 10G Uplink",
    ],
  },
  {
    eyebrow: "Frontier AI & MoE",
    n: "Supercluster Node", slug: "gpu-h100-node",
    sub: "8x NVIDIA H100 80GB SXM5 (640GB HBM3)",
    p: [4299, 7.45],
    note: "15-Min Dedicated MLOps SLA",
    cta: "Deploy 8x H100 Node",
    best: "Foundation model pre-training, Mixture-of-Experts (MoE), Bio-AlphaFold 3.",
    s: [
      "**640GB HBM3 (3.35 TB/s/GPU)**",
      "**900 GB/s NVSwitch Fabric**",
      "Dual AMD EPYC 9654 (192 Cores)",
      "1.5 TB DDR5 ECC 4800MHz",
      "4x 7.68 TB Gen5 NVMe RAID-10",
      "3.2 Tbps Quantum-2 NDR (8x 400G)",
    ],
  },
];
const planTrust = [
  ["verified_user", "30-Day Zero Hassle Guarantee"],
  ["cloud_sync", "Zero Data Ingress / Egress Penalties"],
  ["key", "Instant Automated IPMI & SSH Key Provisioning"],
  ["dns", "Custom Multi-Cluster Private Subnets"],
];
const arch = [
  [
    "memory",
    "4th Gen Tensor Cores & FP8 Engine",
    "Transformer Engine Acceleration",
    "The NVIDIA H100 introduces the Transformer Engine with custom FP8 precision formats. Delivers up to 4x higher mathematical throughput in matrix multiplication over previous generation A100 servers without degrading convergence accuracy or token quality.",
    "FP8 Tensor Core Performance:",
    "Up to 3,958 TFLOPS",
  ],
  [
    "device_thermostat",
    "SXM5 Form Factor vs Standard PCIe",
    "Sustained 700W Power Delivery",
    "While PCIe GPU cards are throttled to 350W-450W power draws and PCIe Gen5 limits, our SXM5 baseboards operate at continuous 700W thermal capacities. All 8 GPUs communicate via NVLink NVSwitches without going through CPU PCIe lanes.",
    "NVLink Interconnect Bandwidth:",
    "900 GB/s per GPU Full Duplex",
  ],
  [
    "router",
    "Quantum-2 NDR 400G InfiniBand Fabric",
    "Direct GPUDirect RDMA & Storage",
    "Every 8-GPU node features eight Mellanox ConnectX-7 400Gbps NDR adapters. GPUDirect RDMA enables GPUs across different physical server racks to exchange tensors directly without kernel interruptions or system memory buffers.",
    "Cluster Cross-Sectional Fabric:",
    "3.2 Tbps Line-Rate Non-Blocking",
  ],
  [
    "water_drop",
    "Redundant Titanium Power & Liquid Cooling",
    "Sub-50°C Operating Temperatures",
    "Housed in Tier-IV enterprise facilities with closed-loop direct-to-chip liquid cooling manifolds and 2N+1 3300W Platinum Titanium redundant power supplies. Prevents thermal throttling during 24/7 training runs.",
    "PUE Rating & Redundancy:",
    "1.12 PUE | 2N+1 Redundant",
  ],
];
const workloads = [
  [
    "forum",
    "LLMs & MoE",
    "LLM Pre-Training & Alignment",
    "Execute large parameter model runs (Llama 3 70B/405B, Mistral Large, Gemma) with Megatron-LM and DeepSpeed ZeRO-3. Sustained 900 GB/s NVLink enables linear scaling across multi-node clusters.",
    "Benchmark: 3,450 tokens/sec (H100 SXM5)",
  ],
  [
    "flash_on",
    "Low-Latency API",
    "High-Throughput vLLM Serving",
    "Serve production inferences with PagedAttention, TensorRT-LLM, and Triton Inference Server. Achieve sub-15ms time-to-first-token (TTFT) and massive continuous batching concurrency.",
    "Benchmark: <14ms TTFT on Llama-3-8B",
  ],
  [
    "movie",
    "Diffusion & Video",
    "Diffusion & Generative Video",
    "Accelerate high-resolution image and video transformers (Flux.1, Stable Diffusion 3, Sora-class diffusion backbones). High HBM3 bandwidth prevents memory-bound processing bottlenecks.",
    "Benchmark: 0.42s per 1024x1024 Image",
  ],
  [
    "visibility",
    "Robotics & CV",
    "Autonomous Systems & Vision",
    "Train real-time YOLOv10 object detection, LiDAR SLAM point clouds, and self-driving vision transformers with multi-camera inputs feeding zero-copy unified memory buffers.",
    "Benchmark: 840 FPS 4K Multi-Stream",
  ],
  [
    "biotech",
    "Biotech & HPC",
    "Molecular Dynamics & AlphaFold",
    "Execute AlphaFold 3 protein folding simulations, OpenMM dynamics, and quantum chemistry computations. Benefit from 64-bit double-precision (FP64) Tensor Core speeds.",
    "Benchmark: 420 ns/day on 100k Atoms",
  ],
  [
    "view_in_ar",
    "3D & Spatial AI",
    "3D NeRF & Gaussian Splatting",
    "Convert drone scans and multi-angle camera feeds into photorealistic 3D Gaussian Splats in minutes. Uncompressed PCIe Gen5 bandwidth supports gigabyte-scale point cloud updates.",
    "Benchmark: 8.5 Min 1500-Photo Splat",
  ],
];
const tools = [
  "PyTorch 2.4.0",
  "CUDA 12.4 / cuDNN 9",
  "vLLM v0.6+",
  "NVIDIA TensorRT-LLM",
  "Hugging Face Transformers",
  "DeepSpeed ZeRO 1/2/3",
  "JAX & Flax",
  "Triton Inference Server",
  "Megatron-LM",
  "Slurm Workload Manager",
  "Ollama & LocalAI",
  "Docker / NVIDIA Container Toolkit",
];
const compare = [
  [
    "Virtualization / Steal Loss",
    "0% Bare-Metal (Raw Hardware Access)",
    "5–12% Hypervisor Overhead Loss",
    "Shared host node contention",
  ],
  [
    "Cluster Interconnect Fabric",
    "3.2 Tbps Quantum-2 NDR InfiniBand",
    "3.2 Tbps Proprietary Fabric (EFA)",
    "PCIe Gen4 / Non-InfiniBand Ethernet",
  ],
  [
    "Data Egress Penalties",
    "$0.00 / 100% Unmetered",
    "$0.09 / GB ($90 per TB egress!)",
    "Variable / Throttled Port Limits",
    1,
  ],
  [
    "Physical Hardware Quality",
    "Dedicated Factory-Fresh SXM5 Nodes",
    "Locked multi-tenant VM partitions",
    "Consumer cards / Refurbished nodes",
  ],
  [
    "Support & MLOps Escalation",
    "15-Min VIP Dedicated Systems Engineer",
    "Tiered Enterprise Support ($15k/mo)",
    "Community Discord / Slow Tickets",
  ],
  [
    "Total Cost of Ownership (TCO)",
    "Up to 60% Lower Predictable TCO",
    "Extreme on-demand premiums + Egress",
    "Spot preemptions & random downtime",
  ],
];
const actions = [
  ["terminal", "SSH Terminal"],
  ["open_in_new", "JupyterLab"],
  ["desktop_windows", "VNC KVM"],
  ["cloud_upload", "Attach S3 Bucket"],
];
const reviews = [
  [
    "AK",
    "Alexandre Kowalski",
    "CTO & Co-Founder, Synthetix AI",
    '"We were paying over $24,000/month in AWS data egress fees alone during checkpoint syncs. Moving our 70B fine-tuning pipeline to an 8x H100 cluster on PRIMO CLOUD halved our infrastructure bill while the sustained 900 GB/s NVLink increased training velocity by 28%."',
  ],
  [
    "EM",
    "Dr. Elena Moreau",
    "Head of Computational Biology, HelixGen Bio",
    '"For structural bioinformatics and AlphaFold 3 runs, bare-metal access without CPU hypervisor scheduling interference is non-negotiable. PRIMO CLOUD delivered clean Debian boxes with full root IPMI in 4 minutes flat. Flawless reliability."',
  ],
  [
    "MR",
    "Marcus R. Vance",
    "Lead MLOps Architect, VectorMotion Labs",
    '"Running real-time LiDAR point cloud synthesis with multiple RTX 6000 Ada nodes. The dedicated 10G unmetered networking paired with responsive 24/7 sysadmin escalation makes PRIMO CLOUD our go-to GPU foundation."',
  ],
];
const faqs = [
  [
    "What is the difference between SXM5 and PCIe GPUs?",
    "NVIDIA H100 SXM5 GPUs are integrated on a custom NVIDIA baseboard providing a direct NVLink interconnect delivering 900 GB/s bidirectional GPU-to-GPU bandwidth. PCIe variants run at 350W-450W with NVLink bridged or disabled, limiting multi-GPU training throughput.",
  ],
  [
    "Are data transfers and bandwidth truly unmetered?",
    "Yes. Unlike major hyperscalers who bill between $0.05 and $0.09 per gigabyte of outbound egress data, PRIMO CLOUD bare-metal servers include unmetered or massive multi-terabyte unthrottled bandwidth pools with $0.00 egress invoices.",
  ],
  [
    "Can I bring my own custom Docker & Kubernetes containers?",
    "Absolutely. You receive full bare-metal root credentials and out-of-band IPMI KVM access. You can deploy plain Docker, NVIDIA Container Toolkit, Podman, microk8s, or integrate into your existing multi-node Kubernetes clusters.",
  ],
  [
    "What Linux operating systems can be provisioned?",
    "We offer standard 1-click deployments of Ubuntu 22.04 LTS, Ubuntu 24.04 LTS, Rocky Linux 9, AlmaLinux, and Red Hat Enterprise Linux (RHEL). Custom ISO mounts via IPMI virtual media are also fully supported.",
  ],
  [
    "How fast is the automated server setup time?",
    "In-stock dedicated servers (such as RTX 4090 and 2x RTX 6000 Ada nodes) are provisioned through our automated PXE pipeline within 300 seconds (<5 minutes). High-capacity 8x H100 clusters deploy in under 15 minutes.",
  ],
  [
    "Do you provide dedicated InfiniBand fabrics between servers?",
    "Yes. Our 4x A100 and 8x H100 servers can be interconnected using non-blocking Quantum-2 400G NDR InfiniBand fabrics with GPUDirect RDMA enabled, allowing you to train foundation models across tens or hundreds of GPUs seamlessly.",
  ],
  [
    "What is the minimum billing commitment?",
    "We offer both hourly on-demand instances with zero lock-in and monthly contracts that provide an upfront 20% discount. For long-term 6, 12, or 24-month commitments, custom enterprise pricing is available upon request.",
  ],
  [
    "Where are your GPU datacenters physically located?",
    "Our Tier-IV primary GPU compute nodes are stationed in Frankfurt (FRA-01), Amsterdam (AMS-02), London (LON-01), and Secaucus/New York (NYC-01), all connected via our private multi-terabit dark fiber backbone.",
  ],
  [
    "Can we deploy Slurm workload orchestration?",
    "Yes. We have pre-configured Slurm cluster templates that automatically bind multi-node GPU compute jobs with PyTorch DDP, FairScale, and PyTorch FSDP without manual environment setup.",
  ],
  [
    "What enterprise security and compliance standards are met?",
    "All PRIMO CLOUD datacenter facilities hold ISO 27001, SOC 2 Type II, and HIPAA compliance accreditations. Because our nodes are 100% physically dedicated bare metal, no data residue ever touches other tenants.",
  ],
];

const rich = (s) =>
  s.split("**").map((t, i) => (i % 2 ? <strong key={i}>{t}</strong> : t));
const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const useTick = (base, spread, dec = 0, ms = 2000) => {
  const [v, setV] = useState(base);
  useEffect(() => {
    if (reduced()) return;
    const t = setInterval(
      () => setV(+(base + (Math.random() - 0.5) * spread * 2).toFixed(dec)),
      ms,
    );
    return () => clearInterval(t);
  }, [base, spread, dec, ms]);
  return v;
};

const GpuServer = () => {
  const rootRef = useRef(null);
  useMotion(rootRef);
  const { fmt } = useCurrency();
  const money = (n) => fmt(n).replace(/\.00$/, "");
  const [hourly, setHourly] = useState(false);
  const [open, setOpen] = useState([]);
  const [gpus, setGpus] = useState(gpuBase);
  const [cycling, setCycling] = useState(false);
  const [msg, setMsg] = useState("");
  const tm = useRef(null);
  const pcie = useTick(28.4, 3, 1);
  const flow = useTick(2.4, 0.15, 1);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (reduced()) return;
    const t = setInterval(
      () =>
        setGpus(
          gpuBase.map(([c, tp, w, m]) => [
            clamp(Math.round(c + (Math.random() - 0.5) * 3), 94, 100),
            +(tp + (Math.random() - 0.5) * 3).toFixed(0),
            Math.round(w + (Math.random() - 0.5) * 30),
            m,
          ]),
        ),
      1300,
    );
    return () => clearInterval(t);
  }, []);

  const toast = (m) => {
    setMsg(m);
    clearTimeout(tm.current);
    tm.current = setTimeout(() => setMsg(""), 3000);
  };
  const powerCycle = () => {
    if (cycling) return;
    setCycling(true);
    toast("IPMI power cycle issued — GPUs draining, node rebooting…");
    setTimeout(() => {
      setCycling(false);
      toast("Node back online. 8/8 GPUs nominal, NVLink mesh healthy.");
    }, 3200);
  };
  const toggleFaq = (i) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  const seg =
    "px-space-md py-1.5 rounded-md font-label-md text-label-md font-semibold transition-all";
  const shown = cycling ? gpus.map(() => [0, 31, 70, 0]) : gpus;
  const avg = Math.round(shown.reduce((a, g) => a + g[0], 0) / shown.length);
  const draw = Math.round(shown.reduce((a, g) => a + g[2], 0) * 1.82 + 1250);

  return (
    <Layout>
      <div ref={rootRef} className="flex flex-col w-full">
        {/* 1 HERO */}
        <section className="relative w-full overflow-hidden bg-surface pt-space-lg pb-space-xl">
          <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(11,175,96,0.18)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_70%)]" />
          <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin flex flex-col gap-space-lg">
            <div className="flex flex-wrap items-center justify-between gap-space-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-primary-container/20 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-ping shrink-0" />
                <span className="font-mono-code text-[11px] text-primary font-semibold tracking-wider uppercase">
                  ★ Enterprise AI & Deep Learning • NVIDIA H100, A100 & RTX 4090
                  • 3.2 Tbps InfiniBand • Zero Virtualization
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-space-sm text-on-surface-variant font-mono-code text-label-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  RDMA Fabric Active
                </span>
                <span className="text-outline-variant">|</span>
                <span>Region: FRA-01 (Datacenter Frankfurt)</span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
              <div className="lg:col-span-7 flex flex-col gap-space-md">
                <div className="inline-flex items-center gap-2 text-primary font-label-md uppercase tracking-wider">
                  <I n="neurology" c="text-[18px]" />
                  <span>Dedicated Bare-Metal Compute Cluster</span>
                </div>
                <h1 className="font-display-lg text-display-lg font-bold text-on-surface tracking-tight leading-[1.08]">
                  Bare-Metal GPU Servers: Uncompromised Compute for{" "}
                  <span className="bg-gradient-to-r from-primary-container via-secondary to-primary-container bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_4s_linear_infinite]">
                    Generative AI, LLMs & VFX
                  </span>
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                  Deploy dedicated bare-metal GPU clusters powered by NVIDIA
                  SXM5 H100, A100 Tensor Core, and liquid-cooled RTX 4090 Ada
                  Lovelace. 100% dedicated PCIe & NVLink bandwidth with direct
                  root access, zero hypervisor overhead, and sub-millisecond
                  RDMA interconnects.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-gutter-sm pt-space-xs">
                  {heroStats.map(([v, l, g]) => (
                    <div
                      key={v}
                      className="p-space-sm rounded-lg bg-surface-container border border-outline-variant/40 transition-all hover:-translate-y-1 hover:shadow-md"
                    >
                      <span
                        className={`font-headline-sm text-headline-sm font-bold block ${g ? "text-primary" : "text-on-surface"}`}
                      >
                        {v}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {l}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                  <a
                    href="#gpu-pricing"
                    className="group relative overflow-hidden inline-flex items-center justify-center px-space-lg py-3 rounded-lg bg-gradient-to-r from-primary-container to-secondary text-on-primary font-label-lg text-label-lg font-semibold transition-all duration-200 shadow-[0_4px_16px_rgba(11,175,96,0.3)] hover:-translate-y-0.5 before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/30 hover:before:left-[150%] before:transition-all before:duration-700"
                  >
                    Deploy GPU Server Now
                    <I n="arrow_forward" c="ml-1.5 text-[20px]" />
                  </a>
                  <a
                    href="#gpu-specs"
                    className="inline-flex items-center justify-center px-space-lg py-3 rounded-lg bg-surface-container-lowest text-on-surface font-label-lg text-label-lg font-semibold border border-outline-variant hover:bg-secondary-container/20 hover:border-primary-container/50 transition-all"
                  >
                    <I n="terminal" c="mr-2 text-[20px]" />
                    Explore Cluster Architecture & Specs
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-space-xs text-on-surface-variant font-label-sm text-label-sm">
                  {heroBadges.map(([n, t]) => (
                    <span key={t} className="inline-flex items-center gap-1.5">
                      <I n={n} c="text-primary text-[18px]" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="w-full rounded-xl bg-inverse-surface text-inverse-on-surface shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-outline/20 animate-float">
                  <div className="px-space-md py-2.5 bg-on-surface flex items-center justify-between gap-2 border-b border-white/10">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-3 h-3 rounded-full bg-error shrink-0" />
                      <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                      <span className="w-3 h-3 rounded-full bg-primary-container shrink-0" />
                      <span className="ml-2 font-mono-code text-[11px] text-surface-variant font-semibold truncate">
                        root@gpu-cluster-fra01:~# nvidia-smi -l 1
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/20 text-secondary-fixed font-mono-code text-[10px] whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />{" "}
                      LIVE RDMA
                    </span>
                  </div>
                  <div className="p-space-md font-mono-code text-[11px] leading-relaxed flex flex-col gap-space-xs text-surface-container-high overflow-x-auto">
                    <div className="text-surface-variant whitespace-nowrap">
                      NVIDIA-SMI 550.54.14 | Driver Version: 550.54.14 | CUDA
                      Version: 12.4
                    </div>
                    <div className="text-surface-variant pb-1 border-b border-white/10 whitespace-nowrap">
                      Active Topology: 8x SXM5 NVLink Full-Mesh (900 GB/s
                      Bi-directional)
                    </div>
                    {shown.map(([c, tp, w, m], i) => (
                      <div key={i} className="pt-1.5 flex flex-col gap-0.5">
                        <div className="flex justify-between items-center gap-2 text-white font-semibold whitespace-nowrap">
                          <span className="text-secondary-fixed">
                            GPU {i}: NVIDIA H100 80GB HBM3
                          </span>
                          <span className="text-primary-container font-bold">
                            P{cycling ? 8 : 0} | {c}% Compute
                          </span>
                        </div>
                        <div className="flex justify-between gap-2 text-surface-dim whitespace-nowrap">
                          <span>
                            Temp: {tp}°C / 700W ({w}W)
                          </span>
                          <span>
                            {cycling ? "0" : "78,412"}MiB / 81,920MiB [{m}%]
                          </span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-0.5">
                          <div
                            className="bg-primary-container h-full transition-[width] duration-700"
                            style={{ width: `${m}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-surface-variant flex flex-col gap-0.5">
                      <div className="flex justify-between gap-2 whitespace-nowrap">
                        <span>
                          Host: Dual AMD EPYC 9654 (192 Cores / 384 Threads)
                        </span>
                        <span className="text-white">1.5 TB DDR5 ECC</span>
                      </div>
                      <div className="flex justify-between gap-2 whitespace-nowrap">
                        <span>
                          Interconnect: 8x 400G NDR InfiniBand (Quantum-2)
                        </span>
                        <span className="text-secondary-fixed font-semibold">
                          PCIe 5.0 Direct P2P OK
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2 PILLARS */}
        <Sec bg="bg-surface-container-low">
          <div className="flex flex-col gap-2 max-w-2xl mb-space-lg">
            <Pill c="w-fit">Engineered for Precision & Throughput</Pill>
            <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface mt-space-sm">
              Pillars of PRIMO CLOUD Bare-Metal GPU Hardware
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Built to satisfy hyper-demanding distributed transformer model
              training and millisecond inference pipelines.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {pillars.map(([n, t, d, f]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col gap-space-sm ${cardHover}`}
              >
                <IconBox
                  n={n}
                  size="w-12 h-12 rounded-lg"
                  fs="text-[28px]"
                  mb=""
                />
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {t}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {d}
                </p>
                <div className="mt-auto pt-space-xs font-mono-code text-[11px] text-primary font-semibold flex items-center gap-1">
                  <I n="check" c="text-[14px]" />
                  {f}
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 3 PRICING */}
        <Sec id="gpu-pricing">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
            <div className="flex flex-col gap-2 max-w-2xl">
              <Pill c="w-fit">
                Predictable Pricing • Zero Hidden Surcharges
              </Pill>
              <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface mt-space-sm">
                Bare-Metal GPU Server Configurations
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Full root access, unthrottled hardware, unmetered bandwidth
                options, and no outbound data egress invoices.
              </p>
            </div>
            <div className="flex items-center self-start md:self-auto bg-surface-container p-1 rounded-lg border border-outline-variant/40">
              <button
                type="button"
                onClick={() => setHourly(false)}
                className={`${seg} ${!hourly ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Monthly Billing{" "}
                <span className="text-primary text-[10px] font-bold ml-1">
                  SAVE 20%
                </span>
              </button>
              <button
                type="button"
                onClick={() => setHourly(true)}
                className={`${seg} ${hourly ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                Hourly / On-Demand
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {plans.map((p) => (
              <div
                key={p.n}
                className={`relative p-space-lg rounded-xl flex flex-col justify-between ${p.feat ? "bg-gradient-to-b from-secondary-container/20 to-surface-container-lowest border-2 border-primary-container shadow-2xl shadow-primary-container/25 lg:-translate-y-2" : "bg-surface-container-lowest border border-outline-variant/60 shadow-sm hover:shadow-xl hover:border-primary-container/40 transition-all duration-300"}`}
              >
                {p.feat && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary-container text-on-primary font-mono-code text-[10px] font-bold uppercase tracking-wider shadow-sm whitespace-nowrap">
                    ★ Enterprise Recommended
                  </div>
                )}
                <div className="flex flex-col gap-space-md">
                  <div>
                    <span
                      className={`font-label-sm text-label-sm font-bold uppercase tracking-wider ${p.feat ? "text-primary" : "text-on-surface-variant"}`}
                    >
                      {p.eyebrow}
                    </span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface mt-1">
                      {p.n}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      {p.sub}
                    </p>
                  </div>
                  <div className="py-space-xs border-y border-outline-variant/40">
                    <div className="flex items-baseline gap-1">
                      <span className="font-headline-xl text-headline-xl font-bold text-on-surface">
                        {money(p.p[hourly ? 1 : 0])}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {hourly ? "/hour" : "/month"}
                      </span>
                    </div>
                    <span className="font-mono-code text-[11px] text-primary">
                      {p.note}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
                    {p.s.map((x) => (
                      <li key={x} className="flex items-center gap-2">
                        <I
                          n="check_circle"
                          c="text-primary text-[16px] shrink-0"
                        />
                        <span>{rich(x)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="p-2 rounded bg-surface-container font-body-sm text-[11px] text-on-surface-variant">
                    <strong>Best for:</strong> {p.best}
                  </div>
                </div>
                <div className="pt-space-md">
                  <a
                    href={/^Contact/.test(p.cta ?? "") ? "/contact" : orderUrl(p.slug, false)}
                    className={`w-full py-2.5 rounded-lg font-label-md text-label-md font-semibold transition-all inline-flex items-center justify-center gap-1.5 ${p.feat ? "bg-gradient-to-r from-primary-container to-secondary text-on-primary shadow-[0_4px_14px_rgba(11,175,96,0.3)] hover:-translate-y-0.5" : "bg-surface-container text-on-surface hover:bg-primary-container hover:text-on-primary"}`}
                  >
                    {p.cta}
                    <I n="arrow_forward" c="text-[16px]" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-space-lg p-space-md rounded-lg bg-surface-container border border-outline-variant/40 flex flex-wrap items-center justify-around gap-space-md text-center">
            {planTrust.map(([n, t]) => (
              <div
                key={t}
                className="flex items-center gap-2 font-label-md text-label-md text-on-surface"
              >
                <I n={n} c="text-primary text-[20px]" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </Sec>

        {/* 4 ARCHITECTURE */}
        <Sec bg="bg-surface-container-low" id="gpu-specs">
          <div className="flex flex-col gap-2 max-w-2xl mb-space-lg">
            <Pill c="w-fit">Hardware Under The Hood</Pill>
            <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface mt-space-sm">
              Accelerated System Architecture & Thermal Engineering
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              We reject hypervisor abstraction layers to extract maximum
              physical performance from Silicon.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-lg">
            {arch.map(([n, t, s, d, k, v]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col gap-space-sm ${cardHover}`}
              >
                <div className="flex items-center gap-space-sm">
                  <IconBox
                    n={n}
                    size="w-10 h-10 rounded-lg"
                    fs="text-[24px]"
                    mb=""
                  />
                  <div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      {t}
                    </h3>
                    <span className="font-mono-code text-[11px] text-primary">
                      {s}
                    </span>
                  </div>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {d}
                </p>
                <div className="mt-2 p-space-sm rounded bg-surface-container font-mono-code text-label-sm text-on-surface flex flex-wrap justify-between gap-1">
                  <span>{k}</span>
                  <span className="text-primary font-bold">{v}</span>
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 5 WORKLOADS */}
        <Sec>
          <div className="flex flex-col gap-2 max-w-2xl mb-space-lg">
            <Pill c="w-fit">Validated Real-World Execution</Pill>
            <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface mt-space-sm">
              Optimized for Mission-Critical AI Workloads
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              From LLM post-training alignments to real-time high-density visual
              rendering pipelines.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {workloads.map(([n, tag, t, d, b]) => (
              <div
                key={t}
                className={`p-space-lg flex flex-col gap-space-sm ${cardHover}`}
              >
                <div className="flex items-center justify-between">
                  <IconBox
                    n={n}
                    size="w-10 h-10 rounded-lg"
                    fs="text-[22px]"
                    mb=""
                  />
                  <span className="font-mono-code text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-semibold">
                    {tag}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {t}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {d}
                </p>
                <div className="mt-auto pt-space-xs font-mono-code text-[11px] text-primary">
                  {b}
                </div>
              </div>
            ))}
          </div>
        </Sec>

        {/* 6 TOOLCHAINS */}
        <Sec bg="bg-surface-container-low">
          <div className="text-center flex flex-col items-center gap-2 max-w-2xl mx-auto">
            <Pill>Zero Setup Friction</Pill>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-space-sm">
              Pre-Configured AI Toolchains & Container Runtimes
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Deploy with pristine, tested machine images or spin up your own
              custom Docker / OCI containers with GPU direct-passthrough.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-space-md max-w-4xl mx-auto">
            {tools.map((t) => (
              <span
                key={t}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 font-mono-code text-label-md font-semibold text-on-surface flex items-center gap-1.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-container/50 hover:shadow-md"
              >
                <span className="w-2 h-2 rounded-full bg-primary" />
                {t}
              </span>
            ))}
          </div>
        </Sec>

        {/* 7 COMPARISON */}
        <Sec>
          <div className="flex flex-col gap-2 max-w-2xl mb-space-lg">
            <Pill c="w-fit">Unbiased Technical Benchmarking</Pill>
            <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface mt-space-sm">
              PRIMO CLOUD vs Hyperscalers vs Commodity GPU Clouds
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              See why AI engineering teams migrate away from virtualized
              hyperscalers to our bare-metal infrastructure.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-outline-variant/60 bg-surface-container-lowest shadow-xl">
            <table className="w-full min-w-[820px] text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant/40 text-on-surface font-label-md text-label-md">
                  <th className="py-space-md px-space-lg">
                    Architectural Dimension
                  </th>
                  <th className="py-space-md px-space-lg bg-gradient-to-r from-primary-container to-secondary text-on-primary font-bold">
                    PRIMO CLOUD Bare-Metal
                  </th>
                  <th className="py-space-md px-space-lg">
                    Hyperscaler Cloud (AWS / GCP)
                  </th>
                  <th className="py-space-md px-space-lg">
                    Commodity Cloud (RunPod / Lambda)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 font-body-sm text-body-sm">
                {compare.map(([a, b, c, d, bad]) => (
                  <tr
                    key={a}
                    className="hover:bg-secondary-container/10 transition-colors"
                  >
                    <td className="py-space-md px-space-lg font-semibold text-on-surface">
                      {a}
                    </td>
                    <td className="py-space-md px-space-lg bg-primary/5 font-bold text-primary">
                      <span className="flex items-center gap-2">
                        <I
                          n="check_circle"
                          c="text-[16px] text-primary-container shrink-0"
                        />
                        {b}
                      </span>
                    </td>
                    <td
                      className={`py-space-md px-space-lg ${bad ? "text-error font-medium" : "text-on-surface-variant"}`}
                    >
                      {c}
                    </td>
                    <td className="py-space-md px-space-lg text-on-surface-variant">
                      {d}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>

        {/* 8 DASHBOARD */}
        <Sec bg="bg-surface-container-low">
          <div className="flex flex-col gap-2 max-w-2xl mb-space-lg">
            <Pill c="w-fit">Enterprise Management Portal</Pill>
            <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface mt-space-sm">
              Unified Telemetry & Node Control Console
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Monitor thermals, GPU utilization, memory fragmentation, and
              InfiniBand traffic via web UI or REST API.
            </p>
          </div>
          <div className="w-full rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-2xl overflow-hidden">
            <div className="px-space-lg py-space-md bg-surface-container flex flex-wrap items-center justify-between gap-space-sm border-b border-outline-variant/40">
              <div className="flex flex-wrap items-center gap-space-sm">
                <span className="font-mono-code text-label-md font-bold text-on-surface">
                  gpu-admin.primocloud.net/cluster/h100-fra-08
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono-code text-[11px] font-semibold ${cycling ? "bg-tertiary-fixed-dim/30 text-secondary" : "bg-primary-container/20 text-primary"}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${cycling ? "bg-tertiary-fixed-dim animate-ping" : "bg-primary-container"}`}
                  />
                  {cycling ? "POWER CYCLING…" : "ALL 8 GPUS NOMINAL"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono-code text-label-sm text-on-surface-variant">
                <span>
                  Cluster Draw:{" "}
                  <strong>
                    {cycling ? "640" : draw.toLocaleString()}W / 3,000W
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Avg Temp:{" "}
                  <strong>
                    {cycling ? "31.0" : (49.2 + (avg - 98) * 0.2).toFixed(1)}°C
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Link: <strong>400 Gbps Active</strong>
                </span>
              </div>
            </div>
            <div
              className={`px-space-lg bg-primary/10 text-primary font-label-md text-label-md transition-all duration-300 overflow-hidden ${msg ? "py-2 max-h-12 opacity-100" : "max-h-0 opacity-0"}`}
            >
              {msg}
            </div>
            <div className="p-space-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {[
                [
                  "Overall GPU Compute Load",
                  `${avg}.${cycling ? 0 : 4}%`,
                  avg,
                  "FP8 Tensor Core Pipelines Saturated",
                ],
                [
                  "VRAM Allocation (HBM3)",
                  cycling ? "0 / 640 GB" : "624 / 640 GB",
                  cycling ? 0 : 97.5,
                  "KV-Cache & Gradient Buffer Pinned",
                ],
                [
                  "PCIe Gen5 Bus Rx/Tx",
                  `${cycling ? 0.2 : pcie} GB/s`,
                  cycling ? 1 : 45,
                  "Host to Device DMA Pipelining",
                ],
                [
                  "Coolant Flow Rate",
                  `${flow} L/min`,
                  80,
                  "Chiller Intake 18.2°C • Return 24.1°C",
                ],
              ].map(([l, v, w, s]) => (
                <div
                  key={l}
                  className="p-space-md rounded-lg bg-surface-container border border-outline-variant/40 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center text-on-surface-variant font-label-sm">
                    <span>{l}</span>
                    <span className="text-primary font-bold">{v}</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-container to-secondary h-full transition-[width] duration-1000 ease-out"
                      style={{ width: on ? `${w}%` : "0%" }}
                    />
                  </div>
                  <span className="font-mono-code text-[10px] text-on-surface-variant">
                    {s}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-space-lg py-space-sm bg-surface-container-lowest border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex flex-wrap items-center gap-2">
                {actions.map(([n, t]) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toast(`${t}: session opened in a new tab.`)}
                    className="px-3 py-1.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
                  >
                    <I n={n} c="text-[16px]" /> {t}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={powerCycle}
                disabled={cycling}
                className="px-3 py-1.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm hover:bg-error hover:text-on-error transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <I n="restart_alt" c="text-[16px]" />{" "}
                {cycling ? "Cycling…" : "Power Cycle"}
              </button>
            </div>
          </div>
        </Sec>

        {/* 9 TESTIMONIALS */}
        <Sec>
          <div className="flex flex-col gap-2 max-w-2xl mb-space-lg">
            <Pill c="w-fit">Trusted by Leading AI Research Teams</Pill>
            <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface mt-space-sm">
              Proven Performance at Production Scale
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {reviews.map(([i, n, r, t]) => (
              <div
                key={n}
                className="p-space-lg rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm relative flex flex-col justify-between gap-space-md hover:shadow-xl hover:-translate-y-1 hover:border-primary-container/40 transition-all duration-300"
              >
                <div>
                  <div className="flex text-primary mb-space-sm">
                    {[...Array(5)].map((_, k) => (
                      <I key={k} n="star" c="text-[18px]" />
                    ))}
                  </div>
                  <I
                    n="format_quote"
                    c="absolute top-4 right-5 text-[56px] text-primary-container/15"
                  />
                  <p className="relative font-body-md text-body-md text-on-surface-variant italic leading-relaxed">
                    {t}
                  </p>
                </div>
                <div className="flex items-center gap-space-sm pt-space-xs border-t border-outline-variant/40">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-secondary text-on-primary font-bold flex items-center justify-center font-mono-code">
                    {i}
                  </div>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1 font-label-md text-label-md font-bold text-on-surface">
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

        {/* 10 FAQ */}
        <Sec bg="bg-surface-container-low">
          <div className="flex flex-col gap-2 max-w-2xl mb-space-lg">
            <Pill c="w-fit">Engineering Inquiries</Pill>
            <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface mt-space-sm">
              Frequently Asked Questions
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Everything you need to know about our dedicated GPU clusters,
              hardware SLAs, and networking fabrics.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-start">
            {[faqs.slice(0, 5), faqs.slice(5)].map((col, c) => (
              <div key={c} className="flex flex-col gap-space-sm">
                {col.map(([q, a], j) => {
                  const i = c * 5 + j;
                  const isOpen = open.includes(i);
                  return (
                    <div
                      key={q}
                      className={`p-space-md rounded-lg bg-surface-container-lowest border transition-all duration-300 ${isOpen ? "border-primary-container shadow-md shadow-primary-container/10" : "border-outline-variant/60"}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(i)}
                        className="w-full flex items-center justify-between gap-3 text-left font-headline-sm text-headline-sm font-semibold text-on-surface"
                      >
                        <span>{q}</span>
                        <I
                          n="expand_more"
                          c={`text-primary shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                      >
                        <div className="overflow-hidden">
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-sm leading-relaxed">
                            {a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Sec>

        {/* 11 CTA */}
        <section className="w-full bg-surface py-space-xl">
          <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary-container bg-[length:200%_100%] animate-[shimmer_10s_linear_infinite] p-space-lg lg:p-space-xl text-on-primary shadow-2xl shadow-primary/20">
              <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:22px_22px]" />
              <span className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 animate-float" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
                <div className="flex flex-col gap-space-sm max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white/20 text-white font-mono-code text-[11px] font-semibold w-fit">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />{" "}
                    INSTANT GPU CLUSTER ALLOCATION
                  </div>
                  <h2 className="font-headline-xl text-headline-xl font-bold tracking-tight text-white">
                    Ready to Accelerate Your AI Workloads with Bare-Metal GPUs?
                  </h2>
                  <p className="font-body-lg text-body-lg text-white/90 leading-relaxed">
                    Deploy dedicated NVIDIA H100, A100, and RTX 4090 servers in
                    under 5 minutes with zero setup fees, zero egress penalties,
                    and 24/7 VIP AI systems engineering support.
                  </p>
                  <div className="flex flex-wrap items-center gap-space-md pt-2 text-white/80 font-mono-code text-label-sm">
                    {[
                      ["verified", "99.999% Network SLA"],
                      ["schedule", "Sub-5 Min Provisioning"],
                      ["support_agent", "Dedicated Solutions Team"],
                    ].map(([n, t]) => (
                      <span key={t} className="flex items-center gap-1">
                        <I n={n} c="text-[16px] text-white" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm shrink-0">
                  <a
                    href="/login"
                    className="px-space-lg py-3.5 rounded-lg bg-surface-container-lowest text-primary font-label-lg text-label-lg font-bold hover:bg-surface-container transition-all shadow-md inline-flex items-center justify-center gap-2 hover:-translate-y-0.5"
                  >
                    Deploy GPU Server Now
                    <I n="arrow_forward" c="text-[20px]" />
                  </a>
                  <a
                    href="/contact"
                    className="px-space-lg py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/30 font-label-lg text-label-lg font-semibold transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <I n="headset_mic" c="text-[20px]" />
                    Consult an Architect
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default GpuServer;
