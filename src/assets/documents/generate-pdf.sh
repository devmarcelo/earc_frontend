#!/bin/bash

# Script para gerar PDF dos termos de uso a partir do markdown
# Requer pandoc e wkhtmltopdf instalados

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCS_DIR="$SCRIPT_DIR"
MARKDOWN_FILE="$DOCS_DIR/termos-de-uso.md"
PDF_FILE="$DOCS_DIR/termos-de-uso.pdf"

echo "Gerando PDF dos termos de uso..."

# Verifica se o arquivo markdown existe
if [ ! -f "$MARKDOWN_FILE" ]; then
    echo "Erro: Arquivo $MARKDOWN_FILE não encontrado!"
    exit 1
fi

# Método 1: Usando pandoc (se disponível)
if command -v pandoc &> /dev/null; then
    echo "Usando pandoc para gerar PDF..."
    pandoc "$MARKDOWN_FILE" -o "$PDF_FILE" \
        --pdf-engine=wkhtmltopdf \
        --margin-top=20mm \
        --margin-bottom=20mm \
        --margin-left=20mm \
        --margin-right=20mm \
        --encoding=UTF-8
    
    if [ $? -eq 0 ]; then
        echo "PDF gerado com sucesso: $PDF_FILE"
        exit 0
    else
        echo "Erro ao gerar PDF com pandoc"
    fi
fi

# Método 2: Usando wkhtmltopdf diretamente (se disponível)
if command -v wkhtmltopdf &> /dev/null; then
    echo "Usando wkhtmltopdf para gerar PDF..."
    
    # Converte markdown para HTML temporário
    HTML_TEMP="$DOCS_DIR/temp_terms.html"
    
    cat > "$HTML_TEMP" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Termos de Uso - Sistema eARC</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        h3 { color: #777; margin-top: 20px; }
        p { margin-bottom: 10px; }
        ul { margin-left: 20px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 0.9em; color: #666; }
    </style>
</head>
<body>
EOF
    
    # Converte markdown básico para HTML
    while IFS= read -r line; do
        if [[ $line =~ ^#[[:space:]](.+) ]]; then
            echo "<h1>${line#* }</h1>" >> "$HTML_TEMP"
        elif [[ $line =~ ^##[[:space:]](.+) ]]; then
            echo "<h2>${line#* }</h2>" >> "$HTML_TEMP"
        elif [[ $line =~ ^###[[:space:]](.+) ]]; then
            echo "<h3>${line#* }</h3>" >> "$HTML_TEMP"
        elif [[ $line =~ ^-[[:space:]](.+) ]]; then
            echo "<li>${line#* }</li>" >> "$HTML_TEMP"
        elif [[ $line =~ ^\*\*(.+)\*\*$ ]]; then
            echo "<p class=\"footer\"><strong>${line//\*/}</strong></p>" >> "$HTML_TEMP"
        elif [[ -z "$line" ]]; then
            echo "<br>" >> "$HTML_TEMP"
        else
            echo "<p>$line</p>" >> "$HTML_TEMP"
        fi
    done < "$MARKDOWN_FILE"
    
    echo "</body></html>" >> "$HTML_TEMP"
    
    # Gera PDF do HTML
    wkhtmltopdf \
        --page-size A4 \
        --margin-top 20mm \
        --margin-bottom 20mm \
        --margin-left 20mm \
        --margin-right 20mm \
        --encoding UTF-8 \
        "$HTML_TEMP" "$PDF_FILE"
    
    # Remove arquivo temporário
    rm -f "$HTML_TEMP"
    
    if [ $? -eq 0 ]; then
        echo "PDF gerado com sucesso: $PDF_FILE"
        exit 0
    else
        echo "Erro ao gerar PDF com wkhtmltopdf"
    fi
fi

echo "Aviso: pandoc ou wkhtmltopdf não encontrados."
echo "Para gerar o PDF automaticamente, instale uma das ferramentas:"
echo "  - Ubuntu/Debian: sudo apt-get install pandoc wkhtmltopdf"
echo "  - macOS: brew install pandoc wkhtmltopdf"
echo "  - Windows: Baixe do site oficial"
echo ""
echo "Por enquanto, o sistema usará o conteúdo markdown como fallback."

exit 1

