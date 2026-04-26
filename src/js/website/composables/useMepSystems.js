import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

export const SYSTEMS = [
    { color: 0xf07828, ro: 'Instalații Electrice',    en: 'Electrical Systems' },
    { color: 0x10d4d8, ro: 'Ventilație & Climatizare', en: 'HVAC & Climate'     },
    { color: 0x2888f0, ro: 'Instalații Sanitare',      en: 'Sanitary & Drainage' },
    { color: 0xe83030, ro: 'Stingere Incendiu',        en: 'Fire Suppression'   },
    { color: 0x9828e0, ro: 'BMS & Automatizare',       en: 'BMS & Automation'   },
];

export const ZONE_DEFAULTS = {
    A_xMin: -7.8,  A_xMax: -2.25, A_zMin: -3,   A_zMax: 1.9,  A_yMin: -1.12, A_yMax: -0.02,
    B_xMin: -2.25, B_xMax:  7.4,  B_zMin: -3.05, B_zMax: 4.3,  B_yMin: -1.12, B_yMax: -0.2,
    C_xMin: -2.25, C_xMax:  4.5,  C_zMin:  4.5,  C_zMax: 5.75, C_yMin: -1.12, C_yMax:  0.24,
};

// ─────────────────────────────────────────
// Primitive helpers
// ─────────────────────────────────────────

function lsp(a, b, n) {
    if (n < 1) return [];
    if (n === 1) return [(a + b) / 2];
    return Array.from({ length: n }, (_, i) => a + (b - a) * i / (n - 1));
}

function seg(pts, color, grp) {
    const flat = [];
    pts.forEach(([x, y, z]) => flat.push(x, y, z));
    const geo = new LineGeometry();
    geo.setPositions(flat);
    const mat = new LineMaterial({
        color,
        transparent: true,
        opacity: 0,
        linewidth: 1.4,
        resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    });
    const line = new Line2(geo, mat);
    line.computeLineDistances();
    line.userData.pts = flat;
    grp.add(line);
    return { geo, mat, nPts: pts.length, isLine: true, pts: flat };
}

function bx(x, y, z, w, h, d, color, grp) {
    const geo = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d));
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 });
    const ls = new THREE.LineSegments(geo, mat);
    ls.position.set(x, y, z);
    grp.add(ls);
    return { mat, isBox: true };
}

function cr(x, y, z, r, color, grp) {
    const pts = [];
    for (let i = 0; i <= 32; i++) {
        const a = i / 32 * Math.PI * 2;
        pts.push([x + r * Math.cos(a), y, z + r * Math.sin(a)]);
    }
    return seg(pts, color, grp);
}

function crV(x, y, z, r, axis, color, grp) {
    const pts = [];
    for (let i = 0; i <= 24; i++) {
        const a = i / 24 * Math.PI * 2;
        if (axis === 'z') pts.push([x + r * Math.cos(a), y + r * Math.sin(a), z]);
        else              pts.push([x, y + r * Math.sin(a), z + r * Math.cos(a)]);
    }
    return seg(pts, color, grp);
}

function ladderTray(x0, y, z0, x1, z1, w, color, grp, out) {
    const tw = w * 0.5;
    const dx = x1 - x0, dz = z1 - z0, len = Math.sqrt(dx * dx + dz * dz);
    const side = Math.abs(dx) > Math.abs(dz) ? 'x' : 'z';
    if (side === 'x') {
        out.push(seg([[x0, y, z0 - tw], [x1, y, z1 - tw]], color, grp));
        out.push(seg([[x0, y, z0 + tw], [x1, y, z1 + tw]], color, grp));
        const nRungs = Math.floor(len / 0.55);
        for (let i = 1; i < nRungs; i++) {
            const t = i / nRungs, rx = x0 + dx * t, rz = z0 + dz * t;
            out.push(seg([[rx, y, rz - tw], [rx, y, rz + tw]], color, grp));
        }
    } else {
        out.push(seg([[x0 - tw, y, z0], [x1 - tw, y, z1]], color, grp));
        out.push(seg([[x0 + tw, y, z0], [x1 + tw, y, z1]], color, grp));
        const nRungs = Math.floor(len / 0.55);
        for (let i = 1; i < nRungs; i++) {
            const t = i / nRungs, rx = x0 + dx * t, rz = z0 + dz * t;
            out.push(seg([[rx - tw, y, rz], [rx + tw, y, rz]], color, grp));
        }
    }
}

function duct(x0, y, z0, x1, z1, w, color, grp, out) {
    const tw = w * 0.5;
    const dx = x1 - x0, dz = z1 - z0;
    if (Math.abs(dx) > Math.abs(dz)) {
        out.push(seg([[x0, y, z0 - tw], [x1, y, z1 - tw]], color, grp));
        out.push(seg([[x0, y, z0 + tw], [x1, y, z1 + tw]], color, grp));
        out.push(seg([[x0, y, z0 - tw], [x0, y, z0 + tw]], color, grp));
        out.push(seg([[x1, y, z1 - tw], [x1, y, z1 + tw]], color, grp));
    } else {
        out.push(seg([[x0 - tw, y, z0], [x1 - tw, y, z1]], color, grp));
        out.push(seg([[x0 + tw, y, z0], [x1 + tw, y, z1]], color, grp));
        out.push(seg([[x0 - tw, y, z0], [x0 + tw, y, z0]], color, grp));
        out.push(seg([[x1 - tw, y, z1], [x1 + tw, y, z1]], color, grp));
    }
}

