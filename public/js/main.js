// ===== B+W Builders - Main JavaScript =====
// 此文件只负责页面通用交互（不包含导航栏初始化，导航已交由 load-components.js 处理）

document.addEventListener('DOMContentLoaded', function() {
    
    // ============ 联系表单处理 ============
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value.trim()
            };
            
            // 前端验证
            if (!validateContactForm(formData)) {
                return;
            }
            
            // 显示加载状态
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // 隐藏之前的消息
            const formMessage = document.getElementById('formMessage');
            formMessage.style.display = 'none';
            formMessage.className = 'form-message';
            
            try {
                // 发送请求到后端
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // 成功
                    formMessage.textContent = result.message;
                    formMessage.classList.add('success');
                    formMessage.style.display = 'block';
                    contactForm.reset(); // 清空表单
                } else {
                    // 失败
                    formMessage.textContent = result.message;
                    formMessage.classList.add('error');
                    formMessage.style.display = 'block';
                }
            } catch (error) {
                console.error('Form submission error:', error);
                formMessage.textContent = 'An error occurred. Please try again later.';
                formMessage.classList.add('error');
                formMessage.style.display = 'block';
            } finally {
                // 恢复按钮状态
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // ============ 表单验证函数 ============
    function validateContactForm(data) {
        const formMessage = document.getElementById('formMessage');
        
        // 验证姓名
        if (data.name.length < 2) {
            showFormError('Please enter your full name (at least 2 characters).');
            return false;
        }
        
        // 验证邮箱
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormError('Please enter a valid email address.');
            return false;
        }
        
        // 验证消息
        if (data.message.length < 10) {
            showFormError('Please enter a message with at least 10 characters.');
            return false;
        }
        
        return true;
    }
    
    function showFormError(message) {
        const formMessage = document.getElementById('formMessage');
        formMessage.textContent = message;
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        
        // 滚动到消息位置
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // ============ 平滑滚动 ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // ============ 项目分类筛选功能 (Products 页面) ============
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.product-card');
    const projectsGrid = document.getElementById('projectsGrid');
    const noResultsMsg = document.getElementById('noResultsMessage');
    
    if (filterButtons.length > 0 && projectCards.length > 0) {
        
        // 筛选函数
        function filterProjects(category) {
            let visibleCount = 0;
            
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // 显示或隐藏"无结果"提示
            if (noResultsMsg) {
                if (visibleCount === 0) {
                    noResultsMsg.style.display = 'block';
                    if (projectsGrid) projectsGrid.style.display = 'none';
                } else {
                    noResultsMsg.style.display = 'none';
                    if (projectsGrid) projectsGrid.style.display = 'grid';
                }
            }
            
            // 更新按钮激活状态
            filterButtons.forEach(btn => {
                const btnFilter = btn.getAttribute('data-filter');
                if (btnFilter === category) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
        
        // 为每个按钮绑定点击事件
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const filterValue = this.getAttribute('data-filter');
                filterProjects(filterValue);
            });
        });
        
        // 默认激活 "All" 按钮（确保初始状态正确）
        const activeBtn = document.querySelector('.filter-btn.active');
        if (activeBtn) {
            const defaultFilter = activeBtn.getAttribute('data-filter');
            filterProjects(defaultFilter);
        }
    }
    
});