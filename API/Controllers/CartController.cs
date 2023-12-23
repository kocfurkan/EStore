using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class CartController : BaseApiController
    {
        private readonly StoreContext _context;
        public CartController(StoreContext context)
        {
            _context = context;
        }

        private async Task<Cart> RetrieveCart(string customerId)
        {
            if (string.IsNullOrEmpty(customerId))
            {
                Response.Cookies.Delete("customerId");
                return null;
            }

            return await _context.Carts
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.CustomerId == customerId);
        }

        private string GetCustomerId()
        {
            return User.Identity.Name ?? Request.Cookies["customerId"];
        }

        [HttpGet(Name = "GetCart")]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            var cart = await RetrieveCart(GetCustomerId());

            if (cart == null) { return NotFound(); }
            return cart.MapCartToDto();
        }

        [HttpPost]
        public async Task<ActionResult<CartDto>> AddItemToCart(int productId, int quantity)
        {
            var cart = await RetrieveCart(GetCustomerId());

            if (cart == null)
            {
                var customerId = User.Identity?.Name;
                if (string.IsNullOrEmpty(customerId))
                {
                    customerId = Guid.NewGuid().ToString();

                    var cookieOptions = new CookieOptions
                    {
                        IsEssential = true,
                        Expires = DateTime.Now.AddDays(30),
                    };
                    Response.Cookies.Append("customerId", customerId, cookieOptions);
                }



                cart = new Cart { CustomerId = customerId };

                await _context.Carts.AddAsync(cart);
            }

            var products = await _context.Products.FindAsync(productId);
            if (products == null) { return NotFound(); }

            cart.AddItemToCart(products, quantity);


            var result = await _context.SaveChangesAsync() > 0;

            if (result)
                return CreatedAtRoute("GetCart", cart.MapCartToDto());

            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });

        }

        [HttpDelete]
        public async Task<ActionResult> RemoveItemFromCart(int productId, int quantity)
        {

            var cart = await RetrieveCart(GetCustomerId());

            if (cart == null) { return BadRequest(new ProblemDetails { Title = "Product not found" }); }

            cart.RemoveItem(productId, quantity);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Error removing the item." });
        }
    }

}

