using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class CartController : BaseApiController
    {
        private StoreContext _context;
        public CartController(StoreContext context)
        {
            _context = context;
        }
        [HttpGet(Name ="GetCart")]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            var cart = await _context.Carts.Include(i => i.Items).ThenInclude(p => p.Product).FirstOrDefaultAsync(x => x.CustomerId == Request.Cookies["customerId"]);

            if (cart == null) { return NotFound(); }
            return MapCartDto(cart);
        }


        [HttpPost]

        public async Task<ActionResult<CartDto>> AddItemToCart(int productId, int quantity)
        {
            var cart = await _context.Carts.Include(i => i.Items).ThenInclude(p => p.Product).FirstOrDefaultAsync(x => x.CustomerId == Request.Cookies["customerId"]);

            if (cart == null)
            {
                var customerId = Guid.NewGuid().ToString();

                var cookieOptions = new CookieOptions
                {
                    IsEssential = true,
                    Expires = DateTime.Now.AddDays(30),
                };
                Response.Cookies.Append("customerId", customerId, cookieOptions);

                cart = new Cart { CustomerId = customerId };

                await _context.Carts.AddAsync(cart);
            }

            var products = await _context.Products.FindAsync(productId);
            if (products == null) { return NotFound(); }

            cart.AddItemToCart(products, quantity);


            var result = await _context.SaveChangesAsync() > 0;

            if (result)
                return CreatedAtRoute("GetCart", MapCartDto(cart));

            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });

        }

        [HttpDelete]
        public async Task<ActionResult> RemoveItemFromCart(int productId, int quantity)
        {

            var cart = await _context.Carts.Include(i => i.Items).ThenInclude(p => p.Product).FirstOrDefaultAsync(x => x.CustomerId == Request.Cookies["customerId"]);

            if (cart == null) { return BadRequest(new ProblemDetails { Title ="Product not found"}); }

            cart.RemoveItem(productId, quantity);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Error removing the item." });
        }


        private CartDto MapCartDto(Cart cart)
        {
            return new CartDto()
            {
                Id = cart.Id,
                CustomerId = cart.CustomerId,
                CartItems = cart.Items.Select(cartItem => new CartItemDto
                {
                    ProductId = cartItem.ProductId,
                    Name = cartItem.Product.Name,
                    Brand = cartItem.Product.Brand,
                    Price = cartItem.Product.Price,
                    Quantity = cartItem.Quantity,
                    PictureUrl = cartItem.Product.ImageUrl,
                    Type = cartItem.Product.Type,
                }).ToList(),
            };
        }
    }
}
