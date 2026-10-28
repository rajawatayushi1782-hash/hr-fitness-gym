/**
 * GO180 Pixel-Perfect Recreation - Interactive Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Wipe / Loading transition handling
  const wipe = document.querySelector('.wipe');
  const wipeSpinner = document.querySelector('.wipe_spinner');
  
  // Remove loading class from body immediately
  document.body.classList.remove('loading');

  if (wipe) {
    setTimeout(() => {
      wipe.style.transition = 'opacity 0.6s ease, transform 0.8s ease';
      wipe.style.opacity = '0';
      wipe.style.pointerEvents = 'none';
      if (wipeSpinner) {
        wipeSpinner.style.transition = 'opacity 0.4s ease';
        wipeSpinner.style.opacity = '0';
        wipeSpinner.style.pointerEvents = 'none';
      }
      setTimeout(() => {
        wipe.style.display = 'none';
        if (wipeSpinner) wipeSpinner.style.display = 'none';
      }, 700);
    }, 200);
  }

  // 2. Fixed Header scroll styling
  const header = document.querySelector('header.header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.style.backgroundColor = 'rgba(13, 30, 37, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
        header.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease';
      } else {
        header.style.backgroundColor = 'transparent';
        header.style.backdropFilter = 'none';
        header.style.boxShadow = 'none';
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 3. Desktop Submenu Hover Handling
  const menuItemsWithChildren = document.querySelectorAll('.main__menu .menu-item-has-children');
  menuItemsWithChildren.forEach(item => {
    const subMenu = item.querySelector('.sub-menu');
    if (subMenu) {
      item.addEventListener('mouseenter', () => {
        subMenu.style.display = 'block';
        subMenu.style.opacity = '1';
        subMenu.style.visibility = 'visible';
      });
      item.addEventListener('mouseleave', () => {
        subMenu.style.display = 'none';
        subMenu.style.opacity = '0';
        subMenu.style.visibility = 'hidden';
      });
    }
  });

  // 4. Mobile Hamburger Menu Toggle is managed natively by original_main.js


  // 5. Floating Labels for Forms
  const formInputs = document.querySelectorAll('.gform_wrapper input, .gform_wrapper textarea, .gform_wrapper select');
  formInputs.forEach(input => {
    const parentField = input.closest('.gfield');
    const label = parentField ? parentField.querySelector('.gfield_label') : null;

    if (label) {
      if (input.value && input.value.trim().length > 0) {
        label.classList.add('-active');
      }

      input.addEventListener('focus', () => {
        label.classList.add('-active');
      });

      input.addEventListener('blur', () => {
        if (!input.value || input.value.trim().length === 0) {
          label.classList.remove('-active');
        }
      });

      input.addEventListener('input', () => {
        if (input.value && input.value.trim().length > 0) {
          label.classList.add('-active');
        } else {
          label.classList.remove('-active');
        }
      });
    }
  });

  // 6. Interactive Form Submission
  const forms = document.querySelectorAll('form[id*="gform_"]');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let hasError = false;
      const requiredInputs = form.querySelectorAll('input[aria-required="true"], select[aria-required="true"]');
      
      requiredInputs.forEach(input => {
        if (!input.value || input.value.trim() === '') {
          input.style.borderBottom = '2px solid #ff4734';
          hasError = true;
        } else {
          input.style.borderBottom = '1px solid rgba(255,255,255,0.3)';
        }
      });

      if (hasError) {
        alert('Vul alstublieft alle verplichte velden in.');
        return;
      }

      const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
      const originalVal = submitBtn ? submitBtn.value : 'Verstuur';
      if (submitBtn) {
        submitBtn.value = 'Bezig met versturen...';
        submitBtn.disabled = true;
      }

      try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        await fetch('/api/submit-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        // Show friendly confirmation message
        form.innerHTML = `
          <div style="background: rgba(255,255,255,0.05); border: 1px solid #e1e1e1; padding: 40px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <h3 style="color: #fff; margin-bottom: 15px; font-size: 28px;">Bedankt voor je aanvraag!</h3>
            <p style="color: #e1e1e1; font-size: 18px; line-height: 1.6;">We hebben je bericht ontvangen en nemen binnen 24 uur contact met je op.</p>
          </div>
        `;
      } catch (err) {
        if (submitBtn) {
          submitBtn.value = originalVal;
          submitBtn.disabled = false;
        }
        alert('Er ging iets mis bij het verzenden. Probeer het later opnieuw.');
      }
    });
  });

  // 7. Homepage Slide Navigation Bullets
  const slides = document.querySelectorAll('.slides > .slide');
  const bullets = document.querySelectorAll('.slide__navigationBullet');

  if (bullets.length > 0 && slides.length > 0) {
    bullets.forEach((bullet, idx) => {
      bullet.addEventListener('click', () => {
        if (slides[idx]) {
          slides[idx].scrollIntoView({ behavior: 'smooth' });
          bullets.forEach(b => b.classList.remove('-active'));
          bullet.classList.add('-active');
        }
      });
    });

    // Update active bullet on scroll
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;
      slides.forEach((slide, idx) => {
        const top = slide.offsetTop;
        const height = slide.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          bullets.forEach(b => b.classList.remove('-active'));
          if (bullets[idx]) bullets[idx].classList.add('-active');
        }
      });
    }, { passive: true });
  }

  // 8. FAQ Accordion Logic
  const faqSections = document.querySelectorAll('section.faq');
  faqSections.forEach(section => {
    const questions = section.querySelectorAll('h3');
    questions.forEach((h3, idx) => {
      h3.style.cursor = 'pointer';
      h3.style.userSelect = 'none';
      h3.style.display = 'flex';
      h3.style.justifyContent = 'space-between';
      h3.style.alignItems = 'center';
      h3.style.padding = '18px 0';
      h3.style.borderBottom = '1px solid rgba(255,255,255,0.2)';
      
      const icon = document.createElement('span');
      icon.innerHTML = '+';
      icon.style.fontSize = '24px';
      icon.style.marginLeft = '15px';
      icon.style.transition = 'transform 0.3s ease';
      h3.appendChild(icon);

      const nextP = h3.nextElementSibling;
      if (nextP && nextP.tagName === 'P') {
        nextP.style.overflow = 'hidden';
        nextP.style.transition = 'all 0.3s ease';
        if (idx !== 0) {
          nextP.style.display = 'none';
        } else {
          icon.innerHTML = '−';
          nextP.style.display = 'block';
        }

        h3.addEventListener('click', () => {
          const isClosed = nextP.style.display === 'none';
          if (isClosed) {
            nextP.style.display = 'block';
            icon.innerHTML = '−';
          } else {
            nextP.style.display = 'none';
            icon.innerHTML = '+';
          }
        });
      }
    });
  });

  // 9. DragSlider / Point switcher
  const dragSliders = document.querySelectorAll('.dragSlider');
  dragSliders.forEach(slider => {
    const points = slider.querySelectorAll('.dragSlider__navPoint');
    const sliderSlides = slider.querySelectorAll('.dragSlider__slide');

    points.forEach((pt, pIdx) => {
      pt.style.cursor = 'pointer';
      pt.addEventListener('click', () => {
        points.forEach(p => p.classList.remove('-active'));
        pt.classList.add('-active');

        sliderSlides.forEach((s, sIdx) => {
          if (sIdx === pIdx) {
            s.classList.add('-active');
            s.style.display = 'block';
            s.style.opacity = '1';
          } else {
            s.classList.remove('-active');
            s.style.display = 'none';
            s.style.opacity = '0';
          }
        });
      });
    });
  });

  // 10. Arrow Scroll smooth jump
  const arrowScrolls = document.querySelectorAll('.arrowScroll');
  arrowScrolls.forEach(arrow => {
    arrow.style.cursor = 'pointer';
    arrow.addEventListener('click', () => {
      const nextSlide = document.querySelector('#slide-2') || document.querySelector('.spacer');
      if (nextSlide) {
        nextSlide.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      }
    });
  });

  // 11. Autoplay Header Video
  const videoHeader = document.getElementById('videoHeader');
  if (videoHeader) {
    videoHeader.muted = true;
    videoHeader.play().catch(() => {});
  }
});
