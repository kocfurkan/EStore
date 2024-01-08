using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Stripe;

namespace API.Services
{
    public class PaymentService
    {
        private readonly IConfiguration config;
        public PaymentService(IConfiguration config)
        {
            this.config = config;

        }

        public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Cart cart)
        {
            StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

            var service = new PaymentIntentService();

            var intent = new PaymentIntent();

            var subtotal = cart.Items.Sum(x => x.Quantity * x.Product.Price);
            var deliveryFee = subtotal > 10000 ? 0 : 500;

            if (string.IsNullOrEmpty(cart.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = subtotal + deliveryFee,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" }
                };

                intent = await service.CreateAsync(options);


            }
            else
            {
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = subtotal + deliveryFee
                };
                await service.UpdateAsync(cart.PaymentIntentId, options);
            }

            return intent;
        }
    }
}