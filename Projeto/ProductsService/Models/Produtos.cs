using System;

namespace ProductsService.Models {

    public class Produtos {

        private int id_produto {  get; set; }
        private string nomeProduto { get; set; }
        private int quantidadeProduto { get; set; }
        private decimal valorProduto { get; set; }

        public Produtos() {

        }

    }
}