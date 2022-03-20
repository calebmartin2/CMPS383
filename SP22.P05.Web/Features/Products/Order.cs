using SP22.P05.Web.Features.Authorization;

namespace SP22.P05.Web.Features.Products
{
    public class Order
    {
        public int Id { get; set; }
        public virtual User? User { get; set; }
        public int UserId { get; set; }
        public decimal Amount { get; set; }
    }
}
