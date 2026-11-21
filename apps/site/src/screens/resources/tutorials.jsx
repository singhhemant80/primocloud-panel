import React, { useState } from "react";
import { Page, Hero, Sec, Cta, Code, I, rt } from "../../components/kit";

const tutorials = [
  {
    icon: "key",
    title: "Log in to a Linux VPS with an SSH key",
    level: "Beginner",
    time: "5 min",
    intro: "SSH keys are safer and more convenient than passwords.",
    steps: [
      ["Create a key pair on your computer.", "ssh-keygen -t ed25519 -C \"you@example.com\""],
      ["Copy the public key to your server (replace the IP).", "ssh-copy-id root@YOUR_SERVER_IP"],
      ["Log in. You should not be asked for the server password.", "ssh root@YOUR_SERVER_IP"],
    ],
  },
  {
    icon: "lock",
    title: "Harden SSH on Ubuntu or Debian",
    level: "Intermediate",
    time: "10 min",
    intro: "Do this after your key login works. Keep a second terminal open while testing so you cannot lock yourself out.",
    steps: [
      ["Create a normal user with sudo rights.", "adduser deploy\nusermod -aG sudo deploy"],
      ["Edit the SSH configuration.", "sudo nano /etc/ssh/sshd_config"],
      ["Set these options, save and exit.", "PermitRootLogin no\nPasswordAuthentication no"],
      ["Restart SSH, then test a new login before closing your current session.", "sudo systemctl restart ssh"],
    ],
  },
  {
    icon: "shield",
    title: "Set up a firewall with UFW",
    level: "Beginner",
    time: "5 min",
    intro: "Allow only the ports you need. Always allow SSH before you enable the firewall.",
    steps: [
      ["Allow SSH, web traffic and nothing else.", "sudo ufw allow OpenSSH\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp"],
      ["Turn the firewall on.", "sudo ufw enable"],
      ["Check the rules.", "sudo ufw status verbose"],
    ],
  },
  {
    icon: "language",
    title: "Install Nginx with a free SSL certificate",
    level: "Intermediate",
    time: "10 min",
    intro: "Before you start, point your domain's A record at your server.",
    steps: [
      ["Install Nginx and Certbot.", "sudo apt update\nsudo apt install -y nginx certbot python3-certbot-nginx"],
      ["Request a certificate for your domain.", "sudo certbot --nginx -d example.com -d www.example.com"],
      ["Check that renewal works.", "sudo certbot renew --dry-run"],
    ],
  },
  {
    icon: "account_tree",
    title: "Run n8n with Docker",
    level: "Intermediate",
    time: "10 min",
    intro: "This starts n8n on port 5678 and keeps its data in a Docker volume. Docker must be installed first.",
    steps: [
      ["Create a volume for the data.", "docker volume create n8n_data"],
      ["Start n8n.", "docker run -d --name n8n --restart unless-stopped -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n"],
      ["Open http://YOUR_SERVER_IP:5678 in your browser. For production, put it behind HTTPS with a reverse proxy.", ""],
    ],
  },
  {
    icon: "desktop_windows",
    title: "Connect to a Windows VPS with Remote Desktop",
    level: "Beginner",
    time: "3 min",
    intro: "Use the details in your welcome email.",
    steps: [
      ["On Windows, open **Remote Desktop Connection** (mstsc). On macOS, use the Microsoft Remote Desktop app.", ""],
      ["Enter your server IP address and click Connect.", ""],
      ["Sign in as **Administrator** with the password we sent you, and change it straight away.", ""],
    ],
  },
  {
    icon: "backup",
    title: "Back up a website and its database",
    level: "Beginner",
    time: "5 min",
    intro: "A simple manual backup for a LAMP-style site. Schedule it with cron once it works.",
    steps: [
      ["Export the database.", "mysqldump -u dbuser -p dbname > dbname.sql"],
      ["Archive the files together with the dump.", "tar czf site-backup-$(date +%F).tgz /var/www/html dbname.sql"],
      ["Copy the archive to another machine.", "rsync -av site-backup-*.tgz user@backup-host:/backups/"],
    ],
  },
];

const Tutorials = () => {
  const [open, setOpen] = useState(0);
  return (
    <Page>
      <Hero pill="Tutorials" title="Step-by-step guides for" accent="your first server" sub="Short, tested walkthroughs for the jobs everyone does on a new VPS or hosting account." />
      <Sec>
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-space-md">
          {tutorials.map((t, i) => (
            <div key={t.title} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center gap-4 p-space-md text-left">
                <span className="w-11 h-11 shrink-0 rounded-xl bg-secondary-container/40 text-primary-container flex items-center justify-center"><I n={t.icon} c="text-[24px]" /></span>
                <span className="flex-1 min-w-0">
                  <span className="block font-headline-sm text-[16px] font-bold text-on-surface">{t.title}</span>
                  <span className="block font-body-sm text-[12px] text-on-surface-variant">{t.level} · {t.time} · {t.steps.length} steps</span>
                </span>
                <I n="expand_more" c={`text-[24px] text-primary transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-space-md pb-space-lg">
                  <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">{t.intro}</p>
                  <ol className="flex flex-col gap-space-md">
                    {t.steps.map(([text, cmd], k) => (
                      <li key={k} className="flex items-start gap-3">
                        <span className="w-7 h-7 shrink-0 rounded-lg bg-secondary-container/50 text-primary font-mono-code text-label-md font-bold flex items-center justify-center">{k + 1}</span>
                        <div className="flex-1 min-w-0 flex flex-col gap-2">
                          <span className="font-body-md text-body-md text-on-surface-variant pt-0.5">{rt(text)}</span>
                          {cmd && <Code title="terminal">{cmd}</Code>}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      </Sec>
      <Cta title="Want us to do it for you?" text="Open a ticket and one of our engineers will help you through it." primary={["Open a ticket", "/support"]} secondary={["Read the blog", "/blog"]} />
    </Page>
  );
};

export default Tutorials;
