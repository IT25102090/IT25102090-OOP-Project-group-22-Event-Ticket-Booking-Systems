/**
 * EventTix - Enhanced JavaScript
 * Form validation, search, sort, animations, print receipt, counter
 */
document.addEventListener('DOMContentLoaded', function () {

    // ---- Registration form validation ----
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            const pw = document.getElementById('password').value;
            const cpw = document.getElementById('confirmPassword').value;
            if (pw !== cpw) { e.preventDefault(); showAlert('Passwords do not match!', 'danger'); return; }
            if (pw.length < 6) { e.preventDefault(); showAlert('Password must be at least 6 characters.', 'danger'); return; }
        });
    }

    // ---- Auto-dismiss alerts ----
    document.querySelectorAll('.alert').forEach(function (alert) {
        setTimeout(function () {
            try { bootstrap.Alert.getOrCreateInstance(alert).close(); } catch(e) {}
        }, 5000);
    });

    // ---- Navbar active state ----
    var currentPath = window.location.pathname;
    var searchParams = window.location.search;
    document.querySelectorAll('.main-nav-links .nav-link').forEach(function(link) {
        var href = link.getAttribute('href');
        if (!href) return;
        // Exact match or category match
        if (href === currentPath || (href === currentPath + searchParams && searchParams)) {
            link.classList.add('active');
        }
    });

    // ---- Scroll animations ----
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.event-card, .stat-card, .step-card, .admin-stat-card').forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'all 0.5s ease';
        observer.observe(el);
    });

    // ---- Animated counters on stats section ----
    document.querySelectorAll('.stat-number, .admin-stat-card h3').forEach(function(el) {
        var io = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounter(el);
                    io.unobserve(el);
                }
            });
        }, {threshold: 0.5});
        io.observe(el);
    });

    // ---- Smooth scrolling ----
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            var t = document.querySelector(this.getAttribute('href'));
            if (t) t.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ---- Navbar scroll effect ----
    window.addEventListener('scroll', function () {
        var nav = document.querySelector('.navbar');
        if (nav) {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    // ---- Client-side event search (instant filter) ----
    var searchInput = document.querySelector('input[name="search"]');
    if (searchInput && window.location.pathname === '/events') {
        searchInput.addEventListener('input', debounce(function() {
            var query = searchInput.value.toLowerCase();
            document.querySelectorAll('.event-card').forEach(function(card) {
                var text = card.textContent.toLowerCase();
                var col = card.closest('[class*="col-"]');
                if (col) col.style.display = text.includes(query) ? '' : 'none';
            });
        }, 250));
    }

    // ---- Sort events dropdown ----
    var sortSelect = document.getElementById('sortEvents');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            var container = document.getElementById('eventsGrid');
            if (!container) return;
            var cards = Array.from(container.children);
            cards.sort(function(a, b) {
                if (sortSelect.value === 'price-low') {
                    return getPrice(a) - getPrice(b);
                } else if (sortSelect.value === 'price-high') {
                    return getPrice(b) - getPrice(a);
                } else if (sortSelect.value === 'date') {
                    return getDate(a) - getDate(b);
                }
                return 0;
            });
            cards.forEach(function(c) { container.appendChild(c); });
        });
    }
});

function getPrice(el) {
    var m = el.textContent.match(/(?:LKR|\$)\s*(\d[\d,]*\.?\d*)/);
    return m ? parseFloat(m[1].replace(/,/g, '')) : 0;
}
function getDate(el) {
    var m = el.textContent.match(/(\d{4}-\d{2}-\d{2})/);
    return m ? new Date(m[1]).getTime() : 0;
}

function animateCounter(el) {
    var text = el.textContent.trim();
    var match = text.match(/([\$]?)(\d+\.?\d*)/);
    if (!match) return;
    var prefix = match[1] || '';
    var target = parseFloat(match[2]);
    var isDecimal = match[2].includes('.');
    var duration = 1200;
    var start = performance.now();
    function step(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = target * eased;
        el.textContent = prefix + (isDecimal ? current.toFixed(2) : Math.floor(current));
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = prefix + (isDecimal ? target.toFixed(2) : target);
    }
    requestAnimationFrame(step);
}

function debounce(fn, delay) {
    var timer;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
    };
}

function showAlert(message, type) {
    var c = document.querySelector('.container');
    if (!c) return;
    var d = document.createElement('div');
    d.className = 'alert alert-' + type + ' alert-dismissible fade show';
    d.innerHTML = '<i class="bi bi-exclamation-triangle"></i> ' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
    c.insertBefore(d, c.firstChild);
    setTimeout(function () { d.remove(); }, 5000);
}

// ============================================
// UPGRADE: Additional Features
// ============================================

// ---- Back to Top Button ----
(function() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    btn.title = 'Back to top';
    document.body.appendChild(btn);
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', function() {
        btn.classList.toggle('visible', window.scrollY > 400);
    });
})();

