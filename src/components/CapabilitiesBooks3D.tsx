import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SKILL_NODES, CREDENTIALS_ARCHIVE, type SkillNode, type CredentialItem } from '../data/portfolioData';
import { sound } from '../utils/audio';

export type BookViewMode = 'master' | 'skills' | 'credentials';

interface CapabilitiesBooks3DProps {
  mode: BookViewMode;
  onModeChange: (mode: BookViewMode) => void;
  onSelectSkill: (skill: SkillNode) => void;
  onSelectCredential: (cred: CredentialItem) => void;
}

interface SpringBook {
  mesh: THREE.Mesh;
  group: THREE.Group;
  initialPos: THREE.Vector3;
  y: number;
  vy: number;
  targetY: number;
  z: number;
  vz: number;
  targetZ: number;
  data: {
    type: 'master' | 'skill' | 'credential';
    id: string;
    item?: SkillNode | CredentialItem;
    masterTarget?: BookViewMode;
  };
}

// Generate high-resolution procedural page block edge texture
function createPageEdgeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f0ebe1';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = 'rgba(120, 100, 80, 0.08)';
    for (let i = 0; i < 256; i += 2) {
      ctx.fillRect(0, i, 256, 1);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Generate luxury cover texture for Master Tomes
function createMasterCoverTexture(
  volumeRoman: string,
  title: string,
  subtitle: string,
  countBadge: string,
  bgColor: string,
  accentColor = '#D6B89A'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Background gradient with fine leather noise
  const grad = ctx.createLinearGradient(0, 0, 768, 1024);
  grad.addColorStop(0, bgColor);
  grad.addColorStop(1, '#08080a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 768, 1024);

  // Ornamental Outer Border (Gold Foil)
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, 768 - 72, 1024 - 72);

  // Inner hairline border
  ctx.strokeStyle = 'rgba(214, 184, 154, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(48, 48, 768 - 96, 1024 - 96);

  // Corner ornaments
  const corners = [
    [54, 54],
    [768 - 54, 54],
    [54, 1024 - 54],
    [768 - 54, 1024 - 54],
  ];
  ctx.fillStyle = accentColor;
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Header
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(246, 244, 239, 0.6)';
  ctx.font = '500 20px "Host Grotesk", sans-serif';
  ctx.letterSpacing = '5px';
  ctx.fillText('AKSANLAB MONOGRAPH ARCHIVES', 384, 130);

  // Volume
  ctx.fillStyle = accentColor;
  ctx.font = 'normal 44px "Instrument Serif", Georgia, serif';
  ctx.letterSpacing = '8px';
  ctx.fillText(`VOLUME ${volumeRoman}`, 384, 200);

  // Decorative divider
  ctx.strokeStyle = 'rgba(214, 184, 154, 0.4)';
  ctx.beginPath();
  ctx.moveTo(250, 240);
  ctx.lineTo(518, 240);
  ctx.stroke();

  // Central Emblem
  ctx.save();
  ctx.translate(384, 380);
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 60, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 72, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = 'italic 36px "Instrument Serif", Georgia, serif';
  ctx.fillStyle = accentColor;
  ctx.fillText('AZ', 0, 12);
  ctx.restore();

  // Master Title
  ctx.fillStyle = '#F6F4EF';
  ctx.font = 'normal 56px "Newsreader", Georgia, serif';
  ctx.letterSpacing = '0px';

  // Word wrap title
  const words = title.split(' ');
  let line = '';
  let yPos = 560;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 600 && n > 0) {
      ctx.fillText(line.trim(), 384, yPos);
      line = words[n] + ' ';
      yPos += 68;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), 384, yPos);

  // Subtitle
  ctx.fillStyle = 'rgba(214, 184, 154, 0.85)';
  ctx.font = 'italic 28px "Instrument Serif", Georgia, serif';
  ctx.fillText(subtitle, 384, yPos + 60);

  // Badge / Item Count
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.roundRect ? ctx.roundRect(240, 830, 288, 50, 25) : ctx.rect(240, 830, 288, 50);
  ctx.fill();
  ctx.strokeStyle = 'rgba(214, 184, 154, 0.4)';
  ctx.stroke();

  ctx.fillStyle = accentColor;
  ctx.font = '600 18px "Host Grotesk", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(countBadge, 384, 862);

  // Footer Author
  ctx.fillStyle = 'rgba(246, 244, 239, 0.4)';
  ctx.font = '400 16px "Host Grotesk", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('CURATED BY AKSAN ZULKARNAIN', 384, 950);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Generate luxury cover texture for Sub-Books (Skills & Credentials)
