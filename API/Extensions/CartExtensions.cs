using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class CartExtensions
    {
        public static CartDto MapCartToDto(this Cart cart)
        {
            return new CartDto()
            {
                Id = cart.Id,
                CustomerId = cart.CustomerId,
                PaymentIntentId = cart.PaymentIntentId,
                ClientSecret = cart.ClientSecret,
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

        public static IQueryable<Cart> RetrieveCartWithItems(this IQueryable<Cart> query, string customerId)
        {

            return query.Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .Where(y => y.CustomerId == customerId);

        }

    }
}