// ---- Event Countdown Timers on Cards ----
document.querySelectorAll('.event-card-info, .detail-item').forEach(function(el) {
    var dateMatch = el.textContent.match(/(\d{4}-\d{2}-\d{2})/);
    if (!dateMatch) return;
    var eventDate = new Date(dateMatch[1]);
    var now = new Date();
    var diff = eventDate - now;
    if (diff > 0) {
        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var card = el.closest('.event-card-body') || el.closest('.event-detail-card');
        if (card && days <= 90) {
            var existing = card.querySelector('.countdown-label');
            if (!existing) {
                var badge = document.createElement('span');
                badge.className = 'countdown-label';
                badge.style.cssText = 'display:inline-block;background:#EEF2FF;color:#4F46E5;font-size:0.75rem;font-weight:600;padding:3px 10px;border-radius:50px;margin-bottom:8px;';
                badge.innerHTML = '<i class="bi bi-clock"></i> ' + days + ' days left';
                card.insertBefore(badge, card.firstChild);
            }
        }
    }
});

// ---- Seat Availability Color Bars ----
document.querySelectorAll('.event-card-info').forEach(function(info) {
    var seatsText = info.textContent;
    var match = seatsText.match(/(\d+)\s*\/\s*(\d+)\s*seats/);
    if (!match) return;
    var avail = parseInt(match[1]);
    var total = parseInt(match[2]);
    var pct = (avail / total) * 100;
    var colorClass = pct > 50 ? 'high' : (pct > 20 ? 'medium' : 'low');
    var bar = document.createElement('div');
    bar.className = 'seat-bar-mini';
    bar.innerHTML = '<div class="seat-bar-fill ' + colorClass + '" style="width:' + pct + '%"></div>';
    info.appendChild(bar);
});

// ---- Admin Table Search ----
document.querySelectorAll('.admin-section h3').forEach(function(h3) {
    var section = h3.closest('.admin-section');
    var table = section.querySelector('table');
    if (!table) return;
    var searchDiv = document.createElement('div');
    searchDiv.className = 'admin-search mb-2';
    searchDiv.innerHTML = '<input type="text" class="form-control form-control-sm" placeholder="Search this table...">';
    h3.parentElement.insertBefore(searchDiv, h3.nextSibling);
    var input = searchDiv.querySelector('input');
    input.addEventListener('input', debounce(function() {
        var query = input.value.toLowerCase();
        table.querySelectorAll('tbody tr').forEach(function(row) {
            row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
        });
    }, 200));
});

// ---- Wishlist Heart Toggle ----
document.querySelectorAll('.event-card-wish').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.toggle('active');
        var icon = this.querySelector('i');
        if (this.classList.contains('active')) {
            icon.className = 'bi bi-heart-fill';
        } else {
            icon.className = 'bi bi-heart';
        }
    });
});

// ============================================
// ADMIN PANEL — Sidebar, Charts, CSV Export
// ============================================

// ---- Admin Sidebar Toggle ----
(function() {
    var toggle = document.getElementById('adminSidebarToggle');
    var sidebar = document.getElementById('adminSidebar');
    var overlay = document.getElementById('adminSidebarOverlay');
    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
    });
    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }
})();

// ---- Admin Bar Charts Animation ----
(function() {
    var bars = document.querySelectorAll('.admin-bar-fill[data-value]');
    if (!bars.length) return;
    var values = [];
    bars.forEach(function(bar) { values.push(parseFloat(bar.dataset.value) || 0); });
    var max = Math.max.apply(null, values) || 1;
    setTimeout(function() {
        bars.forEach(function(bar) {
            var val = parseFloat(bar.dataset.value) || 0;
            bar.style.width = Math.max((val / max) * 100, 5) + '%';
        });
    }, 300);
})();

// ---- Admin Donut Chart ----
(function() {
    var donut = document.getElementById('bookingDonut');
    if (!donut) return;
    var confirmed = parseInt(donut.dataset.confirmed) || 0;
    var cancelled = parseInt(donut.dataset.cancelled) || 0;
    var total = confirmed + cancelled;
    if (total === 0) return;
    var confirmedPct = (confirmed / total) * 100;
    donut.style.background = 'conic-gradient(#10B981 0% ' + confirmedPct + '%, #E5E7EB ' + confirmedPct + '% 100%)';
})();

// ---- Admin Gauge Chart (Semi-circle) ----
(function() {
    var gauge = document.getElementById('seatGauge');
    if (!gauge) return;
    var fill = gauge.querySelector('.admin-gauge-fill');
    if (!fill) return;
    var val = parseFloat(gauge.dataset.value) || 0;
    var pct = Math.min(val, 100) / 2; // 50% = full semicircle
    setTimeout(function() {
        fill.style.background = 'conic-gradient(from 0.75turn, #059669 0%, #34D399 ' + pct + '%, #F3F4F6 ' + pct + '%, #F3F4F6 50%, transparent 50%)';
    }, 300);
})();

// ---- CSV Export ----
(function() {
    var exportBtn = document.getElementById('exportPaymentsCSV');
    if (!exportBtn) return;
    exportBtn.addEventListener('click', function() {
        var table = document.getElementById('paymentsTable');
        if (!table) return;
        var csv = [];
        table.querySelectorAll('tr').forEach(function(row) {
            var cols = [];
            row.querySelectorAll('th, td').forEach(function(cell) {
                cols.push('"' + cell.textContent.trim().replace(/"/g, '""') + '"');
            });
            csv.push(cols.join(','));
        });
        var blob = new Blob([csv.join('\n')], { type: 'text/csv' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = 'payments_export.csv'; a.click();
        URL.revokeObjectURL(url);
    });
})();
