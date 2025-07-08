using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProdutoService.Models
{
    public class Produto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public int Quantidade { get; set; }

        [Column("preco_unitario")]
        public decimal? PrecoUnitario { get; set; }

        [Column("data_cadastro")]
        public DateTime DataCadastro { get; set; }

        [Column("data_atualizacao")]
        public DateTime DataAtualizacao { get; set; }

        public bool Ativo { get; set; }
    }
}
