# Bretune ISP — RADIUS Migration Guide
## From MikroTik API → FreeRADIUS Centralized Auth

---

## Architecture Overview

```
┌──────────────────────────────────────────────┐
│          BRETUNE BACKEND (NestJS)             │
│                                               │
│  ISP Service → writes to radcheck/radreply    │
│  Billing Svc → suspend = Auth-Type:=Reject    │
│  MikroTik Svc → monitoring/disconnect ONLY    │
└──────────────┬───────────────────────────────┘
               │ PostgreSQL (shared DB)
               ▼
┌──────────────────────┐     ┌─────────────────┐
│    FreeRADIUS 3.x    │◄────│   MikroTik NAS  │
│   (reads SQL tables) │     │  (PPPoE server)  │
│   Port 1812/1813     │     │  RADIUS client   │
│                      │────►│  Port 3799 CoA   │
└──────────────────────┘     └─────────────────┘
```

**Key change:** Users are NO LONGER stored on MikroTik as PPP secrets.
MikroTik authenticates via RADIUS → FreeRADIUS → PostgreSQL.

---

## Step 1: Install FreeRADIUS on Server

```bash
# Ubuntu/Debian (on 161.97.120.107)
apt update
apt install -y freeradius freeradius-postgresql freeradius-utils

# Verify
freeradius -v
```

---

## Step 2: Push RADIUS Tables to Database

```bash
cd /root/Bretune-Accounting/backend
git pull
npx prisma db push --accept-data-loss
npx prisma generate
```

This creates these tables in your PostgreSQL:
- `radcheck` — user credentials (username + Cleartext-Password)
- `radreply` — user attributes (Mikrotik-Rate-Limit, Framed-IP-Address)
- `radgroupcheck` — group-level auth rules
- `radgroupreply` — group-level attributes (plan speed limits)
- `radusergroup` — user-to-group mapping (user → plan)
- `radacct` — session accounting (usage, times, IPs)
- `radpostauth` — authentication logs (success/fail)
- `nas` — registered NAS devices (routers)

---

## Step 3: Configure FreeRADIUS SQL Module

```bash
# Enable SQL module
cd /etc/freeradius/3.0/mods-enabled
ln -sf ../mods-available/sql sql

# Edit SQL config
nano /etc/freeradius/3.0/mods-available/sql
```

Set these values:
```
sql {
    driver = "rlm_sql_postgresql"
    dialect = "postgresql"
    server = "localhost"
    port = 5432
    login = "YOUR_DB_USER"
    password = "YOUR_DB_PASSWORD"
    radius_db = "bretune-accounting"

    read_clients = yes
    client_table = "nas"

    acct_table1 = "radacct"
    acct_table2 = "radacct"
    authcheck_table = "radcheck"
    authreply_table = "radreply"
    groupcheck_table = "radgroupcheck"
    groupreply_table = "radgroupreply"
    usergroup_table = "radusergroup"
    postauth_table = "radpostauth"
}
```

See `docs/radius/freeradius-sql.conf` for full config.

---

## Step 4: Configure FreeRADIUS Sites

```bash
nano /etc/freeradius/3.0/sites-available/default
```

In the `authorize` section, add `sql` and remove `files`:
```
authorize {
    preprocess
    sql          # ← reads radcheck + radgroupcheck
    pap
    chap
    mschap
}

accounting {
    sql          # ← writes to radacct
}

post-auth {
    sql          # ← writes to radpostauth
}
```

See `docs/radius/freeradius-sites-default.conf` for full config.

---

## Step 5: Enable MikroTik Dictionary

```bash
# Ensure MikroTik vendor dictionary is loaded
ls /usr/share/freeradius/dictionary.mikrotik

# In /etc/freeradius/3.0/dictionary, add:
$INCLUDE /usr/share/freeradius/dictionary.mikrotik
```

This enables `Mikrotik-Rate-Limit` and other vendor-specific attributes.

---

## Step 6: Register Your MikroTik as NAS

### Option A: Via Bretune API
```bash
curl -X POST http://localhost:3000/api/isp/radius/nas \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nasname": "102.222.12.129",
    "shortname": "main-router",
    "secret": "BretuneRadius2024!",
    "type": "mikrotik",
    "description": "Main PPPoE Router"
  }'
```

### Option B: Direct SQL
```sql
INSERT INTO nas (nasname, shortname, type, secret, description)
VALUES ('102.222.12.129', 'main-router', 'mikrotik', 'BretuneRadius2024!', 'Main PPPoE Router');
```

After adding, restart FreeRADIUS to pick up the NAS:
```bash
systemctl restart freeradius
```

