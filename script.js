     // Attendez que le DOM soit chargé
     document.addEventListener("DOMContentLoaded", function () {
        initializeCursor();
        initializeParticles();
        initializeScrollAnimations();
        initializeTypingEffects();
        initializeFormHandling();
        initializeSmoothScroll();
        initializeMatrixRain();
        initializeProjectCards();
        initializeSkillsAnimation();
        bindEventListeners();
      });
    
      // Curseur personnalisé
      function initializeCursor() {
        const cursor = document.querySelector(".cursor-follow");
        let cursorVisible = true;
        let cursorEnlarged = false;
    
        document.addEventListener("mousemove", (e) => {
          if (cursorVisible) {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
          }
        });
    
        document.addEventListener("mousedown", () => {
          cursor.style.transform = "translate(-50%, -50%) scale(0.8)";
        });
    
        document.addEventListener("mouseup", () => {
          cursor.style.transform = "translate(-50%, -50%) scale(1)";
        });
    
        document
          .querySelectorAll("a, button, .project-card, .service-card")
          .forEach((el) => {
            el.addEventListener("mouseover", () => {
              cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
              cursor.style.borderColor = "var(--tertiary-color)";
              cursorEnlarged = true;
            });
    
            el.addEventListener("mouseout", () => {
              cursor.style.transform = "translate(-50%, -50%) scale(1)";
              cursor.style.borderColor = "var(--primary-color)";
              cursorEnlarged = false;
            });
          });
    
        // Cachez le curseur quand il quitte la fenêtre
        document.addEventListener("mouseout", () => {
          cursor.style.display = "none";
          cursorVisible = false;
        });
    
        document.addEventListener("mouseover", () => {
          cursor.style.display = "block";
          cursorVisible = true;
        });
      }
    
      // Système de particules en arrière-plan
      function initializeParticles() {
        const canvas = document.createElement("canvas");
        canvas.classList.add("particles-canvas");
        document.body.appendChild(canvas);
    
        const ctx = canvas.getContext("2d");
        let particles = [];
        const particleCount = 50;
    
        function resizeCanvas() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }
    
        class Particle {
          constructor() {
            this.reset();
          }
    
          reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.alpha = Math.random() * 0.5 + 0.2;
            this.size = Math.random() * 2 + 1;
          }
    
          update() {
            this.x += this.vx;
            this.y += this.vy;
    
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
          }
    
          draw() {
            ctx.beginPath();
            ctx.fillStyle = `rgba(0, 255, 0, ${this.alpha})`;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
    
        function initParticles() {
          particles = [];
          for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
          }
        }
    
        function animate() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
    
          particles.forEach((particle) => {
            particle.update();
            particle.draw();
          });
    
          // Dessiner les lignes entre les particules proches
          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[i].x - particles[j].x;
              const dy = particles[i].y - particles[j].y;
              const distance = Math.sqrt(dx * dx + dy * dy);
    
              if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 255, 0, ${
                  0.2 * (1 - distance / 100)
                })`;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
              }
            }
          }
    
          requestAnimationFrame(animate);
        }
    
        window.addEventListener("resize", () => {
          resizeCanvas();
          initParticles();
        });
    
        resizeCanvas();
        initParticles();
        animate();
      }
    
      // Animations au défilement
      function initializeScrollAnimations() {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("animate__animated");
    
                // Différentes animations selon le type d'élément
                if (entry.target.classList.contains("project-card")) {
                  entry.target.classList.add("animate__fadeInUp");
                } else if (entry.target.classList.contains("service-card")) {
                  entry.target.classList.add("animate__fadeInRight");
                } else if (entry.target.classList.contains("skill-icon")) {
                  entry.target.classList.add("animate__bounceIn");
                } else {
                  entry.target.classList.add("animate__fadeIn");
                }
              }
            });
          },
          { threshold: 0.1 }
        );
    
        // Observer les éléments qui nécessitent des animations
        document
          .querySelectorAll(
            ".project-card, .service-card, .skill-icon, .section-title"
          )
          .forEach((el) => {
            observer.observe(el);
          });
      }

      // Effet de frappe pour le texte
      function initializeTypingEffects() {
        const typingElements = document.querySelectorAll(".typing-effect");
    
        function typeWriter(element, text, speed = 50) {
          let i = 0;
          element.innerHTML = "";
    
          function type() {
            if (i < text.length) {
              element.innerHTML += text.charAt(i);
              i++;
              setTimeout(type, speed);
            }
          }
    
          type();
        }
    
        typingElements.forEach((element) => {
          const text = element.getAttribute("data-text") || element.innerHTML;
          typeWriter(element, text);
        });
      }
    
      // Gestion du formulaire de contact
      function initializeFormHandling() {
        const form = document.getElementById("contact-form");
        if (!form) return;
    
        form.addEventListener("submit", async function (e) {
          e.preventDefault();
    
          const submitBtn = form.querySelector('button[type="submit"]');
          const originalText = submitBtn.innerHTML;
    
          // Animation de chargement
          submitBtn.disabled = true;
          submitBtn.innerHTML =
            '<i class="fas fa-circle-notch fa-spin"></i> Envoi en cours...';
    
          try {
            // Simulation d'envoi de formulaire (remplacer par votre logique d'envoi réelle)
            await new Promise((resolve) => setTimeout(resolve, 2000));
    
            // Animation de succès
            submitBtn.innerHTML =
              '<i class="fas fa-check"></i> Message envoyé!';
            submitBtn.classList.remove("btn-outline-light");
            submitBtn.classList.add("btn-success");
    
            // Réinitialisation du formulaire
            form.reset();
    
            // Retour à l'état initial après 3 secondes
            setTimeout(() => {
              submitBtn.innerHTML = originalText;
              submitBtn.classList.add("btn-outline-light");
              submitBtn.classList.remove("btn-success");
              submitBtn.disabled = false;
            }, 3000);
          } catch (error) {
            // Gestion des erreurs
            submitBtn.innerHTML =
              '<i class="fas fa-exclamation-triangle"></i> Erreur';
            submitBtn.classList.add("btn-danger");
    
            setTimeout(() => {
              submitBtn.innerHTML = originalText;
              submitBtn.classList.remove("btn-danger");
              submitBtn.disabled = false;
            }, 3000);
          }
        });
      }
    
      Copydocument.addEventListener("DOMContentLoaded", function () {
    initializeCursor();
    initializeParticles();
    initializeScrollAnimations();
    initializeTypingEffects();
    initializeFormHandling();
    initializeSmoothScroll();
    initializeMatrixRain();
    initializeProjectCards();
    initializeSkillsAnimation();
    bindEventListeners();
});

// Gestion du formulaire de contact

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    });
}

// Effet Matrix en arrière-plan
function initializeMatrixRain() {
        const canvas = document.createElement("canvas");
        canvas.style.position = "fixed";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.zIndex = "-1";
        canvas.style.opacity = "0.1";
        document.body.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        let chars = "01";
        chars = chars.split("");

        const fontSize = 10;
        let drops = [];

        function resize() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          drops = Array(Math.ceil(canvas.width / fontSize)).fill(1);
        }

        function draw() {
          ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#0F0";
          ctx.font = fontSize + "px monospace";

          for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
              drops[i] = 0;
            }
            drops[i]++;
          }
        }

        window.addEventListener("resize", resize);
        resize();
        setInterval(draw, 35);
      }// Animation des cartes de projet
function initializeProjectCards() {
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach((card) => {
        card.addEventListener("mouseover", () => {
            card.classList.add("hovered");
        });

        card.addEventListener("mouseout", () => {
            card.classList.remove("hovered");
        });
    });
}

// Animation des compétences
function initializeSkillsAnimation() {
    const skillIcons = document.querySelectorAll(".skill-icon");

    skillIcons.forEach((icon) => {
        icon.addEventListener("mouseover", () => {
            icon.classList.add("animate__animated", "animate__pulse");
        });

        icon.addEventListener("animationend", () => {
            icon.classList.remove("animate__animated", "animate__pulse");
        });
    });
}

// Gestion du redimensionnement pour particles.js
window.addEventListener('resize', function() {
    if(window.pJSDom && window.pJSDom[0]) {
        const canvas = window.pJSDom[0].pJS.canvas.el;
        const container = document.getElementById('particles-js');
        
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
});
      // Liaison des événements
      function bindEventListeners() {
        // Gestion du menu mobile
        const navbarToggler = document.querySelector(".navbar-toggler");
        const navbarCollapse = document.querySelector(".navbar-collapse");

        if (navbarToggler && navbarCollapse) {
          navbarToggler.addEventListener("click", () => {
            navbarCollapse.classList.toggle("show");
          });
        }

        // Fermeture du menu mobile lors du clic sur un lien
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.addEventListener("click", () => {
            if (navbarCollapse.classList.contains("show")) {
              navbarCollapse.classList.remove("show");
            }
          });
        });

        // Animation du scroll vers le haut
        const scrollTopBtn = document.createElement("button");
        scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollTopBtn.classList.add("scroll-top-btn");
        document.body.appendChild(scrollTopBtn);

        window.addEventListener("scroll", () => {
          if (window.pageYOffset > 100) {
            scrollTopBtn.classList.add("show");
          } else {
            scrollTopBtn.classList.remove("show");
          }
        });

        scrollTopBtn.addEventListener("click", () => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });
      }
