#!/usr/bin/env bash
# One-command installer for PrimoCloud Panel (Ubuntu 24.04, run as root).
#
#   curl -fsSL https://raw.githubusercontent.com/singhhemant80/primocloud-panel/main/install.sh | sudo bash -s -- --domain primocloud.in --email admin@primocloud.in
#
# Before DNS is ready, install on the server's IP address instead (plain http, no SSL):
#   curl -fsSL https://raw.githubusercontent.com/singhhemant80/primocloud-panel/main/install.sh | sudo bash -s -- --ip
# and later switch to the domain by running the first command — data, .env and the admin account are kept.
#
# Options:  --domain <domain>    site domain, e.g. primocloud.in (or an IPv4 address)
#           --ip [<address>]     use this server's IP address instead of a domain (detected when omitted)
#           --email <email>      admin login + Let's Encrypt contact (default admin@<domain>)
#           --no-ssl             skip the Let's Encrypt certificate
#           --demo               also seed demo data (test server, IP range, demo customer)
#           --dir <path>         install directory (default /opt/primocloud-panel)
#           --branch <name>      git branch (default main)
# Re-running the same command updates an existing install (git pull + rebuild + migrations); data is kept.
# Faster update that doesn't need this download:  sudo bash /opt/primocloud-panel/deploy/update.sh
set -euo pipefail

REPO="https://github.com/singhhemant80/primocloud-panel.git"
DIR="/opt/primocloud-panel"
BRANCH="main"
DOMAIN="${DOMAIN:-}"
EMAIL="${ADMIN_EMAIL:-}"
SSL=1
DEMO="${SEED_DEMO:-false}"

while [ $# -gt 0 ]; do
  case "$1" in
    --domain) DOMAIN="$2"; shift 2 ;;
    --ip)
      if [ $# -gt 1 ] && [[ "$2" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then DOMAIN="$2"; shift 2; else DOMAIN="__detect__"; shift; fi ;;
    --email) EMAIL="$2"; shift 2 ;;
    --no-ssl) SSL=0; shift ;;
    --demo) DEMO=true; shift ;;
    --dir) DIR="$2"; shift 2 ;;
    --branch) BRANCH="$2"; shift 2 ;;
    -h|--help) sed -n '2,13p' "$0" 2>/dev/null || true; exit 0 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

[ "$(id -u)" -eq 0 ] || { echo "Please run as root (use sudo)."; exit 1; }
if [ -z "$DOMAIN" ] && [ -r /dev/tty ]; then
  read -rp "Domain for the panel (e.g. primocloud.in) — or press Enter to use this server's IP address: " DOMAIN < /dev/tty
  DOMAIN="${DOMAIN:-__detect__}"
fi
[ -n "$DOMAIN" ] || DOMAIN="__detect__"
if [ "$DOMAIN" = "__detect__" ]; then
  # public IPv4 as the outside world sees it; falls back to the first address on this machine
  DOMAIN="$(curl -4 -fsS --max-time 8 https://api.ipify.org 2>/dev/null || curl -4 -fsS --max-time 8 https://ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')"
  [[ "$DOMAIN" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "Couldn't detect this server's IP — pass it: --ip 1.2.3.4"; exit 1; }
fi
IS_IP=0
[[ "$DOMAIN" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]] && IS_IP=1
if [ "$IS_IP" = "1" ]; then
  SSL=0   # Let's Encrypt doesn't issue certificates for bare IP addresses
  EMAIL="${EMAIL:-admin@primocloud.in}"
else
  EMAIL="${EMAIL:-admin@${DOMAIN}}"
fi

if [ "$IS_IP" = "1" ]; then echo "==> PrimoCloud Panel → http://${DOMAIN}  (IP address, no SSL; dir ${DIR}, branch ${BRANCH})"
else echo "==> PrimoCloud Panel → ${DOMAIN}  (dir ${DIR}, branch ${BRANCH})"; fi
export DEBIAN_FRONTEND=noninteractive NEEDRESTART_MODE=a
APT_OPTS=(-o Acquire::http::Timeout=20 -o Acquire::https::Timeout=20 -o Acquire::Retries=2 -o Dpkg::Lock::Timeout=120)
if ! command -v git >/dev/null; then
  echo "==> Installing git"
  apt-get "${APT_OPTS[@]}" update -y -q
  apt-get "${APT_OPTS[@]}" install -y -q git curl ca-certificates
fi

if [ -d "$DIR/.git" ]; then
  echo "==> Updating existing checkout"
  git -C "$DIR" config --global --add safe.directory "$DIR" || true
  timeout 300 git -C "$DIR" fetch --depth 1 origin "$BRANCH" || { echo "!! Couldn't reach GitHub (see: getent hosts github.com)"; exit 1; }
  git -C "$DIR" reset --hard "origin/$BRANCH"
else
  echo "==> Cloning ${REPO}"
  git clone --depth 1 --branch "$BRANCH" "$REPO" "$DIR"
fi

export DOMAIN ADMIN_EMAIL="$EMAIL" SEED_DEMO="$DEMO"
[ "$SSL" = "1" ] && export LETSENCRYPT_EMAIL="$EMAIL"
exec bash "$DIR/deploy/install.sh"
