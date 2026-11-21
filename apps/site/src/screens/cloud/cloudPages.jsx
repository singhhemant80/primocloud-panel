import React from "react";
import ProductPage from "./ProductPage";

const common = [
  ["dns", "Linux VPS", "Full root access on KVM virtualisation.", "/vps/linux-vps"],
  ["receipt_long", "Tally on Cloud", "Run Tally from anywhere with automatic backups.", "/cloud-solution/tally-on-cloud"],
  ["storage", "Dedicated Servers", "Bare-metal power with no sharing.", "/server/dedicated-servers"],
];

export const CloudHosting = () => (
  <ProductPage
    pill="Cloud hosting"
    title="Hosting that scales"
    accent="when your traffic does"
    sub="Run websites and applications on resilient cloud infrastructure with fast NVMe storage, snapshots and room to grow, without moving to a new provider."
    stats={[["bolt", "NVMe", "Fast storage"], ["verified", "99.99%", "Infrastructure SLA"], ["support_agent", "24/7", "Support"]]}
    features={[
      ["speed", "NVMe storage", "Fast disks for databases, caches and busy sites."],
      ["trending_up", "Scale up easily", "Move to a larger plan as traffic grows."],
      ["photo_camera", "Snapshots & backups", "Restore quickly if a deployment goes wrong."],
      ["shield", "DDoS protection", "Filtering at the network edge keeps you online."],
      ["lock", "Free SSL", "Encrypted connections for every site."],
      ["public", "Choose your region", "Place workloads near your visitors."],
    ]}
    useCases={[
      ["storefront", "Online stores", "Keep checkout fast on busy days."],
      ["code", "Web applications", "Run Node.js, PHP, Python and more."],
      ["campaign", "Agencies", "Host client sites on one reliable platform."],
    ]}
    steps={[
      ["Choose a plan", "Pick the resources you need and a region."],
      ["Deploy", "Your cloud environment is provisioned automatically."],
      ["Move your site", "Our team can migrate it for you, free of charge."],
      ["Grow", "Upgrade resources as your traffic increases."],
    ]}
    faqs={[
      ["Can I upgrade later?", "Yes. You can move to a larger plan from your Client Area or by contacting support."],
      ["Do you help with migration?", "Yes. We migrate eligible sites for you at no extra cost. Tell us where your site is hosted now."],
      ["Is there a money-back window?", "Eligible plans have a 30-day money-back window. See the Refund Policy for the conditions."],
    ]}
    related={common}
    ctaTitle="Put your site on a faster cloud"
    ctaText="Tell us what you run and we will recommend the right setup."
  />
);

export const BusinessCloud = () => (
  <ProductPage
    pill="Business cloud"
    title="Secure cloud desktops"
    accent="for your whole team"
    sub="Give your team a consistent, secure desktop they can open from any device. Applications and files stay in the cloud, so work continues wherever people are."
    stats={[["devices", "Any device", "Laptop · tablet · phone"], ["backup", "Auto backups", "Protected data"], ["support_agent", "24/7", "Support"]]}
    features={[
      ["desktop_windows", "Windows desktops", "Familiar desktops with your business software installed."],
      ["groups", "Team access", "Add and remove users as your team changes."],
      ["folder_shared", "Shared files", "Keep documents in one place everyone can reach."],
      ["backup", "Automatic backups", "Data is backed up so mistakes can be undone."],
      ["lock", "Secure access", "Encrypted connections and controlled permissions."],
      ["bolt", "Fast performance", "Run heavy applications without a powerful laptop."],
    ]}
    useCases={[
      ["receipt_long", "Accounting teams", "Run Tally and other accounting software centrally."],
      ["home_work", "Remote and hybrid teams", "Same desktop at home, in the office or on the road."],
      ["apartment", "Branch offices", "Keep every location on one shared system."],
    ]}
    steps={[
      ["Tell us your needs", "Number of users and the software you use."],
      ["We set it up", "Desktops, users and software are configured for you."],
      ["Your team signs in", "Each person gets secure access details."],
      ["We keep it running", "Updates, backups and support are handled for you."],
    ]}
    faqs={[
      ["Can we run our own software?", "Yes. We can install the business applications your team uses, subject to their licences."],
      ["What happens if someone leaves the company?", "Their access can be removed immediately while their files stay with the business."],
      ["Do you offer a trial?", "Contact our sales team to discuss a trial or a demo that fits your needs."],
    ]}
    related={[common[1], common[0], common[2]]}
    ctaTitle="Move your team to the cloud"
    ctaText="Tell us how many people and which software, and we will put together a plan."
  />
);

