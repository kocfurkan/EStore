using API.DTOs;
using API.Entities;

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