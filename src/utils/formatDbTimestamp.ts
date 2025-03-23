function formatDbTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString("pt-BR"); 
}

export default formatDbTimestamp;