using ColecaoApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ColecaoApp.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {  
    }

    public DbSet<Camisa> Camisas => Set<Camisa>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(150);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Nome).IsRequired().HasMaxLength(100);
            entity.Property(u => u.SenhaHash).IsRequired();
        });

        modelBuilder.Entity<Camisa>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.NomeTime).IsRequired().HasMaxLength(100);
            entity.Property(c => c.Marca).IsRequired().HasMaxLength(50);
            entity.Property(c => c.Temporada).IsRequired().HasMaxLength(20);
            entity.HasOne(c => c.Usuario).WithMany(u => u.Camisas).HasForeignKey(c => c.UsuarioId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}