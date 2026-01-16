export const arrayToCsv = (data: object[], headers: string[], { enclosingCharacter = '' } = {}): Blob => {
    const csvData = [
        headers.map((h) => `"${h}"`).join(';'),
        ...data.map((d) =>
            Object.values(d)
                .map((v) => {
                    const formatted = formatNumber(v); 
                    return `${enclosingCharacter}${formatted}${enclosingCharacter}`;
                })
                .join(';')
        ),
    ].join('\r\n');
    const bom = '\uFEFF';
    return new Blob([bom, csvData], { type: `text/csv;charset=utf-8;` });
};

const formatNumber = (value: any) => {
    if (typeof value === 'number') {
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    }

    return value;
}

export const downloadCSVReport = (data: Blob, filename: string) => {
    const downloadLink = document.createElement('a');

    downloadLink.href = URL.createObjectURL(data);
    downloadLink.target = '_blank';
    downloadLink.download = `${filename}.csv`;
    downloadLink.click();

    URL.revokeObjectURL(downloadLink.href);
};
