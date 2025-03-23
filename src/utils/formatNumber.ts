function formatNumber(value: number | string): string {
    return Number(value).toLocaleString("pt-BR");
}

export default formatNumber;