using System;
using Microsoft.Data.SqlClient;

namespace ProdutoService.Data
{
    public class TesteConexao
    {
        public static void Testar()
        {
            var connectionString = "Server=(localdb)\\MSSQLLocalDB;Database=SQL_DB_1;Trusted_Connection=True;";
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    Console.WriteLine("Conexão bem-sucedida!");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao conectar: {ex.Message}");
            }
        }
    }
}