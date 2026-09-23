/* ============================================================
       THREE.JS DIGITAL BACKGROUND
       ============================================================ */
    (() => {
      const canvas = document.getElementById('space');
      if (!canvas || typeof THREE === 'undefined') return;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 18;

      const group = new THREE.Group();
      scene.add(group);

      /* 900 Particle Starfield */
      const pCount = 900;
      const positions = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        const r = 24 * Math.random() + 5;
        const angle = Math.random() * Math.PI * 2;
        positions[i * 3] = Math.cos(angle) * r;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
        positions[i * 3 + 2] = Math.sin(angle) * r;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const pMat = new THREE.PointsMaterial({ color: 0x61c9ff, size: 0.035, transparent: true, opacity: 0.7 });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      /* 5 Wireframe Digital Rings */
      for (let i = 0; i < 5; i++) {
        const geo = new THREE.TorusGeometry(3.5 + i * 1.7, 0.008, 8, 120);
        const mat = new THREE.MeshBasicMaterial({
          color: i % 2 ? 0x756eff : 0x4bc4ff,
          transparent: true,
          opacity: 0.18
        });
        const torus = new THREE.Mesh(geo, mat);
        torus.rotation.x = Math.PI / 2 + i * 0.18;
        torus.rotation.y = i * 0.25;
        group.add(torus);
      }

      /* Wireframe Core */
      const coreGeo = new THREE.IcosahedronGeometry(1.7, 1);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x4dbbff, wireframe: true, transparent: true, opacity: 0.2 });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(5, 1, -7);
      group.add(core);

      /* Gentle Mouse Parallax */
      let mouseX = 0, mouseY = 0;
      window.addEventListener('pointermove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      });

      function animate() {
        requestAnimationFrame(animate);
        particles.rotation.y += 0.00018;
        particles.rotation.x += 0.00005;

        group.rotation.y += 0.00035 + (mouseX * 0.035 - group.rotation.y) * 0.008;
        group.rotation.x += 0.00012 + (-mouseY * 0.025 - group.rotation.x) * 0.008;

        core.rotation.x += 0.004;
        core.rotation.y += 0.006;

        renderer.render(scene, camera);
      }
      animate();

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    })();
