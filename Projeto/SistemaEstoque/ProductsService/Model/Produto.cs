using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProductsService.Model {

    [Table("Produtos")]
    public class Produto {
        [Key]
        public int idProduto { get; set; }
        public string nomeProduto { get; set; }
        public int quatidadeProduto { get; set; }
        public decimal valorProduto { get; set; }

        public Produto() { }

    }
}
