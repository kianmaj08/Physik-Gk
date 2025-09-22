// Modern Physics Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const sections = document.querySelectorAll('.topic-section');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();

        if (searchTerm === '') {
            // Reset all sections to visible
            sections.forEach(section => {
                section.style.display = 'block';
                removeHighlights(section);
            });
            return;
        }

        let found = false;
        sections.forEach(section => {
            const textContent = section.textContent.toLowerCase();

            if (textContent.includes(searchTerm)) {
                section.style.display = 'block';
                highlightText(section, searchTerm);
                found = true;
            } else {
                section.style.display = 'none';
                removeHighlights(section);
            }
        });

        // Show "no results" message if needed
        if (!found) {
            showNoResults();
        } else {
            hideNoResults();
        }
    });

    function highlightText(element, searchTerm) {
        // Remove existing highlights
        removeHighlights(element);

        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;

        while (node = walker.nextNode()) {
            if (node.nodeValue.toLowerCase().includes(searchTerm)) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(textNode => {
            const parent = textNode.parentNode;
            if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return;

            const text = textNode.nodeValue;
            const regex = new RegExp(`(${searchTerm})`, 'gi');

            if (regex.test(text)) {
                const highlightedHTML = text.replace(regex, '<span class="highlight">$1</span>');
                const wrapper = document.createElement('span');
                wrapper.innerHTML = highlightedHTML;
                parent.insertBefore(wrapper, textNode);
                parent.removeChild(textNode);
            }
        });
    }

    function removeHighlights(element) {
        const highlights = element.querySelectorAll('.highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
    }

    function showNoResults() {
        hideNoResults(); // Remove existing message
        const mainContent = document.querySelector('.main-content');
        const noResultsDiv = document.createElement('div');
        noResultsDiv.id = 'noResults';
        noResultsDiv.style.textAlign = 'center';
        noResultsDiv.style.padding = '4rem';
        noResultsDiv.style.color = '#6b7280';
        noResultsDiv.innerHTML = `
            <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
            <h3>Keine Ergebnisse gefunden</h3>
            <p>Versuche andere Suchbegriffe wie "Schwingung", "Welle", "Feld", "Quanten" etc.</p>
        `;
        mainContent.appendChild(noResultsDiv);
    }

    function hideNoResults() {
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.remove();
        }
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });

    // Add animation to cards when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all content cards
    document.querySelectorAll('.content-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }

        // Escape to clear search
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.blur();
            sections.forEach(section => {
                section.style.display = 'block';
                removeHighlights(section);
            });
            hideNoResults();
        }
    });

    // Add search placeholder animation
    const placeholders = [
        'Thema suchen...',
        'z.B. Schwingung',
        'z.B. Interferenz',
        'z.B. Quantenphysik',
        'z.B. Radioaktivität',
        'z.B. Kondensator'
    ];

    let placeholderIndex = 0;
    setInterval(() => {
        if (searchInput !== document.activeElement) {
            placeholderIndex = (placeholderIndex + 1) % placeholders.length;
            searchInput.placeholder = placeholders[placeholderIndex];
        }
    }, 3000);

    // Initialize MathJax
    window.MathJax = {
        tex: {
            inlineMath: [['\(', '\)']],
            displayMath: [['\[', '\]']],
            processEscapes: true
        },
        svg: {
            fontCache: 'global'
        }
    };
});
