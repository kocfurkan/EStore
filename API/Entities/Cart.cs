namespace API.Entities
{
    public class Cart
    {
        public int Id { get; set; }
        public string CustomerId { get; set; }
        public List<CartItem> Items { get; set; } = new List<CartItem>();
        public void AddItemToCart(Product product, int quantity)
        {
            if (Items.All(item=> item.ProductId != product.Id))
            {
                Items.Add(new CartItem()
                {
                    Product = product,
                    Quantity = quantity,
                    CartId = Id
                });

         
            }
            var existingItem = Items.FirstOrDefault(item => item.ProductId== product.Id);
            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
            }
        }
        public void RemoveItem(int productId, int quantity)
        {
            var item = Items.FirstOrDefault(x => x.ProductId == productId);

            if (item == null)
            {
                return;
            }
            item.Quantity -= quantity;

            if (item.Quantity == 0)
            {
                Items.Remove(item);
            }
        }
    }
}
