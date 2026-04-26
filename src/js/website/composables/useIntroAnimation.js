import { gsap } from 'gsap';
import { SYSTEMS } from './useMepSystems.js';
import * as THREE from 'three';

const ABBRS = {
    ro: ['ELECTRIC', 'HVAC', 'SANITAR', 'INCENDIU', 'BMS'],
    en: ['ELECTRIC', 'HVAC', 'SANITARY', 'FIRE',    'BMS'],
};

export function useIntroAnimation({ getCamera, getControls, sysGroups, edgeLines }) {
    let systemsTl = null;
    let onActiveSys = null;
    let startPos = null;   // THREE.Vector3 — set after model loads
    let endPos   = null;   // THREE.Vector3
    let lookTgt  = null;   // THREE.Vector3

    function setPositions(sp, ep, lt) {
        startPos = sp;
        endPos   = ep;
        lookTgt  = lt;
    }

    function setCallbacks({ onActive }) {
        onActiveSys = onActive;
    }

    // ── Reset MEP materials ─────────────────────
    function resetSystems() {
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

    // ── Animate one system with grow effect ─────
    function animateGroup(tl, g, si, startAt) {
        const items     = g.userData.items || [];
        const lineItems = items.filter(it => it.isLine);
        const boxItems  = items.filter(it => it.isBox);
        let cur = startAt;

        if (si > 0) {
            tl.call(() => {
                const prev = sysGroups[si - 1];
                prev.traverse(o => {
                    if (o.material) gsap.to(o.material, { opacity: 0.05, duration: 0.8, ease: 'power2.out' });
                });
            }, null, cur - 0.7);
        }

        tl.call(() => { if (onActiveSys) onActiveSys(si); }, null, cur);

        // Prog bar
        const hex = '#' + SYSTEMS[si].color.toString(16).padStart(6, '0');
        const pct = [0, 25, 50, 75, 100][si];
        tl.to('#prog-fill', { width: pct + '%', background: hex, boxShadow: '0 0 10px ' + hex, duration: 0.4, ease: 'power2.out' }, cur);

        lineItems.forEach((item, ii) => {
            const t = cur + ii * 0.018;
            tl.to(item.mat, { opacity: 1, duration: 0.12, ease: 'power2.out' }, t);
            const proxy = { c: 0 };
            tl.to(proxy, {
                c: item.nPts,
                duration: 0.55 + Math.random() * 0.3,
                ease: 'power3.out',
                onUpdate() {
                    const n = Math.max(2, Math.ceil(proxy.c));
                    const slice = item.pts.slice(0, n * 3);
                    const full = new Float32Array(item.pts.length);
                    full.set(slice);
                    for (let i = slice.length; i < item.pts.length; i += 3) {
                        full[i]     = slice[slice.length - 3];
                        full[i + 1] = slice[slice.length - 2];
                        full[i + 2] = slice[slice.length - 1];
                    }
                    item.geo.setPositions(full);
                },
            }, t);
        });

        const linesEnd = cur + lineItems.length * 0.018 + 0.6;
        boxItems.forEach((item, ii) => {
            tl.to(item.mat, { opacity: 0.92, duration: 0.35, ease: 'back.out(1.4)' }, linesEnd + ii * 0.028);
        });

        return linesEnd + boxItems.length * 0.028 + 1.1;
    }

    // ── Systems sequence ────────────────────────
    function startSystems() {
        resetSystems();
        if (onActiveSys) onActiveSys(-1);

        const controls = getControls();
        edgeLines.forEach(ls => gsap.to(ls.material, { opacity: 0.18, duration: 2.5, ease: 'power2.inOut' }));
        controls.autoRotate = true;

        gsap.set('#prog-fill', { width: '0%', background: '#f07828', boxShadow: 'none' });
        gsap.to('#prog-wrap', { opacity: 1, duration: 0.6 });

        const tl = gsap.timeline({ onComplete() { doFinale(); } });
        systemsTl = tl;

        let cur = 0;
        sysGroups.forEach((g, si) => { cur = animateGroup(tl, g, si, cur); });

        // All done
        const lastHex = '#' + SYSTEMS[4].color.toString(16).padStart(6, '0');
        tl.to('#prog-fill', { width: '100%', background: lastHex, boxShadow: '0 0 14px ' + lastHex, duration: 0.5 }, cur - 0.5);
        tl.call(() => { if (onActiveSys) onActiveSys(SYSTEMS.length); }, null, cur - 0.5);
    }

    // ── Finale: zoom + spin + seamless loop ─────
    function doFinale() {
        const camera   = getCamera();
        const controls = getControls();
        controls.autoRotate = false;

        const allMats = [];
        sysGroups.forEach(g => g.traverse(o => { if (o.material) allMats.push(o.material); }));

        edgeLines.forEach(ls => gsap.to(ls.material, { opacity: 0.1, duration: 2.0, ease: 'power2.inOut' }));
        gsap.to(allMats, { opacity: 0.85, duration: 1.2, ease: 'power2.out', stagger: { amount: 0.8, from: 'random' } });
        gsap.to(allMats, {
            opacity: 0.22, duration: 0.8, ease: 'sine.inOut',
            yoyo: true, repeat: 5, delay: 1.4,
            onComplete() { gsap.to(allMats, { opacity: 0.82, duration: 0.6, ease: 'power2.out' }); },
        });

        gsap.delayedCall(0.5, () => {
            controls.enabled = false;

            const cp2   = camera.position.clone();
            const tgt   = controls.target.clone();
            const diff  = cp2.clone().sub(tgt);
            const rBase = diff.length();
            const t0    = Math.atan2(diff.x, diff.z);
            const p0    = Math.asin(Math.max(-1, Math.min(1, diff.y / rBase)));
            const camP  = { theta: t0, phi: p0, r: rBase };

            function updateCam() {
                const cp = Math.cos(camP.phi);
                camera.position.set(
                    tgt.x + camP.r * Math.sin(camP.theta) * cp,
                    tgt.y + camP.r * Math.sin(camP.phi),
                    tgt.z + camP.r * Math.cos(camP.theta) * cp,
                );
                camera.lookAt(tgt);
                controls.target.copy(tgt);
            }

            updateCam();

            const camTl = gsap.timeline({
                delay: 1.2,
                onComplete() {
                    gsap.to(allMats, {
                        opacity: 0, duration: 3.0, ease: 'power2.inOut',
                        stagger: { amount: 1.2, from: 'random' },
                        onComplete() {
                            controls.enabled    = true;
                            controls.autoRotate = true;
                            edgeLines.forEach(ls => gsap.to(ls.material, { opacity: 0.18, duration: 1.5, ease: 'power2.out' }));
                            startSystems();
                        },
                    });
                },
            });

            camTl.to(camP, { r: rBase * 0.42, duration: 2.0, ease: 'power2.inOut', onUpdate: updateCam });
            camTl.to(camP, { theta: t0 + Math.PI * 2, phi: p0 + 0.45, duration: 5.5, ease: 'sine.inOut', onUpdate: updateCam }, 1.6);
            camTl.to(camP, { r: rBase, phi: p0, duration: 2.2, ease: 'power2.inOut', onUpdate: updateCam }, 6.2);
        });
    }

    // ── Intro: materialize building + 360° spin ──
    function startIntro(edgeMats) {
        const camera   = getCamera();
        const controls = getControls();

        if (!startPos || !lookTgt) {
            // Fallback: use current camera position
            startPos = camera.position.clone();
            lookTgt  = controls.target.clone();
            endPos   = startPos.clone();
        }

        camera.position.copy(startPos);
        camera.lookAt(lookTgt);
        controls.target.copy(lookTgt);
        controls.enabled = false;

        // Compute spherical coords relative to look target
        const diff  = startPos.clone().sub(lookTgt);
        const r     = diff.length();
        const tS    = Math.atan2(diff.x, diff.z);
        const pS    = Math.asin(Math.max(-1, Math.min(1, diff.y / r)));
        const diffE = (endPos || startPos).clone().sub(lookTgt);
        const rE    = diffE.length();
        const tE    = Math.atan2(diffE.x, diffE.z);
        const pE    = Math.asin(Math.max(-1, Math.min(1, diffE.y / rE)));
        const camP  = { theta: tS, phi: pS };

        edgeMats.forEach(m => { m.opacity = 0; });

        gsap.set('#hero-text', { y: 14, opacity: 0 });
        gsap.set('#prog-wrap', { opacity: 0 });

        const tl = gsap.timeline({
            onComplete() {
                controls.enabled    = true;
                controls.autoRotate = true;
                controls.update();
            },
        });

        function updateCam() {
            const cp = Math.cos(camP.phi);
            camera.position.set(
                lookTgt.x + r * Math.sin(camP.theta) * cp,
                lookTgt.y + r * Math.sin(camP.phi),
                lookTgt.z + r * Math.cos(camP.theta) * cp,
            );
            camera.lookAt(lookTgt);
        }

        tl.to(edgeMats, { opacity: 0.88, duration: 1.8, stagger: { amount: 1.2, from: 'random' }, ease: 'power2.out' });
        tl.to('#text-backdrop', { opacity: 1, duration: 0.9 }, 0.8);
        tl.to('#hero-text', { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' }, 1.0);

        tl.to(camP, {
            theta: tS + Math.PI * 2 + (tE - tS),
            phi: pE,
            duration: 2.6,
            ease: 'power2.inOut',
            onUpdate: updateCam,
        }, 0.9);

        tl.call(() => { startSystems(); }, null, 3.5);
    }

    function killTimelines() {
        if (systemsTl) { systemsTl.kill(); systemsTl = null; }
        gsap.killTweensOf('*');
    }

    return { startIntro, startSystems, setPositions, setCallbacks, killTimelines };
}
