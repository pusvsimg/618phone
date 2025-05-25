document.addEventListener('DOMContentLoaded', function() {
  // 确保页面立即可见
  document.body.classList.add('fade-in');
  document.body.classList.add('loaded');

  // 确保hero区域立即可见
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '1';
    heroContent.style.transform = 'translateY(0)';
  }

  // 延迟一点时间再添加其他动画
  setTimeout(() => {
    // 添加内容元素的级联动画
    const animateElements = () => {
      const elements = [
        ...document.querySelectorAll('.section-header'),
        ...document.querySelectorAll('.phone-card-grid')
      ].filter(el => el); // 过滤掉可能不存在的元素

      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('fade-in-element');
        }, index * 150); // 级联延迟
      });
    };

    // 执行内容动画
    animateElements();
  }, 100);

  // 价格选择器功能
  const priceBtns = document.querySelectorAll('.price-btn');
  const sections = document.querySelectorAll('.price-section');

  priceBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // 移除所有按钮的active类
      priceBtns.forEach(b => b.classList.remove('active'));

      // 添加当前按钮的active类
      this.classList.add('active');

      // 获取目标section
      const targetId = this.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // 平滑滚动到目标section
        const headerOffset = 100;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // 添加高亮效果
        sections.forEach(s => s.classList.remove('highlighted'));
        targetSection.classList.add('highlighted');

        // 3秒后移除高亮
        setTimeout(() => {
          targetSection.classList.remove('highlighted');
        }, 3000);
      }

      // 添加点击涟漪效果
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // 平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetElement = document.querySelector(this.getAttribute('href'));
      if (targetElement) {
        const headerOffset = 80; // 导航栏高度
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 导航栏滚动效果 - 优化性能
  const header = document.querySelector('header');
  let lastScrollTop = 0;
  let scrollTimeout;

  window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 80) { // 减小触发阈值
          header.classList.add('scrolled');

          if (scrollTop > lastScrollTop + 10) { // 添加阈值，避免微小滚动触发
            header.classList.add('hidden'); // 向下滚动时隐藏
          } else if (scrollTop < lastScrollTop - 10) {
            header.classList.remove('hidden'); // 向上滚动时显示
          }
        } else {
          header.classList.remove('scrolled');
          header.classList.remove('hidden');
        }

        lastScrollTop = scrollTop;
        scrollTimeout = null;
      }, 10); // 10ms节流
    }
  }, { passive: true }); // 添加passive标志提高性能

  // 使用Intersection Observer API实现卡片动画 - 增强瀑布流效果
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 添加延迟，创建更自然的瀑布流效果
        setTimeout(() => {
          entry.target.classList.add('visible');

          // 添加额外的动画效果
          const card = entry.target;
          card.style.animationDuration = `${Math.random() * 0.3 + 0.7}s`; // 随机动画持续时间

          // 为卡片内的元素添加级联动画
          setTimeout(() => {
            const image = card.querySelector('.phone-image');
            const info = card.querySelector('.phone-info');
            const stars = card.querySelector('.stars');

            if (image) image.style.opacity = '1';

            if (info) {
              setTimeout(() => {
                info.style.opacity = '1';
              }, 100);
            }

            if (stars) {
              setTimeout(() => {
                stars.style.opacity = '1';
              }, 200);
            }
          }, 100);
        }, parseInt(entry.target.dataset.delay) || 0);
      }
    });
  }, {
    threshold: 0.1, // 当10%的卡片可见时触发
    rootMargin: '0px 0px -50px 0px' // 底部偏移，提前触发
  });

  // 为每个卡片添加随机延迟，创建更自然的瀑布流效果
  document.querySelectorAll('.phone-card').forEach((card, index) => {
    // 计算行和列位置
    const row = Math.floor(index / 3); // 假设每行3个卡片
    const col = index % 3;

    // 基于行列位置计算延迟，创造更自然的瀑布流效果
    const baseDelay = 100; // 基础延迟
    const rowDelay = row * 150; // 行延迟
    const colDelay = col * 80;  // 列延迟
    const randomDelay = Math.random() * 100; // 随机延迟

    const totalDelay = baseDelay + rowDelay + colDelay + randomDelay;
    card.dataset.delay = totalDelay;

    // 初始化卡片内元素的透明度
    const image = card.querySelector('.phone-image');
    const info = card.querySelector('.phone-info');
    const stars = card.querySelector('.stars');

    if (image) image.style.opacity = '0';
    if (info) info.style.opacity = '0';
    if (stars) stars.style.opacity = '0';

    cardObserver.observe(card);
  });

  // 章节标题动画
  const headerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const h2 = entry.target.querySelector('h2');
        if (h2) {
          h2.classList.add('animate-in');
        }
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  });

  // 观察所有章节标题
  document.querySelectorAll('.section-header').forEach(header => {
    headerObserver.observe(header);
  });

  // 增强星级评分系统 - 添加高级交互效果和动画
  document.querySelectorAll('.stars').forEach(starsContainer => {
    const stars = starsContainer.querySelectorAll('.star');
    const ratingValue = starsContainer.querySelector('.rating-value') || starsContainer.parentElement.querySelector('.views');
    let currentRating = 4.5; // 默认评分
    let isAnimating = false;

    // 设置初始星级
    updateStars(currentRating);

    // 为星星添加初始化动画
    stars.forEach((star, index) => {
      // 添加初始化动画，依次显示星星
      setTimeout(() => {
        star.style.transform = 'scale(1.2)';
        star.style.opacity = '1';

        setTimeout(() => {
          star.style.transform = 'scale(1)';
        }, 200);
      }, index * 100);
    });

    // 鼠标悬停和点击效果
    stars.forEach((star, index) => {
      // 鼠标悬停效果 - 增强版
      star.addEventListener('mouseover', () => {
        if (isAnimating) return;

        // 添加波纹效果
        const ripple = document.createElement('span');
        ripple.classList.add('star-ripple');
        star.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 1000);

        // 更新星星显示
        updateStars(index + 1);

        // 添加悬停动画 - 连锁反应
        stars.forEach((s, i) => {
          if (i <= index) {
            s.style.transform = `scale(${1 + (index - i) * 0.05})`;
            s.style.filter = 'brightness(1.2)';
          } else {
            s.style.transform = 'scale(0.9)';
            s.style.filter = 'brightness(0.8)';
          }
        });
      });

      // 鼠标离开效果 - 平滑过渡
      star.addEventListener('mouseout', () => {
        if (isAnimating) return;

        updateStars(currentRating);

        // 重置所有星星样式
        stars.forEach(s => {
          s.style.transform = 'scale(1)';
          s.style.filter = 'brightness(1)';
        });
      });

      // 点击效果 - 增强动画
      star.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        // 设置新评分
        currentRating = index + 1;

        // 创建数字变化动画（如果有评分显示元素）
        if (ratingValue && ratingValue.textContent) {
          const oldValue = parseFloat(ratingValue.textContent.replace(/[^\d.]/g, '')) || 0;
          const newValue = currentRating;
          const duration = 500; // 动画持续时间
          const startTime = performance.now();

          // 数字变化动画
          function animateNumber(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // 使用缓动函数使动画更自然
            const easeOutQuad = t => t * (2 - t);
            const easedProgress = easeOutQuad(progress);

            const currentValue = oldValue + (newValue - oldValue) * easedProgress;
            ratingValue.textContent = currentValue.toFixed(1);

            if (progress < 1) {
              requestAnimationFrame(animateNumber);
            } else {
              ratingValue.textContent = newValue.toFixed(1);
              isAnimating = false;
            }
          }

          requestAnimationFrame(animateNumber);
        } else {
          isAnimating = false;
        }

        // 更新星星
        updateStars(currentRating);

        // 添加点击动画 - 脉冲效果
        stars.forEach((s, i) => {
          if (i <= index) {
            s.classList.add('star-pulse');
            setTimeout(() => {
              s.classList.remove('star-pulse');
            }, 600 + i * 100);
          }
        });

        // 添加评分变化的视觉反馈
        const feedback = document.createElement('div');
        feedback.classList.add('rating-feedback');
        feedback.textContent = `${currentRating.toFixed(1)}★`;
        feedback.style.color = getColorForRating(currentRating);
        starsContainer.appendChild(feedback);

        // 动画结束后移除
        setTimeout(() => {
          feedback.style.opacity = '0';
          feedback.style.transform = 'translateY(-20px) scale(1.5)';
          setTimeout(() => {
            feedback.remove();
          }, 500);
        }, 100);
      });
    });

    // 更新星级显示 - 增强版
    function updateStars(rating) {
      stars.forEach((star, index) => {
        if (index < Math.floor(rating)) {
          // 完整星
          star.classList.add('filled');
          star.classList.remove('half-filled');
          star.style.setProperty('--star-fill', getColorForRating(rating));
        } else if (index === Math.floor(rating) && rating % 1 !== 0) {
          // 半星
          star.classList.add('half-filled');
          star.classList.remove('filled');
          star.style.setProperty('--star-fill', getColorForRating(rating));
        } else {
          // 空星
          star.classList.remove('filled');
          star.classList.remove('half-filled');
        }
      });
    }

    // 根据评分获取颜色 - 从红色到绿色的渐变
    function getColorForRating(rating) {
      // 评分越高，颜色越偏向绿色；评分越低，颜色越偏向红色
      if (rating >= 4.5) return '#00c853'; // 优秀 - 绿色
      if (rating >= 4) return '#64dd17';   // 很好 - 浅绿
      if (rating >= 3.5) return '#ffd600'; // 良好 - 黄色
      if (rating >= 3) return '#ffab00';   // 一般 - 橙色
      if (rating >= 2) return '#ff6d00';   // 较差 - 深橙
      return '#dd2c00';                    // 差 - 红色
    }
  });

  // 增强手机卡片点击效果和交互动画
  document.querySelectorAll('.phone-card').forEach(card => {
    // 添加视差效果
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left; // 鼠标在卡片内的X坐标
      const y = e.clientY - rect.top;  // 鼠标在卡片内的Y坐标

      // 计算鼠标位置相对于卡片中心的偏移
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) / centerX * 5; // 最大偏移5度
      const deltaY = (y - centerY) / centerY * 5;

      // 应用轻微的3D变换
      const img = this.querySelector('.phone-image img');
      if (img) {
        img.style.transform = `scale(1.15) translate(${deltaX * 5}px, ${deltaY * 5}px) rotate(1deg)`;
      }
    });

    // 鼠标离开时重置效果
    card.addEventListener('mouseleave', function() {
      const img = this.querySelector('.phone-image img');
      if (img) {
        img.style.transform = '';
      }
    });

    // 点击效果
    card.addEventListener('click', function(e) {
      // 排除点击星星评分区域
      if (!e.target.closest('.stars')) {
        // 创建点击波纹效果
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.classList.add('card-ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        this.appendChild(ripple);

        // 添加卡片点击动画
        this.classList.add('clicked');

        // 添加3D翻转效果
        const rotateX = (rect.height / 2 - y) / 10;
        const rotateY = (x - rect.width / 2) / 10;

        this.style.transform = `scale(0.98) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // 高亮卡片内容
        const phoneImage = this.querySelector('.phone-image');
        const phoneInfo = this.querySelector('.phone-info');

        if (phoneImage) {
          phoneImage.style.filter = 'brightness(1.1) contrast(1.1)';
        }

        if (phoneInfo) {
          phoneInfo.style.transform = 'translateY(-5px)';
        }

        // 恢复卡片状态
        setTimeout(() => {
          this.classList.remove('clicked');
          this.style.transform = '';

          if (phoneImage) {
            phoneImage.style.filter = '';
          }

          if (phoneInfo) {
            phoneInfo.style.transform = '';
          }

          ripple.remove();
        }, 500);

        // 尝试添加触感反馈
        if ('vibrate' in navigator) {
          navigator.vibrate(10);
        }
      }
    });
  });

  // 增强按钮涟漪效果和触感反馈
  document.querySelectorAll('.cta-button, .nav-link, button').forEach(button => {
    button.addEventListener('click', function(e) {
      // 阻止默认行为，避免导航冲突
      if (this.classList.contains('nav-link')) {
        e.preventDefault();

        // 获取目标位置并平滑滚动
        const targetId = this.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            // 使用之前定义的平滑滚动函数
            smoothScrollTo(targetElement.offsetTop - 80, 800);
          }
        }
      }

      // 创建涟漪效果
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // 计算涟漪大小 - 确保足够大以覆盖整个按钮
      const size = Math.max(rect.width, rect.height) * 2;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;

      // 添加随机颜色变化
      const hue = Math.random() * 30 - 15; // 在当前颜色基础上微调
      ripple.style.filter = `hue-rotate(${hue}deg)`;

      this.appendChild(ripple);

      // 添加按钮按下效果
      this.style.transform = 'scale(0.98)';
      this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

      // 恢复按钮状态
      setTimeout(() => {
        this.style.transform = '';
        this.style.boxShadow = '';
      }, 150);

      // 移除涟漪
      setTimeout(() => {
        ripple.remove();
      }, 600);

      // 尝试添加触感反馈 (如果浏览器支持)
      if ('vibrate' in navigator) {
        navigator.vibrate(15); // 短暂振动15ms
      }
    });

    // 添加鼠标悬停音效
    button.addEventListener('mouseenter', function() {
      // 创建轻微的悬停音效 (如果需要)
      // playHoverSound();

      // 添加悬停动画
      this.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });

    // 动态更新浏览量 (示例)
    document.querySelectorAll('.views-count').forEach(el => {
        let currentViews = parseInt(el.textContent.replace(/,/g, '').replace('K', '000').replace('M', '000000')) || Math.floor(Math.random() * 5000) + 1000;
        el.textContent = currentViews.toLocaleString() + ' Views'; // 初始化时也格式化
        setInterval(() => {
            currentViews += Math.floor(Math.random() * 20) + 1;
            el.textContent = currentViews.toLocaleString() + ' Views';
        }, Math.random() * 8000 + 5000); // 随机更新时间
    });

  // 增强图片懒加载功能
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;

          // 添加淡入加载效果
          const loadImage = () => {
            // 先设置低分辨率模糊效果
            img.style.filter = 'blur(5px)';

            // 创建一个新图像对象预加载
            const newImg = new Image();
            newImg.src = img.src;
            newImg.onload = () => {
              // 图像加载完成后移除模糊并添加loaded类
              img.style.filter = '';
              img.classList.add('loaded');

              // 添加微小的缩放动画
              img.style.transform = 'scale(1.02)';
              setTimeout(() => {
                img.style.transform = '';
              }, 300);
            };
          };

          // 延迟一点时间再加载，避免一次性加载太多图片
          setTimeout(loadImage, Math.random() * 200);

          imageObserver.unobserve(img);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '100px' // 提前加载
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // 回退方案：简单延迟加载
    setTimeout(() => {
      lazyImages.forEach(img => {
        img.classList.add('loaded');
      });
    }, 300);
  }

  // Logo特效 - 增强版
  const logo = document.querySelector('.logo');
  if (logo) {
    const logoHub = logo.querySelector('.logo-hub');

    if (logoHub) {
      // 添加Logo悬停动画
      logo.addEventListener('mouseenter', () => {
        logoHub.style.transform = 'scale(1.1) skewX(-5deg)';
        logoHub.style.filter = 'brightness(1.2)';

        // 添加脉冲光晕效果
        logoHub.style.textShadow = '0 0 10px rgba(255, 153, 0, 0.8), 0 0 20px rgba(255, 153, 0, 0.5)';
      });

      logo.addEventListener('mouseleave', () => {
        logoHub.style.transform = '';
        logoHub.style.filter = '';
        logoHub.style.textShadow = '';
      });

      // 添加点击效果
      logo.addEventListener('click', () => {
        logoHub.classList.add('logo-pulse');
        setTimeout(() => {
          logoHub.classList.remove('logo-pulse');
        }, 500);
      });
    }
  }
});