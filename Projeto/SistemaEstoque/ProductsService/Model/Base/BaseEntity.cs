using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;



namespace ProductsService.Model.Base {
    public class BaseEntity {


        [Key]
        [Column("id")]

        public int Id { get; set; }
    }
}
