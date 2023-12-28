document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.bx-cart');
    const wholeCartWindow = document.querySelector('.whole-cart-window');
    const checkoutButton = document.querySelector('.checkout');
  
    checkoutButton.addEventListener('click', realizarPedido);
  
    async function realizarPedido() {
      const cartItems = obtenerProductosCarrito();
      if (cartItems.length === 0) {
        alert('El carrito está vacío. Agregue elementos al carrito antes de realizar un pedido.');
        return;
      }
  
      // Obtener el token almacenado en las cookies
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*=\s*([^;]*).*$)|^.*$/, "$1");
  
      try {
        if (!token) {
          throw new Error('Acceso no autorizado. Token no encontrado.');
        }
  
        const response = await fetch('http://localhost:4000/api/pagar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Asegúrate de incluir el token de autenticación si es necesario
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ cartItems }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error durante el pago');
        }
  
        const responseData = await response.json();
        alert(responseData.message || 'Pedido realizado con éxito');
      } catch (error) {
        console.error('Error durante el pago:', error);
        alert('Error durante el pago. Por favor, inténtalo de nuevo.');
      }
    }
  
    function obtenerProductosCarrito() {
      const cartItems = [];
      const cartWrapper = document.querySelector('.cart-wrapper');
      const cartItemElements = cartWrapper.querySelectorAll('.cart-item');
  
      cartItemElements.forEach((itemElement) => {
        const name = itemElement.querySelector('h3').textContent;
        const desc = itemElement.querySelector('.details p').textContent;
        const img = itemElement.querySelector('img').src;
        const quantity = parseInt(itemElement.querySelector('.quantity-input').value, 10);
        const precio = parseFloat(itemElement.querySelector('.quantity').textContent.replace('precio: $', ''));
  
        const cartItem = {
          name,
          desc,
          img,
          quantity,
          precio,
        };
  
        cartItems.push(cartItem);
      });
  
      return cartItems;
    }
  
    // Otras funciones y eventos relevantes
  });
  