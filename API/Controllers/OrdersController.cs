using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggragate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly StoreContext _context;
        public OrdersController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            return await _context.Orders.ProjectOrderToOrderDto()
                .Where(x => x.CustomerId == User.Identity.Name)
                .ToListAsync();
        }

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            return await _context.Orders
                .ProjectOrderToOrderDto()
                .Where(y => y.CustomerId == User.Identity.Name && y.Id == id)
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateOrder(CreateOrderDto orderDto)
        {
            var cart = await _context.Carts.RetrieveCartWithItems(User.Identity.Name).FirstOrDefaultAsync();

            if (cart == null)
            {
                return BadRequest(new ProblemDetails { Title = " Could not found the cart" });
            }

            var items = new List<OrderItem>();

            foreach (var item in cart.Items)
            {
                var productItem = await _context.Products.FindAsync(item.ProductId);
                var ItemOrdered = new ProductItemOrdered
                {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.ImageUrl
                };
                var orderedItem = new OrderItem
                {
                    ItemOrdered = ItemOrdered,
                    Price = productItem.Price,
                    Quantity = item.Quantity
                };
                items.Add(orderedItem);
                productItem.QuantityInStock -= item.Quantity;
            }

            var subTotal = items.Sum(item => item.Price * item.Quantity);
            var deliveryFee = subTotal > 10000 ? 0 : 500;

            var order = new Order
            {
                OrderItems = items,
                CustomerId = User.Identity.Name,
                ShippingAddress = orderDto.ShippingAddress,
                DeliveryFee = deliveryFee,
                SubTotal = subTotal
            };

            await _context.Orders.AddAsync(order);
            _context.Carts.Remove(cart);

            if (orderDto.SaveAddress == true)
            {
                var user = await _context.Users.Include(x => x.Address).FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
                var address = new UserAddress
                {
                    FullName = orderDto.ShippingAddress.FullName,
                    Address1 = orderDto.ShippingAddress.FullName,
                    Address2 = orderDto.ShippingAddress.FullName,
                    City = orderDto.ShippingAddress.FullName,
                    Country = orderDto.ShippingAddress.FullName,
                    Zip = orderDto.ShippingAddress.FullName,
                    State = orderDto.ShippingAddress.State
                };
                user.Address = address;
            }

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);

            return BadRequest("Creating order has failed")
;

        }
    }
}