---

## Step 7: Configure MikroTik to Use RADIUS

Run these commands on your MikroTik router (via Winbox terminal or SSH):

```routeros
# 1. Add RADIUS server (pointing to your Bretune server)
/radius add \
    service=ppp \
    address=161.97.120.107 \
    secret="BretuneRadius2024!" \
    authentication-port=1812 \
    accounting-port=1813 \
    timeout=3000ms \
    comment="Bretune FreeRADIUS"

# 2. Enable RADIUS for PPP authentication
/ppp aaa set \
    use-radius=yes \
    radius-accounting=yes \
    interim-update=5m \
    accounting=yes

# 3. Enable CoA (Change of Authorization) listener
/radius incoming set \
    accept=yes \
    port=3799

# 4. (IMPORTANT) Set default PPP profile to use RADIUS attributes
/ppp profile set default \
    use-radius=yes \
    rate-limit=""
```

### Verify RADIUS connection from MikroTik:
```routeros
/radius monitor 0
```
Should show `pending: 0, responses: X, bad-replies: 0`.

---

## Step 8: Migrate Existing Users

### A. Export current PPP secrets from MikroTik:
```routeros
/ppp secret print detail file=ppp-backup
```

### B. For each existing user, provision in RADIUS via API:
```bash
# For each user:
curl -X POST http://localhost:3000/api/isp/radius/provision/USERNAME \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "user_password",
    "planGroup": "10Mbps-Plan"
  }'
```

### C. Create plan groups first:
```bash
# Example: 10Mbps plan (10M down / 5M up)
curl -X POST http://localhost:3000/api/isp/radius/plan-group \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "planName": "10Mbps-Plan",
    "downloadKbps": 10240,
    "uploadKbps": 5120,
    "burstDownKbps": 12288,
    "burstUpKbps": 6144,
    "burstTime": "10"
  }'
```

### D. Test a single user first:
```bash
# Test from server
radtest testuser testpassword localhost 0 testing123
```

### E. Once verified, remove PPP secrets from MikroTik:
```routeros
# ONLY after confirming RADIUS works!
/ppp secret remove [find]
```

---

## Step 9: How Billing Integration Works

When billing events occur, Bretune automatically manages RADIUS:

| Event | RADIUS Action |
|-------|--------------|
| Lead → Convert to Customer | `provisionUser()` — adds radcheck + radusergroup |
| Invoice overdue + auto-suspend | `suspendUser()` — adds Auth-Type:=Reject |
| Payment received + auto-reactivate | `reactivateUser()` — removes Auth-Type Reject |
| Plan change | `changeUserPlan()` — updates radusergroup |
| Password change | `changeUserPassword()` — updates radcheck |
| Customer deleted | `deprovisionUser()` — removes all RADIUS entries |

---

## Step 10: Verify Everything

### Test authentication:
```bash
radtest john_doe password123 localhost 0 testing123
```

Expected output:
```
Received Access-Accept Id X from 127.0.0.1:1812
    Mikrotik-Rate-Limit = "5120k/10240k"
```

### Check active sessions:
```bash
curl http://localhost:3000/api/isp/radius/sessions \
  -H "Authorization: Bearer TOKEN"
```

### Check auth logs:
```bash
curl http://localhost:3000/api/isp/radius/auth-logs \
  -H "Authorization: Bearer TOKEN"
```

### Monitor on MikroTik:
```routeros
/ppp active print
/radius monitor 0
```

---

## Firewall Rules (Server)

```bash
# Allow RADIUS auth/acct from your MikroTik
ufw allow from 102.222.12.129 to any port 1812 proto udp
ufw allow from 102.222.12.129 to any port 1813 proto udp

# Block RADIUS from everyone else
# (already blocked by default if ufw is on)
```

---

## Rollback Plan

If anything goes wrong:
1. On MikroTik: `/ppp aaa set use-radius=no`
2. This reverts to local PPP secret authentication
3. Your existing secrets still work as fallback

---

## Summary of What Changed

| Before (API) | After (RADIUS) |
|--------------|----------------|
| Users stored on MikroTik `/ppp secret` | Users in PostgreSQL `radcheck` table |
| Speed via MikroTik profiles | Speed via `Mikrotik-Rate-Limit` in `radreply`/`radgroupreply` |
| Suspend = disable PPP secret via API | Suspend = `Auth-Type:=Reject` in `radcheck` |
| No accounting | Full session accounting in `radacct` |
| Single router only | Multi-NAS support via `nas` table |
| MikroTik API must be reachable | Works even if API is down (RADIUS is separate) |