function pipe(x0, y, z0, x1, z1, color, grp, out) {
    out.push(seg([[x0, y, z0], [x1, y, z1]], color, grp));
    const dx = x1 - x0, dz = z1 - z0, len = Math.sqrt(dx * dx + dz * dz);
    const nJoints = Math.floor(len / 1.8);
    for (let i = 1; i <= nJoints; i++) {
        const t = i / (nJoints + 1), rx = x0 + dx * t, rz = z0 + dz * t;
        if (Math.abs(dx) > Math.abs(dz)) out.push(seg([[rx, y - 0.04, rz], [rx, y + 0.04, rz]], color, grp));
        else                              out.push(seg([[rx - 0.04, y, rz], [rx + 0.04, y, rz]], color, grp));
    }
}

function valve(x, y, z, r, axis, color, grp, out) {
    out.push(crV(x, y, z, r, axis, color, grp));
    if (axis === 'z') out.push(seg([[x - r, y, z], [x + r, y, z]], color, grp));
    else              out.push(seg([[x, y, z - r], [x, y, z + r]], color, grp));
}

function sprinkler(x, y, z, color, grp, out) {
    out.push(cr(x, y - 0.05, z, 0.11, color, grp));
    out.push(seg([[x - 0.11, y - 0.05, z], [x + 0.11, y - 0.05, z]], color, grp));
    out.push(seg([[x, y - 0.05, z - 0.11], [x, y - 0.05, z + 0.11]], color, grp));
    out.push(seg([[x, y, z], [x, y - 0.05, z]], color, grp));
    out.push(cr(x, y - 0.02, z, 0.04, color, grp));
}

function floorDrain(x, y, z, color, grp, out) {
    out.push(bx(x, y + 0.01, z, 0.2, 0.02, 0.2, color, grp));
    out.push(bx(x, y + 0.015, z, 0.12, 0.02, 0.12, color, grp));
    out.push(seg([[x - 0.09, y + 0.02, z], [x + 0.09, y + 0.02, z]], color, grp));
    out.push(seg([[x, y + 0.02, z - 0.09], [x, y + 0.02, z + 0.09]], color, grp));
}

function smokeDetector(x, y, z, color, grp, out) {
    out.push(cr(x, y, z, 0.1, color, grp));
    out.push(cr(x, y, z, 0.05, color, grp));
    out.push(bx(x, y - 0.02, z, 0.1, 0.04, 0.1, color, grp));
}

function callPoint(x, y, z, color, grp, out) {
    out.push(bx(x, y, z, 0.14, 0.18, 0.06, color, grp));
    out.push(seg([[x - 0.07, y + 0.09, z + 0.04], [x + 0.07, y - 0.09, z + 0.04]], color, grp));
}

function switchboard(x, y, z, w, h, d, nBreakers, color, grp, out) {
    out.push(bx(x, y, z, w, h, d, color, grp));
    const bw = w * 0.7, by2 = y + h * 0.35;
    [-0.06, 0, 0.06].forEach(dz2 => {
        out.push(seg([[x - bw / 2, by2, z + dz2], [x + bw / 2, by2, z + dz2]], color, grp));
    });
    const cols = Math.ceil(nBreakers / 2), brkW = (w * 0.7) / cols;
    for (let i = 0; i < cols; i++) {
        const bx2 = x - w * 0.35 + brkW * (i + 0.5);
        out.push(bx(bx2, y - h * 0.1, z + d * 0.45, brkW * 0.7, h * 0.4, 0.04, color, grp));
        if (i < cols - nBreakers % cols || nBreakers % cols === 0)
            out.push(bx(bx2, y - h * 0.1, z - d * 0.45, brkW * 0.7, h * 0.4, 0.04, color, grp));
    }
    out.push(bx(x, y, z + d * 0.5 + 0.01, 0.06, 0.06, 0.02, color, grp));
}

