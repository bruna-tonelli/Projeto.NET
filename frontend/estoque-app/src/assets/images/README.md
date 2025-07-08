# Como adicionar sua logo

## Instruções:

1. **Adicione sua logo nesta pasta** com o nome `logo.png`

2. **Formatos suportados:**
   - PNG (recomendado para transparência)
   - JPG/JPEG
   - SVG
   - GIF

3. **Tamanhos recomendados:**
   - Largura: 120px a 200px
   - Altura: 40px a 80px
   - Proporção: 2:1 ou 3:1 (largura:altura)

4. **Dicas importantes:**
   - Use fundo transparente (PNG) para melhor resultado
   - A logo será automaticamente ajustada para branco na barra lateral
   - Se a logo não carregar, será mostrado o ícone de warehouse como fallback

## Exemplo de nomes de arquivo aceitos:
- `logo.png` (padrão)
- `logo.jpg`
- `logo.svg`

## Para usar um nome diferente:
Se sua logo tem outro nome, edite o arquivo `app.component.html` na linha:
```html
<img src="assets/images/SEU_NOME_AQUI.png" alt="Logo da Empresa" class="logo-image">
```
