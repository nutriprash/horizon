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
  
  const ANIMATION_DURATION = 3000;
  
  function isGiftBox(productHandle) {
    return GIFT_BOX_COLLECTIONS.some(collection => 
      productHandle && productHandle.includes(collection)
    );
  }
  
  function showAnimation() {
    console.log('Showing confetti animation...');
    const overlay = document.getElementById('gift-box-animation-overlay');
    if (!overlay) return;
    
    overlay.style.display = 'flex';
    
    setTimeout(() => {
      overlay.style.display = 'none';
    }, ANIMATION_DURATION);
  }
  
  // Listen for add to cart
  document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form && form.action && form.action.includes('/cart/add')) {
      const productHandle = window.location.pathname.split('/').pop();
      
      setTimeout(() => {
        if (isGiftBox(productHandle)) {
          console.log('Gift box detected!');
          showAnimation();
        }
      }, 300);
    }
  });
})();
