namespace API.DTOs
{
    public class CartDto
    {
        public int Id { get; set; }
        public string CustomerId { get; set; }
        public List<CartItemDto> CartItems { get; set; }
    }
}