function createSubBookCoverTexture(
  title: string,
  category: string,
  author = 'Aksan Zulkarnain',
  accentColor = '#D6B89A',
  bgColor = '#141312',
  tag?: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d')!;

  // Background
  const grad = ctx.createLinearGradient(0, 0, 512, 768);
  grad.addColorStop(0, bgColor);
  grad.addColorStop(1, '#09090b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 768);

  // Fine perimeter foil frame
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(24, 24, 512 - 48, 768 - 48);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.strokeRect(32, 32, 512 - 64, 768 - 64);

  // Top Category Pill
  ctx.textAlign = 'center';
  ctx.fillStyle = accentColor;
  ctx.font = '600 14px "Host Grotesk", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(category.toUpperCase(), 256, 80);

  // Decorative glyph
  ctx.strokeStyle = 'rgba(214, 184, 154, 0.4)';
  ctx.beginPath();
  ctx.arc(256, 170, 36, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = accentColor;
  ctx.font = 'italic 24px "Instrument Serif", Georgia, serif';
  ctx.fillText('✦', 256, 178);

  // Book Title
  ctx.fillStyle = '#F6F4EF';
  ctx.font = 'normal 42px "Newsreader", Georgia, serif';
  ctx.letterSpacing = '-0.5px';

  const words = title.split(' ');
  let line = '';
  let yPos = 310;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 410 && n > 0) {
      ctx.fillText(line.trim(), 256, yPos);
      line = words[n] + ' ';
      yPos += 50;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), 256, yPos);

  // Status or Tag
  if (tag) {
    ctx.fillStyle = 'rgba(214, 184, 154, 0.15)';
    ctx.fillRect(130, yPos + 35, 252, 34);
    ctx.strokeStyle = 'rgba(214, 184, 154, 0.4)';
    ctx.strokeRect(130, yPos + 35, 252, 34);

    ctx.fillStyle = accentColor;
    ctx.font = '600 13px "Host Grotesk", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(tag.toUpperCase(), 256, yPos + 57);
  }

  // Footer Brand & Author
  ctx.fillStyle = 'rgba(246, 244, 239, 0.6)';
  ctx.font = 'italic 20px "Instrument Serif", Georgia, serif';
  ctx.fillText(author, 256, 680);

  ctx.fillStyle = 'rgba(214, 184, 154, 0.5)';
  ctx.font = '400 12px "Host Grotesk", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('AKSANLAB SPECIMEN', 256, 715);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const CapabilitiesBooks3D: React.FC<CapabilitiesBooks3DProps> = ({
  mode,
  onModeChange,
  onSelectSkill,
  onSelectCredential,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeBooksRef = useRef<SpringBook[]>([]);
  const hoveredBookRef = useRef<SpringBook | null>(null);

  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Drag & Scroll State
  const scrollOffsetRef = useRef(0);
  const targetScrollOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef(0);
  const pointerPosRef = useRef({ x: -9999, y: -9999 });
  const lastPointerMoveTimeRef = useRef(performance.now());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null; // transparent to blend with dark page

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(
      width < 768 ? 32 : 24,
      width / height,
      0.1,
      100
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Warm directional key light
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.8);
    keyLight.position.set(-4, 7, 6);
    scene.add(keyLight);

    // Cool rim light for book edges
    const rimLight = new THREE.DirectionalLight(0xbcd2ff, 1.4);
    rimLight.position.set(6, 3, -4);
    scene.add(rimLight);

    // Soft ground shadow plane / subtle reflection
    const groundGeo = new THREE.PlaneGeometry(30, 20);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x050507,
      transparent: true,
      opacity: 0.8,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.6;
    scene.add(ground);

    const sharedPageTexture = createPageEdgeTexture();
    const booksList: SpringBook[] = [];

    // Helper to create book materials
    const makeBookMaterials = (coverTexture: THREE.CanvasTexture, spineColorHex: string) => {
      const spineColor = new THREE.Color(spineColorHex);
      const pageMat = new THREE.MeshStandardMaterial({
        map: sharedPageTexture,
        roughness: 0.9,
      });

      const spineMat = new THREE.MeshPhysicalMaterial({
        color: spineColor,
        roughness: 0.55,
        clearcoat: 0.35,
        clearcoatRoughness: 0.3,
      });

      const coverMat = new THREE.MeshPhysicalMaterial({
        map: coverTexture,
        roughness: 0.42,
        clearcoat: 0.55,
        clearcoatRoughness: 0.35,
      });

      const backMat = new THREE.MeshPhysicalMaterial({
        color: spineColor.clone().multiplyScalar(0.7),
        roughness: 0.6,
      });

      // Face order in BoxGeometry: +x (pages), -x (spine), +y (top), -y (bottom), +z (front), -z (back)
      return [pageMat, spineMat, pageMat, pageMat, coverMat, backMat];
    };

    // 3. Populate Scene Based on Active Mode
    if (mode === 'master') {
      // MASTER MODE: 2 Grand Master Tomes
      camera.position.set(0, 0.4, width < 768 ? 9.5 : 7.2);
      camera.lookAt(0, 0, 0);

      const masterGeo = new THREE.BoxGeometry(1.4, 2.0, 0.35);

      // Book 1: Skills & Capabilities Tome
      const skillsCover = createMasterCoverTexture(
        'I',
        'Skills & Tech Spectrum',
        'Frontend · Backend · Spatial Systems',
        '13 DISCIPLINES',
        '#0e1419',
        '#D6B89A'
      );
      const tome1Materials = makeBookMaterials(skillsCover, '#142028');
      const tome1Mesh = new THREE.Mesh(masterGeo, tome1Materials);
      const tome1Group = new THREE.Group();
      tome1Group.position.set(width < 768 ? -0.85 : -1.25, -0.1, 0.2);
      tome1Group.rotation.y = 0.28;
      tome1Group.rotation.x = -0.05;
      tome1Group.add(tome1Mesh);
      scene.add(tome1Group);

      booksList.push({
        mesh: tome1Mesh,
        group: tome1Group,
        initialPos: tome1Group.position.clone(),
        y: 0,
        vy: 0,
        targetY: 0,
        z: 0,
        vz: 0,
        targetZ: 0,
        data: {
          type: 'master',
          id: 'master-skills',
          masterTarget: 'skills',
        },
      });

      // Book 2: Verified Credentials Tome
      const credsCover = createMasterCoverTexture(
        'II',
        'Verified Credentials Vault',
        'Certifications & Official Accreditations',
        '6 VERIFIED RECORDS',
        '#1a100f',
        '#D6B89A'
      );
      const tome2Materials = makeBookMaterials(credsCover, '#261514');
      const tome2Mesh = new THREE.Mesh(masterGeo, tome2Materials);
      const tome2Group = new THREE.Group();
      tome2Group.position.set(width < 768 ? 0.85 : 1.25, -0.1, -0.2);
      tome2Group.rotation.y = -0.22;
      tome2Group.rotation.x = -0.05;
      tome2Group.add(tome2Mesh);
      scene.add(tome2Group);

      booksList.push({
        mesh: tome2Mesh,
        group: tome2Group,
        initialPos: tome2Group.position.clone(),
        y: 0,
        vy: 0,
        targetY: 0,
        z: 0,
        vz: 0,
        targetZ: 0,
        data: {
          type: 'master',
          id: 'master-credentials',
          masterTarget: 'credentials',
        },
      });
    } else {
      // EXPANDED FOLIO 3D ROW MODE (Skills or Credentials)
      // Camera perspective matching the Folio reference
      camera.position.set(
        width < 768 ? 2.5 : 3.4,
        width < 768 ? 1.6 : 1.9,
        width < 768 ? 8.2 : 6.8
      );
      camera.lookAt(-1.2, 0.05, -0.6);

      const subBookGeo = new THREE.BoxGeometry(1.0, 1.52, 0.22);
      const items = mode === 'skills' ? SKILL_NODES : CREDENTIALS_ARCHIVE;

      // Color palette for distinctive hardcover luxury jackets
      const palette = [
        '#121b24', '#0d2216', '#2a1212', '#221e16', '#14202c', '#2c1e10',
        '#0f2122', '#1b1226', '#261712', '#151e18', '#1a1921', '#211812',
        '#12221b'
      ];

      items.forEach((item, i) => {
        const bgHex = palette[i % palette.length];
        const isSkill = mode === 'skills';
        const title = isSkill
          ? (item as SkillNode).name
          : (item as CredentialItem).title;
        const category = isSkill
          ? (item as SkillNode).domainLabel
          : (item as CredentialItem).issuer;
        const tag = isSkill ? 'Discipline' : 'Verified Cert';

        const coverTex = createSubBookCoverTexture(
          title,
          category,
          'Aksan Zulkarnain',
          '#D6B89A',
          bgHex,
          tag
        );

        const materials = makeBookMaterials(coverTex, bgHex);
        const bookMesh = new THREE.Mesh(subBookGeo, materials);
        const bookGroup = new THREE.Group();

        // Staggered diagonal overlapping arrangement as in Folio reference
        // Runs from front-right to back-left
        const xPos = 1.6 + i * -0.52;
        const yPos = -1.15;
        const zPos = 0.95 + i * -0.22;

        bookGroup.position.set(xPos, yPos, zPos);
        bookGroup.rotation.y = 0.32;
        bookGroup.add(bookMesh);
        scene.add(bookGroup);

        booksList.push({
          mesh: bookMesh,
          group: bookGroup,
          initialPos: new THREE.Vector3(xPos, yPos, zPos),
          y: -2.5, // start submerged for dramatic rising entrance!
          vy: 0,
          targetY: 0,
          z: 0,
          vz: 0,
          targetZ: 0,
          data: {
            type: isSkill ? 'skill' : 'credential',
            id: item.id,
            item: item,
          },
        });
      });
    }

    activeBooksRef.current = booksList;

    // 4. Raycasting for Pointer Detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      pointerPosRef.current = { x: clientX, y: clientY };
      lastPointerMoveTimeRef.current = performance.now();

      mouse.x = (clientX / rect.width) * 2 - 1;
      mouse.y = -(clientY / rect.height) * 2 + 1;

      if (isDraggingRef.current) {
        const deltaX = (e.clientX - dragStartRef.current) * 0.008;
        targetScrollOffsetRef.current += deltaX;
        dragStartRef.current = e.clientX;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      dragStartRef.current = e.clientX;
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (mode !== 'master') {
        // Horizontal pan via wheel
        e.preventDefault();
        targetScrollOffsetRef.current -= e.deltaY * 0.003;
      }
    };

    const onClick = () => {
      if (hoveredBookRef.current) {
        const target = hoveredBookRef.current.data;
        sound.playChirp(880, 0.12);

        if (target.type === 'master' && target.masterTarget) {
          onModeChange(target.masterTarget);
        } else if (target.type === 'skill' && target.item) {
          onSelectSkill(target.item as SkillNode);
        } else if (target.type === 'credential' && target.item) {
          onSelectCredential(target.item as CredentialItem);
        }
      }
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('click', onClick);

    // 5. Physics & Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const K = 70; // Spring stiffness
    const C = 12.5; // Damping
    const maxSubSteps = 4;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      // Smooth damp horizontal scroll offset
      scrollOffsetRef.current += (targetScrollOffsetRef.current - scrollOffsetRef.current) * 0.12;

      // Bound scrolling in row mode
      if (mode !== 'master' && booksList.length > 0) {
        const maxScroll = Math.max(0, (booksList.length - 4) * 0.52);
        targetScrollOffsetRef.current = Math.max(-0.5, Math.min(maxScroll, targetScrollOffsetRef.current));
        setScrollProgress(targetScrollOffsetRef.current / (maxScroll || 1));
      }

      // Raycast to find hovered book
      raycaster.setFromCamera(mouse, camera);
      const meshes = booksList.map((b) => b.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const hitBook = booksList.find((b) => b.mesh === hitMesh);
        if (hitBook) {
          if (hoveredBookRef.current !== hitBook) {
            sound.playClick(600);
            hoveredBookRef.current = hitBook;
            const name =
              hitBook.data.type === 'master'
                ? hitBook.data.masterTarget === 'skills'
                  ? 'Master Tome I: Skills & Capabilities'
                  : 'Master Tome II: Verified Credentials'
                : hitBook.data.item
                ? hitBook.data.type === 'skill'
                  ? (hitBook.data.item as SkillNode).name
                  : (hitBook.data.item as CredentialItem).title
                : null;
            setHoveredLabel(name);
          }
        }
      } else {
        if (hoveredBookRef.current) {
          hoveredBookRef.current = null;
          setHoveredLabel(null);
        }
      }

      // Idle sweep wave if pointer inactive for > 3.5s or in row mode
      const isIdle = performance.now() - lastPointerMoveTimeRef.current > 3500;
      let idleScreenX = -9999;
      if (isIdle && mode !== 'master') {
        const u = (Math.sin(elapsed * 0.9) + 1) / 2;
        idleScreenX = width * 0.15 + u * (width * 0.7);
      }

      // Update Springs for Each Book
      booksList.forEach((book, i) => {
        // Shift position with horizontal drag in sub-book mode
        if (mode !== 'master') {
          book.group.position.x = book.initialPos.x + scrollOffsetRef.current;
        }

        // Project book screen position for proximity wave
        const tempVec = new THREE.Vector3(0, 0.1, 0);
        book.mesh.getWorldPosition(tempVec);
        tempVec.project(camera);

        const screenX = ((tempVec.x + 1) * width) / 2;
        const screenY = ((-tempVec.y + 1) * height) / 2;

        let influence = 0;
        const s = Math.max(width, height) * 0.085;

        if (mode === 'master') {
          // Master tomes: gentle elevation when hovered or pointed near
          const isThisHovered = hoveredBookRef.current === book;
          book.targetY = isThisHovered ? 0.35 : 0;
          book.targetZ = isThisHovered ? 0.25 : 0;

          // Subtle breathing / cursor parallax
          const targetRotY = book.initialPos.x < 0 ? 0.28 + mouse.x * 0.08 : -0.22 + mouse.x * 0.08;
          const targetRotX = -0.05 - mouse.y * 0.06;
          book.group.rotation.y += (targetRotY - book.group.rotation.y) * 0.08;
          book.group.rotation.x += (targetRotX - book.group.rotation.x) * 0.08;
        } else {
          // FOLIO SPRINGS WAVE: Calculate Gaussian proximity wave
          const px = isIdle ? idleScreenX : pointerPosRef.current.x;
          const py = isIdle ? height * 0.55 : pointerPosRef.current.y;

          const distSq = Math.pow(screenX - px, 2) + Math.pow((screenY - py) * 0.55, 2);
          influence = Math.exp(-distSq / (s * s));

          // Rising entrance stagger
          const entranceTime = 0.15 + (booksList.length - i) * 0.04;
          if (elapsed > entranceTime) {
            book.targetY = 0.78 * influence;
            book.targetZ = 0.78 * influence * 0.35;
          } else {
            book.targetY = -2.5;
          }
        }

        // Sub-stepped physics integration
        const subH = dt / maxSubSteps;
        for (let step = 0; step < maxSubSteps; step++) {
          book.vy += ((book.targetY - book.y) * K - book.vy * C) * subH;
          book.y += book.vy * subH;

          book.vz += ((book.targetZ - book.z) * K - book.vz * C) * subH;
          book.z += book.vz * subH;
        }

        // Apply translation & dynamic tilt leaning
        book.mesh.position.y = book.y;
        book.mesh.position.z = book.z;
        book.mesh.rotation.x = -book.vy * 0.015;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 6. Responsive Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.fov = w < 768 ? (mode === 'master' ? 34 : 32) : mode === 'master' ? 24 : 22;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);

      // Clean WebGL resources
      booksList.forEach((b) => {
        b.mesh.geometry.dispose();
        if (Array.isArray(b.mesh.material)) {
          b.mesh.material.forEach((m) => m.dispose());
        } else {
          b.mesh.material.dispose();
        }
      });
      sharedPageTexture.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [mode]);

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] select-none overflow-hidden rounded-3xl border border-white/10 bg-[#09090b]">
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating Interactive HUD / Indicator */}
      <div className="pointer-events-none absolute inset-x-6 top-6 flex items-center justify-between text-xs font-ui">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D6B89A] animate-pulse" />
          <span className="text-[#D6B89A] uppercase tracking-wider font-semibold">
            {mode === 'master' ? 'MASTER ARCHIVES // SELECT TOME' : `${mode.toUpperCase()} EXHIBITION // FOLIO SPRING WAVE`}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[#A8A29E]">
          {mode === 'master' ? (
            <span>Click any Master Book to enter bookshelf</span>
          ) : (
            <span>Hover for wave physics · Drag or Wheel to browse</span>
          )}
        </div>
      </div>

      {/* Dynamic Hovered Book Pill */}
      {hoveredLabel && (
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full glass-panel border border-[#D6B89A]/50 text-xs font-ui text-[#F6F4EF] shadow-2xl flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-150">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D6B89A] shadow-[0_0_8px_#D6B89A]" />
          <span className="font-editorial text-sm font-normal text-[#F6F4EF]">{hoveredLabel}</span>
          <span className="text-[10px] text-[#D6B89A] uppercase tracking-widest pl-1 border-l border-white/10">Click to Open</span>
        </div>
      )}

      {/* Drag & Pan Progress Rail (Visible in sub-book modes) */}
      {mode !== 'master' && (
        <div className="pointer-events-none absolute bottom-4 inset-x-12 sm:inset-x-32 h-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D6B89A]/40 to-[#D6B89A] rounded-full transition-all duration-150"
            style={{ width: `${Math.max(15, Math.min(100, scrollProgress * 100))}%` }}
          />
        </div>
      )}
    </div>
  );
};
