(function() {
  // List of collection handles that should trigger the animation
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
  
  function isGiftBox(productHandle) {
    // Check if product handle matches any gift box collection
    return GIFT_BOX_COLLECTIONS.some(collection => 
      productHandle && productHandle.includes(collection)
    );
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
  
  // Fetch product details to check collections
  async function checkProductCollections(productId) {
    try {
      const response = await fetch(`/products/${productId}.js`);
      const product = await response.json();
      
      // Check if product belongs to any gift box collection
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
  
  document.addEventListener('DOMContentLoaded', function() {
    loadAnimation();
    
    // Method 1: Intercept fetch requests to /cart/add.js
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0];
      
      if (typeof url === 'string' && url.includes('/cart/add')) {
        return originalFetch.apply(this, args).then(response => {
          if (response.ok) {
            response.clone().json().then(data => {
              const productHandle = data.handle || '';
              
              // Check by handle or fetch full product data
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
    
    // Method 2: Listen for form submissions (for themes that use forms)
    document.addEventListener('submit', function(e) {
      const form = e.target;
      if (form && form.action && form.action.includes('/cart/add')) {
        const productIdInput = form.querySelector('[name="id"]');
        if (productIdInput) {
          const variantId = productIdInput.value;
          // Get product handle from the page if available
          const productHandle = window.location.pathname.split('/').pop();
          
          setTimeout(() => {
            if (isGiftBox(productHandle)) {
              showAnimation();
            }
          }, 500);
        }
      }
    });
  });
})();
