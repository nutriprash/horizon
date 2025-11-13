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
  
  let lottieAnimation;
  
  function loadAnimation() {
    const animContainer = document.getElementById('lottie-animation');
    if (!animContainer) {
      console.log('Animation container not found');
      return;
    }
    
    // Destroy existing animation if any
    if (lottieAnimation) {
      lottieAnimation.destroy();
    }
    
    try {
      lottieAnimation = lottie.loadAnimation({
        container: animContainer,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'https://lottie.host/52b2ae88-d498-417d-81ed-1afb5ddd136f/kGGTyVH36j.json'
      });
      
      console.log('Lottie animation loaded successfully');
    } catch (error) {
      console.error('Error loading animation:', error);
    }
  }
  
  function isGiftBox(productHandle) {
    return GIFT_BOX_COLLECTIONS.some(collection => 
      productHandle && productHandle.includes(collection)
    );
  }
  
  function showAnimation() {
    console.log('Showing animation...');
    const overlay = document.getElementById('gift-box-animation-overlay');
    if (!overlay) {
      console.log('Overlay not found');
      return;
    }
    
    overlay.style.display = 'flex';
    
    if (lottieAnimation) {
      lottieAnimation.goToAndPlay(0, true);
      console.log('Animation playing');
    } else {
      console.log('Animation not loaded, loading now...');
      loadAnimation();
      setTimeout(() => {
        if (lottieAnimation) {
          lottieAnimation.goToAndPlay(0, true);
        }
      }, 500);
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
          console.log('Product belongs to gift box collection');
          showAnimation();
        }
      }
    } catch (error) {
      console.log('Could not check product collections:', error);
    }
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Gift box animation script loaded');
    loadAnimation();
    
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0];
      
      if (typeof url === 'string' && url.includes('/cart/add')) {
        return originalFetch.apply(this, args).then(response => {
          if (response.ok) {
            response.clone().json().then(data => {
              console.log('Product added to cart:', data);
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
