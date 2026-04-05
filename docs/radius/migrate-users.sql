-- ============================================================
-- RADIUS MIGRATION: 47 PPPoE users from MikroTik to radcheck
-- Generated from /ppp secret print detail
-- ============================================================

-- ── STEP 1: Create plan groups (radgroupreply) ──────────────

-- pppoe-20M: 10M upload / 20M download
INSERT INTO radgroupreply (groupname, attribute, op, value)
VALUES ('pppoe-20M', 'Mikrotik-Rate-Limit', ':=', '10240k/20480k');

-- pppoe-10M: 5M upload / 10M download
INSERT INTO radgroupreply (groupname, attribute, op, value)
VALUES ('pppoe-10M', 'Mikrotik-Rate-Limit', ':=', '5120k/10240k');

-- pppoe-5M: 2.5M upload / 5M download
INSERT INTO radgroupreply (groupname, attribute, op, value)
VALUES ('pppoe-5M', 'Mikrotik-Rate-Limit', ':=', '2560k/5120k');

-- expired-128k: 128k upload / 128k download (suspended/expired plan)
INSERT INTO radgroupreply (groupname, attribute, op, value)
VALUES ('expired-128k', 'Mikrotik-Rate-Limit', ':=', '128k/128k');


-- ── STEP 2: User credentials (radcheck) ─────────────────────

-- #0 n.nuraan@rachfort.co.za (pppoe-20M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('n.nuraan@rachfort.co.za', 'Cleartext-Password', ':=', 'NNR2024!');

-- #1 g.magondo@rachfort.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('g.magondo@rachfort.co.za', 'Cleartext-Password', ':=', 'GMR2024!');

-- #2 t.jebetwane@rachfort.co.za (expired-128k, DISABLED)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('t.jebetwane@rachfort.co.za', 'Cleartext-Password', ':=', 'TJR2024!');
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('t.jebetwane@rachfort.co.za', 'Auth-Type', ':=', 'Reject');

-- #3 f.saidi@rachfort.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('f.saidi@rachfort.co.za', 'Cleartext-Password', ':=', 'FSR2024!');

-- #4 s.tsoloane@rachfort.co.za (pppoe-20M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('s.tsoloane@rachfort.co.za', 'Cleartext-Password', ':=', 'STR2024!');

-- #5 p.lafukani@rachfort.co.za (pppoe-20M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('p.lafukani@rachfort.co.za', 'Cleartext-Password', ':=', 'PLR2024!');

-- #6 w.gwemure@rachfort.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('w.gwemure@rachfort.co.za', 'Cleartext-Password', ':=', 'WGR2024!');

-- #7 b.kaitano@rachfort.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('b.kaitano@rachfort.co.za', 'Cleartext-Password', ':=', 'BKR2024!');

-- #8 j.dzumbira@rachfort.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('j.dzumbira@rachfort.co.za', 'Cleartext-Password', ':=', 'JDR2024!');

-- #9 c.butchery@rachfort.co.za (expired-128k, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('c.butchery@rachfort.co.za', 'Cleartext-Password', ':=', 'CBR2024!');

-- #10 a.manuel@fortai.co.za (pppoe-20M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('a.manuel@fortai.co.za', 'Cleartext-Password', ':=', 'AMF2025!');

-- #11 s.makarutse@network.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('s.makarutse@network.co.za', 'Cleartext-Password', ':=', 'SMR2024!');

-- #12 t.tavenga@rachfort.co.za (expired-128k, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('t.tavenga@rachfort.co.za', 'Cleartext-Password', ':=', 'TTR2024!');

-- #13 i.mugwagwa@fortai.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('i.mugwagwa@fortai.co.za', 'Cleartext-Password', ':=', 'IMF2025!');

-- #14 n.norushu@rachfort.co.za (expired-128k, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('n.norushu@rachfort.co.za', 'Cleartext-Password', ':=', 'NNR2024!');

-- #15 b.ousmane@rachfort.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('b.ousmane@rachfort.co.za', 'Cleartext-Password', ':=', 'BOR2024!');

-- #16 n.beza@rachfort.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('n.beza@rachfort.co.za', 'Cleartext-Password', ':=', 'NBR2024!');

