using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP22.P05.Web.Features.Authorization;
using SP22.P05.Web.Features.Transactions;

namespace SP22.P05.Web.Features.Transactions
{
    public class Order
    {
        public int Id { get; set; }
        public virtual User? User { get; set; }
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public DateTimeOffset Date { get; set; }
    }
}

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.Property(x => x.Amount)
             .HasColumnType("decimal(18, 2)");
    }
}