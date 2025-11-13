(function() {
  const GIFT_BOX_KEYWORDS = ['gift box', 'gift bag'];
  const ANIMATION_DURATION = 3000;
  
  let animationLoaded = false;
  let lottieAnimation;
  
  function loadAnimation() {
    if (animationLoaded) return;
    
    const animContainer = document.getElementById('lottie-animation');
    if (!animContainer) return;
    
    lottieAnimation = lottie.loadAnimation({
      container: animContainer,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: '{{ "Confetti.json" | asset_url }}'
    });
    
    animationLoaded = true;
  }
  
  function isGiftBox(productTitle) {
    const title = productTitle.toLowerCase();
    return GIFT_BOX_KEYWORDS.some(keyword => title.includes(keyword));
  }
  
  function showAnimation() {
    const overlay = document.getElementById('gift-box-animation-overlay');
    if (!overlay) return;
    
    overlay.style.display = 'flex';
    lottieAnimation.goToAndPlay(0, true);
    
    setTimeout(() => {
      overlay.style.display = 'none';
    }, ANIMATION_DURATION);
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    loadAnimation();
    
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0];
      
      if (typeof url === 'string' && url.includes('/cart/add')) {
        return originalFetch.apply(this, args).then(response => {
          if (response.ok) {
            response.clone().json().then(data => {
              const productTitle = data.product_title || data.title || '';
              if (isGiftBox(productTitle)) {
                showAnimation();
              }
            });
          }
          return response;
        });
      }
      
      return originalFetch.apply(this, args);
    };
  });
})();