-- #17 s.nzvimbo@rachfort.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('s.nzvimbo@rachfort.co.za', 'Cleartext-Password', ':=', 'SNR2024!');

-- #18 m.mwiwa@rachfort.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('m.mwiwa@rachfort.co.za', 'Cleartext-Password', ':=', 'MMR2024!');

-- #19 m.zingwe@rachfort.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('m.zingwe@rachfort.co.za', 'Cleartext-Password', ':=', 'MZR2024!');

-- #20 c.dube@rachfort.co.za (pppoe-10M, DISABLED)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('c.dube@rachfort.co.za', 'Cleartext-Password', ':=', 'CDR2024!');
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('c.dube@rachfort.co.za', 'Auth-Type', ':=', 'Reject');

-- #21 w.gwese@rachfort.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('w.gwese@rachfort.co.za', 'Cleartext-Password', ':=', 'WGR2024!');

-- #22 s.ndlovu@rachfort.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('s.ndlovu@rachfort.co.za', 'Cleartext-Password', ':=', 'SNR2024!');

-- #23 t.thlakala@fortai.co.za (pppoe-20M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('t.thlakala@fortai.co.za', 'Cleartext-Password', ':=', 'TTF2024!');

-- #24 s.williams@rachfort.co.za (pppoe-10M, DISABLED)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('s.williams@rachfort.co.za', 'Cleartext-Password', ':=', 'SWR2024!');
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('s.williams@rachfort.co.za', 'Auth-Type', ':=', 'Reject');

-- #25 p.ndlovu@rachfort.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('p.ndlovu@rachfort.co.za', 'Cleartext-Password', ':=', 'PNR2024!');

-- #26 p.cofa@rachfort.co.za (expired-128k, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('p.cofa@rachfort.co.za', 'Cleartext-Password', ':=', 'PCR2024!');

-- #27 p.muzoremba@rachfort.co.za (pppoe-10M, DISABLED)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('p.muzoremba@rachfort.co.za', 'Cleartext-Password', ':=', 'PMR2024!');
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('p.muzoremba@rachfort.co.za', 'Auth-Type', ':=', 'Reject');

-- #28 a.ndaradzi@rachfort.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('a.ndaradzi@rachfort.co.za', 'Cleartext-Password', ':=', 'ANR2024!');

-- #29 p.manunure@rachfort.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('p.manunure@rachfort.co.za', 'Cleartext-Password', ':=', 'PMR2024!');

-- #30 andrew@rachfort.co.za (pppoe-20M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('andrew@rachfort.co.za', 'Cleartext-Password', ':=', 'AHR2024!');

-- #31 e.matenda@network.co.za (pppoe-20M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('e.matenda@network.co.za', 'Cleartext-Password', ':=', 'EMR2024!');

-- #32 a.kadere@rachfort.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('a.kadere@rachfort.co.za', 'Cleartext-Password', ':=', 'AKR2024!');

-- #33 s.zingwe (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('s.zingwe', 'Cleartext-Password', ':=', 'TFR2024!');

-- #34 c.teya@network.co.za (expired-128k, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('c.teya@network.co.za', 'Cleartext-Password', ':=', 'CTR2024!');

-- #35 t.kanyongo@fortai.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('t.kanyongo@fortai.co.za', 'Cleartext-Password', ':=', 'TKF2025!');

-- #36 d.naki@rachfort.co.za (pppoe-5M, DISABLED)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('d.naki@rachfort.co.za', 'Cleartext-Password', ':=', 'DNR2024!');
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('d.naki@rachfort.co.za', 'Auth-Type', ':=', 'Reject');

-- #37 a.mvubu@network.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('a.mvubu@network.co.za', 'Cleartext-Password', ':=', 'AMR2024!');

-- #38 p.muzorembashop@fortai.co.za (expired-128k, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('p.muzorembashop@fortai.co.za', 'Cleartext-Password', ':=', 'PMF2025!');

-- #39 m.jera@fortai.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('m.jera@fortai.co.za', 'Cleartext-Password', ':=', 'MJF2025!');

-- #40 b.mapfumo@fortai.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('b.mapfumo@fortai.co.za', 'Cleartext-Password', ':=', 'BMF2025!');

