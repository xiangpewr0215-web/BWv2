// public/js/load-components.js
document.addEventListener('DOMContentLoaded', function() {
    
    // 加载 Header
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        fetch('/includes/header.html')
            .then(response => {
                if (!response.ok) throw new Error('Header not found');
                return response.text();
            })
            .then(html => {
                headerContainer.innerHTML = html;
                
                // Header 加载完成后，重新绑定移动端菜单事件和激活状态
                initNavigation();
            })
            .catch(err => console.error('Failed to load header:', err));
    }
    
    // 加载 Footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        fetch('/includes/footer.html')
            .then(response => {
                if (!response.ok) throw new Error('Footer not found');
                return response.text();
            })
            .then(html => {
                footerContainer.innerHTML = html;
            })
            .catch(err => console.error('Failed to load footer:', err));
    }
});

// 初始化导航交互（因为动态加载后需要重新绑定事件）
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        // 移除旧事件监听（避免重复绑定）
        const newToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newToggle, menuToggle);
        
        newToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // 高亮当前页面导航
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            const linkPage = href.replace('.html', '').replace('/', '');
            if ((currentPage === 'index' && (linkPage === '' || linkPage === 'index')) ||
                (linkPage === currentPage)) {
                link.classList.add('active');
            }
        }
    });
}