document.addEventListener('DOMContentLoaded', function() {
  async function include(selector, url) {
    var el = document.querySelector(selector);
    if (!el) return;
    try {
      var res = await fetch(url, {cache: 'no-store'});
      if (res.ok) {
        el.innerHTML = await res.text();
        return el;
      } else {
        console.error('Include failed:', url, res.status);
      }
    } catch (e) {
      console.error('Include error:', e);
    }
    return null;
  }

  function applyActiveNav(container) {
    try {
      var activeMeta = document.querySelector('meta[name="nav-active"]');
      var activeKey = activeMeta ? activeMeta.getAttribute('content') : null;
      var links = container.querySelectorAll('nav#navmenu a');
      links.forEach(function(a){
        a.classList.remove('active');
        var key = a.dataset.key || null;
        if (activeKey && key === activeKey) a.classList.add('active');
      });
      // If no explicit activeKey, mark the link whose href matches current path or hash
      if (!activeKey) {
        var path = location.pathname.split('/').pop();
        links.forEach(function(a){
          var href = a.getAttribute('href') || '';
          if (href.indexOf(location.hash) !== -1 || href.indexOf(path) !== -1 || (location.hash && href.indexOf(location.hash)!==-1)) {
            a.classList.add('active');
          }
        });
      }
    } catch (e) { console.error(e); }
  }

  function applyNavExtra(container) {
    var tmpl = document.getElementById('nav-extra');
    if (!tmpl) return;
    var ul = container.querySelector('#navmenu ul');
    if (!ul) return;
    ul.insertAdjacentHTML('beforeend', tmpl.innerHTML);
  }

  (async function(){
    var headerEl = await include('#site-header', 'partials/header.html');
    // Fallback HTML in case fetch fails (helps when serving via file:// or partials missing)
    var fallbackHeaderHTML = `
      <header id="header" class="header dark-background d-flex flex-column">
        <i class="header-toggle d-xl-none bi bi-list"></i>
        <div class="profile-img">
          <img src="assets/img/my-profile-img.jpg" alt="" class="img-fluid rounded-circle">
        </div>
        <a href="index.html" class="logo d-flex align-items-center justify-content-center"><h1 class="sitename">Lijo Jolly Daniel</h1></a>
        <div class="social-links text-center">
          <a href="#" class="twitter"><i class="bi bi-twitter-x"></i></a>
          <a href="#" class="facebook"><i class="bi bi-facebook"></i></a>
          <a href="#" class="instagram"><i class="bi bi-instagram"></i></a>
          <a href="#" class="google-plus"><i class="bi bi-skype"></i></a>
          <a href="#" class="linkedin"><i class="bi bi-linkedin"></i></a>
        </div>
        <nav id="navmenu" class="navmenu"><ul>
          <li><a href="index.html#hero" data-key="home"><i class="bi bi-house navicon"></i>Home</a></li>
          <li><a href="index.html#about" data-key="about"><i class="bi bi-person navicon"></i> About</a></li>
          <li><a href="index.html#resume" data-key="resume"><i class="bi bi-file-earmark-text navicon"></i> Resume</a></li>
          <li><a href="index.html#portfolio" data-key="portfolio"><i class="bi bi-images navicon"></i> My Apps</a></li>
          <li><a href="index.html#services" data-key="services"><i class="bi bi-hdd-stack navicon"></i> Services</a></li>
          <li><a href="index.html#contact" data-key="contact"><i class="bi bi-envelope navicon"></i> Contact</a></li>
        </ul></nav>
      </header>`;

    if (headerEl) {
      applyNavExtra(headerEl);
      applyActiveNav(headerEl);
    } else {
      // inject fallback so menu is always available
      var host = document.querySelector('#site-header');
      if (host) {
        host.innerHTML = fallbackHeaderHTML;
        applyActiveNav(host);
      }
    }

    var footerEl = await include('#site-footer', 'partials/footer.html');
    if (!footerEl) {
      var fhost = document.querySelector('#site-footer');
      if (fhost) fhost.innerHTML = '<footer id="footer" class="footer position-relative light-background"><div class="container"><div class="copyright text-center"><p>© <span>Copyright</span> <strong class="px-1 sitename">Lijo\'s Web</strong> <span>All Rights Reserved</span></p></div></div></footer>';
    }
  })();

});
