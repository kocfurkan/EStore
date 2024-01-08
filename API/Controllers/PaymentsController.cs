using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities.OrderAggragate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        public PaymentService _paymentService;
        public StoreContext _context { get; set; }
        public IConfiguration _config { get; }
        public PaymentsController(PaymentService paymentService, StoreContext context, IConfiguration config)
        {
            _config = config;
            _paymentService = paymentService;
            _context = context;
        }
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<CartDto>> CreateOrUpdatePaymentIntent()
        {
            var cart = await _context.Carts
                .RetrieveCartWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();

            if (cart == null) return NotFound();

            var intent = await _paymentService.CreateOrUpdatePaymentIntent(cart);

            if (intent == null) return BadRequest(new ProblemDetails { Title = "Problem creating payment intent" });

            cart.PaymentIntentId = cart.PaymentIntentId ?? intent.Id;
            cart.ClientSecret = cart.ClientSecret ?? intent.ClientSecret;

            _context.Update(cart);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating cart with intent" });

            return cart.MapCartToDto();
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"],
            _config["StripeSettings:WhSecret"]

            );

            var charge = (Charge)stripeEvent.Data.Object;

            var order = await _context.Orders.FirstOrDefaultAsync(x => x.PaymentIntentId == charge.PaymentIntentId);

            if (charge.Status == " succeeded") order.OrderStatus = OrderStatus.PaymentReceived;

            await _context.SaveChangesAsync();

            //If we dont return an empty req strip will keep sending requests to endpoint
            return new EmptyResult();
        }
    }
}