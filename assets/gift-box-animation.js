(function() {
  const GIFT_BOX_COLLECTIONS = [
    '4-pc-box',
    '6-pc-box',
    '9-pc-box',
    '12-pc-box',
    '15-pc-box',
    '20-pc-box',
    '24-pc-box',
    'cube-box',
    'floral-box-with-3-jars',
    '4-6-assorted-sweet',
    '9-12-assorted-sweet'
  ];
  
  const ANIMATION_DURATION = 4000;
  let lottieAnimation = null;
  let animationReady = false;
  
  function initAnimation() {
    const animContainer = document.getElementById('lottie-animation');
    if (!animContainer) return;
    
    // Make sure lottie library is loaded
    if (typeof lottie === 'undefined') {
      console.error('Lottie library not loaded');
      return;
    }
    
    // Clear container
    animContainer.innerHTML = '';
    
    // Load animation from your uploaded file
    fetch('/cdn/shop/t/2/assets/Confetti.json')
      .then(response => response.json())
      .then(animationData => {
        lottieAnimation = lottie.loadAnimation({
          container: animContainer,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: animationData
        });
        
        animationReady = true;
        console.log('Animation loaded and ready');
      })
      .catch(error => {
        console.error('Error loading animation:', error);
      });
  }
  
  function isGiftBox(productHandle) {
    return GIFT_BOX_COLLECTIONS.some(collection => 
      productHandle && productHandle.includes(collection)
    );
  }
  
  function showAnimation() {
    console.log('Showing animation...');
    const overlay = document.getElementById('gift-box-animation-overlay');
    if (!overlay) return;
    
    overlay.style.display = 'flex';
    
    if (animationReady && lottieAnimation) {
      lottieAnimation.goToAndPlay(0, true);
      console.log('Animation playing');
    } else {
      console.log('Animation not ready yet');
    }
    
    setTimeout(() => {
      overlay.style.display = 'none';
      console.log('Animation hidden');
    }, ANIMATION_DURATION);
  }
  
  async function checkProductCollections(productId) {
    try {
      const response = await fetch(`/products/${productId}.js`);
      const product = await response.json();
      
      if (product.collections) {
        const belongsToGiftBox = product.collections.some(collection => 
          GIFT_BOX_COLLECTIONS.includes(collection.handle)
        );
        
        if (belongsToGiftBox) {
          showAnimation();
        }
      }
    } catch (error) {
      console.log('Could not check product collections:', error);
    }
  }
  
  // Wait for everything to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimation);
  } else {
    initAnimation();
  }
  
  // Intercept add to cart
  window.addEventListener('load', function() {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0];
      
      if (typeof url === 'string' && url.includes('/cart/add')) {
        return originalFetch.apply(this, args).then(response => {
          if (response.ok) {
            response.clone().json().then(data => {
              const productHandle = data.handle || '';
              
              if (isGiftBox(productHandle)) {
                showAnimation();
              } else if (data.product_id) {
                checkProductCollections(data.product_id);
              }
            });
          }
          return response;
        });
      }
      
      return originalFetch.apply(this, args);
    };
    
    document.addEventListener('submit', function(e) {
      const form = e.target;
      if (form && form.action && form.action.includes('/cart/add')) {
        const productHandle = window.location.pathname.split('/').pop();
        
        setTimeout(() => {
          if (isGiftBox(productHandle)) {
            console.log('Gift box detected from form submission');
            showAnimation();
          }
        }, 500);
      }
    });
  });
})();