-- #41 a.mauwo@fortai.co.za (expired-128k, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('a.mauwo@fortai.co.za', 'Cleartext-Password', ':=', 'AMF2024!');

-- #42 p.kupemba@fortai.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('p.kupemba@fortai.co.za', 'Cleartext-Password', ':=', 'PKF2025!');

-- #43 n.njoli@fortai.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('n.njoli@fortai.co.za', 'Cleartext-Password', ':=', 'NNF2025!');

-- #44 m.mwatsika@fortai.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('m.mwatsika@fortai.co.za', 'Cleartext-Password', ':=', 'MMF2025!');

-- #45 m.msweli@rachfort.co.za (pppoe-20M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('m.msweli@rachfort.co.za', 'Cleartext-Password', ':=', 'MMR2024!');

-- #46 g.laisi@fortai.co.za (pppoe-20M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('g.laisi@fortai.co.za', 'Cleartext-Password', ':=', 'GLF2025!');

-- #47 m.masike@fortai.co.za (pppoe-10M, DISABLED)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('m.masike@fortai.co.za', 'Cleartext-Password', ':=', 'MMR2024!');
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('m.masike@fortai.co.za', 'Auth-Type', ':=', 'Reject');

-- #53 b.mafukidze@fortai.co.za (pppoe-10M, active)
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('b.mafukidze@fortai.co.za', 'Cleartext-Password', ':=', 'BMF2025!');


-- ── STEP 3: User-to-group mappings (radusergroup) ──────────

INSERT INTO radusergroup (username, groupname, priority) VALUES ('n.nuraan@rachfort.co.za', 'pppoe-20M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('g.magondo@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('t.jebetwane@rachfort.co.za', 'expired-128k', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('f.saidi@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('s.tsoloane@rachfort.co.za', 'pppoe-20M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('p.lafukani@rachfort.co.za', 'pppoe-20M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('w.gwemure@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('b.kaitano@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('j.dzumbira@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('c.butchery@rachfort.co.za', 'expired-128k', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('a.manuel@fortai.co.za', 'pppoe-20M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('s.makarutse@network.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('t.tavenga@rachfort.co.za', 'expired-128k', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('i.mugwagwa@fortai.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('n.norushu@rachfort.co.za', 'expired-128k', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('b.ousmane@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('n.beza@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('s.nzvimbo@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('m.mwiwa@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('m.zingwe@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('c.dube@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('w.gwese@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('s.ndlovu@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('t.thlakala@fortai.co.za', 'pppoe-20M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('s.williams@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('p.ndlovu@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('p.cofa@rachfort.co.za', 'expired-128k', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('p.muzoremba@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('a.ndaradzi@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('p.manunure@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('andrew@rachfort.co.za', 'pppoe-20M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('e.matenda@network.co.za', 'pppoe-20M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('a.kadere@rachfort.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('s.zingwe', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('c.teya@network.co.za', 'expired-128k', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('t.kanyongo@fortai.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('d.naki@rachfort.co.za', 'pppoe-5M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('a.mvubu@network.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('p.muzorembashop@fortai.co.za', 'expired-128k', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('m.jera@fortai.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('b.mapfumo@fortai.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('a.mauwo@fortai.co.za', 'expired-128k', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('p.kupemba@fortai.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('n.njoli@fortai.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('m.mwatsika@fortai.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('m.msweli@rachfort.co.za', 'pppoe-20M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('g.laisi@fortai.co.za', 'pppoe-20M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('m.masike@fortai.co.za', 'pppoe-10M', 1);
INSERT INTO radusergroup (username, groupname, priority) VALUES ('b.mafukidze@fortai.co.za', 'pppoe-10M', 1);

-- ── STEP 4: Cleanup test user ───────────────────────────────
DELETE FROM radcheck WHERE username = 'testuser';

-- ============================================================
-- MIGRATION SUMMARY:
-- 48 PPPoE users provisioned
-- 6 disabled users have Auth-Type := Reject
-- 4 plan groups created (pppoe-20M, pppoe-10M, pppoe-5M, expired-128k)
-- Skipped: VPN/L2TP (49-52), test (48), hotspot (54)
-- ============================================================
