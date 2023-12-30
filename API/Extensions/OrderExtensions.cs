using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities.OrderAggragate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtensions
    {
        public static IQueryable<OrderDto> ProjectOrderToOrderDto(this IQueryable<Order> query)
        {
            return query.Select(x => new OrderDto
            {
                Id = x.Id,
                CustomerId = x.CustomerId,
                OrderDate = x.OrderDate,
                ShippingAddress = x.ShippingAddress,
                DeliveryFee = x.DeliveryFee,
                SubTotal = x.SubTotal,
                OrderStatus = x.OrderStatus.ToString(),
                Total = x.GetTotal(),
                OrderItems = x.OrderItems.Select(item => new OrderItemDto
                {
                    ProductId = item.ItemOrdered.ProductId,
                    Name = item.ItemOrdered.Name,
                    PictureUrl = item.ItemOrdered.PictureUrl,
                    Price = item.Price,
                    Quantity = item.Quantity
                }).ToList()
            }).AsNoTracking();
        }
    }
}