/**
 * FSM (Field Service Management) - Business Solution Landing Page
 * Interactive Logic, FAQ Accordion, Live Tickers, & Micro-Animations
 * Designed for FSM Platform
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Sticky Header & Scroll Spy Navigation
     -------------------------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(section => sectionObserver.observe(section));

  /* --------------------------------------------------------------------------
     2. Interactive Micro-Interactions
     -------------------------------------------------------------------------- */
  // All elements are visible by default for instant rendering and maximum accessibility

  /* --------------------------------------------------------------------------
     3. Mobile Menu Toggle & Navigation Drawer
     -------------------------------------------------------------------------- */
  const toggleMobileMenu = (forceClose = false) => {
    const isOpen = forceClose ? false : !mobileNavDrawer.classList.contains('open');
    if (isOpen) {
      mobileNavDrawer.classList.add('open');
      menuToggle.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileNavDrawer.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (menuToggle && mobileNavDrawer) {
    menuToggle.addEventListener('click', () => toggleMobileMenu());
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(true));
    });
  }

  /* --------------------------------------------------------------------------
     4. Hero Interactive Abstract Node Diagram
     -------------------------------------------------------------------------- */
  const orbitNodes = document.querySelectorAll('.orbit-node');
  const centerHubTitle = document.getElementById('hubTitle');
  const centerHubSubtitle = document.getElementById('hubSubtitle');
  const connectorLines = document.querySelectorAll('.connector-line');

  const nodeData = {
    tickets: {
      title: 'Service Tickets',
      subtitle: 'Centralized Intake & Triage',
      activeLineIndex: 0
    },
    people: {
      title: 'Field Teams',
      subtitle: 'Native Mobile Dispatch',
      activeLineIndex: 1
    },
    sla: {
      title: 'SLA Engine',
      subtitle: 'Live Countdown & Urgency',
      activeLineIndex: 2
    },
    location: {
      title: 'Location Aware',
      subtitle: 'Geoforwarding & Routing',
      activeLineIndex: 3
    },
    proof: {
      title: 'Proof of Service',
      subtitle: 'Digital Signature Capture',
      activeLineIndex: 4
    }
  };

  const activateNode = (nodeKey) => {
    orbitNodes.forEach(node => {
      if (node.getAttribute('data-node') === nodeKey) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    const info = nodeData[nodeKey];
    if (info && centerHubTitle && centerHubSubtitle) {
      centerHubTitle.textContent = info.title;
      centerHubSubtitle.textContent = info.subtitle;
    }

    connectorLines.forEach((line, idx) => {
      if (idx === (info ? info.activeLineIndex : -1)) {
        line.classList.add('active-pulse-line');
      } else {
        line.classList.remove('active-pulse-line');
      }
    });
  };

  orbitNodes.forEach(node => {
    const key = node.getAttribute('data-node');
    node.addEventListener('mouseenter', () => activateNode(key));
    node.addEventListener('click', () => activateNode(key));
  });

  // Cycle nodes gently if user hasn't interacted
  let autoRotateIndex = 0;
  const nodeKeys = Object.keys(nodeData);
  let userInteracted = false;

  const nodeInterval = setInterval(() => {
    if (userInteracted) {
      clearInterval(nodeInterval);
      return;
    }
    autoRotateIndex = (autoRotateIndex + 1) % nodeKeys.length;
    activateNode(nodeKeys[autoRotateIndex]);
  }, 4000);

  orbitNodes.forEach(node => {
    node.addEventListener('click', () => { userInteracted = true; });
    node.addEventListener('mouseenter', () => { userInteracted = true; });
  });

  /* --------------------------------------------------------------------------
     5. Live SLA Countdown Timer Simulation (Bento Card)
     -------------------------------------------------------------------------- */
  const liveSlaTimer = document.getElementById('liveSlaTimer');
  if (liveSlaTimer) {
    let remainingSeconds = 44 * 60 + 18; // 44 minutes 18 seconds
    setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds--;
        const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
        const secs = String(remainingSeconds % 60).padStart(2, '0');
        const textSpan = liveSlaTimer.querySelector('span');
        if (textSpan) {
          textSpan.textContent = `00:${mins}:${secs} Remaining`;
        }
      }
    }, 1000);
  }

  /* --------------------------------------------------------------------------
     6. "How It Works" Operational Flow Stepper
     -------------------------------------------------------------------------- */
  const stepNodes = document.querySelectorAll('.process-step-node');
  const stepTitleEl = document.getElementById('stepDetailTitle');
  const stepDescEl = document.getElementById('stepDetailDesc');
  const stepActorEl = document.getElementById('stepDetailActor');
  const stepActionEl = document.getElementById('stepDetailAction');
  const stepOutputEl = document.getElementById('stepDetailOutput');
  const stepVisualBadgeEl = document.getElementById('stepVisualBadge');
  const stepVisualTextEl = document.getElementById('stepVisualText');

  const stepsData = {
    '1': {
      title: 'Step 1: Raise Ticket',
      desc: 'Create a standardized service ticket detailing the customer, equipment or product, service category, problem description, and required priority level.',
      actor: 'Customer Service / Manager / Authorized Staff',
      action: 'Log service request with category, priority, and location details',
      output: 'New Service Ticket with initialized SLA timer',
      visualBadge: 'Ticket Intake Stage',
      visualText: 'Structured ticket created with priority & customer coordinates'
    },
    '2': {
      title: 'Step 2: Assign Support',
      desc: 'Assign the service ticket to an appropriate Support member based on organizational queue, operational section, and workload balance.',
      actor: 'Service Manager',
      action: 'Review ticket requirements and dispatch to qualified technician',
      output: 'Dispatched ticket linked to designated field technician',
      visualBadge: 'Resource Allocation',
      visualText: 'Role-based assignment matching operational capacity'
    },
    '3': {
      title: 'Step 3: Start Work',
      desc: 'The Support member reviews the assignment inside the focused native mobile application, acknowledges the task, and transitions the state to Active.',
      actor: 'Field Support Assistant',
      action: 'Acknowledge assignment and mark current-working ticket',
      output: 'Ticket status updated to "In Progress" in real-time',
      visualBadge: 'Field Acknowledgment',
      visualText: 'Native mobile synchronization with centralized operations'
    },
    '4': {
      title: 'Step 4: Monitor SLA',
      desc: 'Both field technicians and Service Managers maintain continuous visibility into the live SLA countdown and priority urgency to prevent breaches.',
      actor: 'Support Assistant & Service Manager',
      action: 'Track live countdown timer and priority escalation alerts',
      output: 'Continuous SLA compliance visibility across roles',
      visualBadge: 'Urgency Tracking',
      visualText: 'Live countdown prevents unexpected SLA violations'
    },
    '5': {
      title: 'Step 5: Track Destination',
      desc: 'Determine customer location coordinates using geoforwarding concepts and obtain accurate latitude and longitude for seamless field navigation.',
      actor: 'FSM Platform & Support Assistant',
      action: 'Resolve address coordinates via geoforwarding and routing',
      output: 'Verified on-site destination with geo-coordinates',
      visualBadge: 'Location Intelligence',
      visualText: 'Geoforwarding converts service address to exact coordinates'
    },
    '6': {
      title: 'Step 6: Complete Service',
      desc: 'Execute diagnostic, repair, maintenance, or installation procedures on-site adhering to standardized operational checklists.',
      actor: 'Field Support Assistant',
      action: 'Perform maintenance/repair and log technical notes',
      output: 'Completed service task ready for customer verification',
      visualBadge: 'Service Execution',
      visualText: 'Technical resolution completed according to specifications'
    },
    '7': {
      title: 'Step 7: Capture Signature',
      desc: 'Capture the customer or site supervisor’s digital signature directly on the native mobile canvas as irrefutable evidence of satisfactory completion.',
      actor: 'Customer / Site Representative & Support Assistant',
      action: 'Sign on native touchscreen canvas for service sign-off',
      output: 'Encrypted digital signature timestamped with audit record',
      visualBadge: 'Proof of Service',
      visualText: 'Unambiguous digital proof of service delivery captured on-site'
    },
    '8': {
      title: 'Step 8: Close & Notify',
      desc: 'Formalize ticket closure in the system, trigger automated email notifications to all stakeholders, and update operational reporting dashboards.',
      actor: 'FSM Workflow Engine',
      action: 'Archive ticket, update tenant metrics, and dispatch alerts',
      output: 'Resolved ticket record, closed SLA log, and audit history',
      visualBadge: 'Workflow Closure',
      visualText: 'Complete lifecycle finalized with automated stakeholder notifications'
    }
  };

  const updateStepView = (stepNum) => {
    const data = stepsData[stepNum];
    if (!data) return;

    stepNodes.forEach(node => {
      if (node.getAttribute('data-step') === stepNum) {
        node.classList.add('active');
        node.setAttribute('aria-selected', 'true');
      } else {
        node.classList.remove('active');
        node.setAttribute('aria-selected', 'false');
      }
    });

    if (stepTitleEl) stepTitleEl.textContent = data.title;
    if (stepDescEl) stepDescEl.textContent = data.desc;
    if (stepActorEl) stepActorEl.textContent = data.actor;
    if (stepActionEl) stepActionEl.textContent = data.action;
    if (stepOutputEl) stepOutputEl.textContent = data.output;
    if (stepVisualBadgeEl) stepVisualBadgeEl.textContent = data.visualBadge;
    if (stepVisualTextEl) stepVisualTextEl.textContent = data.visualText;
  };

  stepNodes.forEach(node => {
    node.addEventListener('click', () => {
      const step = node.getAttribute('data-step');
      updateStepView(step);
    });
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const step = node.getAttribute('data-step');
        updateStepView(step);
      }
    });
  });

  /* --------------------------------------------------------------------------
     7. FAQ Accordion (Wireframe Section 7)
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-button');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close others for clean accordion feel
        faqItems.forEach(other => {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-button');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  /* --------------------------------------------------------------------------
     8. Modals (Contact Us & Privacy)
     -------------------------------------------------------------------------- */
  const contactModal = document.getElementById('contactModal');
  const privacyModal = document.getElementById('privacyModal');
  const openContactButtons = document.querySelectorAll('.js-open-contact');
  const openPrivacyButtons = document.querySelectorAll('.js-open-privacy');
  const closeButtons = document.querySelectorAll('.js-close-modal');
  let lastActiveElement = null;

  const openModal = (modal) => {
    if (!modal) return;
    lastActiveElement = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const focusable = modal.querySelectorAll('button, input, select, textarea, [tabindex="0"]');
    if (focusable.length) {
      setTimeout(() => focusable[0].focus(), 50);
    }
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  };

  openContactButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(contactModal);
    });
  });

  openPrivacyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(privacyModal);
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(contactModal);
      closeModal(privacyModal);
    });
  });

  [contactModal, privacyModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (contactModal && contactModal.classList.contains('open')) {
        closeModal(contactModal);
      }
      if (privacyModal && privacyModal.classList.contains('open')) {
        closeModal(privacyModal);
      }
    }
  });

  /* --------------------------------------------------------------------------
     9. Contact Form Submission
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('solutionContactForm');
  const formSuccessBanner = document.getElementById('formSuccessBanner');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');

      if (!nameInput.value.trim() || !emailInput.value.trim()) {
        alert('Please fill in your name and a valid corporate email address.');
        return;
      }

      contactForm.style.display = 'none';
      if (formSuccessBanner) {
        formSuccessBanner.style.display = 'block';
      }

      setTimeout(() => {
        closeModal(contactModal);
        setTimeout(() => {
          contactForm.reset();
          contactForm.style.display = 'block';
          if (formSuccessBanner) formSuccessBanner.style.display = 'none';
        }, 400);
      }, 3500);
    });
  }
});
