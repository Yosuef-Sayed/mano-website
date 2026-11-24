import "server-only";
import net from "net";

/** True only for globally routable unicast addresses. Blocks loopback, private, link-local, metadata, CGNAT, multicast, documentation and reserved ranges. */
export function isPublicIp(addr: string): boolean {
  const v = net.isIP(addr);
  if (v === 4) return isPublicV4(addr);
  if (v === 6) return isPublicV6(addr);
  return false;
}

function v4ToInt(a: string) {
  return a.split(".").reduce((n, o) => (n << 8) + Number(o), 0) >>> 0;
}
const V4_BLOCKED: [string, number][] = [
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8], ["169.254.0.0", 16], ["172.16.0.0", 12],
  ["192.0.0.0", 24], ["192.0.2.0", 24], ["192.88.99.0", 24], ["192.168.0.0", 16], ["198.18.0.0", 15], ["198.51.100.0", 24],
  ["203.0.113.0", 24], ["224.0.0.0", 4], ["240.0.0.0", 4],
];
function isPublicV4(a: string) {
  const n = v4ToInt(a);
  return !V4_BLOCKED.some(([base, bits]) => {
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    return (n & mask) === (v4ToInt(base) & mask);
  });
}

function expandV6(a: string): number[] | null {
  let s = a.toLowerCase().split("%")[0];
  // Embedded IPv4 tail (e.g. ::ffff:1.2.3.4)
  const v4 = s.match(/(\d+\.\d+\.\d+\.\d+)$/);
  if (v4) {
    const n = v4ToInt(v4[1]);
    s = s.slice(0, -v4[1].length) + `${(n >>> 16).toString(16)}:${(n & 0xffff).toString(16)}`;
  }
  const [head, tail] = s.split("::");
  const h = head ? head.split(":") : [];
  const t = tail !== undefined ? (tail ? tail.split(":") : []) : [];
  const fill = s.includes("::") ? 8 - h.length - t.length : 0;
  const parts = [...h, ...Array(fill).fill("0"), ...t].map((x) => parseInt(x || "0", 16));
  return parts.length === 8 && parts.every((x) => !Number.isNaN(x)) ? parts : null;
}
function isPublicV6(a: string) {
  const p = expandV6(a);
  if (!p) return false;
  if (p.every((x) => x === 0)) return false; // ::
  if (p.slice(0, 7).every((x) => x === 0) && p[7] === 1) return false; // ::1
  if (p.slice(0, 5).every((x) => x === 0) && p[5] === 0xffff) {
    return isPublicV4(`${p[6] >> 8}.${p[6] & 255}.${p[7] >> 8}.${p[7] & 255}`); // IPv4-mapped
  }
  if ((p[0] & 0xfe00) === 0xfc00) return false; // fc00::/7 unique local
  if ((p[0] & 0xffc0) === 0xfe80) return false; // fe80::/10 link-local
  if ((p[0] & 0xff00) === 0xff00) return false; // multicast
  if (p[0] === 0x2001 && p[1] === 0x0db8) return false; // documentation
  if (p[0] === 0x0064 && p[1] === 0xff9b) return false; // NAT64
  if (p[0] === 0x0100 && p[1] === 0 && p[2] === 0 && p[3] === 0) return false; // discard
  if (p[0] === 0x2002) return false; // 6to4 (can embed private v4)
  return (p[0] & 0xe000) === 0x2000; // only global unicast 2000::/3
}