export const StorageSolutions = () => (
  <ProductPage
    pill="Storage solutions"
    title="Storage that keeps"
    accent="your data safe"
    sub="Back up, archive and share data on resilient storage connected to our network. Use it alongside your servers or on its own."
    stats={[["cloud_sync", "Offsite", "Backup copies"], ["lock", "Encrypted", "In transit"], ["support_agent", "24/7", "Support"]]}
    features={[
      ["backup", "Backup storage", "Keep offsite copies of servers and databases."],
      ["inventory_2", "Archive", "Store large files you need to keep but rarely open."],
      ["swap_horiz", "Easy transfer", "Move data with SFTP, rsync and common backup tools."],
      ["lock", "Encrypted transfers", "Data is protected as it travels to and from storage."],
      ["trending_up", "Grow as needed", "Add capacity without rebuilding anything."],
      ["lan", "Fast local network", "Quick transfers between your Primo Cloud servers."],
    ]}
    useCases={[
      ["dns", "Server backups", "Automate nightly copies of your VPS or dedicated server."],
      ["movie", "Media libraries", "Keep large assets in one place for your team."],
      ["gavel", "Records retention", "Store documents you must keep for compliance."],
    ]}
    steps={[
      ["Estimate your data", "Tell us how much you store and how it grows."],
      ["Choose a plan", "We propose capacity and access options."],
      ["Connect", "We give you the details for SFTP or your backup tool."],
      ["Automate", "Schedule backups and check them regularly."],
    ]}
    faqs={[
      ["Is storage a replacement for backups?", "It is a place to keep backups. Follow the 3-2-1 rule: three copies, on two kinds of media, with one offsite."],
      ["Can I connect it to my existing server?", "Yes. Servers on any provider can use it over SFTP or rsync."],
      ["How do I get pricing?", "Contact sales with the capacity you need and we will send a quote."],
    ]}
    related={[common[0], common[2], common[1]]}
    ctaTitle="Protect your data offsite"
    ctaText="Tell us how much you need to store and we will recommend a plan."
  />
);

export const ManagedKubernetes = () => (
  <ProductPage
    pill="Managed Kubernetes"
    title="Kubernetes without the"
    accent="operational headache"
    sub="Run containerised applications on clusters we help you build and operate, so your team can focus on shipping software."
    stats={[["deployed_code", "Containers", "Production ready"], ["monitoring", "Monitored", "24/7 by our team"], ["support_agent", "Engineer help", "Not a bot"]]}
    features={[
      ["hub", "Cluster setup", "We design and build the cluster to match your workload."],
      ["monitoring", "Monitoring", "Metrics and alerting for nodes and workloads."],
      ["system_update_alt", "Upgrades", "Planned Kubernetes version and security updates."],
      ["shield", "Network security", "Private networking and policies between services."],
      ["storage", "Persistent storage", "Volumes for databases and stateful services."],
      ["memory", "GPU nodes", "Add GPU capacity for AI and inference workloads."],
    ]}
    useCases={[
      ["api", "Microservices", "Deploy and scale many small services."],
      ["psychology", "AI inference", "Serve models on GPU-backed nodes."],
      ["sync", "CI/CD", "Ship updates continuously with rolling releases."],
    ]}
    steps={[
      ["Discovery call", "We review your applications and traffic."],
      ["Design", "We propose cluster size, regions and storage."],
      ["Build & hand over", "We create the cluster and share access."],
      ["Operate", "We monitor, update and support it with you."],
    ]}
    faqs={[
      ["Is this available to order online?", "Managed Kubernetes is arranged with our engineers so it fits your workload. Contact sales to get started."],
      ["Do you support our existing manifests and Helm charts?", "Yes. It is standard Kubernetes, so your manifests, Helm charts and CI pipelines work as they do elsewhere."],
      ["Can I add GPU servers?", "Yes. We can attach GPU nodes to your cluster. See our GPU Servers page for the hardware available."],
    ]}
    related={[["memory", "GPU Servers", "Hardware for AI and rendering.", "/server/gpu-servers"], common[0], common[2]]}
    ctaTitle="Talk to a Kubernetes engineer"
    ctaText="Share what you run today and we will sketch a cluster for it."
  />
);
