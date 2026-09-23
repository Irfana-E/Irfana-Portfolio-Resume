/* ============================================================
       INTERACTIVE WORKSPACE MODAL
       ============================================================ */
    const workspaceData = {
      profile: {
        tag: 'PROFILE / 01',
        title: 'A practical learner',
        text: 'I like learning by doing — building interfaces, studying software testing concepts, experimenting with digital tools and turning new knowledge into practical work.',
        list: ['BCA Degree', 'Web Development', 'QA Testing', 'Continuous Learning']
      },
      skills: {
        tag: 'SKILLS LAB / 02',
        title: 'Technical foundation',
        text: 'My BCA foundation covers programming, data structures, databases, web technology, software engineering and other core computing subjects. I continue to strengthen the practical side through projects.',
        list: ['HTML5', 'CSS3', 'JavaScript', 'Java', 'C', 'C++', 'SQL', 'DBMS', 'Git/GitHub']
      },
      projects: {
        tag: 'PROJECT LAB / 03',
        title: 'Proof through projects',
        text: 'The strongest evidence in this portfolio is practical work. Bata vs Brands is a live responsive website, while this portfolio demonstrates interactive front-end development.',
        list: ['Bata vs Brands', 'Responsive UI', 'GitHub Pages', 'JavaScript']
      },
      future: {
        tag: 'NEXT DIRECTION / 04',
        title: 'Growing toward cybersecurity',
        text: 'My longer-term direction is cybersecurity, alongside continued exploration of AI and data-focused work. The goal is to keep building the technical foundation step by step.',
        list: ['Cyber Forensics', 'Information Security', 'AI Workflows', 'Data Annotation']
      }
    };

    const modal = document.getElementById('modal');
    const modalTag = document.getElementById('modalTag');
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');
    const modalList = document.getElementById('modalList');
    const closeModalBtn = document.getElementById('closeModal');

    function openWorkspaceModal(key) {
      const data = workspaceData[key];
      if (!data || !modal) return;
      modalTag.textContent = data.tag;
      modalTitle.textContent = data.title;
      modalText.textContent = data.text;
      modalList.replaceChildren(
        ...data.list.map((item) => {
          const chip = document.createElement('span');
          chip.textContent = item;
          return chip;
        })
      );
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      if (closeModalBtn) closeModalBtn.focus();
    }

    function closeWorkspaceModal() {
      if (!modal) return;
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.module[data-modal]').forEach((mod) => {
      mod.addEventListener('click', () => openWorkspaceModal(mod.dataset.modal));
      mod.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openWorkspaceModal(mod.dataset.modal);
        }
      });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeWorkspaceModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeWorkspaceModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeWorkspaceModal();
    });

    /* Copy Email Helper */
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('irfana122005@outlook.com').then(() => {
          const original = copyEmailBtn.textContent;
          copyEmailBtn.textContent = 'COPIED!';
          setTimeout(() => { copyEmailBtn.textContent = original; }, 2000);
        });
      });
    }