function ahu(x, y, z, w, h, d, color, grp, out) {
    out.push(bx(x, y, z, w, h, d, color, grp));
    const nLines = 6, fw = w * 0.8;
    for (let i = 0; i <= nLines; i++) {
        const fz = z + d * 0.5 + 0.01, fy = y - h * 0.4 + i * (h * 0.8 / nLines);
        out.push(seg([[x - fw / 2, fy, fz], [x + fw / 2, fy, fz]], color, grp));
    }
    const fanX = x - w * 0.25, fanZ = z - d * 0.5 - 0.01;
    out.push(crV(fanX, y, fanZ, h * 0.3, 'z', color, grp));
    [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(a => {
        out.push(seg([[fanX, y, fanZ], [fanX + h * 0.25 * Math.cos(a), y + h * 0.25 * Math.sin(a), fanZ]], color, grp));
    });
    out.push(seg([[x + w * 0.5, y + h * 0.15, z], [x + w * 0.5 + 0.3, y + h * 0.15, z]], color, grp));
    out.push(seg([[x + w * 0.5, y - h * 0.15, z], [x + w * 0.5 + 0.3, y - h * 0.15, z]], color, grp));
}

function fcu(x, y, z, color, grp, out) {
    out.push(bx(x, y, z, 0.8, 0.18, 0.5, color, grp));
    for (let i = 0; i < 5; i++) {
        const gz = z - 0.22 + i * 0.11;
        out.push(seg([[x - 0.38, y - 0.06, gz], [x + 0.38, y - 0.06, gz]], color, grp));
    }
    out.push(seg([[x - 0.2, y + 0.09, z], [x - 0.2, y + 0.2, z]], color, grp));
    out.push(seg([[x + 0.2, y + 0.09, z], [x + 0.2, y + 0.2, z]], color, grp));
}

function diffuser(x, y, z, color, grp, out) {
    out.push(bx(x, y, z, 0.5, 0.04, 0.5, color, grp));
    out.push(bx(x, y + 0.01, z, 0.35, 0.04, 0.35, color, grp));
    out.push(seg([[x - 0.24, y + 0.02, z], [x + 0.24, y + 0.02, z]], color, grp));
    out.push(seg([[x, y + 0.02, z - 0.24], [x, y + 0.02, z + 0.24]], color, grp));
}

function manhole(x, y, z, color, grp, out) {
    out.push(bx(x, y + 0.01, z, 0.35, 0.02, 0.35, color, grp));
    out.push(seg([[x - 0.17, y + 0.02, z - 0.17], [x + 0.17, y + 0.02, z + 0.17]], color, grp));
    out.push(seg([[x + 0.17, y + 0.02, z - 0.17], [x - 0.17, y + 0.02, z + 0.17]], color, grp));
    out.push(cr(x, y + 0.02, z, 0.1, color, grp));
}

function firePump(x, y, z, color, grp, out) {
    out.push(bx(x, y, z, 0.55, 0.45, 0.38, color, grp));
    out.push(bx(x + 0.42, y, z, 0.28, 0.32, 0.32, color, grp));
    out.push(seg([[x + 0.275, y, z], [x + 0.28, y, z]], color, grp));
    valve(x - 0.28, y + 0.08, z, 0.07, 'z', color, grp, out);
    valve(x, y + 0.22, z, 0.07, 'x', color, grp, out);
    out.push(crV(x, y + 0.25, z - 0.19, 0.06, 'z', color, grp));
    out.push(seg([[x, y + 0.22, z - 0.19], [x, y + 0.31, z - 0.19]], color, grp));
    out.push(bx(x + 0.14, y - 0.23, z, 0.84, 0.04, 0.44, color, grp));
}

function bmsController(x, y, z, color, grp, out) {
    out.push(bx(x, y, z, 0.22, 0.55, 0.12, color, grp));
    for (let i = 0; i < 5; i++) out.push(bx(x - 0.07 + i * 0.035, y + 0.18, z + 0.065, 0.02, 0.02, 0.02, color, grp));
    for (let i = 0; i < 8; i++) {
        const ty = y - 0.05 - i * 0.045;
        out.push(seg([[x - 0.08, ty, z + 0.065], [x + 0.08, ty, z + 0.065]], color, grp));
    }
    out.push(seg([[x - 0.09, y + 0.05, z + 0.06], [x + 0.09, y + 0.05, z + 0.06]], color, grp));
}

// ─────────────────────────────────────────
// Route builders
// ─────────────────────────────────────────

function electricRoutes(g, A, B, C) {
    const c = 0xf07828, out = [];
    const cha = A.ceil - 0.13, chb = B.ceil - 0.13, chc = C.ceil - 0.13;
    const tw = 0.14;

    const pz = A.zMin + (A.zMax - A.zMin) * 0.5;
    switchboard(A.xMin + 0.1, (A.ceil + A.fl) / 2, pz, 0.12, 1.1, 0.65, 6, c, g, out);
    out.push(seg([[A.xMin + 0.1, A.fl + 0.25, pz], [A.xMin + 0.1, cha, pz]], c, g));
    ladderTray(A.xMin + 0.1, cha, pz, A.xMin + 0.1, A.zMin + 0.25, tw, c, g, out);
    ladderTray(A.xMin + 0.1, cha, pz, A.xMin + 0.1, A.zMax - 0.25, tw, c, g, out);
    const azs = lsp(A.zMin + 0.4, A.zMax - 0.4, 4);
    azs.forEach(z => ladderTray(A.xMin + 0.15, cha, z, A.xMax - 0.2, z, tw, c, g, out));
    const axs = lsp(A.xMin + 0.6, A.xMax - 0.4, 3);
    axs.forEach(x => azs.forEach(z => {
        out.push(seg([[x, cha, z], [x, A.fl + 0.06, z]], c, g));
        out.push(bx(x, A.fl + 0.35, z + 0.05, 0.12, 0.09, 0.06, c, g));
        out.push(seg([[x - 0.04, A.fl + 0.35, z + 0.08], [x + 0.04, A.fl + 0.35, z + 0.08]], c, g));
        out.push(seg([[x, A.fl + 0.31, z + 0.08], [x, A.fl + 0.39, z + 0.08]], c, g));
        out.push(bx(x, cha - 0.04, z, 0.16, 0.08, 0.12, c, g));
    }));
    switchboard(A.xMax - 0.12, (A.ceil + A.fl) / 2, A.zMax - 0.5, 0.08, 0.7, 0.45, 4, c, g, out);

    const jz_ab = (A.zMin + A.zMax) / 2;
    ladderTray(A.xMax, cha, jz_ab, B.xMin, jz_ab, tw, c, g, out);

    const bmz = (B.zMin + B.zMax) / 2;
    ladderTray(B.xMin, chb, jz_ab, B.xMax - 0.2, jz_ab, tw, c, g, out);
    ladderTray(B.xMin, chb, B.zMin + 0.35, B.xMax - 0.2, B.zMin + 0.35, tw, c, g, out);
    ladderTray(B.xMin, chb, B.zMax - 0.35, B.xMax - 0.2, B.zMax - 0.35, tw, c, g, out);
    const bxs = lsp(B.xMin + 0.5, B.xMax - 0.6, 6);
    const bzs = lsp(B.zMin + 0.4, B.zMax - 0.4, 5);
    bxs.forEach(x => ladderTray(x, chb, B.zMin + 0.3, x, B.zMax - 0.3, tw, c, g, out));
    bzs.forEach(z => ladderTray(B.xMin + 0.1, chb, z, B.xMax - 0.25, z, tw, c, g, out));
    bxs.forEach(x => bzs.forEach(z => {
        out.push(seg([[x, chb, z], [x, B.fl + 0.06, z]], c, g));
        out.push(bx(x, B.fl + 0.35, z + 0.05, 0.12, 0.09, 0.06, c, g));
        out.push(seg([[x - 0.04, B.fl + 0.35, z + 0.08], [x + 0.04, B.fl + 0.35, z + 0.08]], c, g));
        out.push(seg([[x, B.fl + 0.31, z + 0.08], [x, B.fl + 0.39, z + 0.08]], c, g));
        out.push(bx(x, chb - 0.04, z, 0.16, 0.08, 0.12, c, g));
    }));
    switchboard(B.xMax - 0.1, (B.ceil + B.fl) / 2, bmz, 0.12, 1.0, 0.6, 8, c, g, out);
    out.push(seg([[B.xMax - 0.1, B.fl + 0.25, bmz], [B.xMax - 0.1, chb, bmz]], c, g));

    const bcx = (C.xMin + C.xMax) / 2;
    ladderTray(bcx, chb, B.zMax, bcx, C.zMin, tw, c, g, out);

    const cmz = (C.zMin + C.zMax) / 2;
    ladderTray(C.xMin + 0.2, chc, cmz, C.xMax - 0.2, cmz, tw, c, g, out);
    const cxs = lsp(C.xMin + 0.5, C.xMax - 0.5, 4);
    cxs.forEach(x => {
        ladderTray(x, chc, C.zMin + 0.2, x, C.zMax - 0.2, tw, c, g, out);
        out.push(seg([[x, chc, cmz], [x, C.fl + 0.06, cmz]], c, g));
        out.push(bx(x, C.fl + 0.35, cmz + 0.05, 0.12, 0.09, 0.06, c, g));
        out.push(seg([[x - 0.04, C.fl + 0.35, cmz + 0.08], [x + 0.04, C.fl + 0.35, cmz + 0.08]], c, g));
    });
    switchboard(C.xMin + 0.1, (C.ceil + C.fl) / 2, cmz, 0.1, 0.8, 0.5, 4, c, g, out);

    return out;
}

function hvacRoutes(g, A, B, C) {
    const c = 0x10d4d8, out = [];
    const cha = A.ceil - 0.22, chb = B.ceil - 0.22, chc = C.ceil - 0.22;
    const dw = 0.3;

    const ahuX = B.xMin + (B.xMax - B.xMin) * 0.3, ahuZ = (B.zMin + B.zMax) / 2;
    ahu(ahuX, B.ceil + 0.18, ahuZ, 2.2, 0.52, 1.5, c, g, out);
    out.push(seg([[ahuX, B.ceil + 0.0, ahuZ], [ahuX, chb, ahuZ]], c, g));
    duct(B.xMin + 0.2, chb, ahuZ, B.xMax - 0.2, ahuZ, dw, c, g, out);
    duct(ahuX, chb, B.zMin + 0.2, ahuX, B.zMax - 0.2, dw, c, g, out);
    const bxs = lsp(B.xMin + 0.6, B.xMax - 0.6, 5);
    const bzs = lsp(B.zMin + 0.5, B.zMax - 0.5, 4);
    bxs.forEach(x => duct(x, chb, B.zMin + 0.25, x, B.zMax - 0.25, dw * 0.7, c, g, out));
    bzs.forEach(z => duct(B.xMin + 0.2, chb, z, B.xMax - 0.2, z, dw * 0.7, c, g, out));
    bxs.forEach(x => bzs.forEach(z => {
        diffuser(x, chb, z, c, g, out);
        fcu(x, chb + 0.12, z, c, g, out);
    }));
    [B.zMin + 0.5, B.zMax - 0.5].forEach(z => {
        out.push(bx(B.xMax - 0.02, (chb + B.fl) / 2, z, 0.04, 0.4, 0.6, c, g));
        for (let i = 0; i < 5; i++) out.push(seg([[B.xMax, chb - i * 0.08, z - 0.28], [B.xMax, chb - i * 0.08, z + 0.28]], c, g));
    });

    const jz = (A.zMin + A.zMax) / 2;
    duct(B.xMin, chb, jz, A.xMax, jz, dw * 0.8, c, g, out);
    ahu(A.xMax - 0.7, A.ceil + 0.15, jz, 1.6, 0.38, 1.1, c, g, out);
    out.push(seg([[A.xMax - 0.7, A.ceil + 0.0, jz], [A.xMax - 0.7, cha, jz]], c, g));
    duct(A.xMin + 0.2, cha, jz, A.xMax - 0.3, jz, dw, c, g, out);
    duct(A.xMax - 0.7, cha, A.zMin + 0.2, A.xMax - 0.7, A.zMax - 0.2, dw * 0.7, c, g, out);
    const axs = lsp(A.xMin + 0.6, A.xMax - 0.4, 3);
    const azs = lsp(A.zMin + 0.5, A.zMax - 0.5, 3);
    axs.forEach(x => duct(x, cha, A.zMin + 0.25, x, A.zMax - 0.25, dw * 0.6, c, g, out));
    azs.forEach(z => duct(A.xMin + 0.2, cha, z, A.xMax - 0.2, z, dw * 0.6, c, g, out));
    axs.forEach(x => azs.forEach(z => {
        diffuser(x, cha, z, c, g, out);
        fcu(x, cha + 0.1, z, c, g, out);
    }));

    const bcx = C.xMin + (C.xMax - C.xMin) * 0.4;
    duct(bcx, chb, B.zMax, bcx, C.zMin, dw * 0.7, c, g, out);
    ahu(bcx, C.ceil + 0.14, (C.zMin + C.zMax) / 2, 1.2, 0.3, 0.8, c, g, out);
    out.push(seg([[bcx, C.ceil + 0.0, (C.zMin + C.zMax) / 2], [bcx, chc, (C.zMin + C.zMax) / 2]], c, g));
    duct(C.xMin + 0.2, chc, (C.zMin + C.zMax) / 2, C.xMax - 0.2, (C.zMin + C.zMax) / 2, dw * 0.6, c, g, out);
    lsp(C.xMin + 0.5, C.xMax - 0.5, 3).forEach(x => {
        diffuser(x, chc, (C.zMin + C.zMax) / 2, c, g, out);
        fcu(x, chc + 0.1, (C.zMin + C.zMax) / 2, c, g, out);
    });

    return out;
}

function sanitaryRoutes(g, A, B, C) {
    const c = 0x2888f0, out = [];
    const fy = 0.05;

    const psX = B.xMax - 0.15, psZ = (B.zMin + B.zMax) / 2;
    firePump(psX, B.fl + 0.22, psZ, c, g, out);
    pipe(B.xMin + 0.2, B.fl + fy, psZ, B.xMax - 0.3, psZ, c, g, out);
    pipe(psX, B.fl + fy, B.zMin + 0.2, psX, B.zMax - 0.2, c, g, out);
    const bxs = lsp(B.xMin + 0.5, B.xMax - 0.5, 5);
    const bzs = lsp(B.zMin + 0.4, B.zMax - 0.4, 4);
    bxs.forEach(x => pipe(x, B.fl + fy, B.zMin + 0.25, x, B.zMax - 0.25, c, g, out));
    bzs.forEach(z => pipe(B.xMin + 0.2, B.fl + fy, z, B.xMax - 0.25, z, c, g, out));
    bxs.forEach(x => bzs.forEach(z => floorDrain(x, B.fl, z, c, g, out)));
    [B.xMin + 0.5, (B.xMin + B.xMax) / 2, B.xMax - 0.5].forEach(x => {
        manhole(x, B.fl, B.zMin + 0.3, c, g, out);
    });
    bzs.forEach(z => valve(B.xMin + 0.3, B.fl + fy + 0.06, z, 0.07, 'x', c, g, out));

    const jz = (A.zMin + A.zMax) / 2;
    pipe(A.xMax, A.fl + fy, jz, A.xMin + 0.2, jz, c, g, out);
    const axs = lsp(A.xMin + 0.5, A.xMax - 0.3, 3);
    const azs = lsp(A.zMin + 0.4, A.zMax - 0.4, 3);
    axs.forEach(x => pipe(x, A.fl + fy, A.zMin + 0.25, x, A.zMax - 0.25, c, g, out));
    azs.forEach(z => pipe(A.xMin + 0.2, A.fl + fy, z, A.xMax - 0.15, z, c, g, out));
    axs.forEach(x => azs.forEach(z => floorDrain(x, A.fl, z, c, g, out)));
    azs.forEach(z => manhole((A.xMin + A.xMax) / 2, A.fl, z, c, g, out));

    const bcx = (C.xMin + C.xMax) / 2;
    pipe(bcx, C.fl + fy, B.zMax, bcx, C.zMin, c, g, out);
    pipe(C.xMin + 0.2, C.fl + fy, (C.zMin + C.zMax) / 2, C.xMax - 0.2, (C.zMin + C.zMax) / 2, c, g, out);
    lsp(C.xMin + 0.5, C.xMax - 0.5, 3).forEach(x => {
        pipe(x, C.fl + fy, C.zMin + 0.15, x, C.zMax - 0.15, c, g, out);
        floorDrain(x, C.fl, (C.zMin + C.zMax) / 2, c, g, out);
        manhole(x, C.fl, C.zMin + 0.3, c, g, out);
    });

    return out;
}

function fireRoutes(g, A, B, C) {
    const c = 0xe83030, out = [];
    const cha = A.ceil - 0.2, chb = B.ceil - 0.2, chc = C.ceil - 0.2;

    firePump(A.xMin + 0.15, A.fl + 0.25, A.zMin + 0.5, c, g, out);
    out.push(seg([[A.xMin + 0.15, A.fl + 0.45, A.zMin + 0.5], [A.xMin + 0.15, cha, A.zMin + 0.5]], c, g));
    out.push(seg([[A.xMin + 0.15, cha, A.zMin + 0.5], [A.xMin + 0.15, cha, A.zMax - 0.2]], c, g));
    out.push(seg([[A.xMin + 0.15, cha, A.zMax - 0.2], [A.xMax - 0.2, cha, A.zMax - 0.2]], c, g));
    out.push(seg([[A.xMax - 0.2, cha, A.zMax - 0.2], [A.xMax - 0.2, cha, A.zMin + 0.2]], c, g));
    out.push(seg([[A.xMax - 0.2, cha, A.zMin + 0.2], [A.xMin + 0.15, cha, A.zMin + 0.2]], c, g));
    out.push(seg([[A.xMin + 0.15, cha, A.zMin + 0.5], [A.xMin + 0.15, cha, A.zMin + 0.2]], c, g));
    valve(A.xMin + 0.15, cha, A.zMin + 0.6, 0.08, 'x', c, g, out);
    valve(A.xMax - 0.2, cha, A.zMin + 0.5, 0.08, 'z', c, g, out);
    const azs = lsp(A.zMin + 0.4, A.zMax - 0.4, 3);
    const axs = lsp(A.xMin + 0.5, A.xMax - 0.4, 3);
    azs.forEach(z => out.push(seg([[A.xMin + 0.2, cha, z], [A.xMax - 0.25, cha, z]], c, g)));
    axs.forEach(x => out.push(seg([[x, cha, A.zMin + 0.25], [x, cha, A.zMax - 0.25]], c, g)));
    axs.forEach(x => azs.forEach(z => sprinkler(x, cha, z, c, g, out)));
    lsp(A.xMin + 1, A.xMax - 0.5, 3).forEach(x =>
        lsp(A.zMin + 0.5, A.zMax - 0.5, 2).forEach(z => smokeDetector(x, A.ceil, z, c, g, out))
    );
    [[A.xMin + 0.2, A.zMax - 0.3], [A.xMax - 0.3, A.zMin + 0.4]].forEach(([x, z]) =>
        callPoint(x, (A.ceil + A.fl) / 2, z + 0.06, c, g, out)
    );

    const jz = (A.zMin + A.zMax) / 2;
    pipe(A.xMax, A.fl + 0.4, jz, B.xMin, jz, c, g, out);
    out.push(seg([[B.xMin, A.fl + 0.4, jz], [B.xMin, chb, jz]], c, g));
    out.push(seg([[B.xMin, chb, B.zMin + 0.2], [B.xMax - 0.2, chb, B.zMin + 0.2]], c, g));
    out.push(seg([[B.xMax - 0.2, chb, B.zMin + 0.2], [B.xMax - 0.2, chb, B.zMax - 0.2]], c, g));
    out.push(seg([[B.xMax - 0.2, chb, B.zMax - 0.2], [B.xMin, chb, B.zMax - 0.2]], c, g));
    out.push(seg([[B.xMin, chb, B.zMax - 0.2], [B.xMin, chb, B.zMin + 0.2]], c, g));
    valve(B.xMin, chb, (B.zMin + B.zMax) / 2, 0.09, 'z', c, g, out);
    valve(B.xMax - 0.2, chb, (B.zMin + B.zMax) / 2, 0.09, 'z', c, g, out);
    const bxs2 = lsp(B.xMin + 0.5, B.xMax - 0.5, 5);
    const bzs2 = lsp(B.zMin + 0.5, B.zMax - 0.5, 4);
    bxs2.forEach(x => out.push(seg([[x, chb, B.zMin + 0.25], [x, chb, B.zMax - 0.25]], c, g)));
    bzs2.forEach(z => out.push(seg([[B.xMin + 0.2, chb, z], [B.xMax - 0.25, chb, z]], c, g)));
    bxs2.forEach(x => bzs2.forEach(z => sprinkler(x, chb, z, c, g, out)));
    lsp(B.xMin + 1, B.xMax - 0.5, 4).forEach(x =>
        lsp(B.zMin + 0.5, B.zMax - 0.5, 3).forEach(z => smokeDetector(x, B.ceil, z, c, g, out))
    );
    [[B.xMin + 0.2, B.zMin + 0.4], [B.xMax - 0.3, B.zMin + 0.4], [B.xMin + 0.2, B.zMax - 0.4], [B.xMax - 0.3, B.zMax - 0.4]].forEach(([x, z]) =>
        callPoint(x, (B.ceil + B.fl) / 2, z + 0.06, c, g, out)
    );

    const bcx = C.xMin + (C.xMax - C.xMin) * 0.5;
    pipe(bcx, B.fl + 0.4, B.zMax, bcx, C.zMin, c, g, out);
    out.push(seg([[bcx, B.fl + 0.4, C.zMin], [bcx, chc, C.zMin + 0.2]], c, g));
    out.push(seg([[C.xMin + 0.2, chc, C.zMin + 0.2], [C.xMax - 0.2, chc, C.zMin + 0.2]], c, g));
    out.push(seg([[C.xMin + 0.2, chc, C.zMax - 0.2], [C.xMax - 0.2, chc, C.zMax - 0.2]], c, g));
    out.push(seg([[C.xMin + 0.2, chc, C.zMin + 0.2], [C.xMin + 0.2, chc, C.zMax - 0.2]], c, g));
    out.push(seg([[C.xMax - 0.2, chc, C.zMin + 0.2], [C.xMax - 0.2, chc, C.zMax - 0.2]], c, g));
    lsp(C.xMin + 0.5, C.xMax - 0.5, 3).forEach(x => {
        out.push(seg([[x, chc, C.zMin + 0.2], [x, chc, C.zMax - 0.2]], c, g));
        sprinkler(x, chc, (C.zMin + C.zMax) / 2, c, g, out);
        smokeDetector(x, C.ceil, (C.zMin + C.zMax) / 2, c, g, out);
    });
    callPoint(C.xMin + 0.3, (C.ceil + C.fl) / 2, (C.zMin + C.zMax) / 2 + 0.06, c, g, out);

    return out;
}

function bmsRoutes(g, A, B, C) {
    const c = 0x9828e0, out = [];
    const cha = A.ceil - 0.05, chb = B.ceil - 0.05, chc = C.ceil - 0.05;
    const tw = 0.06;

    bmsController(A.xMin + 0.1, (A.ceil + A.fl) / 2 + 0.1, A.zMax - 0.6, c, g, out);
    out.push(seg([[A.xMin + 0.1, A.fl + 0.3, A.zMax - 0.6], [A.xMin + 0.1, cha, A.zMax - 0.6]], c, g));
    out.push(seg([[A.xMin + 0.1, cha, A.zMax - 0.6], [A.xMin + 0.1, cha, A.zMin + 0.25]], c, g));
    out.push(seg([[A.xMin + 0.1 + tw, cha, A.zMax - 0.6], [A.xMin + 0.1 + tw, cha, A.zMin + 0.25]], c, g));
    const azs = lsp(A.zMin + 0.4, A.zMax - 0.4, 3);
    const axs = lsp(A.xMin + 0.6, A.xMax - 0.4, 3);
    azs.forEach(z => {
        out.push(seg([[A.xMin + 0.1, cha, z], [A.xMax - 0.2, cha, z]], c, g));
        out.push(seg([[A.xMin + 0.1, cha + tw, z], [A.xMax - 0.2, cha + tw, z]], c, g));
    });
    axs.forEach(x => {
        out.push(seg([[x, cha, A.zMin + 0.25], [x, cha, A.zMax - 0.25]], c, g));
        out.push(seg([[x + tw, cha, A.zMin + 0.25], [x + tw, cha, A.zMax - 0.25]], c, g));
    });
    axs.forEach(x => azs.forEach(z => {
        out.push(bx(x, cha - 0.06, z, 0.14, 0.14, 0.14, c, g));
        out.push(seg([[x, cha, z], [x, cha - 0.06, z]], c, g));
        out.push(seg([[x - 0.04, cha - 0.07, z - 0.07], [x - 0.04, cha - 0.07, z + 0.07]], c, g));
        out.push(cr(x + 0.02, cha - 0.07, z, 0.04, c, g));
    }));

    const jz = (A.zMin + A.zMax) / 2;
    out.push(seg([[A.xMax, cha, jz], [B.xMin, chb, jz]], c, g));
    out.push(seg([[A.xMax, cha + tw, jz], [B.xMin, chb + tw, jz]], c, g));
    out.push(bx(B.xMin + 0.4, chb - 0.04, jz, 0.35, 0.08, 0.2, c, g));
    for (let i = 0; i < 8; i++) out.push(bx(B.xMin + 0.24 + i * 0.042, chb - 0.04, jz + 0.105, 0.03, 0.04, 0.02, c, g));
    const bmz = (B.zMin + B.zMax) / 2;
    out.push(seg([[B.xMin, chb, jz], [B.xMax - 0.2, chb, jz]], c, g));
    out.push(seg([[B.xMin, chb + tw, jz], [B.xMax - 0.2, chb + tw, jz]], c, g));
    out.push(seg([[B.xMin, chb, B.zMin + 0.25], [B.xMax - 0.2, chb, B.zMin + 0.25]], c, g));
    out.push(seg([[B.xMin, chb, B.zMax - 0.25], [B.xMax - 0.2, chb, B.zMax - 0.25]], c, g));
    const bxs = lsp(B.xMin + 0.5, B.xMax - 0.5, 6);
    const bzs = lsp(B.zMin + 0.4, B.zMax - 0.4, 5);
    bxs.forEach(x => {
        out.push(seg([[x, chb, B.zMin + 0.2], [x, chb, B.zMax - 0.2]], c, g));
        out.push(seg([[x + tw, chb, B.zMin + 0.2], [x + tw, chb, B.zMax - 0.2]], c, g));
    });
    bzs.forEach(z => {
        out.push(seg([[B.xMin, chb, z], [B.xMax - 0.2, chb, z]], c, g));
        out.push(seg([[B.xMin, chb + tw, z], [B.xMax - 0.2, chb + tw, z]], c, g));
    });
    bxs.forEach(x => bzs.slice(0, 4).forEach(z => {
        out.push(bx(x, chb - 0.06, z, 0.13, 0.13, 0.13, c, g));
        out.push(seg([[x, chb, z], [x, chb - 0.06, z]], c, g));
        out.push(seg([[x - 0.04, chb - 0.07, z - 0.06], [x - 0.04, chb - 0.07, z + 0.06]], c, g));
        out.push(cr(x + 0.02, chb - 0.07, z, 0.04, c, g));
    }));
    bmsController(B.xMax - 0.12, (B.ceil + B.fl) / 2 + 0.05, bmz, c, g, out);

    const bcx = (C.xMin + C.xMax) / 2;
    out.push(seg([[bcx, chb, B.zMax], [bcx, chc, C.zMin]], c, g));
    out.push(seg([[bcx + tw, chb, B.zMax], [bcx + tw, chc, C.zMin]], c, g));
    out.push(seg([[C.xMin + 0.2, chc, (C.zMin + C.zMax) / 2], [C.xMax - 0.2, chc, (C.zMin + C.zMax) / 2]], c, g));
    lsp(C.xMin + 0.5, C.xMax - 0.5, 3).forEach(x => {
        out.push(seg([[x, chc, C.zMin + 0.15], [x, chc, C.zMax - 0.15]], c, g));
        out.push(bx(x, chc - 0.06, (C.zMin + C.zMax) / 2, 0.12, 0.12, 0.12, c, g));
        out.push(seg([[x, chc, (C.zMin + C.zMax) / 2], [x, chc - 0.06, (C.zMin + C.zMax) / 2]], c, g));
        out.push(cr(x, chc - 0.07, (C.zMin + C.zMax) / 2, 0.04, c, g));
    });
    bmsController(C.xMax - 0.12, (C.ceil + C.fl) / 2, (C.zMin + C.zMax) / 2, c, g, out);

    return out;
}

// ─────────────────────────────────────────
// Public composable
// ─────────────────────────────────────────

export function useMepSystems() {
    const sysGroups = [];
    let built = false;

    function getZones(zoneVals) {
        const v = zoneVals;
        return {
            A: { xMin: v.A_xMin, xMax: v.A_xMax, zMin: v.A_zMin, zMax: v.A_zMax, ceil: v.A_yMax, fl: v.A_yMin },
            B: { xMin: v.B_xMin, xMax: v.B_xMax, zMin: v.B_zMin, zMax: v.B_zMax, ceil: v.B_yMax, fl: v.B_yMin },
            C: { xMin: v.C_xMin, xMax: v.C_xMax, zMin: v.C_zMin, zMax: v.C_zMax, ceil: v.C_yMax, fl: v.C_yMin },
        };
    }

    function build(scene, zoneVals = ZONE_DEFAULTS) {
        if (built) return;
        built = true;
        const { A, B, C } = getZones(zoneVals);
        const builders = [electricRoutes, hvacRoutes, sanitaryRoutes, fireRoutes, bmsRoutes];
        builders.forEach((fn, i) => {
            const g = new THREE.Group();
            scene.add(g);
            sysGroups.push(g);
            try {
                g.userData.items = fn(g, A, B, C);
            } catch (e) {
                console.error('MEP system', i, 'error:', e.message);
                g.userData.items = [];
            }
        });
    }

    function reset() {
        sysGroups.forEach(g => g.traverse(o => {
            if (o.material) o.material.opacity = 0;
            if (o.geometry && o.userData && o.userData.pts) {
                const p = o.userData.pts;
                const collapsed = new Float32Array(p.length);
                for (let i = 0; i < p.length; i += 3) {
                    collapsed[i] = p[0]; collapsed[i + 1] = p[1]; collapsed[i + 2] = p[2];
                }
                o.geometry.setPositions(collapsed);
            }
        }));
    }

    function dispose(scene) {
        sysGroups.forEach(g => {
            g.traverse(o => {
                if (o.geometry) o.geometry.dispose();
                if (o.material) o.material.dispose();
            });
            scene.remove(g);
        });
        sysGroups.length = 0;
        built = false;
    }

    return { build, reset, sysGroups, dispose };
}
